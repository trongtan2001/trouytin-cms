import instance from "@/axios"

export const getListRoom = () =>
    instance({
        url: "/room-master/room",
        method: "get",
    })
export const getRoomById = (id) =>
    instance({
        url: `/room-master/room/${id}`,
        method: "get",
    })
export const getServiceRoomById = (id) =>
    instance({
        url: `/room-master/room/service-room/${id}`,
        method: "get",
    })

export const addRoom = (data) =>
    instance({
        method: "post",
        url: `/room-master/room`,
        data,
    })
export const updateRoom = (id, data) =>
    instance({
        method: "put",
        url: `/room-master/room/${id}`,
        data,
    })
export const deleteRoom = (id) =>
    instance({
        url: `/room-master/room/${id}`,
        method: "delete",
    })
