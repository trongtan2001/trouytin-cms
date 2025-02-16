import axios from "axios"
import axiosConfig from "@/axios"

export const apiGetProvinces = () =>
  axios({
    url: "https://provinces.open-api.vn/api/p/",
    method: "get",
  })
export const apiGetProvince = (provinceCode) =>
  axios({
    url: `https://provinces.open-api.vn/api/p/${provinceCode}?depth=3`,
    method: "get",
  })
export const apiUploadImageCloudinary = (data) =>
  axios({
    method: "post",
    url: `https://api.cloudinary.com/v1_1/${
      import.meta.env.VITE_CLOUDINARY_NAME
    }/image/upload`,
    data,
  })
export const apiGetLngLatFromAddress = (params) =>
  axios({
    method: "get",
    url: `https://api.geoapify.com/v1/geocode/search`,
    params,
  })
export const apiGetPostTypes = () =>
  axiosConfig({
    method: "get",
    url: `/postType/getAll`,
  })
export const apiGetTopProvince = (params) =>
  axiosConfig({
    method: "get",
    url: `/guest/post/top-province`,
    params,
  })
