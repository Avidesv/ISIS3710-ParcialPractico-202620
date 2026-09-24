import { getSession } from "./session";

// La URL del back se configura en el archivo .env.local (ver .env.example)
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Envía el correo y la contraseña al back y devuelve los datos del usuario (id, userName...)
export async function login(email: string, password: string) {
  const response = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "No se pudo iniciar sesión");
  }

  return data;
}

// Crea un usuario nuevo en el back y devuelve su id
export async function register(
  username: string,
  email: string,
  name: string,
  password: string
) {
  const response = await fetch(`${API_URL}/plans`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userName: username, email, name, password, userID: getSession }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "No se pudo crear la cuenta");
  }

  return data.id;
}
