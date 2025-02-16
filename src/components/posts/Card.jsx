import { apiAddWishlist, apiRemoveWishlist } from "@/apis/user"
import { getWishlist } from "@/redux/actions"
import { formatMoney, formatVietnameseToString } from "@/ultils/fn"
import path from "@/ultils/path"
import moment from "moment"
import React, { useEffect } from "react"
import { FaHeart, FaRegHeart } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { Link, useParams } from "react-router-dom"
import { toast } from "react-toastify"

const Card = ({
  image,
  title,
  address,
  price,
  createdDate,
  id,
  isLike,
  wishListItemId,
}) => {
  const dispatch = useDispatch()
  const { current, wishlist } = useSelector((s) => s.user)
  const handleAddWishlist = async () => {
    if (!current) return toast.warn("Bạn phải đăng nhập trước.")
    const response = await apiAddWishlist({ postId: id, wishlistName: "POST" })
    if (response.wishlistId) {
      toast.success("Thêm bài đăng yêu thích thành công")
      dispatch(getWishlist())
    } else toast.error(response.message)
  }
  const handleRemoveWishlist = async () => {
    const wishlistId = wishlist?.find((el) => el.id === id)?.wishListItemId
    const response = await apiRemoveWishlist(wishlistId)
    if (response.success) {
      toast.success(response.message)
      dispatch(getWishlist())
    } else toast.error(response.message)
  }
  return (
    <div className="w-full col-span-1 flex flex-col rounded-md border">
      <div className="w-full h-[156px] relative">
        {!isLike && (
          <span
            onClick={handleAddWishlist}
            className="absolute top-2 right-2 text-white p-1 cursor-pointer"
          >
            <FaRegHeart size={22} />
          </span>
        )}
        {isLike && (
          <span
            onClick={handleRemoveWishlist}
            className="absolute top-2 right-2 text-red-500 p-1 cursor-pointer"
          >
            <FaHeart size={22} />
          </span>
        )}
        <img
          src={image}
          alt="avatar"
          className="w-full h-full object-cover rounded-tl-md rounded-tr-md"
        />
      </div>
      <div className="p-3 flex flex-col gap-1">
        <span className="text-sm text-gray-500">

          {address?.split(",")[address?.split(",")?.length - 1]}
        </span>
        <Link
          to={`/${path.DETAIL_POST}/${id}/${formatVietnameseToString(title)}`}
          className="text-emerald-800 text-lg cursor-pointer hover:underline font-semibold line-clamp-2"
        >
          {title}
        </Link>
        <span className="text-sm text-gray-500">{address}</span>
        <div className="mt-3 flex justify-between items-center">
          <span className="font-medium text-main-orange">{`${formatMoney(
            price
          )} VNĐ`}</span>
          <span className="text-gray-500 text-sm">
            {moment(createdDate).format("DD/MM/YYYY")}
          </span>
        </div>
      </div>
    </div>
  )
}

export default Card
