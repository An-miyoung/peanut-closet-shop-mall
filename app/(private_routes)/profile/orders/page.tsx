import OrderListPublic, { Orders } from "@components/OrderListPublic";
import startDb from "@lib/db";
import OrderModel from "@models/orderModel";
import { authConfig } from "@/auth";
import { getServerSession } from "next-auth";
import React from "react";
import { PageNotFound } from "@components/404";
import UserModel from "@models/userModel";
import EmptyPage from "@/app/components/EmptyPage";

const fetchOrders = async () => {
  const session = await getServerSession(authConfig);
  if (!session?.user) return null;

  await startDb();
  const user = await UserModel.findOne({ email: session.user.email });
  if (!user) return null;

  const orders = await OrderModel.find({ userId: user.id }).sort("-createdAt");
  if (!orders) return null;

  const results: Orders[] = orders.map((order) => ({
    id: order._id.toString(),
    paymentStatus: order.paymentStatus,
    date: order.createdAt.toString(),
    total: order.totalAmount,
    deliveryStatus: order.deliveryStatus,
    products: order.orderItems,
  }));
  return JSON.stringify(results);
};

export default async function OrdersPage() {
  const orders = await fetchOrders();
  if (!orders) return <PageNotFound />;

  if (orders.length === 0) return <EmptyPage title="주문내역" />;

  return (
    <div>
      <OrderListPublic orders={JSON.parse(orders)} />
    </div>
  );
}
