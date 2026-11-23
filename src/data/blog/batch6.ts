import { BlogArticle } from './types';

export const BLOG_BATCH_6: BlogArticle[] = [
  {
    id: 'algoritmi-de-sortare-cpp-bubble-selection-insertion-std-sort',
    category: 'cpp-algorithms',
    gradeTagRo: 'Clasele VII–VIII · OJI',
    gradeTagEn: 'Grades 7–8 · Olympiad',
    publishedAt: '2026-11-22',
    updatedAt: '2026-11-22',
    featured: true,
    ro: {
      slug: 'algoritmi-de-sortare-cpp-bubble-selection-insertion-std-sort',
      title: 'Algoritmi de Sortare în C++ pentru Gimnaziu & Olimpiadă: Bubble Sort, Selection Sort, Insertion Sort & std::sort() explicate pas cu pas',
      metaTitle: 'Algoritmi de Sortare C++ (Bubble, Selection, Insertion & std::sort) | ArkyEdu',
      metaDescription: 'Ghid complet de sortări în C++ pentru clasele VII–VIII și OJI: tabel complexitate Big-O, trasare pas cu pas pe vectorul [7,2,9,1,5], cod optimizat și comparatori std::sort().',
      keywords: 'algoritmi de sortare c++ gimnaziu, bubble sort optimizat c++, selection sort vs insertion sort, std sort comparator c++, sortare vectori c++ oji admitere, laborator vizual sortari',
      breadcrumbLabel: 'Sortări C++: Bubble, Selection, std::sort',
      categoryLabel: 'C++ & Algoritmi',
      readTime: '14 min citire',
      tldrTitle: 'Răspuns Rapid (TL;DR)',
      tldr: 'În gimnaziu (N <= 1.000), algoritmii de sortare pătratici O(n²) — Bubble Sort cu oprire timpurie, Selection Sort și Insertion Sort — sunt esențiali pentru înțelegerea logicii de interschimbare și a testelor de clasă. Pentru Olimpiadă și N >= 10.000 de elemente, folosește exclusiv std::sort(v, v + n) din <algorithm>, care rulează în O(n log n) și sortează 100.000 de numere în sub 0,03 secunde.',
      intro: 'Sortarea unui vector este fundația peste jumătate dintre problemele de căutare, clasamente și statistici: nu poți aplica Căutarea Binară O(log n) dacă tabloul nu este ordonat, și nu poți afișa podiumul unui concurs fără un comparator corect. În acest ghid analizăm matematic și practic toți algoritmii de sortare ceruți la școală și la concursurile de informatică.',
      sections: [
        {
          id: 'comparatie-algoritmi-sortare-big-o',
          heading: '1. Tabel Comparativ: Bubble vs. Selection vs. Insertion vs. std::sort()',
          paragraphs: [
            'Nu toți algoritmii O(n²) se comportă identic în practică. De exemplu, Selection Sort face extrem de puține interschimbări (maximum N−1 swap-uri), în timp ce Insertion Sort devine fulgerător — O(n) — dacă vectorul este deja aproape sortat!'
          ],
          table: {
            caption: 'Performanța și proprietățile algoritmilor de sortare în C++',
            headers: ['Algoritm', 'Caz Optim', 'Caz Mediu / Rău', 'Memorie', 'Stabil?', 'Când îl alegi'],
            rows: [
              ['Bubble Sort (cu flag)', 'O(n)', 'O(n²)', 'O(1)', 'Da', 'Vectori mici (N ≤ 1.000) sau aproape sortați; explicație vizuală'],
              ['Selection Sort', 'O(n²)', 'O(n²)', 'O(1)', 'Nu (standard)', 'Când scrierea în memorie / numărul de interschimbări trebuie minimizat'],
              ['Insertion Sort', 'O(n)', 'O(n²)', 'O(1)', 'Da', 'Vectori mici sau date care sosesc pe rând („în flux”)'],
              ['Counting / Vector Frecvență', 'O(n + V)', 'O(n + V)', 'O(V)', 'Da (reconstruit)', 'Valori întregi mici (0 ≤ v[i] ≤ 1.000.000)'],
              ['std::sort() (<algorithm>)', 'O(n log n)', 'O(n log n)', 'O(log n)', 'Nu (folosește stable_sort dacă trebuie)', 'Standardul absolut la OJI / ONI / Admitere pentru N ≤ 1.000.000']
            ]
          }
        },
        {
          id: 'trasare-pas-cu-pas-vector',
          heading: '2. Trasare Pas cu Pas pe vectorul v = [7, 2, 9, 1, 5]',
          paragraphs: [
            'Mulți elevi încurcă modul în care evoluează vectorul după prima trecere (primul pas i = 0) în fiecare algoritm. Iată diferența exactă observată la teze și grile:'
          ],
          table: {
            caption: 'Cum arată vectorul [7, 2, 9, 1, 5] după prima trecere completă (sortare crescătoare)',
            headers: ['Algoritm', 'Mecanism la trecerea 1', 'Starea vectorului după trecerea 1', 'Element fixat garantat'],
            rows: [
              ['Bubble Sort', 'Compară vecini (7,2), (7,9), (9,1), (9,5) și împinge maximul la dreapta', '[2, 7, 1, 5, 9]', '9 pe ultima poziție'],
              ['Selection Sort', 'Caută minimul global (1) și îl schimbă o singură dată cu v[0]=7', '[1, 2, 9, 7, 5]', '1 pe prima poziție'],
              ['Insertion Sort', 'Inserează v[1]=2 în subvectorul deja sortat din stânga [7]', '[2, 7, 9, 1, 5]', 'Subvectorul [2, 7] sortat relativ']
            ]
          },
          callout: {
            title: 'Întrebare clasică de grilă la Admitere & OJI',
            text: 'Dacă o problemă întreabă „Cum arată tabloul după 2 pași de Selection Sort?”, NU sorta întreg vectorul! Simulează exact primii 2 pași ai buclei exterioare.',
            variant: 'tip'
          }
        },
        {
          id: 'cod-cpp-optimizat-trei-sortari',
          heading: '3. Implementări C++ curate: Bubble (optimizat), Selection & Insertion Sort',
          paragraphs: [
            'În șablonul de mai jos presupunem un vector indexat de la 0 la n − 1. Observă utilizarea variabilei bool sortat în Bubble Sort (care oprește algoritmul imediat dacă într-o trecere nu s-a făcut nicio interschimbare) și salvarea lui curent în Insertion Sort pentru a evita swap-urile inutile:'
          ],
          codeBlock: {
            title: 'Bubble Sort Optimizat, Selection Sort și Insertion Sort în C++ (0-indexed)',
            language: 'cpp',
            code: `#include <iostream>
#include <utility> // pentru swap
using namespace std;

void bubbleSort(int v[], int n) {
    bool sortat;
    int pas = 0;
    do {
        sortat = true;
        for (int i = 0; i < n - 1 - pas; i++) {
            if (v[i] > v[i + 1]) {
                swap(v[i], v[i + 1]);
                sortat = false;
            }
        }
        pas++;
    } while (!sortat);
}

void selectionSort(int v[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int pozMin = i;
        for (int j = i + 1; j < n; j++) {
            if (v[j] < v[pozMin]) {
                pozMin = j;
            }
        }
        if (pozMin != i) swap(v[i], v[pozMin]);
    }
}

void insertionSort(int v[], int n) {
    for (int i = 1; i < n; i++) {
        int curent = v[i];
        int j = i - 1;
        while (j >= 0 && v[j] > curent) {
            v[j + 1] = v[j];
            j--;
        }
        v[j + 1] = curent;
    }
}`,
            caption: 'Poți anima și compara aceste 3 metode în timp real pe bare colorate în Laboratorul Vizual de Algoritmi ArkyEdu (/laborator-algoritmi/).'
          }
        },
        {
          id: 'std-sort-si-comparatori-personalizati',
          heading: '4. Arma secretă de Olimpiadă: std::sort() și comparatori personalizați',
          paragraphs: [
            'În C++ modern (din biblioteca <algorithm>), funcția std::sort(start, stop) folosește Introsort (un hibrid între Quicksort, Heapsort și Insertion Sort) garantat O(n log n) chiar și pe cele mai dificile cazuri de test!',
            'Dacă vrei să sortezi descrescător, după două criterii (ex: punctaj descrescător, iar la egalitate alfabetic după nume) sau un vector de structuri struct Elev, scrii o mică funcție bool cmp(const Elev& a, const Elev& b):'
          ],
          codeBlock: {
            title: 'Sortare cu criterii multiple folosind std::sort() în C++',
            language: 'cpp',
            code: `#include <iostream>
#include <algorithm>
#include <string>
using namespace std;

struct Elev {
    string nume;
    int punctaj;
};

// Sortare: punctaj descrescător, apoi nume crescător (alfabetic)
bool cmp(const Elev& a, const Elev& b) {
    if (a.punctaj != b.punctaj)
        return a.punctaj > b.punctaj;
    return a.nume < b.nume;
}

int main() {
    Elev clasa[3] = { {"Ioana", 95}, {"Andrei", 100}, {"Bogdan", 95} };
    sort(clasa, clasa + 3, cmp);
    // Rezultat: Andrei (100), Bogdan (95), Ioana (95)
    for (int i = 0; i < 3; i++)
        cout << clasa[i].nume << " " << clasa[i].punctaj << "\\n";
    return 0;
}`,
            caption: 'Atenție: comparatorul cmp trebuie să întoarcă STRICT < sau >, NICIODATĂ <= sau >= (altfel încalci strict weak ordering și programul poate crăpa).'
          },
          callout: {
            title: 'Capcana indexării de la 1 vs. de la 0 la std::sort()',
            text: 'Dacă vectorul este citit de la 1 la n (v[1..n]), apelul corect este sort(v + 1, v + n + 1); dacă este de la 0 la n-1 (v[0..n-1]), apelezi sort(v, v + n).',
            variant: 'warning'
          }
        }
      ],
      checklistTitle: 'Checklist înainte să trimiți o problemă de sortare',
      checklist: [
        'Am verificat dacă N ≤ 1.000 (merge O(n²)) sau N > 10.000 (obligatoriu std::sort() sau vector de frecvență).',
        'Am respectat indexarea corectă în limitele buclelor (0..n-1 sau 1..n) fără a accesa v[n] în afara tabloului.',
        'La comparatorul custom cmp(a, b) am folosit strict < / > și niciodată <= / >=.',
        'Am urmărit cel puțin un test mic în Debugger-ul Visual Trace C++ înainte de evaluare.'
      ],
      faqs: [
        {
          question: 'Care este cel mai rapid algoritm de sortare din C++ pentru N = 100.000?',
          answer: 'Funcția standard std::sort(v, v + n) din biblioteca <algorithm> (complexitate garantată O(n log n)), sau Counting Sort / vector de frecvență în O(n + maxVal) dacă numerele sunt întregi pozitive mici.'
        },
        {
          question: 'Ce înseamnă că un algoritm de sortare este „stabil”?',
          answer: 'Un algoritm stabil (ex: Insertion Sort, Merge Sort, std::stable_sort) păstrează ordinea relativă inițială a elementelor cu valori egale. De exemplu, dacă sortezi elevi după clasă, elevii din aceeași clasă rămân în ordinea inițială.'
        },
        {
          question: 'De ce este Bubble Sort mai lent decât Insertion Sort chiar dacă ambele sunt O(n²)?',
          answer: 'Bubble Sort face o interschimbare completă (3 atribuiri cu variabilă auxiliară) la aproape fiecare comparație inversată, în timp ce Insertion Sort doar deplasează elementele cu o singură atribuire și scrie valoarea o dată la final.'
        },
        {
          question: 'Unde pot vedea animații pas cu pas ale algoritmilor de sortare sincronizate cu codul C++?',
          answer: 'În Laboratorul Vizual de Algoritmi ArkyEdu (/laborator-algoritmi/) poți anima Bubble, Selection și Insertion Sort pe bare interactive cu viteză reglabilă și contor de comparații/interschimbări.'
        }
      ],
      internalLinksTitle: 'Exersează Sortările Vizual & în Cod C++',
      internalLinks: [
        {
          label: 'Laboratorul Vizual de Algoritmi & Sortări',
          url: '/laborator-algoritmi/',
          targetView: 'algolab',
          description: 'Animații pas-cu-pas pentru Bubble, Selection, Insertion Sort și Căutare Binară.'
        },
        {
          label: 'Sandbox C++ & Debugger Visual Trace',
          url: '/sandbox/?tab=trace',
          targetView: 'sandbox',
          description: 'Rulează propriul cod de sortare linie cu linie inspectând vectorul în memorie.'
        },
        {
          label: 'Subiect Teză Admitere Mate-Info: Vectori & Sortări',
          url: '/fise/subiect-teza-admitere-mate-info-cpp-clasa-8-vectori-sortare-cautare-binara/',
          targetView: 'fise',
          description: 'Fișă completă cu barem 100p și notare 1–10.'
        },
        {
          label: 'Tablouri Unidimensionale & Sortare (Clasa VIII)',
          url: '/cursuri/g8_algo_d/',
          missionId: 'g8_algo_d',
          description: 'Misiune interactivă de prelucrare și ordonare a vectorilor.'
        }
      ]
    },
    en: {
      slug: 'cpp-sorting-algorithms-bubble-selection-insertion-std-sort',
      title: 'C++ Sorting Algorithms for Middle School & Olympiads: Bubble Sort, Selection Sort, Insertion Sort & std::sort() Explained',
      metaTitle: 'C++ Sorting Algorithms Guide: Bubble, Selection, Insertion & std::sort | ArkyEdu',
      metaDescription: 'Complete C++ sorting guide for grades 7–8 & competitive coding: Big-O table, step-by-step trace of [7,2,9,1,5], clean templates, and custom std::sort() comparators.',
      keywords: 'c++ sorting algorithms explained, bubble sort vs selection sort vs insertion sort, std sort custom comparator c++, middle school competitive programming sorting, visual sorting simulator',
      breadcrumbLabel: 'C++ Sorting: Bubble, Selection, std::sort',
      categoryLabel: 'C++ & Algorithms',
      readTime: '14 min read',
      tldrTitle: 'Quick Answer (TL;DR)',
      tldr: 'For classroom benchmarks (N <= 1,000), quadratic O(n²) sorts—early-exit Bubble Sort, Selection Sort, and Insertion Sort—build essential loop and swap intuition. For contests and N >= 10,000, always use std::sort(v, v + n) from <algorithm>, which runs in guaranteed O(n log n) and sorts 100,000 numbers in under 0.03 seconds.',
      intro: 'Sorting an array unlocks more than half of computer science problem patterns: you cannot run O(log n) Binary Search on unsorted data, nor build leaderboards without a sound comparator. Let’s break down the math, step-by-step traces, and C++ templates every student needs.',
      sections: [
        {
          id: 'sorting-complexity-comparison',
          heading: '1. Big-O Comparison: Bubble vs. Selection vs. Insertion vs. std::sort()',
          paragraphs: [
            'Not all O(n²) algorithms behave equally on real inputs. Selection Sort minimizes swaps (at most N − 1 writes), whereas Insertion Sort speeds up to O(n) when an array is already nearly sorted.'
          ],
          table: {
            caption: 'Performance and properties of standard C++ sorting methods',
            headers: ['Algorithm', 'Best Case', 'Avg / Worst Case', 'Extra Space', 'Stable?', 'Best Use Case'],
            rows: [
              ['Bubble Sort (early-exit flag)', 'O(n)', 'O(n²)', 'O(1)', 'Yes', 'Small arrays (N ≤ 1,000) or visualizing adjacent swaps'],
              ['Selection Sort', 'O(n²)', 'O(n²)', 'O(1)', 'No (standard)', 'Minimizing the total number of memory writes/swaps'],
              ['Insertion Sort', 'O(n)', 'O(n²)', 'O(1)', 'Yes', 'Small or nearly sorted inputs, or streaming data'],
              ['Frequency / Counting Sort', 'O(n + V)', 'O(n + V)', 'O(V)', 'Yes', 'Small non-negative integers (0 ≤ v[i] ≤ 10⁶)'],
              ['std::sort() (<algorithm>)', 'O(n log n)', 'O(n log n)', 'O(log n)', 'No (use stable_sort if needed)', 'Olympiads and production code up to N = 1,000,000+']
            ]
          }
        },
        {
          id: 'step-by-step-trace-example',
          heading: '2. Step-by-Step First-Pass Trace on [7, 2, 9, 1, 5]',
          paragraphs: [
            'Multiple-choice exam questions frequently ask how an array looks right after the very first pass (i = 0). Here is how each algorithm transforms [7, 2, 9, 1, 5] after Pass 1:'
          ],
          table: {
            caption: 'Array state of [7, 2, 9, 1, 5] right after Pass 1 (ascending order)',
            headers: ['Algorithm', 'Pass 1 Action', 'Array After Pass 1', 'Guaranteed Fixed Element'],
            rows: [
              ['Bubble Sort', 'Swaps adjacent pairs (7,2), (9,1), (9,5), bubbling 9 right', '[2, 7, 1, 5, 9]', '9 locked at last index'],
              ['Selection Sort', 'Finds global min (1) and swaps once with v[0]=7', '[1, 2, 9, 7, 5]', '1 locked at index 0'],
              ['Insertion Sort', 'Inserts v[1]=2 into sorted prefix [7]', '[2, 7, 9, 1, 5]', 'Prefix [2, 7] sorted']
            ]
          },
          callout: {
            title: 'Classic Exam Tip',
            text: 'If a test asks „What is the array after 2 passes of Selection Sort?”, simulate exactly 2 iterations of the outer loop—do not write down the fully sorted array.',
            variant: 'tip'
          }
        },
        {
          id: 'clean-cpp-sorting-templates',
          heading: '3. Clean C++ Implementations: Bubble, Selection & Insertion Sort',
          paragraphs: [
            'Below are standard 0-indexed C++ templates. Notice the early-exit boolean flag in Bubble Sort and value-shifting in Insertion Sort instead of costly three-way swaps:'
          ],
          codeBlock: {
            title: 'Optimized Bubble, Selection, and Insertion Sort in C++ (0-indexed)',
            language: 'cpp',
            code: `#include <iostream>
#include <utility>
using namespace std;

void bubbleSort(int v[], int n) {
    bool sorted;
    int pass = 0;
    do {
        sorted = true;
        for (int i = 0; i < n - 1 - pass; i++) {
            if (v[i] > v[i + 1]) {
                swap(v[i], v[i + 1]);
                sorted = false;
            }
        }
        pass++;
    } while (!sorted);
}

void selectionSort(int v[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (v[j] < v[minIdx]) minIdx = j;
        }
        if (minIdx != i) swap(v[i], v[minIdx]);
    }
}

void insertionSort(int v[], int n) {
    for (int i = 1; i < n; i++) {
        int current = v[i];
        int j = i - 1;
        while (j >= 0 && v[j] > current) {
            v[j + 1] = v[j];
            j--;
        }
        v[j + 1] = current;
    }
}`,
            caption: 'Watch all three algorithms race side by side in the ArkyEdu Visual Algorithms Lab (/laborator-algoritmi/en/).'
          }
        },
        {
          id: 'std-sort-and-custom-comparators',
          heading: '4. Competitive C++ Secret Weapon: std::sort() & Custom Comparators',
          paragraphs: [
            'From <algorithm>, std::sort() uses Introsort (Quicksort + Heapsort + Insertion Sort), guaranteeing O(n log n) even on adversarial inputs. Writing a custom comparator cmp lets you rank structs across multiple tie-breakers cleanly:'
          ],
          codeBlock: {
            title: 'Multi-criteria sorting with std::sort() in C++',
            language: 'cpp',
            code: `#include <iostream>
#include <algorithm>
#include <string>
using namespace std;

struct Student {
    string name;
    int score;
};

bool cmp(const Student& a, const Student& b) {
    if (a.score != b.score)
        return a.score > b.score; // Higher score first
    return a.name < b.name;       // Alphabetical tie-breaker
}

int main() {
    Student arr[3] = { {"Elena", 95}, {"Alex", 100}, {"Bogdan", 95} };
    sort(arr, arr + 3, cmp);
    for (int i = 0; i < 3; i++)
        cout << arr[i].name << " " << arr[i].score << "\\n";
    return 0;
}`,
            caption: 'Always use strict < or > in comparators—never <= or >=—to satisfy strict weak ordering.'
          },
          callout: {
            title: '0-Indexed vs 1-Indexed Range Trap',
            text: 'If your array uses v[1..n], call sort(v + 1, v + n + 1). If it uses v[0..n-1], call sort(v, v + n). Remember the second pointer is exclusive (one past the last element)!',
            variant: 'warning'
          }
        }
      ],
      checklistTitle: 'Sorting Submission Checklist',
      checklist: [
        'Checked N constraint: O(n²) only for N ≤ 1,000; std::sort() or counting array for N > 10,000.',
        'Verified array bounds (no v[n] out-of-bounds read/write).',
        'Custom comparator returns strict < or >, never <= or >=.',
        'Stepped through a small test case in C++ Visual Trace.'
      ],
      faqs: [
        {
          question: 'What is the fastest general-purpose sorting function in C++?',
          answer: 'std::sort(v, v + n) from <algorithm> runs in O(n log n) average and worst case. For small bounded integers, a Counting/Frequency array achieves O(n + maxValue).'
        },
        {
          question: 'What does „stable sorting algorithm” mean?',
          answer: 'A stable sort (Insertion Sort, Merge Sort, std::stable_sort) preserves the original relative order of elements with equal keys.'
        },
        {
          question: 'Why is Insertion Sort faster in practice than Bubble Sort?',
          answer: 'Insertion Sort shifts elements with single assignments instead of performing full 3-step swaps on every adjacent inversion.'
        },
        {
          question: 'Where can I animate sorting algorithms step by step in my browser?',
          answer: 'Open the ArkyEdu Visual Algorithms Lab (/laborator-algoritmi/en/) to animate Bubble, Selection, and Insertion Sort synchronized with C++ code.'
        }
      ],
      internalLinksTitle: 'Practice Sorting Visually & in Live C++',
      internalLinks: [
        {
          label: 'Visual Algorithms & Sorting Lab',
          url: '/laborator-algoritmi/en/',
          targetView: 'algolab',
          description: 'Step-by-step animated bars for Bubble, Selection, Insertion Sort, and Binary Search.'
        },
        {
          label: 'C++ Sandbox & Visual Trace Debugger',
          url: '/sandbox/?tab=trace',
          targetView: 'sandbox',
          description: 'Step through sorting loops line by line and watch array elements swap live.'
        },
        {
          label: 'Grade 8 Arrays & Sorting Mock Exam',
          url: '/fise/en/grade-8-cpp-high-school-prep-arrays-sorting-binary-search/',
          targetView: 'fise',
          description: '100-point rubric sheet with step-by-step solutions.'
        },
        {
          label: '1D Arrays & Sorting Mission (Grade 8)',
          url: '/cursuri/g8_algo_d/',
          missionId: 'g8_algo_d',
          description: 'Interactive Grade 8 C++ array traversal and sorting mission.'
        }
      ]
    }
  },
  {
    id: 'cum-functioneaza-internetul-ip-dns-tcp-udp-ping-wifi-router',
    category: 'cyber-safety',
    gradeTagRo: 'Clasele V–VIII · Rețele',
    gradeTagEn: 'Grades 5–8 · Networking',
    publishedAt: '2026-11-22',
    updatedAt: '2026-11-22',
    featured: true,
    ro: {
      slug: 'cum-functioneaza-internetul-ip-dns-tcp-udp-ping-wifi-router',
      title: 'Cum funcționează Internetul în 2026: IP, DNS, TCP vs. UDP (de ce ai Ping mare în jocuri), Porturi & Wi-Fi 6/7',
      metaTitle: 'Cum funcționează Internetul: IP, DNS, TCP vs UDP & Ping | ArkyEdu',
      metaDescription: 'Ghid complet de rețelistică pentru elevi și părinți: călătoria unui pachet web, IPv4 vs IPv6, DNS, diferența TCP vs UDP la gaming, benzi Wi-Fi 2.4/5/6 GHz și comenzi ping/tracert.',
      keywords: 'cum functioneaza internetul explicat copii, diferenta tcp vs udp gaming ping, ce este adresa ip si dns, wifi 2.4 ghz vs 5 ghz vs cablu, porturi https 443 dns 53, securitate router acasa',
      breadcrumbLabel: 'Internet: IP, DNS, TCP/UDP & Wi-Fi',
      categoryLabel: 'Rețele & Securitate',
      readTime: '13 min citire',
      tldrTitle: 'Răspuns Rapid (TL;DR)',
      tldr: 'Internetul transportă informația împărțită în pachete mici numerotate: DNS traduce numele ușor de reținut (arkyedu.com) în adresa IP numerică a serverului; TCP garantează că pachetele ajung intacte și în ordine (ideal pentru pagini web HTTPS port 443 și descărcări), iar UDP trimite pachetele fără confirmare pentru latență minimă (ideal pentru jocuri online, apeluri video și streaming). Pentru ping mic și stabil în jocuri, cablul Ethernet sau Wi-Fi pe 5/6 GHz bate întotdeauna banda aglomerată de 2.4 GHz.',
      intro: 'De fiecare dată când deschizi un site, trimiți un mesaj pe WhatsApp sau intri într-un meci multiplayer cu prietenii, datele tale parcurg mii de kilometri prin cabluri de fibră optică și routere în mai puțin de 50 de milisecunde. Dar de ce se blochează uneori un joc cu „High Ping 300ms”? Hai să urmărim traseul real al pachetelor de date.',
      sections: [
        {
          id: 'calatoria-unui-pachet-pe-internet',
          heading: '1. Călătoria unei cereri Web în 5 pași (DNS → IP → TCP → TLS → HTML)',
          paragraphs: [
            'Atunci când scrii https://www.arkyedu.com în browser și apeși Enter, se declanșează o coregrafie exactă de protocoale standardizate în câteva milisecunde:'
          ],
          numberedSteps: [
            'Interogarea DNS (Agenda telefonică a Internetului): Computerul tău întreabă serverul DNS (ex: 1.1.1.1 sau 8.8.8.8) ce adresă IP corespunde numelui arkyedu.com.',
            'Rutarea prin Adresa IP: Routerul de acasă folosește NAT (Network Address Translation) pentru a trimite cererea de la IP-ul tău local (ex: 192.168.1.25) către IP-ul public al serverului prin nodurile ISP.',
            'Strângerea de mână TCP (3-Way Handshake): Browserul și serverul schimbă 3 mesaje rapide (SYN → SYN-ACK → ACK) pentru a deschide o conexiune sigură.',
            'Criptarea TLS (HTTPS pe Portul 443): Serverul își prezintă certificatul digital SSL/TLS, iar traficul devine complet criptat (lăcățelul din browser).',
            'Transferul HTTP și asamblarea paginii: Serverul trimite HTML, CSS, JavaScript și imagini în pachete, iar browserul le reasamblează pe ecran.'
          ]
        },
        {
          id: 'tcp-vs-udp-si-porturi-esentiale',
          heading: '2. TCP vs. UDP: De ce folosește un site TCP și un joc online UDP?',
          paragraphs: [
            'În lumea rețelelor, două protocoale de transport duc greul: TCP (Transmission Control Protocol) și UDP (User Datagram Protocol). Alegerea dintre ele este compromisul clasic dintre siguranță 100% și viteză pură:'
          ],
          table: {
            caption: 'Comparație TCP vs. UDP și porturile standard din programa TIC',
            headers: ['Criteriu / Port', 'TCP (Siguranță & Ordine)', 'UDP (Viteză & Timp Real)'],
            rows: [
              ['Confirmare primire (ACK)', 'Da — pachetele pierdute sunt retrimise automat', 'Nu — pachetele pierdute se ignoră pentru a nu încetini fluxul'],
              ['Ordinea pachetelor', 'Garantată la destinație', 'Negarantată (aplicația decide)'],
              ['Viteză / Latență (Ping)', 'Ușor mai mare (din cauza verificărilor)', 'Minimă — ideală pentru milisecunde critice'],
              ['Aplicații tipice', 'Site-uri HTTPS (443), E-mail, Descărcări fișiere', 'Gaming multiplayer, Apeluri video/voce, Live streaming, DNS (53)'],
              ['Porturi celebre de reținut', 'HTTP: 80 · HTTPS: 443 · SSH: 22', 'DNS: 53 · DHCP: 67/68']
            ]
          }
        },
        {
          id: 'wifi-24-vs-5-vs-6-ghz-si-ping',
          heading: '3. Wi-Fi 2.4 GHz vs. 5 GHz vs. 6 GHz (Wi-Fi 6E/7) & Diagnosticare Lag',
          paragraphs: [
            'Mulți elevi dau vina pe „internetul prost” când au lag în jocuri, deși problema este de fapt conexiunea între laptop și routerul din hol. Fiecare bandă radio are avantaje și limite fizice:'
          ],
          table: {
            caption: 'Ghid practic pentru alegerea benzii Wi-Fi sau a cablului Ethernet acasă',
            headers: ['Tip conexiune', 'Viteză reală tipică', 'Rază / Pereți', 'Latență (Ping) & Recomandare'],
            rows: [
              ['Wi-Fi 2.4 GHz', '40–100 Mbps', 'Excelentă (trece prin 2–3 pereți)', 'Instabilă în blocuri aglomerate — bună doar pentru becuri IoT / ESP32'],
              ['Wi-Fi 5 GHz (Wi-Fi 5/6)', '300–900 Mbps', 'Medie (1–2 pereți)', 'Bună — ideală pentru laptop/telefon în aceeași cameră sau camera alăturată'],
              ['Wi-Fi 6 GHz (Wi-Fi 6E/7)', '1.000+ Mbps', 'Scurtă (aceeași cameră)', 'Foarte scăzută — aproape fără interferențe'],
              ['Cablu Ethernet CAT6', '1.000–2.500 Mbps', 'Până la 100 m fără pierderi', 'Optimă (1–3 ms local, 0 pachete pierdute) — regele gaming-ului și al examenelor online']
            ]
          },
          codeBlock: {
            title: '4 Comenzi esențiale în Terminal / Command Prompt pentru a diagnostica rețeaua',
            language: 'bash',
            code: `# 1. Verifică IP-ul local și Gateway-ul routerului (Windows / Linux-macOS)
ipconfig        # Windows (sau 'ip addr' / 'ifconfig' pe Linux/macOS)

# 2. Măsoară latența (Ping ms) și pierderea de pachete către Cloudflare DNS
ping 1.1.1.1

# 3. Vezi pe unde trec pachetele tale (hop cu hop) până la server
tracert www.arkyedu.com   # 'traceroute' pe Linux/macOS

# 4. Testează rezoluția DNS pentru un domeniu
nslookup www.arkyedu.com`,
            caption: 'Dacă ping 192.168.1.1 (routerul tău) depășește 15 ms, problema este Wi-Fi-ul din casă, nu operatorul de internet!'
          }
        },
        {
          id: 'ipv4-vs-ipv6-si-securitate-router',
          heading: '4. IPv4 vs. IPv6 și 5 setări obligatorii de securitate pe routerul de acasă',
          paragraphs: [
            'Adresele IPv4 (4 grupuri de 8 biți, ex: 192.168.1.1) oferă ~4,3 miliarde de combinații și s-au epuizat la nivel mondial, motiv pentru care trecem treptat la IPv6 pe 128 de biți (cu 340 de undecilioane de adrese unice!). Între timp, routerul tău de acasă este prima linie de apărare a familiei:'
          ],
          bulletPoints: [
            'Schimbă imediat parola implicită de admin a routerului (nu lăsa admin / admin sau parola tipărită pe etichetă).',
            'Activează criptarea WPA3 (sau minimum WPA2-AES) — nu folosi niciodată WEP sau WPA vechi.',
            'Dezactivează WPS (Wi-Fi Protected Setup) și Remote Management (accesul din exterior la panoul routerului).',
            'Pune dispozitivele Smart Home / jucăriile IoT pe o rețea separată de tip „Guest Wi-Fi” pentru izolare.',
            'Păstrează firmware-ul routerului actualizat pentru a bloca vulnerabilitățile cunoscute.'
          ]
        }
      ],
      checklistTitle: 'Checklist rapid pentru rețea rapidă și sigură acasă',
      checklist: [
        'Conectez PC-ul / consola pentru jocuri sau concursuri pe cablu Ethernet sau Wi-Fi 5/6 GHz.',
        'Am verificat cu ping că latența până la router este ≤ 3 ms și zero packet loss.',
        'Routerul folosește WPA2-AES sau WPA3 cu o parolă puternică diferită de parola Wi-Fi.',
        'Recunosc diferența dintre HTTP (necriptat, port 80) și HTTPS (criptat TLS, port 443).'
      ],
      faqs: [
        {
          question: 'Ce este DNS-ul și de ce uneori schimbarea lui în 1.1.1.1 rezolvă site-urile care nu se încarcă?',
          answer: 'DNS (Domain Name System) traduce numele de domenii în adrese IP. Dacă serverul DNS al furnizorului este supraîncărcat, schimbarea către un resolver rapid precum 1.1.1.1 (Cloudflare) sau 8.8.8.8 (Google) rezolvă instant căutările.'
        },
        {
          question: 'Ce reprezintă Ping-ul măsurat în milisecunde (ms)?',
          answer: 'Ping-ul (RTT — Round Trip Time) este timpul total necesar unui pachet mic să ajungă de la dispozitivul tău la server și să se întoarcă. Sub 30 ms este excelent pentru gaming, peste 120 ms apare lag vizibil.'
        },
        {
          question: 'De ce este adresa 192.168.1.1 folosită aproape în toate casele din lume?',
          answer: '192.168.0.0/16 este un interval rezervat exclusiv rețelelor locale private (RFC 1918). Routerul folosește NAT pentru a împărți un singur IP public între toate telefoanele și laptopurile din casă.'
        },
        {
          question: 'Care este diferența dintre portul 80 și portul 443?',
          answer: 'Portul 80 este folosit pentru HTTP (text simplu, necriptat, ușor de interceptat pe Wi-Fi public). Portul 443 este folosit pentru HTTPS (criptat end-to-end cu TLS).'
        }
      ],
      internalLinksTitle: 'Testează Protocoalele & Securitatea Web pe ArkyEdu',
      internalLinks: [
        {
          label: 'Internet & Siguranță Online (Clasa a V-a)',
          url: '/cursuri/internet-siguranta/',
          missionId: 'internet-siguranta',
          description: 'Cum funcționează browserele, HTTPS și protecția datelor.'
        },
        {
          label: 'Web Design, Domenii, DNS & HTTPS (Clasa VIII)',
          url: '/cursuri/g8_web_b/',
          missionId: 'g8_web_b',
          description: 'Arhitectura Web, TLS, URL-uri și publicare sigură.'
        },
        {
          label: 'Test cu Barem: HTML5, CSS & HTTPS / DNS',
          url: '/fise/test-cu-barem-clasa-8-web-design-html5-semantic-css-https/',
          targetView: 'fise',
          description: 'Verifică-ți cunoștințele de rețea și web cu notare 1–10.'
        },
        {
          label: 'Glosar: Adresă IP, DNS & HTTP vs. HTTPS',
          url: '/glosar/adresa-ip-si-dns/',
          targetView: 'glossary',
          description: 'Definiții scurte, comparații și exemple practice.'
        }
      ]
    },
    en: {
      slug: 'how-the-internet-works-ip-dns-tcp-udp-gaming-ping-wifi-guide',
      title: 'How the Internet Works in 2026: IP, DNS, TCP vs. UDP (Why Gaming Ping Spikes), Ports & Wi-Fi 6/7',
      metaTitle: 'How the Internet Works: IP, DNS, TCP vs UDP & Wi-Fi | ArkyEdu',
      metaDescription: 'Complete networking guide for students & parents: packet journey, IPv4 vs IPv6, DNS lookup, TCP vs UDP for gaming, 2.4/5/6 GHz Wi-Fi bands & ping/traceroute tools.',
      keywords: 'how the internet works for students, tcp vs udp for gaming ping, what is ip address and dns, wifi 2.4 ghz vs 5 ghz vs ethernet, http port 80 vs https port 443, home router security checklist',
      breadcrumbLabel: 'Internet: IP, DNS, TCP/UDP & Wi-Fi',
      categoryLabel: 'Networks & Safety',
      readTime: '13 min read',
      tldrTitle: 'Quick Answer (TL;DR)',
      tldr: 'The Internet moves data in numbered packets: DNS translates human domain names (arkyedu.com) into numeric IP addresses; TCP guarantees reliable, in-order delivery (websites on HTTPS port 443, downloads), while UDP skips acknowledgments for lowest possible latency (multiplayer gaming, voice/video calls, live streams). For low, steady ping, Ethernet or 5/6 GHz Wi-Fi always beats congested 2.4 GHz.',
      intro: 'Every time you open a web page, send a message, or join a multiplayer match, packets race through fiber-optic cables and routers in under 50 milliseconds. Understanding why ping spikes and how DNS, TCP, UDP, and Wi-Fi work turns networking mysteries into practical skills.',
      sections: [
        {
          id: 'web-packet-journey',
          heading: '1. The 5-Step Journey of a Web Request (DNS → IP → TCP → TLS → HTML)',
          paragraphs: [
            'Typing https://www.arkyedu.com and pressing Enter triggers a tightly orchestrated protocol sequence in milliseconds:'
          ],
          numberedSteps: [
            'DNS Lookup: Your device queries a DNS resolver (like 1.1.1.1 or 8.8.8.8) to translate the hostname into an IP address.',
            'IP Routing & NAT: Your home router uses NAT to map your private IP (e.g., 192.168.1.25) onto your public IP toward the destination server.',
            'TCP 3-Way Handshake: Client and server exchange SYN → SYN-ACK → ACK to establish a reliable session.',
            'TLS Encryption (HTTPS Port 443): Digital certificates verify server identity and encrypt traffic end-to-end.',
            'HTTP Payload Delivery: HTML, CSS, JS, and assets arrive in packets and are reassembled into a rendered page.'
          ]
        },
        {
          id: 'tcp-vs-udp-ports',
          heading: '2. TCP vs. UDP: Reliability vs. Real-Time Gaming Speed',
          paragraphs: [
            'Two transport protocols carry most internet traffic—trading guaranteed delivery for raw real-time speed:'
          ],
          table: {
            caption: 'TCP vs. UDP comparison and essential school ICT ports',
            headers: ['Feature / Ports', 'TCP (Reliable & Ordered)', 'UDP (Fast & Real-Time)'],
            rows: [
              ['Delivery Confirmation', 'Yes — lost packets are automatically retransmitted', 'No — dropped packets are skipped to avoid stalling live feeds'],
              ['Packet Ordering', 'Strict in-order reassembly', 'Best-effort; app handles state updates'],
              ['Latency Impact', 'Slightly higher due to handshake & ACKs', 'Lowest possible latency'],
              ['Common Apps', 'HTTPS websites (443), Email, File transfers', 'Multiplayer gaming, Voice/Video calls, DNS (53), Live streaming'],
              ['Key Ports to Remember', 'HTTP: 80 · HTTPS: 443 · SSH: 22', 'DNS: 53 · DHCP: 67/68']
            ]
          }
        },
        {
          id: 'wifi-bands-and-diagnostics',
          heading: '3. Wi-Fi 2.4 GHz vs. 5 GHz vs. 6 GHz & Diagnosing High Ping',
          paragraphs: [
            'Most „laggy internet” complaints actually come from local Wi-Fi interference between a laptop and a hallway router rather than the ISP itself:'
          ],
          table: {
            caption: 'Choosing the right home connection band for studying and gaming',
            headers: ['Connection Type', 'Typical Real Speed', 'Wall Penetration', 'Latency (Ping) & Best For'],
            rows: [
              ['Wi-Fi 2.4 GHz', '40–100 Mbps', 'High (2–3 walls)', 'Noisy in apartments — best only for smart bulbs & ESP32 IoT'],
              ['Wi-Fi 5 GHz (Wi-Fi 5/6)', '300–900 Mbps', 'Medium (1–2 walls)', 'Good — great for laptops & phones near the router'],
              ['Wi-Fi 6 GHz (Wi-Fi 6E/7)', '1,000+ Mbps', 'Short (same room)', 'Ultra-low interference & jitter'],
              ['Ethernet CAT6 Cable', '1,000–2,500 Mbps', 'Up to 100 m wired', 'Best (1–3 ms local, 0% packet loss) — unbeatable for contests & gaming']
            ]
          },
          codeBlock: {
            title: '4 Essential CLI Commands to Troubleshoot Your Network',
            language: 'bash',
            code: `# 1. Check local IP and router Default Gateway
ipconfig        # Windows (use 'ip addr' or 'ifconfig' on Linux/macOS)

# 2. Measure round-trip latency (ms) and packet loss
ping 1.1.1.1

# 3. Trace every router hop between your PC and a server
tracert www.arkyedu.com   # 'traceroute' on Linux/macOS

# 4. Verify DNS resolution
nslookup www.arkyedu.com`,
            caption: 'If pinging your own router (e.g., 192.168.1.1) exceeds 15 ms, the bottleneck is your Wi-Fi—not your ISP!'
          }
        },
        {
          id: 'ipv4-ipv6-router-hardening',
          heading: '4. IPv4 vs. IPv6 & 5 Router Security Rules Every Family Needs',
          paragraphs: [
            'IPv4 addresses (~4.3 billion combinations) have been exhausted globally, driving adoption of 128-bit IPv6 addresses. Meanwhile, your home router protects every connected device:'
          ],
          bulletPoints: [
            'Replace the factory admin password immediately with a strong unique passphrase.',
            'Enable WPA3 (or minimum WPA2-AES) Wi-Fi encryption—never legacy WEP/TKIP.',
            'Disable WPS and Remote WAN Administration in router settings.',
            'Place smart TVs and IoT gadgets on an isolated Guest Wi-Fi network.',
            'Keep router firmware updated to patch security flaws.'
          ]
        }
      ],
      checklistTitle: 'Home Network Speed & Safety Checklist',
      checklist: [
        'Use Ethernet or 5/6 GHz Wi-Fi for live coding contests, video calls, and multiplayer gaming.',
        'Verified local router ping ≤ 3 ms with 0% packet loss.',
        'Router runs WPA2-AES or WPA3 with a unique admin password.',
        'Understood why HTTPS (port 443) protects logins over HTTP (port 80).'
      ],
      faqs: [
        {
          question: 'What does DNS do and why does switching to 1.1.1.1 sometimes fix slow browsing?',
          answer: 'DNS converts readable domain names into IP addresses. Switching from a sluggish ISP resolver to 1.1.1.1 or 8.8.8.8 speeds up name lookups.'
        },
        {
          question: 'What is „Ping” in milliseconds (ms)?',
          answer: 'Ping measures Round-Trip Time (RTT) for a tiny packet to travel to a server and return. Under 30 ms is ideal; over 120 ms causes noticeable lag.'
        },
        {
          question: 'Why do most home routers use 192.168.1.1?',
          answer: '192.168.0.0/16 is reserved for private local networks (RFC 1918). Your router uses NAT to let multiple home devices share one public IP.'
        },
        {
          question: 'What is the difference between Port 80 and Port 443?',
          answer: 'Port 80 serves unencrypted HTTP traffic, whereas Port 443 serves TLS-encrypted HTTPS traffic.'
        }
      ],
      internalLinksTitle: 'Practice Web & Network Safety on ArkyEdu',
      internalLinks: [
        {
          label: 'Internet & Online Safety (Grade 5)',
          url: '/cursuri/internet-siguranta/',
          missionId: 'internet-siguranta',
          description: 'How browsers, HTTPS, and safe web habits work.'
        },
        {
          label: 'Web Design, Domains, DNS & HTTPS (Grade 8)',
          url: '/cursuri/g8_web_b/',
          missionId: 'g8_web_b',
          description: 'Web architecture, TLS locks, URLs, and safe publishing.'
        },
        {
          label: 'HTML5, CSS & HTTPS / DNS Assessment',
          url: '/fise/en/grade-8-html5-semantics-css-flexbox-https-dns-exam/',
          targetView: 'fise',
          description: 'Auto-graded 100-point rubric worksheet.'
        },
        {
          label: 'Glossary: IP Address, DNS & HTTP vs. HTTPS',
          url: '/glosar/en/ip-address-and-dns/',
          targetView: 'glossary',
          description: 'Concise definitions and real-world examples.'
        }
      ]
    }
  },
  {
    id: 'excel-avansat-vlookup-xlookup-sumifs-pivot-grafice-proiecte',
    category: 'excel-office',
    gradeTagRo: 'Clasa a VIII-a · Proiecte',
    gradeTagEn: 'Grade 8 · Projects',
    publishedAt: '2026-11-22',
    updatedAt: '2026-11-22',
    featured: true,
    ro: {
      slug: 'excel-avansat-vlookup-xlookup-sumifs-pivot-grafice-proiecte',
      title: 'Excel Avansat & Google Sheets (Clasa VIII & Proiecte): XLOOKUP / VLOOKUP, SUMIFS, Pivot Tables & Grafice Smart',
      metaTitle: 'Excel Avansat: XLOOKUP, VLOOKUP, SUMIFS & Pivot Tables | ArkyEdu',
      metaDescription: 'Ghid practic de calcul tabelar avansat: diferența VLOOKUP vs XLOOKUP, sume multicriteriu SUMIFS/COUNTIFS, Tabele Pivot în 4 pași, alegerea graficului corect și formatare condiționată.',
      keywords: 'excel avansat vlookup explicat simplu, xlookup vs vlookup exemple, functie sumifs countifs excel, cum faci un pivot table in excel, ce grafic alegi in excel clasa 8, google sheets proiect scoala',
      breadcrumbLabel: 'Excel Avansat: XLOOKUP, SUMIFS & Pivot',
      categoryLabel: 'Excel & Birotică',
      readTime: '13 min citire',
      tldrTitle: 'Răspuns Rapid (TL;DR)',
      tldr: 'După ce stăpânești SUM, AVERAGE și IF, următoarele 4 unelte transformă orice foaie de calcul într-un sistem inteligent: VLOOKUP(val; tabel; col; FALSE) sau modernul XLOOKUP() caută automat date între tabele (ex: prețul unui produs după cod), SUMIFS/COUNTIFS adună și numără pe multiple condiții simultan, Tabelele Pivot rezumă mii de rânduri în 10 secunde fără formule scrise manual, iar Graficele Smart (Bar vs Line vs Scatter) fac tiparele vizibile instant.',
      intro: 'De la gestionarea unui buget personal sau a notelor pe materii până la analize de laborator și concursuri TIC de Clasa a VIII-a, Excel și Google Sheets sunt printre cele mai căutate competențe din lumea reală. Hai să vedem cum treci de la tabele simple la rapoarte dinamice profesioniste.',
      sections: [
        {
          id: 'vlookup-vs-xlookup-fara-erori',
          heading: '1. Căutarea între tabele: VLOOKUP(..., FALSE) vs. modernul XLOOKUP',
          paragraphs: [
            'De câte ori ai avut un tabel cu „Cod produs” și ai vrut să aduci automat numele sau prețul din alt tabel? VLOOKUP este funcția clasică, dar ascunde două capcane uriașe: coloana căutată trebuie să fie PRIMA din stânga, iar ultimul argument trebuie să fie obligatoriu FALSE (0) pentru potrivire exactă! XLOOKUP (disponibil în Excel 365, Excel 2021+ și Google Sheets) elimină ambele limitări:'
          ],
          table: {
            caption: 'Comparație VLOOKUP vs. XLOOKUP pentru elevi și proiecte',
            headers: ['Funcție', 'Sintaxă uzuală (Excel RO cu ;)', 'Avantaje & Capcane'],
            rows: [
              ['VLOOKUP', '=VLOOKUP(A2; $F$2:$H$50; 3; FALSE)', 'Funcționează peste tot; atenție la $F$2:$H$50 (blocat cu $) și la FALSE obligatoriu!'],
              ['XLOOKUP', '=XLOOKUP(A2; $F$2:$F$50; $H$2:$H$50; "Lipsă")', 'Caută și spre stânga, nu se strică dacă inserezi o coloană, are mesaj propriu dacă lipsește valoarea.']
            ]
          },
          callout: {
            title: 'De ce apare #N/A la VLOOKUP chiar dacă valoarea există?',
            text: 'De obicei din 3 motive: (1) un spațiu invizibil la final ("Ana " vs "Ana"), (2) un cod stocat ca text vs număr, sau (3) ai uitat semnul $ la tabel și intervalul a alunecat în jos la copierea formulei!',
            variant: 'warning'
          }
        },
        {
          id: 'sumifs-countifs-multicriteriu',
          heading: '2. Analiză pe condiții multiple: SUMIFS și COUNTIFS',
          paragraphs: [
            'Dacă IF și COUNTIF verifică o singură condiție, variantele cu S la final (SUMIFS, COUNTIFS, AVERAGEIFS) filtrează simultan după 2, 3 sau mai multe coloane. Atenție la ordinea argumentelor: la SUMIFS, intervalul de adunat este PRIMUL!'
          ],
          codeBlock: {
            title: 'Formule gata de copiat pentru un tabel de Cheltuieli / Note (Separator ; pentru RO / , pentru EN)',
            language: 'excel',
            code: `// 1. Total cheltuieli pentru categoria "Cărți" în luna "Noiembrie"
=SUMIFS(D2:D100; B2:B100; "Cărți"; C2:C100; "Noiembrie")

// 2. Câți elevi din Clasa "8A" au media >= 9.00
=COUNTIFS(B2:B35; "8A"; E2:E35; ">=9")

// 3. Căutare exactă preț după cod produs + mesaj curat la eroare
=IFERROR(VLOOKUP(A2; Catalog!$A$2:$C$50; 3; FALSE); "Cod inexistent")`,
            caption: 'Dacă Excel-ul tău este configurat în engleză (US), înlocuiește punct și virgulă (;) cu virgulă (,).'
          }
        },
        {
          id: 'pivot-tables-in-4-pasi',
          heading: '3. Tabele Pivot (Pivot Tables) în 4 clicuri: Rezumate fără nicio formulă',
          paragraphs: [
            'Când ai 500 de rânduri cu vânzări, note sau măsurători de senzori Arduino, nu trebuie să scrii 20 de formule SUMIFS. Un Tabel Pivot agregă automat datele în câteva secunde:'
          ],
          numberedSteps: [
            'Curăță tabelul sursă: fiecare coloană trebuie să aibă un titlu unic pe primul rând și niciun rând complet gol la mijloc.',
            'Selectează o celulă din tabel → Insert (Inserare) → PivotTable → OK (în foaie nouă).',
            'Trage câmpul de grupare (ex: „Clasă” sau „Categorie”) în zona Rows (Rânduri).',
            'Trage câmpul numeric (ex: „Sumă RON” sau „Punctaj”) în zona Values (Valori) și alege Sum, Average sau Count.'
          ]
        },
        {
          id: 'alegerea-graficului-corect',
          heading: '4. Cum alegi graficul corect la examen și prezentări (Regula Visual Clarity)',
          paragraphs: [
            'O diagramă frumoasă dar nepotrivită tipului de date scade punctajul la proiecte. Folosește această matrice rapidă pentru a alege diagrama optimă:'
          ],
          table: {
            caption: 'Matricea de selecție a graficelor în Excel & Google Sheets',
            headers: ['Tip de grafic', 'Când îl folosești', 'Când să îl EVIȚI'],
            rows: [
              ['Column / Bar Chart (Bare)', 'Compararea valorilor între categorii discrete (ex: note pe materii)', 'Când ai 30+ categorii înghesuite'],
              ['Line Chart (Linie)', 'Evoluție continuă în timp (temperaturi orare, progres zilnic)', 'Pentru categorii fără ordine cronologică'],
              ['Pie / Donut Chart (Structură)', 'Procente din 100% cu MAXIMUM 4–5 felii clare', 'Când ai 10 felii aproape egale sau valori negative!'],
              ['XY Scatter (Dispersie)', 'Relația matematică dintre 2 variabile numerice (ex: ore studiu vs punctaj)', 'Pentru etichete text']
            ]
          }
        }
      ],
      checklistTitle: 'Checklist pentru o foaie Excel / Sheets de nota 10',
      checklist: [
        'Am blocat cu $A$1:$C$50 tabelele de referință în VLOOKUP/SUMIFS înainte de tragerea formulei în jos.',
        'Am folosit potrivirea exactă FALSE (0) în VLOOKUP și am tratat erorile cu IFERROR.',
        'Fiecare grafic are Titlu clar, etichete de axe cu unități de măsură și zero felii ilizibile.',
        'Am verificat separatorul regional corect (; pe RO vs , pe EN).'
      ],
      faqs: [
        {
          question: 'Care este diferența principală dintre VLOOKUP și XLOOKUP?',
          answer: 'VLOOKUP poate căuta doar în prima coloană din stânga a tabelului și are nevoie de numărul coloanei și FALSE. XLOOKUP caută în orice direcție (stânga/dreapta), nu se strică dacă inserezi coloane noi și permite un mesaj personalizat când valoarea lipsește.'
        },
        {
          question: 'De ce trebuie să pun $ în formula =VLOOKUP(A2; $E$2:$G$20; 3; FALSE)?',
          answer: 'Fără semnul $ (referință absolută), când copiezi formula pe rândurile de dedesubt, tabelul $E$2:$G$20 alunecă în E3:G21, E4:G22 etc., pierzând primele înregistrări și generând erori #N/A.'
        },
        {
          question: 'Ce este mai rapid pentru un raport cu 5 categorii: SUMIFS sau Pivot Table?',
          answer: 'Pentru un dashboard fix cu design strict, SUMIFS îți dă control pixel-cu-pixel; pentru explorare rapidă și grupare din mers pe mii de rânduri, Pivot Table este de 10 ori mai rapid.'
        },
        {
          question: 'Cum exersez Excel cu corectare automată pentru Clasa a VIII-a?',
          answer: 'Pe ArkyEdu ai 4 misiuni interactive dedicate calculului tabelar în Clasa a VIII-a și fișa completă cu barem oficial de 100p la /fise/.'
        }
      ],
      internalLinksTitle: 'Simulatoare Excel & Fișe cu Barem pe ArkyEdu',
      internalLinks: [
        {
          label: 'Funcții & Formule Excel (Clasa a VIII-a)',
          url: '/cursuri/g8_calc_b/',
          missionId: 'g8_calc_b',
          description: 'Misiune interactivă cu formule SUM, AVERAGE, IF, COUNTIF și referințe absolute.'
        },
        {
          label: 'Diagrame 2D/3D & Analiză Date (Clasa VIII)',
          url: '/cursuri/g8_calc_c/',
          missionId: 'g8_calc_c',
          description: 'Construirea și interpretarea graficelor corecte pe date reale.'
        },
        {
          label: 'Fișă Excel cu Barem 1–10 (Clasa VIII)',
          url: '/fise/fisa-de-lucru-clasa-8-excel-sum-average-if-countif-referinta-absoluta-erori/',
          targetView: 'fise',
          description: 'Antrenament auto-corectat și tipăribil A4 pentru evaluare.'
        },
        {
          label: 'Glosar: Referințe Relative vs. Absolute ($A$1)',
          url: '/glosar/referinte-relative-absolute-excel/',
          targetView: 'glossary',
          description: 'Explicație rapidă și capcane frecvente la test.'
        }
      ]
    },
    en: {
      slug: 'advanced-excel-vlookup-xlookup-sumifs-pivot-tables-charts-guide',
      title: 'Advanced Excel & Google Sheets (Grade 8 & Projects): XLOOKUP / VLOOKUP, SUMIFS, Pivot Tables & Smart Charts',
      metaTitle: 'Advanced Excel Guide: XLOOKUP, VLOOKUP, SUMIFS & Pivot Tables | ArkyEdu',
      metaDescription: 'Practical spreadsheet guide: VLOOKUP vs XLOOKUP, multi-criteria SUMIFS/COUNTIFS, 4-step Pivot Tables, choosing the right chart type, and fixing #N/A errors.',
      keywords: 'vlookup vs xlookup explained simply, sumifs and countifs tutorial, how to create a pivot table in excel, choosing the right chart type excel, fix vlookup na error, grade 8 spreadsheets project',
      breadcrumbLabel: 'Advanced Excel: XLOOKUP, SUMIFS, Pivot',
      categoryLabel: 'Excel & Office',
      readTime: '13 min read',
      tldrTitle: 'Quick Answer (TL;DR)',
      tldr: 'Once you master SUM, AVERAGE, and IF, four power tools turn any spreadsheet into an automated system: VLOOKUP(val, table, col, FALSE) or modern XLOOKUP() pulls matching records across sheets, SUMIFS/COUNTIFS aggregate across multiple filters at once, Pivot Tables summarize thousands of rows in 10 seconds with zero manual formulas, and matching chart types (Bar vs Line vs Scatter) make trends immediately clear.',
      intro: 'Whether tracking a class budget, analyzing Arduino sensor logs, or acing Grade 8 ICT projects, Excel and Google Sheets remain some of the highest-leverage skills you can learn. Here is how to level up from basic tables to dynamic, error-proof reports.',
      sections: [
        {
          id: 'vlookup-vs-xlookup',
          heading: '1. Cross-Table Lookups: VLOOKUP(..., FALSE) vs. Modern XLOOKUP',
          paragraphs: [
            'Classic VLOOKUP forces the lookup key to be the leftmost column and silently gives wrong approximate matches unless you specify FALSE (0). Modern XLOOKUP (Excel 365 / 2021+ / Google Sheets) removes both traps:'
          ],
          table: {
            caption: 'VLOOKUP vs. XLOOKUP quick comparison',
            headers: ['Function', 'Standard Syntax (EN comma separator)', 'Pros & Gotchas'],
            rows: [
              ['VLOOKUP', '=VLOOKUP(A2, $F$2:$H$50, 3, FALSE)', 'Universal compatibility; always lock $F$2:$H$50 and include FALSE!'],
              ['XLOOKUP', '=XLOOKUP(A2, $F$2:$F$50, $H$2:$H$50, "Not found")', 'Works left or right, survives inserted columns, built-in fallback text.']
            ]
          },
          callout: {
            title: 'Why #N/A Happens Even When the Value Looks Identical',
            text: 'Three culprits cause 90% of #N/A errors: trailing spaces ("Alex " vs "Alex"), numbers stored as text, or an unlocked lookup range sliding down when dragged.',
            variant: 'warning'
          }
        },
        {
          id: 'sumifs-and-countifs',
          heading: '2. Multi-Criteria Formulas: SUMIFS and COUNTIFS',
          paragraphs: [
            'Adding an „S” lets you filter by 2 or more columns simultaneously. Remember that in SUMIFS, the sum_range goes FIRST, unlike single-criterion SUMIF:'
          ],
          codeBlock: {
            title: 'Copy-ready SUMIFS, COUNTIFS, and IFERROR templates (EN syntax)',
            language: 'excel',
            code: `// 1. Total spending for "Books" in "November"
=SUMIFS(D2:D100, B2:B100, "Books", C2:C100, "November")

// 2. Count students in class "8A" scoring >= 90
=COUNTIFS(B2:B35, "8A", E2:E35, ">=90")

// 3. Safe price lookup with friendly fallback
=IFERROR(VLOOKUP(A2, Catalog!$A$2:$C$50, 3, FALSE), "Missing SKU")`,
            caption: 'Note: European/Romanian Excel locales use semicolons (;) instead of commas (,).'
          }
        },
        {
          id: 'pivot-tables-four-steps',
          heading: '3. Pivot Tables in 4 Clicks: Instant Summaries Without Formulas',
          paragraphs: [
            'When analyzing hundreds of rows of grades, sales, or sensor data, Pivot Tables summarize everything without writing nested formulas:'
          ],
          numberedSteps: [
            'Ensure row 1 has clean, unique column headers with no blank rows inside the table.',
            'Click inside your data → Insert → PivotTable → OK.',
            'Drag your grouping column (e.g., Grade or Category) into Rows.',
            'Drag your numeric metric (e.g., Score or Amount) into Values and pick Sum, Average, or Count.'
          ]
        },
        {
          id: 'choosing-the-right-chart',
          heading: '4. Choosing the Right Chart Type (Visual Clarity Matrix)',
          paragraphs: [
            'Picking the wrong chart hides insights and costs points on projects. Match your chart to your data structure:'
          ],
          table: {
            caption: 'Chart selection cheat sheet',
            headers: ['Chart Type', 'Best Used For', 'Avoid When'],
            rows: [
              ['Column / Bar Chart', 'Comparing discrete categories side by side', 'Displaying 30+ crowded bars'],
              ['Line Chart', 'Continuous change over time (daily temp, progress)', 'Categories have no natural time order'],
              ['Pie / Donut Chart', 'Parts of a 100% whole with AT MOST 4–5 slices', 'More than 6 slices or negative numbers'],
              ['XY Scatter Plot', 'Correlation between two numeric variables', 'Categorical text labels']
            ]
          }
        }
      ],
      checklistTitle: 'A+ Spreadsheet Project Checklist',
      checklist: [
        'Locked lookup ranges with absolute $A$1:$C$50 references before dragging formulas.',
        'Used exact-match FALSE (0) in VLOOKUP and wrapped lookups in IFERROR.',
        'Added descriptive titles and units to every chart.',
        'Verified locale formula separator (, vs ;).'
      ],
      faqs: [
        {
          question: 'What is the main advantage of XLOOKUP over VLOOKUP?',
          answer: 'XLOOKUP searches in any direction, does not break when columns are inserted, defaults to exact match, and lets you supply a custom not-found message.'
        },
        {
          question: 'Why must I add $ signs to the table range in VLOOKUP?',
          answer: 'Without $ absolute anchors, dragging the formula down shifts the lookup table reference down too, causing top rows to be skipped and triggering #N/A errors.'
        },
        {
          question: 'When should I pick a Pivot Table instead of SUMIFS?',
          answer: 'Use Pivot Tables for fast interactive grouping and exploration; use SUMIFS when building fixed formatted dashboards.'
        },
        {
          question: 'Where can I practice Grade 8 spreadsheets interactively?',
          answer: 'Try the ArkyEdu Grade 8 Spreadsheet missions and auto-graded 100-point rubric worksheets at /fise/en/.'
        }
      ],
      internalLinksTitle: 'Practice Excel & Rubrics on ArkyEdu',
      internalLinks: [
        {
          label: 'Excel Formulas & Functions (Grade 8)',
          url: '/cursuri/g8_calc_b/',
          missionId: 'g8_calc_b',
          description: 'Interactive Grade 8 mission covering SUM, IF, COUNTIF & $A$1.'
        },
        {
          label: '2D/3D Charts & Data Visualization (Grade 8)',
          url: '/cursuri/g8_calc_c/',
          missionId: 'g8_calc_c',
          description: 'Build clean charts and interpret datasets.'
        },
        {
          label: 'Grade 8 Excel Worksheet & 100-Pt Rubric',
          url: '/fise/en/grade-8-excel-formulas-sum-average-if-countif-absolute-errors-worksheet/',
          targetView: 'fise',
          description: 'Interactive auto-graded exam sheet and A4 print view.'
        },
        {
          label: 'Glossary: Relative vs. Absolute References ($A$1)',
          url: '/glosar/en/excel-cell-range-absolute/',
          targetView: 'glossary',
          description: 'Quick formula syntax & common test errors.'
        }
      ]
    }
  }
];
