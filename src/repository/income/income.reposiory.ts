import { Income, IncomeModel } from '../../schema'

export class IncomeRepository {
    async save(data: IncomeModel) {
        const income = new Income(data)
        const res = await income.save()
        return res
    }

    async getAmount(incomeId: string) {
        const doc = await Income.findById(incomeId, { _id: 0, money: 1 })
        return doc.money.amount
    }

    async update(id: string, data: IncomeModel) {
        const oldAmount = await this.getAmount(id)
        const doc = await Income.findByIdAndUpdate(id, {
            $set: data

        }, { new: true })
        return { updatedIncome: doc, oldAmount }
    }
    async delete(id: string) {
        const doc = await Income.findByIdAndDelete(id)
        return doc
    }

    async getForAnalytics(dateFrom: Date, dateTo: Date) {
        const records = await Income.find({
            date: {
                $gte: dateFrom, $lt: dateTo
            }
        }, { _id: 0, date: 1, money: 2, type: 3 })
        return records
    }

    async getForMoneyReport(dateFrom: Date, dateTo: Date) {
        const records = await Income.aggregate([
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
        const records = await Income.aggregate([
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

    async getAll() {
        const allIncome = await Income.find()
        return allIncome
    }
}