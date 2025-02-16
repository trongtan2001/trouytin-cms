import { apiGetProvince } from "@/apis/app"
import { apiGetPosts } from "@/apis/post"
import {
  BoxFilter,
  Button,
  LongCard,
  Pagination,
  SelectLib,
} from "@/components"
import WithBaseTopping from "@/hocs/WithBaseTopping"
import { resetFilter } from "@/redux/appSlice"
import {
  areaOptions,
  distances,
  priceOptions,
  targets,
} from "@/ultils/constant"
import path from "@/ultils/path"
import clsx from "clsx"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { createSearchParams, useSearchParams } from "react-router-dom"

const Filter = ({ location, navigate, dispatch }) => {
  const { provinces, isResetFilter } = useSelector((s) => s.app)
  const { setValue, watch, register } = useForm()
  const [posts, setPosts] = useState()
  const [searchParams] = useSearchParams()
  const [provinceDetail, setProvinceDetail] = useState(null)
  const setCustomValue = (id, val) =>
    setValue(id, val, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    })
  const getprovince = async (code) => {
    const response = await apiGetProvince(code)
    if (response.status === 200) setProvinceDetail(response.data)
  }
  // Filter POST API
  const getPosts = async (formdata) => {
    const response = await apiGetPosts(formdata)
    if (response) setPosts(response)
    else setPosts([])
  }
  const province = watch("province")
  const target = watch("target")
  const district = watch("district")
  const ward = watch("ward")
  const address = watch("address")
  useEffect(() => {
    if (province?.code) getprovince(province.code)
  }, [province?.code])
  useEffect(() => {
    const formdata = new FormData()
    const { type, page, ...searchParamsObject } = Object.fromEntries([
      ...searchParams,
    ])
    if (searchParamsObject.price) {
      searchParamsObject.price = searchParams.getAll("price")?.join(",")
    } else delete searchParamsObject.price
    if (searchParamsObject.acreage) {
      searchParamsObject.acreage = searchParams.getAll("acreage")?.join(",")
    } else delete searchParamsObject.acreage
    if (page && Number(page)) formdata.append("page", Number(page) - 1)
    if (type === path.PHONGTRO) searchParamsObject.post_type_id = 1
    if (type === path.CANHO) searchParamsObject.post_type_id = 2
    if (type === path.TIMOGHEP) searchParamsObject.post_type_id = 3
    formdata.append(
      "json",
      JSON.stringify({ ...searchParamsObject, status: "APPROVED" })
    )
    formdata.append("size", 5)
    getPosts(formdata)
    dispatch(resetFilter(false))
  }, [searchParams])
  useEffect(() => {
    const priceRadios = document.querySelector('input[name="PRICE"]:checked')
    const acreageRadios = document.querySelector('input[name="AREA"]:checked')
    if (isResetFilter) {
      if (priceRadios) priceRadios.checked = false
      if (acreageRadios) acreageRadios.checked = false
    }
  }, [isResetFilter])
  useEffect(() => {
    const text = clsx(
      ward?.name,
      ward?.name && ",",
      district?.name,
      district?.name && ",",
      province?.name
    )
    const textModified = text
      ?.split(",")
      ?.map((el) => el.trim())
      ?.join(", ")
    setCustomValue("address", textModified)
  }, [province, district, ward])
  const resetValue = () => {
    setCustomValue("province", "")
    setCustomValue("district", "")
    setCustomValue("ward", "")
    setCustomValue("distance", "")
  }
  const handleFilterRange = (type, value) => {
    const params = Object.fromEntries([...searchParams])
    if (type === "PRICE") {
      if (params.acreage) {
        params.acreage = searchParams.getAll("acreage")
      } else delete params.acreage
      params.price = value
    }
    if (type === "AREA") {
      if (params.price) {
        params.price = searchParams.getAll("price")
      } else delete params.price
      params.acreage = value
    }
    if (type === "ADDRESS") {
      if (params.price) {
        params.price = searchParams.getAll("price")
      } else delete params.price
      if (params.acreage) {
        params.acreage = searchParams.getAll("acreage")
      } else delete params.acreage
      params.address = value
    }
    navigate({
      pathname: location.pathname,
      search: createSearchParams(params).toString(),
    })
  }
  const handleResetRadio = (className) => {
    const radioElms = document.getElementsByClassName(className)
    for (let el of radioElms) el.checked = false
    const params = Object.fromEntries([...searchParams])
    if (className === "PRICE_OPTION") delete params.price
    if (className === "AREA_OPTION") delete params.acreage
    navigate({
      pathname: location.pathname,
      search: createSearchParams(params).toString(),
    })
  }
  return (
    <section className="w-main mx-auto my-6 grid grid-cols-12 gap-4">
      <div className="col-span-9 flex flex-col">
        <div className="w-full flex justify-between items-center pb-4 border-b">
          <span>{`Kết quả: ${posts?.total || 0} bài đăng`}</span>
          <div>
            <span>Hiển thị:</span>
          </div>
        </div>
        <div className="w-full flex flex-col gap-2 mt-4">
          {posts?.data?.map((el) => (
            <LongCard {...el} key={el.id} />
          ))}
        </div>
        <div className="my-8 flex items-center justify-end">
          <Pagination totalCount={posts?.total} />
        </div>
      </div>
      <div className="flex flex-col gap-4 col-span-3">
        <BoxFilter title="ĐỊA ĐIỂM, VỊ TRÍ">
          <div className="p-2 flex flex-col gap-2">
            <SelectLib
              className="col-span-2 text-sm"
              onChange={(val) => setCustomValue("province", val)}
              value={province}
              options={provinces?.map((el) => ({
                ...el,
                value: el.code,
                label: el.name,
              }))}
              placeholder="Tỉnh / Thành phố"
            />
            <SelectLib
              className="col-span-2 text-sm"
              onChange={(val) => setCustomValue("district", val)}
              value={district}
              options={provinceDetail?.districts?.map((el) => ({
                ...el,
                value: el.code,
                label: el.name,
              }))}
              placeholder="Quận / Huyện"
              disabled={!provinceDetail?.districts}
            />
            <SelectLib
              className="col-span-2 text-sm"
              onChange={(val) => setCustomValue("ward", val)}
              value={ward}
              options={provinceDetail?.districts
                ?.find((el) => el.codename === district?.codename)
                ?.wards?.map((el) => ({
                  ...el,
                  value: el.code,
                  label: el.name,
                }))}
              placeholder="Phường / Xã"
              disabled={!district?.codename}
            />
            <div className="w-full flex gap-3 justify-end items-center">
              <Button
                onClick={() => handleFilterRange("ADDRESS", address)}
                className="py-1 bg-transparent border border-emerald-600 text-emerald-600"
              >
                Thêm
              </Button>
              {/* <Button
                onClick={resetValue}
                className="py-1 bg-transparent border border-orange-600 text-orange-600"
              >
                Reset
              </Button> */}
            </div>
          </div>
        </BoxFilter>
        <BoxFilter title="GIÁ THUÊ">
          <form className="grid grid-cols-2 gap-2 p-2">
            {priceOptions.map((el, idx) => (
              <div className="flex items-center gap-2" key={el.value}>
                <input
                  onChange={(e) => handleFilterRange(el.type, [el.min, el.max])}
                  value={el.value}
                  type="radio"
                  name={el.type}
                  id={el.value}
                  className="PRICE_OPTION"
                />
                <label htmlFor={el.value}>{el.value}</label>
              </div>
            ))}
          </form>
          <div className="flex justify-center items-center text-sm">
            <Button
              onClick={() => handleResetRadio("PRICE_OPTION")}
              className="py-1 bg-transparent border border-red-600 text-red-600"
            >
              Reset
            </Button>
          </div>
        </BoxFilter>
        <BoxFilter title="DIỆN TÍCH">
          <div className="grid grid-cols-2 gap-2 p-2">
            {areaOptions.map((el, idx) => (
              <div className="flex items-center gap-2" key={idx}>
                <input
                  onChange={(e) => handleFilterRange(el.type, [el.min, el.max])}
                  type="radio"
                  name={el.type}
                  id={el.value}
                  value={el.value}
                  className="AREA_OPTION"
                />
                <label htmlFor={el.value}>{el.value}</label>
              </div>
            ))}
          </div>
          <div className="flex justify-center items-center text-sm">
            <Button
              onClick={() => handleResetRadio("AREA_OPTION")}
              className="py-1 bg-transparent border border-red-600 text-red-600"
            >
              Reset
            </Button>
          </div>
        </BoxFilter>
        <BoxFilter title="KHÁC">
          <div className="flex flex-col gap-2 p-2">
            <SelectLib
              className="text-sm"
              onChange={(val) => setCustomValue("target", val)}
              value={target}
              options={targets}
              placeholder="Đối tượng"
            />
            Other
          </div>
        </BoxFilter>
      </div>
    </section>
  )
}

export default WithBaseTopping(Filter)
