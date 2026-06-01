# Delta Spec - API Contract Adaptation

**Status**: `decomposition-complete`
**Increment**: `api-contract-adaptation`
**Fecha**: 2026-06-01
**Owner**: planner
**Proyecto**: `hv-rt-fr-admin`
**Parent**: `api-contract-adaptation-requirements-brief.md` (requirements)

---

## 1. Objetivo

Adaptar el panel de administración `hv-rt-fr-admin` (React 19 + Refine + Ant Design) para consumir correctamente el nuevo contrato API del microservicio `hv-go-ms-resume` (Go 1.22+), resultante de la migración desde Spring Boot.

---

## 2. Decisiones Arquitectónicas Locked

### D1: Estrategia de Prefijo de Rutas (Resuelve PA4)

**Decisión**: Incluir el prefijo `/v1/ms-resume` directamente en la variable de entorno `VITE_API_URL`.

**Razonamiento**:
- Cambio mínimo y más limpio: un solo cambio en `.env` en lugar de modificar 14+ providers individualmente.
- Todos los consumidores de `API_URL` se benefician automáticamente: `axiosClient`, `authProvider`, `useAltcha`, `apiDataProvider` de Refine.
- No requiere interceptores ni customización del dataProvider de Refine.
- Los endpoints en los providers se mantienen relativos (ej: `/experience`), lo que es consistente con el patrón actual.

**Impacto**:
- `VITE_API_URL` cambia de `https://api.cristiansrc.com` a `https://api.cristiansrc.com/v1/ms-resume`.
- Los providers existentes NO requieren cambios en sus constantes de endpoint.
- `authProvider.ts` y `useAltcha.ts` NO requieren cambios en sus URLs relativas.
- `App.tsx` NO requiere cambios en el `dataProvider` de Refine.

### D2: Orden del Menú Lateral con SubMenús (Resuelve PA5)

**Decisión**: Reemplazar el menú plano actual con submenús agrupados por categoría lógica usando `items` anidados de Ant Design (`type: "submenu"` con `children`). La estructura concreta del array `MENU_ITEMS` en `src/pages/home/index.tsx` será:

```typescript
const MENU_ITEMS = [
  {
    key: "group-principal",
    label: "Principal",
    type: "submenu",
    icon: <HomeOutlined />,
    children: [
      { key: MENU_KEYS.HOME, label: "Home", icon: <HomeOutlined /> },
      { key: MENU_KEYS.BASIC_DATA, label: "Datos Básicos", icon: <FileTextOutlined /> },
    ],
  },
  {
    key: "group-contenido",
    label: "Contenido",
    type: "submenu",
    icon: <SolutionOutlined />,
    children: [
      { key: MENU_KEYS.EXPERIENCE, label: "Experiencias" },
      { key: MENU_KEYS.EDUCATION, label: "Educación" },
      { key: MENU_KEYS.BLOGS, label: "Blogs" },
      { key: MENU_KEYS.BLOG_TYPE, label: "Tipos de Blog" },
    ],
  },
  {
    key: "group-habilidades",
    label: "Habilidades",
    type: "submenu",
    icon: <BranchesOutlined />,
    children: [
      { key: MENU_KEYS.SKILL_TYPE, label: "Tipos de Habilidad" },
      { key: MENU_KEYS.SKILL, label: "Habilidades" },
      { key: MENU_KEYS.SKILL_SON, label: "Especialidades" },
    ],
  },
  {
    key: "group-multimedia",
    label: "Multimedia",
    type: "submenu",
    icon: <PictureOutlined />,
    children: [
      { key: MENU_KEYS.IMAGES, label: "Imágenes" },
      { key: MENU_KEYS.VIDEO, label: "Videos" },
      { key: MENU_KEYS.LABEL, label: "Labels" },
    ],
  },
  {
    key: "group-formacion",
    label: "Formación Adicional",
    type: "submenu",
    icon: <ReadOutlined />,
    children: [
      { key: MENU_KEYS.COURSES, label: "Cursos" },
      { key: MENU_KEYS.CERTIFICATIONS, label: "Certificaciones" },
      { key: MENU_KEYS.LANGUAGES, label: "Idiomas" },
    ],
  },
  {
    key: "group-proyectos",
    label: "Proyectos",
    type: "submenu",
    icon: <ForkOutlined />,
    children: [
      { key: MENU_KEYS.FUTURED_PROJECTS, label: "Proyectos Destacados" },
    ],
  },
  {
    key: "group-referencias",
    label: "Referencias",
    type: "submenu",
    icon: <BookOutlined />,
    children: [
      { key: MENU_KEYS.REFERENCES, label: "Referencias" },
    ],
  },
  {
    key: "group-custom",
    label: "Secciones Custom",
    type: "submenu",
    icon: <AppstoreOutlined />,
    children: [
      { key: MENU_KEYS.CUSTOM_SECTIONS, label: "Secciones Personalizadas" },
    ],
  },
];
```

