import { Router } from 'express'
import { createSalesRecords, deleteRecord, getRecord, getSalesRecords, getStats, sendInvoice, sendLogs, updateRecord } from '../controllers/sales.controller.js'

const verifyRoles = (roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ success: false, message: "Access Denied" })
    }
    next()
}

const router = Router()

router.post('/', verifyRoles(["admin"]), createSalesRecords)

router.get('/', getSalesRecords)

router.get("/most-sales", getStats)

router.get("/logs", verifyRoles(["admin"]), sendLogs)

router.get('/invoice/:invoiceNumber', verifyRoles(["admin"]), sendInvoice)

router.patch('/:id', verifyRoles(["admin"]), updateRecord)

router.get('/:id', getRecord)

router.delete('/:id', verifyRoles(["admin"]), deleteRecord)


export default router