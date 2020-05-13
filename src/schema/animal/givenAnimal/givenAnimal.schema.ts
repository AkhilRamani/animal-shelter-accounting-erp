import mongoose, {Model} from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import { GivenAnimalModel } from './givenAnimal.typedef'

const GivenAnimalSchema = new mongoose.Schema({
    date: Date,
    tag: Number,
    name: String,
    phone: Number,
    address: String,
    animal: [
        {
            type: {
                type: Number
            },
            count: Number
        }
    ]
})

GivenAnimalSchema.plugin(mongoosePaginate)

export const GivenAnimal: Model<GivenAnimalModel> = mongoose.model<GivenAnimalModel>('given-animal', GivenAnimalSchema) 