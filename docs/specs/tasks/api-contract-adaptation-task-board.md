# Task Board - API Contract Adaptation

**Increment**: `api-contract-adaptation`
**Status**: `decomposition-ready`
**Fecha**: 2026-06-01
**Created by**: task-decomposer

---

## Task Summary

| ID | Title | Agent | Status | Dependencies |
|---|---|---|---|---|
| T01 | Configurar VITE_API_URL con prefijo /v1/ms-resume | executor | todo | — |
| T02 | Crear interfaces TypeScript para Course | executor | todo | — |
| T03 | Crear interfaces TypeScript para Certification | executor | todo | — |
| T04 | Crear interfaces TypeScript para Language | executor | todo | — |
| T05 | Crear interfaces TypeScript para Reference | executor | todo | — |
| T06 | Crear interfaces TypeScript para CustomSection | executor | todo | — |
| T07 | Crear interfaces TypeScript para FuturedProject | executor | todo | — |
| T08 | Crear courseProvider.ts | executor | todo | T02 |
| T09 | Crear certificationProvider.ts | executor | todo | T03 |
| T10 | Crear languageProvider.ts | executor | todo | T04 |
| T11 | Crear referenceProvider.ts | executor | todo | T05 |
| T12 | Crear customSectionProvider.ts | executor | todo | T06 |
| T13 | Crear futuredProjectProvider.ts | executor | todo | T07 |
| T14 | Actualizar src/api/index.ts con exports de nuevos providers | executor | todo | T08-T13 |
| T15 | Crear hooks de lista para Course | executor | todo | T08, T14 |
| T16 | Crear hooks de lista para Certification | executor | todo | T09, T14 |
| T17 | Crear hooks de lista para Language | executor | todo | T10, T14 |
| T18 | Crear hooks de lista para Reference | executor | todo | T11, T14 |
| T19 | Crear hooks de lista para CustomSection | executor | todo | T12, T14 |
| T20 | Crear hooks de lista para FuturedProject | executor | todo | T13, T14 |
| T21 | Crear hooks de formulario para Course | executor | todo | T08, T14, T15 |
| T22 | Crear hooks de formulario para Certification | executor | todo | T09, T14, T16 |
| T23 | Crear hooks de formulario para Language | executor | todo | T10, T14, T17 |
| T24 | Crear hooks de formulario para Reference | executor | todo | T11, T14, T18 |
| T25 | Crear hooks de formulario para CustomSection | executor | todo | T12, T14, T19 |
| T26 | Crear hooks de formulario para FuturedProject | executor | todo | T13, T14, T20 |
| T27 | Crear componente ExperienceSelector | executor | todo | T14 |
| T28 | Exportar ExperienceSelector en components/index.ts | executor | todo | T27 |
| T29 | Crear CoursePage.tsx | executor | todo | T15, T21 |
| T30 | Crear CertificationPage.tsx | executor | todo | T16, T22 |
| T31 | Crear LanguagePage.tsx | executor | todo | T17, T23 |
| T32 | Crear ReferencePage.tsx | executor | todo | T18, T24 |
| T33 | Crear CustomSectionPage.tsx | executor | todo | T19, T25 |
| T34 | Crear FuturedProjectPage.tsx | executor | todo | T20, T26, T27, T28 |
| T35 | Actualizar MENU_KEYS en useHomePage.ts | executor | todo | — |
| T36 | Actualizar MENU_ITEMS y renderizado condicional en Home/index.tsx | executor | todo | T29-T34, T35 |
| T37 | Verificación de no regresión y pruebas manuales | executor | todo | T01, T36 |

---

## Task Definitions

### T01: Configurar VITE_API_URL con prefijo /v1/ms-resume

- **agent**: executor
- **spec_refs**: Delta Spec Section 2 (D1), Section 3.1
- **goal**: Crear `.env.example` con `VITE_API_URL` incluyendo el prefijo `/v1/ms-resume` para que todos los consumers usen la URL correcta.
- **scope**: Crear archivo `.env.example` en la raiz del proyecto.
- **out_of_scope**: Modificar `.env` real (cada developer lo configura localmente), cambiar apiConfig.ts, axiosClient.ts, authProvider.ts, useAltcha.ts, App.tsx.
- **inputs**:
  - `src/api/apiConfig.ts` exporta `API_URL = import.meta.env.VITE_API_URL ?? ""`
  - Delta Spec D1: `VITE_API_URL` debe incluir `/v1/ms-resume`
- **implementation_notes**:
  - Crear `.env.example` con: `VITE_API_URL=https://api.cristiansrc.com/v1/ms-resume`
  - No existe `.env.example` actualmente (verificado por glob).
  - No modificar ningún archivo TypeScript.
- **edge_cases**:
  - El valor es un ejemplo; developers pueden cambiar el dominio base.
  - El prefijo `/v1/ms-resume` es obligatorio.
- **done_criteria**:
  - `.env.example` existe en la raiz del proyecto.
  - Contiene `VITE_API_URL` con el prefijo `/v1/ms-resume`.
- **verification**: `cat .env.example` muestra la variable correcta.
- **dependencies**: —
- **handoff_context**: Ninguno. Tarea independiente.
- **source_of_truth**: Delta Spec Section 2 D1.
- **stale_terms_guard**: No usar "Spring Boot", "endpoints sin prefijo".
- **status**: `todo`
- **executor_notes**:
- **verification_result**:
- **blocker**: `none`

---

### T02: Crear interfaces TypeScript para Course

- **agent**: executor
- **spec_refs**: Delta Spec Section 4.1
- **goal**: Crear los archivos `CoursePayload.ts` y `CourseResponse.ts` en `src/interfaces/course/`.
- **scope**: Dos archivos de interfaces TypeScript para la entidad Course.
- **out_of_scope**: Providers, hooks, páginas.
- **inputs**:
  - Delta Spec Section 4.1 con contratos exactos de CoursePayload y CourseResponse.
  - Patrón existente: `src/interfaces/experience/ExperiencePayload.ts`, `ExperienceResponse.ts`.
- **implementation_notes**:
  - Crear directorio `src/interfaces/course/`.
  - `CoursePayload.ts`: export interface CoursePayload con campos name, nameEng, institution, institutionEng, completionDate (string), description?, descriptionEng?, summaryPdf?, summaryPdfEng?, certificateUrl?.
  - `CourseResponse.ts`: export interface CourseResponse con mismos campos pero id: number y campos opcionales como `string | null`.
  - Usar `export type` si se necesitan re-exports.
- **edge_cases**:
  - completionDate es string en Payload/Response (se convierte a Dayjs solo en FormValues del hook).
- **done_criteria**:
  - `src/interfaces/course/CoursePayload.ts` existe con interface correcta.
  - `src/interfaces/course/CourseResponse.ts` existe con interface correcta.
  - Campos coinciden exactamente con Delta Spec Section 4.1.
- **verification**: `cat src/interfaces/course/CoursePayload.ts` y `CourseResponse.ts` muestran interfaces correctas.
- **dependencies**: —
- **handoff_context**: T08 (courseProvider) necesita estas interfaces.
- **source_of_truth**: Delta Spec Section 4.1.
- **stale_terms_guard**: No usar tipos de Spring Boot.
- **status**: `todo`
- **executor_notes**:
- **verification_result**:
- **blocker**: `none`

