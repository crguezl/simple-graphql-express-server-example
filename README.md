run: `npm start`

* Read 
<https://stackoverflow.com/questions/51779230/parameters-ordering-to-get-context-in-express-graphql>
* and <https://stackoverflow.com/questions/48630023/wrong-order-of-graphql-resolver-arguments-root-args-context>

> From <https://github.com/graphql/express-graphql/issues/562> IvanGoncharov writes: 
> We actually have two types of resolvers: 
> 1. specified in GraphQLObjectType fields and they get (parent, args, context, info) 
> 2. resolvers specified on parent itself, in this case, their prototype is (args, context, info) and you can access parent using `this`. 

> Coincidentally, the name property on that Driver object could also be a function. In that case, 
> GraphQL would call that function to get its return value. And very much like a resolver, GraphQL
>  passes some information to this function as parameters, namely 
> 1) the arguments, 
> 2) the context
>  and 3) the info object. 
> When fields are resolved in this way, the "obj" parameter is omitted.