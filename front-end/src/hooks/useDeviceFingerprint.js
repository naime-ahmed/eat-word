import { useEffect, useState } from 'react';

// convert ArrayBuffer to hex string
async function bufferToHex(buffer) {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

// build a simple canvas fingerprint
function getCanvasFingerprint() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  // draw some text and shapes
  ctx.textBaseline = 'top';
  ctx.font = '14px "Arial"';
  ctx.fillStyle = '#f60';
  ctx.fillRect(125, 1, 62, 20);
  ctx.fillStyle = '#069';
  ctx.fillText('DeviceFingerprint', 2, 15);
  ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
  ctx.fillText('DeviceFingerprint', 4, 17);

  // draw a line
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillStyle = 'rgb(255,0,255)';
  ctx.beginPath();
  ctx.arc(50, 50, 50, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.fillStyle = 'rgb(0,255,255)';
  ctx.beginPath();
  ctx.arc(100, 50, 50, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.fillStyle = 'rgb(255,255,0)';
  ctx.beginPath();
  ctx.arc(75, 100, 50, 0, Math.PI * 2, true);
  ctx.fill();

  return canvas.toDataURL();
}

// main fingerprint generator
async function generateFingerprint() {
  // collect basic navigator and screen props
  const nav = window.navigator;
  const screenInfo = window.screen;
  const data = {
    userAgent: nav.userAgent,
    language: nav.language,
    languages: nav.languages,
    platform: nav.platform,
    hardwareConcurrency: nav.hardwareConcurrency,
    deviceMemory: nav.deviceMemory,
    timezoneOffset: new Date().getTimezoneOffset(),
    cookieEnabled: nav.cookieEnabled,
    screenWidth: screenInfo.width,
    screenHeight: screenInfo.height,
    colorDepth: screenInfo.colorDepth,
    pixelRatio: window.devicePixelRatio,
    touchSupport: ('ontouchstart' in window) || nav.maxTouchPoints > 0,
    canvas: getCanvasFingerprint(),
  };

  // serialize
  const json = JSON.stringify(data);
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(json));
  return bufferToHex(hashBuffer);
}

export function useDeviceFingerprint() {
  const [fingerprint, setFingerprint] = useState(null);

  useEffect(() => {
    let cancelled = false;
    generateFingerprint().then(fp => {
      if (!cancelled) setFingerprint(fp);
    });
    return () => { cancelled = true; };
  }, []);

  return fingerprint;
}
