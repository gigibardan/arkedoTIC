import { AllMissionId } from '../types';

export type LeonidaDistrictId =
  | 'vice_city'
  | 'leonida_keys'
  | 'port_gellhorn'
  | 'grassrivers'
  | 'mount_kalaga'
  | 'ambrosia';

export type LeonidaChallengeKind = 'binary4' | 'mcq' | 'short-code';

export interface LeonidaChallenge {
  id: string;
  districtId: LeonidaDistrictId;
  curriculumTagRo: string;
  curriculumTagEn: string;
  relatedMissionId: AllMissionId;
  relatedBlogSlugRo: string;
  relatedBlogSlugEn: string;
  titleRo: string;
  titleEn: string;
  briefingRo: string;
  briefingEn: string;
  kind: LeonidaChallengeKind;
  /** For binary4: target decimal (1..15). For mcq: 0-based index. For short-code: canonical answer */
  targetAnswer: number | string;
  acceptedAliases?: string[];
  codeSnippet?: string;
  optionsRo?: string[];
  optionsEn?: string[];
  hintRo: string;
  hintEn: string;
  rewardCash: number;
  rewardXP: number;
  rewardCoins: number;
}

export interface LeonidaRegion {
  id: LeonidaDistrictId;
  nameRo: string;
  nameEn: string;
  subtitleRo: string;
  subtitleEn: string;
  mapPctX: number;
  mapPctY: number;
  worldX: number;
  worldY: number;
  themeColor: string;
  accentHex: string;
  curriculumTopicRo: string;
  curriculumTopicEn: string;
  relatedModuleId: AllMissionId;
  descriptionRo: string;
  descriptionEn: string;
  loreFactRo: string;
  loreFactEn: string;
  recommendedVehicleId: string;
}

export interface LeonidaVehicleDef {
  id: string;
  nameRo: string;
  nameEn: string;
  categoryRo: string;
  categoryEn: string;
  maxSpeed: number;
  accel: number;
  turnRate: number;
  armor: number;
  canWater: boolean;
  offroadFactor: number;
  bodyColor: string;
  stripeColor: string;
  length: number;
  width: number;
  isBoat?: boolean;
  isMoto?: boolean;
}

export interface LeonidaCastMember {
  id: string;
  name: string;
  roleRo: string;
  roleEn: string;
  perkRo: string;
  perkEn: string;
  homeDistrict: LeonidaDistrictId;
  bioRo: string;
  bioEn: string;
  playable?: boolean;
}

export interface LeonidaTechBridge {
  id: string;
  techTopicRo: string;
  techTopicEn: string;
  gta6FeatureRo: string;
  gta6FeatureEn: string;
  curriculumLinkRo: string;
  curriculumLinkEn: string;
  missionId: AllMissionId;
  glossarySlugRo: string;
  glossarySlugEn: string;
}

export interface LeonidaFaqItem {
  qRo: string;
  qEn: string;
  aRo: string;
  aEn: string;
}

export const GTA6_FACTS_2026 = {
  releaseDateIso: '2026-11-19',
  releaseDateRo: '19 Noiembrie 2026',
  releaseDateEn: 'November 19, 2026',
  trailer2DateRo: '6 Mai 2025',
  trailer2DateEn: 'May 6, 2025',
  platforms: 'PlayStation 5 & Xbox Series X|S',
  setting: 'State of Leonida (Vice City, Leonida Keys, Port Gellhorn, Grassrivers, Mount Kalaga, Ambrosia)',
};

export const LEONIDA_VEHICLES: LeonidaVehicleDef[] = [
  {
    id: 'banshee_cyber',
    nameRo: 'Banshee GT Neon',
    nameEn: 'Banshee GT Neon',
    categoryRo: 'Supercar Stradal',
    categoryEn: 'Street Supercar',
    maxSpeed: 540,
    accel: 460,
    turnRate: 3.2,
    armor: 100,
    canWater: false,
    offroadFactor: 0.62,
    bodyColor: '#ec4899',
    stripeColor: '#22d3ee',
    length: 48,
    width: 24,
  },
  {
    id: 'enforcer_vcpd',
    nameRo: 'VCPD Cyber Cruiser',
    nameEn: 'VCPD Cyber Cruiser',
    categoryRo: 'Interceptor Blindat',
    categoryEn: 'Armored Interceptor',
    maxSpeed: 495,
    accel: 420,
    turnRate: 2.85,
    armor: 155,
    canWater: false,
    offroadFactor: 0.72,
    bodyColor: '#0f172a',
    stripeColor: '#38bdf8',
    length: 50,
    width: 25,
  },
  {
    id: 'bronco_kalaga',
    nameRo: 'Kalaga 4x4 Trail',
    nameEn: 'Kalaga 4x4 Trail',
    categoryRo: 'Off-Road Montan',
    categoryEn: 'All-Terrain 4x4',
    maxSpeed: 445,
    accel: 390,
    turnRate: 2.95,
    armor: 140,
    canWater: false,
    offroadFactor: 0.98,
    bodyColor: '#d97706',
    stripeColor: '#fde047',
    length: 49,
    width: 26,
  },
  {
    id: 'airboat_swamp',
    nameRo: 'Grassrivers Hydro-Airboat',
    nameEn: 'Grassrivers Hydro-Airboat',
    categoryRo: 'Amfibie Canale & Apă',
    categoryEn: 'Swamp & Water Craft',
    maxSpeed: 470,
    accel: 410,
    turnRate: 3.35,
    armor: 115,
    canWater: true,
    offroadFactor: 0.9,
    bodyColor: '#10b981',
    stripeColor: '#fef08a',
    length: 50,
    width: 26,
    isBoat: true,
  },
  {
    id: 'courier_moto',
    nameRo: 'Leonida Cyber Moto',
    nameEn: 'Leonida Cyber Moto',
    categoryRo: 'Motocicletă Agilă',
    categoryEn: 'Agile Cyber Bike',
    maxSpeed: 525,
    accel: 540,
    turnRate: 4.1,
    armor: 75,
    canWater: false,
    offroadFactor: 0.78,
    bodyColor: '#8b5cf6',
    stripeColor: '#f472b6',
    length: 36,
    width: 15,
    isMoto: true,
  },
];

