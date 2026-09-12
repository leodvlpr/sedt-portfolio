/* Resuelve una ruta de public/ contra el `base` de astro.config.mjs.

   No basta con interpolar `${import.meta.env.BASE_URL}ruta`: con
   base: '/sedt-portfolio' la variable llega SIN barra final, y la
   concatenación directa produce "/sedt-portfoliologo_lm.png".

   Normalizando los dos extremos funciona en los tres casos:
     BASE_URL '/'                 -> '/logo_lm.png'
     BASE_URL '/sedt-portfolio'   -> '/sedt-portfolio/logo_lm.png'
     BASE_URL '/sedt-portfolio/'  -> '/sedt-portfolio/logo_lm.png'

   Así el helper sobrevive a que alguien edite `base` con o sin barra. */
const BASE = import.meta.env.BASE_URL;

export const asset = (path: string): string =>
  `${BASE.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;

/* La home del sitio: la raíz del base, no la del dominio. */
export const home = asset("");
