import mongoose from 'mongoose'
import { finalConfig } from '../config'
import { logger } from './logger'

if (finalConfig.database.dialect === 'mongo') {
    try {
        mongoose.connect(process.env.MONGODB_URL + finalConfig.database.url, { useNewUrlParser: true, useFindAndModify: false })
        logger.info('connected to db')
    }
    catch (err) { logger.error(err) }

    module.exports = mongoose.connection
}
else if (finalConfig.database.dialect === 'mock') {
    try {
        mongoose.connect(process.env.MONGODB_URL + finalConfig.database.url, { useNewUrlParser: true, useFindAndModify: false })
        logger.info('connected to db( test )', finalConfig.database.url)
    }
    catch (err) { logger.error(err) }
    module.exports = mongoose.connection
}