export const LEONIDA_REGIONS: LeonidaRegion[] = [
  {
    id: 'vice_city',
    nameRo: 'Vice City · Ocean Drive',
    nameEn: 'Vice City · Ocean Drive',
    subtitleRo: 'Metropola Neon & Turnurile Fibra Optică',
    subtitleEn: 'Neon Metropolis & Fiber Optic Towers',
    mapPctX: 62,
    mapPctY: 46,
    worldX: 1680,
    worldY: 820,
    themeColor: 'fuchsia',
    accentHex: '#ec4899',
    curriculumTopicRo: 'Cod Binar (8-4-2-1) & Arhitectura CPU/RAM',
    curriculumTopicEn: 'Binary (8-4-2-1) & CPU/RAM Architecture',
    relatedModuleId: 'hardware',
    descriptionRo:
      'Inima strălucitoare a statului Leonida, inspirată din Miami: hoteluri Art Deco pastelate, bulevarde cu palmieri și noduri de date de mare viteză pe Ocean Beach.',
    descriptionEn:
      'The glowing coastal heart of Leonida inspired by Miami: pastel Art Deco hotels, palm-lined Ocean Drive, and ultra-fast optical data relays.',
    loreFactRo:
      'Vice City revine în GTA 6 la scară modernă 2026 cu trafic dens, iluminare globală ray-traced și interioare explorabile.',
    loreFactEn:
      'Vice City returns in GTA 6 at massive 2026 scale featuring dense street traffic, ray-traced lighting, and seamless enterable interiors.',
    recommendedVehicleId: 'banshee_cyber',
  },
  {
    id: 'leonida_keys',
    nameRo: 'Leonida Keys · Coral Bridge',
    nameEn: 'Leonida Keys · Coral Bridge',
    subtitleRo: 'Arhipelagul Tropical & Cablul Submarin',
    subtitleEn: 'Tropical Island Chain & Subsea Fiber Cable',
    mapPctX: 25,
    mapPctY: 88,
    worldX: 520,
    worldY: 1480,
    themeColor: 'cyan',
    accentHex: '#22d3ee',
    curriculumTopicRo: 'Securitate HTTPS, Phishing & Autentificare 2FA',
    curriculumTopicEn: 'HTTPS Security, Phishing & 2FA Defense',
    relatedModuleId: 'g6_malware',
    descriptionRo:
      'Lanț de insule tropicale legate prin poduri lungi peste ape turcoaz, inspirat din Florida Keys, unde locuiesc pescari și curieri de date.',
    descriptionEn:
      'A scenic chain of tropical islands linked by sweeping ocean bridges (inspired by the Florida Keys), home to boat docks and subsea data relays.',
    loreFactRo:
      'Jason Duval a activat în Leonida Keys după serviciul militar, lucrând pe docuri înainte de a face echipă cu Lucia.',
    loreFactEn:
      'Jason Duval worked around the Leonida Keys after his Army stint before crossing paths with Lucia Caminos.',
    recommendedVehicleId: 'courier_moto',
  },
  {
    id: 'port_gellhorn',
    nameRo: 'Port Gellhorn · Terminale Cargo',
    nameEn: 'Port Gellhorn · Cargo Docks',
    subtitleRo: 'Portul Industrial & Macarale Automate',
    subtitleEn: 'Industrial Harbor & Automated Cranes',
    mapPctX: 58,
    mapPctY: 73,
    worldX: 1520,
    worldY: 1380,
    themeColor: 'amber',
    accentHex: '#f59e0b',
    curriculumTopicRo: 'Programare C++: Structura if/else & Modulo %',
    curriculumTopicEn: 'C++ Programming: if/else & Modulo %',
    relatedModuleId: 'g7_decision_a',
    descriptionRo:
      'Oraș portuar industrial de pe coasta de vest, plin de containere maritime, macarale automatizate și camere de supraveghere VCPD.',
    descriptionEn:
      'A gritty working-class coastal port packed with shipping containers, automated dock cranes, and dense police patrols.',
    loreFactRo:
      'Port Gellhorn este confirmat încă din primele dezvăluiri GTA 6 ca zonă cheie pentru transporturile comerciale din Leonida.',
    loreFactEn:
      'Port Gellhorn has been confirmed as a core gritty coastal hub for freight operations and law enforcement chases in Leonida.',
    recommendedVehicleId: 'enforcer_vcpd',
  },
  {
    id: 'grassrivers',
    nameRo: 'Grassrivers · Mlaștinile Digitale',
    nameEn: 'Grassrivers · Digital Wetlands',
    subtitleRo: 'Canale Everglades & Pilotaj Hydro-Airboat',
    subtitleEn: 'Everglades Waterways & Airboat Navigation',
    mapPctX: 34,
    mapPctY: 46,
    worldX: 660,
    worldY: 880,
    themeColor: 'emerald',
    accentHex: '#10b981',
    curriculumTopicRo: 'Coordonate X/Y & Bucle Repetitive while',
    curriculumTopicEn: 'X/Y Coordinates & while Loops',
    relatedModuleId: 'g7_loop_b',
    descriptionRo:
      'Întindere vastă de mlaștini și canale inspirată din Everglades, navigabilă optim cu Hydro-Airboat-ul printre relee ascunse.',
    descriptionEn:
      'Vast untamed wetland waterways inspired by the Florida Everglades, best navigated by Hydro-Airboat between hidden telemetry relays.',
    loreFactRo:
      'Trailerul oficial prezintă curse rapide cu airboat-uri prin mlaștinile Grassrivers, populat cu faună sălbatică și rute secrete.',
    loreFactEn:
      'Official GTA 6 showcases highlighted high-speed airboat navigation slicing across the wild Grassrivers wetlands.',
    recommendedVehicleId: 'airboat_swamp',
  },
  {
    id: 'mount_kalaga',
    nameRo: 'Mount Kalaga · Observatorul Național',
    nameEn: 'Mount Kalaga · National Park',
    subtitleRo: 'Păduri Montane & Rețea Senzori Arduino',
    subtitleEn: 'Pine Highlands & Arduino Sensor Grid',
    mapPctX: 66,
    mapPctY: 16,
    worldX: 1960,
    worldY: 320,
    themeColor: 'teal',
    accentHex: '#14b8a6',
    curriculumTopicRo: 'Robotică Arduino Uno, HC-SR04 & millis()',
    curriculumTopicEn: 'Arduino Uno Robotics, HC-SR04 & millis()',
    relatedModuleId: 'g8_robot_b',
    descriptionRo:
      'Parcul național din nordul statului Leonida, cu trasee montane 4x4, păduri de pini și o antenă meteo-observator controlată prin microcontrollere.',
    descriptionEn:
      'Northern Leonida highland wilderness featuring winding off-road pine trails and an automated atmospheric sensor observatory.',
    loreFactRo:
      'Mount Kalaga extinde harta dincolo de coastă cu păduri dense, trasee off-road și puncte panoramice spre ocean.',
    loreFactEn:
      'Mount Kalaga expands Leonida northwards into dense pine forests, mountain trails, and elevated lookout stations.',
    recommendedVehicleId: 'bronco_kalaga',
  },
  {
    id: 'ambrosia',
    nameRo: 'Ambrosia · Rafinăria & Seiful Central',
    nameEn: 'Ambrosia · Industrial Crossroads',
    subtitleRo: 'Zona Industrială & Marele Finale 5★',
    subtitleEn: 'Industrial Town & Grand 5★ Finale',
    mapPctX: 46,
    mapPctY: 26,
    worldX: 1120,
    worldY: 340,
    themeColor: 'orange',
    accentHex: '#fb923c',
    curriculumTopicRo: 'Excel ($A$1, COUNTIF) & Vectori C++ Admitere',
    curriculumTopicEn: 'Excel ($A$1, COUNTIF) & C++ Arrays',
    relatedModuleId: 'g8_algo_d',
    descriptionRo:
      'Oraș industrial din centrul statului cu rafinării și autostrăzi drepte, găzduind serverul central și testul suprem de algoritmică.',
    descriptionEn:
      'Central Leonida industrial crossroads around sugar mills and long freight highways, housing the final encrypted Data Vault.',
    loreFactRo:
      'Ambrosia face legătura între zonele rurale ale statului și autostrada principală spre Vice City.',
    loreFactEn:
      'Ambrosia bridges central Leonida industrial routes with the main expressways back toward Vice City.',
    recommendedVehicleId: 'banshee_cyber',
  },
];

