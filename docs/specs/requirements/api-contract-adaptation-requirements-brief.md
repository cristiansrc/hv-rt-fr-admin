# Requirements Brief - Adaptación de hv-rt-fr-admin al Contrato API de Go

**Status**: `ready-for-planner`
**Fecha**: 2026-06-01
**Owner**: cristiansrc
**Proyecto**: `hv-rt-fr-admin`
**Incremento**: `api-contract-adaptation`

---

## 1. Objetivo

Adaptar el panel de administración `hv-rt-fr-admin` (React 19 + Refine + Ant Design) para que consuma correctamente el nuevo contrato API del microservicio `hv-go-ms-resume` (Go 1.22+), resultante de la migración desde Spring Boot.

Esto incluye:
- Actualizar todos los endpoints consumidos para usar el prefijo de ruta `/v1/ms-resume/`.
- Adaptar el manejo de respuestas de creación (ahora retornan `{ id }` en lugar de la entidad completa).
- Adaptar el manejo de respuestas de actualización/eliminación (ahora retornan `204 No Content`).
- Agregar páginas de administración para las 5 nuevas entidades: Cursos, Certificaciones, Idiomas, Referencias y Secciones Personalizadas.
- Agregar página de administración para Proyectos Destacados (existe en la API pero no tiene página en el admin).
- Asegurar compatibilidad con el nuevo formato de errores `ApiErrorResponse`.

---

## 2. Contexto

El ecosistema del portfolio/CV (`cristiansrc.com`) migró su backend de Spring Boot a Go 1.22+ (`hv-go-ms-resume`). Durante esta migración:

- **Se estandarizó el prefijo de rutas**: Todos los endpoints ahora usan `/v1/ms-resume/` como base.
- **Se estandarizaron las respuestas de error**: Ahora usan el formato `ApiErrorResponse` con campos `timestamp`, `status`, `error`, `code`, `message`, `path`, `trace_id`, `details[]`.
- **Se simplificaron las respuestas de creación**: Ahora retornan `{ id: number }` en lugar de la entidad completa.
- **Se simplificaron las respuestas de actualización/eliminación**: Ahora retornan `204 No Content` sin body.
- **Se agregaron 5 nuevas entidades**: Course, Certification, Language, Reference, CustomSection.
- **Se agregaron 2 nuevos endpoints públicos**: `/public/templates` y `/public/languages` (para selección de PDF).
- **Se mantuvieron las respuestas 200**: Los schemas de respuesta para lectura (GET) son idénticos al contrato anterior para no romper los frontends.

El admin panel (`hv-rt-fr-admin`) fue creado antes de esta migración y no tiene las skills de calidad aplicadas. Actualmente consume endpoints sin el prefijo `/v1/ms-resume/` y espera respuestas en el formato antiguo.

**Relación con el sistema actual**:
- El admin panel está deployado en Vercel y activo.
- Se comunica con `hv-go-ms-resume` vía HTTPS.
- Usa autenticación JWT + Altcha para login.
- Usa Refine como framework base con `simple-rest` dataProvider.

---

## 3. Actores y Permisos

| Actor | Rol | Permisos | Acceso |
|---|---|---|---|
| **Administrador (cristiansrc)** | Owner único | CRUD completo de todas las entidades, gestión de multimedia, login con Altcha | Panel admin completo vía JWT Bearer Token |

**Nota**: No hay multi-usuario ni roles diferenciados. El administrador es un único usuario (single-owner).

---

## 4. Alcance (Scope)

### 4.1 Entidades Existentes que Requieren Adaptación de Endpoints

El admin panel actualmente consume las siguientes entidades. Todas necesitan que sus endpoints se actualicen con el prefijo `/v1/ms-resume/`:

