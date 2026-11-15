import { BlogArticle } from './types';

export const BLOG_BATCH_3: BlogArticle[] = [
  {
    id: 'alegere-laptop-pc-scoala-gimnaziu-ram-ssd-cpu-componente',
    category: 'parents-teachers',
    gradeTagRo: 'Clasele V–VIII · Părinți',
    gradeTagEn: 'Grades 5–8 · Parents',
    publishedAt: '2026-11-15',
    updatedAt: '2026-11-15',
    featured: true,
    ro: {
      slug: 'alegere-laptop-pc-scoala-gimnaziu-ram-ssd-cpu-componente',
      title: 'Ce laptop sau PC alegi pentru școală în gimnaziu (V–VIII): Procesor, RAM, SSD NVMe, placă video & ergonomie',
      metaTitle: 'Alegere laptop / PC pentru școală (V–VIII): CPU, RAM, SSD | ArkyEdu',
      metaDescription: 'Ghid practic pentru părinți și elevi (V–VIII): cum alegi un laptop sau PC bun pentru TIC, Code::Blocks C++, Scratch, Excel și proiecte școlare fără să plătești inutil pe marketing.',
      keywords: 'ce laptop sa cumpar pentru scoala gimnaziu, cerinte laptop tic programare copii, 8gb vs 16gb ram scoala, ssd nvme vs hdd diferenta, arhitectura calculator hardware clasa 5, ergonomie birou elev',
      breadcrumbLabel: 'Alegere Laptop / PC Școală',
      categoryLabel: 'Hardware & Părinți',
      readTime: '10 min citire',
      tldrTitle: 'Răspuns Rapid (TL;DR)',
      tldr: 'Pentru gimnaziu (Word, Excel, PowerPoint, browser cu 15 tab-uri, Scratch 3.0, C++ în Code::Blocks și Arduino IDE), specificația optimă în 2026 este: procesor Intel Core i3/i5 (gen. 12+) sau AMD Ryzen 3/5 (seria 5000/7000+), minimum 16 GB RAM (sau 8 GB cu posibilitate de upgrade), stocare SSD NVMe de 512 GB (fără HDD mecanic!), ecran IPS Full HD mat (1920×1080) și tastatură cu layout complet.',
      intro: 'În fiecare toamnă, părinții întreabă ce laptop sau calculator merită cumpărat pentru un elev din clasele V–VIII fără a cheltui o avere pe laptopuri de gaming grele, dar și fără a lua un model lent care se blochează după 6 luni. Folosind exact noțiunile de arhitectură hardware studiate la TIC în clasa a V-a (CPU, RAM, stocare, periferice și ergonomie), iată ghidul tehnic obiectiv de decizie.',
      sections: [
        {
          id: 'ce-conteaza-cu-adevarat-hardware',
          heading: '1. Cele 4 componente care decid viteza reală a calculatorului (CPU, RAM, SSD, Ecran)',
          paragraphs: [
            'Marketingul pune adesea pe etichetă „512 GB” sau un nume complicat de procesor ca să ascundă memorii lente sau ecrane slabe. În realitate, experiența zilnică a copilului la teme și orele de TIC depinde de echilibrul dintre 4 piese fundamentale:'
          ],
          table: {
            caption: 'Specificații recomandate pentru gimnaziu (TIC, C++, Office, Web & Robotică)',
            headers: ['Componentă', 'Minim acceptabil', 'Recomandat (rezistă 4–5 ani)', 'De ce contează la școală'],
            rows: [
              ['Procesor (CPU)', 'Intel Core i3 (gen. 12+) / Ryzen 3 (5xxx+)', 'Intel Core i5 / AMD Ryzen 5 (6+ nuclee)', 'Compilează instant C++, rulează simulatoare Web și Google Meet fără sacadări.'],
              ['Memorie RAM', '8 GB DDR4/DDR5', '16 GB RAM (dual-channel)', 'Windows + Chrome cu 12 tab-uri + Word + Scratch consumă lejer 7–9 GB RAM!'],
              ['Stocare', '256 GB SSD NVMe', '512 GB SSD NVMe (M.2)', 'SSD-ul este de 10–30× mai rapid decât vechiul HDD; Windows pornește în 10 secunde.'],
              ['Ecran (Display)', '14"–15.6" IPS 1920×1080 Full HD', 'IPS Full HD Anti-Glare (mat) ~300 niți', 'Evită ecranele TN ieftine (culori șterse) și pe cele lucioase care obosesc ochii.'],
              ['Placă video (GPU)', 'Grafică integrată Intel Iris / Radeon', 'Integrată modernă (sau RTX entry pt 3D avansat)', 'Pentru TIC, C++, Excel, HTML și Arduino nu ai nevoie de placă video dedicată scumpă.']
            ]
          },
          callout: {
            title: 'Capcana procesoarelor foarte ieftine (Celeron / Athlon vechi + 4 GB RAM)',
            text: 'Un laptop nou foarte ieftin cu 4 GB RAM și stocare eMMC de 64–128 GB devine frustrant de lent din prima lună după actualizările de sistem. Un laptop business recondiționat (ex: Lenovo ThinkPad / Dell Latitude / HP EliteBook) cu i5/Ryzen 5, 16 GB RAM și SSD NVMe este adesea mult mai rapid și mai rezistent în același buget!',
            variant: 'warning'
          }
        },
        {
          id: 'laptop-vs-desktop-si-porturi',
          heading: '2. Laptop vs. Desktop PC + Porturi necesare pentru robotică și școală',
          paragraphs: [
            'Un desktop PC (unitate centrală + monitor mare de 24") oferă ergonomie excelentă acasă și răcire mai bună la același preț, dar nu poate fi luat la prezentările pe echipe sau la cercurile de robotică. Un laptop de 14"–15.6" (sub 1,7 kg) conectat acasă la un monitor extern și un mouse separat îmbină ambele avantaje.',
            'Pentru proiectele de clasa a VII-a și a VIII-a (prezentări pe proiector și Arduino Uno), verifică să existe port HDMI (pentru proiector/monitor) și cel puțin două porturi USB-A clasice (sau un adaptor USB-C) pentru cablul USB al plăcii Arduino și stick-urile de memorie.'
          ]
        },
        {
          id: 'reguli-ergonomie-sanatate-elev',
          heading: '3. Ergonomia postului de lucru (Clasa a V-a): Postură, lumină și regula 20-20-20',
          paragraphs: [
            'Chiar și cel mai performant laptop obosește copilul dacă este folosit pe canapea cu gâtul aplecat. Materia de TIC din clasa a V-a pune accent explicit pe sănătatea la calculator:'
          ],
          numberedSteps: [
            'Înălțimea ecranului: Marginea de sus a monitorului trebuie să fie la nivelul ochilor (pe un laptop pune un suport sau câteva cărți dedesubt și folosește o tastatură + mouse extern!).',
            'Unghiul de 90°: Spatele drept sprijinit de spătar, coatele la 90° pe birou și tălpile sprijinite complet pe podea sau suport.',
            'Regula 20-20-20 pentru ochi: La fiecare 20 de minute de lucru, copilul privește timp de 20 de secunde un obiect aflat la minimum 6 metri distanță (20 de picioare), pe fereastră.',
            'Iluminare corectă: Lumina naturală trebuie să vină din lateral față de monitor (nu din spatele ecranului și nici să se reflecte direct în el).'
          ]
        },
        {
          id: 'unitati-stocare-biti-octeti-ghid',
          heading: '4. Recapitulare rapidă TIC: Unități de măsură (bit, Byte, KB, MB, GB, TB)',
          paragraphs: [
            'Când compari 16 GB RAM cu 512 GB SSD sau viteze de Internet în Mbps, reține diferența fundamentală dintre bit (b mic — pentru rețele) și Byte / octet (B mare = 8 biți — pentru fișiere și memorie):'
          ],
          codeBlock: {
            title: 'Tabel conversii rapide pentru teste și alegere hardware',
            language: 'text',
            code: `1 Byte (B)       = 8 biți (suficient pentru 1 caracter ASCII, ex: 'A')
1 Kilobyte (KB)  = 1.024 Bytes  (~ o pagină simplă de text)
1 Megabyte (MB)  = 1.024 KB     (~ o fotografie clară sau 1 minut MP3)
1 Gigabyte (GB)  = 1.024 MB     (~ memoria RAM sau un film HD)
1 Terabyte (TB)  = 1.024 GB     (~ capacitatea unui SSD mare de arhivă)

Atenție la viteza Wi-Fi: 100 Mbps (megabiți/sec) ÷ 8 = max ~12.5 MB/sec descărcare reală!`,
            caption: 'Împărțirea la 8 transformă instantaneu viteza din reclamele de Internet (Mbps) în viteza reală de descărcare (MB/s).'
          }
        }
      ],
      checklistTitle: 'Checklist rapid înainte de achiziție sau configurare acasă',
      checklist: [
        'Are minimum 16 GB RAM (sau 8 GB cu slot liber de upgrade) și SSD NVMe (niciodată doar HDD mecanic).',
        'Ecranul este Full HD (1920×1080) cu strat anti-reflexie (mat), nu rezoluție HD 1366×768.',
        'Include port HDMI și USB compatibile pentru proiectorul de la școală și cabluri Arduino.',
        'Copilul are un mouse separat (ideal ergonomic) și o postură corectă la birou, fără stat cocoșat.'
      ],
      faqs: [
        {
          question: 'Ajung 8 GB RAM sau merită 16 GB RAM pentru un elev de gimnaziu?',
          answer: 'Dacă bugetul permite, 16 GB RAM sunt investiția cea mai înțeleaptă pentru 4–5 ani (clasele V–VIII și început de liceu). Sistemele moderne, browserul cu mai multe tab-uri și aplicațiile educaționale depășesc ușor 8 GB RAM în utilizarea zilnică.'
        },
        {
          question: 'Are nevoie copilul de laptop scump de gaming pentru informatică și TIC?',
          answer: 'Nu. Pentru programa de gimnaziu (Scratch, Code::Blocks C++, Word, Excel, PowerPoint, HTML5, Arduino IDE și platforma ArkyEdu), o placă video integrată modernă (Intel Iris Xe / AMD Radeon) este complet suficientă și oferă baterie mai bună și greutate mai mică în ghiozdan.'
        },
        {
          question: 'Ce este mai important la viteză: procesorul scump sau SSD-ul?',
          answer: 'Diferența de la HDD mecanic la SSD NVMe este uriașă (pornire în 10 secunde vs. 2 minute). Nu cumpăra niciun calculator fără SSD, indiferent ce procesor scrie pe etichetă.'
        },
        {
          question: 'Funcționează platforma ArkyEdu și pe laptopuri mai vechi sau Chromebook/tabletă?',
          answer: 'Da! ArkyEdu rulează 100% în browser (inclusiv simulatoarele C++, Excel, HTML5, Arduino și jocurile arcade) fără instalări grele, fiind optimizată și pentru PC-urile din laboratoarele școlare.'
        },
        {
          question: 'Unde pot copiii învăța practic componentele calculatorului și asamblarea unui PC?',
          answer: 'În modulul Hardware & Ergonomie (Clasa a V-a) de pe ArkyEdu, elevii asamblează virtual unitatea centrală (CPU, RAM, placă de bază, sursă, SSD) și pot testa simulatorul PC Builder în sala Arcade.'
        }
      ],
      internalLinksTitle: 'Exersează Hardware, Sisteme & Ergonomie pe ArkyEdu',
      internalLinks: [
        {
          label: 'Hardware, Arhitectură & Ergonomie (Clasa a V-a)',
          url: '/cursuri/hardware/',
          missionId: 'hardware',
          description: 'Asamblează virtual unitatea centrală și exersează biții/octeții și ergonomia.'
        },
        {
          label: 'Sisteme de Operare, Fișiere & Extensii (Clasa a V-a)',
          url: '/cursuri/fisiere-so/',
          missionId: 'files',
          description: 'Înțelege structura arborescentă de foldere și tipurile de fișiere.'
        },
        {
          label: 'PC Builder Simulator & Byte Slider (Arcade TIC)',
          url: '/arcade/',
          targetView: 'arcade',
          description: 'Construiește un PC pas cu pas și exersează conversiile KB/MB/GB.'
        },
        {
          label: 'Comparație Gratuit vs. Școli Private',
          url: '/comparatie-scoli-private/',
          description: 'Economisește 4.500+ lei/an investind inteligent în educația copilului.'
        }
      ]
    },
    en: {
      slug: 'choosing-student-laptop-pc-middle-school-cpu-ram-ssd-guide',
      title: 'Choosing a Student Laptop or PC for Middle School (Grades 5–8): CPU, RAM, NVMe SSD & Ergonomics',
      metaTitle: 'Best Student Laptop & PC Specs for Grades 5–8 (CPU, RAM, SSD) | ArkyEdu',
      metaDescription: 'Practical parents & students buying guide for ICT and coding: Intel i3/i5 vs Ryzen, 8GB vs 16GB RAM, NVMe SSD vs HDD, ports for school projects & Arduino, and healthy desk ergonomics.',
      keywords: 'best laptop specs middle school students, 8gb vs 16gb ram student laptop, nvme ssd vs hdd explained kids, student coding laptop requirements, computer hardware basics grade 5, 20-20-20 eye rule',
      breadcrumbLabel: 'Student Laptop & PC Specs',
      categoryLabel: 'Hardware & Parents',
      readTime: '10 min read',
      tldrTitle: 'Quick Answer (TL;DR)',
      tldr: 'For middle school ICT and coding (Docs, Excel, browser research, Scratch 3.0, C++, and Arduino IDE), the sweet-spot spec is an Intel Core i3/i5 (12th gen+) or AMD Ryzen 3/5 (5000/7000+), 16 GB RAM (or upgradeable 8 GB), a 512 GB NVMe SSD (avoid mechanical HDDs), a matte 1080p IPS display, and standard USB/HDMI ports.',
      intro: 'Every school year, parents face confusing laptop spec sheets—debating whether a student needs an expensive gaming rig or if a budget model is enough. Using the exact computer hardware principles taught in Grade 5 ICT (CPU, RAM, storage, peripherals, and ergonomics), this guide separates marketing noise from specs that last all four years of middle school.',
      sections: [
        {
          id: 'four-core-hardware-specs',
          heading: '1. The Four Components That Actually Decide Daily Speed (CPU, RAM, SSD, Screen)',
          paragraphs: [
            'Retail stickers often highlight large storage numbers to hide sluggish RAM or dim screens. Everyday speed for school assignments, coding tools, and browser simulations comes down to four balanced parts:'
          ],
          table: {
            caption: 'Recommended Student Hardware Tiers (ICT, C++, Office, Web & Robotics)',
            headers: ['Component', 'Minimum Acceptable', 'Recommended (4–5 Year Lifespan)', 'Why It Matters for School'],
            rows: [
              ['Processor (CPU)', 'Intel Core i3 (12th+) / Ryzen 3 (5000+)', 'Intel Core i5 / AMD Ryzen 5 (6+ cores)', 'Compiles C++, runs web labs and video calls smoothly.'],
              ['Memory (RAM)', '8 GB DDR4/DDR5', '16 GB RAM (dual-channel)', 'OS + 12 browser tabs + Docs + Scratch easily consume 7–9 GB.'],
              ['Storage Drive', '256 GB NVMe SSD', '512 GB NVMe SSD (M.2)', '10–30× faster than spinning HDDs; boots and saves projects in seconds.'],
              ['Display Panel', '14"–15.6" Full HD IPS (1920×1080)', 'Matte Anti-Glare IPS Full HD', 'Avoid washed-out 1366×768 TN screens that strain young eyes.'],
              ['Graphics (GPU)', 'Modern Integrated (Iris Xe / Radeon)', 'Modern Integrated (or entry GPU for 3D)', 'ICT, Scratch, C++, Excel, HTML5, and Arduino do not require pricey gaming GPUs.']
            ]
          },
          callout: {
            title: 'Watch Out for 4 GB RAM / Celeron Traps',
            text: 'Ultra-cheap laptops with 4 GB RAM and slow 64 GB eMMC flash struggle immediately after OS updates. A refurbished business laptop (ThinkPad, Latitude, EliteBook) with an i5/Ryzen 5, 16 GB RAM, and NVMe SSD often outlasts budget plastic models at the same price.',
            variant: 'warning'
          }
        },
        {
          id: 'laptop-vs-desktop-ports',
          heading: '2. Laptop vs. Desktop & Essential Ports for Class Presentations & Arduino',
          paragraphs: [
            'A desktop PC paired with a 24-inch monitor offers superior desk ergonomics at a lower cost, while a lightweight 14"–15.6" laptop travels easily to group projects and robotics clubs. Connecting a laptop at home to an external mouse and raised stand gives you the best of both worlds.',
            'Check for an HDMI port (classroom projectors) and at least two USB-A ports (or a reliable USB-C hub) so plugging in Arduino boards and flash drives never needs emergency adapters.'
          ]
        },
        {
          id: 'student-ergonomics-rules',
          heading: '3. Healthy Study Setup: Desk Posture, Lighting & the 20-20-20 Rule',
          paragraphs: [
            'Even the fastest computer hurts focus if used hunched on a sofa. Grade 5 ICT specifically teaches healthy workspace habits:'
          ],
          numberedSteps: [
            'Eye-Level Screen: Keep the top bezel of the monitor level with the student’s eyes (raise laptops on a stand/books when using an external keyboard and mouse).',
            '90-Degree Rule: Back supported against the chair, elbows bent ~90° at keyboard height, and feet flat on the floor.',
            '20-20-20 Eye Break: Every 20 minutes, look at something at least 20 feet (~6 meters) away for 20 seconds to relax eye focus.',
            'Side Lighting: Position windows beside the screen rather than directly behind or facing it to eliminate glare.'
          ]
        },
        {
          id: 'bits-bytes-quick-reference',
          heading: '4. Quick Storage & Speed Cheat Sheet (Bits vs. Bytes)',
          paragraphs: [
            'Understanding why a 100 Mbps internet plan downloads files at ~12.5 MB/s starts with knowing that 1 Byte (B) = 8 bits (b):'
          ],
          codeBlock: {
            title: 'Storage & Bandwidth Units Reference',
            language: 'text',
            code: `1 Byte (B)       = 8 bits (holds 1 ASCII character, e.g. 'A')
1 Kilobyte (KB)  = 1,024 Bytes (~ a short plain-text page)
1 Megabyte (MB)  = 1,024 KB    (~ a crisp photo or 1 min MP3)
1 Gigabyte (GB)  = 1,024 MB    (~ RAM capacity or HD video)
1 Terabyte (TB)  = 1,024 GB    (~ large archive SSD)

Internet math: Divide Mbps by 8 for real MB/s download speed (100 Mbps ÷ 8 = 12.5 MB/s).`,
            caption: 'Dividing advertised megabits per second by 8 reveals real megabytes per second.'
          }
        }
      ],
      checklistTitle: 'Smart Student Computer Checklist',
      checklist: [
        '16 GB RAM (or 8 GB upgradeable) paired with an NVMe SSD—never a slow HDD alone.',
        'Matte 1080p Full HD IPS screen for crisp text without reflections.',
        'Built-in HDMI and USB ports ready for projectors and Arduino robotics.',
        'Dedicated mouse and proper eye-level desk posture at home.'
      ],
      faqs: [
        {
          question: 'Is 8 GB RAM enough, or should parents choose 16 GB RAM for middle school?',
          answer: '16 GB RAM is strongly recommended if budget allows, ensuring smooth performance across Grades 5–8 and into high school as browsers and modern OS updates consume more memory.'
        },
        {
          question: 'Does a middle school student need a dedicated gaming GPU for coding?',
          answer: 'No. Scratch, C++ Code::Blocks, Excel, HTML5, Arduino IDE, and ArkyEdu run effortlessly on modern integrated graphics (Intel Iris Xe / AMD Radeon), giving longer battery life and lighter weight.'
        },
        {
          question: 'Which upgrade impacts speed more: an NVMe SSD or a slightly faster CPU?',
          answer: 'An NVMe SSD makes the biggest night-and-day difference in boot times, app launches, and responsiveness—never buy a computer with only a spinning mechanical hard drive.'
        },
        {
          question: 'Does ArkyEdu work on older school PCs, Chromebooks, or tablets?',
          answer: 'Yes. ArkyEdu runs completely inside modern web browsers with zero heavy local installations, making it ideal for school labs, Chromebooks, and family laptops.'
        },
        {
          question: 'Where can students practice assembling a PC and converting storage units?',
          answer: 'Grade 5 Hardware & Ergonomics on ArkyEdu lets kids assemble a virtual PC step-by-step, reinforced by PC Builder Simulator and Byte Slider in the Arcade.'
        }
      ],
      internalLinksTitle: 'Practice Hardware, OS & Conversions on ArkyEdu',
      internalLinks: [
        {
          label: 'Computer Hardware & Ergonomics (Grade 5)',
          url: '/cursuri/hardware/',
          missionId: 'hardware',
          description: 'Assemble virtual CPU, RAM, motherboard & SSD components and practice ergonomics.'
        },
        {
          label: 'Operating Systems & File Trees (Grade 5)',
          url: '/cursuri/fisiere-so/',
          missionId: 'files',
          description: 'Master folder hierarchies, paths, and file extensions.'
        },
        {
          label: 'PC Builder Simulator & Byte Slider (Arcade)',
          url: '/arcade/',
          targetView: 'arcade',
          description: 'Build custom PCs and master KB/MB/GB conversions.'
        },
        {
          label: 'Free vs. Private Coding Academies Guide',
          url: '/comparatie-scoli-private/',
          description: 'See how families save 4,500+ RON/year on structured ICT & coding.'
        }
      ]
    }
  },
  {
    id: 'prezentari-powerpoint-regula-6x6-modelare-3d-scoala',
    category: 'excel-office',
    gradeTagRo: 'Clasele V–VII',
    gradeTagEn: 'Grades 5–7',
    publishedAt: '2026-11-15',
    updatedAt: '2026-11-15',
    featured: false,
    ro: {
      slug: 'prezentari-powerpoint-regula-6x6-modelare-3d-scoala',
      title: 'Prezentări PowerPoint & Google Slides de nota 10 (Clasa a VI-a): Regula 6×6, contrast, animații și modele 3D',
      metaTitle: 'Prezentări PowerPoint Clasa 6: Regula 6x6, Design & Paint 3D | ArkyEdu',
      metaDescription: 'Cum faci o prezentare PowerPoint sau Google Slides profesionistă la școală (V–VII): regula 6×6, ierarhia vizuală, contrast WCAG, tranziții curate și integrare modele 3D.',
      keywords: 'regula 6x6 powerpoint ce inseamna, cum fac o prezentare powerpoint reusita clasa 6, prezentari google slides proiect scoala, paint 3d modele in powerpoint, animatii vs tranzitii powerpoint',
      breadcrumbLabel: 'Prezentări PowerPoint & Regula 6×6',
      categoryLabel: 'Prezentări & Grafică 3D',
      readTime: '8 min citire',
      tldrTitle: 'Răspuns Rapid (TL;DR)',
      tldr: 'O prezentare școlară reușită respectă Regula 6×6 (maximum 6 idei scurte pe diapozitiv, maximum 6 cuvinte pe rând), folosește un font mare (minim 24 pt pentru text, 36–44 pt pentru titlu), asigură contrast puternic între fundal și text, folosește o singură tranziție discretă (Fade/Push) și nu pune pe slide-uri tot discursul — slide-ul susține prezentatorul, nu îl citește în locul lui.',
      intro: 'De câte ori ai văzut la școală un proiect PowerPoint cu slide-uri pline de paragrafe copiate cu font de 12, text galben pe fundal alb și 15 animații care se învârt simultan? În clasa a VI-a la TIC înveți exact regulile de design multimedia care transformă o prezentare aglomerată într-una clară, memorabilă și convingătoare — inclusiv integrarea obiectelor create în Paint 3D.',
      sections: [
        {
          id: 'regula-6x6-si-ierarhie',
          heading: '1. Regula 6×6 și regula fontului de 24 pt: De ce „mai puțin text = notă mai mare”',
          paragraphs: [
            'Diapozitivul (slide-ul) NU este o pagină de Word sau un referat tipărit! Când publicul citește 15 rânduri mici pe ecran, nu te mai ascultă pe tine. În schimb, aplică cele trei principii de aur predate la TIC:'
          ],
          table: {
            caption: 'Reguli de design vizual pentru prezentări PowerPoint & Google Slides',
            headers: ['Criteriu', 'Așa NU (Greșeala clasică)', 'Așa DA (Standard profesional)'],
            rows: [
              ['Cantitate text', 'Paragrafe lungi copiate de pe Wikipedia.', 'Regula 6×6: max. 6 puncte/slide × max. 6 cuvinte/punct.'],
              ['Dimensiune font', 'Font 11–14 pt (ilizibil din ultima bancă).', 'Titlu 36–44 pt; conținut minim 22–24 pt; max. 2 fonturi.'],
              ['Contrast culori', 'Text verde deschis pe fundal albastru deschis.', 'Text foarte închis pe fundal alb/deschis SAU alb pe fundal bleumarin/închis.'],
              ['Imagini & 3D', 'Poze întinse/deformate cu filigran (watermark).', 'Imagini HD decupate proporțional (Shift + colț) sau modele 3D curate.'],
              ['Tranziții & Animații', 'Fiecare slide altă explozie + sunete puternice.', 'O singură tranziție subtilă (Fade/Morph) în toată prezentarea.']
            ]
          },
          callout: {
            title: 'Diferența dintre Tranziție și Animație la testul de TIC',
            text: 'Tranziția se aplică trecerii DINTRE două diapozitive întregi (slide 1 -> slide 2). Animația se aplică unui singur obiect DE PE un diapozitiv (o imagine, un titlu, o săgeată — de tip Entrance, Emphasis sau Exit).',
            variant: 'tip'
          }
        },
        {
          id: 'structura-ideala-6-slideuri',
          heading: '2. Structura ideală în 6 diapozitive pentru orice proiect școlar',
          paragraphs: [
            'Indiferent dacă prezinți despre Energie Regenerabilă, Ecosisteme sau Securitate Cibernetică, o scheletare în 6 slide-uri îți garantează ritm și claritate:'
          ],
          numberedSteps: [
            'Slide 1 — Coperta: Titlu scurt de impact, subtitlu, numele tău, clasa și o imagine sugestivă.',
            'Slide 2 — Cuprins / Obiectiv: Cele 3–4 întrebări la care răspunde prezentarea.',
            'Slide 3–4 — Ideile principale + Vizual: Câte o idee mare pe slide, susținută de o diagramă SmartArt, grafic sau obiect 3D din Paint 3D.',
            'Slide 5 — Exemplu practic / Studiu de caz: Cum funcționează în viața reală (cu cifre clare).',
            'Slide 6 — Concluzie, Surse & Întrebări: 3 idei de reținut + bibliografia site-urilor consultate.'
          ]
        },
        {
          id: 'paint-3d-si-presenter-view',
          heading: '3. Integrarea modelelor Paint 3D și trucul „Presenter View” (Notele vorbitorului)',
          paragraphs: [
            'Unde pui explicațiile detaliate dacă slide-urile trebuie să rămână aerisite conform regulii 6×6? În zona „Notes” (Notele vorbitorului) de sub fiecare slide! Când proiectezi prezentarea cu Alt + F5 (Presenter View), publicul vede doar slide-ul curat pe proiector, iar tu vezi pe laptop textul de sprijin și cronometrul.',
            'În clasa a VI-a poți exporta creațiile din Paint 3D în format .glb sau PNG cu fundal transparent și le poți roti 360° direct în PowerPoint (Insert -> 3D Models -> This Device), explicând părțile unui obiect tridimensional.'
          ]
        }
      ],
      checklistTitle: 'Checklist înainte să urci pe catedră să prezinți',
      checklist: [
        'Fiecare slide respectă Regula 6×6 și are font de cel puțin 22–24 pt.',
        'Am verificat contrastul textului de la 3 metri distanță față de ecran.',
        'Nicio imagine nu este turtită și am citat sursele pe ultimul slide.',
        'Am salvat prezentarea și ca PDF de rezervă pe stick/Cloud în caz că pe calculatorul clasei lipsește PowerPoint.'
      ],
      faqs: [
        {
          question: 'Ce înseamnă Regula 6×6 într-o prezentare PowerPoint?',
          answer: 'Regula 6×6 recomandă să nu depășești 6 puncte (bullet points) pe un singur slide și maximum 6 cuvinte pe fiecare rând, pentru ca publicul să scaneze rapid ideea principală și să te asculte pe tine.'
        },
        {
          question: 'Care este diferența dintre tranziții și animații în PowerPoint?',
          answer: 'Tranzițiile controlează efectul vizual la trecerea de la un slide la altul, în timp ce animațiile controlează cum intră, se evidențiază sau ies elementele individuale (texte, poze, forme) de pe același slide.'
        },
        {
          question: 'De ce este recomandat să păstrez o copie PDF a prezentării?',
          answer: 'Dacă pe calculatorul din clasă este altă versiune de Office sau LibreOffice Impress, fonturile și animațiile se pot decala. Exportul PDF garantează că poți derula prezentarea curat pe orice sistem.'
        },
        {
          question: 'Cum păstrez proporțiile unei poze când o micșorez în PowerPoint sau Slides?',
          answer: 'Trage ÎNTOTDEAUNA de colțurile imaginii (niciodată de mijlocul marginilor de sus/jos sau stânga/dreapta!), pentru a nu turti sau lăți artificial fotografia.'
        },
        {
          question: 'Unde pot exersa interactiv regulile PowerPoint și modelarea 3D pentru clasa a VI-a?',
          answer: 'Pe ArkyEdu ai modulele dedicate Prezentări PowerPoint & Slides, Design Diapozitive & Tranziții și Grafică 3D în Paint 3D (Clasa a VI-a), 100% gratuite.'
        }
      ],
      internalLinksTitle: 'Exersează Prezentări & Grafică 3D pe ArkyEdu',
      internalLinks: [
        {
          label: 'Prezentări PowerPoint & Regula 6×6 (Clasa a VI-a)',
          url: '/cursuri/prezentari-slides/',
          missionId: 'g6_presentation1',
          description: 'Învață structura optimă a slide-urilor și ierarhia vizuală.'
        },
        {
          label: 'Design Diapozitive, SmartArt & Tranziții (Clasa a VI-a)',
          url: '/cursuri/prezentari-slides-2/',
          missionId: 'g6_presentation2',
          description: 'Animații curate, SmartArt și susținere publică profesionistă.'
        },
        {
          label: 'Modelare 3D & Sinteză RGB în Paint 3D (Clasa a VI-a)',
          url: '/cursuri/paint-3d/',
          missionId: 'g6_paint3d',
          description: 'Explorează pixeli, rezoluție și obiecte 3D pentru proiecte.'
        },
        {
          label: 'RGB Pixel Master (Arcade TIC)',
          url: '/arcade/',
          targetView: 'arcade',
          description: 'Experimentează culorile RGB și contrastul vizual prin joc.'
        }
      ]
    },
    en: {
      slug: 'powerpoint-6x6-rule-school-presentations-paint-3d-guide',
      title: 'A+ PowerPoint & Google Slides Presentations (Grades 5–7): The 6×6 Rule, Contrast, Animations & 3D Models',
      metaTitle: 'School PowerPoint Guide: 6x6 Rule, Slide Design & 3D Models | ArkyEdu',
      metaDescription: 'How to design crisp school presentations in PowerPoint or Google Slides: the 6x6 rule, minimum 24 pt font sizing, high-contrast palettes, clean transitions, Presenter View, and 3D models.',
      keywords: 'powerpoint 6x6 rule explained, school presentation design tips kids, transitions vs animations powerpoint, presenter view notes shortcut, paint 3d models powerpoint, grade 6 ict',
      breadcrumbLabel: 'PowerPoint & The 6×6 Rule',
      categoryLabel: 'Slides & 3D Design',
      readTime: '8 min read',
      tldrTitle: 'Quick Answer (TL;DR)',
      tldr: 'An A+ school deck follows the 6×6 Rule (no more than 6 bullets per slide, roughly 6 words per line), enforces large readable type (24 pt+ body, 36–44 pt titles), uses high text-to-background contrast, sticks to one subtle transition (Fade/Morph), and keeps spoken details inside Speaker Notes instead of crowding slides.',
      intro: 'Everyone has sat through a school presentation packed with tiny 12-point paragraphs pasted straight from an encyclopedia, unreadable yellow text, and dizzying spin animations on every bullet. In Grade 6 ICT, students learn visual communication rules that make slides crisp, memorable, and easy to follow—including embedding custom 3D assets from Paint 3D.',
      sections: [
        {
          id: 'six-by-six-visual-hierarchy',
          heading: '1. The 6×6 Rule & 24 pt Minimum: Why Fewer Words Win Higher Grades',
          paragraphs: [
            'A slide deck is NOT a printed essay! If the audience has to read 15 dense lines off the projector, they stop listening to you. Apply these five core ICT slide rules instead:'
          ],
          table: {
            caption: 'Slide Design Standards for PowerPoint & Google Slides',
            headers: ['Design Element', 'Common Mistake', 'Pro Standard'],
            rows: [
              ['Text Density', 'Full copied paragraphs pasted on slides.', '6×6 Rule: max 6 bullets per slide × ~6 words per line.'],
              ['Font Size', '11–14 pt text unreadable from the back row.', 'Titles 36–44 pt; body 24 pt minimum; max 2 font families.'],
              ['Color Contrast', 'Light green text on pale blue gradients.', 'Dark charcoal text on crisp light slides—or pure white on deep navy.'],
              ['Images & 3D', 'Stretched photos with stock watermarks.', 'Proportional resizing (drag corners!) or clean transparent PNG/3D models.'],
              ['Transitions', 'Wild explosions + loud sound effects per slide.', 'One calm transition (Fade or Morph) across the entire deck.']
            ]
          },
          callout: {
            title: 'Transitions vs. Animations on ICT Quizzes',
            text: 'A Transition controls how you move BETWEEN two whole slides (Slide 1 -> Slide 2). An Animation controls how an individual object ON a slide enters, emphasizes, or exits.',
            variant: 'tip'
          }
        },
        {
          id: 'six-slide-story-arc',
          heading: '2. A Foolproof 6-Slide Structure for Any School Topic',
          paragraphs: [
            'Whether presenting Renewable Energy, Ecosystems, or Cybersecurity, a tight 6-slide outline keeps timing crisp:'
          ],
          numberedSteps: [
            'Slide 1 — Cover: Short punchy title, subtitle, your name/grade, and one bold visual.',
            'Slide 2 — Roadmap: The 3–4 key questions your talk answers.',
            'Slides 3–4 — Core Concepts + Visuals: One main idea per slide backed by a SmartArt diagram, chart, or Paint 3D object.',
            'Slide 5 — Real-World Case Study: Concrete numbers or live demo showing why it matters.',
            'Slide 6 — Takeaways & Sources: Three closing bullets plus cited references.'
          ]
        },
        {
          id: 'paint-3d-and-presenter-view',
          heading: '3. Using Speaker Notes (Presenter View) & Custom 3D Objects',
          paragraphs: [
            'Where do detailed explanations go if slides stay short under the 6×6 rule? Inside the Speaker Notes pane beneath each slide! Launching Presenter View (Alt+F5) shows clean visuals on the classroom projector while displaying your notes and timer privately on your laptop.',
            'Students can also export Paint 3D creations as .glb files or transparent PNGs and insert them via Insert -> 3D Models to rotate objects live while explaining them.'
          ]
        }
      ],
      checklistTitle: 'Pre-Talk Slide Deck Checklist',
      checklist: [
        'Every slide follows the 6×6 rule with 24 pt+ readable body text.',
        'High color contrast verified from across the room.',
        'Images resized strictly from corner handles (never squished) and sources cited.',
        'Backup PDF copy saved on USB/cloud in case the classroom PC lacks PowerPoint.'
      ],
      faqs: [
        {
          question: 'What is the 6×6 rule in PowerPoint presentations?',
          answer: 'The 6×6 rule caps each slide at up to 6 bullet points with roughly 6 words per line so audiences grasp key ideas quickly and focus on the speaker.'
        },
        {
          question: 'What is the difference between slide transitions and animations?',
          answer: 'Transitions animate the switch from one slide to the next, whereas animations move or highlight individual elements (titles, shapes, photos) within a single slide.'
        },
        {
          question: 'Why save a backup PDF export of a presentation?',
          answer: 'Different computers or office suites can scramble custom fonts and layouts. A PDF backup guarantees your slides display reliably on any classroom computer.'
        },
        {
          question: 'How do you keep an image from looking stretched when resizing?',
          answer: 'Always drag from a corner handle rather than the side or top edge handles so PowerPoint or Slides preserves the original aspect ratio.'
        },
        {
          question: 'Where can kids practice PowerPoint design and 3D graphics interactively?',
          answer: 'ArkyEdu provides interactive Grade 6 modules for Slides Structure, Transitions & SmartArt, and Paint 3D Modeling—completely free.'
        }
      ],
      internalLinksTitle: 'Practice Presentations & 3D Graphics on ArkyEdu',
      internalLinks: [
        {
          label: 'PowerPoint & Slides Structure (Grade 6)',
          url: '/cursuri/prezentari-slides/',
          missionId: 'g6_presentation1',
          description: 'Master the 6×6 rule, layout balance, and visual storytelling.'
        },
        {
          label: 'Slide Design, SmartArt & Transitions (Grade 6)',
          url: '/cursuri/prezentari-slides-2/',
          missionId: 'g6_presentation2',
          description: 'Practice tasteful transitions, animations, and public delivery.'
        },
        {
          label: '3D Modeling & RGB in Paint 3D (Grade 6)',
          url: '/cursuri/paint-3d/',
          missionId: 'g6_paint3d',
          description: 'Understand pixels, RGB color mixing, and 3D objects.'
        },
        {
          label: 'RGB Pixel Master (ICT Arcade)',
          url: '/arcade/',
          targetView: 'arcade',
          description: 'Explore RGB colors and visual contrast in a retro arcade challenge.'
        }
      ]
    }
  },
  {
    id: 'cursuri-programare-copii-gratuit-vs-academii-private-logiscool',
    category: 'parents-teachers',
    gradeTagRo: 'Părinți · 10–15 ani',
    gradeTagEn: 'Parents · Ages 10–15',
    publishedAt: '2026-11-15',
    updatedAt: '2026-11-15',
    featured: true,
    ro: {
      slug: 'cursuri-programare-copii-gratuit-vs-academii-private-logiscool',
      title: 'Educație digitală și programare pentru copii în România (10–15 ani): Ghidul părinților 0 lei/an vs. școli private de 5.000 lei/an',
      metaTitle: 'Cursuri programare copii gratuit vs. școli private (Ghid Părinți) | ArkyEdu',
      metaDescription: 'Comparație sinceră pentru părinți: cum învață copiii de 10–15 ani Scratch, C++, Excel, securitate cibernetică și robotică Arduino gratuit pe programa oficială vs. abonamente de 4.000–6.000 lei/an.',
      keywords: 'cursuri programare copii gratuit, alternativa gratuita logiscool mindhub, educatie copii tehnologie acasa, cum invata copilul programare gratis, informatica tic gimnaziu online, educatie digitala parinti',
      breadcrumbLabel: 'Coding Gratuit vs. Școli Private',
      categoryLabel: 'Ghid Părinți & Economii',
      readTime: '11 min citire',
      tldrTitle: 'Răspuns Rapid (TL;DR)',
      tldr: 'Un copil de 10–15 ani NU are nevoie de un abonament de 4.000–6.000 lei/an la o academie privată ca să devină pasionat de programare și tehnologie. Cu 2 sesiuni a câte 30 de minute pe săptămână pe ArkyEdu (100% gratuit, aliniat programei OMEN 3393/2017 & OM 5420/2024), elevul parcurge progresiv Scratch 3.0, C++, Excel, HTML5, securitate cibernetică și robotică Arduino IoT — cu diplome 1–10 și 28 jocuri arcade.',
      intro: 'Oferta de cursuri private de coding și robotică pentru copii a explodat în România, cu costuri între 350 și 600 lei pe lună. Mulți părinți plătesc aceste sume crezând că la școală nu există alternative structurate sau că mediul online gratuit înseamnă doar haos în limba engleză. Realitatea este diferită: înțelegând diferențele exacte dintre programele paralele și curricula școlară gamificată, poți oferi copilului competențe reale cu cost 0 lei.',
      sections: [
        {
          id: 'comparatie-obiectiva-parinti',
          heading: '1. Tabel comparativ onest: Școli private de coding vs. ArkyEdu (0 lei/an)',
          paragraphs: [
            'Școlile private oferă un mediu fizic cu mentor și socializare — un avantaj real dacă copilul nu are deloc disciplină acasă. Totuși, din punct de vedere al materiei, al accesului și al relevanței pentru notele de la școală și liceu, diferențele sunt clare:'
          ],
          table: {
            caption: 'Comparație pentru părinți — Investiție anuală vs. competențe dobândite',
            headers: ['Criteriu', 'Academii private de coding', 'ArkyEdu (Platformă Open-Access)'],
            rows: [
              ['Cost anual per copil', '4.000 – 6.000+ lei / an școlar', '0 lei / an (100% gratuit, fără reclame sau upsell)'],
              ['Aliniere la școală', 'Programă paralelă proprie (nu acoperă Excel, Word, OMEN)', '100% aliniată OMEN 3393/2017 & OM 5420/2024 + manual Art Klett'],
              ['Tehnologii studiate', 'Blocuri proprii / Roblox / Python introductiv', 'Scratch 3.0, C++ (Code::Blocks), Excel, HTML5, Securitate & Arduino IoT'],
              ['Program & ritm', 'Fix (o dată pe săptămână, 60–90 min; dacă lipsești, pierzi)', 'Disponibil 24/7, în ritmul copilului, cu reluare nelimitată'],
              ['Motivație prin joc', 'Sisteme interne de puncte în clasă', '28 jocuri arcade retro + 20+ dueluri 1v1 cu colegii sau AI Bot'],
              ['Limbă', 'Predominant RO sau EN separat', 'Instantaneu Bilingvă (RO ↔ EN) pentru terminologie dublă']
            ]
          }
        },
        {
          id: 'parcurs-optim-pe-varste',
          heading: '2. Harta competențelor digitale recomandate pe vârste (10–15 ani)',
          paragraphs: [
            'Secretul nu este să arunci copilul de 10 ani direct în cod complicat, ci să construiești treaptă cu treaptă:'
          ],
          numberedSteps: [
            '10–11 ani (Clasa a V-a): Igiena digitală, organizarea fișierelor, tastare rapidă cu diacritice, siguranță de bază și primii pași în Scratch 3.0 (coordonate și animații).',
            '11–12 ani (Clasa a VI-a): Prezentări structurate (regula 6×6), grafică 3D, securitate cibernetică anti-phishing/scam și bucle condiționate în Scratch.',
            '12–13 ani (Clasa a VII-a): Tehnoredactare curată, editare audio/video și tranziția esențială de la blocuri la limbajul C++ real (variabile, if/else, while/for).',
            '13–15 ani (Clasa a VIII-a): Calcul tabelar Excel avansat, creare site-uri HTML5, vectori în C++ și proiecte Smart Home IoT pe microcontrollere Arduino Uno.'
          ]
        },
        {
          id: 'rutina-30-minute-acasa',
          heading: '3. Cum transformi timpul pe calculator din „stat pe TikTok” în 2×30 minute de creație pe săptămână',
          paragraphs: [
            'Copiii nu resping învățarea — resping plictiseala din PDF-urile statice. O rutină simplă de seară sau weekend funcționează excelent fără certuri:'
          ],
          bulletPoints: [
            'Regula „Misiune + Recompensă în Arcade”: Copilul parcurge un modul interactiv (15–20 min) și obține nota 9–10 pe diplomă, apoi are acces la un duel 1v1 (ex: Cyber Battleship sau File-Drop Attack) cu un prieten sau coleg.',
            'Învățare bilingvă naturală: Comută limba platformei din RO în EN o dată pe lună ca elevul să rețină termenii tehnici reali (loop, array, spreadsheet, resistor) și în engleză.',
            'Portofoliu concret: Printează sau salvează într-un folder diplomele obținute și proiectele HTML/C++/Smart City realizate — copilul vede progresul tangibil.'
          ],
          callout: {
            title: 'Un avantaj major pentru admiterea la liceu',
            text: 'Spre deosebire de cursurile comerciale bazate exclusiv pe jocuri proprietare, parcursul C++ și algoritmică din clasele VII–VIII de pe ArkyEdu construiește exact baza cerută la profilul Matematică-Informatică din liceu și la olimpiadele de profil.',
            variant: 'tip'
          }
        }
      ],
      checklistTitle: 'Plan de acțiune în 4 pași pentru părinți chiar de azi',
      checklist: [
        'Alege împreună cu copilul hub-ul corespunzător clasei lui (V, VI, VII sau VIII) pe ArkyEdu.',
        'Stabiliți două intervale fixe de 30 de minute pe săptămână (ex: Marți și Sâmbătă dimineața).',
        'Încurajează-l să exerseze jocurile din Arcade care antrenează exact materia curentă (PC Builder, File-Drop, Circuit Master 80s).',
        'Verificați împreună diplomele de merit obținute și comparați progresul fără niciun cost lunar.'
      ],
      faqs: [
        {
          question: 'Este ArkyEdu într-adevăr 100% gratuită fără abonamente ascunse după 7 zile?',
          answer: 'Da. Toate cele 40 de module curriculare, cele 28 de jocuri arcade, duelurile 1v1, simulatoarele și diplomele sunt 100% gratuite (0 lei), fără reclame și fără limitări de tip trial.'
        },
        {
          question: 'Ce primește copilul în plus față de un curs plătit la o școală privată?',
          answer: 'Aliniere 100% cu programa oficială de TIC și Informatică de la școală (V–VIII), practică reală pe C++ Code::Blocks, Excel, HTML5 și Arduino IoT, evaluare pe baremul 1–10, acces 24/7 și interfață bilingvă RO/EN.'
        },
        {
          question: 'De la ce vârstă poate folosi copilul platforma singur?',
          answer: 'De la 9–10 ani (clasa a IV-a/a V-a) fără ajutor, datorită instrucțiunilor pas cu pas, simulatoarelor vizuale și sistemului de feedback instant.'
        },
        {
          question: 'Dacă copilul merge deja la un curs privat, îl mai ajută ArkyEdu?',
          answer: 'Da, foarte mult! Cursurile private nu acoperă de obicei tehnoredactarea, PowerPoint, calculul tabelar Excel sau algoritmii specifici programei școlare românești; ArkyEdu completează perfect aceste lacune și consolidează C++ prin dueluri rapide.'
        },
        {
          question: 'Unde pot vedea comparația detaliată și ghidul complet pentru părinți?',
          answer: 'Consultă pagina dedicată Comparație ArkyEdu vs. Școli Private (/comparatie-scoli-private/) și ghidul pilon Educație Tehnologie Copii (/educatie-tehnologie-copii/).'
        }
      ],
      internalLinksTitle: 'Explorează Resursele Gratuite pentru Copilul Tău',
      internalLinks: [
        {
          label: 'Comparație detaliată: ArkyEdu vs. Școli Private',
          url: '/comparatie-scoli-private/',
          description: 'Analiză completă a costurilor și competențelor (0 lei vs. 4.500+ lei/an).'
        },
        {
          label: 'Ghid Pilon: Educație Digitală & Tehnologie Copii',
          url: '/educatie-tehnologie-copii/',
          description: 'Tot ce trebuie să știe un părinte despre traseul digital la 10–15 ani.'
        },
        {
          label: 'Arcade Didactic (28 Jocuri Retro Educaționale)',
          url: '/arcade/',
          targetView: 'arcade',
          description: 'Transformă timpul de joacă în logică, conversii binare și algoritmi.'
        },
        {
          label: 'Arena Dueluri 1v1 Live (20+ Moduri)',
          url: '/duel/',
          targetView: 'duel',
          description: 'Competiții sănătoase între elevi sau contra AI Cyber-Bot.'
        }
      ]
    },
    en: {
      slug: 'free-kids-coding-platforms-vs-paid-academies-parents-guide',
      title: 'Free Kids Coding & Digital Literacy vs. $1,000/Year Private Academies: A Practical Parents’ Guide',
      metaTitle: 'Free Coding for Kids vs. Paid Private Academies (Parents Guide) | ArkyEdu',
      metaDescription: 'Objective parent comparison: how ages 10–15 can master Scratch, C++, Excel, web design, cybersecurity & Arduino IoT free on school-aligned platforms vs expensive monthly academies.',
      keywords: 'free coding platform for kids 10-15, free alternative to paid coding schools, teach kids scratch c++ arduino free, digital literacy roadmap middle school, smart screen time games',
      breadcrumbLabel: 'Free Coding vs. Paid Academies',
      categoryLabel: 'Parents & Education Guide',
      readTime: '11 min read',
      tldrTitle: 'Quick Answer (TL;DR)',
      tldr: 'Parents do not need $1,000+/year private coding subscriptions to raise tech-fluent kids. With two focused 30-minute sessions per week on ArkyEdu (100% free, zero ads, bilingual EN/RO), students ages 10–15 progress systematically from Scratch 3.0 to real C++, Excel formulas, HTML5, cybersecurity, and Arduino IoT—reinforced by 28 retro arcade games and live 1v1 duels.',
      intro: 'Private after-school coding franchises market heavily to parents, charging steep monthly tuition for weekly group sessions. Many families pay thinking free online learning means unguided random videos. In practice, combining a structured, school-aligned interactive platform with short weekly routines delivers broader technical mastery—completely free.',
      sections: [
        {
          id: 'honest-comparison-for-parents',
          heading: '1. Honest Side-by-Side: Private Coding Schools vs. ArkyEdu (0 Cost)',
          paragraphs: [
            'In-person academies offer scheduled classroom accountability—helpful if a child needs a live tutor physically present. However, on curriculum breadth, real-world office/coding tools, schedule flexibility, and cost, compare the difference:'
          ],
          table: {
            caption: 'Annual Tuition vs. Core Digital & Coding Outcomes',
            headers: ['Factor', 'Paid Private Coding Academies', 'ArkyEdu Open Platform'],
            rows: [
              ['Annual Cost', '~4,000 – 6,000+ RON (~$900–$1,300/yr)', '$0 / 0 RON (100% free, zero paywalls, zero ads)'],
              ['Curriculum Scope', 'Often proprietary game wrappers only', 'Full school ICT + coding: Word, Excel, HTML5, Scratch, C++, Arduino IoT'],
              ['Scheduling', 'Fixed 1×/week slot (missed class = lost)', 'Available 24/7 at the student’s own pace with unlimited retries'],
              ['Motivation Loop', 'Classroom stickers or points', '28 built-in retro arcade games + 20+ real-time 1v1 duels & AI Bot'],
              ['Language Fluency', 'Single language', 'Instant Bilingual toggle (English ↔ Romanian) across all labs']
            ]
          }
        },
        {
          id: 'age-by-age-tech-roadmap',
          heading: '2. Optimal Technology Progression Map (Ages 10–15)',
          paragraphs: [
            'The smartest approach avoids tossing a 10-year-old straight into cryptic syntax—and avoids keeping a 14-year-old stuck in drag-and-drop blocks forever:'
          ],
          numberedSteps: [
            'Ages 10–11 (Grade 5): Hardware basics, clean folder hygiene, touch typing, online safety fundamentals, and Scratch 3.0 animation.',
            'Ages 11–12 (Grade 6): Visual presentations (6×6 rule), 3D concepts, anti-phishing & 2FA cybersecurity, and conditional loops in Scratch.',
            'Ages 12–13 (Grade 7): Document typography, audio/video editing, and the milestone leap from visual blocks to real typed C++ (`if/else`, `while`, `for`).',
            'Ages 13–15 (Grade 8): Excel data analysis (`IF`, `COUNTIF`, charts), semantic HTML5 websites, C++ arrays, and Smart Home Arduino Uno robotics.'
          ]
        },
        {
          id: 'smart-screen-time-routine',
          heading: '3. Turning Passive Screen Time Into Two 30-Minute Maker Sessions Weekly',
          paragraphs: [
            'Kids reject dull PDF worksheets, not learning itself. A simple weekly rhythm keeps momentum high without household battles:'
          ],
          bulletPoints: [
            'Mission + Arcade Reward: Complete one 20-minute interactive lab to earn a 9–10 merit certificate, then challenge a friend or AI Bot in Cyber Battleship or File-Drop Attack.',
            'Build Dual-Language Fluency: Flip the interface between English and Romanian occasionally so core engineering terms stick in both languages.',
            'Celebrate Tangible Artifacts: Save certificates, HTML mini-sites, and Smart City builds in a family portfolio folder.'
          ],
          callout: {
            title: 'Strong High-School & Olympiad Foundation',
            text: 'Unlike commercial courses locked inside toy game engines, learning C++ algorithms, spreadsheets, web structure, and Arduino electronics directly prepares students for high school computer science tracks and coding competitions.',
            variant: 'tip'
          }
        }
      ],
      checklistTitle: '4-Step Action Plan for Parents Starting Today',
      checklist: [
        'Open the grade hub matching your child’s age (Grade 5, 6, 7, or 8) on ArkyEdu.',
        'Pick two regular 30-minute slots per week (e.g., Tuesday evening and Saturday morning).',
        'Pair curriculum labs with matching Arcade games (PC Builder, File-Drop, Circuit Master 80s).',
        'Review generated merit certificates together with zero monthly tuition.'
      ],
      faqs: [
        {
          question: 'Is ArkyEdu truly 100% free without hidden paywalls after a trial?',
          answer: 'Yes. All 40 curriculum labs, 28 arcade games, 1v1 duels, simulators, and merit certificates are completely free with no ads or paid tiers.'
        },
        {
          question: 'What does a student learn here that paid academies often skip?',
          answer: 'Beyond Scratch and C++, students master real-world productivity tools—Excel formulas, Google Docs layout, HTML5 web structure, cyber hygiene, and Arduino Smart Home IoT.'
        },
        {
          question: 'What age can children start independently?',
          answer: 'Students ages 9–10 and up can navigate labs independently thanks to visual interactive steps and immediate feedback.'
        },
        {
          question: 'Can ArkyEdu complement an in-person coding club?',
          answer: 'Yes. It reinforces core school ICT subjects and lets students sharpen C++, binary math, and circuits at home anytime via 1v1 duels.'
        },
        {
          question: 'Where can parents read the full comparison and roadmap?',
          answer: 'Visit the dedicated ArkyEdu vs. Private Coding Schools breakdown (/comparatie-scoli-private/) and the Digital Education Hub (/educatie-tehnologie-copii/).'
        }
      ],
      internalLinksTitle: 'Explore Free Interactive Resources for Your Child',
      internalLinks: [
        {
          label: 'Detailed Comparison: ArkyEdu vs. Paid Academies',
          url: '/comparatie-scoli-private/',
          description: 'Side-by-side breakdown of cost and technical outcomes.'
        },
        {
          label: 'Pillar Guide: Tech Education for Kids (Ages 10–15)',
          url: '/educatie-tehnologie-copii/',
          description: 'Complete digital literacy roadmap for parents and students.'
        },
        {
          label: 'Educational Arcade (28 Retro Games)',
          url: '/arcade/',
          targetView: 'arcade',
          description: 'Turn game time into binary math, typing, and algorithmic logic.'
        },
        {
          label: 'Live 1v1 Tech Duels Arena (20+ Modes)',
          url: '/duel/',
          targetView: 'duel',
          description: 'Healthy real-time competition with classmates or AI Cyber-Bot.'
        }
      ]
    }
  },
  {
    id: 'ghid-profesor-tic-catalog-digital-olimpiada-gimnaziu',
    category: 'parents-teachers',
    gradeTagRo: 'Profesori TIC · V–VIII',
    gradeTagEn: 'ICT Teachers · 5–8',
    publishedAt: '2026-11-15',
    updatedAt: '2026-11-15',
    featured: false,
    ro: {
      slug: 'ghid-profesor-tic-catalog-digital-olimpiada-gimnaziu',
      title: 'Playbook pentru Profesorul de Informatică și TIC (V–VIII): Laboratoare fără instalare, catalog digital 1–10 & pregătire Olimpiadă',
      metaTitle: 'Ghid Profesor TIC Gimnaziu: Catalog Digital, OMEN 3393 & Olimpiadă | ArkyEdu',
      metaDescription: 'Cum organizezi ore interactive de TIC în laboratorul școlar (clasele V–VIII) conform OMEN 3393/2017 și OM 5420/2024: simulatoare fără instalări, evaluare 1–10 GDPR, dueluri la clasă și pregătire ONTIC/Olimpiadă.',
      keywords: 'ghid profesor informatica tic gimnaziu, catalog digital evaluare tic 1-10, programa scolara tic omen 3393 2017, pregatire olimpiada tic gimnaziu ontic, activitati interactive ora de tic, platforma gratuita profesori informatica',
      breadcrumbLabel: 'Playbook Profesor TIC & Olimpiadă',
      categoryLabel: 'Profesori & Olimpiadă',
      readTime: '10 min citire',
      tldrTitle: 'Răspuns Rapid (TL;DR)',
      tldr: 'În laboratoarele școlare cu calculatoare eterogene și timp limitat la 50 de minute, ArkyEdu elimină blocajele de instalare (Code::Blocks, Excel, Arduino IDE rulează direct în browser), aliniază toate cele 40 de module la programa OMEN 3393/2017 & OM 5420/2024, oferă Portal Profesor cu catalog digital pe bareme 1–10 (izolare multi-școală GDPR + export PDF/CSV) și transformă ultimele 10 minute ale orei în recapitulare prin dueluri 1v1.',
      intro: 'Profesorii de Informatică și TIC din gimnaziu se confruntă zilnic cu trei provocări reale: calculatoare din generații diferite fără drepturi de administrator pentru instalări, o singură oră pe săptămână (50 de minute!) în care trebuie atât teorie cât și practică, și nevoia de a motiva atât elevii care abia descoperă mouse-ul, cât și olimpicii. Iată un model de oră testat și gata de aplicat.',
      sections: [
        {
          id: 'structura-orei-50-minute',
          heading: '1. Structura optimă a unei ore de TIC de 50 de minute (Modelul 10 + 25 + 10 + 5)',
          paragraphs: [
            'Pentru ca elevii să lucreze efectiv pe calculator în loc să aștepte descărcarea programelor sau copierea fișierelor de pe stick, împarte ora astfel:'
          ],
          table: {
            caption: 'Planificare cronometrată pentru laboratorul de Informatică și TIC',
            headers: ['Interval oră', 'Activitate didactică', 'Instrument ArkyEdu recomandat'],
            rows: [
              ['Min 0–10', 'Captarea atenției + Demonstrație pe proiector', 'Sinteza teoretică bilingvă & exemplul vizual din modulul clasei.'],
              ['Min 10–35', 'Atelier practic individual sau pe perechi', 'Simulatorul interactiv din browser (C++, Excel, Word, Scratch, Arduino).'],
              ['Min 35–45', 'Verificare competitivă / Consolidare rapidă', 'Mini-joc tematic din Arcade sau Duel 1v1 pe cod de cameră de 4 caractere.'],
              ['Min 45–50', 'Evaluare pe barem 1–10 & Temă opțională acasă', 'Generare Diplomă / înregistrare automată în Catalogul Digital din Portal.']
            ]
          }
        },
        {
          id: 'catalog-digital-gdpr-profesori',
          heading: '2. Portalul Profesorului: Evaluare automată pe bareme 1–10 și protecție GDPR',
          paragraphs: [
            'Corectarea a 120 de fișiere individuale pe săptămână consumă ore întregi. În Portalul Profesorului de pe ArkyEdu (/profesor/), fiecare școală beneficiază de izolare GDPR a datelor elevilor, urmărire în timp real a progresului pe module și calcul automat al notei de la 1 la 10 conform baremelor didactice.',
            'Profesorii pot exporta rapid situația clasei în format imprimabil PDF sau CSV pentru trecerea în catalog și pot diferenția temele suplimentare pentru elevii avansați.'
          ],
          callout: {
            title: 'Funcționare offline-friendly & zero instalări pe Windows/Linux',
            text: 'ArkyEdu funcționează ca aplicație web progresivă (PWA) direct în Chrome, Edge sau Firefox, inclusiv pe distribuțiile Linux din laboratoarele școlare, fără drepturi de administrator.',
            variant: 'tip'
          }
        },
        {
          id: 'pregatire-olimpiada-tic-si-informatica',
          heading: '3. Pregătirea elevilor performanți pentru Olimpiada de TIC (ONTIC) & Liceu',
          paragraphs: [
            'Elevii care vor mai mult decât nivelul standard al clasei au nevoie de probleme aplicate de tip olimpiadă. Folosește combinația de module avansate + dueluri contracronometru:'
          ],
          bulletPoints: [
            'Secțiunea Word/Excel/PowerPoint (Clasa VI–VIII): Exersează referințe absolute $A$1, funcții imbricate IF/COUNTIF, formatări tipografice stricte și diagrame — exact subiectele probei practice de ONTIC gimnaziu.',
            'Secțiunea C++ Code::Blocks (Clasa VII–VIII): Parcurge algoritmii pe cifre (oglindit, palindrom, descompunere), tehnica celor 3 pahare, șirul Fibonacci, prelucrarea vectorilor și tehnica semaforului (g8_algo_e) + C++ Code Racer 1v1.',
            'Secțiunea Robotică & IoT (Clasa VIII): Pregătește echipele pentru concursuri STEM cu proiectul Smart Home Arduino (millis(), senzori analogici/digitali, punte H L298N) și simulatorul Arkedo Smart City.'
          ]
        }
      ],
      checklistTitle: 'Checklist rapid pentru debutul semestrului în laborator',
      checklist: [
        'Am testat linkul platformei pe browserul calculatoarelor din laborator (merge fără cont de admin).',
        'Am accesat Portalul Profesorului (/profesor/) pentru gestionarea claselor și exportul notelor 1–10.',
        'Am pregătit o cameră de Duel 1v1 (cod 4 caractere) ca premiu educațional pentru ultimele 10 minute ale orei.',
        'Le-am oferit părinților ghidurile gratuite din Blog pentru consolidarea temelor acasă.'
      ],
      faqs: [
        {
          question: 'Este Portalul Profesorului gratuit pentru școlile de stat și profesorii din România?',
          answer: 'Da, Portalul Profesorului și toate cele 40 de module curriculare sunt 100% gratuite pentru toate școlile și cadrele didactice, fără limite de elevi sau abonamente.'
        },
        {
          question: 'La ce programe școlare sunt aliniate lecțiile de pe ArkyEdu?',
          answer: 'Conținutul respectă integral programa oficială OMEN nr. 3393/2017 și actualizările OM 5420/2024 pentru Informatică și TIC (clasele V–VIII), precum și structura manualelor aprobate (Art Klett 2025, Litera, EDP).'
        },
        {
          question: 'Cum folosesc Duelurile 1v1 în clasă fără haos?',
          answer: 'Profesorul proiectează provocarea tematică în ultimele 8–10 minute ale orei; elevii intră în camere pereche cu cod scurt din 4 caractere (sau joacă individual contra AI Cyber-Bot dacă numărul de elevi e impar).'
        },
        {
          question: 'Respectă platforma cerințele GDPR pentru datele elevilor?',
          answer: 'Da. Fiecare școală are izolare multi-școală dedicată, fără reclame sau tracking comercial, iar profesorii pot exporta și gestiona situația clasei în siguranță.'
        },
        {
          question: 'Unde pot accesa direct Portalul Profesorului și modulele de Olimpiadă?',
          answer: 'Direct din Portalul Profesorului (/profesor/), Hub-urile pe clase (/clasa-5/ – /clasa-8/) și modulul avansat de algoritmică C++ pentru admitere și olimpiadă (/cursuri/g8_algo_e/).'
        }
      ],
      internalLinksTitle: 'Instrumente pentru Profesori & Pregătire Performanță',
      internalLinks: [
        {
          label: 'Portalul Profesorului & Catalog Digital 1–10',
          url: '/profesor/',
          targetView: 'teacher',
          description: 'Evaluare automată pe bareme, progres pe clase și export PDF/CSV.'
        },
        {
          label: 'Algoritmi Avansați C++ & Pregătire Liceu (VIII)',
          url: '/cursuri/g8_algo_e/',
          missionId: 'g8_algo_e',
          description: 'Tehnica semaforului, min/max și subiecte tip olimpiadă/admitere.'
        },
        {
          label: 'Calcul Tabelar: Formule IF, COUNTIF & $A$1 (VIII)',
          url: '/cursuri/g8_calc_c/',
          missionId: 'g8_calc_c',
          description: 'Antrenament practic pentru proba practică Excel / ONTIC.'
        },
        {
          label: 'Arena Dueluri 1v1 (Activitate Final de Oră)',
          url: '/duel/',
          targetView: 'duel',
          description: 'Concursuri rapide C++ Code Racer, Binary Clash și Cyber Battleship.'
        }
      ]
    },
    en: {
      slug: 'ict-teacher-playbook-digital-gradebook-olympiad-prep-guide',
      title: 'ICT Teacher Playbook (Grades 5–8): Zero-Install Browser Labs, 1–10 Gradebook & Olympiad Prep',
      metaTitle: 'ICT Teacher Guide: Zero-Install Labs, Digital Gradebook & Contests | ArkyEdu',
      metaDescription: 'How middle school ICT teachers run smooth 50-minute lab classes without local installs: bilingual curriculum alignment, automated 1–10 grading, GDPR classroom isolation, 1v1 review duels, and coding contest prep.',
      keywords: 'ict teacher classroom guide middle school, browser coding labs no install, digital gradebook school portal, middle school cs olympiad preparation c++ excel, interactive computer science lesson plan',
      breadcrumbLabel: 'ICT Teacher Playbook & Contests',
      categoryLabel: 'Teachers & Olympiad Prep',
      readTime: '10 min read',
      tldrTitle: 'Quick Answer (TL;DR)',
      tldr: 'In school labs with mixed hardware and tight 50-minute periods, ArkyEdu removes installation bottlenecks (C++, Excel, Scratch, HTML5, and Arduino labs run directly in the browser), provides a free Teacher Portal with automated 1–10 rubric grading and multi-school GDPR isolation, and turns the final 10 minutes into high-energy review via 4-character-code 1v1 duels.',
      intro: 'Middle school ICT teachers juggle three daily realities: aging school lab computers locked down against software installs, a single 50-minute weekly slot per class, and wide skill gaps between absolute beginners and contest-bound coders. Here is a classroom-tested lesson structure built specifically to make every period run smoothly.',
      sections: [
        {
          id: 'fifty-minute-lab-blueprint',
          heading: '1. The 50-Minute ICT Lab Blueprint (10 + 25 + 10 + 5 Timing)',
          paragraphs: [
            'Instead of spending 15 minutes troubleshooting USB drives or IDE installs, structure each period around immediate browser-based execution:'
          ],
          table: {
            caption: 'Timed Lesson Flow for School Computer Labs',
            headers: ['Time Block', 'Classroom Activity', 'ArkyEdu Tool'],
            rows: [
              ['Min 0–10', 'Hook & Projector Walkthrough', 'Bilingual concept synthesis & visual example from the grade module.'],
              ['Min 10–35', 'Hands-On Interactive Practice', 'Zero-install browser simulator (C++, Excel, Word, Scratch, Arduino).'],
              ['Min 35–45', 'Fast Review & Peer Challenge', 'Themed Arcade sprint or 1v1 Duel via 4-character room code.'],
              ['Min 45–50', 'Rubric Grading (1–10) & Optional Extension', 'Instant Merit Certificate + automated Teacher Gradebook sync.']
            ]
          }
        },
        {
          id: 'teacher-portal-gdpr-gradebook',
          heading: '2. Teacher Portal: Automated 1–10 Grading & Multi-School GDPR Isolation',
          paragraphs: [
            'Checking 120 individual student files every week eats evenings alive. Inside the ArkyEdu Teacher Portal (/profesor/), each school operates in strict multi-school GDPR isolation, tracking real-time completion and calculating official 1–10 rubric grades automatically.',
            'Teachers can export clean printable PDF or spreadsheet CSV reports in one click and assign extension modules to fast finishers.'
          ],
          callout: {
            title: 'Works Across Windows, Linux & Chromebooks Without Admin Rights',
            text: 'Because ArkyEdu runs inside Chrome, Edge, or Firefox as a Progressive Web App, school IT admins do not need to install IDEs or grant elevated permissions.',
            variant: 'tip'
          }
        },
        {
          id: 'olympiad-and-contest-training',
          heading: '3. Coaching Talented Students for ICT & Computer Science Contests',
          paragraphs: [
            'Students aiming for regional/national ICT olympiads or selective high school tracks need applied challenge sets beyond basic theory:'
          ],
          bulletPoints: [
            'Office & Spreadsheet Mastery: Drill absolute `$A$1` references, nested `IF`/`COUNTIF`, charts, and strict document typography.',
            'C++ Algorithms Track: Practice digit extraction, palindromes, Fibonacci sequences, arrays, boolean flags (`g8_algo_e`), and speed debugging in C++ Code Racer 1v1.',
            'STEM Robotics & IoT: Train teams on non-blocking `millis()` timing, digital/analog sensors, H-bridge motor drivers, and Smart City logic.'
          ]
        }
      ],
      checklistTitle: 'Semester Launch Checklist for ICT Teachers',
      checklist: [
        'Verified browser access across classroom workstations (no admin password needed).',
        'Set up class tracking inside the Teacher Portal (/profesor/) for 1–10 exports.',
        'Used 4-character 1v1 Duel rooms (with AI Cyber-Bot for odd student counts) as a 10-minute lesson closer.',
        'Shared bilingual Blog study guides with parents for structured homework support.'
      ],
      faqs: [
        {
          question: 'Is the Teacher Portal free for public schools and educators?',
          answer: 'Yes. The Teacher Portal, automated grading rubrics, PDF/CSV exports, and all 40 labs are 100% free with unlimited students.'
        },
        {
          question: 'How does the curriculum align with national ICT standards?',
          answer: 'All 40 modules map directly to official middle school ICT & Computer Science curricula (Grades 5–8, OMEN 3393/2017 & OM 5420/2024) and approved textbooks.'
        },
        {
          question: 'How do teachers manage classroom 1v1 duels smoothly?',
          answer: 'Pairs join using a 4-character room code for the final 8–10 minutes of class; if a class has an odd number of students, the remaining student competes against the AI Cyber-Bot.'
        },
        {
          question: 'Does the platform protect student privacy under GDPR?',
          answer: 'Yes. Multi-school isolation separates school rosters cleanly, with zero commercial ads or third-party ad tracking.'
        },
        {
          question: 'Where do teachers access the Gradebook and advanced Olympiad labs?',
          answer: 'Open the Teacher Portal (/profesor/), browse grade hubs (/clasa-5/ – /clasa-8/), or jump straight into advanced C++ algorithms (/cursuri/g8_algo_e/).'
        }
      ],
      internalLinksTitle: 'Teacher Tools & Contest Prep on ArkyEdu',
      internalLinks: [
        {
          label: 'Teacher Portal & Digital Gradebook (1–10)',
          url: '/profesor/',
          targetView: 'teacher',
          description: 'Track class mastery and export printable PDF/CSV grade sheets.'
        },
        {
          label: 'Advanced C++ Algorithms & High-School Prep (Grade 8)',
          url: '/cursuri/g8_algo_e/',
          missionId: 'g8_algo_e',
          description: 'Boolean flags, min/max patterns, and contest-style C++ drills.'
        },
        {
          label: 'Excel Formulas IF, COUNTIF & $A$1 (Grade 8)',
          url: '/cursuri/g8_calc_c/',
          missionId: 'g8_calc_c',
          description: 'Hands-on spreadsheet mastery for practical ICT exams.'
        },
        {
          label: 'Live 1v1 Duels Arena (Class Review)',
          url: '/duel/',
          targetView: 'duel',
          description: 'Run C++ Code Racer, Binary Clash, and Cyber Battleship rounds.'
        }
      ]
    }
  }
];
