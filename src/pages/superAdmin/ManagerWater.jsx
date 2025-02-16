import { Title } from "@/components"
import { useState, useEffect } from "react"
import { Fragment } from "react"
import { getListHouse } from "@/apis/supperAdmin/house/house"
import { getRoomById } from "@/apis/supperAdmin/room/room"
import { getOrderById, updateOrAddOrder } from "@/apis/supperAdmin/order/order"
import { BsPencilSquare, BsFillPatchPlusFill } from "react-icons/bs"
import { toast } from "react-toastify"

const ManagerWater = () => {
  const [waterData, setWaterData] = useState([]);
  const [houseData, setHouseData] = useState([]);
  const [currentHouseId, setCurrentHouseId] = useState(null);
  const [currentRoomId, setCurrentRoomId] = useState(null);

  const [showModalOrder, setshowModalOrder] = useState(false);
  const [statusModalOrder, setstatusModalOrder] = useState(false);

  const [form, setform] = useState({
    "orderId": null,
    "roomId": null,
    "water": 0,
    "electricity": 0
  })

  const [formOrderValidate, setFormOrderValidate] = useState({
    "roomId": true,
    "water": true,
    "electricity": true
  })

  var [callApi, setcallApi] = useState(true);

  useEffect(() => {
    getListHouse().then(response => {
      // Handle the response data here
      setHouseData(response);
      setCurrentHouseId(currentHouseId ? currentHouseId : response[0].houseId)
      setCurrentRoomId(currentRoomId ? currentRoomId : response[0].rooms[0].id);
      getRoomDataById(currentRoomId ? currentRoomId : response[0].rooms[0].id)
    }).catch(error => {
      // Handle any errors that occurred during the request
      console.error(error);
    });

  }, [callApi]);

  const getRoomDataById = (id) => {
    getRoomById(id).then(response => {
      // Handle the response data here
      setWaterData(response);
    }).catch(error => {
      // Handle any errors that occurred during the request
      console.error(error);
    });

  }

  const reLoad = () => {
    setcallApi(!callApi)
  }

  const validateOrder = () => {
    const newValidity = {
      "roomId": form.roomId !== null && form.roomId != 0,
      "water": form.water !== null && form.water != 0,
      "electricity": form.electricity !== null && form.electricity != 0,
    };
    // Update the validity state for all fields
    setFormOrderValidate(newValidity);

    // Return true if all fields are valid, false otherwise
    return Object.values(newValidity).every((valid) => valid);
  };

  const setDefalutFormOrder = () => {
    setform({
      "orderId": null,
      "roomId": null,
      "water": 0,
      "electricity": 0
    })
    setFormOrderValidate({
      "roomId": true,
      "water": true,
      "electricity": true
    })
  }

  const fillDataFrom = (data) => {
    setform({
      "orderId": data.orderId,
      "roomId": data.roomId,
      "water": data.water,
      "electricity": data.electricity,
      "paymentDate": data.paymentDate
    })
  }

  const setDataFromById = (id) => {
    getOrderById(id).then(response => {
      fillDataFrom(response)
    }).catch(err => {
      console.error(err);
    })
  }

  const handleHouseChange = (value) => {
    // Update the corresponding property in the person state
    setCurrentHouseId(value)
    houseData.forEach(house => {
      if (house.houseId == value) {
        handleRoomChange(house.rooms[0].id)
      }
    })
  };

  const handleRoomChange = (value) => {
    // Update the corresponding property in the person state
    setCurrentRoomId(value)
    setform((form) => ({
      ...form,
      "roomId": value,
    }));
    getRoomDataById(value)
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateOrder()) {
      updateOrAddOrder(form.orderId, form).then(response => {
        // Handle the response data here
        if (!response.success) {
          toast.error(response.message)
      } else {
          toast.success(response.message)
      }
      }).finally(() => {
        reLoad();
        handleRoomChange(currentRoomId)
        setDefalutFormOrder()
        setshowModalOrder(!showModalOrder)
      });
    }
    else {
      toast.info("Vui lòng nhập đầy đủ thông tin trước khi gửi !");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Update the corresponding property in the person state
    setform((form) => ({
      ...form,
      [name]: value,
    }));

    setFormOrderValidate((formOrderValidate) => ({
      ...formOrderValidate,
      [name]: value != 0 && value.trim() !== '',
    }));

  };

  return (
    <>
      <section className="mb-[20px]">
        <Title title="Quản lý số nước"></Title>
      </section>
      <div className="px-4">
        <div className="overflow-x-auto shadow-md sm:rounded-lg mt-2 border border-[#e2e1e1]">
          <div className="w-full flex pb-4 bg-white dark:bg-white-900 px-4 py-4">
            <div className="flex w-2/3">
              <label htmlFor="self-center table-search" className="sr-only">Search</label>
              <div className="self-center relative mt-1">
                <span className="my-2 text-lg font-semibold self-center">Quản lý điện & nước phòng :</span>
              </div>
              <select className="self-center ml-4 bg-white border border-gray-300 text-black text-center text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 py-2 px-4 dark:border-gray-500 dark:placeholder-gray-400 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                onChange={(e) => handleHouseChange(e.target.value)}>
                {houseData && houseData.length > 0 && houseData.map(house => (
                  <Fragment key={house.houseId}>
                    <option className="text-start" value={house.houseId}>{house.houseName}</option>
                  </Fragment>
                ))}
              </select>
              <select className="self-center ml-4 bg-white border border-gray-300 text-black text-center text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 py-2 px-4 dark:border-gray-500 dark:placeholder-gray-400 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                onChange={(e) => handleRoomChange(e.target.value)}
                onClick={(e) => handleRoomChange(e.target.value)}>
                {houseData && houseData.length > 0 && houseData.map((house) => (
                  <Fragment key={house.houseId}>
                    {house.houseId == currentHouseId && house.rooms.map((r) => (
                      <Fragment key={r.id}>
                        <option className="text-start" value={r.id}>Phòng {r.numberRoom}</option>
                      </Fragment>
                    ))}
                  </Fragment>
                ))}
              </select>
            </div>
            <div className=" w-full flex justify-end bg-white">
              <ul className="my-2">
                <li className="font-bold cursor-pointer px-5 mx-2 py-3 inline text-sm font-medium text-center text-white rounded-lg bg-[#26B99A] hover:bg-green-800"
                  onClick={() => {
                    setshowModalOrder(true)
                    setstatusModalOrder(true)
                    setform((form) => ({
                      ...form,
                      "roomId": currentRoomId,
                    }));
                  }}>
                  <button className="flex inline-flex items-center px-4">
                    Thêm dịch vụ <BsFillPatchPlusFill size={15} className="inline ml-3" />
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <table className="w-full text-sm text-center rtl:text-right text-[black] font-mono">
            <thead className="text-base text-[white] uppercase bg-[#059669]">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Số chỉ điện sử dụng
                </th>
                <th scope="col" className="px-6 py-3">
                  Số chỉ nước sử dụng
                </th>
                <th scope="col" className="px-6 py-3">
                  Tháng
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="text-base font-medium">
              {waterData.orders != null && waterData.orders.length > 0 ? (
                waterData.orders.map((order) => (
                  <Fragment key={order.orderId}>
                    <tr className="bg-white hover:bg-[#0000000d] border-b border-gray-400">
                      <td className="px-6 py-4">
                        {order.electricity} <span>chỉ</span>
                      </td>
                      <td className="px-6 py-4">
                        {order.water} <span>chỉ</span>
                      </td>
                      <td className="px-6 py-4">
                        {new Date(order.paymentDate).toLocaleString('en-US', {
                          month: '2-digit',
                        })}
                      </td>
                      <td className="px-6 py-4">
                        {/*  */}
                        <button className={(order.statusPayment == 'Y' || order.statusPayment == 'P' || new Date().getMonth() + 1 != new Date(order.paymentDate).getMonth() + 1) ? "font-medium text-blue-600 dark:text-blue-500 hover:underline pointer-events-none opacity-25" : "font-medium text-blue-600 dark:text-blue-500 hover:underline"}
                          onClick={() => {
                            setDataFromById(order.orderId)
                            setshowModalOrder(true)
                            setstatusModalOrder(false)
                          }}>Edit</button>
                      </td>
                    </tr>
                  </Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center">
                    {waterData.orders === null ? 'Loading...' : 'Chưa có đơn đặt cho phòng này.'}
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>

      {/* order modal */}
      {showModalOrder ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative p-10 " style={{ width: '1000px' }}>
              <div className="relative bg-white rounded-lg shadow shadow-black">
                <div className="flex items-center justify-between py-5 mx-4 border-b border-[#0000002e] rounded-t">
                  <h3 className="text-xl font-semibold text-black">
                    {!statusModalOrder ? "Sửa thông tin điện nước" : "Thêm điện nước cho phòng"}
                  </h3>
                  <button onClick={() => {
                    setshowModalOrder(false)
                    setDefalutFormOrder();
                  }} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="p-4 md:p-5">
                  <div className="grid grid-rows- gap-4">
                    <div className="grid grid-cols-5 gap-4">
                      <label htmlFor="electricity" className="block mb-2 text-sm font-medium text-black">
                        Số chỉ điện
                      </label>
                      <input type="number" name="electricity" id="electricity"
                        className={`bg-white border ${!formOrderValidate.electricity ? 'border-red-500' : 'border-gray-300'} focus:border-black text-black text-sm rounded-lg  block w-full p-2.5 dark:placeholder-gray-400`}
                        placeholder="Nhập số chỉ điện"
                        required="" value={form.electricity}
                        onChange={handleInputChange}
                        onClick={handleInputChange}
                      />

                    </div>

                    <div className="grid grid-cols-5 gap-4">
                      <label htmlFor="electricity" className="block mb-2 text-sm font-medium text-black">
                        Số chỉ nước
                      </label>
                      <input type="number" name="water" id="water"
                        className={`bg-white border ${!formOrderValidate.water ? 'border-red-500' : 'border-gray-300'} focus:border-black text-black text-sm rounded-lg  block w-full p-2.5 dark:placeholder-gray-400`}
                        placeholder="Nhập số chỉ nước"
                        required="" value={form.water}
                        onChange={handleInputChange}
                        onClick={handleInputChange}
                      />
                    </div>
                  </div>
                  {statusModalOrder ? (
                    <button type="submit" className="mt-10 text-white inline-flex items-center bg-[#26B99A] hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-blue-800">
                      <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path></svg>
                      Thêm dịch vụ điện nước
                    </button>
                  ) : (
                    <button type="submit" className="mt-10 text-white inline-flex items-center bg-blue-700 hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-blue-800">
                      <BsPencilSquare size={15} className="mr-2 inline" /> Cập nhật số điện nước
                    </button>
                  )}
                </form>
              </div>
            </div>
          </div>
        </>
      ) : null
      }


    </>
  )
}

export default ManagerWater
