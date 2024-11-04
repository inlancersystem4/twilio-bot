import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { post } from "../utils/apiHelper";
import { setLogging } from "../redux/actions/actions";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logOut = async () => {
    try {
      const response = await post("/logout", {
        session_token: localStorage.getItem("token"),
      });
      if (response.success === 2) {
        toast.success(response.message);
        dispatch(setLogging(false));
        localStorage.removeItem("token");
        return navigate("/login");
      } else {
        toast.error(response.message);
      }
    } catch (e) {
      console.error("Error login", e);
    }
  };

  return (
    <div>
      <h1>Dashboard Page</h1>
      <br />
      <button onClick={logOut}>Logout</button>
      <br />
      <br />
      <ul>
        <li>
          <Link to="/users">User List</Link>
        </li>
        <li>
          <Link to="/user-add-edit">User Add</Link>
        </li>
        <br />
        <br />
        <li>
          <Link to="/contacts">Contacts List</Link>
        </li>
        <li>
          <Link to="/contacts?type=add">Contacts Add</Link>
        </li>
        <br />
        <br />
        <li>
          <Link to="/language">Language List</Link>
        </li>
        <li>
          <Link to="/language?type=add">Language Add</Link>
        </li>
        <br />
        <br />
        <li>
          <Link to="/whatsapp">Whatsapp List</Link>
        </li>
        <li>
          <Link to="/whatsapp?type=add">Whatsapp Add</Link>
        </li>
      </ul>
    </div>
  );
};

export default Dashboard;