| # | Entidad | Endpoint Actual (Admin) | Endpoint Nuevo (Go API) | Operaciones |
|---|---|---|---|---|
| E1 | **BasicData** | `/basic-data/1` | `/v1/ms-resume/basic-data/1` | GET, PUT |
| E2 | **Home** | `/home/{id}` | `/v1/ms-resume/home/{id}` | GET, PUT |
| E3 | **Label** | `/label` | `/v1/ms-resume/label` | GET, POST, GET by ID, PUT, DELETE |
| E4 | **ImageUrl** | `/image-url` | `/v1/ms-resume/image-url` | GET, POST, GET by ID, DELETE |
| E5 | **VideoUrl** | `/video-url` | `/v1/ms-resume/video-url` | GET, POST, GET by ID, DELETE |
| E6 | **Blog** | `/blog` | `/v1/ms-resume/blog` | GET (paginado), POST, GET by ID, PUT, DELETE |
| E7 | **BlogType** | `/blog-type` | `/v1/ms-resume/blog-type` | GET, POST, GET by ID, PUT, DELETE |
| E8 | **SkillType** | `/skill-type` | `/v1/ms-resume/skill-type` | GET, POST, GET by ID, PUT, DELETE |
| E9 | **Skill** | `/skill` | `/v1/ms-resume/skill` | GET, POST, GET by ID, PUT, DELETE |
| E10 | **SkillSon** | `/skill-son` | `/v1/ms-resume/skill-son` | GET, POST, GET by ID, PUT, DELETE |
| E11 | **Experience** | `/experience` | `/v1/ms-resume/experience` | GET, POST, GET by ID, PUT, DELETE |
| E12 | **Education** | `/education` | `/v1/ms-resume/education` | GET, POST, GET by ID, PUT, DELETE |

### 4.2 Endpoints de Autenticación que Requieren Adaptación

| # | Endpoint | Endpoint Actual (Admin) | Endpoint Nuevo (Go API) |
|---|---|---|---|
| A1 | **Login** | `${API_URL}/login` | `${API_URL}/v1/ms-resume/login` |
| A2 | **Altcha Challenge** | `${API_URL}/public/challenge` | `${API_URL}/v1/ms-resume/public/challenge` |

### 4.3 Nuevas Entidades que Requieren Páginas de Administración

| # | Entidad | Endpoint CRUD | Descripción | Campos Clave |
|---|---|---|---|---|
| N1 | **Course** | `/v1/ms-resume/course` | Cursos completados | name/nameEng, institution/institutionEng, completionDate, description/descriptionEng (HTML), summaryPdf/summaryPdfEng (texto), certificateUrl (opcional) |
| N2 | **Certification** | `/v1/ms-resume/certification` | Certificaciones profesionales | name/nameEng, issuingOrganization/issuingOrganizationEng, issueDate, expirationDate (opcional), verificationUrl, credentialId, description/descriptionEng (HTML), summaryPdf/summaryPdfEng (texto) |
| N3 | **Language** | `/v1/ms-resume/language` | Idiomas conocidos | language/languageEng, readingLevel, writingLevel, speakingLevel |
| N4 | **Reference** | `/v1/ms-resume/reference` | Referencias profesionales | fullName, position, company/companyEng, email, phone, relationship/relationshipEng |
| N5 | **CustomSection** | `/v1/ms-resume/custom-section` | Secciones de contenido libre | title/titleEng, content/contentEng (HTML), summaryPdf/summaryPdfEng (texto), visible (boolean) |
| N6 | **FuturedProject** | `/v1/ms-resume/futured-project` | Proyectos destacados | name/nameEng, experienceId (ref), descriptionShort/descriptionShortEng, description/descriptionEng, imageListUrlId (ref), imageUrlId (ref) |

### 4.4 Adaptación de Formato de Respuestas

| Tipo de Respuesta | Comportamiento Actual (Admin espera) | Comportamiento Nuevo (Go API) | Impacto |
|---|---|---|---|
| **CREATE** | Entidad completa en response body | `{ id: number }` | El admin debe adaptar su lógica post-creación |
| **UPDATE** | Entidad actualizada en response body | `204 No Content` (sin body) | El admin debe adaptar su lógica post-actualización |
| **DELETE** | Confirmación o entidad en response body | `204 No Content` (sin body) | El admin debe adaptar su lógica post-eliminación |
| **ERROR** | Formato Spring Boot | `ApiErrorResponse` con `{ timestamp, status, error, code, message, path, trace_id, details[] }` | El admin debe parsear el nuevo formato para mostrar mensajes al usuario |
| **GET (200)** | Schema de entidad | **Sin cambios** - mismo schema | Compatible, no requiere adaptación |

---

## 5. No Objetivos (Out of Scope)

