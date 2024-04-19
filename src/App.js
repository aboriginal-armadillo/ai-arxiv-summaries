import React, {useState} from 'react';
import { initializeApp } from 'firebase/app';
import { Button } from 'react-bootstrap';
import Firestore3DViewer from "./Firestore3DViewer";
import SideDrawer from './SideDrawer';
import {getFirestore} from "firebase/firestore";
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from "./Footer";
import 'bootstrap-icons/font/bootstrap-icons.css';

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
  const [showDrawer, setShowDrawer] = useState(false);
  const [viewerMode, setViewerMode] = useState('list');
  const [HFOnly, setHFOnly] = useState(true);

    const handleDrawerClose = () => setShowDrawer(false);
  const handleDrawerShow = () => setShowDrawer(true);
  const handleModeChange = (mode) => setViewerMode(mode);
  const handleHFOnlyChange = (isHFOnly) => setHFOnly(isHFOnly);

  return (
      <div style={{ backgroundColor: 'black', padding: '10px' }}>
        <Button variant="primary"
                onClick={handleDrawerShow}
                style={{
                    backgroundColor: 'transparent',
                    borderColor: 'transparent',
                    boxShadow: 'none' // Removes shadow if present
                }}>
            <i className="bi bi-list"></i>
        </Button>
        <SideDrawer
            show={showDrawer}
            handleClose={handleDrawerClose}
            handleModeChange={handleModeChange}
            handleHFOnlyChange={handleHFOnlyChange}
        />
          <Firestore3DViewer firestore={firestore} mode={viewerMode} hfOnly={HFOnly}/>
          <Footer />
      </div>
  );
}

export default App;
