import { AlignJustify, Plus, Text } from 'lucide-react'
import React from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'

import AddSales from './AddSales'
import EditSales from './EditSales'
import NotFound from './NotFound'
import Records from './Records'

const navClass = (isActive) => {
    return "rounded p-3 flex gap-3 " + (isActive ? "bg-white  text-black font-semibold" : " text-white")
}

export default function MainLayout() {
    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content bg-slate-200">
                {/* drawer button */}
                <label htmlFor="my-drawer-2" className="btn fixed top-3 right-3 drawer-button lg:hidden">
                    <AlignJustify />
                </label>

                {/* Main Routes */}
                <Routes>
                    <Route path="/" element={<Records />} />
                    <Route path="/add" element={<AddSales />} />
                    <Route path="/edit/:id" element={<EditSales />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>

            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="flex flex-col gap-2  text-white lg:w-60 w-fit min-h-screen bg-gray-700 p-4">
                    <p className='font-bold text-2xl flex items-center gap-3 mt-3 mb-10'>
                        <img src="/logo.png" alt="Logo" className="w-10 bg-white rounded h-10 " />  Sales Tracker
                    </p>


                    <NavLink
                        to="/"
                        className={({ isActive }) => navClass(isActive)}
                    >
                        <Text /> Records
                    </NavLink>

                    <NavLink
                        to="/add"
                        className={({ isActive }) => navClass(isActive)}
                    >
                        <Plus />   Add Sale
                    </NavLink>
                </ul>
            </div>
        </div>
    )
}
