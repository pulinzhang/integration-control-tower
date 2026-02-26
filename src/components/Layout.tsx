import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  GitBranch,
  Shield,
  MessageSquare,
  AlertTriangle,
  RefreshCw,
  Settings,
  HelpCircle,
  Search,
  Bell,
  ChevronLeft,
  ChevronRight,
  Server,
} from 'lucide-react'

const navItems = [
  { path: '/overview', label: 'Overview', icon: LayoutDashboard },
  { path: '/integrations', label: 'Integration Flows', icon: GitBranch },
  { path: '/governance', label: 'Governance Rules', icon: Shield },
  { path: '/messages', label: 'Message Center', icon: MessageSquare },
  { path: '/errors', label: 'Error Control', icon: AlertTriangle },
  { path: '/tcc', label: 'TCC Simulation', icon: RefreshCw },
]

const bottomNavItems = [
  { path: '/settings', label: 'Settings', icon: Settings },
  { path: '/help', label: 'Help', icon: HelpCircle },
]

function Layout() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex h-screen bg-obsidian">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 h-12 bg-charcoal border-b border-graphite z-50 flex items-center px-4">
        {/* Logo */}
        <div className={`flex items-center gap-3 ${collapsed ? 'w-16' : 'w-60'}`}>
          <div className="w-7 h-7 bg-electric-cyan flex items-center justify-center">
            <Server className="w-4 h-4 text-obsidian" />
          </div>
          {!collapsed && (
            <span className="font-semibold text-white text-sm tracking-tight">
              Integration Control Tower
            </span>
          )}
        </div>

        {/* Global Search */}
        <div className="flex-1 max-w-lg mx-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
            <input
              type="text"
              placeholder="Search transactions, trace IDs, integrations..."
              className="w-full bg-slate-dark border border-graphite rounded-sm pl-10 pr-16 py-1.5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-electric-cyan"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 bg-graphite rounded text-xs text-gray-500 font-mono">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* System Status */}
          <div className="flex items-center gap-2 px-2.5 py-1 bg-graphite/30 rounded-sm">
            <span className="w-1.5 h-1.5 rounded-sm bg-emerald" />
            <span className="text-xs text-gray-400">OPERATIONAL</span>
          </div>

          {/* Notifications */}
          <button className="relative p-1.5 hover:bg-slate-dark rounded-sm transition-colors">
            <Bell className="w-4 h-4 text-gray-500" />
            <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-coral rounded-sm" />
          </button>

          {/* User */}
          <div className="flex items-center gap-2 pl-3 border-l border-graphite">
            <div className="w-6 h-6 bg-electric-cyan flex items-center justify-center text-xs font-semibold text-obsidian">
              A
            </div>
          </div>
        </div>
      </div>

      {/* Left Navigation */}
      <nav
        className={`fixed left-0 top-12 bottom-0 bg-charcoal border-r border-graphite flex flex-col z-40 ${
          collapsed ? 'w-14' : 'w-56'
        }`}
      >
        {/* Main Navigation */}
        <div className="flex-1 py-3 overflow-y-auto">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 mx-2 transition-colors ${
                  isActive
                    ? 'bg-slate-dark text-electric-cyan border-l-2 border-electric-cyan -ml-0.5 pl-2.5'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-slate-dark/50'
                }`
              }
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && (
                <span className="text-xs font-medium tracking-wide">{item.label}</span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Bottom Navigation */}
        <div className="border-t border-graphite py-2">
          {bottomNavItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 mx-2 transition-colors ${
                  isActive
                    ? 'bg-slate-dark text-electric-cyan'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-slate-dark/50'
                }`
              }
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && (
                <span className="text-xs font-medium tracking-wide">{item.label}</span>
              )}
            </NavLink>
          ))}

          {/* Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-2.5 px-3 py-2 mx-2 mt-1 text-gray-600 hover:text-gray-400 hover:bg-slate-dark/50 transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span className="text-xs">Collapse</span>
              </>
            )}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className={`flex-1 mt-12 overflow-y-auto ${collapsed ? 'ml-14' : 'ml-56'}`}>
        <div className="p-5">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default Layout
