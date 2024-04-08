import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { BASE_URL } from "../utils/constant";
import { useNavigate } from "react-router-dom";
import bg from "../assests/depositphotos_4756704-stock-photo-modern-hospital-building-front-emergency.jpg";
function Login() {
  const navigate = useNavigate();
  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required("Required"),
    password: Yup.string().required("Required"),
  });
  const login = async (values) => {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem("token", data.authtoken);
        navigate("/");
      }
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div
      className="flex flex-col items-center"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        width: "100vw",
        backdropFilter: "blur(5px)",
        color: "white",
      }}
    >
      <h1 className="text-3xl font-bold">Hospital Management System</h1>
      <div className="flex flex-col items-center mt-10">
        <h2 className="text-2xl font-bold">User Login</h2>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            console.log(values);
            login(values);
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
            >
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
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 w-80 mt-5"
              >
                Login
              </button>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default Login;
