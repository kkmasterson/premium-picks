# Infrastructure Options and Cost Recommendation

## Recommendation summary

Use the following combination for Arena Props:

- Vercel for the existing React/Vite frontend.
- Render for one Node.js API and one independent Node.js background worker.
- Supabase Pro for PostgreSQL and the durable PostgreSQL-native queue.
- In-process API caching plus a PostgreSQL generation table initially; Upstash
  Fixed 250 MB only when horizontal API scaling requires shared coordination.
- Cloudflare R2 Standard for private, lifecycle-managed provider payloads.
- Clerk Pro for production authentication and MFA recovery.
- Stripe directly for subscriptions, payments, coupons and promotion codes.
- Sentry for application errors/traces, starting free and moving to Team when
  quotas or additional maintainers require it.

This package is recommended, not purchased. Prices were researched from
official vendor pages on `2026-08-27` and should be rechecked immediately before
purchase.

## Evaluated packages

| Package | Strengths | Material weaknesses | Result |
| --- | --- | --- | --- |
| Recommended managed stack | Production-shaped, low proof cost, native long-running worker, durable queue separated from cache, native auth backup codes and automatic raw-object lifecycle | More vendor accounts; cache and app compute do not have launch SLA on the lean plans | **Recommend** |
| Supabase Auth variant | One fewer auth vendor and auth included in the database plan | No recovery codes; production SMTP required; Arena Props would otherwise own recovery logic | Keep only as a fallback if backup codes are explicitly dropped |
| Render-consolidated data stack | Compute, PostgreSQL and Redis under one control plane | Still needs external auth and object storage; moves away from already documented Supabase queue/storage contracts without reducing enough risk | Do not select for NBA proof |
| AWS-first stack | Maximum control, service depth and mature redundancy options | Highest setup/operations burden for a one-month proof; more IAM, networking and infrastructure-as-code work before product proof | Defer until measured need |

## Official price snapshot

