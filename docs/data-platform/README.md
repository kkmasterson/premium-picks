# Premium Picks Data Platform Documentation

This folder defines the data that Premium Picks needs, how candidate sources
are evaluated, and how accepted data is normalized and retained. It is the
working contract between product, frontend, backend, data engineering and
vendor procurement.

## The three documentation layers

1. [Frontend data requirements](frontend-data-requirements.md) defines every
   field or record that the current dashboard needs and its freshness,
   history, storage and licensing expectations.
2. [Source coverage matrix](source-coverage-matrix.md) is the evidence-backed
   vendor evaluation sheet. It maps requirement IDs to candidate providers,
   products, endpoints, plans, limits, rights and gaps.
3. [Database and ingestion specification](database-ingestion-spec.md) defines
   Premium Picks canonical IDs, normalized entities, market taxonomy,
   append-only prop snapshots, ingestion behavior and serving views.

The earlier [data requirements and database outline](data-requirements-and-database-outline.md)
remains the product-scope overview. If it conflicts with one of the three
layer documents, the more specific layer document controls.

## Current status

| Layer | Status | Next gate |
| --- | --- | --- |
| Frontend requirements | Initial complete inventory from the current dashboard and player-screen specifications | Confirm launch-day versus later requirements |
| Source coverage | Evaluation structure complete; candidate claims are intentionally unverified | Research official BALLDONTLIE, The Odds API and media/context sources plan by plan |
| Database and ingestion | First normative architecture complete | Validate sample provider payloads and write migrations after sources are selected |

## Governing rules

- Premium Picks owns its canonical IDs. No vendor ID is a primary key.
- Every external fact retains provider provenance and source timestamps.
- Every calculated value retains calculation/model version and input cutoff.
- Current odds are a projection of append-only history; they do not replace it.
- `prop_snapshots` is a permanent proprietary history, subject to vendor rights.
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

