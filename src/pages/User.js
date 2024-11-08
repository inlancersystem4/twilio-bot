import React, { useCallback, useEffect, useState } from "react";
import {
  Trash2,
  Pencil,
  Plus,
  ListFilter,
  ArrowUpDown,
  Loader,
  Database,
} from "lucide-react";
import { post } from "../utils/apiHelper";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@headlessui/react";

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
    <div className="space-y-4 py-6">
      <h1 className="text-base">User List</h1>
      <div className="flex items-center justify-between gap-3 rounded-lg bg-white bg-opacity-10 py-1.5 px-2.5">
        <div className="flex items-center gap-1">
          <Link
            className="min-w-6 min-h-6 max-w-6 max-h-6 hover:bg-white hover:bg-opacity-20 rounded-md flex items-center justify-center"
            to="/user-add-edit"
          >
            <Plus className="w-4 h-4" />
          </Link>
          <Button className="min-w-6 min-h-6 max-w-6 max-h-6 hover:bg-white hover:bg-opacity-20 rounded-md flex items-center justify-center">
            <ListFilter className="w-4 h-4" />
          </Button>
          <Button className="min-w-6 min-h-6 max-w-6 max-h-6 hover:bg-white hover:bg-opacity-20 rounded-md flex items-center justify-center">
            <ArrowUpDown className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="space-y-3">
        {loading ? (
          <div className="py-8 w-full text-center">
            <Loader className="w-12 h-12 mx-auto animate-spin" />
          </div>
        ) : (
          <>
            <ul className="custom-table users-table">
              <li className="flex items-center justify-between">
                <p className="name">Name</p>
                <p className="email">Email</p>
                <p className="action">Actions</p>
              </li>
              {userList && userList.length > 0 ? (
                userList.map((user) => (
                  <li
                    className="flex items-center justify-between"
                    key={user.user_id}
                  >
                    <p className="name">{user.user_first_name}</p>
                    <p className="email">{user.user_email}</p>
                    <div className="flex items-center justify-end action gap-2">
                      <div>
                        <button
                          className="icon"
                          onClick={() => handleEdit(user.user_id)}
                        >
                          <Pencil />
                        </button>
                      </div>
                      <div>
                        <button
                          className="icon"
                          onClick={() => handleDelete(user.user_id)}
                        >
                          <Trash2 />
                        </button>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="space-y-2 text-center">
                  <Database className="w-12 h-12 mx-auto" />
                  <p>No Users found.</p>
                </li>
              )}
            </ul>
            <div className="flex items-center justify-end gap-2">
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage >= totalPage}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default User;
