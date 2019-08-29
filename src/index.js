const express = require('express')
const cors = require ('cors')
const UserRouter = require('./routers/UserRouter')
const AdminRouter = require('./routers/AdminRouter')
const ProductsRouter = require('./routers/ProductsRouter')
const CartRouter = require('./routers/CartRouter')
const CategoryRouter = require('./routers/CategoryRouter')
const CheckoutRouter = require('./routers/CheckoutRouter')
const DetailProduct = require('./routers/DetailProduct')
const AddressRouter = require('./routers/AddressRouter')

const app = express()
const port = 2019

app.use(express.json())
app.use(cors())
app.use(UserRouter)
app.use(AdminRouter)
app.use(ProductsRouter)
app.use(AddressRouter)
app.use(CheckoutRouter)
app.use(CartRouter)
app.use(CategoryRouter)
app.use(DetailProduct)

app.get('/', (req,res) =>{
    res.send('<h1>Selamat datang di API Final-Project saya</h1>')
})

app.listen(port, () => {
    console.log('Berhasil Running di ' + port);
})