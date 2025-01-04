import React, { useEffect, useState } from 'react'
import salesService from '../services/sales.service'
import { formatToCurrencySystem } from '../services'

export default function DashBoard() {
    const [stats, setStats] = useState(null)

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
        <div className='flex flex-wrap justify-center items-center gap-10 mt-4'>

            <div className="card bg-base-100 w-96 shadow-lg">
                <div className="card-body">
                    <h2 className="card-title">Most Sold Product</h2>
                    <p className='font-bold text-2xl'>{stats?.mostSold?.product}  </p>
                    <p className='font-semibold text-slate-500'>{formatToCurrencySystem(stats?.mostSold?.totalQuantity || 0)} Units Sold</p>
                </div>
            </div>
            <div className="card bg-base-100 w-96 shadow-lg">
                <div className="card-body">
                    <h2 className="card-title">Most Expensive Product</h2>
                    <p className='font-bold text-2xl'>{stats?.mostExpensive?.product}  </p>
                    <p className='font-semibold text-slate-500'>Rs. {formatToCurrencySystem(stats?.mostExpensive?.maxPrice || 0)}</p>
                </div>
            </div>
            <div className="card bg-base-100 w-96 shadow-lg">
                <div className="card-body">
                    <h2 className="card-title">Sales this Month</h2>
                    <p className='font-bold text-2xl'>Rs. {formatToCurrencySystem(stats?.salesThisCurrentMonth?.totalRevenue || 0)}   </p>
                    <p className='font-semibold text-slate-500'>{formatToCurrencySystem(stats?.salesThisCurrentMonth?.unitsSold || 0)} Units Sold  </p>
                </div>
            </div>
        </div>
    )
}