---

### T03: Crear interfaces TypeScript para Certification

- **agent**: executor
- **spec_refs**: Delta Spec Section 4.2
- **goal**: Crear `CertificationPayload.ts` y `CertificationResponse.ts` en `src/interfaces/certification/`.
- **scope**: Dos archivos de interfaces TypeScript para Certification.
- **out_of_scope**: Providers, hooks, páginas.
- **inputs**: Delta Spec Section 4.2.
- **implementation_notes**:
  - Crear directorio `src/interfaces/certification/`.
  - CertificationPayload: name, nameEng, issuingOrganization, issuingOrganizationEng, issueDate (string), expirationDate?, verificationUrl?, credentialId?, description?, descriptionEng?, summaryPdf?, summaryPdfEng?.
  - CertificationResponse: mismos campos + id: number, opcionales como `string | null`.
- **edge_cases**: issueDate y expirationDate son string (se convierten a Dayjs en FormValues).
- **done_criteria**: Interfaces creadas y coinciden con Section 4.2.
- **verification**: `cat` de ambos archivos.
- **dependencies**: —
- **handoff_context**: T09 necesita estas interfaces.
- **source_of_truth**: Delta Spec Section 4.2.
- **stale_terms_guard**: —
- **status**: `todo`
- **executor_notes**:
- **verification_result**:
- **blocker**: `none`

---

### T04: Crear interfaces TypeScript para Language

- **agent**: executor
- **spec_refs**: Delta Spec Section 4.3
- **goal**: Crear `LanguagePayload.ts` y `LanguageResponse.ts` en `src/interfaces/language/`.
- **scope**: Dos archivos de interfaces para Language.
- **out_of_scope**: Providers, hooks, páginas.
- **inputs**: Delta Spec Section 4.3.
- **implementation_notes**:
  - Crear directorio `src/interfaces/language/`.
  - LanguagePayload: language, languageEng, readingLevel, writingLevel, speakingLevel (todos string, requeridos).
  - LanguageResponse: mismos campos + id: number.
- **edge_cases**: No hay campos opcionales ni fechas.
- **done_criteria**: Interfaces creadas y coinciden con Section 4.3.
- **verification**: `cat` de ambos archivos.
- **dependencies**: —
- **handoff_context**: T10 necesita estas interfaces.
- **source_of_truth**: Delta Spec Section 4.3.
- **stale_terms_guard**: —
- **status**: `todo`
- **executor_notes**:
- **verification_result**:
- **blocker**: `none`

---

### T05: Crear interfaces TypeScript para Reference

- **agent**: executor
- **spec_refs**: Delta Spec Section 4.4
- **goal**: Crear `ReferencePayload.ts` y `ReferenceResponse.ts` en `src/interfaces/reference/`.
- **scope**: Dos archivos de interfaces para Reference.
- **out_of_scope**: Providers, hooks, páginas.
- **inputs**: Delta Spec Section 4.4.
- **implementation_notes**:
  - Crear directorio `src/interfaces/reference/`.
  - ReferencePayload: fullName, position (requeridos), company?, companyEng?, email?, phone?, relationship?, relationshipEng? (opcionales).
  - ReferenceResponse: mismos campos + id: number, opcionales como `string | null`.
- **edge_cases**: email y phone son sensibles; no exponer en logs (Security Section 9).
- **done_criteria**: Interfaces creadas y coinciden con Section 4.4.
- **verification**: `cat` de ambos archivos.
- **dependencies**: —
- **handoff_context**: T11 necesita estas interfaces.
- **source_of_truth**: Delta Spec Section 4.4.
- **stale_terms_guard**: —
- **status**: `todo`
- **executor_notes**:
- **verification_result**:
- **blocker**: `none`

---

### T06: Crear interfaces TypeScript para CustomSection

- **agent**: executor
- **spec_refs**: Delta Spec Section 4.5
- **goal**: Crear `CustomSectionPayload.ts` y `CustomSectionResponse.ts` en `src/interfaces/custom-section/`.
- **scope**: Dos archivos de interfaces para CustomSection.
- **out_of_scope**: Providers, hooks, páginas.
- **inputs**: Delta Spec Section 4.5.
- **implementation_notes**:
  - Crear directorio `src/interfaces/custom-section/`.
  - CustomSectionPayload: title, titleEng, content?, contentEng?, summaryPdf?, summaryPdfEng?, visible: boolean.
  - CustomSectionResponse: mismos campos + id: number, content/contentEng/summaryPdf/summaryPdfEng como `string | null`.
- **edge_cases**: visible es boolean requerido (no nullable).
- **done_criteria**: Interfaces creadas y coinciden con Section 4.5.
- **verification**: `cat` de ambos archivos.
- **dependencies**: —
- **handoff_context**: T12 necesita estas interfaces.
- **source_of_truth**: Delta Spec Section 4.5.
- **stale_terms_guard**: —
- **status**: `todo`
- **executor_notes**:
- **verification_result**:
- **blocker**: `none`

---

### T07: Crear interfaces TypeScript para FuturedProject

- **agent**: executor
- **spec_refs**: Delta Spec Section 4.6
- **goal**: Crear `FuturedProjectPayload.ts` y `FuturedProjectResponse.ts` en `src/interfaces/futured-project/`.
- **scope**: Dos archivos de interfaces para FuturedProject.
- **out_of_scope**: Providers, hooks, páginas.
- **inputs**: Delta Spec Section 4.6.
- **implementation_notes**:
  - Crear directorio `src/interfaces/futured-project/`.
  - FuturedProjectPayload: name, nameEng, experienceId: number, descriptionShort, description, descriptionShortEng, descriptionEng (requeridos), imageListUrlId?, imageUrlId? (opcionales).
  - FuturedProjectResponse: name, nameEng, descriptionShort, description, descriptionShortEng, descriptionEng, experience: ExperienceResponse, imageListUrl: ImageUrlResponse | null, imageUrl: ImageUrlResponse | null, id: number.
  - Nota: FuturedProjectResponse referencia ExperienceResponse e ImageUrlResponse que ya existen en `src/interfaces/experience/` y `src/interfaces/image/`.
- **edge_cases**:
  - ExperienceResponse e ImageUrlResponse ya existen; importar desde `../../interfaces/experience/ExperienceResponse` y `../../interfaces/image/ImageResponse` (verificar nombre exacto del export).
  - Verificar que ImageResponse tenga los campos que ImageUrlResponse espera; si no existe ImageUrlResponse como tipo separado, usar ImageResponse.
- **done_criteria**: Interfaces creadas y coinciden con Section 4.6.
- **verification**: `cat` de ambos archivos. Verificar imports de ExperienceResponse e ImageResponse.
- **dependencies**: —
- **handoff_context**: T13 necesita estas interfaces.
- **source_of_truth**: Delta Spec Section 4.6 + OpenAPI backend.
- **stale_terms_guard**: —
- **status**: `todo`
- **executor_notes**:
- **verification_result**:
- **blocker**: `none`

---

### T08: Crear courseProvider.ts

