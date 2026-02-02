import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 animate-in fade-in duration-1000 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30 bg-[url('./assets/buildings-image.jpg')] bg-center bg-no-repeat pointer-events-none"></div>
      <div className="w-full max-w-md py-2 px-6 relative z-10">
        <p> Bem Vindo(a/e) ao</p>
        <h1 className="text-6xl font-bold text-primary space-y-2 mb-4">
              UBS 
              <span className="bg-gradient-to-r from-[#b10606] via-[#971e99] to-[#0b0198] bg-clip-text text-transparent">
                BRAN
                </span>
            </h1>
        <Outlet />
      </div>
    </div>
  );
}
