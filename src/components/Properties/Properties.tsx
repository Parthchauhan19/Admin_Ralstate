import React, { useState } from "react";
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
} from "lucide-react";
import PropertyForm from "./PropertyForm";

interface Property {
  id: number;
  title: string;
  price: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  status: "For Sale" | "For Rent" | "Sold";
  image: string;
  agent: string;
  type: string;
}

const Properties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([
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
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || property.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleAddProperty = (propertyData: Omit<Property, "id">) => {
    const newProperty = {
      ...propertyData,
      id: Date.now(),
    };
    setProperties([...properties, newProperty]);
    setShowForm(false);
  };

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
    setShowForm(true);
  };

  const handleUpdateProperty = (propertyData: Omit<Property, "id">) => {
    if (editingProperty) {
      setProperties(
        properties.map((p) =>
          p.id === editingProperty.id
            ? { ...propertyData, id: editingProperty.id }
            : p
        )
      );
      setEditingProperty(null);
      setShowForm(false);
    }
  };

  const handleDeleteProperty = (id: number) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      setProperties(properties.filter((p) => p.id !== id));
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProperty(null);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-600">Manage your property listings</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Property
        </button>
      </div>

      {/* Search and Filter */}
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

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <div
            key={property.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="relative">
              <img
                src={property.image}
                alt={property.title}
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
                {property.title}
              </h3>
              <p className="text-2xl font-bold text-green-600 mb-2">
                {property.price}
              </p>

              <div className="flex items-center gap-1 text-gray-600 mb-3">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{property.location}</span>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Bed className="w-4 h-4" />
                  <span>{property.bedrooms}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Bath className="w-4 h-4" />
                  <span>{property.bathrooms}</span>
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
                  <button className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEditProperty(property)}
                    className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteProperty(property.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Property Form Modal */}
      {showForm && (
        <PropertyForm
          property={editingProperty}
          onSave={editingProperty ? handleUpdateProperty : handleAddProperty}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};

export default Properties;
