import { apiGetPosts } from "@/apis/post"
import { LongCard, Pagination } from "@/components"
import React, { useEffect, useState } from "react"
import { useParams, useSearchParams } from "react-router-dom"

const TopProvince = () => {
  const [posts, setPosts] = useState()
  const [searchParams] = useSearchParams()
  const { name } = useParams()
  const getPosts = async (formdata) => {
    const response = await apiGetPosts(formdata)
    if (response) setPosts(response)
    else setPosts([])
  }
  useEffect(() => {
    const formdata = new FormData()
    const { type, page, ...searchParamsObject } = Object.fromEntries([
      ...searchParams,
    ])
    searchParamsObject.address = name
    if (page && Number(page)) formdata.append("page", Number(page) - 1)
    formdata.append(
      "json",
      JSON.stringify({ ...searchParamsObject, status: "APPROVED" })
    )
    formdata.append("size", 5)
    getPosts(formdata)
  }, [searchParams, name])
  return (
    <div className="col-span-9 w-main mx-auto mt-6 flex flex-col">
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
  )
}

export default TopProvince
