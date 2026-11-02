import React, { useState, useEffect } from 'react';
import {
  CloudSun,
  Thermometer,
  Droplets,
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
  Monitor,
  Flame,
  Wind
} from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface R2Level4Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

export const R2Level4_IoTWeatherStation: React.FC<R2Level4Props> = ({
  onCompletePage,
  onComplete,
}) => {
  // Environmental sliders
  const [temperature, setTemperature] = useState<number>(24); // °C
  const [humidity, setHumidity] = useState<number>(55); // %
  const [lcdBacklight, setLcdBacklight] = useState<boolean>(true);

  // Challenge checks
  const [testedComfort, setTestedComfort] = useState<boolean>(false);
  const [testedHeatwave, setTestedHeatwave] = useState<boolean>(false);
  const [testedFrost, setTestedFrost] = useState<boolean>(false);

  // Compute thermal comfort index
  let comfortLevel = 'CONFORT OPTIM';
  let comfortColor = 'text-emerald-400';
  let comfortBadge = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';

  if (temperature <= 0) {
    comfortLevel = 'RISC INGHET!';
    comfortColor = 'text-cyan-400';
    comfortBadge = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
  } else if (temperature >= 32 && humidity >= 60) {
    comfortLevel = 'CANICULA PERICOL';
    comfortColor = 'text-red-400';
    comfortBadge = 'bg-red-500/20 text-red-300 border-red-500/40';
  } else if (temperature >= 28) {
    comfortLevel = 'DISCONFORT CALD';
    comfortColor = 'text-amber-400';
    comfortBadge = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
  } else if (temperature < 18) {
    comfortLevel = 'RACOROS';
    comfortColor = 'text-blue-400';
    comfortBadge = 'bg-blue-500/20 text-blue-300 border-blue-500/40';
  }

  // LCD Line text (exact 16 characters per line)
  const padRight = (str: string, len: number) => str.padEnd(len, ' ').slice(0, len);
  const lcdLine1 = padRight(`T:${temperature}°C  H:${humidity}%`, 16);
  const lcdLine2 = padRight(`Idx: ${comfortLevel}`, 16);

  // Check challenges
  useEffect(() => {
    if (temperature >= 20 && temperature <= 25 && humidity >= 40 && humidity <= 60) {
      setTestedComfort(true);
    }
    if (temperature >= 33 && humidity >= 65) {
      setTestedHeatwave(true);
    }
    if (temperature <= 0) {
      setTestedFrost(true);
    }
  }, [temperature, humidity]);

  const allCompleted = testedComfort && testedHeatwave && testedFrost;

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
      <div className="bg-gradient-to-r from-teal-900/40 via-cyan-900/30 to-slate-900/60 border border-teal-500/30 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-teal-500/20 border border-teal-500/40 rounded-xl text-teal-300">
              <CloudSun className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  Modulul 4B • Pasul 4 din 7
                </span>
                <span className="text-xs text-slate-400 font-mono">Manual Art Klett pag. 106–107</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
                Stație Meteo Urbană IoT & Ecran LCD 1602 I2C
              </h1>
              <p className="text-slate-300 text-sm mt-1 max-w-2xl">
                Citește senzorul digital DHT11/22 pentru temperatură și umiditate, calculează indicele de confort termic și afișează datele pe ecranul cu cristale lichide 16x2 caractere via protocolul I2C.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/80 px-4 py-2.5 rounded-xl border border-slate-700/60">
            <div className="text-right">
              <div className="text-xs text-slate-400">Indice Termic</div>
              <div className={`text-sm font-bold font-mono ${comfortColor}`}>{comfortLevel}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual LCD 1602 & Sensor Simulator */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/70 border border-slate-700/60 rounded-2xl p-6 shadow-lg">
            <h2 className="text-base font-semibold text-slate-200 flex items-center justify-between mb-4">
              <span className="flex items-center gap-2">
                <Monitor className="w-5 h-5 text-cyan-400" />
                Display LCD 1602 I2C (Adresă 0x27)
              </span>
              <button
                onClick={() => setLcdBacklight((prev) => !prev)}
                className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1"
              >
                Backlight: {lcdBacklight ? 'ON (Pornit)' : 'OFF (Stins)'}
              </button>
            </h2>

            {/* Simulated LCD Character Matrix */}
            <div className="bg-slate-950 p-4 rounded-2xl border-4 border-slate-800 shadow-2xl flex flex-col items-center">
              {/* Blue / Green LCD Frame */}
              <div
                className={`w-full max-w-md p-4 rounded-xl border-2 transition-all duration-300 ${
                  lcdBacklight
                    ? 'bg-blue-600/90 border-blue-400/60 shadow-[0_0_30px_rgba(37,99,235,0.4)]'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                {/* 16x2 Grid */}
                <div className="font-mono text-lg md:text-xl tracking-[0.25em] text-white font-black select-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] space-y-2">
                  <div className="bg-blue-700/60 px-3 py-1.5 rounded border border-blue-500/40">
                    {lcdLine1}
                  </div>
                  <div className="bg-blue-700/60 px-3 py-1.5 rounded border border-blue-500/40">
                    {lcdLine2}
                  </div>
                </div>
              </div>

              {/* Physical LCD Pin Header */}
              <div className="flex gap-4 mt-3 text-[10px] font-mono text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500" /> VCC (5V)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-black border border-slate-600" /> GND
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-400" /> SDA (A4)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-yellow-400" /> SCL (A5)
                </span>
              </div>
            </div>

            {/* Sliders: Temperature & Humidity */}
            <div className="mt-6 space-y-5">
              {/* Temperature Slider */}
              <div>
                <div className="flex justify-between items-center text-sm font-medium text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Thermometer className="w-4 h-4 text-rose-400" />
                    Temperatură Ambientală (DHT pin D4):
                  </span>
                  <span className="font-mono text-rose-400 font-bold">{temperature}°C</span>
                </div>
                <input
                  type="range"
                  min="-10"
                  max="45"
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>-10°C (Îngheț)</span>
                  <span className="text-emerald-400">22°C (Confort)</span>
                  <span>45°C (Caniculă extremă)</span>
                </div>
              </div>

              {/* Humidity Slider */}
              <div>
                <div className="flex justify-between items-center text-sm font-medium text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Droplets className="w-4 h-4 text-cyan-400" />
                    Umiditate Relativă (%):
                  </span>
                  <span className="font-mono text-cyan-400 font-bold">{humidity}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="95"
                  value={humidity}
                  onChange={(e) => setHumidity(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>10% (Aer foarte uscat)</span>
                  <span className="text-emerald-400">50% (Optim)</span>
                  <span>95% (Aer saturat / Ceață)</span>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => {
                    sounds.playClick();
                    setTemperature(23);
                    setHumidity(50);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700"
                >
                  🌱 Preset Confort (23°C / 50%)
                </button>
                <button
                  onClick={() => {
                    sounds.playClick();
                    setTemperature(37);
                    setHumidity(75);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-red-300 border border-slate-700"
                >
                  ☀️ Preset Caniculă (37°C / 75%)
                </button>
                <button
                  onClick={() => {
                    sounds.playClick();
                    setTemperature(-4);
                    setHumidity(85);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700"
                >
                  ❄️ Preset Îngheț (-4°C / 85%)
                </button>
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
                <Code2 className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold text-slate-200">weather_station_lcd.ino</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">Arduino I2C</span>
            </div>

            <pre className="mt-3 text-[11px] font-mono text-slate-300 leading-relaxed overflow-x-auto bg-slate-900/90 p-3 rounded-xl border border-slate-800/80">
              <code>{`#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <DHT.h>

#define DHTPIN 4
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);
LiquidCrystal_I2C lcd(0x27, 16, 2);

void setup() {
  dht.begin();
  lcd.init();
  lcd.backlight();
}

void loop() {
  float temp = ${temperature};
  float umid = ${humidity};

  lcd.setCursor(0, 0); // Linia 1
  lcd.print("T:");
  lcd.print(temp, 1);
  lcd.print("C  H:");
  lcd.print((int)umid);
  lcd.print("%");

  lcd.setCursor(0, 1); // Linia 2
  lcd.print("${lcdLine2.trim()}");

  delay(2000); // Rata recomandată DHT11
}`}</code>
            </pre>
          </div>

          {/* Educational Checklist */}
          <div className="bg-slate-900/80 border border-slate-700/60 rounded-2xl p-5 shadow-lg space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Misiuni Laborator Stație Meteo
            </h3>
            <p className="text-xs text-slate-300">
              Urmărește cele 3 praguri climatice din manual (pag. 106):
            </p>

            <div className="space-y-2 text-xs">
              <div className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all ${
                testedComfort ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' : 'bg-slate-800/50 border-slate-700 text-slate-400'
              }`}>
                <CheckCircle2 className={`w-4 h-4 shrink-0 ${testedComfort ? 'text-emerald-400' : 'text-slate-600'}`} />
                <span>1. Reglează parametrii pentru Confort Optim (20..25°C, 40..60% umiditate)</span>
              </div>

              <div className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all ${
                testedHeatwave ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' : 'bg-slate-800/50 border-slate-700 text-slate-400'
              }`}>
                <CheckCircle2 className={`w-4 h-4 shrink-0 ${testedHeatwave ? 'text-emerald-400' : 'text-slate-600'}`} />
                <span>2. Declanșează alarma de caniculă (&ge; 33°C și &ge; 65% umiditate)</span>
              </div>

              <div className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all ${
                testedFrost ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' : 'bg-slate-800/50 border-slate-700 text-slate-400'
              }`}>
                <CheckCircle2 className={`w-4 h-4 shrink-0 ${testedFrost ? 'text-emerald-400' : 'text-slate-600'}`} />
                <span>3. Simulează îngheț (&le; 0°C &rarr; mesaj Risc Îngheț pe ecranul LCD)</span>
              </div>
            </div>

            {/* Next Level Button */}
            <div className="pt-2">
              <button
                disabled={!allCompleted}
                onClick={handleFinish}
                className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                  allCompleted
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white cursor-pointer hover:shadow-teal-500/25'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                <span>Continuă spre Nivelul 5: Proiectul Master Hub Smart City</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
