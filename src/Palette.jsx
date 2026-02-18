import { useState } from "react";
import { useEffect } from "react";

function randomColor() {
    return "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
}


export default function Palette() {
    const [colors, setColors] = useState([]);

    function generatePalette() {
        const newColors = Array.from({ length: 5 }, randomColor);
        setColors(newColors);
    }

    useEffect(() => {
        generatePalette();
    }, []);

    return (
        <div>
            <button onClick={generatePalette}>Generate Palette</button>

            <div className="palette">
                {colors.map(color => (
                    <div
                    key={color}
                    className="card"
                    style={{background: color}}
                    >
                        {color}
                </div>
                ))}
            </div>
        </div>
    )
}