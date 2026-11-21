import { AllMissionId } from '../types';

// ============================================================================
// 1. ALGORITHM SORTING & SEARCHING VISUALIZER ENGINE
// ============================================================================

export type AlgoId = 'bubble' | 'selection' | 'insertion' | 'binary_search' | 'linear_search';

export interface AlgoStep {
  array: number[];
  comparing: number[];
  swapping: number[];
  sorted: number[];
  eliminated: number[];
  low?: number;
  mid?: number;
  high?: number;
  foundIndex?: number;
  codeLine: number;
  comparisons: number;
  swaps: number;
  reads: number;
  explanationRo: string;
  explanationEn: string;
}

export interface AlgoDefinition {
  id: AlgoId;
  category: 'sort' | 'search';
  nameRo: string;
  nameEn: string;
  complexityBest: string;
  complexityWorst: string;
  gradeLabelRo: string;
  gradeLabelEn: string;
  summaryRo: string;
  summaryEn: string;
  cppLines: string[];
  defaultArray: number[];
  defaultTarget?: number;
  fullCppForSandbox: string;
  defaultStdinForSandbox: string;
}

export interface AlgoChallengeItem {
  id: string;
  questionRo: string;
  questionEn: string;
  optionsRo: string[];
  optionsEn: string[];
  correctIdx: number;
  explanationRo: string;
  explanationEn: string;
  rewardCoins: number;
}

export const ALGO_DEFINITIONS: AlgoDefinition[] = [
  {
    id: 'bubble',
    category: 'sort',
    nameRo: 'Bubble Sort (Sortarea prin Bule)',
    nameEn: 'Bubble Sort (Swapping Adjacent Pairs)',
    complexityBest: 'O(n)',
    complexityWorst: 'O(n²)',
    gradeLabelRo: 'Clasa VII–VIII · Algoritmi pe Vectori',
    gradeLabelEn: 'Grades 7–8 · Array Sorting',
    summaryRo:
      'Compară elemente vecine și le interschimbă (Regula celor 3 Pahare) dacă sunt în ordine greșită. Valorile mari „urcă la suprafață” ca bulele.',
    summaryEn:
      'Repeatedly compares adjacent elements and swaps them if out of order. Larger values bubble up to the end of the array each pass.',
    cppLines: [
      'for (int i = 0; i < n - 1; i++) {',
      '  bool swapped = false;',
      '  for (int j = 0; j < n - i - 1; j++) {',
      '    if (v[j] > v[j + 1]) {',
      '      swap(v[j], v[j + 1]); swapped = true;',
      '    }',
      '  }',
      '  if (!swapped) break;',
      '}',
    ],
    defaultArray: [42, 17, 65, 23, 88, 12, 54, 31],
    fullCppForSandbox: `#include <iostream>
using namespace std;

int main() {
    int n, v[100];
    cin >> n;
    for (int i = 0; i < n; i++) cin >> v[i];

    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (v[j] > v[j + 1]) {
                int aux = v[j];
                v[j] = v[j + 1];
                v[j + 1] = aux;
                swapped = true;
            }
        }
        if (!swapped) break;
    }

    for (int i = 0; i < n; i++) cout << v[i] << " ";
    return 0;
}`,
    defaultStdinForSandbox: '8\n42 17 65 23 88 12 54 31',
  },
  {
    id: 'selection',
    category: 'sort',
    nameRo: 'Selection Sort (Sortare prin Selecție)',
    nameEn: 'Selection Sort (Minimum Pick)',
    complexityBest: 'O(n²)',
    complexityWorst: 'O(n²)',
    gradeLabelRo: 'Clasa VIII · Admitere & OJI',
    gradeLabelEn: 'Grade 8 · Minimum Selection',
    summaryRo:
      'La fiecare pas i, caută cel mai mic element din restul vectorului și îl aduce pe poziția i printr-o singură interschimbare.',
    summaryEn:
      'Finds the smallest remaining element in the unsorted tail and swaps it once into position i.',
    cppLines: [
      'for (int i = 0; i < n - 1; i++) {',
      '  int minIdx = i;',
      '  for (int j = i + 1; j < n; j++) {',
      '    if (v[j] < v[minIdx]) minIdx = j;',
      '  }',
      '  if (minIdx != i) swap(v[i], v[minIdx]);',
      '}',
    ],
    defaultArray: [58, 19, 73, 14, 46, 82, 27, 39],
    fullCppForSandbox: `#include <iostream>
using namespace std;

int main() {
    int n, v[100];
    cin >> n;
    for (int i = 0; i < n; i++) cin >> v[i];

    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (v[j] < v[minIdx]) minIdx = j;
        }
        if (minIdx != i) {
            int aux = v[i];
            v[i] = v[minIdx];
            v[minIdx] = aux;
        }
    }

    for (int i = 0; i < n; i++) cout << v[i] << " ";
    return 0;
}`,
    defaultStdinForSandbox: '8\n58 19 73 14 46 82 27 39',
  },
  {
    id: 'insertion',
    category: 'sort',
    nameRo: 'Insertion Sort (Sortare prin Inserție)',
    nameEn: 'Insertion Sort (Playing Card Method)',
    complexityBest: 'O(n)',
    complexityWorst: 'O(n²)',
    gradeLabelRo: 'Clasa VIII · Vectori Sortați Aproape',
    gradeLabelEn: 'Grade 8 · Incremental Sort',
    summaryRo:
      'Funcționează ca aranjarea cărților de joc în mână: ia fiecare element și îl inserează la locul potrivit spre stânga.',
    summaryEn:
      'Works like sorting playing cards in your hand: picks each key and shifts larger sorted items rightward to insert it.',
    cppLines: [
      'for (int i = 1; i < n; i++) {',
      '  int key = v[i], j = i - 1;',
      '  while (j >= 0 && v[j] > key) {',
      '    v[j + 1] = v[j]; j--;',
      '  }',
      '  v[j + 1] = key;',
      '}',
    ],
    defaultArray: [25, 62, 18, 49, 11, 77, 34, 53],
    fullCppForSandbox: `#include <iostream>
using namespace std;

int main() {
    int n, v[100];
    cin >> n;
    for (int i = 0; i < n; i++) cin >> v[i];

    for (int i = 1; i < n; i++) {
        int key = v[i];
        int j = i - 1;
        while (j >= 0 && v[j] > key) {
            v[j + 1] = v[j];
            j--;
        }
        v[j + 1] = key;
    }

    for (int i = 0; i < n; i++) cout << v[i] << " ";
    return 0;
}`,
    defaultStdinForSandbox: '8\n25 62 18 49 11 77 34 53',
  },
  {
    id: 'binary_search',
    category: 'search',
    nameRo: 'Căutare Binară (Divide et Impera)',
    nameEn: 'Binary Search (Divide & Conquer)',
    complexityBest: 'O(1)',
    complexityWorst: 'O(log₂ n)',
    gradeLabelRo: 'Clasa VIII · Eficiență Logaritmică',
    gradeLabelEn: 'Grade 8 · Logarithmic Lookup',
    summaryRo:
      'Pe un vector DEJA SORTAT, verifică mijlocul și elimină jumătate din elemente la fiecare pas! Pentru 1.000 de elemente face maxim 10 pași.',
    summaryEn:
      'On a SORTED array, checks the middle index and halves the remaining search space every step—1,000 items take at most 10 checks!',
    cppLines: [
      'int left = 0, right = n - 1, pos = -1;',
      'while (left <= right) {',
      '  int mid = left + (right - left) / 2;',
      '  if (v[mid] == target) { pos = mid; break; }',
      '  else if (v[mid] < target) left = mid + 1;',
      '  else right = mid - 1;',
      '}',
    ],
    defaultArray: [6, 12, 19, 25, 34, 42, 51, 63, 71, 84, 92, 99],
    defaultTarget: 71,
    fullCppForSandbox: `#include <iostream>
using namespace std;

int main() {
    int n, target, v[100];
    cin >> n >> target;
    for (int i = 0; i < n; i++) cin >> v[i];

    int left = 0, right = n - 1, pos = -1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (v[mid] == target) {
            pos = mid;
            break;
        } else if (v[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    cout << pos;
    return 0;
}`,
    defaultStdinForSandbox: '12 71\n6 12 19 25 34 42 51 63 71 84 92 99',
  },
  {
    id: 'linear_search',
    category: 'search',
    nameRo: 'Căutare Secvențială (Liniară)',
    nameEn: 'Linear Search (Sequential Scan)',
    complexityBest: 'O(1)',
    complexityWorst: 'O(n)',
    gradeLabelRo: 'Clasa VII · Parcurgere Element cu Element',
    gradeLabelEn: 'Grade 7 · Sequential Loop',
    summaryRo:
      'Verifică elementele pe rând de la stânga la dreapta. Funcționează și pe vectori nesortați, dar poate verifica toate n elementele.',
    summaryEn:
      'Inspects items one by one from left to right. Works on unsorted arrays, but worst-case checks all n items.',
    cppLines: [
      'int pos = -1;',
      'for (int i = 0; i < n; i++) {',
      '  if (v[i] == target) {',
      '    pos = i; break;',
      '  }',
      '}',
    ],
    defaultArray: [6, 12, 19, 25, 34, 42, 51, 63, 71, 84, 92, 99],
    defaultTarget: 71,
    fullCppForSandbox: `#include <iostream>
using namespace std;

int main() {
    int n, target, v[100];
    cin >> n >> target;
    for (int i = 0; i < n; i++) cin >> v[i];

    int pos = -1;
    for (int i = 0; i < n; i++) {
        if (v[i] == target) {
            pos = i;
            break;
        }
    }
    cout << pos;
    return 0;
}`,
    defaultStdinForSandbox: '12 71\n6 12 19 25 34 42 51 63 71 84 92 99',
  },
];

