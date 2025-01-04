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
        return request.get('/sales', { params: query })
    }

    async updateRecord(id, data) {
        return request.patch(`/sales/${id}`, data)
    }

    async getRecord(id) {
        return request.get(`/sales/${id}`)
    }

    async deleteRecord(id) {
        return request.delete(`/sales/${id}`)
    }

    async getStats() {
        return request.get('/sales/most-sales')
    }

    async downloadInvoice(number) {
        return request.get(`/sales/invoice/${number}`, { responseType: 'blob' })
    }

    async downloadLogs() {
        return request.get(`/sales/logs`, { responseType: 'blob' })
    }
}

export default new SalesService()