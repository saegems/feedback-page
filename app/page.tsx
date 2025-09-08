"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"

export default function RetroFeedbackPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 0,
    review: "",
  })

  const [hoveredStar, setHoveredStar] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")
  const [submitError, setSubmitError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.email && formData.rating && formData.review) {
      setIsSubmitting(true)
      setSubmitMessage("")
      setSubmitError("")

      try {
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL
        if (!serverUrl) {
          throw new Error("Server URL not configured")
        }

        const response = await fetch(`${serverUrl}/api/feedback/submit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user: {
              username: formData.name
            },
            email: formData.email,
            rating: formData.rating,
            review: formData.review,
          }),
        })

        const data = await response.json()

        if (response.ok) {
          setSubmitMessage(data.message || "Feedback submitted successfully!")
          setFormData({ name: "", email: "", rating: 0, review: "" })
        } else {
          setSubmitError(data.error || "Failed to submit feedback")
        }
      } catch (error) {
        console.error("Error submitting feedback:", error)
        setSubmitError(error instanceof Error ? error.message : "Network error occurred")
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const renderStars = (rating: number, interactive = false) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-6 h-6 pixelated transition-all duration-200 ${
          i < (interactive ? hoveredStar || formData.rating : rating)
            ? "fill-primary text-primary"
            : "text-muted-foreground"
        } ${interactive ? "cursor-pointer hover:scale-110" : ""}`}
        onClick={interactive ? () => setFormData({ ...formData, rating: i + 1 }) : undefined}
        onMouseEnter={interactive ? () => setHoveredStar(i + 1) : undefined}
        onMouseLeave={interactive ? () => setHoveredStar(0) : undefined}
      />
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted p-4">
      <header className="text-center py-8">
        <h1 className="text-4xl md:text-6xl font-bold pixel-pulse retro-title">saegems</h1>
      </header>

      <div className="max-w-2xl mx-auto">
        <Card className="retro-border bg-card/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-center" style={{ fontFamily: '"Press Start 2P", monospace' }}>
              Submit Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {submitMessage && (
                <div className="p-3 bg-green-500/20 border border-green-500 rounded text-green-400 text-sm retro-border">
                  {submitMessage}
                </div>
              )}
              {submitError && (
                <div className="p-3 bg-red-500/20 border border-red-500 rounded text-red-400 text-sm retro-border">
                  {submitError}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name" style={{ fontFamily: '"Source Sans Pro", sans-serif' }} className="font-semibold">
                  Username
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="retro-border bg-input/50 focus:bg-input transition-colors"
                  placeholder="Enter your saegems username..."
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  style={{ fontFamily: '"Source Sans Pro", sans-serif' }}
                  className="font-semibold"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="retro-border bg-input/50 focus:bg-input transition-colors"
                  placeholder="saygems@fromyourfingers.com"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label style={{ fontFamily: '"Source Sans Pro", sans-serif' }} className="font-semibold">
                  Rating
                </Label>
                <div className="flex gap-1">{renderStars(formData.rating, !isSubmitting)}</div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="review"
                  style={{ fontFamily: '"Source Sans Pro", sans-serif' }}
                  className="font-semibold"
                >
                  Review
                </Label>
                <Textarea
                  id="review"
                  value={formData.review}
                  onChange={(e) => setFormData({ ...formData, review: e.target.review })}
                  className="retro-border bg-input/50 focus:bg-input transition-colors min-h-[120px]"
                  placeholder="Share your chatting experience..."
                  required
                  disabled={isSubmitting}
                />
              </div>

              <Button
                type="submit"
                className="w-full retro-border bg-primary hover:bg-secondary transition-all duration-300 pixel-pulse"
                style={{ fontFamily: '"Press Start 2P", monospace' }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <footer className="text-center py-8 mt-12">
        <p className="text-muted-foreground" style={{ fontFamily: '"Press Start 2P", monospace' }}>
          {"< Go Retro in the big 2025 >"}
        </p>
      </footer>
    </div>
  )
}
