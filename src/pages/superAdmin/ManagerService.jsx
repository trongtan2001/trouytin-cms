import { Title, DeleteConfirm } from "@/components"
import React, { useState, useEffect } from "react"
import {
    BsPencilSquare,
    BsFillTrashFill,
    BsFillPatchPlusFill,
} from "react-icons/bs"
import { getServiceHouse, getServiceHouseById, addServiceHouse, updateServiceHouse, updateServiceRoom, deleteServiceHouse } from "@/apis/supperAdmin/serviceHouse/serviceHouse"
import { getListHouse } from "@/apis/supperAdmin/house/house"
import { getServiceRoomById } from "@/apis/supperAdmin/room/room"
import axios from "axios"
import { toast } from "react-toastify"
import { Fragment } from "react"
const ManagerService = () => {
    const [showModalService, setshowModalService] = useState(false);
    const [statusModalService, setstatusModalService] = useState(false);

    const [showModalServiceRoom, setshowModalServiceRoom] = useState(false);
    const [statusModalServiceRoom, setstatusModalServiceRoom] = useState(false);
    const [showModalDelete, setshowModalDelete] = useState(false);
    const [messageDelete, setmessageDelete] = useState("");

    const [typeDelete, setTypeDelete] = useState({
        type: "",
        id: 0
    });

    const [serviceHouseData, setServiceHouseData] = useState([]);
    const [serviceRoomData, setServiceRoomData] = useState([]);
    const [houseData, setHouseData] = useState([]);
    const [currentHouseId, setCurrentHouseId] = useState(null);
    const [currentRoomId, setCurrentRoomId] = useState(null);

    // handle check for room service
    const [checkedEditRoomServiceIds, setCheckedEditRoomServiceIds] = useState([]);

    const handleCheckboxEditRoomServiceChange = (event) => {
        const checkboxId = event.target.id;

        // Check if the checkbox is checked or unchecked
        if (event.target.checked) {
            // Add the ID to the list
            setCheckedEditRoomServiceIds((prevIds) => prevIds.filter((id) => id != checkboxId));
            setCheckedEditRoomServiceIds((prevIds) => [...prevIds, Number(checkboxId)]);
        } else {
            // Remove the ID from the list
            setCheckedEditRoomServiceIds((prevIds) => prevIds.filter((id) => id != checkboxId));
        }
    };

    const handleCheckboxEditRoomServiceCheckAll = (event) => {
        if (event.target.checked) {
            serviceHouseData.forEach(src => {
                setCheckedEditRoomServiceIds((prevIds) => prevIds.filter((id) => id != src.serviceId));
                setCheckedEditRoomServiceIds((prevIds) => [...prevIds, src.serviceId]);
            })
        }
        else {
            setCheckedEditRoomServiceIds([])
        }

    }
    // handle check for service
    const [checkedServiceIds, setCheckedServiceIds] = useState([]);

    const handleCheckboxServiceChange = (event) => {
        const checkboxId = event.target.id;

        // Check if the checkbox is checked or unchecked
        if (event.target.checked) {
            // Add the ID to the list
            setCheckedServiceIds((prevIds) => prevIds.filter((id) => id != checkboxId));
            setCheckedServiceIds((prevIds) => [...prevIds, Number(checkboxId)]);
        } else {
            // Remove the ID from the list
            setCheckedServiceIds((prevIds) => prevIds.filter((id) => id != checkboxId));
        }
    };

    const handleCheckboxServiceCheckAll = (event) => {
        if (event.target.checked) {
            serviceHouseData.forEach(src => {
                setCheckedServiceIds((prevIds) => prevIds.filter((id) => id != src.serviceId));
                setCheckedServiceIds((prevIds) => [...prevIds, src.serviceId]);
            })
        }
        else {
            setCheckedServiceIds([])
        }

    }

    const [form, setform] = useState({
        "serviceId": "",
        "serviceName": "",
        "servicePrice": 0,
    })

    const [formServiceValidate, setFormServiceValidate] = useState({
        "serviceName": true,
        "servicePrice": true,
    })

    const validateService = () => {
        const newValidity = {
            "serviceName": form.serviceName !== null && form.serviceName.trim() !== '',
            "servicePrice": form.servicePrice !== null && form.servicePrice !== 0,
        };
        // Update the validity state for all fields
        setFormServiceValidate(newValidity);

        // Return true if all fields are valid, false otherwise
        return Object.values(newValidity).every((valid) => valid);
    };

    const fillDataFrom = (data) => {
        setform({
            "serviceId": data.serviceId,
            "serviceName": data.serviceName,
            "servicePrice": data.servicePrice,
        })
    }

    const setDefaultForm = () => {
        setform({
            "serviceId": "",
            "serviceName": null,
            "servicePrice": 0,
        })

        setFormServiceValidate({
            "serviceName": true,
            "servicePrice": true,
        })
    }

    var [callApi, setcallApi] = useState(true);

    useEffect(() => {
        getServiceHouse().then(response => {
            setServiceHouseData(response);
        }).catch(error => {
            // Handle any errors that occurred during the request
            console.error(error);
        });

        getListHouse().then(house => {
            // Handle the response data here
            if(house && house.length > 0){
                setHouseData(house);
                setCurrentHouseId(currentHouseId ? currentHouseId : house[0].houseId)
                setCurrentRoomId(currentRoomId ? currentRoomId : house[0].rooms[0].id)
                reloadRoomService(currentRoomId ? currentRoomId : house[0].rooms[0].id)
            }
        }).catch(error => {
            // Handle any errors that occurred during the request
            console.error(error);
        });

    }, [callApi]);

    const reLoad = () => {
        setcallApi(!callApi)
    }

    const reloadRoomService = (value) => {

        getServiceRoomById(value).then(response => {
            // Handle the response data here
            setServiceRoomData(response);
        }).catch(error => {
            // Handle any errors that occurred during the request
            console.error(error);
        });
    }

    const setDataFromById = (id) => {
        getServiceHouseById(id).then(response => {
            fillDataFrom(response)
        }).catch(err => {
            console.error(err);
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(form);
        if (validateService()) {
            if (form.serviceId != '') {
                // edit
                updateServiceHouse(form.serviceId, form).then(response => {
                    // Handle the response data here
                    if (!response.success) {
                        toast.error(response.message)
                    } else {
                        toast.success(response.message)
                    }
                }).finally(() => {
                    reLoad();
                    setDefaultForm();
                });
            } else {
                addServiceHouse(form).then(response => {
                    // Handle the response data here
                    if (!response.success) {
                        toast.error(response.message)
                    } else {
                        toast.success(response.message)
                    }
                }).finally(() => {
                    reLoad();
                    setDefaultForm();
                });
            }
            setshowModalService(!showModalService)
        }
        else {
            // If validation fails, display an error message or alert
            alert("Vui lòng nhập đầy đủ thông tin trước khi gửi !");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // Update the corresponding property in the person state
        setform((form) => ({
            ...form,
            [name]: value,
        }));

        setFormServiceValidate((formServiceValidate) => ({
            ...formServiceValidate,
            [name]: value != 0 && value.trim() !== '',
        }));
    };

    const handleHouseChange = (value) => {
        // Update the corresponding property in the person state
        setCurrentHouseId(value)
        houseData.forEach(house => {
            if (house.houseId == value) {
                console.log(house.rooms[0].id);
                reloadRoomService(house.rooms[0].id)
            }
        })
    };

    const handleRoomChange = (value) => {
        // Update the corresponding property in the person state
        reloadRoomService(value)
        setCurrentRoomId(value)
    };

    const handleSubmitEditServiceRoom = () => {
        updateServiceRoom(currentRoomId, checkedEditRoomServiceIds).then(response => {
            // Handle the response data here
            reLoad()
            if (!response.success) {
                toast.error(response.message)
            } else {
                toast.success(response.message)
            }
            setCheckedEditRoomServiceIds([])
            setshowModalServiceRoom(!showModalServiceRoom)
        }).catch(error => {
            // Handle any errors that occurred during the request
            alert(error.response.message)
        });
    }

    const confirmDelete = (status, type) => {
        if (status) {
            //delete service
            console.log(checkedServiceIds);
            deleteServiceHouse(checkedServiceIds).then(response => {
                // Handle the response data here
                if (!response.success) {
                    toast.error(response.message)
                } else {
                    toast.success(response.message)
                }
                reLoad()
                setCheckedServiceIds([])
            }).catch(error => {
                // Handle any errors that occurred during the request
                alert(error.response.message)
            });
        }
        setshowModalDelete(false)
    }

    return (
        <>
            <section className="mb-[20px]">
                <Title title="Quản lý dịch vụ phòng"></Title>
            </section>

            <div className="px-4">
                {/* HOUSE SERVICE MANAGE SEPERATE */}
                <div className="overflow-x-auto shadow-md sm:rounded-lg mt-2 border border-[#e2e1e1]">
                    {/* HEADER */}
                    <div className="pb-4 bg-white dark:bg-white-900 px-4 py-4">
                        <div className="flex justify-between items-stretch bg-white dark:bg-white-900">
                            <span className="my-2 text-lg font-semibold self-center">Quản lý dịch vụ</span>
                            <ul className="my-2 self-center">
                                <li className="font-bold cursor-pointer px-5 mx-2 py-3 inline text-sm font-medium text-center text-white rounded-lg bg-[#26B99A] hover:bg-green-800"
                                    onClick={() => {
                                        setshowModalService(true)
                                        setstatusModalService(true)
                                    }}>
                                    <button className="flex inline-flex items-center px-4">
                                        Thêm dịch vụ <BsFillPatchPlusFill size={15} className="inline ml-3" />
                                    </button>
                                </li>
                                <li className="font-bold cursor-pointer px-5 mx-2 py-3 inline text-sm font-medium text-center text-white rounded-lg bg-[red] hover:bg-red-800"
                                    onClick={() => {
                                        setTypeDelete({
                                            type: "service",
                                            id: 0
                                        })
                                        setmessageDelete("Xóa dịch vụ này sẽ xóa tất cả thông tin dịch vụ liên quan đến nhà có đăng ký dịch vụ này này bạn có muốn tiếp tục ?")
                                        setshowModalDelete(true)
                                    }}>
                                    <button>Xóa dịch vụ <BsFillTrashFill size={15} className="ml-1 inline" /></button>
                                </li>
                            </ul>
                        </div>
                    </div>
                    {/* TABLE HOUSE SERVICE */}
                    <table className="w-full text-sm text-center rtl:text-right text-[black] font-mono">
                        <thead className="text-base text-[white] uppercase bg-[#059669]">
                            <tr>
                                <th scope="col" className="p-4">
                                    <div className="flex items-center">
                                        <input id="checkbox-all-search" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                            onClick={handleCheckboxServiceCheckAll}
                                            onChange={handleCheckboxServiceCheckAll}
                                            checked={checkedServiceIds.length == serviceHouseData.length}
                                            defaultChecked={false} />
                                        <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Tên dịch vụ
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Giá dịch vụ
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="text-base font-medium">
                            {serviceHouseData && serviceHouseData.length > 0 && serviceHouseData.map((service) =>
                                <Fragment key={service.serviceId}>
                                    <tr className="bg-white hover:bg-[#0000000d] border-b border-gray-400">
                                        <td className="w-4 p-4">
                                            <div className="flex items-center">
                                                <input id={service.serviceId} type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                    onClick={handleCheckboxServiceChange}
                                                    onChange={handleCheckboxServiceChange}
                                                    checked={checkedServiceIds.includes(Number(service.serviceId))}
                                                    defaultChecked={false} />
                                                <label htmlFor="checkbox-table-3" className="sr-only">checkbox</label>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {service.serviceName}
                                        </td>
                                        <td className="px-6 py-4">
                                            {new Intl.NumberFormat('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND',
                                            }).format(parseInt(service.servicePrice))}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="font-medium text-blue-600 dark:text-blue-500 hover:underline" onClick={() => {
                                                setDataFromById(service.serviceId)
                                                setshowModalService(true)
                                                setstatusModalService(false)
                                            }}>Edit</button>
                                        </td>
                                    </tr>
                                </Fragment>)}
                        </tbody>
                    </table>
                </div>
                {/* LINE SEPERATE */}
                <div className=" border-b border-[#0000003b] m-7">
                </div>
                {/* ROOM SERVICE MANAGE */}
                <div className="overflow-x-auto shadow-md sm:rounded-lg mt-2 border border-[#e2e1e1] mb-4">
                    {/* HEADER */}
                    <div className="pb-4 bg-white dark:bg-white-900 px-4 py-4">
                        <div className="flex justify-between items-stretch bg-white dark:bg-white-900">
                            <div className="my-2 text-lg font-semibold self-center">
                                <span>Quản lý dịch vụ phòng :</span>
                                <select className=" ml-4 bg-white border border-gray-300 text-black text-center text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 py-2 px-4 dark:border-gray-500 dark:placeholder-gray-400 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    onChange={(e) => handleHouseChange(e.target.value)}>
                                    {houseData && houseData.length > 0 && houseData.map(house => (
                                        <Fragment key={house.houseId}>
                                            <option className="text-start" value={house.houseId}>{house.houseName}</option>
                                        </Fragment>
                                    ))}
                                </select>
                                <select className=" ml-4 bg-white border border-gray-300 text-black text-center text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 py-2 px-4 dark:border-gray-500 dark:placeholder-gray-400 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    onChange={(e) => handleRoomChange(e.target.value)}>
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

                            <ul className="my-2 self-center">
                                <li className="inline"
                                    onClick={() => {
                                        setshowModalServiceRoom(true)
                                        setstatusModalServiceRoom(true)
                                    }}>
                                    <button className="flex inline-flex items-center px-4 font-bold cursor-pointer px-5 mx-2 py-3 inline text-sm font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-900">
                                        Thay đổi hoặc xóa dịch vụ phòng<BsPencilSquare size={15} className="ml-1 inline" />
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                    {/* TABLE ROOM SERVICE */}
                    <table className="w-full text-sm text-center rtl:text-right text-[black] font-mono">
                        <thead className="text-base text-[white] uppercase bg-[#059669]">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Tên dịch vụ
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Giá dịch vụ
                                </th>
                            </tr>
                        </thead>
                        <tbody className="text-base font-medium">
                            {serviceRoomData.length > 0 ? (
                                serviceRoomData.map((service) => (
                                    <Fragment key={service.serviceHouse.serviceId}>
                                        <tr className="bg-white hover:bg-[#0000000d] border-b border-gray-400">
                                            <td className="px-6 py-4">
                                                {service.serviceHouse.serviceName}
                                            </td>
                                            <td className="px-6 py-4">
                                                {new Intl.NumberFormat('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND',
                                                }).format(parseInt(service.serviceHouse.servicePrice))}
                                            </td>
                                        </tr>
                                    </Fragment>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center">
                                        Phòng này chưa đăng ký dịch vụ nào
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div >

            {/* MODEL SERVICE HOUSE*/}
            {
                showModalService ? (
                    <>
                        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                            <div className="relative p-10 " style={{ width: '1000px' }}>
                                <div className="relative bg-white rounded-lg shadow shadow-black">
                                    <div className="flex items-center justify-between py-5 mx-4 border-b border-[#0000002e] rounded-t">
                                        <h3 className="text-xl font-semibold text-black">
                                            {!statusModalService ? "Sửa thông tin dịch vụ" : "Thêm dịch vụ"}
                                        </h3>
                                        <button onClick={() => {
                                            setshowModalService(false)
                                            setDefaultForm()
                                        }} type="button" className="text-black bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                            </svg>
                                        </button>
                                    </div>
                                    <form onSubmit={handleSubmit} className="p-4 md:p-5">
                                        <div className="grid grid-rows- gap-4">
                                            <div className="grid grid-cols-5 gap-4">
                                                <label htmlFor="serviceName" className="block mb-2 text-sm font-medium text-black">
                                                    Tên dịch vụ
                                                </label>
                                                <input type="text" name="serviceName" id="serviceName"
                                                    className={`bg-white border ${!formServiceValidate.serviceName ? 'border-red-500' : 'border-gray-300'} focus:border-black text-black text-sm rounded-lg  block w-full p-2.5 dark:placeholder-gray-400`}
                                                    placeholder="Nhập tên dịch vụ"
                                                    required="" value={form.serviceName}
                                                    onChange={handleInputChange}
                                                    onClick={handleInputChange}
                                                />

                                            </div>

                                            <div className="grid grid-cols-5 gap-4">
                                                <label htmlFor="servicePrice" className="block mb-2 text-sm font-medium text-black">
                                                    Giá dịch vụ
                                                </label>
                                                <input type="number" name="servicePrice" id="servicePrice"
                                                    className={`bg-white border ${!formServiceValidate.servicePrice ? 'border-red-500' : 'border-gray-300'} focus:border-black text-black text-sm rounded-lg  block w-full p-2.5 dark:placeholder-gray-400`}
                                                    placeholder="Nhập giá dịch vụ"
                                                    required="" value={form.servicePrice}
                                                    onChange={handleInputChange}
                                                    onClick={handleInputChange}
                                                />

                                            </div>

                                        </div>
                                        {statusModalService ? (
                                            <button type="submit" className="mt-10 text-white inline-flex items-center bg-[#26B99A] hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-blue-800">
                                                <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path></svg>
                                                Thêm dịch vụ
                                            </button>
                                        ) : (
                                            <button type="submit" className="mt-10 text-white inline-flex items-center bg-[#26B99A] hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-blue-800">
                                                <BsPencilSquare size={15} className="mr-2 inline" /> Cập nhật thông tin dịch vụ
                                            </button>
                                        )}
                                    </form>
                                </div>
                            </div>
                        </div>
                    </>
                ) : null
            }

            {/* MODEL SERVICE ROOM */}
            {
                showModalServiceRoom ? (
                    <>
                        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                            <div className="relative p-10 " style={{ width: '1000px' }}>
                                <div className="relative bg-white rounded-lg shadow shadow-black">
                                    <div className="flex items-center justify-between py-5 mx-4 border-b border-[#0000002e] rounded-t">
                                        <h3 className="text-xl font-semibold text-black">
                                            Sửa dịch vụ phòng
                                        </h3>
                                        <button onClick={() => {
                                            setshowModalServiceRoom(false)
                                        }} type="button" className="text-black bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="px-10 py-4 flex ">
                                        <table className="w-full text-sm text-[black] font-mono">
                                            <thead className="text-base text-[white] uppercase bg-[#059669] ">
                                                <tr className="">
                                                    <th scope="col" className="p-4">
                                                        <div className="flex items-center">
                                                            <input id="checkbox-all-search" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                                onClick={handleCheckboxEditRoomServiceCheckAll}
                                                                onChange={handleCheckboxEditRoomServiceCheckAll}
                                                                defaultChecked={false}
                                                                checked={checkedEditRoomServiceIds.length == serviceHouseData.length} />
                                                            <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>
                                                        </div>
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-start">
                                                        Tên dịch vụ
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-start">
                                                        Giá dịch vụ
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-base font-medium text-start">
                                                {serviceHouseData && serviceHouseData.length > 0 && serviceHouseData.map((service) =>
                                                    <Fragment key={service.serviceId}>
                                                        <tr className="bg-white hover:bg-[#0000000d] border-b border-gray-400">
                                                            <td className="w-4 p-4">
                                                                <div className="flex items-center">
                                                                    <input id={service.serviceId} type="checkbox"
                                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                                        onClick={handleCheckboxEditRoomServiceChange}
                                                                        onChange={handleCheckboxEditRoomServiceChange}
                                                                        defaultChecked={false}
                                                                        checked={checkedEditRoomServiceIds.includes(Number(service.serviceId))}
                                                                    />
                                                                    <label htmlFor="checkbox-table-3" className="sr-only">checkbox</label>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                {service.serviceName}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                {service.servicePrice}
                                                            </td>
                                                        </tr>
                                                    </Fragment>)}
                                            </tbody>
                                        </table>
                                        <div className="flex-col">
                                            <div className="flex">
                                                <select className="self-start ml-4 bg-white border border-gray-300 text-black text-center text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 py-2 px-4 dark:border-gray-500 dark:placeholder-gray-400 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                    onChange={(e) => handleHouseChange(e.target.value)}
                                                    value={currentHouseId}>
                                                    {houseData.map(house => (
                                                        <Fragment key={house.houseId}>
                                                            <option className="text-start" value={house.houseId}>{house.houseName}</option>
                                                        </Fragment>
                                                    ))}
                                                </select>
                                                <select className="self-start ml-4 bg-white border border-gray-300 text-black text-center text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 py-2 px-4 dark:border-gray-500 dark:placeholder-gray-400 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                    onChange={(e) => handleRoomChange(e.target.value)}
                                                    value={currentRoomId}>
                                                    {houseData.map((house) => (
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
                                            <div className="px-4 py-4">
                                                <span className="underline underline-offset-4">Note :</span>
                                                <span className="text-[#000000ad]">
                                                    Thay đổi dịch vụ phòng <br /> bằng cách tick chọn những dịch vụ trong bảng dịch vụ có sẵn của nhà. <br /> Nếu không chọn sẽ xóa hết dịch vụ phòng.
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={handleSubmitEditServiceRoom} className="my-4 mx-4 text-white inline-flex items-center bg-[#26B99A] hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-blue-800">
                                        <BsPencilSquare size={15} className="mr-2 inline" /> Cập nhật dịch vụ cho phòng
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : null
            }

            {/* delete modal */}
            {showModalDelete ? (
                <DeleteConfirm message={messageDelete} onRegister={confirmDelete} type={typeDelete} />
            ) : null
            }

        </>
    )
}

export default ManagerService
