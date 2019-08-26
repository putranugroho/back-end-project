const router = require('express').Router()
const conn = require('../connection')

// CREATE CATEGORY
router.post('/adddetail', (req, res) => {
    const sql = `INSERT INTO products_detail SET ?`
    const data = req.body

    conn.query(sql, data, (err, result) => {
        if(err) return res.send(err)
        
        res.send('Detail Product telah berhasil dibuat')
    })
})

// READ DETAIL
router.get('/detail/:id', (req, res) => {
    const sql = `SELECT * FROM products_detail where id = ?`
    const data = req.params.id

    conn.query(sql, data, (err, result) => {
        if(err) return res.send(err)    

        res.send(result)
    })
})

// UPDATE DETAIL
router.patch('/detail/:id', (req, res) => {
    const sql = `UPDATE products_detail SET ? WHERE id = ?`
    const sql2 = `SELECT * FROM products_detail WHERE id = '${req.params.id}'`
    const data = [req.body, req.params.id]

    // UPDATE (Ubah data user di database)
    conn.query(sql, data, (err, result) => {
        if(err) return res.send(err)

        // SELECT (Ambil user dari database)
        conn.query(sql2, (err, result) => {
            // result SELECT adalah array
            if(err) return res.send(err)

            // Kirim usernya dalam bentuk object
            res.send(result[0])
        })
    })
})

// DELETE USERS BY ID
router.delete('/users/:id', (req, res) => {
    const sql = `DELETE FROM users WHERE id = ?`
    const data = req.params.id

    conn.query(sql, data,  (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})

// READ PRODUCTS BY CATEGORY
router.get('/categoryname', (req, res) => {
    const sql = `SELECT id FROM category WHERE ?`
    const data = req.query
    

    conn.query(sql, data, (err, result) => {
        // Jika ada error dalam menjalankan query, akan dikirim errornya
        if(err) return res.send(err)

        res.send(result[0])
    })
})

module.exports = router