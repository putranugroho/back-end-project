const conn = require('../connection/')
const router = require('express').Router()

// CREATE ONE USER
router.post('/admin/input', (req, res) => {
    const sql = `INSERT INTO admin SET ?`
    const data = req.body

    // Insert data
    conn.query(sql, data, (err, result1) => {
        if(err){
            return res.send(err)
        }

        res.send(result1[0])

    })
})

//  LOGIN
router.post('/admin/login', (req,res)=>{
    const sql = `select * from admin where username = ? `
    const data = req.body.username

    conn.query(sql, data,(err, result) => {
        if (err) return res.send(err)

        const user = result[0]

        if (!user) return res.send('Username not found')

        if (req.body.password !== result[0].password) {
            return res.send(`Password incorrect`)
        }

        res.send(user)
    })
})

// READ PROFILE
router.get('/admin', (req, res) => {
    const sql = `SELECT * FROM admin`
    const data = req.params.id

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)    

        res.send(result)
    })
})

router.get('/admin/:id', (req, res) => {
    const sql = `SELECT * FROM admin where id = ?`
    const data = req.params.id

    conn.query(sql, data, (err, result) => {
        if(err) return res.send(err)    

        res.send(result)
    })
})

// DELETE ADMIN BY ID
router.delete('/admin/:id', (req, res) => {
    const sql = `DELETE FROM admin WHERE id = ?`
    const data = req.params.id

    conn.query(sql, data,  (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})

module.exports = router