**Nuevas entradas en MENU_KEYS** (en `useHomePage.ts`):
```typescript
COURSES: "courses",
CERTIFICATIONS: "certifications",
LANGUAGES: "languages",
REFERENCES: "references",
CUSTOM_SECTIONS: "custom-sections",
FUTURED_PROJECTS: "futured-projects",
```

**Nota**: No se usa el componente `<SubMenu>` de Ant Design directamente. Se usa la sintaxis de `items` con `type: "submenu"` y `children`, que es la forma moderna y recomendada por Ant Design 5.x. El `Menu` component ya soporta esta estructura de forma nativa.

### D3: Patrón de Formularios para Nuevas Entidades (Resuelve PA6)

**Decisión**: Reutilizar exactamente los mismos patrones de las páginas existentes:
- Componente `SectionHeader` para cabecera con botón "Volver".
- Componente `LoadingBlock` para estados de carga.
- `Form` de Ant Design con layout vertical.
- Campos multi-idioma en filas de 2 columnas (ES/EN lado a lado).
- Campos HTML (portal) con `RichTextEditor`.
- Campos de texto (PDF) con `Input.TextArea`.
- Hooks personalizados por entidad: `use<Entity>Form` y `use<Entity>List`.
- Vista de lista con `Table` de Ant Design + vista de formulario con toggle `view` state.

### D4: Paginación en Nuevas Listas (Resuelve PA7)

**Decisión**: Sin paginación para las nuevas entidades. Listar todos los registros.

**Razonamiento**:
- Volumen esperado bajo: cursos (<30), certificaciones (<20), idiomas (<10), referencias (<10), custom sections (<10), featured projects (<10).
- Los endpoints GET de las nuevas entidades retornan arrays completos (sin paginación en el OpenAPI).
- Simplifica la implementación y es consistente con entidades existentes como Label, SkillType, etc.

**Excepción**: Blog ya tiene paginación y se mantiene.

### D5: Indicador de Visibilidad en CustomSections (Resuelve PA8)

**Decisión**: Agregar un `Tag` de Ant Design en la columna de la lista que muestre "Visible" (verde) o "Oculto" (gris) según el campo `visible`.

### D6: Manejo de Respuestas de Creación `{ id }`

**Decisión**: Después de un CREATE exitoso, refrescar la lista completa usando la función `reload<Entity>()` del hook `use<Entity>List>`.

**Razonamiento**:
- El patrón ya existe en las páginas actuales (ej: `reloadExperiences()` en ExperiencePage).
- Es más simple y consistente que construir la entidad localmente.
- El `{ id }` retornado se usa solo para notificación de éxito.

### D7: Manejo de Respuestas 204 No Content

**Decisión**: Después de un UPDATE o DELETE exitoso, refrescar la lista completa usando `reload<Entity>()`.

**Razonamiento**:
- Consistente con el patrón actual de las páginas existentes.
- El interceptor de axios ya maneja 204 sin intentar parsear body.

### D8: Manejo de ApiErrorResponse

**Decisión**: El interceptor de respuesta de `axiosClient` ya redirige en 401/404/500. Se mantiene ese comportamiento. Para errores de validación (400), los providers actuales ya retornan el error y los hooks lo manejan mostrando notificaciones. No se requiere cambio en el parsing de `details[]` a nivel de formulario en esta iteración (se mantiene la notificación genérica de error).

**Cobertura de códigos HTTP adicionales**:
- **409 Conflict**: Ocurre al intentar crear un recurso duplicado (ej: Language con mismo nombre). El hook capturará el error vía `catch` y mostrará notificación con el `message` del `ApiErrorResponse`. No requiere lógica específica.
- **429 RateLimitExceeded**: Retornado por el API Gateway. El interceptor `axiosClient` redirigirá según la configuración actual (se maneja con notificación genérica de error).
- **503 ServiceUnavailable**: El interceptor `axiosClient` redirige según la configuración actual.
- Todos estos códigos retornan `ApiErrorResponse` con el mismo schema, por lo que son capturados por el bloque `catch` de los hooks existentes.

**Razonamiento**:
- El brief menciona mostrar `details[]` en formularios, pero las páginas existentes ya usan notificaciones de error genéricas.
- Implementar mapeo field-by-field requeriría refactor significativo de todos los hooks de formulario.
- Se mantiene consistencia con el patrón actual: notificación de error con `message` del response.

---

## 3. Scope de Cambios por Archivo

### 3.1 Cambios en Archivos Existentes

