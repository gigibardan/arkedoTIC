import React, { useState } from 'react';
import { Globe, Link2, Code2, CheckCircle2, Sparkles, Compass, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { QuestionHint } from './QuestionHint';
import { AnswerExplanation } from './AnswerExplanation';
import { PageNavigationFooter } from './PageNavigationFooter';
import { sounds } from '../../utils/audio';

interface ILevel4Props {
  onCompletePage: (earnedScore: number) => void;
}

export const ILevel4_WebAndURLAnatomy: React.FC<ILevel4Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Part 1: WWW Inventor & CERN History Quiz
  const [inventorAnswer, setInventorAnswer] = useState<string | null>(null);
  const [htmlAnswer, setHtmlAnswer] = useState<string | null>(null);

  // Part 2: Interactive URL Component Matching (Manual p. 34: http://www.edu.ro/învățământ-gimnazial)
  // Matching 4 elements:
  // 1. "http://" -> protocol / transfer method
  // 2. "www" -> world wide web prefix
  // 3. "edu.ro" -> domain & country/institution type (.ro for Romania, .edu for education)
  // 4. "învățământ-gimnazial" -> specific page path inside website
  const [urlMatches, setUrlMatches] = useState<{
    protocol: string;
    www: string;
    domain: string;
    path: string;
  }>({
    protocol: '',
    www: '',
    domain: '',
    path: '',
  });

  const isInventorCorrect = inventorAnswer === 'tim_berners_lee';
  const isHtmlCorrect = htmlAnswer === 'html';
  const isProtocolMatch = urlMatches.protocol === 'protocol';
  const isWwwMatch = urlMatches.www === 'www_chars';
  const isDomainMatch = urlMatches.domain === 'domain_country';
  const isPathMatch = urlMatches.path === 'page_path';

  const totalQuestions = 6;
  const correctCount =
    (isInventorCorrect ? 1 : 0) +
    (isHtmlCorrect ? 1 : 0) +
    (isProtocolMatch ? 1 : 0) +
    (isWwwMatch ? 1 : 0) +
    (isDomainMatch ? 1 : 0) +
    (isPathMatch ? 1 : 0);

  const pageScore = Math.round((correctCount / totalQuestions) * 15);

  const handleProceed = () => {
    if (correctCount >= 4) sounds.playVictory();
    else sounds.playClick();
    onCompletePage(pageScore);
  };

  const handleReset = () => {
    setInventorAnswer(null);
    setHtmlAnswer(null);
    setUrlMatches({ protocol: '', www: '', domain: '', path: '' });
    sounds.playClick();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/30 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider mb-2">
          <Compass className="w-4 h-4" />
          <span>{lang === 'en' ? 'Module 3A • Page 4 / 6 (Textbook p. 34)' : 'Modulul 3A • Pagina 4 / 6 (Manual pag. 34)'}</span>
        </div>
        <h2 className="text-xl sm:text-3xl font-black text-white font-heading">
          {lang === 'en' ? '4. Navigating the World Wide Web & URL Anatomy' : '4. Navigarea în World Wide Web & Anatomia unei Adrese URL'}
        </h2>
        <p className="text-slate-300 text-sm mt-1">
          {lang === 'en'
            ? 'Understand how hypertext connects the globe, who created WWW at CERN, and how to read every piece of an address (URL)!'
            : 'Învață cum leagă hipertextul paginile web, cine a inventat WWW la CERN în 1989 și cum descifrăm fiecare parte a unei adrese URL!'}
        </p>
      </div>

      {/* Theory & Visual Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-3">
              <Globe className="w-4 h-4" />
              <span>{lang === 'en' ? 'WWW & Hypertext Principles' : 'World Wide Web & Hipertextul'}</span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed list-disc list-inside">
              <li>
                <strong className="text-white">World Wide Web (WWW):</strong>{' '}
                {lang === 'en'
                  ? 'Invented in 1989 by English scientist Tim Berners-Lee at CERN laboratories in Geneva, Switzerland.'
                  : 'Inventat în 1989 de cercetătorul englez Tim Berners-Lee la laboratoarele CERN din Geneva, Elveția.'}
              </li>
              <li>
                <strong className="text-white">
                  {lang === 'en' ? 'Hypertext & Hyperlinks:' : 'Hipertext & Hiperlinkuri:'}
                </strong>{' '}
                {lang === 'en'
                  ? 'Clickable links that instantly jump directly from one document/page to another.'
                  : 'Conexiuni interactive care trimit utilizatorul instantaneu către alt document sau pagină.'}
              </li>
              <li>
                <strong className="text-white">HTML (HyperText Markup Language):</strong>{' '}
                {lang === 'en'
                  ? 'The standard markup language used to build and format all web pages.'
                  : 'Limbajul standard de marcare folosit pentru crearea și structurarea oricărei pagini web.'}
              </li>
            </ul>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-700/60 text-[11px] text-amber-300 italic">
            📜 {lang === 'en' ? 'Fun fact: In March 1989, Tim’s boss wrote on his proposal: "Vague, but exciting"!' : 'Știați că: Pe proiectul lui Tim Berners-Lee din martie 1989, șeful său a notat: „Vag, dar interesant” !'}
          </div>
        </div>

        {/* Anatomia URL */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-teal-400 font-bold text-sm mb-3">
              <Link2 className="w-4 h-4" />
              <span>{lang === 'en' ? 'URL (Unique Resource Locator)' : 'Anatomia unei Adrese Web (URL)'}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
              {lang === 'en'
                ? 'Each web resource has a unique worldwide address formatted like this:'
                : 'Fiecare pagină web deține o adresă unică în lume (URL), formată din mai multe componente:'}
            </p>
            {/* Visual URL Decomposition Box */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-center overflow-x-auto space-y-1">
              <span className="text-cyan-400 font-bold">http://</span>
              <span className="text-teal-400 font-bold">www.</span>
              <span className="text-emerald-400 font-bold">edu.ro</span>
              <span className="text-amber-400 font-bold">/învățământ-gimnazial</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 mt-2 font-mono">
              <div>🔵 .ro = România</div>
              <div>🟢 .edu = Educațional</div>
              <div>🟡 .com = Comercial</div>
              <div>🟣 .org = Organizație</div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive URL Deconstructor Lab (Manual p. 34) */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-6 shadow-xl space-y-5">
        <h3 className="text-base sm:text-lg font-black text-white font-heading flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-teal-400" />
          <span>{lang === 'en' ? 'Interactive Lab: Decode the URL Parts (Manual p. 34)' : 'Laborator Interactiv: Descifrează Părțile Adresei URL (Manual pag. 34)'}</span>
        </h3>

        <div className="bg-slate-950/80 p-4 rounded-2xl border border-teal-500/30 text-center">
          <span className="text-xs font-mono text-slate-400 block mb-1">
            {lang === 'en' ? 'Official Sample URL from Curriculum:' : 'Adresa oficială analizată:'}
          </span>
          <span className="text-base sm:text-lg font-mono font-black text-white tracking-wide">
            <span className="text-cyan-400">http://</span>
            <span className="text-teal-400">www.</span>
            <span className="text-emerald-400">edu.ro</span>
            <span className="text-amber-400">/învățământ-gimnazial</span>
          </span>
        </div>

        {/* 4 Matching Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Part 1: http:// */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 flex flex-col justify-between space-y-2">
            <div>
              <span className="text-xs font-mono font-bold text-cyan-400">1. Componenta: "http://"</span>
              <p className="text-xs text-slate-300 mt-1 mb-2">
                {lang === 'en' ? 'What does http:// represent?' : 'Ce reprezintă prefixul http:// ?'}
              </p>
            </div>
            <select
              value={urlMatches.protocol}
              onChange={(e) => {
                setUrlMatches((p) => ({ ...p, protocol: e.target.value }));
                sounds.playClick();
              }}
              className="w-full bg-slate-950 border border-slate-700 px-3 py-2 rounded-lg text-xs text-white"
            >
              <option value="">{lang === 'en' ? '-- Select Role --' : '-- Alege Semnificația --'}</option>
              <option value="protocol">{lang === 'en' ? 'Protocol (HyperText Transfer)' : 'Protocolul de transfer de hipertext'}</option>
              <option value="image">{lang === 'en' ? 'An image file' : 'O imagine salvată'}</option>
              <option value="password">{lang === 'en' ? 'User password' : 'O parolă secretă'}</option>
            </select>
            {urlMatches.protocol && (
              <AnswerExplanation
                isCorrect={isProtocolMatch}
                explanationRo={
                  isProtocolMatch
                    ? 'Excelent! HTTP (HyperText Transfer Protocol) este metoda/protocolul prin care browserul solicită și primește pagini web.'
                    : urlMatches.protocol === 'image'
                    ? 'O imagine salvată (.png, .jpg) este un fișier media, în timp ce «http://» este protocolul tehnic de comunicare între browser și server.'
                    : 'O parolă este o cheie secretă de securitate, pe când «http://» este protocolul de transfer de hipertext.'
                }
                explanationEn={
                  isProtocolMatch
                    ? 'Excellent! HTTP (HyperText Transfer Protocol) is the transmission standard used by browsers to fetch web pages.'
                    : urlMatches.protocol === 'image'
                    ? 'An image file is a multimedia graphic asset, whereas "http://" is the communication protocol.'
                    : 'A password is a private security key, while "http://" is the HyperText Transfer Protocol.'
                }
              />
            )}
          </div>

          {/* Part 2: www */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 flex flex-col justify-between space-y-2">
            <div>
              <span className="text-xs font-mono font-bold text-teal-400">2. Componenta: "www"</span>
              <p className="text-xs text-slate-300 mt-1 mb-2">
                {lang === 'en' ? 'What are the 3 Ws standing for?' : 'Ce caracterizează cei 3 W ?'}
              </p>
            </div>
            <select
              value={urlMatches.www}
              onChange={(e) => {
                setUrlMatches((p) => ({ ...p, www: e.target.value }));
                sounds.playClick();
              }}
              className="w-full bg-slate-950 border border-slate-700 px-3 py-2 rounded-lg text-xs text-white"
            >
              <option value="">{lang === 'en' ? '-- Select Role --' : '-- Alege Semnificația --'}</option>
              <option value="www_chars">{lang === 'en' ? 'World Wide Web network service prefix' : 'Cei trei W caracteristici unui site web'}</option>
              <option value="windows">{lang === 'en' ? 'Windows Word Writer' : 'Programul Windows Writer'}</option>
              <option value="wireless">{lang === 'en' ? 'Wireless WiFi Wave' : 'Undă de WiFi'}</option>
            </select>
            {urlMatches.www && (
              <AnswerExplanation
                isCorrect={isWwwMatch}
                explanationRo={
                  isWwwMatch
                    ? 'Corect! WWW indică faptul că serverul găzduiește un serviciu accesibil pe World Wide Web.'
                    : urlMatches.www === 'windows'
                    ? 'Windows Writer este o aplicație de redactare text, pe când «www» desemnează rețeaua World Wide Web.'
                    : 'Semnalul wireless/WiFi este tehnologia fizică radio de conectare, pe când «www» reprezintă serviciul web mondial.'
                }
                explanationEn={
                  isWwwMatch
                    ? 'Correct! WWW indicates that the host serves World Wide Web resources.'
                    : urlMatches.www === 'windows'
                    ? 'Windows Writer is a document editing tool, while "www" stands for World Wide Web.'
                    : 'Wireless WiFi refers to local radio transmission, whereas "www" signifies the World Wide Web service.'
                }
              />
            )}
          </div>

          {/* Part 3: edu.ro */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 flex flex-col justify-between space-y-2">
            <div>
              <span className="text-xs font-mono font-bold text-emerald-400">3. Numele & Domeniul: "edu.ro"</span>
              <p className="text-xs text-slate-300 mt-1 mb-2">
                {lang === 'en' ? 'What do "edu" and ".ro" indicate?' : 'Ce indică „edu” și terminația „.ro” ?'}
              </p>
            </div>
            <select
              value={urlMatches.domain}
              onChange={(e) => {
                setUrlMatches((p) => ({ ...p, domain: e.target.value }));
                sounds.playClick();
              }}
              className="w-full bg-slate-950 border border-slate-700 px-3 py-2 rounded-lg text-xs text-white"
            >
              <option value="">{lang === 'en' ? '-- Select Role --' : '-- Alege Semnificația --'}</option>
              <option value="domain_country">{lang === 'en' ? 'Type of site (.edu educational) & Country (.ro Romania)' : 'Tipul de site (.edu educațional) & Țara (.ro România)'}</option>
              <option value="radio">{lang === 'en' ? 'A radio channel in Rome' : 'Un post de radio din Roma'}</option>
            </select>
            {urlMatches.domain && (
              <AnswerExplanation
                isCorrect={isDomainMatch}
                explanationRo={
                  isDomainMatch
                    ? 'Foarte bine! «edu» arată profilul educațional al instituției, iar «.ro» este codul de țară pentru România.'
                    : 'Un post de radio transmite sunet pe unde radio, pe când «edu.ro» este domeniul de internet educațional (.edu) din România (.ro).'
                }
                explanationEn={
                  isDomainMatch
                    ? 'Well done! "edu" denotes an educational institution, and ".ro" is the country code for Romania.'
                    : 'A radio channel broadcasts audio signals, while "edu.ro" designates an educational (.edu) domain in Romania (.ro).'
                }
              />
            )}
          </div>

          {/* Part 4: /învățământ-gimnazial */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 flex flex-col justify-between space-y-2">
            <div>
              <span className="text-xs font-mono font-bold text-amber-400">4. Calea: "/învățământ-gimnazial"</span>
              <p className="text-xs text-slate-300 mt-1 mb-2">
                {lang === 'en' ? 'What is this path within the website?' : 'Ce reprezintă această cale din site?'}
              </p>
            </div>
            <select
              value={urlMatches.path}
              onChange={(e) => {
                setUrlMatches((p) => ({ ...p, path: e.target.value }));
                sounds.playClick();
              }}
              className="w-full bg-slate-950 border border-slate-700 px-3 py-2 rounded-lg text-xs text-white"
            >
              <option value="">{lang === 'en' ? '-- Select Role --' : '-- Alege Semnificația --'}</option>
              <option value="page_path">{lang === 'en' ? 'The specific page currently opened within the site' : 'Pagina din site pe care vă aflați în acest moment'}</option>
              <option value="email_user">{lang === 'en' ? 'The user email box' : 'Căsuța de email a elevului'}</option>
            </select>
            {urlMatches.path && (
              <AnswerExplanation
                isCorrect={isPathMatch}
                explanationRo={
                  isPathMatch
                    ? 'Exact! Calea indică pagina exactă sau secțiunea vizitată în cadrul structurii de fișiere a site-ului.'
                    : 'Căsuța de email stochează mesaje de poștă electronică, pe când «/învățământ-gimnazial» este calea internă spre pagina deschisă în site.'
                }
                explanationEn={
                  isPathMatch
                    ? 'Exactly! The path pinpoints the specific webpage or section within the website structure.'
                    : 'An email mailbox holds private messages, while "/învățământ-gimnazial" is the server folder path for this webpage.'
                }
              />
            )}
          </div>
        </div>

        <QuestionHint
          id="i4-url-anatomy"
          hintRo="Consultă manualul la pag. 34: http:// = protocol, www = World Wide Web, edu.ro = tip educațional & România (.ro), iar /învățământ-gimnazial = pagina curentă din site."
          hintEn="Check textbook page 34: http:// is protocol, www is Web prefix, edu.ro is educational in Romania, and the path is the current specific page."
        />
      </div>

      {/* Rapid Theory Check */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 shadow-md space-y-2">
          <p className="text-xs sm:text-sm font-bold text-white mb-2">
            {lang === 'en' ? 'Who invented the World Wide Web in 1989?' : 'Cine a inventat World Wide Web în 1989?'}
          </p>
          <div className="space-y-1.5">
            {[
              { id: 'tim_berners_lee', label: 'Tim Berners-Lee (CERN)' },
              { id: 'charles_babbage', label: 'Charles Babbage' },
              { id: 'bill_gates', label: 'Bill Gates' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setInventorAnswer(opt.id);
                  if (opt.id === 'tim_berners_lee') sounds.playCorrect();
                  else sounds.playWrong();
                }}
                className={`w-full text-left p-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                  inventorAnswer === opt.id
                    ? opt.id === 'tim_berners_lee'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-rose-500/20 border-rose-500 text-rose-300'
                    : 'bg-slate-900 border-slate-700 text-slate-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {inventorAnswer && (
            <AnswerExplanation
              isCorrect={isInventorCorrect}
              explanationRo={
                isInventorCorrect
                  ? 'Corect! Tim Berners-Lee a inventat WWW și limbajul HTML la laboratoarele CERN în anul 1989.'
                  : inventorAnswer === 'charles_babbage'
                  ? 'Charles Babbage a proiectat primul calculator mecanic (Motorul Analitic) în secolul al XIX-lea (1837), cu mult înainte de era internetului.'
                  : 'Bill Gates este co-fondatorul companiei software Microsoft și a sistemului de operare Windows, nu inventatorul WWW.'
              }
              explanationEn={
                isInventorCorrect
                  ? 'Correct! Tim Berners-Lee invented the World Wide Web and HTML at CERN in 1989.'
                  : inventorAnswer === 'charles_babbage'
                  ? 'Charles Babbage designed the mechanical Analytical Engine in the 19th century (1837), long before the Internet era.'
                  : 'Bill Gates co-founded Microsoft and created the Windows operating system, not the World Wide Web.'
              }
            />
          )}
          <QuestionHint
            id="i4-www-inventor"
            hintRo="Omul de știință englez Tim Berners-Lee a propus sistemul WWW la laboratorul CERN din Geneva în 1989."
            hintEn="British computer scientist Tim Berners-Lee proposed the WWW system at CERN in 1989."
          />
        </div>

        <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 shadow-md space-y-2">
          <p className="text-xs sm:text-sm font-bold text-white mb-2">
            {lang === 'en' ? 'What markup language is used to build web pages?' : 'Ce limbaj de programare/marcare se folosește pentru pagini web?'}
          </p>
          <div className="space-y-1.5">
            {[
              { id: 'html', label: 'HTML (HyperText Markup Language)' },
              { id: 'paint', label: 'Paint' },
              { id: 'calculator', label: 'Calculator.exe' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setHtmlAnswer(opt.id);
                  if (opt.id === 'html') sounds.playCorrect();
                  else sounds.playWrong();
                }}
                className={`w-full text-left p-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                  htmlAnswer === opt.id
                    ? opt.id === 'html'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-rose-500/20 border-rose-500 text-rose-300'
                    : 'bg-slate-900 border-slate-700 text-slate-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {htmlAnswer && (
            <AnswerExplanation
              isCorrect={isHtmlCorrect}
              explanationRo={
                isHtmlCorrect
                  ? 'Exact! HTML (HyperText Markup Language) este scheletul universal pe care se clădesc toate site-urile din lume.'
                  : htmlAnswer === 'paint'
                  ? 'Paint este o aplicație grafică pentru desenat imagini, nu un limbaj de cod pentru structurat pagini web.'
                  : 'Calculator.exe este un program utilitar pentru calcule matematice, nu un limbaj de redactare pagini web.'
              }
              explanationEn={
                isHtmlCorrect
                  ? 'Exactly! HTML (HyperText Markup Language) is the universal markup standard behind all websites.'
                  : htmlAnswer === 'paint'
                  ? 'Paint is a graphics drawing application, not a programming or markup language for websites.'
                  : 'Calculator.exe is an arithmetic math utility, not a web authoring language.'
              }
            />
          )}
          <QuestionHint
            id="i4-html-language"
            hintRo="Acronimul HTML înseamnă HyperText Markup Language."
            hintEn="The acronym HTML stands for HyperText Markup Language."
          />
        </div>
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        score={pageScore}
        totalPoints={15}
        correctCount={correctCount}
        totalQuestions={totalQuestions}
        canProceed={Boolean(inventorAnswer || htmlAnswer || urlMatches.protocol || urlMatches.domain)}
        onProceed={handleProceed}
        onRetry={handleReset}
      />
    </div>
  );
};
