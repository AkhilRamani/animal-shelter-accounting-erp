import {Request, Response} from 'express'
import {ExpenseRepository, VariablesRepository} from '../../repository'
import { VariablesModel } from '../../schema'

const saveExpense = async (req: Request, res: Response) => {
    try{
        const expense = req.body
        const expenseRepo = new ExpenseRepository()
        const variableRepo = new VariablesRepository()

        const savedExpense = await expenseRepo.save(expense)
        const {stats} = await variableRepo.updateCapital(savedExpense.money.amount).dec()

        res.json({expense: savedExpense, stats })
    }
    catch(e){
        console.log(e)
        res.status(400).send({message: e.message})
    }
}

const editExpense = async (req: Request, res: Response) => {
    try{
        const expenseId = req.params.id
        const expense = req.body
        var stats: VariablesModel
        const expenseRepo = new ExpenseRepository()
        const variablesRepo = new VariablesRepository()

        const doc = await expenseRepo.update(expenseId, expense)
        if(expense.money){
            stats = await variablesRepo.updateCapital( doc.oldAmount - doc.updatedExpense.money.amount ).inc()
        }
        else{
            stats = await variablesRepo.get()
        }
        res.json({expense: doc.updatedExpense, stats: stats.stats})
    }
    catch(e){
        console.log(e)
        res.status(e.code || 400).send({message: e.message})
    }
}

const deleteExpense = async (req: Request, res: Response) => {
    try{
        const expenseId: string = req.params.id
        const expenseRepo = new ExpenseRepository()
        const variablesRepo = new VariablesRepository()

        const deletedExpense = await expenseRepo.delete(expenseId)
        const {stats} = await variablesRepo.updateCapital(deletedExpense.money.amount).inc()

        res.send({expense: deletedExpense, stats })
    }
    catch(e){
        console.log(e)
        res.status(400).send()
    }
}

export {
    saveExpense,
    editExpense,
    deleteExpense
}