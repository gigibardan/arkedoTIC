import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Building2,
  Clock,
  ShieldAlert,
  Sun,
  Car,
  CloudSun,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Code2,
  Terminal,
  HelpCircle,
  Eye,
  Sliders,
  Flame,
  Activity,
  Layers,
  Zap
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface R2Level5Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

export const R2Level5_SmartCityMasterIntegrator: React.FC<R2Level5Props> = ({
  onCompletePage,
  onComplete,
}) => {
  const { lang } = useLanguage();

  // Master Hub State
  const [useNonBlockingMillis, setUseNonBlockingMillis] = useState<boolean>(true);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [virtualMillis, setVirtualMillis] = useState<number>(12400);

  // Subsystem States
  const [lightStatus, setLightStatus] = useState<'ECO' | 'FULL' | 'OFF'>('ECO');
  const [parkingStatus, setParkingStatus] = useState<'OPEN' | 'CLOSED'>('CLOSED');
  const [gasSafetyStatus, setGasSafetyStatus] = useState<'SAFE' | 'ALARM'>('SAFE');
  const [weatherTemp, setWeatherTemp] = useState<number>(23);

  // Challenge checks
  const [testedMillisToggle, setTestedMillisToggle] = useState<boolean>(false);
  const [testedGasInterruption, setTestedGasInterruption] = useState<boolean>(false);
  const [testedFullCityRun, setTestedFullCityRun] = useState<boolean>(false);

  // Virtual clock runner
  useEffect(() => {
    let timer: any = null;
    if (isRunning) {
      timer = setInterval(() => {
        setVirtualMillis((prev) => prev + 250);
      }, 250);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  // Handle trigger gas leak during operation
  const handleTriggerGasLeak = () => {
    sounds.playClick();
    setGasSafetyStatus('ALARM');
    setTestedGasInterruption(true);
    setTimeout(() => {
      setGasSafetyStatus('SAFE');
    }, 4000);
  };

  const handleToggleTimingMode = (val: boolean) => {
    sounds.playClick();
    setUseNonBlockingMillis(val);
    setTestedMillisToggle(true);
  };

  useEffect(() => {
    if (testedMillisToggle && testedGasInterruption) {
      setTestedFullCityRun(true);
    }
  }, [testedMillisToggle, testedGasInterruption]);

  const allCompleted = testedMillisToggle && testedGasInterruption && testedFullCityRun;

  const handleFinish = () => {
    sounds.playSuccess();
    if (onCompletePage) {
      onCompletePage(100);
    } else if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-violet-900/40 via-purple-900/30 to-slate-900/60 border border-violet-500/30 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-violet-500/20 border border-violet-500/40 rounded-xl text-violet-300">
              <Building2 className="w-8 h-8 text-violet-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  {lang === 'ro' ? 'Modulul 4B • Pasul 5 din 7' : 'Module 4B • Step 5 of 7'}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {lang === 'ro' ? 'Manual Art Klett pag. 107–108' : 'Art Klett Textbook pp. 107–108'}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
                {lang === 'ro'
                  ? 'Master Hub Smart City: Multitasking cu millis() vs delay()'
                  : 'Smart City Master Hub: Multitasking with millis() vs delay()'}
              </h1>
              <p className="text-slate-300 text-sm mt-1 max-w-2xl">
                {lang === 'ro'
                  ? 'Integrează toate cele 4 subsisteme urbane într-un singur microcontroller folosind temporizarea non-blocantă cu funcția millis(), prevenind blocarea catastrofală a alarmelor de securitate.'
                  : 'Integrate all 4 urban subsystems into a single microcontroller using non-blocking timing with the millis() function, preventing catastrophic blocking of safety alarms.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/80 px-4 py-2.5 rounded-xl border border-slate-700/60">
            <div className="text-right">
              <div className="text-xs text-slate-400">
                {lang === 'ro' ? 'Ceas millis() Placă' : 'Board millis() Clock'}
              </div>
              <div className="text-sm font-bold font-mono text-violet-400">
                {virtualMillis} ms ({(virtualMillis / 1000).toFixed(1)}s)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual City Grid Dashboard */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/70 border border-slate-700/60 rounded-2xl p-6 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
                <Eye className="w-5 h-5 text-violet-400" />
                {lang === 'ro'
                  ? 'Matricea celor 4 Noduri Urbane Inteligente'
                  : 'Matrix of the 4 Smart Urban Nodes'}
              </h2>

              {/* Mode Toggle */}
              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => handleToggleTimingMode(true)}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    useNonBlockingMillis
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang === 'ro' ? 'millis() Non-Blocant' : 'millis() Non-Blocking'}
                </button>
                <button
                  onClick={() => handleToggleTimingMode(false)}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    !useNonBlockingMillis
                      ? 'bg-red-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang === 'ro' ? 'delay() Blocant (Capcană)' : 'delay() Blocking (Trap)'}
                </button>
              </div>
            </div>

            {/* Visual 4-Node City Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Node 1: Smart Streetlight */}
              <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-300 flex items-center gap-1.5">
                    <Sun className="w-4 h-4 text-amber-400" />
                    {lang === 'ro' ? 'Nod 1: Iluminat' : 'Node 1: Streetlights'}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                    PWM D9
                  </span>
                </div>
                <div className="my-3 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-[0_0_8px_#facc15] animate-pulse" />
                  <span className="text-sm font-bold text-white">
                    {lang === 'ro' ? 'Stare: Eco Dimmed (30%)' : 'State: Eco Dimmed (30%)'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  {lang === 'ro' ? 'Verificare la fiecare 200ms' : 'Check every 200ms'}
                </div>
              </div>

              {/* Node 2: Smart Parking Gate */}
              <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-blue-300 flex items-center gap-1.5">
                    <Car className="w-4 h-4 text-blue-400" />
                    {lang === 'ro' ? 'Nod 2: Barieră' : 'Node 2: Barrier Gate'}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono">
                    Servo D10
                  </span>
                </div>
                <div className="my-3 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
                  <span className="text-sm font-bold text-white">
                    {lang === 'ro' ? 'Poziție: Închis (0°) • 3 locuri' : 'Position: Closed (0°) • 3 spots'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  {lang === 'ro' ? 'Scanare ultrasonică la 100ms' : 'Ultrasonic scan every 100ms'}
                </div>
              </div>

              {/* Node 3: Gas & Fire Safety */}
              <div
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  gasSafetyStatus === 'ALARM'
                    ? 'bg-red-950/40 border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                    : 'bg-slate-950/80 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-rose-300 flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-rose-400" />
                    {lang === 'ro' ? 'Nod 3: Gaz & Foc' : 'Node 3: Gas & Fire'}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono">
                    MQ-2 A0
                  </span>
                </div>
                <div className="my-3 flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      gasSafetyStatus === 'ALARM'
                        ? 'bg-red-500 shadow-[0_0_12px_#ef4444] animate-ping'
                        : 'bg-emerald-500 shadow-[0_0_8px_#10b981]'
                    }`}
                  />
                  <span
                    className={`text-sm font-bold ${
                      gasSafetyStatus === 'ALARM' ? 'text-red-300' : 'text-white'
                    }`}
                  >
                    {gasSafetyStatus === 'ALARM'
                      ? lang === 'ro'
                        ? '🚨 SCURGERE GAZ!'
                        : '🚨 GAS LEAK!'
                      : lang === 'ro'
                      ? 'Sigur (180 ADC)'
                      : 'Safe (180 ADC)'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  {lang === 'ro'
                    ? 'Citire critică prioritară la 50ms'
                    : 'Critical priority read at 50ms'}
                </div>
              </div>

              {/* Node 4: Weather Station */}
              <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-teal-300 flex items-center gap-1.5">
                    <CloudSun className="w-4 h-4 text-teal-400" />
                    {lang === 'ro' ? 'Nod 4: Stație Meteo' : 'Node 4: Weather Station'}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-mono">
                    LCD I2C
                  </span>
                </div>
                <div className="my-3 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-teal-400 shadow-[0_0_8px_#2dd4bf]" />
                  <span className="text-sm font-bold text-white">
                    {lang === 'ro' ? '23.5°C • 52% Umiditate' : '23.5°C • 52% Humidity'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  {lang === 'ro' ? 'Actualizare ecran la 2000ms' : 'Screen refresh every 2000ms'}
                </div>
              </div>
            </div>

            {/* Interactive Simulation Trigger */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={handleTriggerGasLeak}
                className="px-4 py-2.5 rounded-xl font-bold text-xs bg-red-600 hover:bg-red-500 text-white shadow-lg flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
              >
                <Flame className="w-4 h-4" />
                {lang === 'ro'
                  ? 'Simulează Urgență Gaz în Timp Ce Bariera Funcționează'
                  : 'Simulate Gas Emergency While Barrier Operates'}
              </button>

              <div className="text-xs text-slate-400 font-mono">
                {useNonBlockingMillis ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    {lang === 'ro'
                      ? 'Sincronizare perfectă: 0ms latență'
                      : 'Perfect synchronization: 0ms latency'}
                  </span>
                ) : (
                  <span className="text-red-400 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" />
                    {lang === 'ro'
                      ? 'Blocaj delay: Alarma a întârziat 3000ms!'
                      : 'delay blocking: Alarm delayed by 3000ms!'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: C++ Source & Educational Protocol */}
        <div className="lg:col-span-5 space-y-6">
          {/* C++ Code Box */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-violet-400" />
                <span className="text-xs font-mono font-bold text-slate-200">smart_city_master_hub.ino</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">Multitasking C++</span>
            </div>

            <pre className="mt-3 text-[11px] font-mono text-slate-300 leading-relaxed overflow-x-auto bg-slate-900/90 p-3 rounded-xl border border-slate-800/80">
              <code>{`// ${lang === 'ro' ? 'Timpi independenți pentru multitasking' : 'Independent timestamps for cooperative multitasking'}
unsigned long prevTimeLight = 0;
unsigned long prevTimeBarrier = 0;
unsigned long prevTimeWeather = 0;

void setup() {
  initStreetlight();
  initBarrier();
  initGasSafetySystem();
  initLCD();
}

void loop() {
  unsigned long now = millis();

  // 1. ${lang === 'ro' ? 'Siguranță Gaz (verificare la FIECARE iterație!)' : 'Gas Safety (check on EVERY single iteration!)'}
  checkGasSafetyUrgent();

  // 2. ${lang === 'ro' ? 'Control Lampa (la fiecare 200 ms)' : 'Streetlight PWM (every 200 ms)'}
  if (now - prevTimeLight >= 200) {
    prevTimeLight = now;
    updateStreetlightPWM();
  }

  // 3. ${lang === 'ro' ? 'Bariera Parcare (la fiecare 100 ms)' : 'Parking Barrier (every 100 ms)'}
  if (now - prevTimeBarrier >= 100) {
    prevTimeBarrier = now;
    scanParkingVehicles();
  }

  // 4. ${lang === 'ro' ? 'Afisaj LCD Meteo (la fiecare 2000 ms)' : 'Weather LCD Display (every 2000 ms)'}
  if (now - prevTimeWeather >= 2000) {
    prevTimeWeather = now;
    displayWeatherMetricsLCD();
  }
}`}</code>
            </pre>
          </div>

          {/* Educational Checklist */}
          <div className="bg-slate-900/80 border border-slate-700/60 rounded-2xl p-5 shadow-lg space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-400" />
              {lang === 'ro' ? 'Misiuni de Integrare Master Hub' : 'Master Hub Integration Missions'}
            </h3>
            <p className="text-xs text-slate-300">
              {lang === 'ro'
                ? 'Înțelege diferența critică de arhitectură software (pag. 108):'
                : 'Understand the critical software architecture difference (p. 108):'}
            </p>

            <div className="space-y-2 text-xs">
              <div
                className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all ${
                  testedMillisToggle
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                    : 'bg-slate-800/50 border-slate-700 text-slate-400'
                }`}
              >
                <CheckCircle2
                  className={`w-4 h-4 shrink-0 ${testedMillisToggle ? 'text-emerald-400' : 'text-slate-600'}`}
                />
                <span>
                  {lang === 'ro'
                    ? '1. Compară modul millis() non-blocant cu modul delay() blocant'
                    : '1. Compare non-blocking millis() mode with blocking delay() mode'}
                </span>
              </div>

              <div
                className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all ${
                  testedGasInterruption
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                    : 'bg-slate-800/50 border-slate-700 text-slate-400'
                }`}
              >
                <CheckCircle2
                  className={`w-4 h-4 shrink-0 ${testedGasInterruption ? 'text-emerald-400' : 'text-slate-600'}`}
                />
                <span>
                  {lang === 'ro'
                    ? '2. Simulează o urgență de gaz și verifică prioritatea instantanee'
                    : '2. Simulate a gas emergency and verify instantaneous priority'}
                </span>
              </div>

              <div
                className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all ${
                  testedFullCityRun
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                    : 'bg-slate-800/50 border-slate-700 text-slate-400'
                }`}
              >
                <CheckCircle2
                  className={`w-4 h-4 shrink-0 ${testedFullCityRun ? 'text-emerald-400' : 'text-slate-600'}`}
                />
                <span>
                  {lang === 'ro'
                    ? '3. Verifică rularea concurentă a tuturor celor 4 subsisteme Smart City'
                    : '3. Verify concurrent execution of all 4 Smart City subsystems'}
                </span>
              </div>
            </div>

            {/* Next Level Button */}
            <div className="pt-2">
              <button
                disabled={!allCompleted}
                onClick={handleFinish}
                className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                  allCompleted
                    ? 'bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-400 hover:to-purple-400 text-white cursor-pointer hover:shadow-violet-500/25'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                <span>
                  {lang === 'ro'
                    ? 'Continuă spre Nivelul 6: Clinica de Debugging IoT'
                    : 'Continue to Level 6: IoT Debugging Clinic'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
