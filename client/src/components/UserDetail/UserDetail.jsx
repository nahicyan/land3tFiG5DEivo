import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/utils/api";
import { PuffLoader } from "react-spinners";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function UserDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        // You'll need to create this API endpoint
        const response = await api.get(`/user/${userId}`);
        setUser(response.data);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to load user details");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <PuffLoader size={80} color="#404040" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <h2 className="text-red-600 text-xl font-semibold">{error || "User not found"}</h2>
          <Button
            className="mt-4 bg-[#324c48] hover:bg-[#3f4f24] text-white"
            onClick={() => navigate("/admin/users")}
          >
            Back to Users
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white">
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#324c48]">User Details</h1>
          <Button
            variant="outline"
            className="border-[#324c48] text-[#324c48]"
            onClick={() => navigate("/admin/users")}
          >
            Back to Users
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Profile Card */}
          <Card className="md:col-span-1">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4">
                <img
                  src={user.image || "/default-avatar.jpg"}
                  alt={user.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto"
                />
              </div>
              <CardTitle className="text-xl">{user.name || "No Name"}</CardTitle>
              <Badge className={user.role === "ADMIN" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"}>
                {user.role}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-medium">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
                  </p>
                </div>
                <div className="pt-4 flex gap-2">
                  <Button
                    className="flex-1 bg-[#324c48] hover:bg-[#3f4f24] text-white"
                    onClick={() => navigate(`/admin/users/${userId}/edit`)}
                  >
                    Edit User
                  </Button>
                  {user.role !== "ADMIN" && (
                    <Button
                      variant="outline"
                      className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
                      onClick={() => {
                        // Implement delete functionality
                        if (window.confirm("Are you sure you want to delete this user?")) {
                          console.log("Delete user:", userId);
                        }
                      }}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Properties */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Properties</CardTitle>
            </CardHeader>
            <CardContent>
              {user.ownedResidencies && user.ownedResidencies.length > 0 ? (
                <div className="space-y-4">
                  {/* Display user's properties here */}
                  {user.ownedResidencies.map((property) => (
                    <div
                      key={property.id}
                      className="flex items-center gap-3 p-3 border rounded-md hover:bg-gray-50"
                    >
                      <img
                        src={property.imageUrls?.[0] ? `${import.meta.env.VITE_SERVER_URL}/${property.imageUrls[0]}` : "/default-property.jpg"}
                        alt={property.title}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{property.title || "Untitled Property"}</h3>
                        <p className="text-sm text-gray-500">
                          {property.city}, {property.state}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#324c48] text-[#324c48]"
                        onClick={() => navigate(`/properties/${property.id}`)}
                      >
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-6">This user has no properties.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}