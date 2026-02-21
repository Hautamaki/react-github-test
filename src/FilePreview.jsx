import { useEffect, useState } from "react";

export default function FilePreview({ file }) {
  const [preview, setPreview] = useState(null);
  const [dimensions, setDimensions] = useState(null);

  useEffect(() => {
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreview(url);

      const img = new Image();
      img.src = url;
      img.onload = () => setDimensions({ width: img.width, height: img.height });

      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  return (
    <div className="file-card">
      {preview && <img src={preview} alt={file.name} className="preview" />}
      <p>{file.name}</p>
      {dimensions && <p>{dimensions.width} x {dimensions.height}</p>}
    </div>
  );
}
