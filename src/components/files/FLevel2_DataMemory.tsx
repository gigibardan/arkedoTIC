import React, { useState } from 'react';
import {
  FileCode,
  FolderTree,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Image,
  Music,
  Video,
  Sparkles,
  HelpCircle,
  Hash,
  Compass,
  ArrowRight,
  HardDrive
} from 'lucide-react';
import { TeacherTip } from '../TeacherTip';
import { sounds } from '../../utils/audio';
import { useLanguage } from '../../context/LanguageContext';
import { AnswerExplanation } from '../common/AnswerExplanation';
import { QuestionHint } from '../common/QuestionHint';

interface FLevel2Props {
  onComplete: () => void;
}

export const FLevel2_DataMemory: React.FC<FLevel2Props> = ({ onComplete }) => {
  const { t, lang } = useLanguage();

  // Task 1: Extension Matching
  const [matchedExtensions, setMatchedExtensions] = useState<Record<string, 'text' | 'image' | 'audio' | 'video'>>({});
  
  // Task 2: Forbidden Characters Validator
  const [inspectedNames, setInspectedNames] = useState<Record<string, boolean>>({});

  // Task 3: Path Reconstitution
  const [selectedPathTokens, setSelectedPathTokens] = useState<string[]>([]);
  const targetPath = ['C:', 'Lucru', 'MUZICA', 'jazz.mp3'];

  // Task 4: True/False Quiz from Textbook (pag. 26 Ex. 2)
  const [tfAnswers, setTfAnswers] = useState<{
    fileHasFolders?: boolean;
    folderHasFiles?: boolean;
    fillBlankFile?: string;
  }>({});

  // Task 1 Logic
  const extensionsList = [
    { ext: '.txt', category: 'text', label: lang === 'en' ? 'Plain text document' : 'Document text simplu' },
    { ext: '.jpg', category: 'image', label: lang === 'en' ? 'Photograph / Image' : 'Fotografie / Imagine' },
    { ext: '.mp3', category: 'audio', label: lang === 'en' ? 'Audio file (music)' : 'Fișier audio (muzică)' },
    { ext: '.mp4', category: 'video', label: lang === 'en' ? 'Video file (movie)' : 'Fișier video (film)' },
    { ext: '.png', category: 'image', label: lang === 'en' ? 'Graphics / Transparent image' : 'Grafică / Imagine fără fundal' },
    { ext: '.wav', category: 'audio', label: lang === 'en' ? 'Sound recording' : 'Înregistrare de sunet' },
  ];

  const handleMatchExt = (ext: string, cat: 'text' | 'image' | 'audio' | 'video') => {
    sounds.playClick();
    const correctCat = extensionsList.find((e) => e.ext === ext)?.category;
    if (correctCat === cat) {
      sounds.playCorrect();
      setMatchedExtensions((prev) => ({ ...prev, [ext]: cat }));
    } else {
      sounds.playWrong();
    }
  };

  const isTask1Done =
    matchedExtensions['.txt'] === 'text' &&
    matchedExtensions['.jpg'] === 'image' &&
    matchedExtensions['.mp3'] === 'audio' &&
    matchedExtensions['.mp4'] === 'video' &&
    matchedExtensions['.png'] === 'image' &&
    matchedExtensions['.wav'] === 'audio';

  // Task 2 Names
  const filenameTestItems = [
    {
      id: '1',
      name: 'Proiect_TIC.docx',
      isValid: true,
      reason: lang === 'en' ? 'Valid! Uses only letters and the _ character.' : 'Corect! Folosește doar litere și caracterul _.'
    },
    {
      id: '2',
      name: 'Nota:10.txt',
      isValid: false,
      reason: lang === 'en' ? 'Forbidden! Contains the ":" character.' : 'Interzis! Conține caracterul „:”.'
    },
    {
      id: '3',
      name: 'Vara*2026.jpg',
      isValid: false,
      reason: lang === 'en' ? 'Forbidden! Contains the "*" character.' : 'Interzis! Conține caracterul „*”.'
    },
    {
      id: '4',
      name: 'Muzica/Rock.mp3',
      isValid: false,
      reason: lang === 'en' ? 'Forbidden! Contains the "/" character.' : 'Interzis! Conține caracterul „/”.'
    },
    {
      id: '5',
      name: 'Referat Istorie.txt',
      isValid: true,
      reason: lang === 'en' ? 'Valid! Spaces are allowed in Windows.' : 'Corect! Spațiile sunt permise în Windows.'
    },
  ];

  const handleInspectName = (id: string, userChoice: boolean) => {
    const item = filenameTestItems.find((f) => f.id === id);
    if (!item) return;

    if (item.isValid === userChoice) {
      sounds.playCorrect();
      setInspectedNames((prev) => ({ ...prev, [id]: true }));
    } else {
      sounds.playWrong();
      setInspectedNames((prev) => ({ ...prev, [id]: false }));
    }
  };

  const isTask2Done = filenameTestItems.every((item) => inspectedNames[item.id] === true);

  // Task 3: Build the Path C:\Lucru\MUZICA\jazz.mp3
  const availableTokens = ['C:', 'Lucru', 'MUZICA', 'jazz.mp3', 'FOTO', 'InParc.jpg'];

  const handleAddToken = (token: string) => {
    sounds.playClick();
    if (selectedPathTokens.includes(token)) return;
    const newTokens = [...selectedPathTokens, token];
    setSelectedPathTokens(newTokens);
    if (newTokens.length === 4 && newTokens.every((t, i) => t === targetPath[i])) {
      sounds.playCorrect();
    }
  };

  const handleResetTokens = () => {
    sounds.playClick();
    setSelectedPathTokens([]);
  };

  const isTask3Done =
    selectedPathTokens.length === 4 &&
    selectedPathTokens[0] === 'C:' &&
    selectedPathTokens[1] === 'Lucru' &&
    selectedPathTokens[2] === 'MUZICA' &&
    selectedPathTokens[3] === 'jazz.mp3';

  // Task 4: Textbook questions
  const isTask4Done =
    tfAnswers.fileHasFolders === false && // Un fisier poate contine foldere? FALS!
    tfAnswers.folderHasFiles === true && // Un folder poate contine fisiere? ADEVARAT!
    tfAnswers.fillBlankFile === 'fisiere';

  const allCompleted = isTask1Done && isTask2Done && isTask3Done && isTask4Done;

  const handleFinish = () => {
    sounds.playLevelUp();
    onComplete();
  };

  return (
    <div className="bg-slate-800 border border-slate-700/80 rounded-3xl p-5 sm:p-7 shadow-xl">
      {/* Title & Mission Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-5">
        <div>
          <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs uppercase tracking-wider border border-emerald-500/30">
            {lang === 'en' ? 'Level 2 of 7 • Data Storage & Organization' : 'Nivelul 2 din 7 • Memorarea & Organizarea Datelor'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1.5 font-heading">
            {lang === 'en' ? 'Files, Extensions & The C:\\ Path 📑' : 'Fișiere, Extensii & Calea C:\\ (Path) 📑'}
          </h2>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
            {lang === 'en'
              ? 'According to the textbook (p. 25–26), data is stored in files organized within folders (directories). Learn extension rules, forbidden characters, and assemble full file paths using the backslash (\\) character!'
              : 'Conform manualului (pag. 25–26), datele se stochează în fișiere grupate în foldere (directoare). Învață regula extensiilor, caracterele interzise și construiește calea completă către fișier folosind bara oblică inversă (\\)!'}
          </p>
        </div>
        <div className="hidden sm:flex text-4xl p-3 bg-slate-900/60 rounded-2xl border border-slate-700 text-teal-400">
          📁
        </div>
      </div>

      {/* Teacher Tip from Textbook (p. 25-26) */}
      <TeacherTip
        title={lang === 'en' ? 'File naming formula and forbidden characters rule' : 'Formula secretă a unui fișier și regula caracterelor interzise'}
        tip={lang === 'en'
          ? 'A file name has the structure: name . extension (e.g., jazz.mp3). The name can have up to 255 characters and CANNOT contain any of the 9 reserved characters: \\ / : * ? " < > | . The path starts at root (C:\\) and separates each folder with a backslash (\\)!'
          : 'Numele unui fișier are structura: nume_propriu-zis . extensie (ex: jazz.mp3). Numele poate avea maxim 255 de caractere și NU poate conține cele 9 caractere rezervate: \\ / : * ? ” < > | . Calea către un fișier pornește din rădăcină (C:\\) și separă fiecare folder prin caracterul backslash (\\)!'}
        bookPage="25–26"
        extraAdvice={lang === 'en' ? 'A folder can hold dozens of files, but a file can NEVER contain a folder!' : 'Un folder poate conține zeci de fișiere, însă un fișier NU poate conține niciodată un folder!'}
      />

      {/* 4 Interactive Modules */}
      <div className="flex flex-col gap-8 mb-6">
        
        {/* ======================================================== */}
        {/* PROVOCAREA 1: Extensii de fișiere (pag. 25) */}
        {/* ======================================================== */}
        <div className="bg-slate-900/90 border border-slate-700/90 rounded-2xl p-4 sm:p-6 shadow-xl">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black flex items-center justify-center border border-emerald-500/40">
                1
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white font-heading">
                {lang === 'en' ? 'Extensions & Data Types Inspector (p. 25)' : 'Inspectorul de Extensii & Tipuri de Date (pag. 25)'}
              </h3>
            </div>
            {isTask1Done ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" /> {lang === 'en' ? 'All extensions identified!' : 'Toate extensiile identificate!'}
              </span>
            ) : (
              <span className="text-xs text-slate-400 font-mono">
                {Object.keys(matchedExtensions).length} / 6 {lang === 'en' ? 'matched' : 'asociate'}
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-slate-300 mb-2">
            {lang === 'en'
              ? 'The extension after the dot tells the OS the file format. Match each extension to its correct category:'
              : 'Extensia din spatele punctului indică sistemului de operare tipul de date. Asociază fiecare extensie la categoria corespunzătoare din manual:'}
          </p>

          <div className="mb-4">
            <QuestionHint
              id="q-flevel2-ext"
              hintRo=".txt este text simplu, .jpg/.png sunt imagini, .mp3/.wav sunt sunete/muzică, iar .mp4 este film/video (Manual pag. 25)."
              hintEn=".txt is plain text, .jpg/.png are pictures, .mp3/.wav are audio tracks, and .mp4 is video/movie (p. 25)."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {extensionsList.map((item) => {
              const matched = matchedExtensions[item.ext];
              return (
                <div
                  key={item.ext}
                  className={`p-3.5 rounded-xl border transition ${
                    matched
                      ? 'bg-emerald-950/60 border-emerald-500/70'
                      : 'bg-slate-950/70 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-base font-black text-cyan-300">
                      {item.ext}
                    </span>
                    {matched && (
                      <span className="text-[10px] bg-emerald-500 text-white font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> {lang === 'en' ? 'Correct' : 'Corect'}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 mb-3">{item.label}</div>

                  {/* 4 category buttons */}
                  <div className="grid grid-cols-2 gap-1.5 text-[11px] font-semibold">
                    <button
                      onClick={() => handleMatchExt(item.ext, 'text')}
                      className={`py-1.5 px-2 rounded-lg border transition cursor-pointer flex items-center justify-center gap-1 ${
                        matched === 'text'
                          ? 'bg-blue-600 border-blue-400 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <FileText className="w-3 h-3 text-blue-400" /> Text
                    </button>

                    <button
                      onClick={() => handleMatchExt(item.ext, 'image')}
                      className={`py-1.5 px-2 rounded-lg border transition cursor-pointer flex items-center justify-center gap-1 ${
                        matched === 'image'
                          ? 'bg-emerald-600 border-emerald-400 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <Image className="w-3 h-3 text-emerald-400" /> {lang === 'en' ? 'Image' : 'Imagine'}
                    </button>

                    <button
                      onClick={() => handleMatchExt(item.ext, 'audio')}
                      className={`py-1.5 px-2 rounded-lg border transition cursor-pointer flex items-center justify-center gap-1 ${
                        matched === 'audio'
                          ? 'bg-purple-600 border-purple-400 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <Music className="w-3 h-3 text-purple-400" /> Audio
                    </button>

                    <button
                      onClick={() => handleMatchExt(item.ext, 'video')}
                      className={`py-1.5 px-2 rounded-lg border transition cursor-pointer flex items-center justify-center gap-1 ${
                        matched === 'video'
                          ? 'bg-rose-600 border-rose-400 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <Video className="w-3 h-3 text-rose-400" /> Video
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ======================================================== */}
        {/* PROVOCAREA 2: Nume Valide & Caractere Interzise (pag. 25) */}
        {/* ======================================================== */}
        <div className="bg-slate-900/90 border border-slate-700/90 rounded-2xl p-4 sm:p-6 shadow-xl">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs font-black flex items-center justify-center border border-amber-500/40">
                2
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white font-heading">
                {lang === 'en' ? 'File Names & Forbidden Characters Detector (p. 25)' : 'Detectorul de Nume & Caractere Interzise (pag. 25)'}
              </h3>
            </div>
            {isTask2Done ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" /> {lang === 'en' ? 'All names verified!' : 'Toate numele verificate!'}
              </span>
            ) : (
              <span className="text-xs text-slate-400 font-mono">{lang === 'en' ? 'Evaluating' : 'În evaluare'}</span>
            )}
          </div>

          <div className="bg-amber-950/30 border border-amber-500/40 rounded-xl p-3 mb-3 text-xs text-amber-200">
            <strong>{lang === 'en' ? 'Golden rule from textbook (p. 25):' : 'Reține regula de aur din manual (pag. 25):'}</strong> {lang === 'en' ? 'A file or folder name CANNOT contain any of the 9 reserved characters:' : 'Numele unui fișier sau folder NU poate conține niciunul din cele 9 caractere rezervate:'}{' '}
            <code className="bg-slate-950 px-2 py-0.5 rounded font-mono font-bold text-rose-400 text-sm">
              \ / : * ? " &lt; &gt; |
            </code>
          </div>

          <div className="mb-4">
            <QuestionHint
              id="q-flevel2-forbidden"
              hintRo="Uită-te cu atenție la semne: : (două puncte), * (steluță), / (slash), \ (backslash), ? (semnul întrebării), < > (mai mic/mare), | (bara verticală) sau ghilimele sunt strict interzise!"
              hintEn="Check carefully for reserved symbols: : * / \ ? < > | and double quotes are strictly forbidden in file and folder names!"
            />
          </div>

          <div className="space-y-2.5">
            {filenameTestItems.map((item) => {
              const isResolved = inspectedNames[item.id] === true;
              const hasFailed = inspectedNames[item.id] === false;
              return (
                <div
                  key={item.id}
                  className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition ${
                    isResolved
                      ? 'bg-slate-950/80 border-emerald-500/60'
                      : hasFailed
                      ? 'bg-rose-950/40 border-rose-500/60'
                      : 'bg-slate-950/50 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.isValid ? '📄' : '⚠️'}</span>
                    <div>
                      <span className="font-mono text-sm font-bold text-white tracking-wide">
                        {item.name}
                      </span>
                      {isResolved && (
                        <div className="text-[11px] text-emerald-400 font-sans mt-0.5">
                          ✓ {item.reason}
                        </div>
                      )}
                      {hasFailed && (
                        <div className="text-[11px] text-rose-400 font-sans mt-0.5">
                          {lang === 'en' ? '✗ Try again! Remember the forbidden characters (\\ / : * ? " < > |).' : '✗ Reîncearcă! Amintește-ți caracterele interzise (\\ / : * ? " < > |).'}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => handleInspectName(item.id, true)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer border ${
                        isResolved && item.isValid
                          ? 'bg-emerald-600 border-emerald-400 text-white'
                          : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                      }`}
                    >
                      {lang === 'en' ? '✓ Valid Name' : '✓ Nume Valid'}
                    </button>

                    <button
                      onClick={() => handleInspectName(item.id, false)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer border ${
                        isResolved && !item.isValid
                          ? 'bg-rose-600 border-rose-400 text-white'
                          : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                      }`}
                    >
                      {lang === 'en' ? '✗ Has Forbidden Chars' : '✗ Conține Caractere Interzise'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ======================================================== */}
        {/* PROVOCAREA 3: Asamblarea Căii (Path) cu Backslash \ (pag. 26) */}
        {/* ======================================================== */}
        <div className="bg-slate-900/90 border border-slate-700/90 rounded-2xl p-4 sm:p-6 shadow-xl">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-black flex items-center justify-center border border-cyan-500/40">
                3
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white font-heading">
                {lang === 'en' ? 'File Path & Backslash (\\) Separator (p. 26 Fig. 2)' : 'Calea (Path) către fișier cu separatorul Backslash (\\) (pag. 26 Fig. 2)'}
              </h3>
            </div>
            {isTask3Done ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" /> {lang === 'en' ? 'Path correctly assembled!' : 'Cale Corect Asamblată!'}
              </span>
            ) : (
              <span className="text-xs text-slate-400 font-mono">{lang === 'en' ? 'In progress' : 'În lucru'}</span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-slate-300 mb-2">
            {lang === 'en'
              ? 'The textbook (p. 26) explains: The path starts from the root (C:) and describes the route through every branch to the target file, separated by the \\ (backslash) character.'
              : 'Manualul (pag. 26) explică: Calea pornește de la rădăcină (C:) și descrie drumul prin fiecare ramificație până la fișierul dorit, separată de caracterul \\ (bară oblică inversă).'}
          </p>

          <div className="mb-4">
            <QuestionHint
              id="q-flevel2-path"
              hintRo="Începe cu unitatea de stocare rădăcină (C:), apoi dosarul principal (Lucru), subfolderul (MUZICA) și în final fișierul căutat (jazz.mp3)."
              hintEn="Start from root drive (C:), then main directory (Lucru), subfolder (MUZICA), and finally target file (jazz.mp3)."
            />
          </div>

          {/* Path Simulator Output Box */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
                <span>{lang === 'en' ? 'Your assembled path:' : 'Calea asamblată de tine:'}</span>
              </div>
              {selectedPathTokens.length > 0 && (
                <button
                  onClick={handleResetTokens}
                  className="text-xs text-rose-400 hover:text-rose-300 underline cursor-pointer"
                >
                  {lang === 'en' ? 'Reset Path' : 'Resetează Calea'}
                </button>
              )}
            </div>

            <div className="bg-slate-900 px-3.5 py-3 rounded-lg border border-slate-700/80 font-mono text-sm sm:text-base flex flex-wrap items-center gap-1 text-emerald-400 min-h-[46px]">
              {selectedPathTokens.length === 0 ? (
                <span className="text-slate-500 text-xs font-sans">
                  {lang === 'en'
                    ? 'Click the segments below in the correct order to recreate: C:\\Lucru\\MUZICA\\jazz.mp3'
                    : 'Apasă pe segmentele de mai jos în ordinea corectă pentru a recrea: C:\\Lucru\\MUZICA\\jazz.mp3'}
                </span>
              ) : (
                selectedPathTokens.map((token, index) => (
                  <React.Fragment key={index}>
                    <span className="font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                      {token}
                    </span>
                    {index < selectedPathTokens.length - 1 && (
                      <span className="text-rose-400 font-black text-lg">\</span>
                    )}
                  </React.Fragment>
                ))
              )}
            </div>

            {isTask3Done && (
              <div className="mt-3 p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/50 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  {lang === 'en' ? 'Excellent! You successfully built the path: ' : 'Excelent! Ai recreat fidel calea din manual: '}
                  <strong className="font-mono text-emerald-200">C:\Lucru\MUZICA\jazz.mp3</strong>
                </span>
              </div>
            )}
          </div>

          {/* Tokens to click */}
          <div className="text-xs text-slate-400 mb-2 font-medium">
            {lang === 'en' ? 'Choose components in root-to-file order:' : 'Alege componentele în ordinea de la rădăcină spre fișier:'}
          </div>
          <div className="flex flex-wrap gap-2">
            {availableTokens.map((tok) => {
              const isUsed = selectedPathTokens.includes(tok);
              return (
                <button
                  key={tok}
                  disabled={isUsed}
                  onClick={() => handleAddToken(tok)}
                  className={`px-3 py-2 rounded-xl text-xs font-mono font-bold border transition cursor-pointer ${
                    isUsed
                      ? 'bg-slate-950/40 border-slate-800 text-slate-600 cursor-not-allowed'
                      : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-cyan-300 hover:scale-105 active:scale-95'
                  }`}
                >
                  ➕ {tok}
                </button>
              );
            })}
          </div>
        </div>

        {/* ======================================================== */}
        {/* PROVOCAREA 4: Testul Fulger Adevărat / Fals (pag. 26) */}
        {/* ======================================================== */}
        <div className="bg-slate-900/90 border border-slate-700/90 rounded-2xl p-4 sm:p-6 shadow-xl">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 text-xs font-black flex items-center justify-center border border-purple-500/40">
                4
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white font-heading">
                {lang === 'en' ? 'Quick True or False Quiz (Textbook p. 26 Exercises 2 & 3)' : 'Testul Fulger Adevărat sau Fals (Manual pag. 26 Exercițiul 2 & 3)'}
              </h3>
            </div>
            {isTask4Done ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" /> {lang === 'en' ? 'Successfully passed!' : 'Validat cu succes!'}
              </span>
            ) : (
              <span className="text-xs text-slate-400 font-mono">3 {lang === 'en' ? 'questions' : 'întrebări'}</span>
            )}
          </div>

          <div className="space-y-3">
            {/* Q1 */}
            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 flex flex-col gap-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs text-slate-300">
                  <strong className="text-white">a)</strong> {lang === 'en' ? 'Can a single file contain multiple folders?' : 'Un fișier poate conține mai multe foldere?'}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      sounds.playWrong();
                      setTfAnswers((prev) => ({ ...prev, fileHasFolders: true }));
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                      tfAnswers.fileHasFolders === true
                        ? 'bg-rose-600 border-rose-400 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {lang === 'en' ? 'True' : 'Adevărat'}
                  </button>
                  <button
                    onClick={() => {
                      sounds.playCorrect();
                      setTfAnswers((prev) => ({ ...prev, fileHasFolders: false }));
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                      tfAnswers.fileHasFolders === false
                        ? 'bg-emerald-600 border-emerald-400 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {lang === 'en' ? 'False' : 'Fals'}
                  </button>
                </div>
              </div>
              {tfAnswers.fileHasFolders !== undefined && (
                <AnswerExplanation
                  isCorrect={tfAnswers.fileHasFolders === false}
                  explanationRo={
                    tfAnswers.fileHasFolders === false
                      ? 'Corect! Un fișier reprezintă o colecție de date și NU poate conține foldere (Manual pag. 25).'
                      : 'Incorect! Doar folderele (directoarele) pot conține alte foldere sau fișiere, niciodată invers!'
                  }
                  explanationEn={
                    tfAnswers.fileHasFolders === false
                      ? 'Correct! A file stores data and can never contain directories.'
                      : 'Incorrect! Only folders can contain other folders or files, never the other way around.'
                  }
                />
              )}
            </div>

            {/* Q2 */}
            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 flex flex-col gap-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs text-slate-300">
                  <strong className="text-white">b)</strong> {lang === 'en' ? 'Can a folder contain multiple files?' : 'Un folder poate conține mai multe fișiere?'}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      sounds.playCorrect();
                      setTfAnswers((prev) => ({ ...prev, folderHasFiles: true }));
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                      tfAnswers.folderHasFiles === true
                        ? 'bg-emerald-600 border-emerald-400 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {lang === 'en' ? 'True' : 'Adevărat'}
                  </button>
                  <button
                    onClick={() => {
                      sounds.playWrong();
                      setTfAnswers((prev) => ({ ...prev, folderHasFiles: false }));
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                      tfAnswers.folderHasFiles === false
                        ? 'bg-rose-600 border-rose-400 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {lang === 'en' ? 'False' : 'Fals'}
                  </button>
                </div>
              </div>
              {tfAnswers.folderHasFiles !== undefined && (
                <AnswerExplanation
                  isCorrect={tfAnswers.folderHasFiles === true}
                  explanationRo={
                    tfAnswers.folderHasFiles === true
                      ? 'Corect! Un folder (director) este un container organizatoric destinat să grupeze fișiere și subfoldere.'
                      : 'Incorect! Rolul principal al folderelor este tocmai de a adăposti și organiza fișierele.'
                  }
                  explanationEn={
                    tfAnswers.folderHasFiles === true
                      ? 'Correct! Folders are containers designed to group files and subfolders together.'
                      : 'Incorrect! The primary purpose of folders is to hold and organize files.'
                  }
                />
              )}
            </div>

            {/* Q3 Fill blank */}
            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 flex flex-col gap-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs text-slate-300">
                  <strong className="text-white">c)</strong> {lang === 'en' ? 'Electronic data is stored inside:' : 'Datele sunt memorate în format electronic în:'}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      sounds.playCorrect();
                      setTfAnswers((prev) => ({ ...prev, fillBlankFile: 'fisiere' }));
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                      tfAnswers.fillBlankFile === 'fisiere'
                        ? 'bg-emerald-600 border-emerald-400 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    📄 {lang === 'en' ? 'Files' : 'Fișiere'}
                  </button>
                  <button
                    onClick={() => {
                      sounds.playWrong();
                      setTfAnswers((prev) => ({ ...prev, fillBlankFile: 'cabluri' }));
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                      tfAnswers.fillBlankFile === 'cabluri'
                        ? 'bg-rose-600 border-rose-400 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    🔌 {lang === 'en' ? 'Cables' : 'Cabluri'}
                  </button>
                </div>
              </div>
              {tfAnswers.fillBlankFile !== undefined && (
                <AnswerExplanation
                  isCorrect={tfAnswers.fillBlankFile === 'fisiere'}
                  explanationRo={
                    tfAnswers.fillBlankFile === 'fisiere'
                      ? 'Excelent! În mediul digital, datele (text, muzică, video, imagini) sunt stocate exclusiv în fișiere (Manual pag. 25).'
                      : 'Incorect! Cablurile doar transmit semnale electrice, datele fiind memorate în fișiere.'
                  }
                  explanationEn={
                    tfAnswers.fillBlankFile === 'fisiere'
                      ? 'Spot on! In computing, data (text, music, video, photos) is recorded inside files.'
                      : 'Incorrect! Cables only transmit electrical signals, while files store data.'
                  }
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Completion & Next Level Button */}
      <div className="pt-4 border-t border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-400">
          {allCompleted ? (
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> {lang === 'en' ? 'All 4 challenges completed! (+15 pts)' : 'Toate cele 4 provocări sunt rezolvate! (+15 pct)'}
            </span>
          ) : (
            <span>{lang === 'en' ? 'Complete the requirements in the 4 challenges above to continue.' : 'Completează cerințele din cele 4 provocări de mai sus pentru a continua spre crearea arborelui de foldere.'}</span>
          )}
        </div>

        <button
          onClick={handleFinish}
          disabled={!allCompleted}
          className={`w-full sm:w-auto px-6 py-3 rounded-xl font-black text-sm transition flex items-center justify-center gap-2 shadow-xl cursor-pointer ${
            allCompleted
              ? 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-emerald-500/20 active:scale-95'
              : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
          }`}
        >
          <span>{lang === 'en' ? 'Proceed to Level 3: Building the Secret Tree ▶' : 'Treci la Nivelul 3: Construirea Arborelui Secret ▶'}</span>
        </button>
      </div>
    </div>
  );
};

