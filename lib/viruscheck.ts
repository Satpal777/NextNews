interface VirusTotalResponse {
  data: {
    attributes: {
      last_analysis_stats: {
        malicious: number
        suspicious: number
        undetected: number
        harmless: number
        timeout: number
      }
    }
  }
}

export interface URLSafetyResult {
  isSafe: boolean
  malicious: number
  suspicious: number
  harmless: number
  undetected: number
  riskLevel: "safe" | "low" | "medium" | "high"
  message: string
}

export async function checkURLSafety(url: string): Promise<URLSafetyResult> {
  try {
    const response = await fetch("/api/security", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    })

    
    if (!response.ok) {
      throw new Error("Failed to check URL safety")
    }
    
    const data: VirusTotalResponse = await response.json()
    console.log(data)
    const stats = data.data.attributes.last_analysis_stats

    const totalChecks = stats.malicious + stats.suspicious + stats.harmless + stats.undetected
    const riskScore = (stats.malicious + stats.suspicious) / totalChecks

    let riskLevel: URLSafetyResult["riskLevel"] = "safe"
    let message = "This URL appears to be safe"
    let isSafe = true

    if (stats.malicious > 0) {
      riskLevel = "high"
      message = `${stats.malicious} security vendors flagged this URL as malicious`
      isSafe = false
    } else if (stats.suspicious > 2) {
      riskLevel = "medium"
      message = `${stats.suspicious} security vendors flagged this URL as suspicious`
      isSafe = false
    } else if (stats.suspicious > 0) {
      riskLevel = "low"
      message = `${stats.suspicious} security vendors flagged this URL as suspicious`
      isSafe = true
    }

    return {
      isSafe,
      malicious: stats.malicious,
      suspicious: stats.suspicious,
      harmless: stats.harmless,
      undetected: stats.undetected,
      riskLevel,
      message,
    }
  } catch (error) {
    console.error("URL safety check failed:", error)
    return {
      isSafe: true, // Default to safe if check fails
      malicious: 0,
      suspicious: 0,
      harmless: 0,
      undetected: 0,
      riskLevel: "safe",
      message: "Unable to verify URL safety - proceeding with caution",
    }
  }
}
