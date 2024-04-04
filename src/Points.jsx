import React from 'react';
import { Points as ThreePoints, PointMaterial, Point } from '@react-three/drei';

const clusterColors = [
    "#FF5733", // Red
    "#33FF57", // Lime Green
    "#3357FF", // Blue
    "#F333FF", // Magenta
    "#33FFF6", // Cyan
    "#FFC300", // Yellow
    "#DAF7A6", // Light Green
    "#C70039", // Maroon
    "#900C3F", // Dark Magenta
    "#581845", // Purple
    "#FFC0CB", // Pink
    "#A52A2A", // Brown
    "#DEB887", // BurlyWood
    "#5F9EA0", // CadetBlue
    "#7FFF00", // Chartreuse
];

const Points = ({ points, handlePointClick, selectedPoint }) => {

    return (
        <>
            <ThreePoints>
                <PointMaterial transparent vertexColors size={5} sizeAttenuation={false} depthWrite={false} />
                {points.map((point) => (
                    <Point position={point.emb_3d}
                           key={point.id}
                           color={clusterColors[point.cluster]}
                           onClick={() => handlePointClick(point)} />
                ))}
            </ThreePoints>


        </>
    );
};

export { Points };