| Archivo | Tipo de Cambio | Descripción |
|---|---|---|
| `.env` (o `.env.example`) | Modificación | `VITE_API_URL` cambia para incluir `/v1/ms-resume` |
| `src/api/apiConfig.ts` | Sin cambio | Exporta `API_URL` desde env var, no requiere modificación |
| `src/api/axiosClient.ts` | Sin cambio | Usa `API_URL` como baseURL, funciona automáticamente |
| `src/api/authProvider.ts` | Sin cambio | Usa `API_URL` directamente, funciona automáticamente |
| `src/hooks/useAltcha.ts` | Sin cambio | Usa `API_URL` directamente, funciona automáticamente |
| `src/App.tsx` | Sin cambio | Usa `API_URL` para dataProvider, funciona automáticamente |
| `src/api/index.ts` | Modificación | Agregar exports (`export * from`) de los 6 nuevos providers |
| `src/hooks/home/useHomePage.ts` | Modificación | Agregar entries en `MENU_KEYS` para las 6 nuevas entidades |
| `src/pages/home/index.tsx` | Modificación | Agregar imports, items `MENU_ITEMS` y renderizado condicional para las 6 nuevas páginas |
| `src/api/experienceProvider.ts` | Sin cambio | Endpoint relativo `/experience` funciona con nuevo baseURL |
| `src/api/basicDataProvider.ts` | Sin cambio | Endpoint relativo funciona con nuevo baseURL |
| `src/api/blogProvider.ts` | Sin cambio | Endpoint relativo funciona con nuevo baseURL |
| `src/api/blogTypeProvider.ts` | Sin cambio | Endpoint relativo funciona con nuevo baseURL |
| `src/api/educationProvider.ts` | Sin cambio | Endpoint relativo funciona con nuevo baseURL |
| `src/api/homeProvider.ts` | Sin cambio | Endpoint relativo funciona con nuevo baseURL |
| `src/api/imageProvider.ts` | Sin cambio | Endpoint relativo funciona con nuevo baseURL |
| `src/api/labelProvider.ts` | Sin cambio | Endpoint relativo funciona con nuevo baseURL |
| `src/api/skillProvider.ts` | Sin cambio | Endpoint relativo funciona con nuevo baseURL |
| `src/api/skillSonProvider.ts` | Sin cambio | Endpoint relativo funciona con nuevo baseURL |
| `src/api/skillTypeProvider.ts` | Sin cambio | Endpoint relativo funciona con nuevo baseURL |
| `src/api/videoProvider.ts` | Sin cambio | Endpoint relativo funciona con nuevo baseURL |

### 3.2 Nuevos Archivos a Crear

| Archivo | Descripción |
|---|---|
| `src/interfaces/course/CoursePayload.ts` | Interface TypeScript para payload de Course |
| `src/interfaces/course/CourseResponse.ts` | Interface TypeScript para response de Course |
| `src/interfaces/certification/CertificationPayload.ts` | Interface TypeScript para payload de Certification |
| `src/interfaces/certification/CertificationResponse.ts` | Interface TypeScript para response de Certification |
| `src/interfaces/language/LanguagePayload.ts` | Interface TypeScript para payload de Language |
| `src/interfaces/language/LanguageResponse.ts` | Interface TypeScript para response de Language |
| `src/interfaces/reference/ReferencePayload.ts` | Interface TypeScript para payload de Reference |
| `src/interfaces/reference/ReferenceResponse.ts` | Interface TypeScript para response de Reference |
| `src/interfaces/custom-section/CustomSectionPayload.ts` | Interface TypeScript para payload de CustomSection |
| `src/interfaces/custom-section/CustomSectionResponse.ts` | Interface TypeScript para response de CustomSection |
| `src/interfaces/futured-project/FuturedProjectPayload.ts` | Interface TypeScript para payload de FuturedProject |
| `src/interfaces/futured-project/FuturedProjectResponse.ts` | Interface TypeScript para response de FuturedProject |
| `src/api/courseProvider.ts` | Provider CRUD para Course |
| `src/api/certificationProvider.ts` | Provider CRUD para Certification |
| `src/api/languageProvider.ts` | Provider CRUD para Language |
| `src/api/referenceProvider.ts` | Provider CRUD para Reference |
| `src/api/customSectionProvider.ts` | Provider CRUD para CustomSection |
| `src/api/futuredProjectProvider.ts` | Provider CRUD para FuturedProject |
| `src/hooks/course/useCourseForm.ts` | Hook de formulario para Course |
| `src/hooks/course/useCourseList.ts` | Hook de lista para Course |
| `src/hooks/certification/useCertificationForm.ts` | Hook de formulario para Certification |
| `src/hooks/certification/useCertificationList.ts` | Hook de lista para Certification |
| `src/hooks/language/useLanguageForm.ts` | Hook de formulario para Language |
| `src/hooks/language/useLanguageList.ts` | Hook de lista para Language |
| `src/hooks/reference/useReferenceForm.ts` | Hook de formulario para Reference |
| `src/hooks/reference/useReferenceList.ts` | Hook de lista para Reference |
| `src/hooks/custom-section/useCustomSectionForm.ts` | Hook de formulario para CustomSection |
| `src/hooks/custom-section/useCustomSectionList.ts` | Hook de lista para CustomSection |
| `src/hooks/futured-project/useFuturedProjectForm.ts` | Hook de formulario para FuturedProject |
| `src/hooks/futured-project/useFuturedProjectList.ts` | Hook de lista para FuturedProject |
| `src/pages/course/CoursePage.tsx` | Página CRUD para Course |
| `src/pages/certification/CertificationPage.tsx` | Página CRUD para Certification |
| `src/pages/language/LanguagePage.tsx` | Página CRUD para Language |
| `src/pages/reference/ReferencePage.tsx` | Página CRUD para Reference |
| `src/pages/custom-section/CustomSectionPage.tsx` | Página CRUD para CustomSection |
| `src/pages/futured-project/FuturedProjectPage.tsx` | Página CRUD para FuturedProject |

