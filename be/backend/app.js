"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const db = require("../controllers/sqlite-db-connection").getDBConnection();
const Post = require("../models/post");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.post("/api/post/add", (req, res, next) => {
  const post = new Post(0, req.body.title, req.body.author, req.body.content);
  console.log(post);

  db.run(
    `INSERT INTO blog(title, author, content) VALUES(?, ?)`,
    [post.title, post.author, post.content],
    function (err) {
      if (err) {
        console.log(err.message);
        res.status(500).json({
          message: "Add Post failed error: " + err.message,
        });
        return;
      }
      // get the last insert id
      console.log(`A row has been inserted with rowid ${this.lastID}`);
    }
  );

  res.status(200).json({
    message: "Post added successfully",
  });
});

app.get("/api/posts", (req, res, next) => {
  var posts = [];

  db.all(`SELECT * FROM blog ORDER BY id DESC`, function (err, rows) {
    if (err) {
      console.error(err.message);
      res.status(500).json({
        message: "Posts fetched error: " + err.message,
        posts: posts,
      });
      return;
    }
    rows.forEach((element) => {
      let post = new Post(
        element.id,
        element.title,
        element.author,
        element.content
      );
      posts.push(post);
    });
    res.status(200).json({
      message: "Posts fetched successfully!",
      posts: posts,
    });
  });
});

module.exports = app;
