import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Crown, 
  Medal, 
  Flame, 
  Sparkles, 
  Gamepad2, 
  BookOpen, 
  Star, 
  Search, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp, 
  Info, 
  User, 
  CheckCircle2, 
  Layers
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { StudentProfile } from '../types';
import { getAllStudents, getActiveStudent, computeLessonXP } from '../lib/studentAuthService';
import { sounds } from '../utils/audio';

interface LeaderboardSectionProps {
  currentStudentName: string;
  onOpenArcade?: () => void;
  onOpenLoginModal?: () => void;
}

type TabType = 'total' | 'arcade' | 'lessons';

export const LeaderboardSection: React.FC<LeaderboardSectionProps> = ({
  currentStudentName,
  onOpenArcade,
  onOpenLoginModal
}) => {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>('total');
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAllRows, setShowAllRows] = useState<boolean>(false);
  const [selectedStudentForDetails, setSelectedStudentForDetails] = useState<StudentProfile | null>(null);

  const fetchLeaderboard = async () => {
    setLoading(true);
    const data = await getAllStudents();
    setStudents(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  // Sort according to tab
  const sortedStudents = [...students].sort((a, b) => {
    if (activeTab === 'total') {
      const aTotal = a.totalXP || ((a.arcadeScores?.totalArcade || 0) + (a.lessonsProgress?.totalLessonScore || 0));
      const bTotal = b.totalXP || ((b.arcadeScores?.totalArcade || 0) + (b.lessonsProgress?.totalLessonScore || 0));
      return bTotal - aTotal;
    }
    if (activeTab === 'arcade') {
      return (b.arcadeScores?.totalArcade || 0) - (a.arcadeScores?.totalArcade || 0);
    }
    // lessons
    return (b.lessonsProgress?.totalLessonScore || 0) - (a.lessonsProgress?.totalLessonScore || 0);
  });

  const filteredStudents = sortedStudents.filter((s) => 
    s.username.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const topThree = filteredStudents.slice(0, 3);
  const remainingStudents = showAllRows ? filteredStudents.slice(3) : filteredStudents.slice(3, 10);

  const getScoreValue = (student: StudentProfile) => {
    if (activeTab === 'total') {
      return student.totalXP || ((student.arcadeScores?.totalArcade || 0) + (student.lessonsProgress?.totalLessonScore || 0));
    }
    if (activeTab === 'arcade') {
      return student.arcadeScores?.totalArcade || 0;
    }
    return student.lessonsProgress?.totalLessonScore || 0;
  };

  const getTabLabel = () => {
    if (activeTab === 'total') return lang === 'en' ? 'Total XP' : 'Total XP';
    if (activeTab === 'arcade') return lang === 'en' ? 'Arcade Pts' : 'Puncte Arcade';
    return lang === 'en' ? 'Lesson Pts' : 'Puncte Lecții';
  };

  return (
    <div className="bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950 border-2 border-indigo-500/30 rounded-3xl p-5 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-0"></div>
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-0"></div>

      <div className="relative z-10 flex flex-col gap-6">
        {/* Header Section with Title, Tabs and Refresh */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 shadow-md">
                <Trophy className="w-5 h-5 fill-slate-950" />
              </div>
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-amber-400">
                {lang === 'en' ? 'Classroom Hall of Fame' : 'Clasamentul Campionilor TIC'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
              {lang === 'en' ? 'Live Student Leaderboard' : 'Topul Elevilor & Recorduri'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {lang === 'en' 
                ? 'Scores update dynamically across lab sessions. Compete in 10 Arcade Mini-Games & Mastery Lessons!'
                : 'Salvat în Cloud între ore. Competiție la cele 10 Jocuri Arcade și Misiunile din Manual!'}
            </p>
          </div>

          {/* Action Tabs & Refresh */}
          <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
            <div className="bg-slate-950 p-1 rounded-2xl border border-slate-800 flex items-center gap-1">
              <button
                onClick={() => {
                  setActiveTab('total');
                  sounds.playClick();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'total'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Total XP' : 'Total General'}</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('arcade');
                  sounds.playClick();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'arcade'
                    ? 'bg-indigo-600 text-white shadow-md font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Gamepad2 className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Arcade (10)' : 'Jocuri (10)'}</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('lessons');
                  sounds.playClick();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'lessons'
                    ? 'bg-teal-600 text-white shadow-md font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Lessons' : 'Lecții'}</span>
              </button>
            </div>

            <button
              onClick={() => {
                sounds.playClick();
                fetchLeaderboard();
              }}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
              title={lang === 'en' ? 'Refresh Leaderboard' : 'Actualizează Clasamentul'}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-teal-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Top 3 Olympic Podium View */}
        {filteredStudents.length > 0 ? (
          <div className="pt-4 pb-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end max-w-3xl mx-auto">
              {/* Silver - 2nd Place */}
              {topThree[1] ? (
                <div 
                  onClick={() => setSelectedStudentForDetails(topThree[1])}
                  className="order-2 md:order-1 bg-slate-950/70 border-2 border-slate-700 hover:border-slate-500 rounded-3xl p-4 sm:p-5 flex flex-col items-center text-center cursor-pointer transition-all hover:scale-102 relative group shadow-xl"
                >
                  <div className="absolute -top-3 px-3 py-0.5 rounded-full bg-slate-700 border border-slate-500 text-slate-200 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                    <Medal className="w-3 h-3 text-slate-300" />
                    <span>#2 {lang === 'en' ? 'Silver' : 'Argint'}</span>
                  </div>

                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-700 to-slate-500 flex items-center justify-center text-3xl shadow-lg mt-2 mb-2">
                    {topThree[1].avatar || '🎓'}
                  </div>

                  <h4 className="text-sm sm:text-base font-black text-white font-heading truncate max-w-full">
                    {topThree[1].username}
                  </h4>

                  <div className="mt-1 text-lg font-black text-slate-300 font-mono">
                    {getScoreValue(topThree[1]).toLocaleString()}
                    <span className="text-[10px] text-slate-500 ml-1 font-sans">{getTabLabel()}</span>
                  </div>

                  <span className="text-[10px] text-teal-400 mt-2 font-mono group-hover:underline flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    {lang === 'en' ? 'View 10 games' : 'Vezi detalii'}
                  </span>
                </div>
              ) : (
                <div className="order-2 md:order-1 h-36 border-2 border-dashed border-slate-800 rounded-3xl flex items-center justify-center text-slate-600 text-xs font-mono">
                  #2 {lang === 'en' ? 'Awaiting' : 'În așteptare'}
                </div>
              )}

              {/* Gold - 1st Place */}
              {topThree[0] ? (
                <div 
                  onClick={() => setSelectedStudentForDetails(topThree[0])}
                  className="order-1 md:order-2 bg-gradient-to-b from-amber-500/15 via-slate-950/90 to-slate-950 border-2 border-amber-400 shadow-2xl shadow-amber-500/20 rounded-3xl p-5 sm:p-6 flex flex-col items-center text-center cursor-pointer transition-all hover:scale-105 relative group md:-translate-y-2 ring-2 ring-amber-400/30"
                >
                  <div className="absolute -top-3.5 px-3.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[11px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                    <Crown className="w-3.5 h-3.5 fill-current" />
                    <span>#1 {lang === 'en' ? 'Champion' : 'Campion'}</span>
                  </div>

                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-4xl shadow-xl shadow-amber-500/30 mt-2 mb-2 animate-bounce-slow">
                    {topThree[0].avatar || '👑'}
                  </div>

                  <h4 className="text-base sm:text-lg font-black text-amber-200 font-heading truncate max-w-full">
                    {topThree[0].username}
                  </h4>

                  <div className="mt-1 text-2xl font-black text-amber-400 font-mono tracking-tight">
                    {getScoreValue(topThree[0]).toLocaleString()}
                    <span className="text-xs text-amber-300/80 ml-1.5 font-sans font-bold">{getTabLabel()}</span>
                  </div>

                  <span className="text-[10px] text-amber-300 mt-2 font-mono group-hover:underline flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    {lang === 'en' ? 'View 10 games' : 'Vezi detalii scoruri'}
                  </span>
                </div>
              ) : (
                <div className="order-1 md:order-2 h-44 border-2 border-dashed border-amber-500/30 rounded-3xl flex items-center justify-center text-amber-500/40 text-xs font-mono">
                  #1 {lang === 'en' ? 'Awaiting Champion' : 'Fii primul campion!'}
                </div>
              )}

              {/* Bronze - 3rd Place */}
              {topThree[2] ? (
                <div 
                  onClick={() => setSelectedStudentForDetails(topThree[2])}
                  className="order-3 md:order-3 bg-slate-950/70 border-2 border-amber-800/80 hover:border-amber-700 rounded-3xl p-4 sm:p-5 flex flex-col items-center text-center cursor-pointer transition-all hover:scale-102 relative group shadow-xl"
                >
                  <div className="absolute -top-3 px-3 py-0.5 rounded-full bg-amber-900 border border-amber-700 text-amber-200 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                    <Medal className="w-3 h-3 text-amber-500" />
                    <span>#3 {lang === 'en' ? 'Bronze' : 'Bronz'}</span>
                  </div>

                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-700 to-amber-900 flex items-center justify-center text-3xl shadow-lg mt-2 mb-2">
                    {topThree[2].avatar || '🥉'}
                  </div>

                  <h4 className="text-sm sm:text-base font-black text-white font-heading truncate max-w-full">
                    {topThree[2].username}
                  </h4>

                  <div className="mt-1 text-lg font-black text-amber-400 font-mono">
                    {getScoreValue(topThree[2]).toLocaleString()}
                    <span className="text-[10px] text-slate-500 ml-1 font-sans">{getTabLabel()}</span>
                  </div>

                  <span className="text-[10px] text-teal-400 mt-2 font-mono group-hover:underline flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    {lang === 'en' ? 'View 10 games' : 'Vezi detalii'}
                  </span>
                </div>
              ) : (
                <div className="order-3 md:order-3 h-36 border-2 border-dashed border-slate-800 rounded-3xl flex items-center justify-center text-slate-600 text-xs font-mono">
                  #3 {lang === 'en' ? 'Awaiting' : 'În așteptare'}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-10 bg-slate-950/60 rounded-2xl border border-slate-800">
            <div className="text-3xl mb-2">🏆✨</div>
            <p className="text-sm text-slate-300 font-medium">
              {lang === 'en' 
                ? 'No registered scores yet! Play any Arcade game or Lesson to take the #1 spot!'
                : 'Niciun scor înregistrat încă! Joacă un joc din Arcade sau începe o lecție pentru a ocupa Locul 1!'}
            </p>
          </div>
        )}

        {/* Search and Table of All Students */}
        {filteredStudents.length > 3 && (
          <div className="flex flex-col gap-3 pt-2">
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>{lang === 'en' ? 'All Cadet Rankings (4+)' : 'Toate Pozițiile Elevilor'}</span>
              </div>

              {/* Quick Search */}
              <div className="relative w-48 sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={lang === 'en' ? 'Search student...' : 'Caută elev...'}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Cadet rows */}
            <div className="flex flex-col gap-2">
              {remainingStudents.map((student, idx) => {
                const rank = idx + 4;
                const isCurrent = currentStudentName && student.username.toLowerCase() === currentStudentName.toLowerCase();
                const score = getScoreValue(student);

                return (
                  <div
                    key={student.id}
                    onClick={() => setSelectedStudentForDetails(student)}
                    className={`p-3 rounded-2xl border transition flex items-center justify-between gap-3 cursor-pointer ${
                      isCurrent
                        ? 'bg-indigo-950/40 border-indigo-500/80 ring-2 ring-indigo-500/30'
                        : 'bg-slate-950/80 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-slate-400 flex items-center justify-center">
                        #{rank}
                      </div>
                      <div className="text-xl">{student.avatar || '🎓'}</div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs sm:text-sm font-bold text-white">
                            {student.username}
                          </span>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-[10px] font-bold text-indigo-300 font-mono">
                              {lang === 'en' ? 'YOU' : 'TU'}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {student.arcadeScores?.totalArcade ? `${student.arcadeScores.totalArcade} pts arcade` : '0 arcade'} • {student.lessonsProgress?.totalLessonScore ? `${student.lessonsProgress.totalLessonScore} pts lecții` : '0 lecții'}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-black text-amber-400 font-mono">
                        {score.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {getTabLabel()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredStudents.length > 10 && (
              <button
                onClick={() => setShowAllRows(!showAllRows)}
                className="self-center mt-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
              >
                {showAllRows ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    <span>{lang === 'en' ? 'Show Top 10 only' : 'Afișează doar Top 10'}</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    <span>{lang === 'en' ? `Show all (${filteredStudents.length})` : `Arată toți elevii (${filteredStudents.length})`}</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {/* POPUP MODAL: 10 ARCADE GAMES BREAKDOWN FOR A STUDENT */}
      {selectedStudentForDetails && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-indigo-500/40 rounded-3xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-2xl shadow">
                  {selectedStudentForDetails.avatar || '🎓'}
                </div>
                <div>
                  <h3 className="text-base font-black text-white font-heading">
                    {selectedStudentForDetails.username}
                  </h3>
                  <div className="text-xs text-amber-400 font-mono font-bold">
                    Total XP: {selectedStudentForDetails.totalXP?.toLocaleString() || 0} pts
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudentForDetails(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Breakdown of 10 Arcade Games */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-indigo-400 mb-3 flex items-center gap-1.5">
                <Gamepad2 className="w-4 h-4" />
                <span>{lang === 'en' ? 'All 10 Arcade Games Performance' : 'Defalcare Recorduri - Cele 10 Jocuri Arcade'}</span>
              </h4>

              <div className="grid grid-cols-2 gap-2.5 text-xs">
                {/* 1. Typing */}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">⌨️ Typing Sprint</span>
                  <span className="font-mono font-bold text-cyan-300">
                    {selectedStudentForDetails.arcadeScores?.typing || 0} WPM
                  </span>
                </div>

                {/* 2. Mouse Agility */}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">🖱️ Mouse Agility</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {selectedStudentForDetails.arcadeScores?.mouse || 0} pts
                  </span>
                </div>

                {/* 3. 2048 Bitwise */}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">🔢 2048 Bitwise</span>
                  <span className="font-mono font-bold text-amber-400">
                    {selectedStudentForDetails.arcadeScores?.game2048 || 0} pts
                  </span>
                </div>

                {/* 4. PC Builder */}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">🛠️ PC Builder</span>
                  <span className="font-mono font-bold text-blue-400">
                    {selectedStudentForDetails.arcadeScores?.pcbuilder || 0} pts
                  </span>
                </div>

                {/* 5. Cyber Detective */}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">🛡️ Cyber Detective</span>
                  <span className="font-mono font-bold text-rose-400">
                    {selectedStudentForDetails.arcadeScores?.detective || 0} pts
                  </span>
                </div>

                {/* 6. Files Organizer */}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">📁 File Organizer</span>
                  <span className="font-mono font-bold text-yellow-400">
                    {selectedStudentForDetails.arcadeScores?.files || 0} pts
                  </span>
                </div>

                {/* 7. Binary Factory */}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">💡 Binary Factory</span>
                  <span className="font-mono font-bold text-orange-400">
                    {selectedStudentForDetails.arcadeScores?.binary_factory || 0} pts
                  </span>
                </div>

                {/* 8. Algorithm Maze */}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">🧩 Algo Maze</span>
                  <span className="font-mono font-bold text-purple-400">
                    {selectedStudentForDetails.arcadeScores?.maze || 0} pts
                  </span>
                </div>

                {/* 9. Firewall Defender */}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">🔥 Firewall Defender</span>
                  <span className="font-mono font-bold text-red-400">
                    {selectedStudentForDetails.arcadeScores?.firewall || 0} pts
                  </span>
                </div>

                {/* 10. RGB Pixel Master */}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">🎨 RGB Pixel Master</span>
                  <span className="font-mono font-bold text-teal-400">
                    {selectedStudentForDetails.arcadeScores?.rgb_pixel || 0} pts
                  </span>
                </div>

                {/* 11. Byte Slider 3x3 */}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">🧩 Byte Slider 3×3</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {selectedStudentForDetails.arcadeScores?.byte_slider || 0} pts
                  </span>
                </div>

                {/* 12. File-Drop (Tetris cu Fișiere) */}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">⚡ File-Drop (Tetris)</span>
                  <span className="font-mono font-bold text-sky-400">
                    {selectedStudentForDetails.arcadeScores?.file_drop || 0} pts
                  </span>
                </div>

                {/* 13. Cyber-Safe Minesweeper (Căutătorul de Viruși) */}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center col-span-2">
                  <span className="text-slate-400">☣️ Cyber-Safe (Căutătorul de Viruși)</span>
                  <span className="font-mono font-bold text-rose-400">
                    {selectedStudentForDetails.arcadeScores?.virus_sweeper || 0} pts
                  </span>
                </div>
              </div>

              <div className="mt-3 p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex justify-between items-center text-xs">
                <span className="font-bold text-indigo-300">
                  {lang === 'en' ? 'Total Arcade Games Score:' : 'Punctaj Total Mini-Jocuri (13):'}
                </span>
                <span className="font-mono font-black text-sm text-indigo-200">
                  {selectedStudentForDetails.arcadeScores?.totalArcade || 0} pts
                </span>
              </div>
            </div>

            {/* Breakdown of Practical Lessons */}
            <div className="border-t border-slate-800 pt-4">
              <h4 className="text-xs font-mono uppercase tracking-wider text-teal-400 mb-3 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span>{lang === 'en' ? 'Textbook Interactive Missions' : 'Misiuni Interactive din Manual'}</span>
              </h4>

              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-slate-300 font-medium">💻 Hardware</span>
                    {selectedStudentForDetails.lessonsProgress?.hardware?.elapsedSeconds ? (
                      <span className="text-[10px] text-slate-500 font-mono">
                        ⏱️ {selectedStudentForDetails.lessonsProgress.hardware.elapsedSeconds}s
                      </span>
                    ) : null}
                  </div>
                  <span className="font-mono font-bold text-teal-300">
                    {computeLessonXP(selectedStudentForDetails.lessonsProgress?.hardware || {})} pts
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-slate-300 font-medium">📁 Arbore Fișiere</span>
                    {selectedStudentForDetails.lessonsProgress?.files?.elapsedSeconds ? (
                      <span className="text-[10px] text-slate-500 font-mono">
                        ⏱️ {selectedStudentForDetails.lessonsProgress.files.elapsedSeconds}s
                      </span>
                    ) : null}
                  </div>
                  <span className="font-mono font-bold text-teal-300">
                    {computeLessonXP(selectedStudentForDetails.lessonsProgress?.files || {})} pts
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-slate-300 font-medium">🌐 Internet 1 (WWW)</span>
                    {selectedStudentForDetails.lessonsProgress?.internet1?.elapsedSeconds ? (
                      <span className="text-[10px] text-slate-500 font-mono">
                        ⏱️ {selectedStudentForDetails.lessonsProgress.internet1.elapsedSeconds}s
                      </span>
                    ) : null}
                  </div>
                  <span className="font-mono font-bold text-teal-300">
                    {computeLessonXP(selectedStudentForDetails.lessonsProgress?.internet1 || {})} pts
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-slate-300 font-medium">🛡️ Internet 2 (Siguranță)</span>
                    {selectedStudentForDetails.lessonsProgress?.internet2?.elapsedSeconds ? (
                      <span className="text-[10px] text-slate-500 font-mono">
                        ⏱️ {selectedStudentForDetails.lessonsProgress.internet2.elapsedSeconds}s
                      </span>
                    ) : null}
                  </div>
                  <span className="font-mono font-bold text-teal-300">
                    {computeLessonXP(selectedStudentForDetails.lessonsProgress?.internet2 || {})} pts
                  </span>
                </div>
              </div>
            </div>

            {/* Close modal button */}
            <div className="pt-2">
              <button
                onClick={() => setSelectedStudentForDetails(null)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer"
              >
                {lang === 'en' ? 'Close Window' : 'Închide'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
