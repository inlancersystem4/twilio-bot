import React, { useCallback, useEffect, useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { post } from "../utils/apiHelper";
import { toast } from "sonner";
import { useNavigate, useLocation, Link, useParams } from "react-router-dom";

const Contact = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();
  const [contactList, setContactList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type");

  useEffect(() => {
    if (type !== "add" && type !== "edit") {
      navigate("/contacts");
    }
  }, [type, navigate]);

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
        navigate("/contacts");
      } else {
        toast.error(response.message);
      }
    } catch (e) {
      console.error("Error saving contact", e);
    }
  };

  return (
    <div>
      <h1>Contact List</h1>
      <Link to="/contacts?type=add">Add Contact</Link>
      {loading ? (
        <p>Loading..</p>
      ) : (
        <>
          <ul>
            {contactList.length > 0 ? (
              contactList.map(({ wp_contact_id, wp_contact_name }) => (
                <li key={wp_contact_id}>
                  <p>{wp_contact_name}</p>
                  <ul>
                    <li>
                      <button onClick={() => handleEdit(wp_contact_id)}>
                        <Pencil />
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleDelete(wp_contact_id)}>
                        <Trash2 />
                      </button>
                    </li>
                  </ul>
                </li>
              ))
            ) : (
              <li>No Contacts found.</li>
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
