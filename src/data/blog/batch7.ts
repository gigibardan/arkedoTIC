import { BlogArticle } from './types';

export const BLOG_BATCH_7: BlogArticle[] = [
  {
    id: 'robotica-iot-arduino-uno-vs-esp32-microbit-pwm-i2c-proiecte',
    category: 'robotics-iot',
    gradeTagRo: 'Clasele VII–VIII · IoT',
    gradeTagEn: 'Grades 7–8 · IoT',
    publishedAt: '2026-11-22',
    updatedAt: '2026-11-22',
    featured: true,
    ro: {
      slug: 'robotica-iot-arduino-uno-vs-esp32-microbit-pwm-i2c-proiecte',
      title: 'Robotică & IoT pentru Elevi (2026): Arduino Uno vs. ESP32 vs. Micro:bit, PWM, I2C & 7 Greșeli pe Breadboard',
      metaTitle: 'Robotică & IoT: Arduino Uno vs ESP32 vs Micro:bit, PWM & I2C | ArkyEdu',
      metaDescription: 'Ghid complet de robotică școlară și IoT: comparație Arduino Uno R3/R4 vs ESP32 vs BBC Micro:bit, tensiuni 5V vs 3.3V, control PWM și protocol I2C cu cod C++ non-blocant.',
      keywords: 'arduino uno vs esp32 pentru incepatori, ce placa de robotica aleg pentru copii, ce este pwm analogwrite arduino, protocol i2c sda scl explicat simplu, greseli breadboard ardere led esp32, proiect smart city arduino gimnaziu',
      breadcrumbLabel: 'Robotică IoT: Arduino vs ESP32 & PWM',
      categoryLabel: 'Robotică & IoT',
      readTime: '14 min citire',
      tldrTitle: 'Răspuns Rapid (TL;DR)',
      tldr: 'Pentru primii pași în clasele V–VI, BBC Micro:bit are senzori integrați și programare pe blocuri fără fire fragile. Pentru gimnaziu (VII–VIII) și breadboard clasic cu C++, Arduino Uno este regele robusteții pe 5V. Dacă vrei proiecte IoT conectate la Wi-Fi/Bluetooth (stație meteo pe telefon, Smart City live), treci la ESP32 — dar atenție critică: ESP32 lucrează strict pe 3.3V, nu pe 5V!',
      intro: 'Tot mai mulți elevi vor să treacă de la aprinderea unui simplu LED la roboți evita-obstacole, ecrane OLED și senzori care trimit date pe telefon. Alegerea plăcii potrivite și înțelegerea semnalelor PWM, a magistralei I2C și a limitelor electrice îți salvează nu doar nota la proiect, ci și componentele de pe birou.',
      sections: [
        {
          id: 'comparatie-arduino-vs-esp32-vs-microbit',
          heading: '1. Arduino Uno vs. ESP32 vs. BBC Micro:bit: Ce placă alegi în 2026?',
          paragraphs: [
            'Fiecare placă de dezvoltare are un punct forte clar. Nu există „cea mai bună placă universală”, ci placa potrivită nivelului și proiectului tău:'
          ],
          table: {
            caption: 'Comparație tehnică între cele 3 platforme educaționale de robotică și IoT',
            headers: ['Caracteristică', 'BBC Micro:bit v2', 'Arduino Uno (R3 / R4 WiFi)', 'ESP32 DevKit'],
            rows: [
              ['Vârstă recomandată', '9–13 ani (V–VI)', '11–16 ani (VI–IX)', '13–18 ani (VII–XII / Cluburi IoT)'],
              ['Limbaj principal', 'MakeCode (blocuri) & MicroPython', 'C++ Arduino (standard școlar)', 'C++ Arduino / MicroPython / ESP-IDF'],
              ['Tensiune pini GPIO', '3.3V', '5V (R3/R4 clasic — foarte tolerant!)', '3.3V strict (5V pe GPIO poate arde cipul!)'],
              ['Wi-Fi & Bluetooth', 'Bluetooth integrat (Radio propriu)', 'Nu pe R3 (Wi-Fi integrat doar pe R4 WiFi)', 'Wi-Fi + Bluetooth BLE integrate nativ'],
              ['Avantaj major', 'Matrice 25 LED, butoane, busolă & microfon incluse', 'Ecosistem uriaș de tutoriale, compatibil cu orice shield 5V', 'Procesor dual-core 240 MHz, mult RAM, ieftin pentru IoT'],
              ['Punct slab', 'Curent mic pe pini pentru motoare fără placă extra', 'Memorie RAM mică (2 KB pe Uno R3)', 'Pini sensibili la 5V + configurare drivere/pini boot']
            ]
          }
        },
        {
          id: 'cum-functioneaza-pwm-si-i2c',
          heading: '2. PWM (Pulse Width Modulation) și I2C explicat pe înțelesul tuturor',
          paragraphs: [
            'Un microcontroller este digital — pinii lui pot scoate doar 0V (LOW) sau 5V/3.3V (HIGH), niciodată „2.5V reali”. Cum reglăm atunci intensitatea unui LED sau viteza unui motor? Prin PWM: aprindem și stingem pinul de ~490–980 de ori pe secundă (cu funcția analogWrite(pin, 0..255)), modificând factorul de umplere (Duty Cycle)!',
            'Iar când vrem să conectăm un ecran LCD 16x2 sau un display OLED fără să ocupăm 10 pini, folosim protocolul I2C (Inter-Integrated Circuit): toți senzorii compatibili se leagă în paralel pe DOAR două fire de date — SDA (Date) și SCL (Ceas), fiecare dispozitiv având propria adresă hexazecimală (ex: 0x27 sau 0x3C).'
          ],
          table: {
            caption: 'Valori PWM analogWrite(pin, val) pe Arduino Uno și efectul lor practic',
            headers: ['Valoare analogWrite', 'Duty Cycle (%)', 'Tensiune medie echivalentă', 'Efect pe LED / Motor DC'],
            rows: [
              ['0', '0%', '0,0 V', 'Stins / Oprit complet'],
              ['64', '25%', '1,25 V', 'Lumină slabă de veghe (~25%)'],
              ['127', '50%', '2,50 V', 'Jumătate de intensitate / viteză medie'],
              ['255', '100%', '5,00 V', 'Maxim continuu (echivalent digitalWrite HIGH)']
            ]
          }
        },
        {
          id: 'cod-smart-city-pwm-servo-millis',
          heading: '3. Exemplu complet: Iluminat stradal inteligent (LDR + PWM + millis())',
          paragraphs: [
            'Acest program combină un fotorezistor LDR (citit analogic pe A0), un LED stradal dimabil prin PWM (pinul ~9, marcat cu tilda ~) și temporizare non-blocantă cu millis() pentru a nu bloca restul senzorilor din Smart City:'
          ],
          codeBlock: {
            title: 'Iluminat adaptiv Smart City cu PWM și millis() (C++ Arduino)',
            language: 'cpp',
            code: `const int PIN_LDR = A0;
const int PIN_LED_PWM = 9; // Pin cu ~ (suportă PWM)
unsigned long ultimCheck = 0;

void setup() {
  pinMode(PIN_LED_PWM, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  if (millis() - ultimCheck >= 200) {
    ultimCheck = millis();
    int lumina = analogRead(PIN_LDR); // 0 (întuneric) .. 1023 (soare puternic)
    // Inversăm: cu cât e mai întuneric, cu atât LED-ul luminează mai tare
    int puterePWM = map(lumina, 0, 1023, 255, 0);
    puterePWM = constrain(puterePWM, 0, 255);
    analogWrite(PIN_LED_PWM, puterePWM);
  }
}`,
            caption: 'Atenție: pe Arduino Uno doar pinii marcați cu ~ (3, 5, 6, 9, 10, 11) suportă PWM hardware prin analogWrite()!'
          }
        },
        {
          id: 'top-7-greseli-breadboard-ardere-componente',
          heading: '4. Top 7 greșeli fatale pe breadboard care ard LED-uri, senzori sau placa',
          paragraphs: [
            'Înainte să bagi cablul USB în calculator, verifică aceste 7 reguli de aur din laborator:'
          ],
          numberedSteps: [
            'LED conectat fără rezistor de 220 Ω–330 Ω în serie → curentul urcă brusc și arde LED-ul sau pinul microcontrollerului.',
            'Semnal de 5V (ex: ECHO de la HC-SR04) băgat direct într-un pin de ESP32 (3.3V) → necesită divizor rezistiv (ex: 1 kΩ + 2 kΩ).',
            'Alimentarea unui servomotor mare sau motor DC direct din pinul de 5V al USB-ului / Arduino → provoacă resetări instantanee sau arde regulatorul; folosește sursă externă + GND comun.',
            'Uitarea firului comun de masă (GND): dacă ai o baterie externă pentru motoare, minusul bateriei TREBUIE legat la GND-ul plăcii Arduino/ESP32.',
            'Montarea inversă a LED-ului (piciorul lung + anod la GND) sau inversarea polarității pe condensatori electrolitici.',
            'Scurtcircuit accidental pe șinele + / − ale breadboard-ului (pini îndoiți care se ating sub modul).',
            'Folosirea pinilor 0 și 1 (RX/TX) pe Arduino Uno pentru LED-uri/butoane → blochează încărcarea codului prin USB și Serial Monitor.'
          ],
          callout: {
            title: 'Tester de siguranță în 5 secunde',
            text: 'Dacă simți miros slab de plastic încins sau placa devine fierbinte la atingere, scoate IMEDIAT cablul USB și verifică alimentarea 5V/GND cu un multimetru înainte de a o reconecta!',
            variant: 'warning'
          }
        }
      ],
      checklistTitle: 'Checklist înainte de alimentarea oricărui montaj IoT',
      checklist: [
        'Fiecare LED are rezistor în serie de 220 Ω–330 Ω (Legea lui Ohm: R = (V_sursă − V_LED) / I).',
        'Toate sursele de alimentare (USB, baterii motoare) împart același fir de masă (GND comun).',
        'Dacă folosesc ESP32 (3.3V), niciun senzor de 5V nu intră direct pe GPIO fără divizor de tensiune.',
        'Am testat logica algoritmului întâi în Arkedo Smart City (/oras/) și în misiunile Arduino.'
      ],
      faqs: [
        {
          question: 'Ce aleg pentru un elev în clasa a VII-a: Arduino Uno sau ESP32?',
          answer: 'Începe cu Arduino Uno (sau kit compatibil) pentru că tolerează mai ușor micile erori pe 5V și se aliniază 100% manualelor românești. După ce stăpânești senzorii și millis(), treci la ESP32 pentru proiecte Wi-Fi/IoT.'
        },
        {
          question: 'De ce are ESP32 nevoie de atenție la tensiunea de 3.3V?',
          answer: 'Logica internă a cipului ESP32 funcționează la 3.3V. Aplicarea unei tensiuni de 5V de la un senzor clasic direct pe un pin GPIO al ESP32 poate distruge definitiv pinul respectiv.'
        },
        {
          question: 'Pe ce pini ai plăcii Arduino Uno funcționează analogWrite() pentru PWM?',
          answer: 'Pe Arduino Uno R3, PWM hardware este disponibil exclusiv pe cei 6 pini marcați cu tilda (~): 3, 5, 6, 9, 10 și 11.'
        },
        {
          question: 'Cum leg un ecran LCD cu adaptor I2C la Arduino Uno?',
          answer: 'Doar 4 fire: VCC la 5V, GND la GND, SDA la pinul A4 și SCL la pinul A5.'
        }
      ],
      internalLinksTitle: 'Simulează Robotică & Smart City Gratuit pe ArkyEdu',
      internalLinks: [
        {
          label: 'Arkedo Smart City — Simulator IoT Interactiv',
          url: '/oras/',
          targetView: 'city',
          description: 'Testează senzori, automatizări de oraș inteligent și logică IoT în browser.'
        },
        {
          label: 'Robotică, Arduino Uno & Senzori (Clasa VIII)',
          url: '/cursuri/g8_robot_a/',
          missionId: 'g8_robot_a',
          description: 'Legea lui Ohm, pini digitali/analogici, HC-SR04 și puntea H.'
        },
        {
          label: 'Proiect Smart Home & PWM/I2C (Clasa VIII)',
          url: '/cursuri/g8_robot_b/',
          missionId: 'g8_robot_b',
          description: 'Integrare completă cu servo SG90, LED PWM, LCD I2C și millis().'
        },
        {
          label: 'Fișă Proiect Arduino Smart City (Barem 100p)',
          url: '/fise/fisa-proiect-clasa-8-arduino-uno-smart-city-senzori-ohm-millis/',
          targetView: 'fise',
          description: 'Subiect practic complet cu întrebări și barem de evaluare.'
        }
      ]
    },
    en: {
      slug: 'robotics-iot-arduino-uno-vs-esp32-microbit-pwm-i2c-projects',
      title: 'Robotics & IoT for Students (2026): Arduino Uno vs. ESP32 vs. Micro:bit, PWM, I2C & 7 Breadboard Mistakes',
      metaTitle: 'Robotics & IoT Guide: Arduino Uno vs ESP32 vs Micro:bit, PWM & I2C | ArkyEdu',
      metaDescription: 'Complete student robotics guide: Arduino Uno vs ESP32 vs BBC Micro:bit comparison, 5V vs 3.3V safety, PWM duty cycle, I2C wiring, and 7 breadboard mistakes to avoid.',
      keywords: 'arduino uno vs esp32 vs microbit beginners, what is pwm analogwrite arduino, i2c sda scl explained simply, breadboard mistakes avoid burning led esp32, middle school iot smart city project',
      breadcrumbLabel: 'IoT Robotics: Arduino vs ESP32 & PWM',
      categoryLabel: 'Robotics & IoT',
      readTime: '14 min read',
      tldrTitle: 'Quick Answer (TL;DR)',
      tldr: 'For Grades 5–6 beginners, BBC Micro:bit provides built-in sensors and block coding without fragile jumper wires. For middle/high school breadboard C++ projects, Arduino Uno is the rugged 5V classroom standard. When you are ready for Wi-Fi/Bluetooth IoT dashboards, upgrade to ESP32—just remember the golden rule: ESP32 GPIO pins run strictly at 3.3V, never 5V!',
      intro: 'Stepping up from blinking a single LED to obstacle-avoiding robots, OLED dashboards, and connected Smart City sensors requires understanding three essentials: board trade-offs, PWM & I2C signals, and basic electrical safety.',
      sections: [
        {
          id: 'arduino-vs-esp32-vs-microbit',
          heading: '1. Arduino Uno vs. ESP32 vs. BBC Micro:bit: Which Board Fits Your Project?',
          paragraphs: [
            'Each microcontroller excels at a different stage of a student’s robotics journey:'
          ],
          table: {
            caption: 'Technical comparison of the top 3 student robotics boards',
            headers: ['Feature', 'BBC Micro:bit v2', 'Arduino Uno (R3 / R4 WiFi)', 'ESP32 DevKit'],
            rows: [
              ['Best Age / Grade', 'Ages 9–13 (Grades 5–6)', 'Ages 11–16 (Grades 6–9)', 'Ages 13–18 (Grades 7–12 & IoT clubs)'],
              ['Main Language', 'MakeCode Blocks & MicroPython', 'Arduino C++ (standard curriculum)', 'Arduino C++ / MicroPython'],
              ['GPIO Logic Voltage', '3.3V', '5V (very forgiving for beginners)', '3.3V strict (5V damages pins!)'],
              ['Wi-Fi & Bluetooth', 'Bluetooth built-in', 'None on R3 (Wi-Fi on R4 WiFi)', 'Dual-mode Wi-Fi + BLE built-in'],
              ['Key Advantage', 'Built-in 25-LED matrix, buttons, mic & compass', 'Massive ecosystem & 5V sensor compatibility', '240 MHz dual-core CPU, huge RAM, cheap Wi-Fi IoT']
            ]
          }
        },
        {
          id: 'pwm-and-i2c-explained',
          heading: '2. How PWM (analogWrite) and I2C (SDA/SCL) Actually Work',
          paragraphs: [
            'Digital pins only output 0V or 5V/3.3V. To dim an LED or vary motor speed smoothly, Pulse Width Modulation (PWM) switches the pin hundreds of times per second using analogWrite(pin, 0..255), controlling the Duty Cycle percentage.',
            'To connect OLED/LCD screens or multiple sensors over just TWO data wires instead of ten, microcontrollers use the I2C bus: SDA (Data) and SCL (Clock), where each device listens on its own hex address (e.g., 0x27 or 0x3C).'
          ],
          table: {
            caption: 'PWM duty cycle values on a 5V Arduino Uno pin',
            headers: ['analogWrite Value', 'Duty Cycle', 'Equivalent Avg Voltage', 'LED / Motor Behavior'],
            rows: [
              ['0', '0%', '0.0 V', 'Completely off'],
              ['64', '25%', '1.25 V', 'Dim glow / low power'],
              ['127', '50%', '2.50 V', 'Half brightness / medium speed'],
              ['255', '100%', '5.00 V', 'Full continuous HIGH']
            ]
          }
        },
        {
          id: 'smart-city-pwm-millis-code',
          heading: '3. Full C++ Sketch: Adaptive Smart Streetlight (LDR + PWM + millis())',
          paragraphs: [
            'This sketch reads an analog LDR photoresistor (A0), maps darkness smoothly onto PWM pin ~9, and schedules checks without blocking via millis():'
          ],
          codeBlock: {
            title: 'Non-blocking Smart Streetlight using PWM & millis()',
            language: 'cpp',
            code: `const int PIN_LDR = A0;
const int PIN_LED_PWM = 9; // Must be a ~ PWM-capable pin
unsigned long lastCheck = 0;

void setup() {
  pinMode(PIN_LED_PWM, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  if (millis() - lastCheck >= 200) {
    lastCheck = millis();
    int lightLevel = analogRead(PIN_LDR); // 0 (dark) .. 1023 (bright)
    int pwmPower = constrain(map(lightLevel, 0, 1023, 255, 0), 0, 255);
    analogWrite(PIN_LED_PWM, pwmPower);
  }
}`,
            caption: 'On Arduino Uno, only pins labeled ~ (3, 5, 6, 9, 10, 11) support hardware PWM.'
          }
        },
        {
          id: 'seven-fatal-breadboard-mistakes',
          heading: '4. Top 7 Breadboard Mistakes That Burn LEDs, Sensors, or Boards',
          paragraphs: [
            'Before plugging in your USB cable, run through these 7 lab safety checks:'
          ],
          numberedSteps: [
            'Wiring an LED without a 220 Ω–330 Ω series resistor → overcurrent instantly burns the LED or pin.',
            'Feeding a 5V signal (e.g., HC-SR04 ECHO) directly into a 3.3V ESP32 GPIO → always add a resistor voltage divider.',
            'Powering heavy servos or DC motors directly from Arduino’s 5V pin → use an external supply + driver (L298N).',
            'Forgetting a shared Common Ground (GND) between external motor batteries and the microcontroller.',
            'Reversing polarized components (electrolytic capacitors) or LED legs.',
            'Leaving bare bent leads touching across power rails (+ / − short circuit).',
            'Attaching sensors to pins 0 & 1 (RX/TX) on Arduino Uno, which blocks USB sketch uploads.'
          ],
          callout: {
            title: '5-Second Safety Rule',
            text: 'If the board feels hot or smells slightly burnt, unplug USB IMMEDIATELY and double-check 5V/GND rails before reconnecting!',
            variant: 'warning'
          }
        }
      ],
      checklistTitle: 'Pre-Power Hardware Safety Checklist',
      checklist: [
        'Every LED has a 220 Ω–330 Ω series resistor.',
        'All external power supplies share a Common Ground (GND) wire.',
        '3.3V boards (ESP32 / Micro:bit) never receive raw 5V signals on GPIO pins.',
        'Tested core automation logic inside Arkedo Smart City (/oras/) first.'
      ],
      faqs: [
        {
          question: 'Should a 7th grader start with Arduino Uno or ESP32?',
          answer: 'Start with Arduino Uno because its 5V pins are more forgiving and 100% aligned with standard school curriculum. Upgrade to ESP32 once comfortable with sensors and millis().'
        },
        {
          question: 'Why must ESP32 pins stay at 3.3V?',
          answer: 'ESP32 silicon is rated strictly for 3.3V I/O; raw 5V inputs can permanently damage its GPIO pins.'
        },
        {
          question: 'Which Arduino Uno pins support hardware PWM?',
          answer: 'Pins 3, 5, 6, 9, 10, and 11 (marked with a ~ tilde symbol).'
        },
        {
          question: 'How do I wire an I2C LCD display to Arduino Uno?',
          answer: 'Just 4 wires: VCC to 5V, GND to GND, SDA to A4, and SCL to A5.'
        }
      ],
      internalLinksTitle: 'Simulate Robotics & Smart City IoT Free on ArkyEdu',
      internalLinks: [
        {
          label: 'Arkedo Smart City — Live IoT Simulator',
          url: '/oras/',
          targetView: 'city',
          description: 'Configure Smart City sensors and IoT triggers directly in your browser.'
        },
        {
          label: 'Robotics, Arduino Uno & Sensors (Grade 8)',
          url: '/cursuri/g8_robot_a/',
          missionId: 'g8_robot_a',
          description: 'Ohm’s law, digital/analog pins, HC-SR04 & motor drivers.'
        },
        {
          label: 'Smart Home IoT Project (Grade 8)',
          url: '/cursuri/g8_robot_b/',
          missionId: 'g8_robot_b',
          description: 'PWM lighting, SG90 servos, I2C LCDs & millis() multitasking.'
        },
        {
          label: 'Grade 8 Arduino Smart City Rubric Sheet',
          url: '/fise/en/grade-8-arduino-uno-smart-city-iot-sensors-ohms-millis-project/',
          targetView: 'fise',
          description: 'Auto-graded 100-point rubric worksheet.'
        }
      ]
    }
  },
  {
    id: 'passkeys-fido2-manager-parole-scam-discord-steam-backup-321',
    category: 'cyber-safety',
    gradeTagRo: 'Clasele VI–VIII · Părinți',
    gradeTagEn: 'Grades 6–8 · Parents',
    publishedAt: '2026-11-22',
    updatedAt: '2026-11-22',
    featured: true,
    ro: {
      slug: 'passkeys-fido2-manager-parole-scam-discord-steam-backup-321',
      title: 'Passkeys (FIDO2), Manageri de Parole, Scam-uri Discord/Steam & Backup 3-2-1: Ghid Complet de Securitate Digitală 2026',
      metaTitle: 'Passkeys, Manageri Parole, Scam Discord/Steam & Backup 3-2-1 | ArkyEdu',
      metaDescription: 'Cum îți securizezi conturile în 2026: cum funcționează Passkeys anti-phishing, manageri de parole (Bitwarden), anatomia capcanelor Discord/Steam QR și regula de backup 3-2-1.',
      keywords: 'ce sunt passkeys cum functioneaza, manager de parole sigur gratuit copii, teapa discord nitro steam link fals, recuperare cont spart discord google, regula backup 3-2-1 explicata, 2fa totp vs sms',
      breadcrumbLabel: 'Passkeys, Scam Discord/Steam & 3-2-1',
      categoryLabel: 'Securitate Online',
      readTime: '12 min citire',
      tldrTitle: 'Răspuns Rapid (TL;DR)',
      tldr: 'Parolele scurte reciclate sunt principala cauză a furtului de conturi. În 2026, cele mai sigure trei măsuri gratuite sunt: (1) activarea Passkeys (FIDO2) pe conturile Google/Microsoft/Apple — imposibil de furat prin phishing pentru că sunt legate criptografic de domeniu; (2) folosirea unui manager de parole gratuit (ex: Bitwarden) + Authenticator TOTP în locul SMS-urilor; și (3) aplicarea regulii de backup 3-2-1 pentru proiectele școlare și pozele familiei.',
      intro: '„Mi s-a spart Discord-ul și acum trimite linkuri cu Nitro gratuit la toată clasa!” sau „Mi-am pierdut referatul din cauza unui ransomware / stick stricat!”. Aproape toate aceste incidente pot fi prevenite definitiv în 15 minute dacă treci de la vechile parole memorate pe caiet la standardele moderne de securitate din 2026.',
      sections: [
        {
          id: 'passkeys-fido2-vs-parole-si-2fa',
          heading: '1. Ce sunt Passkeys (FIDO2) și de ce sunt imunizate matematic la Phishing?',
          paragraphs: [
            'Un Passkey (cheie de acces) înlocuiește parola tradițională cu o pereche de chei criptografice (criptografie asimetrică): o cheie publică stocată pe serverul site-ului și o cheie privată păstrată securizat în cipul telefonului sau laptopului tău, deblocată doar prin amprentă, FaceID sau PIN-ul dispozitivului.',
            'Secretul anti-phishing al Passkey-urilor este legarea strictă de domeniu: dacă un escroc îți trimite un link fals de tip g00gle-login.com, telefonul refuză automat să semneze autentificarea, chiar dacă site-ul fals arată 100% identic!'
          ],
          table: {
            caption: 'Ierarhia metodelor de autentificare în 2026 (de la vulnerabil la invulnerabil)',
            headers: ['Metodă de autentificare', 'Rezistență la Phishing', 'Rezistență la spargere baze date', 'Verdict 2026'],
            rows: [
              ['Parolă simplă refolosită (ex: Ana2012!)', '0% — se fură instant', '0% — atac Credential Stuffing', 'PERICULOS — elimină imediat'],
              ['Parolă unică 16+ car. + 2FA prin SMS', 'Scăzută (phishing live + SIM swap)', 'Medie–Bună', 'Acceptabilă doar unde nu există altceva'],
              ['Manager Parole (Bitwarden) + App TOTP', 'Medie–Mare', 'Excelentă (parole unice 20+ car.)', 'RECOMANDAT pentru majoritatea conturilor'],
              ['Passkey (FIDO2 / Biometric pe dispozitiv)', '100% IMUN la phishing clasic', '100% (serverul are doar cheia publică)', 'STANDARDUL DE AUR 2026']
            ]
          }
        },
        {
          id: 'anatomia-scam-urilor-discord-steam-qr',
          heading: '2. Anatomia celor mai frecvente 4 scam-uri pe Discord, Steam și WhatsApp',
          paragraphs: [
            'Escrocii cibernetici din 2026 nu mai „sparg” serverele mari, ci păcălesc elevii prin inginerie socială să își predea singuri sesiunea de conectare (Token / QR):'
          ],
          bulletPoints: [
            'Capcana codului QR Discord: „Scanează QR-ul ca să intri pe serverul VIP / să primești Nitro gratuit!”. Când scanezi cu telefonul, de fapt autorizezi conectarea hackerului pe contul tău fără să-i dai parola.',
            '„Te-am raportat din greșeală pe Steam/Discord, vorbește cu adminul”: Un prieten cu contul deja furat îți spune că vei lua ban dacă nu adaugi un fals „moderator” care îți cere date sau bani.',
            '„Testează jocul meu nou (.exe / .zip cu parolă)”: Arhiva conține un Infostealer care fură în 3 secunde cookie-urile salvate în Chrome/Edge și tokenurile Discord.',
            'Linkuri false cu domenii înșelătoare (Typosquatting): d1scord-gift.com, robIox (cu i mare în loc de l mic), steamcomunnity.com.'
          ],
          callout: {
            title: 'Prim-ajutor în 60 de secunde dacă ai apăsat pe un link suspect',
            text: '(1) Schimbă parola din aplicația OFICIALĂ (aceasta invalidează tokenurile furate); (2) Apasă „Log out all known devices”; (3) Rulează o scanare cu Windows Defender / antivirus și verifică secțiunea Authorized Apps în Discord/Google!',
            variant: 'warning'
          }
        },
        {
          id: 'manager-parole-si-fraze-secrete',
          heading: '3. Cum funcționează un Manager de Parole și de ce „4 cuvinte aleatorii” bat „P@r0l@12!”',
          paragraphs: [
            'Nimeni nu poate memora 40 de parole diferite lungi de 18 caractere. Un Password Manager gratuit și open-source (ex: Bitwarden sau managerul criptat din profilul de browser al familiei) reține toate parolele într-un seif protejat de O SINGURĂ parolă principală (Master Password).',
            'Pentru Master Password (sau parola de Wi-Fi), folosește metoda Passphrase — 4 cuvinte nelegate între ele cu separator (ex: avion-portocala-luna-74): este mult mai ușor de tastat decât P@ss#9z! și de miliarde de ori mai greu de spart prin brute-force.'
          ]
        },
        {
          id: 'regula-backup-3-2-1',
          heading: '4. Regula de Backup 3-2-1: Cum nu mai pierzi niciodată proiectele sau pozele',
          paragraphs: [
            'Un laptop scăpat pe jos, un stick USB pierdut la școală sau un virus Ransomware pot șterge ani întregi de muncă. Profesioniștii aplică întotdeauna Regula 3-2-1:'
          ],
          numberedSteps: [
            '3 copii ale fișierelor importante (fișierul original + 2 copii de rezervă).',
            '2 medii diferite de stocare (de ex: SSD-ul laptopului + un HDD extern / stick separat).',
            '1 copie Off-Site (în Cloud criptat — Google Drive, OneDrive, iCloud — sau la altă locație fizică, ferită de incendiu, furt sau Ransomware local).'
          ]
        }
      ],
      checklistTitle: 'Audit de securitate de 10 minute pentru elevi și părinți',
      checklist: [
        'Am activat Passkey sau 2FA prin aplicație (nu doar SMS) pe Google, Microsoft, Discord și Steam.',
        'Nu folosesc aceeași parolă pe două site-uri diferite (am verificat cu un Manager de Parole).',
        'Nu scanez niciodată coduri QR trimise de alți utilizatori pentru „premii” sau „verificări”.',
        'Proiectele școlare au backup activ în Cloud (regula 3-2-1).'
      ],
      faqs: [
        {
          question: 'Dacă îmi pierd telefonul, mai pot intra în conturile cu Passkey?',
          answer: 'Da! Passkey-urile moderne se sincronizează criptat prin contul tău principal (Google Password Manager, Apple iCloud Keychain sau Bitwarden) sau pot fi recuperate prin codurile de rezervă tipărite.'
        },
        {
          question: 'Sunt sigure managerii de parole dacă păstrează toate parolele într-un singur loc?',
          answer: 'Da, cu condiția să folosești un manager reputat cu criptare Zero-Knowledge (cum este Bitwarden): datele sunt criptate local cu Master Password-ul tău, iar serverul nu îți poate citi niciodată seiful.'
        },
        {
          question: 'Cum recunosc imediat o tentativă de furt pe Discord sau Steam?',
          answer: 'Orice mesaj care invocă o urgență („ai fost raportat greșit”), promite Nitro/Skin-uri gratuite pe un link extern sau îți cere să descarci un .zip/.exe pentru „testare beta” este o capcană.'
        },
        {
          question: 'De ce este 2FA prin aplicație (TOTP) mai bun decât 2FA prin SMS?',
          answer: 'SMS-urile pot fi interceptate prin atacuri de tip SIM-Swapping și nu oferă protecție când ești fără semnal în străinătate, pe când codurile din aplicație (Google/Microsoft Authenticator) sunt generate offline local pe dispozitiv.'
        }
      ],
      internalLinksTitle: 'Exersează Securitatea Cibernetică pe ArkyEdu',
      internalLinks: [
        {
          label: 'Securitate Cibernetică, Malware & 2FA (Clasa VI)',
          url: '/cursuri/malware-securitate/',
          missionId: 'malware-securitate',
          description: 'Misiune interactivă despre viruși, ransomware, parole și backup 3-2-1.'
        },
        {
          label: 'Test cu Barem: Securitate Cibernetică & E-mail',
          url: '/fise/test-cu-barem-clasa-6-securitate-cibernetica-phishing-2fa-email-bcc/',
          targetView: 'fise',
          description: 'Testează-ți instinctele anti-phishing pe baremul de 100p.'
        },
        {
          label: 'Laborator AI & Detector Deepfake',
          url: '/laborator-ai/',
          targetView: 'ailab',
          description: 'Antrenează-te să recunoști manipulările și fraudele sintetice.'
        },
        {
          label: 'Glosar: Autentificare în Doi Pași (2FA)',
          url: '/glosar/autentificare-doi-pasi-2fa/',
          targetView: 'glossary',
          description: 'Definiție clară, comparație SMS vs TOTP și exemple.'
        }
      ]
    },
    en: {
      slug: 'passkeys-fido2-password-managers-discord-steam-scams-backup-321',
      title: 'Passkeys (FIDO2), Password Managers, Discord/Steam Scams & 3-2-1 Backups: The Complete 2026 Security Guide',
      metaTitle: 'Passkeys, Password Managers, Scams & 3-2-1 Backups 2026 | ArkyEdu',
      metaDescription: 'How to lock down student and family accounts in 2026: phishing-proof Passkeys (FIDO2), free password managers, Discord/Steam QR scams, and the 3-2-1 backup rule.',
      keywords: 'what are passkeys fido2 explained, best free password manager for families, discord nitro steam qr code scam, recover hacked discord account, 3-2-1 backup rule explained, totp authenticator vs sms 2fa',
      breadcrumbLabel: 'Passkeys, Scams & 3-2-1 Backups',
      categoryLabel: 'Cyber Safety',
      readTime: '12 min read',
      tldrTitle: 'Quick Answer (TL;DR)',
      tldr: 'Reused short passwords cause most account takeovers. In 2026, three free upgrades eliminate 99% of risks: (1) enable FIDO2 Passkeys on Google/Microsoft/Apple—mathematically immune to phishing because keys bind strictly to domains; (2) use a free zero-knowledge password manager (e.g., Bitwarden) + Authenticator app TOTP instead of SMS; and (3) follow the 3-2-1 backup rule for schoolwork and family photos.',
      intro: '„My Discord got hijacked and started spamming fake Nitro links!” or „I lost my entire Grade 8 project when my USB stick died!” Almost every digital disaster like this is preventable in 15 minutes using modern 2026 security habits.',
      sections: [
        {
          id: 'how-passkeys-stop-phishing',
          heading: '1. How Passkeys (FIDO2) Make Phishing Mathematically Fail',
          paragraphs: [
            'A Passkey replaces typed passwords with asymmetric public/private key cryptography stored inside your device’s secure chip and unlocked via FaceID, fingerprint, or device PIN.',
            'Because the cryptographic signature is strictly bound to the real website domain, even a pixel-perfect lookalike phishing domain (like g00gle-login.com) will fail to trigger your passkey!'
          ],
          table: {
            caption: '2026 Authentication Security Ladder',
            headers: ['Method', 'Phishing Resistance', 'Data Breach Resistance', '2026 Verdict'],
            rows: [
              ['Short reused password', '0%', '0% (credential stuffing)', 'DANGEROUS — replace immediately'],
              ['Unique password + SMS 2FA', 'Low (live proxy + SIM swap)', 'Medium–Good', 'Use only if no app/passkey option exists'],
              ['Password Manager + App TOTP', 'Medium–High', 'Excellent (unique 20-char keys)', 'RECOMMENDED baseline'],
              ['FIDO2 Passkey (Device Biometric)', '100% phishing-proof', '100% (server holds public key only)', '2026 GOLD STANDARD']
            ]
          }
        },
        {
          id: 'discord-steam-scam-anatomy',
          heading: '2. Inside the Top 4 Discord, Steam & WhatsApp Account Scams',
          paragraphs: [
            'Modern attackers rarely hack platform servers—they trick students into handing over session tokens or scanning login QR codes:'
          ],
          bulletPoints: [
            'Fake Discord QR Verification: „Scan this QR code to unlock VIP / free Nitro!” Scanning actually approves the hacker’s own browser login onto your account.',
            '„I accidentally reported your Steam/Discord account”: A compromised friend tells you to message a fake „admin” who demands credentials or gift cards.',
            '„Playtest my new indie game (.exe / password .zip)”: Runs an infostealer that grabs saved browser cookies and Discord tokens in 3 seconds.',
            'Lookalike domains (Typosquatting): d1scord-gift.com, robIox (capital i instead of L).'
          ],
          callout: {
            title: '60-Second Emergency Recovery Protocol',
            text: 'If you clicked a shady link: (1) change your password inside the OFFICIAL app (invalidating stolen session tokens); (2) sign out of all active sessions; (3) revoke unknown Authorized Apps and run an antivirus scan.',
            variant: 'warning'
          }
        },
        {
          id: 'password-managers-and-passphrases',
          heading: '3. Password Managers & Why „Four Random Words” Beat „P@ss12!”',
          paragraphs: [
            'Nobody can memorize 40 unique 18-character passwords. A reputable open-source manager (such as Bitwarden) stores them all in an encrypted vault behind ONE strong Master Passphrase—like horse-cloud-guitar-49—which is easy to type yet exponentially harder to brute-force than short symbol-swapped passwords.'
          ]
        },
        {
          id: 'backup-rule-3-2-1',
          heading: '4. The 3-2-1 Backup Rule: Never Lose Schoolwork Again',
          paragraphs: [
            'Laptops drop, USB drives fail, and ransomware encrypts local disks. Protect irreplaceable files with the 3-2-1 rule:'
          ],
          numberedSteps: [
            '3 total copies of important files (1 original + 2 backups).',
            '2 different storage media types (e.g., laptop SSD + external drive).',
            '1 off-site copy stored in encrypted cloud sync (Google Drive / OneDrive) safe from theft or local ransomware.'
          ]
        }
      ],
      checklistTitle: '10-Minute Family Account Hardening Checklist',
      checklist: [
        'Enabled Passkeys or Authenticator TOTP 2FA on Google, Microsoft, Discord, and Steam.',
        'Zero reused passwords across different websites (managed in a Password Manager).',
        'Never scan „prize” or „server verification” QR codes sent by strangers or hacked friends.',
        'Critical school projects synced to off-site cloud backup (3-2-1 rule).'
      ],
      faqs: [
        {
          question: 'What happens if I lose my phone with Passkeys?',
          answer: 'Passkeys sync encrypted across your Google, Apple, or Bitwarden vault, and you can also keep printed recovery codes safely at home.'
        },
        {
          question: 'Why is an Authenticator app (TOTP) safer than SMS 2FA?',
          answer: 'SMS codes are vulnerable to SIM-swapping and network interception, whereas TOTP codes generate offline directly on your device.'
        },
        {
          question: 'What is the fastest sign of a Discord or Steam scam?',
          answer: 'Urgent threats („your account will be banned in 1 hour”), free Nitro/skins on external links, or requests to run password-protected .zip/.exe playtests.'
        }
      ],
      internalLinksTitle: 'Practice Cyber Defense on ArkyEdu',
      internalLinks: [
        {
          label: 'Cybersecurity, Malware & 2FA (Grade 6)',
          url: '/cursuri/malware-securitate/',
          missionId: 'malware-securitate',
          description: 'Interactive mission on ransomware, passwords, 2FA, and 3-2-1 backups.'
        },
        {
          label: 'Grade 6 Cybersecurity & Phishing Exam Sheet',
          url: '/fise/en/grade-6-cybersecurity-phishing-2fa-email-bcc-exam/',
          targetView: 'fise',
          description: 'Auto-graded 100-point rubric assessment.'
        },
        {
          label: 'AI & Deepfake Forensics Lab',
          url: '/laborator-ai/en/',
          targetView: 'ailab',
          description: 'Train your eyes against synthetic voice and photo scams.'
        },
        {
          label: 'Glossary: Two-Factor Authentication (2FA)',
          url: '/glosar/en/two-factor-auth-2fa/',
          targetView: 'glossary',
          description: 'Quick definition and real-world examples.'
        }
      ]
    }
  },
  {
    id: 'competente-digitale-agenti-ai-rag-cariere-viitor-elevi-2026',
    category: 'ai-skills',
    gradeTagRo: 'Clasele VII–VIII · Viitor',
    gradeTagEn: 'Grades 7–8 · Future',
    publishedAt: '2026-11-22',
    updatedAt: '2026-11-22',
    featured: true,
    ro: {
      slug: 'competente-digitale-agenti-ai-rag-cariere-viitor-elevi-2026',
      title: 'Competențe Digitale, Agenți AI, RAG & Carierele Viitorului (2026–2030): Cum pregătești un elev de gimnaziu să nu fie înlocuit de AI',
      metaTitle: 'Competențe Digitale, Agenți AI, RAG & Cariere 2026–2030 | ArkyEdu',
      metaDescription: 'Ghid strategic pentru elevi, părinți și profesori: diferența Chatbot vs RAG vs Agent AI, cadrul european DigComp, ce abilități NU poate automatiza AI-ul și portofoliul de gimnaziu.',
      keywords: 'ce sunt agentii ai si rag explicat simplu, competente digitale digcomp elevi romania, meserii viitor 2030 inteligenta artificiala, cum invata copiii sa lucreze cu ai, portofoliu digital elev gimnaziu',
      breadcrumbLabel: 'Agenți AI, RAG & Cariere 2026–2030',
      categoryLabel: 'Inteligență Artificială',
      readTime: '13 min citire',
      tldrTitle: 'Răspuns Rapid (TL;DR)',
      tldr: 'În 2026, simpla scriere de cod mecanic sau rezumarea unor texte este deja automatizată. Elevii care vor câștiga în următorul deceniu sunt cei care înțeleg arhitectura din spatele uneltelor moderne — Chatbot clasic vs. RAG (răspunsuri ancorate în documente reale) vs. Agenți AI (planificare și apelare de unelte) — și își construiesc 3 abilități greu de înlocuit: gândire algoritmică și debugging, verificare critică a surselor și un portofoliu digital real demonstrabil până la finalul clasei a VIII-a.',
      intro: 'Întrebarea nr. 1 pe care o pun părinții și profesorii în 2026 este: „Mai are rost să învețe copilul C++, Excel sau Web Design dacă AI-ul scrie cod în 5 secunde?”. Răspunsul scurt este DA — mai mult ca oricând — dar felul în care învățăm trebuie să treacă de la memorare mecanică la verificare, arhitectură și gândire critică.',
      sections: [
        {
          id: 'chatbot-vs-rag-vs-agent-ai',
          heading: '1. Evoluția AI în 2026: Chatbot Clasic vs. RAG vs. Agenți AI',
          paragraphs: [
            'Pentru a folosi inteligent tehnologia la școală și în viitoarele cariere, un elev trebuie să distingă cele trei generații de sisteme AI:'
          ],
          table: {
            caption: 'Cele 3 arhitecturi AI esențiale explicate pe înțelesul elevilor',
            headers: ['Tip Sistem', 'Cum funcționează pe scurt', 'Exemplu concret', 'Risc principal fără control uman'],
            rows: [
              ['Chatbot LLM clasic', 'Prezice text exclusiv din memoria antrenamentului trecut', '„Explică-mi structura if în C++”', 'Halucinații sau informații depășite (post-cutoff)'],
              ['RAG (Retrieval-Augmented Generation)', 'Caută întâi pasaje exacte în documente verificate (manuale, fișiere .txt, PDF), apoi formulează răspunsul cu citare', 'Asistent care răspunde STRICT din baremele /fișe-llm.txt ale școlii', 'Calitatea depinde de calitatea documentelor indexate'],
              ['Agent AI autonom', 'Descompune un obiectiv în pași, apelează unelte (browser, compilator C++, calendar), vede erorile și încearcă din nou', 'Agent de coding care scrie un joc, îl compilează și repară bug-urile', 'Poate executa acțiuni greșite în lanț dacă nu are verificare „Human-in-the-Loop”']
            ]
          }
        },
        {
          id: 'ce-automatizeaza-ai-vs-abilitati-umane',
          heading: '2. Harta Competențelor 2026–2030: Ce face AI-ul vs. Ce face Omul Pregătit',
          paragraphs: [
            'Cadrul european DigComp și noua programă școlară pun accent pe înțelegerea logicii și pe responsabilitate, nu pe tastat mecanic:'
          ],
          table: {
            caption: 'De ce are nevoie în continuare un elev de baze solide în C++, Excel, Hardware & Rețele',
            headers: ['Sarcină unde AI ajută rapid', 'De ce ești vulnerabil FĂRĂ cunoștințe de bază', 'Competența reală de top (Human-in-the-Loop)'],
            rows: [
              ['Generare cod C++ / Python', 'Nu poți depista o eroare subtilă de tip off-by-one, int overflow sau complexitate O(n²) lentă', 'Debugging pas cu pas (Visual Trace), alegerea algoritmului O(n log n) și scrierea testelor'],
              ['Formule Excel & Analiză', 'Poți lua decizii greșite pe baza unei formule cu separator sau referință $A$1 greșită', 'Auditarea datelor, verificarea ipotezelor și comunicarea concluziilor'],
              ['Creare prezentări & eseuri', 'Poți livra conținut fals inventat (halucinație AI) și pierde credibilitatea', 'Verificare prin metoda C.R.I.F., structură narativă și gândire originală'],
              ['Configurare IoT / Web', 'Nu poți depana fizic un fir pus greșit pe breadboard sau o problemă de securitate HTTPS', 'Arhitectură de sistem, securitate, rețelistică și integrare hardware–software']
            ]
          }
        },
        {
          id: 'portofoliu-digital-pana-in-clasa-8',
          heading: '3. Portofoliul Digital al Elevului în 5 piese reale (Clasele V–VIII)',
          paragraphs: [
            'Până termină clasa a VIII-a, un elev poate avea deja un portofoliu concret și gratuit care demonstrează competențe reale pentru admitere la licee bune, cluburi de robotică sau olimpiade:'
          ],
          numberedSteps: [
            'Un mic joc 2D funcțional (Scratch 3.0 în clasele V–VI) cu variabile, clonare și scor salvat.',
            'Un portofoliu de 10–12 probleme C++ rezolvate și verificate în Arena Olimpiadă (cu trasare pe vectori și complexitate optimă).',
            'O pagină web semantică HTML5 + CSS responsivă (portofoliu personal sau proiect școlar) fără cod copiat orb.',
            'O foaie de calcul Excel / Sheets cu formule IF/COUNTIF/XLOOKUP și grafice curate pe date reale.',
            'Un proiect Smart Home / Smart City (Arduino / Simulator IoT) documentat cu schemă, cod millis() și diplome verificate în Carnetul Digital ArkyEdu.'
          ],
          callout: {
            title: 'Regula „Copilot, nu Autopilot”',
            text: 'Încurajează elevul să folosească AI-ul ca pe un meditator socratic („Arată-mi unde am greșit logica buclei while și dă-mi un indiciu, fără să-mi scrii soluția finală”). Cel care înțelege de ce funcționează codul va conduce întotdeauna!',
            variant: 'tip'
          }
        }
      ],
      checklistTitle: 'Checklist pentru pregătirea elevului în era Agenților AI',
      checklist: [
        'Elevul știe diferența dintre un Chatbot simplu, un sistem RAG cu surse reale și un Agent AI.',
        'Verifică fiecare bucată de cod generată de AI pe cazuri limită (N=0, N=1, numere mari 10^9).',
        'Aplică regulile de confidențialitate: zero nume reale, CNP, parole sau poze personale încărcate în AI-uri publice.',
        'Construiește proiecte proprii verificabile în Carnetul Digital și Laboratoarele ArkyEdu.'
      ],
      faqs: [
        {
          question: 'Ce este RAG (Retrieval-Augmented Generation) pe scurt?',
          answer: 'RAG este tehnica prin care un model AI caută mai întâi informații exacte într-o bibliotecă de documente verificate (manuale, baze de cunoștințe) înainte să răspundă, reducând dramatic halucinațiile și oferind citări reale.'
        },
        {
          question: 'Mai are rost să învețe copiii C++ dacă AI-ul scrie cod automat?',
          answer: 'Da! AI-ul este un generator rapid de ciorne, dar fără gândire algoritmică nu poți verifica dacă soluția pică pe cazuri limită, depășește timpul de execuție sau introduce bug-uri de securitate.'
        },
        {
          question: 'Care sunt cele 5 zone ale cadrului european DigComp pentru elevi?',
          answer: 'Alfa-betizare informațională și date, Comunicare și colaborare, Creare de conținut digital, Siguranță cibernetică și Rezolvare de probleme — toate acoperite integral de cele 40 de module ArkyEdu.'
        }
      ],
      internalLinksTitle: 'Construiește-ți Portofoliul & Competențele AI pe ArkyEdu',
      internalLinks: [
        {
          label: 'Laboratorul AI, Tokeni & Deepfake',
          url: '/laborator-ai/',
          targetView: 'ailab',
          description: 'Experimentează interactiv tokenizarea, Softmax, halucinațiile și ingineria de prompturi.'
        },
        {
          label: 'Sandbox Cod & Arena Olimpiadă (12 Probleme)',
          url: '/sandbox/?tab=olympiad',
          targetView: 'sandbox',
          description: 'Demonstrează competențe reale de C++ și algoritmică cu testare automată.'
        },
        {
          label: 'Carnetul Digital & Diplome 1–10',
          url: '/comparatie-scoli-private/',
          targetView: 'catalog',
          description: 'Vezi parcursul complet V–VIII aliniat DigComp — 100% gratuit.'
        },
        {
          label: 'Playbook Profesor & Pregătire Viitor',
          url: '/blog/ghid-profesor-tic-catalog-digital-olimpiada-gimnaziu/',
          description: 'Cum integrează profesorii laboratoarele moderne în ora de 50 de minute.'
        }
      ]
    },
    en: {
      slug: 'digital-skills-ai-agents-rag-future-tech-careers-students-2026',
      title: 'Digital Literacy, AI Agents, RAG & Future Tech Careers (2026–2030): Preparing Students to Lead AI Instead of Being Replaced',
      metaTitle: 'Digital Skills, AI Agents, RAG & Future Careers 2026–2030 | ArkyEdu',
      metaDescription: 'Strategic roadmap for students, parents, and teachers: Chatbot vs RAG vs AI Agents, DigComp framework, human skills AI cannot replace, and a Grade 8 digital portfolio.',
      keywords: 'ai agents vs rag explained for students, digital literacy digcomp 2026, future tech careers kids ai era, should kids still learn coding with ai, student digital portfolio grade 8',
      breadcrumbLabel: 'AI Agents, RAG & Future Careers',
      categoryLabel: 'AI & Literacy',
      readTime: '13 min read',
      tldrTitle: 'Quick Answer (TL;DR)',
      tldr: 'By 2026, boilerplate code and generic summaries are commoditized. Students who thrive over the next decade understand how modern AI systems differ—Chatbots vs. RAG (answers grounded in verified docs) vs. AI Agents (planning + tool execution)—and build three irreplaceable human pillars: algorithmic debugging, source verification, and a real Grade 8 portfolio of working projects.',
      intro: '„Why should kids still learn C++, Excel, or Web Design when AI generates code in five seconds?” It’s the #1 question parents ask in 2026. The answer is YES—more than ever—provided education shifts from rote typing to verification, architecture, and critical thinking.',
      sections: [
        {
          id: 'chatbot-vs-rag-vs-agents',
          heading: '1. The 2026 AI Stack Explained: Classic Chatbot vs. RAG vs. AI Agents',
          paragraphs: [
            'Understanding these three architectures keeps students firmly in the driver’s seat:'
          ],
          table: {
            caption: 'Three AI system architectures every student should recognize',
            headers: ['System Type', 'How It Works', 'Concrete Example', 'Primary Risk Without Oversight'],
            rows: [
              ['Classic LLM Chatbot', 'Predicts tokens solely from past training weights', '„Explain C++ if-else syntax”', 'Confident hallucinations on niche or current facts'],
              ['RAG (Retrieval-Augmented Generation)', 'Searches verified knowledge files first, then writes grounded, cited answers', 'Study assistant anchored to /fise-llm.txt rubrics', 'Output quality depends on retrieved source quality'],
              ['Autonomous AI Agent', 'Plans multi-step tasks, invokes tools (compiler, browser), observes errors & iterates', 'Coding agent writing, compiling, and patching code', 'Compounding errors without „Human-in-the-Loop” checks']
            ]
          }
        },
        {
          id: 'human-skills-ai-cannot-replace',
          heading: '2. The 2026–2030 Skills Map: What AI Drafts vs. What Skilled Humans Own',
          paragraphs: [
            'Strong fundamentals in algorithms, spreadsheets, networking, and hardware remain essential precisely because you cannot audit what you do not understand:'
          ],
          table: {
            caption: 'Why foundational CS & ICT literacy multiplies AI productivity',
            headers: ['AI-Assisted Task', 'Failure Mode Without CS Basics', 'High-Value Human Skill'],
            rows: [
              ['Drafting C++ / Python', 'Missing subtle off-by-one bugs, 32-bit overflow, or slow O(n²) loops', 'Line-by-line debugging (Visual Trace), Big-O design & edge-case testing'],
              ['Excel & Data Analysis', 'Acting on broken $A$1 references or locale formula mismatches', 'Data auditing, sanity checks & strategic decision-making'],
              ['Reports & Presentations', 'Submitting fabricated citations (hallucinations)', 'C.R.I.F. verification, clear narrative & original insight'],
              ['IoT & Web Projects', 'Unable to troubleshoot a miswired breadboard or HTTPS flaw', 'System architecture, hardware safety & end-to-end security']
            ]
          }
        },
        {
          id: 'grade-8-digital-portfolio',
          heading: '3. Five-Piece Grade 8 Digital Portfolio Every Student Can Build Free',
          paragraphs: [
            'By the end of Grade 8, any student can showcase tangible proof of digital mastery:'
          ],
          numberedSteps: [
            'A working 2D game (Scratch 3.0) demonstrating coordinates, variables, clones, and win states.',
            '10–12 solved C++ problems in the Olympiad Arena with verified O(n) / O(log n) passes.',
            'A clean responsive HTML5 + CSS web project built from scratch.',
            'A structured spreadsheet featuring IF, COUNTIF, XLOOKUP, and clean charts.',
            'A Smart Home / Smart City IoT build with millis() multitasking and earned Digital Portfolio Diplomas.'
          ],
          callout: {
            title: 'The „Copilot, Never Autopilot” Habit',
            text: 'Teach students to ask AI for Socratic hints („Spot the bug in my loop without rewriting my entire program”) rather than blind copy-paste.',
            variant: 'tip'
          }
        }
      ],
      checklistTitle: 'Future-Ready Student AI Checklist',
      checklist: [
        'Understands the difference between Chatbots, grounded RAG, and tool-using AI Agents.',
        'Always tests AI-generated code on boundary cases (N=0, N=1, large N).',
        'Never shares personal PII, school credentials, or private photos in public AI tools.',
        'Builds verifiable projects across ArkyEdu Labs and Olympiad Arena.'
      ],
      faqs: [
        {
          question: 'What does RAG (Retrieval-Augmented Generation) mean simply?',
          answer: 'RAG lets an AI look up verified facts inside trusted documents before generating its answer, dramatically reducing hallucinations.'
        },
        {
          question: 'Is learning C++ still worth it when AI can write code?',
          answer: 'Yes! AI is a fast draft assistant, but algorithmic thinking is essential to catch edge-case bugs, performance bottlenecks, and security issues.'
        },
        {
          question: 'How does ArkyEdu align with DigComp digital literacy?',
          answer: 'Its 40 interactive modules cover Information Literacy, Collaboration, Digital Content Creation, Cybersecurity, and Algorithmic Problem Solving.'
        }
      ],
      internalLinksTitle: 'Build Future-Proof Skills Free on ArkyEdu',
      internalLinks: [
        {
          label: 'AI, Tokenization & Deepfake Lab',
          url: '/laborator-ai/en/',
          targetView: 'ailab',
          description: 'Explore live tokenizers, Softmax probabilities, hallucinations, and prompts.'
        },
        {
          label: 'Code Sandbox & Olympiad Arena (12 Problems)',
          url: '/sandbox/?tab=olympiad',
          targetView: 'sandbox',
          description: 'Prove algorithmic mastery with automated test suites.'
        },
        {
          label: 'Complete Grade 5–8 Free Roadmap',
          url: '/comparatie-scoli-private/',
          targetView: 'catalog',
          description: 'Compare ArkyEdu’s free DigComp curriculum against paid academies.'
        },
        {
          label: 'ICT Teacher Playbook & Classroom Strategy',
          url: '/blog/en/ict-teacher-playbook-digital-gradebook-olympiad-prep-guide/',
          description: 'How educators run 50-minute zero-install digital labs.'
        }
      ]
    }
  }
];
