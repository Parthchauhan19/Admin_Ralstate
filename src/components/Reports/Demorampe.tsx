import React, { useState, useEffect } from "react";
import { Plus, Edit2, Save, X, Trash2 } from "lucide-react";

interface TeamMember {
  _id?: string;
  id: string;
  Name: string;
  Number: string;
  Address: string;
  createdAt?: string;
  updatedAt?: string;
}

const Demorampe: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingName, setEditingName] = useState<string | null>(null);
  const [formData, setFormData] = useState<TeamMember>({
    id: "",
    Name: "",
    Number: "+91 ",
    Address: "",
  });
  const [errors, setErrors] = useState<Partial<TeamMember>>({});

  const API_URL = "http://localhost:8000";

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch(`${API_URL}/teammember/getAll`);
      const result = await response.json();
      setTeamMembers(result.data || result);
    } catch (error) {
      console.error("Failed to fetch team members", error);
    } finally {
      setLoading(false);
    }
  };

  const generateNewId = (): string => {
    const maxId = teamMembers.reduce((max, member) => {
      const num = parseInt(member.id?.replace(/\D/g, "") || "0");
      return num > max ? num : max;
    }, 0);
    return `TM${String(maxId + 1).padStart(3, "0")}`;
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<TeamMember> = {};
    if (!formData.Name.trim()) newErrors.Name = "Name is required";
    if (!formData.Number.trim() || formData.Number === "+91 ")
      newErrors.Number = "Phone number is required";
    if (!formData.Address.trim()) newErrors.Address = "Address is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof TeamMember, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAddMember = () => {
    const newId = generateNewId();
    setFormData({ id: newId, Name: "", Number: "+91 ", Address: "" });
    setEditingName(null);
    setShowForm(true);
    setErrors({});
  };

  const handleEditMember = (member: TeamMember) => {
    setFormData({
      id: member.id,
      Name: member.Name,
      Number: member.Number,
      Address: member.Address,
    });
    setEditingName(member.Name);
    setShowForm(true);
    setErrors({});
  };

  const handleSaveMember = async () => {
    if (!validateForm()) return;

    try {
      let response;

      if (editingName) {
        response = await fetch(`${API_URL}/teammember/update/${editingName}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: formData.id,
            Name: formData.Name,
            Number: formData.Number,
            Address: formData.Address,
          }),
        });
      } else {
        response = await fetch(`${API_URL}/teammember/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: formData.id,
            Name: formData.Name,
            Number: formData.Number,
            Address: formData.Address,
          }),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save member");
      }

      await fetchTeamMembers();
      handleCancelForm();
    } catch (error: any) {
      console.error("Failed to save member", error);
      alert(error.message || "Failed to save member");
    }
  };

  const handleDeleteMember = async (name: string) => {
    if (window.confirm("Are you sure you want to delete this team member?")) {
      try {
        const response = await fetch(`${API_URL}/teammember/delete/${name}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete member");
        }

        await fetchTeamMembers();
      } catch (error) {
        console.error("Failed to delete member", error);
        alert("Failed to delete member");
      }
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingName(null);
    setFormData({ id: "", Name: "", Number: "+91 ", Address: "" });
    setErrors({});
  };

  return (
    <div className="p-4 max-w-8xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-700 mt-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <span>Team Members Details</span>
          <button
            onClick={handleAddMember}
            className="flex items-center justify-center h-10 text-sm gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors w-full sm:w-auto"
          >
            <Plus size={16} />
            Add Team Member
          </button>
        </div>
      </h1>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {editingName ? "Edit Team Member" : "Add New Team Member"}
                </h2>
                <button
                  onClick={handleCancelForm}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ID
                  </label>
                  <input
                    type="text"
                    value={formData.id}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.Name}
                    onChange={(e) => handleInputChange("Name", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.Name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter full name"
                  />
                  {errors.Name && (
                    <p className="text-red-500 text-sm mt-1">{errors.Name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    value={formData.Number}
                    onChange={(e) =>
                      handleInputChange("Number", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.Number ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="+91 9876543210"
                  />
                  {errors.Number && (
                    <p className="text-red-500 text-sm mt-1">{errors.Number}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <textarea
                    value={formData.Address}
                    onChange={(e) =>
                      handleInputChange("Address", e.target.value)
                    }
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                      errors.Address ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter complete address"
                  />
                  {errors.Address && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.Address}
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSaveMember}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Save size={16} />
                    {editingName ? "Update" : "Save"}
                  </button>
                  <button
                    onClick={handleCancelForm}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-gray-500 text-center py-10">Loading...</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700 border-b">
                    ID
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700 border-b">
                    Name
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700 border-b">
                    Number
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700 border-b">
                    Address
                  </th>
                  <th className="text-center px-6 py-3 text-sm font-semibold text-gray-700 border-b">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {teamMembers.map((member, index) => (
                  <tr
                    key={member._id || member.id || index}
                    className="hover:bg-gray-100 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                      {member.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {member.Name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {member.Number}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {member.Address}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditMember(member)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteMember(member.Name)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete"
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

          {teamMembers.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No team members found. Please add some.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Demorampe;
