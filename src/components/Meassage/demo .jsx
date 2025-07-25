import React, { useState, useRef, useEffect } from "react";
import { Search, Plus, MoreHorizontal, X, Edit, Trash2 } from "lucide-react";

interface PushNotification {
  id: string;
  title: string;
  userGroup: string;
  city: string;
  activeFrom: string;
  activeUntil: string;
  message: string;
  status: "Active" | "Inactive";
  createdAt: string;
}

interface NotificationFormData {
  title: string;
  userGroup: string;
  city: string;
  activeFrom: string;
  activeUntil: string;
  message: string;
}

const PushNotificationManager: React.FC = () => {
  const [notifications, setNotifications] = useState<PushNotification[]>([/* your notification data here */]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [editingNotification, setEditingNotification] = useState<PushNotification | null>(null);
  const [formData, setFormData] = useState<NotificationFormData>({
    title: "",
    userGroup: "",
    city: "",
    activeFrom: "",
    activeUntil: "",
    message: "",
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  const userGroups = ["All Users", "New Users", "Premium Users", "Free Users", "Retail Users", "Enterprise Users"];
  const cities = ["All Cities", "Ahmedabad", "Rajkot", "Surat", "Vadodara", "Gandhinagar"];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (field: keyof NotificationFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.userGroup || !formData.message) {
      alert("Please fill in all required fields");
      return;
    }

    if (editingNotification) {
      const updatedNotification: PushNotification = {
        ...editingNotification,
        ...formData,
        city: formData.city || "All Cities",
      };
      setNotifications((prev) =>
        prev.map((n) => (n.id === editingNotification.id ? updatedNotification : n))
      );
    } else {
      const newNotification: PushNotification = {
        id: `#${Math.floor(Math.random() * 9000) + 1000}`,
        ...formData,
        city: formData.city || "All Cities",
        status: "Active",
        createdAt: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      };
      setNotifications((prev) => [newNotification, ...prev]);
    }

    setShowModal(false);
    setEditingNotification(null);
    setFormData({ title: "", userGroup: "", city: "", activeFrom: "", activeUntil: "", message: "" });
  };

  const handleEdit = (notification: PushNotification) => {
    setEditingNotification(notification);
    setFormData(notification);
    setShowModal(true);
    setActiveDropdown(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }
    setActiveDropdown(null);
  };

  const toggleDropdown = (id: string) => {
    setActiveDropdown((prev) => (prev === id ? null : id));
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingNotification(null);
    setFormData({ title: "", userGroup: "", city: "", activeFrom: "", activeUntil: "", message: "" });
  };

  const filteredNotifications = notifications.filter(
    (n) =>
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.userGroup.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
         <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
                    <h1 className="text-2xl font-semibold text-gray-900">
                      Push Notifications
                    </h1>
                    <div className="relative w-full sm:w-auto">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => setShowModal(true)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors w-full sm:w-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Push Notification</span>
                  </button>
                </div>
        <table className="w-full">
          <thead>
            {/* Your table headers */}
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedNotifications.map((notification) => (
              <tr key={notification.id}>
                {/* Your row rendering code */}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6 flex-wrap gap-2">
          <p className="text-sm text-gray-600">
            Showing {paginatedNotifications.length} of {filteredNotifications.length} results
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 text-sm rounded ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "border border-gray-300 hover:bg-gray-100"
              }`}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 text-sm rounded ${
                  currentPage === i + 1
                    ? "bg-red-500 text-white"
                    : "border border-gray-300 hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 text-sm rounded ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "border border-gray-300 hover:bg-gray-100"
              }`}
            >
              Next
            </button>
          </div>
        </div>

        {/* Modal code remains unchanged */}
      </div>
    </div>
  );
};

export default PushNotificationManager;
