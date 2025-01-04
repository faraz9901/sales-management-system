import React, { useEffect, useState } from 'react'
import { ProductCategories, validateForm } from '../services'

const Input = ({ label, error, ...inputProps }) => {
    return (
        <div>
            <label className="label">{label}</label>
            <input {...inputProps} className={"input  input-bordered w-full " + (error ? " input-error" : "")} />
            {error && <span className="text-error text-xs">{error}</span>}
        </div>
    )
}

export default function SalesForm({ onFormValid, initialValues }) {
    const [salesFormdata, setSalesFormData] = useState(initialValues)
    const [formErrors, setFormErrors] = useState({})

    useEffect(() => {
        setSalesFormData(initialValues)
    }, [initialValues])

    const handleFormChange = (e) => {
        setSalesFormData({ ...salesFormdata, [e.target.name]: e.target.value })
    }

    const handleFormSubmit = (e) => {
        e.preventDefault()
        const errors = validateForm(salesFormdata)

        const keys = Object.keys(errors)

        if (keys.length > 0) {
            setFormErrors(errors)
        } else {
            setFormErrors({})
            onFormValid(salesFormdata)
        }
    }

    return (
        <div className='w-full'>

            <form onSubmit={handleFormSubmit} className='flex flex-col md:gap-5 gap-2'>

                <Input label={"Customer Name"} required placeholder="John Doe" value={salesFormdata?.customerName} error={formErrors?.customerName} name="customerName" onChange={handleFormChange} />

                <Input label="Product" placeholder="Laptop" required value={salesFormdata?.product} name="product" onChange={handleFormChange} error={formErrors?.product} />

                <Input label="Price" placeholder="Rs. 1000" required value={salesFormdata?.price} name="price" onChange={handleFormChange} error={formErrors?.price} />

                <Input label="Date" type="date" value={salesFormdata?.date} required name="date" onChange={handleFormChange} error={formErrors?.date} />

                <Input label="Quantity" placeholder="1" value={salesFormdata?.quantity} required name="quantity" onChange={handleFormChange} error={formErrors?.quantity} />


                <div>
                    <label className="label">Category</label>
                    <select value={salesFormdata?.category} required name="category" onChange={handleFormChange} className={"select select-bordered w-full" + (formErrors?.category ? " select-error" : "")}>
                        <option disabled selected>Pick a Category</option>
                        {ProductCategories.map(category => <option key={category} value={category}>{category}</option>)}
                    </select>
                    {formErrors?.category && <span className="text-error text-xs">{formErrors?.category}</span>}
                </div>

                <Input label={"Total Amount"} value={(salesFormdata?.price * salesFormdata?.quantity) || 0} name="totalAmount" disabled />

                <button className="btn btn-neutral">Save</button>

            </form>
        </div >
    )
}
