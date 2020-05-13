import mongoose, {Model} from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import { ChequeModel } from './cheque.typedef'

const ChequeSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    bank: {
        type: String,
        required: true
    },
    no: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
})

ChequeSchema.plugin(mongoosePaginate)

export const Cheque: Model<ChequeModel> = mongoose.model<ChequeModel>('cheque', ChequeSchema)