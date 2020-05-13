import { GivenAnimalModel, GivenAnimal } from "../../schema";

export class GivenAnimalRepository{
    async save(data: GivenAnimalModel){
        const givenAnimal = new GivenAnimal(data)
        const doc = await givenAnimal.save()
        return doc
    }

    async delete(id: string){
        const deletedDoc = await GivenAnimal.findByIdAndDelete(id)
        return deletedDoc
    }

    async update(id: string, data: GivenAnimalModel){
        const oldAnimal = await GivenAnimal.findById(id, {_id: 0, animal: 1})
        const updatedGivenAnimal = await GivenAnimal.findByIdAndUpdate(id, { $set: data }, { new: true })
        return { updatedGivenAnimal, oldAnimal }
    }
}