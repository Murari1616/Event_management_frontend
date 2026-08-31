import React, { useEffect, useState } from "react";
import { BASE_URL } from "@/appConstants";
import { useToast } from "@/hooks/use-toast";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function RegisteredUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const paidUsersCount = users.filter((user) => user.approve === true).length;

  const handleApproveClick = (user) => {
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
      if (localStorage.getItem("code") !== "sri.laxmi#4110") return;

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

    const eventName =
      user.eventId?.eventName || "Previous Events";

    if (!groups[date]) {
      groups[date] = {};
    }

    if (!groups[date][eventName]) {
      groups[date][eventName] = [];
    }

    groups[date][eventName].push(user);

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
      <div className="flex items-center gap-4 mb-8 w-full">
        <h1 className="text-2xl font-bold text-purple-400">
          🎟 Registered Users
        </h1>

        <span className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
          💰 Paid Users: {paidUsersCount}
        </span>

        <span className="bg-purple-700 text-white px-4 py-2 rounded-full text-sm font-semibold">
          👥 Total Users: {users.length}
        </span>
        <div className="w-[60%] flex justify-end">

          <Button onClick={() => { navigate('/events') }}>+ New Event</Button>
        </div>
      </div>


      {Object.entries(groupedUsers).map(([date, eventGroups]) => {
        const totalUsers = Object.values(eventGroups).reduce(
          (total, eventUsers) => total + eventUsers.length,
          0
        );

        return (
          <div key={date} className="mb-10">

            {/* ============================= */}
            {/* DATE HEADER */}
            {/* ============================= */}

            <div className="flex items-center gap-4 mb-4">

              <h2 className="text-xl font-bold text-yellow-400">
                📅 {date}
              </h2>

              <span className="bg-purple-700 px-3 py-1 rounded-full text-xs">
                {totalUsers} Users
              </span>

            </div>

            {/* ============================= */}
            {/* EVENT TABLES - HORIZONTAL */}
            {/* ============================= */}

            <div className="w-full overflow-x-auto pb-6 custom-horizontal-scroll">

              <div
                className={
                  Object.keys(eventGroups).length === 1
                    ? "w-full"
                    : "flex flex-nowrap gap-6"
                }
              >

                {Object.entries(eventGroups).map(
                  ([eventName, eventUsers]) => {

                    const singleEvent =
                      Object.keys(eventGroups).length === 1;

                    return (
                      <div
                        key={eventName}
                        className={
                          singleEvent
                            ? "w-full"
                            : "w-[1250px] shrink-0"
                        }
                      >

                        {/* EVENT HEADER */}

                        <div className="flex items-center justify-between mb-3">

                          <h3 className="text-lg font-semibold text-purple-400 truncate">
                            🎟 {eventName}
                          </h3>

                          <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-xs shrink-0 ml-4">
                            {eventUsers.length} Users
                          </span>

                        </div>

                        {/* TABLE */}

                        <div className="w-full overflow-x-auto custom-table-scrollbar">
                          <table className="table-fixed min-w-[750px] w-full border border-gray-700 text-sm">

                            <thead className="bg-purple-700 text-white">

                              <tr>

                                <th className="p-2 w-[110px]">Name</th>
                                <th className="w-[50px]">Age</th>
                                <th className="w-[75px]">Gender</th>
                                <th className="w-[110px]">Phone</th>
                                <th className="w-[110px]">Instagram</th>
                                <th className="w-[100px]">Place</th>
                                <th className="w-[110px]">Talent</th>
                                <th className="w-[160px]">Description</th>
                                <th className="w-[110px] text-center">Action</th>

                              </tr>

                            </thead>

                            <tbody>

                              {eventUsers.map((u, index) => (

                                <tr
                                  key={u._id || index}
                                  className="
                        border-t
                        border-gray-800
                        hover:bg-gray-900
                      "
                                >

                                  {/* NAME */}

                                  <td
                                    className="p-3 text-center truncate"
                                    title={u.name || "-"}
                                  >
                                    {u.name || "-"}
                                  </td>

                                  {/* AGE */}

                                  <td className="text-center">
                                    {u.age || "-"}
                                  </td>

                                  {/* GENDER */}

                                  <td
                                    className="text-center truncate"
                                    title={u.gender || "-"}
                                  >
                                    {u.gender || "-"}
                                  </td>

                                  {/* PHONE */}

                                  <td
                                    className="text-center truncate"
                                    title={u.phoneNumber || "-"}
                                  >
                                    {u.phoneNumber || "-"}
                                  </td>

                                  {/* INSTAGRAM */}

                                  <td
                                    className="
                          text-center
                          text-purple-400
                          truncate
                        "
                                    title={u.instaId || "-"}
                                  >

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

                                  {/* PLACE */}

                                  <td
                                    className="text-center truncate"
                                    title={u.place || "-"}
                                  >
                                    {u.place || "-"}
                                  </td>

                                  {/* TALENT */}

                                  <td
                                    className="text-center truncate"
                                    title={u.talent || "-"}
                                  >
                                    {u.talent || "-"}
                                  </td>

                                  {/* DESCRIPTION */}

                                  <td
                                    className="text-center truncate"
                                    title={u.description || "-"}
                                  >
                                    {u.description || "-"}
                                  </td>

                                  {/* ACTION */}

                                  <td className="text-center">

                                    <div className="flex gap-4 p-2 justify-center">

                                      <button
                                        onClick={() =>
                                          handleDelete(u._id)
                                        }
                                        className="
                              bg-red-600
                              hover:bg-red-700
                              px-3
                              py-1
                              rounded
                              text-xs
                            "
                                      >
                                        Delete
                                      </button>

                                      <Checkbox.Root
                                        checked={!!u.approve}
                                        onCheckedChange={() =>
                                          handleApproveClick(u)
                                        }
                                        className="
                              w-5
                              h-5
                              border
                              border-gray-500
                              rounded
                              flex
                              items-center
                              justify-center
                              data-[state=checked]:bg-green-600
                              data-[state=checked]:border-green-600
                            "
                                      >

                                        <Checkbox.Indicator>
                                          <CheckIcon className="text-white w-4 h-4" />
                                        </Checkbox.Indicator>

                                      </Checkbox.Root>

                                    </div>

                                  </td>

                                </tr>

                              ))}

                            </tbody>

                          </table>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>

            </div>


          </div>
        );
      })}


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
