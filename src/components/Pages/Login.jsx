import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { login, register, loginWithGoogle } from "@/auth/Auth";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(4, "Password must be at least 4characters"),
});

export default function AuthForm() {
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      if (isRegister) {
        await register(data.email.trim(), data.password.trim());
      } else {
        await login(data.email, data.password);
      }
      navigate("/dashboard");
    } catch (err) {
      alert(`Auth failed: ${err.message}`);
    }
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (err) {
      alert("Google sign-in failed: " + err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 space-y-4 p-6 shadow rounded bg-white">
      <h1 className="text-xl font-bold text-center">
        {isRegister ? "Create Account" : "Login"}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...formRegister("email")}
          placeholder="Email"
          className="w-full border p-2 rounded"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}

        <input
          type="password"
          {...formRegister("password")}
          placeholder="Password"
          className="w-full border p-2 rounded"
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          {isRegister ? "Sign Up" : "Sign In"}
        </button>
      </form>

      <button
        onClick={handleGoogle}
        className="w-full bg-red-500 text-white p-2 rounded"
      >
        Continue with Google
      </button>

      <p className="text-sm text-center">
        {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
        <button
          onClick={() => setIsRegister(!isRegister)}
          className="text-blue-600 underline"
        >
          {isRegister ? "Login" : "Register"}
        </button>
      </p>
    </div>
  );
}