### 3.3 Archivos de Configuración a Modificar

| Archivo | Cambio |
|---|---|
| `src/hooks/home/useHomePage.ts` | Agregar entries en `MENU_KEYS` para las 6 nuevas entidades siguiendo el patrón existente (constante con keys strings) |
| `src/pages/home/index.tsx` | Agregar imports de las 6 nuevas páginas, agregar items al array `MENU_ITEMS` con sus respectivos iconos de Ant Design, y agregar renderizado condicional en el bloque `Content` para las nuevas `MENU_KEYS` |
| `src/api/index.ts` | Agregar exports (`export * from`) de los 6 nuevos providers |
| `src/components/index.ts` | Agregar exports si se crean componentes reutilizables nuevos |

> **Nota**: El `<Refine>` component en `App.tsx` NO utiliza `<Resource>` hijos. La navegación se maneja vía React Router + menú lateral con renderizado condicional en `Home/index.tsx`. Por lo tanto, no se modifica `App.tsx` para el enrutamiento; solo se actualizan `useHomePage.ts` (MENU_KEYS) y `Home/index.tsx` (MENU_ITEMS + renderizado).

---

## 4. Contratos de Interfaces TypeScript

### 4.1 Course

```typescript
// CoursePayload.ts
export interface CoursePayload {
  name: string;
  nameEng: string;
  institution: string;
  institutionEng: string;
  completionDate: string; // format: YYYY-MM-DD
  description?: string;
  descriptionEng?: string;
  summaryPdf?: string;
  summaryPdfEng?: string;
  certificateUrl?: string;
}

// CourseResponse.ts
export interface CourseResponse {
  id: number;
  name: string;
  nameEng: string;
  institution: string;
  institutionEng: string;
  completionDate: string;
  description: string | null;
  descriptionEng: string | null;
  summaryPdf: string | null;
  summaryPdfEng: string | null;
  certificateUrl: string | null;
}
```

### 4.2 Certification

```typescript
// CertificationPayload.ts
export interface CertificationPayload {
  name: string;
  nameEng: string;
  issuingOrganization: string;
  issuingOrganizationEng: string;
  issueDate: string; // format: YYYY-MM-DD
  expirationDate?: string; // format: YYYY-MM-DD
  verificationUrl?: string;
  credentialId?: string;
  description?: string;
  descriptionEng?: string;
  summaryPdf?: string;
  summaryPdfEng?: string;
}

// CertificationResponse.ts
export interface CertificationResponse {
  id: number;
  name: string;
  nameEng: string;
  issuingOrganization: string;
  issuingOrganizationEng: string;
  issueDate: string;
  expirationDate: string | null;
  verificationUrl: string | null;
  credentialId: string | null;
  description: string | null;
  descriptionEng: string | null;
  summaryPdf: string | null;
  summaryPdfEng: string | null;
}
```

### 4.3 Language

```typescript
// LanguagePayload.ts
export interface LanguagePayload {
  language: string;
  languageEng: string;
  readingLevel: string;
  writingLevel: string;
  speakingLevel: string;
}

// LanguageResponse.ts
export interface LanguageResponse {
  id: number;
  language: string;
  languageEng: string;
  readingLevel: string;
  writingLevel: string;
  speakingLevel: string;
}
```

### 4.4 Reference

