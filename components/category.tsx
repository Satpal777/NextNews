"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils";

const categories = ["General", "Science", "Technology", "Business", "Sports", "Health", "Entertainment"];

interface CategoryFilterProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export function CategoryFilter({ activeCategory, onCategoryChange }: CategoryFilterProps) {

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Latest News</h2>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(category)}
            className="rounded-full cursor-pointer"
          >
            {category}
          </Button>
        ))}

        <Button
          variant={activeCategory === "AI" ? "default" : "outline"}
          size="sm"
          className={cn(
            "rounded-full cursor-pointer bg-gradient-to-r text-white transition-all duration-300",
            activeCategory === "AI"
              ? "from-[#0d1c53] to-[#3f053f]"
              : "from-[#3c63ff] to-[#ff46fc]"
          )}
          onClick={() => onCategoryChange("AI")}
        >
          For you
        </Button>

      </div>
    </div>
  )
}
