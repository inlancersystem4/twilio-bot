import React from "react";
import { useForm } from "react-hook-form";
import { post } from "../utils/apiHelper";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { setLogging } from "../redux/actions/actions";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    try {
      const newData = {
        user_email: data.email,
        user_password: data.password,
        user_type: "Admin",
      };
      const response = await post("/login", newData);
      if (response.success === 1) {
        toast.success(response.message);
        dispatch(setLogging(true));
        localStorage.setItem("token", response.data.user_token);
        localStorage.setItem("userID", response.data.id);
        await navigate("/");
      } else {
        toast.error(response.message);
      }
    } catch (e) {
      console.error("Error login", e);
    }
  };

  return (
    <div>
      <h1>Login Page</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Email:</label>
          <input
            type="text"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email format",
              },
            })}
          />
          {errors.email && (
            <p style={{ color: "red" }}>{errors.email.message}</p>
          )}
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && (
            <p style={{ color: "red" }}>{errors.password.message}</p>
          )}
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
