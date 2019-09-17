import mongoose from 'mongoose'
import { finalConfig } from '../config'
import { logger } from './logger'

if (finalConfig.database.dialect === 'mongo') {
    mongoose.connect(process.env.MONGODB_URL + finalConfig.database.url, { useNewUrlParser: true, useFindAndModify: false })
        .then(() => {
            logger.info('connected to db')
        })
        .catch((err) => logger.error(err))

    module.exports = mongoose.connection
}
else if (finalConfig.database.dialect === 'mock') {
    mongoose.connect(process.env.MONGODB_URL + finalConfig.database.url, { useNewUrlParser: true, useFindAndModify: false })
        .then(() => {
            logger.info('connected to db( test )')
        })
        .catch((err) => logger.error(err))
    module.exports = mongoose.connection
}

// if (config.get('database').get('dialect') === 'mongo') {
//     mongoose.connect(process.env.MONGODB_URL + config.get('database').get('url'), { useNewUrlParser: true, useFindAndModify: false })
//         .then(() => {
//             logger.info('connected to db')
//         })
//         .catch((err) => logger.error(err))

//     module.exports = mongoose.connection
// }
// else if (config.get('database').get('dialect') === 'mock') {
//     mongoose.connect(process.env.MONGODB_URL + config.get('database').get('url'), { useNewUrlParser: true, useFindAndModify: false })
//         .then(() => {
//             logger.info('connected to db( test )')
//         })
//         .catch((err) => logger.error(err))
//     module.exports = mongoose.connection
// }