import {jwtDecode} from "jwt-decode";

export const TokenValidate = (token: string | null) => {

   
    if (!token) {
    return false;
  }
  try {
    const decodedToken = jwtDecode(token);

    if (!decodedToken.exp) {
      return false; // Token is invalid if it doesn't have an exp field
    }
    const currentTime = Date.now() / 1000;
    console.log(decodedToken.exp < currentTime);
    
    return decodedToken.exp > currentTime; // Token is valid if exp is in the future
  } catch (error) {
    console.error("Failed to decode token", error);
    return false; // Token is invalid if decoding fails
  }
};
