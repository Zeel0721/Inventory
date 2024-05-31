import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./auth/Login";
import store from "./app/store";
import SignUp from "./auth/Singup";
import AppBar from "./componets/AppBar";
import { ForgotPassword } from "./auth/ForgotPassword";
import { ResetPassword } from "./auth/ResetPassword";

const PrivateRoute = () => {
  const accessToken = sessionStorage.getItem("accessToken");
  if (!accessToken) {
    return <Navigate to="/" replace />;
  }
  return <AppBar />;
};

const root = document.getElementById("root") as HTMLElement;
// @ts-ignore
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<PrivateRoute />} />
        </Routes>
      </Router>
    </Provider>
  </React.StrictMode>
);
