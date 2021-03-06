const conn = require('../connection/')
const router = require('express').Router()
const isEmail = require('validator/lib/isEmail')
const bcrypt = require('bcrypt')
const path = require('path')
const fs = require('fs')
const multer = require('multer')
// const mailVerify = require('../email')

const port = require('../config')

// __dirname: alamat folder file userRouter.js
const rootdir = path.join(__dirname,'/../..')
const photosuser = path.join(rootdir, '/image/users')


const folder = multer.diskStorage(
    {
        destination: function (req, file, cb){
            cb(null, photosuser)
        },
        filename: function (req, file, cb){
            // Waktu upload, nama field, extension file
            cb(null, Date.now() + file.fieldname + path.extname(file.originalname))
        }
    }
)

const upstore = multer(
    {
        storage: folder,
        limits: {
            fileSize: 1000000 // Byte , default 1MB
        },
        fileFilter(req, file, cb) {
            if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){ // will be error if the extension name is not one of these
                return cb(new Error('Please upload image file (jpg, jpeg, or png)')) 
            }
    
            cb(undefined, true)
        }
    }
)

//  LOGIN
router.post('/users/login', (req,res)=>{
    const sql = `select * from users where username = ? `
    const data = req.body.username

    conn.query(sql, data, async (err, result) => {
        if (err) return res.send(err)

        const user = result[0]

        if (!user) return res.send('Username not found')

        const match = await bcrypt.compare(req.body.password, result[0].password)
        if (!match) {
            return res.send(`Password incorrect`)
        }

        res.send(user)
    })
})


// CREATE ONE USER
router.post('/users/input', (req, res) => {

    // tanda tanya akan di ganti oleh variabel data
    const sql = `INSERT INTO users SET ?`
    const sql2 = `SELECT id, f_name, l_name, email, username, password, verified FROM users WHERE id = ?`
    const data = req.body

    // Cek apakah email valid
    if(!isEmail(data.email)){
        return res.send('Email is not valid')
    }

    // // Mengubah password dalam bentuk hash
    data.password = bcrypt.hashSync(data.password, 8)

    // Insert data
    conn.query(sql, data, (err, result1) => {
        // Terdapat error ketika insert
        if(err){
            return res.send(err)
        }

        // Read data by user id untuk di kirim sebagai respon
        conn.query(sql2, result1.insertId, (err, result2) => {
            if(err){
                return res.send(err)
            }

            // var user = result2[0]
            
            // mailVerify(user)

            res.send(result2)
        })
    })
})

// UPLOAD AVATAR
router.post('/users/avatar', upstore.single('avatar'), (req, res) => {
    const sql = `SELECT * FROM users WHERE id = ?`
    const sql2 = `UPDATE users SET avatar = '${req.file.filename}'
                    WHERE id = '${req.body.id}'`
    const data = req.body.id

    conn.query(sql, data, (err, result) => {
        if(err) return res.send(err)

        const user = result[0]

        if(!user) return res.send('User not found')

        conn.query(sql2, (err, result2) => {
            if(err) return res.send(err)

            res.send({
                message: 'Upload berhasil',
                filename: req.file.filename
            })
        })
    })
})

// ACCESS IMAGE
router.get('/users/avatar/:imageName', (req, res) => {
    // Letak folder photo
    const options = {
        root: photosuser
    }

    // Filename / nama photo
    const fileName = req.params.imageName

    res.sendFile(fileName, options, function(err){
        if(err) return res.send(err)

    })

})

// DELETE IMAGE
router.delete('/users/avatar', (req, res)=> {
    const sql = `SELECT * FROM users WHERE username = '${req.body.uname}'`
    const sql2 = `UPDATE users SET avatar = null WHERE username = '${req.body.uname}'`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)

        // nama file
        const fileName = result[0].avatar

        // alamat file
        const imgpath = photosuser + '/' + fileName

        // delete image
        fs.unlink(imgpath, (err) => {
            if(err) return res.send(err)

            // ubah jadi null
            conn.query(sql2, (err, result2) => {
                if(err) res.send(err)

                res.send('Delete berhasil')
            })
        })
    })
})

// READ PROFILE
router.get('/users', (req, res) => {
    const sql = `SELECT * FROM users`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)    

        res.send(result)
    })
})

router.get('/profile/:id', (req, res) => {
    const sql = `SELECT * FROM users where id = ?`
    const data = req.params.id

    conn.query(sql, data, (err, result) => {
        if(err) return res.send(err)    

        res.send(result)
    })
})

router.get('/username/:username', (req, res) => {
    const sql = `SELECT * FROM users where username = ?`
    const data = req.params.username    

    conn.query(sql, data, (err, result) => {
        if(err) return res.send(err)    

        res.send(result)
    })
})

// UPDATE PROFILE
router.patch('/users/profile/:id', (req, res) => {
    const sql = `UPDATE users SET ? WHERE id = ?`
    const sql2 = `SELECT username, name ,email 
                    FROM users WHERE id = '${req.params.id}'`
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

// VERIFY USER
router.get('/verify', (req, res) => {
    const sql = `UPDATE users SET verified = 1 
                WHERE username = '${req.query.username}'`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)

        res.send('<h1>Verifikasi berhasil</h1>')
    })
})

module.exports = router