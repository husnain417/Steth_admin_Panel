"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Verification {
  _id: string;
  name: string;
  email: string;
  profilePicUrl: string;
  studentId: string;
  institutionName: string;
  proofDocument: string;
  status: string;
  verificationDate: string;
}

export default function StudentApprovalDetail() {
  const router = useRouter()
  const params = useParams()
  const studentId = params?.studentId as string

  const [isLoading, setIsLoading] = useState(false)
  const [studentData, setStudentData] = useState<Verification | null>(null)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    if (!studentId) return

    const storedData = localStorage.getItem("currentVerification")
    if (storedData) {
      try {
        const verification = JSON.parse(storedData) as Verification
        if (verification._id === studentId) {
          setStudentData(verification)
          return
        }
      } catch (e) {
        console.error("Error parsing stored verification data:", e)
      }
    }

    const fetchVerification = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/student-verification/${studentId}`)
        if (!response.ok) throw new Error("Failed to fetch student verification data")
        const data = await response.json()
        if (data.success && data.verification) {
          setStudentData(data.verification)
        } else {
          throw new Error("Failed to retrieve student data")
        }
      } catch (err) {
        setFetchError((err as Error).message)
        console.error("Error fetching student verification:", err)
      }
    }

    fetchVerification()
  }, [studentId])
  
  const handleApprove = async () => {
    setIsLoading(true)
    try {
      // Updated to use the correct POST endpoint for approval
      const response = await fetch(`http://localhost:5000/api/student-verification/${studentData?._id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MDY2YWI0M2JlMjJkMzA3MWFhY2FiMCIsInVzZXJuYW1lIjoiYWRtaW4xIiwiZW1haWwiOiJhZG1pbkBleGFtcGxlLmNvbSIsImlhdCI6MTc0NjMwMjA1MiwiZXhwIjoxNzQ2NDc0ODUyfQ.jC2PN43YDDHvj-8SdBx12TrFojNd95GU1Nq8C4DFeOU`
        }
        
        // You may need to include authentication token in headers if required
        // headers: {
        //   'Content-Type': 'application/json',
        //   'Authorization': `Bearer ${yourAuthToken}`
        // },
      })
      
      if (!response.ok) {
        throw new Error('Failed to approve student')
      }
      
      // Handle successful approval
      router.push("/student-approval")
    } catch (err) {
      console.error('Error approving student:', err)
      alert('Failed to approve student. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleDeny = async () => {
    setIsLoading(true)
    try {
      // Updated to use the correct POST endpoint for rejection
      const response = await fetch(`http://localhost:5000/api/student-verification/${studentData?._id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MDY2YWI0M2JlMjJkMzA3MWFhY2FiMCIsInVzZXJuYW1lIjoiYWRtaW4xIiwiZW1haWwiOiJhZG1pbkBleGFtcGxlLmNvbSIsImlhdCI6MTc0NjMwMjA1MiwiZXhwIjoxNzQ2NDc0ODUyfQ.jC2PN43YDDHvj-8SdBx12TrFojNd95GU1Nq8C4DFeOU`
        }
        
        // You may need to include authentication token in headers if required
        // headers: {
        //   'Content-Type': 'application/json',
        //   'Authorization': `Bearer ${yourAuthToken}`
        // },
      })
      
      if (!response.ok) {
        throw new Error('Failed to reject student')
      }
      
      // Handle successful denial
      router.push("/student-approval")
    } catch (err) {
      console.error('Error rejecting student:', err)
      alert('Failed to reject student. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleBack = () => {
    router.push("/student-approval")
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
  
  // Construct the full proof document URL
  const getProofDocumentUrl = (path: string) => {
    if (!path) return ''
    // Adjust this depending on how your server serves static files
    return `http://localhost:5000/${path}`
  }
  
  // Display placeholder or document viewer since direct image loading might be blocked by CORS
  const renderDocumentSection = () => {
    if (!studentData?.proofDocument) {
      return (
        <div className="p-4 text-center text-muted-foreground">No ID card uploaded</div>
      )
    }
    
    // Create a proxy URL for the image
    const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(studentData.proofDocument)}`;
    
    return (
      <div className="space-y-4">
        <div className="relative">
          <img 
            src={proxyUrl} 
            alt="Student ID Card" 
            className="w-full object-contain max-h-[500px]"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                const fallback = document.createElement('div');
                fallback.className = 'p-4 text-center';
                fallback.innerHTML = `
                  <p class="mb-2">Image could not be loaded directly.</p>
                  <p class="text-sm text-muted-foreground mb-4">Document path: ${studentData.proofDocument}</p>
                  <a href="${studentData.proofDocument}" target="_blank" 
                     class="px-4 py-2 bg-primary text-primary-foreground rounded-md inline-block">
                    View Document in New Tab
                  </a>
                `;
                parent.appendChild(fallback);
              }
            }}
          />
          <div className="absolute top-2 right-2">
            <a 
              href={studentData.proofDocument} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-3 py-1 bg-black/50 text-white rounded-md text-sm hover:bg-black/70"
            >
              Open in New Tab
            </a>
          </div>
        </div>
      </div>
    )
  }
  
  if (fetchError) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to List
        </Button>
        <Card className="p-6">
          <p className="text-red-500 text-center">Error: {fetchError}</p>
        </Card>
      </div>
    )
  }
  
  if (!studentData) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to List
        </Button>
        <Card className="p-6">
          <p className="text-center">Loading student information...</p>
        </Card>
      </div>
    )
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
                  <span className="text-muted-foreground">Student ID:</span>
                  <span className="col-span-2 font-medium">{studentData.studentId}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-muted-foreground">Institution:</span>
                  <span className="col-span-2 font-medium">{studentData.institutionName}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-muted-foreground">Submitted:</span>
                  <span className="col-span-2 font-medium">{formatDate(studentData.verificationDate)}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="col-span-2 font-medium">{studentData.status}</span>
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
            <h3 className="text-lg font-medium mb-2">Student ID Card</h3>
            <div className="border rounded-md overflow-hidden">
              {renderDocumentSection()}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}