- **Cambiar el stack tecnológico del admin panel**: Se mantiene React 19 + Refine + Ant Design.
- **Implementar multi-usuario o gestión de roles**: El sistema sigue siendo single-owner.
- **Agregar analytics o métricas al admin panel**: No se requiere tracking de uso del panel.
- **Cambiar la estrategia de autenticación**: Se mantiene JWT + Altcha.
- **Implementar refresh tokens**: No está en el contrato actual (JWT válido 24h).
- **Modificar el contrato API del backend**: El admin se adapta al contrato existente, no al revés.
- **Agregar funcionalidades de edición de PDF desde el admin**: La generación de PDFs es responsabilidad del servicio de renderizado.
- **Implementar subida directa de archivos a S3 desde el admin**: El servicio solo registra URLs de archivos ya subidos.
- **Cualquier funcionalidad nueva no listada en la sección 4.3**: Queda para iteraciones futuras.

---

## 6. Flujos de Usuario

### 6.1 Flujo: Login del Administrador (Adaptado)

1. El administrador ingresa usuario, contraseña y resuelve Altcha en la página de login.
2. El frontend envía credenciales + respuesta Altcha a `POST ${API_URL}/v1/ms-resume/login`.
3. Si la autenticación es exitosa, recibe `{ token: string }` y lo almacena.
4. El administrador es redirigido al dashboard principal.

**Caso alterno**: Credenciales inválidas o Altcha inválido → muestra error usando el campo `message` del `ApiErrorResponse`.
**Caso alterno**: Error de conexión → muestra mensaje de error genérico.

### 6.2 Flujo: Gestión de Entidades Existentes (CRUD adaptado)

1. El administrador navega a la sección de una entidad (ej: Experiencias).
2. El frontend lista las entidades usando `GET /v1/ms-resume/<entidad>`.
3. Para crear: el administrador completa el formulario y envía `POST /v1/ms-resume/<entidad>`.
4. El servicio retorna `{ id }` → el frontend debe refrescar la lista o agregar la entidad manualmente.
5. Para actualizar: el administrador edita y envía `PUT /v1/ms-resume/<entidad>/{id}`.
6. El servicio retorna `204 No Content` → el frontend debe refrescar la lista o actualizar localmente.
7. Para eliminar: el administrador confirma y envía `DELETE /v1/ms-resume/<entidad>/{id}`.
8. El servicio retorna `204 No Content` → el frontend debe remover la entidad de la lista.

**Caso alterno**: Error de validación → muestra los detalles del `ApiErrorResponse.details[]` en el formulario.
**Caso alterno**: Token expirado → redirige al login.

### 6.3 Flujo: Gestión de Nuevas Entidades (Cursos, Certificaciones, Idiomas, Referencias, Secciones Custom, Proyectos Destacados)

1. El administrador navega a la nueva sección desde el menú lateral.
2. El frontend lista las entidades usando `GET /v1/ms-resume/<entidad>`.
3. Para crear: el administrador completa el formulario y envía `POST /v1/ms-resume/<entidad>`.
4. El servicio retorna `{ id }` → el frontend refresca la lista.
5. Para actualizar: el administrador edita y envía `PUT /v1/ms-resume/<entidad>/{id}`.
6. El servicio retorna `204 No Content` → el frontend refresca la lista.
7. Para eliminar: el administrador confirma y envía `DELETE /v1/ms-resume/<entidad>/{id}`.
8. El servicio retorna `204 No Content` → el frontend remueve la entidad de la lista.

**Nota**: Las nuevas entidades siguen el mismo patrón multi-idioma (campos ES/EN) y separación HTML/Texto que las existentes.

### 6.4 Flujo: Gestión de Proyectos Destacados

1. El administrador navega a la sección "Proyectos Destacados".
2. El frontend lista los proyectos usando `GET /v1/ms-resume/futured-project`.
3. Para crear: el administrador completa el formulario seleccionando una experiencia existente y opcionalmente imágenes.
4. Para actualizar/eliminar: mismo flujo que otras entidades.

**Nota**: Los proyectos destacados tienen una relación con Experience (experienceId) y referencias a ImageUrl (imageListUrlId, imageUrlId).

---

## 7. Entidades Funcionales

### 7.1 Entidades Existentes (sin cambios en schema de respuesta 200)

