import {DeadAnimalRepository, VariablesRepository, AnimalStmtRepository} from '../../repository'
import { Request, Response } from 'express'
import { DeadAnimalModel, VariablesModel } from '../../schema'
import { countTotalAnimal } from '../../common/utils.common'

const saveDeadAnimal = async (req: Request, res: Response) => {
    try{
        const deadAnimal: DeadAnimalModel = req.body
        const deadAnimalRepo = new DeadAnimalRepository()
        const variablesRepo = new VariablesRepository()
        const animalStmtRepo = new AnimalStmtRepository()

        const doc = await deadAnimalRepo.save(deadAnimal)
        const {stats} = await variablesRepo.updateAnimals(deadAnimal.animal).dec()

        //save animal stmt report
        animalStmtRepo.saveToAnimalStmt(doc.date, {
            dead: countTotalAnimal(doc.animal),
            small: stats.animal.small,
            big: stats.animal.big,
            other: stats.animal[10]
        })

        res.json({animal: doc, stats})
    }
    catch(e){
        console.log(e)
        res.status(400).send({message: e.message})
    }
}

const deleteDeadAnimal = async (req: Request, res: Response) => {
    try{
        const id = req.params.id
        const deadAnimalRepo = new DeadAnimalRepository()
        const variablesRepo = new VariablesRepository()
        const animalStmtRepo = new AnimalStmtRepository()

        const deletedDeadAnimal = await deadAnimalRepo.delete(id)
        const {stats} = await variablesRepo.updateAnimals(deletedDeadAnimal.animal).inc()

        //update animal stmt report
        animalStmtRepo.saveToAnimalStmt(deletedDeadAnimal.date, {
            dead: -countTotalAnimal(deletedDeadAnimal.animal),
            small: stats.animal.small,
            big: stats.animal.big,
            other: stats.animal[10]
        })

        res.json({animal: deletedDeadAnimal, stats})
    }
    catch(e){
        console.log(e)
        res.status(400).send({message: e.message})
    }
}

const editDeadAnimal = async (req: Request, res: Response) => {
    try{
        const id = req.params.id
        const deadAnimal: DeadAnimalModel = req.body
        let stats: VariablesModel
        const deadAnimalRepo = new DeadAnimalRepository()
        const variablesRepo = new VariablesRepository()
        const animalStmtRepo = new AnimalStmtRepository()

        const doc = await deadAnimalRepo.update(id, deadAnimal)
        if(deadAnimal.animal){
            await variablesRepo.updateAnimals(doc.oldDeadAnimal.animal).inc()
            stats = await variablesRepo.updateAnimals(doc.updatedDeadAnimal.animal).dec()
        }
        else{
            stats = await variablesRepo.get()
        }

        //update animal stmt report
        animalStmtRepo.saveToAnimalStmt(doc.updatedDeadAnimal.date, {
            dead: -countTotalAnimal(doc.oldDeadAnimal.animal) + countTotalAnimal(doc.updatedDeadAnimal.animal),
            small: stats.stats.animal.small,
            big: stats.stats.animal.big,
            other: stats.stats.animal[10]
        })

        res.json({ animal: doc.updatedDeadAnimal, stats: stats.stats })
    }
    catch(e){
        console.log(e)
        res.status(400).send({message: e.message})
    }
}

export {
    saveDeadAnimal,
    deleteDeadAnimal,
    editDeadAnimal
}