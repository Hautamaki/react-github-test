import { useEffect, useState } from "react";

export default function FileInfo({ file }) {
  const [dimensions, setDimensions] = useState(null);
  const [format, setFormat] = useState(file.type);
  const [quality, setQuality] = useState(0.8); // for JPEG
  const [resizeWidth, setResizeWidth] = useState(0); // 0 = original width
  const [keepOriginalSize, setKeepOriginalSize] = useState(true);


  useEffect(() => {
    if (file.type.startsWith("image/")) {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        setDimensions({ width: img.width, height: img.height });
        setResizeWidth(img.width); // default: full width
      };
    } else {
      setDimensions(null);
    }
  }, [file]);

  function formatSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    else if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    else return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  function downloadConverted() {
    if (!file.type.startsWith("image/")) return alert("Not an image!");

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");

      // Calculate height to maintain aspect ratio
      const scale =
      keepOriginalSize || resizeWidth === 0
        ? 1
        : resizeWidth / img.width;
    
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
    <div className="file-info">
      <p><strong>Name:</strong> {file.name}</p>
      <p><strong>Type:</strong> {file.type}</p>
      <p><strong>Size:</strong> {formatSize(file.size)}</p>
      {dimensions && (
        <p><strong>Dimensions:</strong> {dimensions.width} x {dimensions.height}</p>
      )}

      {file.type.startsWith("image/") && (
        <div className="convert-controls">
          <label>
            Format:
            <select value={format} onChange={e => setFormat(e.target.value)}>
              <option value="image/png">PNG</option>
              <option value="image/jpeg">JPEG</option>
            </select>
          </label>

<label className="checkbox">
  <input
    type="checkbox"
    checked={keepOriginalSize}
    onChange={() => setKeepOriginalSize(prev => !prev)}
  />
  Keep original size
</label>

{/* Only show when unchecked */}
{!keepOriginalSize && (
  <label>
    Resize Width (px):
    <input
      type="number"
      min="1"
      value={resizeWidth}
      onChange={e => setResizeWidth(Number(e.target.value))}
      placeholder="e.g. 2000"
    />
    <span>Height adjusts automatically</span>
  </label>
)}

          <button className="download-btn" onClick={downloadConverted}>
            Download Converted
          </button>
        </div>
      )}
    </div>
  );
}
