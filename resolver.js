import { Events, Users } from "./db.js";

const isAuthorized = (condition) => {
    if(condition) return condition.userName;
    else throw new Error("Unauthorized..");
}

const resolvers = {
    Query: {
        events: () => {
            return Events.findAll();
        },
        user: (_root, { userName },{user}) => {
            isAuthorized(user)
            return Users.findOne((user) => user.userName === userName);
        }
    }
};

export default resolvers;