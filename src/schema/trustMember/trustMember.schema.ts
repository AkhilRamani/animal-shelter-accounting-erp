import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import {TrustMemberModel} from './trustMember.typedef'

const TrustMemberSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    position: {
        type: String,
        trim: true,
        required: true
    },
    phone: {
        type: Number,
        required: true
    }
})

TrustMemberSchema.plugin(mongoosePaginate)

export const TrustMember: mongoose.Model<TrustMemberModel> = mongoose.model<TrustMemberModel>('TrustMember', TrustMemberSchema)