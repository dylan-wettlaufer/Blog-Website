import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
var blogList = [];
var editTitle;
var editBlog;
var editId;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    editTitle = "";
    editBlog = "";
    editId = "";
    res.render("index.ejs", { blog: blogList }); // Pass the blogList to the template
});

app.get("/post", (req, res) => {
    res.render("post.ejs", { title: editTitle,
                             blog: editBlog });
});

app.get("/blog", (req, res) => {
    res.render("blog.ejs", { title: editTitle,
                             blog: editBlog });
})

app.post("/submit", (req, res) => {
    blogList.push({ id: null, 
                    title: req.body["title"], 
                    blog: req.body["blog"] });
    res.redirect("/"); // Redirect to the home page after submitting
});

app.post("/resubmit", (req, res) => {
    blogList[editId].title = req.body["title"];
    blogList[editId].blog = req.body["blog"];
    res.redirect("/");
})

app.post("/delete/:id", (req, res) => {
    const postId = parseInt(req.params.id);
    blogList = blogList.filter(post => post.id !== postId); // Remove post by ID
    res.redirect("/"); 
});

app.post("/edit/:id",(req, res) => {
    editId = parseInt(req.params.id);
    editTitle = blogList[editId].title;
    editBlog = blogList[editId].blog;
    res.redirect("/post");    
});

app.post("/blog/:id", (req, res) => {
    editId = parseInt(req.params.id);
    editTitle = blogList[editId].title;
    editBlog = blogList[editId].blog;
    res.redirect("/blog");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
