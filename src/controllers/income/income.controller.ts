import {Request, Response} from 'express'
import {IncomeRepository, VariablesRepository} from '../../repository'
import { VariablesModel } from '../../schema'

const saveIncome = async (req: Request, res: Response) => {
    try{
        const income = req.body
        const incomeRepo = new IncomeRepository()
        const variablesRepo = new VariablesRepository()

        const savedIncome = await incomeRepo.save(income)
        const {stats} = await variablesRepo.updateCapital(savedIncome.money.amount).inc()
        
        res.send({income: savedIncome, stats })
    }
    catch(e){
        console.log(e)
        res.status(400).send()
    }
}

const editIncome = async (req: Request, res: Response) => {
    try{
        const incomeId: string = req.params.id
        const income = req.body
        var stats: VariablesModel
        const incomeRepo = new IncomeRepository()
        const variablesRepo = new VariablesRepository()

        const doc = await incomeRepo.update(incomeId, income)
        if(income.money){
            stats = await variablesRepo.updateCapital( - doc.oldAmount + doc.updatedIncome.money.amount ).inc()
        }
        else{
            stats = await variablesRepo.get()
        }
        res.json({income: doc.updatedIncome, stats: stats.stats })
    }
    catch(e){
        console.log(e)
        res.status(400).send()
    }
}

const deleteIncome = async (req: Request, res: Response) => {
    try{
        const incomeId: string = req.params.id
        const incomeRepo = new IncomeRepository()
        const variablesRepo = new VariablesRepository()

        const deletedIncome = await incomeRepo.delete(incomeId)
        const {stats} = await variablesRepo.updateCapital(deletedIncome.money.amount).dec()

        res.send({income: deletedIncome, stats })
    }
    catch(e){
        console.log(e)
        res.status(400).send()
    }
}

export {
    saveIncome,
    editIncome,
    deleteIncome
}