import { customMoney, formatMoney, renderStarFromNumber } from "@/ultils/fn"
import clsx from "clsx"
import React, { useEffect, useState } from "react"
import { AiOutlineHeart, AiOutlineUnorderedList } from "react-icons/ai"
import { GoLocation } from "react-icons/go"
import { BsPhoneVibrate } from "react-icons/bs"
import { createSearchParams, useParams } from "react-router-dom"
import { apiGetDetailPost, apiGetPosts, apiGetRatings } from "@/apis/post"
import moment from "moment"
import DOMPurify from "dompurify"
import { apiGetLngLatFromAddress } from "@/apis/app"
import { CgSpinner } from "react-icons/cg"
import {
  BoxFilter,
  Button,
  Comments,
  DetailImages,
  LongCard,
  Map,
  Rating,
  Report,
} from "@/components"
import TypeBox from "@/components/comment/TypeBox"
import { useSelector } from "react-redux"
import WithBaseTopping from "@/hocs/WithBaseTopping"
import path from "@/ultils/path"
import { MdOutlineReportProblem } from "react-icons/md"
import { modal } from "@/redux/appSlice"
import { toast } from "react-toastify"
import { apiAddWishlist, apiRemoveWishlist } from "@/apis/user"
import { getWishlist } from "@/redux/actions"
import { FaHeart, FaRegHeart } from "react-icons/fa"

