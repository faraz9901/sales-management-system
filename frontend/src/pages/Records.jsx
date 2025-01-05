import { AlignJustify, EllipsisVertical } from "lucide-react";
import { Link } from "react-router-dom";
import DashBoard from "../components/DashBoard";
import RecordsTable from "../components/RecordsTable";
import { useAuth } from "../services/auth.service";

export default function Records() {
    const logOut = useAuth(state => state.logOut)

    return (
        <div className="flex self-start  gap-3 flex-col">

            {/* Stats for records */}
            <DashBoard />

            {/* Records Table */}
            <RecordsTable />

        </div >
    )
}
