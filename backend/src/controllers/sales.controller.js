import { Sales } from "../models/Sales.model.js"
import { salesValidation } from "../utils/validation.js"
import createPdf from "../utils/createPdf.js"
import { getDateAndTime, logHeaders, recordHeaders } from "../utils/index.js";
import { createExcelFile } from "../utils/createExcelFile.js";
import { Log } from "../models/Logs.model.js";



const createEditLogs = async (previousRecord, newRecord) => {
    const changedFields = Object.keys(newRecord).filter(key => {
        // Check if the date has changed
        if (key === 'date') {
            return previousRecord[key].toISOString().split('T')[0] !== new Date(newRecord[key]).toISOString().split('T')[0]
        }
        return previousRecord[key] !== newRecord[key]
    })

    const logMessage = changedFields.map(key => `${key}: ${previousRecord[key]} -> ${newRecord[key]}`).join(' \n')

    if (changedFields.length > 0) {
        await Log.create({ message: `Updated Sales Record of ${previousRecord.customerName} with product ${previousRecord.product}. Changed fields: \n${logMessage}` })
    }
}


export const createSalesRecords = async (req, res) => {
    try {
        const data = req.body
        const { error } = salesValidation.validate(data)

        data.invoiceNumber = Date.now()

        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message })
        }

        await Sales.create(data)

        const message = `Sales Record Created of ${data.customerName} with product ${data.product}`

        await Log.create({ message })

        res.status(201).json({ success: true })

    } catch (error) {
        res.status(500).json({ success: false })
    }
}


export const sendInvoice = async (req, res) => {
    const invoiceNumber = req.params.invoiceNumber

    try {
        const invoiceDetails = await Sales.findOne({ invoiceNumber })

        if (!invoiceDetails) {
            return res.status(404).json({ success: false, message: "Invoice not found" })
        }

        createPdf(invoiceDetails, res)

    } catch (error) {
        res.status(500).json({ success: false })
    }
}

export const sendLogs = async (req, res) => {    // Download the log file

    try {
        const logs = await Log.find({}).sort({ createdAt: -1 })

        const updatedLogs = logs.map((log) => ({
            message: log.message,
            date: getDateAndTime(log.createdAt), // Use getDateAndTime function to get the formatted date and time from log.createdAt
        }))

        await createExcelFile(logHeaders, updatedLogs, "logs", res)

    } catch (error) {
        res.status(500).json({ success: false })
    }
}

export const downLoadRecords = async (req, res) => {
    try {
        const month = req?.params?.month || new Date().getMonth()

        const startDate = new Date(new Date().getFullYear(), month, 1)
        const endDate = new Date(new Date().getFullYear(), month + 1, 0)

        const sales = await Sales.find({ date: { $gte: startDate, $lt: endDate } })

        await createExcelFile(recordHeaders, sales, "records", res)

    } catch (error) {
        res.status(500).json({ success: false })
    }
}

export const getSalesRecords = async (req, res) => {
    try {
        const query = {}

        const userQuery = req?.query?.search

        const regex = new RegExp(userQuery, "i")


        if (userQuery) {
            query.$or = [{ customerName: regex }, { product: regex }, { category: regex }]
        }

        const sales = await Sales.find(query).sort({ createdAt: -1 })

        res.status(200).json({ success: true, content: sales })

    } catch (error) {
        res.status(500).json({ success: false })
    }
}

export const updateRecord = async (req, res) => {
    try {
        const _id = req.params.id
        const { error } = salesValidation.validate(req.body)

        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message })
        }

        const isRecordExist = await Sales.findOne({ _id })

        if (!isRecordExist) {
            return res.status(404).json({ success: false, message: "Record not found" })
        }



        await Sales.findOneAndUpdate({ _id }, req.body)

        await createEditLogs(isRecordExist, req.body)

        res.status(200).json({ success: true })

    } catch (error) {
        res.status(500).json({ success: false })
    }
}
export const deleteRecord = async (req, res) => {
    try {
        const _id = req.params.id

        const isRecordExist = await Sales.findOne({ _id })

        if (!isRecordExist) {
            return res.status(404).json({ success: false, message: "Record not found" })
        }

        await Sales.findOneAndDelete({ _id })

        const message = `Sales Record Deleted of ${isRecordExist.customerName} with product ${isRecordExist.product}`

        await Log.create({ message })

        res.status(200).json({ success: true })

    } catch (error) {
        res.status(500).json({ success: false })
    }

}
export const getRecord = async (req, res) => {
    try {
        const _id = req.params.id

        const record = await Sales.findOne({ _id })

        if (!record) {
            return res.status(404).json({ success: false, message: "Record not found" })
        }

        res.status(200).json({ success: true, content: record })


    } catch (error) {
        res.status(500).json({ success: false })
    }
}



export const getStats = async (req, res) => {

    const month = req.query.month || new Date().getMonth()

    const startDate = new Date(new Date().getFullYear(), month, 1)
    const endDate = new Date(new Date().getFullYear(), month + 1, 0)

    try {
        const stats = await Sales.aggregate([
            {
                $facet: {
                    mostSold: [
                        {
                            $group: {
                                _id: "$product", // Group by product name
                                totalQuantity: { $sum: "$quantity" }
                            }
                        },
                        {
                            $sort: { totalQuantity: -1 } // Sort by descending total quantity
                        },
                        {
                            $limit: 1 // Limit to the top 1 product
                        }, {
                            $project: {
                                _id: 0,
                                product: "$_id",
                                totalQuantity: 1
                            }
                        }
                    ],
                    mostExpensive: [
                        {
                            $group: {
                                _id: "$product", // Group by product name
                                maxPrice: { $max: "$price" }
                            }
                        },
                        {
                            $sort: { maxPrice: -1 } // Sort by descending max price
                        },
                        {
                            $limit: 1 // Limit to the top 1 product
                        }, {
                            $project: {
                                _id: 0,
                                product: "$_id",
                                maxPrice: 1
                            }
                        }
                    ],
                    totalSales: [
                        {
                            $match: {
                                date: {
                                    $gte: startDate,
                                    $lt: endDate
                                }
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                unitsSold: { $sum: "$quantity" },
                                totalRevenue: { $sum: { $multiply: ["$price", "$quantity"] } }
                            }
                        }
                    ]
                }
            }
        ]);

        res.status(200).json({ success: true, content: { mostSold: stats[0].mostSold[0], mostExpensive: stats[0].mostExpensive[0], totalSales: stats[0].totalSales[0] } })
    } catch (error) {
        res.status(500).json({ success: false })
    }
}