- **agent**: executor
- **spec_refs**: Delta Spec Section 5, Section 5.1
- **goal**: Crear `src/api/courseProvider.ts` con funciones CRUD para Course siguiendo el patrón de `experienceProvider.ts`.
- **scope**: Un archivo provider con getCourses, getCourse, createCourse, updateCourse, deleteCourse.
- **out_of_scope**: Hooks, páginas.
- **inputs**:
  - Patrón de `src/api/experienceProvider.ts`.
  - Delta Spec Section 5 (patrón genérico) y Section 5.1 (endpoint `/course`).
  - Interfaces de T02: CoursePayload, CourseResponse.
- **implementation_notes**:
  - Endpoint: `/course`.
  - Seguir patrón exacto de experienceProvider.ts: importar axiosClient, importar interfaces, `export type { CoursePayload, CourseResponse }`, constante COURSE_ENDPOINT, funciones get/create/update/delete.
  - createCourse retorna `{ status: response.status }` (descarta `{ id }` intencionalmente, ver D6).
  - updateCourse y deleteCourse retornan `{ status: response.status }` (204 No Content, ver D7).
  - Incluir interfaces CreateResult/UpdateResult/DeleteResult como en experienceProvider.ts.
- **edge_cases**:
  - El backend retorna 201 en POST con `{ id }` en body, pero el provider solo retorna status.
  - El backend retorna 204 en PUT/DELETE sin body.
- **done_criteria**:
  - `src/api/courseProvider.ts` existe con todas las funciones CRUD.
  - Usa endpoint `/course`.
  - Exporta CoursePayload y CourseResponse.
  - Sigue patrón de experienceProvider.ts.
- **verification**: `cat src/api/courseProvider.ts` muestra funciones correctas.
- **dependencies**: T02
- **handoff_context**: T14 (barrel export), T15 (hook de lista), T21 (hook de formulario).
- **source_of_truth**: Delta Spec Section 5 + experienceProvider.ts.
- **stale_terms_guard**: —
- **status**: `todo`
- **executor_notes**:
- **verification_result**:
- **blocker**: `none`

---

### T09: Crear certificationProvider.ts

- **agent**: executor
- **spec_refs**: Delta Spec Section 5, Section 5.1
- **goal**: Crear `src/api/certificationProvider.ts` con funciones CRUD para Certification.
- **scope**: Un archivo provider.
- **out_of_scope**: Hooks, páginas.
- **inputs**: Patrón de experienceProvider.ts, Delta Spec Section 5.1 (endpoint `/certification`), interfaces de T03.
- **implementation_notes**: Mismo patrón que T08. Endpoint: `/certification`.
- **edge_cases**: Igual que T08.
- **done_criteria**: Provider creado con funciones CRUD correctas.
- **verification**: `cat src/api/certificationProvider.ts`.
- **dependencies**: T03
- **handoff_context**: T14, T16, T22.
- **source_of_truth**: Delta Spec Section 5.
- **stale_terms_guard**: —
- **status**: `todo`
- **executor_notes**:
- **verification_result**:
- **blocker**: `none`

---

### T10: Crear languageProvider.ts

- **agent**: executor
- **spec_refs**: Delta Spec Section 5, Section 5.1
- **goal**: Crear `src/api/languageProvider.ts` con funciones CRUD para Language.
- **scope**: Un archivo provider.
- **out_of_scope**: Hooks, páginas.
- **inputs**: Patrón de experienceProvider.ts, Delta Spec Section 5.1 (endpoint `/language`), interfaces de T04.
- **implementation_notes**: Mismo patrón que T08. Endpoint: `/language`.
- **edge_cases**: Igual que T08.
- **done_criteria**: Provider creado con funciones CRUD correctas.
- **verification**: `cat src/api/languageProvider.ts`.
- **dependencies**: T04
- **handoff_context**: T14, T17, T23.
- **source_of_truth**: Delta Spec Section 5.
- **stale_terms_guard**: —
- **status**: `todo`
- **executor_notes**:
- **verification_result**:
- **blocker**: `none`

---

### T11: Crear referenceProvider.ts

- **agent**: executor
- **spec_refs**: Delta Spec Section 5, Section 5.1
- **goal**: Crear `src/api/referenceProvider.ts` con funciones CRUD para Reference.
- **scope**: Un archivo provider.
- **out_of_scope**: Hooks, páginas.
- **inputs**: Patrón de experienceProvider.ts, Delta Spec Section 5.1 (endpoint `/reference`), interfaces de T05.
- **implementation_notes**: Mismo patrón que T08. Endpoint: `/reference`.
- **edge_cases**: Igual que T08.
- **done_criteria**: Provider creado con funciones CRUD correctas.
- **verification**: `cat src/api/referenceProvider.ts`.
- **dependencies**: T05
- **handoff_context**: T14, T18, T24.
- **source_of_truth**: Delta Spec Section 5.
- **stale_terms_guard**: —
- **status**: `todo`
- **executor_notes**:
- **verification_result**:
- **blocker**: `none`

---

### T12: Crear customSectionProvider.ts

- **agent**: executor
- **spec_refs**: Delta Spec Section 5, Section 5.1
- **goal**: Crear `src/api/customSectionProvider.ts` con funciones CRUD para CustomSection.
- **scope**: Un archivo provider.
- **out_of_scope**: Hooks, páginas.
- **inputs**: Patrón de experienceProvider.ts, Delta Spec Section 5.1 (endpoint `/custom-section`), interfaces de T06.
- **implementation_notes**: Mismo patrón que T08. Endpoint: `/custom-section`.
- **edge_cases**: Igual que T08.
- **done_criteria**: Provider creado con funciones CRUD correctas.
- **verification**: `cat src/api/customSectionProvider.ts`.
- **dependencies**: T06
- **handoff_context**: T14, T19, T25.
- **source_of_truth**: Delta Spec Section 5.
- **stale_terms_guard**: —
- **status**: `todo`
- **executor_notes**:
- **verification_result**:
- **blocker**: `none`

---

### T13: Crear futuredProjectProvider.ts

- **agent**: executor
- **spec_refs**: Delta Spec Section 5, Section 5.1
- **goal**: Crear `src/api/futuredProjectProvider.ts` con funciones CRUD para FuturedProject.
- **scope**: Un archivo provider.
- **out_of_scope**: Hooks, páginas.
- **inputs**: Patrón de experienceProvider.ts, Delta Spec Section 5.1 (endpoint `/futured-project`), interfaces de T07.
- **implementation_notes**: Mismo patrón que T08. Endpoint: `/futured-project`.
- **edge_cases**: Igual que T08.
- **done_criteria**: Provider creado con funciones CRUD correctas.
- **verification**: `cat src/api/futuredProjectProvider.ts`.
- **dependencies**: T07
- **handoff_context**: T14, T20, T26.
- **source_of_truth**: Delta Spec Section 5.
- **stale_terms_guard**: —
- **status**: `todo`
- **executor_notes**:
- **verification_result**:
- **blocker**: `none`

---

### T14: Actualizar src/api/index.ts con exports de nuevos providers

