"use client"

import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Menu, X, LogOut, LayoutDashboard, Users, FileText, User, Bell, UserCircle } from "lucide-react"

const DashboardLayout = ({ children, userRole }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const isEmployer = userRole === "employer"

  const employerLinks = [
    { name: "Dashboard", href: "/employer/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: "Managers", href: "/employer/managers", icon: <Users className="w-5 h-5" /> },
    { name: "Leads", href: "/employer/leads", icon: <FileText className="w-5 h-5" /> },
    { name: "Mon Profil", href: "/profile/me", icon: <UserCircle className="w-5 h-5" /> },
  ]

  const managerLinks = [
    { name: "Leads", href: "/manager/leads", icon: <FileText className="w-5 h-5" /> },
    { name: "Mon Profil", href: "/profile/me", icon: <UserCircle className="w-5 h-5" /> },
  ]

  const links = isEmployer ? employerLinks : managerLinks

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userRole")
    navigate("/login")
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for mobile */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? "block" : "hidden"}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
        <div className="relative flex flex-col flex-1 w-full max-w-xs pt-5 pb-4 bg-white">
          <div className="absolute top-0 right-0 pt-2 mr-2">
            <button
              className="flex items-center justify-center w-10 h-10 ml-1 rounded-md"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          <div className="flex items-center flex-shrink-0 px-4">
            <span className="text-xl font-bold text-blue-600">CRM System</span>
          </div>

          <div className="flex flex-col flex-1 mt-5">
            <nav className="flex-1 px-2 space-y-1 bg-white">
              {links.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`${
                    location.pathname === item.href
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </a>
              ))}
            </nav>
          </div>

          <div className="flex flex-shrink-0 p-4 border-t border-gray-200">
            <button onClick={handleLogout} className="flex items-center w-full text-gray-600 hover:text-gray-900">
              <LogOut className="w-5 h-5" />
              <span className="ml-3">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-1 min-h-0 bg-white border-r border-gray-200">
            <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <span className="text-xl font-bold text-blue-600">CRM System</span>
              </div>

              <nav className="flex-1 mt-5 px-2 space-y-1 bg-white">
                {links.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`${
                      location.pathname === item.href
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                  >
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                  </a>
                ))}
              </nav>
            </div>

            <div className="flex flex-shrink-0 p-4 border-t border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">{isEmployer ? "Employer" : "Manager"}</p>
                  <button onClick={handleLogout} className="text-xs font-medium text-gray-500 hover:text-gray-700">
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navbar */}
        <div className="relative z-10 flex flex-shrink-0 h-16 bg-white shadow">
          <button
            className="px-4 text-gray-500 border-r border-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex justify-between flex-1 px-4">
            <div className="flex flex-1">
              <h1 className="text-xl font-semibold text-gray-900 my-auto">
                {links.find((link) => link.href === location.pathname)?.name || "Dashboard"}
              </h1>
            </div>

            <div className="flex items-center ml-4 md:ml-6">
              <button className="p-1 text-gray-400 bg-white rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <Bell className="w-6 h-6" />
              </button>

              <div className="relative ml-3">
                <div>
                  <a
                    href="/profile/me"
                    className="flex items-center max-w-xs text-sm bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <main className="relative flex-1 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">{children}</div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
