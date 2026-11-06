import React, { useState } from 'react';
import { Presentation, Layers, CheckCircle2, Sparkles, Share2, FileDown, Eye, Check, MessageSquare, AlertCircle } from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface C1Level6Props {
  onPass: (score: number) => void;
}

export const C1Level6_TeamPresentationStudio: React.FC<C1Level6Props> = ({ onPass }) => {
  const { lang } = useLanguage();

  // Current active slide in the presentation editor
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);

  // Rubric checklist states
  const [slide1Title, setSlide1Title] = useState<string>(
    lang === 'ro' ? 'Planul de Sustenabilitate al Școlii' : 'School Sustainability Roadmap'
  );
  const [slide1Authors, setSlide1Authors] = useState<string>(
    lang === 'ro' ? 'Echipa Verde: Maria, Andrei & Tu' : 'Green Team: Maria, Andrew & You'
  );

  const [slide2CommentResolved, setSlide2CommentResolved] = useState<boolean>(false);
  const [slide3StatValue, setSlide3StatValue] = useState<'40%' | '85%' | '10%'>('85%');
  const [teacherPermission, setTeacherPermission] = useState<'viewer' | 'editor'>('viewer');
  const [isExportedPdf, setIsExportedPdf] = useState<boolean>(false);

  const [isPassed, setIsPassed] = useState<boolean>(false);

  // Rubric points calculation
  const scoreTask1 = slide1Title.length > 5 && slide1Authors.length > 5 ? 25 : 0;
  const scoreTask2 = slide2CommentResolved ? 25 : 0;
  const scoreTask3 = slide3StatValue === '85%' ? 25 : 0;
  const scoreTask4 = teacherPermission === 'viewer' && isExportedPdf ? 25 : 0;
  const totalScore = scoreTask1 + scoreTask2 + scoreTask3 + scoreTask4;

  const handleResolveSlide2Comment = () => {
    setSlide2CommentResolved(true);
    sounds.playCorrect();
  };

  const handleExportPdf = () => {
    if (teacherPermission !== 'viewer') {
      sounds.playFailure();
      return;
    }
    setIsExportedPdf(true);
    sounds.playSuccess();
  };

  const handleFinishLevel = () => {
    if (totalScore < 100) return;
    setIsPassed(true);
    sounds.playLevelComplete();
    onPass(100);
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border border-emerald-500/30 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Presentation className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              {lang === 'ro'
                ? 'Nivelul 6 • Manual Art Klett pag. 54–56'
                : 'Level 6 • Art Klett Textbook pp. 54–56'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
              {lang === 'ro'
                ? 'Studioul de Producție în Echipă: Google Slides („Echipa Verde”)'
                : 'Team Production Studio: Google Slides ("Green Team")'}
            </h2>
          </div>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
          {lang === 'ro' ? (
            <>
              Construiește în echipă o prezentare de 4 diapozitive pentru disciplina Ecologie & TIC: coordonează munca pe slide-uri, rezolvă comentariile coechipierilor, validează statisticile și exportă lucrarea finală ca PDF conform rubricii oficiale (100 puncte).
            </>
          ) : (
            <>
              Collaborate on a 4-slide ecology and digital literacy presentation: organize slide assignments, resolve co-author feedback, calibrate empirical stats, and export the master PDF according to official grading rubric (100 pts).
            </>
          )}
        </p>
      </div>

      {/* Main Studio Editor */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col gap-6">
        {/* Editor Toolbar & Score Pill */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base sm:text-lg font-bold text-white">
              {lang === 'ro'
                ? 'Google Slides Studio — Proiectul Ecologic Comun'
                : 'Google Slides Studio — Collaborative Green Project'}
            </h3>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 px-4 py-1.5 rounded-2xl border border-slate-800">
            <span className="text-xs font-mono text-slate-400">
              {lang === 'ro' ? 'Punctaj Rubrică:' : 'Rubric Score:'}
            </span>
            <span className="text-sm font-mono font-black text-emerald-400">
              {totalScore} / 100 {lang === 'ro' ? 'Puncte' : 'Points'}
            </span>
          </div>
        </div>

        {/* 2-Column Studio: Slide Filmstrip (Left) & Active Canvas (Right) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filmstrip Slides 1..4 */}
          <div className="flex flex-col gap-3">
            {[
              {
                id: 0,
                titleRo: '1. Titlu & Autori',
                titleEn: '1. Title & Authors',
                authorRo: 'Echipa Verde',
                authorEn: 'Green Team'
              },
              {
                id: 1,
                titleRo: '2. Energie & Becuri LED',
                titleEn: '2. Energy & LED Lighting',
                authorRo: 'Maria',
                authorEn: 'Maria'
              },
              {
                id: 2,
                titleRo: '3. Colectare Selectivă',
                titleEn: '3. Waste Recycling',
                authorRo: 'Andrei',
                authorEn: 'Andrew'
              },
              {
                id: 3,
                titleRo: '4. Concluzii & PDF',
                titleEn: '4. Summary & PDF',
                authorRo: 'Tu',
                authorEn: 'You'
              }
            ].map((slide) => (
              <button
                key={slide.id}
                onClick={() => {
                  setActiveSlideIndex(slide.id);
                  sounds.playClick();
                }}
                className={`p-3 rounded-2xl border text-left transition flex flex-col gap-1 cursor-pointer ${
                  activeSlideIndex === slide.id
                    ? 'bg-emerald-950/40 border-emerald-500 shadow-md ring-1 ring-emerald-500/40'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>{lang === 'ro' ? slide.titleRo : slide.titleEn}</span>
                  <span className="text-[10px] font-mono text-slate-400">S{slide.id + 1}</span>
                </div>
                <span className="text-[11px] text-emerald-400 font-mono">
                  {lang === 'ro' ? 'Autor: ' : 'Author: '}
                  {lang === 'ro' ? slide.authorRo : slide.authorEn}
                </span>
              </button>
            ))}
          </div>

          {/* Active Slide Canvas (Cols 2..4) */}
          <div className="md:col-span-3 bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between min-h-[340px]">
            {/* Slide 1 */}
            {activeSlideIndex === 0 && (
              <div className="flex flex-col justify-center items-center text-center gap-4 py-8">
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">
                  {lang === 'ro'
                    ? 'DIAPOZITIVUL 1 • COPERTA PREZENTĂRII'
                    : 'SLIDE 1 • PRESENTATION COVER'}
                </span>
                <input
                  type="text"
                  value={slide1Title}
                  onChange={(e) => setSlide1Title(e.target.value)}
                  className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-xl p-3 text-lg font-black text-white text-center focus:outline-none focus:border-emerald-500"
                  placeholder={lang === 'ro' ? 'Titlul Prezentării...' : 'Presentation Title...'}
                />
                <input
                  type="text"
                  value={slide1Authors}
                  onChange={(e) => setSlide1Authors(e.target.value)}
                  className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs font-medium text-slate-300 text-center focus:outline-none focus:border-emerald-500"
                  placeholder={lang === 'ro' ? 'Autorii Proiectului...' : 'Team Co-authors...'}
                />
                <div className="text-[11px] text-emerald-400 font-mono">
                  {scoreTask1 === 25
                    ? (lang === 'ro' ? '✓ Task 1 Validat (25 Pct)' : '✓ Task 1 Validated (25 Pts)')
                    : (lang === 'ro' ? 'Scrie un titlu și autorii echipei' : 'Enter presentation title and authors')}
                </div>
              </div>
            )}

            {/* Slide 2 */}
            {activeSlideIndex === 1 && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono text-pink-400 font-bold">
                    {lang === 'ro' ? 'DIAPOZITIVUL 2 • REDACTAT DE MARIA' : 'SLIDE 2 • DRAFTED BY MARIA'}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {lang === 'ro' ? 'Eficiență Energetică' : 'Energy Efficiency'}
                  </span>
                </div>
                <h4 className="text-base font-bold text-white">
                  {lang === 'ro'
                    ? 'Modernizarea Iluminatului cu Becuri LED'
                    : 'Modernizing School Lighting with High-Efficiency LEDs'}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {lang === 'ro'
                    ? 'Înlocuirea lămpilor fluorescente vechi cu panouri LED reduce consumul electric al școlii cu 65%, oferind totodată o lumină caldă optimă pentru sănătatea oculară a elevilor.'
                    : 'Replacing legacy fluorescent tubes with LED panels cuts school power expenditure by 65% while providing flicker-free warm illumination protecting student vision.'}
                </p>

                {/* Comment Box on Slide 2 */}
                <div className="p-4 rounded-xl bg-pink-950/20 border border-pink-500/40 flex flex-col gap-2 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-pink-300 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5" />
                      {lang === 'ro' ? 'Comentariu de la Maria:' : 'Comment from Maria:'}
                    </span>
                    {slide2CommentResolved ? (
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">
                        {lang === 'ro' ? '✓ Rezolvat (25 Pct)' : '✓ Resolved (25 Pts)'}
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-amber-400">
                        {lang === 'ro' ? 'În așteptare' : 'Pending'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300">
                    {lang === 'ro'
                      ? '„Am formulat propunerea pentru consiliul profesoral. Poți aproba te rog textul pentru a merge mai departe?”'
                      : '“I drafted this initiative for the faculty board. Could you review and approve the text to proceed?”'}
                  </p>
                  {!slide2CommentResolved && (
                    <button
                      onClick={handleResolveSlide2Comment}
                      className="self-end px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{lang === 'ro' ? 'Aprobă & Rezolvă Comentariul' : 'Approve & Resolve Thread'}</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Slide 3 */}
            {activeSlideIndex === 2 && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono text-amber-400 font-bold">
                    {lang === 'ro' ? 'DIAPOZITIVUL 3 • REDACTAT DE ANDREI' : 'SLIDE 3 • DRAFTED BY ANDREW'}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {lang === 'ro' ? 'Reciclare & Mediu' : 'Recycling & Environment'}
                  </span>
                </div>
                <h4 className="text-base font-bold text-white">
                  {lang === 'ro' ? 'Colectarea Selectivă în Clase' : 'Classroom Waste Segregation Systems'}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {lang === 'ro'
                    ? 'Amplasarea de pubele compartimentate pentru hârtie, plastic și metal în fiecare sală de clasă a condus la o creștere impresionantă a ratei de reciclare a școlii noastre.'
                    : 'Installing color-coded multi-stream bins for paper, plastics, and metals across all homerooms triggered a steep rise in schoolwide recovery metrics.'}
                </p>

                <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/40 flex flex-col gap-3 mt-2">
                  <span className="text-xs font-bold text-amber-300">
                    {lang === 'ro'
                      ? 'Alege statistica validată din raportul de mediu:'
                      : 'Select the verified empirical recycling statistic:'}
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {(['10%', '40%', '85%'] as const).map((stat) => (
                      <button
                        key={stat}
                        onClick={() => {
                          setSlide3StatValue(stat);
                          sounds.playClick();
                        }}
                        className={`py-2 rounded-xl border text-xs font-bold font-mono transition cursor-pointer ${
                          slide3StatValue === stat
                            ? 'bg-amber-500 text-slate-950 border-amber-400'
                            : 'bg-slate-900 text-slate-300 border-slate-700'
                        }`}
                      >
                        {stat} {lang === 'ro' ? 'Rată Reciclare' : 'Recycling Rate'}
                      </button>
                    ))}
                  </div>
                  <div className="text-[11px] text-emerald-400 font-mono">
                    {scoreTask3 === 25
                      ? (lang === 'ro' ? '✓ Statistica corectă (85%) a fost validată (25 Pct)' : '✓ Verified statistic (85%) approved (25 Pts)')
                      : (lang === 'ro' ? 'Selectează statistica corectă de 85% din raport' : 'Select the validated 85% benchmark from survey')}
                  </div>
                </div>
              </div>
            )}

            {/* Slide 4 */}
            {activeSlideIndex === 3 && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono text-emerald-400 font-bold">
                    {lang === 'ro' ? 'DIAPOZITIVUL 4 • FINALIZARE & EXPORT' : 'SLIDE 4 • COMPLETION & EXPORT'}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {lang === 'ro' ? 'Predare Profesor' : 'Instructor Hand-In'}
                  </span>
                </div>
                <h4 className="text-base font-bold text-white">
                  {lang === 'ro' ? 'Configurare Partajare & Export Document' : 'Sharing Configuration & PDF Export'}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-2">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Share2 className="w-3.5 h-3.5 text-teal-400" />
                      {lang === 'ro' ? 'Permisiune Profesor:' : 'Teacher Role Permission:'}
                    </span>
                    <select
                      value={teacherPermission}
                      onChange={(e) => setTeacherPermission(e.target.value as any)}
                      className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white cursor-pointer"
                    >
                      <option value="viewer">
                        {lang === 'ro' ? 'Vizualizator (Viewer) — Recomandat' : 'Viewer — Recommended'}
                      </option>
                      <option value="editor">
                        {lang === 'ro' ? 'Editor — Nerecomandat la predare' : 'Editor — Not advised for hand-in'}
                      </option>
                    </select>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between gap-2">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <FileDown className="w-3.5 h-3.5 text-emerald-400" />
                      {lang === 'ro' ? 'Descarcă ca PDF:' : 'Download Master PDF:'}
                    </span>
                    <button
                      onClick={handleExportPdf}
                      disabled={isExportedPdf}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                        isExportedPdf
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow'
                      }`}
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      <span>
                        {isExportedPdf
                          ? (lang === 'ro' ? 'PDF Generat cu Succes ✓' : 'PDF Exported Successfully ✓')
                          : (lang === 'ro' ? 'Exportă Prezentare PDF' : 'Export Presentation as PDF')}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-emerald-400 font-mono">
                  {scoreTask4 === 25
                    ? (lang === 'ro' ? '✓ Partajare setată ca Viewer și PDF descărcat (25 Pct)' : '✓ Viewer permission and PDF generated (25 Pts)')
                    : (lang === 'ro' ? 'Setează permisiunea Viewer și exportă ca PDF' : 'Configure Viewer permission and export PDF')}
                </div>
              </div>
            )}

            {/* Slide Navigation Dots */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs font-mono">
              <span className="text-slate-400">
                {lang === 'ro'
                  ? `Diapozitivul ${activeSlideIndex + 1} din 4`
                  : `Slide ${activeSlideIndex + 1} of 4`}
              </span>
              <div className="flex items-center gap-1.5">
                {[0, 1, 2, 3].map((idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveSlideIndex(idx);
                      sounds.playClick();
                    }}
                    className={`w-2.5 h-2.5 rounded-full transition cursor-pointer ${
                      activeSlideIndex === idx ? 'bg-emerald-400 w-5' : 'bg-slate-700 hover:bg-slate-500'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Level Pass Confirmation Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <div className="text-xs font-mono text-slate-400">
            {totalScore === 100 ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {lang === 'ro'
                  ? 'Toate cerințele rubricii de producție au fost îndeplinite (100/100 Pct)!'
                  : 'All presentation production rubric criteria fulfilled (100/100 Pts)!'}
              </span>
            ) : (
              <span>
                {lang === 'ro'
                  ? 'Rezolvă toate cele 4 task-uri pentru a aduna 100 de puncte.'
                  : 'Fulfill all 4 tasks across the slides to accumulate 100 points.'}
              </span>
            )}
          </div>

          <button
            onClick={handleFinishLevel}
            disabled={totalScore < 100 || isPassed}
            className={`px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
              totalScore === 100 && !isPassed
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white font-black shadow-lg shadow-emerald-600/30'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {lang === 'ro' ? 'Finalizează Nivelul 6 (+100 XP)' : 'Complete Level 6 (+100 XP)'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
