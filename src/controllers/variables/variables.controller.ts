import _ from 'lodash'
import { Request, Response } from 'express';
import { VariablesRepository } from '../../repository'
import { PinNotFoundException, RequiredInputNotProvidedException, insufficientSmsBalanceException, InvalidOtpException, InvalidOtpRequest } from '../../common/exceptions.common';
import { VariablesModel } from '../../schema';
import { sendSms } from '../../common/sms.common';
import { getStatusCode } from '../../common/utils.common';

const initVariables = async (req: Request, res: Response) => {
    try{
        const input = _.pick(req.body, ['name', 'pin', 'phone'])
        if(!input.pin) throw new PinNotFoundException()
        if(!input.phone) throw new RequiredInputNotProvidedException()
        const variablesRepo = new VariablesRepository()
        
        const doc = await variablesRepo.saveInitInfo(input)
        res.send(doc)
    }
    catch(e){
        res.status(getStatusCode(e.code)).send({message: e.message})
    }
}

const updateTrustInfo = async (req: Request, res: Response) => {
    try{
        const input = _.pick(req.body, ['name', 'phone'])

        if(!input.name && !input.phone) throw new RequiredInputNotProvidedException()
        const variablesRepo = new VariablesRepository()

        const doc = await variablesRepo.updateInfo(input)
        res.send(doc)
    }
    catch(e){
        res.status(getStatusCode(e.code)).send({message: e.message})
    }
}

const requestOtp = async (req: Request, res: Response) => {
    try{
        const variablesRepo = new VariablesRepository()
        const {phone, otp} = await variablesRepo.issueOtp()

        const smsRes: any = await sendSms(phone, `Your software PIN reset OTP is ${otp}`)
        if(smsRes.responseCode == 3011) throw new insufficientSmsBalanceException()

        res.send()
    }
    catch(e){
        res.status(getStatusCode(e.code)).send({ message: e.message })
    }
}

const validateOtp = async (req: Request, res: Response) => {
    try{
        const inputOtp: number = parseInt(req.params.otp);
        const variablesRepo = new VariablesRepository()
        const otp = await variablesRepo.getOtp()

        if(!otp) throw new InvalidOtpRequest()
        if(inputOtp != otp) throw new InvalidOtpException()
        res.send()
    }
    catch(e){
        res.status(getStatusCode(e.code)).send({ message: e.message })
    }
}

const resetPin = async (req: Request, res: Response) => {
    try{
        const body: VariablesModel = req.body
        if(!body.otp || !body.pin) throw new RequiredInputNotProvidedException()
        const variablesRepo = new VariablesRepository()

        await variablesRepo.resetPin(body.otp, body.pin)
        res.send({ message: 'ok' })
    }
    catch(e){
        res.status(getStatusCode(e.code)).send({message: e.message})
    }
}

const getVars = async (req: Request, res: Response) => {
    try{
        const variablesRepo = new VariablesRepository()
        const vars = await variablesRepo.get()
        res.json(vars)
    }
    catch(e){
        res.status(getStatusCode(e.code)).send({message: e.message})
    }
}

export {
    initVariables,
    updateTrustInfo,
    requestOtp,
    validateOtp,
    resetPin,
    getVars
}