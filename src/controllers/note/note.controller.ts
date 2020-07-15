import {Request, Response} from 'express'
import { NoteRepository } from '../../repository'

export const addNote = async (req: Request, res: Response) => {
    try{
        const noteRepo = new NoteRepository()
        const savedNote = await noteRepo.save(req.body)
        res.json(savedNote)
    }
    catch(e){
        console.log(e)
        res.status(400).send({message: e.message})
    }
}

export const updateNote = async (req: Request, res: Response) => {
    try{
        const id = req.params.id
        const noteRepo = new NoteRepository()
        const updatedNote = await noteRepo.update(id, req.body)
        res.json(updatedNote)
    }
    catch(e){
        console.log(e)
        res.status(400).send({message: e.message})
    }
}

export const deleteNote = async (req: Request, res: Response) => {
    try{
        const id = req.params.id
        const noteRepo = new NoteRepository()
        const deletedDoc = await noteRepo.delete(id)
        res.json(deletedDoc)
    }
    catch(e){
        console.log(e)
        res.status(400).send({message: e.message})
    }
}