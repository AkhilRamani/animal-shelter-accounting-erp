import mongoose, {Model} from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import {AnimalIncomeModel} from './animalIncome.typedef'

const animalIncomeSchema = new mongoose.Schema({
    date: Date,
    name: String,
    address: String,
    phone: Number,
    total: Number,
    animal: [
        {
            type: {
                type: Number
            },
            count: Number
        }
    ]
})

animalIncomeSchema.plugin(mongoosePaginate)

export const AnimalIncome: Model<AnimalIncomeModel> = mongoose.model<AnimalIncomeModel>('animal_income', animalIncomeSchema)
