import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyBNEYZ6RBjITDqzvntBmFLSImG87cemKJs",
  authDomain: "tution-app-a1e0b.firebaseapp.com",
  projectId: "tution-app-a1e0b",
  storageBucket: "tution-app-a1e0b.appspot.com",
  messagingSenderId: "166279206546",
  appId: "1:166279206546:web:927ebeaf31f9f814eeb84b"
};
// Initialize Firebase


if(!firebase.apps.length) { firebase.initializeApp(firebaseConfig) }
export default firebase.firestore();
