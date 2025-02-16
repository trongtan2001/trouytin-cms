import axios from "@/axios"

export const getCities = () =>
  axios({
    url: "/common/city",
    method: "get",
  })

export const getDistrictesByCityId = (id) =>
  axios({
    url: `/common/district?id_city=${id}`,
    method: "get",
  })

export const getWardesByDistrictId = (id) =>
  axios({
    url: `/common/ward?id_district=${id}`,
    method: "get",
  })



