import {Options} from 'express-fileupload'
import fs from 'fs'
import {Response} from 'express'
import {Employee, EmployeeModel} from '../../schema'
import {ImageUploadFailedException, NoRecordWithIDException} from '../../common/exceptions.common'

const docsFolder = `${__dirname}/employee-docs`

export class EmployeeRepository{
    async save(data: EmployeeModel, doc: Options){

        const employee = new Employee(data)
        const savedEmployee = await employee.save()

        return new Promise((resolve, reject) => {
            if(!fs.existsSync(docsFolder)){
                fs.mkdirSync(docsFolder)
            }
            doc.mv(`${docsFolder}/${savedEmployee._id}.png`, (err) => {
                if(err) reject(new ImageUploadFailedException())
                resolve(savedEmployee)
            })
        })
    }

    async delete(id: string){
        const deteledDoc = await Employee.findByIdAndDelete(id)
        if(!deteledDoc) throw new NoRecordWithIDException()

        return new Promise((resolve, reject) => {
            fs.unlink(`${docsFolder}/${id}.png`, (err) => {
                if(err) reject(err)
                resolve(deteledDoc)
            })
        })
         
    }

    async update(id: string, data: EmployeeModel){
        const updatedDoc = await Employee.findByIdAndUpdate(id, { $set: data }, {new: true})
        if(!updatedDoc) throw new NoRecordWithIDException()
        return updatedDoc
    }

    startDownEmpDoc = (employeeId: string, res: Response) => {
        res.download(`${docsFolder}/${employeeId}.png`, (err) => {
            if(err) res.status(404).send({message: "docs not found"})
        })
    }
}