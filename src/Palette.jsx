import { useState } from "react";
import { useEffect } from "react";

function randomColor() {
    return "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
}


export default function Palette() {
    const [colors, setColors] = useState([]);
    const [copied, setCopied] = useState(null);

    function generatePalette() {
        const newColors = Array.from({ length: 5 }, randomColor);
        setColors(newColors);
    }

    function copyColor(color) {
        navigator.clipboard.writeText(color);
        setCopied(color);

        setTimeout(() => {
            setCopied(null);
        }, 1000);
    }

    useEffect(() => {
        generatePalette();
    }, []);

    return (
        <div className="palette-container">
            <button className="generate-btn" onClick={generatePalette}>Generate Palette</button>

            <div className="palette">
                {colors.map(color => (
                    <div
                    key={color}
                    className="card"
                    style={{background: color}}
                    onClick={() => copyColor(color)}
                    >
                    <span>{copied === color ? "Copied!" : color}</span>
                </div>
                ))}
            </div>
        </div>
    )
}