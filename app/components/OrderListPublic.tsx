"use client";
import Image from "next/image";
import React from "react";
import dateFormat from "dateformat";
import { Chip } from "@material-tailwind/react";
import { rgbDataURL } from "@utils/blurDataUrl";
import {
  deleveryStatusToKorean,
  paymentStatusToKorean,
} from "@utils/transKoran";
import EmptyPage from "./EmptyPage";

type product = {
  id: string;
  title: string;
  thumbnail: string;
  totalPrice: number;
  price: number;
  quantity: number;
};

export interface Orders {
  id: any;
  products: product[];
  paymentStatus: string;
  date: string;
  total: number;
  deliveryStatus: "ordered" | "delivered" | "shipped";
}

export default function OrderListPublic({ orders }: { orders: Orders[] }) {
  return (
    <>
      <div>{orders.length === 0 && <EmptyPage title="주문내역" />}</div>
      <div>
        {orders.map((order) => {
          return (
            <div key={order.id} className="py-4 space-y-4">
              <div className="flex justify-between items-center bg-blue-gray-400 text-white p-2">
                <p>주문시각: {dateFormat(order.date, "yyyy-mm-dd, HH:MM")}</p>
                <p>총금액: {order.total.toLocaleString()}원</p>
                <Chip
                  value={paymentStatusToKorean(order.paymentStatus)}
                  color="amber"
                />
              </div>

              {order.products.map((p) => {
                return (
                  <div key={p.id} className="flex space-x-2">
                    <Image
                      src={p.thumbnail}
                      width={50}
                      height={50}
                      alt={p.title}
                      priority
                      style={{ width: "50px", height: "auto" }}
                      placeholder="blur"
                      blurDataURL={rgbDataURL(128, 138, 156)}
                    />
                    <div>
                      <p>{p.title}</p>
                      <div className="flex space-x-2 text-sm">
                        <p>{p.quantity}개</p>
                        <p>X</p>
                        <p>{p.price.toLocaleString()}원</p>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="text-right p-2 border-t border-b">
                <p>
                  주문진행상태:{" "}
                  <span className="font-semibold uppercase">
                    {deleveryStatusToKorean(order.deliveryStatus)}
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
