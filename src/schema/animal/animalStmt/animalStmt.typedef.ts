import { Document, Types } from "mongoose";

export interface AnimalStmtModel extends Document{
    _id: Types.ObjectId
    date: Date
    added: number
    given: number
    dead: number
    small: number
    big: number
    other: number
} 