import {DeadAnimal, DeadAnimalModel} from '../../schema'

export class DeadAnimalRepository{
    async save(data: DeadAnimalModel){
        // console.log(data)

        const deadAnimal = new DeadAnimal(data)
        const doc = await deadAnimal.save()
        return doc
    }

    async update(id: string, data: DeadAnimalModel){
        const oldDeadAnimal = await DeadAnimal.findById(id, { _id: 0, animal: 1 })
        const updatedDeadAnimal = await DeadAnimal.findByIdAndUpdate(id, { $set: data }, { new: true })
        return { updatedDeadAnimal, oldDeadAnimal }
    }

    async delete(id: string){
        const deletedDoc = await DeadAnimal.findByIdAndDelete(id)
        return deletedDoc
    }
}