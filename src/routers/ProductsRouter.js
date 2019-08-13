const router = require('express').Router()
const conn = require('../connection')

// CREATE PRODUCT
router.post('/addproducts', (req, res) => {
    const sql = `SELECT product_name FROM products WHERE product_name = '${req.body.product_name}'`
    const sql2 = `INSERT INTO products SET ?`
    const data = req.body

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)
        
        if(result[0]) return res.send('Product sudah tersedia')

        conn.query(sql2, data, (err, result2) => {
            if(err) return res.send(err)
            
            res.send("orderan telah masuk")
        })
    })
})

// READ ALL PRODUCTS
router.get('/products', (req, res) => {
    const sql = `SELECT * FROM products`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)    

        res.send(result)
    })
})

router.get('/products/:id', (req, res) => {
    const sql = `SELECT * FROM products where id = ?`
    const data = req.params.id

    conn.query(sql, data, (err, result) => {
        if(err) return res.send(err)    

        res.send(result)
    })
})

// router.get('/products/:stock', (req, res) => {
//     const sql = `SELECT * FROM products where stock = ?`
//     const data = req.params.stock

//     conn.query(sql, data, (err, result) => {
//         if(err) return res.send(err)    

//         res.send(result)
//     })
// })

// READ PRODUCTS BY CATEGORY
// router.get('/category', (req, res) => {
//     const sql = `SELECT * FROM products WHERE ?`
//     const data = req.query
//     console.log(data);
    

//     conn.query(sql, data, (err, result) => {
//         // Jika ada error dalam menjalankan query, akan dikirim errornya
//         if(err) return res.send(err)

//         res.send(result)
//     })
// })

// UPDATE PRODUCT BY ID
router.patch('/products/:id', (req, res) => {
    const sql = `UPDATE products SET ?
                WHERE id = ${req.params.id}`
    const data = req.body
    
    conn.query(sql, data,  (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})

// DELETE PRODUCT BY ID
router.delete('/products/:id', (req, res) => {
    const sql = `DELETE FROM products WHERE id = ?`
    const data = req.params.id

    conn.query(sql, data,  (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})

module.exports = router