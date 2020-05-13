import {Request, Response} from 'express'
import {Model as MongoModel} from 'mongoose'
import { IncomeModel, ExpenseModel, EmployeeModel, TrustMemberModel, AnimalIncomeModel, DeadAnimalModel, AnimalCostModel, GivenAnimalModel, AnimalStmtModel, GivenAnimal } from '../../schema'
import { IncomeRepository, ExpenseRepository } from '../../repository'
import {getStatusCode} from '../../common/utils.common'
import {sendSms} from '../../common/sms.common'
import { insufficientSmsBalanceException } from '../../common/exceptions.common'

export const generateFilteredReport = (Model: MongoModel<IncomeModel | ExpenseModel | EmployeeModel | TrustMemberModel | AnimalIncomeModel | DeadAnimalModel | AnimalCostModel | GivenAnimalModel | AnimalStmtModel >) => async (req: Request, res: Response) => {
    try{
        const { dateFrom = null, dateTo = null, type = null, moneyType = null, slipNo = null, chequeNo = null, amountFrom = null, amountTo = null, position = null, tag = null} = req.query

        const genFilter = () => {
            const query = {}
            if(dateFrom) {
                const dateEnd = new Date(dateTo as string)
                dateEnd.setHours(23,59,59,0)

                query['date'] = {
                    $gte: new Date(dateFrom as string), $lt: dateEnd
                }
            }
            if(type) query['type'] = type
            if(moneyType) query['money.type'] = moneyType
            if(chequeNo) query['money.cheque_no'] = chequeNo
            if(slipNo) query['slip_no'] = slipNo
            if(amountFrom && amountTo) query['money.amount'] = {
                $gte: amountFrom, $lt: amountTo
            }
            if(position) query['position'] = position
            if(tag) query['tag'] = tag
            return query
        }

        const records = await Model.find(genFilter()).sort({_id: -1})
        res.json(records)
    }
    catch(e){
        console.log(e)
        res.status(400).send({message: e.message})
    }
}

export const getIncomeExpenseAnalytics = async (req: Request, res: Response) => {
    try{
        const crrntDate = new Date()
        const prvDate = new Date()
        prvDate.setMonth(prvDate.getMonth() - 11)
        prvDate.setDate(1)
        prvDate.setUTCHours(0,0,0,0)

        const incomeRepo = new IncomeRepository()
        const expenseRepo = new ExpenseRepository()

        const [incomes, expenses] = await Promise.all([
            await incomeRepo.getForAnalytics(prvDate, crrntDate),
            await expenseRepo.getForAnalytics(prvDate, crrntDate)
        ])

        const genMonthlyData = (arr: IncomeModel[] | ExpenseModel[]) => {
            let monthlyData = []
            arr.forEach(record => {
                const year = record.date.getUTCFullYear()
                const month = record.date.getMonth() + 1
                const index = monthlyData.findIndex(data => data.month === month)

                if(index > -1){
                    monthlyData[index].amount += record.money.amount
                }
                else{
                    monthlyData.push({
                        month,
                        year,
                        amount: record.money.amount
                    })
                }
            })
            return monthlyData
        }

        const fillUnavailableDatesData = (arr: IncomeModel[] | ExpenseModel[]) => {
            const monthlyData = genMonthlyData(arr)
            const prvMonth = prvDate.getMonth() + 1
            const prvYear = prvDate.getUTCFullYear()
            const crrntMonth = crrntDate.getMonth() + 1
            const crrntYear = crrntDate.getUTCFullYear()

            const pushEmptyData = (month, year) => monthlyData.push({ month, year, amount: 0 })

            for(let i = prvMonth; i<=12; i++){
                const index = monthlyData.findIndex(data => data.month == i && data.year == prvYear)
                if(index < 0) pushEmptyData(i, prvYear)
            }
            for(let i = 1; i <= crrntMonth; i++){
                const index = monthlyData.findIndex(data => data.month == i && data.year == crrntYear)
                if(index < 0) pushEmptyData(i, crrntYear)
            }
            return monthlyData
        }
        

        res.json({
            income: fillUnavailableDatesData(incomes),
            expense: fillUnavailableDatesData(expenses)
        })
    }
    catch(e){
        res.status(e.code || 400).send({message: e.message})
    }
}

export const smsController = async (req: Request, res: Response) => {
    try{
        const phone: number = req.body.phone;
        const msg: string = req.body.message;
        
        const smsRes: any = await sendSms(phone, msg, 'unicode')
        if(smsRes.responseCode == 3011) throw new insufficientSmsBalanceException()
    }
    catch(e){
        res.status(getStatusCode(e.code)).send({ message: e.message })
    }
}