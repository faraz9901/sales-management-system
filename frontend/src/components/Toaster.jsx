import React from 'react'
import { useToaster } from '../services/toaster.service'

const Error = ({ message }) => {
    return (
        <div role="alert" className="alert alert-error">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    color='white'
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className='text-white'>{message}</span>
        </div>
    )
}

const Success = ({ message }) => {
    return (
        <div role="alert" className="alert alert-success">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                viewBox="0 0 24 24"
                fill='none'
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    color='white'
                />
            </svg>
            <span className='text-white'>{message}</span>
        </div>
    )
}

const Info = ({ message }) => {
    return (
        <div role="alert" className="alert">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-info h-6 w-6 shrink-0">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>{message}</span>
        </div>
    )
}


export default function ToasterContainer() {
    const toaster = useToaster((state) => state.toaster)
    return (
        <div className={`fixed  bottom-3   ${toaster.show ? "right-3" : "-right-2/3"} transition-all duration-300`}>
            <ToasterWrapper type={toaster.type} message={toaster.message} />
        </div >
    )
}


const ToasterWrapper = ({ type, message }) => {
    switch (type) {
        case 'error':
            return <Error message={message} />
        case 'success':
            return <Success message={message} />
        case 'info':
            return <Info message={message} />
        default:
            return null
    }
}
