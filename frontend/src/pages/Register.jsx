import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../store/authSlice";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

   // Form fields state
   const [fullname,setFullname]=useState("");
   const [email,setEmail]=useState("");
   const[password, setPassword]=useState("");

  const handleSubmit =async (e) => {
    e.preventDefault();

    try {
       // Send registration data to backend
       const response=await api.post("auth/register",{fullname,email,password});
        // Backend automatically creates customer
      // and returns user information
      dispatch(loginUser(response.data.user));

      // Show success message
      toast.success(
        response.data.message || "Registration successful!"
      );
       navigate("/login");
    } catch (error) {
        // Show backend error message
      toast.error(
        error.response?.data?.message || "Registration failed"
      );
    }
 
  };

  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
        <div className="text-center">
          <p className="text-2xl font-extrabold">
            Service<span className="text-emerald-600">Hub</span>
          </p>
          <h1 className="mt-7 text-2xl font-bold">Create Account</h1>
          <p className="mt-2 text-sm text-slate-500">Join us and book services easily</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <Input label="Full Name" placeholder="Enter your name"  value={fullname}
          onChange={(e) => setFullname(e.target.value)} />
          <Input label="Email" type="email" placeholder="Enter your email"    value={email}
          onChange={(e) => setEmail(e.target.value)} />
          <Input label="Password" type="password" placeholder="Create a password"   value={password}
          onChange={(e) => setPassword(e.target.value)}/>

          <button  type="submit" className="w-full rounded-lg bg-emerald-600 py-3.5 font-bold text-white hover:bg-emerald-700">
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-emerald-600">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}
// Reusable Input Component
function Input({ label, type = "text", placeholder , value,
  onChange, }) {
  return (
    <label className="block text-sm font-semibold text-slate-700">
      {label}
      <input
        type={type}
        required
        placeholder={placeholder}   value={value}
        onChange={onChange}
        className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 font-normal outline-none focus:border-emerald-500"
      />
    </label>
  );
}
