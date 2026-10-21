import { CurriculaModule } from './curriculaData';

export const GRADE_7_CURRICULA_MODULES: CurriculaModule[] = [
  // ==================== UNITATEA 1: EDITORUL DE TEXTE ====================
  {
    id: 'g7_word_a',
    slug: 'word-tehnoredactare-interfata',
    title: 'Editarea și Tehnoredactarea Documentelor — Microsoft Word & Procesoare Moderne',
    shortTitle: 'Tehnoredactare & Interfață Word',
    grade: 'Clasa a VII-a',
    unit: 'Unitatea 1: Editorul de texte (pag. 10–17)',
    manualRef: 'Manual Art Klett — OMEN 3393/2017 & OM 5420/2024',
    icon: '📝',
    color: 'from-blue-600 to-indigo-700',
    metaDescription: 'Ghid curricular complet TIC Clasa a 7-a: Tehnoredactare, procesarea textului, anatomia Ribbon Word, gestionarea fișierelor .docx/.pdf și comenzi rapide universale.',
    keywords: [
      'tehnoredactare clasa 7',
      'microsoft word interfata ribbon',
      'procesor de text gimnaziu',
      'gestionare fisiere docx pdf',
      'comenzi rapide tastatura word'
    ],
    competencies: [
      {
        code: '1.1',
        description: 'Editarea și tehnoredactarea de documente utilizând aplicații specializate (Microsoft Word, LibreOffice Writer, Google Docs).'
      },
      {
        code: '3.1',
        description: 'Elaborarea unor documente utile în situații cotidiene folosind aplicațiile studiate, respectând normele de redactare și salvare.'
      }
    ],
    theorySections: [
      {
        title: 'Evoluția de la Mașina de Scris la Procesoare Digitale de Text',
        content: [
          'Noțiunea de tehnoredactare (DEX 2009): pregătirea tehnică și grafică a unui text înainte de a fi tipărit sau distribuit electronic.',
          'Procesoarele moderne de text (Microsoft Word, LibreOffice Writer, Google Docs) permit introducerea textului, corectarea ortografică, formatarea la nivel de caracter/paragraf, inserarea de imagini, tabele, ecuații și machetarea profesională a paginilor.',
          'Formatul de fișier reprezintă modul standardizat de codificare a informațiilor. Extensiile uzuale sunt: .docx (document Word standard), .pdf (Portable Document Format — păstrează aspectul identic pe orice dispozitiv), .txt (text simplu fără formatare), .rtf (Rich Text Format).'
        ],
        tips: 'Regulă de aur: Salvează întotdeauna ca PDF atunci când trimiți un referat către profesor sau imprimantă pentru a evita decalarea fonturilor și a imaginilor!'
      },
      {
        title: 'Anatomia Ferestrei Word & Panglica cu File (Ribbon)',
        content: [
          'Bara de titlu (Title Bar): afișează numele documentului și al aplicației, butoanele de control (minimizare, restaurare/maximizare, închidere).',
          'Bara de acces rapid (Quick Access Toolbar): scurtături pentru Salvare (Ctrl+S), Anulare (Undo — Ctrl+Z) și Repetare (Redo — Ctrl+Y).',
          'Panglica (Ribbon): organizată în File principale (Fișier/File, Pornire/Home, Inserare/Insert, Desenare/Draw, Proiectare/Design, Machetare/Layout, Referințe/References, Revizuire/Review, Vizualizare/View).',
          'Fiecare filă este împărțită în Grupuri logice de comenzi (ex: fila Pornire conține grupurile Clipboard, Font, Paragraf, Stiluri, Editare).',
          'Bara de stare (Status Bar): afișează numărul curent de pagini, contorul total de cuvinte, limba dicționarului activ și glisorul de panoramare (Zoom).'
        ],
        tips: 'Tastează Ctrl+F1 pentru a ascunde sau afișa rapid panglica Ribbon atunci când ai nevoie de mai mult spațiu vertical de lucru pe ecran!'
      }
    ],
    keyTerms: [
      { term: 'Tehnoredactare', definition: 'Ansamblul operațiilor de aranjare tehnică și estetică a textului și ilustrațiilor într-o publicație digitală sau tipărită.' },
      { term: 'Procesor de Text', definition: 'Aplicație software complexă destinată creării, editării, formatării, verificării și tipăririi documentelor.' },
      { term: 'Panglică (Ribbon)', definition: 'Banda orizontală superioară din Word organizată pe file și grupuri tematice de butoane și comenzi.' },
      { term: 'PDF (Portable Document Format)', definition: 'Format standard deschis de fișier care păstrează cu fidelitate fonturile, imaginile și așezarea în pagină indiferent de sistem.' },
      { term: 'Bara de Acces Rapid', definition: 'Zonă personalizabilă din colțul stânga-sus pentru acces instantaneu la Salvare, Undo și Redo.' }
    ],
    keyboardShortcuts: [
      { keys: 'Ctrl + N', action: 'Crearea unui document nou gol (New Document)' },
      { keys: 'Ctrl + O', action: 'Deschiderea unui document existent de pe disc (Open)' },
      { keys: 'Ctrl + S', action: 'Salvarea modificărilor în fișierul curent (Save)' },
      { keys: 'F12 / Salvare ca', action: 'Salvarea documentului cu un nume nou sau într-un alt format (Save As)' },
      { keys: 'Ctrl + P', action: 'Deschiderea ferestrei de previzualizare și tipărire (Print)' }
    ],
    faqs: [
      {
        question: 'Care este diferența dintre Salvare (Save) și Salvare ca (Save As)?',
        answer: 'Salvare (Ctrl+S) suprascrie fișierul deja existent cu modificările recente. Salvare ca (F12) creează o copie nouă, permițând schimbarea numelui, a folderului de destinație sau a formatului (de exemplu salvarea ca PDF).'
      },
      {
        question: 'De ce este important contorul de cuvinte de pe bara de stare?',
        answer: 'Multe teme, referate sau concursuri școlare impun o limită exactă de cuvinte (ex: compunere de 300–400 de cuvinte). Bara de stare actualizează contorul în timp real pe măsură ce tastezi.'
      }
    ],
    practicalLab: 'Explorează fila Pornire și Inserare din Word. Configurează bara de acces rapid cu butonul Salvare rapidă și convertește un document simplu în format PDF fără erori de paginare.',
    missionId: 'g7_word_a'
  },
  {
    id: 'g7_word_b',
    slug: 'machetare-pagina-tipografie',
    title: 'Machetare de Pagină, Tipografie Românească & Documente Structurate',
    shortTitle: 'Machetare & Tipografie Avansată',
    grade: 'Clasa a VII-a',
    unit: 'Unitatea 1: Editorul de texte (pag. 18–27)',
    manualRef: 'Manual Art Klett — OMEN 3393/2017 & OM 5420/2024',
    icon: '📐',
    color: 'from-indigo-600 to-sky-700',
    metaDescription: 'Regulile esențiale ale tipografiei românești: diacritice corecte, spațierea semnelor de punctuație, machetare pagină A4, margini, antet/subsol, tabele și ecuații.',
    keywords: [
      'reguli tipografice limba romana',
      'diacritice corecte virgula dedesubt',
      'spatiere semne punctuatie word',
      'machetare pagina margini a4',
      'antet si subsol numerotare pagini'
    ],
    competencies: [
      {
        code: '1.1',
        description: 'Editarea/tehnoredactarea documentelor aplicând normele ortografice și de punctuație specifice limbii române.'
      },
      {
        code: '3.1',
        description: 'Machetarea coerentă a unui document cu tabele, numerotare automată, note de subsol și elemente grafice integrate.'
      }
    ],
    theorySections: [
      {
        title: 'Regulile de Aur ale Tipografiei în Limba Română',
        content: [
          'Scrierea cu diacritice este obligatorie: utilizarea caracterelor corecte ă, â, î, ș, ț (cu virgulă dedesubt conform standardului SR 13411, nu cu sedilă turcească).',
          'Regula semnelor de punctuație (. , ; : ! ?): se lipesc întotdeauna de cuvântul precedent și sunt urmate obligatoriu de exact un spațiu.',
          'Ghilimelele românești corecte: deschiderea se face jos „ (99 jos), iar închiderea se face sus ” (99 sus). Ghilimelele englezești drepte " " sunt neconforme.',
          'Parantezele se lipesc de textul din interior: (fără spațiu după deschidere și fără spațiu înainte de închidere).',
          'Liniuța de unire (cratima) se leagă direct de ambele cuvinte (ex: s-a dus, într-un).',
          'Tasta Enter nu se apasă niciodată la sfârșitul fiecărui rând! Trecerea pe rândul următor este automată (Word Wrap). Enter se apasă exclusiv pentru a începe un paragraf nou!'
        ],
        tips: 'Pentru a depista spațiile duble sau apăsările greșite de Enter, activează butonul „Afișare/Ascundere caractere neimprimabile” (simbolul ¶ / Pilcrow din fila Pornire).'
      },
      {
        title: 'Formatarea Paragrafelor, Machetare & Antet/Subsol',
        content: [
          'Alinierea textului: La stânga (Left), Centrat (Center), La dreapta (Right), sau Aliniere egală stânga-dreapta (Justified — recomandată pentru cărți și referate).',
          'Indentarea primului rând (First Line Indent): spațiul lăsat la început de paragraf (standard 1.25 cm), setat din riglă sau din caseta de dialog Paragraf.',
          'Configurarea paginii (fila Machetare): Dimensiune (A4: 210 x 297 mm), Orientare (Portret vs Vedere/Landscape), Margini (standard 2.54 cm sus/jos/stânga/dreapta).',
          'Ruperea de pagină (Page Break): se introduce cu combinația de taste Ctrl+Enter, niciodată prin apăsarea repetată a tastei Enter!',
          'Antet și Subsol (Header & Footer): zone repetitive afișate pe fiecare pagină pentru titlul lucrării, autor și numerotarea automată a paginilor.'
        ],
        tips: 'Folosește Ctrl+Enter pentru a începe un capitol pe o pagină nouă curată; dacă adaugi text ulterior pe pagina precedentă, noul capitol nu se va decala anapoda!'
      }
    ],
    keyTerms: [
      { term: 'Justified (Aliniere Stânga-Dreapta)', definition: 'Mod de aliniere a textului pe ambele margini prin ajustarea microscopică a spațiilor dintre cuvinte.' },
      { term: 'Indentare (First Line Indent)', definition: 'Distanța lăsată de la marginea din stânga până la primul cuvânt al unui paragraf nou (alineat).' },
      { term: 'Rupere de Pagină (Page Break)', definition: 'Comandă (Ctrl+Enter) care forțează continuarea textului direct pe pagina următoare.' },
      { term: 'Antet (Header)', definition: 'Zona din marginea superioară a paginii rezervată informațiilor repetitive (titlu referat, capitol).' },
      { term: 'Subsol (Footer)', definition: 'Zona din marginea inferioară a paginii destinată numerotării automate și notelor bibliografice.' }
    ],
    keyboardShortcuts: [
      { keys: 'Ctrl + Enter', action: 'Inserare rupere de pagină curată (Page Break)' },
      { keys: 'Ctrl + J', action: 'Alinierea paragrafului stânga-dreapta (Justify)' },
      { keys: 'Ctrl + E', action: 'Alinierea centrată a titlului (Center)' },
      { keys: 'Ctrl + Z', action: 'Anularea ultimei acțiuni greșite (Undo)' },
      { keys: 'Alt + 0132 / Alt + 0148', action: 'Generarea ghilimelelor românești „ ”' }
    ],
    faqs: [
      {
        question: 'De ce este greșit să apăsăm Enter la finalul fiecărui rând?',
        answer: 'Dacă apeși Enter pe fiecare rând, Word tratează fiecare rând ca pe un paragraf independent. Dacă schimbi fontul, dimensiunea sau marginile paginii, întregul text se va sparge în linii inegale și dezordonate.'
      },
      {
        question: 'Cum introducem diacriticele românești de la tastatură?',
        answer: 'Se comută limba tastaturii în Romanian (Standard) prin tasta Windows + Spațiu sau Alt + Shift. Tastele dedicate sunt: [ pentru ă, ] pentru î, ; pentru ș, \' pentru ț și \\ pentru â.'
      }
    ],
    practicalLab: 'Prelucrează un text neformatat: elimină spațiile duble, aplică aliniere Justified cu indentare de 1.25 cm, adaugă numerotare în subsol și inserează un tabel cu 3 coloane și 4 rânduri.',
    missionId: 'g7_word_b'
  },

  // ==================== UNITATEA 2: APLICAȚII AUDIO-VIDEO ====================
  {
    id: 'g7_audio_a',
    slug: 'wavepad-editare-audio-digitala',
    title: 'Acustică Digitală, Frecvențe & Studio de Editare WavePad',
    shortTitle: 'Acustică & Studio WavePad',
    grade: 'Clasa a VII-a',
    unit: 'Unitatea 2: Aplicații de prelucrare audio-video (pag. 28–35)',
    manualRef: 'Manual Art Klett — OMEN 3393/2017 & OM 5420/2024',
    icon: '🎙️',
    color: 'from-amber-500 to-rose-600',
    metaDescription: 'Fundamentele sunetului digital clasa a 7-a: unde sonore, frecvență Hertz, volum decibeli, canale mono/stereo, forma de undă Waveform și mixare Paste Mix în WavePad.',
    keywords: [
      'sunet digital clasa 7',
      'wavepad audio waveform',
      'frecventa hertz amplitudine decibeli',
      'mono stereo esantionare 44100 hz',
      'paste mix decupare sunet'
    ],
    competencies: [
      {
        code: '1.2',
        description: 'Documentarea pe diferite teme prin utilizarea aplicațiilor audio dedicate și a instrumentelor de înregistrare digitală.'
      },
      {
        code: '3.2',
        description: 'Elaborarea unor materiale audio (jingle radio, podcast, narațiune) prin tăiere, curățare zgomot și mixare.'
      }
    ],
    theorySections: [
      {
        title: 'Natura Fizică și Digitală a Sunetului',
        content: [
          'Sunetul este o undă mecanică produsă de vibrația unui corp și transmisă prin aer sau alt mediu elastic.',
          'Frecvența sunetului: numărul de oscilații pe secundă, măsurat în Hertz (Hz). Urechea umană aude sunete între 20 Hz (sunete foarte joase/grave) și 20.000 Hz (20 kHz, sunete foarte înalte/acute).',
          'Amplitudinea (Volumul / Intensitatea): reflectă energia undei sonore, măsurată în decibeli (dB). O conversație normală are ~60 dB, iar pragul durerii este la ~120 dB.',
          'Eșantionarea (Sampling Rate): procesul prin care unda continuă analogică este transformată în date binare prin măsurători discrete repetate. Standardul calității de CD audio este de 44.100 eșantioane pe secundă (44.1 kHz) pe 16 biți.',
          'Canale de redare: Mono (un singur canal audio redat identic în ambele căști) vs. Stereo (două canale distincte stânga/dreapta care creează senzația de spațialitate 3D).'
        ],
        tips: 'Evită depășirea pragului de 0 dB în programele de editare audio; orice semnal peste 0 dB produce „clipping” (distorsiune stridentă și neplăcută a sunetului)!'
      },
      {
        title: 'Interfața WavePad & Tehnici de Editare Sonoră',
        content: [
          'Forma de undă (Waveform): graficul vizual pe ecran unde axa orizontală reprezintă timpul (minute, secunde, sutimi), iar axa verticală reprezintă amplitudinea/puterea sunetului.',
          'Cursorul temporal și redarea: tasta Spațiu pornește (Play) sau oprește (Pause) ascultarea fragmentului selectat.',
          'Operația de Decupare (Trim): păstrează doar porțiunea selectată din fișierul audio și elimină tot restul dinaintea și de după selecție.',
          'Operația de Tăiere (Cut) și Ștergere (Delete): elimină pauzele lungi, bâlbele sau zgomotele nedorite din înregistrare.',
          'Înlocuirea cu liniște (Silence): transformă porțiunea selectată în liniște absolută (amplitudine 0 dB), utilă pentru mascarea respirațiilor grele.',
          'Operația Paste Mix: mixează conținutul din clipboard peste sunetul existent pe pistă, permițând reglarea volumului fiecărei componente (ex: 80% voce narator și 25% fond muzical).'
        ],
        tips: 'Când realizezi un Paste Mix, asigură-te că melodia instrumentală de fundal are un nivel de volum mult mai redus decât vocea, altfel cuvintele nu se vor înțelege!'
      }
    ],
    keyTerms: [
      { term: 'Frecvență (Hz)', definition: 'Numărul de vibrații ale undei sonore pe secundă; determină tonalitatea sunetului (grav sau acut).' },
      { term: 'Amplitudine (dB)', definition: 'Înălțimea oscilației undei sonore; determină intensitatea sau tăria percepută a volumului.' },
      { term: 'Formă de Undă (Waveform)', definition: 'Reprezentarea grafică a semnalului audio în funcție de timp afișată pe ecranul editorului.' },
      { term: 'Rată de Eșantionare (44.1 kHz)', definition: 'Frecvența măsurătorilor digitale ale semnalului analogic (44.100 mostre pe secundă).' },
      { term: 'Paste Mix', definition: 'Comandă prin care două fragmente audio se suprapun și se combină pe o singură pistă, cu ajustarea volumelor relative.' }
    ],
    keyboardShortcuts: [
      { keys: 'Bara de Spațiu', action: 'Pornire redare / Pauză (Play / Pause)' },
      { keys: 'Ctrl + X / Del', action: 'Tăiere / Ștergere fragment sonor selectat' },
      { keys: 'Ctrl + C', action: 'Copiere fragment audio în memoria temporară' },
      { keys: 'Ctrl + Shift + V', action: 'Deschiderea casetei de dialog Paste Mix pentru suprapunere audio' },
      { keys: 'Rotiță Mouse + Ctrl', action: 'Mărire sau micșorare pe axa timpului (Zoom in/out)' }
    ],
    faqs: [
      {
        question: 'Care este diferența dintre MP3 și WAV?',
        answer: 'WAV este un format necomprimat, de calitate maximă de studio, dar care ocupă mult spațiu (~10 MB per minut). MP3 este un format comprimat cu pierderi insesizabile pentru ureche, reducând dimensiunea fișierului de aproximativ 10 ori.'
      },
      {
        question: 'Cum eliminăm un clic sau o respirație zgomotoasă dintr-o înregistrare?',
        answer: 'Mărim zoom-ul pe forma de undă în zona defectului, selectăm cu mouse-ul acele zecimi de secundă și folosim comanda Mute/Silence sau tasta Delete.'
      }
    ],
    practicalLab: 'Înregistrează un mesaj vocal de 15 secunde. Decupează pauzele de la început și final, aplică efectul Paste Mix cu un efect sonor de fundal și exportă rezultatul în format MP3.',
    missionId: 'g7_audio_a'
  },
  {
    id: 'g7_video_b',
    slug: 'videopad-montaj-video-multitrack',
    title: 'Montaj Video Multitrack, Tranziții & Titrare în VideoPad',
    shortTitle: 'VideoPad & Montaj Video',
    grade: 'Clasa a VII-a',
    unit: 'Unitatea 2: Aplicații de prelucrare audio-video (pag. 36–47)',
    manualRef: 'Manual Art Klett — OMEN 3393/2017 & OM 5420/2024',
    icon: '🎬',
    color: 'from-rose-600 to-pink-700',
    metaDescription: 'Editare video clasa a 7-a: piste video și audio, tăiere Split, efecte speciale, tranziții CrossFade, titluri, subtitrări și licențe Creative Commons în VideoPad.',
    keywords: [
      'montaj video clasa 7',
      'videopad video track audio track',
      'split taiere clip video',
      'tranzitii crossfade wipe video',
      'drepturi autor creative commons mp4'
    ],
    competencies: [
      {
        code: '1.2',
        description: 'Documentarea prin utilizarea aplicațiilor video și selectarea surselor media licențiate corespunzător.'
      },
      {
        code: '3.2',
        description: 'Elaborarea unor materiale video (reportaj școlar, prezentare turistică) folosind aplicații de editare multitrack.'
      }
    ],
    theorySections: [
      {
        title: 'Arhitectura unui Proiect Video: Piste & Timeline',
        content: [
          'Diferența dintre Proiect Video și Fișier Video Exportat: Fișierul de proiect conține doar instrucțiuni și referințe către fișierele brute de pe disc; fișierul exportat (.mp4) este clipul final renderizat.',
          'Zona de stocare media (Bin / Clip Library): folderul virtual din program unde sunt importate fișierele video, imaginile statice și melodiile folosite.',
          'Cronologia (Timeline): inima editorului video. Este organizată pe straturi paralele: Pista Video (Video Track — imagini și cadre în mișcare) și Pista Audio (Audio Track — dialog, muzică de fundal, efecte speciale FX).',
          'Operația de Fragmentare (Split / Tăiere la cursor): separă un clip lung în două segmente independente exact în punctul unde se află cursorul roșu de redare.',
          'Cadre pe secundă (FPS — Frames Per Second): standardul este de 24, 30 sau 60 fps pentru o mișcare fluidă a imaginii.'
        ],
        tips: 'Păstrează toate clipurile, imaginile și sunetele unui proiect video în același folder pe calculator înainte de a le importa, pentru a nu risca pierderea legăturilor media!'
      },
      {
        title: 'Tranziții, Titrări, Efecte Audio & Licențe Creative Commons',
        content: [
          'Tranziții video: efecte vizuale ce asigură trecerea lină de la un cadru la altul. Exemple: CrossFade (dizolvare încrucișată), Wipe (ștergere dintr-o parte), Slide (alunecare), Zoom.',
          'Efectele audio Fade In (apariție treptată a volumului) și Fade Out (scădere lină până la liniște) previn întreruperile bruște și neplăcute ale coloanei sonore.',
          'Titrarea și subtitrările: introducerea ecranului de titlu, a etichetelor de identificare (nume elev, temă) și a genericului final de distribuție (Credits).',
          'Etică și Legislație — Dreptul de autor (Copyright): este ilegal să folosim melodii sau clipuri comerciale fără acordul titularului.',
          'Licențele Creative Commons (CC): permit utilizarea gratuită a materialelor în scopuri educaționale cu respectarea condițiilor menționate de autor (ex: CC-BY solicită doar menționarea numelui autorului).'
        ],
        tips: 'Evită folosirea a 10 tipuri diferite de tranziții spectaculoase într-un singur video; tranziția clasică CrossFade de 1 secundă oferă cel mai elegant aspect profesional!'
      }
    ],
    keyTerms: [
      { term: 'Cronologie (Timeline)', definition: 'Axa temporală orizontală pe care se aranjează secvențele video și pistele audio într-o ordine regizorală precisă.' },
      { term: 'Split (Divizare)', definition: 'Operația de tăiere a unui clip în două bucăți la poziția exactă a cursorului temporal.' },
      { term: 'CrossFade (Dizolvare)', definition: 'Efect vizual de tranziție prin care primul cadru devine treptat transparent în timp ce al doilea cadru devine opac.' },
      { term: 'Fade In / Fade Out', definition: 'Creșterea treptată de la liniște la volum normal la debutul pistei, respectiv stingerea lină la final.' },
      { term: 'Creative Commons (CC)', definition: 'Sistem de licențiere deschisă care permite creatorilor să permită partajarea și reutilizarea legală a operelor lor.' }
    ],
    keyboardShortcuts: [
      { keys: 'Tasta L', action: 'Tăiere / divizare clip video la poziția cursorului (Split)' },
      { keys: 'Bara de Spațiu', action: 'Pornire / Oprire previzualizare video pe monitorul de control' },
      { keys: 'Ctrl + B', action: 'Inserare titlu text sau panou de generic' },
      { keys: 'Ctrl + E', action: 'Exportul proiectului video în fișier MP4 Full HD' }
    ],
    faqs: [
      {
        question: 'Ce se întâmplă dacă șterg un clip video din calculator după ce l-am pus în VideoPad?',
        answer: 'VideoPad nu va mai găsi fișierul sursă și va afișa un ecran de avertizare cu „Media Offline”. Proiectele video nu copiază fișierele mari în proiect, ci doar creează legături către locația lor de pe disc.'
      },
      {
        question: 'Ce înseamnă rezoluția 1080p Full HD?',
        answer: 'Înseamnă o imagine compusă din 1920 de pixeli pe orizontală și 1080 de linii pe verticală, oferind o claritate excelentă pentru ecrane de calculator, tablete sau televizoare.'
      }
    ],
    practicalLab: 'Construiește un scurtmetraj de 30 de secunde despre școala ta: importă 3 cadre video, aplică Split pentru eliminarea părților tremurate, adaugă tranziții CrossFade, o piesă audio CC cu Fade Out și generic de final.',
    missionId: 'g7_video_b'
  },

  // ==================== UNITATEA 3: APLICAȚII COLABORATIVE & GIS ====================
  {
    id: 'g7_cloud_a',
    slug: 'colaborare-cloud-google-docs-slides',
    title: 'Aplicații Colaborative în Cloud — Google Docs & Slides în Echipă',
    shortTitle: 'Colaborare Live în Cloud',
    grade: 'Clasa a VII-a',
    unit: 'Unitatea 3: Aplicații colaborative (pag. 48–56)',
    manualRef: 'Manual Art Klett — OMEN 3393/2017 & OM 5420/2024',
    icon: '👥',
    color: 'from-emerald-600 to-teal-700',
    metaDescription: 'Colaborare în cloud pentru clasa a 7-a: Google Docs și Slides, permisiuni de partajare (Viewer, Commenter, Editor), editare simultană și istoricul versiunilor.',
    keywords: [
      'aplicatii colaborative cloud clasa 7',
      'google docs slides colaborare echipa',
      'permisiuni partajare viewer commenter editor',
      'istoricul versiunilor version history',
      'eticheta neticheta lucru in echipa'
    ],
    competencies: [
      {
        code: '1.3',
        description: 'Utilizarea aplicațiilor colaborative în scopul dezvoltării în echipă a unor materiale digitale.'
      },
      {
        code: '3.1',
        description: 'Elaborarea unor documente și prezentări de grup utile în proiecte școlare interdisciplinare.'
      }
    ],
    theorySections: [
      {
        title: 'Conceptul de Cloud & Lucrul Sincron în Echipă',
        content: [
          'Ce este Cloud Computing? Stocarea fișierelor și rularea aplicațiilor pe servere securizate de pe internet, accesibile de oriunde și de pe orice dispozitiv conectat (calculator, tabletă, telefon).',
          'Colaborarea sincronă în timp real: mai mulți elevi pot deschide și edita același document Google Docs sau aceeași prezentare Google Slides în același timp.',
          'Fiecare participant este identificat pe ecran printr-un cursor colorat distinct și o etichetă cu numele său, astfel încât toți colegii văd instantaneu modificările aduse textului.',
          'Neticheta colaborativă: respectarea muncii colegilor, evitarea ștergerii conținutului scris de altcineva fără discuție prealabilă și folosirea unui limbaj politicos și constructiv.'
        ],
        tips: 'Folosește modul de Sugestii (Suggesting) atunci când vrei să propui o corectură pe textul unui coleg; acesta va putea aproba sau respinge sugestia cu un simplu clic!'
      },
      {
        title: 'Niveluri de Permisiuni, Comentarii & Istoricul Versiunilor',
        content: [
          'Cele 3 niveluri esențiale de acces la un document partajat:',
          '1. Numai vizualizare (Viewer): utilizatorul poate doar citi documentul și descărca o copie, fără drept de modificare.',
          '2. Comentator (Commenter): utilizatorul poate adăuga note și sugestii pe marginea textului, dar nu poate altera conținutul principal.',
          '3. Editor (Editor): drepturi depline de scriere, ștergere, formatare și reorganizare a documentului.',
          'Comentarii și atribuire de sarcini: selectarea unui text și adăugarea unui comentariu cu mențiunea @adresa_coleg generează o notificare automată pe e-mail cu sarcina respectivă.',
          'Istoricul versiunilor (Version History): ține evidența fiecărei modificări efectuate în document, precizând data, ora și autorul. Permite restaurarea la starea anterioară dacă cineva a șters din greșeală un capitol întreg.'
        ],
        tips: 'Niciodată nu seta permisiunea „Editor” pe un link public partajat pe internet, altfel oricine are adresa URL va putea șterge conținutul proiectului tău!'
      }
    ],
    keyTerms: [
      { term: 'Cloud Computing', definition: 'Model informatic de procesare și stocare a datelor pe servere conectate la internet, fără a depinde de un hard disk fizic local.' },
      { term: 'Colaborare Sincronă', definition: 'Editarea simultană a aceluiași fișier de către mai mulți utilizatori aflați în locații geografice diferite.' },
      { term: 'Istoricul Versiunilor', definition: 'Jurnal de salvare automată care păstrează toate variantele anterioare ale unui fișier în cloud.' },
      { term: 'Comentator (Commenter)', definition: 'Nivel de acces care permite adăugarea de recomandări și notițe fără modificarea directă a textului sursă.' },
      { term: 'Atribuire Sarcină (@mențiune)', definition: 'Funcție prin care un coechipier este desemnat direct responsabil pentru rezolvarea unei sarcini din document.' }
    ],
    keyboardShortcuts: [
      { keys: 'Ctrl + Alt + M', action: 'Adăugare comentariu nou pe selecția curentă' },
      { keys: 'Ctrl + Alt + Shift + H', action: 'Deschiderea panoului Istoricul Versiunilor (Version History)' },
      { keys: 'Ctrl + Enter', action: 'Trimiterea / salvarea comentariului' }
    ],
    faqs: [
      {
        question: 'Ce facem dacă un coleg a șters din greșeală o pagină din referatul comun?',
        answer: 'Nu intrăm în panică! Deschidem meniul Fișier -> Istoricul versiunilor -> Vedeți istoricul versiunilor, selectăm varianta salvată acum 10 minute și apăsăm pe „Restaurați această versiune”.'
      },
      {
        question: 'Trebuie să apăsăm Ctrl+S în Google Docs?',
        answer: 'Nu! Aplicațiile Google Docs și Slides salvează automat fiecare literă tastată în timp real în cloud.'
      }
    ],
    practicalLab: 'Creează o prezentare comună Google Slides pentru un proiect de geografie. Invită doi colegi cu drepturi de comentator, adaugă un comentariu cu mențiune @ și inspectează istoricul versiunilor.',
    missionId: 'g7_cloud_a'
  },
  {
    id: 'g7_gis_b',
    slug: 'sisteme-informationale-geografice-gis',
    title: 'Sisteme Informaționale Geografice (GIS) & Cartografie Digitală',
    shortTitle: 'Cartografie Digitală & GIS',
    grade: 'Clasa a VII-a',
    unit: 'Unitatea 3: Aplicații colaborative (pag. 57–63)',
    manualRef: 'Manual Art Klett — OMEN 3393/2017 & OM 5420/2024',
    icon: '🗺️',
    color: 'from-teal-600 to-cyan-700',
    metaDescription: 'GIS și cartografie digitală clasa a 7-a: straturi de date spațiale (Layers), coordonate latitudine/longitudine, Google Earth, hărți tematice și analiză geografică.',
    keywords: [
      'gis clasa 7 sisteme informationale geografice',
      'cartografie digitala straturi layers',
      'coordonate gps latitudine longitudine',
      'google earth masurare distante suprafete',
      'harti tematice analiza spatiala'
    ],
    competencies: [
      {
        code: '1.1',
        description: 'Utilizarea aplicațiilor cartografice și de navigare spațială în scopul investigării realității geografice.'
      },
      {
        code: '3.1',
        description: 'Elaborarea unor hărți digitale tematice prin suprapunerea straturilor de date pentru ilustrarea unor fenomene de mediu.'
      }
    ],
    theorySections: [
      {
        title: 'Ce este un GIS și Cum Funcționează Straturile de Date (Layers)',
        content: [
          'GIS (Geographic Information System — Sistem Informațional Geografic) este un sistem computerizat capabil să captureze, stocheze, manipuleze, analizeze și să afișeze date legate de poziții pe suprafața Pământului.',
          'Modelul straturilor tematice (Layers): o hartă GIS este construită prin suprapunerea mai multor foi transparente de date:',
          '1. Stratul reliefului (altitudini, curbe de nivel, munți).',
          '2. Stratul hidrografic (râuri, lacuri, fluvii, oceane).',
          '3. Stratul căilor de comunicație (autostrăzi, căi ferate, drumuri județene).',
          '4. Stratul așezărilor umane (orașe, sate, coduri poștale).',
          '5. Stratul administrativ (granițe de țări, județe, comune).',
          'Date spațiale (puncte, linii, poligoane geometrice) vs. Date atribut (tabele cu informații descriptive: populație, temperatură medie, tip de sol).'
        ],
        tips: 'Avantajul imens al unui GIS față de o hartă de hârtie este interactivitatea: poți ascunde straturile de care nu ai nevoie și poți interoga orice punct pentru a vedea date statistice detaliate!'
      },
      {
        title: 'Coordonate Geografice & Aplicații Practice (Google Earth)',
        content: [
          'Sistemul de coordonate geografice: identifică orice punct de pe glob prin două valori unghiulare:',
          '1. Latitudinea: măsoară distanța unghiulară spre Nord (N) sau Sud (S) față de Ecuator (0° la Ecuator, 90° la poli).',
          '2. Longitudinea: măsoară distanța unghiulară spre Est (E) sau Vest (V) față de Meridianul Zero (Greenwich, Anglia).',
          'Google Earth oferă explorarea tridimensională a Pământului prin imagini satelitare de înaltă rezoluție, măsurarea distanțelor aeriene (riglă digitală în metri/kilometri) și a suprafețelor (hectare/kmp).',
          'Aplicații GIS în societate: dirijarea ambulanțelor și a pompierilor prin cel mai rapid traseu, prognoze meteorologice, monitorizarea despăduririlor ilegale și dezvoltarea urbană inteligentă (Smart City).'
        ],
        tips: 'În Google Earth poți activa vizualizarea 3D a reliefului pentru a vedea văile și crestele montane din unghiuri de perspectivă spectaculoase!'
      }
    ],
    keyTerms: [
      { term: 'GIS (Geographic Information System)', definition: 'Sistem informatic specializat în colectarea, gestionarea, analiza și vizualizarea datelor geografice georeferențiate.' },
      { term: 'Strat Tematic (Layer)', definition: 'Colecție vizuală omogenă de date spațiale de același tip (ex: doar rețeaua de râuri sau doar drumurile).' },
      { term: 'Latitudine', definition: 'Coordonată unghiulară exprimată în grade, măsurată la Nord sau Sud față de Ecuator.' },
      { term: 'Longitudine', definition: 'Coordonată unghiulară exprimată în grade, măsurată la Est sau Vest față de Meridianul Greenwich.' },
      { term: 'Georeferențiere', definition: 'Atribuirea unor coordonate reale de pe suprafața terestră unui obiect, imagini satelitare sau hărți digitale.' }
    ],
    keyboardShortcuts: [
      { keys: 'R în Google Earth', action: 'Resetarea orientării globului către Nordul geografic' },
      { keys: 'Ctrl + Alt + B', action: 'Comutarea barei laterale de straturi în Google Earth' },
      { keys: 'Shift + Trage cu Mouse', action: 'Înclinarea unghiului de vizualizare pentru perspectivă 3D' }
    ],
    faqs: [
      {
        question: 'Care este diferența dintre Google Maps și Google Earth?',
        answer: 'Google Maps este optimizat pentru navigație rutieră, adrese, rute de trafic și afaceri locale. Google Earth este un glob virtual 3D avansat orientat spre explorare satelitară, măsurători topografice și proiecte educaționale.'
      },
      {
        question: 'Cum ne ajută GIS-ul în caz de inundații?',
        answer: 'Prin suprapunerea stratului cu nivelul prognozat al apei peste stratul caselor și al drumurilor, autoritățile identifică exact clădirile amenințate și organizează evacuarea preventivă.'
      }
    ],
    practicalLab: 'Folosește Google Earth pentru a localiza Vârful Moldoveanu. Identifică coordonatele sale geografice exacte, măsoară distanța în linie dreaptă până la București și explorează relieful înclinat 3D.',
    missionId: 'g7_gis_b'
  },

  // ==================== UNITATEA 4: LIMBAJUL C++ & STRUCTURI ====================
  {
    id: 'g7_cpp_a',
    slug: 'programare-cpp-codeblocks-variabile',
    title: 'Tranziția la C++: Mediul Code::Blocks, Compilare & Tipuri de Date',
    shortTitle: 'Code::Blocks & Tipuri C++',
    grade: 'Clasa a VII-a',
    unit: 'Unitatea 4: Limbajul de programare (pag. 64–73)',
    manualRef: 'Manual Art Klett — OMEN 3393/2017 & OM 5420/2024',
    icon: '⚙️',
    color: 'from-violet-600 to-purple-800',
    metaDescription: 'Primii pași în C++ clasa a 7-a: mediul IDE Code::Blocks, structura programului, functia main, directive #include, tipuri fundamentale (int, float, char, bool) și variabile.',
    keywords: [
      'programare c++ clasa 7 gimnaziu',
      'mediul code blocks ide compilare',
      'structura program c++ main iostream',
      'variabile tipuri de date int float char bool',
      'identificatori declarare variabile'
    ],
    competencies: [
      {
        code: '1.4',
        description: 'Utilizarea unui mediu de programare integrat (IDE) pentru scrierea, compilarea și testarea codului sursă.'
      },
      {
        code: '2.1',
        description: 'Identificarea tipurilor de date necesare pentru memorarea corectă a informațiilor din enunțul unei probleme.'
      }
    ],
    theorySections: [
      {
        title: 'Marele Salt: De la Blocuri Vizuale la Cod Textual C++',
        content: [
          'De ce învățăm C++? În anii anteriori am folosit Scratch, unde instrucțiunile se îmbinau ca piesele unui puzzle. C++ este un limbaj profesional extrem de rapid și puternic, folosit în crearea jocurilor 3D, a sistemelor de operare (Windows, Android) și a misiunilor spațiale NASA.',
          'Mediul Integrat de Dezvoltare (IDE — Integrated Development Environment): aplicație care reunește într-o singură fereastră: Editorul de text cu evidențiere colorată a codului, Compilatorul (care traduce codul scris de om în cod binar înțeles de procesor) și Depanatorul (Debugger — pentru găsirea erorilor).',
          'Code::Blocks este IDE-ul gratuit și standard recomandat de programa școlară pentru învățarea limbajului C++.',
          'Etapele rulării unui program: Scriere cod sursă (.cpp) -> Compilare (Build) -> Legare (Link) -> Lansare fișier executabil (.exe).'
        ],
        tips: 'Orice program C++ este sensibil la litere mari și mici (case-sensitive): cuvântul cheie „int” nu poate fi scris „Int” sau „INT”!'
      },
      {
        title: 'Structura Unui Program C++ & Tipuri Fundamentale de Date',
        content: [
          'Anatomia obligatorie a primului program C++:',
          '#include <iostream> — directiva care aduce biblioteca pentru operații de intrare/ieșire.',
          'using namespace std; — specifică utilizarea spațiului standard de nume.',
          'int main() { ... return 0; } — funcția principală; aici începe execuția oricărui program C++.',
          'Fiecare instrucțiune se termină obligatoriu cu caracterul punct și virgulă (;).',
          'Ce este o variabilă? O zonă de memorie RAM etichetată cu un nume, în care putem stoca valori care se pot schimba pe parcurs.',
          'Tipuri fundamentale de date în C++:',
          '• int — numere întregi (ex: -12, 0, 100, 2026).',
          '• float / double — numere reale cu zecimale (ex: 3.14, -0.75).',
          '• char — un singur caracter alfanumeric, scris între apostrofuri (ex: \'A\', \'+\', \'7\').',
          '• bool — valori logice booleene: true (1 - adevărat) sau false (0 - fals).'
        ],
        tips: 'Apostrof vs Ghilimele în C++: un caracter individual se scrie între apostrofuri simple \'X\', în timp ce un text cu mai multe litere se scrie între ghilimele duble "Salut"!'
      }
    ],
    keyTerms: [
      { term: 'IDE (Integrated Development Environment)', definition: 'Mediu software unificat ce conține editor de cod, compilator și depanator (ex: Code::Blocks).' },
      { term: 'Compilator', definition: 'Program specializat care traduce instrucțiunile scrise în limbaj sursă C++ în cod mașină binar executabil.' },
      { term: 'Variabilă', definition: 'Zonă de memorie alocată, caracterizată printr-un nume (identificator), un tip de date și o valoare stocată.' },
      { term: 'int', definition: 'Tip de date fundamental C++ rezervat numerelor întregi, pozitive sau negative.' },
      { term: 'double', definition: 'Tip de date C++ pentru numere reale cu virgulă mobilă de precizie dublă.' }
    ],
    keyboardShortcuts: [
      { keys: 'F9 în Code::Blocks', action: 'Construiește și rulează programul C++ (Build and Run)' },
      { keys: 'Ctrl + F9', action: 'Doar compilare pentru verificarea erorilor de sintaxă (Build)' },
      { keys: 'Ctrl + /', action: 'Comentare sau decomentare rapidă a liniilor selectate' }
    ],
    faqs: [
      {
        question: 'Ce se întâmplă dacă uităm să punem punct și virgulă la sfârșitul unei linii?',
        answer: 'Compilatorul se va opri cu o eroare de sintaxă („error: expected \';\' before...”) și va refuza să creeze fișierul executabil până când eroarea nu este corectată.'
      },
      {
        question: 'Cum se numesc corect variabilele în C++?',
        answer: 'Numele (identificatorii) pot conține litere, cifre și caracterul underscore _, dar nu pot începe niciodată cu o cifră și nu pot conține spații sau caractere speciale (+, -, @).'
      }
    ],
    practicalLab: 'Instalează sau deschide Code::Blocks. Scrie programul minimal de pornire, declară câte o variabilă de tip int, double și char, atribuie-le valori și rulează codul cu tasta F9.',
    missionId: 'g7_cpp_a'
  },
  {
    id: 'g7_cpp_b',
    slug: 'structura-liniara-cin-cout-cpp',
    title: 'Structura Liniară, Fluxul I/O (cin/cout) & Algoritmul celor 3 Pahare',
    shortTitle: 'Structura Liniară & I/O C++',
    grade: 'Clasa a VII-a',
    unit: 'Unitatea 4: Limbajul de programare (pag. 74–76)',
    manualRef: 'Manual Art Klett — OMEN 3393/2017 & OM 5420/2024',
    icon: '⚡',
    color: 'from-purple-600 to-indigo-800',
    metaDescription: 'Structura liniară C++ clasa a 7-a: afișare cout, citire tastatură cin, operatori aritmetici (+, -, *, /, %), împărțirea întreagă și algoritmul interschimbării a două valori.',
    keywords: [
      'structura liniara c++ clasa 7',
      'citire afisare cin cout endl',
      'operatori aritmetici impartire intreaga modulo',
      'algoritmul celor trei pahare variabila auxiliara',
      'probleme secventiale gimnaziu'
    ],
    competencies: [
      {
        code: '1.4',
        description: 'Implementarea structurii liniare într-un mediu de programare textual folosind fluxuri standard de intrare/ieșire.'
      },
      {
        code: '2.2',
        description: 'Construirea unor algoritmi secvențiali pentru rezolvarea unor probleme de calcul aritmetic și schimb de date.'
      }
    ],
    theorySections: [
      {
        title: 'Fluxul de Afișare (cout) și Citire de la Tastatură (cin)',
        content: [
          'Structura liniară (secvențială) este cea mai simplă structură algoritmică: instrucțiunile se execută strict una după alta, în ordinea scrierii lor, de sus în jos.',
          'Afișarea pe ecran (cout — console output): folosește operatorul de inserție <<. Putem afișa mesaje text între ghilimele, valori ale variabilelor sau rezultate ale calculelor. Manipulatorul endl trece la rând nou.',
          'Exemplu: cout << "Suma este: " << a + b << endl;',
          'Citirea de la tastatură (cin — console input): folosește operatorul de extracție >>. Programul se oprește și așteaptă ca utilizatorul să introducă o valoare și să apese Enter.',
          'Exemplu: cout << "Introdu varsta: "; cin >> varsta;',
          'Operatorul de atribuire (=): salvează valoarea din dreapta în variabila din stânga. Nu confunda x = 5 (atribuire) cu egalitatea matematică!'
        ],
        tips: 'Regulă de orientare a săgeților: la cout săgețile merg spre consolă (spre stânga: <<), iar la cin săgețile merg dinspre tastatură spre variabilă (spre dreapta: >>)!'
      },
      {
        title: 'Operatori Aritmetici, Împărțirea Întreagă & Regula celor 3 Pahare',
        content: [
          'Operatori aritmetici în C++: adunare (+), scădere (-), înmulțire (*).',
          'Marea capcană a împărțirii: Împărțirea întreagă (/) vs. Restul împărțirii întregi (% - modulo):',
          'Dacă ambele numere sunt întregi, a / b returnează câtul întreg! De exemplu: 7 / 2 este egal cu 3 (nu 3.5!).',
          'Operatorul modulo a % b returnează restul împărțirii: 7 % 2 este egal cu 1.',
          'Pentru a obține rezultat cu zecimale, cel puțin unul dintre operanzi trebuie să fie real: 7.0 / 2 dă 3.5.',
          'Algoritmul celor trei pahare (Interschimbarea valorilor a două variabile):',
          'Dacă avem un pahar cu lapte (a) și unul cu ceai (b), nu putem turna laptele peste ceai fără să le amestecăm! Avem nevoie de un al treilea pahar gol auxiliar (aux):',
          'aux = a;  // salvam valoarea lui a in paharul gol',
          'a = b;    // mutam valoarea din b in a',
          'b = aux;  // punem valoarea initiala salvata din aux in b'
        ],
        tips: 'Pentru a extrage ultima cifră a unui număr întreg n, folosim formula n % 10. Pentru a tăia ultima cifră, folosim formula n / 10!'
      }
    ],
    keyTerms: [
      { term: 'cout', definition: 'Obiectul standard C++ de flux de ieșire folosit pentru afișarea textului și numerelor în consolă.' },
      { term: 'cin', definition: 'Obiectul standard C++ de flux de intrare folosit pentru citirea datelor introduse de la tastatură.' },
      { term: 'Modulo (%)', definition: 'Operatorul aritmetic care calculează restul împărțirii a două numere întregi.' },
      { term: 'Împărțire Întreagă (/)', definition: 'Operația de împărțire a două numere de tip int care păstrează doar câtul și ignoră zecimalele.' },
      { term: 'Variabilă Auxiliară', definition: 'Variabilă temporară folosită pentru a reține o valoare în timpul schimbului de date dintre alte două variabile.' }
    ],
    keyboardShortcuts: [
      { keys: 'Ctrl + Shift + F9', action: 'Compilarea rapidă a fișierului C++ curent' },
      { keys: 'Enter în consolă', action: 'Confirmarea valorii introduse pentru fluxul cin' },
      { keys: 'Tab', action: 'Indentarea uniformă a instrucțiunilor din interiorul funcției main' }
    ],
    faqs: [
      {
        question: 'Cât face 13 / 5 și 13 % 5 în C++?',
        answer: '13 / 5 dă câtul 2 (deoarece 5 intră de 2 ori în 13). 13 % 5 dă restul 3 (deoarece 13 - 10 = 3).'
      },
      {
        question: 'Ce se întâmplă dacă scriem a = b fără variabilă auxiliară?',
        answer: 'Valoarea inițială a lui a se pierde ireversibil, fiind suprascrisă imediat de valoarea din b, ambele variabile devenind identice.'
      }
    ],
    practicalLab: 'Scrie un program C++ care citește de la tastatură lungimea și lățimea unei grădini dreptunghiulare. Calculează și afișează perimetrul, aria și apoi interschimbă cele două valori folosind regula celor 3 pahare.',
    missionId: 'g7_cpp_b'
  },
  {
    id: 'g7_decision_a',
    slug: 'decizii-if-else-operatori-logici-cpp',
    title: 'Structura Alternativă: Instrucțiunea if / else & Operatori Logici',
    shortTitle: 'Decizii if / else în C++',
    grade: 'Clasa a VII-a',
    unit: 'Unitatea 4: Limbajul de programare (pag. 77–80)',
    manualRef: 'Manual Art Klett — OMEN 3393/2017 & OM 5420/2024',
    icon: '🔀',
    color: 'from-amber-600 to-orange-700',
    metaDescription: 'Structura de decizie în C++ clasa a 7-a: instructiunea if-else, operatori relationali (==, !=, <, >), operatori logici (&&, ||, !), paritate numere și validare de date.',
    keywords: [
      'structura alternativa c++ clasa 7',
      'instructiunea if else gimnaziu',
      'operatori relationali egalitate == atribuire =',
      'operatori logici si sau negatie',
      'probleme paritate maxim minim c++'
    ],
    competencies: [
      {
        code: '2.1',
        description: 'Analizarea enunțului unei probleme simple în vederea ramificării algoritmului pe baza unor condiții logice.'
      },
      {
        code: '2.2',
        description: 'Construirea de algoritmi care combină structuri secvențiale și alternative (if / else) pentru luarea deciziilor.'
      }
    ],
    theorySections: [
      {
        title: 'Cum Ia Decizii un Program: Instrucțiunea if / else',
        content: [
          'În viața reală luăm decizii în funcție de condiții: „Dacă plouă, iau umbrela; Altfel, iau ochelarii de soare”. În programare, această structură se numește Structura Alternativă sau de Decizie.',
          'Sintaxa în C++:',
          'if (conditie) {',
          '    // ramura ADEVARAT: se executa cand conditia este indeplinita',
          '} else {',
          '    // ramura FALS: se executa cand conditia nu este indeplinita (clauza else este optionala)',
          '}',
          'Operatori relaționali de comparare: < (mai mic), <= (mai mic sau egal), > (mai mare), >= (mai mare sau egal), != (diferit).',
          'Atenție maximă la egalitate: În C++, operatorul de egalitate este dublul egal (==)! Operatorul simplu (=) înseamnă atribuire!'
        ],
        tips: 'Greșeala numărul 1 la începători este scrierea if (a = 5) în loc de if (a == 5). Prima variantă atribuie valoarea 5 lui a și condiția va fi mereu considerată adevărată!'
      },
      {
        title: 'Operatori Logici Compuşi (&&, ||, !) & Probleme Clasice',
        content: [
          'Adesea avem nevoie să verificăm mai multe condiții simultan. Pentru aceasta folosim operatorii logici:',
          '1. && (ȘI logic / conjuncție): ambele condiții trebuie să fie simultan adevărate. Exemplu: if (nota >= 5 && nota <= 10)',
          '2. || (SAU logic / disjuncție): cel puțin una dintre condiții trebuie să fie adevărată. Exemplu: if (zi == "sambata" || zi == "duminica")',
          '3. ! (NEGAȚIE logică): inversează valoarea de adevăr (!true devine false).',
          'Probleme clasice din manual:',
          '• Verificarea parității: if (n % 2 == 0) cout << "Numar par"; else cout << "Numar impar";',
          '• Determinarea maximului dintre două numere: if (a > b) max = a; else max = b;',
          '• Problema triunghiului: trei numere a, b, c pot forma laturile unui triunghi dacă suma oricăror două laturi este strict mai mare decât a treia (a+b>c && a+c>b && b+c>a).'
        ],
        tips: 'Poți înlănțui mai multe decizii folosind structura „else if”: if (nota == 10) cout << "Excelent"; else if (nota >= 8) cout << "Foarte bine"; else cout << "Bine";'
      }
    ],
    keyTerms: [
      { term: 'if / else', definition: 'Instrucțiunea de bază a structurii alternative care execută blocuri diferite de cod în funcție de adevărul unei condiții.' },
      { term: 'Operatorul == (Egalitate)', definition: 'Operator relațional care testează dacă două valori sunt egale, returnând true sau false.' },
      { term: '&& (ȘI Logic)', definition: 'Operator logic care returnează adevărat doar dacă ambele expresii comparate sunt adevărate.' },
      { term: '|| (SAU Logic)', definition: 'Operator logic care returnează adevărat dacă cel puțin una dintre expresii este adevărată.' },
      { term: 'Paritate (n % 2 == 0)', definition: 'Proprietatea matematică a unui număr întreg de a se divide exact cu 2 (restul împărțirii la 2 este 0).' }
    ],
    keyboardShortcuts: [
      { keys: 'Shift + 7 (&)', action: 'Tastarea operatorului logic ȘI dublu (&&)' },
      { keys: 'Shift + \\ (|)', action: 'Tastarea operatorului logic SAU dublu (||)' },
      { keys: 'Shift + 1 (!)', action: 'Tastarea operatorului de negație logică (!)' }
    ],
    faqs: [
      {
        question: 'Este obligatoriu să punem ramura „else” la fiecare „if”?',
        answer: 'Nu! Ramura else este complet opțională. Dacă avem o acțiune de făcut doar în cazul favorabil (ex: dacă ai greșit parola, avertizează), folosim doar if fără else.'
      },
      {
        question: 'Ce afișează programul dacă scriem if (8 > 5 && 3 > 10)?',
        answer: 'Nu afișează nimic pe ramura de adevărat, deoarece deși 8 > 5 este adevărat, 3 > 10 este fals, iar operatorul && impune ca ambele să fie adevărate!'
      }
    ],
    practicalLab: 'Scrie un program C++ care citește un număr natural n reprezentând nota unui elev la test. Dacă nota este între 1 și 4 afișează „Nepromovat”, dacă este între 5 și 10 afișează „Promovat”, iar pentru orice alt număr afișează „Notă invalidă!”.',
    missionId: 'g7_decision_a'
  },
  {
    id: 'g7_loop_b',
    slug: 'bucle-while-prelucrare-cifre-numar',
    title: 'Structura Repetitivă while & Algoritmi pe Cifrele unui Număr',
    shortTitle: 'Bucle while & Cifre Număr',
    grade: 'Clasa a VII-a',
    unit: 'Unitatea 4: Limbajul de programare (pag. 81–85)',
    manualRef: 'Manual Art Klett — OMEN 3393/2017 & OM 5420/2024',
    icon: '🔄',
    color: 'from-orange-600 to-red-700',
    metaDescription: 'Bucla while în C++ clasa a 7-a: structura repetitiva conditionata anterior, evitarea buclelor infinite, suma cifrelor, cifra minima/maxima si numarul palindrom.',
    keywords: [
      'bucla while c++ clasa 7',
      'structura repetitiva conditionata anterior',
      'algoritmi cifrele unui numar gimnaziu',
      'suma cifre oglindit palindrom c++',
      'bucla infinita c++'
    ],
    competencies: [
      {
        code: '2.1',
        description: 'Descompunerea algoritmilor de prelucrare a numerelor naturale în secvențe repetitive bazate pe condiții de oprire.'
      },
      {
        code: '2.2',
        description: 'Construirea structurilor repetitive condiționate anterior (while) pentru rezolvarea de probleme cu număr necunoscut de pași.'
      }
    ],
    theorySections: [
      {
        title: 'Mecanismul Buclei while & Pericolul Buclelor Infinite',
        content: [
          'Când folosim bucla while (Cât timp)? Atunci când o secvență de comenzi trebuie repetată, dar nu știm dinainte numărul exact de pași necesari, ci doar condiția care menține execuția.',
          'Sintaxa în C++:',
          'while (conditie) {',
          '    // instructiunile din interiorul acoladelor se repeta cat timp conditia este TRUE',
          '}',
          'Evaluarea condiției la intrare: Dacă la primul pas condiția este falsă, instrucțiunile din corpul buclei nu se vor executa nici măcar o singură dată!',
          'Capcana Buclei Infinite (Infinite Loop): dacă în interiorul buclei uităm să modificăm variabila testată în condiție, condiția va rămâne mereu adevărată, iar programul va îngheța consumând 100% procesor!'
        ],
        tips: 'Verifică întotdeauna: există în interiorul acoladelor lui while o instrucțiune care apropie variabila de condiția de oprire? (ex: i++ sau n = n / 10).'
      },
      {
        title: 'Algoritmi Fundamentali: Cifrele Unui Număr & Palindrom',
        content: [
          'Cum accesăm cifrele unui număr în baza 10? Prin repetarea a două operații fundamentale până când numărul devine 0:',
          '1. Extragerea ultimei cifre: cifra = n % 10;',
          '2. Tăierea ultimei cifre: n = n / 10;',
          'Calculul sumei cifrelor unui număr:',
          'int suma = 0;',
          'while (n > 0) { suma = suma + n % 10; n = n / 10; }',
          'Determinarea cifrei minime dintr-un număr (pag. 84): inițializăm min = 9 (cea mai mare cifră posibilă) și la fiecare pas dacă (cifra < min) min = cifra;',
          'Construirea numărului oglindit (inversat): ogl = ogl * 10 + n % 10; Un număr este Palindrom dacă este egal cu oglinditul său (ex: 12321, 5005).'
        ],
        tips: 'Atenție: algoritmul while (n > 0) distruge valoarea lui n, lăsând-o 0 la final! Dacă ai nevoie de numărul inițial pentru verificarea de palindrom, salvează o copie a lui înainte de buclă într-o variabilă clona = n!'
      }
    ],
    keyTerms: [
      { term: 'while (Cât timp)', definition: 'Structură repetitivă cu test inițial care repetă instrucțiunile atâta timp cât condiția specificată rămâne adevărată.' },
      { term: 'Buclă Infinită', definition: 'Eroare logică în care condiția unei bucle nu devine niciodată falsă, blocând execuția programului.' },
      { term: 'Cifra de control (n % 10)', definition: 'Operația matematică modulo 10 care extrage cifra unităților a oricărui număr natural.' },
      { term: 'Tăierea cifrei (n / 10)', definition: 'Împărțirea întreagă la 10 care elimină ultima cifră din număr.' },
      { term: 'Număr Palindrom', definition: 'Număr natural care citit de la stânga la dreapta sau de la dreapta la stânga este identic (ex: 1221).' }
    ],
    keyboardShortcuts: [
      { keys: 'Ctrl + C în Consolă', action: 'Oprirea forțată a unui program blocat într-o buclă infinită' },
      { keys: 'F8 în Code::Blocks', action: 'Rularea codului linie cu linie în modul Debugger (depanare pas cu pas)' }
    ],
    faqs: [
      {
        question: 'De ce inițializăm cifra minimă cu 9 și nu cu 0?',
        answer: 'Dacă am inițializa minimul cu 0, nicio cifră dintr-un număr natural nu ar putea fi mai mică decât 0, iar programul ar răspunde greșit mereu că minimul este 0!'
      },
      {
        question: 'Câți pași face bucla while (n > 0) pentru numărul 4587?',
        answer: 'Face exact 4 pași (câte cifre are numărul): la pasul 1 n devine 458, la pasul 2 devine 45, la pasul 3 devine 4, iar la pasul 4 devine 0 și bucla se oprește.'
      }
    ],
    practicalLab: 'Scrie un program C++ care citește un număr natural n de la tastatură. Folosește o buclă while pentru a număra câte cifre pare conține numărul și afișează rezultatul.',
    missionId: 'g7_loop_b'
  },
  {
    id: 'g7_stem_a',
    slug: 'bucle-for-do-while-aplicatii-fizica-geografie',
    title: 'Bucle cu Contor for, do-while & Aplicații Interdisciplinare STEM',
    shortTitle: 'Bucle for/do & Fizică C++',
    grade: 'Clasa a VII-a',
    unit: 'Unitatea 4: Limbajul de programare (pag. 86–102)',
    manualRef: 'Manual Art Klett — OMEN 3393/2017 & OM 5420/2024',
    icon: '🔬',
    color: 'from-cyan-600 to-blue-800',
    metaDescription: 'Bucle for și do-while în C++ clasa a 7-a: bucla cu numar cunoscut de pasi, divizori, numere prime, modele grafice cu caractere si aplicatii practice in Fizica si Geografie.',
    keywords: [
      'bucla for c++ clasa 7',
      'bucla do while conditionata posterior',
      'algoritmi divizori numere prime',
      'modele grafice caractere consola c++',
      'aplicatii fizica geografie c++ viteza forta'
    ],
    competencies: [
      {
        code: '2.2',
        description: 'Construirea unor algoritmi care utilizează bucla cu contor (for) și bucla condiționată posterior (do-while).'
      },
      {
        code: '3.3',
        description: 'Implementarea algoritmilor în C++ în scopul rezolvării creative a unor probleme cu caracter interdisciplinar (Fizică, Geografie).'
      }
    ],
    theorySections: [
      {
        title: 'Bucla do ... while vs Bucla for (Cu Număr Cunoscut de Pași)',
        content: [
          'Bucla condiționată posterior (do ... while): are condiția plasată la finalul blocului de instrucțiuni: do { ... } while (conditie);',
          'Particularitate crucială: Instrucțiunile se execută garantat cel puțin o singură dată! Este folosită la validarea datelor de intrare (ex: citirea unei note până când elevul introduce o valoare corectă între 1 și 10).',
          'Bucla cu contor (for): se folosește atunci când știm dinainte de câte ori trebuie să repetăm acțiunea.',
          'Sintaxa în C++: for (initializare; conditie; pas) { ... }',
          'Exemplu: for (int i = 1; i <= n; i++) cout << i << " "; afișează toate numerele de la 1 la n.',
          'Algoritmul determinării divizorilor unui număr natural n: testăm toți posibilii divizori d de la 2 până la n/2; dacă n % d == 0, atunci d este un divizor propriu.'
        ],
        tips: 'Atenție la punctul și virgula la do-while: este singura buclă din C++ care are obligatoriu punct și virgulă după paranteza de condiție: do { ... } while (cond); !'
      },
      {
        title: 'Aplicații Interdisciplinare: Fizică & Geografie în C++',
        content: [
          'Informatica este limbajul științelor moderne! În manualul de clasa a VII-a implementăm formule reale studiate la Fizică și Geografie:',
          '1. Fizică — Mișcarea și Forțele (pag. 96–99):',
          '• Viteza medie: v = d / t (unde d este distanța parcursă în metri, iar t este timpul în secunde).',
          '• Forța de frecare la mișcarea unei sănii pe zăpadă: Ff = u * m * g (u = coeficient de frecare, m = masa în kg, g = 9.8 N/kg accelerația gravitațională).',
          '• Lucrul mecanic: L = F * d (exprimat în Jouli / J).',
          '2. Geografie — Analiză Statistică Teritorială (pag. 100–102):',
          '• Calculul altitudinii medii a unui lanț muntos: citim n măsurători altimetrice și calculăm media lor aritmetică folosind o buclă for.',
          '• Amplitudinea termică anuală: diferența dintre temperatura maximă și minimă înregistrată într-un an.'
        ],
        tips: 'Pentru formulele trigonometrice din fizică (cum ar fi cosinusul unui unghi), includem biblioteca <cmath> și convertim gradele în radiani: cos(alfa * 3.14159 / 180.0)!'
      }
    ],
    keyTerms: [
      { term: 'for (Buclă cu contor)', definition: 'Instrucțiune repetitivă care controlează execuția pe baza unei variabile contor incrementate la fiecare pas.' },
      { term: 'do ... while', definition: 'Instrucțiune repetitivă cu test final care garantează execuția corpului buclei cel puțin o dată.' },
      { term: 'Număr Prim', definition: 'Număr natural strict mai mare decât 1 care nu are alți divizori în afară de 1 și el însuși.' },
      { term: 'Lucru Mecanic (L = F × d)', definition: 'Mărime fizică egală cu produsul dintre forța exercitată asupra unui corp și distanța pe care acesta se deplasează.' },
      { term: 'Amplitudine Termică', definition: 'Diferența dintre cea mai mare și cea mai mică temperatură înregistrată într-un interval de timp.' }
    ],
    keyboardShortcuts: [
      { keys: 'Ctrl + J în Code::Blocks', action: 'Auto-completare inteligentă de cod pentru structurile for și while' },
      { keys: 'Ctrl + F', action: 'Găsirea rapidă a numelui unei variabile în program' }
    ],
    faqs: [
      {
        question: 'Cum generăm căciula lui Moș Crăciun din caractere & (pag. 94)?',
        answer: 'Folosim două bucle for imbricate: o buclă exterioară pentru fiecare linie i de la 1 la n și bucle interioare care afișează mai întâi spațiile necesare, urmate de numărul calculat de caractere &!'
      },
      {
        question: 'De ce este do-while mai potrivită decât while pentru citirea unei note?',
        answer: 'Pentru că trebuie să cerem nota de la utilizator măcar o dată înainte de a putea verifica dacă este validă!'
      }
    ],
    practicalLab: 'Scrie un program C++ interdisciplinar pentru fizică: citește masa unei sănii m (cu validare do-while ca m > 0), distanța parcursă d și coeficientul de frecare u. Calculează și afișează forța de frecare și lucrul mecanic.',
    missionId: 'g7_stem_a'
  },
  {
    id: 'g7_robot_b',
    slug: 'programarea-robotilor-virtuali-senzori',
    title: 'Roboți Virtuali Autonomi, Senzori Ultrasonici & Navigare în Labirint',
    shortTitle: 'Roboți Virtuali & Senzori',
    grade: 'Clasa a VII-a',
    unit: 'Unitatea 4: Limbajul de programare (pag. 103–108)',
    manualRef: 'Manual Art Klett — OMEN 3393/2017 & OM 5420/2024',
    icon: '🤖',
    color: 'from-emerald-500 to-green-700',
    metaDescription: 'Robotica educațională clasa a 7-a: roboți virtuali, deplasare în poligoane regulate (hexagon), senzori de distanță ultrasonici, senzori de linie și algoritmi autonomi de labirint.',
    keywords: [
      'robotica educationala clasa 7 gimnaziu',
      'programarea robotilor virtuali senzori',
      'senzor distanta ultrasonic line tracking',
      'navigare autonoma labirint obstacole',
      'traiectorie hexagon roboti virtuali'
    ],
    competencies: [
      {
        code: '1.4',
        description: 'Utilizarea unui mediu de simulare a roboților virtuali pentru implementarea algoritmilor de mișcare.'
      },
      {
        code: '3.3',
        description: 'Rezolvarea creativă a problemelor aplicative de navigație autonomă folosind informațiile culese de la senzori.'
      }
    ],
    theorySections: [
      {
        title: 'Anatomia Unui Robot: Corp, Motoare & Senzori',
        content: [
          'Ce este un robot? Un sistem automatizat compus din trei elemente fundamentale:',
          '1. Partea mecanică și structurală (șasiu, roți, carcasă).',
          '2. Actuatorii (motoare electrice care produc mișcare înainte/înapoi și rotație la unghi precis).',
          '3. Sistemul senzorial și creierul (microcontrolerul sau procesorul care rulează programul de control).',
          'Rolul senzorilor: reprezintă „simțurile” robotului prin care acesta percepe lumea din jur.',
          'Principalele tipuri de senzori studiați:',
          '• Senzorul ultrasonic de distanță: emite o undă sonoră de înaltă frecvență și măsoară timpul până la întoarcerea ecoului de la obstacol, calculând distanța în centimetri.',
          '• Senzorul optic de urmărire a liniei (Line Tracking): detectează diferența de reflexie a luminii între un traseu negru și o suprafață albă.',
          '• Senzorul de lumină și culoare: măsoară intensitatea luminoasă a mediului ambiant.'
        ],
        tips: 'Senzorii ultrasonici au o zonă minimă oarbă (sub 3-4 cm) unde unda se întoarce prea repede pentru a fi măsurată; programează întotdeauna robotul să se oprească la minim 10 cm de perete!'
      },
      {
        title: 'Traiectorii Geometrice & Algoritmul Autonom de Evitare a Coliziunilor',
        content: [
          'Deplasarea în figuri geometrice regulate (pag. 104):',
          'Pentru a programa robotul să descrie un Hexagon regulat (6 laturi egale), folosim o buclă repetitivă de 6 pași: înaintează distanța L, apoi rotește-te la unghiul exterior de 60° (deoarece 360° / 6 laturi = 60°).',
          'Algoritmul autonom de explorare a labirintului:',
          'Cât timp robotul nu a ajuns la ieșire repetă:',
          '1. Citește distanța de la senzorul ultrasonic frontal.',
          '2. Dacă distanța > 20 cm: Mergi înainte cu viteză normală.',
          '3. Dacă distanța <= 20 cm: Oprește motoarele, virează 90° spre dreapta și verifică din nou calea.',
          'Regula mâinii drepte (Wall Follower): menținând permanent contactul cu peretele din dreapta prin senzor, un robot va găsi garantat ieșirea din orice labirint simplu fără bucle insulare!'
        ],
        tips: 'Înainte de a lansa un robot fizic scump pe traseu, simularea lui într-un mediu virtual 2D sau 3D economisește timp și previne avariile prin coliziune mecanică!'
      }
    ],
    keyTerms: [
      { term: 'Robot Virtual', definition: 'Model software simulat pe calculator care reproduce cu fidelitate fizica, deplasarea și senzorii unui robot real.' },
      { term: 'Senzor Ultrasonic', definition: 'Dispozitiv electronic ce măsoară distanța până la obiecte pe baza timpului de propagare a ultrasunetelor.' },
      { term: 'Actuator', definition: 'Mecanism motor care transformă comenzile digitale din program în forță fizică și mișcare mecanică a roților.' },
      { term: 'Unghi Exterior de Rotație', definition: 'Unghiul calculat cu formula 360° / n cu care un robot trebuie să vireze la fiecare vârf al unui poligon regulat.' },
      { term: 'Evitare Autonomă a Obstacolelor', definition: 'Algoritm prin care robotul decide independent o schimbare de direcție fără nicio intervenție umană de la distanță.' }
    ],
    keyboardShortcuts: [
      { keys: 'R în Simulatorul RoboSim', action: 'Resetarea poziției robotului la punctul de start al labirintului' },
      { keys: 'Bara de Spațiu', action: 'Pornirea / Pauza simulării traseului autonom' },
      { keys: 'Săgeți Tastatură', action: 'Comutarea pe modul manual de pilotare a roverului' }
    ],
    faqs: [
      {
        question: 'Cum virează un robot pe roți la 90 de grade?',
        answer: 'Prin acționarea diferențiată a motoarelor: pentru a vira la dreapta, roata stângă se rotește înainte, iar roata dreaptă se rotește înapoi sau rămâne blocată pe loc.'
      },
      {
        question: 'Ce limbaj folosesc roboții în lumea reală?',
        answer: 'Majoritatea plăcuțelor de robotică (Arduino, ESP32, Raspberry Pi) sunt programate chiar în C++ sau Python datorită vitezei maxime de reacție a senzorilor!'
      }
    ],
    practicalLab: 'Programează în simulatorul RoboSim un rover autonom: desenează o traiectorie în formă de hexagon regulat, apoi activează senzorul ultrasonic pentru a parcurge un labirint cu 4 obstacole fără nicio ciocnire.',
    missionId: 'g7_robot_b'
  }
];
