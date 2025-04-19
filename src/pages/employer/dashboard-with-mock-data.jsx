"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import DashboardLayout from "../../components/layout/dashboard-layout"
import { CheckCircle, XCircle, Clock, TrendingUp, Users, FileText } from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-md p-3 ${color}`}>{icon}</div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}

// Données fictives pour les tests
const mockData = {
  leadsInProgress: 24,
  leadsCompleted: 45,
  leadsCanceled: 12,
  totalManagers: 8,
  totalLeads: 81,
  monthlyLeads: {
    jan: 15,
    feb: 22,
    mar: 18,
    apr: 30,
    may: 25,
    jun: 28,
  },
  // Données supplémentaires pour les graphiques
  managerPerformance: [
    { name: "Alice", completed: 12, inProgress: 5 },
    { name: "Bob", completed: 8, inProgress: 7 },
    { name: "Charlie", completed: 15, inProgress: 3 },
    { name: "David", completed: 10, inProgress: 9 },
  ],
}

const EmployerDashboard = () => {
  const [stats, setStats] = useState({
    leadsInProgress: 0,
    leadsCompleted: 0,
    leadsCanceled: 0,
    totalManagers: 0,
    totalLeads: 0,
  })
  const [chartData, setChartData] = useState({
    barChart: [],
    pieChart: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [useMockData, setUseMockData] = useState(false)

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        let data

        if (useMockData) {
          // Utiliser les données fictives
          data = mockData
        } else {
          // Essayer de récupérer les données réelles
          try {
            const token = localStorage.getItem("token")
            const response = await axios.get("http://localhost:5001/api/employer/dashboard-stats", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            data = response.data
          } catch (apiError) {
            console.error("Error fetching real data, falling back to mock data:", apiError)
            data = mockData
            setUseMockData(true)
          }
        }

        setStats({
          leadsInProgress: data.leadsInProgress,
          leadsCompleted: data.leadsCompleted,
          leadsCanceled: data.leadsCanceled,
          totalManagers: data.totalManagers,
          totalLeads: data.totalLeads,
        })

        // Préparer les données pour le graphique à barres
        const barData = [
          { name: "Jan", leads: data.monthlyLeads?.jan || 0 },
          { name: "Fév", leads: data.monthlyLeads?.feb || 0 },
          { name: "Mar", leads: data.monthlyLeads?.mar || 0 },
          { name: "Avr", leads: data.monthlyLeads?.apr || 0 },
          { name: "Mai", leads: data.monthlyLeads?.may || 0 },
          { name: "Juin", leads: data.monthlyLeads?.jun || 0 },
        ]

        // Préparer les données pour le graphique circulaire
        const pieData = [
          { name: "En cours", value: data.leadsInProgress, color: "#FBBF24" },
          { name: "Complétés", value: data.leadsCompleted, color: "#10B981" },
          { name: "Annulés", value: data.leadsCanceled, color: "#EF4444" },
        ]

        setChartData({
          barChart: barData,
          pieChart: pieData,
        })

        setLoading(false)
      } catch (err) {
        setError("Failed to load dashboard statistics")
        setLoading(false)
        console.error("Error fetching dashboard stats:", err)
      }
    }

    fetchDashboardStats()
  }, [useMockData])

  const COLORS = ["#FBBF24", "#10B981", "#EF4444"]

  if (loading) {
    return (
      <DashboardLayout userRole="employer">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout userRole="employer">
        <div className="bg-red-50 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="employer">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
          {useMockData && (
            <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
              Utilisation de données fictives
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Leads in Progress"
            value={stats.leadsInProgress}
            icon={<Clock className="h-6 w-6 text-white" />}
            color="bg-yellow-500"
          />
          <StatCard
            title="Leads Completed"
            value={stats.leadsCompleted}
            icon={<CheckCircle className="h-6 w-6 text-white" />}
            color="bg-green-500"
          />
          <StatCard
            title="Leads Canceled"
            value={stats.leadsCanceled}
            icon={<XCircle className="h-6 w-6 text-white" />}
            color="bg-red-500"
          />
          <StatCard
            title="Total Managers"
            value={stats.totalManagers}
            icon={<Users className="h-6 w-6 text-white" />}
            color="bg-blue-500"
          />
          <StatCard
            title="Total Leads"
            value={stats.totalLeads}
            icon={<FileText className="h-6 w-6 text-white" />}
            color="bg-purple-500"
          />
          <StatCard
            title="Conversion Rate"
            value={`${stats.totalLeads ? Math.round((stats.leadsCompleted / stats.totalLeads) * 100) : 0}%`}
            icon={<TrendingUp className="h-6 w-6 text-white" />}
            color="bg-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Graphique à barres */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Leads par mois</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData.barChart}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="leads" fill="#3B82F6" name="Nombre de leads" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Graphique circulaire */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Répartition des leads par statut</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.pieChart}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.pieChart.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} leads`, "Quantité"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default EmployerDashboard