export const LEONIDA_CAST: LeonidaCastMember[] = [
  {
    id: 'lucia',
    name: 'Lucia Caminos',
    roleRo: 'Protagonistă · Specialistă Decriptare & Binar',
    roleEn: 'Protagonist · Decryption & Binary Specialist',
    perkRo: '+30% ByteCoins & Cash · +2s la terminalele de hack',
    perkEn: '+30% ByteCoins & Cash · +2s Breach Timer',
    homeDistrict: 'vice_city',
    bioRo:
      'Originară cu rădăcini în Liberty City și eliberată din penitenciarul Leonida, Lucia îmbină determinarea cu stăpânirea algoritmilor de criptare și viteza pe șoselele din Vice City.',
    bioEn:
      'Trained to fight smart from a young age, Lucia pairs relentless grit with sharp analytical focus across Vice City’s high-speed data corridors.',
    playable: true,
  },
  {
    id: 'jason',
    name: 'Jason Duval',
    roleRo: 'Protagonist · Pilot Tactic & Rețele Securizate',
    roleEn: 'Protagonist · Tactical Driver & Network Defense',
    perkRo: '+30 Armură Vehicul · Rază Radar +35%',
    perkEn: '+30 Vehicle Armor · +35% Radar Scan Range',
    homeDistrict: 'leonida_keys',
    bioRo:
      'Fost militar staționat în Leonida Keys, Jason stăpânește conducerea defensivă, navigația prin Grassrivers și protejarea rețelelor împotriva interceptorilor VCPD.',
    bioEn:
      'An ex-Army operator working out of the Leonida Keys, Jason brings precision driving, swamp airboat handling, and kinetic shield resilience.',
    playable: true,
  },
  {
    id: 'cal_hampton',
    name: 'Cal Hampton',
    roleRo: 'Contact Tech · Analist Radio & Securitate Web',
    roleEn: 'Tech Contact · Radio & Web Security Analyst',
    perkRo: 'Scanează pachetele HTTPS vs HTTP pe Leonida Keys',
    perkEn: 'Intercepts HTTPS vs HTTP packets in Leonida Keys',
    homeDistrict: 'leonida_keys',
    bioRo:
      'Prietenul atent la frecvențele radio ale Pazei de Coastă din Keys; în ArkyEdu coordonează misiunile de detectare phishing și configurare 2FA.',
    bioEn:
      'Closely tunes into Coast Guard comms across the Keys; in ArkyEdu he anchors phishing defense and TLS encryption missions.',
  },
  {
    id: 'raul_bautista',
    name: 'Raul Bautista',
    roleRo: 'Contact Logistic · Rutare Cargo & C++',
    roleEn: 'Logistics Contact · Cargo Routing & C++',
    perkRo: 'Oferă indicii la structurile if/else din Port Gellhorn',
    perkEn: 'Supplies C++ if/else logic clues at Port Gellhorn',
    homeDistrict: 'port_gellhorn',
    bioRo:
      'Veteran experimentat al operațiunilor din Leonida; în laboratorul Port Gellhorn coordonează algoritmii de sortare și condițiile C++.',
    bioEn:
      'A seasoned planner across Leonida’s freight routes; in Port Gellhorn he oversees container routing logic and C++ decision trees.',
  },
  {
    id: 'drequan_priest',
    name: "Dre'Quan Priest",
    roleRo: 'Producător Audio · Studio & Multimedia',
    roleEn: 'Audio Producer · Studio & Multimedia',
    perkRo: 'Alimentează stația radio Synthwave din Vice City',
    perkEn: 'Powers the in-game Vice City Synthwave radio',
    homeDistrict: 'vice_city',
    bioRo:
      'Fondator al studioului Only Raw Records din Vice City; conectează lumea muzicală a orașului cu lecțiile de acustică digitală și montaj audio.',
    bioEn:
      'Driving Vice City’s Only Raw Records sound, linking the city’s vibrant audio culture with digital acoustics and multitrack editing.',
  },
  {
    id: 'boobie_ike',
    name: 'Boobie Ike',
    roleRo: 'Antreprenor Local · Infrastructură Cloud & Excel',
    roleEn: 'Local Mogul · Cloud Infrastructure & Excel',
    perkRo: 'Coordonează auditul de date din Ambrosia',
    perkEn: 'Overwatches spreadsheet audits in Ambrosia',
    homeDistrict: 'ambrosia',
    bioRo:
      'Antreprenor influent în imobiliare și studio-uri din Vice City și Ambrosia; misiunile sale pun accent pe bugete, Excel COUNTIF și referințe absolute.',
    bioEn:
      'A major Vice City real-estate and studio builder whose tech missions test spreadsheet budgeting, COUNTIF, and absolute references.',
  },
];

