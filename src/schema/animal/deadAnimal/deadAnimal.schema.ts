import mongoose, {Model} from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import {DeadAnimalModel} from './deadAnimal.typedef'

const DeadAnimalSchema = new mongoose.Schema({
    date: Date,
    note: String,
    animal: [
        {
            type: {
                type: Number
            },
            count: Number
        }
    ]
})

DeadAnimalSchema.plugin(mongoosePaginate)

export const DeadAnimal: Model<DeadAnimalModel> = mongoose.model<DeadAnimalModel>('dead_animal', DeadAnimalSchema)