import mongoose, {Model} from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'
import {IncomeModel} from './income.typedef'

const commonStringType = {
    type: String,
    required: true,
    trim: true
}

const IncomeSchema = new mongoose.Schema({
    slip_no: Number,
    date: Date,
    type: {
        type: Number,
        required: true
    },
    name: commonStringType,
    address: commonStringType,
    phone: {
        type: Number,
        required: true
    },
    money: {
        type: {
            type: String,
            enum: ['cash', 'cheque'],
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        cheque_no: Number
    },
    item: [
        {
            type: {
                type: String,
                trim: true
            },
            amount: Number
        }
    ],
    ref_name: {
        type: String,
        trim: true
    },
    note: {
        type: String,
        trim: true
    }
})

IncomeSchema.plugin(mongoosePaginate)

export const Income: Model<IncomeModel> = mongoose.model<IncomeModel>('income', IncomeSchema)
