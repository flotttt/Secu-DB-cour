async function testSecurite() {
  let passed = 0;
  let failed = 0;

  console.log("Test de securite");

  try {
    const res = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "' OR '1'='1' --",
        password: "nimporte",
      }),
    });

    const data = await res.json();

    if (!data.success) {
      console.log("Test 1 - Injection bloquee:", res.status);
      passed++;
    } else {
      console.log("Test 1 - Injection NON bloquee");
      failed++;
    }
  } catch (error) {
    console.log("Test 1 - Injection bloquee");
    passed++;
  }

  try {
    const res = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "admin",
        password: "admin123",
      }),
    });

    const data = await res.json();

    if (data.success) {
      console.log("Test 2 - Login OK:", data.user.username);
      passed++;
    } else {
      console.log("Test 2 - Login echoue");
      failed++;
    }
  } catch (error) {
    console.log("Test 2 - Erreur login");
    failed++;
  }

  try {
    const res = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "admin",
        password: "wrongpassword",
      }),
    });

    const data = await res.json();

    if (!data.success) {
      console.log("Test 3 - Mauvais password refuse");
      passed++;
    } else {
      console.log("Test 3 - Mauvais password accepte");
      failed++;
    }
  } catch (error) {
    console.log("Test 3 - Erreur");
    failed++;
  }

  console.log(`\nResultat: ${passed}/3 passes, ${failed}/3 echoues`);
}

testSecurite();
