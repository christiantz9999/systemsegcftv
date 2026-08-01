export const WHATSAPP_NUMBER = "5573991969419";
export const WHATSAPP_DISPLAY = "(73) 99196-9419";
export const INSTAGRAM_HANDLE = "@systemsegcftv";
export const INSTAGRAM_URL = "https://www.instagram.com/systemsegcftv";
export const EMAIL = "systemsegcftv@gmail.com";
export const WEBSITE = "www.systemseg.com.br";

export function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const DEFAULT_WHATSAPP_URL = buildWhatsAppUrl(
  "Olá! Vim pelo site da SystemSeg e gostaria de solicitar um orçamento.",
);
