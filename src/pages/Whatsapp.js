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
import { useForm } from "react-hook-form";
import { post } from "../utils/apiHelper";
import { toast } from "sonner";
import { useNavigate, useLocation, Link, useParams } from "react-router-dom";
import { Button } from "@headlessui/react";
import { AlertDialog } from "../components/custom/AlertDialog";

const Whatsapp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
  const [whatsappList, setWhatsappList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [deleteId, setDeleteId] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(true);
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type");

  useEffect(() => {
    if (type === "add" && id) {
      navigate("/whatsapp");
    } else if (type === "edit" && !id) {
      navigate("/whatsapp");
    } else if (!type && id) {
      navigate("/whatsapp");
    }
  }, [type, id, navigate]);

  const fetchWhatsappList = useCallback(async () => {
    setLoading(true);
    try {
      const response = await post("/whats-app-list", {
        page_no: currentPage,
      });
      if (response.success === 1) {
        setWhatsappList(response.data.whatsapp_list);
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
    fetchWhatsappList();
  }, [fetchWhatsappList]);

  function toggleDelete(value) {
    if (value) {
      handleDelete();
    } else {
      setDeleteDialog(false);
    }
  }

  function getDeleteId(id) {
    setDeleteId(id);
    setDeleteDialog(true);
  }

  const handleDelete = async () => {
    try {
      const response = await post("/whats-app-remove", { wp_id: deleteId });
      if (response.success === 1) {
        toast.success(response.message);
        fetchWhatsappList();
        setDeleteDialog(false);
      } else {
        setDeleteDialog(false);
        toast.error(response.message);
      }
    } catch (e) {
      setDeleteDialog(false);
      console.error("Error deleting contact", e);
    }
  };

  const handleEdit = (id) => {
    navigate(`/whatsapp/${id}?type=edit`);
  };

  useEffect(() => {
    const fetchWhatsappData = async () => {
      if (!id) return;

      try {
        const response = await post("/whats-app-detail", { wp_id: id });
        if (response.success === 1) {
          setValue("number", response.data.wp_number);
          setValue("key", response.data.wp_key);
          setValue("secret", response.data.wp_secret);
        } else {
          toast.error(response.message);
        }
      } catch (e) {
        console.error("Error fetching contact data", e);
      }
    };

    fetchWhatsappData();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      const response = await post("/whats-app-add", {
        wp_id: id || "",
        wp_user: localStorage.getItem("userID"),
        wp_number: data.number,
        wp_key: data.key,
        wp_secret: data.secret,
      });
      if (response.success === 1) {
        toast.success(response.message);
        fetchWhatsappList();
        reset();
        navigate("/whatsapp");
      } else {
        toast.error(response.message);
      }
    } catch (e) {
      console.error("Error saving contact", e);
    }
  };

  return (
    <div className="space-y-4 py-6">
      <h1 className="text-base">Whatsapp List</h1>
      <div className="flex items-center justify-between gap-3 rounded-lg bg-white bg-opacity-10 py-1.5 px-2.5">
        <div className="flex items-center gap-1">
          <Link
            className="min-w-6 min-h-6 max-w-6 max-h-6 hover:bg-white hover:bg-opacity-20 rounded-md flex items-center justify-center"
            to="/whatsapp?type=add"
          >
            <Plus className="w-4 h-4" />
          </Link>
          <Button
            className="min-w-6 min-h-6 max-w-6 max-h-6 hover:bg-white hover:bg-opacity-20 rounded-md flex items-center justify-center"
            to="/whatsapp?type=add"
          >
            <ListFilter className="w-4 h-4" />
          </Button>
          <Button
            className="min-w-6 min-h-6 max-w-6 max-h-6 hover:bg-white hover:bg-opacity-20 rounded-md flex items-center justify-center"
            to="/whatsapp?type=add"
          >
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
            <ul className="custom-table">
              <li className="flex items-center justify-between">
                <div>
                  <p>Whatsapp Number</p>
                </div>
                <div>
                  <p>Action</p>
                </div>
              </li>
              {whatsappList.length > 0 ? (
                whatsappList.map((item) => (
                  <li
                    className="flex items-center justify-between w-full"
                    key={item.wp_id}
                  >
                    <div>
                      <p>{item.wp_number}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div>
                        <button
                          className="icon"
                          onClick={() => handleEdit(item.wp_id)}
                        >
                          <Pencil />
                        </button>
                      </div>
                      <div>
                        <button
                          className="icon"
                          onClick={() => getDeleteId(item.wp_id)}
                        >
                          <Trash2 />
                        </button>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="space-y-2 text-center !py-6">
                  <Database className="w-12 h-12 mx-auto" />
                  <p>No Whatsapp found.</p>
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
      {type && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label>Number:</label>
            <input
              type="text"
              {...register("number", {
                required: "Number is required",
                pattern: {
                  value: /^[0-9]*$/,
                  message: "Please enter a valid number",
                },
              })}
            />
            {errors.number && (
              <p style={{ color: "red" }}>{errors.number.message}</p>
            )}
          </div>
          <div>
            <label>Key:</label>
            <input
              type="text"
              {...register("key", { required: "key is required" })}
            />
            {errors.key && <p style={{ color: "red" }}>{errors.key.message}</p>}
          </div>
          <div>
            <label>Secret:</label>
            <input
              type="text"
              {...register("secret", { required: "secret is required" })}
            />
            {errors.secret && (
              <p style={{ color: "red" }}>{errors.secret.message}</p>
            )}
          </div>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Loading..." : "Save"}
          </button>
        </form>
      )}
      <AlertDialog isOpen={deleteDialog} toggle={toggleDelete} />
    </div>
  );
};

export default Whatsapp;