| Entidad | Descripción | Atributos Clave | Sensibilidad |
|---|---|---|---|
| **BasicData** | Datos personales del titular | firstName, firstSurName, dateBirth, email, redes sociales, descripción (ES/EN), descriptionPdf[], wrapper[] | Email es dato personal |
| **Home** | Configuración del home | greeting (ES/EN), imageUrl (ref), button labels (ES/EN), labels[] (ref) | Ninguna |
| **Label** | Etiquetas del home | name, nameEng | Ninguna |
| **ImageUrl** | Referencias a imágenes S3 | name, nameEng, url | Ninguna |
| **VideoUrl** | Referencias a videos YouTube | name, nameEng, url | Ninguna |
| **Blog** | Artículos del blog | title/titleEng, description/descriptionEng, imageUrl (ref), videoUrl (ref), blogType (ref) | Ninguna |
| **BlogType** | Tipos de blog | name, nameEng | Ninguna |
| **SkillType** | Categorías de habilidades | name, nameEng, skills[] (ref) | Ninguna |
| **Skill** | Habilidades técnicas | name, nameEng, skillSons[] (ref) | Ninguna |
| **SkillSon** | Especializaciones/tecnologías | name, nameEng | Ninguna |
| **Experience** | Experiencia laboral | yearStart, yearEnd, company, position (ES/EN), location (ES/EN), summary (ES/EN), summaryPdf (ES/EN), descriptionItemsPdf[] (ES/EN), skillSons[] (ref) | Ninguna |
| **Education** | Formación académica | institution, area (ES/EN), degree (ES/EN), startDate, endDate, location (ES/EN), highlights[] (ES/EN) | Ninguna |

### 7.2 Nuevas Entidades

| Entidad | Descripción | Atributos Clave | Sensibilidad |
|---|---|---|---|
| **Course** | Cursos completados | name/nameEng, institution/institutionEng, completionDate, description/descriptionEng (HTML portal), summaryPdf/summaryPdfEng (texto PDF), certificateUrl (opcional) | Ninguna |
| **Certification** | Certificaciones profesionales | name/nameEng, issuingOrganization/issuingOrganizationEng, issueDate, expirationDate (opcional), verificationUrl, credentialId, description/descriptionEng (HTML), summaryPdf/summaryPdfEng (texto) | Ninguna |
| **Language** | Idiomas conocidos | language/languageEng, readingLevel, writingLevel, speakingLevel | Ninguna |
| **Reference** | Referencias profesionales | fullName, position, company/companyEng, email, phone, relationship/relationshipEng | Email y teléfono son datos de terceros |
| **CustomSection** | Secciones de contenido libre | title/titleEng, content/contentEng (HTML portal), summaryPdf/summaryPdfEng (texto PDF), visible (boolean) | Ninguna |
| **FuturedProject** | Proyectos destacados | name/nameEng, experienceId (ref), descriptionShort/descriptionShortEng, description/descriptionEng, imageListUrlId (ref), imageUrlId (ref) | Ninguna |

### 7.3 Patrón Multi-idioma y Separación HTML/Texto

Todas las entidades nuevas siguen el mismo patrón que las existentes:
- **Campos de portal**: `description`, `descriptionEng`, `content`, `contentEng` → contienen HTML para renderizar en el portal público.
- **Campos de PDF**: `summaryPdf`, `summaryPdfEng` → contienen texto plano para incluir en el CV generado.
- **Campos duplicados ES/EN**: Cada campo de texto tiene su versión en español e inglés.

---

## 8. Integraciones

| # | Integración | Dirección | Protocolo | Propósito | Criticidad |
|---|---|---|---|---|---|
| I1 | **hv-rt-fr-admin → hv-go-ms-resume** | Outbound | HTTPS REST + JWT | CRUD completo de todas las entidades + login | Alta - el admin depende completamente de esto |
| I2 | **hv-rt-fr-admin → Altcha** | Outbound | HTTP (librería altcha-lib) | Resolver challenge anti-spam para login | Alta - sin esto no hay login |

---

## 9. Seguridad y Restricciones

| Restricción | Descripción |
|---|---|
| **Autenticación JWT** | Todas las operaciones CRUD requieren JWT Bearer Token válido. El token se almacena en `localStorage`. |
| **Altcha en login** | El login requiere validación de challenge Altcha además de credenciales. |
| **Token expirado** | Si el token expira (24h), el admin debe redirigir al login. |
| **Formato de error** | El admin debe parsear el formato `ApiErrorResponse` para mostrar mensajes de error claros al usuario. |
| **Datos sensibles** | Las referencias profesionales contienen email y teléfono de terceros. El admin debe manejar estos datos con cuidado (no exponer en logs, etc.). |
| **Variables de entorno** | `VITE_API_URL` debe apuntar a la URL base correcta (incluyendo o no el prefijo `/v1/ms-resume/` según la estrategia que defina Planner). |

