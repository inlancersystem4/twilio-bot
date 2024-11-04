import React, { useEffect, useState } from "react";
import { post } from "../utils/apiHelper";
import { toast } from "sonner";

const User = () => {
  const [userList, setUserList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserList = async () => {
      setLoading(true);
      try {
        const newData = { page_no: currentPage };
        const response = await post("/user-list", newData);
        if (response.success === 1) {
          setUserList(response.data);
        } else {
          toast.error(response.message);
        }
      } catch (e) {
        console.error("Error fetching user list", e);
        toast.error("Failed to fetch user list.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserList();
  }, [currentPage]);

  return (
    <div>
      <h1>User List</h1>
      {loading ? (
        <p>Loading..</p>
      ) : (
        <>
          <ul>
            {userList && userList.length > 0 ? (
              userList.map((user) => <li key={user.id}>{user.name}</li>)
            ) : (
              <li>No users found.</li>
            )}
          </ul>
          <div>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              Previous
            </button>
            <button onClick={() => setCurrentPage((prev) => prev + 1)}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default User;
