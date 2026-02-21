import { useRef } from "react";

export default function FileUploader({ onFilesSelect }) {
  const inputRef = useRef();

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    onFilesSelect(e.dataTransfer.files);
  }

  function handleClick() {
    inputRef.current.click();
  }

  return (
    <div
      className="uploader"
      onDrop={handleDrop}
      onDragOver={e => e.preventDefault()}
      onClick={handleClick}
    >
      <input
        type="file"
        multiple
        ref={inputRef}
        style={{ display: "none" }}
        onChange={e => onFilesSelect(e.target.files)}
      />
      <p>Drag & drop images here or click to select</p>
    </div>
  );
}
