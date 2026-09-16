import React, { useState } from 'react';
import { Lightbulb, X, Sparkles, BookOpen, ChevronRight } from 'lucide-react';
import { sounds } from '../../utils/audio';
import { useLanguage } from '../../context/LanguageContext';

export interface PillFact {
  id: string;
  emoji: string;
  shortTitle: string;
  title: string;
  tag: string;
  bookPage: string;
  content: string;
  proTip: string;
  didYouKnow: string;
}

const PILLS_RO: PillFact[] = [
  {
    id: 'pascalina',
    emoji: '⚙️',
    shortTitle: 'Pascalina 1642',
    title: 'Pascalina – Primul Calculator Mecanic',
    tag: 'Istoria TIC',
    bookPage: '13',
    content: 'Inventată în anul 1642 de matematicianul și fizicianul francez Blaise Pascal, Pascalina folosea roți dințate numerotate de la 0 la 9 pentru a efectua adunări și scăderi mecanice.',
    proTip: 'Calculatoarele de astăzi, de la laptopuri la smartphone-uri, sunt considerate urmașele directe ale Pascalinei!',
    didYouKnow: 'Blaise Pascal a conceput acest aparat la doar 19 ani pentru a-și ajuta tatăl, care era perceptor de taxe în Rouen, scutindu-l de calcule interminabile cu pana pe hârtie.',
  },
  {
    id: 'eniac',
    emoji: '⚡',
    shortTitle: 'ENIAC 1946',
    title: 'ENIAC – Primul Calculator Electronic Numeric',
    tag: 'Evoluție Digitală',
    bookPage: '13',
    content: 'ENIAC (Electronic Numerical Integrator And Computer) a fost finalizat în 1946 pentru armata SUA. Spre deosebire de mașinile mecanice, folosea tuburi electronice și putea fi reprogramat.',
    proTip: 'ENIAC efectua 5.000 de adunări pe secundă — o viteză uluitoare pentru acea vreme, deși un smartphone modest de azi este de milioane de ori mai rapid!',
    didYouKnow: 'Cântărea peste 30 de tone, ocupa o cameră uriașă de 167 metri pătrați și consuma atâta curent electric încât se spunea că luminile din orașul Philadelphia scădeau în intensitate când era pornit!',
  },
  {
    id: 'ergonomie',
    emoji: '📐',
    shortTitle: 'Regula 45-70 cm',
    title: 'Ergonomia la Calculator & Telefon',
    tag: 'Sănătate & Postură',
    bookPage: '11-12',
    content: 'Ergonomia studiază interacțiunea dintre om și echipamente. Monitorul trebuie așezat la 45–70 cm distanță, cu marginea de sus la nivelul ochilor. Spatele trebuie ținut drept pe spătar, iar coatele la 90° la nivelul biroului.',
    proTip: 'Când folosești telefonul sau tableta, ridică aparatul spre ochi! Nu apleca gâtul înainte: fiecare înclinare de 15 grade adaugă o forță suplimentară de câteva kilograme asupra coloanei cervicale!',
    didYouKnow: 'Regula 20-20-20: la fiecare 20 de minute de privit ecranul, privește timp de 20 de secunde un punct aflat la 6 metri (20 feet) depărtare pentru a-ți odihni ochii.',
  },
  {
    id: 'cpu-ram',
    emoji: '🧠',
    shortTitle: 'CPU vs RAM',
    title: 'Microprocesorul & Memoria RAM',
    tag: 'Hardware Unitate Centrală',
    bookPage: '15-17',
    content: 'Microprocesorul (CPU) este creierul calculatorului, specializat în calcul, comandă și control. Memoria RAM este memoria de lucru unde sunt ținute doar datele active cât timp rulează un program.',
    proTip: 'Memoria RAM este VOLATILĂ: dacă iei curentul, tot ce se află în ea dispare! De aceea este vital să salvezi frecvent fișierele pe discul permanent (SSD/HDD) folosind comanda Ctrl+S!',
    didYouKnow: 'Un procesor modern din școală poate executa peste 3 miliarde de instrucțiuni pe secundă pe fiecare nucleu.',
  },
  {
    id: 'hdd-ssd',
    emoji: '🧲',
    shortTitle: 'HDD vs SSD',
    title: 'Discul Dur (HDD) vs Unitatea Solid-State (SSD)',
    tag: 'Stocare Permanentă',
    bookPage: '18',
    content: 'HDD-ul folosește platane magnetice care se rotesc la viteze mari (ex: 7200 rotații/minut) și capete de citire. SSD-ul stochează datele în memorii Flash (semiconductori), fără nicio piesă în mișcare.',
    proTip: 'SSD-urile pornesc Windows-ul în 5-10 secunde și nu se strică dacă laptopul este mișcat ușor, deoarece nu au brațe mecanice fragile precum hard disk-urile vechi.',
    didYouKnow: 'La discurile optice (CD, DVD, Blu-Ray), datele sunt arse cu rază laser în succesiuni microscopice de „gropițe” și „terenuri plate” ce reprezintă 0 și 1.',
  },
  {
    id: 'biti-bytes',
    emoji: '🔢',
    shortTitle: '1 Byte = 8 Biți',
    title: 'Unitățile de Măsură ale Informației',
    tag: 'Matematică Digitală',
    bookPage: '19',
    content: 'Bitul (b) este cea mai mică unitate și poate conține doar 0 sau 1. Un grup de 8 biți formează un Byte (octet, B). Multiplii sunt puteri ale lui 2: 1 KB = 1024 B, 1 MB = 1024 KB, 1 GB = 1024 MB, 1 TB = 1024 GB.',
    proTip: 'Pentru a scrie litera „e” pe ecran, calculatorul combină 8 biți: 01100101. Pentru două litere („eu”), are nevoie de 2 octeți (16 biți)!',
    didYouKnow: '1 Terabyte (1 TB) poate stoca peste 250.000 de fotografii sau aproximativ 500 de ore de film video de înaltă rezoluție!',
  },
];

