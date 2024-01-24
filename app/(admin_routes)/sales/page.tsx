import GridView from "@components/GridView";
import SalesChart from "@components/SalesChart";
import { formatPrice } from "@utils/formatPrice";
import startDb from "@lib/db";
import OrderModel from "@models/orderModel";
import dateFormat from "dateformat";
import React from "react";

const tenDaysSalesHistory = async () => {
  // 10일을 계산
  const tenDaysAgo = new Date();
  tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
  // 10일간의 데이터를 fetch
  await startDb();
  const last10DaysSales: { _id: string; totalAmount: number }[] =
    await OrderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: tenDaysAgo },
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          totalAmount: { $sum: "$totalAmount" },
        },
      },
    ]);

  // saels 가격이 0인 날을 비교
  const dateList: string[] = [];
  for (let i = 0; i < 10; i++) {
    const date = new Date(tenDaysAgo);
    date.setDate(date.getDate() + i);
    dateList.push(date.toISOString().split("T")[0]);
  }

  const sales = dateList.map((date) => {
    // matchedSale 은 date 하나에 대해 find 를 함으로 한개의 {} 추출
    const matchedSales = last10DaysSales.find(
      (saleDay) => date === saleDay._id
    );
    return {
      day: dateFormat(date, "mm-dd"),
      sale: matchedSales ? matchedSales.totalAmount : 0,
    };
  });

  // return 해주지 않으며 error
  const totalSales = last10DaysSales.reduce((prevValue, current) => {
    return (prevValue += current.totalAmount);
  }, 0);

  return { sales, totalSales };
};

export default async function Sales() {
  const { sales, totalSales } = await tenDaysSalesHistory();
  return (
    <div>
      <GridView>
        <div className=" bg-blue-500 p-4 rounded space-y-4">
          <h1 className="font-semibold text-lg text-white">
            {formatPrice(totalSales)}
          </h1>
          <div className="text-white text-sm">
            <p>지난 10일간</p>
            <p>총매출액</p>
          </div>
        </div>
      </GridView>
      <div className="mt-10">
        <h1 className=" text-xl font-semibold pb-1">지난 10일간의 매출상황</h1>
        <SalesChart data={sales} />
      </div>
    </div>
  );
}