export const LEONIDA_STORY_CHALLENGES: LeonidaChallenge[] = [
  {
    id: 'm_vice_city',
    districtId: 'vice_city',
    curriculumTagRo: 'Clasa V · Hardware & Cod Binar 4-Bit',
    curriculumTagEn: 'Grade 5 · Hardware & 4-Bit Binary',
    relatedMissionId: 'hardware',
    relatedBlogSlugRo: 'alegere-laptop-pc-scoala-gimnaziu-ram-ssd-cpu-componente',
    relatedBlogSlugEn: 'choosing-student-laptop-pc-middle-school-cpu-ram-ssd-guide',
    titleRo: 'Operațiunea Ocean Drive: Deblocare Binară 8-4-2-1',
    titleEn: 'Ocean Drive Op: 8-4-2-1 Binary Vault Lock',
    briefingRo:
      'Turnul de fibră de pe Ocean Beach cere codul binar pe 4 biți (ponderi 8 · 4 · 2 · 1) egal cu numărul zecimal 13 pentru a deschide nodul Vice City.',
    briefingEn:
      'The Ocean Beach fiber relay requires the exact 4-bit binary key (weights 8 · 4 · 2 · 1) equal to decimal 13 to unlock Vice City.',
    kind: 'binary4',
    targetAnswer: 13,
    hintRo: 'Descompune 13 ca sumă de puteri ale lui 2: 8 + 4 + 0 + 1 = 1101.',
    hintEn: 'Break 13 into powers of 2: 8 + 4 + 0 + 1 = 1101.',
    rewardCash: 450,
    rewardXP: 240,
    rewardCoins: 40,
  },
  {
    id: 'm_leonida_keys',
    districtId: 'leonida_keys',
    curriculumTagRo: 'Clasa VI · Securitate Cibernetică & 2FA',
    curriculumTagEn: 'Grade 6 · Cybersecurity & 2FA',
    relatedMissionId: 'g6_malware',
    relatedBlogSlugRo: 'siguranta-copii-tiktok-roblox-discord-phishing-2fa',
    relatedBlogSlugEn: 'kids-online-safety-tiktok-roblox-discord-phishing',
    titleRo: 'Interceptare Coral Bridge: Scutul HTTPS & Phishing',
    titleEn: 'Coral Bridge Intercept: HTTPS & Anti-Phishing',
    briefingRo:
      'Cal Hampton a interceptat 4 link-uri de autentificare pe cablul submarin din Keys. Care este SINGURUL link autentic și criptat HTTPS?',
    briefingEn:
      'Cal Hampton intercepted 4 login links on the Keys subsea cable. Pick the ONLY authentic encrypted HTTPS endpoint.',
    kind: 'mcq',
    targetAnswer: 2,
    optionsRo: [
      'http://leonida-bank-login-free.xyz/verify',
      'https://vcpd-prem1um-bonus.com/password',
      'https://portal.arkyedu.com/cont-2fa',
      'http://192.168.0.1/steal-token.exe',
    ],
    optionsEn: [
      'http://leonida-bank-login-free.xyz/verify',
      'https://vcpd-prem1um-bonus.com/password',
      'https://portal.arkyedu.com/cont-2fa',
      'http://192.168.0.1/steal-token.exe',
    ],
    hintRo: 'Verifică protocolul securizat https:// și domeniul oficial fără cifre substituite sau .exe.',
    hintEn: 'Look for https:// plus a clean official domain with no typosquatting or .exe payload.',
    rewardCash: 550,
    rewardXP: 280,
    rewardCoins: 45,
  },
  {
    id: 'm_port_gellhorn',
    districtId: 'port_gellhorn',
    curriculumTagRo: 'Clasa VII · C++ if/else & Operator Modulo %',
    curriculumTagEn: 'Grade 7 · C++ if/else & Modulo %',
    relatedMissionId: 'g7_decision_a',
    relatedBlogSlugRo: 'erori-cpp-gimnaziu-if-while-algoritmi-cifre',
    relatedBlogSlugEn: 'middle-school-cpp-common-errors-if-while-digits',
    titleRo: 'Cod Cargo Port Gellhorn: Ce afișează programul C++?',
    titleEn: 'Port Gellhorn Cargo Code: Trace the C++ Output',
    briefingRo:
      'Macaraua automată din Port Gellhorn rulează secvența de mai jos pentru containerul cod=27. Scrie exact valoarea afișată de cout:',
    briefingEn:
      'The Port Gellhorn automated crane runs the C++ snippet below for container cod=27. Type the exact number printed by cout:',
    kind: 'short-code',
    targetAnswer: '14',
    acceptedAliases: ['14'],
    codeSnippet: `int cod = 27;\nif (cod % 3 == 0 && cod % 2 != 0) {\n    cout << cod / 2 + 1;\n} else {\n    cout << cod % 10;\n}`,
    hintRo: '27 % 3 == 0 (adevărat) și 27 % 2 != 0 (adevărat). Împărțirea întreagă 27 / 2 = 13, apoi + 1 = 14.',
    hintEn: '27 % 3 == 0 (true) and 27 % 2 != 0 (true). Integer division 27 / 2 = 13, plus 1 = 14.',
    rewardCash: 650,
    rewardXP: 320,
    rewardCoins: 50,
  },
  {
    id: 'm_grassrivers',
    districtId: 'grassrivers',
    curriculumTagRo: 'Clasa VII · Algoritmi C++ pe Cifre (while)',
    curriculumTagEn: 'Grade 7 · C++ while Loop Digit Extraction',
    relatedMissionId: 'g7_loop_b',
    relatedBlogSlugRo: 'erori-cpp-gimnaziu-if-while-algoritmi-cifre',
    relatedBlogSlugEn: 'middle-school-cpp-common-errors-if-while-digits',
    titleRo: 'Releul Grassrivers: Suma Cifrelor cu Bucla while',
    titleEn: 'Grassrivers Swamp Relay: while Loop Digit Sum',
    briefingRo:
      'Baliza din mlaștină decodează ID-ul 4092 folosind bucla while clasică din Clasa a VII-a. Care este valoarea finală afișată pentru s?',
    briefingEn:
      'The swamp beacon decodes ID 4092 with a standard Grade 7 while loop. What final value of s does it output?',
    kind: 'short-code',
    targetAnswer: '15',
    acceptedAliases: ['15'],
    codeSnippet: `int n = 4092, s = 0;\nwhile (n > 0) {\n    s += n % 10;\n    n /= 10;\n}\ncout << s;`,
    hintRo: 'Bucla adună fiecare cifră a lui 4092 de la dreapta la stânga: 2 + 9 + 0 + 4 = 15.',
    hintEn: 'The loop extracts and sums every digit of 4092 from right to left: 2 + 9 + 0 + 4 = 15.',
    rewardCash: 750,
    rewardXP: 360,
    rewardCoins: 55,
  },
  {
    id: 'm_mount_kalaga',
    districtId: 'mount_kalaga',
    curriculumTagRo: 'Clasa VIII · Arduino Uno, HC-SR04 & millis()',
    curriculumTagEn: 'Grade 8 · Arduino Uno, HC-SR04 & millis()',
    relatedMissionId: 'g8_robot_b',
    relatedBlogSlugRo: 'proiect-arduino-smart-home-gimnaziu-senzori-millis',
    relatedBlogSlugEn: 'arduino-smart-home-school-project-sensors-millis',
    titleRo: 'Observatorul Mount Kalaga: Multitasking fără delay()',
    titleEn: 'Mount Kalaga Observatory: Non-Blocking millis()',
    briefingRo:
      'Radarul din Mount Kalaga trebuie să citească senzorul ultrasonic HC-SR04 și să trimită date radio SIMULTAN, fără blocarea microcontrollerului Arduino Uno. Ce funcție folosești?',
    briefingEn:
      'The Mount Kalaga radar must poll the HC-SR04 ultrasonic sensor and transmit telemetry simultaneously without freezing the Arduino Uno. Which timing function should you use?',
    kind: 'mcq',
    targetAnswer: 1,
    optionsRo: [
      'delay(5000); — oprește procesorul 5 secunde',
      'millis() — verifică timpul scurs fără să blocheze execuția',
      'analogWrite(A0, 1024); — suprasolicită pinul analogic',
      'while(true) {} — buclă infinită goală',
    ],
    optionsEn: [
      'delay(5000); — halts the CPU for 5 seconds',
      'millis() — checks elapsed milliseconds without blocking other tasks',
      'analogWrite(A0, 1024); — overflows analog pin range',
      'while(true) {} — empty infinite freeze loop',
    ],
    hintRo: 'delay() îngheață întregul program Arduino; millis() permite rularea paralelă a mai multor senzori.',
    hintEn: 'delay() freezes the entire sketch; millis() enables non-blocking multitasking.',
    rewardCash: 850,
    rewardXP: 400,
    rewardCoins: 60,
  },
  {
    id: 'm_ambrosia',
    districtId: 'ambrosia',
    curriculumTagRo: 'Clasa VIII · Excel ($A$1, IF/COUNTIF) & Vectori',
    curriculumTagEn: 'Grade 8 · Excel ($A$1, IF/COUNTIF) & Arrays',
    relatedMissionId: 'g8_calc_c',
    relatedBlogSlugRo: 'formule-excel-gimnaziu-sum-average-if-countif-erori',
    relatedBlogSlugEn: 'excel-formulas-middle-school-sum-if-countif-errors',
    titleRo: 'Marele Seif din Ambrosia: Referință Absolută & Vectori',
    titleEn: 'Ambrosia Central Vault: Absolute Ref & Arrays',
    briefingRo:
      'Pentru a bloca cursul de schimb din celula B1 astfel încât să nu se modifice la copierea formulei pe 100 de rânduri în Excel, cum scrii referința absolută?',
    briefingEn:
      'To lock the tax multiplier cell B1 so it never shifts when auto-filling 100 Excel rows, how must you write the absolute reference?',
    kind: 'short-code',
    targetAnswer: '$B$1',
    acceptedAliases: ['$b$1', '$B$1', '=$B$1', '=$b$1'],
    hintRo: 'Semnul $ înaintea coloanei și înaintea rândului blochează celula: $B$1 (tasta F4).',
    hintEn: 'Adding $ before both column and row locks the coordinate: $B$1 (shortcut F4).',
    rewardCash: 1200,
    rewardXP: 500,
    rewardCoins: 80,
  },
];