const PILLS_EN: PillFact[] = [
  {
    id: 'pascalina',
    emoji: '⚙️',
    shortTitle: 'Pascaline 1642',
    title: 'The Pascaline – The First Mechanical Calculator',
    tag: 'History of Computing',
    bookPage: '13',
    content: 'Invented in 1642 by French mathematician and philosopher Blaise Pascal, the Pascaline used rotating geared wheels numbered 0 to 9 to perform mechanical additions and subtractions.',
    proTip: 'Today’s computers, from laptops to smartphones, are considered direct conceptual descendants of the Pascaline!',
    didYouKnow: 'Blaise Pascal designed this machine at just 19 years old to assist his father, a tax commissioner in Rouen, eliminating tedious hand calculations with quill and ink.',
  },
  {
    id: 'eniac',
    emoji: '⚡',
    shortTitle: 'ENIAC 1946',
    title: 'ENIAC – The First General-Purpose Electronic Digital Computer',
    tag: 'Digital Evolution',
    bookPage: '13',
    content: 'ENIAC (Electronic Numerical Integrator And Computer) was completed in 1946 for the US military. Unlike mechanical devices, it used vacuum tubes and was fully programmable.',
    proTip: 'ENIAC performed 5,000 additions per second — astonishing speed back then, though an ordinary smartphone today is millions of times faster!',
    didYouKnow: 'It weighed over 30 tons, occupied a massive 167-square-meter room, and consumed so much electricity that streetlights in Philadelphia allegedly dimmed when it was switched on!',
  },
  {
    id: 'ergonomie',
    emoji: '📐',
    shortTitle: '45-70 cm Rule',
    title: 'Computer & Smartphone Ergonomics',
    tag: 'Health & Posture',
    bookPage: '11-12',
    content: 'Ergonomics studies human interaction with equipment. Place the monitor 45–70 cm away with the top bezel at eye level. Keep your back supported and elbows at a 90° desk angle.',
    proTip: 'When using a phone or tablet, raise the device to your eyes! Do not hunch your neck forward: every 15-degree tilt adds several kilograms of extra stress to your cervical spine!',
    didYouKnow: 'The 20-20-20 Rule: every 20 minutes of screen time, look at an object 20 feet (6 meters) away for 20 seconds to relax your eye muscles.',
  },
  {
    id: 'cpu-ram',
    emoji: '🧠',
    shortTitle: 'CPU vs RAM',
    title: 'Microprocessor (CPU) & RAM Memory',
    tag: 'Motherboard Hardware',
    bookPage: '15-17',
    content: 'The CPU is the brain of the computer, handling calculations, logic, and control. RAM is the temporary workspace where active application data is kept while running.',
    proTip: 'RAM is VOLATILE: if power cuts out, everything inside evaporates! That’s why saving your work frequently to permanent disk (SSD/HDD) with Ctrl+S is essential!',
    didYouKnow: 'A modern school computer processor can execute more than 3 billion instructions per second on every individual core.',
  },
  {
    id: 'hdd-ssd',
    emoji: '🧲',
    shortTitle: 'HDD vs SSD',
    title: 'Hard Disk Drive (HDD) vs Solid-State Drive (SSD)',
    tag: 'Permanent Storage',
    bookPage: '18',
    content: 'HDDs store data on spinning magnetic platters (e.g. 7200 RPM) read by moving heads. SSDs store data electronically in solid-state flash chips with zero moving parts.',
    proTip: 'SSDs boot Windows in 5-10 seconds and won’t get damaged if a laptop is gently moved, unlike fragile mechanical hard drives with spinning platters.',
    didYouKnow: 'Optical discs (CD, DVD, Blu-Ray) store data using microscopic pits and lands etched by laser beams representing 0s and 1s.',
  },
  {
    id: 'biti-bytes',
    emoji: '🔢',
    shortTitle: '1 Byte = 8 Bits',
    title: 'Units of Digital Information',
    tag: 'Binary Mathematics',
    bookPage: '19',
    content: 'A bit (b) is the smallest unit (0 or 1). A group of 8 bits forms a Byte (B). Multipliers are powers of 2: 1 KB = 1024 B, 1 MB = 1024 KB, 1 GB = 1024 MB, 1 TB = 1024 GB.',
    proTip: 'To render the letter "e", a computer combines 8 bits: 01100101. Two characters ("me") require 2 Bytes (16 bits)!',
    didYouKnow: '1 Terabyte (1 TB) can store over 250,000 photos or approximately 500 hours of high-definition video!',
  },
];

