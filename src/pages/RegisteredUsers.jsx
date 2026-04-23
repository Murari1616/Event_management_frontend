import React, { useEffect, useState } from "react";
import { BASE_URL } from "@/appConstants";
import { useToast } from "@/hooks/use-toast";

export default function RegisteredUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete?");
      if (!confirmDelete) return;

      const res = await fetch(`${BASE_URL}guest/delete/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      // remove from UI instantly
      setUsers((prev) => prev.filter((u) => u._id !== id));

      toast({
        title: "Success",
        description: "Deleted Successfully",
        variant: "success",
      });
    } catch (err) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Failed to delete user",
      });
    }
  };

  const fetchUsers = async () => {
    try {
      if (localStorage.getItem("code") !== "4110") return;
      const res = await fetch(`${BASE_URL}guest/getAll`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error();

      setUsers(data.data || []);
    } catch (err) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="text-white flex justify-center items-center h-screen">
        Loading users...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-6 text-purple-400">
        🎟 Registered Users
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-700 text-sm">
          <thead className="bg-purple-700 text-white">
            <tr className="justify-center">
              <th className="p-3">Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Phone</th>
              <th>Place</th>
              <th>Talent</th>
              <th>Description</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u, index) => (
              <tr
                key={u._id || index}
                className="border-t border-gray-800 hover:bg-gray-900"
              >
                <td className="p-3 text-center">{u.name}</td>
                <td className="text-center">{u.age}</td>
                <td className="text-center">{u.gender}</td>
                <td className="text-center">{u.phoneNumber}</td>
                <td className="text-center">{u.place}</td>
                <td className="text-center">{u.talent}</td>
                <td className="text-center max-w-xs truncate">
                  {u.description || "-"}
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(u._id)}
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
