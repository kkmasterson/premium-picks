# Jurisdiction and Paid-Access Policy

## Decision status

**Status:** Approved rollout policy on `2026-08-27`; country enablement is a
pre-launch compliance task and does not block the NBA reference build.

This is an engineering and launch-control policy, not a legal opinion. Arena
Props will obtain qualified legal advice before enabling paid access in a
jurisdiction where the product classification is unclear.

## Product boundary that keeps rollout simpler

The initial product is a sports-data and analytics subscription. It does not:

- accept, place, transmit or settle wagers;
- hold gambling balances, deposits or withdrawals;
- charge contest entry fees or award cash/material prizes;
- log in to a sportsbook or place a bet on a user's behalf;
- guarantee profit or market the service as easy money; or
- receive sportsbook affiliate/revenue-share compensation without a separate
  legal, payment-processor and jurisdiction review.

Any change to those boundaries automatically reopens the jurisdiction review.
Merely linking or displaying a sportsbook does not authorize advertising or
affiliate activity in every region.

## Enablement rule

Paid access uses an explicit country/region allowlist. A jurisdiction may be
enabled only when all of the following are recorded:

1. The analytics-only feature set does not require a gambling/operator,
   supplier, affiliate or marketing license, or the required approval is easy
   enough to justify for expected demand.
2. Stripe has accepted the disclosed Arena Props business model and supports
   the customer jurisdiction.
3. Provider contracts permit display, caching and derived use in that region.
4. Sales/VAT/GST collection and filing are configured.
5. Privacy, consumer terms, cancellation/refund rules and age policy are ready.
6. Support and compliance work are proportionate to likely customers.

Defer a jurisdiction when it requires a local entity, gambling license,
specialized local infrastructure, recurring local filings beyond normal
digital-service tax/privacy compliance, or custom product behavior that is not
justified by demand.

## Initial rollout tiers

### Tier 1 — first paid candidate

- United States, analytics-only, with no sportsbook affiliate compensation.
- Obtain written Stripe confirmation for the exact subscription product before
  production checkout is enabled.
- Run a targeted legal classification review from the company's home state and
  expand state-by-state only where a specific feature or commercial relationship
  creates a supplier, advertising or affiliate question.

Arizona regulates event-wagering operators and suppliers, including some
marketing services provided to wagering businesses. Massachusetts also
regulates vendors used by operators and advertising performed for operator
benefit. Remaining independent from sportsbooks during the initial launch
reduces—not eliminates—the chance that those vendor rules apply.

### Tier 2 — demand-justified expansion

- Canada after GST/HST and privacy setup.
- United Kingdom after UK GDPR, consumer, advertising and any affiliate review.
- European Union/EEA only after GDPR and non-Union VAT OSS operations are ready.
- Other countries one at a time through the same evidence gate.

These regions are not technically difficult to geofence, but tax/privacy and
marketing compliance create ongoing work. Do not enable them merely because
Stripe can accept a card.

### Disabled by default

- Stripe's prohibited/high-risk jurisdictions and restricted persons.
- Japan for paid access through Stripe while the product remains gambling-advice
  adjacent; Stripe specifically lists consultation/advisory or prediction
  services related to online gaming or gambling as prohibited there.
- Any jurisdiction with unresolved gambling-product classification, tax,
  provider-rights or payment-processor approval.

## Required implementation controls

The backend owns jurisdiction decisions. Frontend hiding alone is insufficient.

Maintain versioned jurisdiction configuration with:

```text
country_code
region_code                 nullable
browsing_allowed
account_creation_allowed
paid_checkout_allowed
sportsbook_links_allowed
affiliate_marketing_allowed
minimum_age
decision_status
decision_reason
evidence_urls
reviewed_at
review_due_at
```

Checkout evaluates billing country, account country and a coarse IP-country
signal. Conflicts are denied or sent to review; precise sportsbook-grade
geolocation is not required while Arena Props remains analytics-only. Country
decisions must be changeable without deployment.

## Primary research references

- [Stripe prohibited and restricted businesses](https://stripe.com/legal/restricted-businesses)
- [Arizona event wagering and fantasy sports licensing](https://gaming.az.gov/ewfs/forms-licensing-fees)
- [Massachusetts sports wagering vendors](https://www.mass.gov/regulations/205-CMR-23400-sports-wagering-vendors)
- [Massachusetts sports wagering advertising regulation](https://www.mass.gov/doc/205-cmr-256-sports-wagering-advertising/download)
- [UK Gambling Commission affiliate guidance](https://www.gamblingcommission.gov.uk/licensees-and-businesses/guide/page/affiliates-or-third-parties)
- [UK GDPR territorial scope](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/personal-information-what-is-it/who-does-the-uk-gdpr-apply-to/)
- [EU GDPR territorial scope](https://commission.europa.eu/law/law-topic/data-protection/reform/rules-business-and-organisations/application-regulation/who-does-data-protection-law-apply_en)
- [EU VAT One Stop Shop](https://europa.eu/youreurope/business/finance-and-tax/vat/one-stop-shop/index_en.htm)
- [Canada digital-economy GST/HST](https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/digital-economy.html)
- [FTC children's privacy guidance](https://www.ftc.gov/news-events/topics/protecting-consumer-privacy-security/kids-privacy-coppa)