```typescript
// ReferencePayload.ts
export interface ReferencePayload {
  fullName: string;
  position: string;
  company?: string;
  companyEng?: string;
  email?: string;
  phone?: string;
  relationship?: string;
  relationshipEng?: string;
}

// ReferenceResponse.ts
export interface ReferenceResponse {
  id: number;
  fullName: string;
  position: string;
  company: string | null;
  companyEng: string | null;
  email: string | null;
  phone: string | null;
  relationship: string | null;
  relationshipEng: string | null;
}
```

### 4.5 CustomSection

```typescript
// CustomSectionPayload.ts
export interface CustomSectionPayload {
  title: string;
  titleEng: string;
  content?: string;
  contentEng?: string;
  summaryPdf?: string;
  summaryPdfEng?: string;
  visible: boolean;
}

// CustomSectionResponse.ts
export interface CustomSectionResponse {
  id: number;
  title: string;
  titleEng: string;
  content: string | null;
  contentEng: string | null;
  summaryPdf: string | null;
  summaryPdfEng: string | null;
  visible: boolean;
}
```

### 4.6 FuturedProject

```typescript
// FuturedProjectPayload.ts
export interface FuturedProjectPayload {
  name: string;
  nameEng: string;
  experienceId: number;
  descriptionShort: string;
  description: string;
  descriptionShortEng: string;
  descriptionEng: string;
  imageListUrlId?: number;
  imageUrlId?: number;
}

// FuturedProjectResponse.ts
export interface FuturedProjectResponse {
  id: number;
  name: string;
  nameEng: string;
  descriptionShort: string;
  description: string;
  descriptionShortEng: string;
  descriptionEng: string;
  experience: ExperienceResponse;
  imageListUrl: ImageUrlResponse | null;
  imageUrl: ImageUrlResponse | null;
}
```

---

## 5. Contratos de Providers (Patrón)

Cada nuevo provider sigue el patrón exacto de `experienceProvider.ts`:

```typescript
// <entity>Provider.ts (patrón genérico)
import { axiosClient } from "./axiosClient";
import type { <Entity>Payload } from "../interfaces/<entity>/<Entity>Payload";
import type { <Entity>Response } from "../interfaces/<entity>/<Entity>Response";

export type { <Entity>Payload, <Entity>Response };

const <ENTITY>_ENDPOINT = "/<entity-resource>";

export const get<Entity>s = async (): Promise<<Entity>Response[]> => {
  const { data } = await axiosClient.get<<Entity>Response[]>(<ENTITY>_ENDPOINT);
  return data;
};

export const get<Entity> = async (id: number): Promise<<Entity>Response> => {
  const { data } = await axiosClient.get<<Entity>Response>(`${<ENTITY>_ENDPOINT}/${id}`);
  return data;
};

export const create<Entity> = async (payload: <Entity>Payload): Promise<{ status: number }> => {
  const response = await axiosClient.post(<ENTITY>_ENDPOINT, payload);
  // Se descarta response.data.id intencionalmente (ver D6):
  // la lista se refresca completa vía reload en lugar de agregar localmente
  return { status: response.status };
};

export const update<Entity> = async (id: number, payload: <Entity>Payload): Promise<{ status: number }> => {
  const response = await axiosClient.put(`${<ENTITY>_ENDPOINT}/${id}`, payload);
  return { status: response.status };
};

export const delete<Entity> = async (id: number): Promise<{ status: number }> => {
  const response = await axiosClient.delete(`${<ENTITY>_ENDPOINT}/${id}`);
  return { status: response.status };
};
```

### 5.1 Endpoints por Entidad

| Entidad | Endpoint | Resource Name (Refine) |
|---|---|---|
| Course | `/course` | `courses` |
| Certification | `/certification` | `certifications` |
| Language | `/language` | `languages` |
| Reference | `/reference` | `references` |
| CustomSection | `/custom-section` | `custom-sections` |
| FuturedProject | `/futured-project` | `futured-projects` |

---

## 6. Contratos de Hooks (Patrón)

### 6.1 Hook de Lista (Patrón)

