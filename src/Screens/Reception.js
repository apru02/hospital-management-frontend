import React from "react";
import { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { BASE_URL } from "../utils/constant";
import { TailSpin } from "react-loader-spinner";
import { useEffect } from "react";
function Reception({ user_details }) {
  const [Logs, setLogs] = useState([]);
  const [spinner, setSpinner] = useState(false);
  const [searchedUser, setSearchedUser] = useState({});
  const [purpose, setPurpose] = useState("");
  const [email, setEmail] = useState("");
  const getUserFromEmail = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/get-user-from-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      });
     // console.log(email);

      const data = await response.json();
     // console.log(data);
      if (data.success) {
        setSearchedUser(data.data);
      //  console.log(data.data);
      } else {
        console.log("User not found");
        setSearchedUser({});
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getLogs = async () => {
    setSpinner(true);
    try {
      const response = await fetch(`${BASE_URL}/api/entry/fetch-all-log`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });
      const data = await response.json();
      if (data.success) {
        setLogs(data.data);
        setSpinner(false);
      } else {
        alert("Failed to fetch logs");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getLogs();
  }, []);

  const createUser = async (values) => {
    let category = values.category;
    const body = {
      name: values.name,
      email: values.email,
      password: values.password,
      phone: values.phone,
      address: values.address,
      city: values.city,
      state: values.state,
      pin_code: values.pin_code,
    };

    if (category === "doctor") {
      body.education = values.education;
      body.experience = values.experience;
      body.specialization = values.specialization;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/auth/create${category}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
     // console.log(data);

      if (data.success) {
        alert("User created successfully");
        setShowForm(false);
      } else {
        alert("User creation failed");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const checkOut = async (entry_id) => {
    try {
      setSpinner(true);
      const response = await fetch(
        `${BASE_URL}/api/entry/check-out/${entry_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        getLogs();
      }
      setSpinner(false);
    } catch (error) {
      console.log(error);
    }
  };
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    email: Yup.string().email().required("Required"),
    password: Yup.string().required("Required"),
    //confirm_password should be same as password
    confirm_password: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Required"),
    phone: Yup.string().required("Required"),
    address: Yup.string().required("Required"),
    city: Yup.string().required("Required"),
    state: Yup.string().required("Required"),
    pin_code: Yup.string().required("Required"),
    category: Yup.string().required("Required"),
    /*
    education: Yup.string().when("category", {
      is: "doctor",
      then: Yup.string().required("Required"),
    }),
    experience: Yup.string().when("category", {
      is: "doctor",
      then: Yup.string().required("Required"),
    }),
    specialization: Yup.string().when("category", {
      is: "doctor",
      then: Yup.string().required("Required"),
    }),*/
  });
  const checkIn = async (user_id) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/entry/check-in/${user_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
          body: JSON.stringify({ purpose }),
        }
      );
      const data = await response.json();
      if (data.success) {
        getLogs();
      }
      setShowSearch(false);
      setPurpose("");
      setEmail("");
      setSearchedUser({});
    } catch (error) {
      console.log(error);
    }
  };
  const [showForm, setShowForm] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  return (
    <div className="flex flex-col">
      <TailSpin
        visible={spinner}
        height="60"
        width="60"
        color="blue"
        ariaLabel="tail-spin-loading"
        radius="1"
        wrapperStyle={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 100,
        }}
        wrapperClass=""
      />
      <div className="flex justify-between p-5">
        <h1 className="text-2xl">Reception</h1>
        <h1 className="text-2xl">{user_details.name}</h1>
      </div>
      <div className="flex flex-row p-3">
        <div
          className="flex flex-col p-4"
          style={{
            width: "30%",
          }}
        >
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-500 text-white p-2 rounded-md"
          >
            Create New User
          </button>
          {showForm && (
            <Formik
              initialValues={{
                name: "",
                email: "",
                password: "",
                confirm_password: "",
                phone: "",
                address: "",
                city: "",
                state: "",
                pin_code: "",
                category: "",
                education: "",
                experience: "",
                specialization: "",
              }}
              validationSchema={validationSchema}
              onSubmit={(values) => {
               // console.log(values);
                createUser(values);
                //clear form
                values.name = "";
                values.email = "";
                values.password = "";
                values.confirm_password = "";
                values.phone = "";
                values.address = "";
                values.city = "";
                values.state = "";
                values.pin_code = "";
                values.category = "";
                values.education = "";
                values.experience = "";
                values.specialization = "";
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
              }) => (
                <form
                  className="flex flex-col items-center"
                  onSubmit={handleSubmit}
                  style={{
                    height: "65vh",
                    overflowY: "scroll",
                    scrollbarColor: "#edf2f7 transparent",
                    scrollbarWidth: "thin",
                  }}
                >
                  <input
                    className="border border-gray-400 p-2 w-80 mt-5"
                    type="text"
                    name="name"
                    placeholder="Name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                  />
                  {errors.name && touched.name && (
                    <div className="text-red-500">{errors.name}</div>
                  )}
                  <input
                    className="border border-gray-400 p-2 w-80 mt-5"
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                  />
                  {errors.email && touched.email && (
                    <div className="text-red-500">{errors.email}</div>
                  )}
                  <input
                    className="border border-gray-400 p-2 w-80 mt-5"
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                  />
                  {errors.password && touched.password && (
                    <div className="text-red-500">{errors.password}</div>
                  )}
                  <input
                    className="border border-gray-400 p-2 w-80 mt-5"
                    type="password"
                    name="confirm_password"
                    placeholder="Confirm Password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.confirm_password}
                  />
                  {errors.confirm_password && touched.confirm_password && (
                    <div className="text-red-500">
                      {errors.confirm_password}
                    </div>
                  )}

                  <input
                    className="border border-gray-400 p-2 w-80 mt-5"
                    type="text"
                    name="phone"
                    placeholder="Phone"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.phone}
                  />
                  {errors.phone && touched.phone && (
                    <div className="text-red-500">{errors.phone}</div>
                  )}
                  <input
                    className="border border-gray-400 p-2 w-80 mt-5"
                    type="text"
                    name="address"
                    placeholder="Address"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.address}
                  />
                  {errors.address && touched.address && (
                    <div className="text-red-500">{errors.address}</div>
                  )}
                  <input
                    className="border border-gray-400 p-2 w-80 mt-5"
                    type="text"
                    name="city"
                    placeholder="City"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.city}
                  />
                  {errors.city && touched.city && (
                    <div className="text-red-500">{errors.city}</div>
                  )}
                  <input
                    className="border border-gray-400 p-2 w-80 mt-5"
                    type="text"
                    name="state"
                    placeholder="State"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.state}
                  />
                  {errors.state && touched.state && (
                    <div className="text-red-500">{errors.state}</div>
                  )}
                  <input
                    className="border border-gray-400 p-2 w-80 mt-5"
                    type="text"
                    name="pin_code"
                    placeholder="Pin Code"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.pin_code}
                  />
                  {errors.pin_code && touched.pin_code && (
                    <div className="text-red-500">{errors.pin_code}</div>
                  )}
                  <select
                    className="border border-gray-400 p-2 w-80 mt-5"
                    name="category"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.category}
                  >
                    <option value="">Select Category</option>
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                    <option value="admin">Admin</option>
                    <option value="laboratorist">Laboratorist</option>
                    <option value="pharmacist">Pharmacist</option>
                    <option value="nurse">Nurse</option>
                    <option value="accountant">Accountant</option>
                  </select>
                  {errors.category && touched.category && (
                    <div className="text-red-500">{errors.category}</div>
                  )}
                  {values.category === "doctor" && (
                    <>
                      <input
                        className="border border-gray-400 p-2 w-80 mt-5"
                        type="text"
                        name="education"
                        placeholder="Education"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.education}
                      />
                      {errors.education && touched.education && (
                        <div className="text-red-500">{errors.education}</div>
                      )}
                      <input
                        className="border border-gray-400 p-2 w-80 mt-5"
                        type="text"
                        name="experience"
                        placeholder="Experience"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.experience}
                      />
                      {errors.experience && touched.experience && (
                        <div className="text-red-500">{errors.experience}</div>
                      )}
                      <input
                        className="border border-gray-400 p-2 w-80 mt-5"
                        type="text"
                        name="specialization"
                        placeholder="Specialization"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.specialization}
                      />
                      {errors.specialization && touched.specialization && (
                        <div className="text-red-500">
                          {errors.specialization}
                        </div>
                      )}
                    </>
                  )}
                  <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 w-80 mt-5"
                  >
                    Create User
                  </button>
                </form>
              )}
            </Formik>
          )}
        </div>
        <div
          className="flex flex-col p-4"
          style={{
            width: "35%",
          }}
        >
          <h1
            className="text-2xl"
            style={{ textAlign: "center", fontWeight: "500" }}
          >
            All Entry Logs
          </h1>
          <div
            className="flex flex-col"
            style={{
              height: "66vh",
              overflowY: "scroll",
              scrollbarColor: "#edf2f7 transparent",
              scrollbarWidth: "thin",
            }}
          >
            {Logs.map((log) => (
              <div
                key={log._id}
                className="flex flex-col p-2"
                style={{
                  borderBottom: "1px solid #ccc",
                }}
              >
                <span
                  style={{
                    fontSize: "1rem",
                    fontWeight: "500",
                  }}
                >
                  Name: {log?.name}
                </span>
                <span
                  style={{
                    fontSize: "1rem",
                    fontWeight: "500",
                  }}
                >
                  Email:{" "}
                  <span
                    style={{
                      color: "#e54cff",
                    }}
                  >
                    {log?.email}
                  </span>
                </span>
                <span
                  style={{
                    fontSize: "1rem",
                    fontWeight: "500",
                  }}
                >
                  Check In Time:{" "}
                  <span style={{ color: "rgb(65 131 0)", fontWeight: "700" }}>
                    {new Date(log?.check_in).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </span>
                <span
                  style={{
                    fontSize: "1rem",
                    fontWeight: "500",
                  }}
                >
                  Check Out Time:{" "}
                  <span style={{ color: "rgb(255 38 0)", fontWeight: "700" }}>
                    {log?.check_out
                      ? new Date(log?.check_out).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : null}
                  </span>
                </span>
                <span
                  style={{
                    fontSize: "1rem",
                    fontWeight: "500",
                  }}
                >
                  Date: {new Date(log?.check_in).toLocaleDateString("en-US")}
                </span>
                <span
                  style={{
                    fontSize: "1rem",
                    fontWeight: "500",
                  }}
                >
                  Purpose:{" "}
                  <span style={{ fontStyle: "italic" }}>{log?.purpose}</span>
                </span>
                <button
                  style={{
                    display:
                      !user_details.is_patient && !log.check_out
                        ? "block"
                        : "none",
                  }}
                  className="bg-blue-500 rounded-lg text-white p-2 w-80 mt-3"
                  onClick={() => {
                    checkOut(log._id);
                    getLogs();
                  }}
                >
                  Check Out
                </button>
              </div>
            ))}
          </div>
        </div>
        <div
          className="flex flex-col p-4"
          style={{
            width: "30%",
          }}
        >
          <h1
            className="text-2xl"
            style={{ textAlign: "center", fontWeight: "500" }}
          >
            Check In
          </h1>
          <input
            className="border border-gray-400 p-2 w-80 mt-5"
            type="email"
            placeholder="Enter Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white p-2 w-80 mt-5"
            onClick={() => getUserFromEmail()}
          >
            Search
          </button>
          {Object.keys(searchedUser).length > 0 ? (
            <div className="flex flex-col">
              <div className="flex flex-col p-2">
                <span style={{ fontSize: "1rem", fontWeight: "500" }}>
                  Name: {searchedUser?.name}
                </span>
                <span style={{ fontSize: "1rem", fontWeight: "500" }}>
                  Email:{" "}
                  <span style={{ color: "#e54cff" }}>
                    {searchedUser?.email}
                  </span>
                </span>
                <span style={{ fontSize: "1rem", fontWeight: "500" }}>
                  Phone:{" "}
                  <span style={{ color: "#e54cff" }}>
                    {searchedUser?.phone}
                  </span>
                </span>
              </div>
              <input
                className="border border-gray-400 p-2 w-80 mt-5"
                type="text"
                placeholder="Purpose"
                onChange={(e) => setPurpose(e.target.value)}
              />
              <button
                className="bg-blue-500 text-white p-2 w-80 mt-5"
                onClick={() => checkIn(searchedUser._id)}
              >
                Check In
              </button>
            </div>
          ) : showSearch ? (
            <div>No user found</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Reception;
