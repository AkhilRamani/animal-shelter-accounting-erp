import {Note, NoteModel} from '../../schema'
import { NoRecordWithIDException } from '../../common/exceptions.common'

export class NoteRepository{
    save(data: NoteModel){
        const note = new Note(data)
        return note.save()
    }

    async update(id: string, data: NoteModel){
        const updatedDoc = await Note.findByIdAndUpdate(id, {
            $set: data
        }, {new: true})

        if(!updatedDoc) throw new NoRecordWithIDException()
        return updatedDoc
    }

    async delete(id: string){
        const deletedDoc = await Note.findByIdAndDelete(id)
        if(!deletedDoc) throw new NoRecordWithIDException()
        return {_id: deletedDoc._id}
    }
}