```typescript
// use<Entity>List.ts (patrón genérico)
import { useCallback, useEffect, useState } from "react";
import { delete<Entity>, get<Entity>s, type <Entity>Response } from "../../api";
import { useNotifier } from "../useNotifier";

export const use<Entity>List = () => {
  const { notifyError, notifySuccess } = useNotifier();
  const [data, setData] = useState<<Entity>Response[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [isBusy, setBusy] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  const load<Entity>s = useCallback(async () => {
    setLoading(true);
    try {
      const result = await get<Entity>s();
      setData(result ?? []);
      if (pendingMessage) {
        notifySuccess({
          message: pendingMessage,
          description: pendingMessage,
        });
        setPendingMessage(null);
      }
    } catch {
      notifyError({
        message: "Error",
        description: "No se pudo cargar la lista",
      });
    } finally {
      setLoading(false);
    }
  }, [notifyError, notifySuccess, pendingMessage]);

  useEffect(() => {
    load<Entity>s();
  }, [load<Entity>s]);

  const handleDelete<Entity> = useCallback(async (id: number) => {
    setBusy(true);
    try {
      const { status } = await delete<Entity>(id);
      if (status === 200 || status === 201 || status === 204) {
        notifySuccess({
          message: "Eliminado exitosamente",
          description: "El registro se eliminó correctamente.",
        });
        await load<Entity>s();
        return;
      }
      throw new Error("Respuesta inesperada");
    } catch {
      notifyError({
        message: "Error",
        description: "No se pudo eliminar el registro",
      });
    } finally {
      setBusy(false);
    }
  }, [load<Entity>s, notifyError, notifySuccess]);

  const reload<Entity>s = load<Entity>s;

  const setSuccessOnReload = useCallback((message: string) => {
    setPendingMessage(message);
  }, []);

  return { data, isLoading, isBusy, handleDelete<Entity>, reload<Entity>s, setSuccessOnReload };
};
```

### 6.2 Hook de Formulario (Patrón)

```typescript
// use<Entity>Form.ts (patrón genérico)
import { Form } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { create<Entity>, get<Entity>, update<Entity>, type <Entity>Payload } from "../../api";
import { useNotifier } from "../useNotifier";

// Definir FormValues concretos por entidad con Dayjs para campos de fecha
// Ejemplo para entidades con fechas (Course, Certification):
// export interface <Entity>FormValues {
//   completionDate?: Dayjs;
//   // ... demás campos
// }
export interface <Entity>FormValues {
  // campos del formulario (usar Dayjs para fechas: completionDate?: Dayjs)
}

interface Use<Entity>FormProps {
  mode: "create" | "edit";
  <entity>Id?: number;
  onSuccess?: (message: string) => void;
}

export const use<Entity>Form = ({ mode, <entity>Id, onSuccess }: Use<Entity>FormProps) => {
  const [form] = Form.useForm<<Entity>FormValues>();
  const { notifyError, notifySuccess } = useNotifier();
  const [isLoading, setLoading] = useState(mode === "edit");
  const [isSaving, setSaving] = useState(false);

  const load<Entity> = useCallback(async () => {
    if (mode !== "edit" || !<entity>Id) return;
    setLoading(true);
    try {
      const entity = await get<Entity>(<entity>Id);
      form.setFieldsValue({
        ...entity,
        // Convertir fechas string a Dayjs:
        // completionDate: entity.completionDate ? dayjs(entity.completionDate) : undefined,
      });
    } catch {
      notifyError({ message: "Error", description: "No se pudo cargar el registro" });
    } finally {
      setLoading(false);
    }
  }, [mode, <entity>Id, form, notifyError]);

  useEffect(() => {
    load<Entity>();
  }, [load<Entity>]);

  const handleSubmit = useCallback(async (values: <Entity>FormValues): Promise<boolean> => {
    setSaving(true);
    try {
      // Convertir Dayjs a string YYYY-MM-DD para fechas antes de enviar
      const payload = {
        ...values,
        // completionDate: values.completionDate ? values.completionDate.format("YYYY-MM-DD") : undefined,
      } as unknown as <Entity>Payload;

      const response =
        mode === "edit" && <entity>Id
          ? await update<Entity>(<entity>Id, payload)
          : await create<Entity>(payload);

      if (response.status === 200 || response.status === 201 || response.status === 204) {
        const successMsg = mode === "edit" ? "Actualizado exitosamente" : "Creado exitosamente";
        if (onSuccess) {
          onSuccess(successMsg);
        } else {
          notifySuccess({ message: successMsg, description: successMsg });
        }
        return true;
      }
      throw new Error("Respuesta inesperada");
    } catch {
      notifyError({
        message: "Error",
        description: mode === "edit" ? "No se pudo actualizar" : "No se pudo crear",
      });
      return false;
    } finally {
      setSaving(false);
    }
  }, [mode, <entity>Id, onSuccess, notifyError, notifySuccess]);

  return { form, isLoading, isSaving, handleSubmit };
};
```

### 6.3 FormValues Concretos para Entidades con Fechas

**CourseFormValues** (usando `Dayjs` para `completionDate`):
```typescript
export interface CourseFormValues {
  name: string;
  nameEng: string;
  institution: string;
  institutionEng: string;
  completionDate?: Dayjs; // Dayjs para integración con DatePicker de Ant Design
  description?: string;
  descriptionEng?: string;
  summaryPdf?: string;
  summaryPdfEng?: string;
  certificateUrl?: string;
}
```

