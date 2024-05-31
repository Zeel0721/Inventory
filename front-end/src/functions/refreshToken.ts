import { message } from "antd";
import axios from "axios";

export async function refreshToken(
  orderRefetch: any,
  productRefetch: any,
  navigate: any
) {
  await axios
    .get("http://localhost:3000/auth/refresh", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
      },
    })
    .then((value) => {
      localStorage.setItem("refreshToken", value.data.refreshToken);
      sessionStorage.setItem("accessToken", value.data.accessToken);
      orderRefetch();
      productRefetch();
    })
    .catch(() => {
      message.error("Session timeout login again");
      localStorage.clear();
      sessionStorage.clear();
      navigate("/");
    });
}
