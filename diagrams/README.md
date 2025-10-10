# Diagramas (PlantUML)

Esta carpeta contiene los diagramas de secuencia por Historia de Usuario en formato PlantUML (.puml).

Recomendación rápida (VS Code):

1. Instala la extensión "PlantUML" de jebbs (la workspace recomienda la extensión).
2. Abre cualquier archivo `.puml` y usa la vista previa (Alt+D o el botón de la extensión) para renderizar en la derecha.
3. Si no tienes Java instalado, la extensión usará el servidor PlantUML público para preview (configurado en .vscode/settings.json). Ten en cuenta la privacidad si tus diagramas son sensibles.

Generar imágenes localmente (opcional):

- Requiere Java. Puedes usar el script `scripts\fetch-plantuml.ps1` para descargar `plantuml.jar`.

```powershell
# Descargar plantuml.jar
.\scripts\fetch-plantuml.ps1

# Generar PNGs (desde la raíz del repo)
java -jar .\plantuml.jar -tpng .\diagrams\sequence\*.puml -o .\diagrams\sequence\images
```

Si prefieres, la extensión de VS Code te permite exportar PNG/SVG desde la vista previa sin instalar Java.
