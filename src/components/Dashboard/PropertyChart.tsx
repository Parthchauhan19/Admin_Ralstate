import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const PropertyChart: React.FC = () => {
  const barData = [
    { month: "Jan", sales: 45, rentals: 23 },
    { month: "Feb", sales: 52, rentals: 28 },
    { month: "Mar", sales: 38, rentals: 31 },
    { month: "Apr", sales: 65, rentals: 35 },
    { month: "May", sales: 58, rentals: 42 },
    { month: "Jun", sales: 72, rentals: 38 },
    { month: "July", sales: 35, rentals: 42 },
    // { month: "Aug", sales: 86, rentals: 20 },
    // { month: "Sept", sales: 45, rentals: 68 },
    // { month: "oct", sales: 20, rentals: 56 },
    // { month: "Nov", sales: 78, rentals: 45 },
    // { month: "Dec", sales: 65, rentals: 35 },
  ];

  const pieData = [
    { type: "Flat", value: 45 },
    { type: "Villa", value: 13 },
    { type: "Plot", value: 15 },
    { type: "Pg", value: 22 },
    { type: "Penthouse", value: 5 },
  ];

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10 ">
        <div className="flex-1 w-full border-r-gray-300 border-r-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Property Sales & Rentals (Monthly)
          </h2>
          <div style={{ width: "100%", height: 420 }}>
            <ResponsiveContainer>
              <BarChart
                data={barData}
                margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                />
                <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="rentals" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex-1 w-full">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Property Type Distribution
          </h2>
          <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="type"
                  label={({ type, percent }) =>
                    `${type} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyChart;