---

## 10. Edge Cases

| # | Escenario | Comportamiento Esperado |
|---|---|---|
| E1 | **Token JWT expirado durante operación CRUD** | Redirigir al login. No perder los datos del formulario si es posible. |
| E2 | **Error de validación en formulario** | Mostrar los detalles del `ApiErrorResponse.details[]` junto a los campos correspondientes. |
| E3 | **Error de conexión al backend** | Mostrar mensaje de error genérico amigable. No redirigir a página de error. |
| E4 | **CREATE retorna `{ id }` pero el frontend espera entidad completa** | El frontend debe refrescar la lista o construir la entidad localmente con el ID recibido. |
| E5 | **UPDATE/DELETE retorna 204 sin body** | El frontend no debe intentar parsear el response body. Debe refrescar la lista o actualizar localmente. |
| E6 | **Entidad referenciada no existe** (ej: experienceId inexistente en FuturedProject) | Mostrar error de validación del backend. |
| E7 | **Duplicados** (ej: mismo idioma duplicado) | Mostrar error 409 Conflict del backend. |
| E8 | **Concurrencia en actualización** | El último request gana. No se requiere locking optimista. |
| E9 | **Campo HTML malformado** | El backend acepta HTML tal cual. La sanitización es responsabilidad del frontend al renderizar. |
| E10 | **Referencia con email/teléfono inválido** | El backend valida formato. Mostrar error de validación en el formulario. |

---

## 11. Criterios de Aceptación

### CA1: Adaptación de Endpoints Existentes
- [ ] Todos los endpoints consumidos por el admin usan el prefijo `/v1/ms-resume/`.
- [ ] El login funciona correctamente con el endpoint `/v1/ms-resume/login`.
- [ ] El challenge Altcha se obtiene correctamente desde `/v1/ms-resume/public/challenge`.
- [ ] Las 12 entidades existentes (BasicData, Home, Label, ImageUrl, VideoUrl, Blog, BlogType, SkillType, Skill, SkillSon, Experience, Education) se pueden listar, crear, actualizar y eliminar sin errores.

### CA2: Adaptación de Respuestas de Creación
- [ ] Al crear una entidad, el frontend maneja correctamente la respuesta `{ id }`.
- [ ] La lista se refresca o se actualiza correctamente después de una creación.
- [ ] Las notificaciones de éxito se muestran correctamente.

### CA3: Adaptación de Respuestas de Actualización/Eliminación
- [ ] Al actualizar una entidad, el frontend maneja correctamente la respuesta `204 No Content`.
- [ ] Al eliminar una entidad, el frontend maneja correctamente la respuesta `204 No Content`.
- [ ] La lista se refresca o se actualiza correctamente después de una actualización/eliminación.

### CA4: Adaptación de Formato de Errores
- [ ] Los errores de validación muestran los detalles del `ApiErrorResponse.details[]` en el formulario.
- [ ] Los errores de autenticación (401) redirigen al login.
- [ ] Los errores de servidor (500) muestran un mensaje amigable sin exponer detalles internos.
- [ ] El campo `message` del `ApiErrorResponse` se usa como mensaje principal de error.

### CA5: Nuevas Páginas de Administración
- [ ] Existe una página de administración para Cursos con CRUD completo.
- [ ] Existe una página de administración para Certificaciones con CRUD completo.
- [ ] Existe una página de administración para Idiomas con CRUD completo.
- [ ] Existe una página de administración para Referencias con CRUD completo.
- [ ] Existe una página de administración para Secciones Personalizadas con CRUD completo (incluyendo toggle de visibilidad).
- [ ] Existe una página de administración para Proyectos Destacados con CRUD completo.
- [ ] Todas las nuevas páginas tienen entradas en el menú lateral.

### CA6: Compatibilidad de Formularios
- [ ] Los formularios de las nuevas entidades incluyen campos multi-idioma (ES/EN).
- [ ] Los formularios de las nuevas entidades separan campos HTML (portal) de campos de texto (PDF).
- [ ] Los formularios de las nuevas entidades validan campos requeridos antes de enviar.
- [ ] Los selectores de entidades relacionadas (experiencias, imágenes) funcionan correctamente.

