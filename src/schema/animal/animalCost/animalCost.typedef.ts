import {Document, Types} from 'mongoose'

export interface AnimalCostModel extends Document{
    _id: Types.ObjectId
    date: Date
    total: number
    total_animal: number
    item: { 
        ghas: number,
        charo: number,
        dan: number,
        majuri: number,
        doctor: number,
        other: number
    }
}