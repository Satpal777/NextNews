"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Shield, ShieldAlert, ShieldCheck, ShieldX, ExternalLink, X } from "lucide-react"
import { URLSafetyResult, checkURLSafety } from "@/lib/viruscheck"

interface URLSafetyModalProps {
    isOpen: boolean
    onClose: () => void
    url: string
    articleTitle: string
    onProceed: () => void
}

export function URLSafetyModal({ isOpen, onClose, url, articleTitle, onProceed }: URLSafetyModalProps) {
    const [isChecking, setIsChecking] = useState(false)
    const [result, setResult] = useState<URLSafetyResult | null>(null)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        if (isOpen && !isChecking && !result) {
            checkURL()
        }
    }, [isOpen])

    const checkURL = async () => {
        setIsChecking(true)
        setProgress(0)

        // Simulate progress animation
        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 90) {
                    clearInterval(progressInterval)
                    return 90
                }
                return prev + Math.random() * 15
            })
        }, 200)

        try {
            const safetyResult = await checkURLSafety(url);

            clearInterval(progressInterval)
            setProgress(100)

            setTimeout(() => {
                setResult(safetyResult)
                setIsChecking(false)

                if (safetyResult.isSafe) {
                    setTimeout(() => {
                        onProceed()
                        onClose()
                    }, 1000) // Show success for 1 second then redirect
                }
            }, 500)
        } catch (error) {
            clearInterval(progressInterval)
            setIsChecking(false)
            const fallbackResult = {
                isSafe: true,
                malicious: 0,
                suspicious: 0,
                harmless: 0,
                undetected: 0,
                riskLevel: "safe" as const,
                message: "Unable to verify URL safety - proceeding with caution",
            }
            setResult(fallbackResult)

            setTimeout(() => {
                onProceed()
                onClose()
            }, 1000)
        }
    }

    const handleProceed = () => {
        onProceed()
        onClose()
    }

    const getRiskIcon = (riskLevel: string) => {
        switch (riskLevel) {
            case "safe":
                return <ShieldCheck className="h-8 w-8 text-green-500" />
            case "low":
                return <Shield className="h-8 w-8 text-yellow-500" />
            case "medium":
                return <ShieldAlert className="h-8 w-8 text-orange-500" />
            case "high":
                return <ShieldX className="h-8 w-8 text-red-500" />
            default:
                return <Shield className="h-8 w-8 text-gray-500" />
        }
    }

    const getRiskColor = (riskLevel: string) => {
        switch (riskLevel) {
            case "safe":
                return "text-green-600 bg-green-50 border-green-200"
            case "low":
                return "text-yellow-600 bg-yellow-50 border-yellow-200"
            case "medium":
                return "text-orange-600 bg-orange-50 border-orange-200"
            case "high":
                return "text-red-600 bg-red-50 border-red-200"
            default:
                return "text-gray-600 bg-gray-50 border-gray-200"
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        URL Safety Check
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="text-center">
                        <h3 className="font-medium text-lg mb-2 text-balance">{articleTitle}</h3>
                        <p className="text-sm text-muted-foreground break-all">{url}</p>
                    </div>

                    {isChecking && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-center">
                                <div className="relative">
                                    <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-500"></div>
                                    <Shield className="absolute inset-0 m-auto h-6 w-6 text-blue-500" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Scanning URL...</span>
                                    <span>{Math.round(progress)}%</span>
                                </div>
                                <Progress value={progress} className="h-2" />
                            </div>
                            <p className="text-center text-sm text-muted-foreground">Checking URL against security databases</p>
                        </div>
                    )}

                    {result && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-center">{getRiskIcon(result.riskLevel)}</div>

                            <div className={`p-4 rounded-lg border ${getRiskColor(result.riskLevel)}`}>
                                <div className="text-center space-y-2">
                                    <h4 className="font-semibold capitalize">{result.riskLevel} Risk Level</h4>
                                    <p className="text-sm">{result.message}</p>
                                    {result.isSafe && <p className="text-xs text-green-600 font-medium">Redirecting automatically...</p>}
                                </div>
                            </div>

                            {(result.malicious > 0 || result.suspicious > 0) && (
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="text-center p-3 bg-red-50 rounded-lg">
                                        <div className="font-semibold text-red-600">{result.malicious}</div>
                                        <div className="text-red-500">Malicious</div>
                                    </div>
                                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                                        <div className="font-semibold text-orange-600">{result.suspicious}</div>
                                        <div className="text-orange-500">Suspicious</div>
                                    </div>
                                </div>
                            )}

                            {!result.isSafe && (
                                <div className="flex gap-3">
                                    <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                                        <X className="h-4 w-4 mr-2" />
                                        Cancel
                                    </Button>
                                    <Button onClick={handleProceed} variant="destructive" className="flex-1">
                                        <ExternalLink className="h-4 w-4 mr-2" />
                                        Open Anyway
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
