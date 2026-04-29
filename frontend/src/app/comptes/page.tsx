"use client";

import { useEffect, useState } from "react";

interface Compte {
  id_compte: number;
  id_client: number;
  numero_compte: string;
  type_compte: string;
  solde: number;
  statut: string;
}

export default function ComptesPage() {
  const [comptes, setComptes] = useState<Compte[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/comptes")
      .then((res) => res.json())
      .then((data) => {
        setComptes(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Liste des Comptes</h1>

      {loading ? (
        <p className="text-slate-400">Chargement...</p>
      ) : (
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700">
              <thead className="bg-slate-900">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">ID Client</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">N Compte</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Solde</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {comptes.map((compte) => (
                  <tr key={compte.id_compte} className="hover:bg-slate-750">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-300">{compte.id_compte}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-300">{compte.id_client}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-white">{compte.numero_compte}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-300 capitalize">{compte.type_compte}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-white">{Number(compte.solde).toFixed(2)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          compte.statut === "actif"
                            ? "bg-emerald-900 text-emerald-300"
                            : "bg-red-900 text-red-300"
                        }`}
                      >
                        {compte.statut}
                      </span>
                    </td>
                  </tr>
                ))}
                {comptes.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-500">
                      Aucun compte trouve.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
