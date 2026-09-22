import Link from "next/link";

export default function WritingHome() {
  return (
    <main className="prose prose-invert mx-auto p-6 text-gray-200">
      <h1 className="text-4xl font-bold text-purple-400 mb-8 text-center">
        My Columns
      </h1>

      <div className="text-center mb-12">
        <img
          src="/loren-headshot.jpg"
          alt="Loren Barnhart"
          className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
        />
        <h2 className="text-2xl font-semibold text-gray-300">Loren Barnhart</h2>
        <p className="text-gray-400 text-sm">
          Independent American author & storyteller
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-800 p-6 rounded-xl border border-purple-700">
          <h3 className="text-purple-300 text-xl font-bold mb-2">Turn Around</h3>
          <p className="text-gray-400 text-sm mb-4">
            It was late afternoon on Highway 71 when everything in my life felt like it was collapsing...
          </p>
          <Link href="/turn-around" className="text-purple-400 underline">
            Read More →
          </Link>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl border border-purple-700">
          <h3 className="text-purple-300 text-xl font-bold mb-2">Column Two</h3>
          <p className="text-gray-400 text-sm mb-4">
            Your second column preview goes here...
          </p>
          <Link href="/column-two" className="text-purple-400 underline">
            Read More →
          </Link>
        </div>
      </div>
    </main>
  );
}
