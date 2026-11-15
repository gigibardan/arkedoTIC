import { BlogArticle } from './types';

export const BLOG_BATCH_2: BlogArticle[] = [
  {
    id: 'word-google-docs-referate-scolare-diacritice-margini-cuprins',
    category: 'excel-office',
    gradeTagRo: 'Clasele V–VII',
    gradeTagEn: 'Grades 5–7',
    publishedAt: '2026-11-11',
    updatedAt: '2026-11-15',
    featured: true,
    ro: {
      slug: 'word-google-docs-referate-scolare-diacritice-margini-cuprins',
      title: 'Cum scrii corect un referat în Word sau Google Docs (V–VII): Diacritice românești, margini, numerotare pagini și cuprins automat',
      metaTitle: 'Formatare referat Word & Google Docs: Diacritice, pagini, cuprins | ArkyEdu',
      metaDescription: 'Ghid complet de tehnoredactare pentru referate și proiecte școlare (V–VII): tastatura Română Standard (ș, ț cu virgulă), margini A4, numerotare fără pagina 1, ștergere pagină goală și export PDF.',
      keywords: 'cum fac un referat in word, diacritice romanesti corecte word, numerotare pagini word fara prima pagina, cum sterg o pagina goala din word, cuprins automat word, tehnoredactare tic clasa 5 7',
      breadcrumbLabel: 'Referate corecte în Word & Docs',
      categoryLabel: 'Word & Tehnoredactare',
      readTime: '9 min citire',
      tldrTitle: 'Răspuns Rapid (TL;DR)',
      tldr: 'Un referat școlar de nota 10 folosește tastatura „Română (Standard)” pentru ș și ț cu virgulă (nu cu sedilă), aliniere Justify (Stânga-Dreapta), font lizibil de 12 pt (Calibri, Arial sau Times New Roman), spațiu DUPĂ semnele de punctuație (niciodată înainte) și stiluri Heading 1/2 pentru cuprins automat și export curat în format PDF.',
      intro: 'Indiferent dacă pregătești un referat la Istorie, Biologie, Limba Română sau proiectul practic de TIC din clasele V–VII, aspectul documentului contează enorm. De multe ori, elevii pierd puncte nu din lipsa informațiilor, ci din cauza diacriticelor greșite, a spațiilor duble apăsate din obișnuință, a unei pagini goale încăpățânate la final sau a fotografiilor care fug prin tot textul. Iată ghidul complet de rezolvare pas cu pas.',
      sections: [
        {
          id: 'diacritice-romanesti-standard',
          heading: '1. Tastatura corectă: Română (Standard) vs. Română (Legacy) — ș și ț cu virgulă',
          paragraphs: [
            'Multe calculatoare vechi din școli au instalată tastatura „Romanian (Legacy)”, care pune sedilă sub literele ş și ţ în loc de virgulă (ș, ț). Pe unele imprimante sau la convertirea în PDF, caracterele cu sedilă apar cu alt font sau ca pătrățele.',
            'Pentru a scrie corect oficial în România, setează din Windows Settings -> Time & Language -> Language tastatura „Romanian (Standard)”. În această variantă, tastele ă, î, â, ș, ț sunt exact la dreapta literelor P și L, ca pe tastaturile moderne.'
          ],
          callout: {
            title: 'Regula de aur a punctuației în limba română',
            text: 'Semnele de punctuație (, . ; : ! ?) se lipesc ÎNTOTDEAUNA de cuvântul dinainte și sunt urmate de un singur spațiu după ele. Exemple: „Azi, la oră!” (CORECT) vs. „Azi , la oră !” (GREȘIT).',
            variant: 'tip'
          }
        },
        {
          id: 'reguli-machetare-a4-si-imagini',
          heading: '2. Setările standard pentru un referat școlar A4 (și cum oprești imaginile care „fug”)',
          paragraphs: [
            'Înainte să începi să scrii sau să lipești conținut, configurează pagina din fila Layout (Aspect) în Word sau File -> Page setup în Google Docs:',
            'Un secret pe care mulți elevi nu îl știu este opțiunea Wrap Text (Încadrare text) pentru imagini. Dacă inserezi o poză fără să o modifici, ea se comportă ca o literă uriașă și rupe paragrafele. Dă click dreapta pe imagine -> Wrap Text -> Square (Pătrat) sau Tight, și textul se va așeza frumos în jurul ei.'
          ],
          table: {
            caption: 'Standard de tehnoredactare recomandat pentru referate și proiecte V–VIII',
            headers: ['Element document', 'Valoare recomandată', 'Unde se setează (Word / Docs)'],
            rows: [
              ['Format & Margini', 'A4 · Margini 2,5 cm (Normal) sau 2 cm', 'Layout -> Size -> A4 / Margins'],
              ['Font corp text', 'Calibri, Arial sau Times New Roman · 12 pt', 'Home -> Font (pentru tot textul cu Ctrl+A)'],
              ['Aliniere paragrafe', 'Justify (Stânga-Dreapta) pentru text; Center pentru titlu', 'Home -> Paragraph -> Ctrl+J'],
              ['Spațiere între rânduri', '1,15 sau 1,5 rânduri', 'Home -> Line and Paragraph Spacing'],
              ['Încadrare imagini', 'Square (Pătrat) sau Top and Bottom', 'Click imagine -> Picture Format -> Wrap Text']
            ]
          }
        },
        {
          id: 'numerotare-pagini-si-pagina-goala',
          heading: '3. Cum ascunzi numărul de pe pagina de titlu și cum ștergi pagina goală de la final',
          paragraphs: [
            'Două dintre cele mai căutate probleme de Word ale elevilor sunt: „Cum pun numărul de pagină începând cu pagina 2?” și „De ce am o pagină albă goală la final pe care Backspace nu o șterge?”. Rezolvarea durează sub 20 de secunde:'
          ],
          numberedSteps: [
            'Ascundere număr pe Copertă (Pagina 1): Dă dublu-click în partea de jos a paginii (Footer) -> bifează căsuța „Different First Page” (Prima pagină diferită) -> numărul „1” dispare de pe copertă, dar „2, 3, 4...” rămân!',
            'Ștergere pagină goală la final: Apasă butonul ¶ (Show/Hide Formatting Marks) din tab-ul Home ca să vezi simbolurile ascunse -> mergi pe ultima pagină albă, selectează toate simbolurile ¶ goale sau eticheta Page Break și apasă Delete.',
            'Începere capitol pe pagină nouă corect: Nu apăsa Enter de 15 ori! Folosește combinația Ctrl + Enter (Insert Page Break) pentru ca titlul următor să nu se mute când mai adaugi text înainte.'
          ]
        },
        {
          id: 'cuprins-automat-si-export-pdf',
          heading: '4. Cuprins automat în 3 click-uri + De ce predai proiectul ca PDF (nu doar .docx)',
          paragraphs: [
            'În loc să scrii cuprinsul de mână și să pierzi timpul când se schimbă numerele paginilor, aplică stilul Heading 1 pe titlurile capitolelor principale și Heading 2 pe subcapitole. Apoi mergi la References -> Table of Contents -> Automatic Table 1. Cuprinsul și numerele de pagină se generează singure!',
            'La final, salvează o copie în format PDF (File -> Save As / Export -> PDF). Un fișier .docx deschis pe un alt calculator (sau pe altă versiune de Word/LibreOffice) își poate schimba fonturile și paginarea; PDF-ul rămâne identic pe orice laptop, telefon sau imprimantă.'
          ],
          codeBlock: {
            title: 'Cele 6 scurtături esențiale din tastatură pentru Word & Google Docs',
            language: 'text',
            code: `Ctrl + A   -> Selecteaza tot documentul (pentru a uniformiza fontul si alinierea)
Ctrl + J   -> Aliniere Justify (margini drepte in stanga si dreapta)
Ctrl + Enter -> Salt curat la pagina noua (Page Break, fara Enter repetat!)
Ctrl + Shift + V -> Lipire text simplu (Paste without formatting - elimina fundalul gri de pe web!)
Ctrl + Z   -> Anulare ultima actiune (Undo)
Ctrl + S   -> Salvare rapida`,
            caption: 'Combinația Ctrl + Shift + V este salvatoare când citezi definiții și nu vrei să aduci fonturi sau culori nedorite.'
          }
        }
      ],
      checklistTitle: 'Checklist înainte să trimiți sau să tipărești referatul',
      checklist: [
        'Am verificat cu ¶ pornit să nu am spații duble sau zeci de Enter-uri goale între pagini.',
        'Toate diacriticele sunt corecte (ă, â, î, ș, ț) și punctuația nu are spațiu înainte.',
        'Am folosit Ctrl+A pentru un singur font unitar (12 pt) și aliniere Justify.',
        'Nu există pagini goale la final și am salvat versiunea finală și ca PDF.'
      ],
      faqs: [
        {
          question: 'Cum elimin fundalul colorat sau fontul ciudat când copiez un citat?',
          answer: 'Nu folosi Ctrl+V simplu! Folosește Ctrl + Shift + V (Paste Text Only / Keep Text Only) sau alege din click dreapta pictograma cu „A” (Keep Text Only) pentru ca textul să preia formatarea documentului tău.'
        },
        {
          question: 'De ce nu pot șterge ultima pagină goală din Word?',
          answer: 'Word pune obligatoriu un paragraf după un tabel sau un Page Break. Activează simbolul ¶ (Home -> Show/Hide), micșorează acel ultim paragraf la font 1 pt sau șterge manual simbolul Page Break de deasupra lui.'
        },
        {
          question: 'Ce diferență este între .docx și .pdf când predau un proiect?',
          answer: 'Fișierul .docx este editabil și poate arăta diferit pe alte calculatoare dacă lipsesc fonturile. Fișierul .pdf îngheață aspectul paginilor exact cum l-ai creat, fiind ideal pentru predare sau imprimare.'
        },
        {
          question: 'Cum pun numărul de pagină doar din pagina a doua a referatului?',
          answer: 'Dă dublu-click în zona de subsol (Footer) -> din tab-ul Header & Footer bifează „Different First Page”. Apoi șterge numărul de pe pagina 1 — paginile 2, 3, 4 vor rămâne numerotate.'
        },
        {
          question: 'Unde pot exersa interactiv tehnoredactarea și machetarea în Word pentru școală?',
          answer: 'Pe ArkyEdu găsești modulele dedicate Editoare de Text (Clasa a V-a) și Tehnoredactare & Machetare Word (Clasa a VII-a), plus mini-jocul PageCraft în sala Arcade TIC.'
        }
      ],
      internalLinksTitle: 'Exersează Tehnoredactarea & Machetarea pe ArkyEdu',
      internalLinks: [
        {
          label: 'Editoare de Text & Formatare (Clasa a V-a)',
          url: '/cursuri/editoare-text/',
          missionId: 'text1',
          description: 'Învață alinierea, listele, tabelele și regulile de punctuație.'
        },
        {
          label: 'Tehnoredactare & Interfață Word (Clasa a VII-a)',
          url: '/cursuri/g7_word_a/',
          missionId: 'g7_word_a',
          description: 'Stăpânește panglica Ribbon, scurtăturile și exportul PDF.'
        },
        {
          label: 'Machetare de Pagină & Stiluri (Clasa a VII-a)',
          url: '/cursuri/g7_word_b/',
          missionId: 'g7_word_b',
          description: 'Margini A4, antet, subsol și tipografie românească corectă.'
        },
        {
          label: 'PageCraft & Typing Speed Master (Arcade TIC)',
          url: '/arcade/',
          targetView: 'arcade',
          description: 'Antrenează-ți viteza cu diacritice românești și paginarea rapidă.'
        }
      ]
    },
    en: {
      slug: 'word-google-docs-school-reports-margins-headers-pdf',
      title: 'How to Format School Reports in Word & Google Docs (Grades 5–7): Margins, Page Numbers, TOC & PDF Export',
      metaTitle: 'Format School Papers in Word & Docs: Margins, Pages, TOC | ArkyEdu',
      metaDescription: 'Step-by-step middle school formatting guide for Word & Google Docs: A4 margins, hiding page 1 header numbers, deleting blank trailing pages, automatic TOC, and PDF export.',
      keywords: 'how to format school report in word, remove blank page word, hide page number on first page word, automatic table of contents google docs, paste without formatting shortcut, ict word processing grade 5 7',
      breadcrumbLabel: 'Formatting Papers in Word & Docs',
      categoryLabel: 'Word Processing & Layout',
      readTime: '9 min read',
      tldrTitle: 'Quick Answer (TL;DR)',
      tldr: 'An A+ school paper uses A4 margins (2.5 cm / 1 inch), a consistent 12 pt font (Calibri, Arial, or Times New Roman), Justify paragraph alignment, Heading 1/2 styles for an automatic Table of Contents, "Different First Page" to hide the cover page number, and a final PDF export so layout never shifts.',
      intro: 'Whether you are submitting a Science lab report, a History essay, or a Grade 7 ICT document project, clean formatting separates polished work from messy drafts. Students frequently lose points over stubborn blank last pages, images jumping across paragraphs, or mismatched fonts pasted from websites. Here is the complete practical fix.',
      sections: [
        {
          id: 'page-setup-and-images',
          heading: '1. Clean Page Setup & Stopping Images From Jumping Around',
          paragraphs: [
            'Before typing, configure your page size and margins under Layout (Word) or File -> Page setup (Google Docs). Uniform formatting across the whole paper takes seconds with Ctrl+A.',
            'To prevent inserted diagrams from pushing text off the page, right-click the image, open Wrap Text, and switch from In Line with Text to Square or Top and Bottom so text flows neatly around it.'
          ],
          table: {
            caption: 'Recommended Middle School Report Formatting Standards',
            headers: ['Document Element', 'Recommended Setting', 'Where to Find It'],
            rows: [
              ['Paper & Margins', 'A4 (or Letter) · 2.5 cm (1 in) margins', 'Layout -> Size / Margins'],
              ['Body Font', 'Calibri, Arial, or Times New Roman · 12 pt', 'Ctrl+A then Home -> Font'],
              ['Alignment', 'Justify for body text; Center for main title', 'Home -> Paragraph -> Ctrl+J'],
              ['Line Spacing', '1.15 or 1.5 lines', 'Home -> Line and Paragraph Spacing'],
              ['Image Wrapping', 'Square or Top and Bottom', 'Click image -> Picture Format -> Wrap Text']
            ]
          }
        },
        {
          id: 'punctuation-spacing-rules',
          heading: '2. Typography & Punctuation Spacing Rules',
          paragraphs: [
            'Always attach commas, periods, colons, semicolons, exclamation marks, and question marks directly to the preceding word, followed by exactly one space afterward—never put a space before punctuation.',
            'When pasting research notes into your draft, use Ctrl+Shift+V (Paste Without Formatting) instead of Ctrl+V so you never import grey backgrounds or mismatched web fonts.'
          ],
          callout: {
            title: 'Avoid the Empty-Enter Trap',
            text: 'Never press Enter 15 times to start a new section on the next page. Use Ctrl+Enter (Page Break) so adding text earlier in the paper never pushes your headings out of place.',
            variant: 'tip'
          }
        },
        {
          id: 'page-numbers-and-blank-page',
          heading: '3. Hide Page Number on Page 1 & Delete the Stubborn Blank Final Page',
          paragraphs: [
            'Two of the most searched Word frustrations have instant 15-second fixes:'
          ],
          numberedSteps: [
            'Hide Page 1 Number: Double-click inside the Footer -> check "Different First Page" in the Header & Footer ribbon -> delete the "1" on the cover page while keeping "2, 3, 4..." intact.',
            'Delete Trailing Blank Page: Click the ¶ (Show/Hide Formatting Marks) button on the Home tab to reveal invisible symbols -> jump to the last blank page, highlight stray ¶ marks or a Page Break tag, and press Delete.',
            'Use Clean Page Breaks: Press Ctrl+Enter whenever starting a major new section or appendix.'
          ]
        },
        {
          id: 'auto-toc-and-pdf',
          heading: '4. One-Click Table of Contents & Exporting Safe PDFs',
          paragraphs: [
            'Instead of typing dots and page numbers manually, highlight section titles and apply Heading 1 (and Heading 2 for subsections). Then click References -> Table of Contents -> Automatic Table (in Google Docs: Insert -> Table of contents).',
            'Before submitting or printing, export a PDF copy via File -> Save As / Download -> PDF. Unlike .docx files that can reflow on a teacher’s computer, PDF freezes fonts, margins, and diagrams permanently.'
          ],
          codeBlock: {
            title: '6 Time-Saving Keyboard Shortcuts for Word & Google Docs',
            language: 'text',
            code: `Ctrl + A         -> Select entire document (unify font & spacing in one step)
Ctrl + J         -> Justify alignment (crisp straight left & right margins)
Ctrl + Enter     -> Insert clean Page Break
Ctrl + Shift + V -> Paste plain text without external web formatting
Ctrl + Z         -> Undo last action
Ctrl + S         -> Save immediately`,
            caption: 'Mastering Ctrl+Shift+V and Ctrl+Enter eliminates 80% of student layout headaches.'
          }
        }
      ],
      checklistTitle: 'Pre-Submit Document Formatting Checklist',
      checklist: [
        'Toggled ¶ marks to remove double spaces and stacked blank Enter lines.',
        'Uniform 12 pt body font and Justify alignment applied throughout.',
        'Cover page number hidden with Different First Page if a title page is used.',
        'Trailing blank page removed and final copy exported as PDF.'
      ],
      faqs: [
        {
          question: 'How do I paste text without keeping the website background color?',
          answer: 'Press Ctrl + Shift + V (or Cmd + Shift + V on Mac) to paste plain text matching your document’s existing font and size.'
        },
        {
          question: 'Why won’t Backspace delete the blank page at the end of my Word file?',
          answer: 'Word requires a trailing paragraph after tables or manual page breaks. Click the ¶ (Show/Hide) icon on Home to see what sits on the blank page and delete the Page Break or shrink the empty paragraph.'
        },
        {
          question: 'Why should students submit a PDF instead of only a .docx file?',
          answer: 'A .docx file can shift pages if the receiving computer lacks the same fonts or uses a different office suite. A PDF locks every margin, image, and page number identically everywhere.'
        },
        {
          question: 'How do I start page numbering on page 2?',
          answer: 'Double-click the footer area, check "Different First Page" on the Header & Footer tab, and delete the page number from page 1.'
        },
        {
          question: 'Where can students practice Word formatting interactively?',
          answer: 'ArkyEdu includes interactive Grade 5 Text Editors and Grade 7 Word Processing & Page Layout labs plus the PageCraft arcade game.'
        }
      ],
      internalLinksTitle: 'Practice Word Processing & Layout on ArkyEdu',
      internalLinks: [
        {
          label: 'Text Editors & Basic Formatting (Grade 5)',
          url: '/cursuri/editoare-text/',
          missionId: 'text1',
          description: 'Master font styling, lists, tables, and punctuation spacing.'
        },
        {
          label: 'Word Processing & Ribbon Mastery (Grade 7)',
          url: '/cursuri/g7_word_a/',
          missionId: 'g7_word_a',
          description: 'Learn shortcuts, styles, and clean PDF export workflows.'
        },
        {
          label: 'Page Layout & Typography Lab (Grade 7)',
          url: '/cursuri/g7_word_b/',
          missionId: 'g7_word_b',
          description: 'Practice A4 margins, headers, footers, and visual hierarchy.'
        },
        {
          label: 'PageCraft & Typing Speed Master (Arcade)',
          url: '/arcade/',
          targetView: 'arcade',
          description: 'Build fast, accurate keyboarding and document layout skills.'
        }
      ]
    }
  },
  {
    id: 'scratch-3-incepatori-coordonate-bucle-variabile-primul-joc',
    category: 'cpp-algorithms',
    gradeTagRo: 'Clasele V–VI',
    gradeTagEn: 'Grades 5–6',
    publishedAt: '2026-11-12',
    updatedAt: '2026-11-15',
    featured: true,
    ro: {
      slug: 'scratch-3-incepatori-coordonate-bucle-variabile-primul-joc',
      title: 'Scratch 3.0 pentru începători (Clasele V–VI): Coordonatele X/Y, bucle, variabile și primul tău joc în 15 minute',
      metaTitle: 'Scratch 3.0 pentru copii (Clasa 5–6): Coordonate, bucle & joc | ArkyEdu',
      metaDescription: 'Tutorial practic Scratch 3.0 pentru clasele V–VI: cum funcționează scena cu axe X (-240..240) și Y (-180..180), bucle La infinit, Dacă...Atunci, variabile Scor/Vieți și clonare.',
      keywords: 'scratch 3.0 pentru incepatori, cum fac un joc in scratch, coordonate x si y scratch, variabile scratch clasa 6, bucle scratch tic clasa 5, tutorial scratch romana',
      breadcrumbLabel: 'Scratch 3.0: Primul joc & Coordonate',
      categoryLabel: 'Programare Vizuală Scratch',
      readTime: '10 min citire',
      tldrTitle: 'Răspuns Rapid (TL;DR)',
      tldr: 'Scena din Scratch 3.0 are lățimea de 480 de pași (X de la -240 la +240) și înălțimea de 360 de pași (Y de la -180 la +180), cu centrul în (0, 0). Un joc complet are nevoie de 4 elemente: inițializare la „Când se dă click pe steag verde”, buclă „La infinit” pentru mișcare, condiție „Dacă atinge...” pentru coliziuni și o variabilă „Scor” care se resetează mereu la 0 la început.',
      intro: 'Scratch 3.0 este limbajul vizual cu care elevii din clasele a V-a și a VI-a fac primii pași în programare. Chiar dacă pare o joacă cu blocuri colorate, Scratch predă concepte reale de informatică: sistemul de coordonate carteziene, structurile repetitive, deciziile logice și variabilele. În acest ghid construiești pas cu pas un joc complet de colectat obiecte și eviți greșelile care strică majoritatea proiectelor de la clasă.',
      sections: [
        {
          id: 'harta-coordonatelor-xy-scratch',
          heading: '1. Secretul scenei Scratch: Harta coordonatelor X și Y (-240..240 și -180..180)',
          paragraphs: [
            'De ce dispare personajul (Sprite-ul) în afara ecranului sau se mișcă invers? Pentru că scena Scratch este un sistem de axe matematice:',
            'Axa orizontală X merge de la -240 (marginea din stânga) până la +240 (marginea din dreapta). Axa verticală Y merge de la -180 (jos) până la +180 (sus). Punctul exact din mijlocul scenei este X = 0, Y = 0.'
          ],
          table: {
            caption: 'Mișcare pe axe în Scratch 3.0 — Ce bloc alegi?',
            headers: ['Direcția dorită', 'Blocul corect din categoria Mișcare (albastru)', 'Efect vizual pe scenă'],
            rows: [
              ['Dreapta', 'Modifică x cu 10', 'Personajul se deplasează spre +240 fără să se rotească cu capul în jos.'],
              ['Stânga', 'Modifică x cu -10', 'Personajul se deplasează spre -240.'],
              ['Sus (săritură)', 'Modifică y cu 10', 'Personajul urcă spre +180.'],
              ['Jos (gravitație)', 'Modifică y cu -10', 'Personajul coboară spre -180.'],
              ['Resetare centru', 'Mergi la x: 0 y: 0', 'Teleportează personajul instant în centrul scenei la start.']
            ]
          },
          callout: {
            title: 'De ce ajunge pisica cu capul în jos?',
            text: 'Dacă folosești „Mergi 10 pași” și „Dacă atinge marginea, ricoșează”, personajul se rotește la 180°. Pune blocul „Setează stilul de rotație [stânga-dreapta]” chiar sub steagul verde și va rămâne mereu în picioare!',
            variant: 'tip'
          }
        },
        {
          id: 'structura-joc-stele-in-15-minute',
          heading: '2. Construiește în 15 minute jocul „Prinde Stelele!” (pas cu pas)',
          paragraphs: [
            'Orice joc bun respectă o schemă clară: Pregătire (Reset) -> Buclă de Joc (Mișcare + Reguli) -> Final de Joc (Victorie/Game Over). Iată scriptul exact pentru jucător și pentru steaua care cade:'
          ],
          numberedSteps: [
            'Alege personajul principal (ex: Robot sau Pisică) și un obiect de colectat (Stea / Măr) plus un fundal (Space sau Blue Sky).',
            'Creează două variabile din categoria portocalie Variabile: „Scor” și „Vieți”.',
            'Pe jucător, adaugă „Când se dă click pe steag verde” -> „Setează Scor la 0”, „Setează Vieți la 3”, „Mergi la x: 0 y: -130”.',
            'Adaugă o buclă „La infinit” cu două blocuri „Dacă [tasta săgeată dreapta apăsată?] atunci Modifică x cu 10” și pentru stânga „Modifică x cu -10”.',
            'Pe Stea: „La infinit” -> „Modifică y cu -5” (cade în jos). Dacă „y < -170”, scade „Vieți” cu -1 și mut-o sus la „x: număr aleator între -210 și 210, y: 175”.',
            'Adaugă condiția de captură: „Dacă [atinge Jucător?] atunci Modifică Scor cu 1, redă sunet și mută Steaua din nou sus la y: 175”.'
          ]
        },
        {
          id: 'bucle-conditii-si-clonare',
          heading: '3. Bucle condiționate și Clonare (Nivel avansat Clasa a VI-a)',
          paragraphs: [
            'În clasa a VI-a treci de la bucle infinite simple la bucle cu condiție de oprire („Repetă până când [Vieți = 0]”) și operatori logici ȘI, SAU, NU.',
            'Dacă vrei 10 meteoriți sau lasere simultan pe ecran, NU duplica același personaj de 10 ori! Folosește blocul „Creează o clonă a [eu însumi]” și rulează codul de cădere sub evenimentul „Când încep ca o clonă”, terminând cu „Șterge această clonă” la margine — altfel după 300 de clone jocul se blochează.'
          ],
          codeBlock: {
            title: 'Pseudocodul blocurilor pentru Clonare curată în Scratch',
            language: 'text',
            code: `Când se dă click pe steag verde:
  Ascunde (originalul rămâne invizibil)
  La infinit:
    Așteaptă 1.2 secunde
    Creează o clonă a [eu însumi]

Când încep ca o clonă:
  Mergi la x: (Alege aleator între -210 și 210) y: 175
  Arată
  Repetă până când < (poziția y < -170) SAU (atinge Jucător?) >:
    Modifică y cu -6
  Dacă < atinge Jucător? > atunci:
    Modifică [Scor] cu 1
  Șterge această clonă  <-- OBLIGATORIU pentru memorie!`,
            caption: 'Ștergerea clonelor previne atingerea limitei de 300 de clone din Scratch 3.0.'
          }
        },
        {
          id: 'top-4-greseli-scratch',
          heading: '4. Cele mai frecvente 4 greșeli din proiectele Scratch (și cum le repari)',
          paragraphs: [
            'Când un joc nu reacționează la taste sau dă +50 de puncte la o singură atingere, cauza este aproape sigur una dintre acestea:'
          ],
          bulletPoints: [
            'Ai pus blocul „Dacă atinge...” fără o buclă „La infinit” în jurul lui -> Scratch verifică o singură milisecundă la start și apoi uită!',
            'Scorul crește cu 20 de puncte la o singură atingere -> După „Modifică Scor cu 1”, mută obiectul sau șterge clona imediat (sau adaugă „Așteaptă până când <NU atinge>”).',
            'Ai uitat inițializarea la start -> Jocul începe direct cu Scor = 14 și Vieți = 0 de la runda precedentă! Resetează toate variabilele sub steagul verde.',
            'Ai lipit scriptul pe Scenă (Stage) în loc de Personaj -> Scena nu are blocuri albastre de Mișcare!'
          ]
        }
      ],
      checklistTitle: 'Checklist înainte să prezinți jocul Scratch la clasă',
      checklist: [
        'La click pe steagul verde, Scorul revine la 0, Viețile la 3 și toate personajele merg la pozițiile de start.',
        'Fiecare condiție „Dacă” pentru taste sau coliziuni stă în interiorul unei bucle „La infinit” sau „Repetă până când”.',
        'Fiecare clonă creată are un bloc „Șterge această clonă” când iese de pe ecran.',
        'Jocul are un mesaj clar de „Ai câștigat!” sau „Game Over” cu „Oprește tot”.'
      ],
      faqs: [
        {
          question: 'Care sunt limitele coordonatelor X și Y pe scena din Scratch 3.0?',
          answer: 'Axa X (orizontală) variază de la -240 în stânga la +240 în dreapta (total 480 pixeli). Axa Y (verticală) variază de la -180 jos la +180 sus (total 360 pixeli). Centrul scenei este (0, 0).'
        },
        {
          question: 'De ce personajul meu nu se mișcă atunci când apăs tastele săgeți?',
          answer: 'Verifică dacă blocul „Dacă tasta ... apăsată?” se află în interiorul unei bucle „La infinit” pornită de steagul verde. Fără buclă, condiția este verificată o singură dată la pornire.'
        },
        {
          question: 'De ce crește scorul cu mai multe puncte la o singură atingere?',
          answer: 'Bucla „La infinit” rulează de aproximativ 30 de ori pe secundă, așa că dacă cele două personaje rămân suprapuse timp de 0,3 secunde, scorul crește de 9 ori. Mută imediat obiectul colectat sau șterge clona după ce aduni +1 la Scor.'
        },
        {
          question: 'Câte clone pot exista simultan într-un proiect Scratch?',
          answer: 'Scratch 3.0 permite maximum 300 de clone active în același timp. De aceea trebuie să folosești mereu blocul „Șterge această clonă” după ce un obiect iese de pe scenă.'
        },
        {
          question: 'Unde pot exersa gratuit algoritmii și blocurile Scratch pentru clasele V–VI?',
          answer: 'Pe ArkyEdu găsești modulele interactive Programare Vizuală Scratch 3.0 (Clasa a V-a), Bucle Condiționate și Algoritmi cu Contor în Scratch (Clasa a VI-a), plus jocurile arcade Labirint Algoritmic și Șarpele Algoritmic.'
        }
      ],
      internalLinksTitle: 'Exersează Scratch & Algoritmi pe ArkyEdu',
      internalLinks: [
        {
          label: 'Programare Vizuală Scratch 3.0 (Clasa a V-a)',
          url: '/cursuri/scratch/',
          missionId: 'scratch1',
          description: 'Blocuri de mișcare, coordonate X/Y, evenimente și animații.'
        },
        {
          label: 'Bucle Condiționate Dacă...Atunci în Scratch (Clasa a VI-a)',
          url: '/cursuri/algoritmi-bucle-scratch-1/',
          missionId: 'g6_scratch1',
          description: 'Operatori logici ȘI/SAU/NU, senzori și bucle repetitive.'
        },
        {
          label: 'Algoritmi cu Contor & Clonare (Clasa a VI-a)',
          url: '/cursuri/algoritmi-contor-minecraft-scratch/',
          missionId: 'g6_scratch2',
          description: 'Variabile contoare, scoruri și logică de joc pas cu pas.'
        },
        {
          label: 'Labirint Algoritmic & Cyber Snake (Arcade TIC)',
          url: '/arcade/',
          targetView: 'arcade',
          description: 'Antrenează secvențele de instrucțiuni în jocuri retro.'
        }
      ]
    },
    en: {
      slug: 'scratch-3-beginners-coordinates-loops-variables-first-game',
      title: 'Scratch 3.0 for Beginners (Grades 5–6): X/Y Coordinates, Loops, Variables & Your First Game in 15 Minutes',
      metaTitle: 'Scratch 3.0 Beginner Guide: Coordinates, Loops & Game Tutorial | ArkyEdu',
      metaDescription: 'Hands-on Scratch 3.0 guide for Grades 5–6 students: understand the 480x360 coordinate grid (-240..240 X, -180..180 Y), Forever & Repeat Until loops, variables, cloning, and debugging.',
      keywords: 'scratch 3.0 tutorial for kids, scratch x y coordinates explained, how to make a game in scratch, scratch variables and loops, scratch cloning 300 limit, middle school coding',
      breadcrumbLabel: 'Scratch 3.0: First Game & Coordinates',
      categoryLabel: 'Scratch Visual Coding',
      readTime: '10 min read',
      tldrTitle: 'Quick Answer (TL;DR)',
      tldr: 'The Scratch 3.0 stage spans 480 steps wide (X from -240 to +240) and 360 steps tall (Y from -180 to +180), centered at (0, 0). Every working game follows four building blocks: reset variables and positions under "When green flag clicked", wrap controls in a "Forever" loop, check collisions with "If touching...", and delete clones when they leave the stage.',
      intro: 'Scratch 3.0 is the visual programming language where Grade 5 and 6 students build real computer science intuition. Behind the colorful blocks sit foundational concepts: Cartesian coordinates, event loops, conditional branching, variables, and object cloning. Follow this guide to build a complete star-catching game in 15 minutes and avoid the four bugs that trip up most student projects.',
      sections: [
        {
          id: 'scratch-xy-grid',
          heading: '1. Understanding the Scratch Coordinate Grid (-240..240 X and -180..180 Y)',
          paragraphs: [
            'Why does a sprite sometimes vanish off-screen or move backward? Every position on the Scratch stage is controlled by two numbers: X (horizontal) and Y (vertical).',
            'X runs from -240 on the left edge to +240 on the right edge. Y runs from -180 at the bottom to +180 at the top. The exact center of the screen is X = 0, Y = 0.'
          ],
          table: {
            caption: 'Moving Sprites Cleanly on the X/Y Axis',
            headers: ['Movement Direction', 'Motion Block to Use', 'What Happens on Stage'],
            rows: [
              ['Right', 'change x by 10', 'Moves cleanly toward +240 without flipping upside down.'],
              ['Left', 'change x by -10', 'Moves cleanly toward -240.'],
              ['Up (Jump)', 'change y by 10', 'Lifts sprite toward +180.'],
              ['Down (Gravity)', 'change y by -10', 'Lowers sprite toward -180.'],
              ['Reset Center', 'go to x: 0 y: 0', 'Teleports sprite back to center at game start.']
            ]
          },
          callout: {
            title: 'Sprite Flipping Upside Down?',
            text: 'When using "move 10 steps" with "if on edge, bounce", sprites rotate 180 degrees. Snap "set rotation style [left-right]" right below the green flag block to keep your character upright.',
            variant: 'tip'
          }
        },
        {
          id: 'build-catch-the-stars-game',
          heading: '2. Build "Catch the Stars!" in 15 Minutes (Step-by-Step)',
          paragraphs: [
            'Great games separate Setup (Reset) from the Main Loop (Move + Collide) and Game Over. Wire up these six steps:'
          ],
          numberedSteps: [
            'Pick a Player sprite, a falling Star sprite, and a backdrop.',
            'Create two orange Variables: "Score" and "Lives".',
            'On the Player sprite: "When green flag clicked" -> set Score to 0, set Lives to 3, go to x: 0 y: -130.',
            'Add a "Forever" loop containing two "If <key right/left arrow pressed?>" blocks that change x by 10 and -10.',
            'On the Star sprite: inside "Forever", "change y by -5". If "y position < -170", change Lives by -1 and reset to "x: pick random -210 to 210, y: 175".',
            'Add collision detection: "If <touching Player?> then change Score by 1, play sound, and jump back to y: 175".'
          ]
        },
        {
          id: 'loops-and-cloning-grade-6',
          heading: '3. Conditional Loops & Clean Cloning (Grade 6 Mastery)',
          paragraphs: [
            'As you advance, combine "Repeat until <Lives = 0>" loops with boolean AND / OR / NOT operators. Instead of duplicating the same obstacle sprite ten times, spawn copies using "create clone of [myself]" and always end every clone script with "delete this clone" so you never hit Scratch’s 300-clone limit.'
          ],
          codeBlock: {
            title: 'Clean Clone Spawner Pattern in Scratch 3.0',
            language: 'text',
            code: `When green flag clicked:
  hide (keep the master sprite hidden)
  forever:
    wait 1.2 seconds
    create clone of [myself]

When I start as a clone:
  go to x: (pick random -210 to 210) y: 175
  show
  repeat until <(y position < -170) or (touching Player?)>:
    change y by -6
  if <touching Player?> then:
    change [Score] by 1
  delete this clone  <-- Prevents hitting the 300 clone cap!`,
            caption: 'Deleting off-screen clones keeps frame rates smooth and prevents freezes.'
          }
        },
        {
          id: 'top-4-scratch-bugs',
          heading: '4. Four Classic Scratch Project Bugs (and Fast Fixes)',
          paragraphs: [
            'If controls feel dead or points explode unpredictably, check these four spots:'
          ],
          bulletPoints: [
            'Missing "Forever" loop around an "If" check -> Scratch tests the condition for a split second at launch and stops.',
            'Score jumps by +15 on one catch -> Move or delete the object immediately inside the "If touching" block instead of waiting.',
            'Game starts at Game Over -> Always reset Score = 0 and Lives = 3 under the green flag before any loop starts.',
            'Scripts accidentally placed on Stage -> Stage has no blue Motion blocks; click your Sprite thumbnail before coding.'
          ]
        }
      ],
      checklistTitle: 'Pre-Demo Scratch Game Checklist',
      checklist: [
        'Green flag resets Score, Lives, and starting X/Y coordinates every time.',
        'All keyboard checks and collision rules sit inside an active loop.',
        'Every clone path ends with "delete this clone".',
        'Game displays a clean Win or Game Over state with "stop all".'
      ],
      faqs: [
        {
          question: 'What are the X and Y bounds of the Scratch 3.0 stage?',
          answer: 'X goes from -240 (left) to +240 (right), and Y goes from -180 (bottom) to +180 (top). The center point is (0, 0).'
        },
        {
          question: 'Why won’t my Scratch sprite respond to arrow keys?',
          answer: 'Make sure your "if key pressed?" block sits inside a "forever" loop attached to "when green flag clicked". Without a loop, Scratch checks once at startup and finishes.'
        },
        {
          question: 'Why does Score jump by multiple points on a single touch?',
          answer: 'Scratch loops run roughly 30 times per second. If two sprites overlap for half a second, Score increments repeatedly. Reposition or delete the collected object right after adding 1 point.'
        },
        {
          question: 'How many clones can exist at once in Scratch?',
          answer: 'Scratch enforces a hard cap of 300 active clones per project. Always run "delete this clone" once a clone leaves the stage.'
        },
        {
          question: 'Where can kids practice Scratch loops and counters interactively?',
          answer: 'ArkyEdu features interactive Grade 5 Intro to Scratch and Grade 6 Conditional Loops & Counter labs plus Algorithm Maze and Cyber Snake in the Arcade.'
        }
      ],
      internalLinksTitle: 'Practice Scratch & Algorithms on ArkyEdu',
      internalLinks: [
        {
          label: 'Intro to Scratch 3.0 (Grade 5)',
          url: '/cursuri/scratch/',
          missionId: 'scratch1',
          description: 'Master X/Y coordinates, motion, events, and animations.'
        },
        {
          label: 'Conditional Loops If...Then in Scratch (Grade 6)',
          url: '/cursuri/algoritmi-bucle-scratch-1/',
          missionId: 'g6_scratch1',
          description: 'Use AND/OR/NOT operators, sensors, and repeat-until loops.'
        },
        {
          label: 'Counter Variables & Cloning Games (Grade 6)',
          url: '/cursuri/algoritmi-contor-minecraft-scratch/',
          missionId: 'g6_scratch2',
          description: 'Build counters, game states, and dynamic clones.'
        },
        {
          label: 'Algorithm Maze & Cyber Snake (ICT Arcade)',
          url: '/arcade/',
          targetView: 'arcade',
          description: 'Sharpen step-by-step instructional thinking in retro games.'
        }
      ]
    }
  },
  {
    id: 'primul-site-web-clasa-8-html5-https-google-sites',
    category: 'robotics-iot',
    gradeTagRo: 'Clasa a VIII-a',
    gradeTagEn: 'Grade 8',
    publishedAt: '2026-11-13',
    updatedAt: '2026-11-15',
    featured: false,
    ro: {
      slug: 'primul-site-web-clasa-8-html5-https-google-sites',
      title: 'Primul tău site web în Clasa a VIII-a: Structura HTML5, HTTPS și publicare sigură în Google Sites',
      metaTitle: 'Primul site web clasa a 8-a: HTML5, HTTPS & Google Sites | ArkyEdu',
      metaDescription: 'Ghid complet pentru modulul de Web Design de clasa a VIII-a: anatomia unei pagini HTML5 semantice, meta charset, diferența HTTP vs HTTPS, SEO de bază și publicare în Google Sites.',
      keywords: 'creare site web clasa 8, structura html5 pagina web, google sites proiect scoala, diferenta http vs https, proiect web tic clasa 8, etichete html5 gimnaziu',
      breadcrumbLabel: 'HTML5, HTTPS & Google Sites (VIII)',
      categoryLabel: 'Web Design & Tehnologii Web',
      readTime: '9 min citire',
      tldrTitle: 'Răspuns Rapid (TL;DR)',
      tldr: 'Orice pagină web modernă se bazează pe HTML5 semantic (<!DOCTYPE html>, <head> pentru metadate și <body> pentru conținut vizibil cu <header>, <nav>, <main>, <footer>). În clasa a VIII-a poți construi atât pagini scrise direct în HTML5 cu Notepad++/VS Code, cât și site-uri multipage publice pe HTTPS prin Google Sites, respectând ierarhia de titluri H1–H3 și descrieri alt pentru imagini.',
      intro: 'Unul dintre cele mai practice capitole din clasa a VIII-a este realizarea primului site web. Elevii învață cum citește browserul codul HTML5 din spatele oricărei pagini, de ce este obligatoriu protocolul criptat HTTPS și cum publică un site structurat cu mai multe pagini în Google Sites. Iată tot ce trebuie să știi pentru nota 10 la proiectul de Web Design.',
      sections: [
        {
          id: 'scheletul-html5-semantic',
          heading: '1. Anatomia completă a unei pagini HTML5 (pe care trebuie să o știi pe de rost)',
          paragraphs: [
            'HTML5 (HyperText Markup Language) nu este un limbaj de programare ca C++, ci un limbaj de marcare care descrie structura unei pagini web folosind etichete (tag-uri) pereche: <etichetă>conținut</etichetă>.',
            'Zona <head> conține informații invizibile pe ecran (setul de caractere UTF-8 pentru diacritice românești, titlul filei din browser și descrierea pentru Google), iar zona <body> conține tot ce vede vizitatorul: meniu, titluri, texte, imagini și linkuri.'
          ],
          codeBlock: {
            title: 'Șablon complet HTML5 semantic pentru proiectul de clasa a VIII-a',
            language: 'html',
            code: `<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Proiectul meu de Robotică | Clasa a VIII-a</title>
  <meta name="description" content="Portofoliu școlar cu proiecte Arduino și experimente STEM.">
</head>
<body>
  <header>
    <h1>Atelierul de Tehnologie</h1>
    <nav>
      <a href="index.html">Acasă</a> |
      <a href="proiecte.html">Proiecte</a>
    </nav>
  </header>

  <main>
    <section>
      <h2>Ce am construit semestrul acesta</h2>
      <p>Prima mea pagină web scrisă curat în HTML5 semantic.</p>
      <img src="robot.jpg" alt="Prototip robot Arduino cu senzor ultrasonic">
    </section>
  </main>

  <footer>
    <p>© 2026 Proiect TIC Clasa a VIII-a</p>
  </footer>
</body>
</html>`,
            caption: 'Observă <meta charset="utf-8"> plasat chiar la început pentru diacritice românești corecte și atributul alt="" pe imagine.'
          }
        },
        {
          id: 'http-vs-https-si-domenii',
          heading: '2. HTTP vs. HTTPS, URL-uri și legături relative vs. absolute',
          paragraphs: [
            'Protocolul HTTP trimite textul dintre browser și server „în clar”, astfel încât oricine din rețeaua Wi-Fi publică îl poate citi. HTTPS adaugă criptare SSL/TLS și un certificat digital care confirmă identitatea site-ului.',
            'Când legi paginile propriului site între ele, folosește căi relative (de exemplu href="proiecte.html"), ca site-ul să meargă și dacă îl muți pe alt server sau folder. Pentru linkuri externe spre alte site-uri, folosește calea absolută completă cu https://.'
          ],
          table: {
            caption: 'Elemente esențiale ale unei pagini web profesioniste',
            headers: ['Element / Concept', 'Rolul său', 'Greșeală frecventă de evitat'],
            rows: [
              ['<!DOCTYPE html>', 'Anunță browserul că folosești standardul modern HTML5.', 'Să uiți să o scrii -> browserul intră în mod compatibilitate vechi.'],
              ['Un singur <h1> pe pagină', 'Definește subiectul principal pentru utilizatori și Google.', 'Să pui <h1> pentru dimensiune mare de font în loc de <h2>/<h3>.'],
              ['Atribut alt="" pe <img>', 'Ajută nevăzătorii (cititoare ecran) și indexarea în Google Images.', 'Să lași <img src="poza.jpg"> fără descriere alt.'],
              ['HTTPS + SSL', 'Criptează datele transmise între browser și server.', 'Să introduci parole sau formulare pe site-uri HTTP fără lacăt.']
            ]
          }
        },
        {
          id: 'google-sites-proiect-multipage',
          heading: '3. Cum publici un site curat cu mai multe pagini în Google Sites',
          paragraphs: [
            'Pentru proiectele de grup sau portofolii rapide, Google Sites oferă un editor vizual WYSIWYG („ce vezi este ceea ce obții”) găzduit direct pe HTTPS gratuit:'
          ],
          numberedSteps: [
            'Deschide sites.google.com și pornește un site nou cu o temă clară și contrast bun între fundal și text.',
            'Creează cel puțin 3 pagini din tab-ul Pages (ex: Acasă, Resurse / Proiect, Contact) pentru o navigare logică în meniul de sus.',
            'Folosește blocuri predefinite pentru a alinia echilibrat imagine + text explicativ și integrează la nevoie o hartă Google Maps, un document Google Docs sau un formular Google Forms.',
            'Verifică previzualizarea atât pe Desktop, cât și pe Telefon (butonul Preview) înainte de publicare.',
            'Apasă Publish -> alege o adresă web ușor de reținut și verifică permisiunile („Anyone can find and view” doar dacă nu ai date personale!).'
          ]
        },
        {
          id: 'reguli-seo-si-siguranta-web',
          heading: '4. Reguli de aur de SEO și siguranță GDPR pentru site-uri școlare',
          paragraphs: [
            'Un site public pe Internet poate fi văzut de oricine. De aceea, încă din gimnaziu trebuie să respecți câteva reguli esențiale de design, vizibilitate și protecție a datelor:'
          ],
          bulletPoints: [
            'Nu publica pe un site public numărul tău de telefon, adresa de acasă sau fotografii fără acordul colegilor și părinților.',
            'Dă fișierelor imagini nume descriptive (robot-arduino.jpg, nu IMG_20260412.jpg) și optimizează-le să nu aibă 10 MB fiecare.',
            'Scrie un <title> unic pentru fiecare pagină și păstrează meniurile de navigare simple (4–6 linkuri clare).'
          ]
        }
      ],
      checklistTitle: 'Checklist înainte să predai site-ul la Clasa a VIII-a',
      checklist: [
        'Fiecare pagină HTML are <!DOCTYPE html>, <meta charset="utf-8"> și un <title> descriptiv.',
        'Toate linkurile din meniu merg corect între pagini fără erori 404.',
        'Fiecare imagine are atribut alt completat și se încarcă rapid.',
        'Site-ul nu conține date personale sensibile și arată lizibil atât pe PC, cât și pe mobil.'
      ],
      faqs: [
        {
          question: 'Care este diferența dintre HTML și CSS?',
          answer: 'HTML definește structura și conținutul paginii (titluri, paragrafe, imagini, linkuri — „scheletul”), iar CSS controlează designul vizual (culori, fonturi, spațieri, așezare pe coloane).'
        },
        {
          question: 'De ce apar caractere ciudate (Ã®n loc de ă, ș, ț) într-o pagină HTML?',
          answer: 'Lipsește eticheta <meta charset="utf-8"> din zona <head> sau fișierul HTML nu a fost salvat cu codificare UTF-8 în editorul de text.'
        },
        {
          question: 'Este gratuit să public un proiect școlar în Google Sites?',
          answer: 'Da, Google Sites este complet gratuit cu un cont Google/școlar și include automat găzduire securizată prin HTTPS.'
        },
        {
          question: 'De ce este important atributul alt pe imaginile dintr-o pagină web?',
          answer: 'Atributul alt oferă o descriere text pentru persoanele care folosesc cititoare de ecran, apare dacă imaginea nu se poate încărca și ajută motoarele de căutare să înțeleagă ce conține fotografia.'
        },
        {
          question: 'Unde pot exersa interactiv Web Design HTML5 și Google Sites de clasa a VIII-a?',
          answer: 'Pe ArkyEdu ai toate cele 3 module de Web Design pentru Clasa a VIII-a: Anatomia Paginii Web & HTTPS, Google Sites & Blocuri Media și Site Multipage & Publicare.'
        }
      ],
      internalLinksTitle: 'Exersează Web Design Clasa a VIII-a pe ArkyEdu',
      internalLinks: [
        {
          label: 'Anatomia Paginii Web & Securitate HTTPS (VIII)',
          url: '/cursuri/g8_web_a/',
          missionId: 'g8_web_a',
          description: 'Structură HTML5 semantică, etichete, domenii și certificate SSL.'
        },
        {
          label: 'Google Sites & Blocuri Media (Clasa a VIII-a)',
          url: '/cursuri/g8_web_b/',
          missionId: 'g8_web_b',
          description: 'Editor vizual WYSIWYG, integrare Docs/Forms și aspect responsiv.'
        },
        {
          label: 'Site Multipage, Navigare & SEO de bază (VIII)',
          url: '/cursuri/g8_web_c/',
          missionId: 'g8_web_c',
          description: 'Ierarhii de pagini, linkuri interne și publicare sigură pe web.'
        },
        {
          label: 'Hub Clasa a VIII-a (Toate cele 14 module)',
          url: '/clasa-8/',
          description: 'Explorează Excel, Web Design, C++ și Robotică Arduino.'
        }
      ]
    },
    en: {
      slug: 'first-school-website-grade-8-html5-https-google-sites',
      title: 'Building Your First School Website (Grade 8): Semantic HTML5, HTTPS & Safe Google Sites Publishing',
      metaTitle: 'Grade 8 Web Design: HTML5 Anatomy, HTTPS & Google Sites | ArkyEdu',
      metaDescription: 'Complete Grade 8 web design guide: semantic HTML5 page template, UTF-8 charset, HTTP vs HTTPS security, relative vs absolute links, basic SEO, and publishing in Google Sites.',
      keywords: 'html5 basics grade 8, build first school website google sites, semantic html5 structure, http vs https explained kids, img alt attribute accessibility, middle school web design',
      breadcrumbLabel: 'HTML5, HTTPS & Google Sites',
      categoryLabel: 'Web Design & HTML5',
      readTime: '9 min read',
      tldrTitle: 'Quick Answer (TL;DR)',
      tldr: 'Every modern webpage starts with semantic HTML5 (<!DOCTYPE html>, <head> for metadata like UTF-8 charset and title, and <body> with <header>, <nav>, <main>, and <footer>). Whether coding from scratch or launching a multipage project in Google Sites, verify HTTPS security, use one clear <h1> per page, add alt descriptions to images, and preview mobile responsiveness.',
      intro: 'Web design in Grade 8 bridges code and visual storytelling. Students learn how browsers interpret semantic HTML5 tags, why HTTPS encryption matters on every site, and how to build structured multipage portfolios in Google Sites. Here is everything you need to ship a clean, accessible school website.',
      sections: [
        {
          id: 'html5-semantic-skeleton',
          heading: '1. Complete Semantic HTML5 Template Every Grade 8 Student Should Know',
          paragraphs: [
            'HTML5 (HyperText Markup Language) is not a programming language like C++; it is a markup language that gives structure to content using paired tags. Metadata lives inside <head> (invisible in the page body), while all visible text, menus, headings, and photos live inside <body>.'
          ],
          codeBlock: {
            title: 'Clean Semantic HTML5 Starter Template',
            language: 'html',
            code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Robotics Portfolio | Grade 8</title>
  <meta name="description" content="Middle school Arduino robotics and STEM experiments portfolio.">
</head>
<body>
  <header>
    <h1>Tech Workshop</h1>
    <nav>
      <a href="index.html">Home</a> |
      <a href="projects.html">Projects</a>
    </nav>
  </header>

  <main>
    <section>
      <h2>What I Built This Semester</h2>
      <p>My first clean semantic HTML5 webpage.</p>
      <img src="robot.jpg" alt="Arduino robot prototype with ultrasonic sensor">
    </section>
  </main>

  <footer>
    <p>© 2026 Grade 8 ICT Project</p>
  </footer>
</body>
</html>`,
            caption: 'Placing <meta charset="utf-8"> right at the top prevents broken special characters, and alt="" ensures accessibility.'
          }
        },
        {
          id: 'https-and-link-types',
          heading: '2. HTTP vs. HTTPS and Relative vs. Absolute Links',
          paragraphs: [
            'Plain HTTP sends page data unencrypted across the network. HTTPS encrypts traffic with SSL/TLS certificates so passwords and forms cannot be intercepted on public Wi-Fi.',
            'When linking between pages inside your own folder, use relative paths (href="projects.html") so everything still works if you move the folder. When linking to outside websites, use full absolute URLs starting with https://.'
          ],
          table: {
            caption: 'Core Web Building Blocks & Common Mistakes',
            headers: ['Element / Concept', 'Purpose', 'Common Mistake to Avoid'],
            rows: [
              ['<!DOCTYPE html>', 'Tells browsers to use modern HTML5 standards.', 'Omitting it triggers legacy quirks mode.'],
              ['Single <h1> per page', 'Defines the primary topic for readers and search engines.', 'Using <h1> just to make random text big instead of <h2>/<h3>.'],
              ['alt="" on <img>', 'Supports screen readers and image search indexing.', 'Leaving <img> tags with empty or missing alt descriptions.'],
              ['HTTPS + SSL', 'Encrypts browser-to-server communication.', 'Entering login or form data on unencrypted HTTP pages.']
            ]
          }
        },
        {
          id: 'google-sites-multipage',
          heading: '3. Publishing a Clean Multipage Project with Google Sites',
          paragraphs: [
            'When building group projects or portfolios quickly, Google Sites gives you a visual WYSIWYG editor hosted over free HTTPS:'
          ],
          numberedSteps: [
            'Open sites.google.com and choose a clean, high-contrast theme.',
            'Create at least 3 logical pages under the Pages tab (e.g., Home, Projects, Credits/Contact).',
            'Use balanced content blocks pairing images with concise captions, and embed Docs, Forms, or Maps where helpful.',
            'Click Preview to test readability on both Desktop and Mobile phone viewports.',
            'Click Publish, pick a memorable URL slug, and double-check sharing settings before turning it in.'
          ]
        },
        {
          id: 'seo-and-privacy-web',
          heading: '4. Essential Privacy & Basic SEO Habits for Student Sites',
          paragraphs: [
            'Once a site is published online, anyone with the link may open it. Apply smart digital safety and search hygiene from day one:'
          ],
          bulletPoints: [
            'Never publish home addresses, phone numbers, or photos of classmates without consent.',
            'Name image files descriptively (arduino-robot.jpg instead of IMG_8421.jpg) and keep file sizes lightweight.',
            'Give each page a unique descriptive <title> and a simple 4–6 item top navigation bar.'
          ]
        }
      ],
      checklistTitle: 'Grade 8 Web Project Launch Checklist',
      checklist: [
        'Every HTML page starts with <!DOCTYPE html>, <meta charset="utf-8">, and a clear <title>.',
        'All internal navigation links work across pages with zero broken 404 targets.',
        'Every image carries descriptive alt text and loads quickly.',
        'Zero private personal details appear, and layout works smoothly on both desktop and mobile.'
      ],
      faqs: [
        {
          question: 'What is the difference between HTML and CSS?',
          answer: 'HTML defines a webpage’s structure and meaning (headings, paragraphs, images, links), while CSS controls visual presentation (colors, fonts, spacing, and responsive grids).'
        },
        {
          question: 'Why do accented characters break in an HTML page?',
          answer: 'Either <meta charset="utf-8"> is missing from the top of <head>, or the file was not saved with UTF-8 encoding in the text editor.'
        },
        {
          question: 'Is Google Sites free for school projects?',
          answer: 'Yes, Google Sites is completely free with a Google or school Workspace account and automatically serves pages over HTTPS.'
        },
        {
          question: 'Why is the alt attribute required on <img> elements?',
          answer: 'Alt text describes images for screen-reader users, displays if an image fails to load, and helps search engines understand visual content.'
        },
        {
          question: 'Where can students practice HTML5 & Google Sites interactively?',
          answer: 'ArkyEdu offers all three Grade 8 Web Design labs: Page Anatomy & HTTPS, Google Sites & Media Blocks, and Multipage Navigation & Publishing.'
        }
      ],
      internalLinksTitle: 'Practice Grade 8 Web Design on ArkyEdu',
      internalLinks: [
        {
          label: 'Webpage Anatomy & HTTPS Security (Grade 8)',
          url: '/cursuri/g8_web_a/',
          missionId: 'g8_web_a',
          description: 'Learn semantic HTML5 tags, domains, and SSL certificates.'
        },
        {
          label: 'Google Sites & Media Blocks (Grade 8)',
          url: '/cursuri/g8_web_b/',
          missionId: 'g8_web_b',
          description: 'Visual WYSIWYG layout, embeds, and responsive previews.'
        },
        {
          label: 'Multipage Navigation & Basic SEO (Grade 8)',
          url: '/cursuri/g8_web_c/',
          missionId: 'g8_web_c',
          description: 'Design page hierarchies and publish cleanly on the web.'
        },
        {
          label: 'Grade 8 Curriculum Hub (All 14 Modules)',
          url: '/clasa-8/',
          description: 'Explore Excel, Web Design, C++ Algorithms & Arduino IoT.'
        }
      ]
    }
  },
  {
    id: 'proiect-arduino-smart-home-gimnaziu-senzori-millis',
    category: 'robotics-iot',
    gradeTagRo: 'Clasele VII–VIII',
    gradeTagEn: 'Grades 7–8',
    publishedAt: '2026-11-14',
    updatedAt: '2026-11-15',
    featured: true,
    ro: {
      slug: 'proiect-arduino-smart-home-gimnaziu-senzori-millis',
      title: 'Proiect Smart Home cu Arduino Uno pentru gimnaziu (VII–VIII): Senzori PIR, Ultrasonic HC-SR04, MQ-2 și millis()',
      metaTitle: 'Proiect Arduino Uno Smart Home gimnaziu: PIR, HC-SR04 & millis() | ArkyEdu',
      metaDescription: 'Ghid practic de robotică Arduino Uno pentru clasa a VIII-a (manual Art Klett 2025): pini digitali/analogici, Legea lui Ohm (220 Ω), senzori PIR, HC-SR04, MQ-2 și multitasking cu millis().',
      keywords: 'proiect arduino smart home scoala, arduino uno clasa 8 art klett, senzor ultrasonic hc-sr04 cod, senzor miscare pir arduino, multitasking millis() vs delay(), robotica copii arduino',
      breadcrumbLabel: 'Proiect Arduino Smart Home & millis()',
      categoryLabel: 'Robotică Arduino & IoT',
      readTime: '11 min citire',
      tldrTitle: 'Răspuns Rapid (TL;DR)',
      tldr: 'Un proiect Smart Home cu Arduino Uno (conform programei și manualului Art Klett clasa a VIII-a) combină citirea senzorilor pe pini digitali (PIR mișcare, HC-SR04 ultrasonic) sau analogici A0–A5 (fotorezistor LDR, senzor gaz MQ-2) cu actuatori (LED cu rezistor de 220 Ω, servomotor SG90 pe PWM ~). Folosește millis() în locul lui delay() ca alerta de gaz să răspundă instant chiar când bariera se mișcă.',
      intro: 'Capitolul de Robotică și Sisteme Inteligente din clasele a VII-a și a VIII-a este momentul în care codul C++ prinde viață în lumea reală: aprinde lumini stradale când se întunecă, ridică bariere la apropierea unei mașini și declanșează alarme la scurgeri de gaz. În acest ghid complet îți arătăm schema de pini, de ce nu trebuie să uiți rezistorul la LED și cum înlocuiești funcția blocantă delay() cu millis().',
      sections: [
        {
          id: 'pini-arduino-si-legea-lui-ohm',
          heading: '1. Harta plăcii Arduino Uno: Pini digitali, analogici A0–A5, PWM (~) și rezistorul de 220 Ω',
          paragraphs: [
            'Arduino Uno lucrează la 5V și citește mediul înconjurător prin două tipuri principale de pini: pini digitali (D0–D13, care știu doar HIGH/5V sau LOW/0V) și pini analogici (A0–A5, care măsoară valori continue între 0 și 1023 cu ajutorul convertorului ADC pe 10 biți). Pinii marcați cu tildă (~: 3, 5, 6, 9, 10, 11) pot genera semnal PWM pentru a regla intensitatea unui LED sau unghiul unui servomotor SG90.',
            'Regulă critică de hardware (Legea lui Ohm, I = U / R): Nu conecta niciodată un LED direct între pinul 5V și GND fără un rezistor în serie (de obicei 220 Ω – 330 Ω)! Fără rezistor, curentul depășește limita de 40 mA a pinului Arduino și arde atât LED-ul, cât și microcontrollerul.'
          ],
          table: {
            caption: 'Catalogul senzorilor și actuatorilor din proiectul Smart Home / Smart City (Clasa a VIII-a)',
            headers: ['Componentă', 'Tip pin Arduino', 'Ce măsoară / execută în sistem'],
            rows: [
              ['Fotorezistor (LDR)', 'Analogic (ex: A0)', 'Măsoară luminozitatea (0–1023); aprinde iluminatul stradal la amurg.'],
              ['Senzor gaz MQ-2', 'Analogic (ex: A1)', 'Detectează fum / gaz inflamabil; declanșează buzzer și alarmă.'],
              ['Senzor mișcare PIR', 'Digital INPUT (ex: D2)', 'Detectează prezența persoanelor prin radiație infraroșu (HIGH/LOW).'],
              ['Ultrasonic HC-SR04', 'Digital TRIG / ECHO (D4, D5)', 'Măsoară distanța în cm cu unde sonore (distanță = durată * 0.034 / 2).'],
              ['Servomotor SG90', 'Digital PWM (~9)', 'Ridică și coboară bariera de parcare între 0° și 90°.'],
              ['Ecran LCD 1602 I2C', 'I2C (SDA=A4, SCL=A5)', 'Afișează mesaje de stare folosind doar 2 fire de date!']
            ]
          }
        },
        {
          id: 'de-ce-millis-in-loc-de-delay',
          heading: '2. Greșeala #1 a începătorilor: delay() blochează tot sistemul vs. Multitasking cu millis()',
          paragraphs: [
            'Când scrii delay(5000); ca să ții bariera deschisă 5 secunde, procesorul plăcii Arduino „doarme” complet: dacă în acele 5 secunde apare o scurgere de gaz la senzorul MQ-2, alarma NU pornește până nu expiră pauza! Într-un sistem real Smart Home, așa ceva este inacceptabil.',
            'Soluția profesionistă este funcția millis(), care returnează numărul de milisecunde trecute de la pornirea plăcii. Salvând momentul ultimei acțiuni (unsigned long timpAnterior = 0;), putem verifica non-blocant dacă a trecut intervalul dorit, în timp ce senzorul de gaz este citit de mii de ori pe secundă!'
          ],
          codeBlock: {
            title: 'Schemă cod C++ Arduino cu millis() pentru Iluminat + Alertă Gaz simultane',
            language: 'cpp',
            code: `const int PIN_LDR = A0;
const int PIN_GAZ = A1;
const int PIN_LED_STRADA = 6; // Pin PWM (~)
const int PIN_BUZZER = 8;

unsigned long ultimulControl = 0;
const unsigned long INTERVAL_LUMINA = 250; // verifica lumina la 250 ms fara blocare

void setup() {
  pinMode(PIN_LED_STRADA, OUTPUT);
  pinMode(PIN_BUZZER, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  unsigned long acum = millis();

  // 1. Prioritate maxima NON-BLOCANTA: verificare instantanee gaz MQ-2
  int nivelGaz = analogRead(PIN_GAZ);
  if (nivelGaz > 450) {
    tone(PIN_BUZZER, 1200);
  } else {
    noTone(PIN_BUZZER);
  }

  // 2. Sarcina periodica cu millis() (fara delay!) pentru iluminat inteligent PWM
  if (acum - ultimulControl >= INTERVAL_LUMINA) {
    ultimulControl = acum;
    int lumina = analogRead(PIN_LDR);
    // Daca e intuneric (lumina < 400), crestem intensitatea LED-ului pe PWM
    int pwm = (lumina < 400) ? map(lumina, 0, 400, 255, 60) : 0;
    analogWrite(PIN_LED_STRADA, pwm);
  }
}`,
            caption: 'Observă utilizarea lui unsigned long pentru millis() și absența completă a funcției delay().'
          }
        },
        {
          id: 'depanare-circuit-arduino',
          heading: '3. Cum depanezi rapid un circuit Arduino care nu răspunde',
          paragraphs: [
            'La proiectele practice din laborator, 80% din probleme sunt de cablare pe breadboard sau de selecție din Arduino IDE, nu de logică:'
          ],
          numberedSteps: [
            'Verifică masa comună (GND): Toți senzorii, LED-urile și eventualele baterii externe ale motoarelor trebuie să împartă același GND cu placa Arduino!',
            'Verifică polaritatea LED-ului: Piciorușul lung (Anod +) merge spre rezistor și pinul digital; piciorușul scurt/partea teșită (Catod -) merge spre GND.',
            'Folosește Serial.begin(9600); și Serial Monitor pentru a afișa valorile brute citite de la senzori (ex: ca să afli pragul real al senzorului LDR din sala de clasă).',
            'Dacă LCD 1602 I2C se aprinde albastru dar nu afișează text, rotește ușor potențiometrul albastru de contrast de pe spatele modulului I2C și verifică adresa (0x27 sau 0x3F).'
          ],
          callout: {
            title: 'Atenție la alimentarea motoarelor',
            text: 'Nu alimenta motoare DC mari direct din pinii digitali ai plăcii Arduino! Folosește o punte H (de exemplu L298N) cu alimentare dedicată și GND comun.',
            variant: 'warning'
          }
        }
      ],
      checklistTitle: 'Checklist înainte de demonstrația Smart Home la clasă',
      checklist: [
        'Fiecare LED este protejat cu un rezistor în serie de 220 Ω–330 Ω.',
        'Toate firele de masă (GND) sunt conectate în aceeași linie comună pe breadboard.',
        'Am folosit millis() pentru temporizări astfel încât senzorii de urgență (MQ-2, PIR) să nu fie blocați de delay().',
        'Am testat pragurile senzorilor în Serial Monitor la lumina reală din încăpere.'
      ],
      faqs: [
        {
          question: 'De ce trebuie să pun un rezistor de 220 Ω în serie cu fiecare LED pe Arduino?',
          answer: 'Un LED consumă în jur de 2V și suportă ~20 mA. Pinul Arduino scoate 5V; fără rezistor, conform Legii lui Ohm, curentul devine mult prea mare și arde instantaneu LED-ul sau pinul microcontrollerului.'
        },
        {
          question: 'Care este diferența dintre pinii digitali și pinii analogici A0–A5?',
          answer: 'Pinii digitali citesc sau trimit doar două stări (HIGH = 5V, LOW = 0V), fiind perfecți pentru butoane, PIR sau relee. Pinii analogici A0–A5 citesc o gamă întreagă de valori între 0 și 1023, necesară pentru fotorezistoare LDR, senzori de temperatură sau MQ-2.'
        },
        {
          question: 'De ce este recomandat millis() în locul lui delay() la proiectul Smart Home?',
          answer: 'Funcția delay() oprește complet execuția programului pe durata pauzei, făcând Arduino surd la senzori critici (cum ar fi alarma de gaz MQ-2). Cu millis(), cronometrezi non-blocant și toate subsistemele funcționează simultan.'
        },
        {
          question: 'Cum calculez distanța cu senzorul ultrasonic HC-SR04?',
          answer: 'Trimiți un impuls de 10 microsecunde pe pinul TRIG, măsori cu pulseIn(ECHO, HIGH) durata întoarcerii ecoului și calculezi distanța în centimetri cu formula: distanta = durata * 0.034 / 2.'
        },
        {
          question: 'Unde pot exersa gratuit Arduino Uno, cablarea pe breadboard și Smart City IoT fără piese fizice?',
          answer: 'Pe ArkyEdu găsești modulele interactive Robotică Arduino & Senzori și Smart Home IoT Integrator (Clasa a VIII-a), laboratorul Arkedo Smart City (/oras/), jocul arcade Circuit Master 80s și duelul 1v1 Circuit Clash Arduino.'
        }
      ],
      internalLinksTitle: 'Simulatoare Arduino, Smart City & Dueluri pe ArkyEdu',
      internalLinks: [
        {
          label: 'Robotică, Arduino Uno & Senzori (Clasa a VIII-a)',
          url: '/cursuri/g8_robot_a/',
          missionId: 'g8_robot_a',
          description: 'Pini digitali/analogici, LDR, PIR, HC-SR04, puntea H L298N și Legea lui Ohm.'
        },
        {
          label: 'Proiect Smart Home & IoT Integrator (Clasa a VIII-a)',
          url: '/cursuri/g8_robot_b/',
          missionId: 'g8_robot_b',
          description: 'Iluminat PWM, barieră SG90, MQ-2, LCD I2C și multitasking millis().'
        },
        {
          label: 'Arkedo Smart City — Simulator IoT Live',
          url: '/oras/',
          targetView: 'city',
          description: 'Configurează și testează un oraș digital Smart City direct în browser.'
        },
        {
          label: 'Circuit Master 80s & Circuit Clash 1v1',
          url: '/arcade/',
          targetView: 'arcade',
          description: 'Exersează cablarea breadboard Arduino și algoritmii contra cronometru.'
        }
      ]
    },
    en: {
      slug: 'arduino-smart-home-school-project-sensors-millis',
      title: 'Arduino Uno Smart Home School Project (Grades 7–8): PIR, HC-SR04 Ultrasonic, MQ-2 & Non-Blocking millis()',
      metaTitle: 'Arduino Smart Home Project for Middle School: Sensors & millis() | ArkyEdu',
      metaDescription: 'Practical Grade 7–8 Arduino Uno robotics guide: digital vs analog A0–A5 pins, Ohm’s Law 220 Ω LED resistors, PIR motion, HC-SR04 distance, MQ-2 gas alarm, and non-blocking millis().',
      keywords: 'arduino smart home school project, arduino millis instead of delay, hc-sr04 ultrasonic sensor arduino code, why led needs 220 ohm resistor arduino, mq-2 gas sensor pir arduino, middle school robotics',
      breadcrumbLabel: 'Arduino Smart Home & millis()',
      categoryLabel: 'Arduino Robotics & IoT',
      readTime: '11 min read',
      tldrTitle: 'Quick Answer (TL;DR)',
      tldr: 'A reliable middle school Arduino Uno Smart Home reads digital sensors (PIR motion, HC-SR04 ultrasonic) and analog A0–A5 inputs (LDR photoresistor, MQ-2 gas sensor) to drive actuators (220 Ω resistor-protected LEDs, PWM ~ SG90 servo gates). Replace blocking delay() calls with millis() timers so emergency alarms always trigger immediately.',
      intro: 'Robotics and IoT units in Grades 7 and 8 bring C++ code into the physical world—switching on street lights at dusk, lifting parking gates for approaching vehicles, and sounding buzzers on gas leaks. This hands-on guide breaks down pin mapping, why Ohm’s Law protects your LEDs, and how non-blocking millis() turns hobby scripts into real-time systems.',
      sections: [
        {
          id: 'arduino-pins-and-ohms-law',
          heading: '1. Arduino Uno Pin Map: Digital, Analog A0–A5, PWM (~) & the 220 Ω Resistor Rule',
          paragraphs: [
            'An Arduino Uno operates at 5V with digital pins (D0–D13, strictly HIGH/5V or LOW/0V) and analog input pins (A0–A5, converting voltage into 0–1023 steps via a 10-bit ADC). Digital pins marked with a tilde (~: 3, 5, 6, 9, 10, 11) output PWM signals to dim LEDs or position SG90 servo motors.',
            'Critical hardware rule (Ohm’s Law, I = V / R): Never wire an LED directly between 5V and GND without a series resistor (typically 220 Ω to 330 Ω). Without it, current surges above the pin’s 40 mA safety limit and damages both the LED and the microcontroller.'
          ],
          table: {
            caption: 'Smart Home / Smart City Hardware Component Reference',
            headers: ['Component', 'Arduino Pin Type', 'Role in the System'],
            rows: [
              ['LDR Photoresistor', 'Analog (e.g., A0)', 'Reads ambient light (0–1023) to switch street lights on at dusk.'],
              ['MQ-2 Gas Sensor', 'Analog (e.g., A1)', 'Detects smoke or combustible gas; triggers alarm buzzer.'],
              ['PIR Motion Sensor', 'Digital INPUT (e.g., D2)', 'Detects warm movement via infrared changes (HIGH/LOW).'],
              ['HC-SR04 Ultrasonic', 'Digital TRIG / ECHO (D4, D5)', 'Measures distance in cm via sound echo (duration * 0.034 / 2).'],
              ['SG90 Servo Motor', 'Digital PWM (~9)', 'Rotates a parking gate arm smoothly between 0° and 90°.'],
              ['LCD 1602 I2C Display', 'I2C Bus (SDA=A4, SCL=A5)', 'Displays sensor telemetry using only two data wires.']
            ]
          }
        },
        {
          id: 'millis-vs-delay',
          heading: '2. Why delay() Breaks Smart Systems—and How millis() Fixes Multitasking',
          paragraphs: [
            'Calling delay(5000) to hold a gate open freezes the entire Arduino chip for five seconds. If the MQ-2 sensor detects gas during that pause, the alarm will not fire until delay() finishes!',
            'Using millis()—which counts milliseconds since boot—lets you check elapsed time non-blockingly (`if (now - previousTime >= interval)`), keeping gas sensors responsive thousands of times per second.'
          ],
          codeBlock: {
            title: 'Non-Blocking Arduino Code: Smart Streetlight + Instant Gas Alarm',
            language: 'cpp',
            code: `const int PIN_LDR = A0;
const int PIN_GAS = A1;
const int PIN_STREET_LED = 6; // PWM (~) pin
const int PIN_BUZZER = 8;

unsigned long lastLightCheck = 0;
const unsigned long LIGHT_INTERVAL = 250; // check every 250 ms without blocking

void setup() {
  pinMode(PIN_STREET_LED, OUTPUT);
  pinMode(PIN_BUZZER, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  unsigned long now = millis();

  // 1. Instant non-blocking safety check: MQ-2 gas alarm
  int gasLevel = analogRead(PIN_GAS);
  if (gasLevel > 450) {
    tone(PIN_BUZZER, 1200);
  } else {
    noTone(PIN_BUZZER);
  }

  // 2. Periodic PWM smart lighting using millis() (zero delay!)
  if (now - lastLightCheck >= LIGHT_INTERVAL) {
    lastLightCheck = now;
    int light = analogRead(PIN_LDR);
    int pwm = (light < 400) ? map(light, 0, 400, 255, 60) : 0;
    analogWrite(PIN_STREET_LED, pwm);
  }
}`,
            caption: 'Always store millis() timestamps in unsigned long variables and avoid delay() in multi-sensor loops.'
          }
        },
        {
          id: 'breadboard-troubleshooting',
          heading: '3. Fast Hardware Debugging Checklist When a Circuit Doesn’t Respond',
          paragraphs: [
            'In school labs, four out of five circuit issues come from breadboard wiring rather than C++ syntax:'
          ],
          numberedSteps: [
            'Check Common Ground (GND): Every sensor, LED, and external motor battery pack must share a common GND rail with the Arduino.',
            'Verify LED Polarity: Long leg (Anode +) connects toward the resistor and signal pin; short leg / flat edge (Cathode -) goes to GND.',
            'Use Serial Monitor (`Serial.begin(9600)`): Print raw LDR and MQ-2 readings to calibrate thresholds to actual classroom lighting.',
            'I2C LCD Lit Blue With No Text? Gently turn the small contrast potentiometer on the back of the I2C backpack and verify address 0x27 vs 0x3F.'
          ],
          callout: {
            title: 'Never Power Heavy DC Motors Directly From Arduino Pins',
            text: 'Use an L298N H-Bridge driver with a dedicated battery supply and shared GND so motor current spikes never brown out your microcontroller.',
            variant: 'warning'
          }
        }
      ],
      checklistTitle: 'Smart Home Lab Pre-Demo Checklist',
      checklist: [
        'Every LED has a 220 Ω–330 Ω resistor in series.',
        'All grounds (GND) tie together on a common breadboard rail.',
        'Timed actions use millis() instead of blocking delay() calls.',
        'Sensor trigger thresholds are verified in Serial Monitor under real room lighting.'
      ],
      faqs: [
        {
          question: 'Why does an LED need a 220 Ω resistor with Arduino Uno?',
          answer: 'Standard LEDs drop around 2V at 20 mA, while Arduino pins output 5V. By Ohm’s Law, omitting a resistor causes excessive current that can burn out both the LED and the microcontroller pin.'
        },
        {
          question: 'What is the difference between digital pins and analog pins A0–A5?',
          answer: 'Digital pins read or write only two states (HIGH = 5V, LOW = 0V), ideal for buttons or PIR sensors. Analog pins A0–A5 measure continuous voltage across 0–1023 steps for LDR, temperature, or MQ-2 sensors.'
        },
        {
          question: 'Why should students use millis() instead of delay()?',
          answer: 'delay() halts all code execution until the timer ends, making critical alarms unresponsive. millis() checks elapsed time without blocking the loop so multiple sensors run simultaneously.'
        },
        {
          question: 'How do you convert HC-SR04 echo time to centimeters?',
          answer: 'Trigger a 10 µs pulse on TRIG, read duration with pulseIn(ECHO, HIGH), and compute distance in cm as duration * 0.034 / 2.'
        },
        {
          question: 'Where can students practice Arduino circuits and Smart City IoT online for free?',
          answer: 'ArkyEdu includes interactive Grade 8 Arduino Robotics and Smart Home IoT labs, the Arkedo Smart City simulator (/oras/), Circuit Master 80s in the Arcade, and 1v1 Circuit Clash duels.'
        }
      ],
      internalLinksTitle: 'Practice Arduino, Smart City IoT & Duels on ArkyEdu',
      internalLinks: [
        {
          label: 'Robotics, Arduino Uno & Sensors (Grade 8)',
          url: '/cursuri/g8_robot_a/',
          missionId: 'g8_robot_a',
          description: 'Master digital/analog pins, PIR, HC-SR04, L298N, and Ohm’s Law.'
        },
        {
          label: 'Smart Home & IoT Integrator Project (Grade 8)',
          url: '/cursuri/g8_robot_b/',
          missionId: 'g8_robot_b',
          description: 'PWM street lights, SG90 servo barrier, MQ-2 alarm, and millis().'
        },
        {
          label: 'Arkedo Smart City — Live IoT Simulator',
          url: '/oras/',
          targetView: 'city',
          description: 'Configure and test a browser-based digital Smart City.'
        },
        {
          label: 'Circuit Master 80s & Circuit Clash 1v1 (Arcade)',
          url: '/arcade/',
          targetView: 'arcade',
          description: 'Wire virtual Arduino breadboards and compete on timing.'
        }
      ]
    }
  }
];
