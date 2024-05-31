import { useEffect, useState } from "react";
import { useGetAllOrderlistQuery } from "../services/Orderlist";
import { useGetAllProductsQuery } from "../services/Productlist";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const Dashboard = () => {
  const { data: orders, isLoading: orderLoading } = useGetAllOrderlistQuery({});
  const { data: products, isLoading: productLoading } = useGetAllProductsQuery(
    {}
  );

  const [totalOrderQuantity, setTotalOrderQuantity] = useState(0);
  const [totalProductQuantity, setTotalProductQuantity] = useState(0);

  useEffect(() => {
    if (orders) {
      const totalOrder = orders.reduce((sum: any, order: any) => {
        const orderTotal = order.orderdetail.reduce(
          (orderSum: any, item: any) => orderSum + item.quantity,
          0
        );
        return sum + orderTotal;
      }, 0);
      setTotalOrderQuantity(totalOrder);
    }
  }, [orders]);

  useEffect(() => {
    if (products) {
      const totalProduct = products.reduce(
        (sum: any, product: any) => sum + product.quantity,
        0
      );
      setTotalProductQuantity(totalProduct);
    }
  }, [products]);

  if (orderLoading || productLoading)
    return (
      <Spin
        className="h-full flex justify-center items-center"
        indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
      />
    );

  return (
    <div className="p-3 flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
      <button className="bg-blue-500 text-white py-2 px-4 rounded">
        Total Product Quantity: {totalProductQuantity}
      </button>
      <button className="bg-blue-500 text-white py-2 px-4 rounded">
        Total Order Quantity: {totalOrderQuantity}
      </button>
    </div>
  );
};

export default Dashboard;
