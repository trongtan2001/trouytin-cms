import {
  BsFilePerson,
  BsPostcard,
  BsFillPieChartFill,
  BsFillHouseGearFill,
  BsDropletHalf,
  BsCashCoin,
  BsStack,
} from "react-icons/bs"
import {
  AiFillDashboard,
  AiFillDollarCircle,
  AiFillMoneyCollect,
  AiOutlineDashboard,
  AiOutlineHeart,
  AiOutlineUser,
} from "react-icons/ai"
import path from "./path"
import { FcUpRight } from "react-icons/fc"
import {
  MdOutlineAttachMoney,
  MdHistory,
  MdReportGmailerrorred,
} from "react-icons/md"
import {
  RiFileEditLine,
  RiShareForwardFill,
  RiPriceTag2Line,
} from "react-icons/ri"

export const menu = [
  {
    path: "/danh-sach/?type=" + path.PHONGTRO,
    name: "PHÒNG TRỌ",
    subname: "Phòng trọ",
    id: "phongtro",
    type: path.PHONGTRO,
  },
  {
    path: "/danh-sach/?type=" + path.CANHO,
    name: "NHÀ, CĂN HỘ CHO THUÊ",
    id: "nhacanhochothue",
    type: path.CANHO,
    subname: "Nhà, Căn hộ cho thuê",
  },
  {
    path: "/danh-sach/?type=" + path.TIMOGHEP,
    name: "TÌM Ở GHÉP",
    id: "timoghep",
    type: path.TIMOGHEP,
    subname: "Tìm ở ghép",
  },
  // {
  //   path: "/" + path.BLOG,
  //   name: "BLOG",
  //   id: "blog",
  //   type: path.BLOG,
  //   subname: "Blogs",
  // },
  // {
  //   path: "/" + path.GUIDE,
  //   name: "HƯỚNG DẪN",
  //   id: "huongdan",
  //   type: path.GUIDE,
  //   subname: "Hướng dẫn",
  // },
  {
    path: "/" + path.PRICING,
    name: "BẢNG GIÁ DỊCH VỤ",
    id: "banggiadichvu",
    type: path.PRICING,
    subname: "Bảng giá dịch vụ",
  },
]
export const distances = [
  {
    label: "Dưới 500m",
    name: "Dưới 500m",
    value: [0, 500],
  },
  {
    label: "Từ 500m - 1km",
    name: "Từ 500m - 1km",
    value: [500, 1000],
  },
  {
    label: "Từ 1km - 3km",
    name: "Từ 1km - 3km",
    value: [1000, 3000],
  },
  {
    label: "Từ 3km - 5km",
    name: "Từ 3km - 5km",
    value: [3000, 5000],
  },
  {
    label: "Trên 5km",
    name: "Trên 5km",
    value: [5000, 99999999],
  },
]
export const priceOptions = [
  {
    value: "Dưới 1 triệu",
    min: 0,
    max: 999999,
    type: "PRICE",
  },
  {
    value: "Từ 1 - 2 triệu",
    min: 1000000,
    max: 2000000,
    type: "PRICE",
  },
  {
    value: "Từ 2 - 3 triệu",
    min: 2000000,
    max: 3000000,
    type: "PRICE",
  },
  {
    value: "Từ 3 - 5 triệu",
    min: 3000000,
    max: 5000000,
    type: "PRICE",
  },
  {
    value: "Từ 5 - 7 triệu",
    min: 5000000,
    max: 7000000,
    type: "PRICE",
  },
  {
    value: "Từ 7 - 10 triệu",
    min: 7000000,
    max: 10000000,
    type: "PRICE",
  },
  {
    value: "Từ 10 - 15 triệu",
    min: 10000000,
    max: 15000000,
    type: "PRICE",
  },
  {
    value: "Trên 15 triệu",
    min: 15000000,
    max: 999999999999,
    type: "PRICE",
  },
]
export const areaOptions = [
  {
    value: "Dưới 20 m²",
    min: 0,
    max: 19.99,
    type: "AREA",
  },
  {
    value: "Từ 20 - 30 m²",
    min: 20,
    max: 30,
    type: "AREA",
  },
  {
    value: "Từ 30 - 50 m²",
    min: 30,
    max: 50,
    type: "AREA",
  },
  {
    value: "Từ 50 - 70 m²",
    min: 50,
    max: 70,
    type: "AREA",
  },
  {
    value: "Từ 70 - 90 m²",
    min: 70,
    max: 90,
    type: "AREA",
  },
  {
    value: "Trên 90 m²",
    min: 90.01,
    max: 999999999999,
    type: "AREA",
  },
]
export const targets = [
  {
    value: "1",
    name: "Nam",
    label: "Nam",
  },
  {
    value: "2",
    name: "Nữ",
    label: "Nữ",
  },
  {
    value: "0",
    name: "Tất cả",
    label: "Tất cả",
  },
]
export const managerSidebar = [
  {
    id: 1234,
    name: "Quản lý tin đăng",
    path: `/${path.MANAGER}/${path.MANAGE_POST}`,
    icon: <BsPostcard size={20} />,
    type: "SINGLE",
  },
  {
    id: 578,
    name: "Nạp tiền",
    path: `/${path.MANAGER}/${path.DEPOSIT}`,
    icon: <AiFillDollarCircle size={20} />,
    type: "SINGLE",
  },
  {
    id: 5738,
    name: "Lịch sử nạp tiền",
    path: `/${path.MANAGER}/${path.MANAGE_DEPOSIT}`,
    icon: <MdOutlineAttachMoney size={20} />,
    type: "SINGLE",
  },
  {
    id: 57438,
    name: "Lịch sử thanh toán",
    path: `/${path.MANAGER}/${path.HISTORIES_PAYMENT}`,
    icon: <MdHistory size={20} />,
    type: "SINGLE",
  },
  {
    id: 24242,
    name: "Tới Homepage",
    path: `/`,
    icon: <RiShareForwardFill size={20} />,
    type: "SINGLE",
  },
]
export const adminSidebar = [
  {
    id: 5,
    name: "Thống kê",
    path: `/${path.ADMIN}/${path.DASHBOARD}`,
    icon: <AiOutlineDashboard size={20} />,
    type: "SINGLE",
  },
  {
    id: 3,
    name: "Quản lý tin đăng",
    icon: <BsPostcard size={20} />,
    type: "SINGLE",
    path: `/${path.ADMIN}/${path.MANAGE_POST_ALL}`,
  },
  {
    id: 4,
    name: "Quản lý thành viên",
    path: `/${path.ADMIN}/${path.MANAGE_USER}`,
    icon: <AiOutlineUser size={20} />,
    type: "SINGLE",
  },
  {
    id: 573238,
    name: "Quản lý giá dịch vụ",
    path: `/${path.ADMIN}/${path.MANAGE_PRICING}`,
    icon: <RiPriceTag2Line size={20} />,
    type: "SINGLE",
  },
  {
    id: 576538,
    name: "Quản lý thanh toán",
    path: `/${path.ADMIN}/${path.MANAGER_PAYMENT}`,
    icon: <RiPriceTag2Line size={20} />,
    type: "SINGLE",
  },
  {
    id: 5733238,
    name: "Quản lý báo cáo vi phạm",
    path: `/${path.ADMIN}/${path.MANAGE_REPORT}`,
    icon: <MdReportGmailerrorred size={20} />,
    type: "SINGLE",
  },
  {
    id: 2,
    name: "Tới Homepage",
    path: `/`,
    icon: <RiShareForwardFill size={20} />,
    type: "SINGLE",
  },
]
export const memberSidebar = [
  {
    id: 1,
    name: "Thông tin cá nhân",
    path: `/${path.MEMBER}/${path.PERSONAL}`,
    icon: <BsFilePerson size={20} />,
    type: "SINGLE",
  },
  {
    id: 3,
    name: "Danh sánh yêu thích",
    path: `/${path.MEMBER}/${path.WISHLIST}`,
    icon: <AiOutlineHeart size={20} />,
    type: "SINGLE",
  },

  {
    id: 2,
    name: "Tới Homepage",
    path: `/`,
    icon: <RiShareForwardFill size={20} />,
    type: "SINGLE",
  },
]
export const postTypes = [
  {
    id: 1,
    code: "P1",
    name: "Cho thuê phòng trọ",
  },
  {
    id: 1,
    code: "P2",
    name: "Cho thuê căn hộ",
  },
  {
    id: 1,
    code: "P3",
    name: "Tìm người ở ghép",
  },
]

