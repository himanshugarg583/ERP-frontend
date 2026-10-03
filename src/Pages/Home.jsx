import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  LayoutDashboard,
  LineChart,
  BookOpen,
  Users,
  Clock3,
  MessagesSquare,
  BadgeCheck
} from 'lucide-react';

const HomePage = () => {
  const stats = [
    { label: "Students", value: "10K+", detail: "synced profiles" },
    { label: "Faculty", value: "820", detail: "active this week" },
    { label: "Attendance", value: "97%", detail: "real-time" },
    { label: "Insights", value: "240+", detail: "auto reports" }
  ];

  const features = [
    {
      title: "Unified Control",
      description: "Centralize admissions, fees, transport, library, and HR with role-based flows.",
      icon: <LayoutDashboard className="w-5 h-5" />,
      accent: "from-cyan-500 to-sky-400"
    },
    {
      title: "Live Pulse",
      description: "See attendance, buses, and classroom energy update every minute with alerts.",
      icon: <LineChart className="w-5 h-5" />,
      accent: "from-emerald-400 to-green-500"
    },
    {
      title: "Learning Lab",
      description: "Assignments, resources, and quizzes with streak nudges for students.",
      icon: <BookOpen className="w-5 h-5" />,
      accent: "from-amber-400 to-orange-400"
    },
    {
      title: "Community",
      description: "Two-way messaging for parents, teachers, and admins with smart summaries.",
      icon: <MessagesSquare className="w-5 h-5" />,
      accent: "from-sky-400 to-indigo-400"
    },
    {
      title: "Assurance",
      description: "Audit trails, approvals, and compliance-ready exports at any time.",
      icon: <ShieldCheck className="w-5 h-5" />,
      accent: "from-rose-400 to-amber-400"
    },
    {
      title: "Onboarding",
      description: "Guided playbooks to go live in days, not months—white-glove included.",
      icon: <BadgeCheck className="w-5 h-5" />,
      accent: "from-fuchsia-400 to-cyan-400"
    }
  ];

  const highlights = [
    "AI-powered nudges for absentee trends",
    "Fee reconciliations in minutes, not hours",
    "Library check-ins with one-tap QR",
    "Govt-grade backups & observability"
  ];

  const microStats = [
    { title: "Parent replies", value: "86%", change: "+12% this week" },
    { title: "Assignments done", value: "1,420", change: "Across 38 classes" },
    { title: "Transport safety", value: "99.4%", change: "Live GPS verified" }
  ];

  const bars = ["h-[38%]", "h-[62%]", "h-[78%]", "h-[55%]", "h-[90%]", "h-[66%]", "h-[82%]"];

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-50 overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 opacity-80 bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.22),transparent_26%),radial-gradient(circle_at_82%_12%,rgba(16,185,129,0.18),transparent_30%),radial-gradient(circle_at_18%_76%,rgba(251,191,36,0.18),transparent_32%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.06),transparent_45%,rgba(14,165,233,0.09)_55%,transparent_68%,rgba(251,191,36,0.07)_80%)] opacity-40" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:120px_120px] opacity-20" />
      <div className="absolute -left-24 top-40 h-64 w-64 rounded-full bg-cyan-500 blur-3xl opacity-20" />
      <div className="absolute -right-12 bottom-20 h-72 w-72 rounded-full bg-amber-400 blur-3xl opacity-20" />

      {/* Navigation */}
      <nav className="relative z-30 px-6 pt-6">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 px-3 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg"
          >
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-500 via-emerald-400 to-amber-400 flex items-center justify-center shadow-inner shadow-black/30">
              <GraduationCap className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Gurukulsarthi</p>
              <p className="text-base font-semibold text-white">School OS</p>
            </div>
          </motion.div>

          <div className="hidden md:flex flex-1 items-center justify-center gap-2">
            {["Product", "Features", "About", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="px-3 py-2 text-sm text-slate-300 hover:text-white transition-colors rounded-full hover:bg-white/5"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <motion.button
                whileHover={{ y: -2 }}
                className="px-4 py-2 text-sm font-semibold text-slate-100 rounded-full border border-white/15 bg-white/5 backdrop-blur"
              >
                Sign in
              </motion.button>
            </Link>
            <Link to="/login">
              <motion.button
                whileHover={{ y: -2 }}
                className="px-4 py-2 text-sm font-semibold text-slate-950 rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-300 shadow-lg shadow-cyan-500/30"
              >
                Launch app
              </motion.button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-20 max-w-6xl mx-auto px-6 py-16 md:py-20" id="product">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur text-sm text-slate-200">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Autonomous workflows + human clarity</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
              School operations with <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-200">clarity</span> and calm.
            </h1>

            <p className="text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed">
              A modern operating system for campuses that want less firefighting and more time for learning. Real-time attendance, communication, fees, and academics in one elegant flow.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/login">
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-300 text-slate-950 font-semibold shadow-xl shadow-cyan-500/30"
                >
                  Get started
                </motion.button>
              </Link>
              <a
                href="#contact"
                className="px-6 py-3 rounded-xl border border-white/15 text-slate-100 bg-white/5 backdrop-blur font-semibold hover:border-amber-200/60"
              >
                Talk to us
              </a>
            </div>

            <div className="flex items-center gap-3 text-sm text-slate-400">
              <div className="flex -space-x-3">
                {["S", "T", "P", "A"].map((item) => (
                  <span
                    key={item}
                    className="h-9 w-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-sm font-semibold text-white backdrop-blur"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <span>Trusted by future-forward schools across India</span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-4 py-3"
                >
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-400">{stat.label}</p>
                  <p className="text-2xl font-semibold text-white mt-1">{stat.value}</p>
                  <p className="text-xs text-slate-400">{stat.detail}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              {highlights.map((item) => (
                <span
                  key={item}
                  className="text-xs md:text-sm px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur text-slate-200"
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-cyan-400/30 via-emerald-300/20 to-amber-300/30 blur-2xl" />
              <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-6 shadow-2xl shadow-cyan-500/15">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center text-slate-950 font-bold">GM</div>
                    <div>
                      <p className="text-sm text-slate-300">Campus pulse</p>
                      <p className="text-lg font-semibold text-white">Live overview</p>
                    </div>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-100 border border-emerald-300/40">Live</span>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-6">
                  {microStats.map((card) => (
                    <div key={card.title} className="rounded-2xl bg-white/5 border border-white/10 p-3">
                      <p className="text-xs text-slate-400">{card.title}</p>
                      <p className="text-xl font-semibold text-white">{card.value}</p>
                      <p className="text-[11px] text-emerald-200">{card.change}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl bg-white/5 border border-white/10 p-4">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <LineChart className="w-4 h-4 text-cyan-300" />
                      <span>Engagement</span>
                    </div>
                    <span className="text-emerald-200 font-medium">+18% vs last week</span>
                  </div>
                  <div className="mt-4 h-32 flex items-end gap-2">
                    {bars.map((height, idx) => (
                      <div
                        key={idx}
                        className={`flex-1 rounded-full bg-gradient-to-t from-white/5 via-cyan-400/50 to-amber-300/70 ${height}`}
                      />
                    ))}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                  </div>
                </div>

                <div className="mt-6 grid sm:grid-cols-2 gap-3">
                  {["Exam schedule updated", "New parent outreach live", "Fee window opens"].map((item, index) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 rounded-2xl bg-white/5 border border-white/10 p-3"
                    >
                      <Clock3 className="w-4 h-4 text-amber-200 mt-1" />
                      <div>
                        <p className="text-sm text-white">{item}</p>
                        <p className="text-[11px] text-slate-400">{index === 0 ? "2m ago" : index === 1 ? "15m ago" : "Today, 4 PM"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-20 max-w-6xl mx-auto px-6 pb-16 md:pb-24">
        <div className="flex flex-wrap items-center gap-4 mb-10">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">What you get</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Beautifully connected modules</h2>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-emerald-400/15 text-emerald-100 border border-emerald-300/30">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-sm">Live status: all systems go</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 overflow-hidden"
            >
              <div className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${feature.accent}`} />
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-white mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-300 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About & Contact */}
      <section id="about" className="relative z-20 max-w-6xl mx-auto px-6 pb-16">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-8">
            <div className="flex items-center gap-2 text-sm text-amber-200 mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Built for speed + calm</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-semibold text-white mb-3">Launch-ready in days, not months</h3>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              We onboard your data, set up approvals, and hand you living dashboards that everyone can read. No noisy clutter—just the signals that matter for principals, teachers, parents, and finance teams.
            </p>
            <div className="mt-6 grid sm:grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex items-center gap-3">
                <Users className="w-5 h-5 text-cyan-200" />
                <div>
                  <p className="text-white font-semibold">Role-aware access</p>
                  <p className="text-slate-400 text-sm">Every module respects roles automatically.</p>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-emerald-200" />
                <div>
                  <p className="text-white font-semibold">Human support</p>
                  <p className="text-slate-400 text-sm">Guided playbooks + on-call experts.</p>
                </div>
              </div>
            </div>
          </div>

          <div id="contact" className="rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/20 via-emerald-400/20 to-amber-300/25 backdrop-blur-xl p-6 md:p-7">
            <p className="text-sm uppercase tracking-[0.16em] text-slate-900/70 bg-white/70 px-3 py-1 rounded-full w-fit mb-4">Contact</p>
            <h4 className="text-xl font-semibold text-white mb-2">Let&apos;s plan your launch</h4>
            <p className="text-slate-100 text-sm mb-4">Share your dates and we will align a rollout with fee cycles and exams.</p>
            <div className="space-y-3 text-sm text-slate-50/90">
              <div className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                <span>demo@gurukulsarthi.school</span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                <span>Available Mon-Sat, 9 AM - 7 PM IST</span>
              </div>
            </div>
            <Link to="/login" className="block mt-6">
              <button className="w-full px-4 py-3 rounded-xl bg-slate-950 text-white font-semibold border border-white/20 hover:border-white/40 transition">
                Book a walkthrough
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-20 px-6 pb-16">
        <div className="max-w-6xl mx-auto rounded-3xl bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-300 text-slate-950 p-8 md:p-10 shadow-2xl shadow-cyan-500/30">
          <div className="grid md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-3">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-900/80">Ready when you are</p>
              <h3 className="text-2xl md:text-3xl font-bold leading-snug">Launch a calmer, clearer school management experience today.</h3>
              <p className="text-slate-900/80 text-sm md:text-base">Sign in to start, or invite our team to configure the first week with you.</p>
            </div>
            <div className="flex flex-col sm:flex-row md:flex-col gap-3">
              <Link to="/login">
                <button className="w-full px-5 py-3 rounded-xl bg-slate-950 text-white font-semibold shadow-lg shadow-emerald-600/40">Start now</button>
              </Link>
              <a
                href="#contact"
                className="w-full text-center px-5 py-3 rounded-xl border border-slate-900/30 text-slate-900 font-semibold bg-white/60"
              >
                See rollout plan
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 via-emerald-400 to-amber-400 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <p className="text-white font-semibold">Gurukulsarthi School</p>
              <p className="text-slate-400 text-sm">Built for modern campuses</p>
            </div>
          </div>
          <div className="text-slate-400 text-sm">
            <p>© 2026 Gurukulsarthi School. All rights reserved.</p>
            <p className="text-xs text-slate-500">Version 0.11 • Updated June 2026</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
