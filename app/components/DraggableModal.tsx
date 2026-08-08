'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

interface DraggableModalProps {
  children: React.ReactNode;
  onClose: () => void;
  modalId?: string;
  className?: string;
  style?: React.CSSProperties;
}

// Session position store: remembers dragged positions per modalId while on page
const modalPositionsMap: Record<string, { x: number; y: number }> = {};

export default function DraggableModal({
  children,
  onClose,
  modalId,
  className = '',
  style = {},
}: DraggableModalProps) {
  // Read saved offset from session store synchronously on component creation
  const initialSavedOffset = useRef<{ x: number; y: number }>(
    modalId && modalPositionsMap[modalId] ? modalPositionsMap[modalId] : { x: 0, y: 0 }
  );

  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Drag tracking refs
  const isDraggingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const initialOffsetRef = useRef({ x: 0, y: 0 });
  const currentOffsetRef = useRef(initialSavedOffset.current);
  const animationFrameRef = useRef<number | null>(null);

  const updateCardPosition = useCallback(() => {
    if (cardRef.current) {
      const { x, y } = currentOffsetRef.current;
      cardRef.current.style.transform = `translate3d(${x}px, ${y}px, 0px) scale(${isDraggingRef.current ? 1.015 : 1})`;
    }
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click

    // Ignore clicks on interactive elements inside modal
    const target = e.target as HTMLElement;
    if (
      target.tagName === 'BUTTON' ||
      target.tagName === 'A' ||
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.closest('button') ||
      target.closest('a')
    ) {
      return;
    }

    if (window.innerWidth < 768) return; // Disable drag on mobile

    isDraggingRef.current = true;
    setIsDragging(true);

    startPosRef.current = { x: e.clientX, y: e.clientY };
    initialOffsetRef.current = { ...currentOffsetRef.current };

    if (cardRef.current) {
      cardRef.current.style.animation = 'none';
      cardRef.current.style.transition = 'none';
      cardRef.current.style.boxShadow = '10px 14px 0px #362840';
      cardRef.current.style.cursor = 'grabbing';
      updateCardPosition();
    }
  }, [updateCardPosition]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;

      const dx = e.clientX - startPosRef.current.x;
      const dy = e.clientY - startPosRef.current.y;

      const rawX = initialOffsetRef.current.x + dx;
      const rawY = initialOffsetRef.current.y + dy;

      // Viewport boundary limits — ensure modal handle is always accessible on screen
      const maxDx = Math.max(20, (window.innerWidth - 140) / 2);
      const maxDy = Math.max(20, (window.innerHeight - 100) / 2);

      const clampedX = Math.min(Math.max(rawX, -maxDx), maxDx);
      const clampedY = Math.min(Math.max(rawY, -maxDy), maxDy);

      currentOffsetRef.current = {
        x: clampedX,
        y: clampedY,
      };

      if (animationFrameRef.current === null) {
        animationFrameRef.current = requestAnimationFrame(() => {
          animationFrameRef.current = null;
          updateCardPosition();
        });
      }
    };

    const handleMouseUp = () => {
      if (!isDraggingRef.current) return;

      isDraggingRef.current = false;
      setIsDragging(false);

      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      // Save position to store
      if (modalId) {
        modalPositionsMap[modalId] = { ...currentOffsetRef.current };
      }

      if (cardRef.current) {
        cardRef.current.style.transition = 'all 0.15s ease-out';
        cardRef.current.style.boxShadow = (style.boxShadow as string) || '6px 8px 0px #362840';
        cardRef.current.style.cursor = 'grab';
        updateCardPosition();
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [modalId, style.boxShadow, updateCardPosition]);

  const defaultShadow = style.boxShadow || '6px 8px 0px #362840';
  const hasSavedPosition = initialSavedOffset.current.x !== 0 || initialSavedOffset.current.y !== 0;

  return (
    <div className="retro-modal-overlay" onClick={onClose}>
      <div
        ref={cardRef}
        className={`retro-card ${className}`}
        onMouseDown={handleMouseDown}
        style={{
          ...style,
          // Set initial transform on FIRST paint frame — zero jump/flicker!
          transform: `translate3d(${initialSavedOffset.current.x}px, ${initialSavedOffset.current.y}px, 0px)`,
          // Disable CSS keyframe transform override if position was saved
          animation: hasSavedPosition ? 'none' : (style.animation as string || undefined),
          willChange: 'transform',
          boxShadow: isDragging ? '10px 14px 0px #362840' : defaultShadow,
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: isDragging ? 'none' : 'auto',
          touchAction: 'none',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag Handle Bar Indicator at Top */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            paddingBottom: 8,
            cursor: isDragging ? 'grabbing' : 'grab',
            opacity: isDragging ? 0.9 : 0.45,
            fontSize: '0.68rem',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            userSelect: 'none',
            transition: 'opacity 0.2s ease',
          }}
          title="Click and drag to move window"
        >
          <span style={{ fontSize: '0.75rem' }}>⋮⋮</span> {isDragging ? 'MOVING...' : 'DRAG TO MOVE'}
        </div>

        {children}
      </div>
    </div>
  );
}
