# Shared Context - API Contract Adaptation

**Increment**: `api-contract-adaptation`
**Status**: `decomposition-complete`
**Fecha**: 2026-06-01
**Owner**: planner

---

## Current status

`decomposition-complete` - Task Decomposer ha creado el task board con 37 tareas atómicas (T01-T37). Pendiente de ejecución por Executor.

---

## Canonical artifacts

| Artefacto | Ruta Absoluta | Estado |
|---|---|---|
| Requirements Brief | `/home/cristiansrc/Documentos/Proyectos/hv-workspace/projects/hv-rt-fr-admin/docs/specs/requirements/api-contract-adaptation-requirements-brief.md` | ✅ Existente, status `ready-for-planner` |
| Delta Spec | `/home/cristiansrc/Documentos/Proyectos/hv-workspace/projects/hv-rt-fr-admin/docs/specs/increments/001-api-contract-adaptation.md` | ✅ Creado, status `draft` |
| OpenAPI Backend Go | `/home/cristiansrc/Documentos/Proyectos/hv-workspace/projects/hv-go-ms-resume/api/openapi.yaml` | ✅ Existente, 3859 líneas, v2.0.0 |
| Shared Context | `/home/cristiansrc/Documentos/Proyectos/hv-workspace/projects/hv-rt-fr-admin/docs/specs/.working/api-contract-adaptation-sdd-context.md` | ✅ Este archivo |
| Workspace Changes | `/home/cristiansrc/Documentos/Proyectos/hv-workspace/docs/specs/workspace_changes.md` | ✅ Leído, sin cambios que afecten este incremento |
| Technical Debt Global | `/home/cristiansrc/Documentos/Proyectos/hv-workspace/docs/specs/technical_debt.md` | ✅ Leído, sin deuda que afecte este incremento |
| Graph Report | `/home/cristiansrc/Documentos/Proyectos/hv-workspace/graphify-out/GRAPH_REPORT.md` | ✅ Leído, Admin Panel en Community 0 |
| Validation Report | `/home/cristiansrc/Documentos/Proyectos/hv-workspace/projects/hv-rt-fr-admin/docs/specs/.working/api-contract-adaptation-validation-report.md` | ✅ Creado por spec-validator, `changes-required` |

### Código existente verificado

| Archivo | Ruta | Propósito |
|---|---|---|
| apiConfig.ts | `src/api/apiConfig.ts` | Exporta `API_URL` desde `VITE_API_URL` |
| axiosClient.ts | `src/api/axiosClient.ts` | Axios con baseURL=API_URL, interceptor JWT + error redirect |
| authProvider.ts | `src/api/authProvider.ts` | Login con `${API_URL}/login`, Altcha |
| useAltcha.ts | `src/hooks/useAltcha.ts` | Challenge desde `${API_URL}/public/challenge` |
| App.tsx | `src/App.tsx` | Refine setup, dataProvider con `simple-rest` |
| experienceProvider.ts | `src/api/experienceProvider.ts` | Patrón de provider CRUD (referencia) |
| ExperiencePage.tsx | `src/pages/experience/ExperiencePage.tsx` | Patrón de página CRUD (referencia) |
| index.ts (api) | `src/api/index.ts` | Barrel exports de todos los providers |

---

## Artifact evidence

### E1: VITE_API_URL como estrategia de prefijo
- **Fuente**: `src/api/apiConfig.ts` línea 1: `export const API_URL = import.meta.env.VITE_API_URL ?? "";`
- **Evidencia**: `API_URL` se usa como baseURL en `axiosClient.ts` (línea 6), como prefijo en `authProvider.ts` (línea 42: `${API_URL}/login`), y en `useAltcha.ts` (línea 30: `${API_URL}/public/challenge`).
- **Resultado**: Cambiar `VITE_API_URL` para incluir `/v1/ms-resume` adapta automáticamente todos los consumidores.
- **Estado**: `pass`

