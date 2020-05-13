import {Application, Router} from 'express'
import { saveIncome, initVariables, saveExpense, addTrustMember, deleteTrustMember, updateTrustMember, addNote, updateNote, deleteNote, generateFilteredReport, saveEmployee, getEmpDoc, deleteIncome, deleteExpense, editIncome, editExpense, saveAnimalIncome, deleteAnimalIncome, editAnimalIncome, saveDeadAnimal, deleteDeadAnimal, editDeadAnimal, saveGivenAnimal, deleteGivenAnimal, editGivenAnimal, saveAnimalCost, deleteAnimalCost, editAnimalCost, requestOtp, resetPin, updateTrustInfo, saveCheque, editCheque, deleteCheque, filteredChequeReport, getVars, getIncomeExpenseAnalytics, deleteEmployee, editEmployee, smsController, validateOtp } from './controllers'
import { paginationMiddleware } from './middlewares/pagination/pagination.middleware'
import { Income, Expense, TrustMember, Note, Employee, AnimalIncome, DeadAnimal, GivenAnimal, AnimalCost, AnimalStmt, Cheque } from './schema'
import { auth } from './common/auth.common'

export class Routes{

    public routes(app: Application): void{
        const incomeRoute = Router(),
            expenseRoute = Router(),
            employeeRoute = Router(),
            noteRoute = Router(),
            trustMemberRoute = Router(),
            animalIncomeRoute = Router(),
            deadAnimalRoute = Router(),
            givenAnimalRoute = Router(),
            animalCostRouter = Router(),
            animalStmtRouter = Router(),
            variablesRouter = Router(),
            chequeRouter = Router()

        app.post('/auth', auth)
        app.post('/sms/send', smsController)
        app.get('/inex/analytics', getIncomeExpenseAnalytics)

        variablesRouter.post('/setup', initVariables)
        variablesRouter.get('/', getVars)
        variablesRouter.patch('/', updateTrustInfo)
        variablesRouter.get('/req/otp', requestOtp)
        variablesRouter.patch('/reset/pin', resetPin)
        variablesRouter.get('/otp/validate/:otp', validateOtp)

        incomeRoute.post('/add', saveIncome)
        incomeRoute.patch('/edit/:id', editIncome)
        incomeRoute.delete('/delete/:id', deleteIncome)
        incomeRoute.get('/', paginationMiddleware(Income))
        incomeRoute.get('/filter', generateFilteredReport(Income))

        expenseRoute.post('/add', saveExpense)
        expenseRoute.patch('/edit/:id', editExpense)
        expenseRoute.delete('/delete/:id', deleteExpense)
        expenseRoute.get('/', paginationMiddleware(Expense))
        expenseRoute.get('/filter', generateFilteredReport(Expense))

        employeeRoute.post('/add', saveEmployee)
        employeeRoute.get('/', paginationMiddleware(Employee))
        employeeRoute.get('/doc/:id', getEmpDoc)
        employeeRoute.patch('/edit/:id', editEmployee)
        employeeRoute.delete('/delete/:id', deleteEmployee)
        employeeRoute.get('/filter', generateFilteredReport(Employee))

        noteRoute.post('/add', addNote)
        noteRoute.get('/', paginationMiddleware(Note))
        noteRoute.patch('/update/:id', updateNote)
        noteRoute.delete('/delete/:id', deleteNote)

        trustMemberRoute.post('/add', addTrustMember)
        trustMemberRoute.get('/', paginationMiddleware(TrustMember))
        trustMemberRoute.patch('/update/:id', updateTrustMember)
        trustMemberRoute.delete('/delete/:id', deleteTrustMember)
        trustMemberRoute.get('/filter', generateFilteredReport(TrustMember))

        animalIncomeRoute.post('/add', saveAnimalIncome)
        animalIncomeRoute.delete('/delete/:id', deleteAnimalIncome)
        animalIncomeRoute.patch('/edit/:id', editAnimalIncome)
        animalIncomeRoute.get('/', paginationMiddleware(AnimalIncome))
        animalIncomeRoute.get('/filter', generateFilteredReport(AnimalIncome))

        deadAnimalRoute.post('/add', saveDeadAnimal)
        deadAnimalRoute.delete('/delete/:id', deleteDeadAnimal)
        deadAnimalRoute.patch('/edit/:id', editDeadAnimal)
        deadAnimalRoute.get('/', paginationMiddleware(DeadAnimal))
        deadAnimalRoute.get('/filter', generateFilteredReport(DeadAnimal))

        givenAnimalRoute.post('/add', saveGivenAnimal)
        givenAnimalRoute.delete('/delete/:id', deleteGivenAnimal)
        givenAnimalRoute.patch('/edit/:id', editGivenAnimal)
        givenAnimalRoute.get('/', paginationMiddleware(GivenAnimal))
        givenAnimalRoute.get('/filter', generateFilteredReport(GivenAnimal))

        animalCostRouter.post('/add', saveAnimalCost)
        animalCostRouter.delete('/delete/:id', deleteAnimalCost)
        animalCostRouter.patch('/edit/:id', editAnimalCost)
        animalCostRouter.get('/', paginationMiddleware(AnimalCost))
        animalCostRouter.get('/filter', generateFilteredReport(AnimalCost))

        animalStmtRouter.get('/', paginationMiddleware(AnimalStmt))
        animalStmtRouter.get('/filter', generateFilteredReport(AnimalStmt))

        chequeRouter.post('/add', saveCheque)
        chequeRouter.patch('/edit/:id', editCheque)
        chequeRouter.delete('/delete/:id', deleteCheque)
        chequeRouter.get('/', paginationMiddleware(Cheque))
        chequeRouter.get('/filter', filteredChequeReport)
        
        app.use('/income', incomeRoute)
        app.use('/expense', expenseRoute)
        app.use('/employee', employeeRoute)
        app.use('/note', noteRoute)
        app.use('/trust-member', trustMemberRoute)
        app.use('/animal-income', animalIncomeRoute)
        app.use('/dead-animal', deadAnimalRoute)
        app.use('/given-animal', givenAnimalRoute)
        app.use('/animal-cost', animalCostRouter)
        app.use('/animal-stmt', animalStmtRouter)
        app.use('/me', variablesRouter)
        app.use('/cheque', chequeRouter)
    }
}