import { initializeApp } from "firebase/app";
import "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from "firebase/firestore";
import { ITodo } from "./interface/todo";
import "./firebase";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

export const postConverter: FirestoreDataConverter<ITodo> = {
  toFirestore(post: WithFieldValue<ITodo>): DocumentData {
    return post;
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): ITodo {
    const data = snapshot.data(options);
    return {
      date_end: data.date_end,
      id: snapshot.id,
      description: data.description,
      files: data.files,
      title: data.title,
    };
  },
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
