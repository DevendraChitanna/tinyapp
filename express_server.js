function generateRandomString() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
//Request and Resolve
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  //what does this line do? and what is the req.params. Why do we need it? 
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]/* What goes here? */ };
  res.render("urls_show", templateVars);
});


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

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

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});