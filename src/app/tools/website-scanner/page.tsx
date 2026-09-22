"use client";
import { useState } from "react";

export default function WebsiteScanner() {
  const [url, setUrl] = useState("");
  const [scanResult, setScanResult] = useState(null);
  const [aiFixes, setAiFixes] = useState("");

  async function runScan() {
    const res = await fetch("/api/scan", {
      method: "POST",
      body: JSON.stringify({ url })
    });

    const data = await res.json();
    setScanResult(data);

    const ai = await fetch("/api/ollama", {
      method: "POST",
      body: JSON.stringify({
        model: "llama3",
        prompt: `Here is a website scan result. Explain the issues and give fixes:\n\n${JSON.stringify(data)}`
      })
    });

    const aiData = await ai.json();
    setAiFixes(aiData.output);
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Website Scanner + AI Fixes</h1>

      <input
        className="border p-2 w-full"
        placeholder="Enter website URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <button
        className="mt-4 p-2 bg-purple-600 text-white"
        onClick={runScan}
      >
        Scan Website
      </button>

      {scanResult && (
        <div className="mt-6">
          <h2 className="text-xl font-bold">Scan Result</h2>
          <pre className="bg-gray-100 p-4">{JSON.stringify(scanResult, null, 2)}</pre>
        </div>
      )}

      {aiFixes && (
        <div className="mt-6">
          <h2 className="text-xl font-bold">AI Fixes</h2>
          <pre className="bg-gray-100 p-4 whitespace-pre-wrap">{aiFixes}</pre>
        </div>
      )}
    </div>
  );
}
