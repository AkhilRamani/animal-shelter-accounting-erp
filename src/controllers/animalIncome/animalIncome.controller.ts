import { Request, Response } from "express";
import { AnimalIncomeRepository, VariablesRepository, AnimalStmtRepository, } from "../../repository";
import { AnimalIncomeModel, VariablesModel } from "../../schema";

//aavela pashu
const saveAnimalIncome = async (req: Request, res: Response) => {
    try{
        const animal = req.body
        const animalIncomeRepo = new AnimalIncomeRepository()
        const variablesRepo = new VariablesRepository()
        const animalStmtRepo = new AnimalStmtRepository()

        const doc = await animalIncomeRepo.save(animal)
        const {stats}: VariablesModel = await variablesRepo.updateAnimals(animal.animal).inc()

        //adding entry to animal stmt report
        animalStmtRepo.saveToAnimalStmt(doc.date, {
            added: doc.total, 
            small: stats.animal.small, 
            big: stats.animal.big, 
            other: stats.animal[10]
        })

        res.json({ animal: doc, stats})
    }
    catch(e){
        console.log(e)
        res.status(400).send(e.message)
    }
}

const deleteAnimalIncome = async (req: Request, res: Response) => {
    try{
        const id = req.params.id
        const animalIncomeRepo = new AnimalIncomeRepository()
        const variablesRepo = new VariablesRepository()
        const animalStmtRepo = new AnimalStmtRepository()

        const doc = await animalIncomeRepo.delete(id)
        const {stats} = await variablesRepo.updateAnimals(doc.animal).dec()

        //updating animal stmt report
        animalStmtRepo.saveToAnimalStmt(doc.date, {
            added: -doc.total,
            small: stats.animal.small,
            big: stats.animal.big,
            other: stats.animal[10]
        })


        res.json({ animal: doc, stats })
    }
    catch(e){
        console.log(e)
        res.status(400).send(e.message)
    }
}

const editAnimalIncome = async (req: Request, res: Response) => {
    try{
        const id = req.params.id
        const animalIncome: AnimalIncomeModel = req.body
        let stats: VariablesModel
        const animalIncomeRepo = new AnimalIncomeRepository()
        const variablesRepo = new VariablesRepository()
        const animalStmtRepo = new AnimalStmtRepository()

        const doc = await animalIncomeRepo.update(id, animalIncome)
        if(animalIncome.animal){
            await variablesRepo.updateAnimals(doc.oldAnimals.animal).dec()
            stats = await variablesRepo.updateAnimals(doc.updatedAnimalIncome.animal).inc()
        }
        else{
            stats = await variablesRepo.get()
        }

        //updating animal stmt report
        animalStmtRepo.saveToAnimalStmt(doc.updatedAnimalIncome.date, { 
            added: -doc.oldAnimals.total + doc.updatedAnimalIncome.total, 
            small: stats.stats.animal.small,
            big: stats.stats.animal.big,
            other: stats.stats.animal[10]
        })

        res.json({ animal: doc.updatedAnimalIncome, stats: stats.stats })
    }
    catch(e){
        console.log(e)
        res.status(400).send({message: e.message})
    }
}

export {
    saveAnimalIncome,
    deleteAnimalIncome,
    editAnimalIncome
}