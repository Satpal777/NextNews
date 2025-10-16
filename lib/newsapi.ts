import Sentiment from "sentiment";

interface NewsAPIArticle {
  source: {
    id: string | null
    name: string
  }
  author: string | null
  title: string
  description: string | null
  url: string
  urlToImage: string | null
  publishedAt: string
  content: string | null
}

interface NewsAPIResponse {
  status: string
  totalResults: number
  articles: NewsAPIArticle[]
}

export interface Article {
  id: string
  title: string
  excerpt: string
  content: string
  category: string
  author: string
  publishedAt: string
  imageUrl: string
  url: string
  source: string,
  views: number,
  likes: number,
  trending: boolean,
  sentiment: string
}

export class NewsAPIClient {
  private apiKey: string
  private baseUrl = process.env.NEWS_API_URL
  private sentiment: Sentiment;

  constructor(apiKey: string) {
    this.sentiment = new Sentiment();
    this.apiKey = apiKey
  }

  private async fetchFromAPI(endpoint: string, params: Record<string, string> = {}): Promise<NewsAPIResponse> {
    const url = new URL(`${this.baseUrl}${endpoint}`)

    // Add API key and default params
    url.searchParams.append("apiKey", this.apiKey)
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value)
    })

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`NewsAPI error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  private getSentimentEmoji(score:number) {
    if (score > 2) return "😄";   
    if (score > 0) return "🙂";   
    if (score === 0) return "😐"; 
    if (score > -2) return "☹️";  
    return "😠";                  
  }

  private mapArticle(newsApiArticle: NewsAPIArticle, category = "General"): Article {
    // Generate a unique ID from the URL
    const id = Buffer.from(newsApiArticle.url).toString("base64");
    const result = this.sentiment.analyze(newsApiArticle.description || "");
    return {
      id,
      title: newsApiArticle.title,
      excerpt: newsApiArticle.description || "",
      content: newsApiArticle.content || newsApiArticle.description || "",
      category,
      author: newsApiArticle.author || newsApiArticle.source.name || "Unknown",
      publishedAt: this.formatDate(newsApiArticle.publishedAt),
      imageUrl: newsApiArticle.urlToImage || "/placeholder.svg?height=400&width=600",
      url: newsApiArticle.url,
      source: newsApiArticle.source.name,
      likes: Math.floor(Math.random() * 1000),
      views: Math.floor(Math.random() * 10000),
      trending: true,
      sentiment: this.getSentimentEmoji(result.score)
    }
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours} hours ago`
    if (diffInHours < 48) return "1 day ago"
    return `${Math.floor(diffInHours / 24)} days ago`
  }

  async getTopHeadlines(country = "us", category?: string, pageSize = 20): Promise<Article[]> {
    const params: Record<string, string> = {
      country,
      pageSize: pageSize.toString(),
    }

    if (category && category !== "general") {
      params.category = category.toLowerCase()
    }

    const response = await this.fetchFromAPI("/top-headlines", params)
    return response.articles.map((article) => this.mapArticle(article, category || "General"))
  }

  async searchArticles(query: string, pageSize = 20, sortBy = "publishedAt"): Promise<Article[]> {
    const params = {
      q: query,
      pageSize: pageSize.toString(),
      sortBy,
      language: "en",
    }

    const response = await this.fetchFromAPI("/everything", params)
    return response.articles.map((article) => this.mapArticle(article))
  }

  async getArticlesByCategory(category: string, pageSize = 20): Promise<Article[]> {
    return this.getTopHeadlines("us", category, pageSize)
  }
}

export const newsAPI = new NewsAPIClient(process.env.NEWS_API_KEY || "")
