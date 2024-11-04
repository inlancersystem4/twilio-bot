import React from "react";
import { useForm } from "react-hook-form";
import { post } from "../utils/apiHelper";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";

const UserAddEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm();

  React.useEffect(() => {
    if (id) {
      const fetchUserData = async () => {
        try {
          const response = await post("/user-details", { user_id: id });
          if (response.success === 1) {
            setValue("firstName", response.user_data.user_first_name);
            setValue("lastName", response.user_data.user_last_name);
            setValue("email", response.user_data.user_email);
            setValue("role", response.user_data.user_role);
            setValue("password", response.user_data.user_sweet_words);
            setValue("confirmPassword", response.user_data.user_sweet_words);
          } else {
            toast.error(response.message);
          }
        } catch (e) {
          console.error("Error fetching user data", e);
        }
      };
      fetchUserData();
    }
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      const newData = {
        user_id: id || "",
        first_name: data.firstName,
        last_name: data.lastName,
        user_email: data.email,
        user_password: data.password,
        confirm_password: data.password,
        user_role: data.role,
        user_profile_pic: "",
      };
      const response = await post("/user-add", newData);
      if (response.success === 1) {
        toast.success(response.message);
        reset();
        return navigate("/users");
      } else {
        toast.error(response.message);
      }
    } catch (e) {
      console.error("Error submitting form", e);
    }
  };

  return (
    <div>
      <h1>{id ? "Edit User" : "Add User"}</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            {...register("firstName", { required: "First name is required" })}
          />
          {errors.firstName && (
            <p style={{ color: "red" }}>{errors.firstName.message}</p>
          )}
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            {...register("lastName", { required: "Last name is required" })}
          />
          {errors.lastName && (
            <p style={{ color: "red" }}>{errors.lastName.message}</p>
          )}
        </div>
        <div>
          <label>Email:</label>
          <input
            disabled={id}
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
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            {...register("confirmPassword", {
              required: "Confirm Password is required",
              validate: (value) =>
                value === watch("password") || "Passwords do not match",
            })}
          />
          {errors.confirmPassword && (
            <p style={{ color: "red" }}>{errors.confirmPassword.message}</p>
          )}
        </div>
        <div>
          <label>Role:</label>
          <select {...register("role", { required: "Role is required" })}>
            <option value="">Select a role</option>
            <option value="1">Admin</option>
            <option value="2">User</option>
            <option value="3">Editor</option>
          </select>
          {errors.role && <p style={{ color: "red" }}>{errors.role.message}</p>}
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Loading..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default UserAddEdit;
