"use client"
import { useState, useEffect } from "react"
import type { Article } from "@/lib/newsapi"

export function useNews(category?: string) {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchNews() {
      try {
        setLoading(true)
        setError(null)

        const params = new URLSearchParams()
        if (category && category !== "all") {
          params.append("category", category)
        }

        const response = await fetch(`/api/news/headlines?${params}`)

        if (!response.ok) {
          throw new Error("Failed to fetch news")
        }

        const data = await response.json()
        setArticles(data.articles)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [category])

  return { articles, loading, error }
}

export function useArticle(id: string) {
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchArticle() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/news/article/${id}`)

        if (!response.ok) {
          throw new Error("Failed to fetch article")
        }

        const data = await response.json()
        setArticle(data.article)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchArticle()
    }
  }, [id]);

  return { article, loading, error }
}
