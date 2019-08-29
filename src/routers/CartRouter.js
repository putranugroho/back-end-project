const router = require('express').Router()
const conn = require('../connection')

// CREATE CART
router.post('/addcart', (req, res) => {
    const sql = `INSERT INTO cart (products_id, users_id, qty)
                VALUES ( '${req.body.products_id}', '${req.body.users_id}', '${req.body.qty}' )`

    conn.query(sql, (err,result) => {
        if (err) return res.send(err)

        res.send(result)
    })
})

// READ CART
router.get('/cart', (req, res) => {
    const sql = `select * from cart;`

    conn.query(sql,(err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})

router.get('/cart/:userid', (req, res) => {
    const sql = `SELECT * FROM cart
                WHERE users_id = ?`
    const data = req.params.userid

    conn.query(sql, data, (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})

router.get('/cart/:userid/:productid', (req, res) => {
    const sql = `SELECT * FROM cart
                WHERE users_id = "${req.params.userid}" AND products_id = "${req.params.productid}"`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})

// UPDATE CART BY CART ID
router.patch('/cart/:id', (req, res) => {
    const sql = `UPDATE cart SET ?
                WHERE id = '${req.params.id}'`
    const data = req.body

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