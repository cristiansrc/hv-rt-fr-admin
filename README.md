# 📄 FR Resume Admin

Panel de administración para gestionar y actualizar mi currículum vitae de forma dinámica.

## 📋 Descripción

Aplicación web construida con React y TypeScript que permite administrar toda la información de un currículum vitae, incluyendo experiencia laboral, educación, habilidades, proyectos de blog, imágenes y videos. Utiliza Refine como framework base para la gestión de datos y Ant Design para la interfaz de usuario.

## 🚀 Tecnologías Principales

### Frontend

- **React 19** - Librería para construir interfaces de usuario
- **TypeScript** - Superset tipado de JavaScript
- **Vite** - Build tool y dev server de última generación
- **Ant Design 5** - Framework de componentes UI empresariales
- **Refine** - Framework React para aplicaciones admin y dashboards

### Librerías Destacadas

- **TipTap** - Editor de texto enriquecido basado en ProseMirror
- **React Router v7** - Navegación y enrutamiento
- **Axios** - Cliente HTTP para peticiones API
- **Day.js** - Librería para manejo de fechas
- **Altcha** - Sistema de protección anti-bot basado en proof-of-work

### Testing

- **Vitest** - Framework de testing unitario
- **Testing Library** - Utilidades para testing de componentes React
- **JSDOM** - Implementación de DOM para entorno Node

### Herramientas de Desarrollo

- **ESLint** - Linter para JavaScript/TypeScript
- **TypeScript ESLint** - Reglas de ESLint específicas para TypeScript

## 📦 Requisitos Previos

- Node.js (versión 20 o superior recomendada)
- npm o yarn
- Acceso a la API backend del currículum

## 🔧 Instalación

1. Clona el repositorio:

```bash
git clone <url-del-repositorio>
cd fr-resume-admin
```

2. Instala las dependencias:

```bash
npm install
```

3. Configura las variables de entorno:
   Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
VITE_API_URL=<url-de-tu-api>
```

## 🎮 Scripts Disponibles

### Desarrollo

```bash
npm run dev
```

Inicia el servidor de desarrollo en modo watch.

### Compilación

```bash
npm run build
```

Compila la aplicación para producción en la carpeta `dist/`.

### Producción

```bash
npm start
```

Inicia el servidor para servir la aplicación compilada.

### Testing

```bash
# Ejecutar tests una vez
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con cobertura
npm run test:cov
```

### Refine CLI

```bash
npm run refine
```

Accede a las utilidades CLI de Refine.

## 📁 Estructura del Proyecto

```
fr-resume-admin/
├── src/
│   ├── api/              # Proveedores de datos y configuración de API
│   ├── components/       # Componentes reutilizables
│   ├── config/           # Configuraciones de recursos
│   ├── contexts/         # Contextos de React (theme, etc.)
│   ├── hooks/            # Hooks personalizados
│   ├── interfaces/       # Tipos e interfaces TypeScript
│   ├── pages/            # Páginas de la aplicación
│   ├── styles/           # Estilos globales y específicos
│   ├── utils/            # Funciones utilitarias
│   ├── App.tsx           # Componente principal
│   └── index.tsx         # Punto de entrada
├── test/                 # Tests unitarios (estructura similar a src/)
├── public/               # Archivos estáticos
├── coverage/             # Reportes de cobertura de tests
├── Dockerfile            # Configuración Docker
├── vite.config.ts        # Configuración de Vite
├── vitest.config.ts      # Configuración de Vitest
├── tsconfig.json         # Configuración de TypeScript
└── package.json          # Dependencias y scripts
```

## 🧪 Testing

El proyecto cuenta con una suite completa de tests unitarios utilizando Vitest y Testing Library. La cobertura incluye:

- Componentes React
- Hooks personalizados
- Proveedores de datos (API)
- Páginas completas
- Utilidades

Los reportes de cobertura se generan en formato HTML y XML (Clover) en la carpeta `coverage/`.

## 🐳 Docker

El proyecto incluye un `Dockerfile` para facilitar el despliegue en contenedores.

```bash
# Construir la imagen
docker build -t fr-resume-admin .

# Ejecutar el contenedor
docker run -p 3000:3000 fr-resume-admin
```

## 🔐 Autenticación y Seguridad

- Sistema de autenticación basado en JWT
- Protección de rutas mediante guards
- Sistema anti-bot Altcha en el login (proof-of-work)
- Interceptores Axios para gestión automática de tokens

## 🎨 Características

- ✅ Gestión completa de experiencia laboral
- ✅ Administración de educación y certificaciones
- ✅ Catálogo de habilidades técnicas organizadas por categorías
- ✅ Sistema de blog con tipos y categorías
- ✅ Gestor de multimedia (imágenes y videos)
- ✅ Editor de texto enriquecido para descripciones
- ✅ Modo oscuro/claro
- ✅ Interfaz responsiva
- ✅ Notificaciones y feedback de usuario
- ✅ Validaciones de formularios
- ✅ Generación de descripciones para PDF

## 🌐 Navegación

- `/login` - Página de inicio de sesión
- `/` - Dashboard principal (protegido)

## 📝 Recursos Gestionados

El panel permite administrar los siguientes recursos:

- **Datos Básicos**: Información personal y profesional
- **Experiencia**: Historial laboral
- **Educación**: Formación académica
- **Habilidades**: Skills técnicas organizadas jerárquicamente
- **Blog**: Artículos y publicaciones
- **Multimedia**: Imágenes y videos del portafolio
- **Etiquetas**: Sistema de categorización

## 🔄 Estado del Proyecto

Este es un proyecto en desarrollo activo para la gestión del currículum personal.

## 📄 Licencia

Proyecto privado - Todos los derechos reservados

---

Desarrollado con ❤️ usando React y Refine
