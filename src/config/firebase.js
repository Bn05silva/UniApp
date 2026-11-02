import {
  getApp,
  getApps,
  initializeApp,
} from 'firebase/app';

import {
  getFirestore,
} from 'firebase/firestore';


const firebaseConfig = {
  apiKey:
    'AIzaSyC0AYoctyI_TilzduVoGIYsV8y8cebfU0M',

  authDomain:
    'uniclass-a477d.firebaseapp.com',

  projectId:
    'uniclass-a477d',

  storageBucket:
    'uniclass-a477d.firebasestorage.app',

  messagingSenderId:
    '642780248669',

  appId:
    '1:642780248669:web:0eaaae24c4e3c0d9382bb4',
};


const app =
  getApps().length === 0
    ? initializeApp(
        firebaseConfig
      )
    : getApp();


const db =
  getFirestore(
    app
  );


export {
  app,
  db,
};