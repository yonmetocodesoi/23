import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCb1lVCXQrafwmmDDnVwqY7QdUOwiXWT8o",
  authDomain: "myspyplatform.firebaseapp.com",
  databaseURL: "https://myspyplatform-default-rtdb.firebaseio.com",
  projectId: "myspyplatform",
  storageBucket: "myspyplatform.firebasestorage.app",
  messagingSenderId: "902746346647",
  appId: "1:902746346647:web:fcdc9fba654194c57805d2",
  measurementId: "G-XR81VGJH83"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);

export default app;