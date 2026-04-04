import React from "react";
import { Link } from "react-router-dom";

const RoleDashboardTemplate = ({ title, subtitle, modules }) => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="rounded-3xl bg-slate-900 p-8 text-white shadow-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">Role Workspace</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{title}</h1>
          <p className="mt-3 max-w-3xl text-slate-200">{subtitle}</p>
        </header>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {modules.map((module) => (
            <article key={module.name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-800">{module.name}</h2>
              <ul className="mt-4 space-y-2">
                {module.submodules.map((submodule, index) => {
                  const moduleLink = module.links?.[index];

                  return moduleLink ? (
                    <li key={submodule}>
                      <Link to={moduleLink} className="block rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700 transition hover:bg-cyan-50 hover:text-cyan-800">
                        {submodule}
                      </Link>
                    </li>
                  ) : (
                    <li key={submodule} className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-500">
                      {submodule} (planned)
                    </li>
                  );
                })}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default RoleDashboardTemplate;
