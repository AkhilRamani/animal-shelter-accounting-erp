import {TrustMember, TrustMemberModel} from '../../schema'
import { NoRecordWithIDException } from '../../common/exceptions.common'

export class TrustMemberRepository{
    async save(data: TrustMemberModel){
        const trustMember = new TrustMember(data)
        const doc = await trustMember.save()
        return doc
    }

    async delete(id: string){
        const deteledDoc = await TrustMember.findByIdAndDelete(id)
        if(!deteledDoc) throw new NoRecordWithIDException()
        return deteledDoc
    }

    async update(id: string, data: TrustMemberModel){
        const updatedDoc = await TrustMember.findByIdAndUpdate(id, {
            $set: data
        }, {new: true})
        if(!updatedDoc) throw new NoRecordWithIDException()
        return updatedDoc
    }
}