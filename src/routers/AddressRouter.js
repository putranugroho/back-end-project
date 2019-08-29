const router = require('express').Router()
const conn = require('../connection')

// CREATE ADDRESS
router.post('/addaddress', (req, res) => {
    const sql = `INSERT INTO address SET ?`
    const data = req.body

    conn.query(sql, data, (err, result) => {
        if(err) return res.send(err)
            
        res.send("Address telah berhasil dibuat")
        
    })
})

// READ ALL ADDRESS
router.get('/address', (req, res) => {
    const sql = `SELECT * FROM address`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)    

        res.send(result)
    })
})

router.get('/address/:id', (req, res) => {
    const sql = `SELECT * FROM address where id = ?`
    const data = req.params.id

    conn.query(sql, data, (err, result) => {
        if(err) return res.send(err)    

        res.send(result)
    })
})

// READ ADDRESS BY USER
router.get('/addressuser', (req, res) => {
    const sql = `SELECT * FROM address WHERE ?`
    const data = req.query

    conn.query(sql, data, (err, result) => {
        // Jika ada error dalam menjalankan query, akan dikirim errornya
        if(err) return res.send(err)

        res.send(result)
    })
})

// UPDATE ADDRESS BY ID
router.patch('/address/:id', (req, res) => {
    const sql = `UPDATE address SET ?
                WHERE id = ${req.params.id}`
    const data = req.body
    
    conn.query(sql, data,  (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})

// DELETE ADDRESS BY ID
router.delete('/address/:id', (req, res) => {
    const sql = `DELETE FROM address WHERE id = ?`
    const data = req.params.id

    conn.query(sql, data,  (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})

// SELECTED ADDRESS
router.get('/select', (req, res) => {
    const sql = `SELECT * FROM address WHERE ?`
    const data = req.query

    conn.query(sql, data, (err, result) => {
        // Jika ada error dalam menjalankan query, akan dikirim errornya
        if(err) return res.send(err)

        res.send(result)
    })
})

// CHANGE ADDRESS
router.get('/addressselected/:selectid/:changeid', (req, res) => {
    const sql1 = `UPDATE address SET selected = 0 WHERE id = '${req.params.changeid}'`
    const sql2 = `UPDATE address SET selected = 1 WHERE id = '${req.params.selectid}'`
    
    conn.query(sql1, (err, result1) => {
        // Terdapat error ketika insert
        if(err){
            return res.send(err.message)
        }   
        conn.query(sql2, (err, result3) => {
            if(err){
                return res.send(err.message)
            }
            res.send(result3)
        })
    })
})

module.exports = router