import React from "react";
import "./Description.css"

export default function TextInput ({value, setValue}) {
    return (
        <div className="text-input">
            <textarea 
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Describe what you want to generate..."
            rows={5}
            />
        </div>
    );
}