export const convenients = [
  {
    id: 1,
    name: "Gác lửng",
  },
  {
    id: 2,
    name: "Phòng tắm",
  },
  {
    id: 3,
    name: "Máy giặt",
  },
  {
    id: 4,
    name: "Tủ lạnh",
  },
  {
    id: 5,
    name: "Ban công / Sân thượng",
  },
  {
    id: 6,
    name: "Camara an ninh",
  },
  {
    id: 7,
    name: "Wifi",
  },
  {
    id: 8,
    name: "Bình nóng lạnh",
  },
  {
    id: 9,
    name: "Tivi",
  },
  {
    id: 10,
    name: "Giường nệm",
  },
  {
    id: 11,
    name: "Thang máy",
  },
  {
    id: 12,
    name: "Hồ bơi",
  },
  {
    id: 13,
    name: "Vệ sinh trong",
  },
  {
    id: 14,
    name: "Điều hòa",
  },
  {
    id: 15,
    name: "Tủ quần áo",
  },
  {
    id: 16,
    name: "Bãi để xe riêng",
  },
  {
    id: 17,
    name: "Sân vườn",
  },
  {
    id: 18,
    name: "Kệ bếp",
  },
]
export const cities = [
  {
    image: "/hanoi.jpg",
    name: "Hà Nội",
    postCounter: 9845,
    id: 2,
  },
  {
    image: "/danang.jpg",
    name: "Đà nẵng",
    postCounter: 255,
    id: 1,
  },
  {
    image: "/hochiminh.jpg",
    name: "Hồ Chí Minh",
    postCounter: 742,
    id: 3,
  },
  {
    image: "/thuathienhue.jpg",
    name: "Thừa Thiên Huế",
    postCounter: 4747,
    id: 4,
  },
]
export const stars = [
  {
    name: "1 sao",
    label: "1 sao",
    value: 1,
  },
  {
    name: "2 sao",
    label: "2 sao",
    value: 2,
  },
  {
    name: "3 sao",
    label: "3 sao",
    value: 3,
  },
  {
    name: "4 sao",
    label: "4 sao",
    value: 4,
  },
  {
    name: "5 sao",
    label: "5 sao",
    value: 5,
  },
]
export const statuses = [
  {
    name: "Thành công",
    label: "Thành công",
    value: "APPROVED",
  },
  {
    name: "Đang xử lý",
    label: "Đang xử lý",
    value: "REVIEW",
  },
  {
    name: "Từ chối",
    label: "Từ chối",
    value: "REJECTED",
  },
]
export const superAdminSidebar = [
  {
    id: 1,
    name: "Thống kê",
    path: `${path.DASHBOARD}`,
    icon: <BsFillPieChartFill size={20} />,
    type: "SINGLE",
  },
  {
    id: 2,
    name: "Quản lý Nhà",
    icon: <BsFillHouseGearFill size={20} />,
    type: "SINGLE",
    path: `${path.MANAGER_HOUSE}`,
  },
  {
    id: 3,
    name: "Quản lý dịch vụ phòng",
    icon: <BsStack size={20} />,
    type: "SINGLE",
    path: `${path.MANAGER_SERVICE}`,
  },
  {
    id: 4,
    name: "Quản lý điện & nước",
    icon: <BsDropletHalf size={20} />,
    type: "SINGLE",
    path: `${path.MANAGER_ELECTRIC_WATER}`,
  },
  {
    id: 5,
    name: "Quản lý tiền phòng",
    icon: <BsCashCoin size={20} />,
    type: "SINGLE",
    path: `${path.MANAGER_PAYMENT}`,
  },
  {
    id: 6,
    name: "Tới Homepage",
    path: `/`,
    icon: <RiShareForwardFill size={20} />,
    type: "SINGLE",
  },
]
