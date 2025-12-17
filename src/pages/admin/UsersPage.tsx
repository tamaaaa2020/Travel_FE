import React, { useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
  status: "active" | "inactive";
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "User 101010",
      email: "user101010@gmail.com",
      role: "user",
      status: "active",
    },
    {
      id: 2,
      name: "Admin Ezytix",
      email: "admin@ezytix.com",
      role: "admin",
      status: "active",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState<User>({
    id: 0,
    name: "",
    email: "",
    role: "user",
    status: "active",
  });

  const openAdd = () => {
    setEditing(null);
    setForm({
      id: Date.now(),
      name: "",
      email: "",
      role: "user",
      status: "active",
    });
    setShowModal(true);
  };

  const openEdit = (user: User) => {
    setEditing(user);
    setForm(user);
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (editing) {
      setUsers((prev) =>
        prev.map((u) => (u.id === editing.id ? form : u))
      );
    } else {
      setUsers((prev) => [...prev, form]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    if (confirm("Hapus user ini?")) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <AdminSidebar />

      <main className="ml-64 p-8 w-full">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Users Management</h1>
            <p className="text-gray-600 text-sm">
              Kelola user & role akun
            </p>
          </div>

          <button
            onClick={openAdd}
            className="px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            + Tambah User
          </button>
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3">Nama</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td>{u.email}</td>
                  <td className="capitalize">{u.role}</td>
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        u.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    <button
                      onClick={() => openEdit(u)}
                      className="text-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="text-red-600"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[420px] rounded-xl p-6 space-y-3">
            <h2 className="text-lg font-bold">
              {editing ? "Edit User" : "Tambah User"}
            </h2>

            <input
              placeholder="Nama"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="w-full border px-3 py-2 rounded"
            />

            <input
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="w-full border px-3 py-2 rounded"
            />

            <select
              value={form.role}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value as any })
              }
              className="w-full border px-3 py-2 rounded"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value as any })
              }
              className="w-full border px-3 py-2 rounded"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={() => setShowModal(false)}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
