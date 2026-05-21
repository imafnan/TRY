import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0d2353] flex items-center justify-center p-4">
      <div className="text-center text-white">
        <h1 className="text-8xl font-bold mb-4 opacity-30">404</h1>
        <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
        <p className="text-white/60 mb-8">The page you are looking for does not exist.</p>
        <Link
          href="/"
          className="inline-block bg-white text-[#0d2353] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
