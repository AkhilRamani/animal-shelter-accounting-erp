import {AnimalIncome, AnimalIncomeModel} from '../../schema'

export class AnimalIncomeRepository{
    async save(data: AnimalIncomeModel){
        const animal = new AnimalIncome(data)
        const doc = await animal.save()
        return doc
    }

    async delete(id: string){
        const doc = await AnimalIncome.findByIdAndDelete(id)
        return doc
    }

    async update(id: string, data: AnimalIncomeModel){
        const oldAnimals = await AnimalIncome.findById(id, {_id: 0, animal: 1, total: 2 })
        const doc = await AnimalIncome.findByIdAndUpdate(id, { $set: data }, { new: true })
        return { updatedAnimalIncome: doc, oldAnimals }
    }
}