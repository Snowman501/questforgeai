"use client";
import { useState } from "react";

export default function HeaderInspector() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);

  async function inspect() {
    const res = await fetch("/api/header-inspector", {
      method: "POST",
      body: JSON.stringify({ url })
    });

    const data = await res.json();
    setResult(data);
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Header Inspector</h1>
      <p className="text-gray-600 mb-4">
        Analyze HTTP headers, security, caching, compression, and more.
      </p>

      <input
        className="border p-2 w-full"
        placeholder="Enter website URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <button
        className="mt-4 p-2 bg-purple-600 text-white"
        onClick={inspect}
      >
        Inspect Headers
      </button>

      {result && (
        <div className="mt-6">
          <h2 className="text-xl font-bold">Results</h2>
          <pre className="bg-gray-100 p-4 whitespace-pre-wrap">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