### E2: Endpoints existentes usan rutas relativas
- **Fuente**: `src/api/experienceProvider.ts` línea 7: `const EXPERIENCE_ENDPOINT = "/experience";`
- **Fuente**: `src/api/blogProvider.ts` línea 8: `const BLOG_ENDPOINT = "/blog";`
- **Fuente**: `src/api/basicDataProvider.ts` línea 11: `const BASIC_DATA_ENDPOINT = \`/${BASIC_DATA_RESOURCE}/${BASIC_DATA_RECORD_ID}\`;`
- **Evidencia**: Todos los 14 providers usan rutas relativas sin prefijo hardcodeado.
- **Resultado**: No requieren modificación al cambiar `VITE_API_URL`.
- **Estado**: `pass`

### E3: OpenAPI confirma schemas de nuevas entidades
- **Fuente**: `../hv-go-ms-resume/api/openapi.yaml` líneas 3412-3721
- **Evidencia**: Schemas verificados para Course, Certification, Language, Reference, CustomSection, FuturedProject con campos ES/EN, HTML/Texto separados.
- **Resultado**: Interfaces TypeScript en la Delta Spec son consistentes con OpenAPI.
- **Estado**: `pass`

### E4: OpenAPI confirma respuestas de creación y actualización
- **Fuente**: `../hv-go-ms-resume/api/openapi.yaml` líneas 1737-1742 (FuturedProject POST → 201 + CreateResponse)
- **Fuente**: `../hv-go-ms-resume/api/openapi.yaml` líneas 1795-1796 (FuturedProject PUT → 204)
- **Fuente**: `../hv-go-ms-resume/api/openapi.yaml` líneas 1818-1819 (FuturedProject DELETE → 204)
- **Evidencia**: Todas las nuevas entidades siguen el patrón: POST → 201 + `{ id }`, PUT → 204, DELETE → 204.
- **Resultado**: Patrón de providers en Delta Spec es correcto.
- **Estado**: `pass`

### E5: OpenAPI confirma formato de errores
- **Fuente**: `../hv-go-ms-resume/api/openapi.yaml` líneas 3751-3798 (ApiErrorResponse schema)
- **Evidencia**: Schema con `timestamp`, `status`, `error`, `code`, `message`, `path`, `trace_id`, `details[]`.
- **Resultado**: El interceptor actual de axiosClient ya maneja 401/404/500. Para 400, se mantiene notificación genérica.
- **Estado**: `pass`

### E6: Patrón de páginas existentes
- **Fuente**: `src/pages/experience/ExperiencePage.tsx` (539 líneas)
- **Evidencia**: Patrón verificado: view state toggle, SectionHeader, LoadingBlock, Table + Form, hooks useExperienceList/useExperienceForm.
- **Resultado**: Patrón documentado en Delta Spec es consistente con código existente.
- **Estado**: `pass`

### E7: Patrón de hooks existentes
- **Fuente**: `src/hooks/experience/useExperienceList.ts` y `src/hooks/experience/useExperienceForm.ts` (por explorar en implementación)
- **Evidencia**: Patrón inferido de ExperiencePage.tsx: hooks retornan data, isLoading, isBusy, handlers, reload functions.
- **Resultado**: Patrón documentado en Delta Spec es consistente.
- **Estado**: `pass`

### E8: Workspace Changes no afecta este incremento
- **Fuente**: `/home/cristiansrc/Documentos/Proyectos/hv-workspace/docs/specs/workspace_changes.md`
- **Evidencia**: hv-go-ms-resume ya está `implemented`. No hay cambios pendientes que afecten el contrato API.
- **Resultado**: No se requiere adaptación adicional por cambios globales.
- **Estado**: `pass`

---

## Spec Validator Approval

