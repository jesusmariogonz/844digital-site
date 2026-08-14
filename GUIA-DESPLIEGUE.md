# Guía de despliegue — 844 Digital en Cloudflare Pages (gratis)

Esta guía te lleva de "tengo los archivos" a "mi sitio está en línea", y luego a "está listo para meterle dinero de Google Ads". Sigue los pasos en orden.

## Antes de empezar: reemplaza estos datos de ejemplo

El sitio viene con datos de muestra que **debes cambiar antes de publicarlo**. Búscalos con Ctrl+F en los archivos indicados:

| Dato de ejemplo | Dónde aparece | Reemplázalo por |
|---|---|---|
| `528440000000` | Todos los `.html` (botones de WhatsApp) | Tu número real en formato `52` + 10 dígitos, sin espacios ni `+` (ej. `528441234567`) |
| `hola@844digital.mx` | `index.html`, `privacidad.html`, `terminos.html` | Tu correo real |
| `YOUR_FORM_ID` | `index.html`, dentro del `<form action="https://formspree.io/f/YOUR_FORM_ID">` | Tu ID de formulario (paso 4) |
| `G-XXXXXXXXXX` | `index.html`, `gracias.html` | Tu ID de Google Analytics 4 (paso 5) |
| `AW-XXXXXXXXX/XXXXXXXXXXXXX` | `gracias.html` (está comentado) | Tu ID de conversión de Google Ads (paso 6) |
| `tudominio.com` | `index.html` (meta tags, JSON-LD), `robots.txt`, `sitemap.xml` | Tu dominio real cuando lo tengas |
| `[fecha]` | `privacidad.html`, `terminos.html` | La fecha en que publiques el sitio |

---

## Paso 1 — Crea tu cuenta de Cloudflare

