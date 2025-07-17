import React from "react";
import { Building, Users, DollarSign, Eye, MapPin } from "lucide-react";
import StatsCard from "./StatsCard";
import RecentActivity from "./RecentActivity";
import PropertyChart from "./PropertyChart";

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: "Total Properties",
      value: "1,234",
      change: "+12%",
      changeType: "positive" as const,
      icon: Building,
      color: "blue",
    },
    {
      title: "Active Users",
      value: "556",
      change: "+8%",
      changeType: "positive" as const,
      icon: Users,
      color: "green",
    },
    {
      title: "Revenue",
      value: "$2,40,00,000",
      change: "+38%",
      changeType: "positive" as const,
      icon: DollarSign,
      color: "yellow",
    },
    {
      title: "Visites",
      value: "1,791",
      change: "-3%",
      changeType: "negative" as const,
      icon: Eye,
      color: "red",
    },
  ];

  const recentProperties = [
    {
      id: 1,
      title: "Modern Villa in Downtown",
      price: "$850,000",
      location: "Surat, Gujarat",
      bedrooms: 4,
      bathrooms: 3,
      area: "2,500 sq ft",
      status: "For Sale",
      image:
        "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=300",
      agent: "Parth Chauhan",
      type: "Villa",
    },
    {
      id: 2,
      title: "Luxury Apartment",
      price: "$1,200,000",
      location: "Rajkot, Gujarat",
      bedrooms: 3,
      bathrooms: 2,
      area: "1,800 sq ft",
      status: "Sold",
      image:
        "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=300",
      agent: "Sarah Johnson",
      type: "Apartment",
    },
    {
      id: 3,
      title: "Cozy Family Home",
      price: "$650,000",
      location: "Ahemdabad, Gujarat",
      bedrooms: 5,
      bathrooms: 4,
      area: "3,200 sq ft",
      status: "For Rent",
      image:
        "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=300",
      agent: "Mike Davis",
      type: "House",
    },
    {
      id: 4,
      title: "Thakkar Family Home",
      price: "$450,000",
      location: "Jesalmer, Rajsathan",
      bedrooms: 2,
      bathrooms: 3,
      area: "2,200 sq ft",
      status: "For Rent",
      image:
        "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=300",
      agent: "Vinita Thakkar",
      type: "House",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back! Here's what's happening with your properties.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2">
          <PropertyChart />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Properties
          </h2>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentProperties.map((property) => (
            <div
              key={property.id}
              className="bg-gray-50 rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">
                  {property.title}
                </h3>
                <p className="text-2xl font-bold text-green-600">
                  {property.price}
                </p>
                <div className="flex items-center gap-1 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{property.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      property.status === "For Sale"
                        ? "bg-blue-100 text-blue-800"
                        : property.status === "Sold"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {property.status}
                  </span>
                  <span className="text-sm text-gray-500">
                    by {property.agent}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
