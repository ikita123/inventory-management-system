import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import "../styles/InventoryList.css";

export default function InventoryList() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");

  const fetchItems = async () => {
    const url = search
      ? `/inventory?search=${encodeURIComponent(search)}`
      : "/inventory";
    const res = await api.get(url);
    setItems(res.data);
  };

  useEffect(() => {
    fetchItems();
  }, [search]);

  const handleDelete = async (id) => {
    await api.delete(`/inventory/${id}`);
    fetchItems();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Inventory Items</h2>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <input
          placeholder="Search by name or category"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "8px", width: "300px" }}
        />

        <Link to="/create">
          <button
            style={{
              padding: "8px 16px",
              background: "#4caf50",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
            }}
          >
            + Add New
          </button>
        </Link>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f2f2f2" }}>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Category</th>
            <th style={thStyle}>Price</th>
            <th style={thStyle}>Quantity</th>
            <th style={thStyle}>Description</th>
            <th style={thStyle}>Tags</th>
            <th style={thStyle}>Created At</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>
                No inventory items found.
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item._id}>
                <td style={tdStyle}>{item.name}</td>
                <td style={tdStyle}>{item.category}</td>
                <td style={tdStyle}>${item.price}</td>
                <td style={tdStyle}>{item.quantity}</td>
                <td style={tdStyle}>{item.description}</td>
                <td style={tdStyle}>
                  {item.tags?.length ? item.tags.join(", ") : "—"}
                </td>
                <td style={tdStyle}>
                  {new Date(item.createdAt).toLocaleString()}
                </td>
                <td style={tdStyle}>
                  <Link to={`/edit/${item._id}`}>
                    <button style={editBtnStyle}>Edit</button>
                  </Link>
                  <button
                    onClick={() => handleDelete(item._id)}
                    style={deleteBtnStyle}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  textAlign: "left",
  padding: "10px",
  borderBottom: "1px solid #ddd",
};

const tdStyle = {
  padding: "10px",
  borderBottom: "1px solid #eee",
};

const editBtnStyle = {
  marginRight: "10px",
  padding: "6px 12px",
  background: "#2196f3",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
};

const deleteBtnStyle = {
  padding: "6px 12px",
  background: "#f44336",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
};
