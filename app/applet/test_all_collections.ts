import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const apiKey = process.env.GEMINI_API_KEY || '';
const config = {
  apiKey: apiKey,
  authDomain: 'gen-lang-client-0536340872.firebaseapp.com',
  projectId: 'gen-lang-client-0536340872',
  storageBucket: 'gen-lang-client-0536340872.firebasestorage.app',
  messagingSenderId: '725961108693',
  appId: '1:725961108693:web:ce12de9cf5b9f5bc56c65c'
};

async function main() {
  const app = initializeApp(config);
  const databaseId = 'ai-studio-arkedomisiuneaar-ce692367-2486-49b7-ab22-8cacadce76ac';
  const db = getFirestore(app, databaseId);

  const collectionsToCheck = ['rezultate_tic', 'elevi', 'recorduri_jocuri', 'duel_rooms', 'setari_jocuri', 'solicitari_jocuri'];

  for (const colName of collectionsToCheck) {
    try {
      const snap = await getDocs(collection(db, colName));
      console.log(`\n=== Collection [${colName}]: ${snap.size} documents ===`);
      snap.docs.forEach(d => {
        console.log(`Doc ID: ${d.id}`, JSON.stringify(d.data()).substring(0, 150));
      });
    } catch (e: any) {
      console.log(`Collection [${colName}]: Error: ${e.message}`);
    }
  }
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
