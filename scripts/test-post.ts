import fs from "fs";
import path from "path";

async function run() {
  console.log("Logging in...");
  const loginRes = await fetch("http://localhost:3000/api/admin/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@crecerlibreria.cl", password: "AdminTemporal123!" }),
  });

  if (!loginRes.ok) {
    console.error("Login failed", await loginRes.text());
    return;
  }

  const cookie = loginRes.headers.get("set-cookie");
  console.log("Got cookie:", cookie ? "Yes" : "No");

  console.log("Submitting encounter...");
  const formData = new FormData();
  formData.append("title", "Test Encuentro");
  formData.append("event_date", "2026-06-30T10:00");
  formData.append("excerpt", "Un extracto");
  formData.append("description", "Una descripción detallada del encuentro.");
  formData.append("is_active", "true");

  // Create a dummy file blob for the image
  const dummyFile = new Blob(["dummy content"], { type: "image/jpeg" });
  formData.append("file", dummyFile, "cover.jpg");

  const submitRes = await fetch("http://localhost:3000/api/admin/encuentros", {
    method: "POST",
    headers: {
      Cookie: cookie || "",
    },
    body: formData,
  });

  console.log("Status:", submitRes.status);
  console.log("Body:", await submitRes.text());
}

run();
