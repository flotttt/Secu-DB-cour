"use client";

import { useEffect, useState } from "react";

interface Client {
  id_client: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  date_naissance: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/clients")
      .then((res) => res.json())
      .then((data) => {
        setClients(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Liste des Clients</h1>

      {loading ? (
        <p className="text-slate-400">Chargement...</p>
      ) : (
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700">
              <thead className="bg-slate-900">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Nom</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Prenom</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Telephone</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Adresse</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Date naiss.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {clients.map((client) => (
                  <tr key={client.id_client} className="hover:bg-slate-750">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-300">{client.id_client}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-white">{client.nom}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-white">{client.prenom}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-300">{client.email}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-300">{client.telephone}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-300">{client.adresse}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-300">
                      {client.date_naissance ? client.date_naissance.split("T")[0] : ""}
                    </td>
                  </tr>
                ))}
                {clients.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-500">
                      Aucun client trouve.
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
