import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderBillById } from '@/apis/supperAdmin/order/order'
import path from "@/ultils/path"

const BillOrderPage = () => {
    var [callApi, setcallApi] = useState(true);
    const [billData, setBillData] = useState([]);
    const { orderId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        getOrderBillById(orderId).then((bill) => {
            console.log(bill);
            setBillData(bill)
        }).catch((error) => {
        })
    }, [callApi]);

    const reLoad = () => {
        setcallApi(!callApi)
    }

    return (
        <>
            <div className="bg-white border rounded-lg shadow-lg px-6 py-8 max-w-md mx-auto mt-8">
                <h1 className="font-bold text-2xl my-4 text-center text-green-600">Roomster Rent Bill</h1>
                <hr className="mb-2" />
                <div className="flex justify-between mb-6">
                    <h1 className="text-lg font-bold">Hóa đơn</h1>
                    <div className="text-gray-700">
                        <div>Ngày: {billData.datePayment}</div>
                        <div>Mã #: {billData.orderId}</div>
                    </div>
                </div>
                <div className="mb-8">
                    <h2 className="text-lg font-bold mb-4">Thông tin:</h2>
                    <div className="text-gray-700 mb-2">{billData.houseName}</div>
                    <div className="text-gray-700 mb-2">Phòng {billData.roomNumber}</div>
                    <div className="text-gray-700 mb-2">Địa chỉ : {billData.houseAddress}</div>
                </div>
                <table className="w-full mb-8">
                    <thead>
                        <tr>
                            <th className="text-left font-bold text-gray-700">Mô tả</th>
                            <th className="text-right font-bold text-gray-700">Giá</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="text-left text-gray-700">Tổng giá nước</td>
                            <td className="text-right text-gray-700">{new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                            }).format(parseInt(billData.waterPrice))}</td>
                        </tr>
                        <tr>
                            <td className="text-left text-gray-700">Tổng giá điện</td>
                            <td className="text-right text-gray-700">{new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                            }).format(parseInt(billData.electricPrice))}</td>
                        </tr>
                        <tr>
                            <td className="text-left text-gray-700">Tổng giá dịch vụ</td>
                            <td className="text-right text-gray-700">{new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                            }).format(parseInt(billData.servicePrice))}</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td className="text-left font-bold text-gray-700">Số tiền đã thanh toán</td>
                            <td className="text-right font-bold text-gray-700">{new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                            }).format(parseInt(billData.totalPayment))}</td>
                        </tr>
                        <tr>
                            <td className="text-left font-bold text-gray-700">Tổng tiền phòng</td>
                            <td className="text-right font-bold text-gray-700">{new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                            }).format(parseInt(billData.totalPrice))}</td>
                        </tr>
                        <tr>
                            <td className="text-left font-bold text-gray-700">Tổng số tiền phải thanh toán</td>
                            <td className="text-right font-bold text-gray-700">{new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                            }).format(parseInt(billData.totalPrice - billData.totalPayment))}</td>
                        </tr>
                    </tfoot>
                </table>
                <div className="text-gray-700 text-sm">Làm ơn hãy thanh toán trong vòng 30 ngày từ lúc nhận mail này</div>
                <h3 className="text-gray-700 mb-2 mt-2">Cảm ơn bạn đã lựa chọn Roomster!</h3>
            </div>

            <div className='font-semibold flex justify-center mt-8'>
                <button className='text-[white] bg-green-500 px-8 py-2 hover:bg-green-600 focus:outline-none focus:ring focus:border-blue-300 rounded'
                    onClick={() => {
                        navigate(`/${path.SUPER_ADMIN}/${path.MANAGER_PAYMENT}`)
                    }}>
                    Back
                </button>
            </div>
        </>


    );
};

export default BillOrderPage;