function generateRandomString() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}
//************************************************ */
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')

app.use(cookieParser())

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
//*************************************************** */
//Request and Resolve
app.get("/", (req, res) => {
  res.send("Hello!");
});
//***************************************************** */
//Home page - list of all URLS
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, users: users[req.cookies.user_id] };
  res.render("urls_index", templateVars);
});
//*************************************************** */
//Page to create new URLs
app.get("/urls/new", (req, res) => {
  const templateVars = { users: users[req.cookies.user_id] }
  res.render("urls_new", templateVars);
});
//***************************************************** */
//get url page with short url as a variable(shortURL is the key)
app.get("/urls/:shortURL", (req, res) => {
  //what does this line do? and what is the req.params. Why do we need it? 
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],/* What goes here? */
    users: users[req.cookies.user_id]
  };
  res.render("urls_show", templateVars);
});

//.json of database
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
//*********************************************** */
//used in urls_show
//the : means shortURL is a variable
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
});

app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
});
//******************************************************* */
//REGISTER ENDPOINT
app.get("/register", (req, res) => {
  const templateVars = { users: users[req.cookies.user_id] }
  res.render("urls_register", templateVars);
});

//REGISTER POST
app.post("/register", (req, res) => {
  console.log(req.body)
  const id = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  users[id] = {
    id,
    email,
    password
  }
  console.log(users)
  res.cookie("user_id", id)
  res.redirect("/urls")

});



//****************************************************** */
//LOGIN ENDPOINT
app.post("/login", (req, res) => {
  console.log(req.body.username)
  res.cookie("username", req.body.username)
  res.redirect("/urls")
})

//****************************************************** */
//LOGOUT ENDPOINT
app.post("/logout", (req, res) => {
  res.clearCookie("user_id",)
  res.redirect("/urls")
})


//****************************************************** */
//UPDATE
app.post("/urls/:shortURL/update", (req, res) => {
  console.log(req.params.shortURL)
  urlDatabase[req.params.shortURL] = req.body.longURL
  res.redirect("/urls")
})
//**************************************************************** */
// //REDIRECT when click update from index page
//could of use GET route by changing index ejs, update button route and method
app.post("/urls/:shortURL", (req, res) => {


  const shortURL = req.params.shortURL
  /* What goes here? */

  res.redirect(`/urls/${shortURL}`);
});




//********************************************************************** */
//: after colon is a variable
app.post("/urls/:shortURL/delete", (req, res) => {
  console.log("BEFORE", urlDatabase);
  delete urlDatabase[req.params.shortURL]
  console.log("AFTER", urlDatabase)
  res.redirect("/urls");
});


app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  //dont need res.send("Ok") because we redirecting insted
  // res.send("Ok");         // Respond with 'Ok' (we will replace this)

  //Update server shortURl and longUrl are saved to urlDatabase,**Double check!!!
  //ADDING TO urlDATABASE
  //Do i need to stringify???
  //TAKE IN DATA USE REQ
  //PUSH DATA USE RES, also redirect or render
  let newShortURL = generateRandomString()
  urlDatabase[newShortURL] = req.body.longURL


  //respond with a redirection to /urls/:shortURL, where shortURL is the random string
  //do i need the colen after urls??
  res.redirect(`/urls/${newShortURL}`)

});
//********************************************************************* */


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});