export const LEONIDA_SIDE_CONTRACTS: Array<{
  id: string;
  promptRo: string;
  promptEn: string;
  optionsRo: string[];
  optionsEn: string[];
  correctIdx: number;
  rewardCash: number;
}> = [
  {
    id: 'sc1',
    promptRo: 'Curier Rapid: Ce port folosește protocolul securizat HTTPS pentru traficul criptat?',
    promptEn: 'Fast Courier: Which network port handles encrypted HTTPS web traffic?',
    optionsRo: ['Port 21 (FTP)', 'Port 443 (HTTPS)', 'Port 80 (HTTP)', 'Port 25 (SMTP)'],
    optionsEn: ['Port 21 (FTP)', 'Port 443 (HTTPS)', 'Port 80 (HTTP)', 'Port 25 (SMTP)'],
    correctIdx: 1,
    rewardCash: 220,
  },
  {
    id: 'sc2',
    promptRo: 'Hardware Drop: Care componentă își pierde complet datele când PC-ul rămâne fără curent?',
    promptEn: 'Hardware Drop: Which memory component loses all stored data on power loss?',
    optionsRo: ['SSD NVMe', 'Memoria RAM', 'Memoria ROM / BIOS', 'HDD Magnetic'],
    optionsEn: ['NVMe SSD', 'RAM Memory', 'ROM / BIOS', 'Magnetic HDD'],
    correctIdx: 1,
    rewardCash: 220,
  },
  {
    id: 'sc3',
    promptRo: 'C++ Sprint: Care este rezultatul expresiei 17 % 5 în C++?',
    promptEn: 'C++ Sprint: What is the result of 17 % 5 in C++?',
    optionsRo: ['3', '2', '3.4', '5'],
    optionsEn: ['3', '2', '3.4', '5'],
    correctIdx: 1,
    rewardCash: 250,
  },
  {
    id: 'sc4',
    promptRo: 'Scratch Coordonate: Ce limită maximă pe axa X (dreapta) are scena standard Scratch 3.0?',
    promptEn: 'Scratch Coords: What is the maximum X coordinate (right edge) of the Scratch 3.0 stage?',
    optionsRo: ['100', '180', '240', '480'],
    optionsEn: ['100', '180', '240', '480'],
    correctIdx: 2,
    rewardCash: 220,
  },
  {
    id: 'sc5',
    promptRo: 'HTML5 Check: Ce etichetă HTML5 definește bara principală de navigare a unui site?',
    promptEn: 'HTML5 Check: Which semantic HTML5 element represents the main navigation bar?',
    optionsRo: ['<menu-bar>', '<nav>', '<links>', '<footer-nav>'],
    optionsEn: ['<menu-bar>', '<nav>', '<links>', '<footer-nav>'],
    correctIdx: 1,
    rewardCash: 240,
  },
  {
    id: 'sc6',
    promptRo: 'Excel Rescue: Ce funcție numără câte celule din A1:A20 sunt mai mari decât 9?',
    promptEn: 'Excel Rescue: Which formula counts cells in A1:A20 greater than 9?',
    optionsRo: ['=SUMIF(A1:A20, ">9")', '=COUNTIF(A1:A20, ">9")', '=AVERAGE(A1:A20)', '=MAXIF(A1:A20, 9)'],
    optionsEn: ['=SUMIF(A1:A20, ">9")', '=COUNTIF(A1:A20, ">9")', '=AVERAGE(A1:A20)', '=MAXIF(A1:A20, 9)'],
    correctIdx: 1,
    rewardCash: 260,
  },
];