- **agent**: executor
- **spec_refs**: Delta Spec Section 3.3
- **goal**: Agregar `export * from` de los 6 nuevos providers en el barrel export `src/api/index.ts`.
- **scope**: Modificar `src/api/index.ts` agregando 6 líneas de export.
- **out_of_scope**: Crear providers, modificar otros archivos.
- **inputs**:
  - `src/api/index.ts` actual (15 líneas, 14 exports existentes).
  - Nuevos providers: courseProvider, certificationProvider, languageProvider, referenceProvider, customSectionProvider, futuredProjectProvider.
- **implementation_notes**:
  - Agregar al final del archivo:
    ```
    export * from "./courseProvider";
    export * from "./certificationProvider";
    export * from "./languageProvider";
    export * from "./referenceProvider";
    export * from "./customSectionProvider";
    export * from "./futuredProjectProvider";
    ```
  - Mantener orden alfabético o agrupar al final (consistente con estilo existente).
- **edge_cases**: No duplicar exports existentes.
- **done_criteria**:
  - `src/api/index.ts` tiene 6 nuevos exports.
  - Total de líneas: 21 (15 originales + 6 nuevas).
- **verification**: `cat src/api/index.ts` muestra los 6 nuevos exports.
- **dependencies**: T08, T09, T10, T11, T12, T13
- **handoff_context**: T15-T26 (hooks) necesitan importar desde `../../api`.
- **source_of_truth**: Delta Spec Section 3.3.
- **stale_terms_guard**: —
- **status**: `todo`
- **executor_notes**:
- **verification_result**:
- **blocker**: `none`

---

### T15: Crear hooks de lista para Course

- **agent**: executor
- **spec_refs**: Delta Spec Section 6.1
- **goal**: Crear `src/hooks/course/useCourseList.ts` siguiendo el patrón de `useExperienceList.ts`.
- **scope**: Un hook de lista con data, isLoading, isBusy, handleDelete, reloadCourses, setSuccessOnReload.
- **out_of_scope**: Hook de formulario, página.
- **inputs**:
  - Patrón de `src/hooks/experience/useExperienceList.ts`.
  - Delta Spec Section 6.1 (patrón genérico de hook de lista).
  - Provider de T08: getCourses, deleteCourse, CourseResponse.
- **implementation_notes**:
  - Crear directorio `src/hooks/course/`.
  - Importar desde `../../api`: deleteCourse, getCourses, CourseResponse.
  - Importar useNotifier desde `../useNotifier`.
  - Retornar: `{ data, isLoading, isBusy, handleDelete, reloadCourses, setSuccessOnReload }`.
  - handleDelete verifica status 200, 201, 204.
  - Mensajes de notificación en español: "Curso eliminado", "No se pudo cargar la lista de cursos", etc.
- **edge_cases**:
  - getCourses puede retornar null/undefined; usar `result ?? []`.
  - Sin paginación (D4).
- **done_criteria**:
  - `src/hooks/course/useCourseList.ts` existe.
  - Sigue patrón de useExperienceList.ts.
  - Usa deleteCourse y getCourses del barrel export.
- **verification**: `cat src/hooks/course/useCourseList.ts`.
- **dependencies**: T08, T14
- **handoff_context**: T21 (hook form), T29 (CoursePage).
- **source_of_truth**: Delta Spec Section 6.1 + useExperienceList.ts.
- **stale_terms_guard**: —
- **status**: `todo`
- **executor_notes**:
- **verification_result**:
- **blocker**: `none`

---

### T16: Crear hooks de lista para Certification

- **agent**: executor
- **spec_refs**: Delta Spec Section 6.1
- **goal**: Crear `src/hooks/certification/useCertificationList.ts`.
- **scope**: Un hook de lista.
- **out_of_scope**: Hook de formulario, página.
- **inputs**: Patrón de useExperienceList.ts, Delta Spec Section 6.1, provider de T09.
- **implementation_notes**: Mismo patrón que T15. Endpoint: certification. Mensajes en español.
- **edge_cases**: Igual que T15.
- **done_criteria**: Hook creado con patrón correcto.
- **verification**: `cat src/hooks/certification/useCertificationList.ts`.
- **dependencies**: T09, T14
- **handoff_context**: T22, T30.
- **source_of_truth**: Delta Spec Section 6.1.
- **stale_terms_guard**: —
- **status**: `todo`
- **executor_notes**:
- **verification_result**:
- **blocker**: `none`

---

### T17: Crear hooks de lista para Language

- **agent**: executor
- **spec_refs**: Delta Spec Section 6.1
- **goal**: Crear `src/hooks/language/useLanguageList.ts`.
- **scope**: Un hook de lista.
- **out_of_scope**: Hook de formulario, página.
- **inputs**: Patrón de useExperienceList.ts, Delta Spec Section 6.1, provider de T10.
- **implementation_notes**: Mismo patrón que T15.
- **edge_cases**: Igual que T15.
- **done_criteria**: Hook creado con patrón correcto.
- **verification**: `cat src/hooks/language/useLanguageList.ts`.
- **dependencies**: T10, T14
- **handoff_context**: T23, T31.
- **source_of_truth**: Delta Spec Section 6.1.
- **stale_terms_guard**: —
- **status**: `todo`
- **executor_notes**:
- **verification_result**:
- **blocker**: `none`

---

### T18: Crear hooks de lista para Reference

- **agent**: executor
- **spec_refs**: Delta Spec Section 6.1
- **goal**: Crear `src/hooks/reference/useReferenceList.ts`.
- **scope**: Un hook de lista.
- **out_of_scope**: Hook de formulario, página.
- **inputs**: Patrón de useExperienceList.ts, Delta Spec Section 6.1, provider de T11.
- **implementation_notes**: Mismo patrón que T15.
- **edge_cases**: Igual que T15. email y phone son sensibles.
- **done_criteria**: Hook creado con patrón correcto.
- **verification**: `cat src/hooks/reference/useReferenceList.ts`.
- **dependencies**: T11, T14
- **handoff_context**: T24, T32.
- **source_of_truth**: Delta Spec Section 6.1.
- **stale_terms_guard**: —
- **status**: `todo`
- **executor_notes**:
- **verification_result**:
- **blocker**: `none`

---

### T19: Crear hooks de lista para CustomSection

- **agent**: executor
- **spec_refs**: Delta Spec Section 6.1
- **goal**: Crear `src/hooks/custom-section/useCustomSectionList.ts`.
- **scope**: Un hook de lista.
- **out_of_scope**: Hook de formulario, página.
- **inputs**: Patrón de useExperienceList.ts, Delta Spec Section 6.1, provider de T12.
- **implementation_notes**: Mismo patrón que T15.
- **edge_cases**: Igual que T15.
- **done_criteria**: Hook creado con patrón correcto.
- **verification**: `cat src/hooks/custom-section/useCustomSectionList.ts`.
- **dependencies**: T12, T14
- **handoff_context**: T25, T33.
- **source_of_truth**: Delta Spec Section 6.1.
- **stale_terms_guard**: —
- **status**: `todo`
- **executor_notes**:
- **verification_result**:
- **blocker**: `none`

---

### T20: Crear hooks de lista para FuturedProject

