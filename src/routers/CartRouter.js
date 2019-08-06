const router = require('express').Router()
const conn = require('../connection')

// CREATE CART
router.post('/cart', (req, res) => {
    const sql = `INSERT INTO cart SET ?`
    const sql2 = `SELECT * FROM cart WHERE id = ?`
    const data = req.body

    // INSERT
    conn.query(sql, data, (err, result) => {
        if(err) return res.send(err)

        // SELECT
        conn.query(sql2, result.insertId, (err, result2) => {
            if(err) return res.send(err)

            // SELECT memberikan result dalam bentuk array
            res.send(result2[0])
        })
    })
})

// READ CART BY USER ID
router.get('/cart/:userid', (req, res) => {
    const sql = `SELECT description, completed FROM cart
                WHERE user_id = ?`
    const data = req.params.userid

    conn.query(sql, data, (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})

// UPDATE CART BY CART ID
router.patch('/cart/:cartid', (req, res) => {
    const sql = `UPDATE cart SET completed = true
                WHERE id = ?`
    const data = req.params.cartid

    conn.query(sql, data,  (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})

// DELETE CART BY USER ID
router.delete('/cart/:cartid', (req, res) => {
    const sql = `DELETE FROM cart WHERE id = ?`
    const data = req.params.cartid

    conn.query(sql, data,  (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})

module.exports = router