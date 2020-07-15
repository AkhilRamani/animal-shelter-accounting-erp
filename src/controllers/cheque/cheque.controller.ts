import { Request, Response } from 'express'
import {ChequeRepository} from '../../repository'
import { ChequeModel } from '../../schema';

const saveCheque = async (req: Request, res: Response) => {
    try{
        const chequeData: ChequeModel = req.body
        const chequeRepo = new ChequeRepository()

        const savedCheque = await chequeRepo.save(chequeData)
        res.json(savedCheque)
    }
    catch(e){
        console.log(e);
        res.status(e.code || 400).send({message: e.message})
    }
}

const editCheque = async (req: Request, res: Response) => {
    try{
        const id: string = req.params.id
        const chequeData: ChequeModel = req.body
        const chequeRepo = new ChequeRepository()

        const updatedCheque = await chequeRepo.update(id, chequeData)
        res.json(updatedCheque)
    }
    catch(e){
        console.log(e);
        res.status(e.code || 400).send({message: e.message})
    }
}

const deleteCheque = async (req: Request, res: Response) => {
    try{
        const id: string = req.params.id
        const chequeRepo = new ChequeRepository()

        const deletedCheque = await chequeRepo.delete(id)
        res.json(deletedCheque)
    }
    catch(e){
        console.log(e);
        res.status(e.code || 400).send({message: e.message})
    }
}

const filteredChequeReport = async (req: Request, res: Response) => {
    try{
        const chequeRepo = new ChequeRepository()

        const records = await chequeRepo.filter(req.query)
        res.json(records)
    }
    catch(e){
        console.log(e);
        res.status(e.code || 400).send({message: e.message})
    }
}

export {
    saveCheque,
    editCheque,
    deleteCheque,
    filteredChequeReport
}