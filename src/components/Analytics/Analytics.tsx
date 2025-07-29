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
import { Plus, Edit, Trash2, X, Check } from "lucide-react";

const Analytics: React.FC = () => {
  const initialBarData = [
    { employe: "Arjunbhai", Newvisites: 45, revisites: 23, Property: 21 },
    { employe: "Jaydeepbhai", Newvisites: 52, revisites: 28, Property: 5 },
    { employe: "Mehulbhai", Newvisites: 38, revisites: 31, Property: 15 },
    { employe: "ArpitBhai", Newvisites: 65, revisites: 35, Property: 10 },
    { employe: "Mayaben", Newvisites: 58, revisites: 42, Property: 17 },
    { employe: "Jinalben", Newvisites: 72, revisites: 38, Property: 13 },
    { employe: "Jigneshbhai", Newvisites: 35, revisites: 42, Property: 25 },
    { employe: "Sureshbhai", Newvisites: 47, revisites: 29, Property: 18 },
    { employe: "Kamleshbhai", Newvisites: 60, revisites: 33, Property: 20 },
    { employe: "Hastiben", Newvisites: 55, revisites: 40, Property: 12 },
    { employe: "Rajbhai", Newvisites: 42, revisites: 25, Property: 14 },
    { employe: "Niyatiben", Newvisites: 66, revisites: 36, Property: 22 },
  ];

  const initialPieData = {
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
    Sureshbhai: [
      { type: "House", value: 47 },
      { type: "Tenaments", value: 29 },
      { type: "Rental", value: 18 },
      { type: "Commercial", value: 3 },
    ],
    Kamleshbhai: [
      { type: "House", value: 60 },
      { type: "Tenaments", value: 33 },
      { type: "Rental", value: 20 },
      { type: "Commercial", value: 10 },
    ],
    Hastiben: [
      { type: "House", value: 55 },
      { type: "Tenaments", value: 40 },
      { type: "Rental", value: 12 },
      { type: "Commercial", value: 7 },
    ],
    Rajbhai: [
      { type: "House", value: 42 },
      { type: "Tenaments", value: 25 },
      { type: "Rental", value: 14 },
      { type: "Commercial", value: 6 },
    ],
    Niyatiben: [
      { type: "House", value: 66 },
      { type: "Tenaments", value: 36 },
      { type: "Rental", value: 22 },
      { type: "Commercial", value: 4 },
    ],
  };

  const [barData, setBarData] = useState(initialBarData);
  const [pieDataPeremploye, setPieDataPeremploye] = useState(initialPieData);
  const [showBarModal, setShowBarModal] = useState(false);
  const [showPieModal, setShowPieModal] = useState(false);
  const [editingBarIndex, setEditingBarIndex] = useState<number | null>(null);
  const [editingPieemploye, setEditingPieemploye] = useState<string | null>(
    null
  );
  const [zoomRange, setZoomRange] = useState<[number, number]>([
    0,
    barData.length,
  ]);
  const chartContainerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    setZoomRange([0, barData.length]);
  }, [barData.length]);

  useEffect(() => {
    const container = chartContainerRef.current;

    const handleWheel = (e: WheelEvent) => {
      if (container && container.contains(e.target as Node)) {
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

  const visibleBarData = barData.slice(zoomRange[0], zoomRange[1]);

  const handleBarSubmit = () => {
    if (editingBarIndex !== null) {
      const updatedData = [...barData];
      updatedData[editingBarIndex] = barForm;
      setBarData(updatedData);
      setEditingBarIndex(null);
    } else {
      setBarData([...barData, barForm]);
    }
    setBarForm({ employe: "", Newvisites: 0, revisites: 0, Property: 0 });
    setShowBarModal(false);
  };

  const handleEditBar = (index: number) => {
    setBarForm(barData[index]);
    setEditingBarIndex(index);
    setShowBarModal(true);
  };

  const handleDeleteBar = (index: number) => {
    const updatedData = barData.filter((_, i) => i !== index);
    setBarData(updatedData);

    const employeName = barData[index].employe;
    const newPieData = { ...pieDataPeremploye };
    delete newPieData[employeName];
    setPieDataPeremploye(newPieData);
  };

  const handlePieSubmit = () => {
    const pieData = [
      { type: "House", value: pieForm.House },
      { type: "Tenaments", value: pieForm.Tenaments },
      { type: "Rental", value: pieForm.Rental },
      { type: "Commercial", value: pieForm.Commercial },
    ];

    if (editingPieemploye) {
      setPieDataPeremploye({
        ...pieDataPeremploye,
        [pieForm.employe]: pieData,
      });
      setEditingPieemploye(null);
    } else {
      setPieDataPeremploye({
        ...pieDataPeremploye,
        [pieForm.employe]: pieData,
      });
    }

    setPieForm({
      employe: "",
      House: 0,
      Tenaments: 0,
      Rental: 0,
      Commercial: 0,
    });
    setShowPieModal(false);
  };

  const handleEditPie = (employe: string) => {
    const data = pieDataPerEmploye[employe];
    setPieForm({
      employe,
      House: data.find((d) => d.type === "House")?.value || 0,
      Tenaments: data.find((d) => d.type === "Tenaments")?.value || 0,
      Rental: data.find((d) => d.type === "Rental")?.value || 0,
      Commercial: data.find((d) => d.type === "Commercial")?.value || 0,
    });
    setEditingPieEmploye(employe);
    setShowPieModal(true);
  };

  const handleDeletePie = (employe: string) => {
    const newPieData = { ...pieDataPerEmploye };
    delete newPieData[employe];
    setPieDataPerEmploye(newPieData);
  };

  const resetBarForm = () => {
    setBarForm({ employe: "", Newvisites: 0, revisites: 0, Property: 0 });
    setEditingBarIndex(null);
  };

  const resetPieForm = () => {
    setPieForm({
      employe: "",
      House: 0,
      Tenaments: 0,
      Rental: 0,
      Commercial: 0,
    });
    setEditingPieemploye(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4 capitalize flex items-center justify-between">
        employes Wrok Details For BarChart (Monthly)
      </h2>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                employe
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
                key={index}
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

      <h2 className="mt-6 text-2xl font-semibold text-gray-900 mb-4 capitalize flex items-center justify-between flex-col sm:flex-row sm:items-center sm:justify-between">
        employes Efforts To (Visits, Find-Property) (Monthly)
        <button
          onClick={() => setShowBarModal(true)}
          className="bg-red-500 hover:bg-red-600 text-sm text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors sm:w-auto mt-5"
        >
          <Plus size={16} />
          <span>Add Data</span>
        </button>
      </h2>

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

      <h2 className="text-2xl font-semibold text-gray-900 mt-20 mb-8 capitalize flex items-center justify-between flex-col sm:flex-row sm:items-center sm:justify-between">
        Individual Property Type Distribution (Per-employe)
        <button
          onClick={() => setShowPieModal(true)}
          className="bg-red-500 hover:bg-red-600 text-sm text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors sm:w-auto mt-5"
        >
          <Plus size={16} />
          <span>Add Data</span>
        </button>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(pieDataPeremploye).map(([employe, pieData]) => (
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

      {showBarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingBarIndex !== null ? "Edit" : "Add"} employe Data
              </h3>
              <button
                onClick={() => {
                  setShowBarModal(false);
                  resetBarForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  employe Name
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
                    resetBarForm();
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

      {showPieModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingPieemploye ? "Edit" : "Add"} Property Distribution
              </h3>
              <button
                onClick={() => {
                  setShowPieModal(false);
                  resetPieForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  employe Name
                </label>
                <input
                  type="text"
                  value={pieForm.employe}
                  onChange={(e) =>
                    setPieForm({ ...pieForm, employe: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                  disabled={editingPieemploye !== null}
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
                    resetPieForm();
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
                  <span>{editingPieemploye ? "Update" : "Add"}</span>
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
