import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import {config} from 'dotenv'
import expressFileUpload from 'express-fileupload'

import {Routes} from './routes'
import { initSetup } from './common/initSetup.common'

const app = express()
const routesPrv: Routes = new Routes()

config()
app.use(bodyParser.json())
app.use(cors())
app.use(expressFileUpload())
routesPrv.routes(app)

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/gaushala', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
    .then(async () => {
        await initSetup()
        console.log('Connected to DB')
    })
    .catch(e => console.log('failed to connect DB', e))

export { app }