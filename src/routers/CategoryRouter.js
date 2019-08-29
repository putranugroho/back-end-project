const router = require('express').Router()
const conn = require('../connection')

// CREATE CATEGORY
router.post('/addcategory', (req, res) => {
    const sql = `SELECT category_name FROM category WHERE category_name = '${req.body.category_name}'`
    const sql2 = `INSERT INTO category SET ?`
    const data = req.body

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)
        
        if(result[0]) return res.send('Category sudah tersedia')

        conn.query(sql2, data, (err, result2) => {
            if(err) return res.send(err)
            
            res.send("Category telah berhasil dibuat")
        })
    })
})

// READ ALL CATEGORY
router.get('/category', (req, res) => {
    const sql = `SELECT * FROM category`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)    

        res.send(result)
    })
})

router.get('/category/:id', (req, res) => {
    const sql = `SELECT * FROM category where id = ?`
    const data = req.params.id

    conn.query(sql, data, (err, result) => {
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

// UPDATE CATEGORY BY ID
router.patch('/category/:id', (req, res) => {
    const sql = `UPDATE category SET ?
                WHERE id = ${req.params.id}`
    const data = req.body
    
    conn.query(sql, data,  (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})

// DELETE CATEGORY BY ID
router.delete('/category/:id', (req, res) => {
    const sql = `DELETE FROM category WHERE id = ?`
    const data = req.params.id

    conn.query(sql, data,  (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})

module.exports = router