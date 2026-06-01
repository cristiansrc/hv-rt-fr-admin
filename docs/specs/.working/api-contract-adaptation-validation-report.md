# Validation Report - API Contract Adaptation

**Increment**: `api-contract-adaptation` (001)
**Validator**: spec-validator
**Date**: 2026-06-01
**Artifacts reviewed**:
- `docs/specs/increments/001-api-contract-adaptation.md` (Delta Spec, status: `draft`)
- `docs/specs/.working/api-contract-adaptation-sdd-context.md` (Shared Context, status: `planning`)
- `docs/specs/requirements/api-contract-adaptation-requirements-brief.md` (Requirements Brief)
- `../hv-go-ms-resume/api/openapi.yaml` (OpenAPI Backend Go, 3859 lines, v2.0.0)
- `src/api/apiConfig.ts`, `src/api/axiosClient.ts`, `src/api/experienceProvider.ts`, `src/App.tsx`, `src/pages/home/index.tsx`, `src/hooks/home/useHomePage.ts`, `src/api/index.ts` (código existente)

---

## Verdict: `changes-required`

---

## Findings

### F1 — [high] Section 3.3 Incorrectly Instructs Resource-Based Integration in App.tsx
- **Type**: contract-drift
- **Artefact**: Delta Spec Section 3.3, lines 175-178
- **Description**: La Delta Spec indica agregar `<Resource>` entries en el `<Refine>` component dentro de `App.tsx`. Sin embargo, el código real (`src/App.tsx`, líneas 80-91) no usa `<Resource>` de Refine. La navegación se maneja con React Router `<Route>` + renderizado condicional basado en `MENU_KEYS` en `src/pages/home/index.tsx` (líneas 181-205). Además, `App.tsx` ya no tiene un componente `<Refine>` con `<Resource>` hijos — solo tiene `<Routes>` con dos rutas (`/login` y `/`).
- **Evidence**: 
  - Delta Spec line 177: `Agregar <Resource> entries para las 6 nuevas entidades en el <Refine> component`
  - `src/App.tsx` lines 80-91: Solo rutas React Router, cero `<Resource>`
  - `src/pages/home/index.tsx` lines 44-105: `MENU_ITEMS` array + lines 181-205: renderizado condicional por `activeMenuKey`
- **Executor risk**: Si Executor sigue literalmente la instrucción, intentará agregar `<Resource>` en un archivo que no los usa, resultando en código que no compila o no se integra con el sistema de menú existente.
- **Recommendation**: Reemplazar Sección 3.3 con las modificaciones reales: (a) Agregar `MENU_KEYS` en `src/hooks/home/useHomePage.ts`, (b) Agregar entradas agrupadas en `MENU_ITEMS` con SubMenu de Ant Design en `src/pages/home/index.tsx`, (c) Agregar renderizado condicional en el `Content` para cada nueva página.

### F2 — [high] Menu Grouping Strategy Not Reflected in Actual Code Structure
- **Type**: design-decision
- **Artefact**: Delta Spec D2 (lines 38-49)
- **Description**: D2 define 8 grupos lógicos con submenús, pero el código existente (`src/pages/home/index.tsx`) usa un menú plano (`Menu` con `items={MENU_ITEMS}` línea 173). Transformar esto en grupos con `SubMenu` de Ant Design requiere modificar la estructura del componente Home y potencialmente el hook `useHomePage`. La Delta Spec no describe cómo implementar esta transformación.
- **Evidence**:
  - `src/pages/home/index.tsx` line 173: `<Menu mode="inline" ... items={MENU_ITEMS} />` — menú plano, sin SubMenu
  - Delta Spec D2 lines 40-49: tabla de 8 grupos con submenús
- **Executor risk**: Executor debe decidir si implementa SubMenu (cambiando significativamente Home) o mantiene menú plano con nuevo orden. Sin guía, la implementación será inconsistente o incorrecta.
- **Recommendation**: Especificar la estructura exacta del menú con sintaxis de Ant Design `SubMenu` + `Menu.Item`, indicando qué items existentes se reagrupan.

