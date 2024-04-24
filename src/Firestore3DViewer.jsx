import React, {useEffect, useState} from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { Canvas } from '@react-three/fiber';
import { Points } from './Points';
import { CameraAdjuster } from './CameraAdjuster';

import {PointModal} from "./PointModal";
import ListView from "./ListView";

const Firestore3DViewer = ({firestore, mode, hfOnly}) => {
    const [points, setPoints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPoint, setSelectedPoint] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [hoveredPointId, setHoveredPointId] = useState(null);

    const handlePointHover = (pointId) => {
        setHoveredPointId(pointId);
    };
    useEffect(() => {
        const fetchPoints = async () => {
            // const querySnapshot = await getDocs(collection(firestore, "arxiv"));
            const arxivRef = collection(firestore, "arxiv");
            const arxivQuery = query(arxivRef, orderBy("created", "desc"));

            const querySnapshot = await getDocs(arxivQuery);

            let loadedPoints = querySnapshot.docs
                .map(doc => ({
                    ...doc.data(),
                    id: doc.id
                }));
            console.log(loadedPoints.length);
            if (hfOnly) {
                loadedPoints = loadedPoints.filter(doc => doc.ai_summary !== undefined);
            }
            console.log(loadedPoints);
            loadedPoints = loadedPoints
                .filter(doc => doc.emb_3d && doc.emb_3d.length === 3)
                .map(doc => {
                    if (mode === '2d') {
                        return {
                            ...doc,
                            emb_3d: [...doc.emb_2d, 0] // Transform emb_3d to be emb_2d with an additional '0' element
                        };
                    } else {
                        return doc; // No transformation needed, return the doc as-is
                    }
                });
            console.log(loadedPoints.length);
            setPoints(loadedPoints);
            setLoading(false);
        };

        fetchPoints();
        // eslint-disable-next-line
    }, [mode, hfOnly]); // Ensure hfOnly is listed in the dependency array

    const handlePointClick = (pointData) => {
        setSelectedPoint(pointData);

        toggleModal();
    };
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    }

    const selectedPointStyle = {
        position: 'fixed', // Fixed position to stay in the viewport
        top: '20px',       // 20px from the top
        right: '20px',     // 20px from the right
        zIndex: 1000,      // Make sure it's on top of other elements
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background
        padding: '10px',   // Some padding around the text
        borderRadius: '5px', // Rounded corners for better look
        color: 'black',    // Text color
        maxWidth: '200px', // Max width to avoid overly wide text
        textAlign: 'right', // Align text to the right
    };

    if (mode === 'list') {
        return <ListView points={points}

        />; // Render ListView when mode is 'list'
    }

    return (
        <>
            <Canvas style={{ width: '100vw', height: '100vh', display: 'block',
                background: 'black'}}>
                {/*<ambientLight intensity={0.5} />*/}
                {/*<pointLight position={[10, 10, 10]} />*/}
                {(!loading && (points.length > 0)) &&
                    <>
                        <Points points={points}
                                handlePointClick={handlePointClick}
                                selectedPoint={selectedPoint}
                                handlePointHover={handlePointHover}
                                hoveredPointId={hoveredPointId}
                        />
                    <CameraAdjuster points={points} />
                </>}

            </Canvas>
            {selectedPoint && (
                <div style={selectedPointStyle}>
                    {/* Display information about the selected point. Adjust as needed. */}
                    <div>Hover Point ID: {hoveredPointId}</div>
                    <div>Selected Point ID: {selectedPoint.id}</div>
                    {/* Add more details you'd like to display */}
                </div>
            )}
            <PointModal isModalOpen={isModalOpen}
                        toggleModal={toggleModal}
                        selectedPoint={selectedPoint} />

        </>
    );
};

export default Firestore3DViewer;
