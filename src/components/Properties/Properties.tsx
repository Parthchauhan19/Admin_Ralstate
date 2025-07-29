import React, { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Bed,
  Bath,
  Square,
  AlertCircle,
  X,
} from "lucide-react";
import axios from "axios";
import { API_URL } from "../Server/Server";
import { Link } from "react-router-dom";

interface Property {
  _id: string;
  propertyTitle: string;
  price: string;
  location: string;
  bedroom: number;
  bathroom: number;
  area: string;
  status: "For Sale" | "For Rent" | "Sold";
  image: string;
  agent: string;
  type: string;
}

interface ApiResponse {
  success: boolean;
  data?: Property | Property[];
  message?: string;
  count?: number;
}

const Properties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchProperties = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${API_URL}property/getAll`);
      const apiResponse = response.data;

      if (apiResponse.success && Array.isArray(apiResponse.data)) {
        setProperties(apiResponse.data);
      } else {
        setProperties(Array.isArray(response.data) ? response.data : []);
      }
    } catch (err: any) {
      console.error("Error fetching properties:", err);
      setError("Failed to fetch properties. Please try again.");
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const filteredProperties = properties.filter((property) => {
    const propertyTitle = property.propertyTitle?.toLowerCase() || "";
    const location = property.location?.toLowerCase() || "";
    const status = property.status;

    const matchesSearch =
      propertyTitle.includes(searchTerm.toLowerCase()) ||
      location.includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === "all" || status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const handleDeleteProperty = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this property?")) {
      return;
    }

    setError("");
    try {
      const response = await axios.delete(`${API_URL}property/delete/${id}`);
      const apiResponse: ApiResponse = response.data;

      if (apiResponse.success || response.status === 200) {
        setProperties(properties.filter((p) => p._id !== id));
      } else {
        setError("Failed to delete the property.");
      }
    } catch (err: any) {
      console.error("Failed to delete property:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to delete property";
      setError(errorMessage);
    }
  };

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
    setShowForm(true);
  };

  const handleUpdateProperty = async () => {
    if (!editingProperty) return;

    setError("");
    try {
      const response = await axios.put(
        `${API_URL}property/update/${editingProperty._id}`,
        editingProperty
      );
      const apiResponse: ApiResponse = response.data;

      if (apiResponse.success && apiResponse.data) {
        const updated = apiResponse.data as Property;
        setProperties((prev) =>
          prev.map((p) => (p._id === updated._id ? updated : p))
        );

        alert("Property updated successfully!");

        // ✅ Automatically close modal
        setShowForm(false);
        setEditingProperty(null);
      } else {
        setError("Failed to update property.");
      }
    } catch (err: any) {
      console.error("Update failed:", err);
      setError(err.response?.data?.message || "Failed to update property");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!editingProperty) return;

    const { name, value } = e.target;

    setEditingProperty((prev) => {
      if (!prev) return prev;

      const numericFields = ["bedroom", "bathroom"];
      return {
        ...prev,
        [name]: numericFields.includes(name) ? parseInt(value) : value,
      };
    });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-600">Manage your property listings</p>
        </div>
        <Link
          to="/properties-form"
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Property
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="For Sale">For Sale</option>
            <option value="For Rent">For Rent</option>
            <option value="Sold">Sold</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          <p className="mt-2 text-gray-600">Loading properties...</p>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">
            {searchTerm || filterStatus !== "all"
              ? "No properties found matching your criteria."
              : "No properties available. Add your first property!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <div
              key={property._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative">
                <img
                  src={property.image || "/api/placeholder/400/300"}
                  alt={property.propertyTitle}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4">
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
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {property.propertyTitle}
                </h3>
                <p className="text-2xl font-bold text-green-600 mb-2">
                  ₹{Number(property.price).toLocaleString()}
                </p>

                <div className="flex items-center gap-1 text-gray-600 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{property.location}</span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Bed className="w-4 h-4" />
                    <span>{property.bedroom}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="w-4 h-4" />
                    <span>{property.bathroom}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Square className="w-4 h-4" />
                    <span>{property.area}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Agent: {property.agent}
                  </span>
                  <div className="flex items-center gap-2">
                    <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditProperty(property)}
                      className="p-1 text-green-600 hover:bg-green-50 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProperty(property._id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {showForm && editingProperty && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl p-6 rounded-lg relative">
            <button
              onClick={() => {
                setShowForm(false);
                setEditingProperty(null);
              }}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X />
            </button>
            <h2 className="text-xl font-bold mb-4">Edit Property</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                "propertyTitle",
                "price",
                "location",
                "bedroom",
                "bathroom",
                "area",
                "agent",
                "type",
                "image",
              ].map((field) => (
                <input
                  key={field}
                  name={field}
                  value={(editingProperty as any)[field]}
                  onChange={handleInputChange}
                  placeholder={field}
                  className="border px-3 py-2 rounded-lg"
                />
              ))}
              <select
                name="status"
                value={editingProperty.status}
                onChange={handleInputChange}
                className="border px-3 py-2 rounded-lg col-span-2"
              >
                <option value="For Sale">For Sale</option>
                <option value="For Rent">For Rent</option>
                <option value="Sold">Sold</option>
              </select>
            </div>
            <button
              onClick={handleUpdateProperty}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Properties;
