import React, { useState } from "react";
import { Plus, Edit2, Save, X, Trash2 } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  number: string;
  address: string;
}

const initialTeamData: TeamMember[] = [
  {
    id: "TM-001",
    name: "Mehulbhai Bhuva",
    number: "+91 9876543001",
    address: "Savarkundla, Amreli",
  },
  {
    id: "TM-002",
    name: "Arjunbhai Patel",
    number: "+91 9876543002",
    address: "Maninagar, Ahmedabad",
  },
  {
    id: "TM-003",
    name: "Jaydeepbhai Joshi",
    number: "+91 9876543003",
    address: "Gotri Road, Vadodara",
  },
  {
    id: "TM-004",
    name: "Mehulbhai Desai",
    number: "+91 9876543004",
    address: "Zanzarda Road, Junagadh",
  },
  {
    id: "TM-005",
    name: "Arpitbhai Shah",
    number: "+91 9876543005",
    address: "University Road, Rajkot",
  },
  {
    id: "TM-006",
    name: "Mayaben Rana",
    number: "+91 9876543006",
    address: "Rander Road, Surat",
  },
  {
    id: "TM-007",
    name: "Jinalben Mehta",
    number: "+91 9876543007",
    address: "Sector 8, Gandhinagar",
  },
  {
    id: "TM-008",
    name: "Jigneshbhai Trivedi",
    number: "+91 9876543008",
    address: "Khodiyar Nagar, Jamnagar",
  },
  {
    id: "TM-009",
    name: "Sureshbhai Solanki",
    number: "+91 9876543009",
    address: "Kuber Nagar, Ahmedabad",
  },
  {
    id: "TM-010",
    name: "Kamleshbhai Bhatt",
    number: "+91 9876543010",
    address: "Navsari Bazar, Navsari",
  },
  {
    id: "TM-011",
    name: "Hastiben Parmar",
    number: "+91 9876543011",
    address: "Station Road, Bhuj",
  },
  {
    id: "TM-012",
    name: "Rajbhai Gohil",
    number: "+91 9876543012",
    address: "Kalavad Road, Rajkot",
  },
  {
    id: "TM-013",
    name: "Niyatiben Shah",
    number: "+91 9876543013",
    address: "Gorwa, Vadodara",
  },
];

const Demorampe: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamData);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<TeamMember>({
    id: "",
    name: "",
    number: "",
    address: "",
  });
  const [errors, setErrors] = useState<Partial<TeamMember>>({});

  const generateNewId = (): string => {
    const maxId = teamMembers.reduce((max, member) => {
      const num = parseInt(member.id.split("-")[1]);
      return num > max ? num : max;
    }, 0);
    return `TM-${String(maxId + 1).padStart(3, "0")}`;
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<TeamMember> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.number.trim()) {
      newErrors.number = "Phone number is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

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
    setFormData({
      id: newId,
      name: "",
      number: "+91 ",
      address: "",
    });
    setEditingId(null);
    setShowForm(true);
    setErrors({});
  };

  const handleEditMember = (member: TeamMember) => {
    setFormData({ ...member });
    setEditingId(member.id);
    setShowForm(true);
    setErrors({});
  };

  const handleSaveMember = () => {
    if (!validateForm()) return;

    if (editingId) {
      setTeamMembers((prev) =>
        prev.map((member) =>
          member.id === editingId ? { ...formData } : member
        )
      );
    } else {
      setTeamMembers((prev) => [...prev, { ...formData }]);
    }

    handleCancelForm();
  };

  const handleDeleteMember = (id: string) => {
    if (window.confirm("Are you sure you want to delete this team member?")) {
      setTeamMembers((prev) => prev.filter((member) => member.id !== id));
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      id: "",
      name: "",
      number: "",
      address: "",
    });
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
                  {editingId ? "Edit Team Member" : "Add New Team Member"}
                </h2>
                <button
                  onClick={handleCancelForm}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
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
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter full name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    value={formData.number}
                    onChange={(e) =>
                      handleInputChange("number", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.number ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="+91 9876543210"
                  />
                  {errors.number && (
                    <p className="text-red-500 text-sm mt-1">{errors.number}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                      errors.address ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter complete address"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSaveMember}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Save size={16} />
                    {editingId ? "Update" : "Save"}
                  </button>
                  <button
                    onClick={handleCancelForm}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

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
            {teamMembers.map((member) => (
              <tr
                key={member.id}
                className="hover:bg-gray-100 transition-colors"
              >
                <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap font-medium">
                  {member.id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  {member.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  {member.number}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  {member.address}
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
                      onClick={() => handleDeleteMember(member.id)}
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
          <p className="text-lg">
            No team members found / Please add team members.
          </p>
        </div>
      )}
    </div>
  );
};

export default Demorampe;
