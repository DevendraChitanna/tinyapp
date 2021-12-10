function urlsForUser(user_id) {
  let userURLS = {}
  for (const shortURL in urlDatabase) {
    if (user_id === urlDatabase[shortURL].userID)
      userURLS[shortURL] = urlDatabase[shortURL]

  }
  return userURLS
}

//RANDOMSTRING FUNCTION  (used to generaate user id )
function generateRandomString() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

//***********************************
//email lookup function
const findEmail = function (emails, users) {
  for (const user in users) {
    if (users[user].email === emails) {
      return true;
    }
  }
  return false;
};

//******************************************** */
// const getUserByEmail = (email, userDatabase) => {
//   for (let user in userDatabase) {
//     if (email === userDatabase[user].email) {
//       return userDatabase[user].id
//     }
//   }
// }
//DELETE*********************************

//USERS OBJECT  (DATABASE)
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "test@test.com",
    password: "1234"
  },
  r0SKE7: {
    id: 'r0SKE7',
    email: '1234@1234',
    password: '$2a$10$cjzabQ4nYPMY5yQ7eplcnuKEfR4Vf37zKGzE/CqzcL7wqoJ0dDmC2'
  }

}
//************************************************ */
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const CookieSession = require("cookie-session")
const morgan = require('morgan');
const bcrypt = require('bcryptjs');
const getUserByEmail = require("./helpers")


app.use(morgan('dev'));
app.use(CookieSession({ name: 'session', keys: ['key1', 'key2'] }))

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW"
  }
};
//*************************************************** */
//Request and Resolve
app.get("/", (req, res) => {
  res.send("Hello!");
});
//***************************************************** */
//Home page - list of all URLS
app.get("/urls", (req, res) => {
  //not logged in
  if (!req.session.user_id) {
    return res.send(`<html><body> <a href="http://localhost:8080/login">Login here</a> <---Login OR Register--->   <a href="http://localhost:8080/register">Register here</a>  </body></html>\n`)
  }
  //logged in 

  const urlsOfUser = urlsForUser(req.session.user_id);
  const user = users[req.session.user_id];
  console.log("USER IS HERE", urlsOfUser)
  let templateVars = {
    urls: urlsOfUser,
    user: user,
  };
  res.render("urls_index", templateVars);
  //it means that user is logged in. WE need to get the urls of that user from the database


});
//*************************************************** */
//Page to create new URLs
app.get("/urls/new", (req, res) => {
  if (!req.session.user_id) {
    return res.redirect("/login")
  }
  const templateVars = { user: users[req.session.user_id] }
  res.render("urls_new", templateVars);
});
//***************************************************** */
//get url page with short url as a variable(shortURL is the key)
app.get("/urls/:shortURL", (req, res) => {
  //what does this line do? and what is the req.params. Why do we need it? 
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,/* What goes here? */
    user: users[req.session.user_id]
  };
  res.render("urls_show", templateVars);
});

//************************************************************ */
//LOGIN ENDPOINT GET
app.get("/login", (req, res) => {
  if (req.session.user_id) {
    return res.redirect("/urls")
  }
  const templateVars = { user: users[req.session.user_id] }
  res.render("urls_login", templateVars)
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
  const longURL = urlDatabase[req.params.shortURL].longURL
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
  if (req.session.user_id) {
    return res.redirect("/urls")
  }
  const templateVars = { user: users[req.session.user_id] }
  res.render("urls_register", templateVars);
});

//REGISTER POST
app.post("/register", (req, res) => {

  //1. Check for the empty email or password
  if (req.body.email === "" || req.body.password === "") {
    return res.status(403).send("Please enter email and password");
  }
  //2. If the email and password are not empty 
  if (req.body.email && req.body.password) {
    //if email is found in users object return error code
    if (findEmail(req.body.email, users)) {
      return res.status(403).send("User Alredy registered! Please try diffrent values")
      //otherwise generate a new user id and add info into users object
      //And set the cookie :)
    } else {
      console.log(req.body)
      const id = generateRandomString();
      const email = req.body.email;
      const password = req.body.password;
      const hashedPassword = bcrypt.hashSync(password, 10);
      users[id] = {
        id,
        email,
        password: hashedPassword,
      }
      console.log(users)
      // res.session("user_id", id)
      req.session.user_id = id

    }
  }
  //Then redirect to /urls(home page)

  console.log(users)
  res.redirect("/urls")

});



//****************************************************** */
//LOGIN ENDPOINT
app.post("/login", (req, res) => {
  //check if email and password match users OBJ
  let foundUser = getUserByEmail(req.body.email, users)
  if (foundUser) {
    if (bcrypt.compareSync(req.body.password, users[foundUser].password)) {
      // if (users[foundUser].password === req.body.password) {
      // res.session("user_id", foundUser)
      req.session.user_id = foundUser
      res.redirect(`/urls`)
    } else {
      res.status(403)
      res.send(`<html><body> <a href="http://localhost:8080/login">Login here</a> <---Login|  Password is incorrect   |Register--->   <a href="http://localhost:8080/register">Register here</a>  </body></html>\n`)
    }
  } else {
    res.status(403);
    res.send(`<html><body> <a href="http://localhost:8080/login">Login here</a> <---Login|   Email not found    |Register--->   <a href="http://localhost:8080/register">Register here</a>  </body></html>\n`)
  }


})

//****************************************************** */
//LOGOUT ENDPOINT
app.post("/logout", (req, res) => {
  req.session.user_id = null;
  res.redirect("/urls")
})


//****************************************************** */
//UPDATE
app.post("/urls/:shortURL/update", (req, res) => {
  if (!req.session.user_id) {
    return res.send(`<html><body> <a href="http://localhost:8080/login">Login here</a> <---Login|    Please login or Register to update URLs     |Register--->   <a href="http://localhost:8080/register">Register here</a>  </body></html>\n`)
  }
  console.log(req.params.shortURL)
  urlDatabase[req.params.shortURL].longURL = req.body.longURL
  console.log(urlDatabase)
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
  if (!req.session.user_id) {
    return res.send(`<html><body> <a href="http://localhost:8080/login">Login here</a> <---Login|   Please Login or Register to Delete URLs    |Register--->   <a href="http://localhost:8080/register">Register here</a>  </body></html>\n`)
  }
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
  urlDatabase[newShortURL] = {
    longURL: req.body.longURL,
    userID: req.session.user_id
  }



  //respond with a redirection to /urls/:shortURL, where shortURL is the random string
  //do i need the colen after urls??
  res.redirect(`/urls/${newShortURL}`)

});
//********************************************************************* */


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});