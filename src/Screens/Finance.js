import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { TailSpin } from "react-loader-spinner";
import { useCallback } from "react";
import { BASE_URL } from "../utils/constant";
import { Formik } from "formik";
import * as Yup from "yup";
function Finance({ user_details }) {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [medicalInventory, setMedicalInventory] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState();
  const [selectedDoctor, setSelectedDoctor] = useState();
  const [selectedPharmacist, setSelectedPharmacist] = useState();

  const [patientEmail, setPatientEmail] = useState("");
  const [doctorEmail, setDoctorEmail] = useState("");
  const [pharmacistEmail, setPharmacistEmail] = useState("");

  const getUserFromEmail = async ({ selected }) => {
    let email = "";
    if (selected === 0) {
      email = patientEmail;
    }
    if (selected === 1) {
      email = doctorEmail;
    }
    if (selected === 2) {
      email = pharmacistEmail;
    }

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
        if (selected === 0) {
          setSelectedPatient(data.data);
        }
        if (selected === 1) {
          setSelectedDoctor(data.data);
        }
        if (selected === 2) {
          setSelectedPharmacist(data.data);
        }

        //  console.log(data.data);
      } else {
        console.log("User not found");
        if (selected === 0) {
          setSelectedPatient(null);
        }
        if (selected === 1) {
          setSelectedDoctor(null);
        }
        if (selected === 2) {
          setSelectedPharmacist(null);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const BillSchema = Yup.object().shape({
    patient_id: Yup.string(),
    doctor_id: Yup.string(),
    pharmacist_id: Yup.string(),
    total_amount: Yup.number().required(),
    payment_status: Yup.string(),
    remarks: Yup.string(),
  });

  const getMedicalInventory = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/api/inventory/fetch-medicine-stock`,
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
        setMedicalInventory(data.data);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    getMedicalInventory();
  }, [getMedicalInventory]);

  const getBills = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/finance/fetch-bills`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });
      const data = await response.json();
      if (data.success) {
        setBills(data.data);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    getBills();
  }, [getBills]);

  const [selectedTab, setSelectedTab] = useState(0);

  const createBill = async (values) => {
    const userId = user_details?._id;
    if (!userId) {
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/finance/create-bill`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          patient_id: selectedPatient._id,
          doctor_id: selectedDoctor._id,
          pharmacist_id: selectedPharmacist._id,
          accountant_id: userId,
          total_amount: values.total_amount,
          payment_status: values.payment_status,
          remarks: values.remarks,
          medicines: selectedMedicine.map((medicine) => ({
            medicine_id: medicine.medicine_id,
            quantity: medicine.quantity,
          })),
        }),
      });
      const data = await response.json();
      if (data.success) {
        getBills();
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <div
      className="flex flex-col"
      style={{
        alignItems: "center",
      }}
    >
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
      <div className="flex flex-row p-2 gap-2">
        <div
          className={`p-2 cursor-pointer ${
            selectedTab === 0 ? "bg-blue-400" : "bg-blue-200"
          }`}
          onClick={() => setSelectedTab(0)}
        >
          All Bills
        </div>
        <div
          className={`p-2 cursor-pointer ${
            selectedTab === 1 ? "bg-blue-400" : "bg-blue-200"
          }`}
          onClick={() => setSelectedTab(1)}
        >
          Create Bill
        </div>
      </div>
      {selectedTab === 0 ? (
        <div className="flex flex-col overflow-y-scroll h-[75vh] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {bills?.map((bill) => (
            <div className="flex flex-col p-2 border-b border-gray-300">
              <div className="flex flex-row p-2 gap-2">
                <span className="font-bold">Patient Name:</span>{" "}
                {bill.patient_name}
              </div>
              <div className="flex flex-row p-2 gap-2">
                <span className="font-bold">Doctor Name:</span>{" "}
                {bill.doctor_name}
              </div>
              <div className="flex flex-row p-2 gap-2">
                <span className="font-bold">Pharmacist Name:</span>{" "}
                {bill.pharmacist_name}
              </div>
              <div className="flex flex-row p-2 gap-2">
                <span className="font-bold">Accountant Name:</span>{" "}
                {bill.accountant_name}
              </div>
              {bill.medicines.map((medicine) => (
                <div className="flex flex-row p-2 gap-2">
                  <span className="font-bold">Medicine Name:</span>{" "}
                  {medicine.medicine_name}{" "}
                  <span className="font-bold">Quantity:</span>{" "}
                  {medicine.quantity} <span className="font-bold">Price:</span>{" "}
                  {medicine.unit_price}
                </div>
              ))}
              <div className="flex flex-row p-2 gap-2">
                <span className="font-bold">Bill Amount:</span>{" "}
                {bill.total_amount}
              </div>
              <div className="flex flex-row p-2 gap-2">
                <span className="font-bold">Bill Status:</span>{" "}
                {bill.payment_status}
              </div>
              <div className="flex flex-row p-2 gap-2">
                <span className="font-bold">Billing Date:</span>{" "}
                {new Date(bill.date_of_billing).toDateString()}
              </div>
            </div>
          ))}
        </div>
      ) : selectedTab === 1 ? (
        <div className="flex flex-col p-6 gap-4">
          <Formik
            initialValues={{
              patient_id: selectedPatient ? selectedPatient._id : "",
              doctor_id: selectedDoctor ? selectedDoctor._id : "",
              pharmacist_id: selectedPharmacist ? selectedPharmacist._id : "",
              total_amount: "",
              payment_status: "",
              remarks: "",
            }}
            validationSchema={BillSchema}
            onSubmit={async (values) => {
              console.log(values);
              createBill(values);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
            }) => (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  type="text"
                  name="patient_id"
                  placeholder="Enter Patient Email"
                  value={patientEmail}
                  onChange={(e) => {
                    setPatientEmail(e.target.value);
                    getUserFromEmail({ selected: 0 });
                    if (selectedPatient) {
                      setFieldValue("patient_id", selectedPatient._id);
                    }
                  }}
                  className="p-2 border border-gray-300 rounded-md"
                />
                {selectedPatient ? (
                  <div className="text-sm text-gray-500">
                    Patient Name: {selectedPatient.name} Email:{" "}
                    {selectedPatient.email}
                  </div>
                ) : null}
                <input
                  type="text"
                  name="doctor_id"
                  placeholder="Enter Doctor Email"
                  value={doctorEmail}
                  onChange={(e) => {
                    setDoctorEmail(e.target.value);
                    getUserFromEmail({ selected: 1 });
                    if (selectedDoctor) {
                      setFieldValue("doctor_id", selectedDoctor._id);
                    }
                  }}
                  className="p-2 border border-gray-300 rounded-md"
                />
                {selectedDoctor ? (
                  <div className="text-sm text-gray-500">
                    Doctor Name: {selectedDoctor.name} Email:{" "}
                    {selectedDoctor.email}
                  </div>
                ) : null}
                <input
                  type="text"
                  name="pharmacist_id"
                  placeholder="Enter Pharmacist Email"
                  value={pharmacistEmail}
                  onChange={(e) => {
                    setPharmacistEmail(e.target.value);
                    getUserFromEmail({ selected: 2 });
                    if (selectedPharmacist) {
                      setFieldValue("pharmacist_id", selectedPharmacist._id);
                    }
                  }}
                  className="p-2 border border-gray-300 rounded-md"
                />
                {selectedPharmacist ? (
                  <div className="text-sm text-gray-500">
                    Pharmacist Name: {selectedPharmacist.name} Email:{" "}
                    {selectedPharmacist.email}
                  </div>
                ) : null}
                <div className="flex flex-col gap-2">
                  {medicalInventory.map((medicine) => (
                    <div className="flex flex-row gap-2 items-center">
                      <input
                        type="checkbox"
                        value={medicine._id}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedMedicine([
                              ...selectedMedicine,
                              {
                                medicine_id: medicine._id,
                                medicine_name: medicine.name,
                                quantity: 1,
                              },
                            ]);
                          } else {
                            setSelectedMedicine(
                              selectedMedicine.filter(
                                (med) => med.medicine_id !== medicine._id
                              )
                            );
                          }
                        }}
                        className="mr-2"
                      />
                      <div className="text-sm text-gray-500">
                        {medicine.name} Price: {medicine.price}
                      </div>
                    </div>
                  ))}
                </div>
                {selectedMedicine.map((medicine) => (
                  <div className="flex flex-row gap-2 items-center">
                    <div className="text-sm text-gray-500">
                      {medicine.medicine_name}
                    </div>
                    <input
                      type="number"
                      value={medicine.quantity}
                      onChange={(e) => {
                        const updatedMedicines = selectedMedicine.map((med) =>
                          med.medicine_id === medicine.medicine_id
                            ? { ...med, quantity: e.target.value }
                            : med
                        );
                        setSelectedMedicine(updatedMedicines);
                      }}
                      className="p-2 border border-gray-300 rounded-md w-20"
                    />
                  </div>
                ))}
                <input
                  type="number"
                  name="total_amount"
                  placeholder="Enter Total Amount"
                  value={values.total_amount}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="p-2 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  name="payment_status"
                  placeholder="Enter Payment Status"
                  value={values.payment_status}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="p-2 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  name="remarks"
                  placeholder="Enter Remarks"
                  value={values.remarks}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="p-2 border border-gray-300 rounded-md"
                />
                <button
                  type="submit"
                  onClick={() => {
                    console.log(values);
                    console.log(errors);
                    console.log(selectedDoctor);
                    console.log(selectedPatient);
                    console.log(selectedPharmacist);
                    console.log(selectedMedicine);
                  }}
                  className="p-2 bg-blue-500 text-white rounded-md mt-4"
                >
                  Create Bill
                </button>
              </form>
            )}
          </Formik>
        </div>
      ) : null}
    </div>
  );
}

export default Finance;
