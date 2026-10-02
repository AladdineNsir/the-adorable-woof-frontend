import { useRef } from "react";
import { Download, FileCode2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

import AdminPageHeader from "../components/AdminPageHeader";

const destinationUrl = "https://www.adorablewoof.tn/";
const qrColor = "#000000";

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default function QrCodePage() {
  const previewRef = useRef(null);

  const getSvgMarkup = () => {
    const svg = previewRef.current?.querySelector("svg");
    if (!svg) throw new Error("Le code QR n'est pas disponible.");

    const clone = svg.cloneNode(true);
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    return new XMLSerializer().serializeToString(clone);
  };

  const downloadSvg = () => {
    const blob = new Blob([getSvgMarkup()], { type: "image/svg+xml;charset=utf-8" });
    downloadBlob(blob, "code-qr-theadorablewoof.svg");
  };

  const downloadPng = () => {
    const svg = new Blob([getSvgMarkup()], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svg);
    const image = new Image();

    image.onload = () => {
      const scale = 3;
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth * scale;
      canvas.height = image.naturalHeight * scale;
      const context = canvas.getContext("2d");

      context.fillStyle = "#FFFFFF";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) downloadBlob(blob, "code-qr-theadorablewoof.png");
        URL.revokeObjectURL(svgUrl);
      }, "image/png");
    };

    image.onerror = () => URL.revokeObjectURL(svgUrl);
    image.src = svgUrl;
  };

  return (
    <section>
      <AdminPageHeader title="Code QR" description="Code QR statique pour votre site web." />

      <div className="mt-6 max-w-4xl border border-[#E7DED2] bg-white p-5 shadow-sm sm:p-6">
        <div className="grid gap-7 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] sm:items-center">
          <div className="flex justify-center border border-[#E7DED2] bg-white p-5 sm:p-7">
            <div ref={previewRef} className="aspect-square w-full max-w-[288px]">
              <QRCodeSVG
                value={destinationUrl}
                size={288}
                className="block h-full w-full"
                level="H"
                fgColor={qrColor}
                bgColor="#FFFFFF"
                includeMargin
                title="Code QR vers adorablewoof.tn"
              />
            </div>
          </div>

          <div>
            <h2 className="text-base font-semibold text-velora-dark">Destination URL</h2>
            <a
              href={destinationUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 block break-all text-sm text-velora-gold underline underline-offset-2"
            >
              {destinationUrl}
            </a>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={downloadPng}
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-velora-gold px-4 text-sm font-semibold text-white transition hover:bg-velora-goldHover"
              >
                <Download size={16} />
                Télécharger PNG
              </button>
              <button
                type="button"
                onClick={downloadSvg}
                className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#E7DED2] bg-white px-4 text-sm font-semibold text-velora-dark transition hover:border-velora-gold hover:text-velora-gold"
              >
                <FileCode2 size={16} />
                Télécharger SVG
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}