### CA7: No Regresión
- [ ] Las páginas existentes (Home, Datos Básicos, Blogs, Experiencias, Educación, Habilidades, Labels, Videos, Imágenes) siguen funcionando correctamente.
- [ ] El login sigue funcionando correctamente.
- [ ] La navegación entre secciones funciona correctamente.
- [ ] El modo oscuro/claro funciona correctamente.

---

## 12. Preguntas Abiertas

### Resueltas

| # | Pregunta | Respuesta |
|---|---|---|
| PA1 | ¿El prefijo `/v1/ms-resume/` debe incluirse en `VITE_API_URL` o en cada endpoint? | **Resuelta**: Depende de la estrategia que defina Planner. Ambas opciones son válidas. |
| PA2 | ¿Las respuestas 200 (GET) cambiaron en el schema? | **Resuelta**: No. Los schemas de respuesta 200 son idénticos al contrato anterior. |
| PA3 | ¿Featured Project tiene página en el admin actual? | **Resuelta**: No. Existe en la API pero no tiene página ni entrada de menú en el admin. |

### Críticas (bloquean handoff a Planner)

| # | Pregunta | Impacto |
|---|---|---|
| PA4 | ¿Se debe incluir el prefijo `/v1/ms-resume/` en la variable `VITE_API_URL` (ej: `https://api.cristiansrc.com/v1/ms-resume`) o mantener `VITE_API_URL` como `https://api.cristiansrc.com` y agregar el prefijo en cada provider/endpoint? | Afecta la estrategia de refactorización. Si se incluye en `VITE_API_URL`, el cambio es mínimo (solo env var). Si se agrega en cada endpoint, requiere modificar todos los providers y el dataProvider de Refine. |

### No Críticas (Planner puede decidir)

| # | Pregunta | Impacto |
|---|---|---|
| PA5 | ¿El orden de las nuevas entradas en el menú lateral debe seguir algún criterio específico? | Afecta UX pero no funcionalidad. |
| PA6 | ¿Se deben usar los mismos patrones de formulario y componentes que las páginas existentes o se pueden mejorar? | Afecta consistencia visual y esfuerzo de implementación. |
| PA7 | ¿Se debe implementar paginación en las nuevas listas o se asume que el volumen de datos es bajo? | Afecta complejidad de las nuevas páginas. |
| PA8 | ¿Se debe agregar un indicador de "visible/invisible" en la lista de CustomSections? | Afecta UX de la página de Secciones Personalizadas. |

---

## 13. Supuestos

| # | Supuesto | Validación Requerida |
|---|---|---|
| S1 | Los schemas de respuesta 200 del backend Go son idénticos a los que el admin panel espera actualmente. | Verificar comparando interfaces TypeScript del admin con schemas del OpenAPI. |
| S2 | El admin panel usa `VITE_API_URL` como base y los endpoints se construyen relativamente. | Confirmado por revisión de código (`axiosClient.ts`, `authProvider.ts`, `useAltcha.ts`). |
| S3 | El administrador es un único usuario (single-owner). | Confirmado por el owner. |
| S4 | Las nuevas entidades siguen el mismo patrón multi-idioma y separación HTML/Texto que las existentes. | Confirmado por el OpenAPI del backend Go. |
| S5 | El backend Go ya está implementado y deployado con el contrato descrito en el OpenAPI. | Verificar con el estado de `hv-go-ms-resume`. |
| S6 | No se requiere migración de datos en el frontend (los datos persisten en el backend). | Confirmado por la naturaleza del cambio (solo adaptación de contrato). |
| S7 | El admin panel no almacena estado persistente más allá del token JWT en localStorage. | Confirmado por revisión de código. |

---

## 14. Handoff para Planner

### Resumen Funcional

El panel de administración `hv-rt-fr-admin` necesita adaptarse al nuevo contrato API del microservicio `hv-go-ms-resume` (Go 1.22+). Los cambios principales son:

