const express = require('express')
const cors = require ('cors')
const UserRouter = require('./routers/UserRouter')
const ProductsRouter = require('./routers/ProductsRouter')
const CartRouter = require('./routers/CartRouter')
const configPort = require('./config')

const app = express()
const port = configPort

app.use(express.json())
app.use(cors())
app.use(UserRouter)
app.use(ProductsRouter)
app.use(CartRouter)

app.get('/', (req,res) =>{
    res.send('<h1>Selamat datang di API Final-Project saya</h1>')
})

app.listen(port, () => {
    console.log('Berhasil Running di ' + port);
})