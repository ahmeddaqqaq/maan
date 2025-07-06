export function setLocale(locale: string) {
  document.cookie = `locale=${locale}; path=/; max-age=31536000; SameSite=Lax`;
  window.location.reload();
}

export function getLocale(): string {
  if (typeof document !== 'undefined') {
    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('locale='));
    
    if (cookie) {
      return cookie.split('=')[1];
    }
  }
  
  return 'ar'; // Default to Arabic
}

export const SUPPORTED_LOCALES = [
  { code: 'ar', name: 'العربية', dir: 'rtl' },
  { code: 'en', name: 'English', dir: 'ltr' }
] as const;

export type SupportedLocale = typeof SUPPORTED_LOCALES[number]['code'];