import {Document, Types} from 'mongoose'
import { AnimalModel } from '../..';

export interface DeadAnimalModel extends Document{
    _id: Types.ObjectId
    date: Date
    note: string
    animal: AnimalModel[]
}