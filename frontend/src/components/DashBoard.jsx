import React, { useEffect, useState } from 'react'
import salesService from '../services/sales.service'
import { formatToCurrencySystem, months } from '../services'
import { Logs } from 'lucide-react'


const Card = ({ title, secondLine, thirdLine, color = "bg-base-100" }) => {
    return (
        <div className={"rounded-lg py-4 w-60 h-[115px] shadow-md flex flex-col justify-between  text-center " + color}>
            <h2 className="font-bold text-xl">{title}</h2>
            <p className='font-semibold text-lg'>{secondLine}</p>
            <p className='text-gray-600 '>{thirdLine}</p>
        </div >
    )
}

export default function DashBoard() {
    const [stats, setStats] = useState(null)

    const [month, setMonth] = useState(new Date().getMonth())

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await salesService.getStats()
                setStats(response?.data?.content)
            } catch (error) {

            }
        }

        fetchStats()
    }, [])

    return (
        <div className=' flex flex-col bg-white  gap-3 py-3 px-2 '>
            <div className='flex justify-between pe-5 '>

                <select value={month} onChange={(e) => setMonth(e.target.value)} className="select select-bordered focus:outline-none w-full max-w-xs">
                    {months.map((month, index) => (<option key={index} value={index}>{month}</option>))}
                </select>


                <div className='flex items-center gap-3'>

                    <span className='flex flex-col items-center cursor-pointer '>
                        <img src='/excel.svg' className=' h-6'></img>
                        <small className='font-semibold text-gray-500'>Excel Report</small>
                    </span>

                    <span className='flex flex-col items-center cursor-pointer '>
                        <Logs className='h-6' />
                        <small className='font-semibold text-gray-500'>Download Logs</small>
                    </span>
                </div>
            </div>

            <div className='flex flex-wrap lg:flex-nowrap items-center gap-5 py-2'>

                <Card title={"Most Sold Product"} secondLine={stats?.mostSold?.product} thirdLine={formatToCurrencySystem(stats?.mostSold?.totalQuantity || 0) + " Units Sold"} color="bg-orange-300" />

                <Card title={"Most Expensive Product"} thirdLine={"Rs. " + formatToCurrencySystem(stats?.mostExpensive?.maxPrice || 0)} secondLine={stats?.mostExpensive?.product} color="bg-red-300" />

                <Card title={"Total Sales of the Month"} thirdLine={formatToCurrencySystem(stats?.salesThisCurrentMonth?.unitsSold || 0) + " Units Sold"} secondLine={"Rs. " + formatToCurrencySystem(stats?.salesThisCurrentMonth?.totalRevenue || 0)} color="bg-blue-300" />

            </div>
        </div>
    )
}
