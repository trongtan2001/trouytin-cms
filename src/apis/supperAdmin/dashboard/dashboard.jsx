import axios from "@/axios"

export const getHouseStatus = () =>
    axios({
        url: "/room-master/house/status",
        method: "get",
    })
export const getRoomStatus = () =>
    axios({
        url: `/room-master/room/status`,
        method: "get",
    })
export const getRoomStatusPayment = () =>
    axios({
        url: `/room-master/room/statusPayment`,
        method: "get",
    })
export const getOrderStatus = () =>
    axios({
        url: `/room-master/order/status`,
        method: "get",
    })