### F3 — [medium] Provider Pattern en Section 5 Omite Re-exports de Tipos
- **Type**: mechanical
- **Artefact**: Delta Spec Section 5, lines 370-402
- **Description**: El patrón genérico de provider no incluye `export type { <Entity>Payload, <Entity>Response }`. Los hooks en Section 6 importan tipos desde `../../api` (que resuelve a `src/api/index.ts` vía barrel exports). Sin los re-exports, los hooks tendrán errores de TypeScript. El provider real (`experienceProvider.ts`, líneas 5, 35-39) sí incluye estos re-exports.
- **Evidence**:
  - `src/api/experienceProvider.ts` line 5: `export type { ExperiencePayload, ExperienceResponse };`
  - `src/hooks/experience/useExperienceList.ts` line 2: `import { ..., type ExperienceResponse } from "../../api";`
  - Delta Spec Section 5: patrón sin `export type { ... }`
- **Executor risk**: Errores de compilación TypeScript al importar tipos desde `../../api`.
- **Recommendation**: Agregar `export type { <Entity>Payload, <Entity>Response }` y `export type { <Entity>CreateResult, <Entity>UpdateResult, <Entity>DeleteResult }` al patrón de Section 5.

### F4 — [medium] Hook Patterns Simplified Relative to Actual Code Conventions
- **Type**: mechanical
- **Artefact**: Delta Spec Sections 6.1-6.2, lines 421-519
- **Description**: El patrón documentado omite elementos críticos presentes en los hooks existentes:
  - `useNotifier` para notificaciones de éxito/error (real: `useExperienceList.ts` línea 6, `useExperienceForm.ts` línea 44)
  - `Dayjs` para campos de fecha (real: `useExperienceForm.ts` línea 2)
  - Interfaces concretas de `FormValues` con `Dayjs` para fechas (real: `useExperienceForm.ts` líneas 15-30)
  - `pendingMessage` / `setSuccessOnReload` pattern para mensajes diferidos (real: `useExperienceList.ts` línea 10)
  - Verificación de `response.status` (real: `useExperienceForm.ts` línea 125)
- **Evidence**: Ver `src/hooks/experience/useExperienceForm.ts` y `src/hooks/experience/useExperienceList.ts`
- **Executor risk**: Si Executor implementa el patrón simplificado al pie de la letra, los hooks no manejarán correctamente fechas (Course completionDate, Certification issueDate/expirationDate) y no mostrarán notificaciones consistentes con el resto del admin.
- **Recommendation**: Actualizar Sections 6.1-6.2 para reflejar el patrón real con `useNotifier`, `Dayjs`, `FormValues` concretos, y verificación de `response.status`.

### F5 — [medium] Missing Concrete FormValues Interfaces for New Entities
- **Type**: design-decision
- **Artefact**: Delta Spec Section 6.2, line 473-475
- **Description**: La interfaz `<Entity>FormValues` se deja como placeholder (`// campos del formulario`). Para entidades con fechas (Course, Certification), `FormValues` debe usar `Dayjs` en lugar de `string` para los campos de fecha, porque Ant Design `DatePicker` trabaja con `Dayjs`. Sin interfaces concretas, Executor debe inferir los tipos correctos.
- **Evidence**: `src/hooks/experience/useExperienceForm.ts` lines 15-30 muestra `yearStart?: Dayjs` y `yearEnd?: Dayjs`
- **Executor risk**: Usar `string` en lugar de `Dayjs` para fechas causará errores de tipo con Ant Design `DatePicker`.
- **Recommendation**: Definir interfaces `FormValues` concretas para Course, Certification, Language, Reference, CustomSection, y FuturedProject.

### F6 — [medium] D8 Incomplete: Missing 429 and 409 Error Handling
- **Type**: design-decision
- **Artefact**: Delta Spec D8, lines 96-103
- **Description**: D8 menciona solo 401, 404, y 500. El OpenAPI define adicionalmente:
  - `429 RateLimitExceeded` en login (línea 50-51)
  - `409 Conflict` en Language endpoints (líneas 2113-2114, 2171-2172)
  El interceptor actual (`axiosClient.ts` líneas 22-43) no maneja explícitamente 429 ni 409 — caen al `Promise.reject(error)` genérico.
- **Evidence**:
  - OpenAPI line 50-51: `"429": $ref: "#/components/responses/RateLimitExceeded"`
  - OpenAPI lines 2113-2114: `"409": $ref: "#/components/responses/Conflict"`
  - `src/api/axiosClient.ts` lines 33-38: solo maneja 404 y 500
