import React from "react";
import { TailSpin } from "react-loader-spinner";
import { useEffect } from "react";
import { useCallback } from "react";
import { useState } from "react";
import { BASE_URL } from "../utils/constant";
import { Formik } from "formik";
import * as Yup from "yup";
function MedicalInventory({ user_details }) {
  const [medicalInventory, setMedicalInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [changed, setChanged] = useState(false);
  const [showAddInventory, setShowAddInventory] = useState(false);

  const CreateMedicineSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    manufacturer: Yup.string().required("Required"),
    quantity: Yup.number().required("Required"),
    price: Yup.number().required("Required"),
    description: Yup.string(),
    expiry_date: Yup.date().required("Required"),
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

  const updateInventory = useCallback(
    async ({ inventory_id, index }) => {
      setLoading(true);
      try {
        const response = await fetch(
          `${BASE_URL}/api/inventory/update-medicine-stock/${inventory_id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "auth-token": localStorage.getItem("token"),
            },
            body: JSON.stringify({
              quantity: medicalInventory[index].quantity,
              price: medicalInventory[index].price,
            }),
          }
        );
        const data = await response.json();
        if (data.success) {
          setChanged(false);
          getMedicalInventory();
        }
      } catch (error) {
        console.log(error);
      }
    },
    [getMedicalInventory, medicalInventory]
  );

  useEffect(() => {
    getMedicalInventory();
  }, [getMedicalInventory]);

  const addMedicine = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/api/inventory/create-medicine-stock`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
          body: JSON.stringify(values),
        }
      );
      const data = await response.json();
      if (data.success) {
        getMedicalInventory();
        setShowAddInventory(false);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

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
      <h1
        className="text-3xl font-bold"
        style={{
          textAlign: "center",
        }}
      >
        Medical Inventory
      </h1>
      <div
        className="flex flex-col mt-5 p-4 item-center"
        style={{
          width: "80%",
          alignItems: "center",
        }}
      >
        <table className="table-auto">
          <thead>
            <tr>
              <th className="border px-4 py-2">Medicine Name</th>
              <th className="border px-4 py-2">Manufacturer</th>
              <th className="border px-4 py-2">Quantity</th>
              <th className="border px-4 py-2">Price</th>
              <th className="border px-4 py-2">Expiry Date</th>
              <th className="border px-4 py-2">Last Updated</th>
              {(user_details.is_admin || user_details.is_pharmacist) && (
                <th className="border px-4 py-2">Action</th>
              )}
            </tr>
          </thead>
          <tbody>
            {medicalInventory.map((item, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{item.name}</td>
                <td className="border px-4 py-2">{item.manufacturer}</td>
                <td className="border px-4 py-2">
                  <input
                    type="number"
                    value={medicalInventory[index].quantity}
                    onChange={(e) => {
                      const newInventory = [...medicalInventory];
                      newInventory[index].quantity = e.target.value;
                      setMedicalInventory(newInventory);
                      setChanged(true);
                    }}
                    disabled={
                      !(user_details.is_admin || user_details.is_pharmacist)
                    }
                  />
                </td>
                <td className="border px-4 py-2">
                  <input
                    type="number"
                    value={medicalInventory[index].price}
                    onChange={(e) => {
                      const newInventory = [...medicalInventory];
                      newInventory[index].price = e.target.value;
                      setMedicalInventory(newInventory);
                      setChanged(true);
                    }}
                    disabled={
                      !(user_details.is_admin || user_details.is_pharmacist)
                    }
                  />
                </td>
                <td className="border px-4 py-2">{item.expiry_date}</td>
                <td className="border px-4 py-2">
                  {" "}
                  {new Date(item?.date_updated).toLocaleDateString("en-US")}
                </td>
                {(user_details.is_admin || user_details.is_pharmacist) && (
                  <td className="border px-4 py-2">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      disabled={!changed}
                      onClick={() => {
                        updateInventory({
                          inventory_id: item._id,
                          index,
                        });
                      }}
                    >
                      Update
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={() => setShowAddInventory(!showAddInventory)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5"
          style={{
            width: "30%",
            display:
              user_details.is_admin || user_details.is_pharmacist
                ? "block"
                : "none",
          }}
        >
          Add Medicine
        </button>
        {showAddInventory && (
          <Formik
            initialValues={{
              name: "",
              manufacturer: "",
              quantity: "",
              price: "",
              description: "",
              expiry_date: "",
            }}
            validationSchema={CreateMedicineSchema}
            onSubmit={async (values) => {
              console.log(values);
              addMedicine(values);
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
                onSubmit={handleSubmit}
                className="flex flex-col items-center"
              >
                <input
                  type="text"
                  name="name"
                  placeholder="Medicine Name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="border px-4 py-2 mt-2"
                />
                {errors.name && touched.name && (
                  <div className="text-red-500">{errors.name}</div>
                )}
                <input
                  type="text"
                  name="manufacturer"
                  placeholder="Manufacturer"
                  value={values.manufacturer}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="border px-4 py-2 mt-2"
                />
                {errors.manufacturer && touched.manufacturer && (
                  <div className="text-red-500">{errors.manufacturer}</div>
                )}
                <input
                  type="number"
                  name="quantity"
                  placeholder="Quantity"
                  value={values.quantity}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="border px-4 py-2 mt-2"
                />
                {errors.quantity && touched.quantity && (
                  <div className="text-red-500">{errors.quantity}</div>
                )}
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={values.price}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="border px-4 py-2 mt-2"
                />
                {errors.price && touched.price && (
                  <div className="text-red-500">{errors.price}</div>
                )}
                <input
                  type="text"
                  name="description"
                  placeholder="Description"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="border px-4 py-2 mt-2"
                />
                <input
                  type="date"
                  name="expiry_date"
                  placeholder="Expiry Date"
                  value={values.expiry_date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="border px-4 py-2 mt-2"
                />
                {errors.expiry_date && touched.expiry_date && (
                  <div className="text-red-500">{errors.expiry_date}</div>
                )}
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
                >
                  Add Medicine
                </button>
              </form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
}

export default MedicalInventory;
