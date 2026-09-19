import React, { useState } from 'react';
import { Mail, Globe, FolderSync, Terminal, MessageSquare, CheckCircle2, Sparkles, Server } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { QuestionHint } from './QuestionHint';
import { AnswerExplanation } from './AnswerExplanation';
import { PageNavigationFooter } from './PageNavigationFooter';
import { sounds } from '../../utils/audio';

interface ILevel2Props {
  onCompletePage: (earnedScore: number) => void;
}

interface ServiceItem {
  id: string;
  name: string;
  acronym: string;
  icon: React.ReactNode;
  descRo: string;
  descEn: string;
  exampleRo: string;
  exampleEn: string;
}

export const ILevel2_InternetServices: React.FC<ILevel2Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  const services: ServiceItem[] = [
    {
      id: 'email',
      name: 'Email (Poșta Electronică)',
      acronym: 'Email',
      icon: <Mail className="w-5 h-5 text-amber-400" />,
      descRo: 'Schimb de mesaje electronice rapide între utilizatori din întreaga lume la costuri mici.',
      descEn: 'Exchange of fast electronic messages between people worldwide at minimal cost.',
      exampleRo: 'ex: Trimiterea temei la informatică pe adresa profesorului.',
      exampleEn: 'e.g., Sending homework to the teacher email address.',
    },
    {
      id: 'www',
      name: 'WWW (World Wide Web)',
      acronym: 'WWW',
      icon: <Globe className="w-5 h-5 text-teal-400" />,
      descRo: 'Sistemul de documente și pagini legate prin hiperlinkuri ce permite accesul la cantități uriașe de informații.',
      descEn: 'System of hyperlinked documents and pages allowing access to vast libraries of info.',
      exampleRo: 'ex: Vizitarea site-ului muzeului sau al enciclopediei Wikipedia.',
      exampleEn: 'e.g., Browsing a museum website or Wikipedia encyclopedia.',
    },
    {
      id: 'ftp',
      name: 'FTP (File Transfer Protocol)',
      acronym: 'FTP',
      icon: <FolderSync className="w-5 h-5 text-cyan-400" />,
      descRo: 'Protocolul dedicat transferului securizat și rapid de fișiere mari între calculatoare conectate la internet.',
      descEn: 'Protocol dedicated to transferring large files between connected computers.',
      exampleRo: 'ex: Descărcarea sau încărcarea pachetelor de fișiere pe un server.',
      exampleEn: 'e.g., Uploading or downloading large file packages to a remote server.',
    },
    {
      id: 'telnet',
      name: 'Telnet (Conectare la Distanță)',
      acronym: 'Telnet',
      icon: <Terminal className="w-5 h-5 text-purple-400" />,
      descRo: 'Serviciu de conectare și control de la distanță a unui alt calculator prin rețea.',
      descEn: 'Remote login service to access and control another computer over network.',
      exampleRo: 'ex: Un administrator configurează un server aflat într-un alt oraș.',
      exampleEn: 'e.g., A technician configuring a school server located in another room.',
    },
    {
      id: 'irc',
      name: 'IRC (Internet Relay Chat)',
      acronym: 'IRC',
      icon: <MessageSquare className="w-5 h-5 text-emerald-400" />,
      descRo: 'Comunicare instantanee între utilizatori prin transmiterea de mesaje text în timp real.',
      descEn: 'Instant real-time chat communication between users across the globe.',
      exampleRo: 'ex: Camere de discuții și mesagerie instantanee în direct.',
      exampleEn: 'e.g., Live chat rooms and real-time messaging apps.',
    },
  ];

  // Interactive Matching state for 5 services
  // User selects which service matches which real-life scenario
  const [selectedMatches, setSelectedMatches] = useState<Record<string, string>>({
    scenario1: '', // FTP -> 'ftp' (Transfer fișiere mari)
    scenario2: '', // WWW -> 'www' (Navigare pagini web interconectate)
    scenario3: '', // Email -> 'email' (Mesaj electronic cu atașament)
    scenario4: '', // Telnet -> 'telnet' (Control calculator la distanță)
    scenario5: '', // IRC -> 'irc' (Chat mesagerie în timp real)
  });

  const isM1Correct = selectedMatches.scenario1 === 'ftp';
  const isM2Correct = selectedMatches.scenario2 === 'www';
  const isM3Correct = selectedMatches.scenario3 === 'email';
  const isM4Correct = selectedMatches.scenario4 === 'telnet';
  const isM5Correct = selectedMatches.scenario5 === 'irc';

  const totalQuestions = 5;
  const correctCount =
    (isM1Correct ? 1 : 0) +
    (isM2Correct ? 1 : 0) +
    (isM3Correct ? 1 : 0) +
    (isM4Correct ? 1 : 0) +
    (isM5Correct ? 1 : 0);

  const pageScore = correctCount * 3; // 15 points total

  const handleMatchChange = (scenarioKey: string, val: string) => {
    setSelectedMatches((prev) => ({ ...prev, [scenarioKey]: val }));
    sounds.playClick();
  };

  const handleProceed = () => {
    if (correctCount >= 3) sounds.playVictory();
    else sounds.playClick();
    onCompletePage(pageScore);
  };

  const handleReset = () => {
    setSelectedMatches({
      scenario1: '',
      scenario2: '',
      scenario3: '',
      scenario4: '',
      scenario5: '',
    });
    sounds.playClick();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/30 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-2">
          <Server className="w-4 h-4" />
          <span>{lang === 'en' ? 'Module 3A • Page 2 / 6 (Textbook p. 32)' : 'Modulul 3A • Pagina 2 / 6 (Manual pag. 32)'}</span>
        </div>
        <h2 className="text-xl sm:text-3xl font-black text-white font-heading">
          {lang === 'en' ? '2. The Major Internet Services & Their Roles' : '2. Serviciile Internetului și Rolul Acestora'}
        </h2>
        <p className="text-slate-300 text-sm mt-1">
          {lang === 'en'
            ? 'Explore the 5 essential internet pillars from the Romanian national curriculum: Email, WWW, FTP, Telnet, and IRC!'
            : 'Explorează cele 5 mari servicii din manual: Email, WWW, FTP, Telnet și IRC, și înțelege la ce folosește fiecare!'}
        </p>
      </div>

      {/* 5 Service Knowledge Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {services.map((srv, idx) => (
          <div
            key={srv.id}
            className="bg-slate-800/80 border border-slate-700 hover:border-cyan-500/50 rounded-2xl p-4 transition shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-700">
                    {srv.icon}
                  </div>
                  <h4 className="text-sm font-black text-white font-heading">
                    {idx + 1}. {srv.name}
                  </h4>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 text-cyan-300 border border-cyan-500/30 font-bold">
                  {srv.acronym}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-2.5">
                {lang === 'en' ? srv.descEn : srv.descRo}
              </p>
            </div>
            <div className="pt-2 border-t border-slate-700/60 text-[11px] text-slate-400 italic">
              💡 {lang === 'en' ? srv.exampleEn : srv.exampleRo}
            </div>
          </div>
        ))}
      </div>

      {/* Practical Match Exercise */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-black text-white font-heading flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>{lang === 'en' ? 'Practical Lab: Match the Service to the Real-World Scenario' : 'Exercițiu Practic: Asociază Serviciul cu Scenariul din Viața Reală'}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {lang === 'en'
                ? 'Select the appropriate internet service for each real-life situation described below.'
                : 'Alege serviciul internet potrivit pentru fiecare dintre cele 5 situații descrise mai jos:'}
            </p>
          </div>
        </div>

        {/* 5 Matching rows */}
        <div className="space-y-4">
          {/* Scenario 1: FTP */}
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex-1">
                <span className="text-xs font-bold text-teal-400 font-mono block mb-0.5">Scenariul 1:</span>
                <p className="text-xs sm:text-sm text-slate-200">
                  {lang === 'en'
                    ? 'Transferring a package of high-resolution digital textbook files between school servers.'
                    : 'Transferul unui pachet mare de fișiere (manuale digitale de 2 GB) de la un calculator la altul.'}
                </p>
              </div>
              <div className="w-full sm:w-64 shrink-0 flex items-center gap-2">
                <select
                  value={selectedMatches.scenario1}
                  onChange={(e) => handleMatchChange('scenario1', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded-xl text-xs sm:text-sm text-white focus:ring-2 focus:ring-teal-500/40"
                >
                  <option value="">{lang === 'en' ? '-- Choose Service --' : '-- Alege Serviciul --'}</option>
                  <option value="email">Email</option>
                  <option value="www">WWW</option>
                  <option value="ftp">FTP (File Transfer Protocol)</option>
                  <option value="telnet">Telnet</option>
                  <option value="irc">IRC</option>
                </select>
                {selectedMatches.scenario1 && (
                  <span>
                    {isM1Correct ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <span className="text-rose-400 font-bold text-sm">✗</span>}
                  </span>
                )}
              </div>
            </div>
            {selectedMatches.scenario1 && (
              <AnswerExplanation
                isCorrect={isM1Correct}
                explanationRo={
                  isM1Correct
                    ? 'Corect! FTP (File Transfer Protocol) este special conceput pentru descărcarea și încărcarea rapidă a fișierelor mari pe servere.'
                    : selectedMatches.scenario1 === 'email'
                    ? 'Emailul este destinat trimiterii de mesaje scrise și atașamente de mici dimensiuni, nu transferului masiv de pachete mari de fișiere.'
                    : selectedMatches.scenario1 === 'www'
                    ? 'WWW este sistemul de navigare prin pagini web multimedia și hiperlinkuri, nu protocolul dedicat descărcării și încărcării de fișiere mari.'
                    : selectedMatches.scenario1 === 'telnet'
                    ? 'Telnet permite controlul de la distanță al unui calculator în mod consolă (text), nu transferul optimizat de pachete de fișiere.'
                    : 'IRC este un protocol de conversație scrisă (chat) în timp real, nu un serviciu de găzduire și transfer de fișiere.'
                }
                explanationEn={
                  isM1Correct
                    ? 'Correct! FTP (File Transfer Protocol) is specially architected for uploading and downloading massive file packages.'
                    : selectedMatches.scenario1 === 'email'
                    ? 'Email is designed for written messages and modest attachments, not for large bulk file transfers.'
                    : selectedMatches.scenario1 === 'www'
                    ? 'WWW is for navigating multimedia hyperlinked web pages, not dedicated raw file transfers.'
                    : selectedMatches.scenario1 === 'telnet'
                    ? 'Telnet provides remote command-line login to another computer, not optimized file package distribution.'
                    : 'IRC is a live real-time text chat service, not a large file repository transfer protocol.'
                }
              />
            )}
          </div>

          {/* Scenario 2: WWW */}
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex-1">
                <span className="text-xs font-bold text-teal-400 font-mono block mb-0.5">Scenariul 2:</span>
                <p className="text-xs sm:text-sm text-slate-200">
                  {lang === 'en'
                    ? 'Navigating linked multimedia pages with articles, images and interactive quizzes in a web browser.'
                    : 'Navigarea pe pagini web legate între ele prin hiperlinkuri (texte, imagini, enciclopedii).'}
                </p>
              </div>
              <div className="w-full sm:w-64 shrink-0 flex items-center gap-2">
                <select
                  value={selectedMatches.scenario2}
                  onChange={(e) => handleMatchChange('scenario2', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded-xl text-xs sm:text-sm text-white focus:ring-2 focus:ring-teal-500/40"
                >
                  <option value="">{lang === 'en' ? '-- Choose Service --' : '-- Alege Serviciul --'}</option>
                  <option value="email">Email</option>
                  <option value="www">WWW (World Wide Web)</option>
                  <option value="ftp">FTP</option>
                  <option value="telnet">Telnet</option>
                  <option value="irc">IRC</option>
                </select>
                {selectedMatches.scenario2 && (
                  <span>
                    {isM2Correct ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <span className="text-rose-400 font-bold text-sm">✗</span>}
                  </span>
                )}
              </div>
            </div>
            {selectedMatches.scenario2 && (
              <AnswerExplanation
                isCorrect={isM2Correct}
                explanationRo={
                  isM2Correct
                    ? 'Bravo! WWW (World Wide Web) este biblioteca globală multimedia conectată prin hiperlinkuri și accesibilă prin browsere.'
                    : selectedMatches.scenario2 === 'email'
                    ? 'Emailul se ocupă de trimiterea scrisorilor electronice între utilizatori, nu de afișarea și navigarea pe pagini web interconectate.'
                    : selectedMatches.scenario2 === 'ftp'
                    ? 'FTP este protocolul tehnic de transfer și stocare de fișiere, nu sistemul de vizualizare a paginilor web cu linkuri.'
                    : selectedMatches.scenario2 === 'telnet'
                    ? 'Telnet oferă acces la o linie de comandă pe un calculator distant, nu navigare vizuală pe site-uri cu imagini și linkuri.'
                    : 'IRC este o cameră de discuții live prin mesaje scrise scurte, nu o rețea de documente web multimedia.'
                }
                explanationEn={
                  isM2Correct
                    ? 'Spot on! WWW (World Wide Web) is the universe of hyperlinked web pages accessed through web browsers.'
                    : selectedMatches.scenario2 === 'email'
                    ? 'Email routes electronic letters between users, not browsing interconnected multimedia pages.'
                    : selectedMatches.scenario2 === 'ftp'
                    ? 'FTP is dedicated to file transfers, not rendering interactive hyperlinked web documents.'
                    : selectedMatches.scenario2 === 'telnet'
                    ? 'Telnet provides remote terminal sessions, not visual multimedia web browsing.'
                    : 'IRC is a real-time text chat channel, not an interconnected web document system.'
                }
              />
            )}
          </div>

          {/* Scenario 3: Email */}
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex-1">
                <span className="text-xs font-bold text-teal-400 font-mono block mb-0.5">Scenariul 3:</span>
                <p className="text-xs sm:text-sm text-slate-200">
                  {lang === 'en'
                    ? 'Sending a formal written digital message and homework document to an address containing "@".'
                    : 'Trimiterea unui mesaj electronic cu titlu, text și fișier atașat către adresa profesorului.'}
                </p>
              </div>
              <div className="w-full sm:w-64 shrink-0 flex items-center gap-2">
                <select
                  value={selectedMatches.scenario3}
                  onChange={(e) => handleMatchChange('scenario3', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded-xl text-xs sm:text-sm text-white focus:ring-2 focus:ring-teal-500/40"
                >
                  <option value="">{lang === 'en' ? '-- Choose Service --' : '-- Alege Serviciul --'}</option>
                  <option value="email">Email (Poșta Electronică)</option>
                  <option value="www">WWW</option>
                  <option value="ftp">FTP</option>
                  <option value="telnet">Telnet</option>
                  <option value="irc">IRC</option>
                </select>
                {selectedMatches.scenario3 && (
                  <span>
                    {isM3Correct ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <span className="text-rose-400 font-bold text-sm">✗</span>}
                  </span>
                )}
              </div>
            </div>
            {selectedMatches.scenario3 && (
              <AnswerExplanation
                isCorrect={isM3Correct}
                explanationRo={
                  isM3Correct
                    ? 'Excelent! Emailul (Poșta electronică) permite expedierea de scrisori digitale, mesaje structurate și documente atașate oriunde în lume.'
                    : selectedMatches.scenario3 === 'www'
                    ? 'WWW este serviciul de navigare pe site-uri web, în timp ce transmiterea de mesaje structurate către o adresă poștală aparține Emailului.'
                    : selectedMatches.scenario3 === 'ftp'
                    ? 'FTP copiază și descarcă pachete de fișiere de pe servere, nu trimite mesaje poștale între persoane.'
                    : selectedMatches.scenario3 === 'telnet'
                    ? 'Telnet se conectează la un server pentru execuție de comenzi, nu pentru compunerea și primirea de scrisori electronice.'
                    : 'IRC oferă camere de discuție instantanee în direct, nu mesaje formale compuse cu subiect, destinatar și stocare în căsuță poștală.'
                }
                explanationEn={
                  isM3Correct
                    ? 'Great! Email (Electronic Mail) enables sending structured digital letters with attachments worldwide.'
                    : selectedMatches.scenario3 === 'www'
                    ? 'WWW is for exploring websites, while sending structured messages to a specific address is Email.'
                    : selectedMatches.scenario3 === 'ftp'
                    ? 'FTP transfers file archives to servers, it does not send personalized mail messages.'
                    : selectedMatches.scenario3 === 'telnet'
                    ? 'Telnet opens command shells on remote hosts, not personal electronic correspondence.'
                    : 'IRC provides live group chat rooms, not asynchronous personal emails with subject and address.'
                }
              />
            )}
          </div>

          {/* Scenario 4: Telnet */}
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex-1">
                <span className="text-xs font-bold text-teal-400 font-mono block mb-0.5">Scenariul 4:</span>
                <p className="text-xs sm:text-sm text-slate-200">
                  {lang === 'en'
                    ? 'An IT technician logging in remotely to execute terminal commands on a distant server.'
                    : 'Conectarea și controlul de la distanță al unui alt calculator pentru configurare.'}
                </p>
              </div>
              <div className="w-full sm:w-64 shrink-0 flex items-center gap-2">
                <select
                  value={selectedMatches.scenario4}
                  onChange={(e) => handleMatchChange('scenario4', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded-xl text-xs sm:text-sm text-white focus:ring-2 focus:ring-teal-500/40"
                >
                  <option value="">{lang === 'en' ? '-- Choose Service --' : '-- Alege Serviciul --'}</option>
                  <option value="email">Email</option>
                  <option value="www">WWW</option>
                  <option value="ftp">FTP</option>
                  <option value="telnet">Telnet (Acces la distanță)</option>
                  <option value="irc">IRC</option>
                </select>
                {selectedMatches.scenario4 && (
                  <span>
                    {isM4Correct ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <span className="text-rose-400 font-bold text-sm">✗</span>}
                  </span>
                )}
              </div>
            </div>
            {selectedMatches.scenario4 && (
              <AnswerExplanation
                isCorrect={isM4Correct}
                explanationRo={
                  isM4Correct
                    ? 'Corect! Telnet permite conectarea de la distanță într-o sesiune terminal pentru a comanda un alt computer aflat oriunde pe glob.'
                    : selectedMatches.scenario4 === 'email'
                    ? 'Emailul transmite scrisori digitale asincrone, nu oferă o conexiune activă pentru controlul unui calculator la distanță.'
                    : selectedMatches.scenario4 === 'www'
                    ? 'WWW afișează pagini web și articole multimedia, nu o consolă de comenzi pentru administrarea unui computer de la distanță.'
                    : selectedMatches.scenario4 === 'ftp'
                    ? 'FTP transferă fișiere, dar nu permite deschiderea unui terminal interactiv pentru a rula comenzi pe un alt calculator.'
                    : 'IRC este un canal de chat între utilizatori, nu un utilitar tehnic pentru preluarea controlului asupra unui calculator distant.'
                }
                explanationEn={
                  isM4Correct
                    ? 'Correct! Telnet enables remote command-line login and administration of another host over the network.'
                    : selectedMatches.scenario4 === 'email'
                    ? 'Email delivers digital letters, not active interactive control over a remote computer.'
                    : selectedMatches.scenario4 === 'www'
                    ? 'WWW renders web articles, not an administrative command prompt for remote servers.'
                    : selectedMatches.scenario4 === 'ftp'
                    ? 'FTP transfers files, but does not allow executing interactive terminal commands remotely.'
                    : 'IRC is for live conversation between people, not remote machine terminal administration.'
                }
              />
            )}
          </div>

          {/* Scenario 5: IRC */}
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex-1">
                <span className="text-xs font-bold text-teal-400 font-mono block mb-0.5">Scenariul 5:</span>
                <p className="text-xs sm:text-sm text-slate-200">
                  {lang === 'en'
                    ? 'Instant live text chatting in chatrooms where messages appear in real-time seconds.'
                    : 'Transmiterea și primirea de mesaje scrise instant în timp real (Internet Relay Chat).'}
                </p>
              </div>
              <div className="w-full sm:w-64 shrink-0 flex items-center gap-2">
                <select
                  value={selectedMatches.scenario5}
                  onChange={(e) => handleMatchChange('scenario5', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded-xl text-xs sm:text-sm text-white focus:ring-2 focus:ring-teal-500/40"
                >
                  <option value="">{lang === 'en' ? '-- Choose Service --' : '-- Alege Serviciul --'}</option>
                  <option value="email">Email</option>
                  <option value="www">WWW</option>
                  <option value="ftp">FTP</option>
                  <option value="telnet">Telnet</option>
                  <option value="irc">IRC (Chat în timp real)</option>
                </select>
                {selectedMatches.scenario5 && (
                  <span>
                    {isM5Correct ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <span className="text-rose-400 font-bold text-sm">✗</span>}
                  </span>
                )}
              </div>
            </div>
            {selectedMatches.scenario5 && (
              <AnswerExplanation
                isCorrect={isM5Correct}
                explanationRo={
                  isM5Correct
                    ? 'Foarte bine! IRC (Internet Relay Chat) este strămoșul sistemelor moderne de chat, oferind mesagerie instantanee în timp real.'
                    : selectedMatches.scenario5 === 'email'
                    ? 'Emailul este o comunicare asincronă (mesajele se citesc mai târziu în căsuță), nu un dialog scris instantaneu în direct (chat).'
                    : selectedMatches.scenario5 === 'www'
                    ? 'WWW găzduiește pagini web statice sau dinamice, în timp ce protocolul clasic dedicat camerelor de chat în direct este IRC.'
                    : selectedMatches.scenario5 === 'ftp'
                    ? 'FTP este folosit exclusiv pentru mutarea fișierelor de pe un calculator pe altul, nu pentru conversații text în direct.'
                    : 'Telnet este destinat controlului tehnic al unui computer prin comenzi, nu discuțiilor scrise în timp real între prieteni sau colegi.'
                }
                explanationEn={
                  isM5Correct
                    ? 'Well done! IRC (Internet Relay Chat) pioneered real-time text chatting and live conversation channels.'
                    : selectedMatches.scenario5 === 'email'
                    ? 'Email is asynchronous mail messaging, not instantaneous live room dialogue (chat).'
                    : selectedMatches.scenario5 === 'www'
                    ? 'WWW hosts web pages and documents, while the dedicated real-time chat protocol is IRC.'
                    : selectedMatches.scenario5 === 'ftp'
                    ? 'FTP is used strictly for moving files between machines, not live text chatting.'
                    : 'Telnet is for remote terminal administration, not real-time text chats among friends.'
                }
              />
            )}
          </div>
        </div>

        <QuestionHint
          id="i2-services-matching"
          hintRo="Amintește-ți: FTP = transfer de fișiere, WWW = pagini și linkuri web, Email = poștă electronică, Telnet = acces la distanță, IRC = chat în timp real."
          hintEn="Remember: FTP = file transfer, WWW = web pages & hyperlinks, Email = electronic mail, Telnet = remote login, IRC = real-time relay chat."
        />
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        score={pageScore}
        totalPoints={15}
        correctCount={correctCount}
        totalQuestions={totalQuestions}
        canProceed={Object.values(selectedMatches).some((v) => v !== '')}
        onProceed={handleProceed}
        onRetry={handleReset}
      />
    </div>
  );
};
