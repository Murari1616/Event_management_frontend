import React, { useEffect, useState } from "react";
import { BASE_URL } from "@/appConstants";
import { useToast } from "@/hooks/use-toast";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";

export default function RegisteredUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const paidUsersCount = users.filter((user) => user.approve === true).length;

  const handleApproveClick = (user) => {
    // If already approved, allow directly unchecking
    if (user.approve) {
      handleApprove(user._id, false);
      return;
    }

    // Otherwise ask about payment first
    setSelectedUser(user);
    setPaymentModalOpen(true);
  };

  const confirmPaymentAndApprove = async () => {
    if (!selectedUser) return;

    await handleApprove(selectedUser._id, true);

    setPaymentModalOpen(false);
    setSelectedUser(null);
  };

  const cancelApproval = () => {
    setPaymentModalOpen(false);
    setSelectedUser(null);
  };


  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete?"
      );

      if (!confirmDelete) return;

      const res = await fetch(`${BASE_URL}guest/delete/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

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

  const handleApprove = async (id, value) => {
    try {
      const res = await fetch(`${BASE_URL}guest/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          approve: value,
        }),
      });

      if (!res.ok) throw new Error();

      // Update UI immediately
      setUsers((prev) =>
        prev.map((user) =>
          user._id === id
            ? { ...user, approve: value }
            : user
        )
      );

      toast({
        title: "Success",
        description: value
          ? "User approved successfully"
          : "User approval removed",
        variant: "success",
      });
    } catch (err) {
      console.log("APPROVE ERROR", err);

      toast({
        title: "Error",
        description: "Failed to update approval",
        variant: "destructive",
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
      console.log("ERR", err)
      toast({
        title: "Error",
        variant: "destructive",
        description: "Failed to fetch users",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Group users by date
  const groupedUsers = users.reduce((groups, user) => {
    const date = user.createdAt
      ? new Date(user.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
      : "Unknown Date";

    if (!groups[date]) {
      groups[date] = [];
    }

    groups[date].push(user);

    return groups;
  }, {});

  if (loading) {
    return (
      <div className="text-white flex justify-center items-center h-screen">
        Loading users...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-2xl font-bold text-purple-400">
          🎟 Registered Users
        </h1>

        <span className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
          💰 Paid Users: {paidUsersCount}
        </span>

        <span className="bg-purple-700 text-white px-4 py-2 rounded-full text-sm font-semibold">
          👥 Total Users: {users.length}
        </span>
      </div>


      {Object.entries(groupedUsers).map(([date, dateUsers]) => (
        <div key={date} className="mb-10">
          {/* DATE HEADING */}
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-xl font-bold text-yellow-400">
              📅 {date}
            </h2>

            <span className="bg-purple-700 px-3 py-1 rounded-full text-xs">
              {dateUsers.length} Users
            </span>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto w-full">
            <table className="min-w-[900px] w-full border border-gray-700 text-sm">
              <thead className="bg-purple-700 text-white">
                <tr>
                  <th className="p-3">Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Phone</th>
                  <th>Instagram</th>
                  <th>Place</th>
                  <th>Talent</th>
                  <th>Description</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {dateUsers.map((u, index) => (
                  <tr
                    key={u._id || index}
                    className="border-t border-gray-800 hover:bg-gray-900"
                  >
                    <td className="p-3 text-center">{u.name}</td>

                    <td className="text-center">
                      {u.age}
                    </td>

                    <td className="text-center">
                      {u.gender}
                    </td>

                    <td className="text-center">
                      {u.phoneNumber}
                    </td>

                    <td className="text-center text-purple-400">
                      {u.instaId ? (
                        <a
                          href={`https://instagram.com/${u.instaId.replace(
                            "@",
                            ""
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          {u.instaId}
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>

                    <td className="text-center">
                      {u.place}
                    </td>

                    <td className="text-center">
                      {u.talent}
                    </td>

                    <td className="text-center max-w-xs truncate">
                      {u.description || "-"}
                    </td>

                    <td className="text-center flex gap-4 p-2">

                      <button
                        onClick={() => handleDelete(u._id)}
                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs"
                      >
                        Delete
                      </button>
                      <Checkbox.Root
                        checked={!!u.approve}
                        onCheckedChange={() => handleApproveClick(u)}
                        className="
                            w-5 h-5
                            border border-gray-500
                            rounded
                            flex items-center justify-center
                            data-[state=checked]:bg-green-600
                            data-[state=checked]:border-green-600
                          "
                      >
                        <Checkbox.Indicator>
                          <CheckIcon className="text-white w-4 h-4" />
                        </Checkbox.Indicator>
                      </Checkbox.Root>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {users.length === 0 && (
        <div className="text-center text-gray-400 py-10">
          No registered users found.
        </div>
      )}
      {paymentModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md rounded-xl bg-gray-900 border border-gray-700 p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4">
              Confirm Payment
            </h2>

            <p className="text-gray-300 mb-2">
              Has the user completed the payment?
            </p>

            <p className="text-purple-400 font-semibold mb-6">
              {selectedUser.name}
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={cancelApproval}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
              >
                No
              </button>

              <button
                onClick={confirmPaymentAndApprove}
                className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
