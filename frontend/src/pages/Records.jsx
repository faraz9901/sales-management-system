import { useEffect, useRef, useState } from 'react'
import salesService from '../services/sales.service'
import { useToaster } from '../services/toaster.service'
import { getDate, ProductCategories, tableToCSV } from '../services'
import { Download, Logs, Pencil, Plus, RotateCw, Search, Trash } from 'lucide-react'
import ConfirmPopup from '../components/ConfirmPopup'
import { Link } from 'react-router-dom'
import Loader from '../components/Loader'
import DashBoard from '../components/DashBoard'

export default function Records() {
    const toast = useToaster(state => state.toast)
    const [records, setRecords] = useState(null)
    const [selectedRecordId, setSelectedRecordId] = useState(null)
    const [filterData, setFilterData] = useState({ category: "", product: "" })
    const [loading, setLoading] = useState(false)
    const table = useRef(null)

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

    const handleFormChange = (e) => {
        setFilterData({ ...filterData, [e.target.name]: e.target.value })
    }

    const fetchRecords = async (query = filterData) => {
        setLoading(true)
        try {
            const response = await salesService.getRecords(query)
            if (response.data.success) {
                setRecords(response.data.content)
            }
        } catch (error) {
            toast.onError(error, 5000)
        } finally {
            setLoading(false)
        }
    }

    const downloadLogs = async () => {
        try {
            const response = await salesService.downloadLogs()
            const blob = new Blob([response.data], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'logs.txt';
            link.click();
        } catch (error) {
            toast.onError(error, 5000)
        }
    }

    const download = async (record) => {

        try {
            const response = await salesService.downloadInvoice(record.invoiceNumber)

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = record.invoiceNumber + '.pdf';
            link.click();

        } catch (error) {
            toast.onError(error, 5000)
        }

    }


    useEffect(() => {
        fetchRecords()
    }, [])

    return (
        <>
            {records?.length > 0 && <DashBoard />}

            <div className='flex justify-between gap-3  flex-wrap py-5'>

                <div className='flex flex-wrap gap-3 mx-auto '>

                    <input type="search" name="product" value={filterData?.product} onChange={handleFormChange} placeholder="Search product..." className="input input-bordered w-full" />


                    <select value={filterData?.category || ""} name="category" onChange={handleFormChange} className={"select select-bordered w-full"}>
                        <option value={""} disabled>Pick a Category</option>
                        {ProductCategories.map(category => <option key={category} value={category}>{category}</option>)}
                    </select>

                    <div className='flex justify-center items-center gap-4 w-full'>

                        <div className="tooltip" data-tip="Apply Filters">
                            <button className='btn btn-primary' onClick={() => fetchRecords()}><Search /></button>
                        </div>

                        <div className="tooltip" data-tip="Reset">
                            <button className='btn' onClick={() => {
                                fetchRecords({ category: "", product: "" })
                                setFilterData({ category: "", product: "" })
                            }}>
                                <RotateCw />
                            </button>
                        </div>

                        <div className="tooltip" data-tip="Download All Records">
                            <button className='btn' onClick={() => tableToCSV(table.current, "records")}><Download /></button>
                        </div>

                        <div className="tooltip" data-tip="Download Logs">
                            <button className='btn' onClick={downloadLogs}><Logs /></button>
                        </div>
                    </div>
                </div>


                <div className="tooltip" data-tip="Add Sales">
                    <Link className='btn' to={"/add"}>
                        <Plus />
                    </Link>
                </div>

            </div >


            {loading ? <Loader className='h-16 w-full' />

                :

                <div className="overflow-x-auto">
                    <table ref={table} className="table">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Customer Name</th>
                                <th>Product</th>
                                <th className='text-center'>Purchased Date</th>
                                <th className='text-end'>Price</th>
                                <th className='text-end'>Quantity</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>
                            {records?.map((record, index) => (
                                <tr key={record._id}>
                                    <th>{index + 1}</th>
                                    <td>{record.customerName}</td>
                                    <td>{record.product}</td>
                                    <td className='text-center'>{getDate(record.date)}</td>
                                    <td className='text-end'>{record.price}</td>
                                    <td className='text-end'>{record.quantity}</td>
                                    <td className='flex gap-5 justify-center '>
                                        <Link to={`/edit/${record._id}`} className='btn  btn-sm'><Pencil size={15} /></Link>
                                        <button
                                            onClick={() => {
                                                document.getElementById("confirm").showModal()
                                                setSelectedRecordId(record._id) // Set the selected record ID
                                            }}
                                            className='btn btn-error btn-sm'>
                                            <Trash size={15} />
                                        </button>


                                        <button className='btn  btn-sm' onClick={() => download(record)}><Download size={15} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <ConfirmPopup onConfirm={() => deleteRecord(selectedRecordId)} />
                </div>
            }
        </ >
    )
}
