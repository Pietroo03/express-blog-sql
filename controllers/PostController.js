const posts = require('../data/db.js')
const fs = require('fs')

const index = (req, res) => {
    res.json({
        data: posts,
        counter: posts.length
    })
}

const show = (req, res) => {
    const post = posts.find(post => post.slug.toLowerCase() === (req.params.slug))

    if (!post) {
        return res.status(404).json({
            error: '404! Not Found'
        })
    }

    return res.json({
        data: post
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
    const post = posts.find(post => post.slug.toLowerCase() === req.params.slug.toLowerCase())

    if (!post) {
        return res.status(404).json({
            error: `Nessun post trovato con il nome ${req.params.slug}`
        })
    }

    const newPosts = posts.filter((post) => post.slug.toLowerCase() !== req.params.slug.toLowerCase())

    fs.writeFileSync('./data/db.js', `module.exports = ${JSON.stringify(newPosts, null, 4)}`)

    res.status(200).json({
        status: 200,
        data: newPosts,
        counter: newPosts.length
    })
}


module.exports = {
    index,
    show,
    store,
    update,
    destroy
}

