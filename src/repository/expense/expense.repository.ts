import { Expense, ExpenseModel } from '../../schema'
import { NoRecordWithIDException } from '../../common/exceptions.common'

export class ExpenseRepository {
    async save(data: ExpenseModel) {
        const expense = new Expense(data)
        return await expense.save()
    }

    async getAmount(expenseId: string) {
        const doc = await Expense.findById(expenseId, { _id: 0, money: 1 })
        if (!doc) throw new NoRecordWithIDException()
        return doc.money.amount
    }

    async update(id: string, data: ExpenseModel) {
        const oldAmount = await this.getAmount(id)
        const doc = await Expense.findByIdAndUpdate(id, { $set: data }, { new: true })
        return { updatedExpense: doc, oldAmount }
    }

    async delete(id: string) {
        const doc = await Expense.findByIdAndDelete(id)
        return doc
    }

    async getForAnalytics(dateFrom: Date, dateTo: Date) {
        const records = await Expense.find({
            date: {
                $gte: dateFrom, $lt: dateTo
            }
        }, { _id: 0, date: 1, money: 2, type: 3 })
        return records
    }

    async getForMoneyReport(dateFrom: Date, dateTo: Date) {
        const records = await Expense.aggregate([
            {
                $match: { date: { $gte: dateFrom, $lt: dateTo }},
            },
            {
                $project: {
                    month: { $month: "$date" },
                    amount: "$money.amount"
                }
            },
            {
                $group: {
                    _id: "$month",
                    amount: { $sum: "$amount" },
                }
            }
        ])
        return records
    }

    async getForMoneyTypeReport(dateFrom: Date, dateTo: Date) {
        const records = await Expense.aggregate([
            {
                $match: { date: { $gte: dateFrom, $lt: dateTo } },
            },
            {
                $project: {
                    amount: "$money.amount",
                    type: "$type"
                }
            },
            {
                $group: {
                    _id: "$type",
                    amount: { $sum: "$amount" },
                }
            }
        ])

        return records
    }
}