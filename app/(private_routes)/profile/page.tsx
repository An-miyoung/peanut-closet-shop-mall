// import ProfileForm from "@components/ProfileForm";
import React from "react";
import EmailVerificationBanner from "@components/EmailVerificationBanner";
import Link from "next/link";
// import OrderModel from "@models/orderModel";
// import OrderListPublic, { Orders } from "@components/OrderListPublic";
import { PageNotFound } from "@components/404";
import ProfileForm from "@components/ProfileForm";
import { fetchUserProfile } from "@fetchData/fetchUserProfile";

// const fetchLatestOrders = async () => {
//   const session = await getServerSession(authConfig);
//   if (!session?.user) return null;

//   const email = session.user.email;
//   await startDb();
//   const orders = await OrderModel.find({ email }).sort("-createdAt").limit(1);
//   if (!orders) return null;

//   object 가 1개인 [] 가 return 됨으로 map 을 돌아야 한다.
//   const result: Orders[] = orders.map((order) => ({
//     id: order._id.toString(),
//     paymentStatus: order.paymentStatus,
//     date: order.createdAt.toString(),
//     total: order.totalAmount,
//     deliveryStatus: order.deliveryStatus,
//     products: order.orderItems,
//   }));
//   return JSON.stringify(result);
// };

export default async function Profile() {
  const profile = await fetchUserProfile();
  if (!profile) return <PageNotFound />;

  const { id, name, email, avatar, verified } = profile;

  // const ordersString = await fetchLatestOrders();
  // if (!ordersString) return <PageNotFound />;

  // const order = JSON.parse(ordersString);

  return (
    <div>
      {!verified && <EmailVerificationBanner id={id} verified={verified} />}
      <div className="p-2 md:flex md:p-4 space-y-4">
        <div className="md:border-r md:border-gray-700 p-2 space-y-2 md:p-4 md:space-y-4">
          <ProfileForm avatar={avatar} email={email} id={id} name={name} />
        </div>

        <div className="md:p-4 flex-1">
          <div className="flex items-baseline justify-between ">
            <h1 className="text-xl md:text-2xl text-blue-gray-800  font-semibold opacity-70 mb-2 md:mb-4 ">
              최근 주문내역
            </h1>
            <Link
              href="/profile/orders"
              className="text-blue-gray-500 hover:underline "
            >
              주문내역 모두보기
            </Link>
          </div>
          {/* <div className="p-0">
            <OrderListPublic orders={order} />
          </div> */}
        </div>
      </div>
    </div>
  );
}