export const LEONIDA_TECH_BRIDGES: LeonidaTechBridge[] = [
  {
    id: 'tb_nvme',
    techTopicRo: 'Streaming Asset-uri & SSD NVMe',
    techTopicEn: 'Open-World Asset Streaming & NVMe SSD',
    gta6FeatureRo:
      'Harta uriașă din Leonida încarcă instantaneu clădirile din Vice City și vegetația din Grassrivers fără ecrane de încărcare datorită vitezelor de citire de peste 5.000 MB/s.',
    gta6FeatureEn:
      'Leonida streams downtown skyscrapers and dense Grassrivers wetlands seamlessly with zero loading screens via high-throughput 5,000+ MB/s NVMe storage.',
    curriculumLinkRo: 'Clasa a V-a · Hardware: SSD vs HDD, RAM & Bus de Date',
    curriculumLinkEn: 'Grade 5 · Hardware: SSD vs HDD, RAM & Data Bus',
    missionId: 'hardware',
    glossarySlugRo: 'ssd-vs-hdd',
    glossarySlugEn: 'ssd-vs-hdd',
  },
  {
    id: 'tb_rgb',
    techTopicRo: 'Grafică 3D, Pixeli RGB & Iluminare Neon',
    techTopicEn: '3D Rendering, RGB Pixels & Neon Lighting',
    gta6FeatureRo:
      'Reflexiile apusului pe asfaltul umed din Ocean Drive combină canale RGB (0–255) și calcul vectorial în timp real pe placa video (GPU).',
    gta6FeatureEn:
      'Sunset reflections along Vice Beach asphalt combine 0–255 additive RGB channels with real-time GPU shader math.',
    curriculumLinkRo: 'Clasa a VI-a · Paint 3D, Pixeli, Rezoluție & RGB',
    curriculumLinkEn: 'Grade 6 · Paint 3D, Pixels, Resolution & RGB',
    missionId: 'g6_paint3d',
    glossarySlugRo: 'pixeli-rezolutie-rgb',
    glossarySlugEn: 'pixels-resolution-rgb',
  },
  {
    id: 'tb_ai_npc',
    techTopicRo: 'Algoritmi Pathfinding & Decizii if/else pentru Trafic',
    techTopicEn: 'AI Pathfinding & C++ Decision Loops for Traffic',
    gta6FeatureRo:
      'Fiecare mașină VCPD și ambarcațiune din Leonida evaluează distanța, semafoarele și poziția jucătorului în bucle rapide cu condiții logice (&&, ||).',
    gta6FeatureEn:
      'Every VCPD cruiser and highway vehicle evaluates distance, intersections, and player vectors inside high-frequency conditional loops.',
    curriculumLinkRo: 'Clasa a VII-a · C++ Decizii if/else & Bucle while',
    curriculumLinkEn: 'Grade 7 · C++ if/else Decisions & while Loops',
    missionId: 'g7_decision_a',
    glossarySlugRo: 'structura-if-else-switch',
    glossarySlugEn: 'if-else-switch-statements',
  },
  {
    id: 'tb_multiplayer',
    techTopicRo: 'Sincronizare Rețea, DNS & Securitate Cont',
    techTopicEn: 'Multiplayer Netcode, HTTPS/TLS & 2FA Account Safety',
    gta6FeatureRo:
      'Sesiunile online și duelurile 1v1 sincronizează pozițiile la fiecare cadru prin conexiuni securizate și protejează profilurile cu 2FA anti-phishing.',
    gta6FeatureEn:
      'Live multiplayer lobbies synchronize telemetry packets over encrypted channels while protecting player accounts with 2FA against phishing.',
    curriculumLinkRo: 'Clasa a VI-a & VIII · HTTPS, Rețele & Siguranță 2FA',
    curriculumLinkEn: 'Grades 6 & 8 · HTTPS, Networks & 2FA Safety',
    missionId: 'g8_web_a',
    glossarySlugRo: 'http-vs-https-ssl',
    glossarySlugEn: 'http-vs-https-ssl',
  },
];

