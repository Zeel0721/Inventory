
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./auth/Login";
import SignUp from "./auth/Singup"; // Corrected typo
import AppBar from "./componets/AppBar"; // Corrected typo
import {ForgotPassword} from "./auth/ForgotPassword"; // Removed braces
import {ResetPassword} from "./auth/ResetPassword"; // Removed braces
import PrivateRoute from "./PrivateRoute";
import { useLayoutEffect, useState } from "react";
import { refreshToken } from "./functions/refreshToken";


const App = () => {
    
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  useLayoutEffect(() => {
    const checkToken = async () => {
      const sessionToken = sessionStorage.getItem("accessToken");
      const localToken = localStorage.getItem("accessToken");

      if (!sessionToken && localToken) {
        console.log("refreshing token");
        await refreshToken(navigate);
      } else if (!sessionToken && !localToken) {
        navigate('/');
      }
      setLoading(false);
    };

    checkToken();
  }, [navigate]);
  
  if(loading){
    return <div>Loading...</div>
  }


  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/resetpassword" element={<ResetPassword />} />
    <Route path="/dashboard" element={<PrivateRoute><AppBar/></PrivateRoute> }/>
       
    </Routes>
  );
};

export default App;
