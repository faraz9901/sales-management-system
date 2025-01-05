import { AlignJustify, LogOut, Plus, Text } from 'lucide-react'
import React from 'react'
import { Link, NavLink, Route, Routes } from 'react-router-dom'

import AddSales from './AddSales'
import EditSales from './EditSales'
import NotFound from './NotFound'
import Records from './Records'
import { useAuth } from '../services/auth.service'

const navClass = (isActive) => {
    return "rounded p-3 flex items-center gap-3 " + (isActive ? "bg-white  text-black font-semibold" : " text-white")
}

export default function MainLayout() {

    const logOut = useAuth(state => state.logOut)

    return (
        <div className="drawer lg:drawer-open  text-sm">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content bg-slate-200">

                <div className="flex lg:hidden justify-end py-2 bg-white">
                    <label htmlFor="my-drawer-2" className="btn btn-sm   drawer-button ">
                        <AlignJustify />
                    </label>
                </div>


                <div className="bg-white mb-2 justify-end items-center gap-5 h-11 text-gray-500 p-2 hidden lg:flex   ">

                    <Link className="btn btn-sm rounded-full btn-error text-white" to="/add">
                        + Add Sale
                    </Link>

                    <div className="bg-slate-200 w-[1px] h-full" />

                    <button type="button" onClick={logOut} className="btn btn-sm rounded-full bg-gray-700 hover:bg-gray-600 text-white">Logout</button>

                </div>

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


                    <button type='button' onClick={logOut} className='flex p-3 items-center gap-3 lg:hidden'>
                        <LogOut /> Logout
                    </button>
                </ul>
            </div>
        </div>
    )
}
