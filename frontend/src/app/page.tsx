"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-12">
      <h1 className="text-4xl font-bold text-white mb-12 text-center">
        Gestion Bancaire
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        <Link
          href="/clients"
          className="group block p-8 bg-slate-800 rounded-xl border border-slate-700 hover:border-slate-500 hover:bg-slate-750 transition-all"
        >
          <div className="flex items-center justify-center w-14 h-14 mb-4 rounded-full bg-blue-600 group-hover:bg-blue-500 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-7 h-7 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2">Clients</h2>
          <p className="text-slate-400">
            Gerer les clients de la banque : ajouter, modifier et supprimer des fiches clients.
          </p>
        </Link>

        <Link
          href="/comptes"
          className="group block p-8 bg-slate-800 rounded-xl border border-slate-700 hover:border-slate-500 hover:bg-slate-750 transition-all"
        >
          <div className="flex items-center justify-center w-14 h-14 mb-4 rounded-full bg-emerald-600 group-hover:bg-emerald-500 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-7 h-7 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2">Comptes</h2>
          <p className="text-slate-400">
            Gerer les comptes bancaires : creer des comptes courants ou epargne, consulter les soldes.
          </p>
        </Link>
      </div>
    </div>
  );
}