export const ALGO_ARRAY_PRESETS: Array<{
  id: string;
  labelRo: string;
  labelEn: string;
  values: number[];
}> = [
  { id: 'balanced', labelRo: 'Aleatoriu (8 elem.)', labelEn: 'Balanced Random (8)', values: [42, 17, 65, 23, 88, 12, 54, 31] },
  { id: 'worst', labelRo: 'Descrescător (Worst-Case)', labelEn: 'Reversed (Worst Case)', values: [90, 78, 66, 54, 43, 32, 21, 10] },
  { id: 'nearly', labelRo: 'Aproape Sortat', labelEn: 'Nearly Sorted', values: [12, 24, 35, 30, 48, 60, 57, 85] },
  { id: 'sorted12', labelRo: 'Sortat 12 elem. (Căutare)', labelEn: 'Sorted 12 (Search)', values: [6, 12, 19, 25, 34, 42, 51, 63, 71, 84, 92, 99] },
];

export function generateAlgorithmSteps(algoId: AlgoId, inputArray: number[], target = 71): AlgoStep[] {
  const arr = [...inputArray];
  const n = arr.length;
  const steps: AlgoStep[] = [];
  let comparisons = 0;
  let swaps = 0;
  let reads = 0;

  const pushStep = (partial: Omit<AlgoStep, 'array' | 'comparisons' | 'swaps' | 'reads'>) => {
    steps.push({
      array: [...arr],
      comparisons,
      swaps,
      reads,
      ...partial,
    });
  };

  if (algoId === 'bubble') {
    const sorted: number[] = [];
    pushStep({
      comparing: [],
      swapping: [],
      sorted: [...sorted],
      eliminated: [],
      codeLine: 0,
      explanationRo: `Începem Bubble Sort pe ${n} elemente.`,
      explanationEn: `Starting Bubble Sort on ${n} elements.`,
    });

    for (let i = 0; i < n - 1; i++) {
      let swapped = false;
      for (let j = 0; j < n - i - 1; j++) {
        comparisons++;
        reads += 2;
        pushStep({
          comparing: [j, j + 1],
          swapping: [],
          sorted: [...sorted],
          eliminated: [],
          codeLine: 3,
          explanationRo: `Comparăm v[${j}]=${arr[j]} cu v[${j + 1}]=${arr[j + 1]}.`,
          explanationEn: `Comparing v[${j}]=${arr[j]} and v[${j + 1}]=${arr[j + 1]}.`,
        });

        if (arr[j] > arr[j + 1]) {
          const tmp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = tmp;
          swaps++;
          swapped = true;
          pushStep({
            comparing: [],
            swapping: [j, j + 1],
            sorted: [...sorted],
            eliminated: [],
            codeLine: 4,
            explanationRo: `${arr[j + 1]} > ${arr[j]}: le interschimbăm pe pozițiile ${j} și ${j + 1}!`,
            explanationEn: `Out of order: swapped positions ${j} and ${j + 1}!`,
          });
        }
      }
      sorted.unshift(n - 1 - i);
      if (!swapped) {
        for (let k = 0; k < n; k++) {
          if (!sorted.includes(k)) sorted.push(k);
        }
        pushStep({
          comparing: [],
          swapping: [],
          sorted: [...sorted],
          eliminated: [],
          codeLine: 7,
          explanationRo: `Nicio interschimbare la trecerea ${i + 1}: vectorul este deja sortat! Oprire timpurie.`,
          explanationEn: `Zero swaps in pass ${i + 1}: array is already sorted! Early exit.`,
        });
        break;
      }
    }
    const allSorted = Array.from({ length: n }, (_, k) => k);
    pushStep({
      comparing: [],
      swapping: [],
      sorted: allSorted,
      eliminated: [],
      codeLine: 8,
      explanationRo: `Sortare completă în ${comparisons} comparații și ${swaps} interschimbări.`,
      explanationEn: `Sorting complete in ${comparisons} comparisons and ${swaps} swaps.`,
    });
  } else if (algoId === 'selection') {
    const sorted: number[] = [];
    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      reads++;
      pushStep({
        comparing: [i],
        swapping: [],
        sorted: [...sorted],
        eliminated: [],
        codeLine: 1,
        explanationRo: `Pasul ${i + 1}: presupunem minimul provizoriu pe poziția ${i} (${arr[i]}).`,
        explanationEn: `Pass ${i + 1}: assuming current minimum at index ${i} (${arr[i]}).`,
      });
      for (let j = i + 1; j < n; j++) {
        comparisons++;
        reads += 2;
        pushStep({
          comparing: [minIdx, j],
          swapping: [],
          sorted: [...sorted],
          eliminated: [],
          codeLine: 3,
          explanationRo: `Verificăm v[${j}]=${arr[j]} față de minimul curent v[${minIdx}]=${arr[minIdx]}.`,
          explanationEn: `Checking v[${j}]=${arr[j]} against current min v[${minIdx}]=${arr[minIdx]}.`,
        });
        if (arr[j] < arr[minIdx]) {
          minIdx = j;
        }
      }
      if (minIdx !== i) {
        const tmp = arr[i];
        arr[i] = arr[minIdx];
        arr[minIdx] = tmp;
        swaps++;
        pushStep({
          comparing: [],
          swapping: [i, minIdx],
          sorted: [...sorted],
          eliminated: [],
          codeLine: 5,
          explanationRo: `Aducem minimul ${arr[i]} pe poziția finală ${i} (schimb cu index ${minIdx}).`,
          explanationEn: `Moved minimum ${arr[i]} into slot ${i} (swapped with index ${minIdx}).`,
        });
      }
      sorted.push(i);
    }
    pushStep({
      comparing: [],
      swapping: [],
      sorted: Array.from({ length: n }, (_, k) => k),
      eliminated: [],
      codeLine: 6,
      explanationRo: `Selection Sort finalizat: ${comparisons} comparații, doar ${swaps} interschimbări.`,
      explanationEn: `Selection Sort done: ${comparisons} comparisons, only ${swaps} swaps.`,
    });
  } else if (algoId === 'insertion') {
    const sorted = [0];
    pushStep({
      comparing: [],
      swapping: [],
      sorted: [...sorted],
      eliminated: [],
      codeLine: 0,
      explanationRo: `Primul element v[0]=${arr[0]} formează zona sortată inițială.`,
      explanationEn: `First element v[0]=${arr[0]} forms the initial sorted hand.`,
    });
    for (let i = 1; i < n; i++) {
      const key = arr[i];
      let j = i - 1;
      reads++;
      pushStep({
        comparing: [i],
        swapping: [],
        sorted: [...sorted],
        eliminated: [],
        codeLine: 1,
        explanationRo: `Luăm „cartea” key = ${key} de la index ${i} pentru a o insera în stânga.`,
        explanationEn: `Picked key = ${key} at index ${i} to insert leftward.`,
      });
      while (j >= 0) {
        comparisons++;
        reads++;
        if (arr[j] > key) {
          arr[j + 1] = arr[j];
          arr[j] = key;
          swaps++;
          pushStep({
            comparing: [],
            swapping: [j, j + 1],
            sorted: [...sorted, i],
            eliminated: [],
            codeLine: 3,
            explanationRo: `${arr[j + 1]} > ${key}: deplasăm ${arr[j + 1]} spre dreapta.`,
            explanationEn: `${arr[j + 1]} > ${key}: shifted ${arr[j + 1]} one step right.`,
          });
          j--;
        } else {
          break;
        }
      }
      arr[j + 1] = key;
      if (!sorted.includes(i)) sorted.push(i);
    }
    pushStep({
      comparing: [],
      swapping: [],
      sorted: Array.from({ length: n }, (_, k) => k),
      eliminated: [],
      codeLine: 6,
      explanationRo: `Insertion Sort complet: ${comparisons} comparații și ${swaps} mutări.`,
      explanationEn: `Insertion Sort finished: ${comparisons} comparisons and ${swaps} shifts.`,
    });
  } else if (algoId === 'binary_search') {
    arr.sort((a, b) => a - b);
    let left = 0;
    let right = n - 1;
    let foundIndex: number | undefined = undefined;
    const eliminated: number[] = [];

    pushStep({
      comparing: [],
      swapping: [],
      sorted: [],
      eliminated: [],
      low: left,
      high: right,
      codeLine: 0,
      explanationRo: `Vectorul este sortat crescător. Căutăm ținta ${target} între indecșii [${left}..${right}].`,
      explanationEn: `Sorted array ready. Searching target ${target} within [${left}..${right}].`,
    });

    while (left <= right) {
      const mid = left + Math.floor((right - left) / 2);
      comparisons++;
      reads++;
      pushStep({
        comparing: [mid],
        swapping: [],
        sorted: [],
        eliminated: [...eliminated],
        low: left,
        mid,
        high: right,
        codeLine: 2,
        explanationRo: `Mijloc mid = ${mid}, unde v[${mid}] = ${arr[mid]} (căutăm ${target}).`,
        explanationEn: `Midpoint mid = ${mid}, where v[${mid}] = ${arr[mid]} (looking for ${target}).`,
      });

      if (arr[mid] === target) {
        foundIndex = mid;
        pushStep({
          comparing: [],
          swapping: [],
          sorted: [mid],
          eliminated: [...eliminated],
          low: left,
          mid,
          high: right,
          foundIndex,
          codeLine: 3,
          explanationRo: `Găsit! v[${mid}] == ${target} în doar ${comparisons} verificări!`,
          explanationEn: `Found! v[${mid}] == ${target} in just ${comparisons} checks!`,
        });
        break;
      } else if (arr[mid] < target) {
        for (let k = left; k <= mid; k++) {
          if (!eliminated.includes(k)) eliminated.push(k);
        }
        left = mid + 1;
        pushStep({
          comparing: [],
          swapping: [],
          sorted: [],
          eliminated: [...eliminated],
          low: left,
          mid,
          high: right,
          codeLine: 4,
          explanationRo: `${arr[mid]} < ${target}: eliminăm jumătatea stângă și mutăm left = ${left}.`,
          explanationEn: `${arr[mid]} < ${target}: discarded left half, moving left = ${left}.`,
        });
      } else {
        for (let k = mid; k <= right; k++) {
          if (!eliminated.includes(k)) eliminated.push(k);
        }
        right = mid - 1;
        pushStep({
          comparing: [],
          swapping: [],
          sorted: [],
          eliminated: [...eliminated],
          low: left,
          mid,
          high: right,
          codeLine: 5,
          explanationRo: `${arr[mid]} > ${target}: eliminăm jumătatea dreaptă și mutăm right = ${right}.`,
          explanationEn: `${arr[mid]} > ${target}: discarded right half, moving right = ${right}.`,
        });
      }
    }

    if (foundIndex === undefined) {
      pushStep({
        comparing: [],
        swapping: [],
        sorted: [],
        eliminated: Array.from({ length: n }, (_, k) => k),
        codeLine: 6,
        explanationRo: `left > right: valoarea ${target} nu există în vector (${comparisons} verificări).`,
        explanationEn: `left > right: target ${target} not found in array (${comparisons} checks).`,
      });
    }
  } else {
    // linear_search
    const eliminated: number[] = [];
    let found = false;
    for (let i = 0; i < n; i++) {
      comparisons++;
      reads++;
      pushStep({
        comparing: [i],
        swapping: [],
        sorted: [],
        eliminated: [...eliminated],
        codeLine: 2,
        explanationRo: `Verificăm pas cu pas indexul ${i}: v[${i}] = ${arr[i]} (țintă: ${target}).`,
        explanationEn: `Checking index ${i}: v[${i}] = ${arr[i]} (target: ${target}).`,
      });
      if (arr[i] === target) {
        found = true;
        pushStep({
          comparing: [],
          swapping: [],
          sorted: [i],
          eliminated: [...eliminated],
          foundIndex: i,
          codeLine: 3,
          explanationRo: `Găsit pe poziția ${i} după ${comparisons} comparații secvențiale!`,
          explanationEn: `Found at index ${i} after ${comparisons} sequential comparisons!`,
        });
        break;
      }
      eliminated.push(i);
    }
    if (!found) {
      pushStep({
        comparing: [],
        swapping: [],
        sorted: [],
        eliminated: Array.from({ length: n }, (_, k) => k),
        codeLine: 5,
        explanationRo: `Nu a fost găsit după scanarea tuturor celor ${n} elemente.`,
        explanationEn: `Not found after scanning all ${n} items.`,
      });
    }
  }

  return steps;
}

