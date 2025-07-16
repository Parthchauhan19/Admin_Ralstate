import React, { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./components/Login";
import Sidebar from "./components/Layout/Sidebar";
import Header from "./components/Layout/Header";
import Dashboard from "./components/Dashboard/Dashboard";
import ReminderBoard from "./components/Dashboard/ReminderBoard";
import Properties from "./components/Properties/Properties";
import Users from "./components/Users/Users";
import Settings from "./components/Settings/Settings";

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) {
    return <Login />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "properties":
        return <Properties />;
      case "users":
        return <Users />;
      case "settings":
        return <Settings />;
      case "analytics":
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Analytics</h1>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-600">
                Analytics dashboard coming soon...
              </p>
            </div>
          </div>
        );
      case "reports":
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Reports</h1>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-600">Reports section coming soon...</p>
            </div>
          </div>
        );
      case "calendar":
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Calendar</h1>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-600">Calendar view coming soon...</p>
            </div>
          </div>
        );
      case "messages":
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Messages</h1>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-600">Messaging system coming soon...</p>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto">{renderContent()}</main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
