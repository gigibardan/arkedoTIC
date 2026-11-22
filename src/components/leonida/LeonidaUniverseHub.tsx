import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Compass,
  Gamepad2,
  Swords,
  MapPin,
  Car,
  Cpu,
  ShieldCheck,
  Sparkles,
  BookOpen,
  Users,
  ChevronDown,
  Play,
  Layers,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';
import { AllMissionId } from '../../types';
import {
  GTA6_FACTS_2026,
  LEONIDA_REGIONS,
  LEONIDA_CAST,
  LEONIDA_VEHICLES,
  LEONIDA_STORY_CHALLENGES,
  LEONIDA_TECH_BRIDGES,
  LEONIDA_FAQS,
  LeonidaDistrictId,
} from '../../data/leonidaOpenWorldData';
import { ViceLeonidaOpenWorld } from '../minigames/ViceLeonidaOpenWorld';
import leonidaHeroImg from '../../assets/images/vice_leonida_hero_art_1795278167604.jpg';
import leonidaMapImg from '../../assets/images/leonida_tactical_map_1795278168340.jpg';
import leonidaDuoImg from '../../assets/images/leonida_duo_agents_1795278168626.jpg';

interface LeonidaUniverseHubProps {
  studentName: string;
  onBackToCatalog: () => void;
  onOpenCyberRunner: () => void;
  onOpenLeonidaDuel: () => void;
  onSelectMission: (missionId: AllMissionId) => void;
  initialLaunchWorld?: boolean;
}

const PIN_POSITIONS: Record<LeonidaDistrictId, { top: string; left: string }> = {
  vice_city: { top: '52%', left: '72%' },
  leonida_keys: { top: '82%', left: '66%' },
  port_gellhorn: { top: '54%', left: '22%' },
  grassrivers: { top: '68%', left: '46%' },
  mount_kalaga: { top: '20%', left: '34%' },
  ambrosia: { top: '26%', left: '66%' },
};

