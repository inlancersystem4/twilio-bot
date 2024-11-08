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

const Language = () => {
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
  const [languageList, setLanguageList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type");

  useEffect(() => {
    if (type === "add" && id) {
      navigate("/language");
    } else if (type === "edit" && !id) {
      navigate("/language");
    } else if (!type && id) {
      navigate("/language");
    }
  }, [type, id, navigate]);

  const fetchLanguageList = useCallback(async () => {
    setLoading(true);
    try {
      const response = await post("/language-list", {
        page_no: currentPage,
        search: "",
      });
      if (response.success === 1) {
        setLanguageList(response.data.lang_list);
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
    fetchLanguageList();
  }, [fetchLanguageList]);

  const handleDelete = async (id) => {
    try {
      const response = await post("/remove-language", { lang_id: id });
      if (response.success === 1) {
        toast.success(response.message);
        fetchLanguageList();
      } else {
        toast.error(response.message);
      }
    } catch (e) {
      console.error("Error deleting contact", e);
    }
  };

  const handleEdit = (id) => {
    navigate(`/language/${id}?type=edit`);
  };

  useEffect(() => {
    const fetchLanguageData = async () => {
      if (!id) return;

      try {
        const response = await post("/language-detail", { lang_id: id });
        if (response.success === 1) {
          setValue("name", response.data.lang_name);
        } else {
          toast.error(response.message);
        }
      } catch (e) {
        console.error("Error fetching contact data", e);
      }
    };

    fetchLanguageData();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      const response = await post("/add-language", {
        lang_id: id || "",
        lang_name: data.name,
      });
      if (response.success === 1) {
        toast.success(response.message);
        fetchLanguageList();
        reset();
        navigate("/language");
      } else {
        toast.error(response.message);
      }
    } catch (e) {
      console.error("Error saving contact", e);
    }
  };

  return (
    <div className="space-y-4 py-6">
      <h1 className="text-base">Language List</h1>
      <div className="flex items-center justify-between gap-3 rounded-lg bg-white bg-opacity-10 py-1.5 px-2.5">
        <div className="flex items-center gap-1">
          <Link
            className="min-w-6 min-h-6 max-w-6 max-h-6 hover:bg-white hover:bg-opacity-20 rounded-md flex items-center justify-center"
            to="/language?type=add"
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
            <ul className="custom-table">
              <li className="flex items-center justify-between">
                <p>Language</p>
                <p>Action</p>
              </li>
              {languageList.length > 0 ? (
                languageList.map((language) => (
                  <li
                    className="flex items-center justify-between"
                    key={language.lang_id}
                  >
                    <p>{language.lang_name}</p>
                    <div className="flex items-center gap-2 justify-end">
                      <div>
                        <button
                          className="icon"
                          onClick={() => handleEdit(language.lang_id)}
                        >
                          <Pencil />
                        </button>
                      </div>
                      <div>
                        <button
                          className="icon"
                          onClick={() => handleDelete(language.lang_id)}
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
                  <p>No Language found.</p>
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
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Loading..." : "Save"}
          </button>
        </form>
      )}
    </div>
  );
};

export default Language;
