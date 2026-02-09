# TypeScript Patterns

## Object is possibly 'null'

```typescript
// ❌ ERRADO
const name = user.profile.name;

// ✅ CERTO - Optional chaining
const name = user?.profile?.name;

// ✅ CERTO - Type guard
if (user && user.profile) {
  const name = user.profile.name;
}
```

## Type 'X' is not assignable to type 'Y'

```typescript
// ❌ ERRADO
const status: "active" | "inactive" = someString;

// ✅ CERTO - Type guard
const validStatuses = ["active", "inactive"] as const;
type Status = (typeof validStatuses)[number];

function isValidStatus(s: string): s is Status {
  return validStatuses.includes(s as Status);
}

if (isValidStatus(someString)) {
  const status: Status = someString; // OK
}
```

## Property 'X' does not exist

```typescript
// ❌ ERRADO
const data: unknown = await fetchData();
console.log(data.name);

// ✅ CERTO
interface User {
  name: string;
  email: string;
}

function isUser(obj: unknown): obj is User {
  return typeof obj === "object" && obj !== null && "name" in obj && "email" in obj;
}

if (isUser(data)) {
  console.log(data.name); // OK
}
```

## Implicit 'any'

```typescript
// ❌ ERRADO
function process(data) {
  return data.value;
}

// ✅ CERTO
interface DataWithValue {
  value: string;
}

function process(data: DataWithValue): string {
  return data.value;
}
```

## Error Handling

```typescript
// ❌ ERRADO
catch (error: any) {
  console.log(error.message);
}

// ✅ CERTO
catch (error) {
  if (error instanceof Error) {
    console.log(error.message);
  }
}
```

## Centralização de Tipos

```typescript
// src/types/user.ts
export interface User {
  id: string;
  email: string;
  profile: UserProfile | null;
}

// src/types/index.ts
export * from "./user";
```
