import React from 'react';
import { Points as ThreePoints, PointMaterial, Point } from '@react-three/drei';


const Points = ({ points, handlePointClick, selectedPoint }) => {

    return (
        <>
            <ThreePoints>
                <PointMaterial transparent vertexColors size={5} sizeAttenuation={false} depthWrite={false} />
                {points.map((point) => (
                    <Point position={point.emb_3d}
                           key={point.id}
                           color={"limegreen"} // TODO: Set color based on cluster
                           onClick={() => handlePointClick(point)} />
                ))}
            </ThreePoints>


        </>
    );
};

export { Points };

