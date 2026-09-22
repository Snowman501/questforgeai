export default function ColumnTwo() {
  return (
    <main className="prose prose-invert mx-auto p-6 text-gray-200">
      <h1 className="text-4xl font-bold text-purple-400 mb-8 text-center">
        Column Two
      </h1>

      {/* ✍️ Add your real column text below */}
      <p></p>

      <footer className="border-t border-gray-700 mt-16 pt-10 text-center">
        <img
          src="/loren-headshot.jpg"
          alt="Loren Barnhart"
          className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
        />

        <h2 className="text-xl font-semibold text-gray-300">Written by Loren Barnhart</h2>
        <p className="text-gray-400 text-sm mt-1">Independent American author & storyteller</p>

        <p className="text-sm mt-4">
          📧 <a href="mailto:lb.designstudio.2024@gmail.com" className="text-purple-400 hover:underline">
            lb.designstudio.2024@gmail.com
          </a>
        </p>

        <p className="text-sm">
          📞 <a href="tel:+15012905929" className="text-purple-400 hover:underline">
            +1 501 290 5929
          </a>
        </p>

        <p className="text-xs text-gray-500 mt-6">
          © 2026 Loren Barnhart Publishing — Hot Springs Village, Arkansas
        </p>
      </footer>
    </main>
  );
}
