import React, { useState } from 'react';
import { Network, Globe, Send, CheckCircle2, XCircle, Sparkles, BookOpen, Layers } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { QuestionHint } from './QuestionHint';
import { AnswerExplanation } from './AnswerExplanation';
import { PageNavigationFooter } from './PageNavigationFooter';
import { sounds } from '../../utils/audio';

interface ILevel1Props {
  onCompletePage: (earnedScore: number) => void;
}

export const ILevel1_NetworkBasics: React.FC<ILevel1Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Packet simulation state
  const [packetStep, setPacketStep] = useState<number>(0);
  const [isSending, setIsSending] = useState<boolean>(false);

  // Exercise 1: Definition of Network (pag. 32-33)
  // Correct answer: 'interconnected'
  const [q1Answer, setQ1Answer] = useState<string | null>(null);

  // Exercise 2: What is Internet?
  // Correct answer: 'global_computers'
  const [q2Answer, setQ2Answer] = useState<string | null>(null);

  // Exercise 3: Timeline & Protocol
  // Match ARPANet -> 1969, Ray Tomlinson -> 1971, Protocol -> TCP/IP
  const [q3Protocol, setQ3Protocol] = useState<string>('');
  const [q3ArpanetYear, setQ3ArpanetYear] = useState<string>('');
  const [q3EmailCreator, setQ3EmailCreator] = useState<string>('');

  const isQ1Correct = q1Answer === 'interconnected';
  const isQ2Correct = q2Answer === 'global_computers';
  const isQ3A_Correct = q3Protocol.trim().toUpperCase().includes('TCP/IP') || q3Protocol.trim().toUpperCase() === 'TCPIP';
  const isQ3B_Correct = q3ArpanetYear === '1969';
  const isQ3C_Correct = q3EmailCreator === 'ray_tomlinson';

  // Calculate score and accuracy
  const totalQuestions = 5;
  const correctCount =
    (isQ1Correct ? 1 : 0) +
    (isQ2Correct ? 1 : 0) +
    (isQ3A_Correct ? 1 : 0) +
    (isQ3B_Correct ? 1 : 0) +
    (isQ3C_Correct ? 1 : 0);

  // Page total is 15 points
  const pointsPerQuestion = 3;
  const pageScore = correctCount * pointsPerQuestion;

  const handleSimulatePacket = () => {
    if (isSending) return;
    setIsSending(true);
    setPacketStep(1);
    sounds.playClick();
    setTimeout(() => {
      setPacketStep(2);
      sounds.playClick();
      setTimeout(() => {
        setPacketStep(3);
        sounds.playCorrect();
        setIsSending(false);
      }, 900);
    }, 900);
  };

  const handleSelectQ1 = (val: string) => {
    setQ1Answer(val);
    if (val === 'interconnected') sounds.playCorrect();
    else sounds.playWrong();
  };

  const handleSelectQ2 = (val: string) => {
    setQ2Answer(val);
    if (val === 'global_computers') sounds.playCorrect();
    else sounds.playWrong();
  };

  const handleProceed = () => {
    if (correctCount >= 3) sounds.playVictory();
    else sounds.playClick();
    onCompletePage(pageScore);
  };

  const handleReset = () => {
    setQ1Answer(null);
    setQ2Answer(null);
    setQ3Protocol('');
    setQ3ArpanetYear('');
    setQ3EmailCreator('');
    setPacketStep(0);
    sounds.playClick();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Info */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950/40 to-slate-900 border border-teal-500/30 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-teal-400 uppercase tracking-wider mb-2">
          <Globe className="w-4 h-4" />
          <span>{lang === 'en' ? 'Module 3A • Page 1 / 6 (Textbook pp. 32–33)' : 'Modulul 3A • Pagina 1 / 6 (Manual pag. 32–33)'}</span>
        </div>
        <h2 className="text-xl sm:text-3xl font-black text-white font-heading">
          {lang === 'en' ? '1. Computer Networks & The Global Internet' : '1. Rețele de calculatoare & Rețeaua Globală Internet'}
        </h2>
        <p className="text-slate-300 text-sm mt-1">
          {lang === 'en'
            ? 'Discover how computers communicate across the world, what TCP/IP means, and the origins of ARPANet and email!'
            : 'Descoperă cum comunică calculatoarele din întreaga lume, ce înseamnă protocolul TCP/IP și cum a început istoria ARPANet și a emailului!'}
        </p>
      </div>

      {/* Structured Knowledge / Theory Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Ce este o rețea & Internetul */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-teal-400 font-bold text-sm mb-3">
              <Network className="w-4 h-4" />
              <span>{lang === 'en' ? 'Core Concepts (Remember!)' : 'Concepte Esențiale (Rețineți!)'}</span>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed list-disc list-inside">
              <li>
                <strong className="text-white">
                  {lang === 'en' ? 'Computer Network:' : 'Rețea de calculatoare:'}
                </strong>{' '}
                {lang === 'en'
                  ? 'A group of interconnected computers sharing hardware and software resources among users.'
                  : 'Un grup de calculatoare interconectate pentru a folosi în comun resursele lor de către mai mulți utilizatori.'}
              </li>
              <li>
                <strong className="text-white">
                  {lang === 'en' ? 'The Internet:' : 'Internetul:'}
                </strong>{' '}
                {lang === 'en'
                  ? 'A global "network of networks" interconnected through the TCP/IP communication standard.'
                  : 'O rețea globală compusă din alte rețele interconectate printr-un standard numit TCP/IP (Transmission Control Protocol / Internet Protocol).'}
              </li>
              <li>
                <strong className="text-white">
                  {lang === 'en' ? 'Main Purpose:' : 'Scopul Principal:'}
                </strong>{' '}
                {lang === 'en'
                  ? 'Building a worldwide community focused on instant communication and knowledge sharing.'
                  : 'Clădirea unei comunități globale centrate pe comunicare rapidă și schimb liber de informații.'}
              </li>
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-700/60 text-[11px] font-mono text-teal-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'TCP/IP = The universal language of the Internet' : 'TCP/IP = Limba comună vorbită de calculatoare'}</span>
          </div>
        </div>

        {/* Card 2: Știați că? (Istoria ARPANet & Ray Tomlinson) */}
        <div className="bg-gradient-to-br from-slate-800/90 to-teal-950/30 border border-teal-500/30 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-3">
              <BookOpen className="w-4 h-4" />
              <span>{lang === 'en' ? 'Did You Know? (Textbook Trivia)' : 'Știați că? (Din Manual)'}</span>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">📅 1969:</span>
                <span>
                  {lang === 'en'
                    ? 'The world’s first computer network, ARPANET, was created by the US Advanced Research Projects Agency.'
                    : 'A apărut prima rețea de calculatoare din lume, ARPANET, creată de agenția americană ARPA.'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">🛡️ 1970:</span>
                <span>
                  {lang === 'en'
                    ? 'The foundations of the modern secure internet were established, proving high resilience.'
                    : 'S-au pus bazele internetului sigur, capabil să funcționeze chiar dacă unele noduri cad.'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">✉️ 1971:</span>
                <span>
                  {lang === 'en'
                    ? 'Ray Tomlinson sent the very first electronic mail (Email) and introduced the "@" symbol!'
                    : 'Programatorul Ray Tomlinson a trimis primul e-mail din istorie și a ales simbolul @!'}
                </span>
              </li>
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-700/60 text-[11px] font-mono text-amber-300">
            💡 {lang === 'en' ? 'Internet = A giant global computer accessible from home!' : 'Internet = Un computer uriaș accesat de acasă!'}
          </div>
        </div>
      </div>

      {/* Interactive Network Packet Simulator */}
      <div className="bg-slate-900 border-2 border-teal-500/40 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-teal-400" />
            <h3 className="text-sm sm:text-base font-bold text-white">
              {lang === 'en' ? 'Interactive Lab: How TCP/IP Packets Travel' : 'Laborator Interactiv: Cum călătoresc pachetele TCP/IP'}
            </h3>
          </div>
          <button
            type="button"
            onClick={handleSimulatePacket}
            disabled={isSending}
            className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSending ? (lang === 'en' ? 'Routing...' : 'Se transmite...') : (lang === 'en' ? 'Send Data Packet 🚀' : 'Trimite Pachet de Date 🚀')}</span>
          </button>
        </div>

        {/* Visual pipeline */}
        <div className="grid grid-cols-3 gap-3 my-4 text-center">
          <div className={`p-3 rounded-xl border transition-all ${packetStep >= 1 ? 'bg-teal-500/20 border-teal-400 text-teal-200' : 'bg-slate-800/80 border-slate-700 text-slate-400'}`}>
            <div className="text-2xl mb-1">💻</div>
            <div className="text-xs font-bold font-mono">1. PC Expeditor</div>
            <div className="text-[10px] text-slate-400">{lang === 'en' ? 'Splits data into TCP packets' : 'Împarte datele în pachete'}</div>
          </div>
          <div className={`p-3 rounded-xl border transition-all ${packetStep >= 2 ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 animate-pulse' : 'bg-slate-800/80 border-slate-700 text-slate-400'}`}>
            <div className="text-2xl mb-1">🌐 🛰️</div>
            <div className="text-xs font-bold font-mono">2. Rețeaua Internet (IP)</div>
            <div className="text-[10px] text-slate-400">{lang === 'en' ? 'Routed through servers & cables' : 'Rutare prin servere & noduri'}</div>
          </div>
          <div className={`p-3 rounded-xl border transition-all ${packetStep >= 3 ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200' : 'bg-slate-800/80 border-slate-700 text-slate-400'}`}>
            <div className="text-2xl mb-1">🖥️ ✅</div>
            <div className="text-xs font-bold font-mono">3. PC Destinatar</div>
            <div className="text-[10px] text-slate-400">{lang === 'en' ? 'Reassembles the message' : 'Reasamblează mesajul complet'}</div>
          </div>
        </div>
      </div>

      {/* Practical Questions & Tasks */}
      <div className="space-y-6">
        <h3 className="text-base sm:text-lg font-black text-white font-heading flex items-center gap-2">
          <span>✍️ {lang === 'en' ? 'Practice Questions (Manual Ex. 1, p. 33)' : 'Exerciții Practice (Manual Ex. 1, pag. 33)'}</span>
        </h3>

        {/* Task 1: Calculatoarele într-o rețea sunt... */}
        <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 shadow-md">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-bold text-white mb-2">
              <span className="text-teal-400 font-mono mr-1.5">A.</span>
              {lang === 'en' ? 'In a computer network, computers are:' : 'Într-o rețea, calculatoarele sunt:'}
            </p>
            {q1Answer && (
              <span>
                {isQ1Correct ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-400" />
                )}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-2">
            {[
              { id: 'side_by_side', labelRo: 'a) Așezate unul lângă celălalt', labelEn: 'a) Placed next to each other' },
              { id: 'interconnected', labelRo: 'b) Interconectate', labelEn: 'b) Interconnected' },
              { id: 'disconnected', labelRo: 'c) Deconectate', labelEn: 'c) Disconnected' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectQ1(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-semibold transition cursor-pointer ${
                  q1Answer === opt.id
                    ? opt.id === 'interconnected'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-rose-500/20 border-rose-500 text-rose-300'
                    : 'bg-slate-900/60 hover:bg-slate-900 border-slate-700 text-slate-300'
                }`}
              >
                {lang === 'en' ? opt.labelEn : opt.labelRo}
              </button>
            ))}
          </div>

          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              explanationRo={
                isQ1Correct
                  ? 'Excelent! Calculatoarele sunt interconectate prin cabluri sau unde radio pentru a partaja date și imprimante.'
                  : q1Answer === 'side_by_side'
                  ? 'Calculatoarele pot sta aproape unul de altul, dar fără conexiune fizică sau wireless nu pot comunica.'
                  : 'Calculatoarele deconectate funcționează complet izolat și nu formează o rețea.'
              }
              explanationEn={
                isQ1Correct
                  ? 'Excellent! Computers must be interconnected via cables or wireless signals to share data and printers.'
                  : q1Answer === 'side_by_side'
                  ? 'Computers placed side-by-side without a data connection cannot communicate or share resources.'
                  : 'Disconnected computers work completely in isolation and do not form a network.'
              }
            />
          )}

          <QuestionHint
            id="i1-q1-interconnected"
            hintRo="Gândește-te la definiția din caseta «Rețineți» de la pagina 32: calculatoarele trebuie să fie legate între ele pentru a partaja resurse (interconectate)."
            hintEn="Check the definition: computers must be linked together to share data and printers (interconnected)."
          />
        </div>

        {/* Task 2: Internetul este o rețea la nivel global de... */}
        <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 shadow-md">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-bold text-white mb-2">
              <span className="text-teal-400 font-mono mr-1.5">B.</span>
              {lang === 'en' ? 'The Internet is a global network of:' : 'Internetul este o rețea la nivel global de:'}
            </p>
            {q2Answer && (
              <span>
                {isQ2Correct ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-400" />
                )}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-2">
            {[
              { id: 'global_computers', labelRo: 'a) Calculatoare', labelEn: 'a) Computers' },
              { id: 'telephony', labelRo: 'b) Telefonie fixă simplă', labelEn: 'b) Simple Telephony' },
              { id: 'radio_tv', labelRo: 'c) Doar canale radio și TV', labelEn: 'c) Radio & TV channels only' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectQ2(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-semibold transition cursor-pointer ${
                  q2Answer === opt.id
                    ? opt.id === 'global_computers'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-rose-500/20 border-rose-500 text-rose-300'
                    : 'bg-slate-900/60 hover:bg-slate-900 border-slate-700 text-slate-300'
                }`}
              >
                {lang === 'en' ? opt.labelEn : opt.labelRo}
              </button>
            ))}
          </div>

          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              explanationRo={
                isQ2Correct
                  ? 'Exact! Internetul este o „rețea a rețelelor” internațională ce interconectează miliarde de calculatoare și dispozitive.'
                  : q2Answer === 'telephony'
                  ? 'Telefonia fixă clasică transmitea doar sunet analogic, pe când Internetul transferă date digitale de orice tip.'
                  : 'Canalele TV/radio emit unidirecțional către public, în timp ce Internetul permite comunicare bidirecțională și interactivă.'
              }
              explanationEn={
                isQ2Correct
                  ? 'Exactly! The Internet is an international "network of networks" interconnecting billions of computers and smart devices.'
                  : q2Answer === 'telephony'
                  ? 'Classic fixed telephony only transferred analog voice, whereas the Internet sends versatile digital data packets.'
                  : 'TV/Radio channels broadcast unidirectionally, while the Internet enables two-way interactive data exchange.'
              }
            />
          )}

          <QuestionHint
            id="i1-q2-globalnet"
            hintRo="Internetul leagă miliarde de computere, telefoane inteligente și servere din întreaga lume într-o rețea globală de calculatoare."
            hintEn="The Internet connects billions of computing devices and servers into a worldwide network."
          />
        </div>

        {/* Task 3: Asociere Noțiuni & Istorie */}
        <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 shadow-md">
          <p className="text-sm font-bold text-white mb-3">
            <span className="text-teal-400 font-mono mr-1.5">C.</span>
            {lang === 'en' ? 'Complete the Digital History Records:' : 'Completează datele din Dosarul Istoric al Internetului:'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Protocol Standard */}
            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {lang === 'en' ? '1. Standard Protocol Name:' : '1. Standard de comunicare:'}
              </label>
              <input
                type="text"
                value={q3Protocol}
                onChange={(e) => setQ3Protocol(e.target.value)}
                placeholder={lang === 'en' ? 'e.g., TCP/IP' : 'ex: TCP/IP'}
                className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500/40 uppercase font-mono"
              />
              <div className="mt-1.5 text-[11px]">
                {q3Protocol && (
                  <span className={isQ3A_Correct ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                    {isQ3A_Correct ? (lang === 'en' ? '✓ Correct (TCP/IP)' : '✓ Corect (TCP/IP)') : (lang === 'en' ? 'Check protocol acronym' : 'Verifică acronimul (2 litere / 2 litere)')}
                  </span>
                )}
              </div>
            </div>

            {/* Anul ARPANET */}
            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between space-y-2">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {lang === 'en' ? '2. ARPANet First Launch Year:' : '2. Anul apariției ARPANet:'}
                </label>
                <select
                  value={q3ArpanetYear}
                  onChange={(e) => setQ3ArpanetYear(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500/40 font-mono"
                >
                  <option value="">{lang === 'en' ? '-- Select Year --' : '-- Alege Anul --'}</option>
                  <option value="1950">1950</option>
                  <option value="1969">1969</option>
                  <option value="1989">1989</option>
                  <option value="2005">2005</option>
                </select>
              </div>
              {q3ArpanetYear && (
                <AnswerExplanation
                  isCorrect={isQ3B_Correct}
                  explanationRo={
                    isQ3B_Correct
                      ? 'Corect! În 1969 agenția ARPA a unit primele 4 calculatoare universitare în rețeaua ARPANet.'
                      : q3ArpanetYear === '1989'
                      ? 'În 1989 Tim Berners-Lee a propus serviciul World Wide Web (WWW), la 20 de ani după prima rețea ARPANet (1969).'
                      : q3ArpanetYear === '1950'
                      ? 'În 1950 calculatoarele electronice funcționau complet izolat, primele conexiuni de rețea apărând abia în 1969.'
                      : 'Anul 2005 aparține epocii platformelor moderne (YouTube), la zeci de ani după debutul ARPANet din 1969.'
                  }
                  explanationEn={
                    isQ3B_Correct
                      ? 'Correct! In 1969 ARPA connected the first 4 university computers under the ARPANet network.'
                      : q3ArpanetYear === '1989'
                      ? 'In 1989 Tim Berners-Lee proposed the World Wide Web (WWW), 20 years after ARPANet was born (1969).'
                      : q3ArpanetYear === '1950'
                      ? 'In 1950 mainframes operated in isolation; early network links did not arrive until 1969.'
                      : 'The year 2005 belongs to modern video sharing (YouTube), decades after ARPANet in 1969.'
                  }
                />
              )}
            </div>

            {/* Creatorul Emailului */}
            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between space-y-2">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {lang === 'en' ? '3. First Email Sent By (1971):' : '3. Primul email trimis de (1971):'}
                </label>
                <select
                  value={q3EmailCreator}
                  onChange={(e) => setQ3EmailCreator(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                >
                  <option value="">{lang === 'en' ? '-- Select Person --' : '-- Alege Numele --'}</option>
                  <option value="ray_tomlinson">Ray Tomlinson</option>
                  <option value="tim_berners_lee">Tim Berners-Lee</option>
                  <option value="blaise_pascal">Blaise Pascal</option>
                </select>
              </div>
              {q3EmailCreator && (
                <AnswerExplanation
                  isCorrect={isQ3C_Correct}
                  explanationRo={
                    isQ3C_Correct
                      ? 'Corect! Ray Tomlinson a trimis primul mesaj de email în 1971 și a ales simbolul «@» pentru adrese.'
                      : q3EmailCreator === 'tim_berners_lee'
                      ? 'Tim Berners-Lee a inventat serviciul World Wide Web (WWW) în 1989, nu primul email (Ray Tomlinson, 1971).'
                      : 'Blaise Pascal a fost un savant din secolul XVII care a construit primul calculator mecanic (Pascalina).'
                  }
                  explanationEn={
                    isQ3C_Correct
                      ? 'Correct! Ray Tomlinson sent the first email in 1971 and introduced the "@" symbol.'
                      : q3EmailCreator === 'tim_berners_lee'
                      ? 'Tim Berners-Lee invented the World Wide Web (WWW) in 1989, while Ray Tomlinson sent the first email in 1971.'
                      : 'Blaise Pascal was a 17th-century mathematician who built the mechanical Pascaline calculator.'
                  }
                />
              )}
            </div>
          </div>

          {(Boolean(q3Protocol) || Boolean(q3ArpanetYear) || Boolean(q3EmailCreator)) && (
            <AnswerExplanation
              isCorrect={isQ3A_Correct && isQ3B_Correct && isQ3C_Correct}
              explanationRo={
                isQ3A_Correct && isQ3B_Correct && isQ3C_Correct
                  ? 'Formidabil! Ai completat toate cele 3 date istorice: protocolul TCP/IP, anul 1969 (ARPANet) și Ray Tomlinson (inventatorul emailului și al simbolului @).'
                  : 'Continuă să ajustezi: standardul universal este TCP/IP, prima rețea strămoș ARPANet s-a conectat în 1969, iar primul email a fost trimis de Ray Tomlinson în 1971.'
              }
              explanationEn={
                isQ3A_Correct && isQ3B_Correct && isQ3C_Correct
                  ? 'Outstanding! All 3 history milestones are correct: TCP/IP protocol, 1969 ARPANet launch, and Ray Tomlinson for the first email and @ sign.'
                  : 'Keep tuning: the standard protocol is TCP/IP, the ARPANet network launched in 1969, and Ray Tomlinson sent the first email in 1971.'
              }
            />
          )}

          <QuestionHint
            id="i1-q3-milestones"
            hintRo="Protocolul oficial conține Transmission Control Protocol & Internet Protocol (TCP/IP). ARPANet a apărut în 1969, iar emailul a fost creat în 1971 de Ray Tomlinson."
            hintEn="Look at the 'Did you know?' box: standard is TCP/IP, year is 1969, and email author is Ray Tomlinson."
          />
        </div>
      </div>

      {/* Flexible Page Footer with Live Score */}
      <PageNavigationFooter
        score={pageScore}
        totalPoints={15}
        correctCount={correctCount}
        totalQuestions={totalQuestions}
        canProceed={q1Answer !== null || q2Answer !== null || Boolean(q3Protocol || q3ArpanetYear || q3EmailCreator)}
        onProceed={handleProceed}
        onRetry={handleReset}
      />
    </div>
  );
};
