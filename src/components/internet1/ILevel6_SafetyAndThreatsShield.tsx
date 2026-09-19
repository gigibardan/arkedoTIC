import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Bug,
  EyeOff,
  UserX,
  MessageSquareWarning,
  Flame,
  KeyRound,
  CheckCircle2,
  Sparkles,
  Award,
  AlertTriangle,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { QuestionHint } from './QuestionHint';
import { AnswerExplanation } from './AnswerExplanation';
import { PageNavigationFooter } from './PageNavigationFooter';
import { sounds } from '../../utils/audio';

interface ILevel6Props {
  onCompletePage: (earnedScore: number) => void;
}

export const ILevel6_SafetyAndThreatsShield: React.FC<ILevel6Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Part 1: Password Strength Lab
  const [passwordInput, setPasswordInput] = useState<string>('');

  // Password rules validation
  const hasLength = passwordInput.length >= 8;
  const hasUpper = /[A-Z]/.test(passwordInput);
  const hasNumber = /[0-9]/.test(passwordInput);
  const hasSymbol = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(passwordInput);
  const isStrongPassword = hasLength && hasUpper && hasNumber && hasSymbol;

  // Part 2: Threat & Protection Sorting (Manual p. 35-36)
  // Scenarios to match:
  // 1. "Un program care se instalează fără permisiune și distruge date" -> Virus informatic
  // 2. "Copierea ilegală a datelor personale, cardurilor și parolelor" -> Furt de identitate
  // 3. "Persecutarea, intimidarea sau mesajele jignitoare pe internet" -> Cyberbullying (Hărțuire online)
  // 4. "Sistem de protecție hardware/software care filtrează conexiunile periculoase" -> Firewall

  const [matches, setMatches] = useState<{
    virus: string;
    identity: string;
    bullying: string;
    firewall: string;
  }>({
    virus: '',
    identity: '',
    bullying: '',
    firewall: '',
  });

  const isVirusCorrect = matches.virus === 'virus';
  const isIdentityCorrect = matches.identity === 'identity_theft';
  const isBullyingCorrect = matches.bullying === 'cyberbullying';
  const isFirewallCorrect = matches.firewall === 'firewall';

  // Part 3: Golden Rules of Child Cyber-Safety (3 checks)
  const [rule1, setRule1] = useState<boolean>(false);
  const [rule2, setRule2] = useState<boolean>(false);
  const [rule3, setRule3] = useState<boolean>(false);

  const totalQuestions = 8;
  const correctCount =
    (isStrongPassword ? 1 : 0) +
    (isVirusCorrect ? 1 : 0) +
    (isIdentityCorrect ? 1 : 0) +
    (isBullyingCorrect ? 1 : 0) +
    (isFirewallCorrect ? 1 : 0) +
    (rule1 ? 1 : 0) +
    (rule2 ? 1 : 0) +
    (rule3 ? 1 : 0);

  const pageScore = Math.round((correctCount / totalQuestions) * 20);

  const handleProceed = () => {
    sounds.playVictory();
    onCompletePage(pageScore);
  };

  const handleReset = () => {
    setPasswordInput('');
    setMatches({ virus: '', identity: '', bullying: '', firewall: '' });
    setRule1(false);
    setRule2(false);
    setRule3(false);
    sounds.playClick();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border border-rose-500/30 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-400 uppercase tracking-wider mb-2">
          <ShieldAlert className="w-4 h-4" />
          <span>{lang === 'en' ? 'Module 3A • Page 6 / 6 (Textbook pp. 35–36)' : 'Modulul 3A • Pagina 6 / 6 (Manual pag. 35–36)'}</span>
        </div>
        <h2 className="text-xl sm:text-3xl font-black text-white font-heading">
          {lang === 'en' ? '6. Internet Safety, Threats & The Digital Shield' : '6. Siguranța Navigării pe Internet & Scutul Digital'}
        </h2>
        <p className="text-slate-300 text-sm mt-1">
          {lang === 'en'
            ? 'Learn the 4 major cyber threats (viruses, inappropriate content, identity theft, cyberbullying), test password strength, and activate your protective shield!'
            : 'Descoperă cele 4 mari pericole online (viruși, conținut nepotrivit, furt de identitate, cyberbullying), testează o parolă de securitate și activează scutul de protecție!'}
        </p>
      </div>

      {/* Threat Knowledge Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Threat 1 */}
        <div className="bg-slate-800/80 border border-rose-500/30 rounded-2xl p-4 shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs mb-2">
              <Bug className="w-4 h-4" />
              <span>a) Virușii Informatici</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {lang === 'en'
                ? 'Programs installed without permission that damage hardware/software and delete files.'
                : 'Programe care se instalează fără acordul tău, afectând computerul hardware și software.'}
            </p>
          </div>
          <div className="mt-2 text-[10px] font-mono text-emerald-400 font-semibold">
            🛡️ {lang === 'en' ? 'Defense: Antivirus software' : 'Soluție: Antivirus activ'}
          </div>
        </div>

        {/* Threat 2 */}
        <div className="bg-slate-800/80 border border-amber-500/30 rounded-2xl p-4 shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs mb-2">
              <EyeOff className="w-4 h-4" />
              <span>b) Conținut Nepotrivit</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {lang === 'en'
                ? 'Information that may be harmful, violent, illegal, or inappropriate for your age.'
                : 'Informații dăunătoare sau ilegale, instigare la violență și substanțe interzise.'}
            </p>
          </div>
          <div className="mt-2 text-[10px] font-mono text-amber-400 font-semibold">
            🛡️ {lang === 'en' ? 'Defense: Age-safe verified sites' : 'Soluție: Site-uri de încredere'}
          </div>
        </div>

        {/* Threat 3 */}
        <div className="bg-slate-800/80 border border-red-500/30 rounded-2xl p-4 shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-red-400 font-bold text-xs mb-2">
              <UserX className="w-4 h-4" />
              <span>c) Furtul de Identitate</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {lang === 'en'
                ? 'Cybercriminals copying your personal data, bank cards, names, and passwords.'
                : 'Copierea ilegală a datelor personale (nume, adresă, parole, carduri bancare).'}
            </p>
          </div>
          <div className="mt-2 text-[10px] font-mono text-cyan-400 font-semibold">
            🛡️ {lang === 'en' ? 'Defense: Complex passwords & Firewall' : 'Soluție: Parole tari & Firewall'}
          </div>
        </div>

        {/* Threat 4 */}
        <div className="bg-slate-800/80 border border-purple-500/30 rounded-2xl p-4 shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-purple-400 font-bold text-xs mb-2">
              <MessageSquareWarning className="w-4 h-4" />
              <span>d) Cyberbullying</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {lang === 'en'
                ? 'Intimidation, harassment, threats, or insults against a person over the internet.'
                : 'Persecutarea, intimidarea și jignirea unei persoane prin mesaje și rețele.'}
            </p>
          </div>
          <div className="mt-2 text-[10px] font-mono text-purple-300 font-semibold">
            🛡️ {lang === 'en' ? 'Defense: Tell a trusted adult immediately' : 'Soluție: Anunță un adult'}
          </div>
        </div>
      </div>

      {/* Interactive Password Strength Generator & Checker */}
      <div className="bg-slate-900 border-2 border-teal-500/40 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-teal-400" />
            <h3 className="text-base sm:text-lg font-bold text-white">
              {lang === 'en' ? 'Interactive Lab: Test a Super Strong Password' : 'Laborator Interactiv: Creează o Parolă Puternică (Manual pag. 36)'}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => {
              setPasswordInput('Arkedo#2026!Pro');
              sounds.playCorrect();
            }}
            className="px-3 py-1 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-xs font-mono font-bold transition cursor-pointer"
          >
            {lang === 'en' ? '⚡ Try sample: Arkedo#2026!Pro' : '⚡ Exemplu: Arkedo#2026!Pro'}
          </button>
        </div>

        <div className="max-w-md">
          <input
            type="text"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder={lang === 'en' ? 'Type a sample password to test...' : 'Tastează o parolă pentru verificare...'}
            className="w-full bg-slate-950 border border-slate-700 px-4 py-2.5 rounded-xl text-sm font-mono text-white focus:ring-2 focus:ring-teal-500/40"
          />
        </div>

        {/* Password 4 Golden Rules */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
          <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${hasLength ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
            <span>{hasLength ? '✓' : '○'}</span>
            <span>Min. 8 litere</span>
          </div>
          <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${hasUpper ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
            <span>{hasUpper ? '✓' : '○'}</span>
            <span>Majuscule (A-Z)</span>
          </div>
          <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${hasNumber ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
            <span>{hasNumber ? '✓' : '○'}</span>
            <span>Cifre (0-9)</span>
          </div>
          <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${hasSymbol ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
            <span>{hasSymbol ? '✓' : '○'}</span>
            <span>Simboluri (!#$%)</span>
          </div>
        </div>

        {passwordInput.length > 0 && (
          <AnswerExplanation
            isCorrect={isStrongPassword}
            explanationRo={
              isStrongPassword
                ? 'Excelent! Parola ta are lungime sigură (≥8), majuscule, cifre și simboluri speciale. Este greu de spart!'
                : 'Parola este încă slabă. Asigură-te că bifezi toate cele 4 criterii: minim 8 caractere, cel puțin o literă MARE, o cifră și un simbol.'
            }
            explanationEn={
              isStrongPassword
                ? 'Outstanding! Your password includes uppercase letters, numbers, and special symbols, making it highly secure!'
                : 'Your password needs reinforcement. Satisfy all 4 rules: 8+ chars, uppercase, digits, and symbols.'
            }
          />
        )}

        <QuestionHint
          id="i6-password-generator"
          hintRo="O parolă robustă combină litere mari, litere mici, cifre și simboluri (!, #, $, %) și are cel puțin 8 caractere."
          hintEn="A strong password combines uppercase, lowercase, numbers, and special characters (!, #, $, %) with 8+ length."
        />
      </div>

      {/* Threats Identification & Defense Match */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="text-base sm:text-lg font-black text-white font-heading">
          ⚔️ {lang === 'en' ? 'Identify the Threat & Security Concept' : 'Identifică Amenințarea și Conceptul de Securitate'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Item 1 */}
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between space-y-2">
            <div>
              <span className="text-xs text-slate-300 mb-2 block">
                1. {lang === 'en' ? 'Program that installs without permission and destroys files:' : 'Program malițios care se instalează fără voie și distruge date:'}
              </span>
              <select
                value={matches.virus}
                onChange={(e) => {
                  setMatches((p) => ({ ...p, virus: e.target.value }));
                  sounds.playClick();
                }}
                className="w-full bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg text-xs text-white"
              >
                <option value="">{lang === 'en' ? '-- Select --' : '-- Alege noțiunea --'}</option>
                <option value="virus">Virus informatic</option>
                <option value="calculator">Calculator de birou</option>
                <option value="html">Fișier HTML</option>
              </select>
            </div>
            {matches.virus && (
              <AnswerExplanation
                isCorrect={isVirusCorrect}
                explanationRo={
                  isVirusCorrect
                    ? 'Corect! Virușii informatici sunt programe create pentru a produce daune, a altera fișiere sau a bloca sistemul.'
                    : matches.virus === 'html'
                    ? 'Un fișier HTML este un document text care conține structura și conținutul unei pagini web, nu un program periculos.'
                    : 'Calculatorul de birou este un program sau aparat utilitar pentru calcule matematice, nu un software distructiv.'
                }
                explanationEn={
                  isVirusCorrect
                    ? 'Correct! Computer viruses are malicious programs designed to disrupt systems and damage files.'
                    : matches.virus === 'html'
                    ? 'An HTML file is a markup document used to structure webpages, not harmful software.'
                    : 'A desktop calculator is a utility tool for mathematical calculations, not destructive software.'
                }
              />
            )}
          </div>

          {/* Item 2 */}
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between space-y-2">
            <div>
              <span className="text-xs text-slate-300 mb-2 block">
                2. {lang === 'en' ? 'Stealing passwords, full names and bank card data online:' : 'Copierea ilegală de către hackeri a parolelor și cardurilor:'}
              </span>
              <select
                value={matches.identity}
                onChange={(e) => {
                  setMatches((p) => ({ ...p, identity: e.target.value }));
                  sounds.playClick();
                }}
                className="w-full bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg text-xs text-white"
              >
                <option value="">{lang === 'en' ? '-- Select --' : '-- Alege noțiunea --'}</option>
                <option value="identity_theft">Furt de identitate</option>
                <option value="email">Mesaj de email</option>
                <option value="browser">Program browser</option>
              </select>
            </div>
            {matches.identity && (
              <AnswerExplanation
                isCorrect={isIdentityCorrect}
                explanationRo={
                  isIdentityCorrect
                    ? 'Exact! Furtul de identitate constă în sustragerea datelor personale pentru uzurparea identității unei persoane.'
                    : matches.identity === 'email'
                    ? 'Emailul este un serviciu legitim de poștă electronică pentru schimbul de mesaje, nu o infracțiune în sine.'
                    : 'Browserul este navigatorul web (ex: Chrome, Edge) folosit pentru a citi pagini de internet, nu o acțiune ilegală.'
                }
                explanationEn={
                  isIdentityCorrect
                    ? 'Spot on! Identity theft involves illicitly capturing personal credentials to impersonate the victim.'
                    : matches.identity === 'email'
                    ? 'Email is a legitimate electronic messaging service, not a cybercrime.'
                    : 'A web browser is an application (like Chrome or Edge) used to browse websites, not an illegal theft act.'
                }
              />
            )}
          </div>

          {/* Item 3 */}
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between space-y-2">
            <div>
              <span className="text-xs text-slate-300 mb-2 block">
                3. {lang === 'en' ? 'Online harassment, persecution and abusive insulting messages:' : 'Persecutarea, jignirea și hărțuirea unei persoane online:'}
              </span>
              <select
                value={matches.bullying}
                onChange={(e) => {
                  setMatches((p) => ({ ...p, bullying: e.target.value }));
                  sounds.playClick();
                }}
                className="w-full bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg text-xs text-white"
              >
                <option value="">{lang === 'en' ? '-- Select --' : '-- Alege noțiunea --'}</option>
                <option value="cyberbullying">Cyberbullying (Hărțuire online)</option>
                <option value="download">Descărcare fișiere</option>
              </select>
            </div>
            {matches.bullying && (
              <AnswerExplanation
                isCorrect={isBullyingCorrect}
                explanationRo={
                  isBullyingCorrect
                    ? 'Corect! Cyberbullying-ul este hărțuirea sau intimidarea prin mijloace digitale. Trebuie raportat imediat!'
                    : 'Descărcarea (download) este operațiunea tehnică de salvare a unui fișier de pe internet pe calculator, nu o formă de agresiune.'
                }
                explanationEn={
                  isBullyingCorrect
                    ? 'Correct! Cyberbullying is harassment carried out via digital channels. Always notify an adult!'
                    : 'Downloading is simply copying a file from the web to your local storage, not a form of harassment.'
                }
              />
            )}
          </div>

          {/* Item 4 */}
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between space-y-2">
            <div>
              <span className="text-xs text-slate-300 mb-2 block">
                4. {lang === 'en' ? 'Protective barrier system blocking unauthorized remote network intrusion:' : 'Sistem de protecție de tip barieră (paravan) împotriva intruziunilor:'}
              </span>
              <select
                value={matches.firewall}
                onChange={(e) => {
                  setMatches((p) => ({ ...p, firewall: e.target.value }));
                  sounds.playClick();
                }}
                className="w-full bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg text-xs text-white"
              >
                <option value="">{lang === 'en' ? '-- Select --' : '-- Alege noțiunea --'}</option>
                <option value="firewall">Firewall (Paravan de protecție)</option>
                <option value="mouse">Mouse optic</option>
              </select>
            </div>
            {matches.firewall && (
              <AnswerExplanation
                isCorrect={isFirewallCorrect}
                explanationRo={
                  isFirewallCorrect
                    ? 'Excelent! Firewall-ul (paravanul de protecție) monitorizează și filtrează traficul de rețea, blocând tentativele neautorizate.'
                    : 'Mouse-ul optic este o piesă hardware periferică pentru indicare și clic pe ecran, nu un sistem de securitate de rețea.'
                }
                explanationEn={
                  isFirewallCorrect
                    ? 'Excellent! A firewall monitors and filters incoming/outgoing network traffic to block unauthorized intrusions.'
                    : 'An optical mouse is an input device used to control the screen pointer, not a network security barrier.'
                }
              />
            )}
          </div>
        </div>

        <QuestionHint
          id="i6-threats-matching"
          hintRo="Consultă regulile de protecție de la paginile 35-36: Viruși = software malițios, Furt de identitate = furt de carduri/date, Hărțuire = cyberbullying, Firewall = barieră de protecție."
          hintEn="Check protection rules on pages 35-36: Virus = malicious software, Identity theft = stealing data, Bullying = harassment, Firewall = protection barrier."
        />
      </div>

      {/* Cyber Safety Checklist for 5th Graders */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-6 shadow-xl space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider text-teal-400 font-mono">
          🛡️ {lang === 'en' ? 'The Digital Safety Oath (Check all 3 commitments):' : 'Angajamentul de Siguranță Digitală (Bifează toate cele 3 reguli de aur):'}
        </h3>
        <div className="space-y-2">
          <label className="flex items-center gap-3 bg-slate-950/70 p-3 rounded-xl border border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={rule1}
              onChange={(e) => {
                setRule1(e.target.checked);
                sounds.playClick();
              }}
              className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
            />
            <span className="text-xs text-slate-300">
              1. {lang === 'en' ? 'I never disclose my passwords, home address or private phone number online.' : 'Nu voi divulga niciodată parolele, adresa sau numărul de telefon pe internet.'}
            </span>
          </label>

          <label className="flex items-center gap-3 bg-slate-950/70 p-3 rounded-xl border border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={rule2}
              onChange={(e) => {
                setRule2(e.target.checked);
                sounds.playClick();
              }}
              className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
            />
            <span className="text-xs text-slate-300">
              2. {lang === 'en' ? 'I never open suspicious links or email attachments from unknown senders.' : 'Nu deschid linkuri suspecte sau fișiere primite pe email de la necunoscuți.'}
            </span>
          </label>

          <label className="flex items-center gap-3 bg-slate-950/70 p-3 rounded-xl border border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={rule3}
              onChange={(e) => {
                setRule3(e.target.checked);
                sounds.playClick();
              }}
              className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
            />
            <span className="text-xs text-slate-300">
              3. {lang === 'en' ? 'If I encounter cyberbullying or uncomfortable messages, I notify a parent or teacher immediately.' : 'Dacă observ mesaje de cyberbullying sau neplăcute, anunț imediat părinții sau profesorul.'}
            </span>
          </label>
        </div>
      </div>

      {/* Page Navigation Footer */}
      <PageNavigationFooter
        score={pageScore}
        totalPoints={20}
        correctCount={correctCount}
        totalQuestions={totalQuestions}
        canProceed={Boolean(passwordInput || matches.virus || matches.firewall || rule1 || rule2 || rule3)}
        onProceed={handleProceed}
        onRetry={handleReset}
        isLastPage={true}
      />
    </div>
  );
};
