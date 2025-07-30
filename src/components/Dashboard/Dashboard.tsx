import React, { useEffect, useState } from "react";
import { Building, Users, DollarSign, Eye, MapPin } from "lucide-react";
import axios from "axios";
import StatsCard from "./StatsCard";
import RecentActivity from "./RecentActivity";
import PropertyChart from "./PropertyChart";

interface Property {
  _id: string;
  propertyTitle: string;
  price: string;
  location: string;
  propertyType: string;
  bedroom: number;
  bathroom: number;
  area: string;
  status: string;
  agent: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

const Dashboard: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8000/property/getAll");
        setProperties(res.data);
      } catch (err) {
        console.error("Failed to fetch properties:", err);
      }
    };

    fetchData();
  }, []);

  // Calculate stats
  const totalProperties = properties.length;
  const forSale = properties.filter((p) => p.status === "For Sale").length;
  const forRent = properties.filter((p) => p.status === "For Rent").length;
  const sold = properties.filter((p) => p.status === "Sold").length;

  const stats = [
    {
      title: "Total Properties",
      value: totalProperties.toString(),
      change: "+12%",
      changeType: "positive" as const,
      icon: Building,
      color: "blue",
    },
    {
      title: "Properties For Sale / Rent",
      value: forSale.toString() + " / " + forRent.toString(),
      change: "+8%",
      changeType: "positive" as const,
      icon: DollarSign,
      color: "green",
    },
    {
      title: "Sold Properties",
      value: sold.toString(),
      change: "+38%",
      changeType: "positive" as const,
      icon: DollarSign,
      color: "yellow",
    },
    {
      title: "Total Visits",
      value: "1,791",
      change: "-3%",
      changeType: "negative" as const,
      icon: Eye,
      color: "red",
    },
  ];

  const latestProperties = [...properties]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

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

      {/* Chart & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2">
          <PropertyChart />
        </div>
        <div>
          <RecentActivity activities={latestProperties} />
        </div>
      </div>

      {/* Recent Properties */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Updates On Properties
          </h2>
          <button className="text-red-600 hover:text-red-700 text-sm font-medium">
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestProperties.map((property) => (
            <div
              key={property._id}
              className="bg-gray-50 rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <img
                src={property.image}
                alt={property.propertyTitle}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">
                  {property.propertyTitle}
                </h3>
                <p className="text-2xl font-bold text-green-600">
                  ₹{property.price}
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
