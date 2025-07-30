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
  const [notifications, setNotifications] = useState<PushNotification[]>([
    {
      id: "#7461",
      title: "Welcome Notification",
      userGroup: "New Users",
      city: "Mumbai",
      activeFrom: "2025-01-15",
      activeUntil: "2025-12-31",
      message: "Welcome to our platform!",
      status: "Active",
      createdAt: "15 Jan, 2025",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [editingNotification, setEditingNotification] =
    useState<PushNotification | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState<NotificationFormData>({
    title: "",
    userGroup: "",
    city: "",
    activeFrom: "",
    activeUntil: "",
    message: "",
  });

  const dropdownRef = useRef<HTMLDivElement>(null);

  const userGroups = [
    "All Users",
    "New Users",
    "Premium Users",
    "Free Users",
    "Retail Users",
    "Enterprise Users",
    "Frequent Users",
  ];
  const cities = [
    "All Cities",
    "Mumbai",
    "Ahmedabad",
    "Rajkot",
    "Surat",
    "Vadodara",
    "Gandhinagar",
    "Gujarat",
    "Morbi",
  ];

  const itemsPerPage = 10;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (
    field: keyof NotificationFormData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
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
        prev.map((notification) =>
          notification.id === editingNotification.id
            ? updatedNotification
            : notification
        )
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
    setFormData({
      title: "",
      userGroup: "",
      city: "",
      activeFrom: "",
      activeUntil: "",
      message: "",
    });
  };

  const handleEdit = (notification: PushNotification) => {
    setEditingNotification(notification);
    setFormData({
      title: notification.title,
      userGroup: notification.userGroup,
      city: notification.city,
      activeFrom: notification.activeFrom,
      activeUntil: notification.activeUntil,
      message: notification.message,
    });
    setShowModal(true);
    setActiveDropdown(null);
  };

  const handleDelete = (notificationId: string) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== notificationId)
      );
    }
    setActiveDropdown(null);
  };

  const toggleDropdown = (notificationId: string) => {
    setActiveDropdown(
      activeDropdown === notificationId ? null : notificationId
    );
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingNotification(null);
    setFormData({
      title: "",
      userGroup: "",
      city: "",
      activeFrom: "",
      activeUntil: "",
      message: "",
    });
  };

  const filteredNotifications = notifications.filter(
    (notification) =>
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.userGroup.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent w-full sm:w-64"
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

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-gray-600">
                    ID
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-600">
                    Title
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-600">
                    User Group
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-600">
                    City
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-600">
                    Active From
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-600">
                    Active Until
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-600">
                    Created At
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-600">
                    Status
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-600"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedNotifications.map((notification) => (
                  <tr
                    key={notification.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6 text-blue-600 font-medium">
                      {notification.id}
                    </td>
                    <td className="py-4 px-6 text-gray-900">
                      {notification.title}
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {notification.userGroup}
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {notification.city}
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {notification.activeFrom}
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {notification.activeUntil}
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {notification.createdAt}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          notification.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {notification.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 relative">
                      <button
                        onClick={() => toggleDropdown(notification.id)}
                        className="text-gray-500 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>

                      {activeDropdown === notification.id && (
                        <div
                          ref={dropdownRef}
                          className="absolute right-6 top-12 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-32"
                        >
                          <button
                            onClick={() => handleEdit(notification)}
                            className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-md"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(notification.id)}
                            className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-md"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-between items-center mt-6 flex-wrap gap-2">
          <p className="text-sm text-gray-600">
            Showing {paginatedNotifications.length} of{" "}
            {filteredNotifications.length} results
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
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
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
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingNotification
                  ? "Edit Push Notification"
                  : "Add Push Notification"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  placeholder="Title here..."
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User Group *
                </label>
                <select
                  value={formData.userGroup}
                  onChange={(e) =>
                    handleInputChange("userGroup", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Select user group</option>
                  {userGroups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">City</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Active from
                </label>
                <input
                  type="date"
                  value={formData.activeFrom}
                  onChange={(e) =>
                    handleInputChange("activeFrom", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Active until
                </label>
                <input
                  type="date"
                  value={formData.activeUntil}
                  onChange={(e) =>
                    handleInputChange("activeUntil", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  rows={3}
                  placeholder="Message"
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleSubmit}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition-colors font-medium"
              >
                {editingNotification ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PushNotificationManager;
