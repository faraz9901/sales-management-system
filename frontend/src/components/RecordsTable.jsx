import { Download, Search, Trash } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToaster } from '../services/toaster.service'
import salesService from '../services/sales.service'
import { getDate } from '../services'
import ConfirmPopup from './ConfirmPopup'
import { download } from '../services'

export default function RecordsTable() {
    const [search, setSearch] = useState('')
    const [records, setRecords] = useState([])
    const navigate = useNavigate()
    const [recordToDelete, setRecordToDelete] = useState(null)
    const toast = useToaster(state => state.toast)

    const deleteRecord = async (id) => {
        document.getElementById("confirm").close()
        try {
            await salesService.deleteRecord(id)
            toast.onSuccess("Sales Record Deleted", 3000)
            fetchRecords()
        } catch (error) {
            toast.onError(error, 5000)
        }
    }

    const downloadInvoice = (record) => {
        return async (e) => {
            e.stopPropagation()
            try {
                const response = await salesService.downloadInvoice(record.invoiceNumber)
                download(response.data, "application/pdf", `${record.customerName}-invoice.pdf`)
            } catch (error) {
                toast.onError(error, 5000)
            }
        }
    }

    const fetchRecords = async () => {
        try {
            const response = await salesService.getRecords(search)
            if (response.data.success) {
                setRecords(response.data.content)
            }
        } catch (error) {
            toast.onError(error, 5000)
        }
    }

    useEffect(() => {
        fetchRecords()
    }, [search])

    return (

        <div className='bg-white px-3 py-1 min-h-72'>
            <p className='font-bold text-2xl mb-2'>Records</p>

            {/* Search */}
            <label className="p-2 border border-gray-300 rounded-lg flex  items-center gap-2">
                <Search />
                <input type="text" placeholder='Search records by customer name, category or product' value={search} onChange={(e) => setSearch(e.target.value)} className="grow focus:outline-none" />
            </label>


            <div className="overflow-x-auto mt-3">
                <table className="table text-center">
                    <thead>
                        <tr className='border-b-2 border-gray-300'>
                            <th>Date</th>
                            <th>Invoice No.</th>
                            <th>Customer Name</th>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Download Invoice</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>

                        {records.length > 0 ?
                            records.map((record, index) => (
                                <tr key={index} className="hover:bg-gray-100 " onClick={() => navigate(`/edit/${record._id}`)}>
                                    <td>{getDate(record.date)}</td>
                                    <td>{record.invoiceNumber}</td>
                                    <td>{record.customerName}</td>
                                    <td>{record.product}</td>
                                    <td>{record.price}</td>
                                    <td>{record.quantity}</td>
                                    <td className='text-center'>
                                        <button className='btn  btn-sm' onClick={downloadInvoice(record)}><Download size={15} /></button>
                                    </td>
                                    <td>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                document.getElementById("confirm").showModal()
                                                setRecordToDelete(record._id)
                                            }}
                                            className="btn btn-sm btn-error text-white">
                                            <Trash size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                            :

                            <tr>
                                <td colSpan={8} className='text-center font-semibold'>No records found</td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
            <ConfirmPopup onConfirm={() => deleteRecord(recordToDelete)} />
        </div>
    )
}
