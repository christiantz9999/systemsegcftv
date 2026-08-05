import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Services } from "@/components/landing/Services";
import { WhyUs } from "@/components/landing/WhyUs";
import { ProductsCta } from "@/components/landing/ProductsCta";
import { Testimonials } from "@/components/landing/Testimonials";
import { ContactForm } from "@/components/landing/ContactForm";
import { Footer } from "@/components/landing/Footer";
import { WhatsAppFloat } from "@/components/landing/WhatsAppFloat";

const TITLE = "SystemSeg | CFTV, Cerca Elétrica e Segurança Eletrônica";
const DESCRIPTION =
  "CFTV profissional, cercas elétricas, automação de portões, central de alarme, videoporteiro e fechaduras biométricas. Solicite seu orçamento pelo WhatsApp (73) 99196-9419.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "SystemSeg Segurança Eletrônica",
          description: DESCRIPTION,
          telephone: "+55-73-99196-9419",
          email: "systemsegcftv@gmail.com",
          url: "https://www.systemseg.com.br",
          address: {
            "@type": "PostalAddress",
            addressRegion: "BA",
            addressCountry: "BR",
          },
          sameAs: ["https://www.instagram.com/systemsegcftv"],
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased relative">
      <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 pointer-events-none items-end">
        <a 
          href="https://wa.me/5573991969419?text=Olá! Estou com problemas para acessar o painel administrativo da SystemSeg."
          target="_blank"
          rel="noopener noreferrer"
          className="bg-primary/90 hover:bg-primary text-primary-foreground px-4 py-2 rounded-full text-[10px] sm:text-xs font-bold shadow-lg backdrop-blur-sm transition-all flex items-center gap-2 border border-primary/20 pointer-events-auto"
        >
          <div className="size-2 bg-green-500 rounded-full animate-pulse" />
          Não consigo efetuar o login
        </a>
      </div>

      <Header />
      <main>
        <Hero />
        <Services />
        <WhyUs />
        <ProductsCta />
        <Testimonials />
        <ContactForm />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
