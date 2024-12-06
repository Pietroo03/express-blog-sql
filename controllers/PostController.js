const posts = require('../data/db.js')
const fs = require('fs')
const connection = require('../data/connection.js')
const { log } = require('console')

const index = (req, res) => {

    const sql = 'SELECT * FROM posts'

    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err })
        const responseData = {
            data: results,
            counter: results.length
        }

        res.status(200).json(responseData)
    })

}

const show = (req, res) => {

    const id = req.params.id

    const sql = 'SELECT * FROM posts WHERE id=?'

    connection.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err })
        if (!results[0]) return res.status(404).json({ error: 'Post non trovato' })

        const post = results[0]

        const responseData = {
            data: post
        }
        console.log(responseData);
        res.status(200).json(responseData)
    })

}

const store = (req, res) => {
    console.log(req.body);

    const post = {
        title: req.body.title,
        slug: req.body.slug,
        content: req.body.content,
        image: req.body.image,
        tags: req.body.tags
    }

    posts.push(post)

    fs.writeFileSync('./data/db.js', `module.exports = ${JSON.stringify(posts, null, 4)}`)

    return res.status(201).json({
        data: posts,
        counter: posts.length
    })
}

const update = (req, res) => {
    const post = posts.find(post => post.slug.toLowerCase() === req.params.slug)

    if (!post) {
        return res.status(404).json({
            error: `No post found with the slug: ${req.params.slug}`
        })
    }

    post.title = req.body.title
    post.slug = req.body.slug
    post.content = req.body.content
    post.image = req.body.image
    post.tags = req.body.tags

    fs.writeFileSync('./data/db.js', `module.exports = ${JSON.stringify(posts, null, 4)}`)

    res.status(200).json({
        status: 200,
        data: posts
    })
}

const destroy = (req, res) => {

    const id = req.params.id

    const sql = 'DELETE FROM posts WHERE id=?'

    connection.query(sql, [id], (err, results) => {
        console.log(err, results);
        if (err) return res.status(500).json({ error: err })
        if (results.affectedRows === 0) return res.status(400).json({ error: `Nessun post trovato con questo id: ${id}` })

        return res.json({ status: 204, affectedRows: results.affectedRows })
    })

}


module.exports = {
    index,
    show,
    store,
    update,
    destroy
}

