import { apiGetProvinces, apiGetTopProvince } from "@/apis/app"
import { apiGetCurrent, apiGetWishlist } from "@/apis/user"
import { createAsyncThunk } from "@reduxjs/toolkit"

export const getCurrent = createAsyncThunk(
  "user/current",
  async (data, { rejectWithValue }) => {
    const response = await apiGetCurrent()
    if (!response) return rejectWithValue(response)
    return response
  }
)
export const getProvinces = createAsyncThunk(
  "app/provinces",
  async (data, { rejectWithValue }) => {
    const response = await apiGetProvinces()
    if (!response.status === 200) return rejectWithValue(response)
    return response.data || []
  }
)
export const getWishlist = createAsyncThunk(
  "user/wishlist",
  async (data, { rejectWithValue }) => {
    const response = await apiGetWishlist({
      page: 0,
      size: 100,
      wishListName: "POST",
    })
    if (!response) return rejectWithValue(null)
    return response || []
  }
)
export const getTopProvince = createAsyncThunk(
  "app/topProvince",
  async (data, { rejectWithValue }) => {
    const response = await apiGetTopProvince({
      page: 0,
      size: 5,
    })
    if (!response) return rejectWithValue(null)
    return response || []
  }
)
