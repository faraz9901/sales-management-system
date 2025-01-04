export default function ConfirmPopup({ onConfirm }) {
    return (
        <>
            <dialog id="confirm" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        <div className="flex flex-col items-center gap-4">
                            <p className="py-2">Are you sure you want to delete this record ?</p>

                            <div className="flex gap-10 justify-center">

                                <span onClick={onConfirm} className="btn btn-info btn-sm text-white">Yes</span>

                                <button className="btn btn-sm btn-error text-white ">Cancel</button>
                            </div>
                        </div>
                    </form>
                </div>
            </dialog>
        </>
    )
}
