const fs = require("fs")
const util = require("util")
const ins = (e, d=2) => util.inspect(e, {depth: d})

const express = require("express")
const { graphqlHTTP } = require("express-graphql")
const { buildSchema } = require("graphql")

const { makeExecutableSchema } = require('@graphql-tools/schema');

const port = process.argv[2] || 4006;

const typeDefs = `
  type Query {
    getLocalDrivers(location: String): [Driver]
  }

  type Driver {
    name: String
    location: String    
  }
`
const resolvers = {
  Query: {
    getLocalDrivers: (obj, args, ctx) => {
       console.log({obj, args, ctx})
    }
  }
}
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})


  
