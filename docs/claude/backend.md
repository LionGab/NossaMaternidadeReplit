# Backend Documentation

> Nossa Maternidade — Supabase Backend

---

## Overview

- **Provider**: Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- **Project ID**: `lqahkqfpynypbmhtffyi`
- **Region**: South America (São Paulo)
- **RLS**: Enabled on ALL tables

---

## Edge Functions

### Inventory (12 functions)

| Function           | Purpose                        | Auth Required  |
| ------------------ | ------------------------------ | -------------- |
| `ai`               | NathIA chat (Gemini 2.0 Flash) | Yes            |
| `transcribe`       | Audio to text (Whisper)        | Yes            |
| `upload-image`     | Image upload to storage        | Yes            |
| `notifications`    | Push notification sender       | Yes            |
| `delete-account`   | LGPD account deletion          | Yes            |
| `export-data`      | LGPD data export               | Yes            |
| `analytics`        | Event tracking                 | Yes            |
| `elevenlabs-tts`   | Text to speech                 | Yes            |
| `moderate-content` | Content moderation             | Yes            |
| `webhook`          | RevenueCat webhook             | No (signature) |
| `community-feed`   | Community feed aggregation     | Yes            |
| `process-image`    | Image processing               | Yes            |

### Deploy Commands

```bash
# Deploy all
npm run deploy-functions

# Deploy single function
npx supabase functions deploy ai
npx supabase functions deploy transcribe
npx supabase functions deploy webhook
```

### AI Function (`supabase/functions/ai/index.ts`)

```typescript
// Request
POST /functions/v1/ai
Authorization: Bearer <user_jwt>
Content-Type: application/json

{
  "message": "Olá, estou ansiosa hoje",
  "conversationId": "uuid",
  "context": {
    "stage": "pregnant",
    "week": 28,
    "concerns": ["ansiedade", "sono"]
  }
}

// Response
{
  "data": {
    "response": "Olá! Entendo que a ansiedade...",
    "conversationId": "uuid",
    "messageId": "uuid"
  },
  "error": null
}
```

### Webhook Function (`supabase/functions/webhook/index.ts`)

```typescript
// RevenueCat webhook
POST /functions/v1/webhook
X-Revenuecat-Signature: <hmac_signature>

{
  "event": {
    "type": "INITIAL_PURCHASE",
    "app_user_id": "user_uuid",
    "product_id": "nossa_maternidade_monthly",
    "entitlements": ["premium"]
  }
}
```

---

## Database Schema

### Core Tables

#### `profiles`

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  stage TEXT, -- 'trying', 'pregnant', 'postpartum'
  due_date DATE,
  baby_birth_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `user_onboarding`

```sql
CREATE TABLE user_onboarding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  step TEXT,
  data JSONB,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Community Tables

#### `community_posts`

```sql
CREATE TABLE community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES auth.users(id),
  content TEXT NOT NULL,
  image_url TEXT,
  video_url TEXT,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  group_id UUID REFERENCES community_groups(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `community_comments`

```sql
CREATE TABLE community_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `post_likes`

```sql
CREATE TABLE post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);
```

#### `community_groups`

```sql
CREATE TABLE community_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  category TEXT,
  member_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Chat Tables

#### `chat_conversations`

```sql
CREATE TABLE chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `chat_messages`

```sql
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES chat_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL, -- 'user', 'assistant'
  content TEXT NOT NULL,
  image_url TEXT,
  image_analysis TEXT,
  audio_url TEXT,
  audio_duration_seconds INTEGER,
  transcription TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Cycle Tables

#### `cycle_settings`

```sql
CREATE TABLE cycle_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  cycle_length INTEGER DEFAULT 28,
  period_length INTEGER DEFAULT 5,
  last_period_date DATE,
  tracking_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `daily_logs`

```sql
CREATE TABLE daily_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  date DATE NOT NULL,
  is_period BOOLEAN DEFAULT false,
  flow TEXT, -- 'light', 'medium', 'heavy'
  symptoms TEXT[], -- array
  mood TEXT[], -- array
  notes TEXT,
  temperature DECIMAL,
  sleep_hours INTEGER,
  water_glasses INTEGER,
  exercise BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);
```

### Habits Tables

#### `habits`

```sql
CREATE TABLE habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  description TEXT,
  frequency TEXT, -- 'daily', 'weekly'
  target_count INTEGER DEFAULT 1,
  icon TEXT,
  color TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `habit_logs`

```sql
CREATE TABLE habit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id UUID REFERENCES habits(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  date DATE NOT NULL,
  completed_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(habit_id, date)
);
```

---

## Row Level Security (RLS)

### Policy Patterns