1. Ve a [cloudflare.com](https://www.cloudflare.com) y crea una cuenta gratuita (solo pide correo y contraseña).
2. En el panel, busca en el menú lateral **"Workers & Pages"**.

No necesitas tarjeta de crédito para el plan gratuito de Pages.

## Paso 2 — Sube el sitio (dos formas, elige la más fácil para ti)

### Opción A — Subida directa (la más rápida, sin usar GitHub)

1. En "Workers & Pages", haz clic en **Create** → pestaña **Pages** → **Upload assets**.
2. Ponle un nombre al proyecto, por ejemplo `844digital`.
3. Arrastra **la carpeta completa** del sitio (todos los archivos que te entregué: `index.html`, `privacidad.html`, `terminos.html`, `gracias.html`, `robots.txt`, `sitemap.xml`, `_headers`, `favicon.svg` y la carpeta `assets/`).
4. Haz clic en **Deploy site**. En menos de un minuto tendrás una URL como `https://844digital.pages.dev`.

Esta opción es perfecta para empezar hoy mismo. La única limitación: cada vez que quieras actualizar el sitio, tendrás que volver a subir los archivos manualmente.

### Opción B — Conectado a GitHub (recomendado en cuanto empieces a iterar seguido)

1. Crea una cuenta gratuita en [github.com](https://github.com) si no tienes una.
2. Crea un repositorio nuevo (por ejemplo `844digital-site`) y sube ahí todos los archivos del sitio.
3. En Cloudflare, "Workers & Pages" → **Create** → pestaña **Pages** → **Connect to Git**.
4. Autoriza a Cloudflare a acceder a tu cuenta de GitHub y selecciona el repositorio.
5. Configuración de build: como es un sitio estático (sin framework), deja el **comando de build vacío** y el **directorio de salida** como `/` (raíz).
6. **Deploy**.

Con esta opción, cada vez que subas un cambio a GitHub, Cloudflare vuelve a publicar el sitio automáticamente.

## Paso 3 — Verifica que todo cargó bien

Abre la URL `https://TUPROYECTO.pages.dev` que te dio Cloudflare y revisa:
- Que el logo y las imágenes carguen.
- Que el botón flotante de WhatsApp abra una conversación (aún con el número de ejemplo, para probar el flujo).
- Que el cotizador calcule un precio al elegir opciones.
- Que el menú funcione en tu celular.

## Paso 4 — Activa el formulario de contacto con Formspree (gratis)

El formulario de la sección "Contacto" necesita un backend para recibir los mensajes — Cloudflare Pages no procesa formularios por sí solo.

1. Crea una cuenta gratis en [formspree.io](https://formspree.io).
2. Crea un formulario nuevo y copia el **Form ID** que te da (algo como `mzzaaqjw`).
3. En `index.html`, busca `action="https://formspree.io/f/YOUR_FORM_ID"` y reemplaza `YOUR_FORM_ID` por tu ID real.
4. Vuelve a subir el sitio a Cloudflare (repite el paso 2).

El plan gratuito de Formspree incluye **50 envíos de formulario al mes** y hasta 2 correos de notificación — más que suficiente para empezar. Si algún mes recibes más de 50 cotizaciones por formulario, es una buena señal de que ya conviene subir de plan (o de que tu campaña de Ads está funcionando muy bien).

## Paso 5 — Conecta Google Analytics 4 (mide tus visitas)

1. Ve a [analytics.google.com](https://analytics.google.com) y crea una cuenta y una propiedad para tu sitio.
2. Copia tu **ID de medición**, con formato `G-XXXXXXXXXX`.
3. En `index.html` y `gracias.html`, reemplaza las dos apariciones de `G-XXXXXXXXXX` por tu ID real.
4. Vuelve a publicar el sitio.

## Paso 6 — Conecta Google Ads y marca conversiones

1. Crea tu cuenta en [ads.google.com](https://ads.google.com).
2. Dentro de la cuenta, ve a **Herramientas → Conversiones → Nueva acción de conversión → Sitio web**.
3. Google te dará un ID con formato `AW-XXXXXXXXX` y una etiqueta de conversión (algo como `AbCdEfGhIjKlMnOp`).
4. Abre `gracias.html` (la página a la que llega alguien justo después de enviar el formulario) y descomenta esta línea, reemplazando los valores de ejemplo:
   ```html
   gtag('event', 'conversion', {'send_to': 'AW-XXXXXXXXX/AbCdEfGhIjKlMnOp'});
   ```
5. Publica el sitio de nuevo y haz una prueba real llenando el formulario tú mismo — en Google Ads, dentro de 24 horas deberías ver la conversión reflejada.

Con esto, cada vez que alguien complete el formulario después de dar clic en un anuncio, Google Ads lo va a contar como una conversión real y va a poder optimizar tus campañas para conseguirte más gente así.

## Paso 7 — Compra y conecta tu dominio propio (cuando estés listo)

Mientras no tengas dominio, `TUPROYECTO.pages.dev` funciona perfectamente para probar y hasta para correr tus primeras campañas — pero un dominio propio (`844digital.mx` o `.com`) se ve más profesional y es indispensable a mediano plazo.

1. Compra el dominio directamente en **Cloudflare Registrar** (cobra el precio de costo, sin margen — es de las opciones más baratas) o en Namecheap/GoDaddy si prefieres. Un `.com` ronda los $250–350 MXN al año; un `.mx` suele costar un poco más.
2. En tu proyecto de Cloudflare Pages, ve a **Custom domains → Set up a custom domain** y sigue las instrucciones. Si compraste el dominio en Cloudflare, se conecta prácticamente solo.
3. Actualiza `tudominio.com` por tu dominio real en `index.html`, `robots.txt` y `sitemap.xml`, y vuelve a publicar.

## Paso 8 — Lista de verificación antes de gastar en Google Ads

- [ ] WhatsApp, correo y formulario funcionan con tus datos reales (no los de ejemplo).
- [ ] Google Analytics 4 está recibiendo datos (prueba entrando tú mismo al sitio y revisando "Tiempo real" en GA4).
- [ ] La conversión de Google Ads se marca correctamente en `gracias.html`.
- [ ] Revisaste `privacidad.html` y `terminos.html` con alguien con conocimiento legal — son plantillas de referencia, no un documento legal definitivo.
- [ ] El sitio ya vive en tu dominio propio (o decidiste conscientemente arrancar con el `.pages.dev` mientras tanto).
- [ ] Probaste el sitio en un celular real, no solo en la computadora.

## Notas sobre límites del plan gratuito de Cloudflare Pages

Con este sitio (estático, sin base de datos) vas muy lejos del límite gratuito: hasta 500 despliegues al mes, 20,000 archivos por sitio y 100 dominios personalizados por proyecto — y, a diferencia de Vercel o GitHub Pages, Cloudflare Pages sí permite uso comercial (anuncios, cobros, venderlo como servicio) sin violar sus términos. No vas a necesitar pagar nada de hosting para este sitio en el futuro previsible.

## Sobre las imágenes del sitio

Las fotos que usa el sitio se cargan directamente desde Unsplash (banco de imágenes gratuito, con licencia de uso comercial sin necesidad de atribución). Si más adelante quieres reemplazarlas por fotos reales de tu propio trabajo o de tu equipo en Saltillo, solo tienes que cambiar la URL dentro del atributo `src` de cada `<img>` en `index.html` por la ruta de tu propia imagen (por ejemplo `/assets/img/mi-foto.jpg`, subiendo el archivo a la carpeta `assets/img/`).