export const KnowledgePills: React.FC = () => {
  const { lang, t } = useLanguage();
  const [selectedPillId, setSelectedPillId] = useState<string | null>(null);

  const pills = lang === 'en' ? PILLS_EN : PILLS_RO;
  const selectedPill = pills.find(p => p.id === selectedPillId) || null;

  const handleOpenPill = (pillId: string) => {
    sounds.playClick();
    setSelectedPillId(pillId);
  };

  const handleClose = () => {
    sounds.playClick();
    setSelectedPillId(null);
  };

  return (
    <div className="bg-slate-850/90 border border-slate-700/80 rounded-2xl p-3.5 sm:p-4 mb-5 shadow-lg backdrop-blur">
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xs">
            <Lightbulb className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-black uppercase tracking-wider text-cyan-300 font-heading">
            {t.pillsBarTitle}
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
          {t.pillsBarSub}
        </span>
      </div>

      {/* Pill Buttons Horizontal Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {pills.map((pill) => {
          const isActive = selectedPill?.id === pill.id;
          return (
            <button
              key={pill.id}
              onClick={() => handleOpenPill(pill.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 border cursor-pointer ${
                isActive
                  ? 'bg-cyan-500/30 text-cyan-200 border-cyan-400 shadow-md'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-700/80 hover:border-slate-600'
              }`}
            >
              <span className="text-base">{pill.emoji}</span>
              <span>{pill.shortTitle}</span>
              <ChevronRight className="w-3 h-3 text-slate-500" />
            </button>
          );
        })}
      </div>

      {/* Pop-out Expanded Fact Modal / Card */}
      {selectedPill && (
        <div className="mt-3.5 pt-3.5 border-t border-slate-700/80 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl p-4 sm:p-5 relative shadow-xl">
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
              title={t.pillClose}
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{selectedPill.emoji}</span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/30 font-mono">
                  {selectedPill.tag}
                </span>
                <span className="text-[11px] font-semibold text-slate-400 ml-2">
                  {t.bookPagePrefix} {selectedPill.bookPage}
                </span>
              </div>
            </div>

            <h4 className="text-base sm:text-lg font-black text-white font-heading mb-2">
              {selectedPill.title}
            </h4>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-3">
              {selectedPill.content}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
              <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl flex items-start gap-2 text-amber-200">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-300 font-bold block mb-0.5">
                    {lang === 'en' ? 'Teacher Pro Tip:' : 'Sfatul Profesorului:'}
                  </strong>
                  <span>{selectedPill.proTip}</span>
                </div>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl flex items-start gap-2 text-emerald-200">
                <BookOpen className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-300 font-bold block mb-0.5">
                    {lang === 'en' ? 'Did you know? (Textbook):' : 'Știați că? (Manual):'}
                  </strong>
                  <span>{selectedPill.didYouKnow}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
