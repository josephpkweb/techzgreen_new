import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, Keyboard, X } from 'lucide-react';

interface QRScannerProps {
  onResult: (code: string) => void;
  onError?: (err: string) => void;
}

type Mode = 'camera' | 'manual';

export default function QRScanner({ onResult, onError }: QRScannerProps) {
  const [mode, setMode] = useState<Mode>('manual');
  const [manualCode, setManualCode] = useState('');
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const html5QrRef = useRef<Html5Qrcode | null>(null);
  const scanningRef = useRef(false); // mirror of scanning state for async callbacks
  const manualInputRef = useRef<HTMLInputElement>(null);
  const isProcessingRef = useRef(false);

  useEffect(() => {
    if (mode === 'manual') manualInputRef.current?.focus();
  }, [mode]);

  // Cleanup on unmount — always stop camera regardless of state
  useEffect(() => {
    return () => { forceStopCamera(); };
  }, []);

  const forceStopCamera = async () => {
    if (html5QrRef.current) {
      try {
        if (scanningRef.current) await html5QrRef.current.stop();
        html5QrRef.current.clear();
      } catch (_) {}
      html5QrRef.current = null;
    }
    scanningRef.current = false;
    setScanning(false);
    isProcessingRef.current = false;
  };

  const stopCamera = async () => {
    await forceStopCamera();
  };

  const startCamera = async () => {
    setError(null);
    isProcessingRef.current = false;
    // clean up any existing instance first
    await forceStopCamera();

    try {
      const qr = new Html5Qrcode('qr-reader-container');
      html5QrRef.current = qr;
      await qr.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          if (isProcessingRef.current) return;
          isProcessingRef.current = true;
          // Stop camera BEFORE calling onResult so it can't keep scanning
          await forceStopCamera();
          setMode('manual'); // switch back to manual view
          onResult(decodedText.trim());
        },
        () => { /* quiet scan errors */ }
      );
      scanningRef.current = true;
      setScanning(true);
    } catch (err: any) {
      const msg = err?.message || 'Camera unavailable';
      setError(msg);
      onError?.(msg);
      scanningRef.current = false;
    }
  };

  const handleModeSwitch = async (newMode: Mode) => {
    if (newMode === 'manual') {
      await stopCamera();
    } else {
      await startCamera();
    }
    setMode(newMode);
    setManualCode('');
    setError(null);
  };

  const handleManualKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && manualCode.trim()) {
      onResult(manualCode.trim());
      setManualCode('');
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      onResult(manualCode.trim());
      setManualCode('');
    }
  };

  return (
    <div className="space-y-4">
      {/* Mode Switcher */}
      <div className="flex rounded-xl overflow-hidden border border-[rgba(46,125,50,0.2)] bg-white/60">
        <button
          type="button"
          onClick={() => handleModeSwitch('manual')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold transition-all cursor-pointer ${
            mode === 'manual' ? 'bg-[#2e7d32] text-white' : 'text-[#5f7a60] hover:text-[#2e7d32]'
          }`}
        >
          <Keyboard className="w-4 h-4" />
          USB Scanner / Manual
        </button>
        <button
          type="button"
          onClick={() => handleModeSwitch('camera')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold transition-all cursor-pointer ${
            mode === 'camera' ? 'bg-[#2e7d32] text-white' : 'text-[#5f7a60] hover:text-[#2e7d32]'
          }`}
        >
          <Camera className="w-4 h-4" />
          Camera QR
        </button>
      </div>

      {/* Manual / USB Barcode Scanner Input */}
      {mode === 'manual' && (
        <form onSubmit={handleManualSubmit} className="space-y-3">
          <p className="text-xs text-[#5f7a60] bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
            💡 Point this field and scan with USB barcode scanner — it auto-submits. Or type code manually.
          </p>
          <div className="relative">
            <input
              ref={manualInputRef}
              type="text"
              value={manualCode}
              onChange={e => setManualCode(e.target.value)}
              onKeyDown={handleManualKeyDown}
              placeholder="Scan barcode or type QR code..."
              className="input-glass w-full pr-10 font-mono tracking-widest"
              autoComplete="off"
              autoFocus
            />
            {manualCode && (
              <button
                type="button"
                onClick={() => setManualCode('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5f7a60] hover:text-[#1a3d1f] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={!manualCode.trim()}
            className="btn-primary w-full !py-2.5 disabled:opacity-50"
          >
            Look Up Voucher
          </button>
        </form>
      )}

      {/* Camera QR Reader */}
      {mode === 'camera' && (
        <div>
          <div id="qr-reader-container" className="rounded-xl overflow-hidden w-full" />
          {!scanning && !error && (
            <button
              type="button"
              onClick={startCamera}
              className="btn-primary w-full mt-3 !py-2.5 flex items-center justify-center gap-2"
            >
              <Camera className="w-4 h-4" /> Start Camera
            </button>
          )}
          {scanning && (
            <button
              type="button"
              onClick={stopCamera}
              className="mt-3 w-full py-2.5 rounded-xl border border-red-200 text-red-600 text-sm font-bold hover:bg-red-50 transition-colors cursor-pointer"
            >
              Stop Camera
            </button>
          )}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 font-medium">
          ⚠ {error}
        </div>
      )}
    </div>
  );
}
