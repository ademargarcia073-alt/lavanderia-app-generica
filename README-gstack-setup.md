# Instalación de gstack en este entorno (sandbox de Claude Code)

Notas operativas para instalar/reinstalar [gstack](https://github.com/garrytan/gstack)
en un contenedor nuevo de Claude Code on the web. No confundir con la documentación
de gstack en sí (`.claude/skills/gstack/CLAUDE.md`), que no se versiona en este repo.

## Instalación estándar

```bash
git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git .claude/skills/gstack
cd .claude/skills/gstack && ./setup
```

`.claude/skills/` está gitignorado (ver `.gitignore`): el clon completo pesa
~1.6GB (`node_modules` + binarios compilados) y es totalmente regenerable, así
que no se commitea. Este archivo sí se commitea porque documenta un problema de
infraestructura del entorno, no del proyecto.

## Problema conocido: `./setup` falla en "Installing Playwright Chromium..."

**Causa:** `./setup` necesita descargar el binario de Chromium (build 1208,
Chrome 145.0.7632.6 al momento de escribir esto) desde `cdn.playwright.dev`
para la función `/browse` de gstack. **Ese host está bloqueado por la política
de red del sandbox** — no es un fallo transitorio. Se puede confirmar así:

```bash
curl -sS "$HTTPS_PROXY/__agentproxy/status" | grep -A2 "cdn.playwright.dev"
# → "detail": "gateway answered 403 to CONNECT (policy denial or upstream failure)"
```

Como `setup` corre con `set -e`, el script aborta ahí mismo — el paso siguiente
(el que realmente registra los 55 skills en `.claude/skills/` a nivel raíz)
**nunca llega a ejecutarse** si no se resuelve esto primero.

## Workaround: reusar el Chromium preinstalado del sandbox

El sandbox ya trae un Chromium preinstalado en `/opt/pw-browsers/` (variable de
entorno `PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`), pero con un build distinto
(1194) al que gstack espera (1208). Playwright resuelve el navegador por número
de revisión exacto, así que hay que "engañarlo" creando symlinks con el nombre
de revisión que busca, apuntando a los binarios ya instalados.

**Verificar primero qué revisiones hay realmente presentes** (los nombres deben
ajustarse si el sandbox trae otra versión preinstalada):

```bash
ls /opt/pw-browsers/
# esperado: chromium-<rev_vieja>, chromium_headless_shell-<rev_vieja>, ffmpeg-...

# revisión que gstack/Playwright espera (puede cambiar si gstack actualiza su
# dependencia de "playwright" en package.json):
grep -A3 '"chromium"' /home/user/lavanderia-app-generica/.claude/skills/gstack/node_modules/playwright-core/browsers.json
```

**Symlinks a crear** (ajustar `1194` → revisión real preinstalada, y `1208` →
revisión real que pida `browsers.json`):

```bash
# 1. Chromium completo (chrome-linux/chrome)
ln -s /opt/pw-browsers/chromium-1194 /opt/pw-browsers/chromium-1208

# 2. Chrome headless shell — el layout de carpetas CAMBIÓ entre builds viejos y
#    nuevos de "Chrome for Testing", así que no alcanza con symlinkear la carpeta
#    completa: hay que recrear la estructura nueva apuntando al binario viejo.
mkdir -p /opt/pw-browsers/chromium_headless_shell-1208/chrome-headless-shell-linux64
ln -s /opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell \
      /opt/pw-browsers/chromium_headless_shell-1208/chrome-headless-shell-linux64/chrome-headless-shell
touch /opt/pw-browsers/chromium_headless_shell-1208/INSTALLATION_COMPLETE
touch /opt/pw-browsers/chromium_headless_shell-1208/DEPENDENCIES_VALIDATED
```

**Verificar que funciona** antes de reintentar `./setup`:

```bash
cd /home/user/lavanderia-app-generica/.claude/skills/gstack
bun --eval 'import { chromium } from "playwright"; const b = await chromium.launch(); await b.close(); console.log("LAUNCH OK");'
```

Si imprime `LAUNCH OK`, correr `./setup` de nuevo — ya no debería trabarse en el
paso de Playwright y debería llegar hasta `gstack ready (claude).` con los 55
skills enlazados en `.claude/skills/`.

## Cuándo reaplicar esto

- **Siempre que `./setup` se corra en un contenedor nuevo** (cada sesión de
  Claude Code on the web arranca de un contenedor limpio) y falle en
  "Installing Playwright Chromium...".
- Los symlinks viven en `/opt/pw-browsers/`, **fuera de este repo** (es parte
  del filesystem del contenedor, no de `.claude/skills/`), así que no persisten
  entre sesiones — hay que recrearlos cada vez.
- Si en algún momento el sandbox deja de bloquear `cdn.playwright.dev`, o
  gstack actualiza su versión de `playwright` a un build que coincide con el
  preinstalado, este workaround deja de ser necesario y `./setup` funciona solo.
