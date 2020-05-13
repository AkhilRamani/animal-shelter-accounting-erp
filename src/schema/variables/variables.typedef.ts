import { Document } from "mongoose";
import {ANIMAL} from '../../common/constants.common'

interface StatsModel{
    capital: number
    animal: {
        5: number
        6: number
        1: number,
        2: number,
        10: number,
        big: number,
        small: number
    }
}

export interface VariablesModel extends Document{
    name: string
    phone: number
    pin: number
    stats: StatsModel
    otp: number
    loggedIn: boolean
}