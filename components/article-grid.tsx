"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, User, Eye, Heart, Share2, Bookmark, Sparkles } from "lucide-react"
import { AISummaryDialog } from "@/components/summarize-dialog"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useNews } from "@/hooks/news"
import { useEffect, useState } from "react"
import { URLSafetyModal } from "./safety-check-modal"
import { InterestForm } from "./for-you-form"

interface ArticleGridProps {
    category?: string
}

export function ArticleGrid({ category }: ArticleGridProps) {
    const [showInterestForm, setShowInterestForm] = useState(false)
    const [userInterests, setUserInterests] = useState<any>(null)

    useEffect(() => {
        if (category === "AI") {
            const storedInterests = localStorage.getItem("userInterests")
            if (!storedInterests) {
                setShowInterestForm(true)
            } else {
                setUserInterests(JSON.parse(storedInterests));
            }
        }
    }, [category,showInterestForm])


    const { data: session } = useSession()
    const router = useRouter()
    const { articles, loading, error } = useNews(category)
    const [summaryModal, setSummaryModal] = useState<{
        isOpen: boolean
        loading: boolean
        data: null | {
            title: string
            summary: string
            bullets: string[]
            sentiment: "positive" | "neutral" | "negative"
            reading_time_seconds: number
        }
        articleTitle: string
        articleImageUrl?: string
        articleAuthor?: string
        articlePublishedAt?: string
        articleExcerpt?: string
        articleCategory?: string
        url?: string
    }>({
        isOpen: false,
        loading: false,
        data: null,
        articleTitle: "",
        articleImageUrl: "",
        articleAuthor: "",
        articlePublishedAt: "",
        articleExcerpt: "",
        articleCategory: "",
    })

    const [safetyModal, setSafetyModal] = useState<{
        isOpen: boolean
        url: string
        articleTitle: string
        articleId: string
    }>({
        isOpen: false,
        url: "",
        articleTitle: "",
        articleId: "",
    });

    const requireAuth = (action: string) => {
        if (!session) {
            toast("Authentication Required", {
                description: `Please login to ${action} articles.`,
            })
            setTimeout(() => {
                router.push("/login")
            }, 2000)
            return false
        }
        return true
    }

    const handleLike = (articleId: string, articleTitle: string) => {
        if (requireAuth("like")) {
            toast("Article Liked!", {
                description: `You liked "${articleTitle}"`,
            })
        }
    }

    const handleShare = (articleId: string, articleTitle: string) => {
        if (requireAuth("share")) {
            if (navigator.share) {
                navigator.share({
                    title: articleTitle,
                    url: `${window.location.origin}/article/${articleId}`,
                })
            } else {
                navigator.clipboard.writeText(`${window.location.origin}/article/${articleId}`)
                toast("Link Copied!", {
                    description: "Article link copied to clipboard",
                })
            }
        }
    }

    const handleBookmark = (articleId: string, articleTitle: string) => {
        if (requireAuth("bookmark")) {
            toast("Article Bookmarked!", {
                description: `"${articleTitle}" saved to your bookmarks`,
            })
        }
    }


    const handleArticleClick = (article: any) => {
        setSafetyModal({
            isOpen: true,
            url: article.url,
            articleTitle: article.title,
            articleId: article.id,
        })
    }

    const handleSafetyModalClose = () => {
        setSafetyModal((prev) => ({ ...prev, isOpen: false }))
    }

    const handleProceedToArticle = () => {
        // Open the external URL in a new tab
        window.open(safetyModal.url, "_blank", "noopener,noreferrer")
    }

    const handleSummarize = async (article: any) => {
        setSummaryModal({
            isOpen: true,
            loading: true,
            data: null,
            articleTitle: article.title,
            articleImageUrl: article.imageUrl,
            articleAuthor: article.author,
            articlePublishedAt: article.publishedAt,
            articleExcerpt: article.excerpt,
            articleCategory: article.category,
            url: article.url
        })
    }


    const handleInterestSubmit = (data: any) => {
        localStorage.setItem("userInterests", JSON.stringify(data))
        setUserInterests(data)
        setShowInterestForm(false)
    }


    if (loading) {
        return (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="overflow-hidden animate-pulse">
                        <div className="h-64 bg-muted"></div>
                        <CardContent className="p-6">
                            <div className="h-4 bg-muted rounded mb-3"></div>
                            <div className="h-3 bg-muted rounded mb-4"></div>
                            <div className="flex justify-between">
                                <div className="h-3 bg-muted rounded w-20"></div>
                                <div className="h-3 bg-muted rounded w-16"></div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Failed to load articles: {error}</p>
            </div>
        )
    }

    if (category === "AI" && showInterestForm) {
        return <InterestForm onSubmit={handleInterestSubmit} />
    }

    return (
        <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article) => (
                    <Card
                        key={article.id}
                        className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg"
                    >
                        <div className="relative overflow-hidden">
                            <img
                                src={article.imageUrl || "/placeholder.svg"}
                                alt={article.title}
                                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                            <div className="absolute top-4 left-4 flex gap-2">
                                <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-gray-900 font-medium shadow-sm">
                                    {article.category}
                                </Badge>
                                {article.trending && (
                                    <Badge className="bg-red-500 text-white font-medium shadow-sm animate-pulse">🔥 Trending</Badge>
                                )}
                            </div>

                            <div className="absolute bottom-4 right-4 flex gap-2">

                                <div className="bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                                    <Eye className="h-3 w-3 text-white" />
                                    <span className="text-white text-xs font-medium">{article.views}</span>
                                </div>
                                <div className="bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                                    <Heart className="h-3 w-3 text-white" />
                                    <span className="text-white text-xs font-medium">{article.likes}</span>
                                </div>
                                <div className="bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center p-0 m-0 gap-1">
                                    {article.sentiment}
                                </div>
                            </div>
                        </div>

                        <CardContent className="p-6">
                            <h3 className="font-bold text-xl mb-3 line-clamp-2 text-balance leading-tight">
                                <button
                                    onClick={() => handleArticleClick(article)}
                                    className="hover:text-blue-600 transition-colors duration-200 group-hover:text-blue-600 text-left cursor-pointer"
                                >
                                    {article.title}
                                </button>
                            </h3>

                            <p className="text-muted-foreground text-sm mb-4 line-clamp-3 text-pretty leading-relaxed">
                                {article.excerpt}
                            </p>

                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                        <User className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{article.author}</p>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Clock className="h-3 w-3" />
                                            <span>{article.publishedAt}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 px-2 text-muted-foreground hover:text-yellow-500"
                                        onClick={() => handleBookmark(article.id, article.title)}
                                    >
                                        <Bookmark className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 px-2 text-muted-foreground hover:text-red-500"
                                        onClick={() => handleLike(article.id, article.title)}
                                    >
                                        <Heart className="h-4 w-4 mr-1" />
                                        {article.likes}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 px-2 text-muted-foreground hover:text-blue-500"
                                        onClick={() => handleShare(article.id, article.title)}
                                    >
                                        <Share2 className="h-4 w-4" />
                                    </Button>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 px-2 text-muted-foreground hover:text-emerald-600 cursor-pointer"
                                    onClick={() => handleSummarize(article)}
                                >
                                    <Sparkles className="h-4 w-4 mr-1" />
                                    Summarize
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <URLSafetyModal
                isOpen={safetyModal.isOpen}
                onClose={handleSafetyModalClose}
                url={safetyModal.url}
                articleTitle={safetyModal.articleTitle}
                onProceed={handleProceedToArticle}
            />
            <AISummaryDialog
                open={summaryModal.isOpen}
                onOpenChange={(open) => setSummaryModal((prev) => ({ ...prev, isOpen: open }))}
                article={{
                    title: summaryModal.articleTitle,
                    description: summaryModal.articleExcerpt,
                    urlToImage: summaryModal.articleImageUrl,
                    author: summaryModal.articleAuthor,
                    publishedAt: summaryModal.articlePublishedAt,
                    url: summaryModal.url
                }}
            />
        </>
    )
}
