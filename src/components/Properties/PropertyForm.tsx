import React, { useState } from "react";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../Server/Server";

const PropertyForm: React.FC = () => {
  const [formData, setFormData] = useState({
    propertyTitle: "",
    price: "",
    location: "",
    bedroom: 1,
    bathroom: 1,
    area: "",
    status: "For Sale",
    image: "",
    agent: "",
    propertyType: "House",
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "bedroom" || name === "bathroom" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}property/create`, formData);
      console.log("Saved Property:", res.data);

      alert("Property added successfully!");

      // Reset form
      setFormData({
        propertyTitle: "",
        price: "",
        location: "",
        bedroom: 1,
        bathroom: 1,
        area: "",
        status: "For Sale",
        image: "",
        agent: "",
        propertyType: "House",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error saving property:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to add property";
      setError(errorMessage);
      alert(errorMessage);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Add New Property
          </h2>
          <Link
            to="/properties"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Property Title"
              name="propertyTitle"
              value={formData.propertyTitle}
              onChange={handleChange}
              placeholder="Enter property title"
              required
            />

            <InputField
              label="Price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g., 850,000"
              required
            />

            <InputField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter location"
              required
            />

            <SelectField
              label="Property Type"
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
              options={["House", "Apartment", "Villa", "Condo", "Townhouse"]}
            />

            <InputField
              label="Bedrooms"
              name="bedroom"
              value={formData.bedroom}
              onChange={handleChange}
              type="number"
              min={1}
              required
            />

            <InputField
              label="Bathrooms"
              name="bathroom"
              value={formData.bathroom}
              onChange={handleChange}
              type="number"
              min={1}
              required
            />

            <InputField
              label="Area"
              name="area"
              value={formData.area}
              onChange={handleChange}
              placeholder="e.g., 2,500 sq ft"
              required
            />

            <SelectField
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={["For Sale", "For Rent", "Sold"]}
            />

            <InputField
              label="Agent"
              name="agent"
              value={formData.agent}
              onChange={handleChange}
              placeholder="Enter agent name"
              required
            />

            <InputField
              label="Image URL"
              name="image"
              type="url"
              value={formData.image}
              onChange={handleChange}
              placeholder="Enter image URL"
              required
            />
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <Link
              to="/properties"
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Reusable InputField Component
const InputField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  ...rest
}: {
  label: string;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  onChange: React.ChangeEventHandler;
  placeholder?: string;
  type?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      {...rest}
    />
  </div>
);

// Reusable SelectField Component
const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
}: {
  label: string;
  name: string;
  value: string;
  onChange: React.ChangeEventHandler;
  options: string[];
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

export default PropertyForm;