- **verdict**: `ready`
- **reviewed_at**: 2026-06-01
- **validator_agent**: spec-validator
- **artifact_set_reviewed**: 
  - `/home/cristiansrc/Documentos/Proyectos/hv-workspace/projects/hv-rt-fr-admin/docs/specs/increments/001-api-contract-adaptation.md`
  - `/home/cristiansrc/Documentos/Proyectos/hv-workspace/projects/hv-rt-fr-admin/docs/specs/.working/api-contract-adaptation-sdd-context.md`
  - `/home/cristiansrc/Documentos/Proyectos/hv-workspace/projects/hv-rt-fr-admin/docs/specs/requirements/api-contract-adaptation-requirements-brief.md`
  - `/home/cristiansrc/Documentos/Proyectos/hv-workspace/projects/hv-go-ms-resume/api/openapi.yaml`
  - `/home/cristiansrc/Documentos/Proyectos/hv-workspace/projects/hv-rt-fr-admin/src/api/apiConfig.ts`
  - `/home/cristiansrc/Documentos/Proyectos/hv-workspace/projects/hv-rt-fr-admin/src/api/axiosClient.ts`
  - `/home/cristiansrc/Documentos/Proyectos/hv-workspace/projects/hv-rt-fr-admin/src/api/experienceProvider.ts`
  - `/home/cristiansrc/Documentos/Proyectos/hv-workspace/projects/hv-rt-fr-admin/src/App.tsx`
  - `/home/cristiansrc/Documentos/Proyectos/hv-workspace/projects/hv-rt-fr-admin/src/pages/home/index.tsx`
  - `/home/cristiansrc/Documentos/Proyectos/hv-workspace/projects/hv-rt-fr-admin/src/hooks/home/useHomePage.ts`
  - `/home/cristiansrc/Documentos/Proyectos/hv-workspace/projects/hv-rt-fr-admin/src/api/index.ts`
  - `/home/cristiansrc/Documentos/Proyectos/hv-workspace/projects/hv-rt-fr-admin/docs/specs/.working/api-contract-adaptation-validation-report.md`
- **summary**: Validación final — los 8 hallazgos (F1-F8) han sido verificados como resueltos en la Delta Spec. OpenAPI ↔ Delta Spec consistente campo-por-campo para las 6 nuevas entidades. Endpoints, CRUD patterns, y manejo de errores alineados. Patrones de provider/hook/page reflejan las convenciones del código real (`export type`, `useNotifier`, `Dayjs`, `FormValues` concretos). Shared context completo con todos los headings obligatorios. Sin hallazgos pendientes.
- **invalidated_by_changes_since**: none

---

## Decisions locked

| ID | Decisión | Razonamiento |
|---|---|---|
| D1 | Prefijo `/v1/ms-resume` en `VITE_API_URL` | Cambio mínimo, todos los consumidores se adaptan automáticamente |
| D2 | Orden del menú en 8 grupos lógicos | UX consistente, agrupación por dominio |
| D3 | Reutilizar patrones de formularios existentes | Consistencia visual, menor esfuerzo |
| D4 | Sin paginación en nuevas listas | Volumen bajo, endpoints no paginan |
| D5 | Tag de visibilidad en CustomSections | UX clara para toggle visible/oculto |
| D6 | Refrescar lista después de CREATE `{ id }` | Patrón existente, simple y consistente |
| D7 | Refrescar lista después de UPDATE/DELETE 204 | Patrón existente, consistente |
| D8 | Notificación genérica para errores 400 | Consistencia con patrón actual, evita refactor masivo |

---

## Validator findings

| ID | Severity | Type | Description | Status |
|---|---|---|---|---|
| F1 | high | contract-drift | Section 3.3 instruye agregar `<Resource>` en App.tsx; la arquitectura real usa React Router + MENU_KEYS + renderizado condicional en Home | `resolved` |
| F2 | high | design-decision | D2 (menú agrupado) no describe cambios concretos en Home component (SubMenu de Ant Design, MENU_KEYS, MENU_ITEMS) | `resolved` |
| F3 | medium | mechanical | Provider pattern (Section 5) omite `export type { Payload, Response }` requeridos por hooks | `resolved` |
| F4 | medium | mechanical | Hook patterns (Section 6) omiten `useNotifier`, `Dayjs`, `FormValues` concretos, y verificación de `response.status` | `resolved` |
| F5 | medium | design-decision | Sin `FormValues` concretos para entidades con fechas (Course, Certification) — requieren `Dayjs` en vez de `string` | `resolved` |
| F6 | medium | contract-drift | D8 no cubre 429 (RateLimitExceeded) ni 409 (Conflict) del OpenAPI | `resolved` |
| F7 | low | mechanical | Provider `create` descarta `{ id }` del `CreateResponse` — intencional pero no documentado explícitamente | `resolved` |
| F8 | low | design-decision | Estrategia de `ExperienceSelector` (Section 7.2) no lockeada — "o se crea" deja decisión abierta | `resolved` |

