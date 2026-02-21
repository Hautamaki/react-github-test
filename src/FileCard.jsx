import { useState, useEffect } from "react";

export default function FileCard({ file }) {
  const [preview, setPreview] = useState(null);
  const [format, setFormat] = useState(file.type);
  const [quality, setQuality] = useState(0.8);
  const [resizeWidth, setResizeWidth] = useState(0);
  const [dimensions, setDimensions] = useState(null);

  useEffect(() => {
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreview(url);

      const img = new Image();
      img.src = url;
      img.onload = () => {
        setDimensions({ width: img.width, height: img.height });
        setResizeWidth(img.width);
      };
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  function downloadConverted() {
    if (!file.type.startsWith("image/")) return;
    const img = new Image();
    img.src = preview;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = resizeWidth > 0 ? resizeWidth / img.width : 1;
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        blob => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          const ext = format === "image/png" ? ".png" : ".jpg";
          link.download = file.name.replace(/\.[^/.]+$/, ext);
          link.click();
          URL.revokeObjectURL(url);
        },
        format,
        quality
      );
    };
  }

  return (
    <div className="file-card">
      {preview && <img src={preview} alt={file.name} className="preview" />}
      <p>{file.name}</p>
      {dimensions && (
        <p>{dimensions.width} x {dimensions.height}</p>
      )}
      <label>
        Format:
        <select value={format} onChange={e => setFormat(e.target.value)}>
          <option value="image/png">PNG</option>
          <option value="image/jpeg">JPEG</option>
        </select>
      </label>
      {format === "image/jpeg" && (
        <label>
          Quality: {(quality*100).toFixed(0)}%
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={quality}
            onChange={e => setQuality(Number(e.target.value))}
          />
        </label>
      )}
      <label>
        Resize Width (px):
        <input
          type="number"
          value={resizeWidth}
          min="0"
          onChange={e => setResizeWidth(Number(e.target.value))}
        />
      </label>
      <button onClick={downloadConverted} className="download-btn">
        Download
      </button>
    </div>
  );
}
