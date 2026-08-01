import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Carlos Eduardo",
    role: "Comerciante",
    city: "Porto Seguro, BA",
    service: "CFTV e Alarme",
    rating: 5,
    text: "Instalei câmeras e alarme na minha loja e a diferença foi imediata. Qualidade de imagem excelente e o atendimento da SystemSeg é rápido. Recomendo de olhos fechados.",
    initials: "CE",
  },
  {
    name: "Márcia Lopes",
    role: "Residencial",
    city: "Santa Cruz Cabrália, BA",
    service: "Cerca Elétrica",
    rating: 5,
    text: "Ficamos muito mais seguros depois da cerca elétrica. A equipe veio no horário combinado, fez tudo limpo e ainda explicou como usar. Nota mil!",
    initials: "ML",
  },
  {
    name: "Roberto Nascimento",
    role: "Condomínio",
    city: "Trancoso, BA",
    service: "Vídeo Porteiro",
    rating: 5,
    text: "Trocamos o interfone antigo por um vídeo porteiro com acesso pelo celular. Agora os moradores veem quem chega de onde estiverem. Ótimo investimento.",
    initials: "RN",
  },
  {
    name: "Fernanda Souza",
    role: "Empresa",
    city: "Arraial d'Ajuda, BA",
    service: "Portão Automático",
    rating: 5,
    text: "O portão automático facilitou demais a entrada dos clientes e funcionários. A instalação foi rápida e o suporte sempre responde quando preciso.",
    initials: "FS",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`Avaliação ${rating} de 5 estrelas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`size-4 ${i < rating ? "fill-primary text-primary" : "text-muted-foreground/40"}`}
          aria-hidden
        />
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section id="depoimentos" className="scroll-mt-20 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="text-xs font-bold tracking-[0.3em] text-primary">
            DEPOIMENTOS
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            O que nossos clientes dizem{" "}
            <span className="text-primary">sobre a SystemSeg</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Histórias reais de quem já protegeu casa, comércio e empresa com a
            gente. Confiança construída com trabalho bem feito.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TESTIMONIALS.map((testimonial) => (
            <article
              key={testimonial.name}
              className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40"
            >
              <StarRating rating={testimonial.rating} />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground/90">
                “{testimonial.text}”
              </blockquote>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/15 font-display text-sm font-bold text-primary">
                  {testimonial.initials}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-display text-sm font-bold">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-4">
                <span className="text-xs text-muted-foreground">
                  {testimonial.city}
                </span>
                <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                  {testimonial.service}
                </span>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-secondary/30 px-6 py-8 text-center sm:flex-row sm:gap-8">
          <div>
            <p className="font-display text-3xl font-extrabold text-primary">
              4.9/5
            </p>
            <p className="text-xs font-semibold tracking-wide text-muted-foreground">
              AVALIAÇÃO MÉDIA DOS CLIENTES
            </p>
          </div>
          <div className="hidden h-10 w-px bg-border sm:block" />
          <div>
            <p className="font-display text-3xl font-extrabold text-foreground">
              +500
            </p>
            <p className="text-xs font-semibold tracking-wide text-muted-foreground">
              PROJETOS ENTREGUES
            </p>
          </div>
          <div className="hidden h-10 w-px bg-border sm:block" />
          <div>
            <p className="font-display text-3xl font-extrabold text-accent">
              100%
            </p>
            <p className="text-xs font-semibold tracking-wide text-muted-foreground">
              FOCO EM SEGURANÇA
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
