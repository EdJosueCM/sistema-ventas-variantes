# Sistema de Ventas con Variantes

[![CI](https://github.com/EdJosueCM/sistema-ventas-variantes/actions/workflows/ci.yml/badge.svg)](https://github.com/EdJosueCM/sistema-ventas-variantes/actions/workflows/ci.yml)

Proyecto del Componente Práctico 2 de *Gestión de la Configuración de Software* (UNEMI, 8.º nivel).

Sistema de ventas sencillo que se comercializa en dos variantes (**Básica** y **Premium**) a partir de **una única base de código**. Las variantes se definen con archivos de configuración y feature flags, validados automáticamente en el pipeline de integración continua.

## Tecnologías

| Herramienta | Uso |
|---|---|
| Git / GitHub | Control de versiones, Pull Requests y releases |
| GitHub Actions | Integración y despliegue continuo |
| Node.js 22 + Express | Aplicación web y API REST |
| Jest + Supertest | Pruebas automatizadas |
| Render | Despliegue de las variantes |
| draw.io / Mermaid | Modelo de características y diagramas |

## Estructura

```
config/
  feature-model.json   Modelo de características (obligatorias, opcionales, dependencias)
  basica.json          Configuración de la variante Básica
src/
  app.js               Monta solo los módulos de las características habilitadas
  config/              Carga y validación de configuraciones
  features/registry.js Característica → módulo que la implementa
  modules/             Módulos funcionales (auth, productos, clientes, ventas, ...)
public/                Interfaz web
scripts/               Build, validación de configuraciones y resumen de pruebas
tests/                 Pruebas automatizadas
docs/                  Modelo de características y diagrama CI/CD
```

## Uso

```bash
npm install
npm test                  # pruebas automatizadas
npm run validate:config   # valida todas las variantes contra el modelo
npm run build             # genera el paquete en dist/
npm run start:basica      # http://localhost:3000 (usuario: admin / admin123)
```

La variante también puede elegirse con variables de entorno:

```bash
VARIANT=basica PORT=3000 npm start
FEATURE_REPORTES=true VARIANT=basica npm start   # falla: la validación detecta que no hay implementación
```

## Documentación

- [Modelo de características](docs/modelo-caracteristicas.md)
- [Diagrama CI/CD y estrategia de ramas](docs/diagrama-cicd.md)
- [Historial de cambios](CHANGELOG.md)