export const ALGO_CHALLENGES: AlgoChallengeItem[] = [
  {
    id: 'algo_q1',
    questionRo: 'Într-un dicționar cu 1.024 de cuvinte sortate alfabetic, câți pași face Căutarea Binară în cel mai rău caz?',
    questionEn: 'In a sorted dictionary of 1,024 words, how many steps does Binary Search take in the worst case?',
    optionsRo: ['10 pași (pentru că 2¹⁰ = 1024)', '512 pași', '1.024 pași'],
    optionsEn: ['10 steps (since 2¹⁰ = 1,024)', '512 steps', '1,024 steps'],
    correctIdx: 0,
    explanationRo: 'La fiecare pas spațiul se înjumătățește: 1024 → 512 → 256 → 128 → 64 → 32 → 16 → 8 → 4 → 2 → 1 (log₂ 1024 = 10).',
    explanationEn: 'Each check halves the search window: 1,024 → 512 → ... → 1 in just 10 steps (log₂ 1,024).',
    rewardCoins: 30,
  },
  {
    id: 'algo_q2',
    questionRo: 'De ce este Bubble Sort cu variabila booleană `swapped` mult mai rapid pe un vector deja sortat?',
    questionEn: 'Why is Bubble Sort with a `swapped` flag dramatically faster on an already-sorted array?',
    optionsRo: [
      'Se oprește după prima trecere (O(n)) dacă nu face nicio interschimbare',
      'Sare peste numerele pare automat',
      'Transformă vectorul în arbore binar',
    ],
    optionsEn: [
      'It halts right after Pass 1 (O(n)) when zero swaps occur',
      'It skips even numbers automatically',
      'It converts the array into a hash map',
    ],
    correctIdx: 0,
    explanationRo: 'Variabila semafor `swapped` detectează că toate perechile vecine sunt deja în ordine și oprește buclele.',
    explanationEn: 'The boolean flag `swapped` spots that zero neighbors needed swapping and exits early.',
    rewardCoins: 30,
  },
  {
    id: 'algo_q3',
    questionRo: 'Care algoritm de sortare din tabel face de obicei cele mai PUȚINE interschimbări fizice în memorie pentru elemente mari?',
    questionEn: 'Which sorting algorithm performs at most n − 1 physical swaps across the entire run?',
    optionsRo: ['Selection Sort (maxim 1 schimb pe pas exterior)', 'Bubble Sort descrescător', 'Căutare liniară'],
    optionsEn: ['Selection Sort (at most 1 swap per outer pass)', 'Worst-case Bubble Sort', 'Linear scan'],
    correctIdx: 0,
    explanationRo: 'Selection Sort doar caută indexul minimului și îl mută o singură dată la finalul fiecărei treceri.',
    explanationEn: 'Selection Sort tracks `minIdx` and performs only one swap at the end of each pass.',
    rewardCoins: 30,
  },
  {
    id: 'algo_q4',
    questionRo: 'Ce condiție OBLIGATORIE trebuie să îndeplinească vectorul înainte să aplici Căutarea Binară?',
    questionEn: 'What strict precondition MUST hold before running Binary Search on an array?',
    optionsRo: [
      'Elementele să fie deja sortate (crescător sau descrescător)',
      'Să conțină doar numere prime',
      'Să aibă lungime pară',
    ],
    optionsEn: [
      'The array elements must already be sorted in order',
      'All values must be prime numbers',
      'The array must have an even length',
    ],
    correctIdx: 0,
    explanationRo: 'Fără sortare prealabilă, compararea cu `v[mid]` nu poate decide în siguranță ce jumătate să elimine.',
    explanationEn: 'Without sorted order, comparing against `v[mid]` cannot safely discard half the array.',
    rewardCoins: 30,
  },
];

