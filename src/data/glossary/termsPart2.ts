import { GlossaryTerm } from './types';

export const GLOSSARY_TERMS_PART_2: GlossaryTerm[] = [
  // =========================================================================
  // 3. OFFICE, SPREADSHEETS & DIGITAL MEDIA (7)
  // =========================================================================
  {
    id: 'excel-cell-range-absolute',
    category: 'office-data',
    grades: ['8'],
    gradeTagRo: 'Clasa a VIII-a',
    gradeTagEn: 'Grade 8',
    relatedModuleId: 'g8_calc_a',
    relatedMissionId: 'g8_calc_a',
    relatedBlogIds: ['formule-excel-gimnaziu-sum-average-if-countif-erori'],
    relatedTermIds: ['excel-sum-average', 'excel-if-countif', 'excel-errors-name-value-div0'],
    ro: {
      slug: 'celula-domeniu-referinta-absoluta-excel',
      term: 'Celulă, Domeniu și Referință Absolută ($A$1) în Excel',
      shortAnswer:
        'O celulă este intersecția unei coloane cu un rând (ex. B4), iar un domeniu este un bloc dreptunghiular de celule (ex. A2:A20). Referința absolută ($B$1) blochează o celulă cu simbolul $ ca să nu se schimbe când tragi formula în jos cu AutoFill.',
      explanation: [
        'Când scrii =B2*C1 și tragi formula pe 10 rânduri, Excel ajustează automat referințele relative la =B3*C2, =B4*C3 — ideal pentru coloane, dar greșit dacă C1 conține o constantă unică (ex. cursul Euro sau TVA).',
        'Adăugând simbolul $ (tasta F4) obții o referință absolută ($C$1), astfel încât formula trasă în jos devine =B3*$C$1, =B4*$C$1.'
      ],
      syntaxOrFormula: {
        title: 'Tipuri de referințe în Excel / Google Sheets',
        code: 'A1    -> Referință RELATIVĂ (se modifică la copiere/AutoFill)\n$A$1  -> Referință ABSOLUTĂ (rămân blocate coloana A și rândul 1)\n$A1   -> Referință MIXTĂ (coloana A blocată, rândul liber)\nA2:C5 -> Domeniu de celule (Range) de la A2 până la C5'
      },
      example:
        'Pentru a converti 20 de prețuri din Euro (coloana B) în Lei folosind cursul din celula F1, scrii =B2*$F$1 în C2 și tragi formula până la C21.',
      commonMistake:
        'Folosirea virgulei sau punct-virgulei între capetele domeniului (A2;A20) în loc de două puncte (A2:A20), sau uitarea lui $ la celulele constante când folosești AutoFill.',
      vsComparison: {
        title: 'Referință Relativă (A1) vs. Absolută ($A$1)',
        summary:
          'Referința relativă se deplasează odată cu formula; referința absolută rămâne „înghețată” pe aceeași celulă indiferent unde copiezi formula.'
      },
      faqs: [
        {
          question: 'Ce tastă adaugă rapid simbolul $ într-o formulă Excel?',
          answer: 'Tasta F4 (sau Fn+F4 pe laptop) apasă imediat după selectarea celulei în bară transformă A1 în $A$1.'
        }
      ],
      keywords: 'referinta absoluta excel $a$1, domeniu de celule range, auto fill excel clasa 8'
    },
    en: {
      slug: 'excel-cell-range-absolute',
      term: 'Cell, Range & Absolute Reference ($A$1) in Excel',
      shortAnswer:
        'A cell sits at a column-row intersection (like B4), and a range spans a block of cells (A2:A20). An absolute reference ($B$1) locks a cell with dollar signs so it stays fixed when dragging a formula with AutoFill.',
      explanation: [
        'Relative references (A1) shift automatically as you drag a formula across rows or columns.',
        'Locking a tax rate or exchange rate cell with $F$1 keeps every copied row pointing to F1.'
      ],
      syntaxOrFormula: {
        title: 'Spreadsheet Reference Modes',
        code: 'A1    -> Relative (adjusts on copy)\n$A$1  -> Absolute (column & row locked)\n$A1   -> Mixed (column locked)\nA2:C5 -> Rectangular cell range'
      },
      example:
        'Write =B2*$F$1 and drag down so every price multiplies by the single tax rate stored in F1.',
      commonMistake:
        'Writing a comma instead of a colon inside a range (SUM(A2,A20) only adds two cells, whereas SUM(A2:A20) sums all 19 cells!).',
      vsComparison: {
        title: 'Relative (A1) vs. Absolute ($A$1)',
        summary:
          'Relative moves with AutoFill; absolute stays pinned to one exact cell.'
      },
      faqs: [
        {
          question: 'What shortcut toggles $ signs in Excel?',
          answer: 'Press F4 while editing a cell reference to cycle through $A$1, A$1, $A1, and A1.'
        }
      ],
      keywords: 'absolute cell reference excel, cell range colon, autofill $a$1'
    }
  },
  {
    id: 'excel-sum-average',
    category: 'office-data',
    grades: ['8'],
    gradeTagRo: 'Clasa a VIII-a',
    gradeTagEn: 'Grade 8',
    relatedModuleId: 'g8_calc_b',
    relatedMissionId: 'g8_calc_b',
    relatedBlogIds: ['formule-excel-gimnaziu-sum-average-if-countif-erori'],
    relatedTermIds: ['excel-cell-range-absolute', 'excel-if-countif', 'excel-errors-name-value-div0'],
    ro: {
      slug: 'functii-excel-sum-average-min-max',
      term: 'Funcții de Bază în Excel: SUM, AVERAGE, MIN, MAX',
      shortAnswer:
        'SUM, AVERAGE, MIN și MAX sunt funcțiile fundamentale din calculul tabelar care calculează automat suma, media aritmetică, cea mai mică și cea mai mare valoare dintr-un domeniu de celule (ex. =AVERAGE(B2:B30)).',
      explanation: [
        'Orice formulă sau funcție în Excel și Google Sheets începe obligatoriu cu semnul egal (=).',
        'Spre deosebire de adunarea manuală (=B2+B3+B4), funcțiile ignorează automat celulele goale sau textele și se actualizează instantaneu dacă adaugi un rând nou.'
      ],
      syntaxOrFormula: {
        title: 'Sintaxă standard (Excel / Google Sheets)',
        code: '=SUM(B2:B15)      // Suma valorilor din B2..B15\n=AVERAGE(B2:B15)  // Media aritmetică a numerelor\n=MIN(B2:B15)      // Cea mai mică valoare\n=MAX(B2:B15)      // Cea mai mare valoare'
      },
      example:
        'Într-un catalog școlar, =AVERAGE(C2:F2) calculează media semestrială a elevului, iar =MAX(G2:G30) găsește cea mai mare medie din clasă.',
      commonMistake:
        'Uitarea semnului = la început (Excel va afișa formula ca simplu text!) sau includerea unei celule cu rezultat în propriul ei interval (=SUM(B2:B6) scris chiar în B6 -> eroare Circular Reference).',
      vsComparison: {
        title: '=AVERAGE(B2:B4) vs. =(B2+B3+B4)/3',
        summary:
          'AVERAGE ignoră celulele goale (împarte doar la câte note există), pe când /(3) împarte mereu la 3 chiar dacă o celulă lipsește.'
      },
      faqs: [
        {
          question: 'Cu ce semn începe orice formulă în Excel?',
          answer: 'Întotdeauna cu semnul egal (=).'
        }
      ],
      keywords: 'functii excel sum average min max clasa 8, media aritmetica excel'
    },
    en: {
      slug: 'excel-sum-average',
      term: 'Core Excel Functions: SUM, AVERAGE, MIN, MAX',
      shortAnswer:
        'SUM, AVERAGE, MIN, and MAX compute totals, arithmetic means, smallest values, and largest values across a cell range. Every spreadsheet formula must begin with an equals sign (=).',
      explanation: [
        'Built-in aggregate functions skip empty or text-only cells automatically rather than crashing.',
        'Whenever source grades or prices change, function outputs recalculate instantly.'
      ],
      syntaxOrFormula: {
        title: 'Core Function Syntax',
        code: '=SUM(B2:B15)\n=AVERAGE(B2:B15)\n=MIN(B2:B15)\n=MAX(B2:B15)'
      },
      example:
        'Use =AVERAGE(C2:F2) to compute a student’s term average and =MAX(G2:G30) for the class top score.',
      commonMistake:
        'Forgetting the leading = sign or accidentally including the formula cell itself inside the range (Circular Reference).',
      vsComparison: {
        title: 'SUM(B2:B10) vs. Manual Plus Signs',
        summary:
          'SUM skips text cells cleanly and inserts new rows automatically; manual B2+B3+... triggers #VALUE! if any cell holds text.'
      },
      faqs: [
        {
          question: 'Does AVERAGE include blank cells in the denominator?',
          answer: 'No, blank cells are ignored, whereas cells containing 0 are included.'
        }
      ],
      keywords: 'excel sum average min max formulas, spreadsheet basics grade 8'
    }
  },
  {
    id: 'excel-if-countif',
    category: 'office-data',
    grades: ['8'],
    gradeTagRo: 'Clasa a VIII-a',
    gradeTagEn: 'Grade 8',
    relatedModuleId: 'g8_calc_c',
    relatedMissionId: 'g8_calc_c',
    relatedBlogIds: ['formule-excel-gimnaziu-sum-average-if-countif-erori'],
    relatedTermIds: ['excel-sum-average', 'excel-errors-name-value-div0', 'if-else-switch'],
    ro: {
      slug: 'functiile-if-si-countif-excel',
      term: 'Funcțiile Logice IF și COUNTIF în Excel',
      shortAnswer:
        'Funcția IF verifică o condiție logică și returnează o valoare dacă este adevărată sau altă valoare dacă este falsă. Funcția COUNTIF numără câte celule dintr-un domeniu respectă un anumit criteriu (ex. note peste 5).',
      explanation: [
        'IF are exact 3 argumente: testul logic (ex. C2>=5), rezultatul pentru Adevărat („Promovat”) și rezultatul pentru Fals („Corigent”).',
        'Atenție la separatorul de argumente: în Excel setat pe limba română/Europa se folosește punct și virgulă (;), iar în Google Sheets / Excel US se folosește virgulă (,).'
      ],
      syntaxOrFormula: {
        title: 'Sintaxă IF și COUNTIF (separator RO ; )',
        code: '=IF(D2>=5; "Admis"; "Respins")\n=COUNTIF(D2:D30; ">=8")\n=SUMIF(B2:B30; "Informatica"; D2:D30)'
      },
      example:
        '=COUNTIF(E2:E28; "Admis") numără automat câți elevi din catalog au obținut calificativul „Admis”.',
      commonMistake:
        'Uitarea ghilimelelor duble ("...") în jurul textelor sau al condițiilor cu simboluri din COUNTIF (ex. ">=8" trebuie pus între ghilimele!).',
      vsComparison: {
        title: 'COUNTIF vs. SUMIF',
        summary:
          'COUNTIF numără câte celule îndeplinesc condiția; SUMIF adună valorile asociate celulelor care îndeplinesc condiția.'
      },
      faqs: [
        {
          question: 'De ce primește formula =IF(A1>5, "Da", "Nu") eroare în Excel în română?',
          answer: 'În configurația regională România/Europa, Excel cere punct și virgulă (;) între argumente, nu virgulă.'
        }
      ],
      keywords: 'functia if in excel clasa 8, functia countif conditie ghilimele, sumif'
    },
    en: {
      slug: 'excel-if-countif',
      term: 'Logical Spreadsheet Functions: IF & COUNTIF',
      shortAnswer:
        'The IF function tests a condition and returns one result when true and another when false. COUNTIF counts how many cells in a range match a given criterion (such as scores >= 8).',
      explanation: [
        'IF takes 3 arguments: logical_test, value_if_true, and value_if_false.',
        'In COUNTIF, comparison criteria with operators like ">=5" or text strings must be enclosed in double quotes.'
      ],
      syntaxOrFormula: {
        title: 'IF & COUNTIF Syntax',
        code: '=IF(D2>=5, "Pass", "Fail")\n=COUNTIF(D2:D30, ">=8")\n=SUMIF(B2:B30, "CS", D2:D30)'
      },
      example:
        '=COUNTIF(E2:E28, "Pass") counts how many students passed without manual tallying.',
      commonMistake:
        'Forgetting quotes around text outputs or comparison strings like ">=8", or mixing up comma vs. semicolon separators.',
      vsComparison: {
        title: 'COUNTIF vs. COUNT',
        summary:
          'COUNT counts all numeric cells in a range; COUNTIF counts only cells matching your specific rule.'
      },
      faqs: [
        {
          question: 'Why must ">=8" be inside quotes inside COUNTIF?',
          answer: 'Excel expects the criterion argument of COUNTIF to be evaluated as a condition string.'
        }
      ],
      keywords: 'excel if formula tutorial, countif greater than quotes, sumif'
    }
  },
  {
    id: 'excel-errors-name-value-div0',
    category: 'office-data',
    grades: ['8'],
    gradeTagRo: 'Clasa a VIII-a',
    gradeTagEn: 'Grade 8',
    relatedModuleId: 'g8_calc_d',
    relatedMissionId: 'g8_calc_d',
    relatedBlogIds: ['formule-excel-gimnaziu-sum-average-if-countif-erori'],
    relatedTermIds: ['excel-sum-average', 'excel-if-countif', 'excel-cell-range-absolute'],
    ro: {
      slug: 'erori-excel-name-value-div0-ref',
      term: 'Erori Frecvente în Excel (#NAME?, #VALUE!, #DIV/0!, #REF!, ###)',
      shortAnswer:
        'Codurile de eroare din Excel indică rapid ce este greșit într-o formulă: #NAME? (nume de funcție scris greșit), #VALUE! (operație matematică cu un text), #DIV/0! (împărțire la zero), #REF! (celulă ștearsă) și ### (coloană prea îngustă).',
      explanation: [
        'Când o celulă afișează ###, formula NU este greșită — pur și simplu numărul este mai lat decât lățimea coloanei.',
        'În schimb, erorile care încep cu # și litere mari indică o problemă de sintaxă sau de date care trebuie corectată în bara de formule.'
      ],
      syntaxOrFormula: {
        title: 'Dicționar rapid de depanare Excel',
        code: '#####   -> Coloana este prea îngustă (lărgește coloana cu dublu-click)\n#NAME?  -> Funcție scrisă greșit (ex. =SUMA în loc de =SUM)\n#VALUE! -> Ai adunat un text cu un număr (=A2+"abc")\n#DIV/0! -> Împărțire la 0 sau la o celulă goală\n#REF!   -> Referință invalidă (ai șters coloana/rândul folosit în formulă)'
      },
      example:
        'Dacă primești #DIV/0! într-un tabel unde un produs are cantitatea 0, poți proteja formula cu =IFERROR(A2/B2; 0).',
      commonMistake:
        'Încercarea de a scrie nume de funcții în română (=MEDIE în loc de =AVERAGE) sau adăugarea unității de măsură direct în celula numerică („15 lei” în loc de „15” formatat ca Currency -> produce #VALUE!).',
      vsComparison: {
        title: '##### vs. #VALUE!',
        summary:
          '##### este doar o problemă vizuală de lățime a coloanei; #VALUE! semnalează tipuri de date incompatibile în formulă.'
      },
      faqs: [
        {
          question: 'Ce înseamnă când apare ##### într-o celulă Excel?',
          answer: 'Conținutul numeric sau data calendaristică nu încape în lățimea actuală a coloanei. Dă dublu-click pe marginea din dreapta a antetului de coloană.'
        }
      ],
      keywords: 'erori excel #name #value #div/0 #ref ####, depanare formule excel clasa 8'
    },
    en: {
      slug: 'excel-errors-name-value-div0',
      term: 'Common Excel Formula Errors (#NAME?, #VALUE!, #DIV/0!, #REF!, ###)',
      shortAnswer:
        'Excel error codes diagnose exact formula issues: #NAME? means a misspelled function name, #VALUE! means mixing text with math, #DIV/0! means dividing by zero, #REF! means a deleted reference, and ### means the column is too narrow.',
      explanation: [
        'Always type plain numbers in data cells and apply currency/unit formatting instead of typing "15 USD" as text.',
        'Wrap risky divisions inside =IFERROR(A2/B2, 0) to keep dashboards clean.'
      ],
      syntaxOrFormula: {
        title: 'Spreadsheet Error Decoder',
        code: '#####   -> Column too narrow to display value\n#NAME?  -> Unrecognized function name or missing quotes\n#VALUE! -> Wrong data type (e.g., adding text + number)\n#DIV/0! -> Division by 0 or blank cell\n#REF!   -> Referenced row/column was deleted'
      },
      example:
        'Typing =AVARAGE(A1:A5) produces #NAME? because AVERAGE is misspelled.',
      commonMistake:
        'Typing units like "kg" or "EUR" directly inside cells used for math formulas instead of using Number Formatting.',
      vsComparison: {
        title: '##### vs. #NAME?',
        summary:
          '##### simply needs a wider column; #NAME? indicates a typo in the formula syntax.'
      },
      faqs: [
        {
          question: 'How do I fix ##### in Excel?',
          answer: 'Double-click the right border of the column header to auto-fit the column width.'
        }
      ],
      keywords: 'excel errors #name #value #div/0 #ref, fix excel ####'
    }
  },
  {
    id: 'powerpoint-6x6-contrast',
    category: 'office-data',
    grades: ['6', '7'],
    gradeTagRo: 'Clasa a VI-a',
    gradeTagEn: 'Grade 6',
    relatedModuleId: 'prezentari-slides',
    relatedMissionId: 'g6_presentation1',
    relatedBlogIds: ['prezentari-powerpoint-regula-6x6-modelare-3d-scoala'],
    relatedTermIds: ['typography-diacritics-margins', 'rgb-pixel-resolution', 'audio-video-multitrack-keyframe'],
    ro: {
      slug: 'regula-6x6-prezentari-powerpoint',
      term: 'Regula 6×6 și Designul Prezentărilor (PowerPoint / Google Slides)',
      shortAnswer:
        'Regula 6×6 este principiul de design pentru prezentări eficiente: cel mult 6 puncte (bullets) pe un slide și cel mult 6 cuvinte pe fiecare rând. Slide-ul sprijină discursul tău cu idei cheie și imagini clare, nu înlocuiește referatul.',
      explanation: [
        'Cea mai frecventă problemă la proiectele școlare este copierea unor paragrafe întregi de pe Wikipedia pe slide, pe care nimeni din clasă nu le poate citi din ultima bancă.',
        'Folosește fonturi sans-serif mari (titlu 36–44 pt, corp minim 22–24 pt), contrast puternic între text și fundal și cel mult 1–2 tranziții discrete în toată prezentarea.'
      ],
      syntaxOrFormula: {
        title: 'Checklist de nota 10 pentru un Slide',
        code: 'Regula 6x6:  Maxim 6 rânduri/idei x maxim 6 cuvinte per rând\nFont minim:  24 pt pentru text, 36–44 pt pentru titlu\nContrast:    Text închis pe fundal deschis SAU text alb pe fundal închis\nLayout:      1 idee principală + 1 imagine relevantă per slide'
      },
      example:
        'În loc să scrii un paragraf de 80 de cuvinte despre CPU, pune pe slide 3 idei scurte („Creierul PC-ului”, „Unități: CU și ALU”, „Viteză în GHz”) și o diagramă mare.',
      commonMistake:
        'Folosirea textului galben deschis pe fundal alb, font mic sub 14 pt sau animații zgomotoase diferite pe fiecare literă.',
      vsComparison: {
        title: 'Prezentare (Slides) vs. Referat (Word)',
        summary:
          'Referatul conține explicații detaliate destinate citirii individuale; prezentarea PowerPoint conține rezumate vizuale scurte care însoțesc prezentarea orală.'
      },
      faqs: [
        {
          question: 'Ce mărime minimă ar trebui să aibă textul într-un PowerPoint pentru clasă?',
          answer: 'Cel puțin 22–24 pt, astfel încât să fie lizibil ușor pe videoproiector și din ultima bancă.'
        }
      ],
      keywords: 'regula 6x6 powerpoint, cum faci o prezentare google slides clasa 6'
    },
    en: {
      slug: 'powerpoint-6x6-contrast',
      term: 'The 6×6 Rule & Effective Slide Design (PowerPoint / Slides)',
      shortAnswer:
        'The 6×6 rule keeps presentation slides scannable and clear: use at most 6 bullet points per slide and at most 6 words per line. Slides should visually anchor your talk—not serve as walls of text.',
      explanation: [
        'Large audiences cannot read tiny paragraphs from across a classroom.',
        'Use 24 pt+ body fonts, strong light-vs-dark contrast, and consistent minimal animations.'
      ],
      syntaxOrFormula: {
        title: 'Classroom Slide Checklist',
        code: '6x6 Rule:  Max 6 bullets x 6 words per bullet\nFont Size: 24 pt+ body text, 36–44 pt headings\nContrast:  High text-to-background ratio (AA/AAA)\nFocus:     1 main takeaway per slide'
      },
      example:
        'Summarize a topic in 3 punchy keywords next to a clean chart while speaking the full explanation aloud.',
      commonMistake:
        'Pasting full Wikipedia paragraphs onto slides, shrinking fonts below 14 pt, or applying spinning animations to every word.',
      vsComparison: {
        title: 'Slide Deck vs. Written Report',
        summary:
          'Reports hold full prose for solo reading; slides deliver high-contrast visual cues that support live speaking.'
      },
      faqs: [
        {
          question: 'Why does the 6×6 rule improve presentations?',
          answer: 'It forces concise key phrases so listeners focus on you instead of reading dense blocks of text.'
        }
      ],
      keywords: '6x6 rule powerpoint presentations, classroom slide design contrast'
    }
  },
  {
    id: 'typography-diacritics-margins',
    category: 'office-data',
    grades: ['5', '7'],
    gradeTagRo: 'Clasele V–VII',
    gradeTagEn: 'Grades 5–7',
    relatedModuleId: 'editoare-text',
    relatedMissionId: 'text1',
    relatedBlogIds: ['word-google-docs-referate-scolare-diacritice-margini-cuprins'],
    relatedTermIds: ['file-extension', 'powerpoint-6x6-contrast', 'cloud-computing-collaboration'],
    ro: {
      slug: 'formatare-document-word-diacritice-margini-stiluri',
      term: 'Formatare Text, Diacritice (RO) & Margini de Pagină în Word / Docs',
      shortAnswer:
        'Formatarea corectă a unui document combină tastatura românească (ă, â, î, ș, ț cu virgulă jos), marginile standard de pagină (2–2,5 cm), alinierea Justify și utilizarea stilurilor Heading 1 / Heading 2 pentru generarea automată a cuprinsului.',
      explanation: [
        'În limba română, standardul oficial folosește ș și ț cu virgulă dedesubt (tastatura Romanian Standard / Programmers în Windows), nu vechile caractere cu sedilă (ş, ţ).',
        'Nu crea spații goale apăsând Enter de 15 ori pentru a trece pe pagina următoare — folosește Page Break (Ctrl + Enter)!'
      ],
      syntaxOrFormula: {
        title: 'Scurtături & Regulă tipografică corectă',
        code: 'Ctrl + Enter     -> Salt la pagină nouă (Page Break curat)\nCtrl + B / I / U -> Bold / Italic / Underline\nRegulă punctuație: NU lăsa spațiu ÎNAINTE de virgulă/punct, ci DOAR DUPĂ!\n                   Corect: „Salut, colegi!”   Greșit: „Salut , colegi !”'
      },
      example:
        'Aplică stilul Heading 1 pe titlurile de capitole ale referatului, apoi inserează cuprinsul automat din References -> Table of Contents.',
      commonMistake:
        'Scrierea fără diacritice la referatele școlare sau punerea unui spațiu înaintea semnelor de punctuație (, . : ; ? !).',
      vsComparison: {
        title: 'Serif vs. Sans-Serif (Fonturi)',
        summary:
          'Fonturile Serif (Times New Roman, Georgia) au mici codițe la litere și sunt ideale pentru cărți și referate tipărite; Sans-Serif (Calibri, Arial, Plus Jakarta Sans) sunt curat lizibile pe ecrane și prezentări.'
      },
      faqs: [
        {
          question: 'Cum scriu rapid diacriticele românești pe orice laptop cu Windows?',
          answer: 'Activează tastatura Romanian (Programmers): ții apăsat AltGr (Alt dreapta) + a=ă, q=â, i=î, s=ș, t=ț, păstrând layout-ul QWERTY englezesc.'
        }
      ],
      keywords: 'formatare referat word clasa 5, diacritice romanesti altgr, ctrl enter page break'
    },
    en: {
      slug: 'typography-diacritics-margins',
      term: 'Document Formatting, Headings & Page Margins (Word / Docs)',
      shortAnswer:
        'Clean document formatting relies on uniform page margins (2–2.5 cm), proper punctuation spacing (space after marks, never before), clean Page Breaks (Ctrl+Enter), and Heading styles (H1/H2) to generate an automatic Table of Contents.',
      explanation: [
        'Using Heading 1 and Heading 2 styles instead of merely enlarging bold text lets Word or Google Docs build a clickable Table of Contents in one click.',
        'Always verify spelling and diacritics (such as Romanian ă, â, î, ș, ț) before exporting to PDF.'
      ],
      syntaxOrFormula: {
        title: 'Essential Word Processing Shortcuts',
        code: 'Ctrl + Enter     -> Insert clean Page Break\nCtrl + B / I / U -> Bold / Italic / Underline\nCtrl + S         -> Save document\nPunctuation rule -> No space before (, . ! ?), one space after.'
      },
      example:
        'Tag chapter headings with Heading 1, then click Insert -> Table of Contents so page numbers update automatically.',
      commonMistake:
        'Pressing Enter 20 times to push a title onto the next page—as soon as you edit text above, every page layout below shifts.',
      vsComparison: {
        title: 'Serif vs. Sans-Serif Fonts',
        summary:
          'Serif fonts (Times New Roman, Georgia) guide the eye along printed paper lines; Sans-Serif fonts (Arial, Calibri) remain crisp on digital screens.'
      },
      faqs: [
        {
          question: 'Why use Page Break (Ctrl+Enter) instead of empty Enter lines?',
          answer: 'A Page Break anchors the next section cleanly at the top of the next page regardless of edits earlier in the document.'
        }
      ],
      keywords: 'word formatting school report, page break ctrl enter, heading styles table of contents'
    }
  },
  {
    id: 'rgb-pixel-resolution',
    category: 'office-data',
    grades: ['6', '7', '8'],
    gradeTagRo: 'Clasele VI–VIII',
    gradeTagEn: 'Grades 6–8',
    relatedModuleId: 'paint-3d',
    relatedMissionId: 'g6_paint3d',
    relatedBlogIds: ['prezentari-powerpoint-regula-6x6-modelare-3d-scoala', 'primul-site-web-clasa-8-html5-https-google-sites'],
    relatedTermIds: ['bit-and-byte', 'powerpoint-6x6-contrast', 'html5-semantics'],
    ro: {
      slug: 'pixel-rezolutie-model-culoare-rgb',
      term: 'Pixel, Rezoluție și Modelul de Culoare RGB (0–255)',
      shortAnswer:
        'Pixelul (Picture Element) este cel mai mic punct colorat care alcătuiește o imagine digitală sau ecranul monitorului. În modelul RGB, fiecare pixel combină trei culori de lumină — Roșu (Red), Verde (Green) și Albastru (Blue) — cu intensități între 0 și 255.',
      explanation: [
        'Rezoluția (ex. Full HD = 1920 × 1080 pixeli) arată câți pixeli încap pe lățime și înălțime: cu cât rezoluția este mai mare, cu atât imaginea este mai clară și mai detaliată.',
        'Deoarece fiecare canal R, G, B ocupă 1 Byte (8 biți = 2⁸ = 256 valori de la 0 la 255), un pixel RGB „True Color” folosește 24 de biți și poate reda peste 16,7 milioane de nuanțe!'
      ],
      syntaxOrFormula: {
        title: 'Coduri RGB clasice (CSS / Grafică 2D)',
        code: 'rgb(0, 0, 0)       -> Negru (lipsă lumină)\nrgb(255, 255, 255) -> Alb pur (toate 3 culorile la maxim)\nrgb(255, 0, 0)     -> Roșu pur (#FF0000 în hexazecimal)\nrgb(13, 148, 136)  -> Teal ArkyEdu (#0D9488)'
      },
      example:
        'Dacă mărești foarte mult o imagine raster (.jpg / .png), vei vedea pătrățelele de pixeli (pixelare), spre deosebire de o grafică vectorială (.svg) care rămâne perfect clară la orice zoom.',
      commonMistake:
        'Confuzia între modelul RGB (aditiv, pentru ecrane și web — maximul dă ALB) și modelul CMYK (substractiv, cerneluri de imprimantă — combinarea maximă dă NEGRU).',
      vsComparison: {
        title: 'Imagine Raster (JPG/PNG) vs. Vectorială (SVG)',
        summary:
          'Imaginile raster sunt grile fixe de pixeli (bune pentru fotografii); imaginile vectoriale descriu forme prin ecuații matematice și nu se pixelează niciodată la mărire (ideale pentru sigle/icoane).'
      },
      faqs: [
        {
          question: 'Câte valori poate lua fiecare canal R, G sau B?',
          answer: '256 de valori întregi, de la 0 (stins) până la 255 (intensitate maximă).'
        }
      ],
      keywords: 'ce este un pixel, model rgb 0 255, rezolutie full hd raster vs vectorial'
    },
    en: {
      slug: 'rgb-pixel-resolution',
      term: 'Pixel, Resolution & RGB Color Model (0–255)',
      shortAnswer:
        'A pixel (Picture Element) is the smallest colored square in a digital image or screen grid. In the RGB color model, each pixel blends Red, Green, and Blue light channels ranging from 0 to 255.',
      explanation: [
        'Screen or image resolution (such as 1920×1080 Full HD) measures pixel dimensions horizontally and vertically.',
        'Because each of the 3 channels uses 1 Byte (0–255), standard 24-bit True Color produces 256 × 256 × 256 ≈ 16.7 million distinct colors.'
      ],
      syntaxOrFormula: {
        title: 'Common RGB & Hex Color Codes',
        code: 'rgb(0, 0, 0)       -> Black (#000000)\nrgb(255, 255, 255) -> White (#FFFFFF)\nrgb(255, 0, 0)     -> Pure Red (#FF0000)\nrgb(13, 148, 136)  -> Teal (#0D9488)'
      },
      example:
        'Zooming far into a JPEG photo exposes square pixels, whereas an SVG logo scales infinitely smoothly.',
      commonMistake:
        'Mixing up additive screen colors (RGB: combining light creates white) with subtractive printer inks (CMYK: combining ink creates dark black).',
      vsComparison: {
        title: 'Raster (.jpg / .png) vs. Vector (.svg)',
        summary:
          'Raster images store a fixed grid of pixels; vector graphics store geometric math paths that never blur when resized.'
      },
      faqs: [
        {
          question: 'Why does each RGB channel stop at 255?',
          answer: 'Each channel is stored in 1 byte (8 bits), which holds 256 integer values from 0 through 255.'
        }
      ],
      keywords: 'what is a pixel, rgb color model 0 to 255, raster vs vector svg'
    }
  },

  // =========================================================================
  // 4. WEB, NETWORKING & CYBERSECURITY (8)
  // =========================================================================
  {
    id: 'html5-semantics',
    category: 'web-security',
    grades: ['8'],
    gradeTagRo: 'Clasa a VIII-a',
    gradeTagEn: 'Grade 8',
    relatedModuleId: 'g8_web_a',
    relatedMissionId: 'g8_web_a',
    relatedBlogIds: ['primul-site-web-clasa-8-html5-https-google-sites'],
    relatedTermIds: ['http-vs-https-ssl', 'file-tree-path', 'rgb-pixel-resolution'],
    ro: {
      slug: 'etichete-html5-semantice',
      term: 'HTML5 și Etichete Semantice (<header>, <main>, <article>, <img>)',
      shortAnswer:
        'HTML5 (HyperText Markup Language) este limbajul de marcare care construiește structura oricărei pagini web folosind etichete (tag-uri). Etichetele semantice (<header>, <nav>, <main>, <footer>) le explică motoarelor de căutare și cititoarelor de ecran ce rol are fiecare secțiune.',
      explanation: [
        'HTML nu este un limbaj de programare (nu ia decizii cu if/while), ci scheletul paginii web; CSS îi adaugă culorile și așezarea în pagină, iar JavaScript îi dă interactivitate.',
        'Orice pagină validă începe cu <!DOCTYPE html>, continuă cu <html>, <head> (metadate și titlu invizibil în pagină) și <body> (conținutul vizibil).'
      ],
      syntaxOrFormula: {
        title: 'Schelet minimal HTML5 valid și accesibil',
        code: '<!DOCTYPE html>\n<html lang="ro">\n<head>\n  <meta charset="utf-8">\n  <title>Proiectul Meu</title>\n</head>\n<body>\n  <header><h1>Salut, Web!</h1></header>\n  <main><img src="poza.jpg" alt="Descriere obligatorie"></main>\n</body>\n</html>'
      },
      example:
        'Adăugarea atributului alt="..." la eticheta <img> ajută elevii nevăzători și ajută Google să înțeleagă ce reprezintă fotografia ta.',
      commonMistake:
        'Uitarea închiderii tag-urilor pereche (ex. </p>, </a>), omiterea atributului alt la imagini sau folosirea mai multor tag-uri <h1> pe aceeași pagină.',
      vsComparison: {
        title: 'HTML vs. CSS vs. JavaScript',
        summary:
          'HTML este structura (pereții casei), CSS este aspectul vizual (vopseaua și mobila), iar JavaScript este comportamentul interactiv (butoanele și luminile).'
      },
      faqs: [
        {
          question: 'De ce este obligatorie eticheta <meta charset="utf-8"> în <head>?',
          answer: 'Ca să permită browserului afișarea corectă a diacriticelor românești (ă, â, î, ș, ț) și a simbolurilor internaționale.'
        }
      ],
      keywords: 'ce este html5 clasa 8, structura pagina html, taguri semantice header main alt'
    },
    en: {
      slug: 'html5-semantics',
      term: 'HTML5 & Semantic Elements (<header>, <main>, <article>)',
      shortAnswer:
        'HTML5 (HyperText Markup Language) defines the structural skeleton of every webpage using markup tags. Semantic elements like <header>, <nav>, <main>, and <footer> communicate each section’s meaning to search engines and screen readers.',
      explanation: [
        'HTML supplies document structure, CSS controls visual styling, and JavaScript handles interactive behavior.',
        'Every valid HTML5 page starts with <!DOCTYPE html>, includes <meta charset="utf-8"> inside <head>, and places one clear <h1> inside visible content.'
      ],
      syntaxOrFormula: {
        title: 'Minimal Valid HTML5 Document',
        code: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="utf-8">\n  <title>My Project</title>\n</head>\n<body>\n  <header><h1>Hello Web</h1></header>\n  <main><img src="photo.jpg" alt="Descriptive alt text"></main>\n</body>\n</html>'
      },
      example:
        'Using <nav> around menu links and alt descriptions on <img> boosts both accessibility scores and SEO.',
      commonMistake:
        'Forgetting closing tags (</div>, </a>), skipping alt attributes on images, or dumping visible content inside <head>.',
      vsComparison: {
        title: 'HTML vs. CSS',
        summary:
          'HTML defines what content is (heading, paragraph, link); CSS defines how it looks (color, spacing, font size).'
      },
      faqs: [
        {
          question: 'Is HTML a programming language?',
          answer: 'HTML is a markup language for structuring documents rather than a procedural programming language like C++.'
        }
      ],
      keywords: 'html5 semantic tags tutorial, doctype html meta charset, html vs css'
    }
  },
  {
    id: 'http-vs-https-ssl',
    category: 'web-security',
    grades: ['6', '8'],
    gradeTagRo: 'Clasele VI–VIII',
    gradeTagEn: 'Grades 6–8',
    relatedModuleId: 'g8_web_b',
    relatedMissionId: 'g8_web_b',
    relatedBlogIds: ['primul-site-web-clasa-8-html5-https-google-sites', 'siguranta-copii-tiktok-roblox-discord-phishing-2fa'],
    relatedTermIds: ['ip-address-dns', 'phishing-social-engineering', 'html5-semantics'],
    ro: {
      slug: 'protocol-http-vs-https-ssl-tls',
      term: 'Protocol HTTP vs. HTTPS (Criptare SSL/TLS)',
      shortAnswer:
        'HTTP este protocolul prin care browserul cere pagini de la un server web în text simplu necriptat. HTTPS (HTTP Secure) adaugă criptare SSL/TLS (simbolul lacătului din browser), protejând parolele și datele tale pe drumul prin rețea.',
      explanation: [
        'Pe un Wi-Fi public (ex. la cafenea sau mall), traficul HTTP poate fi interceptat și citit de alte persoane din aceeași rețea.',
        'HTTPS criptează conexiunea între dispozitivul tău și server, verificând totodată prin certificatul digital că serverul este autentic.'
      ],
      syntaxOrFormula: {
        title: 'Anatomia unei adrese Web (URL)',
        code: 'https://www.arkyedu.com/glosar/\n^^^^^   ^^^^^^^^^^^^^^  ^^^^^^^\nProtocol    Domeniu       Cale (Path)'
      },
      example:
        'Nu introduce niciodată parola contului școlar sau datele cardului pe o pagină marcată de browser ca „Not Secure / Nesigur” (http://).',
      commonMistake:
        'A crede că un lacăt HTTPS înseamnă automat că site-ul este cinstit! Atacatorii de phishing pot avea și ei certificat HTTPS gratuit pe un domeniu fals (ex. r0blox-free.com) — verifică mereu domeniul exact!',
      vsComparison: {
        title: 'HTTP (Port 80) vs. HTTPS (Port 443)',
        summary:
          'HTTP trimite datele în clar ca o carte poștală; HTTPS le trimite într-un seif cifrat cu cheie TLS.'
      },
      faqs: [
        {
          question: 'Garantează HTTPS că un site nu este o înșelătorie (phishing)?',
          answer: 'Nu! HTTPS garantează doar că legătura până la acel server este criptată. Trebuie să verifici întotdeauna ortografia exactă a numelui de domeniu.'
        }
      ],
      keywords: 'diferenta http si https, ce este certificatul ssl tls, anatomie url clasa 8'
    },
    en: {
      slug: 'http-vs-https-ssl',
      term: 'HTTP vs. HTTPS (SSL/TLS Encryption)',
      shortAnswer:
        'HTTP is the web protocol browsers use to fetch pages in plain text. HTTPS (HTTP Secure) wraps that traffic in SSL/TLS encryption so passwords and form inputs cannot be read in transit.',
      explanation: [
        'On shared public Wi-Fi, plain HTTP requests can be snooped on by attackers on the same network.',
        'HTTPS verifies the server’s digital certificate and encrypts every packet between your browser and the website.'
      ],
      syntaxOrFormula: {
        title: 'URL Anatomy',
        code: 'https://www.arkyedu.com/glosar/en/\n^^^^^   ^^^^^^^^^^^^^^^ ^^^^^^^^^^^\nScheme     Domain Name     Path'
      },
      example:
        'Always check for https:// before typing a school login or password.',
      commonMistake:
        'Assuming the padlock icon guarantees a site is trustworthy—phishing domains can enable HTTPS too, so always double-check the domain spelling!',
      vsComparison: {
        title: 'HTTP vs. HTTPS',
        summary:
          'HTTP is like mailing a postcard anyone can read; HTTPS is like sending a locked box.'
      },
      faqs: [
        {
          question: 'Can a fake phishing website still have HTTPS?',
          answer: 'Yes. HTTPS encrypts the connection, so you must always inspect the actual domain name in the address bar.'
        }
      ],
      keywords: 'http vs https explained, ssl tls encryption, url parts protocol domain path'
    }
  },
  {
    id: 'ip-address-dns',
    category: 'web-security',
    grades: ['5', '6', '8'],
    gradeTagRo: 'Clasele V–VIII',
    gradeTagEn: 'Grades 5–8',
    relatedModuleId: 'internet-siguranta',
    relatedMissionId: 'internet1',
    relatedBlogIds: ['primul-site-web-clasa-8-html5-https-google-sites'],
    relatedTermIds: ['http-vs-https-ssl', 'phishing-social-engineering', 'html5-semantics'],
    ro: {
      slug: 'adresa-ip-si-server-dns',
      term: 'Adresa IP (IPv4 / IPv6) și Serverul DNS',
      shortAnswer:
        'Adresa IP (Internet Protocol) este adresa numerică unică a fiecărui dispozitiv conectat la o rețea (ex. 192.168.1.15). Serverul DNS (Domain Name System) este „agenda telefonică” a Internetului care traduce numele ușor de reținut (arkyedu.com) în adresa IP numerică a serverului.',
      explanation: [
        'Calculatoarele comunică doar prin numere IP, exact cum telefoanele apelează numere, nu nume.',
        'Când scrii „www.arkyedu.com” în browser, calculatorul întreabă mai întâi un server DNS ce adresă IP corespunde domeniului, apoi deschide site-ul de la acel IP.'
      ],
      syntaxOrFormula: {
        title: 'Format IPv4 vs. IPv6 și Localhost',
        code: 'IPv4:      4 numere între 0 și 255 separate prin punct -> 192.168.1.1\nLocalhost: 127.0.0.1 (înseamnă mereu „acest calculator”)\nDNS:       arkyedu.com  ---> [DNS Lookup] --->  IP Server'
      },
      example:
        'Dacă DNS-ul nu răspunde, browserul spune „DNS_PROBE_FINISHED” chiar dacă conexiunea fizică la cablu/Wi-Fi funcționează.',
      commonMistake:
        'A crede că IP-ul local din casă (192.168.x.x) este vizibil pe internet — acela este un IP privat din spatele routerului; routerul are un IP public atribuit de furnizorul de internet.',
      vsComparison: {
        title: 'Adresa IP vs. Numele de Domeniu',
        summary:
          'Adresa IP (ex. 142.250.180.78) este adresa reală numerică din rețea; numele de domeniu (google.com) este eticheta umană tradusă prin DNS.'
      },
      faqs: [
        {
          question: 'Ce valoare maximă poate avea un grup dintr-o adresă IPv4?',
          answer: '255 (deoarece fiecare dintre cele 4 grupe este un octet / byte de 8 biți: 0..255).'
        }
      ],
      keywords: 'ce este adresa ip, ce face serverul dns, ipv4 0 255 clasa 5 internet'
    },
    en: {
      slug: 'ip-address-dns',
      term: 'IP Address (IPv4/IPv6) & DNS (Domain Name System)',
      shortAnswer:
        'An IP address is the unique numeric identifier assigned to each device on a network (e.g., 192.168.1.1). DNS (Domain Name System) acts like the Internet’s phonebook, translating human-readable domains like arkyedu.com into numeric IP addresses.',
      explanation: [
        'Each of the four numbers in a classic IPv4 address ranges from 0 to 255 (1 byte each).',
        'IPv6 uses 128-bit hexadecimal addresses so the world never runs out of internet addresses.'
      ],
      syntaxOrFormula: {
        title: 'IP & DNS Resolution Flow',
        code: 'IPv4 range: 0.0.0.0 to 255.255.255.255 (4 bytes)\nLoopback:   127.0.0.1 (localhost / this machine)\nDNS step:   "arkyedu.com" -> [DNS Resolver] -> Server IP'
      },
      example:
        'Typing 127.0.0.1 while testing a Grade 8 web project connects back to your own computer.',
      commonMistake:
        'Assuming 192.168.1.10 is a public internet IP—it is a private home-router LAN address shared behind NAT.',
      vsComparison: {
        title: 'IPv4 vs. IPv6',
        summary:
          'IPv4 uses 32 bits (~4.3 billion addresses); IPv6 uses 128 bits (virtually unlimited addresses for IoT and smartphones).'
      },
      faqs: [
        {
          question: 'Why does each IPv4 octet stop at 255?',
          answer: 'Each section is 8 bits wide, supporting 256 values from 0 through 255.'
        }
      ],
      keywords: 'what is an ip address, how dns works, ipv4 vs ipv6 middle school'
    }
  },
  {
    id: 'phishing-social-engineering',
    category: 'web-security',
    grades: ['5', '6', '7', '8'],
    gradeTagRo: 'Clasele V–VIII',
    gradeTagEn: 'Grades 5–8',
    relatedModuleId: 'malware-securitate',
    relatedMissionId: 'g6_malware',
    relatedBlogIds: ['siguranta-copii-tiktok-roblox-discord-phishing-2fa'],
    relatedTermIds: ['two-factor-auth-2fa', 'malware-cybersecurity', 'http-vs-https-ssl'],
    ro: {
      slug: 'phishing-inginerie-sociala',
      term: 'Phishing și Inginerie Socială',
      shortAnswer:
        'Phishing-ul („pescuitul digital”) este o metodă de fraudă online prin care atacatorii se dau drept companii, jocuri sau prieteni (prin SMS, Discord, TikTok sau e-mail) pentru a păcăli victima să își introducă parola, codul 2FA sau datele cardului pe un site clonat.',
      explanation: [
        'Ingineria socială exploatează emoțiile umane — urgența („Contul tău va fi șters în 2 ore!”) sau lăcomia („Ai câștigat 10.000 Robux gratuit!”) — pentru a te face să dai click fără să verifici.',
        'Atacatorii folosesc adesea typosquatting: domenii asemănătoare cu cele reale, cum ar fi disc0rd-nitro.com sau r0blox-login.net.'
      ],
      syntaxOrFormula: {
        title: 'Regula celor 3 verificări anti-phishing',
        code: '1. EXPEDITORUL: Corespunde domeniul real după @ (nu doar numele afișat)?\n2. LINKUL:      Treci mouse-ul peste buton — duce pe domeniul oficial?\n3. URGENȚA:     Cere parola, codul SMS sau „premiu gratuit” sub presiune?'
      },
      example:
        'Un mesaj pe Discord de la un cont spart al unui coleg care spune „Testează jocul meu nou de pe linkul ăsta” sau „Loghează-te cu Steam ca să votezi echipa” este o capcană clasică de phishing.',
      commonMistake:
        'Logarea cu contul real de Google, Roblox sau Steam printr-un link trimis în chat privat în loc să deschizi aplicația oficială direct.',
      vsComparison: {
        title: 'Phishing vs. Malware (Virus)',
        summary:
          'Phishing-ul te păcălește psihologic să îți dai singur parola pe o pagină falsă; malware-ul este un program dăunător instalat pe dispozitiv.'
      },
      faqs: [
        {
          question: 'Ce fac dacă am introdus parola pe un link de phishing?',
          answer: 'Schimbă parola imediat din aplicația oficială, activează autentificarea în 2 pași (2FA) și folosește „Log out of all devices” din setările de securitate.'
        }
      ],
      keywords: 'ce este phishing, exemple phishing roblox discord tiktok, inginerie sociala clasa 6'
    },
    en: {
      slug: 'phishing-social-engineering',
      term: 'Phishing & Social Engineering',
      shortAnswer:
        'Phishing is a cyberattack where scammers impersonate trusted brands, games, or friends via email, SMS, or Discord/TikTok DMs to trick victims into entering passwords, 2FA codes, or payment details on fake login pages.',
      explanation: [
        'Social engineering relies on urgency ("Your account will be suspended in 2 hours!") or false rewards ("Claim 10,000 free Robux!") to bypass critical thinking.',
        'Look closely for lookalike URLs (typosquatting) like disc0rd-gift.com or steamcornmunity.com.'
      ],
      syntaxOrFormula: {
        title: '3-Step Phishing Check',
        code: '1. Inspect the exact domain name (not just the display name)\n2. Never click urgent prize or suspension links—open the official app yourself\n3. Never share one-time 2FA/SMS verification codes with anyone'
      },
      example:
        'A DM claiming "Vote for my esports team via this Steam login link" is an automated credential-stealing scam.',
      commonMistake:
        'Trusting a link just because a friend sent it—friends’ accounts are often hijacked first to spread phishing.',
      vsComparison: {
        title: 'Phishing vs. Brute-Force Attack',
        summary:
          'Phishing tricks the user into handing over the key willingly; brute-force guesses thousands of passwords automatically.'
      },
      faqs: [
        {
          question: 'What is typosquatting?',
          answer: 'Registering lookalike domains with tiny spelling tricks—like rnicrosoft.com or r0blox.com—to fool users.'
        }
      ],
      keywords: 'what is phishing middle school, social engineering discord scam, check fake url'
    }
  },
  {
    id: 'malware-cybersecurity',
    category: 'web-security',
    grades: ['6', '7', '8'],
    gradeTagRo: 'Clasele VI–VIII',
    gradeTagEn: 'Grades 6–8',
    relatedModuleId: 'malware-securitate',
    relatedMissionId: 'g6_malware',
    relatedBlogIds: ['siguranta-copii-tiktok-roblox-discord-phishing-2fa'],
    relatedTermIds: ['phishing-social-engineering', 'file-extension', 'two-factor-auth-2fa'],
    ro: {
      slug: 'malware-troian-ransomware',
      term: 'Malware (Virus, Troian, Ransomware, Spyware)',
      shortAnswer:
        'Malware (Malicious Software) este termenul general pentru orice program creat cu intenție dăunătoare: să fure parole (Spyware/Infostealer), să blocheze și să ceară răscumpărare pe fișiere (Ransomware) sau să se ascundă într-un joc piratat (Cal Troian).',
      explanation: [
        'Elevii întâlnesc cel mai des „Troieni” mascați ca moduri gratuite de Minecraft, „cheat-uri” de Roblox/Fortnite sau programe piratate (.exe / .zip cu parolă).',
        'Ransomware-ul criptează toate pozele și documentele de pe calculator și cere bani pentru deblocare — singura protecție sigură este prevenția + backup-ul regulat offline sau în Cloud.'
      ],
      syntaxOrFormula: {
        title: 'Principalele tipuri de Malware (Programa Clasa a VI-a)',
        code: 'Virus:      Se atașează de alte fișiere și se multiplică la execuție\nTroian:     Se preface a fi un joc/program util ca să intre în PC\nRansomware: Criptează fișierele și cere răscumpărare\nSpyware:    Spionează tastele apăsate (Keylogger) și fură parole\nAdware:     Afișează reclame agresive nedorite în browser'
      },
      example:
        'Un fișier „Roblox_Hack_2026.exe” descărcat de pe YouTube nu oferă resurse în joc (imposibil pe serverele jocului!), ci fură tokenurile sesiunilor salvate în Chrome.',
      commonMistake:
        'Dezactivarea Windows Defender / Antivirusului la cererea unui clip de pe internet care spune „Dezactivează antivirusul, este false positive!”.',
      vsComparison: {
        title: 'Virus vs. Cal Troian (Trojan)',
        summary:
          'Virusul se replică infectând alte fișiere; Troianul NU se multiplică singur, ci te păcălește să îl deschizi de bunăvoie sub forma unui program atractiv.'
      },
      faqs: [
        {
          question: 'Ce este un Ransomware și cum mă protejez de el?',
          answer: 'Este un malware care îți blochează fișierele prin criptare cerând plată. Protecția constă în actualizări la zi, antivirus activ și backup periodic pe un stick USB scos din PC sau în Cloud.'
        }
      ],
      keywords: 'tipuri de malware clasa 6, diferenta virus troian ransomware spyware'
    },
    en: {
      slug: 'malware-cybersecurity',
      term: 'Malware Types (Virus, Trojan, Ransomware, Spyware)',
      shortAnswer:
        'Malware (Malicious Software) covers any harmful program built to damage systems or steal data—including Viruses, Trojans disguised inside fake downloads, Spyware that logs passwords, and Ransomware that locks your files.',
      explanation: [
        'Students most often encounter Trojans bundled inside "free game cheats," cracked apps, or sketchy browser extensions.',
        'Keeping OS updates enabled, leaving Windows Security / Defender active, and keeping off-device backups neutralize most threats.'
      ],
      syntaxOrFormula: {
        title: 'Malware Family Summary',
        code: 'Virus:      Attaches to files and spreads when opened\nTrojan:     Disguises itself as useful software or game mods\nRansomware: Encrypts personal files and demands payment\nSpyware:    Secretly monitors keystrokes and saved browser tokens'
      },
      example:
        'A "Free_Game_Mod.exe" asking you to turn off antivirus protection is almost certainly an infostealer Trojan.',
      commonMistake:
        'Disabling antivirus protection because a random YouTube tutorial claims a cracked file is a "false positive".',
      vsComparison: {
        title: 'Trojan vs. Worm',
        summary:
          'A Trojan waits for a human to download and run it; a Worm automatically spreads across network connections without human clicks.'
      },
      faqs: [
        {
          question: 'What is the best defense against Ransomware?',
          answer: 'Maintaining automatic backups (Cloud or disconnected external drive) plus never running unverified executables.'
        }
      ],
      keywords: 'malware types virus trojan ransomware spyware middle school'
    }
  },
  {
    id: 'two-factor-auth-2fa',
    category: 'web-security',
    grades: ['6', '7', '8'],
    gradeTagRo: 'Clasele VI–VIII',
    gradeTagEn: 'Grades 6–8',
    relatedModuleId: 'internet-siguranta',
    relatedMissionId: 'internet1',
    relatedBlogIds: ['siguranta-copii-tiktok-roblox-discord-phishing-2fa'],
    relatedTermIds: ['phishing-social-engineering', 'malware-cybersecurity', 'http-vs-https-ssl'],
    ro: {
      slug: 'autentificare-doi-pasi-2fa',
      term: 'Autentificare în Doi Pași (2FA) și Parole Puternice',
      shortAnswer:
        'Autentificarea în doi pași (2FA — Two-Factor Authentication) adaugă un al doilea strat de securitate pe lângă parolă: chiar dacă cineva îți află parola, nu se poate conecta fără codul temporar de pe telefonul tău sau cheia de securitate.',
      explanation: [
        'Cele trei categorii de factori sunt: ceva ce ȘTII (parola), ceva ce AI (telefonul/aplicația Authenticator) și ceva ce EȘTI (amprenta sau Face ID).',
        'O parolă puternică este de fapt o frază lungă (Passphrase) de minimum 12–16 caractere unică pentru fiecare cont, fără date personale ca anul nașterii sau numele echipei preferate.'
      ],
      syntaxOrFormula: {
        title: 'Ierarhia siguranței 2FA (de la bun la excelent)',
        code: '1. Cod prin SMS        (bun, mai bine decât nimic)\n2. Aplicație Authenticator (TOTP 6 cifre la 30 sec - foarte sigur)\n3. Passkey / Biometrie (rezistent inclusiv la phishing!)'
      },
      example:
        'Activați 2FA prin aplicație (Google/Microsoft Authenticator) pe conturile de Google, Discord, Roblox și TikTok și salvați codurile de rezervă pe hârtie.',
      commonMistake:
        'Refolosirea aceleiași parole pe toate site-urile (dacă un site mic este spart, atacatorii intră imediat în e-mailul principal!) sau trimiterea codului 2FA primit prin SMS unui „prieten” pe chat.',
      vsComparison: {
        title: 'Doar Parolă vs. Parolă + 2FA',
        summary:
          'O parolă simplă este o singură încuietoare; 2FA adaugă un al doilea lacăt fizic legat de telefonul tău pe care un hacker din altă țară nu îl deține.'
      },
      faqs: [
        {
          question: 'Cât de lungă ar trebui să fie o parolă sigură în 2026?',
          answer: 'Minimum 12–16 caractere, ideal o combinație unică de cuvinte cu litere mari, cifre și simboluri (Passphrase).'
        }
      ],
      keywords: 'ce este 2fa autentificare doi pasi, cum fac parola sigura passkey'
    },
    en: {
      slug: 'two-factor-auth-2fa',
      term: 'Two-Factor Authentication (2FA) & Strong Passwords',
      shortAnswer:
        'Two-Factor Authentication (2FA) adds a second verification check beyond your password—such as a 6-digit app code or fingerprint—so an attacker who steals your password still cannot enter your account.',
      explanation: [
        'Authentication factors fall into three groups: something you know (password), something you have (authenticator app/phone), and something you are (fingerprint/Face ID).',
        'Never reuse passwords across websites; prefer long 14+ character passphrases or Passkeys.'
      ],
      syntaxOrFormula: {
        title: '2FA Security Hierarchy',
        code: 'Good:      SMS one-time code\nBetter:    Authenticator app (30-second rotating codes)\nBest:      Passkey / Hardware security key (phishing-resistant)'
      },
      example:
        'Turning on Authenticator-based 2FA on Discord, Google, and gaming accounts stops automated credential-stuffing attacks.',
      commonMistake:
        'Sharing a 6-digit verification code with someone in chat ("I accidentally sent a code to your phone, send it back!")—that is how scammers hijack accounts!',
      vsComparison: {
        title: 'Password vs. Passphrase',
        summary:
          '"Parola123!" is easy for computers to crack; "Blue-Bicycle-Eats-42-Apples!" is longer, harder to crack, and easier to remember.'
      },
      faqs: [
        {
          question: 'Why is an Authenticator app safer than SMS codes?',
          answer: 'Authenticator codes are generated offline on your device and cannot be intercepted through SIM-swapping scams.'
        }
      ],
      keywords: 'what is 2fa two factor authentication, passphrase vs password'
    }
  },
  {
    id: 'netiquette-to-cc-bcc',
    category: 'web-security',
    grades: ['6', '7'],
    gradeTagRo: 'Clasa a VI-a',
    gradeTagEn: 'Grade 6',
    relatedModuleId: 'email-neticheta',
    relatedMissionId: 'g6_email',
    relatedBlogIds: ['word-google-docs-referate-scolare-diacritice-margini-cuprins', 'siguranta-copii-tiktok-roblox-discord-phishing-2fa'],
    relatedTermIds: ['cyberbullying-119', 'typography-diacritics-margins', 'phishing-social-engineering'],
    ro: {
      slug: 'neticheta-email-to-cc-bcc',
      term: 'Netichetă & Câmpurile E-mail (To, Cc, Bcc)',
      shortAnswer:
        'Neticheta reprezintă ansamblul regulilor de politețe și comunicare corectă în mediul online. Într-un e-mail, câmpul To este pentru destinatarii principali, Cc (Carbon Copy) trimite o copie vizibilă tuturor, iar Bcc (Blind Carbon Copy) ascunde adresele de e-mail între ele.',
      explanation: [
        'Un e-mail formal către profesor trebuie să aibă întotdeauna: Subiect clar (ex. „Temă TIC Clasa 6B - Popescu Andrei”), formulă de salut, mesaj politicos cu diacritice, atașament verificat și semnătură.',
        'Scrierea integrală cu MAJUSCULE (CAPS LOCK) este percepută în netichetă drept ȚIPAT.'
      ],
      syntaxOrFormula: {
        title: 'Diferența To vs. Cc vs. Bcc',
        code: 'To  (Către):          Destinatarul principal de la care aștepți răspuns\nCc  (Copie):          Alți colegi/profesori informați (toți văd adresele)\nBcc (Copie ascunsă):  Destinatarii NU își văd adresele reciproc (confidențialitate GDPR!)'
      },
      example:
        'Când un profesor trimite un anunț către 25 de părinți, folosește Bcc pentru a nu dezvălui adresele personale ale tuturor.',
      commonMistake:
        'Scrierea întregului mesaj direct în câmpul „Subiect”, uitarea atașamentului („Vă trimit tema atașată” cu fișierul lipsă) sau apăsarea „Reply All” când vrei să răspunzi unei singure persoane.',
      vsComparison: {
        title: 'Cc vs. Bcc',
        summary:
          'În Cc toată lumea vede cine a mai primit mesajul; în Bcc identitatea celorlalți destinatari rămâne confidențială.'
      },
      faqs: [
        {
          question: 'Ce înseamnă când cineva scrie un mesaj întreg cu CAPS LOCK pe internet?',
          answer: 'Conform regulilor de netichetă, scrierea cu majuscule echivalează cu a țipa la interlocutor.'
        }
      ],
      keywords: 'ce este neticheta clasa 6, diferenta to cc bcc email, reguli email profesor'
    },
    en: {
      slug: 'netiquette-to-cc-bcc',
      term: 'Netiquette & Email Fields (To, Cc, Bcc)',
      shortAnswer:
        'Netiquette (Internet Etiquette) is the set of respectful rules for online communication. In email, To holds primary recipients, Cc (Carbon Copy) sends visible copies to others, and Bcc (Blind Carbon Copy) hides recipients’ addresses from one another.',
      explanation: [
        'A proper school email includes a clear Subject line, polite greeting, concise body, attached files, and your name/class signature.',
        'Writing whole messages in ALL CAPS is considered shouting online.'
      ],
      syntaxOrFormula: {
        title: 'Email Recipient Fields',
        code: 'To  -> Primary recipient expected to reply\nCc  -> Kept in the loop (addresses visible to everyone)\nBcc -> Hidden copy (protects recipient email privacy)'
      },
      example:
        'Always use Bcc when emailing a large group of parents or classmates who shouldn’t share personal addresses publicly.',
      commonMistake:
        'Pasting the entire message into the Subject box, forgetting to attach the file before hitting Send, or accidentally hitting "Reply All".',
      vsComparison: {
        title: 'Cc vs. Bcc',
        summary:
          'Cc reveals everyone’s address on the thread; Bcc keeps each recipient private.'
      },
      faqs: [
        {
          question: 'What does ALL CAPS mean in online netiquette?',
          answer: 'Typing entire sentences in ALL CAPS comes across as yelling and is considered impolite.'
        }
      ],
      keywords: 'what is netiquette, email to cc bcc difference, writing school email'
    }
  },
  {
    id: 'cyberbullying-119',
    category: 'web-security',
    grades: ['5', '6', '7', '8'],
    gradeTagRo: 'Clasele V–VIII',
    gradeTagEn: 'Grades 5–8',
    relatedModuleId: 'internet-siguranta',
    relatedMissionId: 'internet1',
    relatedBlogIds: ['siguranta-copii-tiktok-roblox-discord-phishing-2fa'],
    relatedTermIds: ['netiquette-to-cc-bcc', 'phishing-social-engineering', 'two-factor-auth-2fa'],
    ro: {
      slug: 'cyberbullying-siguranta-online-119',
      term: 'Cyberbullying, Amprenta Digitală & Linia de Ajutor 119',
      shortAnswer:
        'Cyberbullying-ul este hărțuirea repetată și intenționată a unei persoane prin internet, jocuri sau rețele sociale (insulte, excludere, distribuirea de poze fără acord). Orice acțiune online lasă o amprentă digitală greu de șters, iar în România copiii pot cere ajutor gratuit și confidențial la numărul 119.',
      explanation: [
        'Spre deosebire de un conflict din curtea școlii, cyberbullying-ul poate urmări victima 24/7 pe telefon, iar capturile de ecran pot fi redistribuite rapid.',
        'Dacă ești ținta sau martorul unui abuz online, urmează protocolul în 4 pași: 1. Nu răspunde la provocări; 2. Fă capturi de ecran (dovezi); 3. Blochează și raportează contul; 4. Vorbește cu un părinte, dirigintele sau sună la 119 / Ora de Net (oradenet.ro).'
      ],
      syntaxOrFormula: {
        title: 'Protocolul de reacție rapidă (Stop – Dovezi – Blocare – Ajutor)',
        code: '1. STOP:       Nu răspunde cu jigniri agresorului\n2. DOVEZI:     Salvează screenshot-uri cu data, ora și numele contului\n3. BLOCARE:    Folosește Block + Report pe TikTok / Instagram / Discord / Roblox\n4. AJUTOR:     Părinți, Profesor/Consilier școlar, Telefonul Copilului 119'
      },
      example:
        'Publicarea unei fotografii jenante cu un coleg pe grupul clasei fără permisiunea lui constituie cyberbullying și încalcă viața privată.',
      commonMistake:
        'Ștergerea conversațiilor înainte de a face capturi de ecran (se pierd dovezile!) sau păstrarea tăcerii din rușine ori teamă.',
      vsComparison: {
        title: 'Conflict izolat vs. Cyberbullying',
        summary:
          'O neînțelegere punctuală este o dispută egală; cyberbullying-ul implică intenție repetată de umilire sau intimidare prin mijloace digitale.'
      },
      faqs: [
        {
          question: 'Ce este amprenta digitală (Digital Footprint)?',
          answer: 'Totalitatea urmelor pe care le lași online — postări, comentarii, fotografii, like-uri — care rămân vizibile ani de zile chiar și după ce crezi că le-ai șters.'
        }
      ],
      keywords: 'ce este cyberbullying, amprenta digitala, telefonul copilului 119 siguranta online'
    },
    en: {
      slug: 'cyberbullying-119',
      term: 'Cyberbullying & Digital Footprint',
      shortAnswer:
        'Cyberbullying is repeated, intentional online harassment through social media, messaging groups, or games (insults, rumors, exclusion, or sharing embarrassing photos without consent). Everything posted online leaves a lasting Digital Footprint.',
      explanation: [
        'Digital footprints include comments, photos, public profiles, and shared media—even deleted content may remain as screenshots.',
        'If targeted or witnessing harassment: stop engaging, capture screenshot evidence, block & report the account, and alert a trusted adult or school counselor immediately.'
      ],
      syntaxOrFormula: {
        title: '4-Step Cyberbullying Response',
        code: '1. DON\'T RETALIATE -> Do not feed trolls with angry replies\n2. SAVE EVIDENCE   -> Take clear screenshots before blocking\n3. BLOCK & REPORT  -> Use platform safety tools immediately\n4. TELL AN ADULT   -> Parent, teacher, or national child helpline'
      },
      example:
        'Creating a group chat specifically to mock a classmate or share private screenshots is cyberbullying.',
      commonMistake:
        'Deleting abusive messages before taking screenshots or hiding the problem out of embarrassment.',
      vsComparison: {
        title: 'Disagreement vs. Cyberbullying',
        summary:
          'A single argument is a disagreement; repeated targeted humiliation or intimidation online is cyberbullying.'
      },
      faqs: [
        {
          question: 'Can a "deleted" post completely vanish from the Internet?',
          answer: 'Not always—screenshots, caches, and shares mean your digital footprint can outlast deletion, so think before posting.'
        }
      ],
      keywords: 'what is cyberbullying middle school, digital footprint safety, stop block tell'
    }
  }
];
