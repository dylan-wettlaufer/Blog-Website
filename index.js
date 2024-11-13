import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

mongoose.connect('mongodb+srv://dylanwett11:Raptors2019!@BlogCluster.7prwm.mongodb.net/?retryWrites=true&w=majority&appName=BlogCluster');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

const blogSchema = new mongoose.Schema({
    title: String,
    blog: String,
    createdAt: { type: Date, default: Date.now }
});

const BlogPost = mongoose.model('BlogPost', blogSchema);

const app = express();
const port = 3000;
var editTitle;
var editBlog;
var editId;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
    editTitle = "";
    editBlog = "";
    editId = "";
    
    
    try {
        const blogList = await BlogPost.find({});
        res.render("index.ejs", { blog: blogList });
    } catch (err) {
        console.error("Failed to retrieve posts:", err);
        res.status(500).send("Error retrieving posts");
    }
});

app.get("/post", (req, res) => {
    res.render("post.ejs", { title: editTitle,
                             blog: editBlog });
});

app.get("/blog", (req, res) => {
    res.render("blog.ejs", { title: editTitle,
                             blog: editBlog });
})

app.post("/submit", async (req, res) => {
    const newPost = new BlogPost({
        title: req.body["title"],
        blog: req.body["blog"]
    });
    
    try {
        await newPost.save();
        res.redirect("/");
    } catch (err) {
        console.error("Failed to save post:", err);
        res.status(500).send("Error saving post");
    }
});


app.post("/resubmit", async (req, res) => {
    try {
        await BlogPost.findByIdAndUpdate(editId, {
            title: req.body["title"],
            blog: req.body["blog"]
        });
        res.redirect("/");
    } catch (err) {
        console.error("Failed to update post:", err);
        res.status(500).send("Error updating post");
    }
});


app.post("/delete/:id", async (req, res) => {
    try {
        await BlogPost.findByIdAndDelete(req.params.id);
        res.redirect("/");
    } catch (err) {
        console.error("Failed to delete post:", err);
        res.status(500).send("Error deleting post");
    }
});


app.post("/edit/:id", async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.id);
        editId = post._id;
        editTitle = post.title;
        editBlog = post.blog;
        res.redirect("/post");
    } catch (err) {
        console.error("Failed to retrieve post for editing:", err);
        res.status(500).send("Error retrieving post for editing");
    }
});

app.post("/blog/:id", async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.id);
        editTitle = post.title;
        editBlog = post.blog;
        res.redirect("/blog");
    } catch (err) {
        console.error("Failed to retrieve post for viewing:", err);
        res.status(500).send("Error retrieving post for viewing");
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
