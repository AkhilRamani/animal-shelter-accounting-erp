import {Document, Types} from 'mongoose'

export interface TrustMemberModel extends Document{
    _id: Types.ObjectId
    name: string
    position: string
    phone: string
}