// ============================================================================
// 2. BINARY, HEX, ASCII, 24-BIT RGB & BITWISE PUZZLES
// ============================================================================

export interface BinaryPuzzleItem {
  id: string;
  promptRo: string;
  promptEn: string;
  targetDecimal: number;
  hintRo: string;
  hintEn: string;
  rewardCoins: number;
}

export const BINARY_PUZZLES: BinaryPuzzleItem[] = [
  {
    id: 'bin_42',
    promptRo: 'Setează biții din registrul de 8 biți pentru a forma numărul 42 (Răspunsul Universal TIC):',
    promptEn: 'Toggle the 8-bit LED switches to encode the decimal value 42:',
    targetDecimal: 42,
    hintRo: 'Descompune în puteri ale lui 2: 32 + 8 + 2 = 42 → 00101010.',
    hintEn: 'Sum powers of two: 32 + 8 + 2 = 42 → 00101010.',
    rewardCoins: 25,
  },
  {
    id: 'bin_ascii_a',
    promptRo: 'Codul ASCII al literei mari „A” este 65. Formează 65 pe placa de biți!',
    promptEn: 'The ASCII code for uppercase "A" is 65. Set the 8-bit register to 65!',
    targetDecimal: 65,
    hintRo: '64 + 1 = 65 → doar bitul 6 (64) și bitul 0 (1) sunt 1.',
    hintEn: '64 + 1 = 65 → flip on bit 64 and bit 1.',
    rewardCoins: 25,
  },
  {
    id: 'bin_0xff',
    promptRo: 'Ce valoare zecimală maximă încape într-un singur Byte (8 biți = 0xFF)? Formează valoarea maximă!',
    promptEn: 'Form the maximum value storable in 1 unsigned Byte (0xFF in Hex)!',
    targetDecimal: 255,
    hintRo: '128 + 64 + 32 + 16 + 8 + 4 + 2 + 1 = 255 (toți cei 8 biți aprinși = 11111111).',
    hintEn: '128+64+32+16+8+4+2+1 = 255 (all 8 bits HIGH = 11111111).',
    rewardCoins: 25,
  },
  {
    id: 'bin_105',
    promptRo: 'În rețelistică, adresa IP se termină cu octetul 105. Aprinde LED-urile pentru 105!',
    promptEn: 'An IPv4 host octet ends in 105. Encode decimal 105 in the 8-bit bar!',
    targetDecimal: 105,
    hintRo: '64 + 32 + 8 + 1 = 105 (01101001).',
    hintEn: '64 + 32 + 8 + 1 = 105 (01101001).',
    rewardCoins: 25,
  },
];

