import React, { useEffect, useState } from "react";
import "./ContactPage.css";
import CategoryNav from "../../components/CategoryNav/CategoryNav";
import Header from "../../components/Header/Header";
import API from "../../api/api"; // ✅ your axios instance
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  shippingFlatNo: "",
  shippingAddress: "",
  shippingCity: "",
  shippingState: "",
  shippingPostalCode: "",
  shippingLandmark: "",
  sameAsShipping: true,
  billingFlatNo: "",
  billingAddress: "",
  billingCity: "",
  billingState: "",
  billingPostalCode: "",
  billingLandmark: "",
};

function ContactPage() {
  const [form, setForm] = useState(initialForm);
  const [existingId, setExistingId] = useState(null); // null = new contact
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const navigate = useNavigate();

  // ─── On Mount: Check if contact exists, pre-fill if yes ───────────────────
  useEffect(() => {
    const fetchContact = async () => {
      try {
        const { data: hasContact } = await API.get("/contact/check");

        if (hasContact) {
          const { data: contacts } = await API.get("/contact/my");
          if (contacts && contacts.length > 0) {
            const c = contacts[0]; // use the first/latest contact
            setExistingId(c.id);
            setForm({
              firstName: c.firstName || "",
              lastName: c.lastName || "",
              email: c.email || "",
              phoneNumber: c.phoneNumber || "",
              shippingFlatNo: c.shippingFlatNo || "",
              shippingAddress: c.shippingAddress || "",
              shippingCity: c.shippingCity || "",
              shippingState: c.shippingState || "",
              shippingPostalCode: c.shippingPostalCode || "",
              shippingLandmark: c.shippingLandmark || "",
              sameAsShipping: c.sameAsShipping ?? true,
              billingFlatNo: c.billingFlatNo || "",
              billingAddress: c.billingAddress || "",
              billingCity: c.billingCity || "",
              billingState: c.billingState || "",
              billingPostalCode: c.billingPostalCode || "",
              billingLandmark: c.billingLandmark || "",
            });
          }
        }
      } catch (err) {
        console.error("Failed to load contact:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, []);

  // ─── Handle Input Change ───────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ─── Continue (Save / Update) ──────────────────────────────────────────────
  const handleContinue = async () => {
    setSaving(true);
    
    try {
      if (existingId) {
        // UPDATE existing contact
        await API.put(`/contact/${existingId}`, form);
        toast.success("Address updated successfully!");
      } else {
        // CREATE new contact
        const { data } = await API.post("/contact", form);
        setExistingId(data.id);
        toast.success("Address saved successfully!");
      }
      // Navigate to checkout after short delay
      setTimeout(() => navigate("/checkout"), 1000);
    } catch (err) {
      console.error("Save failed:", err);
      toast.error("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ─── Change Address (reset form) ──────────────────────────────────────────
//   const handleChangeAddress = () => {
//     setForm(initialForm);
//     setExistingId(null);
//     setMessage("");
//   };

  if (loading) return <p style={{ padding: "2rem" }}>Loading...</p>;

  return (
    <>
      <Header />
      <CategoryNav />
      <div className="page-container">
        <div className="form-container">

          {/* ── Contact Details ── */}
          <div className="card">
            <h3>Contact Details</h3>

            <div className="row">
              <div className="input-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="input-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Phone Number</label>
              <div className="phone-group">
                <select>
                  <option>+91</option>
                  <option>+1</option>
                </select>
                <input
                  type="text"
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* ── Shipping Details ── */}
          <div className="card">
            <h3>Shipping Details</h3>

            <div className="input-group">
              <label>Flat/House no.</label>
              <input
                type="text"
                name="shippingFlatNo"
                value={form.shippingFlatNo}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Address</label>
              <input
                type="text"
                name="shippingAddress"
                value={form.shippingAddress}
                onChange={handleChange}
              />
            </div>

            <div className="row">
              <div className="input-group">
                <label>City</label>
                <input
                  type="text"
                  name="shippingCity"
                  value={form.shippingCity}
                  onChange={handleChange}
                />
              </div>
              <div className="input-group">
                <label>State</label>
                <input
                  type="text"
                  name="shippingState"
                  value={form.shippingState}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row">
              <div className="input-group">
                <label>Postal Code</label>
                <input
                  type="text"
                  name="shippingPostalCode"
                  value={form.shippingPostalCode}
                  onChange={handleChange}
                />
              </div>
              <div className="input-group">
                <label>Famous Landmark</label>
                <input
                  type="text"
                  name="shippingLandmark"
                  value={form.shippingLandmark}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="checkbox">
              <input
                type="checkbox"
                name="sameAsShipping"
                checked={form.sameAsShipping}
                onChange={handleChange}
              />
              <span>My shipping and Billing address are the same</span>
            </div>

            {/* ── Billing Details (shown only when NOT same as shipping) ── */}
            {!form.sameAsShipping && (
              <div className="billing-section">
                <h3>Billing Details</h3>

                <div className="input-group">
                  <label>Flat/House no.</label>
                  <input
                    type="text"
                    name="billingFlatNo"
                    value={form.billingFlatNo}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-group">
                  <label>Address</label>
                  <input
                    type="text"
                    name="billingAddress"
                    value={form.billingAddress}
                    onChange={handleChange}
                  />
                </div>

                <div className="row">
                  <div className="input-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="billingCity"
                      value={form.billingCity}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="input-group">
                    <label>State</label>
                    <input
                      type="text"
                      name="billingState"
                      value={form.billingState}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="input-group">
                    <label>Postal Code</label>
                    <input
                      type="text"
                      name="billingPostalCode"
                      value={form.billingPostalCode}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="input-group">
                    <label>Famous Landmark</label>
                    <input
                      type="text"
                      name="billingLandmark"
                      value={form.billingLandmark}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── Status Message ── */}
            

            {/* <div className="abc"> */}
              

              {/* <button
                className="continue-btn"
                onClick={handleChangeAddress}
              >
                Change Address
              </button> */}
              <button
                className="continue-btn"
                onClick={handleContinue}
                disabled={saving}
              >
                {saving ? "Saving..." : "Continue"}
              </button>
            {/* </div> */}
          </div>

        </div>
      </div>
    </>
  );
}

export default ContactPage;