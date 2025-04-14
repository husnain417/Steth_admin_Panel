"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Mock Input and Switch components
const Input = ({ value }: { value: string }) => {
  return <input type="text" value={value} className="w-full p-2 border rounded-md bg-background" />
}

const Switch = () => {
  return <div className="w-10 h-5 bg-primary rounded-full" />
}

export default function SettingsPage() {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Settings</h2>
      <p className="mb-4">Manage your account and application settings.</p>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Account Settings</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input value="admin@steth.com" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Username</label>
                <Input value="admin_steth" />
              </div>
            </div>
            <Button>Update Account</Button>
          </div>
        </div>
        
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-2">Notification Settings</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Email Notifications</span>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <span>SMS Notifications</span>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <span>Push Notifications</span>
              <Switch />
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}