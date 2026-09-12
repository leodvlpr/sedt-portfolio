import content from "../data/content.json";

/* content.json.profile no tiene `github`. No lo inventamos: se declara
   opcional y el enlace aparece solo si algún día se añade el campo. */
const profile = content.profile as typeof content.profile & {
  github?: string;
};

export type ContactLink = {
  /* Nombre del canal; se usa como aria-label donde sólo se ve el icono. */
  label: string;
  /* Texto visible donde el enlace lleva rótulo: en el correo interesa
     mostrar la dirección, no la palabra "Email". */
  text: string;
  href: string;
  /* mailto: abre el gestor de correo del usuario, así que no lleva
     target="_blank" — eso dejaría una pestaña en blanco detrás. */
  external: boolean;
  paths: string[];
};

/* Trazados de Tabler Icons (outline, viewBox 24). Inline para no añadir una
   dependencia sólo por tres iconos. */
const ICONS = {
  mail: [
    "M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z",
    "M3 7l9 6l9 -6",
  ],
  linkedin: [
    "M8 11v5",
    "M8 8v.01",
    "M12 16v-5",
    "M16 16v-3a2 2 0 1 0 -4 0",
    "M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4z",
  ],
  github: [
    "M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5",
  ],
};

/* Única fuente de verdad: la comparten la barra lateral del hero y la
   sección Contact, para que no puedan desincronizarse. */
export const contactLinks: ContactLink[] = [
  profile.email && {
    label: "Email",
    text: profile.email,
    href: `mailto:${profile.email}`,
    external: false,
    paths: ICONS.mail,
  },
  profile.linkedin && {
    label: "LinkedIn",
    text: "LinkedIn",
    href: profile.linkedin,
    external: true,
    paths: ICONS.linkedin,
  },
  profile.github && {
    label: "GitHub",
    text: "GitHub",
    href: profile.github,
    external: true,
    paths: ICONS.github,
  },
].filter((link): link is ContactLink => Boolean(link));
