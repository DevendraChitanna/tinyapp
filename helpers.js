const getUserByEmail = (email, userDatabase) => {
  for (let user in userDatabase) {
    if (email === userDatabase[user].email) {
      return userDatabase[user].id
    }
  }
}

module.exports = getUserByEmail;
