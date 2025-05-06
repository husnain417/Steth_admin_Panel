"use client"

import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react"

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

interface ApiResponse {
  success: boolean;
  verifications: Verification[];
}

export default function StudentApprovalPage() {
  const router = useRouter()
  const [verifications, setVerifications] = useState<Verification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVerifications = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/student-verification/pending')
        
        if (!response.ok) {
          throw new Error('Failed to fetch verification data')
        }
        
        const data: ApiResponse = await response.json()
        
        if (data.success) {
          setVerifications(data.verifications)
        } else {
          throw new Error('API returned unsuccessful response')
        }
      } catch (err) {
        setError((err as Error).message)
        console.error('Error fetching verifications:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchVerifications()
  }, [])

  const handleRowClick = (verification: Verification) => {
    // Store the verification data in localStorage for the detail page to access
    localStorage.setItem('currentVerification', JSON.stringify(verification))
    router.push(`/student-approval/${verification._id}`)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Student Approval Requests</h2>
      <p className="mb-4">Review and approve student registration requests. Click on a row to view details.</p>
      
      {isLoading && <p className="text-center py-4">Loading verification requests...</p>}
      
      {error && <p className="text-red-500 text-center py-4">Error: {error}</p>}
      
      {!isLoading && !error && (
        <div className="border rounded-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="p-3 text-left">Student Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Registration Date</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {verifications.length > 0 ? (
                verifications.map((verification) => (
                  <tr 
                    key={verification._id} 
                    className="border-t hover:bg-gray-800 cursor-pointer transition-colors"
                    onClick={() => handleRowClick(verification)}
                  >
                    <td className="p-3">{verification.name}</td>
                    <td className="p-3">{verification.email}</td>
                    <td className="p-3">{formatDate(verification.verificationDate)}</td>
                    <td className="p-3">{verification.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-3 text-center">No pending verification requests found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}