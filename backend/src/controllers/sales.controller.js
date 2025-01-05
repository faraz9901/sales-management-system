import { Sales } from "../models/Sales.model.js"
import { salesValidation } from "../utils/validation.js"
import createPdf from "../utils/createPdf.js"
import * as url from 'url';
import * as path from 'path';
import * as fs from 'fs';
import { createLog } from "../utils/createLogs.js";
import { getDateAndTime } from "../utils/index.js";


const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const createEditLogs = async (previousData, newData) => {
    Object.keys(newData).forEach(async (key) => {
        if (previousData[key] !== newData[key]) {
            await createLog(` ${getDateAndTime()} - Updated "${key}" from "${previousData[key]}" to "${newData[key]}" of Product ${newData.product} with customer ${newData.customerName} `)
        }
    })
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
        createPdf(data)
        res.status(201).json({ success: true })

    } catch (error) {
        res.status(500).json({ success: false })
    }
}


export const sendInvoice = async (req, res) => {
    const invoiceNumber = req.params.invoiceNumber

    const filePath = path.join(__dirname, "..", "..", "public", "invoices", invoiceNumber + '.pdf');

    try {
        const stat = fs.statSync(filePath);

        res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Length': stat.size,
            'Content-Disposition': `attachment; filename="${invoiceNumber}.pdf"`
        });

        const readStream = fs.createReadStream(filePath);

        readStream.pipe(res);
    } catch (error) {
        res.status(500).send('Error downloading file');
    }

}



export const sendLogs = async (req, res) => {    // Download the log file
    const filePath = path.join(__dirname, "..", "..", "public", "log.txt");

    try {
        const stat = fs.statSync(filePath);

        res.writeHead(200, {
            'Content-Type': 'text/plain',
            'Content-Length': stat.size,
            'Content-Disposition': 'attachment; filename="log.txt"'
        });
        const readStream = fs.createReadStream(filePath);
        readStream.pipe(res);
    } catch (error) {
        res.status(500).send('Error downloading file');

    }

}

export const downLoadRecords = async (req, res) => {
    try {
        const month = req.params.month

        const sales = await Sales.find({ date: { $gte: new Date(new Date().getFullYear(), month, 1), $lt: new Date(new Date().getFullYear(), month + 1, 1) } })

        res.status(200).json({ success: true, content: sales })

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


        createEditLogs(isRecordExist, req.body)

        await Sales.findOneAndUpdate({ _id }, req.body)

        createPdf(req.body)

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

        createLog(`${getDateAndTime()} -  Deleted record of Product ${isRecordExist.product} with customer ${isRecordExist.customerName} `)

        res.status(200).json({ success: true })

    } catch (error) {
        res.status(500).json({ success: false })
    }

}
export const getRecord = async (req, res) => {
    try {
        const _id = req.params.id

        const record = await Sales.findOne({ _id })

        res.status(200).json({ success: true, content: record })


    } catch (error) {
        res.status(500).json({ success: false })
    }
}



export const getStats = async (req, res) => {
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
                    salesThisCurrentMonth: [
                        {
                            $match: {
                                date: {
                                    $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                                    $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
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

        res.status(200).json({ success: true, content: { mostSold: stats[0].mostSold[0], mostExpensive: stats[0].mostExpensive[0], salesThisCurrentMonth: stats[0].salesThisCurrentMonth[0] } })
    } catch (error) {
        res.status(500).json({ success: false })
    }
}



