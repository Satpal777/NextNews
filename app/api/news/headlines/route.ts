import { type NextRequest, NextResponse } from "next/server"
import { newsAPI } from "@/lib/newsapi"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") || undefined
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "20")
    console.log(category);
    const articles = await newsAPI.getTopHeadlines("us", category, pageSize)
    return NextResponse.json({ articles })
  } catch (error) {
    console.error("Error fetching headlines:", error)
    return NextResponse.json({ error: "Failed to fetch news headlines" }, { status: 500 })
  }
}
