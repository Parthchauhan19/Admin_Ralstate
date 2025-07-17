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

const Analytics: React.FC = () => {
  const barData = [
    { employe: "Arjunbhai", Newvisites: 45, revisites: 23, Property: 21 },
    { employe: "Jaydeepbhai", Newvisites: 52, revisites: 28, Property: 5 },
    { employe: "Mehulbhai", Newvisites: 38, revisites: 31, Property: 15 },
    { employe: "ArpitBhai", Newvisites: 65, revisites: 35, Property: 10 },
    { employe: "Mayaben", Newvisites: 58, revisites: 42, Property: 17 },
    { employe: "Jinalben", Newvisites: 72, revisites: 38, Property: 13 },
    { employe: "Jigneshbhai", Newvisites: 35, revisites: 42, Property: 25 },
  ];

  const pieDataPerEmployee = {
    Arjunbhai: [
      { type: "House", value: 12 },
      { type: "Tenaments", value: 10 },
      { type: "Rental", value: 8 },
      { type: "Commercial", value: 6 },
    ],
    Jaydeepbhai: [
      { type: "House", value: 18 },
      { type: "Tenaments", value: 7 },
      { type: "Rental", value: 4 },
      { type: "Commercial", value: 3 },
    ],
    Mehulbhai: [
      { type: "House", value: 10 },
      { type: "Tenaments", value: 12 },
      { type: "Rental", value: 6 },
      { type: "Commercial", value: 5 },
    ],
    ArpitBhai: [
      { type: "House", value: 20 },
      { type: "Tenaments", value: 15 },
      { type: "Rental", value: 18 },
      { type: "Commercial", value: 12 },
    ],
    Mayaben: [
      { type: "House", value: 13 },
      { type: "Tenaments", value: 14 },
      { type: "Rental", value: 10 },
      { type: "Commercial", value: 5 },
    ],
    Jinalben: [
      { type: "House", value: 16 },
      { type: "Tenaments", value: 10 },
      { type: "Rental", value: 9 },
      { type: "Commercial", value: 8 },
    ],
    Jigneshbhai: [
      { type: "House", value: 22 },
      { type: "Tenaments", value: 11 },
      { type: "Rental", value: 15 },
      { type: "Commercial", value: 10 },
    ],
  };

  const COLORS = ["#8E44AD", "#2980B9", "#27AE60", "#F39C12"];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4 capitalize">
        Employees Efforts To (Visites, Find-Property) (Monthly)
      </h2>
      <div style={{ width: "100%", height: 420 }}>
        <ResponsiveContainer>
          <BarChart
            data={barData}
            margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="employe" tick={{ fill: "#6B7280", fontSize: 15 }} />
            <YAxis tick={{ fill: "#6B7280", fontSize: 15 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="Newvisites" fill="#4394E5" radius={[4, 4, 0, 0]} />
            <Bar dataKey="revisites" fill="#3D2785" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Property" fill="#F0561D" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart Section (1 per employee) */}
      <h2 className="text-2xl font-semibold text-gray-900 mt-20 mb-8 capitalize">
        Individual Property Type Distribution (Per Employee)
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(pieDataPerEmployee).map(([employee, pieData]) => (
          <div
            key={employee}
            className="bg-gray-50 rounded-md p-4 shadow-sm border"
          >
            <h4 className="text-sm font-medium text-center mb-2 text-gray-700">
              {employee}
            </h4>
            <div style={{ width: "100%", height: 250 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    labelLine={false}
                    label={({ type, percent }) =>
                      `${type} (${(percent * 100).toFixed(0)}%)`
                    }
                  >
                    {pieData.map((_, index) => (
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
        ))}
      </div>
    </div>
  );
};

export default Analytics;
