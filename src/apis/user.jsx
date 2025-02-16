import axios from "@/axios"

export const apiRegister = (data) =>
  axios({
    url: "/auth/registration",
    method: "post",
    data,
  })
export const apiVerifyOtp = (data) =>
  axios({
    url: "/auth/verification-otp",
    method: "post",
    data,
  })
export const apiLogin = (data) =>
  axios({
    url: "/auth/authenticate",
    method: "post",
    data,
  })
export const apiGetCurrent = () =>
  axios({
    url: "/user/view-profile",
    method: "get",
  })
export const apiUpdateProfile = (data) =>
  axios({
    url: "/user/update-profile",
    method: "post",
    data,
  })
export const apiAddWishlist = (params) =>
  axios({
    url: "/wishlist/add",
    method: "post",
    params,
  })
export const apiGetWishlist = (params) =>
  axios({
    url: "/wishlist/get",
    method: "get",
    params,
  })
export const apiRemoveWishlist = (id) =>
  axios({
    url: "/wishlist/delete/wishListItem/" + id,
    method: "delete",
  })
export const apiVerifyRole = (data) =>
  axios({
    url: "/user/sendOTP",
    method: "post",
    data,
  })
export const apiUpgradeRole = (data) =>
  axios({
    url: "/user/up-to-role-manage",
    method: "post",
    data,
  })
export const apiChangePhone = (data) =>
  axios({
    url: "/user/update-phonenumber",
    method: "post",
    data,
  })
export const apiChangePassword = (data) =>
  axios({
    url: "/user/update-password",
    method: "patch",
    data,
  })
export const apiGetUsersByAdmin = (params) =>
  axios({
    url: "/admin/user/getAll",
    method: "get",
    params,
  })
export const apiGetUsersDeletedByAdmin = (params) =>
  axios({
    url: "/admin/user/getAllByDeleted",
    method: "get",
    params,
  })
export const apiGetUserByRole = (params) =>
  axios({
    url: "/admin/user/by-role-name",
    method: "get",
    params,
  })
export const apiDeleteUser = (params) =>
  axios({
    url: "/admin/user/delete",
    method: "delete",
    params,
  })
export const apiGetRoleAdmin = () =>
  axios({
    url: "/admin/role/getAll",
    method: "get",
  })
export const apiValidManager = () =>
  axios({
    url: "/user/service/valid-ulti-manager",
    method: "get",
  })
