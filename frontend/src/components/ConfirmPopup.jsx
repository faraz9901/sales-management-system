export default function ConfirmPopup({ onConfirm }) {
    return (
        <>
            <dialog id="confirm" className="modal">
                <div className="modal-box lg:w-96 px-2 py-3">
                    <form method="dialog">
                        <div className="flex flex-col items-center gap-4">
                            <p className="py-2">Are you sure you want to delete this record ?</p>

                            <div className="flex gap-10 justify-center">
                                <span onClick={onConfirm} className="btn btn-error btn-sm text-white">Delete</span>
                                <button className="btn btn-sm  ">Cancel</button>
                            </div>
                        </div>
                    </form>
                </div>
            </dialog>
        </>
    )
}
