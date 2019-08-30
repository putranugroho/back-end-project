const router = require('express').Router()
const conn = require('../connection')
const path = require('path')
const fs = require('fs')
const multer = require('multer')

const rootdir = path.join(__dirname,'/../..')
const photosorder = path.join(rootdir, '/image/orderReceipt')

const folder = multer.diskStorage(
    {
        destination: function (req, file, cb){
            cb(null, photosorder)
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

// UPLOAD AVATAR
router.post('/checkout/receipt', upstore.single('image'), (req, res) => {
    const sql = `SELECT * FROM checkout WHERE id = ?`
    const sql2 = `UPDATE checkout SET order_receipt = '${req.file.filename}'
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
router.get('/checkout/receipt/:imageName', (req, res) => {
    // Letak folder photo
    const options = {
        root: photosorder
    }

    // Filename / nama photo
    const fileName = req.params.imageName

    res.sendFile(fileName, options, function(err){
        if(err) return res.send(err)

    })

})

// DELETE IMAGE
router.delete('/checkout/receipt', (req, res)=> {
    const sql = `SELECT * FROM checkout WHERE id = '${req.body.id}'`
    const sql2 = `UPDATE checkout SET order_receipt = null WHERE id = '${req.body.id}'`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)

        // nama file
        const fileName = result[0].avatar

        // alamat file
        const imgpath = photosorder + '/' + fileName

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

router.post('/addcheckout', (req, res) => {
    const sql = `insert into checkout set ?`
    const sql2 = `select * from checkout where id = ?`

    conn.query(sql, req.body, (err, result) => {
        if(err) return res.send("error tuch")

        conn.query(sql2, result.insertId, (err, result2) => {
            if(err) return res.send("tuch error")
            res.send(result2)
        })
    })
})

//post to order detail
router.post('/orderdetail', (req, res) => {
    const {arrayCart} = req.body

    console.log(arrayCart);
    
    const valueArray = arrayCart.map( cart => {
        return `( ${cart[2]}, ${cart[0]}, ${cart[1]} )`
    })

    console.log(valueArray);
    
    const sql = `INSERT INTO order_detail (checkout_id, products_id, qty_order) VALUES ${valueArray.join(',')} ` 

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)
        
        res.send(result)
    })
})

router.get('/orderdetail/:id', (req, res) => {
    const sql = `select * from order_detail o 
	join products p on p.id = o.product_id where order_id = '${req.params.id}';`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})

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