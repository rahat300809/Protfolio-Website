import React, { useState, useEffect } from "react";
import { TestimonialCard } from "./testimonial-cards";

export interface DeckItem {
  id: string | number;
  title: string;
  subtitle?: string;
  description: string;
  image?: string;
}

export function ShuffleDeck({ items, onItemClick }: { items: DeckItem[]; onItemClick?: (item: DeckItem) => void }) {
  const [positions, setPositions] = useState(["front", "middle", "back"]);

  useEffect(() => {
    // Generate initial positions based on item length
    const initialPositions = items.map((_, i) => {
      if (i === 0) return "front";
      if (i === 1) return "middle";
      return "back"; // all others are back
    });
    setPositions(initialPositions);
  }, [items]);

  const handleShuffle = () => {
    setPositions((prev) => {
      const newPositions = [...prev];
      const first = newPositions.shift();
      if (first) newPositions.push(first);
      return newPositions;
    });
  };

  if (!items || items.length === 0) return null;

  // which item is currently in front?
  const frontIndex = positions.indexOf("front");

  return (
    <div className="flex items-center justify-center py-12 w-full">
      <div className="relative h-[450px] w-[350px]">
        {items.map((item, index) => (
          <TestimonialCard
            key={item.id}
            id={item.id}
            testimonial={item.description}
            author={item.title}
            subtitle={item.subtitle}
            image={item.image}
            handleShuffle={handleShuffle}
            position={positions[index] || "back"}
            onCardClick={onItemClick ? () => onItemClick(item) : undefined}
          />
        ))}
      </div>
    </div>
  );
}
