import { GlossaryTerm } from './types';

export const GLOSSARY_TERMS_PART_3: GlossaryTerm[] = [
  // =========================================================================
  // 5. ROBOTICS & ARDUINO / IoT (6)
  // =========================================================================
  {
    id: 'arduino-uno',
    category: 'robotics-iot',
    grades: ['7', '8'],
    gradeTagRo: 'Clasele VII–VIII',
    gradeTagEn: 'Grades 7–8',
    relatedModuleId: 'g7_robot_b',
    relatedMissionId: 'g7_robot_b',
    relatedBlogIds: ['proiect-arduino-smart-home-gimnaziu-senzori-millis'],
    relatedTermIds: ['digital-analog-pwm-pins', 'arduino-millis', 'ohms-law-resistor'],
    ro: {
      slug: 'placa-arduino-uno-setup-loop',
      term: 'Arduino UNO și Structura Schiței (setup & loop)',
      shortAnswer:
        'Arduino UNO este o placă electronică open-source cu microcontroler (ATmega328P) folosită la școală pentru robotică și proiecte Smart Home. Fiecare program Arduino (numit sketch) are două funcții obligatorii: setup() care rulează o singură dată la pornire și loop() care se repetă la infinit.',
      explanation: [
        'Spre deosebire de un calculator PC care are sistem de operare Windows/Linux, microcontrolerul Arduino rulează direct un singur program C/C++ imediat ce primește curent pe USB.',
        'În setup() configurăm pinii cu pinMode(pin, OUTPUT/INPUT) și pornim comunicarea Serial.begin(9600), iar în loop() citim senzorii și comandăm LED-urile sau motoarele.'
      ],
      syntaxOrFormula: {
        title: 'Scheletul standard al unui program Arduino',
        code: 'void setup() {\n  pinMode(13, OUTPUT); // Rulează O SINGURĂ DATĂ\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  digitalWrite(13, HIGH); // Aprinde LED-ul integrat (5V)\n  delay(500);\n  digitalWrite(13, LOW);  // Stinge LED-ul (0V)\n  delay(500);\n}'
      },
      example:
        'Un proiect de casă inteligentă pentru clasa a VIII-a folosește Arduino UNO pentru a citi senzorul de fum și a declanșa automat un buzzer și un ventilator.',
      commonMistake:
        'Uitarea declarării pinului ca OUTPUT în setup() (LED-ul va lumina extrem de slab!) sau conectarea senzorilor când placa este deja alimentată pe USB (risc de scurtcircuit).',
      vsComparison: {
        title: 'setup() vs. loop()',
        summary:
          'setup() inițializează configurația exact o dată la pornire/reset; loop() repetă continuu logica cât timp placa este alimentată.'
      },
      faqs: [
        {
          question: 'Ce tensiune de lucru au pinii logici ai plăcii Arduino UNO?',
          answer: '5V (HIGH = 5V, LOW = 0V / GND).'
        }
      ],
      keywords: 'ce este arduino uno, setup si loop arduino, robotica clasa 7 8'
    },
    en: {
      slug: 'arduino-uno',
      term: 'Arduino UNO & Sketch Structure (setup & loop)',
      shortAnswer:
        'Arduino UNO is an open-source microcontroller board (ATmega328P) widely used in school robotics and IoT projects. Every Arduino C++ sketch requires two functions: setup(), which runs once on power-up, and loop(), which repeats forever.',
      explanation: [
        'Unlike a Raspberry Pi or PC running an OS, an Arduino runs one compiled firmware sketch directly on hardware.',
        'Declare pin directions with pinMode() inside setup() and read sensors or drive actuators continuously inside loop().'
      ],
      syntaxOrFormula: {
        title: 'Minimal Arduino Blink Sketch',
        code: 'void setup() {\n  pinMode(13, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(13, HIGH);\n  delay(500);\n  digitalWrite(13, LOW);\n  delay(500);\n}'
      },
      example:
        'Pin 13 on an Arduino UNO already includes a tiny onboard LED labeled "L" for instant testing without wires.',
      commonMistake:
        'Forgetting pinMode(pin, OUTPUT) in setup()—causing connected LEDs to glow barely visibly—or rewiring breadboards while USB power is plugged in.',
      vsComparison: {
        title: 'Arduino UNO vs. Raspberry Pi',
        summary:
          'Arduino is a microcontroller ideal for real-time sensors, motors, and low-power hardware; Raspberry Pi is a full mini-computer running Linux.'
      },
      faqs: [
        {
          question: 'What operating voltage do Arduino UNO I/O pins use?',
          answer: '5V logic (HIGH = 5V, LOW = 0V).'
        }
      ],
      keywords: 'what is arduino uno, setup vs loop arduino sketch, middle school robotics'
    }
  },
  {
    id: 'digital-analog-pwm-pins',
    category: 'robotics-iot',
    grades: ['7', '8'],
    gradeTagRo: 'Clasele VII–VIII',
    gradeTagEn: 'Grades 7–8',
    relatedModuleId: 'g8_robot_a',
    relatedMissionId: 'g8_robot_a',
    relatedBlogIds: ['proiect-arduino-smart-home-gimnaziu-senzori-millis'],
    relatedTermIds: ['arduino-uno', 'ohms-law-resistor', 'ultrasonic-hc-sr04'],
    ro: {
      slug: 'pini-digitali-analogici-pwm-arduino',
      term: 'Pini Digitali, Analogici (ADC) și PWM (~) pe Arduino',
      shortAnswer:
        'Pinii digitali (0–13) lucrează doar cu două stări binare: HIGH (5V / 1) sau LOW (0V / 0). Pinii analogici (A0–A5) măsoară tensiuni continue de la senzori transformându-le în valori de la 0 la 1023, iar pinii PWM (~) simulează ieșiri intermediare între 0 și 255.',
      explanation: [
        'Cu pinii digitali citești un buton sau aprinzi/stingi un LED. Cu analogRead(A0) citești un senzor de lumină (fotorezistor), temperatură sau gaz.',
        'Pinii marcați cu tildă ~ (3, 5, 6, 9, 10, 11 pe UNO) suportă analogWrite(pin, 0..255), permițând reglarea luminozității unui LED sau a vitezei unui motor DC.'
      ],
      syntaxOrFormula: {
        title: 'Funcții de citire și scriere pe pini Arduino',
        code: 'digitalWrite(8, HIGH);        // Pornit (5V) sau LOW (0V)\nint buton = digitalRead(2);   // Returnează 1 (HIGH) sau 0 (LOW)\nint lumina = analogRead(A0);  // Returnează 0 .. 1023 (10 biți)\nanalogWrite(9, 128);          // PWM (~50% intensitate, 0 .. 255)'
      },
      example:
        'Pentru a aprinde treptat un LED de veghe pe măsură ce se întunecă, citești fotorezistorul pe A0 (0–1023) și mapezi valoarea spre pinul PWM 9 (0–255).',
      commonMistake:
        'Folosirea funcției analogWrite() pe un pin fără simbolul ~ (ex. pinul 4 sau 7) — LED-ul se va comporta doar ca pornit/oprit, fără reglaj fin.',
      vsComparison: {
        title: 'analogRead (0..1023) vs. analogWrite PWM (0..255)',
        summary:
          'analogRead folosește un convertor pe 10 biți (2¹⁰ = 1024 trepte) pentru intrare pe pinii A0–A5; analogWrite folosește 8 biți (2⁸ = 256 trepte) pe pinii digitali PWM (~).'
      },
      faqs: [
        {
          question: 'Care pini de pe Arduino UNO suportă PWM (~)?',
          answer: 'Pinii digitali 3, 5, 6, 9, 10 și 11 (marcați cu simbolul ~ lângă număr).'
        }
      ],
      keywords: 'pini digitali vs analogici arduino, ce este pwm analogwrite 0 255, analogread 1023'
    },
    en: {
      slug: 'digital-analog-pwm-pins',
      term: 'Digital, Analog (ADC) & PWM (~) Arduino Pins',
      shortAnswer:
        'Digital pins (0–13) read or output strictly two states: HIGH (5V) or LOW (0V). Analog input pins (A0–A5) measure continuous sensor voltages from 0 to 1023, while PWM (~) pins output 0–255 duty cycles to dim LEDs or control motor speed.',
      explanation: [
        'Digital pins handle pushbuttons and on/off relays; analogRead() samples light sensors, temperature probes, and gas sensors.',
        'Pins marked with a tilde (~) on UNO (3, 5, 6, 9, 10, 11) support analogWrite(pin, 0..255) via rapid Pulse-Width Modulation.'
      ],
      syntaxOrFormula: {
        title: 'Pin I/O Functions & Value Ranges',
        code: 'digitalWrite(8, HIGH);       // 0 or 1\nint btn = digitalRead(2);    // HIGH / LOW\nint light = analogRead(A0);  // 0 .. 1023 (10-bit ADC)\nanalogWrite(9, 128);         // 0 .. 255 PWM on ~ pins'
      },
      example:
        'Use map(analogRead(A0), 0, 1023, 0, 255) to turn a sensor reading smoothly into LED brightness.',
      commonMistake:
        'Calling analogWrite() on a non-PWM pin like pin 4—it only turns completely on (>=128) or off (<128).',
      vsComparison: {
        title: 'Digital Signal vs. Analog Signal',
        summary:
          'Digital signals jump cleanly between 0 and 1; analog signals vary smoothly across a continuous range.'
      },
      faqs: [
        {
          question: 'Which Arduino UNO pins support PWM output?',
          answer: 'Digital pins 3, 5, 6, 9, 10, and 11 (marked with ~).'
        }
      ],
      keywords: 'arduino digital vs analog pins, pwm pins ~, analogread 0 1023'
    }
  },
  {
    id: 'ohms-law-resistor',
    category: 'robotics-iot',
    grades: ['7', '8'],
    gradeTagRo: 'Clasele VII–VIII',
    gradeTagEn: 'Grades 7–8',
    relatedModuleId: 'g7_robot_b',
    relatedMissionId: 'g7_robot_b',
    relatedBlogIds: ['proiect-arduino-smart-home-gimnaziu-senzori-millis'],
    relatedTermIds: ['arduino-uno', 'digital-analog-pwm-pins', 'pir-and-mq2-sensors'],
    ro: {
      slug: 'legea-lui-ohm-rezistor-protectie-led',
      term: 'Rezistor de Protecție & Legea lui Ohm (U = I · R)',
      shortAnswer:
        'Rezistorul este componenta electronică care limitează curentul electric într-un circuit, prevenind arderea LED-urilor și a pinilor Arduino. Conform Legii lui Ohm (U = R · I), pentru un LED conectat la 5V este necesar un rezistor în serie de aproximativ 220 Ω – 330 Ω.',
      explanation: [
        'Un LED obișnuit consumă în siguranță ~20 mA (0,02 A) la ~2 V. Dacă îl legi direct între pinul 5V și GND fără rezistor, curentul crește brusc și arde LED-ul sau pinul plăcii Arduino.',
        'Valoarea rezistorului se măsoară în Ohmi (Ω) și se citește ușor după benzile colorate sau cu multimetrul.'
      ],
      syntaxOrFormula: {
        title: 'Calculul rezistorului pentru un LED pe Arduino (5V)',
        code: 'Legea lui Ohm:  R = (U_sursa - U_LED) / I\nExemplu LED roșu: R = (5V - 2V) / 0,015A = 200 Ω -> alegem standard 220 Ω!'
      },
      example:
        'Conectează mereu piciorul lung al LED-ului (Anod, +) la pinul Arduino printr-un rezistor de 220 Ω, iar piciorul scurt (Catod, -, lângă marginea plată) la GND.',
      commonMistake:
        'Alimentarea directă a unui LED la pinul 5V fără rezistor (poate arde LED-ul în câteva secunde!) sau montarea LED-ului invers (LED-ul este o diodă și conduce curentul într-un singur sens).',
      vsComparison: {
        title: 'Rezistor 220 Ω vs. Rezistor Pull-Down 10 kΩ',
        summary:
          'Rezistorul mic de 220 Ω limitează curentul prin LED ca să lumineze sigur; rezistorul mare de 10 kΩ stabilizează un pin digital legat la un buton ca să citească sigur 0 când butonul nu e apăsat.'
      },
      faqs: [
        {
          question: 'Contează în ce direcție montez un rezistor pe breadboard?',
          answer: 'Nu! Rezistorul nu are polaritate (+/-), spre deosebire de LED sau condensator electrolitic.'
        }
      ],
      keywords: 'legea lui ohm arduino, rezistor protectie led 220 ohm, polaritate led anod catod'
    },
    en: {
      slug: 'ohms-law-resistor',
      term: 'Current-Limiting Resistor & Ohm’s Law (V = I · R)',
      shortAnswer:
        'A resistor limits electrical current in a circuit to protect LEDs and microcontroller pins from burning out. Using Ohm’s Law (V = I · R), an LED wired to a 5V Arduino pin requires a 220 Ω to 330 Ω series resistor.',
      explanation: [
        'Without a resistor, a standard 2V LED connected directly to 5V draws excessive current and quickly destroys either the LED or the Arduino I/O pin.',
        'LEDs are polarized diodes: the longer leg (Anode +) connects toward power/pin, while the shorter leg / flat edge (Cathode -) connects toward GND.'
      ],
      syntaxOrFormula: {
        title: 'LED Series Resistor Formula (5V Arduino)',
        code: 'R = (V_supply - V_LED) / I_LED\nR = (5V - 2V) / 0.015A = 200 Ω -> Use standard 220 Ω resistor'
      },
      example:
        'Always place a 220 Ω resistor in series with each LED leg in traffic-light or Smart Home circuits.',
      commonMistake:
        'Plugging an LED directly across 5V and GND without a resistor, or mixing up 220 Ω (LEDs) with 10 kΩ (button pull-up/pull-down).',
      vsComparison: {
        title: 'LED Polarization vs. Resistor Polarization',
        summary:
          'LEDs are polarized (+ long leg, - short leg) and only light up one way; resistors have NO polarity and work in either orientation.'
      },
      faqs: [
        {
          question: 'Does resistor orientation matter on a breadboard?',
          answer: 'No, standard carbon/metal-film resistors work identically in either direction.'
        }
      ],
      keywords: 'ohms law led resistor arduino, 220 ohm resistor led, led anode cathode'
    }
  },
  {
    id: 'ultrasonic-hc-sr04',
    category: 'robotics-iot',
    grades: ['8'],
    gradeTagRo: 'Clasa a VIII-a',
    gradeTagEn: 'Grade 8',
    relatedModuleId: 'g8_robot_a',
    relatedMissionId: 'g8_robot_a',
    relatedBlogIds: ['proiect-arduino-smart-home-gimnaziu-senzori-millis'],
    relatedTermIds: ['arduino-uno', 'digital-analog-pwm-pins', 'arduino-millis'],
    ro: {
      slug: 'senzor-ultrasonic-hc-sr04-distanta',
      term: 'Senzor Ultrasonic HC-SR04 (Măsurarea Distanței cu Ultrasunete)',
      shortAnswer:
        'HC-SR04 este un senzor cu 4 pini (VCC, Trig, Echo, GND) care măsoară distanța până la un obstacol (2 cm – 400 cm) emițând un impuls ultrasonic pe pinul Trig și cronometrând pe pinul Echo în câte microsecunde se întoarce ecoul.',
      explanation: [
        'Principiul este identic cu ecolocația liliecilor sau sonarul: unde sonore la 40 kHz (inaudibile pentru om) lovesc obiectul și revin la receptor.',
        'Deoarece sunetul parcurge distanța dus-întors la viteza de ~0,034 cm/µs, împărțim produsul durata * 0.034 la 2 pentru a afla distanța exactă într-un singur sens.'
      ],
      syntaxOrFormula: {
        title: 'Formula exactă în cm pentru HC-SR04',
        code: 'digitalWrite(trigPin, LOW);  delayMicroseconds(2);\ndigitalWrite(trigPin, HIGH); delayMicroseconds(10);\ndigitalWrite(trigPin, LOW);\n\nlong durata = pulseIn(echoPin, HIGH);\nfloat distanta_cm = durata * 0.034 / 2.0;'
      },
      example:
        'Construiește un senzor de parcare pentru macheta auto: dacă distanta_cm < 15, aprinde LED-ul roșu și pornește buzzerul.',
      commonMistake:
        'Uitarea împărțirii la 2 în formulă (obții distanța dublă dus-întors!) sau conectarea inversă a pinilor VCC (5V) și GND.',
      vsComparison: {
        title: 'Senzor Ultrasonic (HC-SR04) vs. Senzor PIR',
        summary:
          'HC-SR04 măsoară distanța exactă în centimetri până la orice obiect solid; senzorul PIR detectează doar mișcarea corpurilor calde (oameni/animale) prin infraroșu.'
      },
      faqs: [
        {
          question: 'De ce împărțim rezultatul la 2 în formula HC-SR04?',
          answer: 'Pentru că funcția pulseIn() măsoară timpul total dus-întors al undei sonore până la obstacol și înapoi la senzor.'
        }
      ],
      keywords: 'senzor ultrasonic hc sr04 arduino cod, formula distanta hc sr04 impartit la 2'
    },
    en: {
      slug: 'ultrasonic-hc-sr04',
      term: 'HC-SR04 Ultrasonic Distance Sensor',
      shortAnswer:
        'The HC-SR04 uses four pins (VCC, Trig, Echo, GND) to measure distance from 2 cm to 400 cm by sending a 10 µs ultrasonic pulse on Trig and timing the reflected sound wave return on Echo.',
      explanation: [
        'Just like bat echolocation, high-frequency 40 kHz sound waves bounce off nearby surfaces back to the sensor.',
        'At room temperature, sound travels ~0.034 cm per microsecond; dividing duration × 0.034 by 2 converts round-trip time into one-way distance.'
      ],
      syntaxOrFormula: {
        title: 'Arduino Distance Formula (cm)',
        code: 'digitalWrite(trigPin, HIGH); delayMicroseconds(10);\ndigitalWrite(trigPin, LOW);\nlong duration = pulseIn(echoPin, HIGH);\nfloat distanceCm = duration * 0.034 / 2.0;'
      },
      example:
        'A smart trash-can lid project opens automatically with a servo motor whenever distanceCm drops below 20 cm.',
      commonMistake:
        'Forgetting to divide by 2 (reporting double the actual distance) or swapping VCC and GND wires.',
      vsComparison: {
        title: 'HC-SR04 Ultrasonic vs. PIR Motion Sensor',
        summary:
          'HC-SR04 gives exact distance in centimeters; PIR only outputs a digital YES/NO signal when warm motion crosses its field.'
      },
      faqs: [
        {
          question: 'Why divide duration * 0.034 by 2?',
          answer: 'Because the measured pulse duration covers both the outgoing trip to the obstacle and the return echo back.'
        }
      ],
      keywords: 'hc sr04 ultrasonic sensor arduino formula, pulsein divide by 2'
    }
  },
  {
    id: 'pir-and-mq2-sensors',
    category: 'robotics-iot',
    grades: ['8'],
    gradeTagRo: 'Clasa a VIII-a',
    gradeTagEn: 'Grade 8',
    relatedModuleId: 'g8_robot_b',
    relatedMissionId: 'g8_robot_b',
    relatedBlogIds: ['proiect-arduino-smart-home-gimnaziu-senzori-millis'],
    relatedTermIds: ['arduino-uno', 'digital-analog-pwm-pins', 'ultrasonic-hc-sr04'],
    ro: {
      slug: 'senzori-smart-home-pir-mq2-dht11',
      term: 'Senzori Smart Home: PIR (Mișcare), MQ-2 (Gaz/Fum) și DHT11',
      shortAnswer:
        'Proiectele școlare de casă inteligentă (Smart Home) folosesc trei senzori esențiali: PIR HC-SR501 (detectează mișcare prin infraroșu pasiv), MQ-2 (detectează scurgeri de gaz și fum prin valoare analogică) și DHT11 (măsoară temperatura și umiditatea).',
      explanation: [
        'Senzorul PIR are o lentilă albă cu fațete și oferă un semnal digital simplu (HIGH când detectează o persoană, LOW când nu este mișcare).',
        'Senzorul MQ-2 se citește pe un pin analogic (A0) și necesită 20–30 de secunde de încălzire la pornire înainte ca valorile să se stabilizeze.'
      ],
      syntaxOrFormula: {
        title: 'Citirea tipică a senzorilor Smart Home',
        code: 'int miscare = digitalRead(pirPin);   // HIGH = alertă mișcare\nint nivelGaz = analogRead(A0);       // Prag alertă ex: > 400\nif (nivelGaz > 400) tone(buzzerPin, 1000);'
      },
      example:
        'Un sistem de hol inteligent aprinde lumina cu PIR doar atunci când fotorezistorul indică întuneric afară.',
      commonMistake:
        'Testarea senzorului MQ-2 imediat în prima secundă după alimentare (elementul intern încă se încălzește) sau rotirea maximă a potențiometrului de timp de pe PIR fără să observi că rămâne blocat pe HIGH câteva minute.',
      vsComparison: {
        title: 'Pin Digital (DO) vs. Pin Analogic (AO) pe modulele cu senzori',
        summary:
          'DO îți dă doar 0 sau 1 față de un prag fix reglabil din șurub; AO îți oferă valoarea exactă continuă 0..1023 pentru grafice și praguri din cod.'
      },
      faqs: [
        {
          question: 'Ce detectează senzorul PIR?',
          answer: 'Variațiile de radiație infraroșie (căldură) produse de mișcarea oamenilor sau animalelor în raza sa.'
        }
      ],
      keywords: 'senzor pir arduino, senzor gaz mq2 arduino, dht11 temperatura proiect smart home clasa 8'
    },
    en: {
      slug: 'pir-and-mq2-sensors',
      term: 'Smart Home Sensors: PIR Motion, MQ-2 Gas & DHT11',
      shortAnswer:
        'School Smart Home projects typically pair three sensors with Arduino: the PIR (Passive Infrared) motion detector, the MQ-2 gas/smoke analog sensor, and the DHT11 temperature & humidity sensor.',
      explanation: [
        'A PIR sensor outputs a clean digital HIGH when warm motion enters its Fresnel lens dome.',
        'The MQ-2 outputs a continuous analog value (0–1023 on A0) and requires ~20–30 seconds of warm-up before stabilizing.'
      ],
      syntaxOrFormula: {
        title: 'Smart Home Sensor Logic',
        code: 'int motion = digitalRead(pirPin);   // HIGH when person detected\nint gasLevel = analogRead(A0);      // Alert threshold e.g. > 400\nif (gasLevel > 400) tone(buzzerPin, 1000);'
      },
      example:
        'Combine a PIR sensor with an LDR light sensor so hallway LEDs only light up when someone walks by at night.',
      commonMistake:
        'Testing an MQ-2 immediately in the first second or cranking the PIR time-delay knob to maximum so it stays stuck HIGH for 5 minutes.',
      vsComparison: {
        title: 'DO (Digital Out) vs. AO (Analog Out)',
        summary:
          'DO outputs binary 0/1 based on the onboard potentiometer; AO delivers the full 0–1023 measurement to Arduino.'
      },
      faqs: [
        {
          question: 'What does PIR stand for?',
          answer: 'Passive Infrared—it senses changing infrared heat signatures rather than emitting waves.'
        }
      ],
      keywords: 'arduino pir motion sensor, mq2 gas smoke sensor, dht11 smart home project'
    }
  },
  {
    id: 'arduino-millis',
    category: 'robotics-iot',
    grades: ['8'],
    gradeTagRo: 'Clasa a VIII-a',
    gradeTagEn: 'Grade 8',
    relatedModuleId: 'g8_robot_b',
    relatedMissionId: 'g8_robot_b',
    relatedBlogIds: ['proiect-arduino-smart-home-gimnaziu-senzori-millis'],
    relatedTermIds: ['arduino-uno', 'for-loop-counter', 'ultrasonic-hc-sr04'],
    ro: {
      slug: 'functia-millis-vs-delay-arduino',
      term: 'Multitasking în Arduino: Funcția millis() vs. delay()',
      shortAnswer:
        'Funcția delay(ms) îngheață complet procesorul Arduino pe durata așteptării, ratând apăsările de butoane și senzorii. Funcția millis() returnează milisecundele trecute de la pornirea plăcii, permițând execuția simultană (non-blocking) a mai multor sarcini.',
      explanation: [
        'Dacă faci o alarmă cu delay(2000) pentru clipitul LED-ului și cineva apasă butonul de oprire, Arduino nu va observa butonul până nu expiră cele 2 secunde!',
        'Cu millis() verifici diferența (millis() - timpAnterior >= interval), exact cum te uiți la ceasul de pe perete în loc să stai nemișcat numărând secundele.'
      ],
      syntaxOrFormula: {
        title: 'Modelul standard non-blocking cu millis()',
        code: 'unsigned long timpAnterior = 0;\nconst unsigned long interval = 500;\n\nvoid loop() {\n  unsigned long acum = millis();\n  if (acum - timpAnterior >= interval) {\n    timpAnterior = acum;\n    digitalWrite(13, !digitalRead(13)); // Comută LED-ul fără blocaj!\n  }\n  // Aici poți citi butoane și senzori instantaneu!\n}'
      },
      example:
        'Un semafor inteligent cu buton de pietoni folosește millis() ca să poată detecta instantaneu apăsarea butonului în orice secundă a ciclului.',
      commonMistake:
        'Declararea variabilei timpAnterior cu int în loc de unsigned long — tipul int dă overflow după doar 32 de secunde (32.767 ms) și blochează programul!',
      vsComparison: {
        title: 'delay() vs. millis()',
        summary:
          'delay() blochează tot codul (acceptabil doar la programe simple de test); millis() nu blochează deloc bucla loop(), permițând multitasking real.'
      },
      faqs: [
        {
          question: 'Ce tip de variabilă trebuie folosit cu millis()?',
          answer: 'Obligatoriu unsigned long (suportă până la ~49 de zile continue fără overflow).'
        }
      ],
      keywords: 'diferenta millis si delay arduino, multitasking arduino unsigned long'
    },
    en: {
      slug: 'arduino-millis',
      term: 'Non-Blocking Arduino Timing: millis() vs. delay()',
      shortAnswer:
        'The delay(ms) function freezes the entire Arduino processor during the pause, missing button presses and urgent sensors. The millis() function returns milliseconds since boot, letting multiple LEDs, buzzers, and sensors run simultaneously without blocking.',
      explanation: [
        'Using delay() inside a Smart Home alarm means a push button pressed mid-delay goes completely ignored.',
        'Checking if (millis() - prevTime >= interval) works like glancing at a wall clock while continuing other work.'
      ],
      syntaxOrFormula: {
        title: 'Standard Non-Blocking Blink Pattern',
        code: 'unsigned long prevTime = 0;\nconst unsigned long interval = 500;\n\nvoid loop() {\n  unsigned long now = millis();\n  if (now - prevTime >= interval) {\n    prevTime = now;\n    digitalWrite(13, !digitalRead(13));\n  }\n}'
      },
      example:
        'A pedestrian crosswalk button responds immediately even while flashing warning LEDs every 500 ms.',
      commonMistake:
        'Storing millis() inside an int variable instead of unsigned long—signed int overflows after just 32.7 seconds!',
      vsComparison: {
        title: 'Blocking (delay) vs. Non-Blocking (millis)',
        summary:
          'delay() halts execution; millis() checks elapsed time continuously while keeping buttons and sensors responsive.'
      },
      faqs: [
        {
          question: 'Why must millis() timestamps use unsigned long?',
          answer: 'Because millisecond counts grow rapidly past 32,767 and signed subtraction bugs are avoided using 32-bit unsigned long.'
        }
      ],
      keywords: 'arduino millis vs delay non blocking, unsigned long millis'
    }
  },

  // =========================================================================
  // 6. AI LITERACY, CLOUD & DIGITAL MEDIA (5)
  // =========================================================================
  {
    id: 'llm-and-ai-hallucinations',
    category: 'ai-cloud',
    grades: ['6', '7', '8'],
    gradeTagRo: 'Clasele VI–VIII',
    gradeTagEn: 'Grades 6–8',
    relatedModuleId: 'g7_cloud_a',
    relatedMissionId: 'g7_cloud_a',
    relatedBlogIds: ['ai-chatgpt-scoala-gimnaziu'],
    relatedTermIds: ['prompt-engineering-rccl', 'cloud-computing-collaboration', 'cyberbullying-119'],
    ro: {
      slug: 'inteligenta-artificiala-llm-halucinatii',
      term: 'Model Lingvistic (LLM) și „Halucinațiile” AI',
      shortAnswer:
        'Un Model Lingvistic Mare (LLM — Large Language Model, precum Gemini sau ChatGPT) este un sistem de Inteligență Artificială antrenat pe miliarde de texte pentru a prezice probabil următorul cuvânt. O „halucinație AI” apare când modelul inventează cu mare încredere un fapt, o formulă sau un citat fals.',
      explanation: [
        'LLM-urile nu „gândesc” și nu verifică automat adevărul precum o enciclopedie dacă nu au căutare verificată: ele generează continuarea lingvistică cea mai plauzibilă.',
        'De aceea, elevii inteligenți folosesc AI-ul ca pe un meditator care explică pașii, dar verifică mereu datele istorice, formulele și sursele bibliografice din manual.'
      ],
      syntaxOrFormula: {
        title: 'Regula Semaforului pentru AI la școală',
        code: 'VERDE:   Explică o eroare C++, generează exerciții, verifică gramatica\nGALBEN:  Rezumate de idei -> verifică obligatoriu fiecare informație!\nROȘU:   Copy-paste integral la teme + introducerea datelor personale (CNP, adresă)'
      },
      example:
        'Dacă ceri unui chatbot fără verificare bibliografii exacte pentru un referat la istorie, poate inventa titluri de cărți și ani de publicare inexistenți!',
      commonMistake:
        'Încrederea oarbă în orice răspuns generat de AI fără verificare sau introducerea numelui real complet, a parolelor ori a pozelor colegilor în chat-uri AI publice.',
      vsComparison: {
        title: 'Motor de căutare (Google) vs. Chatbot LLM',
        summary:
          'Motorul de căutare indexează și îți dă linkuri spre pagini reale existente; LLM-ul sintetizează un răspuns nou cuvânt cu cuvânt (care necesită verificare).'
      },
      faqs: [
        {
          question: 'De ce inventează uneori AI-ul fapte false (halucinații)?',
          answer: 'Pentru că este optimizat să genereze texte fluide și plauzibile statistic pe baza tiparelor din antrenament, nu să consulte o bază de fapte fixă.'
        }
      ],
      keywords: 'ce este un model llm, ce sunt halucinatiile ai, cum folosim chatgpt la scoala'
    },
    en: {
      slug: 'llm-and-ai-hallucinations',
      term: 'Large Language Model (LLM) & AI Hallucinations',
      shortAnswer:
        'A Large Language Model (LLM) is an AI system trained on massive text datasets to predict the next likely token/word in context. An "AI hallucination" happens when the model confidently invents fake facts, quotes, or citations that sound convincing.',
      explanation: [
        'Because LLMs predict language patterns rather than thinking or feeling, they can fabricate dates, page numbers, or formulas if unverified.',
        'Students get the best results using AI as a tutor for explanations and debugging—while always verifying facts against textbooks or primary sources.'
      ],
      syntaxOrFormula: {
        title: 'Student AI Traffic-Light Rule',
        code: 'GREEN:  Ask for step-by-step hints, debug C++ bugs, create practice quizzes\nYELLOW: Summarize concepts -> fact-check every claim manually\nRED:    Blind copy-paste homework or sharing personal data (address, passwords)'
      },
      example:
        'Always verify historical dates and scientific citations before putting AI-assisted summaries into a school presentation.',
      commonMistake:
        'Submitting unverified AI essays word-for-word or pasting private personal/school documents into public chatbots.',
      vsComparison: {
        title: 'Search Engine vs. Generative LLM',
        summary:
          'Search engines locate existing pages and sources; LLMs compose brand-new text responses probabilistically.'
      },
      faqs: [
        {
          question: 'Why shouldn’t you share personal info with public AI chats?',
          answer: 'Depending on account privacy settings, prompts may be reviewed or stored—never enter passwords, ID numbers, or classmates’ photos.'
        }
      ],
      keywords: 'what is an llm, ai hallucination explained for students, safe ai at school'
    }
  },
  {
    id: 'prompt-engineering-rccl',
    category: 'ai-cloud',
    grades: ['6', '7', '8'],
    gradeTagRo: 'Clasele VI–VIII',
    gradeTagEn: 'Grades 6–8',
    relatedModuleId: 'g7_cloud_a',
    relatedMissionId: 'g7_cloud_a',
    relatedBlogIds: ['ai-chatgpt-scoala-gimnaziu', 'ghid-profesor-tic-catalog-digital-olimpiada-gimnaziu'],
    relatedTermIds: ['llm-and-ai-hallucinations', 'cloud-computing-collaboration', 'algorithm-definition'],
    ro: {
      slug: 'inginerie-prompturi-metoda-rccl',
      term: 'Prompt Engineering & Formula R.C.C.L. pentru Învățare',
      shortAnswer:
        'Un prompt este instrucțiunea pe care o scrii unui sistem AI. Metoda educațională R.C.C.L. (Rol, Context, Cerință clară, Limitări) transformă întrebările vagi în cereri precise care generează explicații pe înțelesul vârstei tale.',
      explanation: [
        'Un prompt slab precum „Explică bucla for” produce un răspuns universitar greu de înțeles. Un prompt R.C.C.L. setează nivelul exact de clasa a VII-a și cere exemple concrete.',
        'Poți adăuga cerința „Nu îmi da rezolvarea finală direct — pune-mi 3 întrebări ghidate ca să o descopăr singur”.'
      ],
      syntaxOrFormula: {
        title: 'Șablonul de Prompt R.C.C.L. pentru Elevi',
        code: 'R (Rol):      „Ești un profesor răbdător de Informatică.”\nC (Context):  „Sunt în clasa a VII-a și am eroare la algoritmul sumei cifrelor.”\nC (Cerință):  „Explică-mi de ce lipsește n /= 10 din bucla mea while.”\nL (Limitări): „Răspunde în max. 5 rânduri, fără cod complet, doar indicii!”'
      },
      example:
        'Cu formula R.C.C.L. poți genera în 10 secunde 5 teste grilă de antrenament pentru teza de biologie sau informatică.',
      commonMistake:
        'Scrierea unor prompturi de 3 cuvinte („Fă referat Arduino”) care produc conținut generic, plat și ușor de depistat ca fiind generat automat.',
      vsComparison: {
        title: 'Prompt vag vs. Prompt structurat R.C.C.L.',
        summary:
          'Promptul vag lasă AI-ul să ghicească nivelul și formatul; R.C.C.L. controlează tonul, clasa, lungimea și obiectivul didactic.'
      },
      faqs: [
        {
          question: 'Ce înseamnă fiecare literă din acronimul R.C.C.L.?',
          answer: 'Rol (cine răspunde), Context (nivelul/situația ta), Cerință (ce vrei exact) și Limitări (lungime, format, restricții).'
        }
      ],
      keywords: 'ce este un prompt ai, metoda rccl prompt engineering elevi, cum pui intrebari ai'
    },
    en: {
      slug: 'prompt-engineering-rccl',
      term: 'Prompt Engineering & R.C.C.F. Study Framework',
      shortAnswer:
        'A prompt is the instruction you give an AI system. Using a structured framework—Role, Context, Clear Task, and Format/Constraints (R.C.C.F.)—turns vague questions into tailored, age-appropriate study guides.',
      explanation: [
        'Asking "Explain C++ loops" yields overly dense college theory; adding "for a 7th grader in 5 bullet points with a real-life analogy" yields instant clarity.',
        'Tell the AI: "Give me hints instead of solving my homework directly" to actually master the material.'
      ],
      syntaxOrFormula: {
        title: 'Student Study Prompt Template',
        code: 'Role:        "Act as a supportive Grade 7 CS teacher."\nContext:     "I am stuck on a while-loop digit sum exercise."\nClear Task:  "Point out why my loop runs infinitely."\nFormat:      "Reply in 4 short lines using plain language."'
      },
      example:
        'Ask an AI tutor to quiz you with 5 multiple-choice questions on Excel IF formulas before an exam.',
      commonMistake:
        'Typing 3-word prompts ("Write my essay") that produce generic prose instead of interactive learning.',
      vsComparison: {
        title: 'Zero-Shot vs. Guided Constraint Prompt',
        summary:
          'Adding grade level, format, and constraints slashes irrelevant fluff and hallucinations.'
      },
      faqs: [
        {
          question: 'Why specify the target audience (e.g., Grade 7) in a prompt?',
          answer: 'It adjusts vocabulary complexity and picks examples matching what you actually study in class.'
        }
      ],
      keywords: 'prompt engineering for students, role context task format prompt'
    }
  },
  {
    id: 'cloud-computing-collaboration',
    category: 'ai-cloud',
    grades: ['7', '8'],
    gradeTagRo: 'Clasele VII–VIII',
    gradeTagEn: 'Grades 7–8',
    relatedModuleId: 'g7_cloud_a',
    relatedMissionId: 'g7_cloud_a',
    relatedBlogIds: ['word-google-docs-referate-scolare-diacritice-margini-cuprins', 'primul-site-web-clasa-8-html5-https-google-sites'],
    relatedTermIds: ['typography-diacritics-margins', 'ssd-vs-hdd', 'two-factor-auth-2fa'],
    ro: {
      slug: 'cloud-computing-colaborare-online',
      term: 'Cloud Computing, Backup și Colaborare (Google Drive / OneDrive)',
      shortAnswer:
        'Cloud Computing înseamnă salvarea fișierelor și rularea aplicațiilor pe servere securizate accesibile prin Internet, în locul stocării exclusive pe hard-diskul local. Permite colaborarea în timp real mai multor elevi pe același document și recuperarea istoricului versiunilor.',
      explanation: [
        'Când lucrezi pe un proiect de echipă în Google Docs sau Slides, toți membrii pot edita simultan, iar modificările se salvează automat secundă cu secundă.',
        'Nivelurile corecte de partajare (Share Permissions) protejează munca echipei: Viewer (doar citire), Commenter (poate lăsa comentarii) și Editor (poate modifica documentul).'
      ],
      syntaxOrFormula: {
        title: 'Cele 3 niveluri de partajare în Cloud (Google Drive)',
        code: 'Viewer (Vizualizator): Poate doar citi și descărca (ideal pentru profesori/public)\nCommenter (Comentator): Poate sugera modificări fără să șteargă textul\nEditor:                 Control complet de editare (acordă DOAR echipei de încredere!)'
      },
      example:
        'Dacă se strică laptopul cu o seară înainte de prezentare, deschizi Google Drive de pe orice alt calculator și proiectul este intact la ultima secundă.',
      commonMistake:
        'Setarea linkului pe „Anyone with the link -> Editor” pentru toată școala (oricine poate șterge proiectul!) sau crearea a 10 versiuni „Proiect_final_v2_chiar_final.docx” în loc să folosești Version History.',
      vsComparison: {
        title: 'Stocare Locală (SSD/USB) vs. Stocare în Cloud',
        summary:
          'Stocarea locală funcționează fără internet, dar depinde de un singur dispozitiv; Cloud-ul oferă acces de oriunde, sincronizare și istoric al versiunilor (necesită conexiune și parolă cu 2FA).'
      },
      faqs: [
        {
          question: 'Ce permisiune ar trebui să aleg când trimit un link public către un proiect?',
          answer: 'Viewer (doar vizualizare), niciodată Editor pentru publicul larg.'
        }
      ],
      keywords: 'ce este cloud computing clasa 7, google drive viewer commenter editor, version history'
    },
    en: {
      slug: 'cloud-computing-collaboration',
      term: 'Cloud Computing, Backups & Real-Time Collaboration',
      shortAnswer:
        'Cloud computing stores files and runs applications on remote internet servers rather than relying solely on your local computer drive. It enables automatic backups, version history, and simultaneous teamwork inside tools like Google Docs and OneDrive.',
      explanation: [
        'Always pick the lowest required sharing permission when generating a link: Viewer, Commenter, or Editor.',
        'Built-in Version History lets teachers see who contributed each section and lets you restore deleted work in seconds.'
      ],
      syntaxOrFormula: {
        title: 'Cloud Sharing Permission Tiers',
        code: 'Viewer:    Read-only access (safe for public sharing)\nCommenter: Can add notes/suggestions without erasing content\nEditor:    Full modify rights (reserve strictly for teammates)'
      },
      example:
        'If your laptop battery dies before class, signing into Google Drive on a classroom PC opens your exact latest draft immediately.',
      commonMistake:
        'Setting a public link to "Anyone with the link can Edit" or emailing dozens of "Final_v3_REAL.docx" copies instead of sharing one live cloud file.',
      vsComparison: {
        title: 'Local Drive vs. Cloud Storage',
        summary:
          'Local storage works offline on one machine; Cloud storage syncs across devices automatically and protects against hardware failure.'
      },
      faqs: [
        {
          question: 'Which permission prevents classmates from accidentally deleting your slides?',
          answer: 'Set their access to Viewer or Commenter unless they actively need Editor permissions.'
        }
      ],
      keywords: 'cloud computing middle school, viewer vs commenter vs editor google drive'
    }
  },
  {
    id: 'gis-digital-maps',
    category: 'ai-cloud',
    grades: ['7'],
    gradeTagRo: 'Clasa a VII-a',
    gradeTagEn: 'Grade 7',
    relatedModuleId: 'g7_gis_b',
    relatedMissionId: 'g7_gis_b',
    relatedBlogIds: ['ai-chatgpt-scoala-gimnaziu'],
    relatedTermIds: ['cloud-computing-collaboration', 'ip-address-dns', 'rgb-pixel-resolution'],
    ro: {
      slug: 'harti-digitale-gis-coordonate-gps',
      term: 'Sisteme GIS, Hărți Digitale & Coordonate GPS (Latitudine / Longitudine)',
      shortAnswer:
        'Un sistem GIS (Geographic Information System) combină hărțile digitale cu baze de date geografice organizate pe straturi (Layers) și coordonate GPS de Latitudine și Longitudine pentru a analiza trasee, relief sau obiective locale.',
      explanation: [
        'În aplicații precum Google Earth sau Google My Maps, poți activa și dezactiva straturi tematice separate: drumuri, râuri, școli, piste de biciclete sau zone verzi.',
        'Orice punct de pe Pământ este localizat precis prin două numere: Latitudinea (Nord/Sud față de Ecuator, de la -90° la +90°) și Longitudinea (Est/Vest față de Meridianul Greenwich, de la -180° la +180°).'
      ],
      syntaxOrFormula: {
        title: 'Exemplu coordonate geografice GPS (România)',
        code: 'București: 44.4268° N (Latitudine),  26.1025° E (Longitudine)\nEcuator:   Latitudine 0°\nStraturi GIS: [Fundal Satelit] + [Rețea Străzi] + [Puncte de Interes / Pin-uri]'
      },
      example:
        'La modulul de TIC din clasa a VII-a, elevii creează o hartă interactivă cu obiective turistice din orașul lor, exportată în format KML/KMZ.',
      commonMistake:
        'Inversarea ordinii Latitudine / Longitudine (regula simplă: LATitudinea vine prima — 44°..48° pentru România, iar LONGitudinea a doua — 20°..29° pentru România!).',
      vsComparison: {
        title: 'Hartă imagine statică vs. Sistem GIS',
        summary:
          'O poză cu o hartă nu poate măsura distanțe sau căuta adrese; un GIS leagă coordonatele de tabele de date și permite filtrare pe straturi.'
      },
      faqs: [
        {
          question: 'Ce format de fișier folosește Google Earth pentru salvarea hărților personalizate?',
          answer: 'Formatele KML (Keyhole Markup Language) sau KMZ (versiunea arhivată).'
        }
      ],
      keywords: 'ce este un sistem gis clasa 7, latitudine si longitudine gps, straturi harti digitale'
    },
    en: {
      slug: 'gis-digital-maps',
      term: 'GIS (Geographic Information Systems) & GPS Coordinates',
      shortAnswer:
        'A GIS (Geographic Information System) connects digital maps with location data organized in toggleable layers using GPS Latitude and Longitude coordinates to analyze routes, terrain, and landmarks.',
      explanation: [
        'GIS tools let students overlay separate data layers—such as roads, rivers, parks, and school pins—onto satellite imagery.',
        'Latitude measures North/South angle from the Equator (-90° to +90°); Longitude measures East/West angle from the Prime Meridian (-180° to +180°).'
      ],
      syntaxOrFormula: {
        title: 'GPS Coordinate & Layer Model',
        code: 'Format: (Latitude, Longitude)\nExample: 44.4268° N, 26.1025° E\nGIS Layers: Satellite Base + Roads Layer + Custom School Markers (.kml)'
      },
      example:
        'Mapping local historical landmarks into custom layers and measuring walking distances between them in Google My Maps.',
      commonMistake:
        'Swapping Latitude and Longitude—always list Latitude (North/South) first and Longitude (East/West) second.',
      vsComparison: {
        title: 'Static Map Image vs. GIS',
        summary:
          'A static map JPEG is just pixels; a GIS database links every coordinate to searchable attributes, distances, and layers.'
      },
      faqs: [
        {
          question: 'Which coordinate comes first in standard GPS notation?',
          answer: 'Latitude (North/South) comes first, followed by Longitude (East/West).'
        }
      ],
      keywords: 'what is gis middle school, latitude vs longitude order, digital map layers kml'
    }
  },
  {
    id: 'audio-video-multitrack-keyframe',
    category: 'ai-cloud',
    grades: ['6', '7'],
    gradeTagRo: 'Clasele VI–VII',
    gradeTagEn: 'Grades 6–7',
    relatedModuleId: 'g7_video_b',
    relatedMissionId: 'g7_video_b',
    relatedBlogIds: ['prezentari-powerpoint-regula-6x6-modelare-3d-scoala'],
    relatedTermIds: ['rgb-pixel-resolution', 'powerpoint-6x6-contrast', 'file-extension'],
    ro: {
      slug: 'editare-audio-video-timeline-fps-keyframe',
      term: 'Timeline, Cadre pe Secundă (FPS), Multitrack & Keyframe',
      shortAnswer:
        'În editarea audio-video, Timeline-ul este axa cronologică pe care așezi clipurile și muzica pe piste separate (Multitrack). FPS (Frames Per Second) indică câte imagini statice se derulează într-o secundă (ex. 30 sau 60 FPS), iar Keyframe-ul marchează punctele în care o proprietate (volum, poziție) se schimbă în timp.',
      explanation: [
        'Folosirea mai multor piste (Track 1: Vocea ta, Track 2: Muzică de fundal la -18 dB, Track 3: Subtitrări/Titluri) permite ajustarea fină fără să amesteci ireversibil sunetele.',
        'La exportul final din editor, formatul standard pentru web și școală este MP4 (codec H.264), nu fișierul de proiect (.mlt, .aup3) care nu conține singur clipurile video!'
      ],
      syntaxOrFormula: {
        title: 'Standarde video uzuale & Export corect',
        code: '24 FPS -> Aspect cinematografic (filme)\n30 FPS -> Standard prezentări / tutoriale școlare\n60 FPS -> Jocuri și mișcări foarte fluide\nExport final: .mp4 (video) / .mp3 (audio) — NU trimite fișierul de proiect!'
      },
      example:
        'Adaugi două keyframe-uri de volum pe pista muzicală înainte de a începe să vorbești, creând un efect lin de fade-out (scădere treptată a muzicii).',
      commonMistake:
        'Trimiterea către profesor a fișierului de proiect editabil (care conține doar linkuri către clipurile de pe PC-ul tău) în locul fișierului randat final .mp4 — pe alt laptop proiectul va apărea „Media Offline / Lipsă”!',
      vsComparison: {
        title: 'Fișier Proiect (.aup3 / .prproj) vs. Fișier Exportat (.mp3 / .mp4)',
        summary:
          'Fișierul proiect păstrează timeline-ul și tăieturile pentru editare ulterioară; fișierul exportat MP4/MP3 combină totul într-un singur fișier gata de redat oriunde.'
      },
      faqs: [
        {
          question: 'Ce reprezintă 60 FPS la un videoclip?',
          answer: 'Faptul că videoclipul afișează 60 de cadre (imagini) în fiecare secundă, rezultând o mișcare foarte fluidă.'
        }
      ],
      keywords: 'ce inseamna fps cadre pe secunda, timeline multitrack keyframe editare video clasa 7'
    },
    en: {
      slug: 'audio-video-multitrack-keyframe',
      term: 'Timeline, FPS, Multitrack Editing & Keyframes',
      shortAnswer:
        'In audio/video editing, the Timeline arranges clips sequentially across multiple stacked tracks (Multitrack). FPS (Frames Per Second) measures how many images play each second (typically 30 or 60 FPS), while Keyframes mark timestamps where volume, zoom, or position changes smoothly.',
      explanation: [
        'Keeping narration, background music, and text captions on separate tracks prevents destructive edits.',
        'Always render/export finished work to .mp4 (video) or .mp3 (audio) before submitting—a project file alone will miss linked source footage on another computer.'
      ],
      syntaxOrFormula: {
        title: 'Common Frame Rates & Formats',
        code: '24 FPS -> Cinema feel\n30 FPS -> Standard tutorials & school videos\n60 FPS -> Smooth gameplay & motion\nFinal Submission: Export .mp4 / .mp3 (never only the project file)'
      },
      example:
        'Place two audio keyframes to smoothly lower background music right before voice narration begins.',
      commonMistake:
        'Submitting a project save file instead of rendering an .mp4—resulting in "Media Offline" errors when the teacher opens it.',
      vsComparison: {
        title: 'Project File vs. Rendered Export (.mp4)',
        summary:
          'Project files keep tracks editable on your PC; rendered .mp4 exports flatten audio, video, and titles into one universal file.'
      },
      faqs: [
        {
          question: 'Why export as MP4 instead of sending the editor project file?',
          answer: 'Editor project files only reference local video clips on your hard drive, whereas an exported MP4 packages everything cleanly.'
        }
      ],
      keywords: 'what is fps frames per second, multitrack timeline keyframe editing'
    }
  }
];
