"use client";

import { useEffect, useState } from "react";
import AddressModal from "@/components/AddressModal";
import ConfirmModal from "@/components/ConfirmModal";

export default function AddressPage() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const fetchData = async () => {
    const res = await fetch("/api/user/address");
    const data = await res.json();
    setList(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const setDefault = async (id: string) => {
    setLoading(true);
    await fetch("/api/user/address", {
      method: "PUT",
      body: JSON.stringify({ id }),
    });
    await fetchData();
    setLoading(false);
  };

  const remove = async (id: string) => {
    setLoading(true);
    await fetch("/api/user/address", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
    await fetchData();
    setLoading(false);
  };

  return (
    <div style={{ background: "#f5f5f5", padding: 24 }}>
      <div style={{ background: "#fff", padding: 24, borderRadius: 8 }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2>Địa chỉ của tôi</h2>
          <button
            style={{ background: "#ee4d2d", color: "#fff", padding: "8px 16px" }}
            onClick={() => setShowModal(true)}
          >
            + Thêm địa chỉ mới
          </button>
        </div>

        {/* List */}
        {list.map((item) => (
          <div
            key={item._id}
            style={{
              borderTop: "1px solid #eee",
              padding: "16px 0",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <b>{item.name}</b> | {item.phone}

                <div style={{ marginTop: 4 }}>
                  {item.detail} {item.ward}, {item.district}, {item.city}
                </div>

                {item.isDefault && (
                  <span
                    style={{
                      border: "1px solid red",
                      color: "red",
                      padding: "2px 6px",
                      marginTop: 6,
                      display: "inline-block",
                    }}
                  >
                    Mặc định
                  </span>
                )}
              </div>

              <div>
                <div style={{ textAlign: "right" }}>
                  <button
                    style={{ marginRight: 8 }}
                    onClick={() => setEditing(item)}
                  >
                    Cập nhật
                  </button>
                  {!item.isDefault && (
                      <button onClick={() => setConfirmId(item._id)}>
                    Xoá
                  </button>
                )}
                </div>

                {!item.isDefault && (
                  <button
                    onClick={() => setDefault(item._id)}
                    style={{ marginTop: 8 }}
                  >
                    Thiết lập mặc định
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* ADD */}
        {showModal && (
          <AddressModal
            onClose={() => setShowModal(false)}
            onSuccess={fetchData}
          />
        )}

        {/* EDIT */}
        {editing && (
          <AddressModal
            initialData={editing}
            onClose={() => setEditing(null)}
            onSuccess={fetchData}
          />
        )}

        {/* DELETE CONFIRM */}
        {confirmId && (
          <ConfirmModal
            message="Bạn có chắc muốn xoá địa chỉ này?"
            onCancel={() => setConfirmId(null)}
            onConfirm={async () => {
              await remove(confirmId);
              setConfirmId(null);
            }}
          />
        )}
      </div>
    </div>
  );
}