---

## Resolved findings

| ID | Hallazgo | Corrección Aplicada |
|---|---|---|
| F1 | Section 3.3 instruía agregar `<Resource>` en App.tsx — incorrecto | Se corrigió Section 3.3 para apuntar a `useHomePage.ts` (MENU_KEYS) y `Home/index.tsx` (MENU_ITEMS + renderizado condicional). Se agregó nota explicatoria. |
| F2 | D2 sin estructura concreta de SubMenu | Se agregó el array completo de `MENU_ITEMS` con `type: "submenu"` y `children` para los 8 grupos, más nuevas entradas en `MENU_KEYS`. |
| F3 | Provider pattern omitía `export type { Payload, Response }` | Se agregó `export type { <Entity>Payload, <Entity>Response }` en el patrón genérico de provider. |
| F4 | Hook patterns omitían `useNotifier`, `Dayjs`, `FormValues` concretos, `response.status` | Se actualizaron los patrones de `use<Entity>List` y `use<Entity>Form` para reflejar el código real, incluyendo `useNotifier`, `Dayjs`, manejo de `response.status`, y carga inicial con `useEffect`. |
| F5 | Sin FormValues concretos con Dayjs para Course/Certification | Se agregó Section 6.3 con `CourseFormValues` (completionDate: Dayjs) y `CertificationFormValues` (issueDate, expirationDate: Dayjs) con ejemplos de conversión load/save. |
| F6 | D8 no cubría 409 (Conflict) ni 429 (RateLimitExceeded) | Se actualizó D8 para documentar explícitamente 409, 429 y 503, todos manejados vía bloque `catch` con notificación genérica. |
| F7 | Provider `create` descarta `{ id }` sin documentar | Se agregó comentario explícito en el patrón de provider indicando que es intencional (D6: refrescar lista completa). |
| F8 | Estrategia de ExperienceSelector no lockeada | Se agregó el componente `ExperienceSelector` completo en Section 7.2 siguiendo el patrón exacto de `SkillSonSelector` (thin wrapper sobre `ResourceSelectorModal`). |

---

## Open questions

| # | Pregunta | Estado | Decisión |
|---|---|---|---|
| PA4 | ¿Estrategia para prefijo `/v1/ms-resume/`? | **Resuelta** | D1: Incluir en `VITE_API_URL` |
| PA5 | ¿Orden de entradas en menú lateral? | **Resuelta** | D2: 8 grupos lógicos |
| PA6 | ¿Patrones de formulario para nuevas entidades? | **Resuelta** | D3: Reutilizar existentes |
| PA7 | ¿Paginación en nuevas listas? | **Resuelta** | D4: Sin paginación |
| PA8 | ¿Indicador de visibilidad en CustomSections? | **Resuelta** | D5: Tag verde/gris |

---

## Stale terms guard

| Término | Estado | Nota |
|---|---|---|
| Spring Boot backend | **Superseded** | Migrado a Go, no relevante para implementación |
| Endpoints sin prefijo | **Superseded** | Todos usan `/v1/ms-resume/` ahora |
| Respuestas de creación con entidad completa | **Superseded** | Ahora retornan `{ id }` |
| Respuestas de update/delete con body | **Superseded** | Ahora retornan `204 No Content` |
| Formato de error Spring Boot | **Superseded** | Ahora usa `ApiErrorResponse` |

---

## Human Plan Approval

- **approved_by_user**: ✅ cristiansrc (2026-06-01)
- **approved_verdict**: `ready`
- **handoff**: Pendiente de invocación a Task Decomposer

---

## Next action

**Handoff a Executor** — El task board ha sido creado con 37 tareas atómicas en `docs/specs/tasks/api-contract-adaptation-task-board.md`. Las tareas están organizadas en 11 grupos de ejecución paralela. El siguiente paso es que `executor` comience la implementación siguiendo el orden del task board.
