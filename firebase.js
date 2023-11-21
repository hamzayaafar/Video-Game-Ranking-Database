import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js'
import { getDatabase, ref, set, onValue, push } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js'
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: '******************',
  authDomain: '******************',
  databaseURL: '******************',
  projectId: '******************',
  storageBucket: '******************',
  messagingSenderId: '******************',
  appId: '*************',
  measurementId: '******************'
}

const app = initializeApp(firebaseConfig)
export const db = getDatabase(app)
export { ref, set, onValue, push }
