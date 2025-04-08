import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "../styles/InventoryForm.css";

export default function InventoryForm() {
  const [item, setItem] = useState({
    name: "",
    category: "",
    price: 0,
    quantity: 0,
    description: "",
    tags: "",
  });

  const { id } = useParams();
  const navigate = useNavigate();

  const fetchItem = async () => {
    const res = await api.get(`/inventory/${id}`);
    setItem({
      ...res.data,
      tags: res.data.tags ? res.data.tags.join(", ") : "",
    });
  };

  useEffect(() => {
    if (id) fetchItem();
  }, [id]);

  const handleSubmit = async () => {
    const payload = {
      ...item,
      tags: item.tags.split(",").map((t) => t.trim()),
    };

    if (id) {
      await api.put(`/inventory/${id}`, payload);
    } else {
      await api.post("/inventory", payload);
    }
    navigate("/inventoryList");
  };

  return (
    <div className="inventory-container">
      <h2 className="inventory-title">
        {id ? "Edit Item" : "Create New Item"}
      </h2>

      <div className="inventory-form">
        <label className="inventory-label">Name:</label>
        <input
          className="inventory-input"
          placeholder="Enter item name"
          value={item.name}
          onChange={(e) => setItem({ ...item, name: e.target.value })}
        />

        <label className="inventory-label">Category:</label>
        <input
          className="inventory-input"
          placeholder="Enter category"
          value={item.category}
          onChange={(e) => setItem({ ...item, category: e.target.value })}
        />

        <label className="inventory-label">Price:</label>
        <input
          className="inventory-input"
          type="number"
          placeholder="Enter price"
          value={item.price}
          onChange={(e) => setItem({ ...item, price: e.target.value })}
        />

        <label className="inventory-label">Quantity:</label>
        <input
          className="inventory-input"
          type="number"
          placeholder="Enter quantity"
          value={item.quantity}
          onChange={(e) => setItem({ ...item, quantity: e.target.value })}
        />

        <label className="inventory-label">Tags (comma-separated):</label>
        <input
          className="inventory-input"
          placeholder="e.g. electronics, sale"
          value={item.tags}
          onChange={(e) => setItem({ ...item, tags: e.target.value })}
        />

        <label className="inventory-label">Description:</label>
        <textarea
          className="inventory-textarea"
          placeholder="Describe the item"
          value={item.description}
          onChange={(e) => setItem({ ...item, description: e.target.value })}
        />

        <button className="inventory-button" onClick={handleSubmit}>
          {id ? "Update Item" : "Create Item"}
        </button>
      </div>
    </div>
  );
}
