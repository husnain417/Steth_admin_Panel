// Main List Page: StudentApprovalPage.tsx
"use client"

import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"

export default function StudentApprovalPage() {
  const router = useRouter()

  // Sample student data
  const students = [
    {
      id: "st1",
      name: "John Smith",
      email: "john.smith@example.com",
      date: "Apr 12, 2025",
      status: "Pending"
    },
    {
      id: "st2",
      name: "Maria Garcia",
      email: "maria.g@example.com",
      date: "Apr 13, 2025",
      status: "Pending"
    },
    {
      id: "st3",
      name: "David Johnson",
      email: "djohnson@example.com",
      date: "Apr 14, 2025",
      status: "Pending"
    }
  ]

  const handleRowClick = (studentId: string) => {
    router.push(`/student-approval/${studentId}`)
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Student Approval Requests</h2>
      <p className="mb-4">Review and approve student registration requests. Click on a row to view details.</p>
      
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
            {students.map((student) => (
              <tr 
                key={student.id} 
                className="border-t hover:bg-gray-800 cursor-pointer transition-colors"
                onClick={() => handleRowClick(student.id)}
              >
                <td className="p-3">{student.name}</td>
                <td className="p-3">{student.email}</td>
                <td className="p-3">{student.date}</td>
                <td className="p-3">{student.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
