"use client"

import { ArticleGrid } from "@/components/article-grid"
import { CategoryFilter } from "@/components/category"
import { Header } from "@/components/header"
import { useState } from "react"

export default function GuestPage() {
const [activeCategory, setActiveCategory] = useState("General");

  return (
    <>
      <Header />
      <div className="container mx-auto px-27 py-8">
        <CategoryFilter activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
        <ArticleGrid category={activeCategory === "All" ? undefined : activeCategory} />
      </div>
    </>
  )
}
