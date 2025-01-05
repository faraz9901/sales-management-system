import { request } from '../services/index.js'

export const initialSalesFormValues = {
    customerName: '',
    product: '',
    price: '',
    date: '',
    quantity: '',
    category: ''
}

class SalesService {

    async createRecord(data) {
        return request.post('/sales', data)
    }

    async getRecords(query) {
        return request.get('/sales', { params: { search: query } })
    }

    async updateRecord(id, data) {

        const selectedKeys = Object.keys(data).filter(key => initialSalesFormValues.hasOwnProperty(key))

        const selectedData = selectedKeys.reduce((obj, key) => {
            obj[key] = data[key]
            return obj
        }, {})

        return request.patch(`/sales/${id}`, selectedData)
    }

    async getRecord(id) {
        return request.get(`/sales/${id}`)
    }

    async deleteRecord(id) {
        return request.delete(`/sales/${id}`)
    }

    async getStats(month) {
        return request.get('/sales/most-sales', { params: { month } })
    }

    async downLoadRecords(month) {
        return request.get(`/sales/download/${month}`, { responseType: 'blob' })
    }

    async downloadInvoice(number) {
        return request.get(`/sales/invoice/${number}`, { responseType: 'blob' })
    }

    async downloadLogs() {
        return request.get(`/sales/logs`, { responseType: 'blob' })
    }
}

export default new SalesService()