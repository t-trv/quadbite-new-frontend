export default function Map({ iframeSrc }: { iframeSrc: string }) {
  return <iframe src={iframeSrc} width="100%" height="400" style={{ border: 0 }} loading="lazy" />;
}
