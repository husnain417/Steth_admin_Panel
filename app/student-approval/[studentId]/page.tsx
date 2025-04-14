// Detail Page: StudentApprovalDetail.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface StudentDetailProps {
  params: {
    studentId: string
  }
}

export default function StudentApprovalDetail({ params }: StudentDetailProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  
  // In a real app, you would fetch this data based on the studentId
  const studentData = {
    id: params.studentId,
    name: params.studentId === "st1" ? "John Smith" : 
          params.studentId === "st2" ? "Maria Garcia" : "David Johnson",
    email: params.studentId === "st1" ? "john.smith@example.com" : 
           params.studentId === "st2" ? "maria.g@example.com" : "djohnson@example.com",
    university: "State University",
    idCardUrl: "/card.webp" // Placeholder for ID card image
  }
  
  const handleApprove = async () => {
    setIsLoading(true)
    // Here you would make an API call to approve the student
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    router.push("/student-approval")
  }
  
  const handleDeny = async () => {
    setIsLoading(true)
    // Here you would make an API call to deny the student
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    router.push("/student-approval")
  }
  
  const handleBack = () => {
    router.push("/student-approval")
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to List
        </Button>
        <h1 className="text-2xl font-bold">Student Approval Details</h1>
      </div>
      
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Student Information</h3>
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="col-span-2 font-medium">{studentData.name}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="col-span-2 font-medium">{studentData.email}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-muted-foreground">University:</span>
                  <span className="col-span-2 font-medium">{studentData.university}</span>
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <div className="flex gap-4">
                <Button 
                  onClick={handleApprove}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Approve
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleDeny}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Deny
                </Button>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">ID Card</h3>
            <div className="border rounded-md overflow-hidden">
              <img 
                src={studentData.idCardUrl} 
                alt="Student ID Card" 
                className="w-full object-cover"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}