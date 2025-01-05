import { EllipsisVertical } from "lucide-react";
import { Link } from "react-router-dom";
import DashBoard from "../components/DashBoard";
import RecordsTable from "../components/RecordsTable";

export default function Records() {
    return (
        <div className="flex self-start  gap-3 flex-col">

            <div className="bg-white flex justify-end items-center gap-7 h-11 text-gray-500 p-2   ">

                <Link className="btn btn-sm rounded-full btn-error text-white" to="/add">
                    + Add Sale
                </Link>


                <div className="bg-slate-200 w-[1px] h-full" />

                <button className="btn btn-sm px-0" >
                    <EllipsisVertical />
                </button>
            </div>

            {/* Stats for records */}
            <DashBoard />

            {/* Records Table */}
            <RecordsTable />

        </div >
    )
}
