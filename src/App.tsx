import React, { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./components/Login";
import Sidebar from "./components/Layout/Sidebar";
import Header from "./components/Layout/Header";
import Dashboard from "./components/Dashboard/Dashboard";
import Properties from "./components/Properties/Properties";
import Users from "./components/Users/Users";
import Settings from "./components/Settings/Settings";
import Analytics from "./components/Analytics/Analytics";
import Reports from "./components/Reports/Reports";
import Calender from "./components/Calender/Calender";
import Message from "./components/Meassage/Meassage";

function AppContent() {
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
        return <Analytics />;
      case "reports":
        return <Reports />;
      case "calendar":
        return <Calender />;
      case "messages":
        return <Message />;
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

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto">{renderContent()}</main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
