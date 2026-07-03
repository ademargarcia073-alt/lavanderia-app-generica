# TODOS

## Runbook de aprovisionamiento de tenant

**What:** Documentar (o scriptear) los pasos para dar de alta un tenant nuevo: crear DB Neon dedicada → correr migraciones → configurar secrets (connection string, credenciales de Resend, etc.) → escribir el archivo de config del tenant → deploy del proyecto de Cloudflare Pages correspondiente.

**Why:** El onboarding de tenants es manual por decisión (ver design doc de /office-hours). Sin un runbook, ese proceso depende de que el founder recuerde los pasos de memoria — riesgo de un paso salteado justo cuando el tenant #1 (o el #2) dice que sí.

**Pros:** Reduce el riesgo de error humano en el momento de mayor presión (cliente real esperando). Sienta la base para automatizar el alta cuando el onboarding deje de ser manual.

**Cons:** No bloquea el MVP — el runbook solo tiene sentido después de que el proceso de alta exista al menos una vez (no se documenta lo que no se construyó).

**Context:** Surgió de la revisión de /plan-eng-review sobre el design doc de /office-hours (branch claude/gstack-setup-verify-7yu79g). La arquitectura elegida es: Cloudflare Pages (SvelteKit) + Neon Postgres dedicado por tenant (driver `@neondatabase/serverless` en modo websockets) + Drizzle ORM + Better-Auth (email+password, incluye forgot-password vía Resend).

**Depends on / blocked by:** El MVP debe estar construido y desplegado al menos una vez (para el tenant #1) antes de que este runbook tenga contenido real que documentar.
