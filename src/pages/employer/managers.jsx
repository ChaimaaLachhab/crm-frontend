import { useState, useEffect } from "react"
import axiosInstance from '../../api/axiosInstance';
import DashboardLayout from "../../components/layout/dashboard-layout"
import { Plus, Edit, Trash2, X, Check, Search } from "lucide-react"

const ManagersPage = () => {
  const [managers, setManagers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentManager, setCurrentManager] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [searchTerm, setSearchTerm] = useState("")

  const fetchManagers = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axiosInstance.get("/employer/managers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setManagers(response.data)
      setLoading(false)
    } catch (err) {
      setError("Failed to load managers")
      setLoading(false)
      console.error("Error fetching managers:", err)
    }
  }

  useEffect(() => {
    fetchManagers()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const openModal = (manager = null) => {
    if (manager) {
      setCurrentManager(manager)
      setFormData({
        name: manager.name,
        email: manager.email,
        password: "",
      })
    } else {
      setCurrentManager(null)
      setFormData({
        name: "",
        email: "",
        password: "",
      })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setCurrentManager(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const payload = {
      name: formData.name,
      email:    formData.email,
      password: formData.password,
    };
  
    try {
      if (currentManager) {
        await axiosInstance.put(
          `/employer/managers/${currentManager._id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axiosInstance.post(
          "/employer/managers",
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      fetchManagers();
      closeModal();
    } catch (err) {
      console.error("Error saving manager:", err);
      setError(err.response?.data?.message || "Failed to save manager");
    }
  };
  

  const handleDelete = async (managerId) => {
    if (window.confirm("Are you sure you want to delete this manager?")) {
      try {
        const token = localStorage.getItem("token")
        await axiosInstance.delete(`employer/managers/${managerId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        fetchManagers()
      } catch (err) {
        console.error("Error deleting manager:", err)
        setError(err.response?.data?.message || "Failed to delete manager")
      }
    }
  }

  const filteredManagers = managers.filter((manager) => {
    const name = manager.name || "";
    const email = manager.email || "";
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  

  if (loading) {
    return (
      <DashboardLayout userRole="employer">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="employer">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Managers</h2>
          <button
            onClick={() => openModal()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Manager
          </button>
        </div>

        {error && (
          <div className="bg-red-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <X className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search managers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredManagers.length > 0 ? (
              filteredManagers.map((manager) => (
                <li key={manager._id}>
                  <div className="px-4 py-4 flex items-center sm:px-6">
                    <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-blue-600 truncate">{manager.name}</h3>
                        <div className="mt-2 flex">
                          <div className="flex items-center text-sm text-gray-500">
                            <span>Email: {manager.email}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex-shrink-0 sm:mt-0">
                        <div className="flex space-x-4">
                          <button
                            onClick={() => openModal(manager)}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(manager._id)}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-6 text-center text-gray-500">
                No managers found. Add a new manager to get started.
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Modal for adding/editing managers */}
      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {currentManager ? "Edit Manager" : "Add New Manager"}
                    </h3>
                    <div className="mt-4">
                      <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                              Name
                            </label>
                            <input
                              type="text"
                              name="name"
                              id="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              required
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>

                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                              Email
                            </label>
                            <input
                              type="email"
                              name="email"
                              id="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              required
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>

                          <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                              {currentManager ? "New Password (leave blank to keep current)" : "Password"}
                            </label>
                            <input
                              type="password"
                              name="password"
                              id="password"
                              value={formData.password}
                              onChange={handleInputChange}
                              required={!currentManager}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>

                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  <Check className="h-4 w-4 mr-2" />
                  {currentManager ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default ManagersPage