// ============================================================================
// 3. VON NEUMANN CPU SIMULATOR (FETCH · DECODE · EXECUTE)
// ============================================================================

export type CpuOpcode = 'LOAD' | 'ADD' | 'SUB' | 'STORE' | 'JMP' | 'JZ' | 'OUT' | 'HALT' | 'DATA';

export interface RamCell {
  addr: number;
  op: CpuOpcode;
  arg: number;
}

export interface CpuProgramPreset {
  id: string;
  nameRo: string;
  nameEn: string;
  descriptionRo: string;
  descriptionEn: string;
  expectedGoalRo: string;
  expectedGoalEn: string;
  ram: RamCell[];
  challengeQuestionRo?: string;
  challengeQuestionEn?: string;
  challengeOptionsRo?: string[];
  challengeOptionsEn?: string[];
  challengeCorrectIdx?: number;
  rewardCoins: number;
}

export const CPU_PROGRAM_PRESETS: CpuProgramPreset[] = [
  {
    id: 'cpu_add',
    nameRo: 'Program 01 · Adunarea a 2 Numere (A + B)',
    nameEn: 'Program 01 · Add Two RAM Numbers (A + B)',
    descriptionRo: 'CPU citește numărul din RAM[14] (15), adună RAM[15] (27), salvează rezultatul în RAM[13] și îl afișează pe Output.',
    descriptionEn: 'Fetches operand RAM[14] (15), adds RAM[15] (27), stores total in RAM[13], and prints via OUT.',
    expectedGoalRo: 'Output așteptat: 42 (salvat și în adresa RAM 0x0D).',
    expectedGoalEn: 'Expected Output: 42 (also stored at RAM cell 13).',
    ram: [
      { addr: 0, op: 'LOAD', arg: 14 },
      { addr: 1, op: 'ADD', arg: 15 },
      { addr: 2, op: 'STORE', arg: 13 },
      { addr: 3, op: 'OUT', arg: 0 },
      { addr: 4, op: 'HALT', arg: 0 },
      { addr: 5, op: 'DATA', arg: 0 },
      { addr: 6, op: 'DATA', arg: 0 },
      { addr: 7, op: 'DATA', arg: 0 },
      { addr: 8, op: 'DATA', arg: 0 },
      { addr: 9, op: 'DATA', arg: 0 },
      { addr: 10, op: 'DATA', arg: 0 },
      { addr: 11, op: 'DATA', arg: 0 },
      { addr: 12, op: 'DATA', arg: 0 },
      { addr: 13, op: 'DATA', arg: 0 },
      { addr: 14, op: 'DATA', arg: 15 },
      { addr: 15, op: 'DATA', arg: 27 },
    ],
    challengeQuestionRo: 'Ce registru al CPU ține minte adresa următoarei instrucțiuni de citit din RAM?',
    challengeQuestionEn: 'Which CPU register keeps track of the next RAM instruction address to fetch?',
    challengeOptionsRo: ['PC (Program Counter)', 'ALU (Unitatea Aritmetică)', 'Portul USB'],
    challengeOptionsEn: ['PC (Program Counter)', 'ALU (Arithmetic Logic Unit)', 'SSD Controller'],
    challengeCorrectIdx: 0,
    rewardCoins: 35,
  },
  {
    id: 'cpu_countdown',
    nameRo: 'Program 02 · Buclă Numărătoare Inversă (JZ & JMP)',
    nameEn: 'Program 02 · Countdown Loop (JZ & JMP)',
    descriptionRo: 'Pornește cu 3 în RAM[14], afișează și scade 1 la fiecare ciclu până când Zero Flag devine 1 și sare la HALT!',
    descriptionEn: 'Starts from 3 in RAM[14], outputs and decrements by 1 each iteration until Zero Flag triggers JZ to HALT.',
    expectedGoalRo: 'Output așteptat: 3, 2, 1 (demonstrație reală a unei bucle `while` la nivel de procesor!).',
    expectedGoalEn: 'Expected Output: 3, 2, 1 (how a high-level `while` loop compiles to CPU jumps!).',
    ram: [
      { addr: 0, op: 'LOAD', arg: 14 },
      { addr: 1, op: 'JZ', arg: 6 },
      { addr: 2, op: 'OUT', arg: 0 },
      { addr: 3, op: 'SUB', arg: 15 },
      { addr: 4, op: 'STORE', arg: 14 },
      { addr: 5, op: 'JMP', arg: 1 },
      { addr: 6, op: 'HALT', arg: 0 },
      { addr: 7, op: 'DATA', arg: 0 },
      { addr: 8, op: 'DATA', arg: 0 },
      { addr: 9, op: 'DATA', arg: 0 },
      { addr: 10, op: 'DATA', arg: 0 },
      { addr: 11, op: 'DATA', arg: 0 },
      { addr: 12, op: 'DATA', arg: 0 },
      { addr: 13, op: 'DATA', arg: 0 },
      { addr: 14, op: 'DATA', arg: 3 },
      { addr: 15, op: 'DATA', arg: 1 },
    ],
    challengeQuestionRo: 'Ce se întâmplă în Programul 02 dacă ștergi `SUB 15` (RAM[3]) și îl lași doar pe `JMP 1`?',
    challengeQuestionEn: 'What happens in Program 02 if `SUB 15` were removed before `JMP 1`?',
    challengeOptionsRo: [
      'Buclă infinită: ACC rămâne 3 și `JZ` nu se activează niciodată',
      'Procesorul se închide automat după 1 secundă',
      'RAM-ul devine ROM',
    ],
    challengeOptionsEn: [
      'Infinite loop: ACC stays 3 and `JZ` never triggers',
      'The CPU shuts down on its own',
      'RAM turns into permanent ROM',
    ],
    challengeCorrectIdx: 0,
    rewardCoins: 35,
  },
  {
    id: 'cpu_double',
    nameRo: 'Program 03 · Dublare & Adunare Multiplă (ACC + ACC)',
    nameEn: 'Program 03 · Multiply x3 via Repeated Addition',
    descriptionRo: 'CPU calculează 12 × 3 folosind doar adunări în Unitatea Aritmetico-Logică (ALU): ACC = 12 + 12 + 12 = 36.',
    descriptionEn: 'Computes 12 × 3 using pure ALU additions: loads 12, adds 12 twice, and outputs 36.',
    expectedGoalRo: 'Output așteptat: 36.',
    expectedGoalEn: 'Expected Output: 36.',
    ram: [
      { addr: 0, op: 'LOAD', arg: 15 },
      { addr: 1, op: 'ADD', arg: 15 },
      { addr: 2, op: 'ADD', arg: 15 },
      { addr: 3, op: 'STORE', arg: 14 },
      { addr: 4, op: 'OUT', arg: 0 },
      { addr: 5, op: 'HALT', arg: 0 },
      { addr: 6, op: 'DATA', arg: 0 },
      { addr: 7, op: 'DATA', arg: 0 },
      { addr: 8, op: 'DATA', arg: 0 },
      { addr: 9, op: 'DATA', arg: 0 },
      { addr: 10, op: 'DATA', arg: 0 },
      { addr: 11, op: 'DATA', arg: 0 },
      { addr: 12, op: 'DATA', arg: 0 },
      { addr: 13, op: 'DATA', arg: 0 },
      { addr: 14, op: 'DATA', arg: 0 },
      { addr: 15, op: 'DATA', arg: 12 },
    ],
    challengeQuestionRo: 'În arhitectura Von Neumann, unde sunt stocate simultan atât instrucțiunile programului, cât și datele (numerele 12)?',
    challengeQuestionEn: 'In Von Neumann architecture, where are both program instructions and numeric data stored together?',
    challengeOptionsRo: ['În aceeași memorie RAM', 'Separat pe monitor și tastatură', 'În cablul Ethernet'],
    challengeOptionsEn: ['Inside the same unified RAM memory', 'Inside the keyboard buffer', 'On the monitor cable'],
    challengeCorrectIdx: 0,
    rewardCoins: 35,
  },
];

