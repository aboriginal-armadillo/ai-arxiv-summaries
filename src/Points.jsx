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

const Points = ({ points, handlePointClick, selectedPoint, handlePointHover, hoveredPointId }) => {
    // Split points into two arrays based on the presence of ai_summary
    const pointsWithAISummary = points.filter(point => point.ai_summary !== undefined);
    const pointsWithoutAISummary = points.filter(point => point.ai_summary === undefined);

    // Define distinct styles for points with and without AI summaries
    const styleWithAISummary = {
        color: "#ff0000", // For example, red for points with AI summaries
        size: 15, // Larger size for emphasis
    };

    const styleWithoutAISummary = {
        color: "#00ff00", // For example, green for points without AI summaries
        size: 5, // Smaller size for less emphasis
    };

    return (
        <>
            {/* Points WITHOUT ai_summary */}
            <ThreePoints>
                <PointMaterial transparent
                               vertexColors
                               size={styleWithoutAISummary.size} sizeAttenuation={false} depthWrite={false} />
                {pointsWithoutAISummary.map((point) => (
                    <Point
                        position={point.emb_3d}
                        key={point.id}
                        // color={point.id === hoveredPointId ? "yellow" : styleWithoutAISummary.color} // Highlight hovered point
                        color={clusterColors[point.cluster]}
                        onClick={() => handlePointClick(point)}
                        onPointerOver={(e) => {
                            e.stopPropagation();
                            handlePointHover(point.id);
                        }}
                        onPointerOut={(e) => {
                            e.stopPropagation();
                            handlePointHover(null); // Clear hover state when not hovering
                        }}
                    />
                ))}
            </ThreePoints>

            {/* Points WITH ai_summary */}
            <ThreePoints>
                <PointMaterial transparent
                               vertexColors
                               size={styleWithAISummary.size}
                               sizeAttenuation={false}
                               depthWrite={false} />
                {pointsWithAISummary.map((point) => (
                    <Point
                        position={point.emb_3d}
                        key={point.id}
                        // color={point.id === hoveredPointId ? "yellow" : styleWithAISummary.color} // Highlight hovered point
                        color={clusterColors[point.cluster]}
                        onClick={() => handlePointClick(point)}
                        onPointerOver={(e) => {
                            e.stopPropagation();
                            handlePointHover(point.id);
                        }}
                        onPointerOut={(e) => {
                            e.stopPropagation();
                            handlePointHover(null); // Clear hover state when not hovering
                        }}
                    />
                ))}
            </ThreePoints>
        </>
    );
};
export { Points };
