import path from "./ultils/path"
import { Route, Routes } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import {
  Layout,
  Home,
  Login,
  Filter,
  DetailPost,
  TopProvince,
  PaymentResult,
} from "./pages/public"
import { Loading, Modal } from "./components"
import {
  LayoutAdmin,
  Dashboard,
  ManageUser,
  ManagePosts,
  CreatePricing,
  ManagePricing,
  ManagePayment,
} from "./pages/admin"
import {
  LayoutSuperAdmin,
  Dashboardsp,
  ManagerHouse,
  ManagerWater,
  ManagerService,
  ManagerPayment,
} from "./pages/superAdmin"
import { BillOrderPage } from "./pages/orderbill"
import {
  LayoutManager,
  Personal,
  CreatePost,
  ManagePost,
  Deposit,
} from "./pages/manager"
import {
  ChangePassword,
  ChangePhone,
  LayoutMember,
  VerifyOtpUpgradeRole,
  Wishlist,
} from "./pages/member"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { getCurrent, getProvinces, getWishlist } from "./redux/actions"
import ManageDeposit from "./pages/manager/ManageDeposit"
import Pricing from "./pages/public/Pricing"
import HistoriesPayment from "./pages/manager/HistoriesPayment"
import ManageReport from "./pages/admin/ManageReport"
function App() {
  const { isLoading, isShowModal, modalContent } = useSelector(
    (state) => state.app
  )
  const { token } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getProvinces())
  }, [])
  useEffect(() => {
    setTimeout(() => {
      dispatch(getCurrent())
      if (token) dispatch(getWishlist())
    }, 800)
  }, [token])
  return (
    <>
      {isShowModal && <Modal>{modalContent}</Modal>}
      {isLoading && (
        <div className="fixed top-0 left-0 right-0 z-[1000] bottom-0 bg-overlay-70 flex justify-center items-center">
          <Loading />
        </div>
      )}
      <Routes>
        <Route path={path.LAYOUT} element={<Layout />}>
          <Route path={path.HOME} element={<Home />} />
          <Route path={path.LIST} element={<Filter />} />
          <Route path={path.DETAIL_POST__PID__TITLE} element={<DetailPost />} />
          <Route path={path.VERIFY_PHONE} element={<VerifyOtpUpgradeRole />} />
          <Route path={path.TOP_PROVINCE__NAME} element={<TopProvince />} />
          <Route path={path.PRICING} element={<Pricing />} />
        </Route>
        <Route path={path.LOGIN} element={<Login />} />

        {/* Member routes */}
        <Route path={path.MEMBER} element={<LayoutMember />}>
          <Route path={path.PERSONAL} element={<Personal />} />
          <Route path={path.WISHLIST} element={<Wishlist />} />
          <Route path={path.CHANGE_PHONE} element={<ChangePhone />} />
          <Route path={path.CHANGE_PASSWORD} element={<ChangePassword />} />
          <Route path={path.DEPOSIT} element={<Deposit />} />
          <Route path={path.MANAGE_DEPOSIT} element={<ManageDeposit />} />
        </Route>

        {/* Admin routes */}
        <Route path={path.ADMIN} element={<LayoutAdmin />}>
          <Route path={path.DASHBOARD} element={<Dashboard />} />
          <Route path={path.MANAGE_USER} element={<ManageUser />} />
          <Route path={path.MANAGE_POST_ALL} element={<ManagePosts />} />
          <Route path={path.DEPOSIT} element={<Deposit />} />
          <Route path={path.CREATE_PRICING} element={<CreatePricing />} />
          <Route path={path.MANAGE_PRICING} element={<ManagePricing />} />
          <Route path={path.MANAGE_REPORT} element={<ManageReport />} />
          <Route path={path.MANAGER_PAYMENT} element={<ManagePayment />} />
          <Route path={path.MANAGE_DEPOSIT} element={<ManageDeposit />} />
        </Route>
        {/* Super Admin routes */}
        <Route
          className="overflow-hidden"
          path={path.SUPER_ADMIN}
          element={<LayoutSuperAdmin />}
        >
          <Route path={path.DASHBOARD} element={<Dashboardsp />} />
          <Route path={path.MANAGER_HOUSE} element={<ManagerHouse />} />
          <Route
            path={path.MANAGER_ELECTRIC_WATER}
            element={<ManagerWater />}
          />
          <Route path={path.MANAGER_SERVICE} element={<ManagerService />} />
          <Route path={path.MANAGER_PAYMENT} element={<ManagerPayment />} />
        </Route>

        {/* Manage routes */}
        <Route path={path.MANAGER} element={<LayoutManager />}>
          {/* <Route path={path.PERSONAL} element={<Personal />} /> */}
          <Route path={path.HISTORIES_PAYMENT} element={<HistoriesPayment />} />
          <Route path={path.CREATE_POST} element={<CreatePost />} />
          <Route path={path.DEPOSIT} element={<Deposit />} />
          <Route path={path.MANAGE_POST} element={<ManagePost />} />
          <Route path={path.CHANGE_PHONE} element={<ChangePhone />} />
          <Route path={path.CHANGE_PASSWORD} element={<ChangePassword />} />
          <Route path={path.MANAGE_DEPOSIT} element={<ManageDeposit />} />
        </Route>
        <Route path={path.PAYMENT_RESULT} element={<PaymentResult />} />
        <Route path={path.INVALID} element={<Home />} />
        <Route path={`${path.BILL}/:orderId`} element={<BillOrderPage />} />
      </Routes>
      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  )
}

export default App
