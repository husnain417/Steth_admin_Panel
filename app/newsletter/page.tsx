"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2, Send, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function NewsletterPage() {
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSendBulkEmail = async () => {
    if (!subject.trim() || !message.trim()) {
      setSendError("Please fill in both subject and message fields")
      return
    }

    setSending(true)
    setSendError(null)
    setSuccess(null)

    try {
      const response = await fetch("http://localhost:5000/api/subscribers/send-bulk-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject,
          message,
        }),
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      
      // More robust success checking
      // Check for explicit success property or success indicators in the message
      if (data.success === true || 
          (data.message && data.message.toLowerCase().includes('successfully'))) {
        setSuccess(data.message || "Emails sent successfully!")
        setSubject("")
        setMessage("")
      } else {
        // Only throw error if there's a clear error indication
        throw new Error(data.message || data.error || "Failed to send emails")
      }
    } catch (error) {
      console.error("Error sending bulk email:", error)
      
      // Extract meaningful error message
      let errorMessage = "Failed to send emails. Please try again."
      if (error instanceof Error) {
        // Don't show "success" messages as errors
        if (!error.message.toLowerCase().includes('successfully')) {
          errorMessage = error.message
        }
      }
      
      setSendError(errorMessage)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/dashboard">
            <Button variant="ghost" className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Newsletter Email</h1>
        </div>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Send Updates to Newsletter Users</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter email subject"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message"
              rows={5}
            />
          </div>
          {sendError && (
            <div className="text-red-500 text-sm">{sendError}</div>
          )}
          {success && (
            <div className="flex items-center gap-2 text-green-500 text-sm">
              <CheckCircle2 className="h-4 w-4" />
              {success}
            </div>
          )}
          <Button 
            onClick={handleSendBulkEmail} 
            disabled={sending}
            className="w-full sm:w-auto"
          >
            {sending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send to All Subscribers
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  )
}