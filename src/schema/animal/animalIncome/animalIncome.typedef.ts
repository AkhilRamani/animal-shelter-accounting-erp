import {Document, Types} from 'mongoose'

export interface AnimalModel{
    type: number
    count: number
}

export interface AnimalIncomeModel extends Document{
    _id: Types.ObjectId
    date: Date,
    name: string
    address: string
    phone: number
    total: number
    animal: AnimalModel[]
    paginate: () => {}
}