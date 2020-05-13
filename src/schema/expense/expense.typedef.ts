import {Document, Types} from 'mongoose'

interface itemModel{
    type: string
    amount: number
}

export interface ExpenseModel extends Document{
    _id: Types.ObjectId
    slip_no: string
    date: Date
    type: number
    name: string
    address: string
    phone: number
    money: {
        type: string
        amount: number
        cheque_no: number
    }
    item: itemModel[]
    pan_no: string
    ref_name: string
    note: string
}