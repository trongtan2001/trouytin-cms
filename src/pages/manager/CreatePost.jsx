import {
  Button,
  Convenient,
  InputForm,
  Map,
  SelectLib,
  TextField,
  Title,
} from "@/components";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import withBaseTopping from "@/hocs/WithBaseTopping";
import { useSelector } from "react-redux";
import { targets } from "@/ultils/constant";
import clsx from "clsx";
import useDebounce from "@/hooks/useDebounce";
import {
  apiGetLngLatFromAddress,
  apiGetPostTypes,
  apiGetProvince,
} from "@/apis/app";
import { toast } from "react-toastify";
import { getBase64 } from "@/ultils/fn";
import { apiCreateNewPost } from "@/apis/post";
import path from "@/ultils/path";
import { ImBin } from "react-icons/im";

const CreatePost = ({ navigate }) => {
  const {
    formState: { errors },
    watch,
    register,
    getValues,
    reset,
    setValue,
    handleSubmit: validate,
  } = useForm();
  const { provinces } = useSelector((state) => state.app);
  const [postTypes, setPostTypes] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [center, setCenter] = useState(null);
  const [zoom, setZoom] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [imagesBase64, setImagesBase64] = useState([]);
  const [imageHover, setImageHover] = useState();

  const [rotation, setRotation] = useState();

  const province = watch("province");
  const district = watch("district");
  const ward = watch("ward");
  const post_type = watch("post_type");
  const images = watch("images");
  const address = watch("address");
  const street = watch("street");
  const object = watch("object");
  const description = watch("description");
  const convenient = watch("convenient");
  const fetLngLat = async (payload) => {
    try {
      const response = await apiGetLngLatFromAddress(payload);
      const features = response.data?.features || [];

      if (response.status === 200 && features.length > 0) {
        const { lat, lon } = features[0]?.properties || {};
        if (lat && lon) {
          setCenter([lat, lon]);
          setRotation(`${lat},${lon}`);
          return;
        }
      }
      console.warn("Dữ liệu không hợp lệ:", response.data);
    } catch (error) {
      console.error("Lỗi khi fetch tọa độ:", error);
    }
    setCenter([0, 0]);
    setRotation("0,0");
  };
  const convertFileToBase64 = async (file) => {
    const base64 = await getBase64(file);
    if (base64) setImagesBase64((prev) => [...prev, base64]);
  };
  useEffect(() => {
    setImagesBase64([]);
    if (images && images instanceof FileList)
      for (let file of images) convertFileToBase64(file);
  }, [images]);
  const getDataProvince = async (provinceCode) => {
    const response = await apiGetProvince(provinceCode);
    if (response.status === 200) {
      setDistricts(response.data?.districts);
    }
  };

  const fetchPostTypes = async () => {
    const response = await apiGetPostTypes();
    setPostTypes(response || []);
  };

  useEffect(() => {
    window.navigator.geolocation.getCurrentPosition((rs) => {
      if (rs && rs.coords) {
        const ps = [rs.coords.latitude, rs.coords.longitude];
        setCenter(ps);
      }
    });
    fetchPostTypes();
  }, []);

  useEffect(() => {
    if (province) {
      getDataProvince(province.code);
    }
    setValue("district", "");
    setValue("ward", "");
    setValue("street", "");
    setDistricts([]);
    setWards([]);
  }, [province]);

  useEffect(() => {
    if (district) setWards(district.wards);
  }, [district]);
  const debounceValue = useDebounce(street, 800);

  useEffect(() => {
    const lengthAddress = Object.values({
      province: province?.name,
      street,
      ward: ward?.name,
      district: district?.name,
    }).filter((el) => !el === false).length;
    if (lengthAddress > 2) setZoom(14);
    else setZoom(12);
    const text = clsx(
      debounceValue,
      debounceValue && ",",
      ward?.name,
      ward?.name && ",",
      district?.name,
      district?.name && ",",
      province?.name
    );
    const textModified = text
      ?.split(",")
      ?.map((el) => el.trim())
      ?.join(", ");
    setValue("address", textModified);
    if (textModified)
      fetLngLat({
        text: textModified,
        apiKey: import.meta.env.VITE_MAP_API_KEY,
      });
  }, [province, district, ward, debounceValue]);
  const removeFileFromFileList = (index, filesId) => {
    const dt = new DataTransfer();
    const input = document.getElementById(filesId);
    const { files } = input;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (index !== i) dt.items.add(file); // here you exclude the file. thus removing it.
    }
    setValue("images", dt.files);
    // input.files = dt.files
  };
  // Handle Submit Form
  const handleSubmit = async () => {
    const {
      street,
      ward,
      district,
      province,
      emptyRoom,
      numberRoom,
      waterPrice,
      stayMax,
      electricityPrice,
      acreage,
      price,
      post_type,
      object,
      images,
      ...dto
    } = getValues();
    const roomDto = {
      emptyRoom,
      numberRoom,
      waterPrice,
      stayMax,
      electricityPrice,
      acreage,
      price,
    };
    const payload = {
      description,
      roomDto,
      post_type: post_type?.code,
      object: object?.name,
      rotation: rotation,
      ...dto,
      convenient: convenient?.join(","),
    };
    // setIsLoading(true)
    const formData = new FormData();
    formData.append("postDto", JSON.stringify(payload));
    if (images && images instanceof FileList) {
      for (let image of images) formData.append("images", image);
    }
    try {
      setIsLoading(true);
      const response = await apiCreateNewPost(formData);
      setIsLoading(false);
      if (response) {
        toast.success("Tạo tin đăng thành công");
        navigate("/" + path.MANAGER + "/" + path.MANAGE_POST);
      } else {
        toast.error("Tạo tin đăng không thành công, hãy thử lại");
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };
  return (
    <section className="pb-[200px]">
      <Title title="Tạo mới tin đăng">
        <Button onClick={validate(handleSubmit)} disabled={isLoading}>
          Tạo mới
        </Button>
      </Title>
      <form className="p-4 grid grid-cols-12 gap-6">
        <div className="col-span-8">
          <h1 className="text-lg font-semibold  text-main-blue">
            1. Địa chỉ cho thuê
          </h1>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <SelectLib
              options={provinces?.map((el) => ({
                ...el,
                value: el.code,
                label: el.name,
              }))}
              onChange={(val) => setValue("province", val)}
              value={province}
              className="col-span-1"
              label="Tỉnh/Thành phố"
              id="province"
              register={register}
              errors={errors}
            />
            <SelectLib
              options={districts?.map((el) => ({
                ...el,
                value: el.code,
                label: el.name,
              }))}
              onChange={(val) => setValue("district", val)}
              value={district}
              className="col-span-1"
              label="Quận/Huyện"
              id="district"
              register={register}
              errors={errors}
            />
            <SelectLib
              options={wards?.map((el) => ({
                ...el,
                value: el.code,
                label: el.name,
              }))}
              onChange={(val) => setValue("ward", val)}
              value={ward}
              className="col-span-1"
              label="Phường/Xã"
              id="ward"
              register={register}
              errors={errors}
            />
          </div>
          <div className="mt-4">
            <InputForm
              label="Đường/Phố/Số nhà"
              register={register}
              errors={errors}
              id="street"
              fullWidth
              placeholder="Nhập số nhà, đường, phố cụ thể"
              inputClassName="border-gray-300"
            />
          </div>
          <div className="mt-4">
            <InputForm
              label="Địa chỉ chính xác"
              register={register}
              errors={errors}
              id="address"
              fullWidth
              inputClassName="border-gray-300 bg-gray-200 focus:outline-none focus:ring-transparent focus:ring-offset-0 focus:border-transparent focus: ring-0 cursor-default"
              readOnly={true}
              value={address}
              validate={{ required: "Không được bỏ trống" }}
            />
          </div>
          <div className="mt-6">
            <InputForm
              label="Gần nơi"
              register={register}
              errors={errors}
              id="surroundings"
              placeholder="Gần nơi nào?"
              validate={{ required: "Trường này không được bỏ trống." }}
              fullWidth
            />
          </div>
          <h1 className="text-lg font-semibold mt-6 text-main-blue">
            2. Thông tin mô tả
          </h1>
          <div className="mt-6 relative z-10">
            <SelectLib
              options={postTypes?.map((el) => ({
                ...el,
                value: el.code,
                label: el.name,
              }))}
              onChange={(val) => setValue("post_type", val)}
              value={post_type}
              className="col-span-1"
              label="Loại tin đăng"
              id="post_type"
              register={register}
              errors={errors}
              validate={{ required: "Trường này không được bỏ trống." }}
            />
          </div>
          <div className="mt-4">
            <InputForm
              label="Tựa đề"
              register={register}
              errors={errors}
              id="title"
              validate={{ required: "Trường này không được bỏ trống." }}
              fullWidth
              placeholder="Tựa đề tin đăng"
              inputClassName="border-gray-300"
            />
          </div>
          <div className="mt-4">
            <TextField
              label="Nội dung mô tả"
              id="description"
              onChange={(val) => setValue("description", val)}
              placeholder="Điền mô tả về thông tin chỗ cho thuê"
              value={description}
            />
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4">
            <InputForm
              label="Giá cho thuê (đồng/tháng)"
              register={register}
              errors={errors}
              id="price"
              validate={{ required: "Trường này không được bỏ trống." }}
              fullWidth
              inputClassName="border-gray-300"
              type="number"
              wrapClassanme="col-span-1"
            />
            <InputForm
              label="Diện tích (m2)"
              register={register}
              errors={errors}
              id="acreage"
              validate={{ required: "Trường này không được bỏ trống." }}
              fullWidth
              inputClassName="border-gray-300"
              type="number"
              wrapClassanme="col-span-1"
            />
            <InputForm
              label="Tổng số phòng"
              register={register}
              errors={errors}
              id="numberRoom"
              validate={{ required: "Trường này không được bỏ trống." }}
              fullWidth
              inputClassName="border-gray-300"
              type="number"
              wrapClassanme="col-span-1"
            />
            <InputForm
              label="Số phòng trống"
              register={register}
              errors={errors}
              id="emptyRoom"
              validate={{ required: "Trường này không được bỏ trống." }}
              fullWidth
              inputClassName="border-gray-300"
              type="number"
              wrapClassanme="col-span-1"
            />
            <InputForm
              label="Số người ở 1 phòng"
              register={register}
              errors={errors}
              id="stayMax"
              validate={{ required: "Trường này không được bỏ trống." }}
              fullWidth
              inputClassName="border-gray-300"
              type="number"
              wrapClassanme="col-span-1"
            />
            <InputForm
              label="Giá tiền điện"
              register={register}
              errors={errors}
              id="electricityPrice"
              validate={{ required: "Trường này không được bỏ trống." }}
              fullWidth
              inputClassName="border-gray-300"
              type="number"
              wrapClassanme="col-span-1"
            />
            <InputForm
              label="Giá tiền nước"
              register={register}
              errors={errors}
              id="waterPrice"
              validate={{ required: "Trường này không được bỏ trống." }}
              fullWidth
              inputClassName="border-gray-300"
              type="number"
              wrapClassanme="col-span-1"
            />
            <SelectLib
              options={targets}
              onChange={(val) => setValue("object", val)}
              value={object}
              className="col-span-1"
              label="Đối tượng cho thuê"
              id="object"
              register={register}
              validate={{ required: "Trường này không được bỏ trống." }}
              errors={errors}
            />
          </div>
          <div className="mt-4">
            <Convenient
              convenient={convenient}
              onChange={(val) => setValue("convenient", val)}
            />
          </div>
          <div className="mt-6 flex flex-col gap-2">
            <label className="font-medium" htmlFor="images">
              Chọn ảnh
            </label>
            <input
              multiple
              {...register("images", {
                required: "Trường này không được bỏ trống.",
              })}
              type="file"
              id="images"
            />
            {errors?.images && (
              <small className="text-xs text-red-500">
                {errors.images?.message}
              </small>
            )}
            <div className="grid grid-cols-4 gap-4">
              {imagesBase64?.map((el, idx) => (
                <div
                  onMouseEnter={() => setImageHover(el)}
                  onMouseLeave={() => setImageHover()}
                  className="col-span-1 w-full relative"
                  key={idx}
                >
                  <img src={el} alt="" className="w-full object-contain" />
                  {imageHover === el && (
                    <div
                      onClick={() => removeFileFromFileList(idx, "images")}
                      className="absolute inset-0 text-white cursor-pointer flex items-center justify-center bg-overlay-70"
                    >
                      <ImBin />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-span-4 flex flex-col gap-4">
          <div className="w-full relative z-10 h-[300px]">
            {center && <Map address={address} zoom={zoom} center={center} />}
          </div>
          <div className="flex flex-col p-4 text-sm gap-2 rounded-md bg-orange-100 border border-orange-500 text-orange-600">
            <h3 className="font-medium">Lưu ý khi đăng tin</h3>
            <ul className="list-item pl-8">
              <li className="list-disc">
                Nội dung phải viết bằng tiếng Việt có dấu
              </li>
              <li className="list-disc">Tiêu đề tin không dài quá 100 kí tự</li>
              <li className="list-disc">
                Các bạn nên điền đầy đủ thông tin vào các mục để tin đăng có
                hiệu quả hơn.
              </li>
              <li className="list-disc">
                Để tăng độ tin cậy và tin rao được nhiều người quan tâm hơn, hãy
                sửa vị trí tin rao của bạn trên bản đồ bằng cách kéo icon tới
                đúng vị trí của tin rao.
              </li>
              <li className="list-disc">
                Tin đăng có hình ảnh rõ ràng sẽ được xem và gọi gấp nhiều lần so
                với tin rao không có ảnh. Hãy đăng ảnh để được giao dịch nhanh
                chóng!
              </li>
            </ul>
          </div>
        </div>
      </form>
    </section>
  );
};

export default withBaseTopping(CreatePost);
