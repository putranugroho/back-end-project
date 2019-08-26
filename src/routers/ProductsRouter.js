const router = require('express').Router()
const conn = require('../connection')
const path = require('path')
const fs = require('fs')
const multer = require('multer')

const rootdir = path.join(__dirname,'/../..')
const photosproduct = path.join(rootdir, '/image/products')


const folder = multer.diskStorage(
    {
        destination: function (req, file, cb){
            cb(null, photosproduct)
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

// UPLOAD IMAGE
router.post('/products/image', upstore.single('image'), (req, res) => {
    const sql = `SELECT * FROM products WHERE id = ?`
    const sql2 = `UPDATE products SET image = '${req.file.filename}'
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
router.get('/products/avatar/:imageName', (req, res) => {
    // Letak folder photo
    const options = {
        root: photosproduct
    }

    // Filename / nama photo
    const fileName = req.params.imageName

    res.sendFile(fileName, options, function(err){
        if(err) return res.send(err)

    })

})

// DELETE IMAGE
router.delete('/products/avatar', (req, res)=> {
    const sql = `SELECT * FROM products WHERE product_name = '${req.body.uname}'`
    const sql2 = `UPDATE products SET image = null WHERE product_name = '${req.body.uname}'`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)

        // nama file
        const fileName = result[0].avatar

        // alamat file
        const imgpath = photosproduct + '/' + fileName

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

        res.send(result[0])
    })
})

// READ PRODUCTS BY NAME
router.get('/productname', (req, res) => {
    const sql = `SELECT * FROM products WHERE ?`
    const data = req.query
    

    conn.query(sql, data, (err, result) => {
        // Jika ada error dalam menjalankan query, akan dikirim errornya
        if(err) return res.send(err)

        res.send(result[0])
    })
})

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