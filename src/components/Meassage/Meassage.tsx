/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  Loader,
  X,
  Edit,
  Trash2,
} from "lucide-react";

interface PushNotification {
  _id?: string;
  id: string;
  Title: string;
  UserGroup: string;
  City: string;
  ActiveFrom: string;
  ActiveUntil: string;
  CreatedAt: string;
  Status: "Active" | "InActive";
}

interface NotificationFormData {
  Title: string;
  UserGroup: string;
  City: string;
  ActiveFrom: string;
  ActiveUntil: string;
  Status: "Active" | "InActive";
}

const PushNotificationManager: React.FC = () => {
  const [notifications, setNotifications] = useState<PushNotification[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [editingNotification, setEditingNotification] =
    useState<PushNotification | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<NotificationFormData>({
    Title: "",
    UserGroup: "",
    City: "",
    ActiveFrom: "",
    ActiveUntil: "",
    Status: "Active",
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
    "City",
    "AllCites",
    "Mumbai",
    "Ahemdabad",
    "Rajkot",
    "Surat",
    "Vadodara",
    "Gandhinagar",
    "Morbi",
    "Gujarat",
  ];

  const statusOptions = ["Active", "InActive"];

  const itemsPerPage = 10;

  const API_BASE_URL = "http://localhost:8000/messages";

  useEffect(() => {
    fetchNotifications();
  }, []);

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

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/getAll`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        const transformedData = result.data.map((item: any) => ({
          ...item,
          id: item.id || item._id,
          ActiveFrom: item.ActiveFrom
            ? new Date(item.ActiveFrom).toISOString().split("T")[0]
            : "",
          ActiveUntil: item.ActiveUntil
            ? new Date(item.ActiveUntil).toISOString().split("T")[0]
            : "",
          CreatedAt: item.CreatedAt
            ? new Date(item.CreatedAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }),
        }));
        setNotifications(transformedData);
      } else {
        console.error("Failed to fetch notifications:", result.message);
        alert(`Error fetching notifications: ${result.message}`);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      alert(
        "Error connecting to server. Please check if your backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof NotificationFormData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (
      !formData.Title ||
      !formData.UserGroup ||
      !formData.City ||
      !formData.ActiveFrom ||
      !formData.ActiveUntil
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const activeFrom = new Date(formData.ActiveFrom);
    const activeUntil = new Date(formData.ActiveUntil);

    if (activeFrom >= activeUntil) {
      alert("Active Until date must be after Active From date");
      return;
    }

    try {
      setLoading(true);

      const submitData = {
        Title: formData.Title,
        UserGroup: formData.UserGroup,
        City: formData.City,
        ActiveFrom: formData.ActiveFrom,
        ActiveUntil: formData.ActiveUntil,
        Status: formData.Status,
      };

      let response;

      if (editingNotification) {
        response = await fetch(
          `${API_BASE_URL}/update/${encodeURIComponent(
            editingNotification.Title
          )}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(submitData),
          }
        );
      } else {
        response = await fetch(`${API_BASE_URL}/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submitData),
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        await fetchNotifications();
        alert(
          editingNotification
            ? "Notification updated successfully!"
            : "Notification created successfully!"
        );
        closeModal();
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error submitting notification:", error);
      alert(
        "Error submitting notification. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (notification: PushNotification) => {
    setEditingNotification(notification);
    setFormData({
      Title: notification.Title,
      UserGroup: notification.UserGroup,
      City: notification.City,
      ActiveFrom: notification.ActiveFrom,
      ActiveUntil: notification.ActiveUntil,
      Status: notification.Status,
    });
    setShowModal(true);
    setActiveDropdown(null);
  };

  const handleDelete = async (notification: PushNotification) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_BASE_URL}/delete/${encodeURIComponent(notification.Title)}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          await fetchNotifications();
          alert("Notification deleted successfully!");
        } else {
          alert(`Error deleting notification: ${result.message}`);
        }
      } catch (error) {
        console.error("Error deleting notification:", error);
        alert("Error deleting notification. Please try again.");
      } finally {
        setLoading(false);
      }
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
      Title: "",
      UserGroup: "",
      City: "",
      ActiveFrom: "",
      ActiveUntil: "",
      Status: "Active",
    });
  };

  const filteredNotifications = notifications.filter(
    (notification) =>
      notification.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.UserGroup.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.City.toLowerCase().includes(searchTerm.toLowerCase())
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
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors w-full sm:w-auto"
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
                  <th className="text-left py-3 px-6 font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {!loading && paginatedNotifications.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="py-8 px-6 text-center text-gray-500"
                    >
                      No notifications found
                    </td>
                  </tr>
                ) : (
                  paginatedNotifications.map((notification) => (
                    <tr
                      key={notification._id || notification.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6 text-blue-600 font-medium">
                        {notification.id}
                      </td>
                      <td className="py-4 px-6 text-gray-900">
                        {notification.Title}
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {notification.UserGroup}
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {notification.City}
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {notification.ActiveFrom}
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {notification.ActiveUntil}
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {notification.CreatedAt}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            notification.Status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {notification.Status}
                        </span>
                      </td>
                      <td className="py-4 px-6 relative">
                        <button
                          onClick={() =>
                            toggleDropdown(notification._id || notification.id)
                          }
                          className="text-gray-500 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>

                        {activeDropdown ===
                          (notification._id || notification.id) && (
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
                              onClick={() => handleDelete(notification)}
                              className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-md"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {loading && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center justify-center min-h-96">
                <div className="flex items-center space-x-2">
                  <Loader className="animate-spin" size={20} />
                  <span>Loading data....</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center mt-6 flex-wrap gap-2">
          <p className="text-sm text-gray-600">
            Showing {paginatedNotifications.length} of{" "}
            {filteredNotifications.length} results
          </p>
          {totalPages > 1 && (
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
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
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
                  value={formData.Title}
                  onChange={(e) => handleInputChange("Title", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User Group *
                </label>
                <select
                  value={formData.UserGroup}
                  onChange={(e) =>
                    handleInputChange("UserGroup", e.target.value)
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
                  City *
                </label>
                <select
                  value={formData.City}
                  onChange={(e) => handleInputChange("City", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  value={formData.Status}
                  onChange={(e) =>
                    handleInputChange(
                      "Status",
                      e.target.value as "Active" | "InActive"
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Active from *
                </label>
                <input
                  type="date"
                  value={formData.ActiveFrom}
                  onChange={(e) =>
                    handleInputChange("ActiveFrom", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Active until *
                </label>
                <input
                  type="date"
                  value={formData.ActiveUntil}
                  onChange={(e) =>
                    handleInputChange("ActiveUntil", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white py-2 px-4 rounded-md transition-colors font-medium"
              >
                {loading
                  ? "Processing..."
                  : editingNotification
                  ? "Update"
                  : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PushNotificationManager;