| Service | Relevant current price/allowance | Official source |
| --- | --- | --- |
| Vercel Pro | $20/month platform fee, one deploying seat, $20 usage credit | [Vercel Pro plan](https://vercel.com/docs/plans/pro-plan) |
| Render compute | Starter 0.5 CPU/512 MB starts at $7/month; Standard 1 CPU/2 GB is $25/month; Hobby workspace $0 and Pro workspace $25/month | [Render instance types](https://render.com/docs/compute-plans), [Render current cost guide](https://render.com/articles/how-much-does-cloud-application-hosting-cost-for-small-businesses) |
| Supabase Pro | $25/month, including $10 compute credit; Micro $10, Small $15, Medium $60; Pro includes 100,000 MAU, 8 GB database, daily seven-day backups and 100 GB object storage | [Supabase pricing](https://supabase.com/pricing), [compute usage](https://supabase.com/docs/guides/platform/manage-your-usage/compute) |
| Supabase PITR | Seven days approximately $100/month per project | [PITR pricing](https://supabase.com/docs/guides/platform/manage-your-usage/point-in-time-recovery) |
| Upstash Redis | Fixed 250 MB $10/month, 50 GB bandwidth, unlimited commands up to 10,000/second; Prod Pack adds $200/month | [Upstash Redis pricing](https://upstash.com/pricing/redis) |
| Cloudflare R2 | Standard: 10 GB-month, 1 million Class A and 10 million Class B operations free; then $0.015/GB-month and no egress fee | [R2 pricing](https://developers.cloudflare.com/r2/pricing/), [object lifecycle rules](https://developers.cloudflare.com/r2/buckets/object-lifecycles/) |
| Clerk | Development instances can test Pro features; production Pro is $25/month monthly or $20/month billed annually, including 50,000 retained users and MFA | [Clerk pricing](https://clerk.com/pricing), [MFA recovery](https://clerk.com/docs/guides/secure/mfa-recovery) |
| Sentry | Developer $0 for one user; Team $26/month with 50,000 errors and 5 million spans included | [Sentry pricing](https://sentry.io/pricing/) |
| Stripe | Standard domestic cards 2.9% + $0.30 per successful transaction; Stripe Billing pay-as-you-go adds 0.7% of billing volume | [Stripe pricing](https://stripe.com/pricing) |

Taxes, domain registration, legal/compliance work, international payment fees,
provider overages and sales-tax automation are excluded.

## Monthly cost scenarios

### Scenario A — one-month internal NBA proof

This is the recommended purchase ceiling while building the first complete
provider-to-screen path. Vercel Hobby and Clerk development are private/internal
development tools only, not the commercial launch configuration.

| Item | Monthly estimate |
| --- | ---: |
| BALLDONTLIE NBA GOAT | $39.99 |
| The Odds API 100K proof plan | $59.00 |
| TheSportsDB allowance | $20.00 |
| Supabase Pro with one Micro project after compute credit | $25.00 |
| Render Starter API | $7.00 |
| Render Starter worker | $7.00 |
| Vercel Hobby/private proof | $0.00 |
| Clerk development instance | $0.00 |
| Cloudflare R2 within free allowance | $0.00 |
| Sentry Developer | $0.00 |
| Stripe before live transactions | $0.00 |
| **Estimated fixed total** | **$157.99/month** |

The data-provider subtotal is $118.99 and the platform subtotal is $39.00.
Staging Render services should remain suspended except during shared testing;
their prorated use is a small variable not included above.

The final NBA Phase 7 capacity-test month temporarily moves the API and worker
to Standard and PostgreSQL to Small. With no optional Upstash/Sentry upgrades,
that month is approximately **$198.99 total**: $118.99 providers plus an $80
platform. It remains an internal proof configuration, not public launch.

### Scenario B — all-12-sport prelaunch expansion

NBA completion does not authorize public launch. After NBA proves the system,
Arena Props repeats the provider, schema, rights and operational gates for the
other 11 roadmap competitions. This scenario is an internal prelaunch platform
budget; provider subscriptions are deliberately separate because their
multi-sport cost is expected to exceed $500/month and must be measured in Phase
8.

| Item | Monthly estimate |
| --- | ---: |
| Multi-sport data providers | Separate Phase 8 budget; owner expects $500+/month |
| Vercel private preview / Pro if required | $0.00–$20.00 |
| Render Standard API | $25.00 |
| Render Standard worker | $25.00 |
| Supabase Pro with one Small project after compute credit | $30.00 |
| Upstash Fixed 250 MB, only if horizontally scaled | $0.00–$10.00 |
| Clerk development instance before public launch | $0.00 |
| Sentry Developer | $0.00 |
| Cloudflare R2 | $0.00–$5.00 |
| **Estimated platform total, excluding providers** | **$80.00–$115.00/month** |

With $500/month of provider access, the combined prelaunch planning floor would
be approximately $580–$615/month. The provider portion—not web concurrency—is
expected to dominate the prelaunch budget.

### Scenario C — public launch for 500–1,000 simultaneous users

Public launch remains blocked until all 12 roadmap competitions have passed
their Phase 8 gates and the separate launch manifest is approved. The initial
public capacity target is 500 simultaneous active users with a tested ceiling
of 1,000. The services retain an upgrade path to 5,000 concurrent users, but we
do not provision or pay for that future level before traffic evidence exists.

| Item | Monthly estimate |
| --- | ---: |
| Multi-sport data providers | Separate budget; expected $500+/month |
| Vercel Pro | $20.00 |
| One Render Standard API | $25.00 |
| One Render Standard worker | $25.00 |
| Supabase Pro with one Small project after compute credit | $30.00 |
| Upstash Fixed 250 MB if load tests require it | $0.00–$10.00 |
| Clerk Pro | $25.00 |
| Sentry Developer / Team if quota or staffing requires it | $0.00–$26.00 |
| Cloudflare R2 | $0.00–$5.00 |
| Render outbound bandwidth above allowance | $0.00–$15.00 |
| **Estimated platform total, excluding providers** | **$125.00–$181.00/month** |

At $500/month of provider access, the combined public-launch planning range is
approximately $625–$681/month. Provider plans remain the largest expense. PITR,
duplicate API/worker instances, Render autoscaling and Upstash Prod Pack are not
included; each requires measured load or recovery evidence and separate owner
approval.

## Traffic and cache cost model

| Active behavior | HTTP request rate | Monthly response volume assumption |
| --- | ---: | ---: |
| 300 active users, 60-second refresh | 5 RPS | 3.24 million responses at six live hours/day |
| 300 active users, 30-second refresh | 10 RPS | 6.48 million responses at six live hours/day |
| 500 active users, 30-second refresh | 17 RPS | 10.8 million responses at six live hours/day |
| 1,000 active users, 30-second refresh | 33 RPS | 21.6 million responses at six live hours/day |
| Future 5,000 active users, 30-second refresh | 167 RPS | 108 million responses at six live hours/day |

At 3 KB compressed per changed response, 1,000 active users at the hottest
cadence produce approximately 64.8 GB/month before `ETag`/`304` savings. One
Standard API should be load-tested against that 33-RPS workload before another
instance or Upstash is purchased. The future 5,000-user row proves the design
has a scale path; it is not the launch bill or launch acceptance target.

## Stripe variable-fee formula

Because subscription price is intentionally deferred, Stripe cost should be
modeled as a formula rather than a made-up fixed total. For `N` successful
domestic-card subscription payments at price `P`:

```text
estimated Stripe payment + Billing fees
= N * ((0.029 * P) + 0.30 + (0.007 * P))
= N * ((0.036 * P) + 0.30)
```

This excludes international-card, currency-conversion, dispute, refund and
Stripe Tax fees. Promotion codes reduce the charged Billing volume and revenue;
they must be included in the final unit-economics model.

## Purchase and upgrade sequence

1. Approve this vendor combination and the $157.99 internal-proof ceiling. Do
   not buy anything merely to approve the architecture.
2. Create free/local development instances and implement Phase 2 using fixtures.
3. Buy Supabase Pro, the data-provider proof plans/allowances and two Render
   Starter services only when the matching integration work is ready to begin.
4. Create R2, Clerk development, Stripe test mode and Sentry Developer without
   paid production upgrades.
5. After NBA passes its proof gates, add the remaining 11 competitions one at a
   time. Keep the platform lean while provider costs grow and measure the actual
   ingestion/database load after each addition.
6. Before the final all-12-sport load test, move Render to Standard and
   PostgreSQL to Small. Add Upstash only when multiple API instances or measured
   cache-coordination needs justify it.
7. Before paid public access, move Vercel and Clerk to Pro. Enable Sentry Team,
   PITR or redundant compute only if staffing, quota, recovery or load evidence
   justifies them.

## Approval requested

The owner needs to approve two linked decisions:

1. Use Vercel + Render + Supabase PostgreSQL/Queues + optional Upstash +
   Cloudflare R2 + Clerk + Stripe + Sentry as the Phase 1 service combination.
2. Permit up to **$157.99/month** in fixed NBA-proof subscriptions when each
   service is actually needed, with no all-sport, PITR, autoscaling, cache-HA or
   high-volume upgrades without a later explicit approval.

Approval locks architecture and spending permission; it does not require every
subscription to be purchased immediately.
