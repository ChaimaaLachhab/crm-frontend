import { useState, useEffect } from "react"
import DashboardLayout from "../../components/layout/dashboard-layout"
import { CheckCircle, XCircle, Clock, TrendingUp, Users, FileText } from "lucide-react"
import axiosInstance from '../../api/axiosInstance';

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
    leadsCanceled: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token:", token);
  
        const response = await axiosInstance.get("/employer/dashboard-stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        console.log("Response Data:", response.data);
  
        const mappedStats = {
          leadsInProgress: response.data.IN_PROGRESS || 0,
          leadsCompleted: response.data.COMPLETED || 0,
          leadsCanceled: response.data.CANCELED || 0
        };
  
        setStats(mappedStats);
        setLoading(false);
      } catch (err) {
        setError("Failed to load dashboard statistics");
        setLoading(false);
        console.error("Error fetching dashboard stats:", err);
      }
    };
  
    fetchDashboardStats();
  }, []);
  

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
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          <div className="mt-2 bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {[1, 2, 3].map((item) => (
                <li key={item}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-blue-600 truncate">New lead assigned to Manager</p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          New
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          <Users className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                          Manager Name
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <Clock className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        <p>Added 2 hours ago</p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default EmployerDashboard
