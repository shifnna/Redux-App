import { useEffect, useState } from "react";


export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ username: "", email: "", role: "" });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/admin/getAllUsers", { method: "GET" });
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const openEditModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const openCreateModal = () => {
    setNewUser({ username: "", email: "", role: "" });
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleInputChange = (e) => {
    setSelectedUser({ ...selectedUser, [e.target.name]: e.target.value });
  };

  const handleNewUserChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const updateUser = async () => {
    try {
      const response = await fetch(`/api/admin/updateUser/${selectedUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: selectedUser.username,
          email: selectedUser.email,
          role: selectedUser.role,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setUsers(users.map(user => (user._id === selectedUser._id ? data.updatedUser : user)));
        closeEditModal();
      } else {
        console.log("Edit user response not success");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const createUser = async () => {
    try {
      const response = await fetch("/api/admin/createUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      const data = await response.json();
      if (data.success) {
        setUsers([...users, data.user]);
        closeCreateModal();
        console.log(data)

      } else {
        console.log("Create user response not success");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const deleteUser = async (id) => {
     const confirmDelete = window.confirm("Are you sure you want to delete this user?");
     if (!confirmDelete) return;
    try {
      const response = await fetch(`/api/admin/deleteUser/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (data.success) {
        setUsers(users.filter(user => user._id !== id));
      } else {
        console.log('deleteUser response not success');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-black p-4 text-white text-center text-2xl font-semibold">
        Admin Dashboard
      </div>

      <div className="container mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Users List</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="py-3 px-4 text-left">#</th>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Role</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={user._id} className="border-b">
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4">{user.username}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">{user.role}</td>
                    <td className="py-3 px-4 text-center">
                      <button className="bg-green-500 text-white px-3 py-1 rounded mr-2" onClick={() => openEditModal(user)}>
                        Edit
                      </button>
                      <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => deleteUser(user._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-center  mt-6 mb-4">
        <button className="bg-black text-white px-4 py-2 rounded" onClick={openCreateModal}>
          Create User
        </button>
      </div>

      {isModalOpen && selectedUser && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-xl font-semibold mb-4">Edit User</h2>
      <input
        type="text"
        name="username"
        value={selectedUser.username}
        onChange={handleInputChange}
        placeholder="Username"
        className="w-full border p-2 rounded mb-3"
      />
      <input
        type="email"
        name="email"
        value={selectedUser.email}
        onChange={handleInputChange}
        placeholder="Email"
        className="w-full border p-2 rounded mb-3"
      />
      <input
        type="text"
        name="role"
        value={selectedUser.role}
        onChange={handleInputChange}
        placeholder="Role"
        className="w-full border p-2 rounded mb-3"
      />
      <div className="flex justify-end">
        <button className="bg-gray-400 text-white px-3 py-1 rounded mr-2" onClick={closeEditModal}>
          Cancel
        </button>
        <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={updateUser}>
          Update
        </button>
      </div>
    </div>
  </div>
      )}

      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Create User</h2>
            <input type="text" name="username" placeholder="Username" className="w-full border p-2 rounded mb-3" onChange={handleNewUserChange} />
            <input type="email" name="email" placeholder="Email" className="w-full border p-2 rounded mb-3" onChange={handleNewUserChange} />
            <input type="password" name="password" placeholder="Password" className="w-full border p-2 rounded mb-3" onChange={handleNewUserChange} />
            <input type="text" name="role" placeholder="Role" className="w-full border p-2 rounded mb-3" onChange={handleNewUserChange} />
            <div className="flex justify-end">
              <button className="bg-gray-400 text-white px-3 py-1 rounded mr-2" onClick={closeCreateModal}>Cancel</button>
              <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={createUser}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}