"use client"

import { useState } from "react"
import type { User } from "firebase/auth"
import { updateProfile, updatePassword, deleteUser } from "firebase/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { UserIcon, Shield, Palette, Download, Trash2, Save, ArrowLeft, Calendar, MessageSquare } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useChatHistory } from "@/hooks/use-chat-history"

interface SettingsPageProps {
  user: User
  onBack: () => void
}

export default function SettingsPage({ user, onBack }: SettingsPageProps) {
  const [displayName, setDisplayName] = useState(user.displayName || "")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [autoSave, setAutoSave] = useState(true)

  const { chats, clearAllChats } = useChatHistory(user.uid)

  const handleUpdateProfile = async () => {
    setLoading(true)
    try {
      await updateProfile(user, { displayName })
      toast({ title: "Profile updated successfully!" })
    } catch (error: any) {
      toast({
        title: "Failed to update profile",
        description: error.message,
        variant: "destructive",
      })
    }
    setLoading(false)
  }

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        variant: "destructive",
      })
      return
    }

    if (newPassword.length < 6) {
      toast({
        title: "Password must be at least 6 characters",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      await updatePassword(user, newPassword)
      setNewPassword("")
      setConfirmPassword("")
      toast({ title: "Password updated successfully!" })
    } catch (error: any) {
      toast({
        title: "Failed to update password",
        description: error.message,
        variant: "destructive",
      })
    }
    setLoading(false)
  }

  const handleDeleteAccount = async () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        await deleteUser(user)
        toast({ title: "Account deleted successfully" })
      } catch (error: any) {
        toast({
          title: "Failed to delete account",
          description: error.message,
          variant: "destructive",
        })
      }
    }
  }

  const handleClearChatHistory = () => {
    if (confirm("Are you sure you want to clear all chat history? This action cannot be undone.")) {
      clearAllChats()
      toast({ title: "Chat history cleared successfully" })
    }
  }

  const exportChatHistory = () => {
    const dataStr = JSON.stringify(chats, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `vidya-ai-chat-history-${new Date().toISOString().split("T")[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
    toast({ title: "Chat history exported successfully!" })
  }

  const totalMessages = chats.reduce((total, chat) => total + chat.messages.length, 0)
  const accountAge = Math.floor(
    (Date.now() - (user.metadata.creationTime ? new Date(user.metadata.creationTime).getTime() : Date.now())) /
      (1000 * 60 * 60 * 24),
  )

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Chat
        </Button>
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserIcon className="h-5 w-5" />
                <span>Profile Information</span>
              </CardTitle>
              <CardDescription>Manage your personal information and profile settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.photoURL || ""} />
                  <AvatarFallback className="text-lg">
                    {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">{user.displayName || "User"}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <div className="flex space-x-2">
                    <Badge variant="secondary">
                      <Calendar className="h-3 w-3 mr-1" />
                      {accountAge} days ago
                    </Badge>
                    <Badge variant="outline">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      {totalMessages} messages
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your display name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" value={user.email || ""} disabled className="bg-gray-50" />
                </div>
              </div>

              <Button onClick={handleUpdateProfile} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                Save Profile
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security Settings</span>
              </CardTitle>
              <CardDescription>Manage your account security and authentication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Change Password</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
                <Button onClick={handleUpdatePassword} disabled={loading}>
                  Update Password
                </Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Account Status</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-green-600 font-medium">Email Verified</div>
                    <div className="text-sm text-gray-500">{user.emailVerified ? "Verified" : "Not Verified"}</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-blue-600 font-medium">Last Sign In</div>
                    <div className="text-sm text-gray-500">
                      {user.metadata.lastSignInTime
                        ? new Date(user.metadata.lastSignInTime).toLocaleDateString()
                        : "Unknown"}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-purple-600 font-medium">Provider</div>
                    <div className="text-sm text-gray-500">
                      {user.providerData[0]?.providerId === "google.com" ? "Google" : "Email"}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>Preferences</span>
              </CardTitle>
              <CardDescription>Customize your app experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifications</Label>
                    <p className="text-sm text-gray-500">Receive notifications about new features and updates</p>
                  </div>
                  <Switch checked={notifications} onCheckedChange={setNotifications} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Dark Mode</Label>
                    <p className="text-sm text-gray-500">Use dark theme for better night viewing</p>
                  </div>
                  <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-save Chats</Label>
                    <p className="text-sm text-gray-500">Automatically save your conversations</p>
                  </div>
                  <Switch checked={autoSave} onCheckedChange={setAutoSave} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Download className="h-5 w-5" />
                <span>Data Management</span>
              </CardTitle>
              <CardDescription>Manage your chat history and data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{chats.length}</div>
                  <div className="text-sm text-gray-500">Total Chats</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{totalMessages}</div>
                  <div className="text-sm text-gray-500">Total Messages</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round(JSON.stringify(chats).length / 1024)}KB
                  </div>
                  <div className="text-sm text-gray-500">Data Size</div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Export & Import</h4>
                <div className="flex space-x-4">
                  <Button onClick={exportChatHistory} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Chat History
                  </Button>
                  <Button onClick={handleClearChatHistory} variant="outline">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All Chats
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-600">
                <Trash2 className="h-5 w-5" />
                <span>Danger Zone</span>
              </CardTitle>
              <CardDescription>Irreversible account actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                <h4 className="font-medium text-red-800 mb-2">Delete Account</h4>
                <p className="text-sm text-red-600 mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <Button onClick={handleDeleteAccount} variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
