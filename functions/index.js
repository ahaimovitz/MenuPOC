
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const admin = require("firebase-admin");
const functions = require("firebase-functions");
const express = require("express");

admin.initializeApp();


const { ApolloServer, gql } = require("apollo-server-express");

const typeDefs = gql`
  
  type Category {
    name: String
    id: Int
    products: [Product]
   }

   type Product{
    id: Int
    name: String
    description: String
    availableNow: Boolean
    availability: Availability
   }
   type Availability{
     always: Boolean
     now: Boolean
   }
  
  type Query {
    categories: [Category]
    #  product(availability: Availability): Product 
    availability(now:String): Boolean
  }
`;

const resolvers = {
    Query: {
      categories: () =>
        admin.database()
          .ref("categories") 
          .once("value")
          .then(snap => snap.val())
          .then(val => Object.keys(val).map(key => val[key]))
    }
  }; 

  console.log(resolvers);
  /* const scoresRef = admin.database().ref('categories').once("value");

scoresRef.on('value', (snapshot) => {
  snapshot.forEach((data) => {
    console.log('The ' + data.key + ' dinosaur\'s score is ' + data.val());
  });
}); */

  const app = express();
  const server = new ApolloServer({ typeDefs, resolvers });
  server.applyMiddleware({ app, path: "/", cors: true });
  exports.graphql = functions.https.onRequest(app);