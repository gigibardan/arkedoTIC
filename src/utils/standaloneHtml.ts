/**
 * Generator pentru fisierul index.html autonom, 100% offline
 * cu toate cele 5 nivele din manualul de informatica clasa a V-a (pag. 27-30).
 */

export function generateStandaloneHtml(): string {
  return `<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ARKEDO: Misiunea Arborele Secret 🌳</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    h1, h2, h3, .font-heading { font-family: 'Fredoka', cursive, sans-serif; }
    @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-6px); } }
    .animate-float { animation: float 3s ease-in-out infinite; }
    @media print {
      body { background: white !important; color: black !important; }
      header, footer, #progress-section, .no-print { display: none !important; }
      #diploma-card { border: 4px solid #d97706 !important; box-shadow: none !important; }
    }
  </style>
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen flex flex-col selection:bg-emerald-500 selection:text-white">
  <div id="game-app" class="flex-1 flex flex-col">
    <!-- Header -->
    <header class="bg-slate-800/90 backdrop-blur border-b border-slate-700/80 sticky top-0 z-40 px-4 py-3 shadow-md">
      <div class="max-w-5xl mx-auto flex items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-400/30 animate-pulse">
            🌳
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                Școala ARKEDO
              </span>
              <span class="text-xs text-slate-400 font-semibold hidden sm:inline">Informatică • Clasa a V-a</span>
            </div>
            <h1 class="text-lg sm:text-xl font-bold text-white tracking-wide font-heading">
              Misiunea Arborele Secret
            </h1>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="bg-slate-900/90 px-3.5 py-1.5 rounded-xl border border-slate-700 flex items-center gap-2 shadow-inner">
            <span class="text-amber-400 text-xl">⭐️</span>
            <span id="score-display" class="font-black text-amber-300 text-xl font-heading">0</span>
            <span class="text-slate-400 text-xs font-semibold">/ 100 pct</span>
          </div>
          <button id="btn-sound" class="p-2.5 rounded-xl bg-slate-750 hover:bg-slate-700 text-slate-200 border border-slate-600 transition" title="Sunet">
            🔊
          </button>
        </div>
      </div>
    </header>

    <!-- Main Container -->
    <main class="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
      <!-- Bara de Progres & Evoluția Arborelui -->
      <section id="progress-section" class="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-5 shadow-xl backdrop-blur">
        <div class="flex items-center justify-between text-sm mb-3">
          <div class="flex items-center gap-3">
            <span id="tree-icon" class="text-3xl sm:text-4xl animate-float p-1 bg-slate-900/60 rounded-xl border border-slate-700/60">🌱</span>
            <div>
              <div class="text-[11px] text-slate-400 uppercase font-extrabold tracking-wider">Evoluția Arborelui Secret</div>
              <div id="tree-status" class="text-base sm:text-lg font-black text-emerald-400 font-heading">Sămânța Cunoașterii</div>
            </div>
          </div>
          <div class="text-right">
            <span class="text-xs text-slate-400">Nivelul:</span>
            <span id="level-indicator" class="font-black text-white text-base ml-1">1 / 5</span>
          </div>
        </div>
        <div class="w-full bg-slate-900/90 rounded-full h-4 p-0.5 overflow-hidden border border-slate-700 shadow-inner">
          <div id="progress-bar-fill" class="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 h-full rounded-full transition-all duration-700 shadow-sm" style="width: 20%"></div>
        </div>
        <div class="grid grid-cols-5 gap-1.5 mt-3 pt-2 text-center text-[10px] sm:text-xs font-semibold text-slate-400">
          <span>1. Structură 📁</span>
          <span>2. Selecție 🎯</span>
          <span>3. Mutare ⚡️</span>
          <span>4. Copie & F2 🔍</span>
          <span>5. Restore 🗑️</span>
        </div>
      </section>

      <!-- Zona de Nivel Activ -->
      <div id="level-container" class="flex-1"></div>
    </main>

    <!-- Footer -->
    <footer class="text-center py-4 text-xs text-slate-500 border-t border-slate-800/80 bg-slate-950/40">
      Mini-joc educativ de informatică • Realizat pentru elevii de clasa a V-a de la <strong class="text-emerald-400">Școala ARKEDO</strong> 🌳
    </footer>
  </div>

  <script>
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    let soundEnabled = true;

    function playTone(freq, type = 'sine', duration = 0.1, delay = 0) {
      if (!soundEnabled) return;
      try {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + delay);
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + delay + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + delay);
        osc.stop(audioCtx.currentTime + delay + duration);
      } catch (e) {}
    }

    function soundClick() { playTone(600, 'sine', 0.05); }
    function soundCorrect() {
      playTone(523.25, 'triangle', 0.15, 0);
      playTone(659.25, 'triangle', 0.15, 0.08);
      playTone(783.99, 'triangle', 0.25, 0.16);
    }
    function soundWrong() { playTone(200, 'sawtooth', 0.18, 0); }
    function soundLevelUp() {
      [440, 554, 659, 880].forEach((f, i) => playTone(f, 'square', 0.15, i * 0.09));
    }
    function soundVictory() {
      [523, 523, 523, 659, 783, 1046].forEach((f, i) => playTone(f, 'triangle', 0.25, i * 0.12));
    }

    document.getElementById('btn-sound').addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      document.getElementById('btn-sound').innerText = soundEnabled ? '🔊' : '🔇';
      if (soundEnabled) soundClick();
    });

    let currentLevel = 1;
    let score = 0;
    let studentFeeling = 'incantat';

    const treeStages = [
      { name: 'Sămânța Cunoașterii', icon: '🌱', percent: 20 },
      { name: 'Micul Lăstar (Selecție)', icon: '🌿', percent: 40 },
      { name: 'Copăcelul Curajos (Mutare)', icon: '🪴', percent: 60 },
      { name: 'Puietul Strălucitor (Copie & F2)', icon: '🌲', percent: 80 },
      { name: 'Gardianul Datelor (Restore)', icon: '🌳', percent: 95 },
      { name: 'Arborele Secret Înflorit!', icon: '🌳✨', percent: 100 }
    ];

    function updateHeader() {
      document.getElementById('score-display').innerText = score;
      document.getElementById('level-indicator').innerText = currentLevel <= 5 ? currentLevel + ' / 5' : 'Completat!';
      const stage = treeStages[Math.min(currentLevel - 1, 5)];
      document.getElementById('tree-icon').innerText = stage.icon;
      document.getElementById('tree-status').innerText = stage.name;
      document.getElementById('progress-bar-fill').style.width = stage.percent + '%';
    }

    function renderTeacherTip(title, tip, page, extra) {
      return \`
        <div class="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-cyan-500/10 border-2 border-amber-500/30 rounded-2xl p-4 mb-5 shadow-md">
          <div class="flex items-center gap-2 mb-1.5">
            <span class="text-lg">💡</span>
            <span class="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded">Sfatul Profesorului ARKEDO</span>
            <span class="text-[10px] text-slate-400 font-semibold">• Manual pag. \${page}</span>
          </div>
          <h4 class="text-sm font-black text-white font-heading">\${title}</h4>
          <p class="text-xs sm:text-sm text-slate-200 mt-2 leading-relaxed">\${tip}</p>
          \${extra ? \`<div class="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700/80 text-emerald-300 font-medium text-xs mt-2.5">✨ <strong>Reține:</strong> \${extra}</div>\` : ''}
        </div>
      \`;
    }

    function renderLevel() {
      updateHeader();
      const container = document.getElementById('level-container');
      if (currentLevel === 1) renderLevel1(container);
      else if (currentLevel === 2) renderLevel2(container);
      else if (currentLevel === 3) renderLevel3(container);
      else if (currentLevel === 4) renderLevel4(container);
      else if (currentLevel === 5) renderLevel5(container);
      else renderVictory(container);
    }

    // NIVELUL 1: STRUCTURA ARBORESCENTĂ
    function renderLevel1(container) {
      let winEOk = false;
      container.innerHTML = \`
        <div class="bg-slate-800 border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-xl">
          <div class="flex items-start justify-between gap-4 mb-4">
            <div>
              <span class="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs uppercase tracking-wider border border-emerald-500/30">
                Nivelul 1 din 5 • Structura Arborescentă
              </span>
              <h2 class="text-2xl sm:text-3xl font-black text-white mt-1.5 font-heading">
                File Explorer & Structura Arborescentă 📁
              </h2>
              <p class="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
                Conform manualului de informatică (pagina 27), datele sunt stocate în calculator în <strong>structuri arborescente</strong>. Creează folderul rădăcină <strong class="text-emerald-300 font-mono">Baza Secreta</strong> și subfolderele <strong class="text-cyan-300 font-mono">Jocuri</strong> și <strong class="text-amber-300 font-mono">Teme</strong>!
              </p>
            </div>
            <div class="hidden sm:block text-4xl p-3 bg-slate-900/60 rounded-2xl border border-slate-700">🏗️</div>
          </div>

          \${renderTeacherTip(
            'Cum pornim rapid programul File Explorer?',
            'Sistemul de operare Windows dispune de File Explorer (cu pictograma ca un dosar galben cu clemă albastră). Scurtătura secretă de pornire este tasta Windows (fereastră) + tasta E!',
            '27',
            'Simbolul „>” sau „+” expandează folderul din coloana stângă, iar simbolul „v” îl compactează!'
          )}

          <!-- Simulator File Explorer -->
          <div class="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl mb-5">
            <div class="bg-slate-800 px-4 py-2 border-b border-slate-700 flex justify-between text-xs text-slate-300">
              <span>ARKEDO File Explorer</span>
              <span id="l1-path" class="text-emerald-400 font-mono">Desktop</span>
            </div>
            <div class="p-6 min-h-[170px] flex flex-wrap gap-4 items-start bg-slate-950/60" id="l1-desktop">
              <div id="l1-folder-root" class="hidden flex-col items-center p-3 rounded-2xl bg-slate-800 border-2 border-emerald-500/60 cursor-pointer w-32 text-center transform hover:scale-105 transition">
                <span class="text-5xl">📁</span>
                <span class="text-xs font-bold text-emerald-300 mt-1">Baza Secreta</span>
                <span class="text-[10px] text-amber-300">(Dublu click)</span>
              </div>
              <div id="l1-empty" class="w-full text-center py-6 text-slate-500 text-xs">Desktop este gol. Apasă butonul de mai jos!</div>
            </div>
            <div class="p-6 min-h-[170px] hidden flex-wrap gap-4 items-start bg-slate-950/60" id="l1-inside">
              <div id="l1-folder-j" class="hidden flex-col items-center p-3 rounded-2xl bg-cyan-950/50 border border-cyan-500 w-32 text-center">
                <span class="text-4xl">🎮</span>
                <span class="text-xs font-bold text-cyan-300 mt-1">Jocuri</span>
              </div>
              <div id="l1-folder-t" class="hidden flex-col items-center p-3 rounded-2xl bg-amber-950/50 border border-amber-500 w-32 text-center">
                <span class="text-4xl">📚</span>
                <span class="text-xs font-bold text-amber-300 mt-1">Teme</span>
              </div>
            </div>
            <div class="bg-slate-800 p-3 flex flex-wrap gap-2 justify-between border-t border-slate-700">
              <div class="flex gap-2">
                <button id="l1-btn-root" class="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-2 rounded-xl transition">
                  ➕ Creează "Baza Secreta"
                </button>
                <button id="l1-btn-j" class="hidden bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs px-3 py-2 rounded-xl transition">
                  ➕ Adaugă "Jocuri" 🎮
                </button>
                <button id="l1-btn-t" class="hidden bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-3 py-2 rounded-xl transition">
                  ➕ Adaugă "Teme" 📚
                </button>
              </div>
              <button id="l1-btn-back" class="hidden text-xs text-slate-300 hover:text-white px-3 py-1.5 bg-slate-700 rounded-lg">
                ⬅️ Înapoi pe Desktop
              </button>
            </div>
          </div>

          <!-- Provocare Win+E -->
          <div class="bg-slate-900 border border-slate-700 rounded-2xl p-4 mb-5 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div>
              <div class="text-xs font-bold text-amber-400 uppercase">Întrebare manual (pag. 27):</div>
              <div class="text-xs sm:text-sm font-bold text-white">Cum deschizi File Explorer rapid de la tastatură?</div>
            </div>
            <button id="l1-btn-wine" class="px-4 py-2 rounded-xl text-xs font-bold font-mono bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 transition">
              Apasă ⊞ Windows + E
            </button>
          </div>

          <!-- Checklist -->
          <div class="bg-slate-900/80 border border-slate-700 rounded-2xl p-4 mb-6 space-y-2 text-xs sm:text-sm">
            <label class="flex items-center gap-2 cursor-pointer text-slate-300">
              <input type="checkbox" id="l1-chk1" class="w-4 h-4 rounded text-emerald-500">
              <span>Am creat folderul principal <strong>"Baza Secreta"</strong>.</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer text-slate-300">
              <input type="checkbox" id="l1-chk2" class="w-4 h-4 rounded text-emerald-500">
              <span>Am deschis folderul și am creat subfolderul <strong>"Jocuri"</strong> 🎮.</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer text-slate-300">
              <input type="checkbox" id="l1-chk3" class="w-4 h-4 rounded text-emerald-500">
              <span>Am creat și subfolderul <strong>"Teme"</strong> 📚.</span>
            </label>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-xs text-slate-400">Recompensă: <strong class="text-amber-400">+20 Pct</strong> • Insigna <strong>Arhitect de Foldere</strong></span>
            <button id="l1-submit" disabled class="bg-slate-700 text-slate-400 font-bold px-6 py-3 rounded-2xl cursor-not-allowed">
              Completează Nivelul 1 ➔
            </button>
          </div>
        </div>
      \`;

      const bRoot = document.getElementById('l1-btn-root');
      const fRoot = document.getElementById('l1-folder-root');
      const empty = document.getElementById('l1-empty');
      const desk = document.getElementById('l1-desktop');
      const ins = document.getElementById('l1-inside');
      const bJ = document.getElementById('l1-btn-j');
      const bT = document.getElementById('l1-btn-t');
      const fJ = document.getElementById('l1-folder-j');
      const fT = document.getElementById('l1-folder-t');
      const bBack = document.getElementById('l1-btn-back');
      const chk1 = document.getElementById('l1-chk1');
      const chk2 = document.getElementById('l1-chk2');
      const chk3 = document.getElementById('l1-chk3');
      const sub = document.getElementById('l1-submit');
      const bWinE = document.getElementById('l1-btn-wine');

      function valL1() {
        if (chk1.checked && chk2.checked && chk3.checked && winEOk) {
          sub.disabled = false;
          sub.className = 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold px-6 py-3 rounded-2xl transition shadow-lg cursor-pointer transform hover:scale-105';
        }
      }

      bRoot.onclick = () => {
        soundCorrect();
        fRoot.classList.remove('hidden');
        fRoot.classList.add('flex');
        empty.remove();
        bRoot.classList.add('hidden');
        chk1.checked = true;
        valL1();
      };

      fRoot.onclick = () => {
        soundClick();
        desk.classList.add('hidden');
        ins.classList.remove('hidden');
        ins.classList.add('flex');
        bBack.classList.remove('hidden');
        bJ.classList.remove('hidden');
        bT.classList.remove('hidden');
        document.getElementById('l1-path').innerText = 'Desktop > Baza Secreta';
      };

      bBack.onclick = () => {
        soundClick();
        ins.classList.add('hidden');
        ins.classList.remove('flex');
        desk.classList.remove('hidden');
        bBack.classList.add('hidden');
        bJ.classList.add('hidden');
        bT.classList.add('hidden');
        document.getElementById('l1-path').innerText = 'Desktop';
      };

      bJ.onclick = () => {
        soundCorrect();
        fJ.classList.remove('hidden');
        fJ.classList.add('flex');
        bJ.disabled = true;
        bJ.classList.add('opacity-40');
        chk2.checked = true;
        valL1();
      };

      bT.onclick = () => {
        soundCorrect();
        fT.classList.remove('hidden');
        fT.classList.add('flex');
        bT.disabled = true;
        bT.classList.add('opacity-40');
        chk3.checked = true;
        valL1();
      };

      bWinE.onclick = () => {
        soundCorrect();
        winEOk = true;
        bWinE.className = 'px-4 py-2 rounded-xl text-xs font-bold font-mono bg-emerald-600 text-white ring-2 ring-emerald-400';
        bWinE.innerText = '✓ Corect: Win + E';
        valL1();
      };

      chk1.onchange = valL1; chk2.onchange = valL1; chk3.onchange = valL1;

      sub.onclick = () => {
        soundLevelUp();
        score += 20;
        currentLevel = 2;
        renderLevel();
      };
    }

    // NIVELUL 2: SELECȚIA MULTIPLĂ & CĂUTAREA (PAG. 29)
    function renderLevel2(container) {
      let ctrlAOk = false;
      let searched = false;

      container.innerHTML = \`
        <div class="bg-slate-800 border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-xl">
          <div class="flex items-start justify-between gap-4 mb-4">
            <div>
              <span class="px-3 py-1 rounded-lg bg-teal-500/20 text-teal-400 font-bold text-xs uppercase tracking-wider border border-teal-500/30">
                Nivelul 2 din 5 • Selecția Multiplă & Căutarea
              </span>
              <h2 class="text-2xl sm:text-3xl font-black text-white mt-1.5 font-heading">
                Magia Selecției Multiple & Căutarea Rapidă 🎯
              </h2>
              <p class="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
                Din manualul de informatică (pagina 29): cum selectezi mai multe fișiere dintr-o dată fără să le iei pe rând și cum găsești rapid un document rătăcit cu caseta Search?
              </p>
            </div>
            <div class="hidden sm:block text-4xl p-3 bg-slate-900/60 rounded-2xl border border-slate-700 text-teal-400">🎯</div>
          </div>

          \${renderTeacherTip(
            'Selecția multiplă în Windows (Manual pag. 29)',
            '• Fișiere neconsecutive (care nu sunt unul după altul): ține apăsată tasta Ctrl și dă click pe fiecare! • Fișiere consecutive: click pe primul, ține apăsat Shift și click pe ultimul! • Toate fișierele dintr-o mișcare: Ctrl + A!',
            '29',
            'Caseta Search/Caută din dreapta sus te ajută să găsești orice fișier dacă îi știi o parte din nume!'
          )}

          <!-- Simulator Selecție -->
          <div class="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl mb-5">
            <div class="bg-slate-800 p-3 border-b border-slate-700 flex flex-wrap justify-between items-center gap-3">
              <button id="l2-btn-all" class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition">
                ✓ Selectează Tot (Ctrl + A)
              </button>
              <div class="flex items-center gap-2">
                <input type="text" id="l2-search-input" placeholder="Caută (ex: arbore)..." class="bg-slate-950 border border-slate-700 text-xs px-2.5 py-1.5 rounded-lg text-white">
                <button id="l2-search-btn" class="bg-slate-700 hover:bg-slate-600 px-2.5 py-1.5 rounded-lg text-xs font-bold text-white">Găsește</button>
              </div>
            </div>
            <div class="p-4 bg-slate-950/60 space-y-2" id="l2-file-list">
              <div class="l2-f p-2.5 rounded-xl border border-slate-800 bg-slate-900 flex items-center justify-between cursor-pointer" data-id="1">
                <span class="text-xs font-mono text-white">📄 referat_plante.docx</span>
                <span class="text-[11px] text-slate-500">24 KB</span>
              </div>
              <div class="l2-f p-2.5 rounded-xl border border-slate-800 bg-slate-900 flex items-center justify-between cursor-pointer" data-id="2" id="f-arbore">
                <span class="text-xs font-mono text-white">🖼️ desen_arbore.jpg</span>
                <span class="text-[11px] text-slate-500">1.2 MB</span>
              </div>
              <div class="l2-f p-2.5 rounded-xl border border-slate-800 bg-slate-900 flex items-center justify-between cursor-pointer" data-id="3">
                <span class="text-xs font-mono text-white">📄 proiect_istorie.docx</span>
                <span class="text-[11px] text-slate-500">45 KB</span>
              </div>
            </div>
          </div>

          <!-- Întrebare Ctrl+A -->
          <div class="bg-slate-900 border border-slate-700 rounded-2xl p-4 mb-6">
            <h3 class="text-xs font-bold text-amber-400 uppercase mb-1">Verificare din manual (pag. 29):</h3>
            <p class="text-xs sm:text-sm text-slate-300 mb-3">Ce combinație rapidă de taste selectează TOATE fișierele și folderele dintr-o dată?</p>
            <div class="grid grid-cols-3 gap-2">
              <button class="l2-ans p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-mono" data-ok="true">
                <strong class="text-emerald-400">Ctrl + A</strong> (Select All)
              </button>
              <button class="l2-ans p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-mono" data-ok="false">
                Ctrl + S (Save)
              </button>
              <button class="l2-ans p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-mono" data-ok="false">
                Ctrl + Z (Undo)
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-xs text-slate-400">Recompensă: <strong class="text-amber-400">+20 Pct</strong> • Insigna <strong>Maestru al Selecției</strong></span>
            <button id="l2-submit" disabled class="bg-slate-700 text-slate-400 font-bold px-6 py-3 rounded-2xl cursor-not-allowed">
              Completează Nivelul 2 ➔
            </button>
          </div>
        </div>
      \`;

      const sub = document.getElementById('l2-submit');
      function valL2() {
        if (ctrlAOk && searched) {
          sub.disabled = false;
          sub.className = 'bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 text-slate-950 font-bold px-6 py-3 rounded-2xl transition shadow-lg cursor-pointer';
        }
      }

      document.querySelectorAll('.l2-f').forEach(el => {
        el.onclick = () => {
          soundClick();
          el.classList.toggle('border-emerald-500');
          el.classList.toggle('bg-emerald-950/50');
        };
      });

      document.getElementById('l2-btn-all').onclick = () => {
        soundCorrect();
        document.querySelectorAll('.l2-f').forEach(el => {
          el.classList.add('border-emerald-500', 'bg-emerald-950/50');
        });
      };

      document.getElementById('l2-search-btn').onclick = () => {
        const val = document.getElementById('l2-search-input').value.toLowerCase();
        if (val.includes('arbore') || val.includes('desen')) {
          soundCorrect();
          searched = true;
          document.getElementById('f-arbore').classList.add('ring-2', 'ring-cyan-400');
          valL2();
        } else {
          soundWrong();
          alert('Scrie "arbore" pentru a găsi desenul căutat!');
        }
      };

      document.querySelectorAll('.l2-ans').forEach(btn => {
        btn.onclick = () => {
          if (btn.dataset.ok === 'true') {
            soundCorrect();
            btn.className = 'p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500 text-xs font-mono text-emerald-200 font-bold';
            ctrlAOk = true;
            valL2();
          } else {
            soundWrong();
            btn.className = 'p-2.5 rounded-xl bg-rose-950/80 border border-rose-500 text-xs font-mono text-rose-200';
          }
        };
      });

      sub.onclick = () => {
        soundLevelUp();
        score += 20;
        currentLevel = 3;
        renderLevel();
      };
    }

    // NIVELUL 3: MUTAREA & CARACTERELE INTERZISE (PAG. 28 & 30)
    function renderLevel3(container) {
      let isCut = false, isMoved = false, nameOk = false;

      container.innerHTML = \`
        <div class="bg-slate-800 border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-xl">
          <div class="flex items-start justify-between gap-4 mb-4">
            <div>
              <span class="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-400 font-bold text-xs uppercase tracking-wider border border-cyan-500/30">
                Nivelul 3 din 5 • Mutarea & Caractere Interzise
              </span>
              <h2 class="text-2xl sm:text-3xl font-black text-white mt-1.5 font-heading">
                Mutarea Fulger: Foarfeca Digitală ⚡️
              </h2>
              <p class="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
                Mutați jocul <strong class="text-cyan-300 font-mono">super_mario.exe</strong> în folderul <strong class="text-emerald-300 font-mono">Jocuri</strong> cu <strong class="text-cyan-300">Ctrl + X</strong> și <strong class="text-emerald-300">Ctrl + V</strong>!
              </p>
            </div>
            <div class="hidden sm:block text-4xl p-3 bg-slate-900/60 rounded-2xl border border-slate-700 text-cyan-400">⚡️</div>
          </div>

          \${renderTeacherTip(
            'Cum mutăm și ce caractere sunt interzise? (Manual pag. 28 & 30)',
            '• La mutare (Ctrl+X), fișierul nu rămâne în locul vechi! • În Windows este strict interzis să numim fișiere cu caracterele: < > : " / \\\\ | ? * !',
            '28 și 30',
            'Scurtătura Ctrl+X vine de la forma unei foarfeci ✂️!'
          )}

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div class="bg-slate-900 border border-slate-700 rounded-xl p-4 min-h-[130px] flex flex-col justify-between">
              <span class="text-xs text-slate-400 font-bold">🖥️ Sursă: Desktop</span>
              <div id="l3-file" class="bg-slate-800 border border-cyan-500/70 p-3 rounded-xl flex items-center gap-3 cursor-pointer">
                <span class="text-3xl">🎮</span>
                <div>
                  <div class="text-xs font-bold text-cyan-300 font-mono">super_mario.exe</div>
                  <div class="text-[10px] text-slate-400">15 MB</div>
                </div>
              </div>
            </div>

            <div class="bg-slate-900 border border-slate-700 rounded-xl p-4 min-h-[130px] flex flex-col justify-between" id="l3-dest">
              <span class="text-xs text-slate-400 font-bold">📁 Destinație: Folderul "Jocuri"</span>
              <div id="l3-dest-hint" class="text-xs text-slate-500 italic text-center py-4">Folderul este gol. Lipește aici!</div>
            </div>
          </div>

          <div class="flex gap-3 mb-5">
            <button id="l3-btn-cut" class="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-bold font-mono">
              ✂️ 1. Taie (Ctrl + X)
            </button>
            <button id="l3-btn-paste" disabled class="px-4 py-2.5 rounded-xl bg-slate-800/40 text-slate-500 border border-slate-800 text-xs font-bold font-mono cursor-not-allowed">
              📋 2. Lipește (Ctrl + V)
            </button>
          </div>

          <!-- Exercițiul 3 pag. 30: Caractere Interzise -->
          <div class="bg-slate-900 border border-slate-700 rounded-2xl p-4 mb-6">
            <h3 class="text-xs font-bold text-amber-400 uppercase mb-1">Exercițiul 3 din manual (pag. 30):</h3>
            <p class="text-xs sm:text-sm text-slate-300 mb-3">Care este un nume CORECT de folder în sistemul de operare Windows?</p>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button class="l3-name p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-left" data-ok="false">
                Imagini_partea&lt;2&gt; (conține &lt; &gt;)
              </button>
              <button class="l3-name p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-left" data-ok="true">
                ✅ <strong>Imagini_partea2</strong>
              </button>
              <button class="l3-name p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-left" data-ok="false">
                Imagini_partea2* (conține *)
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-xs text-slate-400">Recompensă: <strong class="text-amber-400">+20 Pct</strong> • Insigna <strong>Maestru Scurtături</strong></span>
            <button id="l3-submit" disabled class="bg-slate-700 text-slate-400 font-bold px-6 py-3 rounded-2xl cursor-not-allowed">
              Completează Nivelul 3 ➔
            </button>
          </div>
        </div>
      \`;

      const f = document.getElementById('l3-file');
      const bCut = document.getElementById('l3-btn-cut');
      const bPaste = document.getElementById('l3-btn-paste');
      const dest = document.getElementById('l3-dest');
      const hint = document.getElementById('l3-dest-hint');
      const sub = document.getElementById('l3-submit');

      function valL3() {
        if (isMoved && nameOk) {
          sub.disabled = false;
          sub.className = 'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold px-6 py-3 rounded-2xl transition shadow-lg cursor-pointer';
        }
      }

      bCut.onclick = () => {
        soundClick();
        isCut = true;
        f.classList.add('opacity-40', 'border-dashed');
        bPaste.disabled = false;
        bPaste.className = 'px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-mono cursor-pointer shadow ring-2 ring-emerald-400';
      };

      bPaste.onclick = () => {
        soundCorrect();
        isMoved = true;
        hint.remove();
        f.classList.remove('opacity-40', 'border-dashed');
        dest.appendChild(f);
        bPaste.disabled = true;
        bPaste.classList.add('opacity-40');
        valL3();
      };

      document.querySelectorAll('.l3-name').forEach(btn => {
        btn.onclick = () => {
          if (btn.dataset.ok === 'true') {
            soundCorrect();
            btn.className = 'p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500 text-xs font-mono text-emerald-200 font-bold';
            nameOk = true;
            valL3();
          } else {
            soundWrong();
            btn.className = 'p-2.5 rounded-xl bg-rose-950/80 border border-rose-500 text-xs font-mono text-rose-200';
          }
        };
      });

      sub.onclick = () => {
        soundLevelUp();
        score += 20;
        currentLevel = 4;
        renderLevel();
      };
    }

    // NIVELUL 4: COPIEREA, F2 ȘI EXTENSIILE (PAG. 28 & 30)
    function renderLevel4(container) {
      let q1 = false, q2 = false, q3 = false;

      container.innerHTML = \`
        <div class="bg-slate-800 border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-xl">
          <div class="flex items-start justify-between gap-4 mb-4">
            <div>
              <span class="px-3 py-1 rounded-lg bg-purple-500/20 text-purple-400 font-bold text-xs uppercase tracking-wider border border-purple-500/30">
                Nivelul 4 din 5 • Copiere, Redenumire & Extensii
              </span>
              <h2 class="text-2xl sm:text-3xl font-black text-white mt-1.5 font-heading">
                Copierea, Redenumirea (F2) și Proprietățile 🔍
              </h2>
              <p class="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
                Din manual (pagina 28-30): copierea de siguranță, tasta secretă de redenumire F2 și ce semnifică extensiile fișierelor (.txt, .docx, .jpg)!
              </p>
            </div>
            <div class="hidden sm:block text-4xl p-3 bg-slate-900/60 rounded-2xl border border-slate-700 text-purple-400">📑</div>
          </div>

          \${renderTeacherTip(
            'Ce indică extensia unui fișier? (Manual pag. 30)',
            'Extensia reprezintă caracterele de după punct (.txt, .jpg, .docx) și arată TIPUL fișierului și programul asociat cu care poate fi deschis! Tasta F2 redenumește instant fișierul selectat!',
            '28 și 30',
            'În fereastra de Proprietăți (Properties, Fig. 3) găsim dimensiunea exactă a fișierului pe disc!'
          )}

          <div class="space-y-4 mb-6">
            <!-- Pas 1 -->
            <div class="bg-slate-900 border border-slate-700 rounded-xl p-4">
              <h3 class="text-xs sm:text-sm font-bold text-white mb-2">1. Cum facem o COPIE identică a fișierului test1.txt?</h3>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button class="l4-q1 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-left" data-ok="true">
                  ✅ <strong>Ctrl + C</strong> (Copy) urmat de <strong>Ctrl + V</strong> (Paste)
                </button>
                <button class="l4-q1 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-left" data-ok="false">
                  Shift + Delete
                </button>
                <button class="l4-q1 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-left" data-ok="false">
                  Alt + F4
                </button>
              </div>
            </div>

            <!-- Pas 2 -->
            <div class="bg-slate-900 border border-slate-700 rounded-xl p-4">
              <h3 class="text-xs sm:text-sm font-bold text-white mb-2">2. Ce tastă din rândul superior este scurtătura secretă de Redenumire?</h3>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button class="l4-q2 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-left" data-ok="false">
                  Tasta Esc
                </button>
                <button class="l4-q2 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-left" data-ok="true">
                  ✨ <strong>Tasta F2</strong>
                </button>
                <button class="l4-q2 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-left" data-ok="false">
                  Tasta Caps Lock
                </button>
              </div>
            </div>

            <!-- Pas 3 -->
            <div class="bg-slate-900 border border-slate-700 rounded-xl p-4">
              <h3 class="text-xs sm:text-sm font-bold text-white mb-2">3. Ce indică extensia unui fișier (.txt, .jpg)? (Exercițiul 2, pag. 30)</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button class="l4-q3 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-left" data-ok="true">
                  ✅ Tipul de date (text, imagine) și programul cu care se deschide
                </button>
                <button class="l4-q3 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-left" data-ok="false">
                  Culoarea carcasei monitorului
                </button>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-xs text-slate-400">Recompensă: <strong class="text-amber-400">+20 Pct</strong> • Insigna <strong>Detectiv Fișiere</strong></span>
            <button id="l4-submit" disabled class="bg-slate-700 text-slate-400 font-bold px-6 py-3 rounded-2xl cursor-not-allowed">
              Completează Nivelul 4 ➔
            </button>
          </div>
        </div>
      \`;

      const sub = document.getElementById('l4-submit');
      function valL4() {
        if (q1 && q2 && q3) {
          sub.disabled = false;
          sub.className = 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold px-6 py-3 rounded-2xl transition shadow-lg cursor-pointer';
        }
      }

      function wire(cls, cb) {
        document.querySelectorAll(cls).forEach(btn => {
          btn.onclick = () => {
            if (btn.dataset.ok === 'true') {
              soundCorrect();
              btn.className = 'p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500 text-xs text-emerald-200 font-bold';
              cb();
              valL4();
            } else {
              soundWrong();
              btn.className = 'p-2.5 rounded-xl bg-rose-950/80 border border-rose-500 text-xs text-rose-200';
            }
          };
        });
      }

      wire('.l4-q1', () => { q1 = true; });
      wire('.l4-q2', () => { q2 = true; });
      wire('.l4-q3', () => { q3 = true; });

      sub.onclick = () => {
        soundLevelUp();
        score += 20;
        currentLevel = 5;
        renderLevel();
      };
    }

    // NIVELUL 5: SALVAREA DIN RECYCLE BIN (PAG. 29)
    function renderLevel5(container) {
      let restored = false, qOk = false;

      container.innerHTML = \`
        <div class="bg-slate-800 border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-xl">
          <div class="flex items-start justify-between gap-4 mb-4">
            <div>
              <span class="px-3 py-1 rounded-lg bg-rose-500/20 text-rose-400 font-bold text-xs uppercase tracking-wider border border-rose-500/30">
                Nivelul 5 din 5 • Salvarea Datelor
              </span>
              <h2 class="text-2xl sm:text-3xl font-black text-white mt-1.5 font-heading">
                Salvarea din Coșul de Reciclare (Recycle Bin) 🗑️
              </h2>
              <p class="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
                Folderul de teme a fost șters din greșeală! Salvează-l din Coșul de Reciclare (Recycle Bin) folosind opțiunea <strong>Restaurează (Restore)</strong> conform figurii 5 din manual!
              </p>
            </div>
            <div class="hidden sm:block text-4xl p-3 bg-slate-900/60 rounded-2xl border border-slate-700 text-rose-400">🛡️</div>
          </div>

          \${renderTeacherTip(
            'Recycle Bin este plasa ta de siguranță! (Manual pag. 29)',
            'Fișierele șterse cu Delete nu dispar definitiv! Ele se mută în Recycle Bin. Dacă dai click dreapta ➔ Restore, fișierul revine EXACT în locul de unde a fost șters!',
            '29',
            'Doar dacă golești coșul (Empty Recycle Bin), fișierele se pierd definitiv de pe disc!'
          )}

          <div class="bg-slate-900 border border-slate-700 rounded-2xl p-6 mb-5 flex flex-wrap items-center justify-around gap-6">
            <div id="l5-bin" class="flex flex-col items-center p-4 rounded-2xl bg-rose-950/40 border-2 border-rose-500 cursor-pointer w-36 text-center animate-pulse">
              <span class="text-5xl">🗑️</span>
              <span class="text-xs font-bold text-white mt-1">Coș de Reciclare</span>
              <span class="text-[10px] text-amber-300">(Click pt. deschidere)</span>
            </div>

            <div class="flex-1 bg-slate-950/60 border border-slate-800 rounded-xl p-4 text-center min-h-[120px] flex items-center justify-center">
              <div id="l5-res-box" class="hidden flex-col items-center">
                <span class="text-4xl">📁✨</span>
                <span class="text-sm font-bold text-emerald-400 mt-1">Teme_Importante</span>
                <span class="text-xs text-slate-400">Restaurat cu succes la locul inițial!</span>
              </div>
              <div id="l5-miss-box" class="text-xs text-rose-300">⚠️ Folderul de teme a fost șters! Deschide coșul!</div>
            </div>
          </div>

          <div id="l5-window" class="hidden bg-slate-950 border border-slate-700 rounded-xl p-4 mb-5">
            <div class="text-xs font-bold text-rose-400 mb-2">🗑️ Element găsit în Coșul de Reciclare:</div>
            <div class="flex justify-between items-center bg-slate-900 p-3 rounded-lg border border-slate-800">
              <span class="text-xs text-white font-mono">📁 Teme_Importante</span>
              <button id="l5-btn-restore" class="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow">
                🔄 Restaurează (Restore)
              </button>
            </div>
          </div>

          <div class="bg-slate-900 border border-slate-700 rounded-2xl p-4 mb-6">
            <h3 class="text-xs font-bold text-white mb-1">💡 Exercițiul 3 din manual (pag. 29): Odată ce ai șters un fișier, mai poate fi recuperat?</h3>
            <div class="space-y-2 text-xs sm:text-sm mt-2">
              <label class="flex items-center gap-2 cursor-pointer text-slate-300">
                <input type="radio" name="l5q" id="l5-r-ok" class="text-emerald-500">
                <span>DA, din Coșul de Reciclare dăm click dreapta și alegem Restore (Restaurare).</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer text-slate-300">
                <input type="radio" name="l5q" class="text-emerald-500">
                <span>NU, se topește instant în memorie.</span>
              </label>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-xs text-slate-400">Recompensă: <strong class="text-amber-400">+10 Pct (+10 Pct oficiu)</strong> = <strong class="text-emerald-400">100 Pct</strong></span>
            <button id="l5-submit" disabled class="bg-slate-700 text-slate-400 font-bold px-6 py-3 rounded-2xl cursor-not-allowed">
              Revendică Autoevaluarea & Diploma ➔
            </button>
          </div>
        </div>
      \`;

      const bin = document.getElementById('l5-bin');
      const win = document.getElementById('l5-window');
      const bRes = document.getElementById('l5-btn-restore');
      const miss = document.getElementById('l5-miss-box');
      const res = document.getElementById('l5-res-box');
      const rOk = document.getElementById('l5-r-ok');
      const sub = document.getElementById('l5-submit');

      function valL5() {
        if (restored && qOk) {
          sub.disabled = false;
          sub.className = 'bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 text-slate-950 font-black px-8 py-3.5 rounded-2xl transition shadow-xl cursor-pointer';
        }
      }

      bin.onclick = () => { soundClick(); win.classList.toggle('hidden'); };
      bRes.onclick = () => {
        soundCorrect();
        restored = true;
        win.classList.add('hidden');
        bin.classList.remove('animate-pulse', 'border-rose-500');
        bin.classList.add('border-slate-700');
        miss.remove();
        res.classList.remove('hidden');
        res.classList.add('flex');
        valL5();
      };
      rOk.onchange = () => { soundCorrect(); qOk = true; valL5(); };

      sub.onclick = () => {
        soundVictory();
        score += 20; // 80 + 20 = 100
        currentLevel = 6;
        if (window.confetti) window.confetti({ particleCount: 160, spread: 80 });
        renderLevel();
      };
    }

    // ECRANUL FINAL CU AUTOEVALUARE (PAG. 30) & DIPLOMA
    function renderVictory(container) {
      container.innerHTML = \`
        <div class="bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-10 shadow-2xl text-center relative">
          <div class="text-6xl sm:text-7xl mb-3 animate-float inline-block">🌳✨</div>
          <div class="flex justify-center mb-2">
            <span class="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs sm:text-sm uppercase font-black tracking-widest border border-emerald-500/30">
              MISIUNE ÎNDEPLINITĂ CU SUCCES!
            </span>
          </div>
          <h2 class="text-3xl sm:text-5xl font-black text-white mt-2 font-heading">
            Felicitări din partea Școlii ARKEDO!
          </h2>
          <p class="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mt-2 mb-6">
            Ai finalizat cu brio testul din manualul de informatică și ai salvat Arborele Secret!
          </p>

          <!-- Autoevaluare pag. 30 -->
          <div class="max-w-xl mx-auto bg-slate-900 border border-slate-700 rounded-2xl p-5 mb-8 text-left">
            <div class="flex justify-between items-center mb-3 border-b border-slate-800 pb-2">
              <span class="text-xs font-bold text-amber-400 uppercase">Autoevaluare (Manual pag. 30)</span>
              <span class="text-lg font-black text-emerald-400 font-heading">100 / 100 Puncte (15-20 min)</span>
            </div>
            <div class="text-xs text-slate-300 mb-2">Cum te simți după ce ai rezolvat acest test?</div>
            <div class="grid grid-cols-3 gap-2">
              <button onclick="setFeeling('incantat')" id="feel-incantat" class="p-2.5 rounded-xl border border-emerald-500 bg-emerald-950/80 text-emerald-300 text-xs font-bold text-center">
                🤩 Încântat!
              </button>
              <button onclick="setFeeling('multumit')" id="feel-multumit" class="p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 text-xs font-bold text-center">
                🙂 Mulțumit
              </button>
              <button onclick="setFeeling('nemultumit')" id="feel-nemultumit" class="p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 text-xs font-bold text-center">
                🙁 Nemulțumit
              </button>
            </div>
          </div>

          <!-- Diploma -->
          <div id="diploma-card" class="bg-gradient-to-tr from-amber-50 via-white to-amber-100 text-slate-900 rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto border-4 border-amber-400 shadow-2xl text-center relative mb-8">
            <div class="border-2 border-dashed border-amber-600/40 p-6 rounded-2xl">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-black text-emerald-900 uppercase bg-emerald-100 px-3 py-1 rounded-full">Școala ARKEDO</span>
                <span class="text-2xl">🏅</span>
              </div>
              <h3 class="text-2xl sm:text-3xl font-black text-slate-900 uppercase font-heading">DIPLOMĂ DE MERIT</h3>
              <p class="text-xs text-slate-600 mt-1 uppercase font-semibold">Departamentul de Informatică • Clasa a V-a</p>
              <p class="text-xs text-slate-500 mt-3">Se conferă elevului / elevei:</p>
              <input type="text" id="stud-name" value="Elevul/Eleva Curajoasă" class="w-full text-center text-xl sm:text-3xl font-black text-emerald-700 bg-transparent border-b-2 border-emerald-500 focus:outline-none py-1 my-2">
              <p class="text-xs text-slate-700 leading-relaxed max-w-md mx-auto">
                Pentru absolvirea cu nota 10 (100 puncte) a provocării <strong>"ARKEDO: Misiunea Arborele Secret 🌳"</strong> și stăpânirea deplină a managementului fișierelor și folderelor (structură arborescentă, selecție multiplă, mutare, copiere, redenumire F2 și salvare din Recycle Bin).
              </p>
              <div class="mt-6 pt-3 border-t border-amber-300 flex justify-between text-xs text-slate-700 font-bold">
                <span>Profesor de Informatică</span>
                <span>\${new Date().toLocaleDateString('ro-RO')}</span>
              </div>
            </div>
          </div>

          <div class="flex justify-center gap-4">
            <button onclick="window.print()" class="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-6 py-3 rounded-2xl shadow transition font-heading">
              🖨️ Tipărește Diploma
            </button>
            <button onclick="resetGame()" class="bg-slate-700 hover:bg-slate-600 text-white font-bold px-6 py-3 rounded-2xl transition font-heading">
              🔄 Resetează
            </button>
          </div>
        </div>
      \`;
    }

    window.setFeeling = function(val) {
      soundClick();
      studentFeeling = val;
      ['incantat', 'multumit', 'nemultumit'].forEach(k => {
        const btn = document.getElementById('feel-' + k);
        if (k === val) {
          btn.className = 'p-2.5 rounded-xl border border-emerald-500 bg-emerald-950/80 text-emerald-300 text-xs font-bold text-center';
        } else {
          btn.className = 'p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 text-xs font-bold text-center';
        }
      });
    };

    window.resetGame = function() {
      soundClick();
      currentLevel = 1;
      score = 0;
      renderLevel();
    };

    renderLevel();
  </script>
</body>
</html>`;
}