1. **Prefijo de rutas**: Todos los endpoints ahora usan `/v1/ms-resume/` como base.
2. **Respuestas de creación**: Ahora retornan `{ id }` en lugar de la entidad completa.
3. **Respuestas de actualización/eliminación**: Ahora retornan `204 No Content` sin body.
4. **Formato de errores**: Ahora usan `ApiErrorResponse` con estructura estandarizada.
5. **Nuevas entidades**: 5 nuevas entidades requieren páginas de administración (Course, Certification, Language, Reference, CustomSection).
6. **Entidad faltante**: FuturedProject existe en la API pero no tiene página en el admin.

### Scope y Out of Scope

**Incluye**:
- Adaptar todos los endpoints existentes con el prefijo `/v1/ms-resume/`.
- Adaptar manejo de respuestas de creación (`{ id }`), actualización (204) y eliminación (204).
- Adaptar manejo de errores al formato `ApiErrorResponse`.
- Crear 6 nuevas páginas de administración (Course, Certification, Language, Reference, CustomSection, FuturedProject).
- Agregar entradas de menú para las nuevas páginas.

**Excluye**: Cambio de stack tecnológico, multi-usuario, analytics, refresh tokens, subida directa a S3, edición de PDFs.

### Actores, Permisos y Restricciones

- **Administrador (single-owner)**: CRUD completo vía JWT + Altcha en login.
- **Restricciones**: Token JWT válido requerido para CRUD, Altcha requerido para login, formato de error `ApiErrorResponse`, datos de referencias son sensibles.

### Flujos Principales y Alternos

1. Login (con Altcha) → JWT → Dashboard.
2. CRUD de entidades existentes → Adaptar respuestas `{ id }` y `204 No Content`.
3. CRUD de nuevas entidades → Mismo patrón que existentes.
4. Manejo de errores → Parsear `ApiErrorResponse` para mostrar mensajes.

### Entidades Funcionales y Datos Sensibles

- 12 entidades existentes (sin cambios en schema 200).
- 6 nuevas entidades (Course, Certification, Language, Reference, CustomSection, FuturedProject).
- Patrón multi-idioma (ES/EN) y separación HTML/Texto en todas las entidades.
- Datos sensibles: email del titular, email/teléfono de referencias.

### Integraciones Esperadas y Criticidad

- `hv-go-ms-resume` (alta) - CRUD completo + login.
- `altcha-lib` (alta) - Challenge anti-spam para login.

### Criterios de Aceptación

7 grupos de criterios (CA1-CA7) cubriendo adaptación de endpoints, respuestas de creación, respuestas de update/delete, formato de errores, nuevas páginas, compatibilidad de formularios y no regresión.

### Preguntas Abiertas

- **Crítica (PA4)**: Estrategia para el prefijo `/v1/ms-resume/` (en `VITE_API_URL` vs en cada endpoint). **Planner debe decidir y documentar**.
- **No críticas (PA5-PA8)**: Orden del menú, patrones de formulario, paginación, indicador de visibilidad. Planner puede tomar decisiones razonables.

### Riesgos Funcionales que Planner Debe Resolver

1. **Estrategia de prefijo de rutas**: Definir si el prefijo `/v1/ms-resume/` se incluye en `VITE_API_URL` o se agrega en cada provider/endpoint. Esto afecta el scope del refactor.
2. **Adaptación del dataProvider de Refine**: El `simple-rest` dataProvider puede necesitar un interceptor o customización para manejar el prefijo y las respuestas `{ id }` / `204`.
3. **Manejo de errores en formularios**: Definir cómo mapear `ApiErrorResponse.details[]` a los campos del formulario de Refine/Ant Design.
4. **Consistencia de nuevas páginas**: Definir si las nuevas páginas siguen exactamente los mismos patrones que las existentes o si se pueden mejorar.
5. **Selectores de entidades relacionadas**: FuturedProject requiere seleccionar una Experience y opcionalmente ImageUrls. Planner debe definir cómo implementar estos selectores.

### Decisiones Pendientes para Planner

| Decisión | Contexto |
|---|---|
| Estrategia de prefijo de rutas | ¿En `VITE_API_URL` o en cada endpoint? |
| Customización del dataProvider de Refine | ¿Interceptor global o modificar cada provider? |
| Patrón de formularios para nuevas entidades | ¿Reutilizar componentes existentes o crear nuevos? |
| Paginación en nuevas listas | ¿Usar paginación o listar todo? |
| Orden de entradas en menú lateral | ¿Criterio de agrupación? |
| Manejo de `ApiErrorResponse.details[]` | ¿Mapeo a campos de formulario o mensaje genérico? |