- **agent**: executor
- **spec_refs**: Delta Spec Section 6.1
- **goal**: Crear `src/hooks/futured-project/useFuturedProjectList.ts`.
- **scope**: Un hook de lista.
- **out_of_scope**: Hook de formulario, página.
- **inputs**: Patrón de useExperienceList.ts, Delta Spec Section 6.1, provider de T13.
- **implementation_notes**: Mismo patrón que T15.
- **edge_cases**: Igual que T15.
- **done_criteria**: Hook creado con patrón correcto.
- **verification**: `cat src/hooks/futured-project/useFuturedProjectList.ts`.
- **dependencies**: T13, T14
- **handoff_context**: T26, T34.
- **source_of_truth**: Delta Spec Section 6.1.
- **stale_terms_guard**: —
- **status**: `todo`
- **executor_notes**:
- **verification_result**:
- **blocker**: `none`

---

### T21: Crear hooks de formulario para Course

- **agent**: executor
- **spec_refs**: Delta Spec Section 6.2, Section 6.3
- **goal**: Crear `src/hooks/course/useCourseForm.ts` con CourseFormValues usando Dayjs para completionDate.
- **scope**: Un hook de formulario con form, isLoading, isSaving, handleSubmit.
- **out_of_scope**: Página.
- **inputs**:
  - Patrón de `src/hooks/experience/useExperienceForm.ts`.
  - Delta Spec Section 6.2 (patrón genérico) y Section 6.3 (CourseFormValues con Dayjs).
  - Provider de T08: createCourse, getCourse, updateCourse, CoursePayload.
- **implementation_notes**:
  - CourseFormValues: name, nameEng, institution, institutionEng, completionDate?: Dayjs, description?, descriptionEng?, summaryPdf?, summaryPdfEng?, certificateUrl?.
  - Al cargar (mode=edit): convertir completionDate string a dayjs().
  - Al enviar: convertir completionDate Dayjs a string con `.format("YYYY-MM-DD")`.
  - Usar `BASIC_DATA_DATE_FORMAT` de `../../config/basic-data-config` si existe, sino hardcodear `"YYYY-MM-DD"`.
  - Mensajes en español: "Curso creado", "Curso actualizado", etc.
- **edge_cases**:
  - completionDate es opcional; manejar undefined.
  - Verificar que dayjs importado correctamente.
- **done_criteria**:
  - `src/hooks/course/useCourseForm.ts` existe.
  - CourseFormValues exportado con completionDate?: Dayjs.
  - Conversión dayjs/string en load y submit.
- **verification**: `cat src/hooks/course/useCourseForm.ts`.
- **dependencies**: T08, T14, T15
- **handoff_context**: T29 (CoursePage).
- **source_of_truth**: Delta Spec Section 6.2 + 6.3 + useExperienceForm.ts.
- **stale_terms_guard**: —
- **status**: `todo`
- **executor_notes**:
- **verification_result**:
- **blocker**: `none`

---

### T22: Crear hooks de formulario para Certification

- **agent**: executor
- **spec_refs**: Delta Spec Section 6.2, Section 6.3
- **goal**: Crear `src/hooks/certification/useCertificationForm.ts` con CertificationFormValues usando Dayjs para issueDate y expirationDate.
- **scope**: Un hook de formulario.
- **out_of_scope**: Página.
- **inputs**: Patrón de useExperienceForm.ts, Delta Spec Section 6.2 + 6.3, provider de T09.
- **implementation_notes**:
  - CertificationFormValues: name, nameEng, issuingOrganization, issuingOrganizationEng, issueDate?: Dayjs, expirationDate?: Dayjs, verificationUrl?, credentialId?, description?, descriptionEng?, summaryPdf?, summaryPdfEng?.
  - Conversion dayjs/string para issueDate y expirationDate.
- **edge_cases**: expirationDate es opcional; puede ser null.
- **done_criteria**: Hook creado con FormValues correctos y conversion de fechas.
- **verification**: `cat src/hooks/certification/useCertificationForm.ts`.
- **dependencies**: T09, T14, T16
- **handoff_context**: T30.
- **source_of_truth**: Delta Spec Section 6.2 + 6.3.
- **stale_terms_guard**: —
- **status**: `todo`
- **executor_notes**:
- **verification_result**:
- **blocker**: `none`

---

### T23: Crear hooks de formulario para Language

- **agent**: executor
- **spec_refs**: Delta Spec Section 6.2
- **goal**: Crear `src/hooks/language/useLanguageForm.ts`.
- **scope**: Un hook de formulario sin campos de fecha.
- **out_of_scope**: Página.
- **inputs**: Patrón de useExperienceForm.ts, Delta Spec Section 6.2, provider de T10.
- **implementation_notes**:
  - LanguageFormValues: language, languageEng, readingLevel, writingLevel, speakingLevel (todos string, sin Dayjs).
  - Sin conversion de fechas.
- **edge_cases**: Todos los campos son requeridos.
- **done_criteria**: Hook creado sin conversion de fechas.
- **verification**: `cat src/hooks/language/useLanguageForm.ts`.
- **dependencies**: T10, T14, T17
- **handoff_context**: T31.
- **source_of_truth**: Delta Spec Section 6.2.
- **stale_terms_guard**: —
- **status**: `todo`
- **executor_notes**:
- **verification_result**:
- **blocker**: `none`

---

### T24: Crear hooks de formulario para Reference

- **agent**: executor
- **spec_refs**: Delta Spec Section 6.2
- **goal**: Crear `src/hooks/reference/useReferenceForm.ts`.
- **scope**: Un hook de formulario sin campos de fecha.
- **out_of_scope**: Página.
- **inputs**: Patrón de useExperienceForm.ts, Delta Spec Section 6.2, provider de T11.
- **implementation_notes**:
  - ReferenceFormValues: fullName, position (requeridos), company?, companyEng?, email?, phone?, relationship?, relationshipEng?.
  - Sin conversion de fechas.
- **edge_cases**: email y phone son sensibles.
- **done_criteria**: Hook creado sin conversion de fechas.
- **verification**: `cat src/hooks/reference/useReferenceForm.ts`.
- **dependencies**: T11, T14, T18
- **handoff_context**: T32.
- **source_of_truth**: Delta Spec Section 6.2.
- **stale_terms_guard**: —
- **status**: `todo`
- **executor_notes**:
- **verification_result**:
- **blocker**: `none`

---

### T25: Crear hooks de formulario para CustomSection

- **agent**: executor
- **spec_refs**: Delta Spec Section 6.2
- **goal**: Crear `src/hooks/custom-section/useCustomSectionForm.ts`.
- **scope**: Un hook de formulario sin campos de fecha.
- **out_of_scope**: Página.
- **inputs**: Patrón de useExperienceForm.ts, Delta Spec Section 6.2, provider de T12.
- **implementation_notes**:
  - CustomSectionFormValues: title, titleEng, content?, contentEng?, summaryPdf?, summaryPdfEng?, visible: boolean.
  - Sin conversion de fechas.
- **edge_cases**: visible es boolean requerido.
- **done_criteria**: Hook creado sin conversion de fechas.
- **verification**: `cat src/hooks/custom-section/useCustomSectionForm.ts`.
- **dependencies**: T12, T14, T19
- **handoff_context**: T33.
- **source_of_truth**: Delta Spec Section 6.2.
- **stale_terms_guard**: —
- **status**: `todo`
- **executor_notes**:
- **verification_result**:
- **blocker**: `none`

