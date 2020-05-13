import { Variables, VariablesModel, AnimalIncomeModel, AnimalModel, AnimalIncome } from "../../schema"
import { VAR_DOC_ID } from "../../common/constants.common"
import { genOtp } from "../../common/utils.common"
import { WrongOtpException} from "../../common/exceptions.common"

export class VariablesRepository{
    async create(doc: {name: string, pin: number}){
        const variables = new Variables(doc)
        const savedVars = await variables.save()

        return {
            name: savedVars.name,
            stats: savedVars.stats
        }
    }

    async saveInitInfo(data: {name: string, pin: number, phone: number}){
        const doc = await Variables.findByIdAndUpdate(VAR_DOC_ID, { $set: {...data, loggedIn: true} }, {new: true})
        return doc
    }

    async updateInfo(data: {name: string, phone: number}){
        const doc = await Variables.findByIdAndUpdate(VAR_DOC_ID, { $set: data }, { new: true })
        return doc
    }

    updateCapital(amount: number){
        const genQuery = (value: number) => Variables.findByIdAndUpdate(VAR_DOC_ID, { $inc: {"stats.capital": value }}, {new: true})
        return {
            inc: async () => await genQuery(amount),
            dec: async () => await genQuery(-amount)
        }
    }

    async get(){
        const vars = await Variables.findById(VAR_DOC_ID)
        return vars
    }

    updateAnimals(animals: AnimalModel[]){
       
        const genQuery = (animals: AnimalModel[]) => {
            let query = {
                'stats.animal.small': 0,
                'stats.animal.big': 0
            }
            animals.forEach(animal => {
                query[`stats.animal.${animal.type}`] = animal.count
                if(animal.type  < 5){
                    query["stats.animal.small"] += animal.count
                }
                else if (animal.type < 9){
                    query["stats.animal.big"] += animal.count
                }
            })
            return Variables.findByIdAndUpdate(VAR_DOC_ID, { $inc: { ...query }}, {new: true})
        }

        return {
            inc: async () => await genQuery(animals),
            dec: async () => await genQuery(animals.map(ani => ({ type: ani.type, count: -ani.count})))
        }
    }

    async issueOtp(){
        const updatedVars = await Variables.findByIdAndUpdate(VAR_DOC_ID, { $set: { otp: genOtp() } }, {new: true})
        return {otp: updatedVars.otp, phone: updatedVars.phone}
    }

    async getOtp(){
        const {otp} = await Variables.findById(VAR_DOC_ID, {_id: -1, otp: 1})
        return otp
    }

    async resetPin(userOtp: number, pin: number){
        const vars = await this.get()
        if(vars.otp != userOtp) throw new WrongOtpException()

        const updatedVars = await Variables.findByIdAndUpdate(VAR_DOC_ID, {$set: { pin }, $unset: { otp: 1 }}, {new: true})
        return null
    }
}