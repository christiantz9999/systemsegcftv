import { MessageCircle } from "lucide-react";
import { DEFAULT_WHATSAPP_URL } from "@/lib/whatsapp";

export function WhatsAppFloat() {
  return (
    <a
      href={DEFAULT_WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a SystemSeg no WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-[0_10px_30px_-8px_rgba(0,0,0,0.6)] transition-transform hover:scale-110"
    >
      <MessageCircle className="size-7" aria-hidden />
    </a>
  );
}
