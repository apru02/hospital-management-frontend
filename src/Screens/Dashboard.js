import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { BASE_URL } from "../utils/constant";
import Reception from "./Reception";
import MedicalHistory from "./MedicalHistory";
import Doctor from "./Doctor";
function Dashboard() {
  const navigate = useNavigate();
  const [user_details, setUserDetails] = useState({});
  const [entryLog, setEntryLog] = useState([]);
  const [doctorsList, setDoctorsList] = useState([]);
  const getAvailableDoctors = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/entry/check-doctors`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });
      const data = await response.json();
      if (data.success) {
        setDoctorsList(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAvailableDoctors();
  }, []);

  const checkOut = async (entry_id) => {
    try {
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
        getUserLogs();
        getAvailableDoctors();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUserLogs = async () => {
    const user_id = user_details?._id;
    if (!user_id) return;
    try {
      const response = await fetch(
        `${BASE_URL}/api/entry/fetch-all-log/${user_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
        }
      );
      const data = await response.json();
      console.log(data);
      if (data.success) {
        setEntryLog(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUserDetails = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/getuser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });
      const data = await response.json();
      if (data.success) {
        setUserDetails(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const Logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      console.log("Token exists");
      getUserDetails();
      //   getSites();
    } else {
      navigate("/login");
    }
  }, [localStorage.getItem("token")]); // Add localStorage.getItem('token') as a dependency

  useEffect(() => {
    getUserLogs();
  }, [user_details]); // Add user_details as a dependency
  const [selectedTab, setSelectedTab] = useState(0);
  const [checkInVisible, setCheckInVisible] = useState(false);
  const [purpose, setPurpose] = useState("");

  const checkIn = async () => {
    const user_id = user_details?._id;
    if (!user_id) return;
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
        getUserLogs();
        setCheckInVisible(false);
        setPurpose("");
        getAvailableDoctors();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div
        className="flex px-3 py-2 flex-row w-full items-center"
        style={{
          justifyContent: "space-between",
          backgroundColor: "#f0f0f0",
        }}
      >
        <span
          style={{
            fontSize: "1rem",
            fontWeight: "bold",
          }}
        >
          Hospital Management Portal
        </span>
        <div
          className="flex flex-row items-center gap-4"
          style={{
            width: "50%",
            justifyContent: "flex-start",
          }}
        >
          <span
            style={{
              fontSize: "0.9rem",
              fontWeight: "400",
              cursor: "pointer",
            }}
            //tailwind class for rounder borders
            className="rounded-lg p-1 bg-gray-300 hover:bg-gray-400"
            onClick={() => setSelectedTab(0)}
          >
            Home{" "}
          </span>
          <span
            style={{
              fontSize: "0.9rem",
              fontWeight: "400",
              cursor: "pointer",
            }}
            className="rounded-lg p-1 bg-gray-300 hover:bg-gray-400"
            onClick={() => {
              setSelectedTab(1);
              getAvailableDoctors();
            }}
          >
            Doctor Availability
          </span>
          <span
            className="rounded-lg p-1 bg-gray-300 hover:bg-gray-400"
            style={{
              display: user_details.is_admin === true ? "block" : "none",
              fontSize: "0.9rem",
              fontWeight: "400",
              cursor: "pointer",
            }}
            onClick={() => setSelectedTab(2)}
          >
            Reception Desk
          </span>
          <span
            className="rounded-lg p-1 bg-gray-300 hover:bg-gray-400"
            style={{
              display: user_details.is_doctor ? "block" : "none",
              fontSize: "0.9rem",
              fontWeight: "400",
              cursor: "pointer",
            }}
            onClick={() => {
              setSelectedTab(3);
              getAvailableDoctors();
            }}
          >
            Doctor Panel
          </span>
          <span
            className="rounded-lg p-1 bg-gray-300 hover:bg-gray-400"
            style={{
              display:
                user_details.is_admin || user_details.is_accountant
                  ? "block"
                  : "none",
              fontSize: "0.9rem",
              fontWeight: "400",
              cursor: "pointer",
            }}
            onClick={() => setSelectedTab(4)}
          >
            Finance Panel
          </span>
          <span
            className="rounded-lg p-1 bg-gray-300 hover:bg-gray-400"
            style={{
              display: !user_details.is_patient ? "block" : "none",
              fontSize: "0.9rem",
              fontWeight: "400",
              cursor: "pointer",
            }}
            onClick={() => setSelectedTab(5)}
          >
            Medical Inventory
          </span>
          <span
            className="rounded-lg p-1 bg-gray-300 hover:bg-gray-400"
            style={{
              display: user_details.is_patient ? "block" : "none",
              fontSize: "0.9rem",
              fontWeight: "400",
              cursor: "pointer",
            }}
            onClick={() => setSelectedTab(6)}
          >
            Medical History
          </span>
        </div>
        <button
          onClick={() => Logout()}
          style={{
            fontSize: "0.9rem",
            fontWeight: "500",
          }}
          className="rounded-lg p-1 bg-gray-300 hover:bg-gray-400"
        >
          Logout
        </button>
      </div>
      {selectedTab === 0 ? (
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold mt-4">Welcome to Hospital</h1>
          <h1 className="text-xl font-bold mt-3">
            {user_details.is_admin && "Admin"}
            {user_details.is_doctor && "Doctor"}
            {user_details.is_accountant && "Accountant"}
            {user_details.is_nurse && "Nurse"}
            {user_details.is_pharmacist && "Pharmacist"}
            {user_details.is_laboratorist && "Laboratorist"}
            {user_details.is_patient && "Patient"}
          </h1>
          <h1 className="text-xl font-bold mt-2">{user_details.name}</h1>
          {!user_details.is_patient && (
            <div className="flex flex-row gap-1 mt-2 items-center">
              <button
                className="bg-blue-500 rounded-lg text-white p-2 w-70"
                onClick={() => {
                  setCheckInVisible(!checkInVisible);
                }}
              >
                New Check In
              </button>
              {checkInVisible && (
                <div className="flex flex-row gap-2 items-center">
                  <input
                    type="text"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="Purpose of Visit"
                    style={{
                      height: "40px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      padding: "4px",
                    }}
                  />
                  <button
                    className="bg-blue-500 rounded-lg text-white p-2 w-60 "
                    onClick={() => {
                      checkIn();
                    }}
                  >
                    Check In
                  </button>
                </div>
              )}
            </div>
          )}

          <div
            className="flex flex-col p-3 mt-3"
            style={{
              width: "50%",
              backgroundColor: "#f0f0f0",
              borderRadius: "10px",
              border: "1px solid #ccc",
              height: "60vh",
              overflowY: "scroll",
              scrollbarWidth: "thin",
              scrollbarColor: "#dfdfdf transparent",
              //rounded scrollbar
            }}
          >
            <h1
              className="text-xl font-bold mt-2"
              style={{
                textAlign: "center",
              }}
            >
              Hospital Visit Log
            </h1>
            <div
              className="flex flex-col"
              style={{
                width: "100%",
                marginTop: "10px",
              }}
            >
              {entryLog.map((log) => (
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
                    Check In Time:{" "}
                    {new Date(log?.check_in).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                  <span
                    style={{
                      fontSize: "1rem",
                      fontWeight: "500",
                    }}
                  >
                    Check Out Time:{" "}
                    {log?.check_out
                      ? new Date(log?.check_out).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : null}
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
                    Purpose: {log?.purpose}
                  </span>
                  <button
                    style={{
                      display:
                        !user_details.is_patient && !log.check_out
                          ? "block"
                          : "none",
                    }}
                    className="bg-blue-500 rounded-lg text-white p-2 w-80 mt-3"
                    onClick={() => checkOut(log._id)}
                  >
                    Check Out
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : selectedTab === 1 ? (
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold mt-5">Available Doctors</h1>
          <div
            className="flex flex-col p-3 mt-3"
            style={{
              width: "50%",
              backgroundColor: "#f0f0f0",
              borderRadius: "10px",
              border: "1px solid #ccc",
              height: "75vh",
              overflowY: "scroll",
              scrollbarWidth: "thin",
              scrollbarColor: "#dfdfdf transparent",
              //rounded scrollbar
            }}
          >
            {doctorsList.map((doctor) => (
              <div
                key={doctor._id}
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
                  Name: {doctor?.name}
                </span>
                <span
                  style={{
                    fontSize: "1rem",
                    fontWeight: "500",
                  }}
                >
                  Education: {doctor?.education}
                </span>

                <span
                  style={{
                    fontSize: "1rem",
                    fontWeight: "500",
                  }}
                >
                  Specialization: {doctor?.specialization}
                </span>
                <span
                  style={{
                    fontSize: "1rem",
                    fontWeight: "500",
                  }}
                >
                  Experience: {doctor?.experience}
                </span>
                <span
                  style={{
                    fontSize: "1rem",
                    fontWeight: "500",
                  }}
                >
                  Contact: {doctor?.phone}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : selectedTab === 2 ? (
        <Reception user_details={user_details} />
      ) : selectedTab === 3 ? (
        <Doctor user_details={user_details} />
      ) : selectedTab === 6 ? (
        <MedicalHistory user_details={user_details} />
      ) : null}
    </div>
  );
}

export default Dashboard;
