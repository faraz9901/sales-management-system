import React from 'react'
import SalesForm from '../components/SalesForm'
import salesService, { initialSalesFormValues } from '../services/sales.service'
import { useNavigate } from 'react-router-dom'
import { useToaster } from '../services/toaster.service'

export default function AddSales() {
    const navigate = useNavigate()
    const toast = useToaster(state => state.toast)

    const addSales = async (data) => {
        try {
            await salesService.createRecord(data)
            toast.onSuccess("Sales Record Added", 2000)
            navigate('/')
        } catch (error) {

            toast.onError(error, 5000)
        }
    }

    return (
        <div className='flex justify-center items-center'>
            <div className=' w-full  px-5 py-2'>
                <h3 className='lg:text-3xl text-2xl text-center font-bold'>Add Sales</h3>
                <SalesForm onFormValid={addSales} initialValues={initialSalesFormValues} />
            </div>
        </div>
    )
}
