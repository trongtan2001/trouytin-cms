import { Title } from "@/components"
import { Fragment, useState, useEffect } from "react"
import { PieChart } from 'react-minimal-pie-chart';
import { Line } from 'react-chartjs-2';
import { getHouseStatus, getRoomStatus, getRoomStatusPayment, getOrderStatus } from "@/apis/supperAdmin/dashboard/dashboard"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


const Dashboardsp = () => {

  const [houseStatusData, setHouseStatusData] = useState([]);
  const [roomStatusPaymentData, setRoomStatusPaymentData] = useState([]);
  const [orderLabelData, setOrderLabelData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [roomStatusPercent, setRoomStatusPercent] = useState(0);

  const dataCircleChart = [
    { value: roomStatusPercent, color: '#37d4b29c' }, // Progress color
    { value: 100 - roomStatusPercent, color: '#5858580f' }, // Background color
  ];


  const dataLineChart = {
    labels: orderLabelData,
    datasets: [
      {
        label: 'Doanh thu',
        data: orderData,
        borderColor: '#3b82f6',
        backgroundColor: '#1e40af',
      }
    ],
  };

  var [callApi, setcallApi] = useState(true);

  useEffect(() => {

    getHouseStatus().then((houseStatus) => {
      setHouseStatusData(houseStatus)
    })

    getRoomStatus().then((roomStatus) => {
      setRoomStatusPercent(roomStatus)
    })

    getRoomStatusPayment().then((roomStatusPayment) => {
      setRoomStatusPaymentData(roomStatusPayment)
    })

    getOrderStatus().then((orderStatus) => {
      setOrderData(orderStatus.map(entry => entry.total))
      setOrderLabelData(orderStatus.map(entry => 'Tháng ' + entry.month))
    })

  }, [callApi]);

  const reLoad = () => {
    setcallApi(!callApi)
  }

  return (
    <div>
      <Title title="Thống kê"></Title>
      <div className="grid grid-cols-2 grid-rows-2">
        <div className="mx-2 my-2 border border-[#E6E9ED] rounded-md shadow">
          <div className="border-b-2 border-[#E6E9ED] mx-4 py-2">
            <h1 className="text-2xl font-bold text-[#73879E] px-2">Trạng thái phòng</h1>
          </div>
          <div className="grid grid-cols-2 w-full px-2">
            <PieChart className="px-4"
              data={dataCircleChart}
              style={{ width: '240px', height: '240px' }} // Adjust the size as needed
              startAngle={-90}
              animate
            />
            <div className="flex-col pt-5">
              <span className="text-sm font-semibold text-[white] rounded-full bg-[#37d4b29c] px-4 py-2 mr-2">Đã thuê</span>
              <span className="text-sm font-semibold text-[black] border rounded-full bg-[#5858580f] px-4 py-2">Còn trống</span>
            </div>
          </div>
          <div className="w-full grid grid-cols-3 pb-2 ml-7">
            <span className="py-2 text-center text-[white] text-md font-semibold border border-[#E6E9ED] rounded-full bg-[#37d4b29c]">{roomStatusPercent} %</span>
          </div>
        </div>
        <div className="mx-2 my-2 border border-[#E6E9ED] rounded-md shadow">
          <div className="border-b-2 border-[#E6E9ED] mx-4 py-2">
            <h1 className="text-2xl font-bold text-[#73879E] px-2">Doanh thu</h1>
          </div>
          <div>
            <Line data={dataLineChart} />
          </div>
        </div>
        <div className="mx-2 my-2 border border-[#E6E9ED] rounded-md shadow">
          <div className="border-b-2 border-[#E6E9ED] mx-4 py-2">
            <h1 className="text-2xl font-bold text-[#73879E] px-2">Danh sách phòng trống</h1>
          </div>
          <div className="px-2 py-4 overflow-y-auto max-h-[300px]">
            <table className="w-full text-sm text-center rtl:text-right text-[black] font-mono">
              <thead className="text-xl text-[white] bg-[#059669]">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Nhà
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Phòng
                  </th>
                </tr>
              </thead>
              <tbody className="text-base font-medium">
                {houseStatusData.length === 0 ? (
                  <tr>
                    <td colSpan="2" className="px-6 py-4 text-center">
                      Không có phòng nào trống
                    </td>
                  </tr>
                ) : (
                  houseStatusData && houseStatusData.length > 0 && houseStatusData.map((house, houseIndex) => (
                    <Fragment key={houseIndex}>
                      {house.roomName.map((roomName, roomIndex) => (
                        <tr key={roomIndex} className="bg-white hover:bg-[#0000000d] border-b border-gray-400">
                          <td className="px-6 py-4">
                            {house.houseName}
                          </td>
                          <td className="px-6 py-4">
                            Phòng {roomName}
                          </td>
                        </tr>
                      ))}
                    </Fragment>
                  )))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mx-2 my-2 border border-[#E6E9ED] rounded-md shadow">
          <div className="border-b-2 border-[#E6E9ED] mx-4 py-2">
            <h1 className="text-2xl font-bold text-[#73879E] px-2">Danh sách phòng chưa đóng tiền</h1>
          </div>
          <div className="px-2 py-4 overflow-y-auto max-h-[300px]">
            <table className="w-full text-sm text-center rtl:text-right text-[black] font-mono">
              <thead className="text-xl text-[white] bg-[#059669]">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Nhà
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Phòng
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Tháng
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Số tiền còn nợ
                  </th>
                </tr>
              </thead>
              <tbody className="text-base font-medium">
                <tr className="bg-white hover:bg-[#0000000d] border-b border-gray-400">

                </tr>
                {roomStatusPaymentData.length === 0 ? (
                  <tr>
                    <td colSpan="2" className="px-6 py-4 text-center">
                      Không có bill nào chưa trả
                    </td>
                  </tr>
                ) : (
                  roomStatusPaymentData && roomStatusPaymentData.length > 0 && roomStatusPaymentData.map((room, index) => (
                    <Fragment key={index}>
                      {room.orderStatusPayments.map((order, index) => (
                        <tr key={index} className="bg-white hover:bg-[#0000000d] border-b border-gray-400">
                          <td className="px-6 py-4">
                            {room.houseName}
                          </td>
                          <td className="px-6 py-4">
                            Phòng {room.roomName}
                          </td>
                          <td className="px-6 py-4">
                            {new Date(order.date).toLocaleString('en-US', {
                              month: '2-digit',
                            })}
                          </td>
                          <td className="px-6 py-4">
                            {new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND',
                            }).format(parseInt(order.restNumber))}
                          </td>
                        </tr>
                      ))}
                    </Fragment>
                  )))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboardsp
