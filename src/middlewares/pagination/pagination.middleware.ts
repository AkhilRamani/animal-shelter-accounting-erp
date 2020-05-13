import {Request, Response} from 'express'

const paginationMiddleware = (Model: any) => async (req: Request, res: Response) => {
    try{
        const {page = 0, limit = 10} = req.query
        const rows = await Model.paginate({}, {
            page,
            limit,
            sort: {
                _id: -1
            }
        })
        // req['rows'] = rows
        res.json(rows)
    }
    catch(e){
        console.log(e)
        res.status(500).send({message: e.message})
    }
}

export {paginationMiddleware}