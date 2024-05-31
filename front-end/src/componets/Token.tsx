import { useEffect } from "react";
import { refreshToken } from "../functions/refreshToken";
import { useGetAllProductsQuery } from "../services/Productlist";
import { useGetAllOrderlistQuery } from "../services/Orderlist";
import { useNavigate } from "react-router-dom";

export default function Token() {
  const { refetch: orderRefetch } = useGetAllOrderlistQuery({});
  const { refetch: productRefetch } = useGetAllProductsQuery({});
  const navigate = useNavigate();
  useEffect(() => {
    const setupTokenRefresh = async () => {
      await refreshToken(orderRefetch, productRefetch, navigate);
      const intervalId = setInterval(async () => {
        await refreshToken(orderRefetch, productRefetch, navigate);
      }, 14 * 60 * 1000);
      return () => clearInterval(intervalId);
    };
    setupTokenRefresh();
  }, []);
  return null;
}
