import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";
import { useAuthStore } from "@/lib/useAuthStore";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

import styles from "@/styles/Login.module.css";
import toast from "react-hot-toast";

const Login = () => {
  const [error, setError] = useState("");
  const router = useRouter();
  const { setUserId, setUserRole } = useAuthStore();

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    setError: setFormError,
    formState: { errors },
  } = useForm();

  // useEffect(() => {
  //   toast.success("Toast is working!");
  // }, []);

  const handleLogin = async (data) => {
    const { email, password } = data;
    setError("");

    // Custom validation
    if (!email || !email.includes("@")) {
      setFormError("email", { message: "Invalid email format" });
      return;
    }
    if (!password || password.length < 6) {
      setFormError("password", {
        message: "Password must be at least 6 characters",
      });
      return;
    }

    try {
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) {
        setError(authError.message);
        toast.error(authError.message);
        return;
      }

      const userId = authData.user.id;
      setUserId(userId);

      const { data: userData, error: dbError } = await supabase
        .from("users")
        .select("role")
        .eq("email", email)
        .single();

      if (dbError) {
        setError("Failed to fetch user role. Please try again.");
        toast.error("Failed to fetch user role. Please try again.");
        return;
      }

      const userRole = userData.role;
      setUserRole(userRole);

      toast.success("Login successful!");
      setTimeout(() => {
        router.push(userRole === "admin" ? "/" : "/");
      }, 1000);
    } catch (err) {
      console.error("Unexpected error:", err.message);
      setError("Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className={styles.background}>
      <div className={styles.formContainer}>
        <h2 className="h2">Login</h2>
        <form onSubmit={handleSubmit(handleLogin)} className={styles.form}>
          {/* Email Input */}
          <div className={styles.inputGroup}>
            <label>Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className={styles.input}
            />
            {errors.email && (
              <p className={styles.error}>{errors.email.message}</p>
            )}
          </div>

          {/* Password Input */}
          <div className={styles.inputGroup}>
            <label>Password</label>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              className={styles.input}
            />
            {errors.password && (
              <p className={styles.error}>{errors.password.message}</p>
            )}
          </div>

          {/* Error Message */}
          {error && <p className={styles.error}>{error}</p>}

          {/* Submit Button */}
          <button type="submit" className={styles.button}>
            Login
          </button>
        </form>

        {/* Links for Forget Password and Sign Up */}
        <div className={styles.links}>
          <a href="/auth/register" className={styles.link}>
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
