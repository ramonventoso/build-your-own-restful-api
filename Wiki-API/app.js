const express = require('express')
const mongoose = require('mongoose')
const ejs = require('ejs')
const bodyParser = require('body-parser')

const app = express()

app.set('view engine', 'ejs')  // see this

app.use(bodyParser.urlencoded({ 
    extended: true
}))

app.use(express.static("public"))

// TODO 
const url = 'mongodb://localhost:27017/wikiDB'
mongoose.connect(url, {
    useNewUrlParser: true , 
    useUnifiedTopology: true  // To use the new Server Discover and Monitoring engine
})

// const articleSchema = new mongoose.Schema({
//     title: string, 
//     content: string
// })

const articleSchema = {
    title: String, 
    content: String
}

const Article = new mongoose.model('Article', articleSchema)  // mongo will automatically convert Article into articles and refer to the articles collection 

app.route('/articles')
.get(function(request, response) {    
    Article.find(function(err, results) {
        if (!err) {
            response.send(results)
        }
        else {
            response.send(err)
        }                
    })    
})
.post(function(request, response) {    
    const article = new Article({
        title: request.body.title, 
        content: request.body.content
    })
    article.save(function(err) {
        if (!err) {
            response.send('Successfully added a new article')
        }
        else {
            response.send(err)
        }
    })    
})
.delete(function(request, response) {
    Article.deleteMany(function(err) {
        if (!err) {
            response.send('Successfully deleted all articles')
        }
        else {
            response.send(err)
        }
    })
})

app.route('/articles/:articleTitle')
.get(function(request, response) {
    Article.findOne( {title: request.params.articleTitle} ,function(err, article) {
        if (!err) {
            if (article) {
                response.send(article)
            }
            else {
                response.send('No article matching that title was found')
            }
        }
        else {
            response.send(err)
        }
    })    
})
.put(function(request, response) {
    Article.updateOne( 
        {title: request.params.articleTitle}, 
        {title: request.body.title, content: request.body.content}, 
        {overrite: true}, 
        function(err) {
        if (!err) {
            response.send('Successfully updated selected article')
        }
        else {
            response.send(err)
        }
    })
})
.patch(function(request, response) {
    Article.updateOne(
        {title: request.params.articleTitle}, 
        {$set: request.body}, 
        function(err) {
            if (!err) {
                response.send('Successfully updated selected article')
            }
            else {
                response.send(err)                
            }
        }
    )
})
.delete(function(request, response) {
    Article.deleteOne(
        {title: request.params.articleTitle}, 
        function(err) {
            if (!err) {
                response.send('Successfully deleted selected article')
            }
            else {
                response.send(err)
            }
        }
    )
})

app.listen(3000, function() {
    console.log('server running on port 3000')
})

