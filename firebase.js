import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js'
import { getDatabase, ref, set, onValue, push } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js'
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDoStxdho48gIIs4TySsiE-To-VQ02M9tM',
  authDomain: 'hw10-2b8bc.firebaseapp.com',
  databaseURL: 'https://hw10-2b8bc-default-rtdb.firebaseio.com',
  projectId: 'hw10-2b8bc',
  storageBucket: 'hw10-2b8bc.appspot.com',
  messagingSenderId: '659036315729',
  appId: '1:659036315729:web:ab5c221c07d31bdf379870',
  measurementId: 'G-T8QXSHGPFG'
}

const app = initializeApp(firebaseConfig)
export const db = getDatabase(app)
export { ref, set, onValue, push }
