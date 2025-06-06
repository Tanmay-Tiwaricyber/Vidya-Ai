"use client"

import { type User, signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Brain,
  BookOpen,
  HelpCircle,
  Baby,
  Calendar,
  Code,
  Calculator,
  FlaskConical,
  Lightbulb,
  Building,
  BookMarked,
  Zap,
  GitBranch,
  Users,
  FileText,
  Briefcase,
  MessageCircle,
  Eye,
  Castle,
  GraduationCap,
  Rocket,
  UserCheck,
  LogOut,
  X,
  Settings,
  History,
  Search,
  Languages,
  Presentation,
  StickyNote,
  CalendarDays,
  Target,
  Repeat,
  Focus,
  BrainIcon as BrainstormIcon,
  BarChart3,
  Scale,
  Clock,
  BookType,
  FigmaIcon as FormulaIcon,
  Quote,
  CheckCircle,
  MessageSquareText,
  Handshake,
  Crown,
  Users2,
} from "lucide-react"
import { type AIFeature, aiFeatures } from "@/types/ai-features"
import { cn } from "@/lib/utils"

interface SidebarProps {
  user: User
  selectedFeature: AIFeature
  onFeatureSelect: (feature: AIFeature) => void
  isOpen: boolean
  onToggle: () => void
  onSettingsClick: () => void
  onHistoryToggle: () => void
  showHistory: boolean
}

const featureIcons: Record<AIFeature, any> = {
  chat: MessageCircle,
  summarize: BookOpen,
  flashcards: Brain,
  quiz: HelpCircle,
  eli5: Baby,
  studyplan: Calendar,
  codeexplain: Code,
  mathsolver: Calculator,
  labs: FlaskConical,
  sandbox: Code,
  whatif: Lightbulb,
  knowledge: Building,
  textbook: BookMarked,
  motivation: Zap,
  mindmap: GitBranch,
  debate: Users,
  essay: FileText,
  career: Briefcase,
  language: Languages,
  visual: Eye,
  memory: Castle,
  exam: GraduationCap,
  projects: Rocket,
  review: UserCheck,
  research: Search,
  translate: Languages,
  creative: FileText,
  homework: BookOpen,
  presentation: Presentation,
  notes: StickyNote,
  schedule: CalendarDays,
  goals: Target,
  habits: Repeat,
  focus: Focus,
  brainstorm: BrainstormIcon,
  analyze: BarChart3,
  compare: Scale,
  timeline: Clock,
  dictionary: BookType,
  formula: FormulaIcon,
  citation: Quote,
  proofread: CheckCircle,
  interview: MessageSquareText,
  negotiation: Handshake,
  leadership: Crown,
  teamwork: Users2,
}

export default function Sidebar({
  user,
  selectedFeature,
  onFeatureSelect,
  isOpen,
  onToggle,
  onSettingsClick,
  onHistoryToggle,
  showHistory,
}: SidebarProps) {
  const handleSignOut = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onToggle} />}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed lg:relative inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-purple-600" />
              <h1 className="text-xl font-bold text-gray-900">Vidya AI</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={onHistoryToggle}>
                <History className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onToggle} className="lg:hidden">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* User info */}
          <div className="p-4 border-b">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={user.photoURL || ""} />
                <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user.displayName || "User"}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">AI Features</h3>
              {Object.entries(aiFeatures).map(([key, feature]) => {
                const Icon = featureIcons[key as AIFeature]
                return (
                  <Button
                    key={key}
                    variant={selectedFeature === key ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start text-left h-auto p-3",
                      selectedFeature === key && "bg-purple-50 text-purple-700 border-purple-200",
                    )}
                    onClick={() => onFeatureSelect(key as AIFeature)}
                  >
                    <Icon className="mr-3 h-4 w-4 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{feature.name}</div>
                      <div className="text-xs text-gray-500 mt-1 line-clamp-2">{feature.description}</div>
                    </div>
                  </Button>
                )
              })}
            </div>
          </ScrollArea>

          {/* Sign out */}
          <div className="p-4 border-t space-y-2">
            <Button variant="outline" onClick={onSettingsClick} className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button variant="outline" onClick={handleSignOut} className="w-full justify-start">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
