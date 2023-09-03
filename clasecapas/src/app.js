import express from 'express'
import toyRouter from "./router/toy.router.js"

const app= express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/api/toy', toyRouter)

app.listen(8080, console.log('funcionando'))