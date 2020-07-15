import { Request, Response } from 'express'
import { Model as MongoModel } from 'mongoose'
import { IncomeModel, ExpenseModel, EmployeeModel, TrustMemberModel, AnimalIncomeModel, DeadAnimalModel, AnimalCostModel, GivenAnimalModel, AnimalStmtModel, GivenAnimal } from '../../schema'
import { IncomeRepository, ExpenseRepository } from '../../repository'
import { getStatusCode } from '../../common/utils.common'
import { sendSms } from '../../common/sms.common'
import { insufficientSmsBalanceException } from '../../common/exceptions.common'

export const generateFilteredReport = (Model: MongoModel<IncomeModel | ExpenseModel | EmployeeModel | TrustMemberModel | AnimalIncomeModel | DeadAnimalModel | AnimalCostModel | GivenAnimalModel | AnimalStmtModel>) => async (req: Request, res: Response) => {
    try {
        const { dateFrom = null, dateTo = null, type = null, moneyType = null, slipNo = null, chequeNo = null, amountFrom = null, amountTo = null, position = null, tag = null } = req.query

        const genFilter = () => {
            const query = {}
            if (dateFrom) {
                const dateEnd = new Date(dateTo as string)
                dateEnd.setHours(23, 59, 59, 0)

                query['date'] = {
                    $gte: new Date(dateFrom as string), $lt: dateEnd
                }
            }
            if (type) query['type'] = type
            if (moneyType) query['money.type'] = moneyType
            if (chequeNo) query['money.cheque_no'] = chequeNo
            if (slipNo) query['slip_no'] = slipNo
            if (amountFrom && amountTo) query['money.amount'] = {
                $gte: amountFrom, $lt: amountTo
            }
            if (position) query['position'] = position
            if (tag) query['tag'] = tag
            return query
        }

        const records = await Model.find(genFilter()).sort({ _id: -1 })
        res.json(records)
    }
    catch (e) {
        console.log(e)
        res.status(400).send({ message: e.message })
    }
}

export const getIncomeExpenseAnalytics = async (req: Request, res: Response) => {
    try {
        //----------OLD LOGIC-------------
        // const crrntDate = new Date()
        // const prvDate = new Date()
        // prvDate.setMonth(prvDate.getMonth() - 11)
        // prvDate.setDate(1)
        // prvDate.setUTCHours(0,0,0,0)
        //--------------------------------
        const crrntYear = new Date().getFullYear()
        const crrntDate = new Date(crrntYear, 11, 31, 23, 59, 59)
        const prvDate = new Date(crrntYear, 0, 1, 24)

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

                if (index > -1) {
                    monthlyData[index].amount += record.money.amount
                }
                else {
                    monthlyData.push({
                        month,
                        year,
                        amount: record.money.amount
                    })
                }
            })
            return monthlyData
        }

        //--------------OLD CODE-------------------
        // const fillUnavailableDatesData = (arr: IncomeModel[] | ExpenseModel[]) => {
        //     const monthlyData = genMonthlyData(arr)
        //     const prvMonth = prvDate.getMonth() + 1
        //     const prvYear = prvDate.getUTCFullYear()
        //     const crrntMonth = crrntDate.getMonth() + 1
        //     const crrntYear = crrntDate.getUTCFullYear()

        //     const pushEmptyData = (month, year) => monthlyData.push({ month, year, amount: 0 })

        //     for(let i = prvMonth; i<=12; i++){
        //         const index = monthlyData.findIndex(data => data.month == i && data.year == prvYear)
        //         if(index < 0) pushEmptyData(i, prvYear)
        //     }
        //     for(let i = 1; i <= crrntMonth; i++){
        //         const index = monthlyData.findIndex(data => data.month == i && data.year == crrntYear)
        //         if(index < 0) pushEmptyData(i, crrntYear)
        //     }
        //     return monthlyData
        // }
        //-----------------------------------------
        const fillUnavailableDatesData = (arr: IncomeModel[] | ExpenseModel[]) => {
            const monthlyData = genMonthlyData(arr)
            let formattedMonthlyData = []

            const pushEmptyData = (month, year) => formattedMonthlyData.push({ month, year, amount: 0 })

            for (let i = 1; i <= 12; i++) {
                const index = monthlyData.findIndex(data => data.month == i)
                if (index < 0) pushEmptyData(i, crrntYear)
                else formattedMonthlyData.push(monthlyData[index])
            }
            return formattedMonthlyData
        }


        res.json({
            income: fillUnavailableDatesData(incomes),
            expense: fillUnavailableDatesData(expenses)
        })
    }
    catch (e) {
        res.status(e.code || 400).send({ message: e.message })
    }
}

