"use client";
import { useState } from "react";

export default function JSONValidator() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  function validate() {
    try {
      JSON.parse(input);
      setResult("Valid JSON");
    } catch (e) {
      setResult("Invalid JSON: " + e.message);
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">JSON Validator</h1>
      <textarea
        className="w-full h-48 p-4 border"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button className="mt-4 p-2 bg-purple-600 text-white" onClick={validate}>
        Validate
      </button>
      <p className="mt-4">{result}</p>
    </div>
  );
}