---

### T26: Crear hooks de formulario para FuturedProject

- **agent**: executor
- **spec_refs**: Delta Spec Section 6.2
- **goal**: Crear `src/hooks/futured-project/useFuturedProjectForm.ts`.
- **scope**: Un hook de formulario sin campos de fecha, con estado para Experience seleccionada.
- **out_of_scope**: Página, ExperienceSelector.
- **inputs**: Patrón de useExperienceForm.ts, Delta Spec Section 6.2, provider de T13.
- **implementation_notes**:
  - FuturedProjectFormValues: name, nameEng, experienceId?: number, descriptionShort, description, descriptionShortEng, descriptionEng, imageListUrlId?: number, imageUrlId?: number.
  - Sin conversion de fechas.
  - Incluir estado selectedExperience y handler handleExperienceSelect (similar a selectedSkillSons en useExperienceForm).
- **edge_cases**: experienceId es requerido en el payload pero opcional en FormValues (se selecciona via ExperienceSelector).
- **done_criteria**: Hook creado con selectedExperience state y handler.
- **verification**: `cat src/hooks/futured-project/useFuturedProjectForm.ts`.
- **dependencies**: T13, T14, T20
- **handoff_context**: T34.
- **source_of_truth**: Delta Spec Section 6.2 + useExperienceForm.ts (patrón de selectedSkillSons).
- **stale_terms_guard**: —
- **status**: `todo`
- **executor_notes**:
- **verification_result**:
- **blocker**: `none`

---

### T27: Crear componente ExperienceSelector

- **agent**: executor
- **spec_refs**: Delta Spec Section 7.2
- **goal**: Crear `src/components/resource-selector/ExperienceSelector.tsx` siguiendo el patrón de `SkillSonSelector.tsx`.
- **scope**: Un componente selector de Experience.
- **out_of_scope**: Página FuturedProject.
- **inputs**:
  - Patrón de `src/components/resource-selector/SkillSonSelector.tsx`.
  - Delta Spec Section 7.2 (código completo del componente).
  - getExperiences y ExperienceResponse ya existen en el barrel export.
- **implementation_notes**:
  - Crear `src/components/resource-selector/ExperienceSelector.tsx`.
  - Props: selectionMode (default "single"), buttonLabel, title, initialSelectedIds, onConfirm, disabled.
  - Carga datos con getExperiences().
  - Columnas: ID, company, position.
  - Usa ResourceSelectorModal.
- **edge_cases**:
  - selectionMode default es "single" (diferente de SkillSonSelector que es "multiple").
  - getExperiences ya existe en barrel export (no crear provider).
- **done_criteria**:
  - `src/components/resource-selector/ExperienceSelector.tsx` existe.
  - Sigue patrón de SkillSonSelector.tsx.
  - Usa getExperiences del barrel export.
- **verification**: `cat src/components/resource-selector/ExperienceSelector.tsx`.
- **dependencies**: T14
- **handoff_context**: T28 (export), T34 (FuturedProjectPage).
- **source_of_truth**: Delta Spec Section 7.2 + SkillSonSelector.tsx.
- **stale_terms_guard**: —
- **status**: `todo`
- **executor_notes**:
- **verification_result**:
- **blocker**: `none`

---

### T28: Exportar ExperienceSelector en components/index.ts

- **agent**: executor
- **spec_refs**: Delta Spec Section 7.2
- **goal**: Agregar export de ExperienceSelector en `src/components/resource-selector/index.ts` y `src/components/index.ts`.
- **scope**: Modificar dos archivos de barrel export.
- **out_of_scope**: Crear el componente (ya hecho en T27).
- **inputs**:
  - `src/components/resource-selector/index.ts` (7 líneas actuales).
  - `src/components/index.ts` (13 líneas actuales).
- **implementation_notes**:
  - En `resource-selector/index.ts`: agregar `export { ExperienceSelector } from "./ExperienceSelector";`
  - En `components/index.ts`: agregar `ExperienceSelector` al import desde `./resource-selector` y al export.
- **edge_cases**: No duplicar exports existentes.
- **done_criteria**:
  - `src/components/resource-selector/index.ts` exporta ExperienceSelector.
  - `src/components/index.ts` exporta ExperienceSelector.
- **verification**: `cat` de ambos archivos.
- **dependencies**: T27
- **handoff_context**: T34 (FuturedProjectPage importa desde components).
- **source_of_truth**: Delta Spec Section 7.2.
- **stale_terms_guard**: —
- **status**: `todo`
- **executor_notes**:
- **verification_result**:
- **blocker**: `none`

---

### T29: Crear CoursePage.tsx

- **agent**: executor
- **spec_refs**: Delta Spec Section 7, Section 7.1
- **goal**: Crear `src/pages/course/CoursePage.tsx` con CRUD completo siguiendo el patrón de `ExperiencePage.tsx`.
- **scope**: Una página con vista de lista (Table) y vista de formulario (Form), toggle entre vistas.
- **out_of_scope**: Hooks (ya creados), interfaces, providers.
- **inputs**:
  - Patrón de `src/pages/experience/ExperiencePage.tsx`.
  - Hooks de T15 (useCourseList) y T21 (useCourseForm).
  - Delta Spec Section 7 (patrón de páginas).
- **implementation_notes**:
  - Crear directorio `src/pages/course/`.
  - Estado `view: "list" | "create" | "edit"`.
  - Vista lista: Table con columnas para name, institution, completionDate, acciones (editar, eliminar).
  - Vista formulario: Form con campos name/nameEng, institution/institutionEng (lado a lado), completionDate (DatePicker), description/descriptionEng (RichTextEditor), summaryPdf/summaryPdfEng (Input.TextArea), certificateUrl (Input).
  - SectionHeader con botón "Volver" para volver a lista.
  - LoadingBlock para estados de carga.
  - Popconfirm para eliminación.
  - Campos multi-idioma en filas de 2 columnas (ES/EN).
- **edge_cases**:
  - completionDate usa DatePicker de Ant Design con format "YYYY-MM-DD".
  - description y descriptionEng usan RichTextEditor (importar de components).
  - summaryPdf y summaryPdfEng usan Input.TextArea para URLs de PDF.
- **done_criteria**:
  - `src/pages/course/CoursePage.tsx` existe.
  - CRUD completo: listar, crear, editar, eliminar.
  - Sigue patrón de ExperiencePage.tsx.
  - Usa useCourseList y useCourseForm.
- **verification**: `cat src/pages/course/CoursePage.tsx`.
- **dependencies**: T15, T21
- **handoff_context**: T36 (Home/index.tsx importa CoursePage).
- **source_of_truth**: Delta Spec Section 7 + ExperiencePage.tsx.
- **stale_terms_guard**: —
- **status**: `todo`
- **executor_notes**:
- **verification_result**:
- **blocker**: `none`

---

### T30: Crear CertificationPage.tsx

