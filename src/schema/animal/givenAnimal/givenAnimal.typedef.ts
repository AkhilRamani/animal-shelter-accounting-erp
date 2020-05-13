import {Document, Types} from 'mongoose'
import { AnimalModel } from '../animal.typedef';

export interface GivenAnimalModel extends Document{
    _id: Types.ObjectId
    date: Date
    tag: number
    name: string
    phone: number
    address: string
    animal: AnimalModel[]
}