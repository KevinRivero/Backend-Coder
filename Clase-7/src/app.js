import express from 'express'


const PORT = 8080
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.get('/', (req, res) => {
   res.send('holii')
})


app.listen(PORT, () => {
    console.log('Servidor corriendo OK en puerto ' + PORT);
})