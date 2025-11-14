import React, { useState, useMemo } from "react";

// Interactive Distro Chooser
// Single-file React component built with Tailwind CSS.
// Default export a React component so it can be previewed.

export default function DistroChooser() {
  const questions = [
    {
      id: 1,
      q: "What's your comfort level with technical tinkering?",
      options: [
        { id: 'a', label: 'I want it to "just work" — minimal tinkering', weights: { mint: 2, ubuntu: 2, zorin: 2, elementary: 2, pop: 1 } },
        { id: 'b', label: 'I can handle some learning and troubleshooting', weights: { manjaro: 2, fedora: 2, pop: 2, ubuntu: 1 } },
        { id: 'c', label: 'I like to tinker, customize and learn deeply', weights: { arch: 3, debian: 1, manjaro: 2 } },
      ],
    },
    {
      id: 2,
      q: "What kind of user interface do you prefer?",
      options: [
        { id: 'a', label: 'Windows-like familiarity', weights: { mint: 3, zorin: 2, ubuntu: 1 } },
        { id: 'b', label: 'Modern and polished (GNOME/KDE)', weights: { ubuntu: 3, pop: 2, fedora: 2, elementary: 1 } },
        { id: 'c', label: 'Minimal and lightweight', weights: { debian: 2, arch: 2, manjaro: 2 } },
      ],
    },
    {
      id: 3,
      q: "Will you use this system for gaming or creative apps?",
      options: [
        { id: 'a', label: 'Yes — gaming & Steam, creative apps', weights: { pop: 3, ubuntu: 2, manjaro: 2 } },
        { id: 'b', label: 'Occasionally — basic media and a few apps', weights: { mint: 2, ubuntu: 2, zorin: 1 } },
        { id: 'c', label: 'No — mostly web, email, and documents', weights: { debian: 2, elementary: 2, mint: 1 } },
      ],
    },
    {
      id: 4,
      q: "How important is long-term stability vs staying cutting-edge?",
      options: [
        { id: 'a', label: 'Stability and predictability (LTS)', weights: { debian: 3, ubuntu: 3 } },
        { id: 'b', label: 'A balance — fairly recent packages but stable', weights: { mint: 2, pop: 2, manjaro: 2 } },
        { id: 'c', label: 'Bleeding edge — latest kernels & packages', weights: { arch: 3, fedora: 2, manjaro: 1 } },
      ],
    },
    {
      id: 5,
      q: "Do you want lots of GUI tools for settings or prefer editing configs?",
      options: [
        { id: 'a', label: 'I want GUI tools — keep it simple', weights: { mint: 3, zorin: 2, ubuntu: 2 } },
        { id: 'b', label: 'A mix — GUI for common tasks, CLI for advanced', weights: { pop: 2, manjaro: 2, ubuntu: 1 } },
        { id: 'c', label: 'I prefer terminal and manual configuration', weights: { arch: 3, debian: 2 } },
      ],
    },
  ];

  const distros = useMemo(() => ({
    mint: {
      id: 'mint',
      name: 'Linux Mint',
      tagline: 'Friendly, Windows-like, great for beginners',
      url: 'https://linuxmint.com',
      pros: ['Very easy install', 'Cinnamon desktop: familiar UI', 'Great out-of-the-box codecs and drivers'],
      cons: ['Not bleeding-edge', 'Less upstream focus on new GNOME features'],
    },
    ubuntu: {
      id: 'ubuntu',
      name: 'Ubuntu',
      tagline: 'Popular, well-supported, strong hardware support',
      url: 'https://ubuntu.com',
      pros: ['Large community & documentation', 'Good hardware support', 'Lots of third-party apps support'],
      cons: ['Canonical choices may not suit everyone', 'GNOME defaults can be opinionated'],
    },
    pop: {
      id: 'pop',
      name: 'Pop!_OS',
      tagline: 'Designed for creators and gamers',
      url: 'https://pop.system76.com',
      pros: ['Excellent hybrid graphics support', 'Great defaults for productivity'],
      cons: ['Developed by System76 — some choices are vendor-specific'],
    },
    fedora: {
      id: 'fedora',
      name: 'Fedora',
      tagline: 'Cutting-edge free-software focus with polish',
      url: 'https://getfedora.org',
      pros: ['Fast release cycle', 'Upstream-friendly', 'GNOME-first experience'],
      cons: ['Short lifecycle between releases', 'May need extra repos for some codecs'],
    },
    manjaro: {
      id: 'manjaro',
      name: 'Manjaro',
      tagline: 'Arch-based, user-friendly experience',
      url: 'https://manjaro.org',
      pros: ['Access to Arch packages with easier install', 'Good hardware detection'],
      cons: ['Rolling release maintenance required', 'Occasional package breakage'],
    },
    arch: {
      id: 'arch',
      name: 'Arch Linux',
      tagline: 'DIY, bleeding edge, learn-by-doing',
      url: 'https://archlinux.org',
      pros: ['Complete control', 'Latest software', 'Excellent wiki'],
      cons: ['Manual install & maintenance', 'Not for absolute beginners'],
    },
    debian: {
      id: 'debian',
      name: 'Debian',
      tagline: 'The stable, reliable foundation',
      url: 'https://www.debian.org',
      pros: ['Rock-solid stability', 'Huge software archive'],
      cons: ['Older default packages', 'Less beginner polish'],
    },
    zorin: {
      id: 'zorin',
      name: 'Zorin OS',
      tagline: 'Windows-like experience tailored for newcomers',
      url: 'https://zorin.com/os',
      pros: ['Windows-like UI and transition tools', 'Good for ex-Windows users'],
      cons: ['Some editions are paid', 'Smaller community than Ubuntu'],
    },
    elementary: {
      id: 'elementary',
      name: 'elementary OS',
      tagline: 'Polished, design-first experience',
      url: 'https://elementary.io',
      pros: ['Beautiful, consistent UI', 'Simple app store'],
      cons: ['Less flexible by design', 'Some app gaps for power users'],
    },
  }), []);

  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(0);

  function choose(questionId, optionId) {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  }

  function next() {
    setStep(s => Math.min(s + 1, questions.length));
  }

  function prev() {
    setStep(s => Math.max(s - 1, 0));
  }

  function restart() {
    setAnswers({});
    setStep(0);
  }

  function computeScores() {
    const scores = {};
    Object.keys(distros).forEach(k => (scores[k] = 0));

    questions.forEach(q => {
      const picked = answers[q.id];
      if (!picked) return;
      const opt = q.options.find(o => o.id === picked);
      if (!opt) return;
      Object.entries(opt.weights).forEach(([d, w]) => {
        scores[d] = (scores[d] || 0) + w;
      });
    });

    return scores;
  }

  const scores = computeScores();

  const sorted = useMemo(() => {
    const arr = Object.entries(scores).map(([id, score]) => ({ id, score, ...distros[id] }));
    arr.sort((a, b) => b.score - a.score);
    return arr;
  }, [scores, distros]);

  const top = sorted[0] || null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Interactive Linux Distro Chooser</h1>
        <p className="text-gray-600 mt-2">Answer a few quick questions and get a recommended distro + explanation.</p>
      </header>

      <main className="bg-white rounded-2xl shadow p-6">
        {step < questions.length ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-gray-500">Question {step + 1} of {questions.length}</div>
                <h2 className="text-xl font-semibold mt-1">{questions[step].q}</h2>
              </div>
              <div className="text-sm text-gray-500">Progress: {(Object.keys(answers).length / questions.length * 100).toFixed(0)}%</div>
            </div>

            <div className="grid gap-3 md:grid-cols-1">
              {questions[step].options.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => choose(questions[step].id, opt.id)}
                  className={`text-left p-4 rounded-lg border transition-shadow hover:shadow-md ${answers[questions[step].id] === opt.id ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'}`}
                >
                  <div className="font-medium">{opt.label}</div>
                  <div className="text-xs text-gray-500 mt-1">(choice will influence recommendation)</div>
                </button>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={prev} className="px-4 py-2 rounded-lg border bg-gray-50">Back</button>
              <button onClick={next} className="px-4 py-2 rounded-lg bg-blue-600 text-white">Next</button>
              <button onClick={restart} className="px-4 py-2 rounded-lg border ml-auto">Restart</button>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-semibold">Your top matches</h2>
            <p className="text-gray-600 mt-1">Based on your answers, here are the distros that fit you best.</p>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {sorted.slice(0, 4).map(item => (
                <div key={item.id} className={`p-4 rounded-xl border ${item.id === top?.id ? 'border-blue-400 shadow-lg' : 'border-gray-100'}`}>
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-lg">{item.name}</h3>
                          <div className="text-sm text-gray-500">{item.tagline}</div>
                        </div>
                        <div className="text-sm text-gray-700 font-semibold">Score: {item.score}</div>
                      </div>

                      <ul className="mt-3 text-sm list-disc list-inside text-gray-700">
                        {item.pros.map((p, i) => <li key={i}>{p}</li>)}
                      </ul>

                      <div className="mt-3 flex gap-2">
                        <a href={item.url} target="_blank" rel="noreferrer" className="px-3 py-1 rounded bg-gray-100 border">Visit site</a>
                        <button onClick={() => window.alert(`${item.name}: ${item.tagline}`)} className="px-3 py-1 rounded border">Quick tip</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={() => setStep(0)} className="px-4 py-2 rounded-lg border">Edit answers</button>
              <button onClick={restart} className="px-4 py-2 rounded-lg bg-blue-600 text-white">Start over</button>
              <a href={top?.url || '#'} target="_blank" rel="noreferrer" className="ml-auto px-4 py-2 rounded-lg border">Go to top distro site</a>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold">Why this recommendation?</h4>
              {top ? (
                <p className="text-gray-600 mt-2">{top.name} scored highest because your answers favored <strong>{top.tagline.toLowerCase()}</strong> — the tool weights things like interface familiarity, stability, and gaming/creative support. Use the links above to try a live USB or read the install guide.</p>
              ) : (
                <p className="text-gray-600 mt-2">No top result — try answering more questions.</p>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="mt-6 text-sm text-gray-500">Built with Tailwind — adapt the weights & options to tune recommendations for your audience.</footer>
    </div>
  );
}
