# Arena Props Data Platform Documentation

This folder defines the data that Arena Props needs, how candidate sources
are evaluated, and how accepted data is normalized and retained. It is the
working contract between product, frontend, backend, data engineering and
vendor procurement.

## The four documentation layers

1. [Frontend data requirements](frontend-data-requirements.md) defines every
   field or record that the current dashboard needs and its freshness,
   history, storage and licensing expectations.
2. [Source coverage matrix](source-coverage-matrix.md) is the evidence-backed
   vendor evaluation sheet. It maps requirement IDs to candidate providers,
   products, endpoints, plans, limits, rights and gaps.
3. [Canonical PostgreSQL database and ingestion specification](database-ingestion-spec.md)
   defines Arena Props IDs, sourced-fact provenance, normalized entities,
   market taxonomy, economic prop-state history, calculation reproducibility,
   ingestion behavior and serving views.
4. [Provider endpoint and field catalog](provider-endpoint-field-catalog.md)
   assigns source ownership and maps selected provider routes and fields to
   database storage, retention, refresh cadence and frontend consumers.

The earlier [data requirements and database outline](data-requirements-and-database-outline.md)
remains the product-scope overview. If it conflicts with one of the three
layer documents, the more specific layer document controls.

## Current status

| Layer | Status | Next gate |
| --- | --- | --- |
| Frontend requirements | Initial complete inventory from the current dashboard and player-screen specifications | Confirm launch-day versus later requirements |
| Source coverage | Evaluation structure complete; candidate claims are intentionally unverified | Research official BALLDONTLIE, The Odds API and media/context sources plan by plan |
| Canonical PostgreSQL and ingestion | Normative tables, invariants and state transitions defined | Validate sample payloads, then translate this contract into migrations |
| Provider endpoint/field catalog | Initial source-role decision and documented endpoint contract complete | Pin schemas, capture paid-plan fixtures and finish field-disposition manifests |

## Governing rules

- **Provider boundary:** the frontend consumes only Arena Props API/read-model
  contracts. Provider payload shapes, IDs, field names, enums and SDK types stop
  at typed provider adapters.
- **Three explicit mappings:** every enabled source has deterministic field,
  entity and market mappings. Runtime guessing and name-only publishing are
  forbidden.
- Arena Props owns its canonical IDs. No vendor ID is a primary key.
- Every external fact carries provider/product/record IDs, provider and
  ingestion timestamps, raw-payload ID and schema version.
- Every calculated value carries generation time, source cutoff, calculation
  version, market-definition version and eligibility version.
- Current odds are a projection of economic state history; identical polls
  advance `last_seen_at` without creating duplicate economic snapshots.
- `desired_retention` and `licensed_retention` are independent. Arena Props
  desires permanent prop history, but stores it permanently only after the
  provider contract explicitly permits that retention and derivative use.
- A provider is marked `YES` only when official documentation or a tested
  payload proves the required field, league, market, freshness and plan.
- Commercial display, caching, derived-data and historical-retention rights
  are separate evaluation fields from technical availability.

## Decision sequence

1. Confirm the launch requirement set and jurisdictions.
2. Evaluate candidate providers against the source coverage matrix.
3. Price low, expected and high request/stream volume for qualifying plans.
4. Test sample payloads against canonical identity and market mapping.
5. Select the smallest provider combination that closes the required gaps.
6. Turn the database specification into migrations and ingestion contracts.
