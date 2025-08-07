import { useEffect, useState } from "react";
import axios from "axios";

type Inquiry = {
  _id: string;
  inquiryType: string;
  userType: string;
  firstName: string;
  middleName: string;
  email: string;
  location: string;
  zip: string;
  propertyType: string;
  contactNo: string;
  yourMessage: string;
  createdAt: string;
};

const InquiryAdminPanel = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInquiries = async () => {
    try {
      const response = await axios.get("http://localhost:8000/inquiry");
      setInquiries(response.data);
    } catch (error) {
      console.error("Failed to fetch inquiries", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 md:px-10">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">
        Inquiry Submissions
      </h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading inquiries...</p>
      ) : inquiries.length === 0 ? (
        <p className="text-center text-red-500">No inquiries found.</p>
      ) : (
        <div className="overflow-x-auto bg-white  hover:shadow-md rounded-lg">
          <table className="min-w-full text-sm text-left text-gray-800">
            <thead className="bg-gray-200 text-xs uppercase text-gray-700">
              <tr>
                <th className="px-4 py-3">Inquiry Type</th>
                <th className="px-4 py-3">User Type</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Zip</th>
                <th className="px-4 py-3">Property Type</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inquiry) => (
                <tr key={inquiry._id} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-2">{inquiry.inquiryType}</td>
                  <td className="px-4 py-2">{inquiry.userType}</td>
                  <td className="px-4 py-2">{`${inquiry.firstName} ${inquiry.middleName}`}</td>
                  <td className="px-4 py-2">{inquiry.email}</td>
                  <td className="px-4 py-2">{inquiry.location}</td>
                  <td className="px-4 py-2">{inquiry.zip}</td>
                  <td className="px-4 py-2">{inquiry.propertyType}</td>
                  <td className="px-4 py-2">{inquiry.contactNo}</td>
                  <td className="px-4 py-2 max-w-xs truncate">
                    {inquiry.yourMessage}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(inquiry.createdAt).toLocaleDateString()}
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

export default InquiryAdminPanel;
