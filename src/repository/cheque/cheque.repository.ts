import {Cheque, ChequeModel} from '../../schema'

export class ChequeRepository{
    async save(data: ChequeModel){
        const cheque = new Cheque(data)
        const doc = await cheque.save()
        return doc
    }

    async delete(id: string){
        const deletedDoc = await Cheque.findByIdAndDelete(id)
        return deletedDoc
    }

    async update(id: string, data: ChequeModel){
        const updatedDoc = await Cheque.findByIdAndUpdate(id, { $set: data }, { new: true })
        return updatedDoc
    }

    async filter({ dateFrom=null, dateTo=null, chequeNo=null, name=null, phone=null, amountFrom=null, amountTo=null, bank=null }){
        const query = {}
        if(dateFrom && dateTo) query['date'] = {
            $gte: new Date(dateFrom), $lt: new Date(dateTo)
        }
        if(chequeNo) query['no'] = chequeNo
        if(name) query['name'] = name
        if(phone) query['phone'] = phone
        if(amountFrom && amountTo) query['amount'] = {
            $gte: amountFrom, $lt: amountTo
        }
        if(bank) query['bank'] = bank

        const records = await Cheque.find(query).sort({ _id: -1 })
        return records
    }
}