"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2, Send, CheckCircle2, Upload, X } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Image from "next/image"

type UploadedImage = {
  file: File;
  preview: string;
}

export default function NewsletterPage() {
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setUploadError(null)

    try {
      const newImages = Array.from(files).map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }))
      setUploadedImages(prev => [...prev, ...newImages])
    } catch (error) {
      console.error('Error processing image:', error)
      setUploadError('Failed to process image. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    setUploadedImages(prev => {
      const newImages = [...prev]
      URL.revokeObjectURL(newImages[index].preview)
      newImages.splice(index, 1)
      return newImages
    })
  }

  const handleSendBulkEmail = async () => {
    if (!subject.trim() || !message.trim()) {
      setSendError("Please fill in both subject and message fields")
      return
    }

    setSending(true)
    setSendError(null)
    setSuccess(null)

    try {
      const formData = new FormData()
      formData.append('subject', subject)
      formData.append('message', message)
      uploadedImages.forEach((image, index) => {
        formData.append(`images`, image.file)
      })

      const response = await fetch("https://steth-backend.onrender.com/api/subscribers/send-bulk-email", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      
      if (data.success === true || 
          (data.message && data.message.toLowerCase().includes('successfully'))) {
        setSuccess(data.message || "Emails sent successfully!")
        setSubject("")
        setMessage("")
        // Clean up image previews
        uploadedImages.forEach(image => URL.revokeObjectURL(image.preview))
        setUploadedImages([])
      } else {
        throw new Error(data.message || data.error || "Failed to send emails")
      }
    } catch (error) {
      console.error("Error sending bulk email:", error)
      
      let errorMessage = "Failed to send emails. Please try again."
      if (error instanceof Error) {
        if (!error.message.toLowerCase().includes('successfully')) {
          errorMessage = error.message
        }
      }
      
      setSendError(errorMessage)
    } finally {
      setSending(false)
    }
  }

  // Cleanup preview URLs when component unmounts
  useEffect(() => {
    return () => {
      uploadedImages.forEach(image => URL.revokeObjectURL(image.preview))
    }
  }, [uploadedImages])

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

          {/* Image Upload Section */}
          <div className="space-y-2">
            <Label>Images</Label>
            <div className="flex flex-wrap gap-4">
              {uploadedImages.map((image, index) => (
                <div key={index} className="relative group">
                  <div className="w-24 h-24 relative rounded-lg overflow-hidden border">
                    <Image
                      src={image.preview}
                      alt="Uploaded image"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <label className="w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
                {uploading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                ) : (
                  <Upload className="h-6 w-6 text-gray-400" />
                )}
              </label>
            </div>
            {uploadError && (
              <div className="text-red-500 text-sm">{uploadError}</div>
            )}
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