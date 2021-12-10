const { assert } = require('chai');

const getUserByEmail = require("../helpers")

const testUsers = {
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
};

describe('getUserByEmail', function () {
  it('should return a user with valid email', function () {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedUserID = "userRandomID";
    assert.deepEqual(testUsers[expectedUserID].id, expectedUserID)
  });


  it('should return undefined  if email is not in database', function () {
    const user = getUserByEmail('test1@test1.com', testUsers)
    const expected = undefined;
    assert.equal(user, expected);
  });
});

