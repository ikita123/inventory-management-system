import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import "../styles/Inventory.css";

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
    <div className="inventory-container">
      <h2>Inventory Items</h2>
      <div className="inventory-header">
        <input
          className="search-input"
          placeholder="Search by name or category"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Link to="/create">
          <button className="add-btn">+ Add New</button>
        </Link>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Description</th>
            <th>Tags</th>
            <th>Created At</th>
            <th>Actions</th>
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
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>${item.price}</td>
                <td>{item.quantity}</td>
                <td>{item.description}</td>
                <td>{item.tags?.join(", ") || "—"}</td>
                <td>{new Date(item.createdAt).toLocaleString()}</td>
                <td>
                  <Link to={`/edit/${item._id}`}>
                    <button className="edit-btn">Edit</button>
                  </Link>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(item._id)}
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
