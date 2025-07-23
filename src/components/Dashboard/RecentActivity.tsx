import React from "react";
import { Home, User, DollarSign, Eye, MessageCircle } from "lucide-react";

const RecentActivity: React.FC = () => {
  const activities = [
    {
      id: 1,
      type: "property",
      title: "New property listed",
      description: "4 BHK Villa in Prahladnagar, Ahmedabad",
      time: "2 hours ago",
      icon: Home,
      color: "blue",
    },
    {
      id: 2,
      type: "user",
      title: "New user registered",
      description: "Chirag Patel joined",
      time: "4 hours ago",
      icon: User,
      color: "green",
    },
    {
      id: 3,
      type: "sale",
      title: "Property sold",
      description: "Luxury Apartment - ₹1.2 Cr",
      time: "6 hours ago",
      icon: DollarSign,
      color: "yellow",
    },
    {
      id: 4,
      type: "view",
      title: "Property viewed",
      description: "52 new views today from Surat",
      time: "8 hours ago",
      icon: Eye,
      color: "red",
    },
    {
      id: 5,
      type: "message",
      title: "Team Reminder",
      description: "Don’t forget to review Vadodara leads by 5 PM.",
      time: "10 minutes ago",
      icon: MessageCircle,
      color: "purple",
    },
  ];

  const colorClasses: Record<string, string> = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    red: "bg-red-100 text-red-600",
    purple: "bg-purple-100 text-purple-600",
  };

  return (
    <div className="bg-white rounded-lg w-full shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Reminder Activity
      </h2>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${colorClasses[activity.color]}`}>
              <activity.icon className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900">
                {activity.title}
              </h3>
              <p className="text-sm text-gray-600">{activity.description}</p>
              <span className="text-xs text-gray-500">{activity.time}</span>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-6 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
        View All Activity
      </button>
    </div>
  );
};

export default RecentActivity;
