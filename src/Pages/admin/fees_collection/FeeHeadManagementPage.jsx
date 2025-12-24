
import React, { useEffect, useState } from "react";
import { getAllFeeHeads, createFeeHead } from "../../../helper/requests-method/apiMethods";

const FeeHeadManagementPage = () => {
  const [feeHeads, setFeeHeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", code: "", description: "" });
  const [success, setSuccess] = useState("");

  const fetchFeeHeads = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllFeeHeads();
      let heads = [];
      if (Array.isArray(data)) {
        heads = data;
      } else if (Array.isArray(data?.feeHeads)) {
        heads = data.feeHeads;
      }
      setFeeHeads(heads);
    } catch (err) {
      setError("Failed to fetch fee heads");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFeeHeads();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await createFeeHead(form);
      setSuccess("Fee head created successfully");
      setForm({ name: "", code: "", description: "" });
      fetchFeeHeads();
    } catch (err) {
      setError("Failed to create fee head");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: 32 }}>
      <h1>Fee Head Management</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: 24, background: '#f9f9f9', padding: 16, borderRadius: 8, maxWidth: 400 }}>
        <h2 style={{ marginBottom: 12 }}>Add Fee Head</h2>
        <div style={{ marginBottom: 8 }}>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required style={{ width: '100%', padding: 8 }} />
        </div>
        <div style={{ marginBottom: 8 }}>
          <input name="code" value={form.code} onChange={handleChange} placeholder="Code" required style={{ width: '100%', padding: 8 }} />
        </div>
        <div style={{ marginBottom: 8 }}>
          <input name="description" value={form.description} onChange={handleChange} placeholder="Description" style={{ width: '100%', padding: 8 }} />
        </div>
        <button type="submit" disabled={loading} style={{ padding: 8, background: '#6d28d9', color: '#fff', border: 'none', borderRadius: 4 }}>
          {loading ? "Saving..." : "Add Fee Head"}
        </button>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
        {success && <div style={{ color: 'green', marginTop: 8 }}>{success}</div>}
      </form>
      <h2>All Fee Heads</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #eee', padding: 8 }}>Name</th>
              <th style={{ border: '1px solid #eee', padding: 8 }}>Code</th>
              <th style={{ border: '1px solid #eee', padding: 8 }}>Description</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(feeHeads) && feeHeads.length === 0 ? (
              <tr><td colSpan={3} style={{ textAlign: 'center', padding: 16 }}>No fee heads found.</td></tr>
            ) : (
              (Array.isArray(feeHeads) ? feeHeads : []).map((fh, idx) => (
                <tr key={fh._id || idx}>
                  <td style={{ border: '1px solid #eee', padding: 8 }}>{fh.name || fh.feeHeadName || '-'}</td>
                  <td style={{ border: '1px solid #eee', padding: 8 }}>{fh.code || '-'}</td>
                  <td style={{ border: '1px solid #eee', padding: 8 }}>{fh.description || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FeeHeadManagementPage;
