"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSession, clearSession } from "@/services/session";

// Este componente solo se carga en el navegador (ver Header), por eso puede leer el localStorage.
export default function UserMenu() {
  const router = useRouter();
  const session = getSession();

  function handleLogout() {
    clearSession();
    router.push("/auth/login");
  }

  // Si hay un id guardado, el usuario inició sesión
  if (session.id) {
    return (
      <div className="flex items-center gap-6">
        <Link
          href="/plans/new"
          className="bg-blue-600 text-white text-lg font-semibold rounded-xl px-6 py-3"
>         + Crear Plan
        </Link>
        <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-7 h-7 text-slate-700"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
          <span className="text-lg text-slate-700">{session.username}</span>
        </div>
        <button onClick={handleLogout} className="text-slate-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
            />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link href="/auth/login" className="text-lg text-slate-700">
        Iniciar sesión
      </Link>
      <Link
        href="/auth/register"
        className="bg-blue-600 text-white text-lg font-semibold rounded-xl px-6 py-3"
      >
        Registrarse
      </Link>
    </div>
  );
}
