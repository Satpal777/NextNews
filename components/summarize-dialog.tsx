"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type ArticleLike = {
  title?: string
  description?: string
  content?: string
  urlToImage?: string
  image?: string
  author?: string
  publishedAt?: string
  source?: { name?: string } | null
  url?: string
}

type AISummary = {
  title: string
  summary: string
  bullets: string[]
  sentiment: "positive" | "neutral" | "negative" | string
  reading_time_seconds: number
}

export function AISummaryDialog({
  open,
  onOpenChange,
  article,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  article: ArticleLike | null
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<AISummary | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const imageUrl = article?.urlToImage || article?.image || "/placeholder.svg?height=320&width=480"
  const source = article?.source?.name || "News"
  const byline = [article?.author, source].filter(Boolean).join(" • ")
  const published = article?.publishedAt ? article.publishedAt : null
  const contentForAI = useMemo(() => {
    return article?.content || article?.description || ""
  }, [article])

  useEffect(() => {
    if (!open) {
      setData(null)
      setError(null)
      setLoading(false)
      if (abortRef.current) abortRef.current.abort()
      return
    }
    if (!article) return

    setLoading(true)
    setError(null)
    setData(null)

    const controller = new AbortController()
    abortRef.current = controller
    ;(async () => {
      try {
        const res = await fetch("/api/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: article.title || "",
            content: contentForAI,
          }),
          signal: controller.signal,
        })
        if (!res.ok) {
          throw new Error(`Request failed: ${res.status}`)
        }
        const json = (await res.json()) as AISummary
        setData(json)
      } catch (e: any) {
        setError(e?.message || "Failed to summarize")
      } finally {
        setLoading(false)
      }
    })()

    return () => controller.abort()
  }, [open, article, contentForAI])

  function sentimentClass(s?: string) {
    const v = (s || "").toLowerCase()
    if (v.includes("positive")) return "bg-green-500/15 text-green-700"
    if (v.includes("negative")) return "bg-red-500/15 text-red-700"
    return "bg-muted text-muted-foreground"
  }

  const readingMinutes = data ? Math.max(1, Math.round((data.reading_time_seconds || 0) / 60)) : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
       <DialogContent className="max-w-6xl md:max-w-4xl p-0 overflow-hidden border-0 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Article preview */}
          <div className="bg-muted/40">
            <div className="relative w-full aspect-video  overflow-hidden">
              <img
                src={imageUrl || "/placeholder.svg"}
                alt={article?.title ? `Image for ${article.title}` : "Article image"}
                className="absolute inset-0 w-full object-contain"
              />
            </div>
            <div className="p-4 md:p-6 space-y-3">
              <h3 className="text-base md:text-lg font-semibold text-pretty">{article?.title || "Article"}</h3>
              {(byline || published) && (
                <div className="text-sm text-muted-foreground">
                  {byline}
                  {published ? ` • ${published}` : ""}
                </div>
              )}
              {article?.description ? (
                <p className="text-sm md:text-base text-muted-foreground line-clamp-4">{article.description}</p>
              ) : null}
            </div>
          </div>

          {/* Right: AI output */}
          <div className="p-4 md:p-6 space-y-4">
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-pretty">AI Summary</DialogTitle>
              <DialogDescription>Concise overview generated from the article content.</DialogDescription>
            </DialogHeader>

            {loading ? (
              <div className="space-y-3">
                <div className="h-4 w-24 rounded bg-muted animate-pulse" />
                <div className="h-5 w-3/4 rounded bg-muted animate-pulse" />
                <div className="h-5 w-2/3 rounded bg-muted animate-pulse" />
                <div className="h-24 rounded bg-muted animate-pulse" />
                <div className="flex gap-2">
                  <div className="h-6 w-20 rounded bg-muted animate-pulse" />
                  <div className="h-6 w-24 rounded bg-muted animate-pulse" />
                </div>
              </div>
            ) : error ? (
              <div className="space-y-3">
                <p className="text-sm text-destructive">Unable to generate summary.</p>
                <p className="text-sm text-muted-foreground">{error}</p>
                <Button variant="default" onClick={() => onOpenChange(true)} className="mt-1">
                  Retry
                </Button>
              </div>
            ) : data ? (
              <div className="space-y-4">
                {data.title ? <h4 className="text-base md:text-lg font-semibold text-pretty">{data.title}</h4> : null}

                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={sentimentClass(data.sentiment)}>{data.sentiment || "neutral"}</Badge>
                  {readingMinutes ? <Badge variant="outline">{readingMinutes} min read</Badge> : null}
                </div>

                <p className="text-sm md:text-base text-pretty">{data.summary}</p>

                {Array.isArray(data.bullets) && data.bullets.length > 0 ? (
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Key points</div>
                    <ul className="list-disc pl-5 space-y-1">
                      {data.bullets.map((b, i) => (
                        <li key={i} className="text-sm text-muted-foreground">
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div className="flex items-center gap-2 pt-1">
                  {article?.url ? (
                    <Button
                      variant="default"
                      onClick={() => window.open(article.url!, "_blank", "noopener,noreferrer")}
                    >
                      Open Article
                    </Button>
                  ) : null}
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No summary available.</div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
