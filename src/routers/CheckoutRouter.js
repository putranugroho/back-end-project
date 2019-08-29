const router = require('express').Router()
const conn = require('../connection')

// GET PAYMENT
router.get('/payment', (req, res) => {
    const sql = `SELECT * FROM payment`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)    

        res.send(result)
    })
})

// GET SHIPPING
router.get('/shipping', (req, res) => {
    const sql = `SELECT * FROM shipping`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)    

        res.send(result)
    })
})

module.exports = router