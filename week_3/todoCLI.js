const readline = require('readline')
const emoji = require('node-emoji')
const fs = require('fs')
const rl = readline.createInterface({input: process.stdin, output: process.stdout})
let myfile = [];
if (/.\.json$/.test(process.argv.slice(2))){
    myfile = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'))  
} 
// fs.writeFileSync('./filename.json', JSON.stringify( todoList ))

const todoList = myfile.length>0 ? myfile : []
console.log(`Welcome to Todo CLI!\n--------------------\n`)
const todo = () => {
    rl.question(`(v) View • ( n ) New • (cX) Complete • (dX) Delete • (s) Save • (q) Quit\n> `, (answer) => {
        if (answer.toLowerCase()=='q'){
        console.log(`See you soon! `, emoji.get('smile'))
        return rl.close()
        }
        if (answer.toLowerCase()=='v'){
            if (todoList.length==0){
                console.log('List is empty...')
            } else {
            todoList.map((i,j)=>console.log(`${j} [${i.completed?emoji.get('heavy_check_mark'):''}] ${i.title}\n`))
            }
        }
        if (answer.toLowerCase()=='n'){
            const newItem = ()=>{
                rl.question('What?\n> ', (answer)=>{
                    if(answer){
                        todoList.push({title: answer, completed: false})
                        console.log(answer,' has been added to the todo list!\n')
                        return todo()
                    } 
                    newItem()
                })
            }
            newItem()
        }
        if (answer.toLowerCase()=='s'){
            const saveList = ()=>{
                rl.question('Where?\n> ', (answer)=>{
                    if(/.\.json$/.test(answer)){
                        fs.writeFileSync(`./${answer}`, JSON.stringify(todoList))
                        console.log(`List saved to ${answer}`)
                        return todo()
                    } 
                    saveList()
                })
            }
            saveList()
        }
        if (answer[0].toLowerCase()=='c'){
            console.log(`Completed "${todoList[answer[1]].title}"`)
            todoList[answer[1]].completed = true
        }
        if (answer[0].toLowerCase()=='d'){
            console.log(`Deleted "${todoList[answer[1]].title}"`)
            todoList.splice(answer[1],1)
        }

        todo()
    })
}
todo()
