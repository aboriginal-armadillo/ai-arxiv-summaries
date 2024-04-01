import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';

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
const functions = getFunctions(app);


function App() {
  const [result, setResult] = useState('');

  const callFunction = async () => {
    const sayHello = httpsCallable(functions, 'individual_article_v2'); // Replace 'sayHello' with your function name
    try {
      let payload = { arxiv_id: '2403.19887' }
      console.log("Payload: ", payload);
      const response = await sayHello(payload); // Pass any data your function needs
      setResult(response.data.text); // Assuming the function responds with an object containing 'text'
    } catch (error) {
      console.error("Error calling function:", error);
      setResult("Failed to call function. Check the console for details.");
    }
  };

  return (
      <div>
        <button onClick={callFunction}>Say Hello</button>
        {result && <p>Function Response: {result}</p>}
      </div>
  );
}

export default App;
