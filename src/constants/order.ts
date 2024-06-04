export enum PaymentMethod {
  COD = "cod",
  MOMO = "momo",
  ZALO_PAY = "zalo_pay",
  VN_PAY = "vn_pay",
}

export const PaymentMethodOptions = {
  [PaymentMethod.COD]: "Cash on delivery",
  [PaymentMethod.MOMO]: "Momo",
  [PaymentMethod.ZALO_PAY]: "ZaloPay",
  [PaymentMethod.VN_PAY]: "VNPAY",
};

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  DELIVERING = "delivering",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export const OrderStatusChip: {
  [key in OrderStatus]: {
    label: string;
    color:
      | "default"
      | "primary"
      | "secondary"
      | "info"
      | "success"
      | "warning"
      | "error";
  };
} = {
  [OrderStatus.PENDING]: {
    label: "Pending",
    color: "info",
  },
  [OrderStatus.CONFIRMED]: {
    label: "Confirmed",
    color: "primary",
  },
  [OrderStatus.DELIVERING]: {
    label: "Delivering",
    color: "warning",
  },
  [OrderStatus.COMPLETED]: {
    label: "Completed",
    color: "success",
  },
  [OrderStatus.CANCELLED]: {
    label: "Cancelled",
    color: "error",
  },
};
