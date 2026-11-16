# Upload-Post "included in your plan" — one-page plan

**Status:** blocked on a written reseller/white-label agreement with Upload-Post.
The code is ready behind `UPLOAD_POST_MANAGED_ENABLED` (off in production).

## 1. What we sell

Today publishing is BYOK: the user pastes their own Upload-Post key. Managed
mode instead gives each entitled Whop member a profile (`wa_<whop_user_id>`)
inside one shared Upload-Post account, so "connect your channels" just works.

## 2. Upload-Post cost (Oct 2026 prices)

| Plan | Monthly | Annual (per mo) | Profiles | Notes |
| --- | --- | --- | --- | --- |
| Free | $0 | $0 | 2 | no TikTok, 10 uploads/mo |
| **Basic** | **$24** | **$16** | 5 | unlimited uploads |
| Professional | $50 | $33 | 25 + white-label | agency model |
| Advanced | $147 | $118 | 75 | |
| Business | $438 | $350 | 225 (+$1/extra) | |

Profiles are *people*, each holding one account per network. The $16 rate is
**annual billing**; month-to-month Basic is $24.

## 3. Recommended retail price

**$19 / month**, annual optional. Rationale:

- undercuts buying Basic directly ($24/mo) while still enabling a margin;
- sits under the $24 psychological line for a "publishing included" add-on;
- matches the existing community price point.

**Mandatory:** bill the Upload-Post side **annually** or pool profiles — monthly
Basic at $24 against a $19 price loses $5/user/month.

## 4. Unit economics (your $19 price)

| Setup | Cost / user / mo | Gross margin | After Whop fee* |
| --- | --- | --- | --- |
| 1 Basic, monthly | $24.00 | −$5.00 | −$5.87 |
| 1 Basic, annual | $16.00 | $3.00 (16%) | $2.10 |
| Basic pooled (5 profiles) | $3.20 | $15.80 (83%) | $14.90 |
| Professional pooled (25, annual) | $1.32 | $17.68 (93%) | $16.78 |

\* Whop fee assumed ≈ 3% + $0.30; confirm in your dashboard.

**Pooling is the business case.** One Basic account (5 profiles) at ~$3.20/user
effective cost turns $19 into ~83% gross margin. At 5 profiles the shared
60 req/min API limit is far above a handful of clips/day per user.

## 5. Risks

- **Legal:** Upload-Post ToS forbids reselling API access or sharing keys
  without written permission. Do not enable until the agreement is signed.
- **Abuse:** pooled profiles share one rate limit; add per-profile throttling.
- **Churn:** Upload-Post has no `DELETE /users`; profiles are recycled by
  disconnecting and re-pointing, not deleted. Plan for profile reuse.
- **Disclosure:** list Upload-Post as a subprocessor in the privacy policy.

## 6. Launch checklist

1. Signed reseller/white-label agreement (`info@upload-post.com`).
2. Set `UPLOAD_POST_MANAGED_ENABLED=1`, `UPLOAD_POST_MANAGED_API_KEY`,
   and `UPLOAD_POST_ENTITLEMENT_EXPERIENCE_ID` (the paid experience) in Vercel.
3. Keep `UPLOAD_POST_MANAGED_PROFILE` **unset** so each user gets `wa_<id>`.
4. Verify token + access gating (already wired in `lib/upload-post-managed.ts`).
5. Smoke-test connect → post → analytics for one entitled and one
   non-entitled member.
6. Add Upload-Post to the subprocessor list and the pricing page.

**Alternative:** if the agreement stalls, the affiliate route (50% recurring on
$24 = $12/user/mo) out-earns the $3–15 bundled margin and needs no code.
