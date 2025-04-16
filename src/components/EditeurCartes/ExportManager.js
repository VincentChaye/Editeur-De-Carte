import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export async function exporterPNG(cardRef) {
  if (!cardRef.current) return;
  await waitForImagesToLoad(cardRef.current);
  const scale = 2;
  const canvas = await html2canvas(cardRef.current, { scale });

  const trueWidth = canvas.width / scale;
  const trueHeight = canvas.height / scale;

  const resizedCanvas = document.createElement("canvas");
  resizedCanvas.width = trueWidth;
  resizedCanvas.height = trueHeight;

  const ctx = resizedCanvas.getContext("2d");
  ctx.drawImage(canvas, 0, 0, trueWidth, trueHeight);

  const link = document.createElement("a");
  link.download = "carte.png";
  link.href = resizedCanvas.toDataURL("image/png");
  link.click();
}

export async function exporterPDF(cardRef) {
  if (!cardRef.current) return;
  await waitForImagesToLoad(cardRef.current);
  const scale = 2;
  const canvas = await html2canvas(cardRef.current, { scale });
  const imgData = canvas.toDataURL("image/png");

  const largeurPx = canvas.width;
  const hauteurPx = canvas.height;
  const pdfWidth = (largeurPx / scale) * 0.2646;
  const pdfHeight = (hauteurPx / scale) * 0.2646;

  const pdf = new jsPDF({
    orientation: pdfWidth > pdfHeight ? "landscape" : "portrait",
    unit: "mm",
    format: [pdfWidth, pdfHeight],
  });

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save("carte.pdf");
}

export function exporterCarteJSON(carteActive) {
  if (!carteActive) return;
  const blob = new Blob([JSON.stringify(carteActive.champs, null, 2)], {
    type: "application/json",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${carteActive.titre}.json`;
  link.click();
}

export function exporterDeckJSON(deckNom, cartes) {
  const blob = new Blob(
    [JSON.stringify({ deck: deckNom, cartes }, null, 2)],
    { type: "application/json" }
  );
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${deckNom}.json`;
  link.click();
}

function waitForImagesToLoad(container) {
  const images = container.querySelectorAll('img');
  const promises = Array.from(images).map((img) => {
    if (img.complete) return Promise.resolve();
    return new Promise((resolve) => {
      img.onload = resolve;
      img.onerror = resolve;
    });
  });
  return Promise.all(promises);
}
