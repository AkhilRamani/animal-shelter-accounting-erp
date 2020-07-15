import {Request, Response} from 'express'
import { VariablesRepository } from '../repository'
import { reverseNum } from './utils.common'

export const auth = async (req: Request, res: Response) => {
    try{
        const inputPin = req.body.pin
        const variableRepo = new VariablesRepository()
        const vars = await variableRepo.get()

        if(inputPin == vars.pin){
            res.status(200).send()
        }
        else if(inputPin == reverseNum(vars.pin)){
            res.status(205).send()
        }
        else{
            res.status(401).send()
        }
    }
    catch(e){
        console.log(e)
        res.status(e.code || 400).send({message: e.message})
    }
}