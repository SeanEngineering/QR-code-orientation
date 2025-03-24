import React, { useRef, useEffect, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import QrScanner from 'qr-scanner';
import { BoundingBox } from '../props/types';
import { calculateTiltAngles } from '../util/orientation';

const QRScannerComponent = () => {
  const webcamRef = useRef<Webcam>(null);
  const [qrResult, setQrResult] = useState<QrScanner.ScanResult | null>();
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);
  const [tiltZ, setTiltZ] = useState(0);
  const [boundingBox, setBoundingBox] = useState<BoundingBox | null>(null);

  const capture = useCallback(async () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();

    if (imageSrc) {
      try {
        const result = await QrScanner.scanImage(imageSrc, {
          returnDetailedScanResult: true,
        });
        setQrResult(result);
        if (result.cornerPoints) {
          const { x, y, z } = calculateTiltAngles(result.cornerPoints);
          setTiltX(x);
          setTiltY(y);
          setTiltZ(z);
          const xMin = Math.min(...result.cornerPoints.map((p) => p.x));
          const yMin = Math.min(...result.cornerPoints.map((p) => p.y));
          const xMax = Math.max(...result.cornerPoints.map((p) => p.x));
          const yMax = Math.max(...result.cornerPoints.map((p) => p.y));

          setBoundingBox({
            left: xMin,
            top: yMin,
            width: xMax - xMin,
            height: yMax - yMin,
          });
        }
      } catch (error) {
        console.error(error);
        setBoundingBox(null);
        setQrResult(null);
      }
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(capture, 5);
    return () => clearInterval(interval);
  }, [capture]);

  return (
    <div style={{ position: 'relative' }}>
      <Webcam ref={webcamRef} screenshotFormat='image/png' mirrored />
      {boundingBox && (
        <div
          style={{
            position: 'absolute',
            left: `${boundingBox.left}px`,
            top: `${boundingBox.top}px`,
            width: `${boundingBox.width}px`,
            height: `${boundingBox.height}px`,
            border: '3px solid lime',
            borderRadius: '8px',
            boxShadow: '0 0 10px lime',
            pointerEvents: 'none',
            transform: `rotate(${tiltX}deg)`,
            transformOrigin: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: `${
              Math.min(boundingBox.width, boundingBox.height) / 2
            }px`,
            color: 'red',
          }}
        >
          ➤
        </div>
      )}
      <p>QR Code Result: {qrResult?.data}</p>
      <p>🔄 X-Tilt: {tiltX.toFixed(2)}° (Left/Right)</p>
      <p>🔼 Y-Tilt: {tiltY.toFixed(2)}° (Up/Down)</p>
      <p>🔃 Z-Tilt: {tiltZ.toFixed(2)}° (Rotation)</p>
    </div>
  );
};

export default QRScannerComponent;
