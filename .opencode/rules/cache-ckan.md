# Rule: CKAN startup cache

Loaded when the agent is about to edit any `service/*Service.java`
(Medicamento, Usf, Sadt, Udp, EducacaoInfantilEja) or when reasoning about
dataset completeness.

## How it works
- On `@PostConstruct`, each `service/*Service.java` downloads the full CKAN
  resource from `https://dados.recife.pe.gov.br` into an in-memory `ArrayList`.
- There is no database. JPA/H2 deps are present but unused.
- CKAN silently caps any response at ~500 records regardless of requested
  `limit`.

## Hard constraints
- Keep `offset += lote.size();` and the `if (lote.isEmpty())` stop condition in
  all five services. Replacing them with `offset += limit` or a total-count loop
  truncates datasets (Medicamentos has ~40k rows) without erroring.
- `.\mvnw test` boots the full context, so it performs the same live download:
  expect minutes and a working network. No mocks/fixtures exist.
- Do not introduce caching backends (Redis, Caffeine, Spring Cache), databases,
  or scheduled refresh jobs without an approved spec. The in-memory list is a
  deliberate architectural choice to work around CKAN rate limits.

## Landmines
- Refactoring the pagination loop "for clarity" is a regression.
- Removing the JPA/H2 deps because they are "unused" is a regression.
- Adding a total-count based loop will silently drop records.
