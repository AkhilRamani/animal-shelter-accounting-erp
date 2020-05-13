import mongoose, { Model } from "mongoose";
import mongoosePaginte from 'mongoose-paginate-v2'
import { AnimalStmtModel } from "./animalStmt.typedef";

const commonType = {
    type: Number,
    default: 0
}

const AnimalStmtSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    added: commonType,
    given: commonType,
    dead: commonType,
    small: commonType,
    big: commonType,
    other: commonType
})

AnimalStmtSchema.plugin(mongoosePaginte)

export const AnimalStmt: Model<AnimalStmtModel> = mongoose.model<AnimalStmtModel>('animal_stmt', AnimalStmtSchema)