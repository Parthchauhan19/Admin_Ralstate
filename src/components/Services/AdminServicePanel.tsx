/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import axios from "axios";

interface ServiceRequest {
  _id: string;
  phone: string;
  createdAt: string;
}

const AdminServicePanel: React.FC = () => {
  const [services, setServices] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchServiceRequests = async () => {
      try {
        const res = await axios.get("http://localhost:8000/service");
        setServices(res.data);
      } catch (err: any) {
        setError("Failed to fetch service data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceRequests();
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-medium mb-6 text-gray-900 ">
        Service Requests
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : services.length === 0 ? (
        <p>No service requests found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded hover:shadow-md">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-4 border">id</th>
                <th className="py-3 px-4 border">Phone Number</th>
                <th className="py-3 px-4 border">Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service, index) => (
                <tr key={service._id} className="text-center hover:bg-gray-100">
                  <td className="py-2 px-4 border">{index + 1}</td>
                  <td className="py-2 px-4 border">{service.phone}</td>
                  <td className="py-2 px-4 border">
                    {new Date(service.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminServicePanel;
