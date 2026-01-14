import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="rounded-lg p-[3px] bg-gradient-to-r from-[#b10606] via-[#971e99] to-[#0b0198] min-h-screen flex flex-col items-center justify-center bg-gray-200 animate-in fade-in duration-1000">
      <div className="border rounded-lg p-12 space-y-4 bg-gray-50 min-w-[500px] min-h-[400px] flex flex-col items-center justify-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Página Não Encontrada</p>
        <Link
          to="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Voltar ao UBS BRAN
        </Link>
      </div>
    </div>
  );
}
