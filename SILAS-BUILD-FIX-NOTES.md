# Rise Financial Website — Build Fix Notes

## Issue 1: Missing TipTap Package Version

Railway builds were failing at the `npm ci` step with:

```
npm error code ETARGET
npm error notarget No matching version found for @tiptap/extensions@^2.0.0.
```

**Root cause:** Two problems combined:

1. `@tiptap/extensions` version `3.0.0` was never published to npm (first stable is `3.0.1`), so `^3.0.0` couldn't resolve.
2. `package-lock.json` was out of sync with `package.json` — missing entries for TipTap, Supabase, Resend, sharp, zod, next-auth, and date-fns.

**Fix:** Removed all 4 TipTap packages from `package.json` — none are imported or used anywhere in the codebase. Regenerated `package-lock.json` to include all actual dependencies.

## Issue 2: Redundant `npm ci` in Build Phase

After fixing Issue 1, builds failed with:

```
npm error code EBUSY
npm error EBUSY: resource busy or locked, rmdir '/app/node_modules/.cache'
```

**Root cause:** `railway.json` had `"buildCommand": "npm ci && npm run build"`, but Nixpacks already runs `npm ci` in its own install phase (stage 6). The second `npm ci` in the build phase tried to wipe `node_modules/.cache`, which is locked by a Docker cache mount volume.

**Fix:** Changed `railway.json` build command to just `"npm run build"`. Nixpacks handles install separately.

## Issue 3: Missing `@supabase/ssr` Dependency

After fixing Issues 1 & 2, `next build` failed with:

```
Module not found: Can't resolve '@supabase/ssr'
```

**Root cause:** 7 source files import from `@supabase/ssr` (middleware, auth routes, supabase client/server helpers) but the package was never added to `package.json`.

**Fix:** Added `"@supabase/ssr": "^0.5.2"` to dependencies.

## Issue 4: Untyped Supabase SSR Cookie Handlers

After fixing Issue 3, `next build` compiled webpack successfully but failed during TypeScript type checking:

```
Type error: Parameter 'cookiesToSet' implicitly has an 'any' type.
```

**Root cause:** All 6 files using `createServerClient` from `@supabase/ssr` had untyped `cookiesToSet` parameters in their cookie handler callbacks. TypeScript strict mode (noImplicitAny) rejects this. Also, `lib/supabase/server.ts` imported `serialize` from `@supabase/ssr` which doesn't exist.

**Fix:** Added explicit type annotations to all 6 files:
```typescript
setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
```
Removed the unused `serialize` import.

**Files fixed:**
- `app/api/auth/login/route.ts`
- `app/api/auth/logout/route.ts`
- `app/api/auth/me/route.ts`
- `lib/auth/session.ts`
- `lib/supabase/server.ts`
- `middleware.ts`

## Issue 5 (Potential): Node.js Version Mismatch

Railway is building with **Node 18**, but `@supabase/supabase-js@2.98.0` and its sub-packages require **Node >= 20**. These are warnings for now, not errors, but could cause runtime issues. If problems arise, add this to `package.json`:

```json
"engines": {
  "node": ">=20"
}
```

This tells Nixpacks to use Node 20+ for the build.

## Guidelines Going Forward

- **Don't add dependencies to `package.json` until you're ready to use them.** Unused deps create build risks and bloat.
- **Always run `npm install` after editing `package.json`** to keep the lock file in sync. Railway uses `npm ci` which requires an exact match between the two files.
- **Don't put `npm ci` in `railway.json` `buildCommand`.** Nixpacks handles install automatically. The build command should only be `npm run build`.
- **Always add type annotations to callback parameters.** TypeScript strict mode is enabled — no implicit `any`.
- **Don't import things you're not using.** The `serialize` import from `@supabase/ssr` doesn't exist and would have caused a build failure.
- **When you're ready to add TipTap**, use these versions (confirmed working):
  ```
  "@tiptap/react": "^3.0.0",
  "@tiptap/pm": "^3.0.0",
  "@tiptap/starter-kit": "^3.0.0",
  "@tiptap/extensions": "^3.0.1"
  ```
  Note: `@tiptap/extensions` starts at `3.0.1`, not `3.0.0`.
- **Test builds locally with `npx tsc --noEmit && npm run build`** before pushing — this catches both TypeScript and webpack errors before Railway sees them.
