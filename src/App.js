// import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Screens/Login";
import Dashboard from "./Screens/Dashboard";
function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/login" element={<Login/>} />
        <Route exact path="/" element={<Dashboard/>} />
        {/* <Route exact path="/signup" element={<Signup />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
