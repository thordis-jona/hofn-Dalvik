import { getAbsoluteLocaleUrl, getRelativeLocaleUrl } from 'astro:i18n';

export const locales = ['is', 'en'] as const;
export type Locale = (typeof locales)[number];
export type RouteKey = 'home' | 'guide' | 'notFound';

export const defaultLocale: Locale = 'is';

export const localeInfo = {
  is: {
    htmlLang: 'is',
    displayName: 'Íslenska',
    dateLocale: 'is-IS',
    ogLocale: 'is_IS',
  },
  en: {
    htmlLang: 'en',
    displayName: 'English',
    dateLocale: 'en-GB',
    ogLocale: 'en_GB',
  },
} as const satisfies Record<Locale, {
  htmlLang: string;
  displayName: string;
  dateLocale: 'is-IS' | 'en-GB';
  ogLocale: string;
}>;

const routePaths = {
  home: '',
  guide: 'dalvik-travel-guide',
  notFound: '404',
} as const satisfies Record<RouteKey, string>;

export function localeUrl(locale: Locale, route: RouteKey) {
  return getRelativeLocaleUrl(locale, routePaths[route]);
}

export function absoluteLocaleUrl(locale: Locale, route: RouteKey) {
  return getAbsoluteLocaleUrl(locale, routePaths[route]);
}

export function contentId(locale: Locale, sourceKey: string) {
  return `${locale}/${sourceKey}`;
}

export function sourceKey(id: string) {
  return id.split('/').slice(1).join('/');
}

export function isLocale(value: string | undefined): value is Locale {
  return value === 'is' || value === 'en';
}
