import firebase from 'firebase/app'
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyB41AA8qDh7_MOmIpBUamC9PUwcC5sROYQ",
    authDomain: "crud-a8ee4.firebaseapp.com",
    projectId: "crud-a8ee4",
    storageBucket: "crud-a8ee4.appspot.com",
    messagingSenderId: "486170362703",
    appId: "1:486170362703:web:cd4f6554d35ff85b813b3a"
}

export const firebaseApp = firebase.initializeApp(firebaseConfig)