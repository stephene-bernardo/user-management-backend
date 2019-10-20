const UserApi = require('./services/userApi');
const UserAuthApi = require('./services/userAuthApi');

module.exports = class UserGraphQl {
  constructor(userSequelize, userAuthSequelize){
    this.userApi = new UserApi(userSequelize);
    this.userAuthApi = new UserAuthApi(userAuthSequelize);
  }

  getBuildSchema(){
    return `
  type User {
    id: Int!,
    firstName: String!,
    lastName: String!,
    userName: String!
  }
    type UserAuth {
    id: Int!,
    userId: Int!
  }
   input UserInput {
    firstName: String!,
    lastName: String!,
    userName: String!
  }
  type Mutation{
    createUser(user: UserInput): User
    deleteUser(id: Int): Int
    updateUser(id: Int, userInput: UserInput): [Int]
    deleteUserAuth(userId: Int): Int
  }
  type Query {
    users: [User!]!
    user(id: Int): [User!]!
    userAuths: [UserAuth!]!
  }`;
  }

  getResolver(){
    return {
      userAuths: () => this.userAuthApi.findAll(),
      users: () => this.userApi.findAll(),
      user: ({id}) => this.userApi.get(id),
      createUser: ({user}) => this.userApi.insert(user.firstName, user.lastName, user.userName),
      deleteUser: (({id})=> this.userApi.delete(id)),
      updateUser: (({id, userInput}) => this.userApi.update(id, userInput)),
      deleteUserAuth: (({userId})=> this.userAuthApi.delete(userId))
    };
  }
}
UserBuildSchema = `
  type User {
    id: Int!,
    firstName: String!,
    lastName: String!,
    userName: String!
  }
   input UserInput {
    firstName: String!,
    lastName: String!,
    userName: String!
  }
  type Mutation{
    createUser(user: UserInput): User
    deleteUser(id: Int): Int
    updateUser(id: Int, userInput: UserInput): [Int]
  }
  type Query {
    users: [User!]!
    user(id: Int): [User!]!
  }`;

UserRoot = {
  users: () => userApi.findAll(),
  user: ({id}) => userApi.get(id),
  createUser: ({user}) => userApi.insert(user.firstName, user.lastName, user.userName),
  deleteUser: (({id})=> userApi.delete(id)),
  updateUser: (({id, userInput}) => userApi.update(id, userInput))
};
// module.exports = {
//   UserBuildSchema,
//   UserRoot
// };