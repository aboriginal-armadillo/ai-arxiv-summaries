import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';

const CameraAdjuster = ({ points }) => {
    const { camera } = useThree();

    useEffect(() => {
        if (points && points.length > 0) {
            const boundingBox = new THREE.Box3();

            // Now `points` includes all document data, so access `emb_3d` for coordinates
            points.forEach((doc) => {
                const point = doc.emb_3d; // Access the emb_3d property for the [x, y, z] array
                if(point && point.length === 3) { // Ensure the point exists and is valid
                    boundingBox.expandByPoint(new THREE.Vector3(...point));
                }
            });

            const center = new THREE.Vector3();
            boundingBox.getCenter(center);
            const size = new THREE.Vector3();
            boundingBox.getSize(size);

            const maxSize = Math.max(size.x, size.y, size.z);
            const fitHeightDistance = maxSize / (2 * Math.atan((Math.PI * camera.fov) / 360));
            const fitWidthDistance = fitHeightDistance / camera.aspect;
            const distance = Math.max(fitHeightDistance, fitWidthDistance);

            // Adjust the camera to ensure it encompasses the entire bounding box of points
            const offset = center.clone().sub(camera.position).normalize().multiplyScalar(distance);
            camera.position.copy(center).sub(offset);
            camera.lookAt(center);
            camera.updateProjectionMatrix();
        }
    }, [points, camera]); // Dependencies: React re-runs the effect if `points` or `camera` changes


    return <OrbitControls />;
};

export { CameraAdjuster };