// ============================================================================
// 4. DIGITAL LOGIC GATES & HALF-ADDER CIRCUITS
// ============================================================================

export type LogicTopologyId = 'AND' | 'OR' | 'XOR' | 'NAND' | 'HALF_ADDER' | 'CLASS_ALARM';

export interface LogicTopologyDef {
  id: LogicTopologyId;
  nameRo: string;
  nameEn: string;
  formula: string;
  descriptionRo: string;
  descriptionEn: string;
  inputALabelRo: string;
  inputALabelEn: string;
  inputBLabelRo: string;
  inputBLabelEn: string;
  inputCLabelRo?: string;
  inputCLabelEn?: string;
  evaluate: (a: boolean, b: boolean, c: boolean) => { primary: boolean; secondary?: boolean; primaryLabelRo: string; primaryLabelEn: string; secondaryLabelRo?: string; secondaryLabelEn?: string };
}

export const LOGIC_TOPOLOGIES: LogicTopologyDef[] = [
  {
    id: 'AND',
    nameRo: 'Poarta AND (ȘI Logic)',
    nameEn: 'AND Gate',
    formula: 'OUT = A · B',
    descriptionRo: 'Ieșirea este 1 (HIGH) DOAR când ambele intrări A și B sunt 1 simultan (exact ca operatorul `&&` din C++).',
    descriptionEn: 'Outputs 1 (HIGH) ONLY when both A and B are 1 simultaneously (same as `&&` in C++).',
    inputALabelRo: 'Intrare A',
    inputALabelEn: 'Input A',
    inputBLabelRo: 'Intrare B',
    inputBLabelEn: 'Input B',
    evaluate: (a, b) => ({ primary: a && b, primaryLabelRo: 'OUT (A AND B)', primaryLabelEn: 'OUT (A AND B)' }),
  },
  {
    id: 'OR',
    nameRo: 'Poarta OR (SAU Logic)',
    nameEn: 'OR Gate',
    formula: 'OUT = A + B',
    descriptionRo: 'Ieșirea este 1 dacă CEL PUȚIN o intrare (A sau B sau ambele) este 1 (echivalent `||` în C++).',
    descriptionEn: 'Outputs 1 whenever AT LEAST one input is 1 (same as `||` in C++).',
    inputALabelRo: 'Intrare A',
    inputALabelEn: 'Input A',
    inputBLabelRo: 'Intrare B',
    inputBLabelEn: 'Input B',
    evaluate: (a, b) => ({ primary: a || b, primaryLabelRo: 'OUT (A OR B)', primaryLabelEn: 'OUT (A OR B)' }),
  },
  {
    id: 'XOR',
    nameRo: 'Poarta XOR (SAU Exclusiv)',
    nameEn: 'XOR Gate (Exclusive OR)',
    formula: 'OUT = A ⊕ B',
    descriptionRo: 'Ieșirea este 1 DOAR când intrările sunt DIFERITE (una 0 și una 1). Baza criptării și a adunării binare!',
    descriptionEn: 'Outputs 1 ONLY when A and B differ (one 0, one 1). Core building block of binary addition & encryption!',
    inputALabelRo: 'Intrare A',
    inputALabelEn: 'Input A',
    inputBLabelRo: 'Intrare B',
    inputBLabelEn: 'Input B',
    evaluate: (a, b) => ({ primary: a !== b, primaryLabelRo: 'OUT (A XOR B)', primaryLabelEn: 'OUT (A XOR B)' }),
  },
  {
    id: 'NAND',
    nameRo: 'Poarta NAND (Poarta Universală)',
    nameEn: 'NAND Gate (Universal Gate)',
    formula: 'OUT = ¬(A · B)',
    descriptionRo: 'Opusul porții AND: ieșirea este 0 doar când A și B sunt ambele 1. Din porți NAND se construiesc procesoare întregi!',
    descriptionEn: 'Inverted AND: outputs 0 only when both inputs are 1. Any CPU circuit can be built purely from NAND gates!',
    inputALabelRo: 'Intrare A',
    inputALabelEn: 'Input A',
    inputBLabelRo: 'Intrare B',
    inputBLabelEn: 'Input B',
    evaluate: (a, b) => ({ primary: !(a && b), primaryLabelRo: 'OUT (NAND)', primaryLabelEn: 'OUT (NAND)' }),
  },
  {
    id: 'HALF_ADDER',
    nameRo: 'Sumator Binar (Half-Adder ALU)',
    nameEn: 'Binary Half-Adder (ALU Core)',
    formula: 'SUM = A ⊕ B · CARRY = A · B',
    descriptionRo: 'Adună doi biți în interiorul procesorului! Când A=1 și B=1, SUM=0 și CARRY=1 (adică 1 + 1 = 10 în binar = 2!).',
    descriptionEn: 'Adds two binary bits inside the CPU! When A=1 & B=1, SUM=0 and CARRY=1 (1 + 1 = 10 binary = 2!).',
    inputALabelRo: 'Bit A',
    inputALabelEn: 'Bit A',
    inputBLabelRo: 'Bit B',
    inputBLabelEn: 'Bit B',
    evaluate: (a, b) => ({
      primary: a !== b,
      secondary: a && b,
      primaryLabelRo: 'SUM (Unități)',
      primaryLabelEn: 'SUM (Ones bit)',
      secondaryLabelRo: 'CARRY (Transport)',
      secondaryLabelEn: 'CARRY (Twos bit)',
    }),
  },
  {
    id: 'CLASS_ALARM',
    nameRo: 'Circuit Alarmă Smart Lab',
    nameEn: 'Smart Lab Security Circuit',
    formula: 'SIREN = (A · B) + C',
    descriptionRo: 'Sirena pornește dacă (Senzor Mișcare A AND Sistem Armat B) OR Buton Urgență C este activ.',
    descriptionEn: 'Alarm rings if (Motion A AND Armed B) OR Emergency Panic C is pressed.',
    inputALabelRo: 'A: Senzor Mișcare',
    inputALabelEn: 'A: Motion Sensor',
    inputBLabelRo: 'B: Alarmă Armată',
    inputBLabelEn: 'B: System Armed',
    inputCLabelRo: 'C: Buton Panică',
    inputCLabelEn: 'C: Panic Button',
    evaluate: (a, b, c) => ({
      primary: (a && b) || c,
      primaryLabelRo: 'SIRENĂ ACTIVĂ',
      primaryLabelEn: 'SIREN TRIGGERED',
    }),
  },
];