- **Executor risk**: Usuario recibe notificación genérica de error sin contexto cuando ocurre rate-limiting o conflicto de duplicados.
- **Recommendation**: Extender D8 para documentar el comportamiento esperado para 429 (notificación "Demasiados intentos, espere...") y 409 (notificación con mensaje del backend).

### F7 — [low] Provider Pattern Returns `{ status }` Discarding `{ id }` from CreateResponse
- **Type**: mechanical
- **Artefact**: Delta Spec Section 5, lines 388-391
- **Description**: `create<Entity>` retorna `Promise<{ status: number }>`, descartando el `{ id: number }` que el servidor envía en la respuesta 201 (`CreateResponse` schema, OpenAPI lines 3723-3730). Aunque D6 establece que se refresca la lista completa, el `id` podría ser útil para otros casos de uso futuros.
- **Evidence**: OpenAPI lines 3723-3730: `CreateResponse` con `id: integer`
- **Executor risk**: Bajo — la decisión D6 lo hace intencional. Solo relevante si código futuro necesita el ID.
- **Recommendation**: Considerar retornar `{ status: number; id: number }` o documentar explícitamente que el ID se descarta por diseño.

### F8 — [low] ExperienceSelector Implementation Strategy Not Locked
- **Type**: design-decision
- **Artefact**: Delta Spec Section 7.2, line 552
- **Description**: "Se reutiliza el patrón de `SkillSonSelector` adaptado para experiencias **(o se crea un `ExperienceSelector` similar)**." La frase "o se crea" deja la decisión abierta para Executor.
- **Executor risk**: Bajo — ambas opciones son razonables. Pero añade ambigüedad.
- **Recommendation**: Lockear la decisión: ¿extraer un componente genérico `EntitySelector` o crear `ExperienceSelector` específico?

---

## Consistency Verification Summary

| Check | Result |
|---|---|
| PA4-PA8 covered by D1-D5 | ✅ Pass |
| OpenAPI schemas match TypeScript interfaces | ✅ Pass (verificado campo por campo) |
| OpenAPI paths match Delta Spec endpoints | ✅ Pass |
| OpenAPI response codes (201/204) match D6-D7 | ✅ Pass |
| Login/Altcha paths consistent | ✅ Pass |
| Shared context all required headings present | ✅ Pass |
| Shared context no duplicate headings | ✅ Pass |
| Existing code files cited exist on disk | ✅ Pass |
| Workspace changes reviewed, no conflicts | ✅ Pass |
| OpenAPI CreateResponse schema matches `{ id }` | ✅ Pass |
| OpenAPI ApiErrorResponse schema verified | ✅ Pass |
| App.tsx Resource-based integration | ❌ **Fail** (F1) |
| Menu integration strategy | ❌ **Fail** (F2) |
| Provider pattern matches existing conventions | ❌ **Partial** (F3) |
| Hook patterns match existing conventions | ❌ **Partial** (F4, F5) |
| Error handling completeness | ❌ **Partial** (F6) |
| CustomSection `visible` field in payload/response | ✅ Pass |
| FuturedProject references (`experience`, `imageListUrl`, `imageUrl`) | ✅ Pass |
| FuturedProject `experienceId` in request, `experience` in response | ✅ Pass |

---

## Summary

La Delta Spec resuelve correctamente todas las preguntas abiertas del Requirements Brief (PA4-PA8 → D1-D5), define contratos de interfaces TypeScript consistentes con el OpenAPI real, y establece patrones de provider/hook/page alineados con la intención del código existente. Sin embargo, presenta dos deficiencias de alto impacto:

1. **F1**: La instrucción de modificar `App.tsx` con `<Resource>` entries contradice la arquitectura real, que usa React Router + renderizado condicional basado en `MENU_KEYS`.
2. **F2**: La estrategia de menú agrupado (D2) no se traduce en cambios concretos sobre el código existente de `Home`.

Además, los patrones de provider/hook documentados son simplificaciones que omiten convenciones reales del código (`useNotifier`, `Dayjs`, re-exports de tipos), lo que puede llevar a inconsistencias de implementación.

Se requieren correcciones por Planner antes de avanzar a Task Decomposition.

---

## Next Action

**Planner corrections**: Corregir F1-F8 en la Delta Spec y Shared Context, luego re-enviar para re-validación.
