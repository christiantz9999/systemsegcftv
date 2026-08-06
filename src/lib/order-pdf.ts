import logoAsset from "@/assets/logo-systemseg.png.asset.json";
import { WHATSAPP_DISPLAY, EMAIL, WEBSITE, INSTAGRAM_HANDLE } from "@/lib/whatsapp";

export interface OrderPdfItem {
  name: string;
  description?: string;
  price: number;
  quantity: number;
}

export interface OrderPdfData {
  reference: string;
  createdAt: Date;
  customerName: string;
  customerPhone: string;
  address: string;
  city: string;
  zip: string;
  items: OrderPdfItem[];
  total: number;
}

const NAVY: [number, number, number] = [11, 31, 58];
const BLUE: [number, number, number] = [0, 96, 208];
const GRAY: [number, number, number] = [110, 118, 130];
const LIGHT: [number, number, number] = [242, 245, 249];

const PAGE_W = 210;
const MARGIN = 15;
const CONTENT_W = PAGE_W - MARGIN * 2;

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })
    .format(value)
    .replace(/[\u00A0\u202F]/g, " ");
}

async function loadLogoDataUrl(): Promise<string | null> {
  try {
    const res = await fetch(logoAsset.url);
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export async function generateOrderPdf(data: OrderPdfData) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const logo = await loadLogoDataUrl();

  let pageNum = 1;

  const drawHeader = () => {
    doc.setFillColor(...NAVY);
    doc.rect(0, 0, PAGE_W, 30, "F");
    if (logo) {
      // logo original: 624x603 (quase quadrada)
      const h = 20;
      const w = (h * 624) / 603;
      doc.addImage(logo, "PNG", MARGIN, 5, w, h);
    }
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("SystemSeg", MARGIN + 24, 14);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Segurança Eletrônica - Câmeras, Cercas e Automação", MARGIN + 24, 20);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(`Pedido ${data.reference}`, PAGE_W - MARGIN, 13, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    const dateStr = new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(data.createdAt);
    doc.text(dateStr, PAGE_W - MARGIN, 19, { align: "right" });
  };

  const drawFooter = () => {
    const y = 288;
    doc.setDrawColor(220, 224, 230);
    doc.line(MARGIN, y - 4, PAGE_W - MARGIN, y - 4);
    doc.setTextColor(...GRAY);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(
      `SystemSeg  |  WhatsApp ${WHATSAPP_DISPLAY}  |  ${EMAIL}  |  ${WEBSITE}  |  Instagram ${INSTAGRAM_HANDLE}`,
      PAGE_W / 2,
      y,
      { align: "center" },
    );
    doc.text(`Página ${pageNum}`, PAGE_W - MARGIN, y + 4, { align: "right" });
  };

  const sectionTitle = (title: string, y: number) => {
    doc.setTextColor(...BLUE);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(title, MARGIN, y);
    doc.setDrawColor(...BLUE);
    doc.setLineWidth(0.5);
    doc.line(MARGIN, y + 1.5, MARGIN + 40, y + 1.5);
    return y + 7;
  };

  const bodyLine = (label: string, value: string, y: number) => {
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...NAVY);
    doc.text(label, MARGIN, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(40, 44, 52);
    doc.text(value, MARGIN + 32, y);
    return y + 6;
  };

  const ensureSpace = (y: number, needed: number) => {
    if (y + needed > 272) {
      drawFooter();
      doc.addPage();
      pageNum += 1;
      drawHeader();
      return 40;
    }
    return y;
  };

  drawHeader();

  // ---- Dados do cliente ----
  let y = sectionTitle("DADOS DO CLIENTE", 42);
  y = bodyLine("Nome:", data.customerName, y);
  y = bodyLine("Telefone:", data.customerPhone, y);
  y += 2;

  // ---- Endereco ----
  y = sectionTitle("ENDEREÇO DE ENTREGA", y);
  y = bodyLine("Endereço:", `${data.address} - ${data.city}`, y);
  y = bodyLine("CEP:", data.zip, y);
  y += 4;

  // ---- Itens ----
  y = ensureSpace(y, 20);
  y = sectionTitle("ITENS DO PEDIDO", y);

  const colQtd = MARGIN;
  const colProd = MARGIN + 14;
  const colUnit = PAGE_W - MARGIN - 33;
  const colSub = PAGE_W - MARGIN;

  const drawTableHeader = (ty: number) => {
    doc.setFillColor(...LIGHT);
    doc.rect(MARGIN, ty - 4.5, CONTENT_W, 7, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(...GRAY);
    doc.text("QTD", colQtd + 1, ty);
    doc.text("PRODUTO", colProd, ty);
    doc.text("UNITÁRIO", colUnit, ty, { align: "right" });
    doc.text("SUBTOTAL", colSub, ty, { align: "right" });
    return ty + 6;
  };

  y = drawTableHeader(y);

  data.items.forEach((item, idx) => {
    const descLines = item.description
      ? doc.splitTextToSize(item.description, CONTENT_W - 62).slice(0, 2)
      : [];
    const rowH = 6 + descLines.length * 3.8 + 3;
    y = ensureSpace(y, rowH + 2);
    if (y === 40) y = drawTableHeader(y);

    if (idx > 0) {
      doc.setDrawColor(232, 235, 240);
      doc.line(MARGIN, y - 4, PAGE_W - MARGIN, y - 4);
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...NAVY);
    doc.text(String(item.quantity), colQtd + 1, y);
    doc.text(item.name, colProd, y, { maxWidth: CONTENT_W - 62 });

    doc.setFont("helvetica", "normal");
    doc.setTextColor(40, 44, 52);
    doc.text(formatBRL(item.price), colUnit, y, { align: "right" });
    doc.setFont("helvetica", "bold");
    doc.text(formatBRL(item.price * item.quantity), colSub, y, { align: "right" });

    if (descLines.length > 0) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...GRAY);
      descLines.forEach((line: string, i: number) => {
        const suffix =
          i === 1 && item.description && doc.splitTextToSize(item.description, CONTENT_W - 62).length > 2
            ? "..."
            : "";
        doc.text(line + suffix, colProd, y + 4 + i * 3.8);
      });
    }
    y += rowH;
  });

  // ---- Totais ----
  y = ensureSpace(y + 4, 40);
  const boxW = 78;
  const boxX = PAGE_W - MARGIN - boxW;
  const boxH = 30;
  doc.setFillColor(...LIGHT);
  doc.roundedRect(boxX, y, boxW, boxH, 2, 2, "F");

  let ty = y + 7;
  doc.setFontSize(9.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(40, 44, 52);
  doc.text("Subtotal", boxX + 5, ty);
  doc.text(formatBRL(data.total), boxX + boxW - 5, ty, { align: "right" });

  ty += 6;
  doc.text("Frete", boxX + 5, ty);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(22, 163, 74);
  doc.text("A combinar", boxX + boxW - 5, ty, { align: "right" });

  ty += 4;
  doc.setDrawColor(210, 215, 222);
  doc.line(boxX + 5, ty, boxX + boxW - 5, ty);

  ty += 6.5;
  doc.setFontSize(10.5);
  doc.setTextColor(...NAVY);
  doc.text("TOTAL DOS PRODUTOS", boxX + 5, ty);
  doc.setTextColor(...BLUE);
  doc.setFontSize(11.5);
  doc.text(formatBRL(data.total), boxX + boxW - 5, ty, { align: "right" });

  // ---- Nota sobre o frete ----
  y += boxH + 8;
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(...GRAY);
  const note = doc.splitTextToSize(
    "O valor do frete será calculado e somado ao total durante o atendimento no WhatsApp. Este documento é um resumo do pedido e não possui valor fiscal.",
    CONTENT_W,
  );
  doc.text(note, MARGIN, y);

  drawFooter();

  doc.save(`pedido-${data.reference.toLowerCase()}.pdf`);
}
