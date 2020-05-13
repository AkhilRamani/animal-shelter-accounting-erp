import { AnimalCostModel, AnimalCost } from "../../schema";

export class AnimalCostRepository{
    async save(data: AnimalCostModel){
        const animalExpense = new AnimalCost(data)
        const savedDoc = await animalExpense.save()
        return savedDoc
    }

    async delete(id: string){
        const deletedDoc = await AnimalCost.findByIdAndDelete(id)
        return deletedDoc
    }

    async update(id: string, data: AnimalCostModel){
        const oldDoc = await AnimalCost.findById(id, { _id: 0, total: 1 })
        const updatedDoc = await AnimalCost.findByIdAndUpdate(id, { $set: data }, { new: true })
        return { updatedDoc, oldDoc }
    }
}