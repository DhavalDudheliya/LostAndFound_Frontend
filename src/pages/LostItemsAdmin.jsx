import React from "react";
import axios from "axios";
// import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { BiSearch } from "react-icons/bi";
import { ImCross } from "react-icons/im";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { ColorRing } from "react-loader-spinner";
import moment from "moment";

function LostItemsAdmin() {
  // const navigate = useNavigate();

  const [item, setItem] = useState([]);
  const [query, setQuery] = useState("");
  const [showClearIcon, setShowClearIcon] = useState("none");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`/coordinator/getLostItems`) // Here i use same route that used in Coordinator
      .then((res) => {
        const data = res.data.items;
        setItem(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const ifQueryEmpty = async () => {
    axios
      .get(`/coordinator/getLostItems`) // Here i use same route that used in Coordinator
      .then((res) => {
        const data = res.data.items;
        setItem(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSearch = async () => {
    if (query.length === 0) {
      // handle empty query
      ifQueryEmpty();
      return;
    }
    axios
      .get(
        `/coordinator/getLostItemsBySearch?q=${query}` // Here i use same route that used in Coordinator
      )
      .then((res) => {
        const data = res.data.items;
        setItem(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "15ch" },
        }}
        noValidate
        autoComplete="off"
      ></Box>

      <div className="search-area">
        <TextField
          id="outlined-required"
          // label="Search by name"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <BiSearch
                  onClick={handleSearch}
                  className="search-icon hover:scale-125"
                ></BiSearch>{" "}
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end" style={{ display: showClearIcon }}>
                <ImCross
                  style={{ cursor: "pointer" }}
                  onClick={(e) => {
                    setQuery("");
                    setShowClearIcon("none");
                    ifQueryEmpty();
                  }}
                ></ImCross>
              </InputAdornment>
            ),
          }}
          className="search-field"
          placeholder="Search by name.."
          size="small"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowClearIcon(e.target.value === "" ? "none" : "flex");
            handleSearch();
          }}
          onKeyPress={handleKeyPress}
        />
      </div>
      <div className="min-h-screen">
        <div className="table-heading">
          <p className="text-color headings text-3xl">Lost Items</p>
        </div>
        {loading ? (
          <div className="loading-1">
            <ColorRing
              visible={true}
              height="80"
              width="80"
              ariaLabel="blocks-loading"
              wrapperStyle={{}}
              wrapperClass="blocks-wrapper"
              colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
            />
          </div>
        ) : (
          <div className="container table">
            <div className="overflow-x-auto">
              <div>
                <div>
                  <div className="shadow-md rounded my-5">
                    <table className="min-w-max bg-white w-full table-auto">
                      <thead>
                        <tr className="border-b bg-gray-200 text-black-600 uppercase text-sm leading-normal">
                          <th className="py-2 px-5 text-center">Index</th>
                          <th className="py-3 px-6 text-center">Item name</th>
                          <th className="py-3 px-6 text-center">Description</th>
                          <th className="py-3 px-6 text-center">Location</th>
                          <th className="py-3 px-6 text-center">Lost-Date</th>
                          <th className="py-3 px-6 text-center">Listed By</th>
                          <th className="py-3 px-6 text-center">Listed At</th>
                          <th className="py-3 px-6 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="text-black-600 text-sm font-light">
                        {item.map((itemData, index) => (
                          <tr className="border-b border-slate-300 bg-gray-50 hover:bg-gray-100 ">
                            <td className="py-3 px-6 text-center">
                              <span className="font-semibold">{index + 1}</span>
                            </td>
                            <td className="py-3 px-6 text-center">
                              <div className="font-normal">
                                {itemData.itemName}
                              </div>
                            </td>
                            <td className="py-3 px-6 text-center">
                              <div className="font-normal break-normal break-all max-w-[150px]">
                                {itemData.description}
                              </div>
                            </td>
                            <td className="py-3 px-6 text-center">
                              <div className="font-normal">
                                {itemData.location}
                              </div>
                            </td>
                            <td className="py-3 px-6 text-center">
                              <div className="font-normal">
                                {itemData.lostDate}
                              </div>
                            </td>
                            <td className="py-3 px-6 text-center">
                              <div className="font-normal">
                                {itemData.listedBy}
                              </div>
                            </td>
                            <td className="py-3 px-6 text-center">
                              <div className="font-normal">
                                {moment(itemData.ListedAt).format("DD-MM-YYYY")}
                              </div>
                            </td>
                            <td className="py-3 px-6 text-center">
                              <div>
                                <p className="status-text font-normal text-red-600">
                                  {itemData.status}
                                </p>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default LostItemsAdmin;
