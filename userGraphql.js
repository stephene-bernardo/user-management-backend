const UserApi = require('./services/userApi')

module.exports = class UserGraphQl {
  constructor(userSequelize){
    this.userApi = new UserApi(userSequelize);
  }

  getBuildSchema(){
    return `
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
  }

  getResolver(){
    return {
      users: () => this.userApi.findAll(),
      user: ({id}) => this.userApi.get(id),
      createUser: ({user}) => this.userApi.insert(user.firstName, user.lastName, user.userName),
      deleteUser: (({id})=> this.userApi.delete(id)),
      updateUser: (({id, userInput}) => this.userApi.update(id, userInput))
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