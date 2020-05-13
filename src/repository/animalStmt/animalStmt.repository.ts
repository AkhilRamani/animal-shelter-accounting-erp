import _ from 'lodash'
import { AnimalStmtModel, AnimalStmt } from "../../schema";

// {added: number, given: number, dead: number, small: number, big: number, other: number}

export class AnimalStmtRepository{
    async saveToAnimalStmt(date: Date, data: any){
        const doc = await AnimalStmt.findOne({date})
        const object: any = _.pick(data, ['added', 'given', 'dead'])
        const {small, big, other} = data

        let savedStmt
        if(doc){
            savedStmt = await AnimalStmt.findByIdAndUpdate(doc._id, { $inc: object, $set: { small, big, other } }, {new: true})
        }
        else{
            const animalStmt = new AnimalStmt({date, ...object, small, big, other})
            savedStmt = await animalStmt.save()
        }

        return savedStmt
    }

    async delete(id: string){
        const deletedDoc = await AnimalStmt.findByIdAndDelete(id)
        return deletedDoc
    }
}