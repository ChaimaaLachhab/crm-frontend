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

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await axios.get("http://localhost:5001/api/employer/dashboard-stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setStats(response.data)

        // Préparer les données pour le graphique à barres
        // Supposons que l'API renvoie des données mensuelles ou que nous les formatons ici
        const barData = [
          { name: "Jan", leads: response.data.monthlyLeads?.jan || Math.floor(Math.random() * 50) },
          { name: "Fév", leads: response.data.monthlyLeads?.feb || Math.floor(Math.random() * 50) },
          { name: "Mar", leads: response.data.monthlyLeads?.mar || Math.floor(Math.random() * 50) },
          { name: "Avr", leads: response.data.monthlyLeads?.apr || Math.floor(Math.random() * 50) },
          { name: "Mai", leads: response.data.monthlyLeads?.may || Math.floor(Math.random() * 50) },
          { name: "Juin", leads: response.data.monthlyLeads?.jun || Math.floor(Math.random() * 50) },
        ]

        // Préparer les données pour le graphique circulaire
        const pieData = [
          { name: "En cours", value: response.data.leadsInProgress, color: "#FBBF24" },
          { name: "Complétés", value: response.data.leadsCompleted, color: "#10B981" },
          { name: "Annulés", value: response.data.leadsCanceled, color: "#EF4444" },
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
  }, [])

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
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>

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
