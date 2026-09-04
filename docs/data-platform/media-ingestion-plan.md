# Arena Media ingestion plan

## Decision

Use one provider-neutral **Arena Media** pipeline for player headshots, team
badges/logos and top-level sport icons. TheSportsDB is the first source adapter,
not the public contract and not an exclusive long-term vendor. Use the free V1
API during mockup and importer testing, then upgrade to paid V2 before real
users or a production coverage audit.

```text
TheSportsDB free V1 now, paid V2 later, or approved replacement
  -> provider-specific schema + canonical ID crosswalk
  -> media candidate (player_headshot | team_badge | team_logo | sport_icon)
  -> HTTPS allowlist + size/type validation + checksum
  -> private object while rights are pending
  -> rights approval + primary-asset selection
  -> public media bucket/CDN
  -> Arena Props API media object
  -> React image with initials/team-color or product-owned icon fallback
```

The frontend never renders a provider URL or provider ID. It receives only an
Arena Props media object or a deterministic fallback.

## Source fields for the first adapter

| Arena asset | TheSportsDB V1/V2 field | Preferred order | Transform policy |
| --- | --- | --- | --- |
| Player headshot | `strThumb`, then `strCutout` | Square thumb first; transparent cutout second | Proportional resize only after rights approval |
| Team badge | `strBadge` | Primary compact team mark | As-is; no crop, recolor or decorative modification |
| Team logo | `strLogo` | Secondary wordmark/logo | As-is; no crop, recolor or decorative modification |
| Navigation competition mark | League `strBadge` | Prefer the actual league or competition badge over a generic sport pictogram | Proportional resize after rights approval |

The provider documents JPEG artwork and transparent PNG logos, preview suffixes,
player/team lookup endpoints, and sport icon fields. Every field is nullable in
practice, so absence is an expected fallback state rather than an ingestion
failure.

## Rights gate

TheSportsDB's published terms allow paid API use for apps/services and require
source attribution. They also say trademarked sports logos must be used as-is,
third-party content requires permission or another legal basis, and player
artwork exposes `strCreativeCommons` for licensing review. Those statements are
not treated as blanket production approval for every NBA or multi-sport asset.

Provider mapping therefore creates `pending` records. Only a separate reviewed
decision may change an asset to `approved`. Public read models require:

1. `rights_status = approved`;
2. an imported object URI and CDN URL;
3. rights not expired;
4. the approved transform policy; and
5. required attribution.

Unknown, restricted, or expired media uses the existing initials/team-color
fallback. Product-owned sport icons are preferred when we want one consistent
visual family across all 12 roadmap sports.

## Storage and delivery

Use a dedicated Cloudflare R2 Standard media bucket or media prefix, separate
from the private raw-payload archive. Keep pending assets private. Approved
assets may be exposed through an Arena Props media domain; Cloudflare Images can
provide a small allowlisted set of proportional variants where the rights record
permits transformation.

Recommended first variants:

- `avatar-40`: 40 x 40 contain, player lists and prop rows;
- `avatar-80`: 80 x 80 contain, player headers and drawers;
- `mark-32`: 32 x 32 contain, compact team/sport filters; and
- `mark-64`: 64 x 64 contain, matchup and team surfaces.

Do not generate arbitrary transformation URLs. Fixed variants keep cache and
cost behavior predictable and prevent accidental logo alteration.

## Import behavior

The worker foundation in `server/worker/media-ingestion.ts`:

- accepts the same canonical candidate shape for all three owner types;
- accepts only HTTPS sources from an explicit host allowlist;
- refuses redirects, credentials, custom ports, unsupported raster types and
  files larger than the configured maximum;
- verifies PNG/JPEG/WebP file signatures instead of trusting extensions;
- computes a SHA-256 content address for idempotent object keys;
- keeps pending-rights objects private and suppresses their CDN URL; and
- exposes a public media contract only for approved assets.

`server/worker/thesportsdb-v1-client.ts` supplies the credential-free mockup
path. It uses the provider's published free key, validates numeric lookup IDs,
parses the limited V1 player/team/sport responses and reports HTTP 429 distinctly.
The production V2 client will feed the same mapper and importer contracts.

## NBA proof sequence

1. Use TheSportsDB's published free V1 key for limited local development,
   importer tests, fixture capture and mockups. Keep all calls behind the worker
   so the frontend contract does not change during the later V2 upgrade.
2. Capture a small free fixture set using V1 player/team lookup endpoints and
   the limited free sports list. Free result caps are acceptable for validating
   the pipeline but are not evidence of complete NBA coverage.
3. After mockups and importer testing are complete, upgrade to paid V2 before
   any real user can receive provider media.
4. At upgrade time, ask the provider in writing about commercial display, caching in R2,
   proportional resizing, retention after cancellation, attribution placement,
   takedowns, and NBA player/team artwork specifically.
5. Map one NBA team and its roster from canonical Arena Props IDs to
   TheSportsDB IDs. Never publish a name-only match.
6. Capture sanitized V2 fixtures for `/lookup/team/{id}`, the team player list,
   `/lookup/player/{id}`, and the sports list.
7. Run a paid-plan coverage audit: total rostered players, usable square thumbs, cutouts,
   team badges/logos, missing records, stale-team records, duplicate candidates,
   and Creative Commons tag distribution.
8. Import the approved sample to the staging media bucket and expose it through
   the Arena Props API.
9. Render one props row, player page and matchup card at phone and desktop widths;
   verify the fallback path by deliberately withholding one image.
10. Decide whether NBA coverage is sufficient. Add a second source adapter if it
   is not; do not change the public contract.

## Acceptance thresholds for the proof

- 100% of active NBA players resolve to either an approved headshot or the
  approved initials fallback.
- 100% of NBA teams resolve to an approved mark or a product-owned fallback.
- No browser request goes to a provider media hostname.
- No pending/restricted/expired asset appears in an API response.
- Re-importing identical bytes creates no duplicate public object.
- Provider IDs and raw field names remain inside the adapter and audit records.
- A rights takedown can disable one asset without a frontend deployment.

## Current blockers

- No real free-V1 NBA sample fixture has been captured yet.
- NBA and cross-sport coverage intentionally remain unmeasured until the paid
  upgrade before real users.
- Commercial caching/resizing/trademark permissions need written confirmation.
- R2 media bucket, media domain and Cloudflare Images variants are not yet
  provisioned.
