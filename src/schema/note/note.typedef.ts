import {Document, Types} from 'mongoose'

export interface NoteModel extends Document{
    _id: Types.ObjectId
    title: string
    description: string
}