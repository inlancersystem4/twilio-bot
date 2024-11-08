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

const Contact = () => {
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
  const [contactList, setContactList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type");

  useEffect(() => {
    if (type === "add" && id) {
      navigate("/contacts");
    } else if (type === "edit" && !id) {
      navigate("/contacts");
    } else if (!type && id) {
      navigate("/contacts");
    }
  }, [type, id, navigate]);

  const fetchContactList = useCallback(async () => {
    setLoading(true);
    try {
      const response = await post("/contact-list", {
        page_no: currentPage,
        search: "",
      });
      if (response.success === 1) {
        setContactList(response.data.contact_list);
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
    fetchContactList();
  }, [fetchContactList]);

  const handleDelete = async (id) => {
    try {
      const response = await post("/remove-contact", { contact_id: id });
      if (response.success === 1) {
        toast.success(response.message);
        fetchContactList();
      } else {
        toast.error(response.message);
      }
    } catch (e) {
      console.error("Error deleting contact", e);
    }
  };

  const handleEdit = (id) => {
    navigate(`/contacts/${id}?type=edit`);
  };

  useEffect(() => {
    const fetchContactData = async () => {
      if (!id) return;

      try {
        const response = await post("/contact-detail", { contact_id: id });
        if (response.success === 1) {
          setValue("name", response.data.wp_contact_name);
          setValue("number", response.data.wp_contact_number);
        } else {
          toast.error(response.message);
        }
      } catch (e) {
        console.error("Error fetching contact data", e);
      }
    };

    fetchContactData();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      const response = await post("/contact-add", {
        contact_id: id || "",
        contact_name: data.name,
        contact_user: localStorage.getItem("userID"),
        contact_number: data.number,
      });
      if (response.success === 1) {
        toast.success(response.message);
        fetchContactList();
        reset();
        navigate("/contacts");
      } else {
        toast.error(response.message);
      }
    } catch (e) {
      console.error("Error saving contact", e);
    }
  };

  return (
    <div className="space-y-4 py-6">
      <h1 className="text-base">Contact List</h1>
      <div className="flex items-center justify-between gap-3 rounded-lg bg-white bg-opacity-10 py-1.5 px-2.5">
        <div className="flex items-center gap-1">
          <Link
            className="min-w-6 min-h-6 max-w-6 max-h-6 hover:bg-white hover:bg-opacity-20 rounded-md flex items-center justify-center"
            to="/contacts?type=add"
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
            <ul className="custom-table contacts-table">
              <li className="flex items-center justify-between">
                <div className="name">
                  <p>Contact Name</p>
                </div>
                <div className="number">
                  <p>Contact Number</p>
                </div>
                <div className="action">
                  <p>Action</p>
                </div>
              </li>
              {contactList.length > 0 ? (
                contactList.map(
                  ({ wp_contact_id, wp_contact_name, wp_contact_number }) => (
                    <li
                      className="flex items-center justify-between"
                      key={wp_contact_id}
                    >
                      <p className="name">{wp_contact_name}</p>
                      <p className="number">{wp_contact_number}</p>
                      <div className="flex items-center justify-end gap-2 action">
                        <div>
                          <button
                            className="icon"
                            onClick={() => handleEdit(wp_contact_id)}
                          >
                            <Pencil />
                          </button>
                        </div>
                        <div>
                          <button
                            className="icon"
                            onClick={() => handleDelete(wp_contact_id)}
                          >
                            <Trash2 />
                          </button>
                        </div>
                      </div>
                    </li>
                  )
                )
              ) : (
                <li className="space-y-2 text-center !py-6">
                  <Database className="w-12 h-12 mx-auto" />
                  <p>No Contacts found.</p>
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
            <label>Name:</label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p style={{ color: "red" }}>{errors.name.message}</p>
            )}
          </div>
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
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Loading..." : "Save"}
          </button>
        </form>
      )}
    </div>
  );
};

export default Contact;
