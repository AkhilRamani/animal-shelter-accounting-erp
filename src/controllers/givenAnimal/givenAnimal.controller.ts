import { Request, Response } from "express";
import { GivenAnimalModel, VariablesModel } from "../../schema";
import { GivenAnimalRepository, VariablesRepository, AnimalStmtRepository } from "../../repository";
import { countTotalAnimal } from "../../common/utils.common";

const saveGivenAnimal = async (req: Request, res: Response) => {
    try{
        const givenAnimal: GivenAnimalModel = req.body
        const givenAnimalRepo = new GivenAnimalRepository()
        const variablesRepo = new VariablesRepository()
        const animalStmtRepo = new AnimalStmtRepository()

        const savedDoc = await givenAnimalRepo.save(givenAnimal)
        const {stats} = await variablesRepo.updateAnimals(givenAnimal.animal).dec()

        //save to animal stmt report
        animalStmtRepo.saveToAnimalStmt(savedDoc.date, {
            given: countTotalAnimal(savedDoc.animal),
            small: stats.animal.small,
            big: stats.animal.big,
            other: stats.animal[10]
        })

        res.json({animal: savedDoc, stats})
    }
    catch(e){
        console.log(e)
        res.status(400).send({message: e.message})
    }
}

const deleteGivenAnimal = async (req: Request, res: Response) => {
    try{
        const id = req.params.id
        const givenAnimalRepo = new GivenAnimalRepository()
        const variablesRepo = new VariablesRepository()
        const animalStmtRepo = new AnimalStmtRepository()

        const deletedDoc = await givenAnimalRepo.delete(id)
        const {stats} = await variablesRepo.updateAnimals(deletedDoc.animal).inc()

        //update animal stmt report
        animalStmtRepo.saveToAnimalStmt(deletedDoc.date, {
            given: -countTotalAnimal(deletedDoc.animal),
            small: stats.animal.small,
            big: stats.animal.big,
            other: stats.animal[10]
        })

        res.json({animal: deletedDoc, stats})
    }
    catch(e){
        console.log(e)
        res.status(400).send({message: e.message})
    }
}

const editGivenAnimal = async (req: Request, res: Response) => {
    try{
        const id = req.params.id
        const givenAnimal: GivenAnimalModel = req.body
        let stats: VariablesModel
        const givenAnimalRepo = new GivenAnimalRepository()
        const variablesRepo = new VariablesRepository()
        const animalStmtRepo = new AnimalStmtRepository()

        const doc = await givenAnimalRepo.update(id, givenAnimal)
        if(givenAnimal.animal){
            await variablesRepo.updateAnimals(doc.oldAnimal.animal).inc()
            stats = await variablesRepo.updateAnimals(doc.updatedGivenAnimal.animal).dec()
        }
        else{
            stats = await variablesRepo.get()
        }

        //update animal stmt report
        animalStmtRepo.saveToAnimalStmt(doc.updatedGivenAnimal.date, {
            given: -countTotalAnimal(doc.oldAnimal.animal) + countTotalAnimal(doc.updatedGivenAnimal.animal),
            small: stats.stats.animal.small,
            big: stats.stats.animal.big,
            other: stats.stats.animal[10]
        })

        res.json({ animal: doc.updatedGivenAnimal, stats: stats.stats })
    }
    catch(e){
        console.log(e)
        res.status(400).send({message: e.message})
    }
}

export {
    saveGivenAnimal,
    deleteGivenAnimal,
    editGivenAnimal
}