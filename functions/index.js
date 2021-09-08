
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

var ref = admin.database().ref("categories");

ref.once('value', gotUserData);

function gotUserData(snapshot){
  snapshot.forEach(userSnapshot => {
    var k = userSnapshot.key;
    var id = userSnapshot.val().id;
    var products = userSnapshot.val().products;
    var prod_keys = Object.keys(products);
    for(i=0; i<prod_keys.length; i++)
    {
        console.log("prodkey=" + products[i].key);
    }
    console.log(k + " " + id + " products=" + products);
   /**  ref.child("teams").child(id).once("value", teamsSnapshot => {
      teamsSnapshot.forEach(teamSnapshot => {
        var teamKey = teamSnapshot.key;
        teamSnapshot.forEach(teamProp => {
          var prop = teamProp.key;
          var val = teamProp.val();
          console.log(k+" "+name+" "+id+": "+teamKey+", "+prop+"="+val);
        });
      });
    });
    */
  })
}

const { ApolloServer, gql } = require("apollo-server-express");

const typeDefs = gql`
  
  type Category {
    name: String
    id: Int!
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
    getCategory(id: ID!): [Category]
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
          ,
      getCategory:  (_,_id,__) =>
        admin.database().ref("categories").orderByChild("name").once("value")
        .then(snap => snap.val())
        .then(val => Object.keys(val).map(key => val[key]))
    
    }
  }; 

  console.log(resolvers);
//  const scoresRef = admin.database().ref('categories').once("value");
/** 
scoresRef.on('value', (snapshot) => {
  snapshot.forEach((data) => {
    console.log('The ' + data.key + ' dinosaur\'s score is ' + data.val());
  });
}); */

  const app = express();
  const server = new ApolloServer({ typeDefs, resolvers });
  server.applyMiddleware({ app, path: "/", cors: true });
  exports.graphql = functions.https.onRequest(app);