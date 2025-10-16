import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    const apiKey = process.env.VIRUSTOTAL_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "VirusTotal API key not configured" }, { status: 500 })
    }

    const cleanedUrl = url.replace(/\/$/, ""); // remove trailing /
    const encodedUrl = Buffer.from(cleanedUrl).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")

    const response = await fetch(`https://www.virustotal.com/api/v3/urls/${encodedUrl}`, {
      headers: {
        "x-apikey": apiKey,
      },
    })

    console.log(response);
    if (!response.ok) {
      throw new Error(`VirusTotal API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("VirusTotal check failed:", error)
    return NextResponse.json({ error: "Failed to check URL safety" }, { status: 500 })
  }
}
