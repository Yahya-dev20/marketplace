import { useState } from "react";
import Icon from "./Icon";

export default function ProductImage({ url, loading = "lazy" }: {
  url?: string | null;
  loading?: "lazy" | "eager";
}) {
  const [failedUrl, setFailedUrl] = useState<string>();
  if (url && url !== failedUrl) {
    return <img className="product-image" src={url} alt="" loading={loading}
      onError={() => setFailedUrl(url)} />;
  }

  return <><Icon name="box" /><span>Visuel non disponible</span></>;
}