Al cargar para edición, convertir:
```typescript
form.setFieldsValue({
  ...entity,
  completionDate: entity.completionDate ? dayjs(entity.completionDate) : undefined,
});
```

Al enviar, convertir a string:
```typescript
const payload = {
  ...values,
  completionDate: values.completionDate
    ? values.completionDate.format("YYYY-MM-DD")
    : undefined,
} as unknown as CoursePayload;
```

**CertificationFormValues** (usando `Dayjs` para `issueDate` y `expirationDate`):
```typescript
export interface CertificationFormValues {
  name: string;
  nameEng: string;
  issuingOrganization: string;
  issuingOrganizationEng: string;
  issueDate?: Dayjs;
  expirationDate?: Dayjs;
  verificationUrl?: string;
  credentialId?: string;
  description?: string;
  descriptionEng?: string;
  summaryPdf?: string;
  summaryPdfEng?: string;
}
```

Mismo patrón de conversión: `dayjs(entity.issueDate)` al cargar, `.format("YYYY-MM-DD")` al enviar.

**LanguageFormValues, ReferenceFormValues, CustomSectionFormValues, FuturedProjectFormValues**: 
No requieren Dayjs (no tienen campos de fecha). Siguen el tipo `Record<string, unknown>` equivalente a sus respectivos Payloads/Responses sin conversión de fechas.

---

## 7. Contratos de Páginas (Patrón)

Cada nueva página sigue el patrón exacto de `ExperiencePage.tsx`:
- Vista de lista con `Table` de Ant Design.
- Vista de formulario con `Form` de Ant Design.
- Toggle entre vistas usando estado `view: "list" | "create" | "edit"`.
- `SectionHeader` para cabecera.
- `LoadingBlock` para estados de carga.
- `Popconfirm` para confirmación de eliminación.

### 7.1 CustomSectionPage - Diferencia Especial

La página de CustomSection incluye un `Tag` visual en la columna de la lista para indicar visibilidad:

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

### 7.2 FuturedProjectPage - Diferencia Especial

La página de FuturedProject incluye un selector de Experience en el formulario. Se creará un componente `ExperienceSelector` siguiendo el patrón exacto de `SkillSonSelector` (thin wrapper sobre `ResourceSelectorModal`):

```tsx
// src/components/resource-selector/ExperienceSelector.tsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { getExperiences, type ExperienceResponse } from "../../api";
import { ResourceSelectorModal, type SelectionMode } from "./ResourceSelectorModal";

interface ExperienceSelectorProps {
  selectionMode?: SelectionMode;
  buttonLabel?: string;
  title?: string;
  initialSelectedIds?: number[];
  onConfirm: (selectedIds: number[], selectedRecords: ExperienceResponse[]) => void;
  disabled?: boolean;
}

export const ExperienceSelector = ({
  selectionMode = "single",
  buttonLabel = "Seleccionar experiencia",
  title = "Seleccionar experiencia",
  initialSelectedIds,
  onConfirm,
  disabled,
}: ExperienceSelectorProps) => {
  const [data, setData] = useState<ExperienceResponse[]>([]);
  const [isLoading, setLoading] = useState(false);

  const loadExperiences = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getExperiences();
      setData(response ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadExperiences();
  }, [loadExperiences]);

  const columns = useMemo(() => [
    { title: "ID", dataIndex: "id" },
    { title: "Empresa", dataIndex: "company" },
    { title: "Posición", dataIndex: "position" },
  ], []);

  return (
    <ResourceSelectorModal
      title={title}
      buttonLabel={buttonLabel}
      selectionMode={selectionMode}
      tableProps={{ dataSource: data, loading: isLoading, pagination: false }}
      columns={columns}
      initialSelectedIds={initialSelectedIds}
      onConfirm={onConfirm}
      disabled={disabled}
    />
  );
};
```

Y exportarlo desde `src/components/resource-selector/index.ts`:
```typescript
export { ExperienceSelector } from "./ExperienceSelector";
```

---

## 8. Integraciones

| # | Integración | Dirección | Protocolo | Propósito |
|---|---|---|---|---|
| I1 | hv-rt-fr-admin → hv-go-ms-resume | Outbound | HTTPS REST + JWT | CRUD completo + login |
| I2 | hv-rt-fr-admin → Altcha | Outbound | HTTP (altcha-lib) | Challenge anti-spam |

**No hay cambios en las integraciones**, solo adaptación de URLs base.

---

## 9. Seguridad

