"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckedState } from "@radix-ui/react-checkbox"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

interface InterestFormProps {
    onSubmit: (data: any) => void
}

export function InterestForm({ onSubmit }: InterestFormProps) {
    const [step, setStep] = useState(1)
    const [country, setCountry] = useState("")
    const [genres, setGenres] = useState<string[]>([])
    const [language, setLanguage] = useState("en")
    const [readingTime, setReadingTime] = useState("10") // default 10 min

    const [trending, setTrending] = useState<CheckedState>(true)


    const allGenres = ["Technology", "Sports", "Finance", "Politics", "Science", "Entertainment", "Health"]

    const toggleGenre = (genre: string) => {
        if (genres.includes(genre)) {
            setGenres(genres.filter(g => g !== genre))
        } else if (genres.length < 3) {
            setGenres([...genres, genre])
        }
    }

    const handleNext = () => {
        if (step === 3) {
            onSubmit({ country, genres, language, readingTime, trending })
        } else {
            setStep(step + 1)
        }
    }

    const handleBack = () => {
        if (step > 1) setStep(step - 1)
    }

    return (
        <div className="w-1/2 mx-auto my-10 p-6 bg-gradient-to-r from-[#0d1c53] to-[#3f053f] rounded-lg shadow-lg text-white">
            <h2 className="text-2xl font-bold mb-4">Customize Your AI News Feed</h2>

            {/* Step 1: Country */}
            {step === 1 && (
                <div className="space-y-4">
                    <Label htmlFor="country">Select your country of interest</Label>
                    <Select onValueChange={setCountry} value={country}>
                        <SelectTrigger>
                            <SelectValue placeholder="Choose a country" />
                        </SelectTrigger>
                        <SelectContent>
                            {["India", "USA", "UK", "Canada", "Germany", "France", "Australia"].map(c => (
                                <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            {/* Step 2: Genres */}
            {step === 2 && (
                <div className="space-y-4">
                    <Label>Select your preferred news genres (max 3)</Label>
                    <div className="flex flex-wrap gap-2">
                        {allGenres.map(g => (
                            <Button
                                key={g}
                                variant={genres.includes(g) ? "default" : "outline"}
                                size="sm"
                                onClick={() => toggleGenre(g)}
                                className={
                                    cn("rounded-full text-zinc-800",
                                        genres.includes(g)
                                            ? "bg-green-600 text-white" : "")
                                }
                            >
                                {g}
                            </Button>
                        ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        {genres.length}/3 selected
                    </p>
                </div>
            )}

            {/* Step 3: Other Questions */}
            {step === 3 && (
                <div className="space-y-4">
                    <Label htmlFor="language">Preferred language</Label>
                    <Select onValueChange={setLanguage} value={language}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="hi">Hindi</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                        </SelectContent>
                    </Select>

                    <Label htmlFor="readingTime">Preferred reading time (minutes)</Label>
                    <Input
                        type="number"
                        id="readingTime"
                        value={readingTime}
                        onChange={(e) => setReadingTime(e.target.value)}
                        min={1}
                        max={30}
                    />

                    <div className="flex items-center gap-2">
                        <Checkbox
                            checked={trending}
                            onCheckedChange={setTrending}
                            id="trending"
                        />

                        <Label htmlFor="trending"> Use this if you want to see
                            <span className="font-semibold">
                                trending news notifications
                            </span>
                        </Label>
                    </div>
                </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
                {step > 1 ? (
                    <Button className="text-white " onClick={handleBack}>Back</Button>
                ) : <div />}
                <Button onClick={handleNext}>{step === 3 ? "Submit" : "Next"}</Button>
            </div>
        </div>
    )
}
