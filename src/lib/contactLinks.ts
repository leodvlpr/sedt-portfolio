import content from "../data/content.json";
import { ICONS } from "./icons";

/* content.json.profile no tiene `github`. No lo inventamos: se declara
   opcional y el enlace aparece solo si algún día se añade el campo. */
const profile = content.profile as typeof content.profile & {
  github?: string;
};

export type ContactLink = {
  /* Nombre del canal. Sirve de aria-label donde sólo se ve el icono y de
     rótulo visible donde el enlace lleva texto: la dirección de correo no
     se muestra en ninguno de los dos sitios. */
  label: string;
  href: string;
  /* mailto: abre el gestor de correo del usuario, así que no lleva
     target="_blank" — eso dejaría una pestaña en blanco detrás. */
  external: boolean;
  paths: string[];
};

/* Única fuente de verdad: la comparten la barra lateral del hero, el botón
   CONTACT ME y la sección Contact, para que no puedan desincronizarse. */
export const contactLinks: ContactLink[] = [
  profile.email && {
    label: "Email",
    href: `mailto:${profile.email}`,
    external: false,
    paths: ICONS.mail,
  },
  profile.linkedin && {
    label: "LinkedIn",
    href: profile.linkedin,
    external: true,
    paths: ICONS.linkedin,
  },
  profile.github && {
    label: "GitHub",
    href: profile.github,
    external: true,
    paths: ICONS.github,
  },
].filter((link): link is ContactLink => Boolean(link));

/* El botón CONTACT ME comparte destino con el icono de correo. */
export const mailHref = profile.email ? `mailto:${profile.email}` : "#contact";
