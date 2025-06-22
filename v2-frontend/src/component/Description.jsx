import React from "react";

export default function TextInput ({value, setValue}) {
    return (
        <div className="text-input">
            <label>Description: </label> 
            <textarea 
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Describe what you want to generate"
            rows={5}
            style={{width: "80%"}}
            />
        </div>
    )
}