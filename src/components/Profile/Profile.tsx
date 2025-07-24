import React, { useEffect, useState } from "react";
import { Copy, Eye, Key, Trash2 } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext"; 

const Profile: React.FC = () => {
  const { user } = useAuth();

  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [socialMedia, setSocialMedia] = useState({
    facebook: "",
    instagram: "",
  });

  // Populate data from user on load
  useEffect(() => {
    if (user) {
      const nameParts = user.name.split(" ");
      setPersonalInfo({
        firstName: nameParts[0] || "",
        lastName: nameParts[1] || "",
        email: user.email,
        phone: "(+91) 9313759966",
      });

      setSocialMedia({
        facebook: `https://www.facebook.com/${nameParts[0]?.toLowerCase()}`,
        instagram: `https://www.instagram.com/${nameParts[0]?.toLowerCase()}`,
      });
    }
  }, [user]);

  const copyUserId = () => {
    navigator.clipboard.writeText(user?.id || "user_id_unknown");
  };

  if (!user) {
    return <div className="p-8 text-red-600">No user data available</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex gap-8">
          <div className="w-74 space-y-4">
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                  <img
                    src={user.avatar || "https://via.placeholder.com/150"}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                </div>

                <h3 className="font-semibold text-gray-900 mb-1">
                  {user.email}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Last Login: 44 minutes ago
                </p>

                <div className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm">
                  <span className="text-gray-600">User ID: {user.id}</span>
                  <button
                    onClick={copyUserId}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 space-y-2">
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg">
                  <Eye size={16} className="text-gray-500" />
                  <span className="text-gray-700">Impersonate User</span>
                </button>

                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg">
                  <Key size={16} className="text-gray-500" />
                  <span className="text-gray-700">Change Password</span>
                </button>

                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg">
                  <Trash2 size={16} className="text-red-500" />
                  <span className="text-red-600">Delete User</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Personal Information
              </h2>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={personalInfo.firstName}
                    onChange={(e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        firstName: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={personalInfo.lastName}
                    onChange={(e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        lastName: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={personalInfo.email}
                    onChange={(e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        email: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-20"
                  />
                  <span className="absolute right-3 top-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    Verified
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={personalInfo.phone}
                    onChange={(e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        phone: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-20"
                  />
                  <span className="absolute right-3 top-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    Verified
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Social Media Account
              </h2>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facebook
                </label>
                <input
                  type="url"
                  value={socialMedia.facebook}
                  onChange={(e) =>
                    setSocialMedia({
                      ...socialMedia,
                      facebook: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram
                </label>
                <input
                  type="url"
                  value={socialMedia.instagram}
                  onChange={(e) =>
                    setSocialMedia({
                      ...socialMedia,
                      instagram: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2">
                <span className="text-lg">+</span>
                Add Social Media
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
