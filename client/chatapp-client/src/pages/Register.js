import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const backgroundImage = "/assets/wp.jpg"; 

  const validateForm = () => {
    let newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch("http://localhost:5100/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      await response.json();


      if (response.ok) {
        alert("Registration successful! Please login.");
        navigate("/login");
      } else {
        setErrors({ general: "User already registered!" });
      }
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  return (
    <div
      className="d-flex align-items-center vh-100"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        paddingLeft: "5%", 
      }}
    >
      <div
        className="p-4"
        style={{
          width: "400px",
          borderRadius: "12px",
          background: "rgba(255, 255, 255, 0.2)", 
          backdropFilter: "blur(10px)", 
          boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.2)", 
          padding: "30px",
          textAlign: "center",
        }}
      >
        <h2 className="fw-bold mb-4" style={{ color: "#fff" }}>REGISTER</h2>

        {errors.general && <div className="alert alert-danger text-center">{errors.general}</div>}

        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label fw-semibold text-white">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              style={{
                background: "rgba(255, 255, 255, 0.3)",
                color: "#fff",
                border: "1px solid rgba(255, 255, 255, 0.5)",
              }}
              placeholder="Enter your email"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            {errors.email && <div className="text-danger small mt-1">{errors.email}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold text-white">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              style={{
                background: "rgba(255, 255, 255, 0.3)", 
                color: "#fff",
                border: "1px solid rgba(255, 255, 255, 0.5)",
              }}
              placeholder="Enter your password"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            {errors.password && <div className="text-danger small mt-1">{errors.password}</div>}
          </div>

          <button
            className="btn w-100 py-2 fw-bold"
            style={{
              background: "rgba(37, 74, 241, 0.96)", 
              color: "#fff",
              border: "none",
              transition: "0.3s",
            }}
            type="submit"
            onMouseOver={(e) => (e.target.style.background = "rgba(0, 128, 0, 1)")}
            onMouseOut={(e) => (e.target.style.background = "rgba(0, 128, 0, 0.7)")}
          >
            Register
          </button>
        </form>

        <p className="mt-3 text-white">
          Already registered?{" "}
          <span
            className="fw-bold"
            style={{
              cursor: "pointer",
              color: "#ffdd57",
            }}
            onClick={() => navigate("/login")}
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
