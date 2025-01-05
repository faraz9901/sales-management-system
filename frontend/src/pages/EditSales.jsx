import React, { useEffect, useState } from 'react'
import SalesForm from '../components/SalesForm'
import salesService from '../services/sales.service'
import { useNavigate, useParams } from 'react-router-dom'
import { useToaster } from '../services/toaster.service'
import { getDate } from '../services'

export default function EditSales() {
    const navigate = useNavigate()
    const [record, setRecord] = useState(null)
    const toast = useToaster(state => state.toast)
    const { id } = useParams()

    useEffect(() => {
        const fetchRecord = async () => {
            try {
                const response = await salesService.getRecord(id)
                if (response.data.success) {

                    const data = response.data.content

                    data.date = data.date.split('T')[0] // Convert date to YYYY-MM-DD

                    setRecord(data)
                }
            } catch (error) {
                toast.onError(error, 5000)
            }
        }
        fetchRecord()
    }, [])


    const updateSales = async (data) => {
        try {
            await salesService.updateRecord(data._id, data)
            toast.onSuccess("Sales Record Updated", 2000)
            navigate('/')
        } catch (error) {
            toast.onError(error, 5000)
        }
    }

    return (
        <div className='flex justify-center items-center lg:py-4'>
            <div className=' lg:w-9/12 w-full  px-5 bg-white rounded-md  py-4'>
                <h3 className='lg:text-3xl text-2xl text-center font-bold'>Edit Sales</h3>
                <SalesForm onFormValid={updateSales} initialValues={record} />
            </div>
        </div>
    )
}
