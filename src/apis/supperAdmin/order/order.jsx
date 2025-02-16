import axios from "@/axios"

export const getOrder = () =>
  axios({
    url: "/room-master/order",
    method: "get",
  })
export const getOrderById = (id) =>
  axios({
    url: `/room-master/order/${id}`,
    method: "get",
  })
export const downloadOrder = (type) =>
  axios({
    url: `/room-master/order/download`,
    method: "get",
    responseType: type,
  })
export const getOrderBillById = (id) =>
  axios({
    url: `/room-master/order/bill/${id}`,
    method: "get",
  })

export const updateOrAddOrder = (id, data) =>
  axios({
    method: "post",
    url: `/room-master/order/${id}`,
    data,
  })
export const sendbillOrder = (id) =>
  axios({
    method: "post",
    url: `/room-master/order/mail-payment/${id}`,
  })
export const updatePaymentOrder = (id, data) =>
  axios({
    method: "put",
    url: `/room-master/order/payment/${id}`,
    data,
  })
export const deleteOrderHouse = (id) =>
  axios({
    url: `/room-master/order/${id}`,
    method: "delete",
  })
