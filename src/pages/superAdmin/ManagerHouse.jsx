import { Title, DeleteConfirm } from "@/components"
import {
    BsFillPersonFill,
    BsPencilSquare,
    BsFillTrashFill,
    BsFillPatchPlusFill,
    BsFillHouseAddFill,
    BsArrowLeftRight,
    BsArrowClockwise,
} from "react-icons/bs"
import { Fragment, useState, useEffect } from "react"
import { getHouseBySearchCondition, getHouseById, addHouse, updateHouse, deleteHouse } from "@/apis/supperAdmin/house/house"
import { getRoomById, addRoom, updateRoom, deleteRoom } from "@/apis/supperAdmin/room/room"
import { getTenantById, addTenant, updateTenant, getTenantByRoomId, moveTenant, deleteTenant } from "@/apis/supperAdmin/tenant/tenant"
import { getCities, getWardesByDistrictId, getDistrictesByCityId } from "@/apis/common"
import { toast } from "react-toastify"

const ManagerHouse = () => {
    const [showModalHouse, setshowModalHouse] = useState(false);
    const [statusModalHouse, setstatusModalHouse] = useState(false);

    const [showModalRoom, setshowModalRoom] = useState(false);
    const [statusModalRoom, setstatusModalRoom] = useState(false);

    const [showModalManagerTenant, setshowModalManagerTenant] = useState(false);
    const [tenantData, setTenantData] = useState([]);
    const [currentTenanId, setCurrentTenanId] = useState(1);
    const [showShowModalMoveTenant, setShowModalMoveTenant] = useState(false);
    const [showModalTenant, setshowModalTenant] = useState(false);
    const [statusModalTenant, setstatusModalTenant] = useState(false);

    const [showModalDelete, setshowModalDelete] = useState(false);
    const [messageDelete, setmessageDelete] = useState("");

    const [typeDelete, setTypeDelete] = useState({
        type: "",
        id: 0
    });

    const [houseData, setHouseData] = useState([]);
    const [currentHouseId, setCurrentHouseId] = useState(null);
    const [currentRoomId, setCurrentRoomId] = useState(1);
    const [RoomMoveId, setRoomMoveId] = useState(0);
    const [HouseMoveId, setHouseMoveId] = useState(0);

    const [cityData, setCityData] = useState([]);
    const [currentCityId, setCurrentCityId] = useState(1);


    const [districtData, setDistrictData] = useState([]);
    const [currentDistrictId, setCurrentDistrictId] = useState(1);


    // handle loading
    const [isLoadingHouseAPI, setIsLoadingHouseAPI] = useState(false);

    const handleCityChange = (value) => {
        setCurrentCityId(value)
        getDistrictesByCityId(value).then(response => {
            console.log(response);
            setDistrictData(response)
        }).catch(err => {
            console.error(err);
        })
    };

    const [wardData, setWardData] = useState([]);
    const [currentWardId, setCurrentWardId] = useState(1);

    const handleWardChange = (value) => {
        setCurrentWardId(value)
        setFormHouse((formHouse) => ({
            ...formHouse,
            warnId: value,
        }));
        setFormHouseValidate((formHouse) => ({
            ...formHouse,
            warnId: value > 0,
        }));


    };

    const handleDistrictChange = (value) => {
        console.log(value);
        setCurrentDistrictId(value)
        getWardesByDistrictId(value).then(response => {
            console.log(response);
            setWardData(response)
        }).catch(err => {
            console.error(err);
        })
    };

    var [callApi, setcallApi] = useState(true);

    useEffect(() => {
        getCities().then(response => {
            setCityData(response)
        }).catch(err => {
            console.error(err);
        })

        handleSearchRoom()

    }, [callApi]);

    const reLoad = () => {
        setcallApi(!callApi)
    }
    // form instance
    const [formSearch, setSearchForm] = useState({
        "price": "",
        "stayMax": "",
        "acreage": "",
        "status": ""
    })

    const [formRoom, setFormRoom] = useState({
        "id": "",
        "numberRoom": null,
        "emptyRoom": 0,
        "stayMax": null,
        "acreage": null,
        "price": null,
        "electricityPrice": null,
        "waterPrice": null,
        "houseId": 1,
    })

    const [formRoomValidate, setFormRoomValidate] = useState({
        "numberRoom": true,
        "emptyRoom": true,
        "stayMax": true,
        "acreage": true,
        "price": true,
        "electricityPrice": true,
        "waterPrice": true,
    })

    const [formHouse, setFormHouse] = useState({
        "houseId": "",
        "houseName": null,
        "warnId": null,
        "address": null
    })

    const [formHouseValidate, setFormHouseValidate] = useState({
        "houseName": true,
        "warnId": true,
        "address": true
    })

    const [formTenant, setFormTenant] = useState({
        "id": "",
        "name": "",
        "age": 0,
        "gender": "Nam",
        "phoneNumber": "",
        "identifier": "",
        "email": "",
        "idRoom": ""
    })

    const [formTenantValidate, setFormTenantValidate] = useState({
        "name": true,
        "age": true,
        "gender": true,
        "phoneNumber": true,
        "identifier": true,
        "email": true,
    })

    const setDefalutFormSearch = () => {
        setSearchForm({
            "price": "",
            "stayMax": "",
            "acreage": "",
            "status": ""
        })
    }

    const setDefalutFormRoom = () => {
        setFormRoom({
            "id": "",
            "numberRoom": null,
            "emptyRoom": 0,
            "stayMax": null,
            "acreage": null,
            "price": null,
            "electricityPrice": null,
            "waterPrice": null,
            "houseId": currentHouseId,
        })

        setFormRoomValidate({
            "numberRoom": true,
            "emptyRoom": 0,
            "stayMax": true,
            "acreage": true,
            "price": true,
            "electricityPrice": true,
            "waterPrice": true,
            "houseId": 1,
        })
    }

    const setDefalutFormHouse = () => {
        setFormHouse({
            "houseId": "",
            "houseName": null,
            "warnId": currentWardId,
            "address": null
        })
        setFormHouseValidate({
            "houseName": true,
            "warnId": true,
            "address": true
        })
    }

    const setDefalutFormTenant = () => {
        setFormTenant({
            "id": "",
            "name": "",
            "age": "",
            "gender": "",
            "phoneNumber": "",
            "identifier": "",
            "email": "",
            "idRoom": currentRoomId
        })

        setFormTenantValidate({
            "name": true,
            "age": true,
            "gender": true,
            "phoneNumber": true,
            "identifier": true,
            "email": true,
        })
    }

    // fill data to form
    const fillDataFormRoom = (data) => {
        setFormRoom({
            "id": data.id,
            "numberRoom": data.numberRoom,
            "emptyRoom": data.emptyRoom,
            "stayMax": data.stayMax,
            "acreage": data.acreage,
            "price": data.price,
            "electricityPrice": data.electricityPrice,
            "waterPrice": data.waterPrice,
            "houseId": data.houseId,
        })
    }

    const fillDataFormHouse = (data) => {
        handleCityChange(data.cityId)
        handleDistrictChange(data.districtId)
        handleWardChange(data.warnId)
        setFormHouse({
            "houseId": data.houseId,
            "houseName": data.houseName,
            "warnId": data.warnId,
            "address": data.address
        })
    }

    const fillDataFormTenant = (data) => {
        setFormTenant({
            "id": data.id,
            "name": data.name,
            "age": data.age,
            "gender": data.gender,
            "phoneNumber": data.phoneNumber,
            "identifier": data.identifier,
            "email": data.email,
            "idRoom": data.idRoom
        })
    }

    // call api to get data and set to form
    const setDataFormRoomById = (id) => {
        getRoomById(id).then(response => {
            console.log(response);
            fillDataFormRoom(response)
        }).catch(err => {
            console.error(err);
        })
    }

    const setDataFormHouseById = (id) => {
        getHouseById(id).then(response => {
            console.log(response);
            fillDataFormHouse(response)
        }).catch(err => {
            console.error(err);
        })
    }

    const setDataFormTenantById = (id) => {
        getTenantById(id).then(response => {
            console.log(response);
            fillDataFormTenant(response)
        }).catch(err => {
            console.error(err);
        })
    }

    // handle search room
    const handleSearchRoom = () => {
        // Create an object to store non-empty parameters
        const queryParams = {};

        // Add non-empty parameters to the object
        if (formSearch.price !== "") {
            queryParams.price = formSearch.price;
        }

        if (formSearch.stayMax !== "") {
            queryParams.stayMax = formSearch.stayMax;
        }

        if (formSearch.acreage !== "") {
            queryParams.acreage = formSearch.acreage;
        }

        if (formSearch.status !== "") {
            queryParams.status = formSearch.status;
        }

        // Convert the object to query parameters
        const queryString = new URLSearchParams(queryParams).toString();
        console.log(queryString);
        getHouseBySearchCondition(queryString).then(response => {
            // Handle the response data here
            setHouseData(response);
            setCurrentHouseId(currentHouseId ? currentHouseId : response[0].houseId)
            console.log(currentHouseId);
            handleHouseMoveChange(response[0].houseId)
        }).catch(error => {
            // Handle any errors that occurred during the request
            console.error(error);
        });
    };

    // validate
    const validateHouse = () => {
        const newValidity = {
            "houseName": formHouse.houseName !== null && formHouse.houseName.trim() !== '',
            "warnId": formHouse.warnId !== null && formHouse.warnId > 0,
            "address": formHouse.address !== null && formHouse.address.trim() !== '',
        };
        // Update the validity state for all fields
        setFormHouseValidate(newValidity);

        // Return true if all fields are valid, false otherwise
        return Object.values(newValidity).every((valid) => valid);
    };

    const validateRoom = () => {
        const newValidity = {
            "numberRoom": formRoom.numberRoom !== null && formRoom.numberRoom != 0,
            "stayMax": formRoom.stayMax !== null && formRoom.stayMax != 0,
            "acreage": formRoom.acreage !== null && formRoom.acreage != 0,
            "price": formRoom.price !== null && formRoom.price != 0,
            "electricityPrice": formRoom.electricityPrice !== null && formRoom.electricityPrice != 0,
            "waterPrice": formRoom.waterPrice !== null && formRoom.waterPrice != 0,

        };
        // Update the validity state for all fields
        setFormRoomValidate(newValidity);

        // Return true if all fields are valid, false otherwise
        return Object.values(newValidity).every((valid) => valid);
    };

    const validateTenant = () => {
        const newValidity = {
            "name": formTenant.name !== null && formTenant.name.trim() !== '',
            "age": formTenant.age !== null && formTenant.age != 0,
            "gender": formTenant.gender !== null && formTenant.gender.trim() !== '',
            "phoneNumber": formTenant.phoneNumber !== null && formTenant.phoneNumber.trim() !== '',
            "identifier": formTenant.identifier !== null && formTenant.identifier.trim() !== '',
            "email": formTenant.email !== null && formTenant.email.trim() !== '',
        };
        // Update the validity state for all fields
        setFormTenantValidate(newValidity);
        // Return true if all fields are valid, false otherwise
        return Object.values(newValidity).every((valid) => valid);
    };

    // handle submit form
    const handleSubmitSearch = (e) => {
        e.preventDefault();
        handleSearchRoom()
    };

    const handleSubmitRoom = (e) => {
        e.preventDefault();
        console.log(formRoom);
        if (validateRoom()) {
            if (formRoom.id != '') {
                // edit
                updateRoom(formRoom.id, formRoom).then(response => {
                    if (!response.success) {
                        toast.error(response.message)
                    } else {
                        toast.success(response.message)
                    }
                }).finally(() => {
                    reLoad()
                    setshowModalRoom(!showModalRoom)
                    setDefalutFormRoom()
                });
            } else {
                addRoom(formRoom).then(response => {
                    // Handle the response data here
                    if (!response.success) {
                        toast.error(response.message)
                    } else {
                        toast.success(response.message)
                    }
                }).finally(() => {
                    reLoad()
                    setshowModalRoom(!showModalRoom)
                    setDefalutFormRoom()
                });
            }
            setshowModalRoom(!showModalRoom)
        }
        else {
            toast.info("Vui lòng nhập đầy đủ thông tin trước khi gửi !");
        }
    };

    const handleSubmitHouse = (e) => {
        e.preventDefault();
        if (validateHouse()) {
            if (formHouse.houseId != '') {
                // edit
                setIsLoadingHouseAPI(true)
                updateHouse(formHouse.houseId, formHouse).then(response => {
                    // Handle the response data here
                    console.log(response);
                    if (!response.success) {
                        toast.error(response.message)
                    } else {
                        toast.success(response.message)
                    }
                }).finally(() => {
                    reLoad()
                    setshowModalHouse(!showModalHouse)
                    setDefalutFormHouse()
                    setIsLoadingHouseAPI(false)
                });
            } else {
                setIsLoadingHouseAPI(true)
                addHouse(formHouse).then(response => {
                    // Handle the response data here
                    if (!response.success) {
                        toast.error(response.message)
                    } else {
                        toast.success(response.message)
                    }
                }).finally(() => {
                    reLoad()
                    setshowModalHouse(!showModalHouse)
                    setDefalutFormHouse()
                    setIsLoadingHouseAPI(false)
                });
            }
            setshowModalHouse(!showModalHouse)
        }
        else {
            // If validation fails, display an error message or alert
            toast.info("Vui lòng nhập đầy đủ thông tin trước khi gửi !");
        }
    };

    const handleSubmitTenant = (e) => {
        e.preventDefault();
        if (validateTenant()) {
            if (formTenant.id != '') {
                // edit
                updateTenant(formTenant.id, formTenant).then(response => {
                    // Handle the response data here
                    if (!response.success) {
                        toast.error(response.message)
                    } else {
                        toast.success(response.message)
                    }
                }).finally(() => {
                    reLoad()
                    reloadTenant(currentRoomId)
                    setDefalutFormTenant()
                });
            } else {
                addTenant(formTenant).then(response => {
                    // Handle the response data here
                    if (!response.success) {
                        toast.error(response.message)
                    } else {
                        toast.success(response.message)
                    }
                }).finally(() => {
                    reLoad()
                    reloadTenant(currentRoomId)
                    setDefalutFormTenant()
                });
            }
            setshowModalTenant(!showModalTenant)
        } else {
            // If validation fails, display an error message or alert
            toast.info("Vui lòng nhập đầy đủ thông tin trước khi gửi !");
        }
    };

    // handle input change
    const handleInputSearchChange = (e) => {
        const { name, value } = e.target;
        // Update the corresponding property in the person state
        setSearchForm((formSearch) => ({
            ...formSearch,
            [name]: value,
        }));
    };

    const handleInputHouseChange = (e) => {
        const { name, value } = e.target;
        // Update the corresponding property in the person state
        setFormHouse((formHouse) => ({
            ...formHouse,
            [name]: value,
        }));
        setFormHouseValidate((formHouseValidate) => ({
            ...formHouseValidate,
            [name]: value != 0 && value.trim() !== '',
        }));
    };

    const handleInputRoomChange = (e) => {
        const { name, value } = e.target;
        // Update the corresponding property in the person state
        setFormRoom((formRoom) => ({
            ...formRoom,
            [name]: value,
        }));
        setFormRoomValidate((formRoomValidate) => ({
            ...formRoomValidate,
            [name]: value != 0 && value.trim() !== '',
        }));
    };

    const handleInputTenantChange = (e) => {
        const { name, value } = e.target;
        // Update the corresponding property in the person state
        setFormTenant((formTenant) => ({
            ...formTenant,
            [name]: value,
        }));

        setFormTenantValidate((formTenantValidate) => ({
            ...formTenantValidate,
            [name]: value != 0 && value.trim() !== '',
        }));
    };

    // handle open tenant modal
    const handleOpenTenantModal = (id) => {
        handleRoomChange(id)
        setshowModalManagerTenant(true)
    };

    // handle house change
    const handleHouseChange = (value) => {
        console.log(value);
        setCurrentHouseId(value)
        setFormRoom((formRoom) => ({
            ...formRoom,
            "houseId": value,
        }));
        houseData.forEach(house => {
            if (house.houseId == value) {
                if (house.rooms.length > 0) {
                    handleRoomChange(house.rooms[0].id)
                }
                else {
                    setCurrentRoomId(null)
                }
            }
        })
    };

    // handle room change
    const handleRoomChange = (value) => {
        setCurrentRoomId(value)
        reloadTenant(value)
        setCurrentTenanId(value)
    };

    // handle house move change
    const handleHouseMoveChange = (value) => {
        setHouseMoveId(value)
        houseData.forEach(house => {
            if (house.houseId == value) {
                handleRoomMoveChange(house.rooms[0].id)
            }
        })
    };

    // handle room move change
    const handleRoomMoveChange = (value) => {
        setRoomMoveId(value)
    };

    const [checkedMoveTenantIds, setCheckedMoveTenantIds] = useState([]);

    const handleCheckboxMoveTenantChange = (event) => {
        const checkboxId = event.target.id;
        console.log(checkboxId);
        // Check if the checkbox is checked or unchecked
        if (event.target.checked) {
            // Add the ID to the list
            setCheckedMoveTenantIds((prevIds) => prevIds.filter((id) => id != checkboxId));
            setCheckedMoveTenantIds((prevIds) => [...prevIds, Number(checkboxId)]);
        } else {
            // Remove the ID from the list
            setCheckedMoveTenantIds((prevIds) => prevIds.filter((id) => id != checkboxId));
        }
    };

    const handleCheckboxMoveTenantCheckAll = (event) => {
        if (event.target.checked) {
            tenantData.forEach(src => {
                setCheckedMoveTenantIds((prevIds) => prevIds.filter((id) => id != src.id));
                setCheckedMoveTenantIds((prevIds) => [...prevIds, src.id]);
            })
        }
        else {
            setCheckedMoveTenantIds([])
        }

    }

    const reloadTenant = (value) => {
        if (value != null) {
            getTenantByRoomId(value).then(response => {
                // Handle the response data here
                console.log(response)
                setTenantData(response);
                setCheckedMoveTenantIds([])
            }).catch(error => {
                // Handle any errors that occurred during the request
                console.error(error);
            });
        }
        else {
            setTenantData([])
        }
    }

    const HandleSubmitMoveTenant = () => {
        if (checkedMoveTenantIds && checkedMoveTenantIds.length > 0) {
            moveTenant(RoomMoveId, checkedMoveTenantIds).then(response => {
                // Handle the response data here
                if (!response.success) {
                    toast.error(response.message)
                } else {
                    toast.success(response.message)
                }
                reloadTenant(currentRoomId)
                reLoad()
                setShowModalMoveTenant(!showShowModalMoveTenant)
                setCheckedMoveTenantIds([])
            });
        } else {
            toast.info("Chưa chọn khách nào !")
        }
    }

    const confirmDelete = (status, type) => {
        if (status) {
            //delete room
            if (type.type == 'room') {
                deleteRoom(type.id).then(response => {
                    if (!response.success) {
                        toast.error(response.message)
                    } else {
                        toast.success(response.message)
                    }
                }).finally(() => {
                    reLoad()
                    setshowModalDelete(false)
                    setTypeDelete({
                        type: "",
                        id: 0
                    })
                })
            }
            else if (type.type == 'house') {
                deleteHouse(type.id).then(response => {
                    if (!response.success) {
                        toast.error(response.message)
                    } else {
                        toast.success(response.message)
                    }
                }).finally(() => {
                    reLoad()
                    setshowModalDelete(false)
                    setTypeDelete({
                        type: "",
                        id: 0
                    })
                    setCurrentHouseId(null)
                })
            }
            else if (type.type == 'tenant') {
                console.log(checkedMoveTenantIds);
                if (checkedMoveTenantIds && checkedMoveTenantIds.length > 0) {
                    deleteTenant(checkedMoveTenantIds).then(response => {
                        if (!response.success) {
                            toast.error(response.message)
                        } else {
                            toast.success(response.message)
                        }
                    }).finally(() => {
                        reloadTenant(currentRoomId)
                        reLoad()
                        setshowModalDelete(false)
                        setTypeDelete({
                            type: "",
                            id: 0
                        })
                        setCheckedMoveTenantIds([])
                    })
                } else {
                    toast.info("Chưa chọn khách nào !")
                }
            }
        }
        setshowModalDelete(false)
    }

    return (
        <>
            {/* section title */}
            <section className="">
                <Title title="Quản lý nhà"></Title>
            </section>
            {/* body */}
            <div>
                <div>
                    {/* search */}
                    <div className='flex justify-between px-8 py-4 mt-4'>
                        <form className="flex" onSubmit={handleSubmitSearch}>
                            <div className="flex">
                                <div className="flex mx-2 self-center">
                                    <label htmlFor="price" className="text-sm font-medium text-black self-center mr-4">
                                        Giá :
                                    </label>
                                    <input type="number" name="price" id="price"
                                        className="self-center bg-white border-b border-gray-300 text-black text-sm focus:ring-primary-600 focus:border-primary-600 p-1 dark:border-gray-500 dark:placeholder-gray-400 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        placeholder="Nhập giá tìm kiếm"
                                        onChange={handleInputSearchChange}
                                        required="" value={formSearch.price}
                                    />
                                </div>
                                <div className="flex mx-2 self-center">
                                    <label htmlFor="acreage" className="text-sm font-medium text-black self-center mr-4">
                                        Diện tích :
                                    </label>
                                    <input type="number" name="acreage" id="acreage"
                                        className="w-1/2 self-center bg-white border-b border-gray-300 text-black text-sm focus:ring-primary-600 focus:border-primary-600 p-1 dark:border-gray-500 dark:placeholder-gray-400 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        placeholder="Nhập diện tích"
                                        onChange={handleInputSearchChange}
                                        required="" value={formSearch.acreage}
                                    />
                                </div>
                                <div className="flex mx-1 w-1/4 self-center">
                                    <label htmlFor="stayMax" className="text-sm font-medium text-black self-center mr-4">
                                        Số người ở tối đa :
                                    </label>
                                    <input type="number" name="stayMax" id="stayMax"
                                        className="w-1/4 self-center bg-white border-b border-gray-300 text-black text-sm p-1"
                                        placeholder="max"
                                        onChange={handleInputSearchChange}
                                        required="" value={formSearch.stayMax}
                                    />
                                </div>
                                <div className="flex mx-2 self-center">
                                    <label htmlFor="status" className="text-sm font-medium text-black self-center mr-4">
                                        Trạng thái :
                                    </label>
                                    <select
                                        name="status"
                                        id="status"
                                        className="w-2/4 self-center bg-white border-b border-gray-300 text-black text-sm p-1"
                                        onChange={handleInputSearchChange}
                                        value={formSearch.status}
                                    >
                                        <option value="">Tất cả</option>
                                        <option value="1">Đã thuê</option>
                                        <option value="0">Chưa thuê</option>
                                    </select>
                                </div>
                            </div>
                            <button className="font-bold cursor-pointer px-5 py-2 mr-3 inline text-sm font-medium text-center text-white rounded-lg bg-[#03c6fc] hover:bg-[#03a5fc]"
                                onClick={() => {
                                    setDefalutFormSearch();
                                }}>
                                <BsArrowClockwise size={20} />
                            </button>
                            <button type="submit" className="font-bold cursor-pointer px-5 py-2 mr-3 inline text-sm font-medium text-center text-white rounded-lg bg-[#26B99A] hover:bg-green-800">
                                Tìm kiếm
                            </button>
                        </form>
                    </div>
                    <div className="flex justify-center">
                        <div className=" border-b border-[#0000003b] m-2 mx-6 w-4/5">
                        </div>
                    </div>
                    {/* body data list */}
                    <div className='flex justify-between px-8 py-4'>
                        {/* house list */}
                        <ul className="self-center px-5 py-4 border-b-2 border-[#059669]">
                            {houseData && houseData.length > 0 && houseData.map((el) => (
                                <Fragment key={el.houseId}>
                                    <li className={currentHouseId == el.houseId ? "font-bold cursor-pointer py-2 px-2 mx-2 inline border-b-4 border-r-2 border-l-2 border-[#059669] shadow-md shadow-[#26B99A]" : "cursor-pointer  py-2  px-2 mx-2 inline hover:border-b-4 hover:border-[#059669] hover:shadow-md hover:shadow-[#26B99A]"}
                                        onClick={() => {
                                            setCurrentHouseId(el.houseId)
                                            setFormRoom((formRoom) => ({
                                                ...formRoom,
                                                "houseId": el.houseId,
                                            }));
                                        }}>
                                        {el.houseName}
                                    </li>
                                </Fragment>
                            ))}
                        </ul>
                        {/* buttons */}
                        <ul className="self-center ">
                            <li onClick={() => {
                                setshowModalRoom(true)
                                setstatusModalRoom(true)
                            }} className="inline">
                                <button className="flex inline-flex items-center px-4 font-bold cursor-pointer px-5 mx-2 py-3 inline text-sm font-medium text-center text-white rounded-lg bg-[#26B99A] hover:bg-green-800">
                                    Thêm phòng <BsFillPatchPlusFill size={15} className="inline ml-3" />
                                </button>
                            </li>
                            <li className="inline"
                                onClick={() => {
                                    setshowModalHouse(true)
                                    setstatusModalHouse(true)
                                }}>
                                <button className={`${isLoadingHouseAPI ? "pointer-events-none opacity-50" : "" } flex inline-flex items-center px-4 font-bold cursor-pointer px-5 mx-2 py-3 inline text-sm font-medium text-center text-white rounded-lg bg-blue-500 hover:bg-blue-800`}>
                                    Thêm nhà <BsFillHouseAddFill size={15} className="inline ml-3" />
                                </button>
                            </li>
                            <li className="inline"
                                onClick={() => {
                                    setDataFormHouseById(currentHouseId)
                                    setshowModalHouse(true)
                                    setstatusModalHouse(false)
                                }}>
                                <button className="font-bold cursor-pointer px-5 mx-2 py-3 inline text-sm font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-900">
                                    Sửa nhà <BsPencilSquare size={15} className="ml-1 inline" />
                                </button>
                            </li>
                            <li className="inline"
                                onClick={() => {
                                    setTypeDelete({
                                        type: "house",
                                        id: currentHouseId
                                    })
                                    setmessageDelete("Xóa nhà này sẽ xóa tất cả thông tin liên quan đến nhà này bạn có muốn tiếp tục ?")
                                    setshowModalDelete(true)
                                }}>
                                <button className="font-bold cursor-pointer px-5 mx-2 py-3 inline text-sm font-medium text-center text-white rounded-lg bg-[red] hover:bg-red-800">
                                    Xóa nhà <BsFillTrashFill size={15} className="ml-1 inline" />
                                </button>
                            </li>
                        </ul>
                    </div>
                    {/* room list */}
                    <div className='flex justify-start px-10 mt-8'>
                        <div className="grid grid-cols-2 md:grid-cols-5 2xl:grid-cols-5 gap-4">
                            {houseData && houseData.length > 0 && houseData.map((el) => (
                                <Fragment key={el.houseId}>
                                    {el.houseId == currentHouseId && (
                                        el.rooms.length > 0 ? (
                                            el.rooms.map((r) => (
                                                <Fragment key={r.id}>
                                                    <div className="flex flex-col max-w-sm p-5 bg-white border rounded-lg border-[#059669] shadow-md shadow-[#26B99A]">
                                                        <h5 className="mb-2 text-xl font-bold tracking-tight text-black dark:text-black">phòng {r.numberRoom}</h5>
                                                        <div className="text-black py-1">
                                                            <span className="font-bold px-2">Giá :
                                                            </span> {new Intl.NumberFormat('vi-VN', {
                                                                style: 'currency',
                                                                currency: 'VND',
                                                            }).format(parseInt(r.price))}
                                                        </div>
                                                        <div className="text-black py-1">
                                                            <span className="font-bold px-2">Số người ở tối đa : </span> {r.stayMax}
                                                        </div>
                                                        <div className="text-black py-1">
                                                            <span className="font-bold px-2">Số người đã ở : </span> {r.tenantList.length}
                                                        </div>
                                                        <div className="text-black py-1">
                                                            <span className="font-bold px-2">Trạng thái : </span>  {r.emptyRoom != 0 ? (
                                                                <span className="text-[red]">Đã thuê</span>
                                                            ) : (
                                                                <span className="text-[green]">Chưa thuê</span>
                                                            )}
                                                        </div>
                                                        <button className="flex justify-between inline-flex items-center mt-3 px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                            onClick={() => {
                                                                handleOpenTenantModal(r.id)
                                                            }}>
                                                            Quản lý khách <BsFillPersonFill size={15} className="inline" />
                                                        </button>
                                                        <div className="flex">
                                                            <button className="mt-10 mr-3 px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800"
                                                                onClick={() => {
                                                                    setDataFormRoomById(r.id)
                                                                    setshowModalRoom(true)
                                                                    setstatusModalRoom(false)
                                                                }}>
                                                                Sửa <BsPencilSquare size={15} className="ml-1 inline" />
                                                            </button>
                                                            <button className="mt-10 px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-[red] hover:bg-red-800"
                                                                onClick={() => {
                                                                    setTypeDelete({
                                                                        type: "room",
                                                                        id: r.id
                                                                    })
                                                                    setmessageDelete("Bạn có chắc muốn xóa phòng này ?")
                                                                    setshowModalDelete(true)
                                                                }}>
                                                                Xóa <BsFillTrashFill size={15} className="ml-1 inline" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </Fragment>
                                            ))
                                        ) : (
                                            <div className="flex items-center justify-center h-full">
                                                <div className="bg-white border rounded-lg p-8 shadow-md">
                                                    <p className="text-lg text-gray-600">No rooms found for this house.</p>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* room modal */}
            {showModalRoom ? (
                <>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative p-10 " style={{ width: '1000px' }}>
                            <div className="relative bg-white rounded-lg shadow shadow-black">
                                {/* header */}
                                <div className="flex items-center justify-between py-5 mx-4 border-b border-[#0000002e] rounded-t">
                                    <h3 className="text-xl font-semibold text-black">
                                        {!statusModalRoom ? "Sửa thông tin phòng" : "Thêm phòng"}
                                    </h3>
                                    <button onClick={() => {
                                        setDefalutFormRoom()
                                        setshowModalRoom(false)
                                    }} type="button" className="text-black bg-transparent hover:bg-gray-200 hover:text-black rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                        </svg>
                                    </button>
                                </div>
                                {/* body */}
                                <form onSubmit={handleSubmitRoom} className="p-4 md:p-5">
                                    <div className="grid grid-rows- gap-4">
                                        <div className="grid grid-cols-5 gap-4">
                                            <div className="col-span-4">
                                                <label htmlFor="numberRoom" className="block mb-2 text-sm font-medium text-black">
                                                    Số phòng <span className="text-[#EF444A]">*</span>
                                                </label>
                                                <input type="number" name="numberRoom" id="numberRoom"
                                                    className={`bg-white border ${!formRoomValidate.numberRoom ? 'border-red-500' : 'border-gray-300'} focus:border-black text-black text-sm rounded-lg  block w-full p-2.5 dark:placeholder-gray-400`}
                                                    placeholder="Nhập tên số phòng"
                                                    required="" value={formRoom.numberRoom}
                                                    onClick={handleInputRoomChange}
                                                    onChange={handleInputRoomChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-5 gap-4">
                                            <div className="col-span-2">
                                                <label htmlFor="electricityPrice" className="block mb-2 text-sm font-medium text-black">Giá điện <span className="text-[#EF444A]">*</span></label>
                                                <input type="number" name="electricityPrice" id="electricityPrice"
                                                    className={`bg-white border ${!formRoomValidate.electricityPrice ? 'border-red-500' : 'border-gray-300'} focus:border-black text-black text-sm rounded-lg  block w-full p-2.5 dark:placeholder-gray-400`}
                                                    placeholder="Nhập giá điện"
                                                    required="" value={formRoom.electricityPrice}
                                                    onClick={handleInputRoomChange}
                                                    onChange={handleInputRoomChange} />
                                            </div>
                                            <div className="col-span-2">
                                                <label htmlFor="waterPrice" className="block mb-2 text-sm font-medium text-black">Giá nước <span className="text-[#EF444A]">*</span></label>
                                                <input type="number" name="waterPrice" id="waterPrice"
                                                    className={`bg-white border ${!formRoomValidate.waterPrice ? 'border-red-500' : 'border-gray-300'} focus:border-black text-black text-sm rounded-lg  block w-full p-2.5 dark:placeholder-gray-400`}
                                                    placeholder="Nhập giá nước"
                                                    required="" value={formRoom.waterPrice}
                                                    onClick={handleInputRoomChange}
                                                    onChange={handleInputRoomChange} />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-4 gap-4">
                                            <div className="col-span-3">
                                                <label htmlFor="price" className="block mb-2 text-sm font-medium text-black">Giá phòng <span className="text-[#EF444A]">*</span></label>
                                                <input type="number" name="price" id="price"
                                                    className={`bg-white border ${!formRoomValidate.price ? 'border-red-500' : 'border-gray-300'} focus:border-black text-black text-sm rounded-lg  block w-full p-2.5 dark:placeholder-gray-400`}
                                                    placeholder="$2999" required="" value={formRoom.price}
                                                    onClick={handleInputRoomChange}
                                                    onChange={handleInputRoomChange} />
                                            </div>
                                            <div className="col-span-1">
                                                <label htmlFor="stayMax" className="block mb-2 text-sm font-medium ttext-black">Số lượng max <span className="text-[#EF444A]">*</span></label>
                                                <input type="number" name="stayMax" id="stayMax"
                                                    className={`bg-white border ${!formRoomValidate.stayMax ? 'border-red-500' : 'border-gray-300'} focus:border-black text-black text-sm rounded-lg  block w-full p-2.5 dark:placeholder-gray-400`}
                                                    placeholder="Nhập số người ở tối đa" required="" value={formRoom.stayMax}
                                                    onClick={handleInputRoomChange}
                                                    onChange={handleInputRoomChange} />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-4 gap-4 ">
                                            <div className="col-span-1">
                                                <label htmlFor="acreage" className="block mb-2 text-sm font-medium text-black">Diện tích <span className="text-[#EF444A]">*</span></label>
                                                <input type="number" name="acreage" id="acreage"
                                                    className={`bg-white border ${!formRoomValidate.acreage ? 'border-red-500' : 'border-gray-300'} focus:border-black text-black text-sm rounded-lg  block w-full p-2.5 dark:placeholder-gray-400`}
                                                    placeholder="Nhập diện tích (m²)" required="" value={formRoom.acreage}
                                                    onClick={handleInputRoomChange}
                                                    onChange={handleInputRoomChange} />
                                            </div>

                                            <div className={statusModalRoom ? "col-start-4 pointer-events-none opacity-25" : "col-start-4"}>
                                                <label htmlFor="description" className="block mb-2 text-sm font-medium text-black">Trạng thái</label>
                                                <div className="flex items-center mb-4">
                                                    <input onChange={handleInputRoomChange}
                                                        checked={formRoom.emptyRoom == "0"}
                                                        id="default-radio-1" type="radio" value="0" name="emptyRoom" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                                    <label htmlFor="default-radio-1" className="ms-2 text-sm font-medium text-black">Chưa thuê</label>
                                                </div>
                                                <div className="flex items-center">
                                                    <input onChange={handleInputRoomChange} checked={formRoom.emptyRoom == "1"} id="default-radio-2" type="radio" value="1" name="emptyRoom" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                                    <label htmlFor="default-radio-2" className="ms-2 text-sm font-medium text-black">Đã thuê</label>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-[#EF444A] text-sm">(*) Hạng mục bắt buộc</span>
                                    </div>
                                    {statusModalRoom ? (
                                        <button type="submit" className="mt-10 text-white inline-flex items-center bg-[#26B99A] hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                            <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path></svg>
                                            Thêm phòng
                                        </button>
                                    ) : (
                                        <button type="submit" className="mt-10 text-white inline-flex items-center bg-[#26B99A] hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                            <BsPencilSquare size={15} className="mr-2 inline" /> Cập nhật thông tin phòng
                                        </button>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                </>
            ) : null
            }

            {/* house modal */}
            {showModalHouse ? (
                <>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative p-10 " style={{ width: '1000px' }}>
                            <div className="relative bg-white rounded-lg shadow shadow-black">
                                <div className="flex items-center justify-between py-5 mx-4 border-b border-[#0000002e] rounded-t">
                                    <h3 className="text-lg font-semibold text-black ">
                                        {!statusModalHouse ? "Sửa thông tin nhà" : "Thêm nhà"}
                                    </h3>
                                    <button onClick={() => {
                                        setDefalutFormHouse()
                                        setshowModalHouse(false)
                                    }} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-black rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                        </svg>
                                    </button>
                                </div>
                                <form onSubmit={handleSubmitHouse} className="p-4 md:p-5">
                                    <div className="grid grid-rows- gap-4">
                                        <div className="grid grid-cols-4 gap-4">
                                            <div className="col-span-2">
                                                <label htmlFor="houseName" className="block mb-2 text-sm font-medium text-black ">Tên nhà <span className="text-[#EF444A]">*</span></label>
                                                <input type="text" name="houseName" id="houseName"
                                                    className={`bg-white border ${!formHouseValidate.houseName ? 'border-red-500' : 'border-gray-300'} focus:border-black text-black text-sm rounded-lg  block w-full p-2.5 dark:placeholder-gray-400`}
                                                    placeholder="Nhập tên nhà" required=""
                                                    value={formHouse.houseName}
                                                    onChange={handleInputHouseChange}
                                                    onClick={handleInputHouseChange} />
                                            </div>
                                            <div className="col-span-2">
                                                <label htmlFor="category" className="block mb-2 text-sm font-medium text-black ">Thành phố <span className="text-[#EF444A]">*</span></label>
                                                <select id="category" className="bg-white border border-gray-300 text-black text-sm rounded-lg focus:ring-black-500 focus:border-black block w-full p-2.5 dark:placeholder-gray-400 "
                                                    value={currentCityId}
                                                    onChange={(e) => handleCityChange(e.target.value)}
                                                    onClick={(e) => handleCityChange(e.target.value)}>
                                                    {cityData != null && cityData.map((city) => (
                                                        <Fragment key={city.cityId}>
                                                            <option value={city.cityId}>{city.cityName}</option>
                                                        </Fragment>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-4 gap-4">
                                            <div className="col-span-2">
                                                <label htmlFor="district" className="block mb-2 text-sm font-medium text-black ">Quận / Huyện <span className="text-[#EF444A]">*</span> </label>
                                                <select id="district" className="bg-white border border-gray-300 text-black text-sm rounded-lg focus:border-black-500 block w-full p-2.5 dark:placeholder-gray-400"
                                                    value={currentDistrictId}
                                                    onClick={(e) => handleDistrictChange(e.target.value)}
                                                    onChange={(e) => handleDistrictChange(e.target.value)}>
                                                    {districtData != null && districtData.map((district) => (
                                                        <Fragment key={district.districtId}>
                                                            <option value={district.districtId}>{district.districtName}</option>
                                                        </Fragment>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="col-span-2">
                                                <label htmlFor="ward" className="block mb-2 text-sm font-medium text-black ">Phường <span className="text-[#EF444A]">*</span></label>
                                                <select id="ward"
                                                    className={`bg-white border ${!formHouseValidate.warnId ? 'border-red-500' : 'border-gray-300'} focus:border-black text-black text-sm rounded-lg  block w-full p-2.5 dark:placeholder-gray-400`}
                                                    value={currentWardId}
                                                    onClick={(e) => handleWardChange(e.target.value)}
                                                    onChange={(e) => handleWardChange(e.target.value)}>
                                                    {wardData != null && wardData.map((ward) => (
                                                        <Fragment key={ward.wardId}>
                                                            <option value={ward.wardId}>{ward.wardName}</option>
                                                        </Fragment>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-4 gap-4">
                                            <div className="col-span-4">
                                                <label htmlFor="address" className="block mb-2 text-sm font-medium text-black ">Địa chỉ <span className="text-[#EF444A]">*</span></label>
                                                <input type="text" name="address" id="address"
                                                    className={`bg-white border ${!formHouseValidate.address ? 'border-red-500' : 'border-gray-300'} focus:border-black text-black text-sm rounded-lg  block w-full p-2.5 dark:placeholder-gray-400`}
                                                    placeholder="Nhập địa chỉ nhà"
                                                    required=""
                                                    value={formHouse.address}
                                                    onChange={handleInputHouseChange}
                                                    onClick={handleInputHouseChange} />
                                            </div>
                                        </div>
                                        <span className="text-[#EF444A] text-sm">(*) Hạng mục bắt buộc</span>
                                    </div>

                                    {statusModalHouse ? (
                                        <button type="submit" className="mt-10 text-white inline-flex items-center bg-[#26B99A] hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                            <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path></svg>
                                            Thêm nhà
                                        </button>
                                    ) : (
                                        <button type="submit" className="mt-10 text-white inline-flex items-center bg-[#26B99A] hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                            <BsPencilSquare size={15} className="mr-2 inline" /> Cập nhật thông tin nhà
                                        </button>
                                    )}
                                </form>
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

            {/* manager tenant modal */}
            {showModalManagerTenant ? (
                <>
                    <div tabIndex="-1" aria-hidden="true"
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-20 outline-none focus:outline-none">
                        <div className="p-4 w-full">
                            {/* <!-- Modal content --> */}
                            <div className="w-full bg-white rounded-lg shadow shadow-black">
                                {/* <!-- Modal header --> */}
                                <div className="flex items-center justify-between py-5 mx-4 border-b border-[#0000002e] rounded-t">
                                    <h3 className="text-xl font-semibold text-black">
                                        Quản lý người ở
                                    </h3>
                                    <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal"
                                        onClick={() => {
                                            setshowModalManagerTenant(false)
                                        }}>
                                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                        </svg>
                                        <span className="sr-only">Close modal</span>
                                    </button>
                                </div>
                                {/* <!-- Modal body --> */}
                                <div className="w-full p-4 md:p-5">
                                    <div className="w-full overflow-x-auto shadow-md sm:rounded-lg mt-2 border border-[#e2e1e1] mb-4">
                                        {/* HEADER */}
                                        <div className="pb-4 bg-white dark:bg-white-900 px-4 py-4">
                                            <div className="flex justify-between items-wrap bg-white dark:bg-white-900">
                                                {/* house, room select */}
                                                <div className="my-2 text-lg font-semibold self-center">
                                                    <span>Quản lý khách ở :</span>
                                                    <select className=" ml-4 bg-white border border-gray-300 text-black text-center text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 py-2 px-4 dark:border-gray-500 dark:placeholder-gray-400 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                        value={currentHouseId}
                                                        onChange={(e) => handleHouseChange(e.target.value)}>
                                                        {houseData && houseData.length > 0 && houseData.map(house => (
                                                            <Fragment key={house.houseId}>
                                                                <option className="text-start" value={house.houseId}>{house.houseName}</option>
                                                            </Fragment>
                                                        ))}
                                                    </select>
                                                    <select className=" ml-4 bg-white border border-gray-300 text-black text-center text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 py-2 px-4 dark:border-gray-500 dark:placeholder-gray-400 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                        onChange={(e) => handleRoomChange(e.target.value)}
                                                        value={currentRoomId}>
                                                        {houseData && houseData.length > 0 && houseData.map((house) => (
                                                            house.houseId == currentHouseId && house.rooms && house.rooms.length > 0 && (
                                                                house.rooms.map((r) => (
                                                                    <Fragment key={r.id}>
                                                                        <option className="text-start" value={r.id}>Phòng {r.numberRoom}</option>
                                                                    </Fragment>
                                                                ))
                                                            )
                                                        ))}
                                                    </select>
                                                </div>
                                                {/* list buttons */}
                                                <ul className="my-2 self-center">
                                                    <li className={currentRoomId ? "inline" : "inline pointer-events-none opacity-50"}
                                                        onClick={() => {
                                                            setstatusModalTenant(true)
                                                            setFormTenant((formTenant) => ({
                                                                ...formTenant,
                                                                "idRoom": currentRoomId,
                                                            }));
                                                            setshowModalTenant(true)
                                                        }}>
                                                        <button className={`flex inline-flex items-center px-4 font-bold cursor-pointer px-5 mx-2 py-3 inline text-sm font-medium text-center text-white rounded-lg bg-[#26B99A] hover:bg-green-800`}>
                                                            Thêm khách vào phòng <BsFillPatchPlusFill size={15} className="inline ml-3" />
                                                        </button>
                                                    </li>
                                                    <li className={currentRoomId && tenantData && tenantData.length > 0 ? "inline" : "inline pointer-events-none opacity-50"}
                                                        onClick={() => {
                                                            setShowModalMoveTenant(true)
                                                        }}>
                                                        <button className={`flex inline-flex items-center px-4 font-bold cursor-pointer px-5 mx-2 py-3 inline text-sm font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-900`}>
                                                            Di chuyển khách đến phòng<BsPencilSquare size={15} className="ml-1 inline" />
                                                        </button>
                                                    </li>
                                                    <li className={currentRoomId && tenantData && tenantData.length > 0 ? "inline" : "inline pointer-events-none opacity-50"}
                                                        onClick={() => {
                                                            setTypeDelete({
                                                                type: "tenant",
                                                                id: 0
                                                            })
                                                            setmessageDelete("Bạn có chắc muốn xóa những khách đã chọn khỏi phòng này ?")
                                                            setshowModalDelete(true)
                                                        }}>
                                                        <button className="font-bold cursor-pointer px-5 mx-2 py-3 inline text-sm font-medium text-center text-white rounded-lg bg-[red] hover:bg-red-800">
                                                            Xóa khách khỏi phòng <BsFillTrashFill size={15} className="ml-1 inline" />
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        {/* TABLE ROOM TENANT */}
                                        <table className="w-full text-sm text-center rtl:text-right text-[black] font-mono">
                                            {/* table header */}
                                            <thead className="text-base text-[white] uppercase bg-[#059669]">
                                                <tr>
                                                    <th scope="col" className="p-4">
                                                        <div className="flex items-center">
                                                            <input id="checkbox-all-search" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                                onClick={handleCheckboxMoveTenantCheckAll} />
                                                            <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>
                                                        </div>
                                                    </th>
                                                    <th scope="col" className="w-1/4 px-2 py-3">
                                                        Tên khách
                                                    </th>
                                                    <th scope="col" className="px-2 py-3">
                                                        Tuổi
                                                    </th>
                                                    <th scope="col" className="px-2 py-3">
                                                        Giới tính
                                                    </th>
                                                    <th scope="col" className="w-1/6 px-2 py-3">
                                                        Số điện thoại
                                                    </th>
                                                    <th scope="col" className="w-1/6 px-2 py-3">
                                                        Email
                                                    </th>
                                                    <th scope="col" className="w-1/6 px-2 py-3">
                                                        CCCD
                                                    </th>
                                                    <th scope="col" className="w-4 px-3 py-3">
                                                        Action
                                                    </th>
                                                </tr>
                                            </thead>
                                            {/* table body */}
                                            <tbody className="text-base font-medium">
                                                {currentRoomId == null ? (
                                                    <tr>
                                                        <td colSpan="8" className="px-6 py-4 text-center">
                                                            Nhà này chưa có phòng nào !
                                                        </td>
                                                    </tr>
                                                ) : (tenantData != null && tenantData.length > 0 ? (
                                                    tenantData.map((tenant) => (
                                                        <Fragment key={tenant.id}>
                                                            <tr className="bg-white hover:bg-[#0000000d] border-b border-gray-400">
                                                                <td className="w-4 p-4">
                                                                    <div className="flex items-center">
                                                                        <input id={tenant.id} type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                                            onClick={handleCheckboxMoveTenantChange}
                                                                            onChange={handleCheckboxMoveTenantChange}
                                                                            checked={checkedMoveTenantIds.includes(tenant.id)} />
                                                                        <label htmlFor="checkbox-table-3" className="sr-only">checkbox</label>
                                                                    </div>
                                                                </td>
                                                                <td className="w-1/4 px-2 py-3">
                                                                    {tenant.name}
                                                                </td>
                                                                <td className="px-2 py-3">
                                                                    {tenant.age}
                                                                </td>
                                                                <td className="px-2 py-3">
                                                                    {tenant.gender}
                                                                </td>
                                                                <td className="w-1/6 px-2 py-3">
                                                                    {tenant.phoneNumber}
                                                                </td>
                                                                <td className="w-1/6 px-2 py-3">
                                                                    {tenant.email}
                                                                </td>
                                                                <td className="w-1/6 px-2 py-3">
                                                                    {tenant.identifier}
                                                                </td>
                                                                <td className="w-1 px-2 py-3">
                                                                    <button className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                                                        onClick={() => {
                                                                            setstatusModalTenant(false)
                                                                            setDataFormTenantById(tenant.id)
                                                                            setshowModalTenant(true)
                                                                        }}>Sửa</button>
                                                                </td>
                                                            </tr>
                                                        </Fragment>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="7" className="px-6 py-4 text-center">
                                                            Phòng này chưa có khách nào cả
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : null
            }

            {/* move tenant modal */}
            {showShowModalMoveTenant ? (
                <>
                    <div tabIndex="-1" aria-hidden="true"
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-20 outline-none focus:outline-none">
                        <div className="w-1/4 p-4">
                            {/* <!-- Modal content --> */}
                            <div className="w-full bg-white rounded-lg shadow shadow-black">
                                {/* <!-- Modal header --> */}
                                <div className="flex items-center justify-between py-5 mx-4 border-b border-[#0000002e] rounded-t">
                                    <h3 className="text-xl font-semibold text-black">
                                        Chuyển đến phòng
                                    </h3>
                                    <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal"
                                        onClick={() => {
                                            setShowModalMoveTenant(false)
                                        }}>
                                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                        </svg>
                                        <span className="sr-only">Close modal</span>
                                    </button>
                                </div>
                                {/* <!-- Modal body --> */}
                                <div className="w-full p-4 md:p-5">
                                    <div className="flex">
                                        <select className=" ml-4 bg-white border border-gray-300 text-black text-center text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 py-2 px-4 dark:border-gray-500 dark:placeholder-gray-400 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                            onChange={(e) => handleHouseMoveChange(e.target.value)}
                                            onClick={(e) => handleHouseMoveChange(e.target.value)}
                                            value={HouseMoveId}>
                                            {houseData.map(house => (
                                                <Fragment key={house.houseId}>
                                                    <option className="text-start" value={house.houseId}>{house.houseName}</option>
                                                </Fragment>
                                            ))}
                                        </select>
                                        <select className=" ml-4 bg-white border border-gray-300 text-black text-center text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 py-2 px-4 dark:border-gray-500 dark:placeholder-gray-400 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                            onClick={(e) => handleRoomMoveChange(e.target.value)}
                                            onChange={(e) => handleRoomMoveChange(e.target.value)}
                                            value={RoomMoveId}>
                                            {houseData.map((house) => (
                                                <Fragment key={house.houseId}>
                                                    {house.houseId == HouseMoveId && house.rooms.map((r) => (
                                                        <Fragment key={r.id}>
                                                            <option className="text-start" value={r.id}>Phòng {r.numberRoom}</option>
                                                        </Fragment>
                                                    ))}
                                                </Fragment>
                                            ))}
                                        </select>
                                    </div>
                                    <button type="submit" className="mt-10 text-white inline-flex items-center bg-[#26B99A] hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                        onClick={() => HandleSubmitMoveTenant()}>
                                        Di chuyển <BsArrowLeftRight size={15} className="inline ml-3" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : null
            }

            {/* room modal */}
            {showModalTenant ? (
                <>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative p-10 " style={{ width: '1000px' }}>
                            <div className="relative bg-white rounded-lg shadow shadow-black">
                                {/* header */}
                                <div className="flex items-center justify-between py-5 mx-4 border-b border-[#0000002e] rounded-t">
                                    <h3 className="text-xl font-semibold text-black">
                                        {!statusModalTenant ? "Sửa thông tin người ở" : "Thêm người ở"}
                                    </h3>
                                    <button onClick={() => {
                                        setDefalutFormTenant()
                                        setshowModalTenant(false)
                                    }} type="button" className="text-black bg-transparent hover:bg-gray-200 hover:text-black rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                        </svg>
                                    </button>
                                </div>
                                {/* body */}
                                <form onSubmit={handleSubmitTenant} className="p-4 md:p-5">
                                    <div className="grid grid-rows- gap-4">
                                        <div className="grid grid-cols-5 gap-4">
                                            <div className="col-span-2">
                                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-black">Tên khách ở <span className="text-[#EF444A]">*</span></label>
                                                <input type="text" name="name" id="name"
                                                    className={`bg-white border ${!formTenantValidate.name ? 'border-red-500' : 'border-gray-300'} focus:border-black text-black text-sm rounded-lg  block w-full p-2.5 dark:placeholder-gray-400`}
                                                    placeholder="Nhập tên"
                                                    required="" value={formTenant.name}
                                                    onClick={handleInputTenantChange}
                                                    onChange={handleInputTenantChange} />
                                            </div>
                                            <div className="col-span-2">
                                                <label htmlFor="identifier" className="block mb-2 text-sm font-medium text-black">CCCD khách ở <span className="text-[#EF444A]">*</span></label>
                                                <input type="text" name="identifier" id="identifier"
                                                    className={`bg-white border ${!formTenantValidate.identifier ? 'border-red-500' : 'border-gray-300'} focus:border-black text-black text-sm rounded-lg  block w-full p-2.5 dark:placeholder-gray-400`}
                                                    placeholder="Nhập CCCD"
                                                    required="" value={formTenant.identifier}
                                                    onClick={handleInputTenantChange}
                                                    onChange={handleInputTenantChange} />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-5 gap-4">
                                            <div className="col-span-2">
                                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-black">Email khách ở <span className="text-[#EF444A]">*</span></label>
                                                <input type="text" name="email" id="email"
                                                    className={`bg-white border ${!formTenantValidate.email ? 'border-red-500' : 'border-gray-300'} focus:border-black text-black text-sm rounded-lg  block w-full p-2.5 dark:placeholder-gray-400`}
                                                    placeholder="Nhập email"
                                                    required="" value={formTenant.email}
                                                    onClick={handleInputTenantChange}
                                                    onChange={handleInputTenantChange} />
                                            </div>
                                            <div className="col-span-2">
                                                <label htmlFor="phoneNumber" className="block mb-2 text-sm font-medium text-black">SĐT khách ở <span className="text-[#EF444A]">*</span></label>
                                                <input type="text" name="phoneNumber" id="phoneNumber"
                                                    className={`bg-white border ${!formTenantValidate.phoneNumber ? 'border-red-500' : 'border-gray-300'} focus:border-black text-black text-sm rounded-lg  block w-full p-2.5 dark:placeholder-gray-400`}
                                                    placeholder="Nhập sđt"
                                                    required="" value={formTenant.phoneNumber}
                                                    onClick={handleInputTenantChange}
                                                    onChange={handleInputTenantChange} />
                                            </div>
                                        </div>
                                        <div className="flex grid-cols-5 gap-4 ">
                                            <div className="col-span-1">
                                                <label htmlFor="age" className="block mb-2 text-sm font-medium text-black">Tuổi khách ở <span className="text-[#EF444A]">*</span></label>
                                                <input type="number" name="age" id="age"
                                                    className={`bg-white border ${!formTenantValidate.age ? 'border-red-500' : 'border-gray-300'} focus:border-black text-black text-sm rounded-lg  block w-full p-2.5 dark:placeholder-gray-400`}
                                                    placeholder="Nhập tuổi" required="" value={formTenant.age}
                                                    onClick={handleInputTenantChange}
                                                    onChange={handleInputTenantChange} />
                                            </div>

                                            <div className="ml-10">
                                                <label htmlFor="description" className={!formTenantValidate.gender ? `block mb-2 text-sm font-medium text-[red]` : `block mb-2 text-sm font-medium text-black`}>Giới tính </label>

                                                <div className="flex items-center mb-4">
                                                    <input
                                                        onChange={handleInputTenantChange}
                                                        checked={formTenant.gender === "Nam"}
                                                        id="default-radio-1"
                                                        type="radio"
                                                        value="Nam"
                                                        name="gender"
                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                    />
                                                    <label htmlFor="default-radio-1" className="ms-2 text-sm font-medium text-black">
                                                        Nam
                                                    </label>
                                                </div>
                                                <div className="flex items-center">
                                                    <input
                                                        onChange={handleInputTenantChange}
                                                        checked={formTenant.gender === "Nu"}
                                                        id="default-radio-2"
                                                        type="radio"
                                                        value="Nu"
                                                        name="gender"
                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                    />
                                                    <label htmlFor="default-radio-2" className="ms-2 text-sm font-medium text-black">
                                                        Nữ
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-[#EF444A] text-sm">(*) Hạng mục bắt buộc</span>
                                    </div>
                                    {statusModalTenant ? (
                                        <button type="submit" className="mt-10 text-white inline-flex items-center bg-[#26B99A] hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                            <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path></svg>
                                            Thêm khách
                                        </button>
                                    ) : (
                                        <button type="submit" className="mt-10 text-white inline-flex items-center bg-[#26B99A] hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                            <BsPencilSquare size={15} className="mr-2 inline" /> Cập nhật thông khách
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

export default ManagerHouse
