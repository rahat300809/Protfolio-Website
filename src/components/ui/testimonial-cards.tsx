"use client";

import React, { useRef } from 'react';
import { motion } from 'framer-motion';

interface TestimonialCardProps {
  handleShuffle: () => void;
  testimonial: string;
  position: string;
  id: string | number;
  author: string;
  image?: string;
  subtitle?: string;
  key?: React.Key;
  onCardClick?: () => void;
}

export function TestimonialCard({ handleShuffle, testimonial, position, id, author, image, subtitle, onCardClick }: TestimonialCardProps) {
  const dragRef = useRef(0);
  const isFront = position === "front";
  const imgSrc = image || `https://i.pravatar.cc/128?img=${id}`;

  return (
    <motion.div
      style={{
        zIndex: position === "front" ? "2" : position === "middle" ? "1" : "0"
      }}
      animate={{
        rotate: position === "front" ? "-6deg" : position === "middle" ? "0deg" : "6deg",
        x: position === "front" ? "0%" : position === "middle" ? "33%" : "66%",
        opacity: position === "front" ? 1 : position === "middle" ? 0.8 : 0.6
      }}
      drag={true}
      dragElastic={0.35}
      dragListener={isFront}
      dragConstraints={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
      onDragStart={(e: any) => {
        dragRef.current = e.clientX;
      }}
      onDragEnd={(e: any) => {
        if (dragRef.current - e.clientX > 150) {
          handleShuffle();
        }
        dragRef.current = 0;
      }}
      transition={{ duration: 0.35 }}
      className={`absolute left-0 top-0 grid h-[450px] w-[350px] select-none place-content-center space-y-6 rounded-2xl border-2 border-slate-700 bg-slate-800/80 p-6 shadow-xl backdrop-blur-md ${isFront ? "cursor-grab active:cursor-grabbing" : ""
        }`}
      onClick={() => {
        if (isFront && onCardClick) onCardClick();
      }}
    >
      <img
        src={imgSrc}
        alt={`Image of ${author}`}
        className="pointer-events-none mx-auto h-32 w-32 rounded-full border-2 border-emerald-500 bg-slate-900 object-cover shadow-lg shadow-emerald-500/20"
      />
      <span className="text-center text-lg italic text-slate-300 line-clamp-4 leading-relaxed">"{testimonial}"</span>
      <div className="flex flex-col items-center">
        <span className="text-center text-lg font-bold text-emerald-400">{author}</span>
        {subtitle && <span className="text-center text-sm font-medium text-slate-500">{subtitle}</span>}
      </div>
      {isFront && onCardClick && (
        <span className="text-center text-xs text-slate-500 mt-2">Click to explore →</span>
      )}
    </motion.div>
  );
}
