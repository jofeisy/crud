import { firebaseApp } from './firebase';
import * as firebase from 'firebase'
import 'firebase/firestore'
import 'firebase/auth'

const db = firebase.firestore(firebaseApp)

export const getCollection = async(collection) => {
    const result = { statusResponse: false, data: null, eror: null }

    try {
        const data = await db.collection(collection).get()
        console.log(data)
    } catch (error) {
        result.error = error
    }

    return result
}