- **agent**: executor
- **spec_refs**: Delta Spec Section 7
- **goal**: Crear `src/pages/certification/CertificationPage.tsx` con CRUD completo.
- **scope**: Una página con lista y formulario.
- **out_of_scope**: Hooks, interfaces, providers.
- **inputs**: Patrón de ExperiencePage.tsx, hooks de T16 y T22, Delta Spec Section 7.
- **implementation_notes**:
  - Campos: name/nameEng, issuingOrganization/issuingOrganizationEng, issueDate/expirationDate (DatePicker), verificationUrl, credentialId, description/descriptionEng (RichTextEditor), summaryPdf/summaryPdfEng (TextArea).
  - Mismo patrón que T29.
- **edge_cases**: expirationDate es opcional.
- **done_criteria**: Página creada con CRUD completo.
- **verification**: `cat src/pages/certification/CertificationPage.tsx`.
- **dependencies**: T16, T22
- **handoff_context**: T36.
- **source_of_truth**: Delta Spec Section 7.
- **stale_terms_guard**: —
- **status**: `todo`
- **executor_notes**:
- **verification_result**:
- **blocker**: `none`

---

### T31: Crear LanguagePage.tsx

- **agent**: executor
- **spec_refs**: Delta Spec Section 7
- **goal**: Crear `src/pages/language/LanguagePage.tsx` con CRUD completo.
- **scope**: Una página con lista y formulario.
- **out_of_scope**: Hooks, interfaces, providers.
- **inputs**: Patrón de ExperiencePage.tsx, hooks de T17 y T23, Delta Spec Section 7.
- **implementation_notes**:
  - Campos: language/languageEng, readingLevel, writingLevel, speakingLevel.
  - Para readingLevel, writingLevel, speakingLevel: usar Select con opciones (Básico, Intermedio, Avanzado, Nativo) o Input según el patrón existente.
  - Sin campos de fecha ni HTML.
- **edge_cases**: Todos los campos son requeridos.
- **done_criteria**: Página creada con CRUD completo.
- **verification**: `cat src/pages/language/LanguagePage.tsx`.
- **dependencies**: T17, T23
- **handoff_context**: T36.
- **source_of_truth**: Delta Spec Section 7.
- **stale_terms_guard**: —
- **status**: `todo`
- **executor_notes**:
- **verification_result**:
- **blocker**: `none`

---

### T32: Crear ReferencePage.tsx

- **agent**: executor
- **spec_refs**: Delta Spec Section 7
- **goal**: Crear `src/pages/reference/ReferencePage.tsx` con CRUD completo.
- **scope**: Una página con lista y formulario.
- **out_of_scope**: Hooks, interfaces, providers.
- **inputs**: Patrón de ExperiencePage.tsx, hooks de T18 y T24, Delta Spec Section 7.
- **implementation_notes**:
  - Campos: fullName, position, company/companyEng, email, phone, relationship/relationshipEng.
  - Sin campos de fecha ni HTML.
  - email y phone son opcionales.
- **edge_cases**: email y phone son sensibles; no exponer en logs.
- **done_criteria**: Página creada con CRUD completo.
- **verification**: `cat src/pages/reference/ReferencePage.tsx`.
- **dependencies**: T18, T24
- **handoff_context**: T36.
- **source_of_truth**: Delta Spec Section 7.
- **stale_terms_guard**: —
- **status**: `todo`
- **executor_notes**:
- **verification_result**:
- **blocker**: `none`

---

### T33: Crear CustomSectionPage.tsx

- **agent**: executor
- **spec_refs**: Delta Spec Section 7, Section 7.1
- **goal**: Crear `src/pages/custom-section/CustomSectionPage.tsx` con CRUD completo + indicador de visibilidad.
- **scope**: Una página con lista y formulario, con Tag de visibilidad en la tabla.
- **out_of_scope**: Hooks, interfaces, providers.
- **inputs**: Patrón de ExperiencePage.tsx, hooks de T19 y T25, Delta Spec Section 7.1.
- **implementation_notes**:
  - Campos: title/titleEng, content/contentEng (RichTextEditor), summaryPdf/summaryPdfEng (TextArea), visible (Switch o Checkbox).
  - **Diferencia especial** (Section 7.1): Columna "Estado" en la Table con Tag verde "Visible" o gris "Oculto" según campo visible.
  - Código del Tag:
    ```tsx
    {
      title: "Estado",
      dataIndex: "visible",
      render: (visible: boolean) => (
        <Tag color={visible ? "green" : "default"}>
          {visible ? "Visible" : "Oculto"}
        </Tag>
      ),
    }
    ```
- **edge_cases**: visible es boolean requerido.
- **done_criteria**:
  - Página creada con CRUD completo.
  - Columna "Estado" con Tag de visibilidad en la tabla.
- **verification**: `cat src/pages/custom-section/CustomSectionPage.tsx`.
- **dependencies**: T19, T25
- **handoff_context**: T36.
- **source_of_truth**: Delta Spec Section 7 + 7.1.
- **stale_terms_guard**: —
- **status**: `todo`
- **executor_notes**:
- **verification_result**:
- **blocker**: `none`

---

### T34: Crear FuturedProjectPage.tsx

- **agent**: executor
- **spec_refs**: Delta Spec Section 7, Section 7.2
- **goal**: Crear `src/pages/futured-project/FuturedProjectPage.tsx` con CRUD completo + ExperienceSelector.
- **scope**: Una página con lista y formulario que incluye selector de Experience.
- **out_of_scope**: Hooks, interfaces, providers, ExperienceSelector.
- **inputs**:
  - Patrón de ExperiencePage.tsx.
  - Hooks de T20 (useFuturedProjectList) y T26 (useFuturedProjectForm).
  - ExperienceSelector de T27/T28.
  - Delta Spec Section 7.2.
- **implementation_notes**:
  - Campos: name/nameEng, experienceId (via ExperienceSelector), descriptionShort/descriptionShortEng (TextArea), description/descriptionEng (RichTextEditor), imageListUrlId (ImageSelector), imageUrlId (ImageSelector).
  - **Diferencia especial** (Section 7.2): Incluir ExperienceSelector en el formulario para seleccionar la experiencia relacionada.
  - Usar handleExperienceSelect del hook (similar a handleSkillSonsSelect en useExperienceForm).
  - ImageSelector ya existe en components (importar de components).
- **edge_cases**:
  - experienceId es requerido; validar que se seleccione antes de enviar.
  - imageListUrlId e imageUrlId son opcionales.
- **done_criteria**:
  - Página creada con CRUD completo.
  - ExperienceSelector integrado en el formulario.
  - ImageSelector integrado para imágenes.
- **verification**: `cat src/pages/futured-project/FuturedProjectPage.tsx`.
- **dependencies**: T20, T26, T27, T28
- **handoff_context**: T36.
- **source_of_truth**: Delta Spec Section 7 + 7.2.
- **stale_terms_guard**: —
- **status**: `todo`
- **executor_notes**:
- **verification_result**:
- **blocker**: `none`

---

### T35: Actualizar MENU_KEYS en useHomePage.ts

