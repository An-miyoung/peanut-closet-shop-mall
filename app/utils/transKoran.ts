export const deleveryStatusToKorean = (status: string) => {
  switch (status) {
    case "ordered":
      return "주문완료";
    case "shipped":
      return "배송중";
    case "delivered":
      return "배송완료";
    default:
      return "주문완료";
  }
};

export const paymentStatusToKorean = (status: string) => {
  switch (status) {
    case "paid":
      return "결제완료";
    case "unpaid":
      return "결제미완료";
    case "no_payment_required":
      return "결제대기중";
    default:
      return "결제미완료";
  }
};
