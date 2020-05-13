import mongoose, { Model } from 'mongoose'
import {EmployeeModel} from './employee.typedef'
import mongoosePaginate from 'mongoose-paginate-v2'

const EmployeeSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phone: Number,
    address: String
})

EmployeeSchema.plugin(mongoosePaginate)

export const Employee: Model<EmployeeModel> = mongoose.model<EmployeeModel>('employee', EmployeeSchema)