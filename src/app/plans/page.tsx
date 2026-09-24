import Link from "next/link";
import { getPlans } from "@/services/plans";

export default async function PlansPage() {
  const plans = await getPlans();

  return (
    <div className="flex-1 bg-slate-50 px-24 py-16">
      <h1 className="text-5xl font-bold text-slate-900">Explorar planes</h1>

      <div className="grid grid-cols-4 gap-8 mt-12">
        {plans.map((plan) => (
          <Link key={plan.id} href={`/plans/${plan.id}`}>
            <img
              src={plan.image}
              className="w-full h-60 object-cover rounded-xl"
            />
            <h4 className="text-2xl text-slate-900 mt-3">{plan.name}</h4>
            <p className="flex items-center text-sm text-slate-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4 mr-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
              {plan.creator.name}
            </p>
            <div className="flex justify-between items-center mt-1">
              <p className="text-slate-600">
                Aproximado: ${plan.estimatedPrice}
              </p>
              <p className="flex items-center text-slate-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5 mr-1 text-red-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                  />
                </svg>
                {plan.likes}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
