/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from "react";
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
import { Plus, Edit, Trash2, X, Check, Loader } from "lucide-react";

const Analytics = () => {
  const [barData, setBarData] = useState([]);
  const [pieDataPerEmployee, setPieDataPerEmployee] = useState({});
  const [showBarModal, setShowBarModal] = useState(false);
  const [showPieModal, setShowPieModal] = useState(false);
  const [editingBarIndex, setEditingBarIndex] = useState(null);
  const [editingPieEmployee, setEditingPieEmployee] = useState(null);
  const [zoomRange, setZoomRange] = useState([0, 0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const chartContainerRef = useRef(null);

  const [barForm, setBarForm] = useState({
    employe: "",
    Newvisites: 0,
    revisites: 0,
    Property: 0,
  });

  const [pieForm, setPieForm] = useState({
    employe: "",
    House: 0,
    Tenaments: 0,
    Rental: 0,
    Commercial: 0,
  });

  const COLORS = ["#8E44AD", "#2980B9", "#27AE60", "#F39C12"];
  const API_BASE_URL = "http://localhost:8000"; // Change this to your backend URL

  const fetchBarData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/getAll`);
      if (!response.ok) throw new Error("Failed to fetch bar data");
      const data = await response.json();
      setBarData(data);
      setZoomRange([0, data.length]);
    } catch (err) {
      setError("Failed to load bar chart data");
      console.error(err);
    }
  };

  const fetchPieData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/piedata/getAll`);
      if (!response.ok) throw new Error("Failed to fetch pie data");
      const data = await response.json();

      // Transform backend data to frontend format
      const transformedData = {};
      data.forEach((item) => {
        transformedData[item.employe] = [
          { type: "House", value: item.House },
          { type: "Tenaments", value: item.Tenaments },
          { type: "Rental", value: item.Rental },
          { type: "Commercial", value: item.Commercial },
        ];
      });

      setPieDataPerEmployee(transformedData);
    } catch (err) {
      setError("Failed to load pie chart data");
      console.error(err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchBarData(), fetchPieData()]);
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    setZoomRange([0, barData.length]);
  }, [barData.length]);

  useEffect(() => {
    const container = chartContainerRef.current;

    const handleWheel = (e) => {
      if (container && container.contains(e.target)) {
        e.preventDefault();

        const delta = Math.sign(e.deltaY);
        const minZoom = 3;
        const maxZoom = barData.length;

        let [start, end] = zoomRange;
        const currentLength = end - start;

        if (delta > 0 && currentLength > minZoom) {
          setZoomRange([start + 1, end - 1]);
        } else if (delta < 0 && currentLength < maxZoom) {
          const newStart = Math.max(0, start - 1);
          const newEnd = Math.min(barData.length, end + 1);
          setZoomRange([newStart, newEnd]);
        }
      }
    };

    container?.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container?.removeEventListener("wheel", handleWheel);
    };
  }, [zoomRange, barData.length]);

  const handleBarSubmit = async () => {
    try {
      if (editingBarIndex !== null) {
        // Update existing
        const itemToUpdate = barData[editingBarIndex];
        const response = await fetch(
          `${API_BASE_URL}/analytics/update/${itemToUpdate._id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(barForm),
          }
        );

        if (!response.ok) throw new Error("Failed to update");
        await fetchBarData();
        setEditingBarIndex(null);
      } else {
        // Create new
        const response = await fetch(`${API_BASE_URL}/analytics/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(barForm),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create");
        }
        await fetchBarData();
      }

      setBarForm({ employe: "", Newvisites: 0, revisites: 0, Property: 0 });
      setShowBarModal(false);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditBar = (index) => {
    setBarForm(barData[index]);
    setEditingBarIndex(index);
    setShowBarModal(true);
  };

  const handleDeleteBar = async (index) => {
    try {
      const itemToDelete = barData[index];
      const response = await fetch(
        `${API_BASE_URL}/analytics/delete/${itemToDelete._id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete");

      await fetchBarData();

      try {
        await fetch(`${API_BASE_URL}/piedata/delete/${itemToDelete.employe}`, {
          method: "DELETE",
        });
        await fetchPieData();
      } catch (err) {
        // Pie data might not exist, ignore error
      }

      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePieSubmit = async () => {
    try {
      if (editingPieEmployee) {
        const response = await fetch(
          `${API_BASE_URL}/piedata/update/${editingPieEmployee}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pieForm),
          }
        );

        if (!response.ok) throw new Error("Failed to update pie data");
        setEditingPieEmployee(null);
      } else {
        const response = await fetch(`${API_BASE_URL}/piedata/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(pieForm),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create pie data");
        }
      }

      await fetchPieData();
      setPieForm({
        employe: "",
        House: 0,
        Tenaments: 0,
        Rental: 0,
        Commercial: 0,
      });
      setShowPieModal(false);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditPie = (employe) => {
    const data = pieDataPerEmployee[employe];
    setPieForm({
      employe,
      House: data.find((d) => d.type === "House")?.value || 0,
      Tenaments: data.find((d) => d.type === "Tenaments")?.value || 0,
      Rental: data.find((d) => d.type === "Rental")?.value || 0,
      Commercial: data.find((d) => d.type === "Commercial")?.value || 0,
    });
    setEditingPieEmployee(employe);
    setShowPieModal(true);
  };

  const handleDeletePie = async (employe) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/piedata/delete/${employe}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete pie data");

      await fetchPieData();
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForms = () => {
    setBarForm({ employe: "", Newvisites: 0, revisites: 0, Property: 0 });
    setPieForm({
      employe: "",
      House: 0,
      Tenaments: 0,
      Rental: 0,
      Commercial: 0,
    });
    setEditingBarIndex(null);
    setEditingPieEmployee(null);
    setError("");
  };

  const visibleBarData = barData.slice(zoomRange[0], zoomRange[1]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center justify-center min-h-96">
        <div className="flex items-center space-x-2">
          <Loader className="animate-spin" size={20} />
          <span>Loading analytics data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <h2 className="text-2xl font-semibold text-gray-900 mb-4 capitalize">
        Employee Work Details For BarChart (Monthly)
      </h2>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Employee
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                New Visits
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Revisits
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Property
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {barData.map((row, index) => (
              <tr
                key={row._id || index}
                className="border-t border-gray-200 hover:bg-gray-50"
              >
                <td className="px-4 py-2 text-sm text-gray-900">
                  {row.employe}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900">
                  {row.Newvisites}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900">
                  {row.revisites}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900">
                  {row.Property}
                </td>
                <td className="px-4 py-2 text-sm">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditBar(index)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteBar(index)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 capitalize">
          Employee Efforts (Visits, Find-Property) (Monthly)
        </h2>
        <button
          onClick={() => setShowBarModal(true)}
          className="bg-red-500 hover:bg-red-600 text-sm text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
        >
          <Plus size={16} />
          <span>Add Data</span>
        </button>
      </div>

      <div
        ref={chartContainerRef}
        style={{ width: "100%", height: 420, overflow: "hidden" }}
      >
        <ResponsiveContainer>
          <BarChart
            data={visibleBarData}
            margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="employe" tick={{ fill: "#1F2937", fontSize: 15 }} />
            <YAxis tick={{ fill: "#1F2937", fontSize: 15 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="Newvisites" fill="#4394E5" radius={[4, 4, 0, 0]} />
            <Bar dataKey="revisites" fill="#3D2785" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Property" fill="#F0561D" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-20 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8 capitalize">
          Individual Property Type Distribution (Per-Employee)
        </h2>
        <button
          onClick={() => setShowPieModal(true)}
          className="bg-red-500 hover:bg-red-600 text-sm text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
        >
          <Plus size={16} />
          <span>Add Data</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(pieDataPerEmployee).map(([employe, pieData]) => (
          <div
            key={employe}
            className="bg-gray-50 rounded-md p-4 shadow-sm border hover:shadow-lg relative"
          >
            <div className="absolute top-2 right-2 flex space-x-1">
              <button
                onClick={() => handleEditPie(employe)}
                className="text-blue-600 hover:text-blue-800 p-1 bg-white rounded"
              >
                <Edit size={14} />
              </button>
              <button
                onClick={() => handleDeletePie(employe)}
                className="text-red-600 hover:text-red-800 p-1 bg-white rounded"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <h4 className="text-md font-medium text-center mb-2 text-gray-700 pr-16">
              {employe}
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

      {/* Bar Chart Modal */}
      {showBarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingBarIndex !== null ? "Edit" : "Add"} Employee Data
              </h3>
              <button
                onClick={() => {
                  setShowBarModal(false);
                  resetForms();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee Name
                </label>
                <input
                  type="text"
                  value={barForm.employe}
                  onChange={(e) =>
                    setBarForm({ ...barForm, employe: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Visits
                </label>
                <input
                  type="number"
                  value={barForm.Newvisites}
                  onChange={(e) =>
                    setBarForm({
                      ...barForm,
                      Newvisites: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Revisits
                </label>
                <input
                  type="number"
                  value={barForm.revisites}
                  onChange={(e) =>
                    setBarForm({
                      ...barForm,
                      revisites: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property
                </label>
                <input
                  type="number"
                  value={barForm.Property}
                  onChange={(e) =>
                    setBarForm({
                      ...barForm,
                      Property: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  min="0"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowBarModal(false);
                    resetForms();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleBarSubmit}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors flex items-center space-x-2"
                >
                  <Check size={16} />
                  <span>{editingBarIndex !== null ? "Update" : "Add"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pie Chart Modal */}
      {showPieModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingPieEmployee ? "Edit" : "Add"} Property Distribution
              </h3>
              <button
                onClick={() => {
                  setShowPieModal(false);
                  resetForms();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee Name
                </label>
                <input
                  type="text"
                  value={pieForm.employe}
                  onChange={(e) =>
                    setPieForm({ ...pieForm, employe: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                  disabled={editingPieEmployee !== null}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  House
                </label>
                <input
                  type="number"
                  value={pieForm.House}
                  onChange={(e) =>
                    setPieForm({
                      ...pieForm,
                      House: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tenaments
                </label>
                <input
                  type="number"
                  value={pieForm.Tenaments}
                  onChange={(e) =>
                    setPieForm({
                      ...pieForm,
                      Tenaments: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rental
                </label>
                <input
                  type="number"
                  value={pieForm.Rental}
                  onChange={(e) =>
                    setPieForm({
                      ...pieForm,
                      Rental: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Commercial
                </label>
                <input
                  type="number"
                  value={pieForm.Commercial}
                  onChange={(e) =>
                    setPieForm({
                      ...pieForm,
                      Commercial: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  min="0"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowPieModal(false);
                    resetForms();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePieSubmit}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors flex items-center space-x-2"
                >
                  <Check size={16} />
                  <span>{editingPieEmployee ? "Update" : "Add"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
