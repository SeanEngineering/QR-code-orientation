import { Point } from "../props/types";

export const calculateTiltAngle = (corners: Point[]) => {
    if (!corners || corners.length < 4) return 'Unknown';

    const topLeft = corners[0];
    const topRight = corners[1];

    const angle =
      Math.atan2(topRight.y - topLeft.y, topRight.x - topLeft.x) *
      (180 / Math.PI);

    return angle.toFixed(2);
  };


  export const calculateTiltAngles = (corners: Point[]) => {
    if (!corners || corners.length < 4) return { x: 0, y: 0, z: 0 };
  
    const [TL, TR, BR, BL] = corners;
  
    const angleX = Math.atan2(TR.y - TL.y, TR.x - TL.x) * (180 / Math.PI);
  
    const angleY = Math.atan2(BL.x - TL.x, BL.y - TL.y) * (180 / Math.PI);
  
    const leftSideHeight = Math.hypot(BL.x - TL.x, BL.y - TL.y);
    const rightSideHeight = Math.hypot(BR.x - TR.x, BR.y - TR.y);
    const avgHeight = (leftSideHeight + rightSideHeight) / 2;
    const angleZ = Math.atan2(rightSideHeight - leftSideHeight, avgHeight) * (180 / Math.PI);
  
    return { x: angleX, y: angleY, z: angleZ };
  };