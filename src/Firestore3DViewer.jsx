import React, {useEffect, useState} from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { Canvas } from '@react-three/fiber';
import { Points } from './Points';
import { CameraAdjuster } from './CameraAdjuster';

import {PointModal} from "./PointModal";

const Firestore3DViewer = ({firestore}) => {
    const [points, setPoints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPoint, setSelectedPoint] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchPoints = async () => {
            const querySnapshot = await getDocs(collection(firestore, "arxiv"));
            const force2d = true;
            const loadedPoints = querySnapshot.docs
                .map(doc => ({
                    ...doc.data(),
                    id: doc.id
                }))
                .filter(doc => doc.emb_3d && doc.emb_3d.length === 3)
                .map(doc => {
                    if (force2d) {
                        return {
                            ...doc,
                            emb_3d: [...doc.emb_2d, 0] // Transform emb_3d to be emb_2d with an additional '0' element
                        };
                    } else {
                        return doc; // No transformation needed, return the doc as-is
                    }
                });

            console.log('loadedPoints:', loadedPoints.length)
            setPoints(loadedPoints);

            setLoading(false);

        };

        fetchPoints();
        // eslint-disable-next-line
    }, []);

    const handlePointClick = (pointData) => {
        setSelectedPoint(pointData);
        toggleModal();
    };
    const toggleModal = () => setIsModalOpen(!isModalOpen);

    return (
        <>
            <Canvas style={{ width: '100vw', height: '100vh', display: 'block',
                background: 'black'}}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                {(!loading && (points.length > 0)) &&
                    <>
                    <Points points={points}
                            handlePointClick={handlePointClick}
                            selectedPoint={selectedPoint}
                    />
                    <CameraAdjuster points={points} />
                </>}

            </Canvas>
            <PointModal isModalOpen={isModalOpen}
                        toggleModal={toggleModal}
                        selectedPoint={selectedPoint} />
        </>
    );
};

export default Firestore3DViewer;
