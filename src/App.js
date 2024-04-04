import React from 'react';
import { initializeApp } from 'firebase/app';
import Firestore3DViewer from "./Firestore3DViewer";
import {getFirestore} from "firebase/firestore";
import 'bootstrap/dist/css/bootstrap.min.css';


// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyDiWJkHjslCn6b6gNs62iwrLG-6NS2yOcI",
  authDomain: "ai-arxiv-summaries.firebaseapp.com",
  projectId: "ai-arxiv-summaries",
  storageBucket: "ai-arxiv-summaries.appspot.com",
  messagingSenderId: "259847568914",
  appId: "1:259847568914:web:b05384d9486afa0fe4a2cb"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);



function App() {


  return (
      <div>
          Test line
        <Firestore3DViewer firestore={firestore}/>
      </div>
  );
}

export default App;
