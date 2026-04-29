"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(document.cookie.includes("auth=1"));
  }, []);

  const handleLogout = () => {
    document.cookie = "auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "/login";
  };

  // Ne pas afficher la navbar sur la page de login
  if (pathname === "/login") {
    return null;
  }

  return (
    <nav className="bg-slate-800 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-white hover:text-slate-300 transition-colors">
            Gestion Bancaire
          </Link>
          <div className="flex items-center space-x-4">
            <Link
              href="/clients"
              className="px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            >
              Clients
            </Link>
            <Link
              href="/comptes"
              className="px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            >
              Comptes
            </Link>
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors border border-red-600/30"
              >
                Deconnexion
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
