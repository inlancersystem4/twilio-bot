import React, { useCallback, useEffect, useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import { post } from "../utils/apiHelper";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";

const User = () => {
  const navigate = useNavigate();

  const [userList, setUserList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchUserList = useCallback(async () => {
    setLoading(true);
    try {
      const newData = { page_no: currentPage };
      const response = await post("/user-list", newData);
      if (response.success === 1) {
        setUserList(response.data.user_list);
        setCurrentPage(response.data.current_page);
        setTotalPage(response.data.total_pages);
      } else {
        toast.error(response.message);
      }
    } catch (e) {
      console.error("Error fetching user list", e);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchUserList();
  }, [currentPage, fetchUserList]);

  async function handleDelete(id) {
    try {
      const newData = { user_id: id };
      const response = await post("/user-remove", newData);
      if (response.success === 1) {
        toast.success(response.message);
        fetchUserList();
      } else {
        toast.error(response.message);
      }
    } catch (e) {
      console.error("Error deleting user", e);
    }
  }

  function handleEdit(id) {
    return navigate(`/user-add-edit/${id}`);
  }

  return (
    <div>
      <h1>User List</h1>
      <Link to="/user-add-edit">Add User</Link>
      {loading ? (
        <p>Loading..</p>
      ) : (
        <>
          <ul>
            {userList && userList.length > 0 ? (
              userList.map((user) => (
                <li key={user.user_id}>
                  <p>{user.user_first_name}</p>
                  <ul>
                    <li>
                      <button onClick={() => handleEdit(user.user_id)}>
                        <Pencil />
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleDelete(user.user_id)}>
                        <Trash2 />
                      </button>
                    </li>
                  </ul>
                </li>
              ))
            ) : (
              <li>No users found.</li>
            )}
          </ul>
          <div>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage >= totalPage}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default User;