const DetailPost = ({ navigate, location, dispatch }) => {
  const { pid } = useParams()
  const { isShowModal } = useSelector((s) => s.app)
  const [seeMore, setSeeMore] = useState(false)
  const [post, setPost] = useState()
  const [rating, setRating] = useState({})
  const [center, setCenter] = useState([])
  const [posts, setPosts] = useState([])

  const { current, wishlist } = useSelector((s) => s.user)

  const fetchDetailPost = async () => {
    const response = await apiGetDetailPost({ postId: pid })
    if (response) setPost({ ...response?.postDetail, images: response?.images })
  }
  const getPosts = async (address) => {
    const formdata = new FormData()
    formdata.append("json", JSON.stringify({ address, status: "APPROVED" }))
    formdata.append("size", 5)
    const response = await apiGetPosts(formdata)
    if (response) setPosts(response.data)
    else setPosts([])
  }
  const fetchRating = async () => {
    const response = await apiGetRatings({ postId: pid })
    if (response) setRating(response)
    else setRating({})
  }
  const fetLngLat = async (payload) => {
    const response = await apiGetLngLatFromAddress(payload)
    if (response.status === 200)
      setCenter([
        response.data?.features[0]?.properties?.lat,
        response.data?.features[0]?.properties?.lon,
      ])
  }
  useEffect(() => {
    fetchDetailPost()
    !isShowModal && fetchRating()
  }, [pid, isShowModal])
  useEffect(() => {
    if (post?.address) {
      fetLngLat({
        text: post?.address,
        apiKey: import.meta.env.VITE_MAP_API_KEY,
      })
      getPosts(post?.address?.split(",")[post?.address?.split(",")?.length - 1])
    }
  }, [post])
  const handleAddWishlist = async () => {
    if (!current) return toast.warn("Bạn phải đăng nhập trước.")
    const response = await apiAddWishlist({ postId: pid, wishlistName: "POST" })
    if (response.wishlistId) {
      toast.success("Thêm bài đăng yêu thích thành công")
      dispatch(getWishlist())
    } else toast.error(response.message)
  }
  const handleRemoveWishlist = async () => {
    const wishlistId = wishlist?.find((el) => +el.id === +pid)?.wishListItemId
    const response = await apiRemoveWishlist(wishlistId)
    if (response.success) {
      toast.success(response.message)
      dispatch(getWishlist())
    } else toast.error(response.message)
  }
  return (
    <div className="w-main mt-6 m-auto pb-[200px]">
      <div className="grid grid-cols-4 h-[410px] relative grid-rows-2 gap-3">
        {post?.images && post?.images[0] && (
          <img
            onClick={() =>
              dispatch(
                modal({
                  isShowModal: true,
                  modalContent: (
                    <DetailImages currentImage={0} images={post?.images} />
                  ),
                })
              )
            }
            src={post?.images[0]?.image}
            alt="avatar"
            className="col-span-2 w-full h-full row-span-2 object-cover cursor-pointer rounded-l-md"
          />
        )}
        {post?.images && post?.images[1] && (
          <img
            onClick={() =>
              dispatch(
                modal({
                  isShowModal: true,
                  modalContent: (
                    <DetailImages currentImage={1} images={post?.images} />
                  ),
                })
              )
            }
            src={post?.images[1]?.image}
            alt="avatar"
            className="col-span-1 w-full h-full row-span-1 object-cover cursor-pointer"
          />
        )}
        {post?.images && post?.images[2] && (
          <img
            onClick={() =>
              dispatch(
                modal({
                  isShowModal: true,
                  modalContent: (
                    <DetailImages currentImage={2} images={post?.images} />
                  ),
                })
              )
            }
            src={post?.images[2]?.image}
            alt="avatar"
            className="col-span-1 w-full h-full row-span-1 object-cover cursor-pointer rounded-tr-md"
          />
        )}
        {post?.images && post?.images[3] && (
          <img
            onClick={() =>
              dispatch(
                modal({
                  isShowModal: true,
                  modalContent: (
                    <DetailImages currentImage={3} images={post?.images} />
                  ),
                })
              )
            }
            src={post?.images[3]?.image}
            alt="avatar"
            className="col-span-1 w-full h-full row-span-1 object-cover cursor-pointer"
          />
        )}
        {post?.images && post?.images[4] && (
          <img
            onClick={() =>
              dispatch(
                modal({
                  isShowModal: true,
                  modalContent: (
                    <DetailImages currentImage={4} images={post?.images} />
                  ),
                })
              )
            }
            src={post?.images[4]?.image}
            alt="avatar"
            className="col-span-1 w-full h-full row-span-1 object-cover cursor-pointer rounded-br-md"
          />
        )}
        <div
          onClick={() =>
            dispatch(
              modal({
                isShowModal: true,
                modalContent: <DetailImages images={post?.images} />,
              })
            )
          }
          className="absolute cursor-pointer bottom-6 right-8 bg-white borer-2 rounded-md border-emerald-800 gap-2 flex items-center justify-center px-4 py-2"
        >
          <AiOutlineUnorderedList />
          <span className="text-emerald-800 font-medium">
            Hiện thị tất cả ảnh
          </span>
        </div>
      </div>
      <div className="grid grid-cols-10 gap-4 mt-6">
        <div className="col-span-7 flex flex-col gap-3">
          <div className="flex items-center gap-4">
            <h1 className="text-xl flex-auto flex items-center gap-3 text-emerald-700 font-bold line-clamp-2">
              {rating?.averageStarPoint ? (
                <span className="flex items-center">
                  {renderStarFromNumber(rating?.averageStarPoint)?.map(
                    (el, idx) => (
                      <span key={idx}>{el}</span>
                    )
                  )}
                </span>
              ) : (
                ""
              )}

              <span>{post?.title}</span>
            </h1>
            {!wishlist?.some((n) => +n.id === +pid) ? (
              <span
                onClick={handleAddWishlist}
                className="flex-none block text-black p-1 cursor-pointer"
              >
                <FaRegHeart size={22} />
              </span>
            ) : (
              <span
                onClick={handleRemoveWishlist}
                className="flex-none block text-red-500 p-1 cursor-pointer"
              >
                <FaHeart size={22} />
              </span>
            )}
          </div>
          <span>
            Chuyên mục:{" "}
            <span className="font-semibold cursor-pointer">
              {`${post?.postType} ${
                post?.address?.split(",")[post?.address?.split(",")?.length - 1]
              }`}
            </span>
          </span>
          <span className="flex items-center gap-2">
            <GoLocation color="#1266DD" size={16} />
            <span>{post?.address}</span>
          </span>
          <div className="grid grid-cols-3">
            <span className="flex items-center gap-2">
              💰
              <span className="text-lg font-bold text-green-600">
                {customMoney(post?.price)}
              </span>
            </span>
            <span className="flex items-center gap-2">
              🔳<span>{post?.acreage}</span>
              <span>
                m<sup>2</sup>
              </span>
            </span>
            <span className="flex items-center gap-2">
              🕓<span>{moment(post?.createdDate).fromNow()}</span>
            </span>
          </div>
          <div>
            <Button
              onClick={() =>
                dispatch(
                  modal({
                    isShowModal: true,
                    modalContent: <Report id={pid} />,
                  })
                )
              }
              className="bg-orange-500"
            >
              <MdOutlineReportProblem size={22} />
              Báo cáo tin đăng
            </Button>
          </div>
          <div className="mt-6">
            <h2 className="text-lg my-3 font-bold">Đặc điểm tin đăng</h2>
            <div className="grid grid-cols-10">
              <div className="col-span-3 flex flex-col">
                <span className="p-2  border-[0.5px]">Khu vực:</span>
                <span className="p-2  border-[0.5px] bg-gray-100">
                  Loại tin rao:
                </span>
                <span className="p-2  border-[0.5px]">Đối tượng:</span>
                <span className="p-2  border-[0.5px] bg-gray-100">
                  Ngày đăng:
                </span>
              </div>
              <div className="col-span-7 flex flex-col">
                <span className="p-2  border-[0.5px]">
                  {`${post?.postType} ${
                    post?.address?.split(",")[
                      post?.address?.split(",")?.length - 1
                    ]
                  }`}
                </span>
                <span className="p-2  border-[0.5px] bg-gray-100">
                  {post?.postType}
                </span>
                <span className="p-2  border-[0.5px]">{post?.object}</span>
                <span className="p-2  border-[0.5px] bg-gray-100">
                  {moment(post?.createdDate).format("DD/MM/YYYY")}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <h2 className="text-lg my-3 font-bold">Thông tin phòng</h2>
            <div className="grid grid-cols-10">
              <div className="col-span-3 flex flex-col">
                <span className="p-2  border-[0.5px]">Giá điện/tháng:</span>
                <span className="p-2  border-[0.5px]">
                  Số người tối đa 1 phòng:
                </span>
                <span className="p-2  border-[0.5px] bg-gray-100">
                  Giá nước/tháng
                </span>
                <span className="p-2  border-[0.5px] bg-gray-100">
                  Mô tả vị trí
                </span>
                <span className="p-2  border-[0.5px] bg-gray-100">
                  Tiện nghi
                </span>
              </div>
              <div className="col-span-7 flex flex-col">
                <span className="p-2  border-[0.5px]">
                  {formatMoney(post?.electricityPrice)}
                </span>
                <span className="p-2  border-[0.5px] bg-gray-100">
                  {post?.stayMax}
                </span>
                <span className="p-2  border-[0.5px]">
                  {formatMoney(post?.waterPrice)}
                </span>
                <span className="p-2  border-[0.5px] bg-gray-100">
                  {post?.surroundings}
                </span>
                <span className="p-2  border-[0.5px] bg-gray-100">
                  {post?.convenient?.join(", ")}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <h2 className="text-lg font-bold my-3">Thông tin liên hệ</h2>
            <div className="grid grid-cols-10">
              <div className="col-span-3 flex flex-col">
                <span className="p-2  border-[0.5px]">Liên hệ:</span>
                <span className="p-2  border-[0.5px] bg-gray-100">
                  Điện thoại:
                </span>
                <span className="p-2  border-[0.5px]">Zalo:</span>
              </div>
              <div className="col-span-7 flex flex-col">
                <span className="p-2  border-[0.5px]">
                  {post?.createdBy?.userName}
                </span>
                <span className="p-2  border-[0.5px] bg-gray-100">
                  {post?.createdBy?.phoneNumber}
                </span>
                <span className="p-2  border-[0.5px]">
                  {post?.createdBy?.phoneNumber}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <h2 className="text-lg font-bold my-3">Thông tin chi tiết</h2>
            <p
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post?.description),
              }}
              className={clsx(!seeMore && "line-clamp-4")}
            ></p>
            <span
              className="text-emerald-500 hover:underline cursor-pointer"
              onClick={() => setSeeMore(!seeMore)}
            >
              Xem chi tiết
            </span>
          </div>
          <div className="mt-6">
            <h2 className="text-lg font-bold my-3">Bản đồ</h2>
            <span>
              Địa chỉ: <span>{post?.address}</span>
            </span>
            <div className="w-full h-[250px]">
              {center.length > 0 && (
                <Map center={center} address={post?.address} zoom={16} />
              )}
              {center.length === 0 && (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 rmd">
                  <span className="text-main-blue text-3xl animate-spin">
                    <CgSpinner />
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-span-3 flex flex-col gap-6">
          <div className="w-full flex flex-col gap-2 items-center justify-center rounded-md bg-emerald-800 text-white p-4">
            <img
              src={post?.createdBy?.images || "/user.svg"}

              alt="user"
              className="rounded-full w-24 h-24 object-cover border border-main-yellow"
            />
            <span className="text-lg font-medium text-main-orange">
              {post?.createdBy?.userName}
            </span>
            <a
              className="text-white flex items-center justify-center gap-2 px-4 py-2 border w-3/5 text-center border-white rounded-md"
              href="tel:+84132456456"
            >
              <span className="text-white text-2xl">
                <BsPhoneVibrate />
              </span>
              <a href={`tel:${post?.createdBy?.phoneNumber}`}>
                {post?.createdBy?.phoneNumber}
              </a>
            </a>
            <a
              className="text-emerald-800 font-medium flex items-center bg-main-orange justify-center gap-2 px-4 py-2 border w-3/5 text-center border-main-orange rounded-md"
              href={`https://zalo.me/${post?.createdBy?.phoneNumber?.replace(
                "+84",
                "0"
              )}`}
              target="_blank"
            >
              <img
                src="/zalo.svg"
                alt="zaol"
                className="w-6 h-6 object-cover"
              />
              <span>{post?.createdBy?.phoneNumber}</span>
            </a>
          </div>
          <BoxFilter
            className="flex justify-center items-center text-xl font-semibold"
            title="Bài viết liên quan"
            containerClassName="bg-white w-full"
          >
            {posts
              ?.filter((el, idx) => idx < 4)
              ?.map((el) => (
                <LongCard
                  containerClassName="rounded-none border-b w-full"
                  hideImage
                  key={el.id}
                  {...el}
                />
              ))}
          </BoxFilter>
        </div>
      </div>
      <div className="mt-6 bg-red-500 w-full">
        <Rating {...rating} name={post?.title} pid={post?.id} />
      </div>
      <div className="mt-6">
        <h1 className="font-bold text-lg tracking-tight mb-3">
          Trao đổi và bình luận
        </h1>
        <div className="flex flex-col gap-4">
          {current ? (
            <TypeBox pid={post?.id} />
          ) : (
            <span className="mb-4">
              Hãy để lại góp ý của bạn.{" "}
              <span
                onClick={() =>
                  navigate({
                    pathname: "/" + path.LOGIN,
                    search: createSearchParams({
                      redirect: location.pathname,
                    }).toString(),
                  })
                }
                className="cursor-pointer text-blue-500 hover:underline"
              >
                Đi tới đăng nhập!
              </span>
            </span>
          )}
          <Comments />
        </div>
      </div>
    </div>
  )
}
export default WithBaseTopping(DetailPost)
