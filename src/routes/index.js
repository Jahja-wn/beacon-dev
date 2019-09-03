
import {Router} from 'express'
import liff from './liff'
import beacon from './beacon'

const router = Router()

router.use('/liff', liff)
router.use('/beacon',beacon)

router.get('/history', (req,res) => res.render('history'))

module.exports = router