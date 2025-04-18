import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import DashboardLayout from "../../components/layout/dashboard-layout";
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";

const ManagerLeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingLead, setEditingLead] = useState(null);

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get("/managers/leads", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLeads(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load leads");
      setLoading(false);
      console.error("Error fetching leads:", err);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axiosInstance.patch(
        `/managers/leads/${leadId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local state
      setLeads(
        leads.map((lead) =>
          lead._id === leadId ? { ...lead, status: newStatus } : lead
        )
      );

      setEditingLead(null);
    } catch (err) {
      console.error("Error updating lead status:", err);
      setError("Failed to update lead status");
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const name = lead.contactName?.toLowerCase() || "";
    const email = lead.contactEmail?.toLowerCase() || "";
    const company = lead.companyName?.toLowerCase() || "";

    const matchesSearch =
      name.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase()) ||
      company.includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING":
        return <AlertTriangle className="h-5 w-5 text-blue-500" />;
      case "in-IN_PROGRESS":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "COMPLETED":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "CANCELED":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-blue-100 text-blue-800";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <DashboardLayout userRole="manager">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="manager">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">My Leads</h2>
        </div>

        {error && (
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
        )}

        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative inline-flex">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="block w-full pl-10 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELED">Canceled</option>
            </select>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredLeads.length > 0 ? (
              filteredLeads.map((lead) => (
                <li key={lead._id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {getStatusIcon(lead.status)}
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-blue-600 truncate">
                            {lead.contactName}
                          </h3>
                          <div className="mt-1 flex items-center">
                            <p
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                                lead.status
                              )}`}
                            >
                              {lead.status
                                .replace("_", " ")
                                .toLowerCase()
                                .replace(/\b\w/g, (c) => c.toUpperCase())}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        {editingLead === lead._id ? (
                          <div className="flex space-x-2">
                            <select
                              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              value={lead.status}
                              onChange={(e) =>
                                handleStatusChange(lead._id, e.target.value)
                              }
                            >
                              <option value="PENDING">Pending</option>
                              <option value="IN_PROGRESS">In Progress</option>
                              <option value="COMPLETED">Completed</option>
                              <option value="CANCELED">Canceled</option>
                            </select>
                            <button
                              onClick={() => setEditingLead(null)}
                              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setEditingLead(lead._id)}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            Change Status
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 sm:flex sm:justify-between">
                      <div className="sm:flex sm:space-x-6">
                      <div className="flex items-center text-sm text-gray-500">
                          <span>Contact Name: {lead.contactName}</span>
                        </div>
                        {lead.contactName && (
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <span>Contact Email: {lead.contactEmail}</span>
                          </div>
                        )}
                        {lead.companyName && (
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <span>Company Name: {lead.companyName}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {lead.notes && (
                      <div className="mt-4">
                        <div className="text-sm text-gray-700">
                          <p className="font-medium">Notes:</p>
                          <p className="mt-1">{lead.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-6 text-center text-gray-500">
                No leads found. You don't have any leads assigned to you yet.
              </li>
            )}
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManagerLeadsPage;
