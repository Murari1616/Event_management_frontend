const AdminModal = ({
  adminCode,
  setAdminCode,
  handleVerify,
  setShowAdminModal,
}) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
      <div className="bg-[#1a1a1a] p-6 rounded-lg w-80 space-y-4">
        <h2 className="text-purple-400 text-lg font-bold">
          Admin Access
        </h2>

        <input
          type="password"
          placeholder="Enter code"
          value={adminCode}
          onChange={(e) => setAdminCode(e.target.value)}
          className="w-full p-2 rounded bg-black border border-gray-600 text-white"
        />

        <button
          onClick={handleVerify}
          className="w-full bg-purple-600 py-2 rounded"
        >
          Unlock
        </button>

        <button
          onClick={() => setShowAdminModal(false)}
          className="text-sm text-gray-400 w-full"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AdminModal;