export interface LogicChallengeItem {
  id: string;
  topology: LogicTopologyId;
  promptRo: string;
  promptEn: string;
  targetA: boolean;
  targetB: boolean;
  targetC?: boolean;
  rewardCoins: number;
}

export const LOGIC_CHALLENGES: LogicChallengeItem[] = [
  {
    id: 'log_half_adder',
    topology: 'HALF_ADDER',
    promptRo: 'În Sumatorul Binar (Half-Adder), setează biții A și B astfel încât rezultatul să fie 1 + 1 = 2 (SUM = 0, CARRY = 1)!',
    promptEn: 'In the Binary Half-Adder, set A and B so the sum equals 2 (SUM = 0, CARRY = 1)!',
    targetA: true,
    targetB: true,
    rewardCoins: 35,
  },
  {
    id: 'log_xor',
    topology: 'XOR',
    promptRo: 'Comută A=1 și B=0 pe poarta XOR ca să vezi cum semnalele diferite aprind ieșirea (= 1)!',
    promptEn: 'Set A=1 and B=0 on the XOR gate to observe differing bits turning Output ON (= 1)!',
    targetA: true,
    targetB: false,
    rewardCoins: 35,
  },
  {
    id: 'log_alarm',
    topology: 'CLASS_ALARM',
    promptRo: 'Testează butonul de panică: lasă Mișcarea oprită (A=0) și Sistemul Dezarmat (B=0), dar apasă Panică (C=1)!',
    promptEn: 'Test emergency override: leave Motion (A=0) & Armed (B=0) OFF, and press Panic (C=1)!',
    targetA: false,
    targetB: false,
    targetC: true,
    rewardCoins: 35,
  },
];

// ============================================================================
// 5. CURRICULUM BRIDGES & BILINGUAL FAQS (FOR SEO + LLM CITATION)
// ============================================================================

export interface AlgoCurriculumBridge {
  id: string;
  gradeRo: string;
  gradeEn: string;
  titleRo: string;
  titleEn: string;
  descriptionRo: string;
  descriptionEn: string;
  missionId: AllMissionId;
  glossarySlugRo: string;
  glossarySlugEn: string;
}

