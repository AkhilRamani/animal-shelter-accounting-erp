import mongoose, {Model} from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import {ExpenseModel} from './expense.typedef'

const commonStringType = {
    type: String,
    required: true,
    trim: true
}

const ExpenseSchema = new mongoose.Schema({
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
    pan_no: {
        type: String,
        trim: true
    },
    ref_name: {
        type: String,
        trim: true
    },
    note: {
        type: String,
        trim: true
    }
})

ExpenseSchema.plugin(mongoosePaginate)

export const Expense: Model<ExpenseModel> = mongoose.model<ExpenseModel>('expense', ExpenseSchema)