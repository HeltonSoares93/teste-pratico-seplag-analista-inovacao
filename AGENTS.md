# AGENTS.md - Teste Pratico Seplag (Analista de Inovacao)

Two independent apps in one repo, no root workspace or manifest. Run every
command from the relevant subdirectory.

`AGENTS.md` and `.opencode/rules/*.md` are written in English for model fidelity.
`README.md` and `AI_HANDOVER.md` stay in Portuguese for human readers. Portuguese
domain identifiers (`bairro`, `listarMedicamentos`, `PaginaResponse`) are
preserved everywhere.

## Layout
- `backend/backend-app` - Spring Boot 4.0.6 / Java 25, Maven wrapper. Package
  `dev.heltonsoares.backend_app` (underscore is intentional).
- `frontend/my-app` - React 19 + Vite 8 + react-bootstrap 2 (Bootstrap 5 CSS
  imported once in `src/main.jsx`).
- `README.md` = setup; `AI_HANDOVER.md` = architecture decisions; the PDF and
  `pdf_content.txt` are the challenge brief, not runtime input.

## Commands
Backend, from `backend/backend-app` (PowerShell):
- `.\mvnw clean install`
- `.\mvnw spring-boot:run` - serves on `http://localhost:8080`
- `.\mvnw test` - only `BackendAppApplicationTests`; use `-Dtest=...` for one class
- JDK 25 is required by `pom.xml`; do not switch the Boot or Java version.

Frontend, from `frontend/my-app`:
- `npm install`
- `npm run dev` - serves on `http://localhost:5173`
- `npm run lint` - only automated check (no test script, no typecheck)

Start the backend first: it does not accept requests until startup caches finish.

## Startup cache (critical)
Read `.opencode/rules/cache-ckan.md` before touching any `service/*Service.java`.

## API contract
- Routes: `/medicamentos`, `/usf`, `/usf/horarios`, `/sadt`, `/sadt/horarios`,
  `/udp`, `/dados-educacao-infantil-eja`.
- Table endpoints return `PaginaResponse<T>` = `{ dados, total, pagina,
  itensPorPagina, totalPaginas }`; `page` is 0-based, default `size=20`.
- Filtering, global sorting (`ordem=asc|desc`) and pagination all happen in memory
  inside services; controllers only expose `page`, `size` and optional filters.
- `/horarios` endpoints return distinct values used to populate filter dropdowns.

## Frontend quirks
- Components hardcode `http://localhost:8080/...`; no env var and no Vite proxy.
  Backend CORS is `@CrossOrigin(origins = "*")` per controller.
- Table screens request `size=20`; `Painel.jsx` deliberately requests
  `size=100000` because it reduces/aggregates the whole dataset client-side.
  Reducing this number silently corrupts every chart. Changing it requires
  understanding the aggregation logic and adding a test.
- Chart.js is injected from the jsDelivr CDN inside `Painel.jsx`, not installed
  via npm. Do not add it to `package.json` without replacing that loader.
- Routes live in `src/App.jsx`; `/` and `/sobre` both render `Sobre`.

## Conventions (see `AI_HANDOVER.md`)
- No emojis in any artifact produced by an agent: docs, commits, comments, test
  names, PR/spec text, or chat replies to the user.
- Stay on react-bootstrap + plain CSS; no Tailwind or another UI framework.
- Keep Portuguese domain/API names and UI text (`bairro`, `listarMedicamentos`).
- Do not delete or restructure existing files as "cleanup"; this is a graded
  technical challenge and existing behavior is considered validated.
- The short package root and flat package layout keep Windows paths under
  MAX_PATH. Do not reintroduce deeper package names.

## Agent roles
- **Orchestrator (Pro)**: plans, writes specs, reviews diffs. Reads this file
  and all rules under `.opencode/rules/`.
- **Implementer (Flash)**: receives a closed work packet; edits only `src/` and
  `pom.xml`/`package.json`; runs the verification contract below; replies
  `IMPL: ok` or `BLOCKED: <reason>`.

## Definition of done
A change is done only when:
- `.\mvnw test` passes from `backend/backend-app` (expect minutes, network
  required), OR
- for frontend-only changes: `npm run lint` passes from `frontend/my-app` AND
  the affected screen was exercised via `npm run dev` against a running backend.
- No command was run from the repo root.
- No file was deleted, moved, or "reorganized".
- If a route changed, both the controller and `src/App.jsx` were updated in the
  same change.

## Refusal contract
Stop and ask instead of guessing when:
- The task requires changing a REST contract, a route name, or a `PaginaResponse`
  field.
- The task touches the offset/stop loop in any of the five services.
- The task requires removing a dependency (JPA, H2, Chart.js CDN loader) or
  "cleaning up" a file.
- A build/test failure cannot be reproduced from the commands in this file.
- The task cannot be verified by `.\mvnw test`, `npm run lint`, or a manual curl
  against a running backend.

In those cases, reply with `BLOCKED: <reason>` and list the minimal info needed.
