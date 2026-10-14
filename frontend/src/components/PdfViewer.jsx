export default function PdfViewer({ pdfUrl }) {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-slate-300">
      <iframe
        src={pdfUrl}
        title="Visor de documento PDF"
        className="h-96 w-full"
      />
    </div>
  );
}
