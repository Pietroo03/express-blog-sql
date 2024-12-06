const express = require('express')
const cors = require('cors')
const PostsRouter = require('./routers/posts.js')
const loggerMiddleware = require('./middlewares/loggerMiddleware.js')
const app = express()
const host = 'http://127.0.0.1'
const port = 3000

const corsOptions = {
    credentials: true,
    origin: ['http://localhost:3000', 'http://localhost:5173']
};

app.use(cors(corsOptions));

app.use(express.json())
app.use(express.static('public'))

app.listen(port, () => {
    console.log(`Example app listening on ${host}:${port}`)
})

app.use('/posts', loggerMiddleware)

app.use('/posts', PostsRouter)

app.use((err, req, res, next) => {
    console.log('Error: ', err.message)

    console.error(err.stack)
    res.status(500).send({
        message: 'Something went wrong',
        error: err.message
    })
})


