import {join} from 'path'
import {Options} from 'express-fileupload'
import fs from 'fs'
import {Employee, EmployeeModel} from '../../schema'
import {ImageUploadFailedException, NoRecordWithIDException} from '../../common/exceptions.common'

export class EmployeeRepository{
    async save(data: EmployeeModel, doc: Options){

        const employee = new Employee(data)
        const savedEmployee = await employee.save()

        return new Promise((resolve, reject) => {
            doc.mv(join(__dirname, `../../../../employee-docs/${savedEmployee._id}.png`), (err) => {
                if(err) reject(new ImageUploadFailedException())
                resolve(savedEmployee)
            })
        })
    }

    async delete(id: string){
        const deteledDoc = await Employee.findByIdAndDelete(id)
        if(!deteledDoc) throw new NoRecordWithIDException()

        return new Promise((resolve, reject) => {
            fs.unlink(join(__dirname, `../../../../employee-docs/${id}.png`), (err) => {
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
}