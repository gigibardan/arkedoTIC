import React, { useState } from 'react';
import {
  Newspaper,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  Eye,
  Sliders,
  RotateCcw,
  Columns,
  Table2,
  Quote,
  Bookmark,
  Layers,
  Award,
  Check,
  FileCheck,
  Printer
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';

interface W2Level6Props {
  onCompletePage: (earnedScore: number) => void;
}

export const W2Level6_MagazineStudio: React.FC<W2Level6Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // 6 Technical Editorial Settings
  const [differentFirstPage, setDifferentFirstPage] = useState<boolean>(true);
  const [columnsLayout, setColumnsLayout] = useState<'one' | 'two'>('two');
  const [tableOptimized, setTableOptimized] = useState<boolean>(true);
  const [hasFootnote, setHasFootnote] = useState<boolean>(true);
  const [numberingActive, setNumberingActive] = useState<boolean>(true);
  const [pageMargins, setPageMargins] = useState<'normal' | 'narrow' | 'wide'>('normal');

  // Preview Page Switcher
  const [activeTab, setActiveTab] = useState<'page1' | 'page2'>('page1');

  // 6 Criteria Checklist Check
  const criteria = [
    {
      id: 'c1',
      title: 'Copertă Protejată',
      desc: 'Prima pagină nu conține număr de pagină tipărit (Different First Page).',
      met: differentFirstPage,
    },
    {
      id: 'c2',
      title: 'Machetare pe 2 Coloane',
      desc: 'Articolul principal este aranjat pe 2 coloane paralele cu linie mediană.',
      met: columnsLayout === 'two',
    },
    {
      id: 'c3',
      title: 'Tabel Academic Optimizat',
      desc: 'Tabelul are celule unite pe titlu și numerele aliniate la dreapta.',
      met: tableOptimized,
    },
    {
      id: 'c4',
      title: 'Notă de Subsol Explicativă',
      desc: 'Termenul tehnic include notă de subsol la baza paginii.',
      met: hasFootnote,
    },
    {
      id: 'c5',
      title: 'Numerotare Automată Subsol',
      desc: 'Pagina 2 afișează numărul de pagină generat dinamic.',
      met: numberingActive,
    },
    {
      id: 'c6',
      title: 'Margini Echilibrate A4',
      desc: 'Marginile paginii sunt setate conform standardului (Normal 2.54 cm).',
      met: pageMargins === 'normal',
    },
  ];

  const metCount = criteria.filter((c) => c.met).length;
  const grade = Math.round(4 + (metCount / 6) * 6); // Scale 4 to 10
  const isPerfect = metCount === 6;

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto px-4 py-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-900/40 via-blue-900/40 to-indigo-900/40 border border-sky-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sky-400 text-xs font-mono font-bold tracking-wider uppercase mb-1">
              <span>Misiunea 1B • Nivelul 6 din 7</span>
              <span>•</span>
              <span>Atelier Practic Integrat</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">
              Studioul Editorial de Machetare a Revistei Școlare
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
              Prelucrează și asamblează macheta completă a ediției festive a revistei gimnaziale: aplică toate cele 6 criterii tehnice (copertă, 2 coloane, tabel academic, notă de subsol, numerotare dinamică și margini A4) pentru a obține Nota 10 Editorială!
            </p>
          </div>
          <div className="p-3 bg-sky-500/10 border border-sky-500/30 rounded-2xl text-sky-400 self-start sm:self-auto">
            <Newspaper className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Main Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Editorial Controls & Rubric */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Rubric Scorecard */}
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">Grilă Evaluare Redacție:</span>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-400">Notă:</span>
                <span className={`text-sm font-black font-mono px-2.5 py-0.5 rounded-lg ${
                  isPerfect ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}>
                  {grade} / 10
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {criteria.map((c) => (
                <div
                  key={c.id}
                  className={`p-2.5 rounded-xl border text-xs flex items-center justify-between transition ${
                    c.met
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-400'
                  }`}
                >
                  <div>
                    <span className="font-bold block text-white">{c.title}</span>
                    <span className="text-[11px] text-slate-400 block">{c.desc}</span>
                  </div>
                  {c.met ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Editorial Controls Console */}
          <div className="bg-slate-850/80 border border-slate-700/80 rounded-3xl p-5 shadow-xl flex flex-col gap-4">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Consola de Comenzi Tehnoredactare:
            </span>

            {/* Toggle 1: Different First Page */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-700">
              <div>
                <span className="text-xs font-bold text-slate-200 block">1. Prima Pagină Diferită</span>
                <span className="text-[11px] text-slate-400 block">Fără număr pe copertă</span>
              </div>
              <button
                onClick={() => {
                  sounds.playClick();
                  setDifferentFirstPage(!differentFirstPage);
                }}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                  differentFirstPage ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-400'
                }`}
              >
                {differentFirstPage ? 'ACTIVAT' : 'DEZACTIVAT'}
              </button>
            </div>

            {/* Toggle 2: Columns Layout */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-700">
              <div>
                <span className="text-xs font-bold text-slate-200 block">2. Aranjare Articol</span>
                <span className="text-[11px] text-slate-400 block">Coloane paralele ziar</span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    sounds.playClick();
                    setColumnsLayout('one');
                  }}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                    columnsLayout === 'one' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  1 Coloană
                </button>
                <button
                  onClick={() => {
                    sounds.playClick();
                    setColumnsLayout('two');
                  }}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                    columnsLayout === 'two' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  2 Coloane
                </button>
              </div>
            </div>

            {/* Toggle 3: Table Optimization */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-700">
              <div>
                <span className="text-xs font-bold text-slate-200 block">3. Tabel Academic</span>
                <span className="text-[11px] text-slate-400 block">Merge Cells + Aliniere dreapta</span>
              </div>
              <button
                onClick={() => {
                  sounds.playClick();
                  setTableOptimized(!tableOptimized);
                }}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                  tableOptimized ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-400'
                }`}
              >
                {tableOptimized ? 'CONFORM' : 'BRUT'}
              </button>
            </div>

            {/* Toggle 4: Footnote */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-700">
              <div>
                <span className="text-xs font-bold text-slate-200 block">4. Notă de Subsol</span>
                <span className="text-[11px] text-slate-400 block">Explicație la baza paginii</span>
              </div>
              <button
                onClick={() => {
                  sounds.playClick();
                  setHasFootnote(!hasFootnote);
                }}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                  hasFootnote ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-400'
                }`}
              >
                {hasFootnote ? 'INSERATĂ' : 'LIPSĂ'}
              </button>
            </div>

            {/* Toggle 5: Numbering Active */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-700">
              <div>
                <span className="text-xs font-bold text-slate-200 block">5. Numerotare Pagini</span>
                <span className="text-[11px] text-slate-400 block">Câmp dinamic Pag. X din Y</span>
              </div>
              <button
                onClick={() => {
                  sounds.playClick();
                  setNumberingActive(!numberingActive);
                }}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                  numberingActive ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-400'
                }`}
              >
                {numberingActive ? 'ACTIVĂ' : 'LIPSĂ'}
              </button>
            </div>

            {/* Toggle 6: Margins */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-700">
              <div>
                <span className="text-xs font-bold text-slate-200 block">6. Margini Format A4</span>
                <span className="text-[11px] text-slate-400 block">Normal 2.54 cm</span>
              </div>
              <div className="flex gap-1">
                {(['normal', 'narrow', 'wide'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      sounds.playClick();
                      setPageMargins(m);
                    }}
                    className={`px-2 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                      pageMargins === m ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {m === 'normal' ? 'Normal' : m === 'narrow' ? 'Îngust' : 'Lat'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Magazine Mockup Preview */}
        <div className="lg:col-span-7 flex flex-col items-center bg-slate-950/80 border border-slate-800 rounded-3xl p-6 min-h-[500px]">
          {/* Page Switcher Tabs */}
          <div className="flex items-center justify-between w-full mb-4">
            <span className="text-xs font-mono text-slate-400">Previzualizare Tiraj Tipografic:</span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveTab('page1');
                }}
                className={`px-3.5 py-1 text-xs font-bold rounded-xl transition cursor-pointer ${
                  activeTab === 'page1' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Pagina 1 (Copertă)
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveTab('page2');
                }}
                className={`px-3.5 py-1 text-xs font-bold rounded-xl transition cursor-pointer ${
                  activeTab === 'page2' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Pagina 2 (Editorial & Tabel)
              </button>
            </div>
          </div>

          {/* Physical Sheet Container */}
          <div
            className={`w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 text-slate-900 flex flex-col justify-between min-h-[480px] border border-slate-300 transition-all duration-300 ${
              pageMargins === 'normal' ? 'p-6' : pageMargins === 'narrow' ? 'p-3' : 'p-10'
            }`}
          >
            {activeTab === 'page1' ? (
              /* COVER PAGE */
              <div className="flex flex-col justify-between h-full py-4 text-center select-none">
                <div className="border-b-2 border-slate-900 pb-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold block">
                    Publicație Școlară Trimestrială • Anul Școlar 2026-2027
                  </span>
                  <h2 className="text-2xl font-black font-serif text-slate-950 tracking-tight mt-1">
                    CURIERUL GIMNAZIAL
                  </h2>
                </div>

                <div className="my-auto py-8">
                  <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-3 text-sky-700 text-2xl">
                    📰
                  </div>
                  <h3 className="text-lg font-bold font-serif text-slate-800">
                    Ediție Specială: Arta Tehnoredactării Digitale
                  </h3>
                  <p className="text-xs text-slate-600 max-w-xs mx-auto mt-2 leading-relaxed">
                    Norme de redactare, tipografie românească conform SR 13411, machetarea foii A4 și tabele academice.
                  </p>
                </div>

                <div className="border-t border-slate-300 pt-2 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>Numărul 1 • Octombrie</span>
                  <span>
                    {!differentFirstPage && numberingActive ? (
                      <span className="text-rose-600 font-bold">[Greșeală: Număr pe copertă: 1]</span>
                    ) : (
                      <span className="text-emerald-700 font-bold">[Copertă protejată conform normelor]</span>
                    )}
                  </span>
                </div>
              </div>
            ) : (
              /* PAGE 2: EDITORIAL & TABLE */
              <div className="flex flex-col justify-between h-full select-none text-slate-800 font-serif">
                {/* Header */}
                <div className="border-b border-slate-300 pb-1 flex items-center justify-between text-[10px] text-slate-500">
                  <span className="font-bold text-slate-800">Curierul Gimnazial • Rubrica de Informatică & TIC</span>
                  <span>Octombrie 2026</span>
                </div>

                {/* Article Body: 1 or 2 Columns */}
                <div className="my-3">
                  <h4 className="text-sm font-black font-serif text-slate-900 mb-2">
                    Cum construim documente impecabile în Microsoft Word
                  </h4>

                  <div
                    className={`text-justify leading-relaxed text-[11px] text-slate-700 ${
                      columnsLayout === 'two' ? 'columns-2 gap-4' : 'columns-1'
                    }`}
                  >
                    <p className="indent-3 mb-2">
                      Machetarea profesională necesită respectarea standardelor de lizibilitate. Folosirea corectă a diacriticelor cu virgulă dedesubt (ș, ț) și a ghilimelelor românești „99 jos / 99 sus” reflectă atenția pentru calitate.
                    </p>
                    <p className="indent-3">
                      Tabelele dense trebuie să aibă întotdeauna celulele unite pe rândul de titlu{' '}
                      {hasFootnote && (
                        <sup className="text-sky-600 font-bold text-[10px] ml-0.5">1</sup>
                      )}
                      , iar valorile numerice se aliniază invariabil la dreapta pentru a păstra virgulele zecimale într-o coloană verticală armonioasă.
                    </p>
                  </div>

                  {/* Table */}
                  <div className="mt-3">
                    <table className="w-full text-[10px] border-collapse border border-slate-300">
                      <thead>
                        {tableOptimized ? (
                          <>
                            <tr className="bg-slate-800 text-white font-bold text-center">
                              <th colSpan={3} className="p-1">Rezultatele Olimpiadei Județene</th>
                            </tr>
                            <tr className="bg-slate-100 text-slate-700">
                              <th className="p-1 text-left border border-slate-300">Elev</th>
                              <th className="p-1 text-left border border-slate-300">Clasa</th>
                              <th className="p-1 text-right border border-slate-300">Punctaj</th>
                            </tr>
                          </>
                        ) : (
                          <tr className="bg-rose-50 text-rose-700">
                            <th className="p-1 text-left border border-slate-300">Elev</th>
                            <th className="p-1 text-left border border-slate-300">Clasa</th>
                            <th className="p-1 text-left border border-slate-300">Punctaj (Greșit la stânga)</th>
                          </tr>
                        )}
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-1 border border-slate-300">Andrei P.</td>
                          <td className="p-1 border border-slate-300">7A</td>
                          <td className={`p-1 border border-slate-300 font-mono ${tableOptimized ? 'text-right font-bold' : 'text-left'}`}>98.50</td>
                        </tr>
                        <tr>
                          <td className="p-1 border border-slate-300">Elena I.</td>
                          <td className="p-1 border border-slate-300">7B</td>
                          <td className={`p-1 border border-slate-300 font-mono ${tableOptimized ? 'text-right font-bold' : 'text-left'}`}>95.00</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Footnotes & Footer */}
                <div className="mt-auto pt-2 border-t border-slate-200">
                  {hasFootnote && (
                    <div className="mb-2 text-[9px] text-slate-600 font-serif">
                      <div className="w-16 h-px bg-slate-400 mb-1"></div>
                      <p>
                        <sup className="font-bold text-sky-700">1</sup> Merge Cells: Comandă din fila Layout pentru unificarea celulelor de antet.
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>Curierul Gimnazial</span>
                    <span>
                      {numberingActive ? (
                        <span className="font-bold text-sky-700">Pagina 2 din 2</span>
                      ) : (
                        <span className="text-rose-500 font-bold">[Lipsă număr pagină]</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        canProceed={isPerfect}
        onNext={() => {
          sounds.playFanfare();
          onCompletePage(100);
        }}
        promptText={
          isPerfect
            ? 'Felicitări! Macheta revistei este impecabilă (Nota 10 Editorială)! Treci la Marele Examen Final!'
            : `Atinge toate cele 6 criterii editoriale pentru a obține Nota 10! (În prezent: ${metCount}/6 criterii îndeplinite).`
        }
      />
    </div>
  );
};
