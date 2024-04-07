import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constant";
import { TailSpin } from "react-loader-spinner";
import { useCallback } from "react";
function MedicalHistory({ user_details }) {
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const getMedicalHistory = useCallback(async () => {
    setLoading(true);
    const user_id = user_details?._id;
    console.log(user_details);
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
        setMedicalHistory(data.data);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }, [user_details]);
  useEffect(() => {
    getMedicalHistory();
  }, [getMedicalHistory]);
  return (
    <div className="flex flex-col items-center">
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
      <h1 className="text-2xl font-bold mt-5">Medical History</h1>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5"
        onClick={() => {
          getMedicalHistory();
        }}
      >
        Refresh
      </button>
      <div
        className="flex flex-row items-center mt-2"
        style={{ justifyContent: "space-between", width: "76%" }}
      >
        <span className="font-bold">{user_details?.name}</span>
        <span className="font-bold ml-5">{user_details?.city}</span>
      </div>
      {medicalHistory.length > 0 ? (
        <table className="table-auto mt-5">
          <thead>
            <tr>
              <th className="px-4 py-2">S.No</th>
              <th className="px-4 py-2">Diagnosis</th>
              <th className="px-4 py-2">Prescription</th>
              <th className="px-4 py-2">Doctor Name</th>
              <th className="px-4 py-2">Remarks</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Time</th>
              <th className="px-4 py-2">Follow Up Date</th>
            </tr>
          </thead>
          <tbody>
            {medicalHistory.map((history, index) => (
              <tr key={history._id}>
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{history.diagnosis}</td>
                <td className="border px-4 py-2">{history.prescription}</td>
                <td className="border px-4 py-2">{history.doctor_name}</td>
                <td className="border px-4 py-2">{history.remarks}</td>
                <td className="border px-4 py-2">
                  {new Date(history?.date_of_visit).toLocaleDateString("en-US")}
                </td>
                <td className="border px-4 py-2">
                  {new Date(history?.date_of_visit).toLocaleTimeString(
                    "en-US",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    }
                  )}
                </td>
                <td className="border px-4 py-2">
                  {new Date(history?.follow_up_date).toLocaleDateString(
                    "en-GB"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <h1 className="text-xl mt-5">No Medical History Found</h1>
      )}
    </div>
  );
}

export default MedicalHistory;
