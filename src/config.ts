import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://rizkybarok.com",
  author: "rizkymubarok",
  desc: "A blog where i write about my projects, my thoughts, and sometimes my life.",
  title: "rizkymubarok's blog",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: false,
  postPerPage: 5,
};

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/gitbarok",
    linkTitle: ` ${SITE.author} on Github`,
    active: true,
  },
  {
    name: "Instagram",
    href: "https://instagram.com/rizkybarok",
    linkTitle: `${SITE.author} on Instagram`,
    active: true,
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/rizkybarok",
    linkTitle: `${SITE.author} on LinkedIn`,
    active: true,
  },
  {
    name: "Mail",
    href: "mailto:muhammadrizkymubarok@gmail.com",
    linkTitle: `Send an email to ${SITE.author}`,
    active: false,
  },
  {
    name: "Twitter",
    href: "https://twitter.com/rizkybarok",
    linkTitle: `${SITE.author} on Twitter`,
    active: false,
  },
];
