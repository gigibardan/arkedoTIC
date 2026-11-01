import React, { useState } from 'react';
import {
  Square,
  Printer,
  Eye,
  Sparkles,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Palette,
  Layers,
  Sliders
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';

interface C2Level4Props {
  onCompletePage: (earnedScore: number) => void;
}

export const C2Level4_CellBordersStyling: React.FC<C2Level4Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Active styling state
  const [borderType, setBorderType] = useState<'none' | 'all' | 'thickOutside' | 'accountingTotal'>('accountingTotal');
  const [zebraShading, setZebraShading] = useState<boolean>(true);
  const [printPreviewMode, setPrintPreviewMode] = useState<boolean>(false);

  // Quiz state
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q3Answer, setQ3Answer] = useState<string | null>(null);

  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  const handleQ1 = (id: string) => {
    if (isLocked('q1')) return;
    setQ1Answer(id);
    if (id === 'invisibleOnPrint') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q1');
    }
  };

  const handleQ2 = (id: string) => {
    if (isLocked('q2')) return;
    setQ2Answer(id);
    if (id === 'doubleBottom') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q2');
    }
  };

  const handleQ3 = (id: string) => {
    if (isLocked('q3')) return;
    setQ3Answer(id);
    if (id === 'zebraShading') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q3');
    }
  };

  const isQ1Correct = q1Answer === 'invisibleOnPrint';
  const isQ2Correct = q2Answer === 'doubleBottom';
  const isQ3Correct = q3Answer === 'zebraShading';

  const correctCount = [isQ1Correct, isQ2Correct, isQ3Correct].filter(Boolean).length;
  const totalScore = Math.round((correctCount / 3) * 100);
  const canProceed = isQ1Correct && isQ2Correct && isQ3Correct;

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto pb-12">
      {/* Level Header Banner */}
      <div className="bg-gradient-to-r from-teal-950/70 via-emerald-950/40 to-slate-900 border border-teal-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Manual Art Klett 2025 • Pag. 23–24</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <Square className="w-8 h-8 text-teal-400" />
              Nivelul 4: Borduri Profesionale & Linii de Grilă la Tipărire
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              De ce tabelele Excel tipărite ies fără linii dacă nu aplici borduri explicite? Învață standardul liniei duble de total și umplerea cu vopsea pentru tabele impecabile.
            </p>
          </div>
          <div className="text-right shrink-0 bg-slate-900/80 px-4 py-3 rounded-2xl border border-teal-500/20">
            <div className="text-xs text-slate-400 uppercase font-semibold">Modulul 1B</div>
            <div className="text-2xl font-black text-teal-400">4 / 7</div>
          </div>
        </div>
      </div>

      {/* Interactive Border & Print Preview Simulator */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
              <Square className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Atelier: Borduri & Stiluri de Tabel</h2>
              <p className="text-xs text-slate-400">
                Schimbă bordura și activează Previzualizarea Tipăririi pentru a vedea cum arată pe foaia de hârtie A4
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => { sounds.playClick(); setZebraShading(prev => !prev); }}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer border ${
                zebraShading
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              🎨 Rânduri Alternate (Zebra)
            </button>
            <button
              type="button"
              onClick={() => { sounds.playClick(); setPrintPreviewMode(prev => !prev); }}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1.5 border ${
                printPreviewMode
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:text-white'
              }`}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{printPreviewMode ? 'Ieși din Previzualizare' : 'Previzualizare Imprimare A4'}</span>
            </button>
          </div>
        </div>

        {/* Border Type Selector */}
        <div className="flex flex-wrap gap-2 text-xs">
          {[
            { id: 'none', label: 'Fără Borduri (Doar liniile gri de ecran)' },
            { id: 'all', label: 'Toate Bordurile (All Borders)' },
            { id: 'thickOutside', label: 'Chenar Exterior Îngroșat' },
            { id: 'accountingTotal', label: 'Standard Total: Linie Dublă Dedesubt' },
          ].map(opt => (
            <button
              key={opt.id}
              type="button"
              onClick={() => { sounds.playClick(); setBorderType(opt.id as any); }}
              className={`px-3 py-2 rounded-xl border font-mono font-medium transition cursor-pointer ${
                borderType === opt.id
                  ? 'bg-teal-500/20 border-teal-400 text-teal-200 font-bold ring-2 ring-teal-500/30'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Live Table Render with Dynamic Borders */}
        <div className={`p-4 rounded-2xl transition duration-150 font-mono text-xs ${
          printPreviewMode ? 'bg-white text-slate-950 shadow-2xl' : 'bg-slate-950 text-slate-200 border border-slate-800 shadow-inner'
        }`}>
          {printPreviewMode && (
            <div className="bg-amber-100 border border-amber-300 p-2.5 rounded-xl text-amber-900 text-xs mb-3 font-sans flex items-center gap-2">
              <Printer className="w-4 h-4 shrink-0" />
              <span>
                <strong>Mod Previzualizare Imprimare Activ:</strong> Liniile gri implicite au dispărut complet! Doar bordurile reale desenate de tine vor apărea pe cerneală.
              </span>
            </div>
          )}

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`font-bold ${
                printPreviewMode ? 'bg-slate-100 text-slate-900 border-b-2 border-slate-800' : 'bg-slate-900 text-slate-300 border-b border-slate-800'
              }`}>
                <th className="p-2.5">Nr. Crt</th>
                <th className="p-2.5">Obiectiv / Material Didactic</th>
                <th className="p-2.5 text-right">Cantitate</th>
                <th className="p-2.5 text-right">Preț Unitar</th>
                <th className="p-2.5 text-right">Total</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${
              borderType === 'all'
                ? printPreviewMode ? 'divide-slate-800 border-b border-slate-800' : 'divide-slate-700'
                : printPreviewMode ? 'divide-transparent' : 'divide-slate-850'
            }`}>
              {[
                { id: 1, item: 'Licență Suită Birou 2026', qty: 25, price: '120.00 lei', total: '3.000.00 lei' },
                { id: 2, item: 'Kit Robotică Educațională Mindstorms', qty: 5, price: '1.450.00 lei', total: '7.250.00 lei' },
                { id: 3, item: 'Cabluri rețea Cat 6 UTP', qty: 30, price: '15.00 lei', total: '450.00 lei' },
              ].map((row, idx) => (
                <tr
                  key={row.id}
                  className={`${
                    zebraShading && idx % 2 === 1
                      ? printPreviewMode ? 'bg-slate-50' : 'bg-slate-900/60'
                      : ''
                  }`}
                >
                  <td className="p-2.5 text-center">{row.id}</td>
                  <td className="p-2.5 font-medium">{row.item}</td>
                  <td className="p-2.5 text-right">{row.qty}</td>
                  <td className="p-2.5 text-right">{row.price}</td>
                  <td className="p-2.5 text-right font-bold text-emerald-600 dark:text-emerald-400">{row.total}</td>
                </tr>
              ))}

              {/* Accounting Total Row with Double Bottom Border */}
              <tr className={`font-black ${
                borderType === 'accountingTotal'
                  ? 'border-t-2 border-slate-800 border-b-4 border-double border-b-slate-900'
                  : 'border-t border-slate-800'
              } ${printPreviewMode ? 'bg-slate-100 text-slate-950' : 'bg-emerald-950/40 text-emerald-200'}`}>
                <td colSpan={4} className="p-3 text-right">
                  TOTAL GENERAL BUGET TIC (cu TVA inclus):
                </td>
                <td className="p-3 text-right text-sm">
                  10.700,00 lei
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Summative Knowledge Verification with Pedagogical Cooldowns */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Verificare Pedagogică: Borduri & Tipărire</h2>
            <p className="text-xs text-slate-400">Răspunde corect la cele 3 întrebări din manual pentru a debloca Nivelul 5</p>
          </div>
        </div>

        {/* Q1 */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              1. Ce se întâmplă la tipărirea pe imprimantă dacă lași celulele doar cu liniile gri implicite de pe ecran (fără a aplica comanda Borduri)?
            </h3>
            {cooldowns.q1 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q1} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'invisibleOnPrint', text: 'Textul și numerele se tipăresc pe o foaie complet albă, fără nicio linie între celule' },
              { id: 'blackBorderAuto', text: 'Imprimanta desenează automat borduri groase negre în jurul fiecărei celule' },
              { id: 'paperJam', text: 'Imprimanta se blochează din cauza erorii de grilă' },
              { id: 'soundAlarm', text: 'Calculatorul emite o alertă sonoră de avertizare' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q1')}
                onClick={() => handleQ1(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q1Answer === option.id
                    ? option.id === 'invisibleOnPrint'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>

          <QuestionHint hint="Liniile gri de pe ecran (Gridlines) sunt doar un ghid vizual pentru lucru. Tipărirea necesită All Borders." />
          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              explanation="Corect! Liniile implicite de grilă nu sunt tipărite în mod standard. Pentru ca tabelul să aibă contururi pe foaie A4 sau în PDF, trebuie selectat domeniul și aplicat 'All Borders'."
            />
          )}
        </div>

        {/* Q2 */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              2. Ce stil de bordură este standardul profesional pentru rândul final de TOTAL conform manualului?
            </h3>
            {cooldowns.q2 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q2} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'doubleBottom', text: 'Bordură superioară simplă și bordură inferioară dublă (Top and Double Bottom Border)' },
              { id: 'zigzag', text: 'Linii în zigzag roz' },
              { id: 'noLine', text: 'Ștergerea completă a textului din celulă' },
              { id: 'circles', text: 'Cerculețe colorate punctate' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q2')}
                onClick={() => handleQ2(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q2Answer === option.id
                    ? option.id === 'doubleBottom'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>

          <QuestionHint hint="În contabilitate și rapoarte financiare, suma finală se marchează cu două linii orizontale dedesubt." />
          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              explanation="Excelent! Stilul 'Top and Double Bottom Border' semnalează clar încheierea calculului și totalul definitiv al coloanei."
            />
          )}
        </div>

        {/* Q3 */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              3. De ce este recomandată colorarea alternantă a rândurilor (stilul zebră cu Fill Color)?
            </h3>
            {cooldowns.q3 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q3} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'zebraShading', text: 'Facilitează urmărirea vizuală pe orizontală a datelor din tabele cu multe coloane' },
              { id: 'reduceSize', text: 'Reduce dimensiunea fișierului pe hard disk cu 50%' },
              { id: 'speedUpCpu', text: 'Accelerează procesorul calculatorului de 2 ori' },
              { id: 'protectVirus', text: 'Protejează foaia de calcul împotriva virușilor' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q3')}
                onClick={() => handleQ3(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q3Answer === option.id
                    ? option.id === 'zebraShading'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>

          <QuestionHint hint="Gândește-te la ochiul uman: când citești un rând cu 10 coloane, culorile alternante previn săritul pe alt rând." />
          {q3Answer && (
            <AnswerExplanation
              isCorrect={isQ3Correct}
              explanation="Exact! Hașurarea alternantă (zebra striping) este un principiu de bază în ergonomia vizuală, călăuzind privirea cititorului de-a lungul întregului rând."
            />
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        currentPage={4}
        totalPages={7}
        earnedScore={totalScore}
        canProceed={canProceed}
        onNext={() => {
          sounds.playLevelUp();
          onCompletePage(totalScore);
        }}
      />
    </div>
  );
};