export const ALGO_CURRICULUM_BRIDGES: AlgoCurriculumBridge[] = [
  {
    id: 'bridge_hardware_vn',
    gradeRo: 'Clasa V · Hardware Von Neumann',
    gradeEn: 'Grade 5 · Von Neumann Hardware',
    titleRo: 'De la CPU & RAM la Ciclul Fetch–Decode–Execute',
    titleEn: 'From CPU & RAM to the Fetch–Decode–Execute Cycle',
    descriptionRo: 'Descoperă concret cum citește procesorul instrucțiunile din memoria RAM folosind registrele PC, IR și ALU.',
    descriptionEn: 'See firsthand how the CPU fetches instructions from RAM using PC, IR, and ALU registers.',
    missionId: 'hardware',
    glossarySlugRo: 'cpu-procesor',
    glossarySlugEn: 'cpu-processor',
  },
  {
    id: 'bridge_binary_rgb',
    gradeRo: 'Clasa V–VI · Bit, Byte & RGB',
    gradeEn: 'Grades 5–6 · Bit, Byte & RGB',
    titleRo: 'De ce 8 Biți = 1 Byte (0..255) și Cum Formează Culorile',
    titleEn: 'Why 8 Bits Equal 1 Byte (0–255) & Encode RGB Colors',
    descriptionRo: 'Fiecare pixel de pe ecran folosește 3 canale de câte 8 biți (Roșu, Verde, Albastru) între 0 și 255.',
    descriptionEn: 'Every screen pixel stores three 8-bit color channels (Red, Green, Blue) ranging from 0 to 255.',
    missionId: 'g6_paint3d',
    glossarySlugRo: 'bit-si-byte',
    glossarySlugEn: 'bit-and-byte',
  },
  {
    id: 'bridge_logic_cpp',
    gradeRo: 'Clasa VI–VII · Operatori Logici & Decizii',
    gradeEn: 'Grades 6–7 · Boolean Logic & Branches',
    titleRo: 'Porțile Logice AND/OR/XOR din spatele lui `if (A && B)`',
    titleEn: 'AND, OR & XOR Hardware Gates Behind `if (A && B)`',
    descriptionRo: 'Instrucțiunile condiționale din Scratch și C++ (`&&`, `||`, `!`) se execută fizic prin milioane de porți logice din siliciu.',
    descriptionEn: 'Conditional statements in Scratch & C++ compile straight into silicon AND/OR/NOT logic gates.',
    missionId: 'g7_decision_a',
    glossarySlugRo: 'structura-if-else-switch',
    glossarySlugEn: 'if-else-switch-statements',
  },
  {
    id: 'bridge_arrays_admitere',
    gradeRo: 'Clasa VIII · Vectori, Sortare & Căutare Binară',
    gradeEn: 'Grade 8 · Arrays, Sorting & Binary Search',
    titleRo: 'Pregătire Teză & OJI: Bubble Sort vs. Căutare Binară',
    titleEn: 'Olympiad & Exam Prep: Sorting vs. Binary Search',
    descriptionRo: 'Compară vizual complexitatea O(n²) vs O(log n) și trimite codul C++ direct în depanatorul Visual Trace.',
    descriptionEn: 'Visually compare O(n²) sorting vs O(log n) Binary Search and step through C++ code in Visual Trace.',
    missionId: 'g8_algo_d',
    glossarySlugRo: 'vectori-tablouri-cpp',
    glossarySlugEn: 'cpp-arrays-vectors',
  },
];

export interface AlgoLabFaqItem {
  qRo: string;
  qEn: string;
  aRo: string;
  aEn: string;
}

export const ALGO_LAB_FAQS: AlgoLabFaqItem[] = [
  {
    qRo: 'Cum funcționează Simulatorul Vizual de Algoritmi (Bubble Sort, Selection, Insertion & Căutare Binară)?',
    qEn: 'How does the Visual Algorithm Arena work for Bubble Sort, Selection, Insertion & Binary Search?',
    aRo: 'Fiecare pas este animat pe bare colorate codate dual (galben = comparare, roșu = schimb, verde = sortat, cyan = mijloc Binary Search) sincronizat linie-cu-linie cu codul C++ și contoare de comparații/schimburi, cu opțiunea de a deschide codul în Visual Trace Debugger.',
    aEn: 'Every step animates on dual-coded bars (amber = comparing, coral = swapping, green = sorted, cyan = Binary Search mid) synced line-by-line with C++ pseudocode and live operation counters.',
  },
  {
    qRo: 'De ce este Căutarea Binară (O(log n)) mult mai rapidă decât Căutarea Liniară?',
    qEn: 'Why is Binary Search O(log n) dramatically faster than Linear Search?',
    aRo: 'Deoarece pe un vector sortat verifică elementul din mijloc și elimină automat jumătate din interval la fiecare pas. Pe 1.024 de numere, căutarea liniară poate face 1.024 de pași, iar cea binară maxim 10 pași.',
    aEn: 'On a sorted array it checks the midpoint and discards half of remaining items every step—1,024 elements take at most 10 checks instead of 1,024.',
  },
  {
    qRo: 'Ce învață elevii în Simulatorul de CPU Von Neumann (Fetch–Decode–Execute)?',
    qEn: 'What do students learn inside the Von Neumann CPU Simulator?',
    aRo: 'Elevii văd în timp real cum instrucțiunile și datele coexistă în același RAM (0x00..0x0F) și cum Unitatea de Control parcurge ciclul Fetch (PC → IR), Decode și Execute (ALU + Accumulator + Zero Flag) pe programe reale de adunare și bucle.',
    aEn: 'Students watch instructions and data share unified RAM while the Control Unit runs Fetch (PC → IR), Decode, and Execute (ALU + Accumulator + Zero Flag) on live assembly programs.',
  },
  {
    qRo: 'Ce poți testa în Studioul Binar 8-Biți, RGB și Porți Logice?',
    qEn: 'What can you build in the 8-Bit Binary, RGB & Digital Logic Gate Workbench?',
    aRo: 'Poți comuta individual biții 128..1 pentru a vedea Zecimal, Hexazecimal, ASCII și operatori pe biți (&, |, ^, <<, >>), poți combina 24 de biți RGB pentru culori și poți construi porți AND, OR, XOR, NAND sau un Sumator Binar (Half-Adder) cu tabel de adevăr live.',
    aEn: 'Toggle individual 128..1 bits to inspect Decimal, Hex, ASCII, and bitwise operators (&, |, ^, <<, >>), mix 24-bit RGB colors, and test AND, OR, XOR, NAND & Binary Half-Adder truth tables live.',
  },
  {
    qRo: 'Acordă Laboratorul de Algoritmi & CPU recompense reale elevilor?',
    qEn: 'Does the Algorithm & CPU Lab award real ArkyEdu rewards?',
    aRo: 'Da! Rezolvarea provocărilor de algoritmică (+30 ByteCoins), a puzzle-urilor binare (+25 ByteCoins), a întrebărilor CPU (+35 ByteCoins) și a circuitelor logice (+35 ByteCoins) adaugă ByteCoins direct în contul elevului.',
    aEn: 'Yes! Completing algorithm quizzes (+30 ByteCoins), binary LED puzzles (+25 ByteCoins), CPU checks (+35 ByteCoins), and logic circuit missions (+35 ByteCoins) awards real ByteCoins.',
  },
];
