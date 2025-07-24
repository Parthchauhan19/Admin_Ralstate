import React from "react";

// Define the type for school data
interface SchoolEntry {
  id: string;
  name: string;
  number: string;
  address: string;
}

// Sample data
const schoolData: SchoolEntry[] = [
  {
    id: "TM-001",
    name: "Mehulbhai Bhuva",
    number: "+91 98765 43001",
    address: "Savarkundla, Amreli",
  },
  {
    id: "TM-002",
    name: "Arjunbhai Patel",
    number: "+91 98765 43002",
    address: "Maninagar, Ahmedabad",
  },
  {
    id: "TM-003",
    name: "Jaydeepbhai Joshi",
    number: "+91 98765 43003",
    address: "Gotri Road, Vadodara",
  },
  {
    id: "TM-004",
    name: "Mehulbhai Desai",
    number: "+91 98765 43004",
    address: "Zanzarda Road, Junagadh",
  },
  {
    id: "TM-005",
    name: "Arpitbhai Shah",
    number: "+91 98765 43005",
    address: "University Road, Rajkot",
  },
  {
    id: "TM-006",
    name: "Mayaben Rana",
    number: "+91 98765 43006",
    address: "Rander Road, Surat",
  },
  {
    id: "TM-007",
    name: "Jinalben Mehta",
    number: "+91 98765 43007",
    address: "Sector 8, Gandhinagar",
  },
  {
    id: "TM-008",
    name: "Jigneshbhai Trivedi",
    number: "+91 98765 43008",
    address: "Khodiyar Nagar, Jamnagar",
  },
  {
    id: "TM-009",
    name: "Sureshbhai Solanki",
    number: "+91 98765 43009",
    address: "Kuber Nagar, Ahmedabad",
  },
  {
    id: "TM-010",
    name: "Kamleshbhai Bhatt",
    number: "+91 98765 43010",
    address: "Navsari Bazar, Navsari",
  },
  {
    id: "TM-011",
    name: "Hastiben Parmar",
    number: "+91 98765 43011",
    address: "Station Road, Bhuj",
  },
  {
    id: "TM-012",
    name: "Rajbhai Gohil",
    number: "+91 98765 43012",
    address: "Kalavad Road, Rajkot",
  },
  {
    id: "TM-013",
    name: "Niyatiben Shah",
    number: "+91 98765 43013",
    address: "Gorwa, Vadodara",
  },
];

// Functional Component
const Demorampe: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-700">
        Team Members Details
      </h1>

      <div className="overflow-x-auto rounded-xl shadow-m border border-gray-200 hover:shadow-lg ">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="text-left px-6 py-3 text-m font-semibold text-gray-700 border-b">
                ID
              </th>
              <th className="text-left px-6 py-3 text-m font-semibold text-gray-700 border-b">
                Name
              </th>
              <th className="text-left px-6 py-3 text-m font-semibold text-gray-700 border-b">
                Number
              </th>
              <th className="text-left px-6 py-3 text-m font-semibold text-gray-700 border-b">
                Address
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {schoolData.map((data) => (
              <tr key={data.id} className="hover:bg-gray-100 transition-colors">
                <td className="px-6 py-3 text-m text-gray-800 whitespace-nowrap">
                  {data.id}
                </td>
                <td className="px-6 py-3 text-m text-gray-800">{data.name}</td>
                <td className="px-6 py-3 text-m text-gray-800">
                  {data.number}
                </td>
                <td className="px-6 py-3 text-m text-gray-800">
                  {data.address}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Demorampe;
