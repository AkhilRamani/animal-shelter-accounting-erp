import {Variables} from '../schema'

export const initSetup = async () => {
    try{
        if(await Variables.countDocuments().exec() > 0) return
        const initialVars = new Variables()
        await initialVars.save()
    }
    catch(e){
        console.log('initial setup failed')
    }
}