| Restricción | Descripción |
|---|---|
| JWT Bearer Token | Todas las operaciones CRUD requieren token válido (sin cambio) |
| Altcha en login | Challenge requerido para login (sin cambio) |
| Token expirado | Redirección a login en 401 (ya implementado en axiosClient interceptor) |
| Datos sensibles | Email y teléfono de referencias: no exponer en logs (sin cambio de patrón) |

---

## 10. Criterios de Aceptación

### CA1: Adaptación de Endpoints Existentes
- [ ] Todos los endpoints consumidos usan el prefijo `/v1/ms-resume/` vía `VITE_API_URL`.
- [ ] El login funciona con `POST ${VITE_API_URL}/login`.
- [ ] El challenge Altcha se obtiene desde `GET ${VITE_API_URL}/public/challenge`.
- [ ] Las 12 entidades existentes funcionan sin errores de CRUD.

### CA2: Adaptación de Respuestas de Creación
- [ ] Al crear una entidad, el frontend refresca la lista después de recibir `{ id }`.
- [ ] Las notificaciones de éxito se muestran correctamente.

### CA3: Adaptación de Respuestas de Actualización/Eliminación
- [ ] Al actualizar, el frontend refresca la lista después de recibir `204 No Content`.
- [ ] Al eliminar, el frontend refresca la lista después de recibir `204 No Content`.

### CA4: Formato de Errores
- [ ] Los errores de validación muestran notificación con el `message` del `ApiErrorResponse`.
- [ ] Los errores 401 redirigen al login (ya implementado).
- [ ] Los errores 500 muestran redirección a página de error (ya implementado).

### CA5: Nuevas Páginas de Administración
- [ ] Página de Cursos con CRUD completo (list, create, edit, delete).
- [ ] Página de Certificaciones con CRUD completo.
- [ ] Página de Idiomas con CRUD completo.
- [ ] Página de Referencias con CRUD completo.
- [ ] Página de Secciones Personalizadas con CRUD completo + indicador de visibilidad.
- [ ] Página de Proyectos Destacados con CRUD completo + selector de Experience.
- [ ] Todas las nuevas páginas tienen entradas en el menú lateral agrupadas por categoría.

### CA6: Compatibilidad de Formularios
- [ ] Formularios con campos multi-idioma (ES/EN) lado a lado.
- [ ] Campos HTML usan `RichTextEditor`.
- [ ] Campos de texto PDF usan `Input.TextArea`.
- [ ] Validación de campos requeridos antes de enviar.
- [ ] Selectores de entidades relacionadas funcionan correctamente.

### CA7: No Regresión
- [ ] Las 12 páginas existentes siguen funcionando correctamente.
- [ ] Login funciona correctamente.
- [ ] Navegación entre secciones funciona correctamente.
- [ ] Modo oscuro/claro funciona correctamente.

---

## 11. Orden de Ejecución Sugerido

1. **Fase 1 - Infraestructura**: Cambiar `VITE_API_URL` + verificar que endpoints existentes funcionan.
2. **Fase 2 - Interfaces y Providers**: Crear interfaces TypeScript y providers para las 6 nuevas entidades.
3. **Fase 3 - Hooks**: Crear hooks de lista y formulario para las 6 nuevas entidades.
4. **Fase 4 - Páginas**: Crear las 6 nuevas páginas de administración.
5. **Fase 5 - Integración en Home**: Agregar MENU_KEYS en `useHomePage.ts`, MENU_ITEMS y renderizado condicional en `Home/index.tsx`.
6. **Fase 6 - Verificación**: Probar CRUD completo de todas las entidades (existentes + nuevas).

---

## 12. Riesgos y Mitigación

| Riesgo | Impacto | Mitigación |
|---|---|---|
| `VITE_API_URL` incorrecto en deploy | Todos los endpoints fallan | Documentar cambio en `.env.example` y README |
| Schema de response 200 diferente al esperado | Las interfaces TypeScript no matchean | Verificar contra OpenAPI real antes de implementar |
| FuturedProject requiere ExperienceSelector complejo | Mayor esfuerzo de implementación | Reutilizar patrón de SkillSonSelector adaptado |
| Regresión en páginas existentes | Funcionalidad actual rota | Probar todas las páginas existentes después del cambio de `VITE_API_URL` |

---

## 13. Deuda Técnica

Ninguna identificada para este incremento. Todos los cambios son adaptaciones directas al contrato existente.

---

## 14. Archivos Autoritativos

| Artefacto | Ruta |
|---|---|
| Requirements Brief | `docs/specs/requirements/api-contract-adaptation-requirements-brief.md` |
| OpenAPI Backend Go | `../hv-go-ms-resume/api/openapi.yaml` |
| Shared Context | `docs/specs/.working/api-contract-adaptation-sdd-context.md` |
| Delta Spec | `docs/specs/increments/001-api-contract-adaptation.md` |
