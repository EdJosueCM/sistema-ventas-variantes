# Diagrama del flujo CI/CD

```mermaid
flowchart LR
    DEV[Desarrolladores] -->|push / pull request| GIT[(Repositorio Git<br/>GitHub)]
    GIT --> CO[Obtener código<br/>actions/checkout]
    CO --> INST[Instalar dependencias<br/>npm ci]
    INST --> VAL[Validar configuraciones<br/>npm run validate:config]
    VAL --> TEST[Pruebas automatizadas<br/>Jest]
    TEST -->|fallan| FIX[Revisar logs,<br/>corregir y hacer push]
    FIX --> GIT
    TEST -->|exitosas| BUILD[Construir paquete<br/>npm run build]
    BUILD --> ART[[Artefacto descargable<br/>+ reporte de pruebas]]
    ART -->|solo rama main| DEPLOY[Despliegue automático<br/>Render: Básica y Premium]
```

## Estrategia de ramas

```mermaid
gitGraph
    commit id: "estructura inicial"
    branch develop
    branch feature/base-app
    commit id: "login, productos, clientes"
    checkout develop
    merge feature/base-app
    branch feature/ci-pipeline
    commit id: "pipeline CI"
    checkout develop
    merge feature/ci-pipeline
    branch feature/ventas
    commit id: "ventas (falla CI)"
    commit id: "fix (CI exitoso)"
    checkout develop
    merge feature/ventas
    branch feature/variabilidad
    commit id: "feature flags"
    checkout develop
    merge feature/variabilidad
    checkout main
    merge develop tag: "v1.0.0"
```

| Rama | Propósito |
|---|---|
| `main` | Versiones estables publicadas. Cada merge despliega automáticamente. |
| `develop` | Integración de funcionalidades terminadas. |
| `feature/*` | Una rama por funcionalidad; se integra a `develop` mediante Pull Request con CI en verde. |
| `release/*` | Preparación de una versión (CHANGELOG, número de versión) antes de pasar a `main`. |

## Versionado semántico

Las versiones siguen `MAYOR.MENOR.PARCHE` y se marcan con etiquetas `vX.Y.Z` en `main`:

- **v1.0.0**: variante Básica con todas las características obligatorias.
- **v1.1.0**: variante Premium (reportes, descuentos y exportación) y despliegue continuo.
