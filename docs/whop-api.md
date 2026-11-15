# Whop API — what this repo can reach

Notes from reading the published spec and probing the live API with the account
key in `.env.local`. Read-only probes only; the app record and permission
catalog below were captured against production on 2026-11-16.

- Spec: `https://api.whop.com/api/v1/openapi.json` (384 paths, 541 operations, 78 tags)
- Docs: `https://docs.whop.com/developer/` (the `.md` suffix on any page returns markdown)
- Current API is `/api/v1`. Pages under `/api-reference/legacy/` are the Legacy API.

## Credential types

| Credential | Acts as | Lives | Use when |
| --- | --- | --- | --- |
| Account API key | one account (and its subaccounts) | server | your backend acts for your own business |
| App API key | the app, across every account that installed it | server | you ship an installable Whop app |
| Account-scoped user token | one user inside one account | client, minted by server | users need Whop data without signing in |
| Account access token | the account, narrowed | client, minted by server | short-lived embedded access, no user |
| iframe user token | the user viewing your app | sent by Whop in `x-whop-user-token` | your app renders inside Whop |
| OAuth token | a user who signed in | server, after the code flow | Sign in with Whop |

`WHOP_API_KEY` in `.env.local` is an **Account API key on production** (the
sandbox rejects the same value). `/api/v2` and `/api/v5` reject it: those are
OAuth/user-token surfaces.

## What the key can do

Reads confirmed with real data: accounts (`me`, `/{id}`, `/fees`,
`/preferences`), companies/{id}, products, plans, payments, members,
memberships, people, experiences, forums, support_channels, authorized_users,
disputes, resolution_center_cases, refunds, invoices, payouts, payout_methods,
transfers, financial_activity, fee_markups, payment_rules, setup_intents,
trades, exports, domains, waitlist_entries, reviews, affiliates, bounties,
ad_campaigns, api_logs, apps, apps/{id}/logs, app_installations, app_builds,
webhooks.

Writes pass authorization (empty bodies fail on validation, not permission):
`POST /products`, `/plans`, `/promo_codes`, `/experiences`, `/webhooks`.

`GET /permissions?resource_id=<account_id>` reports 297 actions, 258 granted.
Denied: `user:*`, `bounty:submission:*`, `bounty:capture_clip:*`, most
`authorized_role:*`, `app_authorization:create|delete|update`,
`ad_pixel:manage`, `openid`, `profile`.

## What it cannot do

- `GET /companies` — "missing `company:basic:read`" (while `companies/{id}` works;
  the list endpoint appears to check a different actor).
- `GET /users*`, `/notifications` — user credentials only (`dms:read`, user session).
- `/experiments` — "requires Whop internal access".
- `/api_keys` — "resource type is not currently supported" for account keys.
- `/partners` — "Company API key is not authorized for the `partner:basic:read` scope."
- `/api/v2/*` (401), `/api/v5/*` (403), sandbox (401).

Every request is recorded in `GET /api_logs` with `api_key_id`, `ip_address`,
`user_agent`, `http_path` and `status_code`.

## App record (clipping-ai)

| Field | Value |
| --- | --- |
| id | `app_6jW0xj5SZr0jl8` |
| app_type / status | `b2c_app` / `hidden` |
| base_url | a `trycloudflare.com` tunnel (temporary) |
| domains / redirect_uris | none |
| required_scopes | `read_user` |
| experience_path | `/experiences/[experienceId]` |
| is_app_store_listed / marketplace_status | `false` / `not_available` |
| production builds | none |

Launch blockers, in order: deploy a permanent host, set `base_url` and a domain,
add OAuth redirect URIs, request only the scopes you use, create a
`whop apps deploy` build, install into a test company, wire a webhook endpoint
(`app_installations`, `app_payments`), then publish.

## Conventions used in this repo

- Direct REST calls live in `lib/bounties.ts` and `lib/creator.ts`; both send
  `Authorization: Bearer` and `Api-Version-Date` (default `2026-11-04-1`,
  overridable via `WHOP_API_VERSION_DATE`).
- Everything else goes through the SDK (`lib/whop-sdk.ts`), which pins its own version.
- Keep `WHOP_API_KEY` server-side. The value in `.env.local` was never committed
  (`.env*.local` is ignored); still, rotate it and move to a least-privilege
  custom permission set once the endpoint usage settles.
