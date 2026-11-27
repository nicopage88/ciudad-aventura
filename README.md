# Ciudad Aventura

Juego social de exploración urbana ambientado en Maipú. Permite recorrer el mapa, personalizar el personaje, interactuar con otros jugadores y ofrecer servicios como aventones o gastos compartidos.

## Desarrollo local

Requiere Node.js 22.13 o superior.

```bash
npm ci
npm run build
npm start
```

La aplicación queda disponible en `http://127.0.0.1:8787`. La base D1 local se guarda en `.wrangler/state` y no se versiona.

## Migraciones

Después de compilar, aplica solamente las migraciones pendientes en orden:

```bash
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_romantic_scarlet_spider.sql
```

Reemplaza el archivo por la migración pendiente. No vuelvas a ejecutar una migración ya aplicada.

## Producción

La configuración usada por el VPS está en [`deploy/`](deploy/):

- `ciudad-aventura.service`: proceso Node administrado por systemd.
- `ciudad-aventura.tpl` y `ciudad-aventura.stpl`: proxy HTTP/HTTPS para Hestia/Nginx.

El código se instala en `/opt/ciudad-aventura` y los datos persistentes en `/var/lib/ciudad-aventura`.
