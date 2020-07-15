import { Request, Response } from "express";
import { AnimalCostModel } from "../../schema";
import { AnimalCostRepository, VariablesRepository } from "../../repository";

const saveAnimalCost = async (req: Request, res: Response) => {
    try{
        const animalExpense: AnimalCostModel = req.body
        const animalExpenseRepo = new AnimalCostRepository()
        const variablesRepo = new VariablesRepository()
        
        const {stats} = await variablesRepo.updateCapital(animalExpense.total).dec()
        
        //adds total numbers of aniamls available at a entry date
        animalExpense.total_animal = stats.animal.big + stats.animal.small + stats.animal[10]
        
        const savedDoc = await animalExpenseRepo.save(animalExpense)

        res.json({ expense: savedDoc, stats })
    }
    catch(e){
        res.status(400).send({ message: e.message })
    }
}

const deleteAnimalCost = async (req: Request, res: Response) => {
    try{
        const id = req.params.id
        const animalExpenseRepo = new AnimalCostRepository()
        const variablesRepo = new VariablesRepository()
        
        const deletedDoc = await animalExpenseRepo.delete(id)
        const {stats} = await variablesRepo.updateCapital(deletedDoc.total).inc()

        res.json({ expense: deletedDoc, stats })
    }
    catch(e){
        res.status(400).send({ message: e.message })
    }
}

const editAnimalCost = async (req: Request, res: Response) => {
    try{
        const id = req.params.id
        const animalExpense: AnimalCostModel = req.body
        let stats: any
        const animalExpenseRepo = new AnimalCostRepository()
        const variablesRepo = new VariablesRepository()
        
        const expense = await animalExpenseRepo.update(id, animalExpense)
        if(animalExpense.total){
            stats = await variablesRepo.updateCapital(expense.oldDoc.total - expense.updatedDoc.total).inc()
        }
        else{
            stats = await variablesRepo.get()
        }

        res.json({ expense: expense.updatedDoc, stats: stats.stats })
    }
    catch(e){
        res.status(400).send({ message: e.message })
    }
}

export { 
    saveAnimalCost,
    deleteAnimalCost,
    editAnimalCost
}