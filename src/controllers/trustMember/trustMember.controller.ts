import { Request, Response } from 'express'
import {TrustMemberRepository} from '../../repository'

export const addTrustMember = async (req: Request, res: Response) => {
    try{
        const TrustMemberRepo = new TrustMemberRepository()
        const savedDoc = await TrustMemberRepo.save(req.body)
        res.json(savedDoc)
    }
    catch(e){
        console.log(e)
        res.status(400).send({message: e.message})
    }
}

export const updateTrustMember = async (req: Request, res: Response) => {
    try{
        const id = req.params.id
        const TrustMemberRepo = new TrustMemberRepository()
        const updatedDoc = await TrustMemberRepo.update(id, req.body)
        res.json(updatedDoc)
    }
    catch(e){
        console.log(e)
        res.status(400).send({message: e.message})
    }
}

export const deleteTrustMember = async (req: Request, res: Response) => {
    try{
        const id = req.params.id
        const TrustMemberRepo = new TrustMemberRepository()
        const deletedDoc = await TrustMemberRepo.delete(id)
        res.json({_id: deletedDoc._id})
    }
    catch(e){
        console.log(e)
        res.status(400).send({message: e.message})
    }
}