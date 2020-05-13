import mongoose from 'mongoose'
import _ from 'lodash'
import {VariablesModel} from './variables.typedef'
import { VAR_DOC_ID, ANIMAL } from '../../common/constants.common'

const commonAttr = {
    type: Number,
    default: 0
}

const variablesSchema = new mongoose.Schema({
    _id: {
        type: Number,
        default: VAR_DOC_ID
    },
    name: String,
    phone: Number,
    pin: Number,
    stats: {
        capital: commonAttr,
        animal: {
            [ANIMAL.gay] : commonAttr,
            [ANIMAL.balad]: commonAttr,
            [ANIMAL.vachrdi]: commonAttr,
            [ANIMAL.vachrda]: commonAttr,
            [ANIMAL.other]: commonAttr,
            big: commonAttr,
            small: commonAttr
        }
    },
    otp: Number,
    loggedIn: {
        type: Boolean,
        default: true
    }
})

variablesSchema.methods.toJSON = function(){
    return _.pick(this.toObject(), ['name', 'phone', 'stats', 'loggedIn'])
}

export const Variables: mongoose.Model<VariablesModel> = mongoose.model<VariablesModel>('variables', variablesSchema)