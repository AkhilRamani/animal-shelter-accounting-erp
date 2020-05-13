import mongoose, {Model} from 'mongoose'
import { AnimalCostModel } from './animalCost.typedef'
import mongoosePaginate from 'mongoose-paginate-v2'

const AnimalCostSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    total_animal: {
        type: Number,
        required: true
    },
    item: {
        ghas: Number,
        charo: Number,
        dan: Number,
        majuri: Number,
        doctor: Number,
        other: Number
    }
})

AnimalCostSchema.plugin(mongoosePaginate)

export const AnimalCost: Model<AnimalCostModel> = mongoose.model<AnimalCostModel>('animal_cost', AnimalCostSchema) 