export const LEONIDA_FAQS: LeonidaFaqItem[] = [
  {
    qRo: 'Ce este Vice Leonida Open World pe ArkyEdu și cum are legătură cu GTA 6 (2026)?',
    qEn: 'What is Vice Leonida Open World on ArkyEdu and how does it connect to GTA 6 (2026)?',
    aRo: 'Lansat chiar după debutul oficial Grand Theft Auto VI (19 noiembrie 2026), Vice Leonida Open World este un joc educațional 2D gratuit în browser, inspirat din harta oficială a statului Leonida (Vice City, Leonida Keys, Port Gellhorn, Grassrivers, Mount Kalaga, Ambrosia) și protagoniștii Lucia Caminos & Jason Duval — transformând explorarea, condusul auto/airboat și urmăririle VCPD în misiuni reale de Informatică și TIC pentru clasele V–VIII.',
    aEn: 'Launched right alongside Grand Theft Auto VI (November 19, 2026), Vice Leonida Open World is a 100% free 2D browser educational sandbox inspired by the State of Leonida (Vice City, Leonida Keys, Port Gellhorn, Grassrivers, Mount Kalaga, Ambrosia) and dual protagonists Lucia Caminos & Jason Duval — turning driving, airboating, and police chases into hands-on Coding & ICT missions.',
  },
  {
    qRo: 'Cum intru și ies din mașini sau din Airboat în Vice Leonida Open World?',
    qEn: 'How do you enter/exit cars or the Grassrivers Airboat in Vice Leonida Open World?',
    aRo: 'Apropie-te pe jos de orice vehicul parcat sau din trafic și apasă tasta E (sau F / butonul „Intră/Ieși Vehicul” pe telefon). În mlaștinile Grassrivers și spre Leonida Keys poți pilota amfibia Hydro-Airboat direct pe apă!',
    aEn: 'Walk close to any parked or street vehicle and press E (or F / the touch Enter/Exit button on mobile). Near Grassrivers wetlands and Leonida Keys canals, hop into the Hydro-Airboat to cruise directly across water!',
  },
  {
    qRo: 'Este sigur pentru copii de 10–15 ani și funcționează fără instalare?',
    qEn: 'Is it safe for ages 10–15 and playable with zero downloads?',
    aRo: 'Da, este 100% sigur, fără violență sau arme reale (folosește scannere cyber, impulsuri EMP și provocări binare/C++/Excel/Arduino), complet gratuit (0 lei, fără reclame) și rulează la 60 FPS în orice browser pe PC, laptop de școală, tabletă sau telefon.',
    aEn: 'Yes! It contains zero real weapons or violence — replacing them with cyber EMP pulses and CS/ICT puzzles — runs at 60 FPS in any browser with zero installation, and is 100% free with no ads.',
  },
  {
    qRo: 'Care sunt toate cele 3 moduri GTA 6 Vice Leonida disponibile pe ArkyEdu?',
    qEn: 'What are all 3 Vice Leonida GTA 6 modes available on ArkyEdu?',
    aRo: '1) Vice Leonida: Open World Story (/leonida/) — hartă liberă 2600×1800 cu 6 regiuni, 5 vehicule pilotabile, minimap GPS și 6 misiuni TIC; 2) Vice Leonida VI: Cyber Runner (/arcade/vice-leonida-gta6/) — arcade rapid pe 4 benzi cu hack-uri binare; 3) Vice Leonida 1v1 (/duel/vice-leonida-1v1/) — cursă multiplayer PvP cu sabotaje live sau contra AI Cyber-Bot.',
    aEn: '1) Vice Leonida: Open World Story (/leonida/) — free-roam 2600×1800 map with 6 regions, 5 drivable vehicles, GPS minimap & 6 CS missions; 2) Vice Leonida VI: Cyber Runner (/arcade/vice-leonida-gta6/) — high-speed 4-lane binary arcade; 3) Vice Leonida 1v1 (/duel/vice-leonida-1v1/) — real-time PvP cyber-heist race or AI Cyber-Bot practice.',
  },
  {
    qRo: 'Cum primesc puncte XP și ByteCoins pentru Carnetul Digital?',
    qEn: 'How do missions award XP and ByteCoins to my Digital Portfolio?',
    aRo: 'Fiecare misiune de district finalizată în Vice Leonida Open World și scorul total de explorare/contracte salvează recordul în Carnetul Digital (până la 3.500 XP Arcade) și adaugă ByteCoins reali pentru upgrade-urile din Magazinul Cyber.',
    aEn: 'Every completed district heist and street contract saves your score into Arcade Highscores (up to 3,500 XP) and awards real ByteCoins directly into your ArkyEdu student inventory.',
  },
];