export const LeonidaUniverseHub: React.FC<LeonidaUniverseHubProps> = ({
  studentName,
  onBackToCatalog,
  onOpenCyberRunner,
  onOpenLeonidaDuel,
  onSelectMission,
  initialLaunchWorld = false,
}) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  const [playingOpenWorld, setPlayingOpenWorld] = useState<boolean>(initialLaunchWorld);
  const [selectedDistrict, setSelectedDistrict] = useState<LeonidaDistrictId>('vice_city');
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [heroImgFailed, setHeroImgFailed] = useState(false);
  const [mapImgFailed, setMapImgFailed] = useState(false);
  const [duoImgFailed, setDuoImgFailed] = useState(false);

  const activeRegion = LEONIDA_REGIONS.find((r) => r.id === selectedDistrict) || LEONIDA_REGIONS[0];
  const activeChallenge = LEONIDA_STORY_CHALLENGES.find((c) => c.districtId === selectedDistrict);

  if (playingOpenWorld) {
    return (
      <div className="space-y-4">
        <ViceLeonidaOpenWorld
          studentName={studentName}
          onBack={() => setPlayingOpenWorld(false)}
          onOpenLesson={(missionId) => {
            setPlayingOpenWorld(false);
            onSelectMission(missionId as AllMissionId);
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* 1. HERO SHOWCASE */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-6 relative z-10">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    onBackToCatalog();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isEn ? 'Back to Courses' : 'Înapoi la Cursuri'}</span>
                </button>

                <span className="text-xs font-mono text-fuchsia-300 font-semibold">
                  {isEn
                    ? 'GTA 6 Universe · State of Leonida · 100% Free & Safe'
                    : 'Univers GTA 6 · Statul Leonida · 100% Gratuit'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-[40px] font-black text-white font-heading leading-[1.12] tracking-tight">
                {isEn
                  ? 'Vice Leonida Universe: GTA 6 Open-World & Computer Science Hub'
                  : 'Universul Vice Leonida: Open-World GTA 6 & Tehnologie TIC'}
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                {isEn
                  ? 'Explore all 6 official State of Leonida districts inspired by Grand Theft Auto VI (launched Nov 19, 2026) across 3 playable browser experiences: 2D Open-World Sandbox with Lucia Caminos & Jason Duval, Cyber Runner Arcade, and 1v1 Live PvP Showdown.'
                  : 'Explorează toate cele 6 regiuni din Statul Leonida inspirate din Grand Theft Auto VI (lansat oficial 19 noiembrie 2026) în 3 moduri jucabile gratuit direct în browser: Sandbox Open-World 2D cu Lucia Caminos & Jason Duval, Cyber Runner Arcade și Duel Live 1v1.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setPlayingOpenWorld(true);
                }}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-fuchsia-600 via-rose-500 to-amber-500 hover:from-fuchsia-500 hover:to-amber-400 text-white font-black text-sm inline-flex items-center gap-2 shadow-lg shadow-fuchsia-600/25 cursor-pointer active:scale-[0.98] whitespace-nowrap shrink-0"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{isEn ? 'Play 2D Open-World Now' : 'Joacă Open-World 2D Acum'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onOpenCyberRunner();
                }}
                className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-200 border border-cyan-500/40 font-bold text-sm inline-flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
              >
                <Gamepad2 className="w-4 h-4 text-cyan-400" />
                <span>{isEn ? 'Cyber Runner Arcade' : 'Cyber Runner Arcade'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onOpenLeonidaDuel();
                }}
                className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-rose-200 border border-rose-500/40 font-bold text-sm inline-flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
              >
                <Swords className="w-4 h-4 text-rose-400" />
                <span>{isEn ? '1v1 Live Duel' : 'Duel Live 1v1'}</span>
              </button>
            </div>

            <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs tabular-nums">
              <div>
                <div className="text-slate-400 font-mono">{isEn ? 'GTA 6 Release' : 'Lansare GTA 6'}</div>
                <div className="text-white font-bold mt-0.5">{GTA6_FACTS_2026.releaseDateEn}</div>
              </div>
              <div>
                <div className="text-slate-400 font-mono">{isEn ? 'Districts' : 'Regiuni Harta'}</div>
                <div className="text-cyan-300 font-bold mt-0.5">6 Leonida Zones</div>
              </div>
              <div>
                <div className="text-slate-400 font-mono">{isEn ? 'Vehicles' : 'Vehicule'}</div>
                <div className="text-amber-300 font-bold mt-0.5">5 Cars + Airboat</div>
              </div>
              <div>
                <div className="text-slate-400 font-mono">{isEn ? 'Age Safety' : 'Siguranță'}</div>
                <div className="text-emerald-300 font-bold mt-0.5">{isEn ? 'Zero Violence · STEM' : 'Fără Violență · TIC'}</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full bg-slate-900">
            {!heroImgFailed ? (
              <img
                src={leonidaHeroImg}
                alt={
                  isEn
                    ? 'Vice Leonida Open World sunset highway skyline inspired by GTA 6'
                    : 'Vice Leonida Open World apus neon pe autostrada inspirată din GTA 6'
                }
                onError={() => setHeroImgFailed(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-900 text-fuchsia-300 gap-2">
                <Compass className="w-12 h-12" />
                <span className="text-sm font-bold text-white">State of Leonida · Vice City</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-l from-slate-950/30 via-transparent to-slate-950/90 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* 2. THREE UNIFIED PLAYABLE EXPERIENCES */}
      <section aria-labelledby="leonida-modes-heading" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 id="leonida-modes-heading" className="text-xl sm:text-2xl font-black text-white font-heading">
              {isEn ? '3 Playable GTA 6 Tech Experiences' : 'Cele 3 Experiențe Jucabile GTA 6 Tech'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              {isEn
                ? 'Choose between free-roam Open-World exploration, high-speed lane arcade, or head-to-head multiplayer.'
                : 'Alege între explorarea liberă Open-World, cursa rapidă arcade sau duelul competitiv 1v1 contra colegilor și AI.'}
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400 tabular-nums">
            {isEn ? 'XP & ByteCoins synced to Student Portfolio' : 'XP & ByteCoins sincronizate în Carnet'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <article className="bg-slate-900/90 border-2 border-fuchsia-500/50 rounded-2xl p-5 flex flex-col justify-between gap-4 shadow-xl">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-fuchsia-300 font-bold">
                  {isEn ? 'MODE 01 · OPEN-WORLD 2D' : 'MOD 01 · OPEN-WORLD 2D'}
                </span>
                <span className="text-emerald-300 tabular-nums">+3,500 XP Cap</span>
              </div>
              <h3 className="text-lg font-black text-white font-heading">
                {isEn ? 'Vice Leonida: Open-World Story' : 'Vice Leonida: Open-World Story'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isEn
                  ? 'Free-roam 2600×1800 canvas map across 6 Leonida districts. Steal & swap 5 vehicles (including Hydro-Airboat), evade 1★–5★ VCPD chases, visit safehouses, and beat 6 ICT story hacks.'
                  : 'Hartă liberă 2600×1800 cu 6 regiuni din Leonida. Condu 5 vehicule (inclusiv Hydro-Airboat pe apă), scapă de poliția VCPD 1★–5★, folosește garaje și rezolvă 6 misiuni TIC.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setPlayingOpenWorld(true);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-fuchsia-600 to-rose-500 hover:from-fuchsia-500 hover:to-rose-400 text-white font-bold text-xs inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Compass className="w-4 h-4" />
              <span>{isEn ? 'Launch Open-World Engine' : 'Pornește Lumea Open-World'}</span>
            </button>
          </article>

          <article className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-colors">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-cyan-300 font-bold">
                  {isEn ? 'MODE 02 · ARCADE RUNNER' : 'MOD 02 · ARCADE RUNNER'}
                </span>
                <span className="text-amber-300 tabular-nums">60 FPS · 4 Sectors</span>
              </div>
              <h3 className="text-lg font-black text-white font-heading">
                {isEn ? 'Vice Leonida VI: Cyber Runner' : 'Vice Leonida VI: Cyber Runner'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isEn
                  ? 'Arcade highway sprint from Vice Beach to Venetian Causeway, Port Gellhorn, and Grassrivers Airboat. Dodge laser drones and unlock 4-bit binary Relay Vaults.'
                  : 'Sprint arcade de mare viteză din Vice Beach pe Venetian Causeway, Port Gellhorn și Grassrivers Airboat. Evită dronele laser și sparge seifuri binare pe 4 biți.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onOpenCyberRunner();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Gamepad2 className="w-4 h-4" />
              <span>{isEn ? 'Open Cyber Runner' : 'Deschide Cyber Runner'}</span>
            </button>
          </article>

          <article className="bg-slate-900/90 border border-slate-800 hover:border-rose-500/50 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-colors">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-rose-300 font-bold">
                  {isEn ? 'MODE 03 · 1V1 MULTIPLAYER' : 'MOD 03 · DUEL 1V1 LIVE'}
                </span>
                <span className="text-emerald-300">PvP & AI Bot</span>
              </div>
              <h3 className="text-lg font-black text-white font-heading">
                {isEn ? 'Vice Leonida 1v1: Cyber-Heist' : 'Vice Leonida 1v1: Cyber-Heist'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isEn
                  ? 'Race classmates in real-time Firestore rooms or challenge Cyber-Bot Leonida AI to 2,500 Vault Points using ICT Boost Gates and 4 live cyber sabotages.'
                  : 'Întrece-te live cu colegii în camere Firestore sau contra Cyber-Bot Leonida AI până la 2.500 puncte Vault folosind Boost Gates TIC și 4 sabotaje live.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onOpenLeonidaDuel();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Swords className="w-4 h-4" />
              <span>{isEn ? 'Enter 1v1 Arena' : 'Intră în Arena 1v1'}</span>
            </button>
          </article>
        </div>
      </section>

      {/* 3. INTERACTIVE 6-REGION STATE OF LEONIDA MAP EXPLORER */}
      <section className="bg-slate-950/85 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-heading flex items-center gap-2">
              <MapPin className="w-5 h-5 text-cyan-400 shrink-0" />
              <span>{isEn ? 'Interactive State of Leonida Atlas (6 Regions)' : 'Atlas Interactiv Statul Leonida (6 Regiuni)'}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {isEn
                ? 'Click any confirmed GTA 6 Leonida region on the tactical radar map to inspect its lore, target CS challenge, and local vehicle.'
                : 'Selectează orice regiune confirmată din GTA 6 Leonida pe harta tactică pentru a vedea descrierea, misiunea TIC asociată și vehiculul recomandat.'}
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-300 shrink-0">
            6 / 6 {isEn ? 'Confirmed Locations' : 'Regiuni Confirmate'}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Interactive Map Canvas */}
          <div className="lg:col-span-7 space-y-2.5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 aspect-[16/10]">
              {!mapImgFailed ? (
                <img
                  src={leonidaMapImg}
                  alt={isEn ? 'Tactical neon GPS map of State of Leonida' : 'Hartă tactică GPS a Statului Leonida'}
                  onError={() => setMapImgFailed(true)}
                  className="w-full h-full object-cover opacity-90"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-400 text-xs font-mono">
                  LEONIDA GPS TACTICAL MAP
                </div>
              )}
              <div className="absolute inset-0 bg-slate-950/30 pointer-events-none" />

              {LEONIDA_REGIONS.map((region, idx) => {
                const pos = PIN_POSITIONS[region.id];
                const isSelected = region.id === selectedDistrict;
                return (
                  <button
                    key={region.id}
                    type="button"
                    aria-label={isEn ? region.nameEn : region.nameRo}
                    onClick={() => {
                      sounds.playClick();
                      setSelectedDistrict(region.id);
                    }}
                    style={{ top: pos.top, left: pos.left, transform: 'translate(-50%, -50%)' }}
                    className={`absolute w-8 h-8 sm:w-auto sm:h-auto sm:px-2.5 sm:py-1.5 rounded-full sm:rounded-xl font-bold text-[11px] sm:text-xs transition-all cursor-pointer shadow-lg flex items-center justify-center gap-1.5 whitespace-nowrap ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 scale-110 ring-2 ring-white z-20'
                        : 'bg-slate-950/90 hover:bg-slate-800 text-white border border-slate-600 z-10'
                    }`}
                  >
                    <span className="font-mono">{String(idx + 1).padStart(2, '0')}</span>
                    <span className="hidden sm:inline">{region.nameRo.split('·')[0].trim()}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick District Bar for Mobile (< sm) where map pins show compact numbers */}
            <div className="grid grid-cols-2 sm:hidden gap-1.5">
              {LEONIDA_REGIONS.map((region, idx) => {
                const isSelected = region.id === selectedDistrict;
                return (
                  <button
                    key={region.id}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setSelectedDistrict(region.id);
                    }}
                    className={`px-2.5 py-2 rounded-xl border text-left text-[11px] font-bold flex items-center gap-1.5 cursor-pointer min-h-[38px] ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 border-amber-300'
                        : 'bg-slate-900 text-slate-200 border-slate-800'
                    }`}
                  >
                    <span className="font-mono shrink-0">{String(idx + 1).padStart(2, '0')}</span>
                    <span className="truncate">{region.nameRo.split('·')[0].trim()}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Region Telemetry Dossier */}
          <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="space-y-1">
              <div className="text-xs font-mono text-amber-300 uppercase tracking-wider">
                {isEn ? activeRegion.subtitleEn : activeRegion.subtitleRo}
              </div>
              <h3 className="text-xl font-black text-white font-heading">
                {isEn ? activeRegion.nameEn : activeRegion.nameRo}
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isEn ? activeRegion.descriptionEn : activeRegion.descriptionRo}
            </p>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-xs font-mono text-emerald-300 font-bold">
                {isEn ? 'Linked Curriculum Mission' : 'Misiune Curriculară Asociată'}
              </div>
              <div className="text-xs font-semibold text-white">
                {isEn ? activeRegion.curriculumTopicEn : activeRegion.curriculumTopicRo}
              </div>
              {activeChallenge && (
                <div className="text-[11px] text-slate-400 leading-relaxed">
                  {isEn ? activeChallenge.briefingEn : activeChallenge.briefingRo}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setPlayingOpenWorld(true);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
              >
                <Play className="w-3.5 h-3.5 fill-slate-950" />
                <span>{isEn ? 'Explore in Open-World' : 'Explorează în Joc'}</span>
              </button>

              {activeChallenge && (
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    onSelectMission(activeChallenge.relatedMissionId as AllMissionId);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-cyan-300 font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Open Related Lesson' : 'Lecția Asociată'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. DUO PROTAGONISTS & VERIFIED GTA 6 CAST */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-5 rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 flex flex-col">
          <div className="aspect-[16/10] bg-slate-900 overflow-hidden">
            {!duoImgFailed ? (
              <img
                src={leonidaDuoImg}
                alt={isEn ? 'Lucia Caminos and Jason Duval cyber agents in Vice Leonida' : 'Lucia Caminos și Jason Duval agenți cyber în Vice Leonida'}
                onError={() => setDuoImgFailed(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-fuchsia-300 gap-2">
                <Users className="w-10 h-10" />
                <span className="text-xs font-bold text-white">Lucia Caminos &amp; Jason Duval</span>
              </div>
            )}
          </div>
          <div className="p-5 sm:p-6 space-y-3 flex-1 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="text-xs font-mono text-fuchsia-300 font-bold">
                {isEn ? 'DUAL PROTAGONISTS · LIVE Q SWAP' : 'PROTAGONIȘTI DUALI · SWAP CU TASTA Q'}
              </div>
              <h2 className="text-xl font-black text-white font-heading">
                Lucia Caminos &amp; Jason Duval
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {isEn
                  ? 'Swap live anytime in Open-World and Cyber Runner: Lucia boosts Nitro regeneration, shard points, and terminal decryption speed, while Jason provides tactical handling and a rechargeable Kinetic Shield.'
                  : 'Comută instant între ei în Open-World și Cyber Runner: Lucia accelerează regenerarea Nitro, scorul pe Data Shards și decodarea terminalelor, iar Jason oferă control tactic și Scut Cinetic auto-regenerabil.'}
              </p>
            </div>
            <div className="text-xs font-mono text-slate-400">
              {isEn
                ? `Official GTA 6 Platforms: ${GTA6_FACTS_2026.platforms}`
                : `Platforme oficiale GTA 6: ${GTA6_FACTS_2026.platforms}`}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-slate-950/85 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-lg sm:text-xl font-black text-white font-heading flex items-center gap-2">
              <Users className="w-5 h-5 text-fuchsia-400 shrink-0" />
              <span>
                {isEn
                  ? `Leonida Character Network (${LEONIDA_CAST.length} Official Figures)`
                  : `Rețeaua de Personaje Leonida (${LEONIDA_CAST.length} Figuri Oficiale)`}
              </span>
            </h2>
            <span className="text-xs font-mono text-slate-400">Trailer 2 &amp; Launch Canon</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {LEONIDA_CAST.map((member) => (
              <div
                key={member.id}
                className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-black text-white">{member.name}</span>
                  <span className="text-[11px] font-mono text-cyan-300">
                    {LEONIDA_REGIONS.find((r) => r.id === member.homeDistrict)?.nameRo.split('·')[0].trim()}
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-amber-300">
                  {isEn ? member.roleEn : member.roleRo}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isEn ? member.bioEn : member.bioRo}
                </p>
                <div className="text-[11px] font-mono text-emerald-300 pt-0.5">
                  {isEn ? member.perkEn : member.perkRo}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. VEHICLE FLEET & HARDWARE / ENGINE CURRICULUM BRIDGES */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-slate-950/85 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-lg font-black text-white font-heading flex items-center gap-2">
              <Car className="w-5 h-5 text-amber-400 shrink-0" />
              <span>{isEn ? 'Drivable Fleet (5 Vehicles)' : 'Flota Conducibilă (5 Vehicule)'}</span>
            </h2>
            <span className="text-xs font-mono text-slate-400">E / F Enter-Exit</span>
          </div>

          <div className="space-y-2.5">
            {LEONIDA_VEHICLES.map((v) => (
              <div
                key={v.id}
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-bold text-white truncate">
                    {isEn ? v.nameEn : v.nameRo}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {isEn ? v.categoryEn : v.categoryRo} · {v.canWater ? (isEn ? 'Land + Water' : 'Teren + Apă') : (isEn ? 'Road + Offroad' : 'Șosea')}
                  </div>
                </div>
                <div className="text-right font-mono text-[11px] shrink-0 tabular-nums">
                  <div className="text-cyan-300 font-bold">{v.maxSpeed} px/s</div>
                  <div className="text-slate-400">{v.armor} HP</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7 bg-slate-950/85 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-lg font-black text-white font-heading flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{isEn ? 'GTA 6 Game Tech -> Middle-School ICT Lessons' : 'Tehnologia GTA 6 -> Lecții Oficiale TIC (V–VIII)'}</span>
            </h2>
            <span className="text-xs font-mono text-emerald-300">RAGE Engine &amp; STEM</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {LEONIDA_TECH_BRIDGES.map((tb) => (
              <div
                key={tb.id}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between gap-3"
              >
                <div className="space-y-1.5">
                  <div className="text-[11px] font-mono text-emerald-300 font-bold">
                    {isEn ? tb.curriculumLinkEn : tb.curriculumLinkRo}
                  </div>
                  <h3 className="text-sm font-black text-white leading-snug">
                    {isEn ? tb.techTopicEn : tb.techTopicRo}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {isEn ? tb.gta6FeatureEn : tb.gta6FeatureRo}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    onSelectMission(tb.missionId as AllMissionId);
                  }}
                  className="text-xs font-bold text-cyan-300 hover:text-cyan-200 inline-flex items-center gap-1 cursor-pointer w-fit"
                >
                  <span>{isEn ? 'Launch Interactive Lesson' : 'Deschide Lecția Interactivă'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. BILINGUAL FAQ ACCORDION */}
      <section className="bg-slate-950/85 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3.5">
          <h2 className="text-xl font-black text-white font-heading flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{isEn ? 'Frequently Asked Questions — GTA 6 & Vice Leonida' : 'Întrebări Frecvente — GTA 6 & Universul Vice Leonida'}</span>
          </h2>
          <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isEn ? 'Parent & Teacher Verified' : 'Verificat Părinți & Profesori'}</span>
          </span>
        </div>

        <div className="space-y-2.5">
          {LEONIDA_FAQS.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div
                key={faq.qEn}
                className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setOpenFaqIdx(isOpen ? null : idx);
                  }}
                  aria-expanded={isOpen}
                  className="w-full px-4 py-3.5 text-left flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-900 transition-colors"
                >
                  <span className="text-sm font-bold text-white">
                    {isEn ? faq.qEn : faq.qRo}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-emerald-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/70 pt-3">
                    {isEn ? faq.aEn : faq.aRo}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/70">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              {isEn
                ? 'Zero ads, zero weapons, 100% browser-playable on school lab PCs, laptops & phones.'
                : 'Fără reclame, fără arme reale, 100% gratuit pe calculatoare școlare, laptopuri și telefoane.'}
            </span>
          </div>
          <a
            href="/leonida-llm.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-emerald-300 hover:text-emerald-200 underline underline-offset-2"
          >
            leonida-llm.txt (RAG Index)
          </a>
        </div>
      </section>
    </div>
  );
};
