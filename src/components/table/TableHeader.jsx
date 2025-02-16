import React from 'react'


const TableHeader = ({ title }) => {
    return (
        <div className='flex justify-start px-8 mb-8'>
            <span className='text-2xl font-bold'>{title}</span>
        </div>
    )
}

export default TableHeader