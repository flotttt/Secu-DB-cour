"use client";

import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      setResult(data);
      
      if (data.success) {
        // Set cookie d authentification
        document.cookie = "auth=1; path=/; max-age=3600";
        // Rediriger vers l accueil apres 500ms
        setTimeout(() => {
          window.location.href = "/";
        }, 500);
      }
    } catch (err) {
      setResult({ success: false, message: "Erreur reseau" });
    } finally {
      setLoading(false);
    }
  };

  const fillInjection = () => {
    setUsername("' OR '1'='1' --");
    setPassword("nimporte");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Connexion</h2>
          <p className="mt-2 text-sm text-slate-400">
            Demo vulnerabilite Injection SQL
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Nom d utilisateur
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="admin"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Mot de passe
              </label>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="votre mot de passe"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white rounded-lg font-medium transition-colors"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>

          <button
            type="button"
            onClick={fillInjection}
            className="w-full py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/30 rounded-lg font-medium transition-colors text-sm"
          >
            Remplir avec une injection SQL
          </button>
        </form>

        {result && (
          <div className={`p-4 rounded-lg ${result.success ? "bg-emerald-900/30 border border-emerald-600/30" : "bg-red-900/30 border border-red-600/30"}`}>
            <p className={`text-sm font-medium ${result.success ? "text-emerald-400" : "text-red-400"}`}>
              {result.message}
            </p>
            {result.user && (
              <div className="mt-2 text-xs text-slate-300 space-y-1">
                <p><span className="text-slate-400">Utilisateur:</span> {result.user.username}</p>
                <p><span className="text-slate-400">Role:</span> {result.user.role}</p>
              </div>
            )}
          </div>
        )}

        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Comment tester l injection SQL
          </h3>
          <p className="text-xs text-slate-500">
            Cliquez sur "Remplir avec une injection SQL" puis "Se connecter". 
            La requete devient: SELECT * FROM utilisateurs WHERE username = &#39;&#39; OR &#39;1&#39;=&#39;1&#39; --&#39; AND password = &#39;nimporte&#39;
            Ce qui contourne l authentification car 1=1 est toujours vrai.
          </p>
        </div>
      </div>
    </div>
  );
}
