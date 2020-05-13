import {Document, Types} from 'mongoose'

export interface ChequeModel extends Document{
    _id: Types.ObjectId
    date: Date
    bank: string
    no: number
    name: string
    phone: number
    amount: number
}