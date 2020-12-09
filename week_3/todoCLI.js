const readline = require('readline')
const fs = require('fs')
const rl = readline.createInterface({input: process.stdin, output: process.stdout})
let myfile = [];
if (/.\.json$/.test(process.argv.slice(2))){
    myfile = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'))  
} 
const todoList = myfile.length>0 ? myfile : []
console.log(`Welcome to Todo CLI!\n--------------------\n`)
const todo = () => {
    rl.question(`(v) View • ( n ) New • (cX) Complete • (dX) Delete • (s) Save • (q) Quit\n> `, (answer) => {
        if (/^[qQ]$/.test(answer)){
        console.log(`See you soon! `, String.fromCodePoint('128512'))
        return rl.close()
        }
        if (/^[vV]$/.test(answer)){
            if (todoList.length==0){
                console.log('List is empty...')
            } else {
            todoList.map((i,j)=>console.log(`${j} [${i.completed?'\u2713':''}] ${i.title}\n`))
            }
        }
        if (/^[nN]$/.test(answer)){
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
        if (/^[sS]$/.test(answer)){
            const saveList = ()=>{
                rl.question('Where? Default: myTodos.json\n> ', (answer)=>{
                    if(/^[a-zA-Z\d]+\.json$/.test(answer)){
                        fs.writeFileSync(`./${answer}`, JSON.stringify(todoList))
                        console.log(`List saved to ${answer}`)
                        return todo()
                    }
                    if(/^[a-zA-Z\d]+\.[a-zA-Z]*$/.test(answer)){
                        fs.writeFileSync(`./${answer.slice(0,answer.indexOf('.'))}.json`, JSON.stringify(todoList))
                        console.log(`List saved to ${answer.slice(0,answer.indexOf('.'))}.json`)
                        return todo()
                    }
                    if(/^[a-zA-Z\d]+$/.test(answer)){
                        fs.writeFileSync(`./${answer}.json`, JSON.stringify(todoList))
                        console.log(`List saved to ${answer}.json`)
                        return todo()
                    } 
                    if (answer.length==0){
                        fs.writeFileSync(`./myTodos.json`, JSON.stringify(todoList))
                        console.log(`List saved to myTodos.json`)
                        return todo()
                    }
                    saveList()
                })
            }
            saveList()
        }
        if (/^[cC]\d$/.test(answer) && answer[1]<todoList.length){
            console.log(`Completed "${todoList[answer[1]].title}"`)
            todoList[answer[1]].completed = true
        }
        if (/^[dD]\d$/.test(answer) && answer[1]<todoList.length){
            console.log(`Deleted "${todoList[answer[1]].title}"`)
            todoList.splice(answer[1],1)
        }

        todo()
    })
}
todo()
// CREATED BY CHENG PHAM 