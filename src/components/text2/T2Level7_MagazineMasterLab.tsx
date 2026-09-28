import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  Table, 
  Image as ImageIcon, 
  Shapes, 
  Layers, 
  Sliders, 
  ArrowRight,
  ShieldCheck,
  Type,
  Palette
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';

interface T2Level7_MagazineMasterLabProps {
  onCompletePage: (earnedScore: number) => void;
}

export const T2Level7_MagazineMasterLab: React.FC<T2Level7_MagazineMasterLabProps> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Master Document Editor State
  const [headerActive, setHeaderActive] = useState<boolean>(false);
  const [footerActive, setFooterActive] = useState<boolean>(false);
  
  // Image styling
  const [hasImage, setHasImage] = useState<boolean>(false);
  const [imageWrapping, setImageWrapping] = useState<'inline' | 'square' | 'behind'>('inline');
  const [aspectRatioFixed, setAspectRatioFixed] = useState<boolean>(false);

  // Table styling
  const [hasTable, setHasTable] = useState<boolean>(false);
  const [isTableTitleMerged, setIsTableTitleMerged] = useState<boolean>(false);
  const [tableHeaderShaded, setTableHeaderShaded] = useState<boolean>(false);
  const [tableCentered, setTableCentered] = useState<boolean>(false);

  // Shape Badge
  const [hasBadgeShape, setHasBadgeShape] = useState<boolean>(false);

  // Criteria Verification
  const c1_headerFooter = headerActive && footerActive;
  const c2_imageWrap = hasImage && imageWrapping === 'square' && aspectRatioFixed;
  const c3_tableMerged = hasTable && isTableTitleMerged;
  const c4_tableShading = hasTable && tableHeaderShaded;
  const c5_tableAlignment = hasTable && tableCentered;
  const c6_shapeBadge = hasBadgeShape;

  const passedCriteriaCount = [
    c1_headerFooter,
    c2_imageWrap,
    c3_tableMerged,
    c4_tableShading,
    c5_tableAlignment,
    c6_shapeBadge
  ].filter(Boolean).length;

  const totalCriteria = 6;
  const isMasterDocumentReady = passedCriteriaCount === totalCriteria;

  // Final score for Lab is 100 maximum
  const earnedScore = 100;

  const handleFinishMission = () => {
    sounds.playFanfare();
    onCompletePage(earnedScore);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900/70 via-slate-900 to-teal-900/70 border border-emerald-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-start gap-4">
          <div className="p-3.5 bg-emerald-500/20 border border-emerald-400/40 rounded-2xl text-emerald-300 text-3xl shrink-0 shadow-inner">
            🎓
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest mb-1">
              <span>{lang === 'en' ? 'Module 4B • Capstone Page 7 of 7' : 'Modulul 4B • Laboratorul Final 7 din 7'}</span>
              <span>•</span>
              <span className="text-slate-400">{lang === 'en' ? 'Practical Master Lab' : 'Misiunea Practică Integratoare'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
              {lang === 'en' ? 'The Eco-Magazine Master Studio' : 'Laboratorul de Tehnoredactare: „Eco-Revista Școlară”'}
            </h1>
            <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
              {lang === 'en'
                ? 'Assemble a complete publication from scratch! Configure headers and dynamic footers, embed a square-wrapped picture with 1:1 aspect ratio, format an ecological activities table with merged cells, and place a certified badge.'
                : 'Asamblează de la zero o revistă școlară completă! Activează antetul și numărul de pagină dinamic, integrează o poză cu încadrare Pătrat (Square) fără distorsiuni, stilizează tabelul de activități cu celule îmbinate și adaugă ecusonul eco!'}
            </p>
          </div>
        </div>
      </div>

      {/* Real-Time Criteria Checklist HUD */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-sm font-bold text-white uppercase font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'en' ? 'Editorial Quality Criteria (Must reach 6/6):' : 'Criterii de Calitate Redacțională (Obiectiv: 6/6):'}</span>
          </div>
          <span className={`text-xs font-mono font-black px-3 py-1 rounded-full border ${
            isMasterDocumentReady
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
          }`}>
            {passedCriteriaCount} / {totalCriteria} {lang === 'en' ? 'Accomplished' : 'Completate'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <div className={`p-3 rounded-xl border flex items-center gap-2.5 transition ${c1_headerFooter ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300' : 'bg-slate-950/60 border-slate-800 text-slate-400'}`}>
            <span className="text-base">{c1_headerFooter ? '✓' : '1️⃣'}</span>
            <span>{lang === 'en' ? 'Header & Dynamic Footer' : 'Antet & Subsol cu Nr. Pagină'}</span>
          </div>

          <div className={`p-3 rounded-xl border flex items-center gap-2.5 transition ${c2_imageWrap ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300' : 'bg-slate-950/60 border-slate-800 text-slate-400'}`}>
            <span className="text-base">{c2_imageWrap ? '✓' : '2️⃣'}</span>
            <span>{lang === 'en' ? 'Image: 1:1 Ratio + Square Wrap' : 'Poză 1:1 + Încadrare Pătrat'}</span>
          </div>

          <div className={`p-3 rounded-xl border flex items-center gap-2.5 transition ${c3_tableMerged ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300' : 'bg-slate-950/60 border-slate-800 text-slate-400'}`}>
            <span className="text-base">{c3_tableMerged ? '✓' : '3️⃣'}</span>
            <span>{lang === 'en' ? 'Table: Merged Title Row' : 'Tabel: Celule Titlu Îmbinate'}</span>
          </div>

          <div className={`p-3 rounded-xl border flex items-center gap-2.5 transition ${c4_tableShading ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300' : 'bg-slate-950/60 border-slate-800 text-slate-400'}`}>
            <span className="text-base">{c4_tableShading ? '✓' : '4️⃣'}</span>
            <span>{lang === 'en' ? 'Table: Colored Header Shading' : 'Tabel: Umbrire Antet (Shading)'}</span>
          </div>

          <div className={`p-3 rounded-xl border flex items-center gap-2.5 transition ${c5_tableAlignment ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300' : 'bg-slate-950/60 border-slate-800 text-slate-400'}`}>
            <span className="text-base">{c5_tableAlignment ? '✓' : '5️⃣'}</span>
            <span>{lang === 'en' ? 'Table: Centered Cell Text' : 'Tabel: Aliniere Centrată'}</span>
          </div>

          <div className={`p-3 rounded-xl border flex items-center gap-2.5 transition ${c6_shapeBadge ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300' : 'bg-slate-950/60 border-slate-800 text-slate-400'}`}>
            <span className="text-base">{c6_shapeBadge ? '✓' : '6️⃣'}</span>
            <span>{lang === 'en' ? 'Eco-Badge Shape Inserted' : 'Ecuson Formă „Eco-Aprobat”'}</span>
          </div>
        </div>
      </div>

      {/* Editor Workstation & Control Deck */}
      <div className="bg-slate-900/90 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base sm:text-lg font-bold text-white">
              {lang === 'en' ? 'Architect Controls: Word & Page Tools' : 'Bara de Instrumente Tehnoredactare:'}
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {lang === 'en' ? 'Interactive Document Workbench' : 'Atelier Interactiv'}
          </span>
        </div>

        {/* Grouped Tool Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Panel 1: Page & Headers */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="text-xs font-bold text-slate-300 uppercase font-mono flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-teal-400" />
              <span>1. Paginare & Antet</span>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setHeaderActive(!headerActive);
                }}
                className={`w-full p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                  headerActive
                    ? 'bg-teal-950/80 border-teal-400 text-teal-200'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                }`}
              >
                <span>Antet: Titlu Revistă</span>
                <span>{headerActive ? '✓ Activ' : '+ Adaugă'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setFooterActive(!footerActive);
                }}
                className={`w-full p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                  footerActive
                    ? 'bg-teal-950/80 border-teal-400 text-teal-200'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                }`}
              >
                <span>Subsol: Nr. Pagină Auto</span>
                <span>{footerActive ? '✓ Activ' : '+ Adaugă'}</span>
              </button>
            </div>
          </div>

          {/* Panel 2: Picture & Wrapping */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="text-xs font-bold text-slate-300 uppercase font-mono flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span>2. Ilustrație & Wrapping</span>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setHasImage(!hasImage);
                }}
                className={`w-full p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                  hasImage
                    ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                }`}
              >
                <span>Inserează Poză Pădure</span>
                <span>{hasImage ? '✓ Inserată' : '+ Inserează'}</span>
              </button>

              {hasImage && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setImageWrapping(prev => prev === 'inline' ? 'square' : prev === 'square' ? 'behind' : 'square');
                    }}
                    className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-300 hover:border-slate-500 flex items-center justify-between cursor-pointer"
                  >
                    <span>Wrap Text:</span>
                    <span className="text-cyan-400 font-mono">
                      {imageWrapping === 'square' ? 'Pătrat (Square) ✓' : imageWrapping === 'behind' ? 'În spate (Behind)' : 'În linie (Inline)'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      sounds.playSuccess();
                      setAspectRatioFixed(true);
                    }}
                    className={`w-full p-2 rounded-xl border text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                      aspectRatioFixed
                        ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300'
                        : 'bg-amber-950/60 border-amber-500 text-amber-300'
                    }`}
                  >
                    <span>Raport Aspect 1:1</span>
                    <span>{aspectRatioFixed ? '✓ Calibrat' : '⚠️ Deformat (Repară)'}</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Panel 3: Table & Shapes */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="text-xs font-bold text-slate-300 uppercase font-mono flex items-center gap-1.5">
              <Table className="w-3.5 h-3.5 text-indigo-400" />
              <span>3. Tabel & Forme</span>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setHasTable(!hasTable);
                }}
                className={`w-full p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                  hasTable
                    ? 'bg-indigo-950/80 border-indigo-400 text-indigo-200'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                }`}
              >
                <span>Inserează Tabel Orare</span>
                <span>{hasTable ? '✓ Prezent' : '+ Inserează'}</span>
              </button>

              {hasTable && (
                <div className="grid grid-cols-3 gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setIsTableTitleMerged(!isTableTitleMerged);
                    }}
                    title="Merge Cells"
                    className={`p-1.5 rounded-lg border text-[10px] font-bold text-center transition cursor-pointer ${
                      isTableTitleMerged
                        ? 'bg-emerald-950 border-emerald-400 text-emerald-300'
                        : 'bg-slate-900 border-slate-700 text-slate-300'
                    }`}
                  >
                    {isTableTitleMerged ? 'Merge ✓' : 'Merge'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setTableHeaderShaded(!tableHeaderShaded);
                    }}
                    title="Shading Color"
                    className={`p-1.5 rounded-lg border text-[10px] font-bold text-center transition cursor-pointer ${
                      tableHeaderShaded
                        ? 'bg-emerald-950 border-emerald-400 text-emerald-300'
                        : 'bg-slate-900 border-slate-700 text-slate-300'
                    }`}
                  >
                    {tableHeaderShaded ? 'Shading ✓' : 'Shading'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setTableCentered(!tableCentered);
                    }}
                    title="Center Text"
                    className={`p-1.5 rounded-lg border text-[10px] font-bold text-center transition cursor-pointer ${
                      tableCentered
                        ? 'bg-emerald-950 border-emerald-400 text-emerald-300'
                        : 'bg-slate-900 border-slate-700 text-slate-300'
                    }`}
                  >
                    {tableCentered ? 'Centru ✓' : 'Aliniere'}
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setHasBadgeShape(!hasBadgeShape);
                }}
                className={`w-full p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                  hasBadgeShape
                    ? 'bg-purple-950/80 border-purple-400 text-purple-200'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                }`}
              >
                <span>Inserează Ecuson Formă</span>
                <span>{hasBadgeShape ? '✓ Ecuson Activ' : '+ Adaugă'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live WYSIWYG Printed Magazine Page Preview */}
        <div className="space-y-2">
          <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>{lang === 'en' ? 'WYSIWYG Print Preview (A4 Page):' : 'Previzualizare Imprimare Pagina A4 (WYSIWYG):'}</span>
            <span className="text-emerald-400 font-bold">Standard ISO A4 • 210 × 297 mm</span>
          </div>

          <div className="p-6 sm:p-8 bg-slate-950/90 rounded-2xl border-2 border-slate-700 flex justify-center shadow-inner overflow-x-auto">
            {/* The Master Paper Document */}
            <div className="w-[340px] sm:w-[500px] min-h-[580px] bg-white text-slate-900 p-6 sm:p-8 rounded shadow-2xl flex flex-col justify-between font-sans relative border border-slate-300">
              {/* Header */}
              <div className={`border-b pb-2 flex items-center justify-between text-[11px] font-mono text-slate-600 ${headerActive ? 'opacity-100 border-slate-400' : 'opacity-20 border-dashed border-slate-400'}`}>
                <span className="font-bold">REVISTA „ECO-GIMNAZIUL” • EDIȚIA DE TOAMNĂ</span>
                <span>CLASA A V-A B</span>
              </div>

              {/* Main Content Area */}
              <div className="my-4 space-y-4 text-xs leading-relaxed text-slate-800">
                {/* Article Title */}
                <div className="text-center space-y-1">
                  <h2 className="text-base sm:text-lg font-black text-emerald-900 tracking-tight font-heading uppercase">
                    🌳 Inițiativa Verde: Tehnologia în Sprijinul Naturii
                  </h2>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Redactor Șef: Echipa Elevilor Digitali • Data: An Școlar Curent
                  </div>
                </div>

                {/* Floating Image with Wrap Text */}
                {hasImage && (
                  <div
                    className={`transition-all ${
                      imageWrapping === 'square'
                        ? 'float-right ml-4 mb-3'
                        : imageWrapping === 'behind'
                        ? 'absolute inset-0 m-auto opacity-15 pointer-events-none'
                        : 'block my-3 mx-auto text-center'
                    }`}
                    style={{
                      transform: aspectRatioFixed ? 'scale(1.0, 1.0)' : 'scale(1.6, 0.8)',
                      width: '130px'
                    }}
                  >
                    <div className="p-2 bg-gradient-to-br from-emerald-100 to-teal-50 border-2 border-emerald-600 rounded-xl shadow-md text-center">
                      <div className="text-3xl">🌲✨</div>
                      <div className="text-[9px] font-bold text-emerald-800 uppercase font-mono mt-1">
                        Pădurea Școlii
                      </div>
                    </div>
                  </div>
                )}

                {/* Article Body Paragraph */}
                <p className="text-justify leading-relaxed">
                  În această lună, elevii gimnaziului au lansat primul proiect integrat de ecologie și informatică. Tehnoredactarea digitală ne permite să transmitem rapoarte complete fără risipă de hârtie, utilizând tabele structurate și imagini armonios paginate.
                </p>

                {/* Activities Table */}
                {hasTable && (
                  <div className="overflow-x-auto my-3">
                    <table className="w-full border-collapse text-[10px] sm:text-[11px] border border-slate-400">
                      <tbody>
                        {/* Merged Title */}
                        {isTableTitleMerged ? (
                          <tr className="bg-slate-100 font-black text-center border-b border-slate-400">
                            <td colSpan={3} className="p-1.5 text-emerald-950 font-mono uppercase tracking-wider">
                              📅 CALENDARUL ACTIVITĂȚILOR ECOLOGICE
                            </td>
                          </tr>
                        ) : (
                          <tr className="bg-slate-100 text-slate-400 border-b border-slate-300">
                            <td className="p-1 border border-slate-300">Calendar</td>
                            <td className="p-1 border border-slate-300">[Nemergat]</td>
                            <td className="p-1 border border-slate-300">[Nemergat]</td>
                          </tr>
                        )}

                        {/* Table Header Row */}
                        <tr className={`border-b font-bold ${
                          tableHeaderShaded
                            ? 'bg-emerald-800 text-white border-emerald-900'
                            : 'bg-slate-200 text-slate-800 border-slate-300'
                        }`}>
                          <th className={`p-1.5 border border-slate-300 ${tableCentered ? 'text-center' : 'text-left'}`}>Ziua</th>
                          <th className={`p-1.5 border border-slate-300 ${tableCentered ? 'text-center' : 'text-left'}`}>Activitatea Eco</th>
                          <th className={`p-1.5 border border-slate-300 ${tableCentered ? 'text-center' : 'text-left'}`}>Responsabili</th>
                        </tr>

                        <tr className="border-b border-slate-300">
                          <td className={`p-1.5 border border-slate-300 font-mono ${tableCentered ? 'text-center' : 'text-left'}`}>Luni</td>
                          <td className={`p-1.5 border border-slate-300 font-medium ${tableCentered ? 'text-center' : 'text-left'}`}>Plantare puieți</td>
                          <td className={`p-1.5 border border-slate-300 ${tableCentered ? 'text-center' : 'text-left'}`}>Clasa a V-a A</td>
                        </tr>

                        <tr>
                          <td className={`p-1.5 border border-slate-300 font-mono ${tableCentered ? 'text-center' : 'text-left'}`}>Vineri</td>
                          <td className={`p-1.5 border border-slate-300 font-medium ${tableCentered ? 'text-center' : 'text-left'}`}>Reciclare deșeuri</td>
                          <td className={`p-1.5 border border-slate-300 ${tableCentered ? 'text-center' : 'text-left'}`}>Clasa a V-a B</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Eco Badge Shape */}
                {hasBadgeShape && (
                  <div className="flex justify-end pt-2">
                    <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-mono text-[10px] font-black shadow-lg border-2 border-emerald-400 flex items-center gap-1.5">
                      <span>🌿</span>
                      <span>PROIECT APROBAT ECO • NOTA 10</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className={`border-t pt-2 flex items-center justify-between text-[11px] font-mono text-slate-500 ${footerActive ? 'opacity-100 border-slate-400' : 'opacity-20 border-dashed border-slate-400'}`}>
                <span>Proiect de Tehnică & Tehnoredactare TIC</span>
                <span className="font-bold text-emerald-800">
                  {footerActive ? 'Pagina 1 din 1 (Auto)' : '[ Fără număr ]'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Master Finalize Bar */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-mono">
            {isMasterDocumentReady ? (
              <span className="text-emerald-400 font-bold flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-5 h-5" />
                {lang === 'en' ? 'All 6 Master Criteria Met! You are a certified Document Architect!' : 'Toate cele 6 criterii sunt îndeplinite impecabil! Ești un adevărat Arhitect de Documente!'}
              </span>
            ) : (
              <span className="text-amber-400">
                ⚡ {lang === 'en' ? `Fulfill remaining criteria (${passedCriteriaCount}/6) using the toolbar above!` : `Îndeplinește toate cele ${totalCriteria} cerințe din panou (${passedCriteriaCount}/6)!`}
              </span>
            )}
          </div>

          <button
            type="button"
            disabled={!isMasterDocumentReady}
            onClick={handleFinishMission}
            className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-extrabold text-sm sm:text-base transition flex items-center justify-center gap-3 cursor-pointer shadow-2xl ${
              isMasterDocumentReady
                ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 hover:brightness-110 shadow-emerald-500/40 active:scale-95 animate-pulse'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-50'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            <span>
              {lang === 'en' ? 'Complete Mission 4B & Generate Diploma (100 Pts)' : 'Finalizează Misiunea 4B & Generează Diploma (100 Pct)'}
            </span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
