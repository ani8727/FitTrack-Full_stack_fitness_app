function Stat({ label, value }) {
  return (
    <div className="rounded-2xl bg-white shadow-md border border-slate-100 px-4 py-3">
      <div className="text-2xl font-semibold text-slate-900">{value}</div>
      <div className="text-sm text-slate-500">{label}</div>
    </div>
  );
}

function Pill({ children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 text-slate-700 px-3 py-1 text-xs font-semibold">
      {children}
    </span>
  );
}

export default function LandingPage({ onSignIn, onSignUp }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white text-slate-900">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_15%,rgba(79,70,229,0.06),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(14,165,233,0.06),transparent_30%),radial-gradient(circle_at_60%_80%,rgba(16,185,129,0.06),transparent_35%)]" aria-hidden />

      {/* Navbar */}
      <header className="relative z-10 border-b border-slate-200/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/20">
              FT
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-slate-500">FitTrack</p>
              <p className="text-base font-semibold text-slate-900">Full-stack fitness</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm font-semibold">
            <a className="text-slate-600 hover:text-slate-900" href="#features">Features</a>
            <a className="text-slate-600 hover:text-slate-900" href="#how">How it works</a>
            <a className="text-slate-600 hover:text-slate-900" href="#cta">Get started</a>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onSignIn}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 hover:border-slate-300 hover:bg-white transition"
            >
              Sign in
            </button>
            <button
              onClick={onSignUp}
              className="rounded-full bg-indigo-600 text-white px-4 py-2 text-sm font-semibold shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 transition"
            >
              Get started
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-20 pt-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <Pill>AI insights</Pill>
              <Pill>Personalized plans</Pill>
              <Pill>Activity analytics</Pill>
              <Pill>Secure by Auth0</Pill>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-slate-900 tracking-tight">
              Track. Improve. Stay accountable.
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
              FitTrack unifies workouts, goals, nutrition, and coaching. Plan your day, log activities, and unlock tailored recommendations powered by AI.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={onSignUp}
                className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-500 transition"
              >
                Create your account
              </button>
              <button
                onClick={onSignIn}
                className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-800 hover:border-slate-300 hover:bg-white transition"
              >
                I already have an account
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 pt-4">
              <Stat label="Weekly workouts planned" value="12k" />
              <Stat label="Active users" value="48k" />
              <Stat label="Avg. streak" value="18 days" />
              <Stat label="Coach approvals" value="4.9/5" />
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-indigo-500/10">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">Today</p>
                  <h3 className="text-xl font-semibold text-slate-900">Your daily plan</h3>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">Synced</span>
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-700">
                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 border border-slate-200">
                  <span className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold">AM</span>
                  <div>
                    <p className="font-semibold text-slate-900">Morning strength</p>
                    <p className="text-slate-600">45 min · Push day · RPE 7</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 border border-slate-200">
                  <span className="h-10 w-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-semibold">NOON</span>
                  <div>
                    <p className="font-semibold text-slate-900">Fuel & focus</p>
                    <p className="text-slate-600">Balanced macros · Hydration reminders</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 border border-slate-200">
                  <span className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-semibold">PM</span>
                  <div>
                    <p className="font-semibold text-slate-900">Cardio & recovery</p>
                    <p className="text-slate-600">30 min tempo run · Mobility cool-down</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-slate-50 border border-slate-200 p-4 text-sm text-slate-700">
                <p className="font-semibold text-slate-900">Why FitTrack?</p>
                <p className="mt-2">AI-recommended sessions, readiness-aware plans, and streak tracking keep you consistent without the guesswork.</p>
              </div>
            </div>
            <div className="pointer-events-none absolute -left-6 -top-6 h-24 w-24 rounded-full bg-indigo-200/60 blur-3xl" aria-hidden />
            <div className="pointer-events-none absolute -right-8 bottom-6 h-28 w-28 rounded-full bg-emerald-200/50 blur-3xl" aria-hidden />
          </div>
        </div>

        {/* Features */}
        <section id="features" className="mt-16 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Plan smarter",
              desc: "Daily plans with macro balance, session intensity, and recovery baked in.",
              accent: "bg-indigo-100 text-indigo-800",
            },
            {
              title: "Stay consistent",
              desc: "Streak tracking, nudges, and readiness-aware adjustments keep you on track.",
              accent: "bg-emerald-100 text-emerald-800",
            },
            {
              title: "Own your data",
              desc: "Secure Auth0 login, privacy-first, and exportable activity history.",
              accent: "bg-amber-100 text-amber-800",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${item.accent}`}>{item.title}</span>
              <p className="mt-3 text-slate-700 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </section>

        {/* How it works */}
        <section id="how" className="mt-16 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">How it works</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-3 text-sm text-slate-700">
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
              <p className="font-semibold text-slate-900">1) Sign up or sign in</p>
              <p className="mt-2">Secure Auth0 login, no password hassle. Keep your identity safe.</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
              <p className="font-semibold text-slate-900">2) Onboard in minutes</p>
              <p className="mt-2">Tell us your goals, schedule, and preferences. We tailor your plan.</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
              <p className="font-semibold text-slate-900">3) Track & improve</p>
              <p className="mt-2">Log activities, get AI suggestions, and stay consistent with streaks.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="cta" className="mt-16 flex flex-col gap-3 rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 px-6 py-8 text-white shadow-xl">
          <h3 className="text-2xl font-semibold">Ready to start?</h3>
          <p className="text-white/90">Sign up in seconds or jump back in if you already have an account.</p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={onSignUp}
              className="rounded-full bg-white text-indigo-700 px-5 py-3 text-sm font-semibold shadow hover:bg-slate-50 transition"
            >
              Create your account
            </button>
            <button
              onClick={onSignIn}
              className="rounded-full border border-white/70 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
            >
              Sign in
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 md:flex-row md:items-center md:justify-between text-sm text-slate-600">
          <div className="flex items-center gap-2 font-semibold text-slate-800">
            <span className="rounded-lg bg-indigo-600 text-white px-2 py-1 text-xs">FT</span>
            FitTrack · Full-stack fitness
          </div>
          <div className="flex flex-wrap gap-4">
            <a className="hover:text-slate-900" href="#features">Features</a>
            <a className="hover:text-slate-900" href="#how">How it works</a>
            <a className="hover:text-slate-900" href="/privacy">Privacy</a>
            <a className="hover:text-slate-900" href="/terms">Terms</a>
          </div>
          <div className="text-slate-500">Built with Auth0, Spring Boot, and Vite.</div>
        </div>
      </footer>
    </div>
  );
}
