import React from "react";
import { useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { useCallback } from "react";
import { useEffect } from "react";
import { BASE_URL } from "../utils/constant";
import { Formik } from "formik";
import * as Yup from "yup";
function Doctor({ user_details }) {
  const [loading, setLoading] = useState(false);
  const [doctorLog, setDoctorLog] = useState([]);
  const [searchedUser, setSearchedUser] = useState();
  const [email, setEmail] = useState("");
  const [patientLog, setPatientLog] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [diagnosisForm, setDiagnosisForm] = useState(false);

  const diagnosisSchema = Yup.object().shape({
    diagnosis: Yup.string().required("Required"),
    prescription: Yup.string().required("Required"),
    follow_up_date: Yup.string(),
    remarks: Yup.string(),
  });

  const newDiagnosis = async (values) => {
    const patient_id = searchedUser?._id;
    if (!patient_id) {
      return;
    }
    try {
      const response = await fetch(
        `${BASE_URL}/api/diagnosis/create-patient-log/${patient_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
          body: JSON.stringify({
            diagnosis: values.diagnosis,
            prescription: values.prescription,
            follow_up_date: values.follow_up_date,
            remarks: values.remarks,
          }),
        }
      );
      const data = await response.json();
      if (data.success) {
        console.log(data.data);
        getMedicalHistory();
        setDiagnosisForm(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getMedicalHistory = useCallback(async () => {
    setLoading(true);
    const user_id = searchedUser?._id;
    // console.log(user_details);
    console.log("from here", user_id);
    if (!user_id) {
      return;
    }
    try {
      const response = await fetch(
        `${BASE_URL}/api/diagnosis/fetch-patient-log/${user_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setPatientLog(data.data);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }, [searchedUser]);

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
        setSearchedUser();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getDoctorLog = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `${BASE_URL}/api/diagnosis/fetch-log-doctor`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setDoctorLog(data.data);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }, []);
  useEffect(() => {
    getDoctorLog();
  }, [getDoctorLog]);
  return (
    <div className="flex flex-col">
      <TailSpin
        visible={loading}
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
      <div className="flex flex-row gap-2 p-3">
        <button
          className="btn btn-primary rounded-lg p-2 text-white"
          style={{ backgroundColor: selectedTab === 0 ? "blue" : "#63a0e9" }}
          onClick={() => setSelectedTab(0)}
        >
          Doctor Log
        </button>
        <button
          className="btn btn-primary rounded-lg p-2 text-white"
          style={{ backgroundColor: selectedTab === 1 ? "blue" : "#63a0e9" }}
          onClick={() => setSelectedTab(1)}
        >
          Search Patient
        </button>
      </div>
      {selectedTab === 0 ? (
        <div className="flex flex-col p-4">
          <h1 className="text-xl font-bold">Doctor Log</h1>
          <table className="table-auto">
            <thead>
              <tr>
                <th className="border px-4 py-2">Patient Name</th>
                <th className="border px-4 py-2">Diagnosis</th>
                <th className="border px-4 py-2">Prescription</th>
                <th className="border px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {doctorLog.map((log) => (
                <tr key={log._id}>
                  <td className="border px-4 py-2">{log.patient_name}</td>
                  <td className="border px-4 py-2">{log.diagnosis}</td>
                  <td className="border px-4 py-2">{log.prescription}</td>
                  <td className="border px-4 py-2">
                    {new Date(log?.date_of_visit).toLocaleDateString("en-US")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : selectedTab === 1 ? (
        <div className="flex flex-row gap-2">
          <div className="flex flex-col p-4" style={{ width: "45%" }}>
            <h1 className="text-xl font-bold ">Search Patient</h1>
            <input
              type="email"
              placeholder="Enter Patient Email"
              className="border p-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
              onClick={() => {
                console.log(email);
                getUserFromEmail();
              }}
            >
              Search
            </button>
            {searchedUser && (
              <div className="mt-2 flex flex-col">
                <h1 className="text-xl font-bold">Patient Details</h1>
                <p>
                  <span className="font-bold">Name:</span> {searchedUser.name}
                </p>
                <p>
                  <span className="font-bold">Email:</span> {searchedUser.email}
                </p>
                <p>
                  <span className="font-bold">Phone:</span> {searchedUser.phone}
                </p>
                <p>
                  <span className="font-bold">Address:</span>{" "}
                  {searchedUser.address}
                </p>
                <button
                  className="btn btn-primary mt-2"
                  onClick={() => {
                    getMedicalHistory();
                  }}
                >
                  View Patient Log
                </button>
                {patientLog && (
                  <div className="flex flex-col mt-2">
                    <h1 className="text-xl font-bold">Patient Log</h1>
                    <table className="table-auto">
                      <thead>
                        <tr>
                          <th className="border px-4 py-2">Diagnosis</th>
                          <th className="border px-4 py-2">Prescription</th>
                          <th className="border px-4 py-2">Doctor</th>
                          <th className="border px-4 py-2">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {patientLog.map((log) => (
                          <tr key={log._id}>
                            <td className="border px-4 py-2">
                              {log.diagnosis}
                            </td>

                            <td className="border px-4 py-2">
                              {log.prescription}
                            </td>
                            <td className="border px-4 py-2">
                              {log.doctor_name}
                            </td>
                            <td className="border px-4 py-2">
                              {new Date(log?.date_of_visit).toLocaleDateString(
                                "en-US"
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
          {searchedUser ? (
            <div className="flex flex-col p-4" style={{ width: "45%" }}>
              <button
                className="text-xl font-bold rounded-lg p-2 text-white"
                style={{
                  backgroundColor: "#63a0e9",
                }}
                onClick={() => {
                  console.log(searchedUser);
                  setDiagnosisForm(!diagnosisForm);
                }}
              >
                {" "}
                Add New Diagnosis
              </button>
              {diagnosisForm && (
                <Formik
                  initialValues={{
                    diagnosis: "",
                    prescription: "",
                    follow_up_date: "",
                    remarks: "",
                  }}
                  validationSchema={diagnosisSchema}
                  onSubmit={(values) => {
                    console.log(values);
                    newDiagnosis(values);
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
                    <form onSubmit={handleSubmit}>
                      <div className="flex flex-col gap-2">
                        <input
                          type="text"
                          name="diagnosis"
                          placeholder="Diagnosis"
                          value={values.diagnosis}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="border p-2"
                        />
                        {errors.diagnosis && touched.diagnosis && (
                          <p className="text-red-500">{errors.diagnosis}</p>
                        )}
                        <input
                          type="text"
                          name="prescription"
                          placeholder="Prescription"
                          value={values.prescription}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="border p-2"
                        />
                        {errors.prescription && touched.prescription && (
                          <p className="text-red-500">{errors.prescription}</p>
                        )}
                        <input
                          type="date"
                          name="follow_up_date"
                          placeholder="Follow Up Date"
                          value={values.follow_up_date}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="border p-2"
                        />
                        {errors.follow_up_date && touched.follow_up_date && (
                          <p className="text-red-500">
                            {errors.follow_up_date}
                          </p>
                        )}
                        <input
                          type="text"
                          name="remarks"
                          placeholder="Remarks"
                          value={values.remarks}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="border p-2"
                        />
                        {errors.remarks && touched.remarks && (
                          <p className="text-red-500">{errors.remarks}</p>
                        )}
                        <button
                          type="submit"
                          className="text-xl font-bold rounded-lg p-2 text-white"
                          style={{
                            backgroundColor: "#63a0e9",
                          }}
                        >
                          Submit
                        </button>
                      </div>
                    </form>
                  )}
                </Formik>
              )}
            </div>
          ) : (
            <div className="flex flex-col p-4" style={{ width: "45%" }}>
              <h1 className="text-xl font-bold">Search Patient</h1>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default Doctor;