- **agent**: executor
- **spec_refs**: Delta Spec Section 2 (D2), Section 3.3
- **goal**: Agregar 6 nuevas entradas en `MENU_KEYS` en `src/hooks/home/useHomePage.ts`.
- **scope**: Modificar el objeto MENU_KEYS agregando COURSES, CERTIFICATIONS, LANGUAGES, REFERENCES, CUSTOM_SECTIONS, FUTURED_PROJECTS.
- **out_of_scope**: MENU_ITEMS, renderizado condicional, App.tsx.
- **inputs**:
  - `src/hooks/home/useHomePage.ts` actual (MENU_KEYS con 12 entries).
  - Delta Spec D2: nuevas keys.
- **implementation_notes**:
  - Agregar al objeto MENU_KEYS:
    ```typescript
    COURSES: "courses",
    CERTIFICATIONS: "certifications",
    LANGUAGES: "languages",
    REFERENCES: "references",
    CUSTOM_SECTIONS: "custom-sections",
    FUTURED_PROJECTS: "futured-projects",
    ```
  - No modificar nada más en el archivo.
- **edge_cases**: No duplicar keys existentes.
- **done_criteria**:
  - MENU_KEYS tiene 18 entries (12 originales + 6 nuevas).
  - Keys coinciden exactamente con Delta Spec D2.
- **verification**: `cat src/hooks/home/useHomePage.ts` muestra las 6 nuevas keys.
- **dependencies**: —
- **handoff_context**: T36 (Home/index.tsx usa MENU_KEYS).
- **source_of_truth**: Delta Spec Section 2 D2.
- **stale_terms_guard**: —
- **status**: `todo`
- **executor_notes**:
- **verification_result**:
- **blocker**: `none`

---

### T36: Actualizar MENU_ITEMS y renderizado condicional en Home/index.tsx

- **agent**: executor
- **spec_refs**: Delta Spec Section 2 (D2), Section 3.3
- **goal**: Reestructurar MENU_ITEMS con submenús agrupados y agregar renderizado condicional para las 6 nuevas páginas en `src/pages/home/index.tsx`.
- **scope**: Modificar `src/pages/home/index.tsx`: imports, MENU_ITEMS, renderizado condicional.
- **out_of_scope**: useHomePage.ts (ya hecho en T35), App.tsx.
- **inputs**:
  - `src/pages/home/index.tsx` actual (MENU_ITEMS plano, 12 items, renderizado condicional).
  - Delta Spec D2: estructura completa de MENU_ITEMS con submenús.
  - Nuevas páginas de T29-T34.
- **implementation_notes**:
  - **Imports**: Agregar imports de CoursePage, CertificationPage, LanguagePage, ReferencePage, CustomSectionPage, FuturedProjectPage.
  - **MENU_ITEMS**: Reemplazar el array plano con la estructura de submenús de Delta Spec D2 (8 grupos con `type: "submenu"` y `children`).
  - **Renderizado condicional**: Agregar 6 nuevos bloques `activeMenuKey === MENU_KEYS.XXX ? (<XxxPage />)` en el Content.
  - Mantener los 12 renderizados existentes.
  - El último else debe mantenerse para ImagePage (o agregar caso explicito).
- **edge_cases**:
  - La estructura de submenús usa `type: "submenu"` (Ant Design 5.x), no el componente `<SubMenu>`.
  - Los iconos de los submenús deben importarse de `@ant-design/icons`.
  - Verificar que todos los MENU_KEYS usados en MENU_ITEMS existan (T35 debe estar completa).
- **done_criteria**:
  - MENU_ITEMS tiene 8 submenús con children.
  - 6 nuevas páginas importadas y renderizadas condicionalmente.
  - 12 páginas existentes siguen funcionando.
  - Iconos importados correctamente.
- **verification**: `cat src/pages/home/index.tsx` muestra estructura de submenús y 18 renderizados condicionales.
- **dependencies**: T29, T30, T31, T32, T33, T34, T35
- **handoff_context**: T37 (verificación).
- **source_of_truth**: Delta Spec Section 2 D2.
- **stale_terms_guard**: —
- **status**: `todo`
- **executor_notes**:
- **verification_result**:
- **blocker**: `none`

---

### T37: Verificación de no regresión y pruebas manuales

- **agent**: executor
- **spec_refs**: Delta Spec Section 10 (CA1-CA7), Section 11
- **goal**: Verificar que todas las entidades (existentes + nuevas) funcionan correctamente con el nuevo contrato API.
- **scope**: Pruebas manuales de CRUD para todas las entidades y verificación de no regresión.
- **out_of_scope**: Cambios de código (solo verificación).
- **inputs**:
  - Delta Spec Section 10 (Criterios de Aceptación CA1-CA7).
  - Aplicación corriendo con `VITE_API_URL` configurado.
- **implementation_notes**:
  - Verificar CA1: Login funciona, challenge Altcha funciona, 12 entidades existentes funcionan.
  - Verificar CA2: Crear entidad nueva refresca lista después de `{ id }`.
  - Verificar CA3: Update/Delete refresca lista después de 204.
  - Verificar CA4: Errores de validación muestran notificación, 401 redirige a login.
  - Verificar CA5: 6 nuevas páginas con CRUD completo, menú lateral con submenús.
  - Verificar CA6: Formularios con campos multi-idioma, RichTextEditor, TextArea, validación.
  - Verificar CA7: No regresión en páginas existentes, login, navegación, modo oscuro/claro.
  - Ejecutar `npm run build` o `npm run dev` para verificar que no hay errores de compilación.
  - Ejecutar `npx tsc --noEmit` para verificar tipos.
- **edge_cases**:
  - Si alguna entidad existente falla, revisar que `VITE_API_URL` esté correcto.
  - Si alguna nueva entidad falla, revisar provider/hook/page correspondiente.
- **done_criteria**:
  - `npx tsc --noEmit` pasa sin errores.
  - `npm run build` pasa sin errores.
  - Todas las verificaciones de CA1-CA7 marcadas como completadas.
  - Documentar resultados en `executor_notes` de esta tarea.
- **verification**: Output de `tsc --noEmit` y `npm run build` sin errores.
- **dependencies**: T01, T36
- **handoff_context**: Cierre del incremento.
- **source_of_truth**: Delta Spec Section 10.
- **stale_terms_guard**: —
- **status**: `todo`
- **executor_notes**:
- **verification_result**:
- **blocker**: `none`

---

## Execution Order (Parallel Groups)

| Group | Tasks | Can Run In Parallel |
|---|---|---|
| 1 | T01, T02, T03, T04, T05, T06, T07, T35 | Sí (independientes) |
| 2 | T08, T09, T10, T11, T12, T13 | Sí (dependen de T02-T07 respectivamente) |
| 3 | T14 | No (depende de T08-T13) |
| 4 | T15, T16, T17, T18, T19, T20 | Sí (dependen de T14 + provider individual) |
| 5 | T21, T22, T23, T24, T25, T26 | Sí (dependen de T15-T20 respectivamente) |
| 6 | T27 | No (depende de T14) |
| 7 | T28 | No (depende de T27) |
| 8 | T29, T30, T31, T32, T33 | Sí (dependen de hooks individuales) |
| 9 | T34 | No (depende de T20, T26, T27, T28) |
| 10 | T36 | No (depende de T29-T34, T35) |
| 11 | T37 | No (depende de T01, T36) |
