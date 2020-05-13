import {Document} from 'mongoose'

export interface EmployeeModel extends Document{
    type: string
    name: string
    phone: number
    address: string
}