import { useState } from "react";
import FileUploader from "./FileUploader";
import FileInfo from "./FileInfo";
import FileCard from "./FileCard"; // Adjust path if needed
import FilePreview from "./FilePreview";
import JSZip from "jszip";

export default function App() {
    const [files, setFiles] = useState([]);
    const [format, setFormat] = useState("image/jpeg");
    const [quality, setQuality] = useState(0.8);
    const [resizeWidth, setResizeWidth] = useState(0);
  
    // Add files avoiding duplicates
    const handleFilesSelected = selectedFiles => {
      const newFiles = Array.from(selectedFiles).filter(
        f => !files.some(existing => existing.name === f.name)
      );
      setFiles(prev => [...prev, ...newFiles]);
    };
  
    // Convert all and download as ZIP
    const convertAll = async () => {
      if (files.length === 0) return alert("No files selected!");
      const zip = new JSZip();
  
      for (const file of files) {
        if (!file.type.startsWith("image/")) continue;
        const imgURL = URL.createObjectURL(file);
        const img = new Image();
        img.src = imgURL;
        await new Promise(resolve => (img.onload = resolve));
  
        const canvas = document.createElement("canvas");
        const scale = resizeWidth > 0 ? resizeWidth / img.width : 1;
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
        const blob = await new Promise(resolve =>
          canvas.toBlob(resolve, format, quality)
        );
        const ext = format === "image/png" ? ".png" : ".jpg";
        zip.file(file.name.replace(/\.[^/.]+$/, ext), blob);
        URL.revokeObjectURL(imgURL);
      }
  
      const content = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = "converted-images.zip";
      link.click();
    };
  
    return (
      <div className="app-container">
        <h1>Batch Image Converter</h1>
  
        <FileUploader onFilesSelect={handleFilesSelected} />
  
        {files.length > 0 && (
          <>
            <div className="convert-controls">
              <label>
                Format:
                <select value={format} onChange={e => setFormat(e.target.value)}>
                  <option value="image/png">PNG</option>
                  <option value="image/jpeg">JPEG</option>
                </select>
              </label>
  
              {format === "image/jpeg" && (
                <label>
                  Quality: {(quality * 100).toFixed(0)}%
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
                  min="0"
                  value={resizeWidth}
                  onChange={e => setResizeWidth(Number(e.target.value))}
                />
                <span>Height adjusts automatically</span>
              </label>
  
              <button className="download-btn" onClick={convertAll}>
                Convert & Download All
              </button>
            </div>
  
            <div className="previews-grid">
              {files.map(file => (
                <FilePreview key={file.name} file={file} />
              ))}
            </div>
          </>
        )}
      </div>
    );
  }