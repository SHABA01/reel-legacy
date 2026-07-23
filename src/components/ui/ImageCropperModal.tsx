/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  RefreshCw,
  Check,
  Move,
  Crop,
  Sparkles,
} from 'lucide-react';
import { Button } from './Button';

interface ImageCropperModalProps {
  isOpen: boolean;
  imageSrc: string;
  title?: string;
  aspectRatio: number; // e.g. 1 for 1:1, 3.2 for 16:5
  aspectRatioLabel?: string;
  targetWidth?: number;
  targetHeight?: number;
  onClose: () => void;
  onCropSave: (croppedDataUrl: string) => void;
}

export function ImageCropperModal({
  isOpen,
  imageSrc,
  title = 'Reposition & Crop Photo',
  aspectRatio = 1,
  aspectRatioLabel = '1:1 Square (400x400 px recommended)',
  targetWidth = 600,
  targetHeight = 600,
  onClose,
  onCropSave,
}: ImageCropperModalProps) {
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Reset controls when new image is loaded or modal opens
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setRotation(0);
      setOffset({ x: 0, y: 0 });
      setImageLoaded(false);
    }
  }, [isOpen, imageSrc]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - offset.x,
        y: e.touches[0].clientY - offset.y,
      });
    }
  };

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setOffset({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  }, [isDragging, dragStart]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  const handleRotateCw = () => setRotation((prev) => (prev + 90) % 360);
  const handleRotateCcw = () => setRotation((prev) => (prev - 90 + 360) % 360);
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setOffset({ x: 0, y: 0 });
  };

  const handleSave = () => {
    if (!imgRef.current || !containerRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Output dimension
    const outW = targetWidth;
    const outH = Math.round(targetWidth / aspectRatio);
    canvas.width = outW;
    canvas.height = outH;

    const img = imgRef.current;
    const containerRect = containerRef.current.getBoundingClientRect();

    // Scale factors between preview box and output canvas
    const scaleToCanvas = outW / containerRect.width;

    ctx.save();
    // Fill background (dark neutral)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, outW, outH);

    // Center canvas context
    ctx.translate(outW / 2, outH / 2);
    // Apply canvas translation matching user drag offset
    ctx.translate(offset.x * scaleToCanvas, offset.y * scaleToCanvas);
    // Rotate
    ctx.rotate((rotation * Math.PI) / 180);
    // Scale zoom
    ctx.scale(zoom, zoom);

    // Draw original image centered
    // Render preserving intrinsic image size proportion relative to preview box
    const intrinsicRatio = img.naturalWidth / img.naturalHeight;
    let drawW = containerRect.width * scaleToCanvas;
    let drawH = drawW / intrinsicRatio;

    // Adjust if height-constrained
    if (aspectRatio > intrinsicRatio) {
      drawW = containerRect.width * scaleToCanvas;
      drawH = drawW / intrinsicRatio;
    } else {
      drawH = containerRect.height * scaleToCanvas;
      drawW = drawH * intrinsicRatio;
    }

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();

    const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
    onCropSave(croppedDataUrl);
  };

  if (!isOpen) return null;

  return (
    <div
      id="image-cropper-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
    >
      <div
        id="image-cropper-modal-content"
        className="bg-card border border-border rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cinema-amber-500/10 text-cinema-amber-500">
              <Crop className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-foreground">{title}</h3>
              <p className="text-[11px] text-muted-foreground font-mono">{aspectRatioLabel}</p>
            </div>
          </div>
          <button
            id="btn-close-cropper-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Crop Box */}
        <div className="p-5 flex-1 flex flex-col items-center justify-center space-y-4 bg-slate-950/40">
          {/* Instruction hint */}
          <div className="flex items-center gap-2 text-[11px] text-cinema-amber-400/90 font-medium bg-cinema-amber-500/10 px-3 py-1.5 rounded-full border border-cinema-amber-500/20">
            <Move className="w-3.5 h-3.5" /> Drag image to position • Scroll/Slider to Zoom
          </div>

          {/* Interactive Crop Frame */}
          <div
            ref={containerRef}
            id="crop-preview-viewport"
            style={{
              aspectRatio: `${aspectRatio}`,
              maxHeight: aspectRatio > 2 ? '200px' : '320px',
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            className={`w-full max-w-md relative overflow-hidden rounded-xl border-2 border-cinema-amber-500/60 shadow-inner bg-slate-900 cursor-grab active:cursor-grabbing select-none ${
              isDragging ? 'ring-2 ring-cinema-amber-500/50' : ''
            }`}
          >
            {/* Grid overlay lines */}
            <div className="absolute inset-0 z-10 pointer-events-none border border-white/20 grid grid-cols-3 grid-rows-3">
              <div className="border-r border-b border-white/10" />
              <div className="border-r border-b border-white/10" />
              <div className="border-b border-white/10" />
              <div className="border-r border-b border-white/10" />
              <div className="border-r border-b border-white/10" />
              <div className="border-b border-white/10" />
              <div className="border-r border-white/10" />
              <div className="border-r border-white/10" />
              <div />
            </div>

            {/* Transformable Image */}
            <div className="w-full h-full flex items-center justify-center">
              <img
                ref={imgRef}
                src={imageSrc}
                alt="Crop subject preview"
                onLoad={() => setImageLoaded(true)}
                draggable={false}
                style={{
                  transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                  transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                }}
                className="max-w-full max-h-full object-contain pointer-events-none select-none"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Tool Control Panel */}
          <div className="w-full max-w-md space-y-3 bg-muted/40 p-3.5 rounded-xl border border-border">
            {/* Zoom Slider */}
            <div className="flex items-center gap-3">
              <button
                id="btn-zoom-out"
                onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
                className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              <input
                id="cropper-zoom-range"
                type="range"
                min="0.5"
                max="3"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="flex-1 accent-cinema-amber-500 h-1.5 bg-border rounded-lg cursor-pointer"
              />

              <button
                id="btn-zoom-in"
                onClick={() => setZoom((z) => Math.min(3, z + 0.1))}
                className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <span className="text-[10px] font-mono text-muted-foreground w-10 text-right">
                {Math.round(zoom * 100)}%
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-1.5">
                <Button
                  id="btn-rotate-ccw"
                  variant="ghost"
                  size="sm"
                  leftIcon={<RotateCcw className="w-3.5 h-3.5 text-foreground" />}
                  onClick={handleRotateCcw}
                  className="text-xs h-8 px-2.5"
                  title="Rotate Left 90°"
                >
                  -90°
                </Button>
                <Button
                  id="btn-rotate-cw"
                  variant="ghost"
                  size="sm"
                  leftIcon={<RotateCw className="w-3.5 h-3.5 text-foreground" />}
                  onClick={handleRotateCw}
                  className="text-xs h-8 px-2.5"
                  title="Rotate Right 90°"
                >
                  +90°
                </Button>
              </div>

              <Button
                id="btn-reset-cropper"
                variant="ghost"
                size="sm"
                leftIcon={<RefreshCw className="w-3.5 h-3.5 text-foreground" />}
                onClick={handleReset}
                className="text-xs h-8 px-2.5 text-muted-foreground hover:text-foreground"
              >
                Reset Position
              </Button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between">
          <Button
            id="btn-cancel-cropper"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-xs border border-border"
          >
            Cancel
          </Button>

          <Button
            id="btn-apply-cropper"
            variant="primary"
            size="sm"
            leftIcon={<Check className="w-4 h-4 text-slate-950" />}
            onClick={handleSave}
            className="text-xs bg-cinema-amber-500 hover:bg-cinema-amber-600 text-slate-950 font-bold"
          >
            Save Photo
          </Button>
        </div>
      </div>
    </div>
  );
}
