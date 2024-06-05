import React, { useEffect } from "react";

import {  useNavigate } from "react-router-dom";
import { useAppSelectore } from "./services/hook";
interface PrivateRouteProps {
  children: React.ReactNode;

}

const PrivateRoute = ({children}:PrivateRouteProps) => {
  const navigate = useNavigate();

  const token = useAppSelectore(state=>state.auth.token)
  

  useEffect(() => {
    if (token === null) {
      navigate("/", { replace: true });
    }
  }, [token, navigate]);

  console.log("ok");
  
  if (!token) {
    return <p>Loading...</p>;
  }

  return children;
};

export default PrivateRoute;
