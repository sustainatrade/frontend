import firebase from 'firebase/app'
import 'firebase/auth';


const config = {
    apiKey: 'AIzaSyBlxdXIxuz8yjWje-hlz9u9RMrR0gulEfw',
    authDomain: 'vocal-camera-194109.firebaseapp.com'
}

export const app = firebase.initializeApp(config);
export const facebookProvider = new firebase.auth.FacebookAuthProvider();
export const googleProvider = new firebase.auth.GoogleAuthProvider();
