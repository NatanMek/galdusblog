console.log("Hello World!");

var posts = [];

const renderPosts = function () {
  const postsPlace = document.querySelector("#postsPlace");
  postsPlace.innerHTML = "";

  posts.forEach(function (post) {
    const deleteButton = document.createElement("button");
    deleteButton.className = "bttn-jelly bttn-sm bttn-danger";
    deleteButton.type = "delete";
    deleteButton.textContent = "Delete";
    deleteButton.id = post.id;
    const sep1 = document.createElement("hr");
    const h2Title = document.createElement("h2");
    h2Title.textContent = post.title;
    h2Title.append("   ");
    h2Title.append(deleteButton);
    const h4Author = document.createElement("h4");
    h4Author.textContent = post.author;
    const pContent = document.createElement("p");
    pContent.textContent = post.content;

    postsPlace.appendChild(sep1);
    postsPlace.appendChild(h2Title);
    postsPlace.appendChild(h4Author);
    postsPlace.appendChild(pContent);
  });
};

const clearFields = function () {
  const fields = document.querySelectorAll("#fields");
  fields.forEach(function (field) {
    field.value = "";
  });
};

const getPosts = function (callbackFn) {
  const request = new XMLHttpRequest();
  request.open("GET", "http://127.0.0.1:3000/api/posts");
  request.send();

  request.addEventListener("readystatechange", (e) => {
    if (e.target.readyState === 4 && e.target.status === 200) {
      const responseData = JSON.parse(e.target.responseText);
      callbackFn(undefined, responseData.posts);
      // posts = responseData.posts;
      // renderPosts();
    } else if (e.target.readyState === 4) {
      callbackFn("Errore nella chiamata", undefined);
      // console.log('Errore nella chiamata');
    }
  });
};

const addNewPost = function (newPost, callbackFn) {
  console.log(newPost);
  const request = new XMLHttpRequest();
  request.open("POST", "http://127.0.0.1:3000/api/posts/add");
  request.setRequestHeader("Content-Type", "application/json");
  request.send(JSON.stringify(newPost));

  request.addEventListener("readystatechange", (e) => {
    if (e.target.readyState === 4 && e.target.status === 200) {
      const responseData = JSON.parse(e.target.responseText);
      callbackFn(undefined, responseData.posts);
    } else if (e.target.readyState === 4) {
      callbackFn("Errore nella chiamata", undefined);
    }
  });
};

const deletePost = function (idPost, callbackFn) {
  console.log(idPost);
  const request = new XMLHttpRequest();
  request.open("DELETE", "http://127.0.0.1:3000/api/posts/delete/" + idPost);
  request.setRequestHeader("Content-Type", "application/json");
  request.send(JSON.stringify(idPost));

  request.addEventListener("readystatechange", (e) => {
    if (e.target.readyState === 4 && e.target.status === 200) {
      const responseData = JSON.parse(e.target.responseText);
      callbackFn(undefined, responseData.posts);
    } else if (e.target.readyState === 4) {
      callbackFn("Errore nella chiamata", undefined);
    }
  });
};

document.querySelector("#emptyFormBtn").addEventListener("click", function (e) {
  e.preventDefault();
  clearFields();
});

const sendPostCallbackFn = function (error, data) {
  if (error) {
    console.log(error);
  } else {
    getPosts(getPostsCallbackFn);
  }
};

const getPostsCallbackFn = function (error, data) {
  if (error) {
    console.log(error);
  } else {
    posts = data;
    renderPosts();
  }
};

document.querySelector("#newForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const newPost = {
    id: undefined,
    title: e.target.elements.title.value,
    author: e.target.elements.author.value,
    content: e.target.elements.content.value,
  };
  posts.push(newPost);
  clearFields();
  addNewPost(newPost, sendPostCallbackFn);
});

const deleteButtons = document.getElementsByClassName(
  "btn btn-outline-danger btn-sm"
);

for (var i = 0; i < deleteButtons.length; i++) {
  deleteButtons[i].addEventListener("click", function (e) {
    e.preventDefault();
    console.log("Eliminare Post");
  });
}

getPosts(getPostsCallbackFn);

renderPosts();
