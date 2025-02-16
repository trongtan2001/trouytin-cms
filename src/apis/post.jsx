import axios from "@/axios"


export const apiGetPostRecent = (latitude, longitude) =>
  axios({
    url: "/guest/post/location",
    method: "get",
    params: { latitude, longitude },
  })

export const apiGetPostOrderByPriceDesc = (params) =>
  axios({
    url: "/guest/post/sorted/price",
    method: "get",
    params,
  })

export const apiGetPostOrderByAcreageDesc = (params) =>
  axios({
    url: "/guest/post/sorted/acreage",
    method: "get",
    params,
  })  

export const apiCreateNewPost = (data) =>
  axios({
    url: "/post/new",
    method: "post",
    data,
  })
export const apiGetPosts = (data) =>
  axios({
    url: "/guest/post/filters",
    method: "post",
    data,
  })
export const apiGetPostsByRating = (params) =>
  axios({
    url: "/guest/list-post-by-rating",
    method: "get",
    params,
  })

export const apiGetDetailPost = (params) =>
  axios({
    url: "/guest/postDetail",
    method: "get",
    params,
  })
export const apiRatings = (data) =>
  axios({
    url: "/rating/new",
    method: "post",
    data,
  })
export const apiGetRatings = (params) =>
  axios({
    url: "/rating/list/group",
    method: "get",
    params,
  })
export const apiDeletePost = (params) =>
  axios({
    url: "/post/delete",
    method: "delete",
    params,
  })
export const apiUpdateApprovedPost = (params) =>
  axios({
    url: "/admin/setIsApprovedPost",
    method: "patch",
    params,
  })
export const apiUpdateRejectedPost = (params) =>
  axios({
    url: "/admin/setIsRejectedPost",
    method: "patch",
    params,
  })