export const smsController = async (req: Request, res: Response) => {
    try {
        const phone: number = req.body.phone;
        const msg: string = req.body.message;

        const smsRes: any = await sendSms(phone, msg, 'unicode')
        if (smsRes.responseCode == 3011) throw new insufficientSmsBalanceException()
    }
    catch (e) {
        res.status(getStatusCode(e.code)).send({ message: e.message })
    }
}

export const getMoneyReportOLD = async (req: Request, res: Response) => {
    try {
        let { year = null, month = null } = req.query

        const incomeRepo = new IncomeRepository()
        const expenseRepo = new ExpenseRepository()

        const yearT = parseInt(year as string) || new Date().getFullYear()
        // const monthT = parseInt(month as string) || new Date().getMonth() + 1
        const startDate = new Date(yearT, 0, 1, 24)
        const endDate = new Date(yearT, 11, 31, 23, 59, 59)

        const [incomeData, expoenseData] = await Promise.all([
            await incomeRepo.getForMoneyTypeReport(startDate, endDate),
            await expenseRepo.getForMoneyTypeReport(startDate, endDate)
        ])

        let monthsData = [], totalIncome = 0, totalExpense = 0

        for (let i = 1; i <= 12; i++) {
            const income = incomeData.find(e => e._id == i) || { amount: 0 }
            const expense = expoenseData.find(e => e._id == i) || { amount: 0 }

            monthsData.push({
                month: i,
                income: income.amount,
                expense: expense.amount,
                capital: income.amount - expense.amount
            })
            totalIncome += income.amount
            totalExpense += expense.amount
        }

        const reportData = {
            year: yearT,
            income: totalIncome,
            expense: totalExpense,
            capital: totalIncome - totalExpense,
            months: monthsData
        }

        res.send(reportData)
    }
    catch (e) {
        res.status(getStatusCode(e.code)).send({ message: e.message })
    }
}

export const getMoneyReport = async (req: Request, res: Response) => {
    try {
        let { year = null, month = null } = req.query

        const incomeRepo = new IncomeRepository()
        const expenseRepo = new ExpenseRepository()

        const yearT = parseInt(year as string) || new Date().getFullYear()

        if (month) {
            // const startDate = new Date(yearT, 0, 1, 24)
            // const endDate = new Date(yearT, 11, 31, 23, 59, 59)
            const startDate = new Date(yearT, parseInt(month as string) - 1, 1)
            const endDate = new Date(yearT, parseInt(month as string), 0)

            console.log({
                startDate, endDate
            })

            const [incomeData, expoenseData] = await Promise.all([
                await incomeRepo.getForMoneyTypeReport(startDate, endDate),
                await expenseRepo.getForMoneyTypeReport(startDate, endDate)
            ])

            let totalIncome = 0, totalExpense = 0

            const formattedIncomes = incomeData.map(income => {
                totalIncome += income.amount
                return {
                    type: income._id,
                    amount: income.amount
                }
            })

            const formattedExpense = expoenseData.map(expense => {
                totalExpense += expense.amount
                return {
                    type: expense._id,
                    amount: expense.amount
                }
            })

            const reportData = {
                year: yearT,
                totalIncome,
                totalExpense,
                balance: totalIncome - totalExpense,
                incomes: formattedIncomes,
                expenses: formattedExpense
            }

            res.send(reportData)
        }
        else {

            const startDate = new Date(yearT, 3, 1)
            const endDate = new Date(yearT + 1, 3, 0)

            console.log({
                startDate, endDate
            })

            const [incomeData, expenseData] = await Promise.all([
                await incomeRepo.getForMoneyReport(startDate, endDate),
                await expenseRepo.getForMoneyReport(startDate, endDate)
            ])

            let monthsData = [], totalIncome = 0, totalExpense = 0

            for (let i = 4; i <= 12; i++) {
                const income = incomeData.find(e => e._id == i) || { amount: 0 }
                const expense = expenseData.find(e => e._id == i) || { amount: 0 }

                monthsData.push({
                    month: i,
                    year: yearT,
                    income: income.amount,
                    expense: expense.amount,
                    capital: income.amount - expense.amount
                })
                totalIncome += income.amount
                totalExpense += expense.amount
            }
            for (let i = 1; i <= 3; i++){
                const income = incomeData.find(e => e._id == i) || { amount: 0 }
                const expense = expenseData.find(e => e._id == i) || { amount: 0 }

                monthsData.push({
                    month: i,
                    year: yearT + 1,
                    income: income.amount,
                    expense: expense.amount,
                    capital: income.amount - expense.amount
                })
                totalIncome += income.amount
                totalExpense += expense.amount
            }

            const reportData = {
                year: `${yearT}-${yearT + 1}`,
                income: totalIncome,
                expense: totalExpense,
                capital: totalIncome - totalExpense,
                months: monthsData
            }

            res.send(reportData)
        }
    }
    catch (e) {
        res.status(getStatusCode(e.code)).send({ message: e.message })
    }
}