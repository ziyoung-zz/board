const express = require('express')
const app = express()
const port = 5000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://Ziyoung:abcd1234@cluster-tzg33.mongodb.net/Clusters?retryWrites=true&w=majoritynp',{
    useNewUrlParser: true, useUnifiedTopology:true, useCreateIndex: true, useFindAndModify:false
}).then(() => console.log('MongoDB Connectes~~'))
    .catch(err => console.log(err))


app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

