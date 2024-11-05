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
    reset,
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
        reset();
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full sm:w-96">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Login
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="text"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email format",
                },
              })}
              className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register("password", { required: "Password is required" })}
              className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
          >
            {isSubmitting ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
