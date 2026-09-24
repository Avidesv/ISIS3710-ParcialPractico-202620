"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createPlan } from "@/services/plans";
import { getSession } from "@/services/session";

type PlanForm = {
  image: string;
  name: string;
  address: string;
  estimatedPrice: string;
  estimatedTime: string;
  description: string;
  recomendations: string;
};

type FormErrors = {
  name?: string;
  address?: string;
  estimatedPrice?: string;
  estimatedTime?: string;
  description?: string;
};

const initialForm: PlanForm = {
  image: "",
  name: "",
  address: "",
  estimatedPrice: "",
  estimatedTime: "",
  description: "",
  recomendations: "",
};

export default function NewPlanPage() {
  const router = useRouter();
  const [form, setForm] = useState<PlanForm>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function validateForm(): FormErrors {
    const nextErrors: FormErrors = {};
    const name = form.name.trim();
    const price = Number(form.estimatedPrice);
    const duration = Number(form.estimatedTime);

    if (name.length < 2 || name.length > 50) {
      nextErrors.name = "El nombre debe tener entre 2 y 50 caracteres.";
    }

    if (!form.address.trim()) {
      nextErrors.address = "Ingresa la dirección del plan.";
    }

    if (!form.estimatedPrice || !Number.isFinite(price) || price <= 0) {
      nextErrors.estimatedPrice = "El precio debe ser mayor que 0.";
    }

    if (
      !form.estimatedTime ||
      !Number.isInteger(duration) ||
      duration <= 0
    ) {
      nextErrors.estimatedTime =
        "La duración debe ser un número entero mayor que 0.";
    }

    if (!form.description.trim()) {
      nextErrors.description = "Ingresa una descripción del plan.";
    } else if (form.description.length >= 600) {
      nextErrors.description =
        "La descripción debe tener menos de 600 caracteres.";
    }

    return nextErrors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const session = getSession();

    if (!session.id) {
      router.push("/auth/login");
      return;
    }

    setIsSubmitting(true);

    try {
      await createPlan({
        name: form.name.trim(),
        description: form.description.trim(),
        estimatedPrice: Number(form.estimatedPrice),
        estimatedTime: Number(form.estimatedTime),
        recomendations: form.recomendations.trim(),
        address: form.address.trim(),
        image: form.image.trim(),
        userId: session.id,
      });

      router.push("/plans");
    } catch {
      setSubmitError("No se pudo publicar el plan. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex-1 bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold text-slate-900">
          Crear un nuevo plan
        </h1>
        <p className="mt-2 text-slate-600">
          Organiza, invita a tus amigos o abre plazas para que otros miembros
          se sumen a vivir momentos únicos.
        </p>

        <form
          noValidate
          onSubmit={handleSubmit}
          className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
        >
          <div className="mb-6 rounded-xl border border-dashed border-slate-300 p-5">
            <div className="mb-3 flex items-center justify-between gap-4">
              <label htmlFor="image" className="font-semibold text-slate-800">
                Foto de portada del plan
              </label>
              <span className="text-sm text-slate-600">
                Copia el enlace de una imagen
              </span>
            </div>
            <input
              id="image"
              name="image"
              type="url"
              value={form.image}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900"
            />
          </div>

          <div className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="mb-1 block font-semibold text-slate-800"
              >
                Nombre del plan *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                minLength={2}
                maxLength={50}
                required
                aria-describedby={errors.name ? "name-error" : undefined}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900"
                placeholder="Ej. Tarde de paddle surf y atardecer"
              />
              {errors.name && (
                <p id="name-error" className="mt-1 text-sm text-red-700">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="address"
                className="mb-1 block font-semibold text-slate-800"
              >
                Dirección *
              </label>
              <input
                id="address"
                name="address"
                type="text"
                value={form.address}
                onChange={handleChange}
                required
                aria-describedby={errors.address ? "address-error" : undefined}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900"
                placeholder="Ej. Bahía de las Brisas - Muelle Norte"
              />
              {errors.address && (
                <p id="address-error" className="mt-1 text-sm text-red-700">
                  {errors.address}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="estimatedPrice"
                  className="mb-1 block font-semibold text-slate-800"
                >
                  Precio estimado *
                </label>
                <input
                  id="estimatedPrice"
                  name="estimatedPrice"
                  type="number"
                  min="0.01"
                  step="any"
                  value={form.estimatedPrice}
                  onChange={handleChange}
                  required
                  aria-describedby={
                    errors.estimatedPrice ? "price-error" : undefined
                  }
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900"
                  placeholder="Ej. 2500"
                />
                {errors.estimatedPrice && (
                  <p id="price-error" className="mt-1 text-sm text-red-700">
                    {errors.estimatedPrice}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="estimatedTime"
                  className="mb-1 block font-semibold text-slate-800"
                >
                  Duración (minutos) *
                </label>
                <input
                  id="estimatedTime"
                  name="estimatedTime"
                  type="number"
                  min="1"
                  step="1"
                  value={form.estimatedTime}
                  onChange={handleChange}
                  required
                  aria-describedby={
                    errors.estimatedTime ? "time-error" : undefined
                  }
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900"
                  placeholder="Ej. 120"
                />
                {errors.estimatedTime && (
                  <p id="time-error" className="mt-1 text-sm text-red-700">
                    {errors.estimatedTime}
                  </p>
                )}
              </div>
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between gap-4">
                <label
                  htmlFor="description"
                  className="font-semibold text-slate-800"
                >
                  Descripción del plan *
                </label>
                <span className="text-sm text-slate-600">
                  {form.description.length} / 600
                </span>
              </div>
              <textarea
                id="description"
                name="description"
                rows={5}
                maxLength={599}
                value={form.description}
                onChange={handleChange}
                required
                aria-describedby={
                  errors.description ? "description-error" : undefined
                }
                className="w-full resize-y rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900"
                placeholder="Cuéntale a todos de qué va el plan, cuál es la vibra del grupo, el itinerario aproximado y qué lo hace especial."
              />
              {errors.description && (
                <p
                  id="description-error"
                  className="mt-1 text-sm text-red-700"
                >
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="recomendations"
                className="mb-1 block font-semibold text-slate-800"
              >
                Recomendaciones para los asistentes
              </label>
              <p className="mb-2 text-sm text-slate-600">
                Agrega tips clave como vestimenta recomendada, qué llevar o
                recordatorios puntuales.
              </p>
              <textarea
                id="recomendations"
                name="recomendations"
                rows={3}
                value={form.recomendations}
                onChange={handleChange}
                className="w-full resize-y rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900"
                placeholder="Ej. Llevar protector solar, toalla y agua"
              />
            </div>
          </div>

          {submitError && (
            <p aria-live="polite" className="mt-5 text-sm text-red-700">
              {submitError}
            </p>
          )}

          <div className="mt-8 flex justify-end gap-3 border-t border-slate-200 pt-5">
            <Link
              href="/plans"
              className="rounded-xl bg-slate-200 px-6 py-3 font-semibold text-slate-800"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white disabled:opacity-60"
            >
              {isSubmitting ? "Publicando..." : "Publicar plan"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}