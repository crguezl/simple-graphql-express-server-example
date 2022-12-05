const fs = require("fs")
const util = require("util")
const ins = (e, d=2) => util.inspect(e, {depth: d})

const express = require("express")
const { graphqlHTTP } = require("express-graphql")
const { buildSchema } = require("graphql")
const port = process.argv[2] || 4006;

const csvFilePath = process.argv[3] || 'DMSI-2122.csv'
const data = String(fs.readFileSync(csvFilePath))
//console.log(data);

const csv=require('csvtojson')
const SchemaStr = String(fs.readFileSync('aluschema.gql', {encoding: "utf8"}))
//console.log(SchemaStr)
debugger;
const AluSchema = buildSchema(SchemaStr)

const app = express()

async function main () {
    let classroom=await csv().fromFile(csvFilePath);
    // console.log(typeof classroom);
    fs.writeFileSync('DMSI-2122.json',JSON.stringify(classroom, false, 2))

    function restServer() {
        app.get('/student', function(req, res) {
            res.send(classroom)
        })
    
          app.get('/student/:id', function(req, res) {
            res.send(classroom[req.params.id])
          })
    
          app.get('/search/:name', function(req, res) {
              //console.log(req.params.name)
            let index = classroom.findIndex(s => {
                //console.log(s.Nombre)
                let r = s["Nombre"].toLowerCase().match(req.params.name.toLowerCase())
                //console.log(r)
                return r
            });
            (index !== -1)? 
              res.send(classroom[index]) : `{ message: "not found"}`
          })
    }
    
    const root = {
        students: () => classroom,
        student: ({AluXXXX}) => {
            let result = classroom.find(s => {
                return s["AluXXXX"] == AluXXXX
            });
            return result
        },
        /* This console.log proves that parent argument is skipped. See README.md */
        addStudent: (object, args, context, info) => {
            console.log("======== parent is args =========")
            console.log(ins(object))

            console.log("======== args is context ========")
            console.log(ins(args.classroom));
            console.log(`accesing req object from the context: req.baseUrl=${args.req.baseUrl}!`)
            
            console.log("======== context is info ========")
            console.log(ins(context, 1));
            
            console.log("======== info is undefined ========")
            console.log(info); 
            
            console.log("============= this is the parent ==============")
            console.log(this)
          
            const {AluXXXX, Nombre} = object; 

            let result = args.classroom.find(s => {
                // console.log(`Processing ${insp(s, {depth:null})}`);
                return s["AluXXXX"] == AluXXXX
            });
            if (!result) {
                let alu = {AluXXXX : AluXXXX, Nombre: Nombre}
                console.log(`Not found ${Nombre}! Inserting ${AluXXXX}`)

                classroom.push(alu)
                return alu    
            }
            return result;
        },
        setMarkdown: ({AluXXXX, markdown}) => {
            let result = classroom.findIndex(s => s["AluXXXX"] === AluXXXX)
            if (result === -1) {
              let message = `${AluXXXX} not found!`
              console.log(message);
              return null;
            } 
            classroom[result].markdown = markdown
            return classroom[result]
        }
    }
      
    app.use(
        '/graphql',
        graphqlHTTP((request, response, next) => ({
          schema: AluSchema,
          rootValue: root,
          graphiql: {
            defaultQuery: '# Welcome to our GraphiQL server for this Simple GraphQL Server exercise!\n# See the scheme on the Docs button on the right'
          },
          context: { classroom: classroom, req: request, res: response }
        })),
      );
      
      restServer();
      app.listen(port);
      console.log("Running at port "+port+`. Visit http://localhost:${port}/graphql`)
    }



main();


