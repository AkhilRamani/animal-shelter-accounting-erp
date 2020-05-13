import mongoose, {Model} from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import {NoteModel} from './note.typedef'

const NoteSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        maxlength: 10
    },
    description: {
        type: String,
        trim: true
    }
})

NoteSchema.plugin(mongoosePaginate)

export const Note: Model<NoteModel> = mongoose.model<NoteModel>('note', NoteSchema)