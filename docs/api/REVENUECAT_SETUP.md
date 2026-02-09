# RevenueCat Setup Guide

Complete setup guide for Nossa Maternidade subscriptions with RevenueCat.

## Prerequisites

- [ ] Apple Developer Account (App Store Connect access)
- [ ] Google Play Developer Account
- [ ] RevenueCat account (https://app.revenuecat.com)
- [ ] Supabase project configured

## 1. App Store Connect Setup (iOS)

### 1.1 Create Subscriptions

1. Go to **App Store Connect** → **My Apps** → **Nossa Maternidade**
2. Navigate to **Subscriptions** tab
3. Create a new **Subscription Group**: `Nossa Maternidade Premium`
4. Add subscriptions:

| Product ID                                  | Duration | Price     |
| ------------------------------------------- | -------- | --------- |
| `com.nossamaternidade.subscription.monthly` | 1 Month  | R$ 19,90  |
| `com.nossamaternidade.subscription.annual`  | 1 Year   | R$ 199,00 |

### 1.2 Configure Free Trial

1. Select the subscription
2. Go to **Subscription Prices**
3. Add **Introductory Offer**:
   - Type: Free Trial
   - Duration: 7 Days
   - Countries: Brazil (and others as needed)

### 1.3 Get Shared Secret

1. Go to **App Store Connect** → **Users and Access**
2. Navigate to **Integrations** → **In-App Purchase**
3. Click **Generate** to create a Shared Secret
4. Copy and save securely

## 2. Google Play Console Setup (Android)

### 2.1 Create Subscriptions

1. Go to **Google Play Console** → **Nossa Maternidade**
2. Navigate to **Monetize** → **Products** → **Subscriptions**
3. Create subscriptions:

| Product ID                                  | Base Plan    | Price          |
| ------------------------------------------- | ------------ | -------------- |
| `com.nossamaternidade.subscription.monthly` | monthly-plan | R$ 19,90/month |
| `com.nossamaternidade.subscription.annual`  | annual-plan  | R$ 199,00/year |

### 2.2 Add Free Trial

1. Select the subscription
2. Add **Offer**: Free trial
3. Duration: 7 days

### 2.3 Create Service Account

1. Go to **Google Cloud Console**
2. Create a new **Service Account** for your project
3. Grant role: **Pub/Sub Admin**
4. Create JSON key and download
5. In Play Console: **API Access** → Link the service account
6. Grant **Financial data** and **App information** permissions

## 3. RevenueCat Dashboard Setup

### 3.1 Create Project

1. Login to https://app.revenuecat.com
2. Create new project: **Nossa Maternidade**

### 3.2 Configure iOS

1. Go to **Projects** → **Nossa Maternidade** → **Apps**
2. Add **Apple App Store** app:
   - Bundle ID: `com.nossamaternidade.app`
   - App Store Connect App-Specific Shared Secret: (paste from step 1.3)
3. Click **Fetch products** to sync

### 3.3 Configure Android

1. Add **Google Play Store** app:
   - Package name: `com.nossamaternidade.app`
   - Service Account JSON: (upload from step 2.3)
2. Click **Fetch products** to sync

### 3.4 Create Entitlements

1. Go to **Entitlements**
2. Create entitlement: `premium`
3. Attach products:
   - `com.nossamaternidade.subscription.monthly`
   - `com.nossamaternidade.subscription.annual`

### 3.5 Create Offerings

1. Go to **Offerings**
2. Create offering: `default`
3. Add packages:
   - Monthly: `$rc_monthly` → `com.nossamaternidade.subscription.monthly`
   - Annual: `$rc_annual` → `com.nossamaternidade.subscription.annual`

### 3.6 Configure Webhook (CRITICAL)

1. Go to **Integrations** → **Webhooks**
2. Add webhook:
   ```
   URL: https://YOUR_PROJECT.supabase.co/functions/v1/webhook/revenuecat
   ```
3. Select events:
   - [x] Initial Purchase
   - [x] Renewal
   - [x] Cancellation
   - [x] Billing Issue
   - [x] Product Change
   - [x] Expiration
   - [x] Uncancellation
4. Copy the **Authorization header** value (this is your webhook secret)

### 3.7 Get API Keys

1. Go to **API Keys**
2. Copy:
   - **iOS Public API Key**
   - **Android Public API Key**

## 4. Environment Variables Setup

### 4.1 Local Development (.env.local)

```bash
# RevenueCat
EXPO_PUBLIC_REVENUECAT_IOS_KEY=appl_xxxxxxxxxxxxx
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=goog_xxxxxxxxxxxxx
```

### 4.2 Supabase Secrets

```bash
# Set via Supabase CLI or Dashboard
npx supabase secrets set REVENUECAT_WEBHOOK_SECRET=your_webhook_auth_header_value
```

### 4.3 EAS Secrets (for builds)

```bash
eas secret:create --name EXPO_PUBLIC_REVENUECAT_IOS_KEY --value "appl_xxx"
eas secret:create --name EXPO_PUBLIC_REVENUECAT_ANDROID_KEY --value "goog_xxx"
```

## 5. Database Setup

Run this SQL migration in Supabase:

```sql
-- Add subscription fields to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'none';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_product_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_store TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_updated_at TIMESTAMPTZ;

-- Create webhook_transactions table for audit
CREATE TABLE IF NOT EXISTS webhook_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  UNIQUE(source, event_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_webhook_transactions_event
  ON webhook_transactions(source, event_id);

CREATE INDEX IF NOT EXISTS idx_webhook_transactions_user
  ON webhook_transactions(user_id);

-- Enable RLS
ALTER TABLE webhook_transactions ENABLE ROW LEVEL SECURITY;

-- Admin-only access for webhook_transactions
CREATE POLICY "Service role only" ON webhook_transactions
  FOR ALL USING (auth.role() = 'service_role');
```

## 6. Deploy Webhook Function

```bash
# Deploy the webhook edge function
npx supabase functions deploy webhook --no-verify-jwt
```

## 7. Testing

### 7.1 Test Webhook

```bash
# Send test event from RevenueCat dashboard
# Go to Webhooks → Send Test Event → Select your webhook
```

### 7.2 Sandbox Testing

1. Create sandbox test account in App Store Connect
2. Sign out of App Store on device
3. Sign in with sandbox account when prompted
4. Test purchase flow in app

### 7.3 Verify in Supabase

```sql
-- Check webhook transactions
SELECT * FROM webhook_transactions ORDER BY created_at DESC LIMIT 10;

-- Check user premium status
SELECT user_id, is_premium, subscription_status, subscription_expires_at
FROM profiles WHERE is_premium = true;
```

## Troubleshooting

### Webhook not receiving events

1. Check Supabase function logs: `npx supabase functions logs webhook`
2. Verify webhook URL is correct (no trailing slash)
3. Check Authorization header matches `REVENUECAT_WEBHOOK_SECRET`

### Products not showing in app

1. Check RevenueCat dashboard → Products → Verify status is "Active"
2. Ensure entitlements are configured
3. Check API key is correct for platform

### Purchase failing

1. Check sandbox account is properly configured
2. Verify product IDs match exactly
3. Check RevenueCat logs for error details

## Checklist

- [ ] iOS subscriptions created in App Store Connect
- [ ] Android subscriptions created in Google Play Console
- [ ] RevenueCat project configured
- [ ] Shared Secret added to RevenueCat (iOS)
- [ ] Service Account JSON uploaded to RevenueCat (Android)
- [ ] Entitlement "premium" created
- [ ] Offering "default" created with packages
- [ ] Webhook configured with correct URL
- [ ] REVENUECAT_WEBHOOK_SECRET set in Supabase
- [ ] API keys added to environment variables
- [ ] Database migration run
- [ ] Webhook function deployed
- [ ] Test purchase completed in sandbox
