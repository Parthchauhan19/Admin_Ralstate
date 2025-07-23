import React, { useState } from "react";
import { Search, Plus, MoreHorizontal, Calendar, X } from "lucide-react";

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
      id: "#7466",
      title: "Welcome Notification",
      userGroup: "New Users",
      city: "Mumbai",
      activeFrom: "2025-01-15",
      activeUntil: "2025-12-31",
      message: "Welcome to our platform!",
      status: "Active",
      createdAt: "15 Jan, 2025",
    },
    {
      id: "#7465",
      title: "Weekend Sale",
      userGroup: "Premium Users",
      city: "Ahemdabad",
      activeFrom: "2025-06-01",
      activeUntil: "2025-06-30",
      message: "Special weekend discounts available!",
      status: "Inactive",
      createdAt: "01 Jun, 2025",
    },
    {
      id: "#7464",
      title: "App Update",
      userGroup: "All Users",
      city: "All Cities",
      activeFrom: "2025-07-01",
      activeUntil: "2025-07-31",
      message: "New app version available for download.",
      status: "Active",
      createdAt: "01 Jul, 2025",
    },

    {
      id: "#7465",
      title: "Power Saving Tips",
      userGroup: "All Users",
      city: "Gujarat",
      activeFrom: "2025-07-20",
      activeUntil: "2025-08-05",
      message:
        "Learn how to reduce your electricity usage this summer in Gujarat.",
      status: "Inactive",
      createdAt: "20 Jul, 2025",
    },
    {
      id: "#7466",
      title: "Local Festival Offers",
      userGroup: "Retail Users",
      city: "Gandhinagar",
      activeFrom: "2025-07-15",
      activeUntil: "2025-08-01",
      message:
        "Special discounts available for Gujarat customers during Rath Yatra week.",
      status: "Active",
      createdAt: "15 Jul, 2025",
    },
    {
      id: "#7467",
      title: "Service Downtime Notice",
      userGroup: "Enterprise Users",
      city: "Rajkot",
      activeFrom: "2025-07-25",
      activeUntil: "2025-07-26",
      message:
        "Brief service interruption in Gujarat due to infrastructure upgrades.",
      status: "Inactive",
      createdAt: "23 Jul, 2025",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<NotificationFormData>({
    title: "",
    userGroup: "",
    city: "",
    activeFrom: "",
    activeUntil: "",
    message: "",
  });

  const userGroups = ["All Users", "New Users", "Premium Users", "Free Users"];
  const cities = [
    "All Cities",
    "Mumbai",
    "Ahemdabad",
    "Rajkot",
    "Morbi",
    "Gandhinagar",
  ];

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

    const newNotification: PushNotification = {
      id: `#${Math.floor(Math.random() * 9000) + 1000}`,
      title: formData.title,
      userGroup: formData.userGroup,
      city: formData.city || "All Cities",
      activeFrom: formData.activeFrom,
      activeUntil: formData.activeUntil,
      message: formData.message,
      status: "Active",
      createdAt: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    };

    setNotifications((prev) => [newNotification, ...prev]);
    setShowModal(false);
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
      notification.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto ">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              Push Notifications
            </h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Push Notification</span>
          </button>
        </div>

        {/* Table */}
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
              <tbody className="divide-y divide-gray-200 cursor-pointer">
                {filteredNotifications.map((notification) => (
                  <tr
                    key={notification.id}
                    className="hover:bg-gray-100 hover:shadow-lg"
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
                    <td className="py-4 px-6">
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-gray-600">
            Showing {filteredNotifications.length} of {notifications.length}{" "}
            results
          </p>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">
              Previous
            </button>
            <button className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded">
              1
            </button>
            <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">
              2
            </button>
            <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Add Push Notification
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Title here..."
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User Group
                </label>
                <select
                  value={formData.userGroup}
                  onChange={(e) =>
                    handleInputChange("userGroup", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                <div className="relative">
                  <input
                    type="date"
                    value={formData.activeFrom}
                    onChange={(e) =>
                      handleInputChange("activeFrom", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Active until
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.activeUntil}
                    onChange={(e) =>
                      handleInputChange("activeUntil", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  rows={3}
                  placeholder="Message"
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleSubmit}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition-colors font-medium"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PushNotificationManager;