#### User's own data

```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Select: user can read own data
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Insert: user can insert own data
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Update: user can update own data
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Delete: user can delete own data
CREATE POLICY "Users can delete own profile"
  ON profiles FOR DELETE
  USING (auth.uid() = id);
```

#### Community content (public read, own write)

```sql
-- Enable RLS
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

-- Select: anyone can read approved posts
CREATE POLICY "Anyone can read approved posts"
  ON community_posts FOR SELECT
  USING (status = 'approved');

-- Insert: authenticated users can create
CREATE POLICY "Authenticated users can create posts"
  ON community_posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- Update: only author can update
CREATE POLICY "Authors can update own posts"
  ON community_posts FOR UPDATE
  USING (auth.uid() = author_id);

-- Delete: only author can delete
CREATE POLICY "Authors can delete own posts"
  ON community_posts FOR DELETE
  USING (auth.uid() = author_id);
```

### Verify RLS

```sql
-- Check RLS enabled
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- Check policies
SELECT tablename, policyname, cmd, qual
FROM pg_policies
WHERE schemaname = 'public';
```

### Critical Tables (must have RLS)

- `profiles`
- `user_onboarding`
- `community_posts`
- `community_comments`
- `post_likes`
- `chat_conversations`
- `chat_messages`
- `cycle_settings`
- `daily_logs`
- `habits`
- `habit_logs`

---

## Storage Buckets

### Buckets

| Bucket        | Public | Purpose               |
| ------------- | ------ | --------------------- |
| `avatars`     | Yes    | User profile pictures |
| `posts`       | Yes    | Community post images |
| `chat-images` | No     | Chat uploaded images  |
| `audio`       | No     | Voice messages        |

### Upload Example

```typescript
// Upload avatar
const { data, error } = await supabase.storage
  .from("avatars")
  .upload(`${userId}/avatar.jpg`, file, {
    contentType: "image/jpeg",
    upsert: true,
  });

// Get public URL
const {
  data: { publicUrl },
} = supabase.storage.from("avatars").getPublicUrl(`${userId}/avatar.jpg`);
```

---

## Authentication

### Providers

- Email/Password (default)
- Google OAuth
- Apple Sign In (iOS)

### Auth Config

```typescript
// src/api/supabase.ts
export const supabase = createClient<Database>(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
```

### Auth Flow

```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email,
  password,
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});

// Sign in with Google
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: "google",
});

// Sign out
await supabase.auth.signOut();

// Get session
const {
  data: { session },
} = await supabase.auth.getSession();

// Listen to auth changes
supabase.auth.onAuthStateChange((event, session) => {
  // Handle auth state
});
```

---

## Type Generation

### Command

```bash
npm run generate-types
```

### Script (`scripts/generate-supabase-types.sh`)

```bash
#!/bin/bash
npx supabase gen types typescript \
  --project-id lqahkqfpynypbmhtffyi \
  > src/types/supabase.ts
```

### Usage

```typescript
import { Database } from "@/types/supabase";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type PostInsert = Database["public"]["Tables"]["community_posts"]["Insert"];
```

---

## Realtime

### Subscriptions

```typescript
// Subscribe to posts
const channel = supabase
  .channel("public:community_posts")
  .on("postgres_changes", { event: "*", schema: "public", table: "community_posts" }, (payload) => {
    console.log("Change:", payload);
  })
  .subscribe();

// Unsubscribe
supabase.removeChannel(channel);
```

---

## LGPD Compliance

### Data Export

```typescript
// Request data export
POST /functions/v1/export-data
Authorization: Bearer <user_jwt>

// Returns all user data as JSON
{
  "profile": { ... },
  "posts": [ ... ],
  "messages": [ ... ],
  "logs": [ ... ]
}
```

### Account Deletion

```typescript
// Request account deletion
POST / functions / v1 / delete -account;
Authorization: Bearer<user_jwt>;

// Deletes:
// 1. All user data from all tables
// 2. Files from storage
// 3. Auth account
```

---

## Environment Variables

### Supabase

```bash
# Public (client-side)
EXPO_PUBLIC_SUPABASE_URL=https://lqahkqfpynypbmhtffyi.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL=https://lqahkqfpynypbmhtffyi.supabase.co/functions/v1

# Private (server-side / EAS secrets)
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### Edge Function Secrets

```bash
# Set via Supabase CLI
npx supabase secrets set GEMINI_API_KEY=xxx
npx supabase secrets set OPENAI_API_KEY=xxx
npx supabase secrets set ELEVENLABS_API_KEY=xxx
npx supabase secrets set REVENUECAT_WEBHOOK_SECRET=xxx
```
