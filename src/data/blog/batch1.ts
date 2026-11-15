import { BlogArticle } from './types';

export const BLOG_BATCH_1: BlogArticle[] = [
  {
    id: 'ai-chatgpt-scoala-gimnaziu',
    category: 'ai-skills',
    gradeTagRo: 'Clasele V–VIII',
    gradeTagEn: 'Grades 5–8',
    publishedAt: '2026-11-02',
    updatedAt: '2026-11-15',
    featured: true,
    ro: {
      slug: 'inteligenta-artificiala-chatgpt-scoala-gimnaziu',
      title: 'Inteligența Artificială & ChatGPT la școală (V–VIII): Cum folosești AI-ul corect la teme fără plagiat',
      metaTitle: 'ChatGPT & AI la școală (V–VIII): Ghid fără plagiat | ArkyEdu',
      metaDescription: 'Ghid practic pentru elevi (clasele V–VIII), părinți și profesori: cum folosești ChatGPT și Gemini la teme prin metoda R.C.C.L., verificare fapte și reguli de siguranță.',
      keywords: 'inteligenta artificiala la scoala, chatgpt teme gimnaziu, cum folosesc elevii chatgpt corect, prompt engineering copii, plagiat ai scoala, educatie digitala tic, verificare informatii ai',
      breadcrumbLabel: 'AI & ChatGPT la școală',
      categoryLabel: 'AI & Competențe Digitale',
      readTime: '8 min citire',
      tldrTitle: 'Răspuns Rapid (TL;DR)',
      tldr: 'Elevii de gimnaziu pot folosi ChatGPT sau Gemini ca pe un meditator digital, nu ca pe un automat de copiat teme. Formula câștigătoare este metoda în 4 pași (Rol + Context + Cerință + Limită): cere explicații pas cu pas și indicii, verifică mereu datele din manual și nu introduce niciodată date personale sau poze cu colegii.',
      intro: 'Inteligența Artificială generativă a intrat deja în viața fiecărui elev de gimnaziu. Întrebarea reală nu mai este dacă elevii folosesc ChatGPT, Gemini sau Claude, ci dacă le folosesc pentru a înțelege mai repede materia sau doar pentru a copia un răspuns pe care nu îl pot susține la tablă. Acest ghid îți arată exact cum să transformi un asistent AI într-un partener de studiu sigur, eficient și 100% etic.',
      sections: [
        {
          id: 'ce-este-ai-pe-intelesul-elevilor',
          heading: '1. Cum gândește un model AI și de ce poate greși sigur pe el',
          paragraphs: [
            'Un model de limbaj (LLM – Large Language Model) nu caută răspunsul într-un caiet cu adevăruri absolute, ci prezice statistic cel mai probabil cuvânt următor pe baza miliardelor de texte citite la antrenament. De aceea răspunde fluent și politicos chiar și atunci când inventează o dată istorică, un citat din literatură sau o formulă greșită.',
            'În termenii educației digitale, acest fenomen se numește halucinație AI. Dacă copiezi cuvânt cu cuvânt ce generează AI-ul fără să verifici în manualul de TIC, Română sau Matematică, riști atât o notă mică pentru inexactități, cât și blocarea propriei gândiri algoritmice.'
          ],
          callout: {
            title: 'Regula de aur a elevului inteligent',
            text: 'Dacă nu poți explica colegului de bancă în 30 de secunde cum ai ajuns la răspunsul din caiet, înseamnă că nu ai înțeles tema — indiferent cât de frumos sună textul generat.',
            variant: 'tip'
          }
        },
        {
          id: 'metoda-rccl-prompting',
          heading: '2. Metoda R.C.C.L.: Cum scrii un prompt care chiar te ajută să înveți',
          paragraphs: [
            'Diferența dintre un răspuns slab și o explicație demnă de nota 10 stă în claritatea instrucțiunii (promptului). Elevii care tastează doar „Fă-mi compunerea despre...” primesc texte generale, ușor de recunoscut de orice profesor. Folosește structura în 4 elemente de mai jos:'
          ],
          numberedSteps: [
            'Rol (R): Spune-i AI-ului cine este în conversație (ex: „Ești un profesor răbdător de TIC pentru clasa a VII-a”).',
            'Context (C): Precizează clasa, nivelul și unde te-ai blocat (ex: „Sunt în clasa a VII-a și am greșit la condiția din bucla while”).',
            'Cerință (C): Cere indicații, analogii sau exerciții similare, nu soluția finală gata de copiat.',
            'Limită (L): Fixează formatul și lungimea (ex: „Explică în maximum 5 pași scurți, cu cuvinte simple, și pune-mi o întrebare de verificare la final”).'
          ],
          codeBlock: {
            title: 'Exemplu de Prompt R.C.C.L. pentru Informatică / Matematică',
            language: 'text',
            code: `Rol: Ești profesorul meu de TIC și Informatică.
Context: Sunt în clasa a VII-a și încerc să calculez suma cifrelor unui număr n în C++. Codul meu dă mereu 0.
Cerință: Nu îmi scrie rezolvarea completă din prima! Arată-mi unde greșesc logic între n % 10 și n / 10 și dă-mi un indiciu.
Limită: Maximum 120 de cuvinte, fără termeni universitari.`,
            caption: 'Folosind această structură, AI-ul devine un tutore interactiv și îți antrenează gândirea.'
          }
        },
        {
          id: 'asa-da-vs-asa-nu',
          heading: '3. Copy-paste vs. Învățare activă: Comparație pe materii (V–VIII)',
          paragraphs: [
            'Profesorii recunosc imediat temele copiate cu AI: apar expresii neobișnuite pentru un elev de 12 ani, structuri repetitive sau informații din afara programei școlare românești. Iată cum să folosești AI-ul inteligent pe principalele materii de gimnaziu:'
          ],
          table: {
            caption: 'Cum folosești AI-ul greșit vs. corect la gimnaziu',
            headers: ['Materie', 'Așa NU (Plagiat & Risc de notă mică)', 'Așa DA (Învățare & Pregătire reală)'],
            rows: [
              ['TIC / C++', '„Scrie-mi programul C++ pentru test și comentează-l.”', '„Explică-mi de ce bucla while(n > 0) se oprește și dă-mi 2 exemple de urmărire pas cu pas.”'],
              ['Limba Română', '„Scrie un eseu de 300 cuvinte despre opera X.”', '„Iată ideile mele principale pentru eseu. Verifică dacă argumentele sunt logice și sugerează conectori mai buni.”'],
              ['Matematică', '„Rezolvă problema aceasta și dă-mi rezultatul.”', '„Am ajuns până la pasul 2 și am obținut x = 14. Este corectă metoda? Unde am greșit calculul?”'],
              ['Engleză', '„Tradu tot textul și scrie tema în locul meu.”', '„Corectează-mi greșelile de gramatică din textul scris de mine și explică pe scurt de ce se schimbă timpul verbal.”']
            ]
          }
        },
        {
          id: 'reguli-siguranta-date',
          heading: '4. Cele 5 reguli de siguranță și confidențialitate când folosești un chatbot AI',
          paragraphs: [
            'Conform recomandărilor de siguranță digitală din programa de TIC și cadrului european DigComp, interacțiunea cu platformele AI necesită igienă digitală strictă, mai ales pentru minori:'
          ],
          bulletPoints: [
            'Nu introduce niciodată numele tău complet, adresa, numărul de telefon, CNP-ul sau școala în fereastra de chat.',
            'Nu încărca fotografii cu tine, cu colegii tăi sau documente oficiale (carnet de note, buletin, lucrări cu nume vizibil).',
            'Verifică mereu cel puțin două surse credibile (manualul aprobat, lecțiile ArkyEdu sau documentația oficială) înainte să folosești o informație într-un referat.',
            'Folosește un cont separat de e-mail pentru instrumente educaționale și cere acordul părinților înainte să te înregistrezi pe platforme noi.',
            'Citează onest când ai folosit AI pentru brainstorming sau structurare — transparența este apreciată la proiectele moderne de TIC.'
          ],
          callout: {
            title: 'Atenție la „tema perfectă” generată automat',
            text: 'Multe școli verifică proiectele prin discuție orală: profesorul îți pune două întrebări din ce ai predat. Dacă ai lucrat singur asistat de AI, răspunzi ușor și iei 10 pe merit!',
            variant: 'warning'
          }
        }
      ],
      checklistTitle: 'Checklist rapid înainte să predai o temă la care ai folosit AI',
      checklist: [
        'Am scris ideile și codul final cu mâna mea, după ce am înțeles fiecare pas.',
        'Am verificat toate datele, formulele și definițiile cu manualul sau lecția de la clasă.',
        'Am eliminat orice dată personală din conversația cu asistentul AI.',
        'Pot explica fără foaie în față logica soluției în fața profesorului.'
      ],
      faqs: [
        {
          question: 'Este interzis să folosești ChatGPT sau Gemini la teme în gimnaziu?',
          answer: 'Nu este interzis să îl folosești ca instrument de explicație, exercițiu și verificare, exact cum folosești un dicționar sau o culegere. Problema apare doar când elevul predă textul sau codul generat de AI ca fiind munca lui proprie fără să înțeleagă conținutul (plagiat).'
        },
        {
          question: 'Cum își dă seama profesorul că o temă a fost copiată din AI?',
          answer: 'Textele AI au adesea o structură foarte șablonată, folosesc termeni peste nivelul clasei respective, nu respectă cerințele specifice predate la clasă sau conțin detalii inventate. O singură întrebare orală la tablă arată imediat dacă elevul a înțeles materialul.'
        },
        {
          question: 'Ce date nu trebuie să scriu niciodată în ChatGPT?',
          answer: 'Nu introduce niciodată numele complet, adresa de acasă, numele școlii, parole, numere de telefon, CNP, fotografii personale sau datele altor persoane.'
        },
        {
          question: 'Cum mă ajută AI-ul cel mai bine la Informatică și TIC?',
          answer: 'Cere-i să îți explice erorile de compilare din Code::Blocks, să îți genereze 3 exerciții suplimentare de dificultate graduală sau să îți explice pas cu pas ce face o formulă Excel precum IF sau COUNTIF.'
        },
        {
          question: 'Unde pot exersa gratuit gândirea algoritmică și siguranța digitală fără riscuri?',
          answer: 'Pe platforma ArkyEdu ai 40 de laboratoare interactive gratuite (clasele V–VIII), inclusiv module dedicate pentru siguranța pe Internet, colaborarea în Cloud și algoritmică Scratch/C++, plus 28 de jocuri arcade educative.'
        }
      ],
      internalLinksTitle: 'Exersează practic pe ArkyEdu (100% Gratuit)',
      internalLinks: [
        {
          label: 'Internet & Navigare Sigură (Clasa a V-a)',
          url: '/cursuri/internet-siguranta/',
          missionId: 'internet1',
          description: 'Cum cauți eficient informații reale și cum te protejezi online.'
        },
        {
          label: 'Colaborare Cloud & Proiecte în Echipă (Clasa a VII-a)',
          url: '/cursuri/g7_cloud_a/',
          missionId: 'g7_cloud_a',
          description: 'Editare colaborativă responsabilă și permisiuni în Google Docs.'
        },
        {
          label: 'Gândire Algoritmică & Logică (Clasa a V-a)',
          url: '/cursuri/algoritmi/',
          missionId: 'algo1',
          description: 'Învață să construiești singur algoritmi corecți, pas cu pas.'
        },
        {
          label: 'Detectivul de Amenințări (Arcade TIC)',
          url: '/arcade/',
          targetView: 'arcade',
          description: 'Antrenează-ți ochiul să recunoști capcanele digitale și știrile false.'
        }
      ]
    },
    en: {
      slug: 'ai-chatgpt-middle-school-homework-guide',
      title: 'AI & ChatGPT for Middle School (Grades 5–8): How to Learn Smarter Without Plagiarism',
      metaTitle: 'AI & ChatGPT for Middle School Students: Safe Study Guide | ArkyEdu',
      metaDescription: 'Practical bilingual guide for Grades 5–8 students, parents, and ICT teachers: learn the R.C.R.L. prompting method, fact-checking AI hallucinations, and privacy rules.',
      keywords: 'ai for middle school students, chatgpt homework guide kids, safe ai use school, prompt engineering for teens, ict digital literacy, avoid ai plagiarism',
      breadcrumbLabel: 'AI & ChatGPT at School',
      categoryLabel: 'AI & Digital Literacy',
      readTime: '8 min read',
      tldrTitle: 'Quick Answer (TL;DR)',
      tldr: 'Middle school students should use ChatGPT or Gemini as an interactive tutor rather than a copy-paste homework machine. Use the 4-part prompt method (Role + Context + Request + Limit) to ask for hints and step-by-step explanations, verify every fact against school textbooks, and never enter personal data.',
      intro: 'Generative AI tools are already part of daily student life. The real challenge in Grades 5–8 is no longer whether students open ChatGPT or Gemini, but whether they use them to build real problem-solving skills or blindly paste unverified answers. This practical guide shows students, parents, and teachers how to turn AI into an ethical, effective study companion.',
      sections: [
        {
          id: 'how-ai-thinks',
          heading: '1. How Language Models Work (and Why They Sound Confident When Wrong)',
          paragraphs: [
            'Large Language Models (LLMs) do not check an answer key of absolute truths. They predict the most statistically plausible next word based on patterns in massive text datasets. That is why an AI chatbot can write smoothly and politely even when inventing a historical date, a book quote, or a flawed formula.',
            'In computer science education, this error is called an AI hallucination. Blindly copying AI output without checking your textbook or testing your code leads to factual mistakes and weakens your own algorithmic thinking.'
          ],
          callout: {
            title: 'The 30-Second Understanding Rule',
            text: 'If you cannot explain in 30 seconds to a classmate why your solution works, you are not ready to submit it—no matter how polished the AI paragraph looks.',
            variant: 'tip'
          }
        },
        {
          id: 'rcrl-prompt-method',
          heading: '2. The R.C.R.L. Method: Writing Prompts That Actually Teach You',
          paragraphs: [
            'Typing "Do my essay on..." produces generic text that teachers spot immediately. Instead, use four structured ingredients so the AI behaves like a patient coach:'
          ],
          numberedSteps: [
            'Role (R): Tell the AI who it is (e.g., "Act as a friendly 7th-grade Computer Science teacher").',
            'Context (C): Share your grade level and where you got stuck (e.g., "I am learning C++ while loops and my sum stays 0").',
            'Request (R): Ask for hints, analogies, or error diagnosis instead of the final copyable solution.',
            'Limit (L): Constrain length and style (e.g., "Use under 120 words, 4 short bullet points, and end with one check question").'
          ],
          codeBlock: {
            title: 'Example R.C.R.L. Prompt for Coding & Math Homework',
            language: 'text',
            code: `Role: You are my Grade 7 Computer Science tutor.
Context: I am trying to sum the digits of an integer n in C++, but my loop gives the wrong answer.
Request: Do not give me the complete fixed code immediately. Explain the difference between n % 10 and n / 10 and give me a single hint.
Limit: Keep it under 110 words and use beginner-friendly terms.`,
            caption: 'Structured prompts turn passive reading into active debugging.'
          }
        },
        {
          id: 'wrong-vs-right-comparison',
          heading: '3. Copy-Paste vs. Active Learning Across Middle School Subjects',
          paragraphs: [
            'Teachers spot automated homework through robotic phrasing, off-curriculum concepts, or inability to answer follow-up questions in class. Compare these real-world habits:'
          ],
          table: {
            caption: 'Wrong vs. Smart AI Usage for Grades 5–8',
            headers: ['Subject', 'Avoid This (Plagiarism Risk)', 'Do This Instead (Real Mastery)'],
            rows: [
              ['ICT / C++', '"Write the complete C++ program for my assignment."', '"Walk me through why while(n > 0) terminates and show a dry-run trace for n = 245."'],
              ['Language Arts', '"Write a 300-word essay on this novel."', '"Here is my own outline. Check if my thesis flows logically and suggest stronger transition words."'],
              ['Mathematics', '"Solve problem #4 and print the final number."', '"I reached step 2 and got x = 14. Can you spot whether my equation setup is valid?"'],
              ['Spreadsheets', '"Generate my Excel project file."', '"Why does my =IF() formula show #NAME? in Excel and how do I fix the syntax?"']
            ]
          }
        },
        {
          id: 'ai-privacy-safety',
          heading: '4. Five Non-Negotiable AI Safety & Privacy Rules for Kids',
          paragraphs: [
            'Digital citizenship standards (including DigComp) require strict privacy habits whenever students interact with online AI tools:'
          ],
          bulletPoints: [
            'Never share your full name, home address, school name, phone number, or ID details in a chat prompt.',
            'Never upload photos of yourself, classmates, teachers, or graded school records.',
            'Always cross-check facts, dates, and formulas with at least two trusted educational sources.',
            'Use a dedicated school-safe email with parental consent before creating accounts on new tools.',
            'Be honest when you used AI for brainstorming—transparency builds trust with teachers and parents.'
          ],
          callout: {
            title: 'Remember Oral Follow-Ups',
            text: 'More teachers verify assignments with quick two-question oral check-ins. When you use AI to understand concepts rather than skip work, you breeze through every check-in.',
            variant: 'warning'
          }
        }
      ],
      checklistTitle: 'Quick Pre-Submission AI Checklist',
      checklist: [
        'I wrote the final sentences or source code myself after understanding every step.',
        'I verified facts, dates, and formulas against my textbook or ArkyEdu lesson.',
        'I removed all personal identifiers from my prompts.',
        'I can explain the solution aloud without reading from a screen.'
      ],
      faqs: [
        {
          question: 'Are middle school students allowed to use ChatGPT for homework?',
          answer: 'Using AI for explanations, practice quizzes, and debugging hints is fine when allowed by your teacher, much like using a dictionary or study guide. Submitting AI-generated text or code as your own work without understanding it counts as plagiarism.'
        },
        {
          question: 'How do teachers detect AI-copied homework?',
          answer: 'AI answers often sound overly formal for ages 10–15, miss class-specific instructions, or contain subtle factual errors. A quick 20-second verbal question in class immediately reveals whether the student actually understands the answer.'
        },
        {
          question: 'What information should kids never type into AI chatbots?',
          answer: 'Never type full names, home addresses, school names, passwords, phone numbers, personal ID numbers, or photos of people.'
        },
        {
          question: 'What is the smartest way to use AI in Computer Science class?',
          answer: 'Ask the chatbot to explain compiler error messages, trace a loop step by step on sample numbers, or explain why a spreadsheet function returned #VALUE! or #NAME?.'
        },
        {
          question: 'Where can students practice coding and digital safety safely for free?',
          answer: 'ArkyEdu offers 40 interactive browser labs for Grades 5–8 covering Safe Browsing, Cloud Collaboration, Scratch, C++, Excel, and Arduino robotics, plus 28 educational arcade games—100% free and ad-free.'
        }
      ],
      internalLinksTitle: 'Practice Hands-On on ArkyEdu (100% Free)',
      internalLinks: [
        {
          label: 'Internet & Safe Browsing Lab (Grade 5)',
          url: '/cursuri/internet-siguranta/',
          missionId: 'internet1',
          description: 'Master safe search habits, HTTPS checks, and digital privacy.'
        },
        {
          label: 'Cloud Collaboration & Teamwork (Grade 7)',
          url: '/cursuri/g7_cloud_a/',
          missionId: 'g7_cloud_a',
          description: 'Learn responsible Google Docs sharing and permissions.'
        },
        {
          label: 'Algorithmic Thinking Foundations (Grade 5)',
          url: '/cursuri/algoritmi/',
          missionId: 'algo1',
          description: 'Build clear step-by-step logic without relying on copy-paste.'
        },
        {
          label: 'Cyber Safe Detective (ICT Arcade)',
          url: '/arcade/',
          targetView: 'arcade',
          description: 'Train your instincts to catch misinformation and online traps.'
        }
      ]
    }
  },
  {
    id: 'erori-cpp-gimnaziu-if-while-algoritmi-cifre',
    category: 'cpp-algorithms',
    gradeTagRo: 'Clasele VII–VIII',
    gradeTagEn: 'Grades 7–8',
    publishedAt: '2026-11-05',
    updatedAt: '2026-11-15',
    featured: true,
    ro: {
      slug: 'erori-cpp-gimnaziu-if-while-algoritmi-cifre',
      title: 'C++ pentru gimnaziu (Code::Blocks, clasele VII–VIII): Top 10 erori la if, while și algoritmi pe cifre',
      metaTitle: 'Top 10 erori C++ gimnaziu: if, while & cifrele unui număr | ArkyEdu',
      metaDescription: 'Rezolvare rapidă pentru cele mai frecvente erori C++ din clasele VII–VIII în Code::Blocks: = vs ==, punct și virgulă după if/while, n%10, n/10, 5/2 și cazul n=0.',
      keywords: 'erori c++ gimnaziu, code blocks erori, if else c++ greseli, bucla while infinita c++, algoritmi pe cifre c++, oglinditul unui numar c++, suma cifrelor c++, tic clasa 7 8 c++',
      breadcrumbLabel: 'Top 10 erori C++ gimnaziu',
      categoryLabel: 'Programare C++ & Algoritmică',
      readTime: '10 min citire',
      tldrTitle: 'Răspuns Rapid (TL;DR)',
      tldr: 'Majoritatea problemelor C++ la gimnaziu provin din 5 capcane clasice: scrierea lui = (atribuire) în loc de == (egalitate) în if, punerea unui ; chiar după paranteza if(...) sau while(...), uitarea actualizării lui n = n / 10 în buclă (buclă infinită), neinițializarea sumei s = 0 și netratarea cazului special n = 0 la algoritmii pe cifre.',
      intro: 'Trecerea de la blocurile vizuale din Scratch la tastarea codului C++ în Code::Blocks este unul dintre cele mai dificile momente din clasele a VII-a și a VIII-a. De multe ori, logica din mintea ta este corectă, dar un singur semn de punctuație sau o împărțire întreagă strică tot rezultatul. Am strâns cele mai întâlnite 10 erori de la lucrări, teme și concursuri — împreună cu soluția exactă pentru fiecare.',
      sections: [
        {
          id: 'tabel-diagnostic-erori-cpp',
          heading: '1. Tabel de diagnostic rapid: De ce nu merge codul meu în C++?',
          paragraphs: [
            'Înainte să ștergi tot programul, caută simptomul în tabelul de mai jos. În 90% din cazuri vei identifica bug-ul în mai puțin de 30 de secunde:'
          ],
          table: {
            caption: 'Cele 10 capcane C++ frecvente în clasele VII–VIII și remedierea lor',
            headers: ['#', 'Greșeala din cod', 'Efectul produs', 'Scrierea corectă'],
            rows: [
              ['1', 'if (a = 5)', 'Atribuie 5 lui a și intră mereu pe ramura DA!', 'if (a == 5)'],
              ['2', 'if (x > 0); { cout << x; }', 'Punctul și virgula termină if-ul; cout se execută mereu!', 'if (x > 0) { cout << x; }'],
              ['3', 'while (n > 0) { s += n % 10; }', 'Buclă infinită: programul îngheață (n nu scade)!', 'Adaugă n = n / 10; în acolade'],
              ['4', 'int s; (fără = 0)', 'Suma pornește cu o valoare reziduală aleatorie din RAM.', 'int s = 0, p = 1;'],
              ['5', 'float m = (a + b) / 2;', 'Împărțire întreagă: (5+6)/2 dă 5 în loc de 5.5!', 'float m = (a + b) / 2.0;'],
              ['6', 'if (1 <= x <= 10)', 'Se evaluează (1<=x) ca 0 sau 1, care e mereu <= 10!', 'if (x >= 1 && x <= 10)'],
              ['7', 'while (n > 0) la numărare cifre', 'Pentru n = 0 afișează 0 cifre în loc de 1 cifră!', 'Tratează separat if (n == 0) sau folosește do...while'],
              ['8', 'Verificare palindrom direct cu n', 'După buclă n devine 0 și îl compari pe oglindit cu 0!', 'Salvează copia: int aux = n; înainte de while'],
              ['9', 'Produsul cifrelor mare în int', 'Depășire (overflow) peste ~2 miliarde -> numere negative.', 'Folosește long long pentru produse/factoriale'],
              ['10', 'Lipsă #include <iostream> / ;', 'Eroare de compilare roșie în Code::Blocks.', 'Verifică antetul și linia de DEASUPRA erorii']
            ]
          }
        },
        {
          id: 'capcane-if-else-operatori',
          heading: '2. Capcanele structurii if / else: = vs ==, intervale și acolade',
          paragraphs: [
            'Cea mai perfidă greșeală din C++ este să confunzi operatorul de atribuire (=) cu operatorul de comparație (==). Compilatorul nu dă eroare de sintaxă dacă scrii if (x = 0) — pur și simplu pune 0 în x, vede că valoarea e falsă și nu mai intră niciodată în if.',
            'O altă greșeală clasică vine din matematică: în caiet scriem 10 <= x <= 99 pentru numere de două cifre, dar în C++ trebuie să legi explicit cele două condiții cu operatorul logic ȘI (&&): x >= 10 && x <= 99.'
          ],
          codeBlock: {
            title: 'Exemplu corect vs. greșit pentru interval și egalitate',
            language: 'cpp',
            code: `#include <iostream>
using namespace std;

int main() {
    int x;
    cin >> x;

    // GRESIT: if (10 <= x <= 99);
    // CORECT: fara ';' dupa paranteza si cu operatorul &&
    if (x >= 10 && x <= 99) {
        cout << "Numar de 2 cifre";
    } else if (x == 0) { // CORECT: == cu doua semne egal
        cout << "Zero";
    } else {
        cout << "Alt numar";
    }
    return 0;
}`,
            caption: 'Observă lipsa punctului și virgulei după paranteze și folosirea acoladelor { } pentru claritate.'
          }
        },
        {
          id: 'algoritmi-cifre-while',
          heading: '3. Algoritmii pe cifre (suma, oglinditul, palindromul și cazul n = 0)',
          paragraphs: [
            'În clasa a VII-a și la admiterea în clasa a IX-a, aproape orice test conține prelucrarea cifrelor unui număr natural cu ajutorul operatorilor % 10 (ultima cifră) și / 10 (eliminarea ultimei cifre).',
            'Cele două greșeli fatale sunt: să uiți copia numărului inițial (int aux = n;) atunci când verifici dacă numărul este palindrom și să uiți cazul n = 0 atunci când numeri cifrele.'
          ],
          codeBlock: {
            title: 'Șablon complet verificat pentru Palindrom & Suma Cifrelor',
            language: 'cpp',
            code: `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;

    int aux = n;      // 1. Salvam copia lui n INAINTE de while!
    int ogl = 0, suma = 0, nrCifre = 0;

    if (n == 0) {     // 2. Cazul special n = 0 are 1 cifra!
        nrCifre = 1;
    }

    while (n > 0) {
        int c = n % 10;       // Extragem ultima cifra
        suma = suma + c;      // Adunam la suma
        ogl = ogl * 10 + c;   // Construim oglinditul
        nrCifre++;            // Numaram cifra
        n = n / 10;           // Taiem ultima cifra (OBLIGATORIU!)
    }

    cout << "Suma cifrelor = " << suma << "\\n";
    cout << "Numar cifre = " << nrCifre << "\\n";
    if (aux == ogl)
        cout << "Este palindrom!";
    else
        cout << "Nu este palindrom!";

    return 0;
}`,
            caption: 'Rulează mental acest cod pentru n = 121 și pentru n = 0 ca să verifici ambele ramuri.'
          },
          callout: {
            title: 'De ce se blochează Code::Blocks cu ecran negru?',
            text: 'Dacă fereastra de consolă rămâne neagră fără să afișeze nimic, verifică dacă ai uitat n = n / 10; în interiorul buclei while sau dacă programul așteaptă să tastezi o valoare la cin >> n.',
            variant: 'warning'
          }
        },
        {
          id: 'impartire-intreaga-si-regula-3-pahare',
          heading: '4. Împărțirea întreagă vs. reală și interschimbarea (Regula celor 3 pahare)',
          paragraphs: [
            'În C++, dacă împarți două numere întregi (de exemplu int a = 7, b = 2; float r = a / b;), rezultatul va fi 3, nu 3.5! Pentru a obține parte zecimală, cel puțin un operand trebuie să fie real: (float)a / b sau împărțirea la 2.0.',
            'Iar când trebuie să interschimbi două variabile a și b (frecvent la ordonări și la maxim/minim), nu scrie niciodată a = b; b = a; deoarece pierzi valoarea lui a. Ai nevoie de un „al treilea pahar” temporar: aux = a; a = b; b = aux;.'
          ],
          numberedSteps: [
            'Torni conținutul paharului A în paharul gol AUX (aux = a;).',
            'Torni conținutul paharului B în paharul A acum liber (a = b;).',
            'Torni valoarea salvată din AUX în paharul B (b = aux;).'
          ]
        }
      ],
      checklistTitle: 'Checklist de depanare C++ înainte să chemi profesorul',
      checklist: [
        'Am verificat fiecare if și while să nu aibă ; imediat după paranteza închisă ).',
        'Toate comparațiile folosesc == (două semne egal), nu =.',
        'Fiecare sumă începe de la 0 (s = 0), iar fiecare produs începe de la 1 (p = 1).',
        'În fiecare buclă while, variabila din condiție se modifică spre oprire (n = n / 10).',
        'Am testat programul și pentru cazuri limită: n = 0, numere negative și numere de 1 cifră.'
      ],
      faqs: [
        {
          question: 'De ce îmi afișează programul C++ doar numere ciudate mari (ex: 4199040)?',
          answer: 'Ai declarat o variabilă (de exemplu int suma;) fără să o inițializezi cu 0 (int suma = 0;). În C++, variabilele locale neinițializate păstrează date reziduale aleatorii din memoria RAM.'
        },
        {
          question: 'Cum rezolv eroarea de compilare când Code::Blocks indică o linie care pare corectă?',
          answer: 'În C++, lipsa punctului și virgulei (;) la finalul unei instrucțiuni determină compilatorul să raporteze eroarea pe linia URMĂTOARE. Verifică întotdeauna linia de deasupra celei subliniate cu roșu.'
        },
        {
          question: 'Care este diferența dintre % și / în C++?',
          answer: 'Operatorul / oferă câtul împărțirii întregi (de exemplu 247 / 10 = 24, elimină ultima cifră), iar operatorul % (modulo) oferă restul împărțirii (247 % 10 = 7, extrage ultima cifră).'
        },
        {
          question: 'Când folosesc while și când folosesc for în gimnaziu?',
          answer: 'Folosește for când știi exact de câte ori se repetă pașii (de exemplu parcurgerea numerelor de la 1 la n sau elementele unui vector). Folosește while când nu știi dinainte numărul de pași (de exemplu prelucrarea cifrelor unui număr până când n devine 0).'
        },
        {
          question: 'Unde pot exersa C++ de gimnaziu interactiv fără să instalez nimic?',
          answer: 'Pe ArkyEdu ai module dedicate pentru Clasa a VII-a și Clasa a VIII-a (Code::Blocks, if/else, while, for, Fibonacci, vectori) și dueluri 1v1 în C++ Code Racer direct din browser.'
        }
      ],
      internalLinksTitle: 'Laboratoare C++ și Dueluri pe ArkyEdu',
      internalLinks: [
        {
          label: 'Tranziția la C++ & Code::Blocks (Clasa a VII-a)',
          url: '/cursuri/g7_cpp_a/',
          missionId: 'g7_cpp_a',
          description: 'Compilare, variabile int/float/char și intrare/ieșire cin/cout.'
        },
        {
          label: 'Structura Alternativă if / else (Clasa a VII-a)',
          url: '/cursuri/g7_decision_a/',
          missionId: 'g7_decision_a',
          description: 'Operatori relaționali și logici (&&, ||, !) exersați interactiv.'
        },
        {
          label: 'Bucla while & Algoritmi pe Cifre (Clasa a VII-a)',
          url: '/cursuri/g7_loop_b/',
          missionId: 'g7_loop_b',
          description: 'Suma cifrelor, oglinditul și palindromul pas cu pas.'
        },
        {
          label: 'Vectori & Șiruri în C++ (Clasa a VIII-a)',
          url: '/cursuri/g8_algo_d/',
          missionId: 'g8_algo_d',
          description: 'Parcurgerea tablourilor unidimensionale și filtrarea valorilor.'
        },
        {
          label: 'Arena Duel 1v1 — C++ Code Racer',
          url: '/duel/',
          targetView: 'duel',
          description: 'Concurează contra cronometru cu colegii sau cu AI Cyber-Bot.'
        }
      ]
    },
    en: {
      slug: 'middle-school-cpp-common-errors-if-while-digits',
      title: 'Middle School C++ Guide (Grades 7–8): Fixing Top 10 Errors in if, while & Digit Algorithms',
      metaTitle: 'Top 10 Middle School C++ Errors: if, while & Digits Fixed | ArkyEdu',
      metaDescription: 'Troubleshoot the 10 most common C++ mistakes in Grades 7–8 (Code::Blocks): = vs ==, stray semicolons after if/while, infinite loops, 5/2 integer division, and n = 0.',
      keywords: 'middle school c++ errors, code blocks troubleshooting, while loop infinite loop c++, sum of digits c++, palindrome c++, integer division c++, learn c++ teens',
      breadcrumbLabel: 'Top 10 C++ Errors Fixed',
      categoryLabel: 'C++ Coding & Algorithms',
      readTime: '10 min read',
      tldrTitle: 'Quick Answer (TL;DR)',
      tldr: 'Nine out of ten middle school C++ bugs come from five traps: writing = instead of == inside if(), placing a stray semicolon right after if(...) or while(...), forgetting n = n / 10 inside a digit loop (infinite loop), leaving sums uninitialized instead of int s = 0, and skipping the edge case n = 0.',
      intro: 'Moving from drag-and-drop Scratch blocks to typing C++ in Code::Blocks is a big leap in Grades 7 and 8. Often your algorithmic logic is spot-on, yet one tiny punctuation mark or integer division rule breaks the entire output. Here are the 10 most common classroom bugs—and exactly how to fix each one.',
      sections: [
        {
          id: 'cpp-diagnostic-table',
          heading: '1. Quick Diagnostic Table: Why Is My C++ Code Failing?',
          paragraphs: [
            'Before rewriting your whole program, match your symptom against this troubleshooting table:'
          ],
          table: {
            caption: 'Top 10 Middle School C++ Mistakes & Instant Fixes',
            headers: ['#', 'Buggy Code', 'What Goes Wrong', 'Correct Code'],
            rows: [
              ['1', 'if (a = 5)', 'Assigns 5 to a instead of checking equality!', 'if (a == 5)'],
              ['2', 'if (x > 0); { cout << x; }', 'Stray semicolon ends the if; cout always runs!', 'if (x > 0) { cout << x; }'],
              ['3', 'while (n > 0) { s += n % 10; }', 'Infinite loop: program freezes because n never shrinks.', 'Add n = n / 10; inside the loop'],
              ['4', 'int s; (without = 0)', 'Sum starts with random garbage value from RAM.', 'int s = 0, p = 1;'],
              ['5', 'float m = (a + b) / 2;', 'Integer division: (5+6)/2 evaluates to 5, not 5.5!', 'float m = (a + b) / 2.0;'],
              ['6', 'if (1 <= x <= 10)', 'Evaluates (1<=x) as 0 or 1, which is always <= 10!', 'if (x >= 1 && x <= 10)'],
              ['7', 'while (n > 0) for digit count', 'Reports 0 digits for n = 0 instead of 1 digit!', 'Handle if (n == 0) or use do...while'],
              ['8', 'Comparing ogl == n directly', 'After the loop, n is 0, so palindrome check fails!', 'Save a copy first: int aux = n;'],
              ['9', 'Large products in int', 'Integer overflow past ~2.1 billion turns negative.', 'Use long long for products/factorials'],
              ['10', 'Missing ; on previous line', 'Compiler highlights the NEXT line in red.', 'Check the line ABOVE the highlighted error']
            ]
          }
        },
        {
          id: 'if-else-traps',
          heading: '2. Branching Traps: = vs ==, Range Checks, and Semicolons',
          paragraphs: [
            'Using = (assignment) instead of == (comparison) compiles without crashing, silently overwrites your variable, and breaks your logic. Likewise, chained math inequalities like 10 <= x <= 99 do not work as expected in C++; always combine two checks with logical AND (&&).'
          ],
          codeBlock: {
            title: 'Clean Range & Equality Checks in C++',
            language: 'cpp',
            code: `#include <iostream>
using namespace std;

int main() {
    int x;
    cin >> x;

    // WRONG: if (10 <= x <= 99);
    // RIGHT: explicit && operator and no stray semicolon
    if (x >= 10 && x <= 99) {
        cout << "Two-digit number";
    } else if (x == 0) { // RIGHT: double equals
        cout << "Zero";
    } else {
        cout << "Other number";
    }
    return 0;
}`,
            caption: 'Notice there is no semicolon after the closing parenthesis of if() or else if().'
          }
        },
        {
          id: 'digit-algorithms-while',
          heading: '3. Digit Algorithms (% 10, / 10, Palindromes & the n = 0 Edge Case)',
          paragraphs: [
            'Almost every middle school algorithm test includes digit extraction using modulo (% 10 for the last digit) and integer division (/ 10 to drop the last digit). Always back up n into a temporary variable (int aux = n;) before destroying n in the loop, and explicitly cover n = 0.'
          ],
          codeBlock: {
            title: 'Bulletproof Palindrome & Digit Sum Template',
            language: 'cpp',
            code: `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;

    int aux = n;      // 1. Save original value BEFORE the loop
    int rev = 0, sum = 0, digits = 0;

    if (n == 0) {     // 2. Handle n = 0 explicitly (1 digit)
        digits = 1;
    }

    while (n > 0) {
        int d = n % 10;      // Extract last digit
        sum = sum + d;       // Accumulate sum
        rev = rev * 10 + d;  // Build reversed number
        digits++;            // Count digit
        n = n / 10;          // Chop last digit (REQUIRED!)
    }

    cout << "Digit sum = " << sum << "\\n";
    cout << "Digit count = " << digits << "\\n";
    if (aux == rev)
        cout << "Palindrome!";
    else
        cout << "Not a palindrome!";

    return 0;
}`,
            caption: 'Dry-run this template on both n = 121 and n = 0 to verify every branch.'
          },
          callout: {
            title: 'Black Console Window Frozen?',
            text: 'If your console opens and prints nothing, check whether you forgot n = n / 10; inside your while loop or if the program is waiting for input at cin >> n.',
            variant: 'warning'
          }
        },
        {
          id: 'division-and-swap',
          heading: '4. Integer vs. Floating-Point Division and the 3-Glass Swap Rule',
          paragraphs: [
            'Dividing two int values like 7 / 2 yields 3, discarding the remainder. Divide by 2.0 or cast (float)a / b whenever you need decimals. And when swapping two variables a and b, always use a third temporary variable (aux = a; a = b; b = aux;) so neither value gets overwritten.'
          ],
          numberedSteps: [
            'Pour glass A into empty temporary glass AUX (aux = a;).',
            'Pour glass B into now-free glass A (a = b;).',
            'Pour the saved value from AUX into glass B (b = aux;).'
          ]
        }
      ],
      checklistTitle: 'Pre-Submit C++ Debugging Checklist',
      checklist: [
        'No stray semicolon ; immediately after any if(...) or while(...).',
        'All equality checks use == instead of =.',
        'Accumulators start at 0 for sums and 1 for products.',
        'Every while loop updates its condition variable toward termination.',
        'Tested edge cases: n = 0, single-digit numbers, and boundary values.'
      ],
      faqs: [
        {
          question: 'Why does my C++ program print huge random numbers like 4199040?',
          answer: 'You declared a local variable (like int sum;) without initializing it (= 0). Uninitialized local variables in C++ hold whatever random bytes were previously in RAM.'
        },
        {
          question: 'Why does Code::Blocks highlight a line that looks completely valid?',
          answer: 'Forgetting a semicolon at the end of one statement makes the compiler report an error on the following line. Always check the line directly above the red indicator.'
        },
        {
          question: 'What is the difference between / and % in C++?',
          answer: 'Integer division / gives the quotient (247 / 10 = 24, dropping the last digit), while modulo % gives the remainder (247 % 10 = 7, extracting the last digit).'
        },
        {
          question: 'When should I pick for vs. while in school exercises?',
          answer: 'Use a for loop when the iteration count is known upfront (e.g., 1 to n or looping through an array). Use while when repetition depends on a changing condition (e.g., dividing n by 10 until n reaches 0).'
        },
        {
          question: 'Where can students practice C++ interactive labs without installing software?',
          answer: 'ArkyEdu includes browser-based Grade 7 & 8 C++ modules (Code::Blocks basics, if/else, while, for, Fibonacci, arrays) plus live 1v1 C++ Code Racer challenges.'
        }
      ],
      internalLinksTitle: 'Interactive C++ Labs & 1v1 Duels on ArkyEdu',
      internalLinks: [
        {
          label: 'C++ & Code::Blocks Fundamentals (Grade 7)',
          url: '/cursuri/g7_cpp_a/',
          missionId: 'g7_cpp_a',
          description: 'Master compilation, data types, and cin/cout step by step.'
        },
        {
          label: 'if / else Branching & Logic Operators (Grade 7)',
          url: '/cursuri/g7_decision_a/',
          missionId: 'g7_decision_a',
          description: 'Practice relational and boolean operators interactively.'
        },
        {
          label: 'while Loops & Digit Algorithms (Grade 7)',
          url: '/cursuri/g7_loop_b/',
          missionId: 'g7_loop_b',
          description: 'Build digit sum, reverse, and palindrome logic hands-on.'
        },
        {
          label: 'Arrays & Sequences in C++ (Grade 8)',
          url: '/cursuri/g8_algo_d/',
          missionId: 'g8_algo_d',
          description: 'Iterate arrays, filter elements, and compute statistics.'
        },
        {
          label: '1v1 Duel Arena — C++ Code Racer',
          url: '/duel/',
          targetView: 'duel',
          description: 'Challenge classmates or AI Cyber-Bot in real-time coding sprints.'
        }
      ]
    }
  },
  {
    id: 'formule-excel-gimnaziu-sum-average-if-countif-erori',
    category: 'excel-office',
    gradeTagRo: 'Clasa a VIII-a',
    gradeTagEn: 'Grade 8',
    publishedAt: '2026-11-08',
    updatedAt: '2026-11-15',
    featured: true,
    ro: {
      slug: 'formule-excel-gimnaziu-sum-average-if-countif-erori',
      title: 'Excel pe înțelesul elevilor (Clasa a VIII-a): Formulele SUM, AVERAGE, IF, COUNTIF, $A$1 și rezolvarea erorilor',
      metaTitle: 'Formule Excel clasa a 8-a: SUM, IF, COUNTIF, $A$1 & erori | ArkyEdu',
      metaDescription: 'Ghid complet de Calcul Tabelar (Excel & Google Sheets) pentru clasa a VIII-a: sintaxa SUM, AVERAGE, IF, COUNTIF, referințe absolute $A$1, separatorul ; vs , și erorile #VALUE! / #NAME?.',
      keywords: 'formule excel clasa 8, functia if excel exemple, countif excel, referinta absoluta $a$1 excel, eroare #value! #name? excel, punct si virgula vs virgula excel, calcul tabelar tic gimnaziu',
      breadcrumbLabel: 'Formule Excel & Rezolvare Erori',
      categoryLabel: 'Excel & Calcul Tabelar',
      readTime: '9 min citire',
      tldrTitle: 'Răspuns Rapid (TL;DR)',
      tldr: 'Orice formulă Excel începe obligatoriu cu semnul =. În România (setări regionale RO), argumentele din funcții precum =IF(B2>=5; "Admis"; "Respins") se separă prin punct și virgulă (;), nu prin virgulă. Pentru a bloca o celulă când tragi formula în jos (Autofill), apasă F4 pentru a obține referința absolută $A$1.',
      intro: 'Calculul tabelar din clasa a VIII-a (Microsoft Excel și Google Sheets) este una dintre cele mai utile competențe din toată programa de TIC — dar și locul unde elevii pierd puncte din detalii mici: uită semnul =, pun virgulă în loc de punct și virgulă sau nu blochează o celulă cu $. Iată ghidul complet, cu exemple de catalog școlar și soluții pentru fiecare mesaj de eroare.',
      sections: [
        {
          id: 'separator-virgula-vs-punct-si-virgula',
          heading: '1. De ce formula corectă din manual îți dă eroare? Misterul lui ; vs ,',
          paragraphs: [
            'Aceasta este cea mai frecventă surpriză din laboratorul de informatică. Pe Windows în limba română, virgula este folosită pentru zecimale (de exemplu nota 9,50), așa că Excel cere punct și virgulă (;) ca separator între argumentele unei funcții.',
            'În schimb, în Google Sheets (setat pe Engleză/US) sau în tutorialele americane, separatorul este virgula (,). Dacă primești fereastra „There is a problem with this formula”, schimbă imediat separatorul dintre argumente din , în ; (sau invers).'
          ],
          callout: {
            title: 'Truc rapid din tastatură',
            text: 'Când începi să tastezi =IF( , privește eticheta albă care apare chiar sub celulă: Excel îți arată exact ce separator așteaptă sistemul tău (; sau ,).',
            variant: 'tip'
          }
        },
        {
          id: 'top-6-functii-excel-gimnaziu',
          heading: '2. Cele 6 funcții esențiale de clasa a VIII-a (cu exemple reale de catalog)',
          paragraphs: [
            'Imaginează-ți un tabel cu notele elevilor pe coloana B (celulele B2:B10) și statutul în coloana C. Acestea sunt formulele care apar în aproape toate lucrările de control:'
          ],
          table: {
            caption: 'Funcții Excel esențiale pentru Clasa a VIII-a',
            headers: ['Funcție', 'Exemplu formulă (RO)', 'Ce calculează concret'],
            rows: [
              ['SUM', '=SUM(B2:B10)', 'Adună toate valorile din intervalul B2 până la B10.'],
              ['AVERAGE', '=AVERAGE(B2:B10)', 'Calculează media aritmetică (ignoră celulele goale).'],
              ['MIN / MAX', '=MAX(B2:B10)', 'Returnează cea mai mare (sau cea mai mică cu MIN) notă din coloană.'],
              ['IF (Decizie)', '=IF(B2>=5; "Promovat"; "Corijent")', 'Testează o condiție și afișează primul text dacă e adevărată, al doilea dacă e falsă.'],
              ['COUNTIF', '=COUNTIF(B2:B10; ">=9")', 'Numără câți elevi au nota mai mare sau egală cu 9.'],
              ['IF imbricat', '=IF(B2>=9; "Foarte bine"; IF(B2>=5; "Admis"; "Respins"))', 'Clasificare pe 3 niveluri folosind două funcții IF una în alta.']
            ]
          },
          codeBlock: {
            title: 'Atenție la ghilimele în funcțiile IF și COUNTIF!',
            language: 'excel',
            code: `// CORECT: Textele si conditiile cu >= din COUNTIF stau intre ghilimele duble " "
=IF(B2>=5; "Promovat"; "Respins")
=COUNTIF(C2:C25; "Promovat")
=COUNTIF(B2:B25; ">=8")

// GRESIT: Lipsa ghilimelelor duce la eroarea #NAME?
=IF(B2>=5; Promovat; Respins)`,
            caption: 'Numerele simple (5, 10) nu au nevoie de ghilimele; cuvintele și comparațiile din COUNTIF au întotdeauna ghilimele.'
          }
        },
        {
          id: 'referinte-relative-vs-absolute',
          heading: '3. Referințe relative (A1) vs. absolute ($A$1): Secretul Autofill-ului fără greșeli',
          paragraphs: [
            'Când scrii =B2*C2 în celula D2 și tragi de pătrățelul din colțul dreapta-jos (Autofill), Excel modifică automat formula în =B3*C3, =B4*C4. Aceasta este o referință relativă — utilă când fiecare rând are datele lui.',
            'Dar ce faci dacă vrei să înmulțești toate prețurile din coloana B cu un singur curs Euro aflat mereu în celula F1? Dacă scrii =B2*F1 și tragi în jos, pe rândul 3 devine =B3*F2 (celulă goală, rezultat 0!). Soluția este să blochezi celula F1 cu semnul dolar ($): =B2*$F$1.'
          ],
          numberedSteps: [
            'Selectează în bară referința pe care vrei să o blochezi (de exemplu F1).',
            'Apasă tasta F4 o dată (sau Fn + F4 pe laptop) — Excel adaugă automat $F$1.',
            'Confirmă cu Enter și trage formula cu Autofill pe toată coloana: B2 se schimbă în B3, B4, dar $F$1 rămâne ancorat.'
          ]
        },
        {
          id: 'decodare-erori-excel',
          heading: '4. Cum repari cele 5 erori clasice din Excel (#NAME?, #VALUE!, #DIV/0!, #REF!, ###)',
          paragraphs: [
            'Mesajele cu diez (#) nu înseamnă că Excel s-a stricat, ci sunt indicii precise despre ce trebuie corectat:'
          ],
          table: {
            caption: 'Ghid de reparare rapidă a erorilor Excel',
            headers: ['Eroare afișată', 'Cauza reală', 'Cum o rezolvi imediat'],
            rows: [
              ['#NAME?', 'Ai scris greșit numele funcției (ex: =AVARAGE) sau ai uitat ghilimelele la text.', 'Verifică ortografia funcției și pune ghilimele " " în jurul cuvintelor.'],
              ['#VALUE!', 'Încerci să aduni un număr cu un text (ex: celula conține „10 lei” în loc de 10).', 'Păstrează doar cifre în celulele de calcul; adaugă moneda din Format Cells.'],
              ['#DIV/0!', 'Formula împarte la zero sau la o celulă complet goală.', 'Verifică numitorul împărțirii sau folosește =IF(B2=0; 0; A2/B2).'],
              ['#REF!', 'Ai șters un rând/o coloană care era folosită de formulă.', 'Apasă Ctrl+Z (Undo) și actualizează intervalul formulei.'],
              ['######', 'Nu e o eroare de calcul! Coloana e prea îngustă pentru a afișa numărul/data.', 'Dă dublu-click pe linia despărțitoare dintre literele coloanelor de sus.']
            ]
          }
        }
      ],
      checklistTitle: 'Checklist înainte de evaluarea la Excel (Clasa a VIII-a)',
      checklist: [
        'Fiecare calcul este realizat prin formulă cu =, nu calculat manual „în cap”.',
        'Celulele fixe (TVA, curs valutar, punctaj maxim) sunt blocate cu $ ($F$1).',
        'Nu există nicio celulă cu erori (#NAME?, #VALUE!, #DIV/0!) sau coloane trunchiate (###).',
        'Diagrama aleasă are titlu clar și tip potrivit (Coloane pentru comparații, Pie pentru procente din total).'
      ],
      faqs: [
        {
          question: 'De ce formulele mele din Excel nu calculează și rămân scrise ca text?',
          answer: 'Fie ai uitat semnul = la începutul celulei (obligatoriu înainte de SUM, IF, AVERAGE), fie celula a fost formatată anterior ca Text. Schimbă formatul pe General, dă dublu-click în celulă și apasă Enter.'
        },
        {
          question: 'Cum aleg corect între Diagramă Coloane (Column), Linii (Line) și Plăcintă (Pie)?',
          answer: 'Folosește Coloane/Bare când compari valori între categorii (ex: note pe elevi), Linii când arăți evoluția în timp (ex: temperaturi pe luni) și Pie (Plăcintă) exclusiv când împarți un singur total de 100% în câteva felii.'
        },
        {
          question: 'Care este diferența dintre COUNT și COUNTA sau COUNTIF?',
          answer: 'COUNT numără doar celulele cu numere, COUNTA numără toate celulele nevide (inclusiv text), iar COUNTIF numără doar celulele care îndeplinesc o condiție dată de tine (de exemplu >= 5).'
        },
        {
          question: 'Cum se traduc funcțiile Excel dacă lucrez pe o versiune în limba română?',
          answer: 'Majoritatea școlilor din România folosesc interfața în Engleză (SUM, AVERAGE, IF, MIN, MAX, COUNTIF) cu separator ;. Dacă Excel-ul este tradus complet în română, funcțiile devin SUMA, MEDIA, DACA — verifică lista sugestiilor când tastezi =.'
        },
        {
          question: 'Unde pot exersa formulele Excel pentru clasa a VIII-a interactiv?',
          answer: 'Pe ArkyEdu ai toate cele 4 module interactive de Calcul Tabelar pentru clasa a VIII-a: adrese de celule, formatare/sortare, formule SUM/AVERAGE/IF/COUNTIF/$A$1 și diagrame 2D/3D, 100% gratuit.'
        }
      ],
      internalLinksTitle: 'Exersează Excel Clasa a VIII-a pe ArkyEdu',
      internalLinks: [
        {
          label: 'Registru Excel, Celule & Adrese (Clasa a VIII-a)',
          url: '/cursuri/g8_calc_a/',
          missionId: 'g8_calc_a',
          description: 'Înțelege foile de calcul, Name Box și domeniile de celule.'
        },
        {
          label: 'Formatare, Autofill & Sortare (Clasa a VIII-a)',
          url: '/cursuri/g8_calc_b/',
          missionId: 'g8_calc_b',
          description: 'Tipuri de date corecte pentru a evita erorile #VALUE!.'
        },
        {
          label: 'Formule & Funcții Specializate: SUM, IF, COUNTIF',
          url: '/cursuri/g8_calc_c/',
          missionId: 'g8_calc_c',
          description: 'Simulator interactiv pentru funcții logice și referințe $A$1.'
        },
        {
          label: 'Diagrame 2D/3D & Filtre (Clasa a VIII-a)',
          url: '/cursuri/g8_calc_d/',
          missionId: 'g8_calc_d',
          description: 'Construiește grafice clare și filtrează tabele școlare.'
        }
      ]
    },
    en: {
      slug: 'excel-formulas-middle-school-sum-if-countif-errors',
      title: 'Excel Formulas for Middle School (Grade 8): Mastering SUM, AVERAGE, IF, COUNTIF, $A$1 & Error Fixes',
      metaTitle: 'Middle School Excel Guide: SUM, IF, COUNTIF, $A$1 & Errors | ArkyEdu',
      metaDescription: 'Complete Grade 8 spreadsheet guide for Excel & Google Sheets: master SUM, AVERAGE, IF, COUNTIF, absolute references ($A$1), semicolon vs comma syntax, and #VALUE! / #NAME? fixes.',
      keywords: 'excel formulas middle school, how to use if function excel, countif tutorial students, absolute reference $a$1, fix #value #name errors excel, google sheets grade 8 ict',
      breadcrumbLabel: 'Excel Formulas & Error Fixes',
      categoryLabel: 'Spreadsheets & Office Skills',
      readTime: '9 min read',
      tldrTitle: 'Quick Answer (TL;DR)',
      tldr: 'Every spreadsheet formula must start with =. Depending on your computer’s regional settings, function arguments are separated by a comma (US/UK) or semicolon (many European locales). Press F4 to turn A1 into an absolute reference ($A$1) so Autofill keeps pointing to the exact same cell.',
      intro: 'Spreadsheets in Grade 8 (Microsoft Excel and Google Sheets) are among the most practical life skills taught in school—yet students frequently lose marks over small syntax details like forgetting =, missing quotation marks around text, or letting Autofill shift a fixed cell. This guide covers every core formula and error message you will face in class.',
      sections: [
        {
          id: 'comma-vs-semicolon',
          heading: '1. Why Did a Textbook Formula Throw an Error? Comma vs. Semicolon',
          paragraphs: [
            'One of the biggest classroom surprises happens when a textbook shows =IF(B2>=5, "Pass", "Fail") with commas, yet Excel rejects it. On systems whose regional settings use commas for decimal numbers (like 9,50), Excel requires semicolons (;) between arguments instead.',
            'Watch the white tooltip that pops up underneath your cell right after typing =IF(: Excel displays the exact delimiter expected on that machine.'
          ],
          callout: {
            title: 'One-Second Formula Check',
            text: 'If you see a "There is a problem with this formula" alert, swap commas (,) for semicolons (;) or check for missing double quotes.',
            variant: 'tip'
          }
        },
        {
          id: 'core-grade8-functions',
          heading: '2. Six Must-Know Functions Using a Real Classroom Gradebook',
          paragraphs: [
            'Suppose student grades sit in range B2:B10 and statuses in column C. These six formulas cover nearly every Grade 8 quiz and practical exam:'
          ],
          table: {
            caption: 'Essential Grade 8 Spreadsheet Functions',
            headers: ['Function', 'Formula Example', 'What It Does'],
            rows: [
              ['SUM', '=SUM(B2:B10)', 'Adds every numeric value from B2 through B10.'],
              ['AVERAGE', '=AVERAGE(B2:B10)', 'Computes the arithmetic mean (ignoring blank cells).'],
              ['MIN / MAX', '=MAX(B2:B10)', 'Returns the highest (or lowest with MIN) score in the range.'],
              ['IF (Decision)', '=IF(B2>=5, "Pass", "Fail")', 'Tests a condition and outputs the first result if true, second if false.'],
              ['COUNTIF', '=COUNTIF(B2:B10, ">=9")', 'Counts how many scores are greater than or equal to 9.'],
              ['Nested IF', '=IF(B2>=9, "Great", IF(B2>=5, "Pass", "Fail"))', 'Classifies rows into three tiers by nesting a second IF inside the first.']
            ]
          },
          codeBlock: {
            title: 'Remember Double Quotes Around Text & COUNTIF Criteria!',
            language: 'excel',
            code: `// RIGHT: Words and comparison strings in COUNTIF require " "
=IF(B2>=5, "Pass", "Fail")
=COUNTIF(C2:C25, "Pass")
=COUNTIF(B2:B25, ">=8")

// WRONG: Unquoted words trigger #NAME?
=IF(B2>=5, Pass, Fail)`,
            caption: 'Plain numbers (5, 10) never need quotes; text labels and COUNTIF conditions always do.'
          }
        },
        {
          id: 'relative-vs-absolute',
          heading: '3. Relative (A1) vs. Absolute ($A$1) References: Dragging Formulas Safely',
          paragraphs: [
            'When you enter =B2*C2 in D2 and drag the fill handle down, Excel updates each row to =B3*C3, =B4*C4 automatically. That relative behavior is helpful until every row needs to multiply against one fixed cell—such as a tax rate or exchange rate stored in F1.',
            'Without dollar signs, dragging =B2*F1 down turns into =B3*F2 (an empty cell), returning 0! Lock both column and row with $ signs: =B2*$F$1.'
          ],
          numberedSteps: [
            'Click the cell address you want to lock inside the formula bar (e.g., F1).',
            'Press F4 once (or Fn + F4 on laptops) to convert F1 into $F$1.',
            'Press Enter and drag the fill handle down: B2 advances to B3, B4, while $F$1 stays anchored.'
          ]
        },
        {
          id: 'fix-excel-errors',
          heading: '4. Decoding the 5 Common Spreadsheet Errors (#NAME?, #VALUE!, #DIV/0!, #REF!, ###)',
          paragraphs: [
            'Pound-sign error codes look scary, but each one points directly to the fix:'
          ],
          table: {
            caption: 'Spreadsheet Error Troubleshooting Guide',
            headers: ['Error Code', 'Root Cause', 'Fast Fix'],
            rows: [
              ['#NAME?', 'Misspelled function name (=AVARAGE) or unquoted text.', 'Fix the spelling and wrap text strings in double quotes " ".'],
              ['#VALUE!', 'Doing math on text (e.g., typing "10 USD" instead of 10).', 'Keep pure numbers in cells and apply currency formatting instead.'],
              ['#DIV/0!', 'Dividing by zero or an empty cell.', 'Check the divisor or wrap with =IF(B2=0, 0, A2/B2).'],
              ['#REF!', 'A referenced row or column was deleted.', 'Press Ctrl+Z (Undo) and update the formula range.'],
              ['######', 'Not a formula bug! The column is just too narrow to display the value.', 'Double-click the border between column letters at the top.']
            ]
          }
        }
      ],
      checklistTitle: 'Grade 8 Spreadsheet Grading Checklist',
      checklist: [
        'Every total, average, and status uses a live = formula rather than hand-typed numbers.',
        'Shared constants (tax rate, exchange rate, max points) are locked with $ ($F$1).',
        'Zero formula errors (#NAME?, #VALUE!, #DIV/0!) or truncated ### columns appear.',
        'Charts include clear titles and match the data type (Column for comparison, Pie for % share).'
      ],
      faqs: [
        {
          question: 'Why does Excel show my formula as plain text instead of calculating it?',
          answer: 'Either the cell is missing the leading = sign, or the cell was pre-formatted as Text. Switch the number format back to General, double-click the cell, and press Enter.'
        },
        {
          question: 'When should students pick a Column, Line, or Pie chart?',
          answer: 'Use Column/Bar charts to compare categories (student scores), Line charts to track change over time (monthly temperatures), and Pie charts strictly when parts add up to 100% of one whole.'
        },
        {
          question: 'What is the difference between COUNT, COUNTA, and COUNTIF?',
          answer: 'COUNT tallies numeric cells only, COUNTA tallies all non-empty cells (text + numbers), and COUNTIF counts only cells matching your condition (like ">=5").'
        },
        {
          question: 'How can students lock just a column or just a row?',
          answer: 'Pressing F4 repeatedly cycles through $A$1 (both locked), A$1 (row locked), $A1 (column locked), and A1 (relative).'
        },
        {
          question: 'Where can students practice Grade 8 spreadsheets interactively for free?',
          answer: 'ArkyEdu provides all four Grade 8 interactive spreadsheet labs covering cell addressing, Autofill sorting, SUM/IF/COUNTIF/$A$1 formulas, and 2D/3D charts directly in the browser.'
        }
      ],
      internalLinksTitle: 'Practice Grade 8 Spreadsheets on ArkyEdu',
      internalLinks: [
        {
          label: 'Workbooks, Cells & Ranges (Grade 8)',
          url: '/cursuri/g8_calc_a/',
          missionId: 'g8_calc_a',
          description: 'Master worksheets, Name Box, and cell selection.'
        },
        {
          label: 'Cell Formatting, Autofill & Sorting (Grade 8)',
          url: '/cursuri/g8_calc_b/',
          missionId: 'g8_calc_b',
          description: 'Format data types cleanly to avoid #VALUE! mistakes.'
        },
        {
          label: 'Formulas: SUM, AVERAGE, IF, COUNTIF & $A$1',
          url: '/cursuri/g8_calc_c/',
          missionId: 'g8_calc_c',
          description: 'Hands-on browser lab for logical formulas and cell locking.'
        },
        {
          label: '2D/3D Charts & Data Filters (Grade 8)',
          url: '/cursuri/g8_calc_d/',
          missionId: 'g8_calc_d',
          description: 'Pick the right chart type and filter tables cleanly.'
        }
      ]
    }
  },
  {
    id: 'siguranta-copii-tiktok-roblox-discord-phishing-2fa',
    category: 'cyber-safety',
    gradeTagRo: 'Clasele V–VIII & Părinți',
    gradeTagEn: 'Grades 5–8 & Parents',
    publishedAt: '2026-11-10',
    updatedAt: '2026-11-15',
    featured: true,
    ro: {
      slug: 'siguranta-copii-tiktok-roblox-discord-phishing-2fa',
      title: 'Siguranța copiilor pe TikTok, Roblox, Discord și WhatsApp: Cum oprești scam-urile, phishing-ul și cyberbullying-ul',
      metaTitle: 'Siguranța copiilor pe TikTok, Roblox & Discord: Phishing & 2FA | ArkyEdu',
      metaDescription: 'Ghid practic pentru elevi și părinți (2025–2026): cum recunoști capcanele Free Robux, linkurile false pe WhatsApp, parolele sigure, activarea 2FA și numărul 119 pentru cyberbullying.',
      keywords: 'siguranta copii internet, scam roblox free robux, phishing whatsapp link vot, siguranta tiktok discord copii, parola sigura 2fa copii, cyberbullying numar 119, securitate cibernetica gimnaziu',
      breadcrumbLabel: 'Siguranța pe TikTok, Roblox & Discord',
      categoryLabel: 'Securitate Cibernetică',
      readTime: '9 min citire',
      tldrTitle: 'Răspuns Rapid (TL;DR)',
      tldr: 'Cele mai multe conturi de Roblox, TikTok sau WhatsApp ale elevilor se pierd prin inginerie socială și phishing (site-uri de „Free Robux”, mesaje false de vot pe WhatsApp sau fișiere pe Discord), nu prin spargeri complexe. Activează autentificarea în 2 pași (2FA), verifică domeniul exact din bara de adresă și folosește fraze-parolă unice. În caz de hărțuire sau șantaj online, salvează capturi de ecran și sună gratuit la 119.',
      intro: 'Astăzi, primele amenințări cibernetice nu mai vin prin e-mailuri vechi cu prinți misterioși, ci direct pe platformele unde elevii de gimnaziu petrec ore zilnic: Roblox, Discord, TikTok și grupurile de WhatsApp. Acest ghid explică pe înțelesul copiilor și părinților cum arată exact capcanele moderne și ce 4 setări blochează 99% dintre atacuri.',
      sections: [
        {
          id: 'top-4-scamuri-elevi',
          heading: '1. Top 4 capcane digitale care vizează elevii din România în 2025–2026',
          paragraphs: [
            'Atacatorii mizează pe curiozitate, grabă sau dorința de recompense gratuite în jocuri. Dacă recunoști tiparul din tabelul următor, nu vei cădea niciodată în cursă:'
          ],
          table: {
            caption: 'Scam-uri frecvente pe platformele folosite de elevi',
            headers: ['Platformă', 'Cum arată capcana', 'Ce se întâmplă în spate'],
            rows: [
              ['Roblox', 'Link „Free Robux” sau mesaj în chat: „Intră pe robl0x-gift... să primești 5.000 Robux”.', 'Pagină falsă (typosquatting) care îți fură parola și îți vinde itemele din inventar.'],
              ['WhatsApp', 'Mesaj de la un coleg deja spart: „Te rog votează pentru nepoata mea la concursul X, click aici!”.', 'Îți cere codul SMS din 6 cifre și îți preia instantaneu contul de WhatsApp pentru a păcăli și alte contacte.'],
              ['Discord', 'Un necunoscut oferă „testare joc nou / skin gratis” și trimite un fișier .zip sau .exe.', 'Este un infostealer (malware) care fură parolele salvate în browser și sesiunile active.'],
              ['TikTok / IG', 'Cont clonat sau mesaj fals „Încălcare drepturi de autor — confirmă parola în 24h”.', 'Phishing clasic: încearcă să obțină acces la cont și la e-mailul asociat.']
            ]
          }
        },
        {
          id: 'regula-verificare-link-10-secunde',
          heading: '2. Regula de 10 secunde: Cum verifici orice link înainte să dai click sau să te loghezi',
          paragraphs: [
            'Lăcățelul HTTPS din browser înseamnă doar că legătura dintre tine și acel server este criptată — chiar și un site fals de phishing are astăzi certificat HTTPS! Lucrul esențial pe care trebuie să îl verifici este numele exact al domeniului, chiar înainte de primul slash (/).'
          ],
          numberedSteps: [
            'Citește domeniul de la dreapta la stânga înainte de „/”: în „roblox.com.free-gifts.xyz”, site-ul real este „free-gifts.xyz”, NU „roblox.com”!',
            'Caută litere schimbate perfid: „rn” în loc de „m”, cifra „0” în loc de „o” (disccrd / r0blox).',
            'Nu introduce niciodată parola unui cont după ce ai apăsat un link primit în mesaj. Deschide manual aplicația oficială sau tastează tu adresa site-ului în browser.'
          ],
          callout: {
            title: 'Regula codului din 6 cifre (OTP)',
            text: 'Nimeni — nici un prieten, nici un concurs de dans, nici „suportul tehnic” — nu are nevoie de codul tău din 6 cifre primit prin SMS. Cine îl cere vrea să îți preia contul.',
            variant: 'warning'
          }
        },
        {
          id: 'parole-fraza-si-2fa',
          heading: '3. Parole imposibil de ghicit + Autentificarea în 2 Pași (2FA)',
          paragraphs: [
            'Parolele de tipul „Alex2013” sau „parola123” sunt sparte de programe automate în mai puțin de o secundă. În schimb, o frază-parolă lungă este și ușor de reținut de un copil, și aproape imposibil de spart.',
            'Combină 3–4 cuvinte neobișnuite cu un număr și un simbol (de exemplu: „UrsulAlb!Mananca47Capsuni”). Apoi activează autentificarea în 2 pași (2FA) pe Roblox, Google, TikTok și Discord — chiar dacă cineva îți află parola, nu poate intra fără telefonul tău.'
          ],
          bulletPoints: [
            'Folosește o parolă diferită pentru e-mail față de jocurile online (e-mailul este cheia tuturor celorlalte conturi).',
            'Activează 2FA din Settings -> Security folosind o aplicație Authenticator sau numărul de telefon al părintelui.',
            'Nu salva parole pe calculatoarele din laboratorul școlii și apasă întotdeauna Log Out la finalul orei de TIC.'
          ]
        },
        {
          id: 'cyberbullying-si-linia-119',
          heading: '4. Ce faci în caz de cyberbullying, șantaj sau cont spart (Ghid + Numărul 119)',
          paragraphs: [
            'Hărțuirea online (cyberbullying), jignirile pe grupuri de clasă, distribuirea pozelor fără acord sau amenințările nu sunt „glume de internet” și nu trebuie ascunse de rușine sau de frică.'
          ],
          numberedSteps: [
            'NU șterge mesajele și nu răspunde cu jigniri: fă capturi de ecran (screenshots) clare cu data, ora și profilul agresorului.',
            'Folosește imediat opțiunile Block (Blochează) și Report (Raportează) din aplicație.',
            'Spune imediat unui părinte, dirigintelui sau consilierului școlar. Nu ești vinovat dacă cineva te hărțuiește.',
            'În România, orice copil sau părinte poate apela gratuit și confidențial numărul național unic 119 pentru ajutor specializat.'
          ]
        }
      ],
      checklistTitle: 'Checklist de securitate digitală în familie (5 minute)',
      checklist: [
        'Conturile importante (Google, Roblox, Discord, TikTok) au 2FA (autentificare în 2 pași) activat.',
        'Profilurile sociale ale minorilor sunt setate pe Privat, cu mesajele blocate de la necunoscuți.',
        'Parola de la e-mail este unică și lungă (minim 12–14 caractere).',
        'Copilul știe că nu dă nimănui coduri SMS, poze personale sau parole pentru „premii gratis”.'
      ],
      faqs: [
        {
          question: 'Chiar există site-uri legitime de „Free Robux” sau diamante gratuite?',
          answer: 'Nu! Nicio aplicație sau site extern nu poate genera monedă gratuită în Roblox, Brawl Stars sau Fortnite. Toate paginile care promit resurse gratuite în schimbul login-ului sau al unui sondaj sunt capcane de phishing sau adware.'
        },
        {
          question: 'Dacă un site are lacătul HTTPS înseamnă că este 100% sigur?',
          answer: 'Nu. HTTPS garantează doar că traficul este criptat pe drum, nu că proprietarul site-ului este cinstit. Verifică întotdeauna numele exact al domeniului (de exemplu roblox.com, nu roblox-bonus.xyz).'
        },
        {
          question: 'Ce este mai bun: o parolă scurtă cu simboluri sau o frază lungă?',
          answer: 'O frază-parolă lungă (14+ caractere cu cuvinte nelegate + cifre și simbol) este mult mai rezistentă la atacuri brute-force și mult mai ușor de ținut minte fără să o scrii pe bilet.'
        },
        {
          question: 'Cum pot recupera un cont de WhatsApp spart prin linkul fals cu votul?',
          answer: 'Încearcă să te autentifici din nou cu numărul tău în WhatsApp, cere un nou cod SMS sau apel vocal și activează imediat Verificarea în doi pași (PIN din 6 cifre) din Setări -> Cont pentru a bloca accesul atacatorilor.'
        },
        {
          question: 'Unde pot învăța copiii securitatea cibernetică prin jocuri practice?',
          answer: 'Pe ArkyEdu găsești modulele interactive Malware & Securitate Cibernetică și E-mail & Netichetă (Clasa a VI-a), plus jocurile arcade Virus Sweeper, Apărare Firewall și Detectivul de Amenințări.'
        }
      ],
      internalLinksTitle: 'Exersează Securitatea Cibernetică prin Joc pe ArkyEdu',
      internalLinks: [
        {
          label: 'Malware, Parole & 2FA (Clasa a VI-a)',
          url: '/cursuri/malware-securitate/',
          missionId: 'g6_malware',
          description: 'Învață diferența dintre viruși, troieni, ransomware și cum creezi 2FA.'
        },
        {
          label: 'E-mail, Netichetă & Prevenire Cyberbullying (Clasa a VI-a)',
          url: '/cursuri/email-neticheta/',
          missionId: 'g6_email',
          description: 'Bune maniere digitale, CC/BCC și protecția în mediul online.'
        },
        {
          label: 'Virus Sweeper & Firewall Defender (Arcade)',
          url: '/arcade/',
          targetView: 'arcade',
          description: 'Filtrează pachetele malițioase și prinde capcanele de phishing.'
        },
        {
          label: 'Hacker vs Defender 1v1 (Arena Duel)',
          url: '/duel/',
          targetView: 'duel',
          description: 'Testează-ți reflexele de apărare cibernetică într-un duel live.'
        }
      ]
    },
    en: {
      slug: 'kids-online-safety-tiktok-roblox-discord-phishing',
      title: 'Kids Online Safety on TikTok, Roblox, Discord & WhatsApp: Stopping Scams, Phishing & Cyberbullying',
      metaTitle: 'Kids Online Safety: TikTok, Roblox, Discord Scams & 2FA | ArkyEdu',
      metaDescription: 'Practical cyber safety guide for Grades 5–8 students and parents: spot Free Robux traps, WhatsApp voting scams, Discord malware, build strong passphrases, enable 2FA, and handle cyberbullying.',
      keywords: 'kids online safety guide, roblox free robux scam, discord malware safety, whatsapp vote link scam, 2fa for kids accounts, cyberbullying help middle school, cybersecurity lessons kids',
      breadcrumbLabel: 'Online Safety: TikTok, Roblox & Discord',
      categoryLabel: 'Cyber Safety',
      readTime: '9 min read',
      tldrTitle: 'Quick Answer (TL;DR)',
      tldr: 'Most student accounts on Roblox, Discord, or WhatsApp are hijacked through social engineering—fake "Free Robux" pages, compromised WhatsApp "vote for my cousin" links, or shady Discord game downloads—not complex hacking. Turn on 2-Factor Authentication (2FA), inspect the exact domain before signing in, use unique passphrases, and save screenshots if cyberbullying occurs.',
      intro: 'Modern online threats rarely arrive in formal emails—they show up directly inside the apps middle schoolers open every day: Roblox, Discord, TikTok, and class WhatsApp chats. This guide gives students and parents a clear playbook to spot the newest traps and lock down accounts in five minutes.',
      sections: [
        {
          id: 'top-4-kid-scams',
          heading: '1. Four Real Scams Targeting Middle Schoolers Today',
          paragraphs: [
            'Scammers rely on urgency, peer trust, and promises of free in-game items. Recognize these four patterns before clicking:'
          ],
          table: {
            caption: 'Common Social & Gaming Scams Explained',
            headers: ['Platform', 'What the Trap Looks Like', 'What Actually Happens'],
            rows: [
              ['Roblox', 'In-game chat or link: "Visit robl0x-gift... to claim 5,000 Free Robux."', 'Lookalike phishing page (typosquatting) steals your password and trades away items.'],
              ['WhatsApp', 'Message from a hacked classmate: "Please vote for my niece in this contest!"', 'Asks for your 6-digit SMS login code and immediately hijacks your WhatsApp account.'],
              ['Discord', 'A stranger asks you to "beta test my indie game" via a .zip or .exe file.', 'Installs infostealer malware that grabs saved browser passwords and login tokens.'],
              ['TikTok / IG', 'Fake copyright notice: "Confirm your password within 24h or lose your account."', 'Classic credential phishing designed to take over your profile and linked email.']
            ]
          }
        },
        {
          id: '10-second-link-check',
          heading: '2. The 10-Second Link Inspection Habit Before Logging In',
          paragraphs: [
            'Seeing the HTTPS padlock only proves the connection is encrypted—even malicious phishing websites carry HTTPS certificates today! What matters is the exact root domain sitting right before the first forward slash (/).'
          ],
          numberedSteps: [
            'Read the domain right-to-left before "/": in "roblox.com.free-gifts.xyz", the true host is "free-gifts.xyz", NOT "roblox.com".',
            'Watch for swapped lookalike letters such as "rn" instead of "m" or "0" instead of "o".',
            'Never enter a password after tapping a link inside a chat message. Open the official app yourself or type the verified address directly.'
          ],
          callout: {
            title: 'The 6-Digit SMS Code Rule',
            text: 'No contest, friend, or customer support agent ever needs the 6-digit verification code texted to your phone. Anyone asking for it is trying to take over your account.',
            variant: 'warning'
          }
        },
        {
          id: 'passphrases-and-2fa',
          heading: '3. Memorable Passphrases & Two-Factor Authentication (2FA)',
          paragraphs: [
            'Short passwords like "Alex2013" or "password123" can be cracked in under a second. A multi-word passphrase—like "BlueBear!Eats47Strawberries"—is easy for students to remember and virtually impossible to guess.',
            'Pair unique passphrases with Two-Factor Authentication (2FA) on Google, Roblox, Discord, and TikTok so stolen passwords alone cannot unlock an account.'
          ],
          bulletPoints: [
            'Give your main email address its own unique password—it controls password resets everywhere else.',
            'Enable app-based 2FA or parent-supervised phone verification under Account Security settings.',
            'Never save personal logins on shared school lab computers and always click Sign Out before leaving class.'
          ]
        },
        {
          id: 'handling-cyberbullying',
          heading: '4. What to Do If Cyberbullying or Account Blackmail Happens',
          paragraphs: [
            'Online harassment, mocking in group chats, sharing photos without permission, or threatening messages are never harmless jokes—and victims should never stay silent out of embarrassment.'
          ],
          numberedSteps: [
            'Do NOT retaliate or delete messages immediately: capture clear screenshots showing timestamps and usernames.',
            'Use Block and Report inside the platform right away.',
            'Tell a parent, trusted teacher, or school counselor immediately—help is always available.',
            'Reach out to your national child helpline (119 in Romania, or local equivalents like 988/Childline) for confidential guidance.'
          ]
        }
      ],
      checklistTitle: '5-Minute Family Digital Safety Checklist',
      checklist: [
        'Two-Factor Authentication (2FA) is turned on for Google, Roblox, Discord, and TikTok.',
        'Social profiles for minors are set to Private with stranger DMs disabled.',
        'Main email accounts use unique passphrases at least 12–14 characters long.',
        'Kids know never to share 6-digit SMS codes, private photos, or passwords for "free rewards".'
      ],
      faqs: [
        {
          question: 'Do any legitimate "Free Robux" or free currency generators exist?',
          answer: 'No. No external website can add free currency to Roblox, Brawl Stars, or Fortnite. Every site promising free rewards in exchange for logging in or filling surveys is a phishing or adware trap.'
        },
        {
          question: 'Does an HTTPS padlock guarantee a website is safe?',
          answer: 'No. HTTPS only encrypts data in transit; scammers also use HTTPS certificates. Always verify the exact domain name before the first slash.'
        },
        {
          question: 'Which is stronger: a short password with symbols or a long passphrase?',
          answer: 'A long passphrase (14+ characters combining unrelated words, numbers, and symbols) resists automated cracking far better and is easier to remember without writing down.'
        },
        {
          question: 'How do you recover a WhatsApp account hijacked via a fake voting link?',
          answer: 'Re-register your phone number inside the official WhatsApp app using a fresh SMS or voice code, then immediately turn on Two-Step Verification (6-digit PIN) under Settings -> Account.'
        },
        {
          question: 'Where can students practice cyber safety interactively through games?',
          answer: 'ArkyEdu offers interactive Grade 6 Malware & Cyber Safety and Email & Netiquette labs, plus Cyber Safe Detective, Virus Sweeper, and Firewall Defender arcade games.'
        }
      ],
      internalLinksTitle: 'Practice Cyber Safety Through Games on ArkyEdu',
      internalLinks: [
        {
          label: 'Malware, Strong Passwords & 2FA (Grade 6)',
          url: '/cursuri/malware-securitate/',
          missionId: 'g6_malware',
          description: 'Identify viruses, trojans, ransomware, and build 2FA protection.'
        },
        {
          label: 'Email, Netiquette & Anti-Cyberbullying (Grade 6)',
          url: '/cursuri/email-neticheta/',
          missionId: 'g6_email',
          description: 'Practice safe digital communication, CC/BCC, and online etiquette.'
        },
        {
          label: 'Virus Sweeper & Cyber Safe Detective (Arcade)',
          url: '/arcade/',
          targetView: 'arcade',
          description: 'Spot phishing traps and defend ports in retro educational games.'
        },
        {
          label: 'Hacker vs Defender 1v1 (Duel Arena)',
          url: '/duel/',
          targetView: 'duel',
          description: 'Test your defensive instincts live against friends or AI Cyber-Bot.'
        }
      ]
    }
  }
];
