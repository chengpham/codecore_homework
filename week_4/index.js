const express = require('express')
const app = express()
const path = require('path')
const methodOverride = require('method-override')
const knex = require('./db/client')
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride((req,res)=>{
    if (req.body && req.body._method){ return req.body._method }
}))

app.get('/', (req,res)=>{
    res.render('index', {team:false})
})
app.get('/cohorts', (req, res) => {
    knex('cohorts')
        .then(cohorts=>{
            res.render('cohort', { 
                cohorts: cohorts, 
                team: false})
        })
});
app.get('/cohorts/new', (req, res) => {
    res.render('new', {cohorts:false, team: true});
});
app.get('/cohorts/:id/edit', (req, res) => {
    knex('cohorts')
    .where('id', req.params.id)
    .first()
    .then(cohorts=>{
        if (!cohorts){
            res.send('No Cohorts Exist')
        } else{
            res.render('edit', { 
                cohorts : cohorts,
                team: true });
        }
    })
});
app.post('/cohorts/new', (req, res) => {
    knex('cohorts')
        .insert({
        name: req.body.name,
        members: req.body.members,
        logo_url: req.body.logo_url
        })
        .returning('*')
        .then( () => {
        res.redirect('/cohorts');
    })
})
app.get('/cohorts/:id', (req,res) => {
    knex('cohorts')
    .where('id', req.params.id)
    .first()
    .then(cohorts=>{
        if (!cohorts){
            res.send('No Cohorts Exist')
        } else{
            res.render('show', { 
                cohorts : cohorts, 
                method: false,
                quantity: false,
                team: false });
        }
    })
})
app.post('/cohorts/:id', (req,res) => {
    knex('cohorts')
    .where('id', req.params.id)
    .first()
    .then(cohorts=>{
        if (!cohorts){
            res.send('No Cohorts Exist')
        } else{
            res.render('show', { 
                cohorts : cohorts,
                method : req.body.method,
                quantity : req.body.quantity,
                team: false });
        }
    })
})


app.patch('/cohorts/:id/edit', (req,res)=>{
    knex('cohorts')
    .where('id', req.params.id)
    .update({
        name: req.body.name,
        members: req.body.members,
        logo_url: req.body.logo_url
    })
    .then(()=>{
        res.redirect(`/cohorts/${req.params.id}`)
    })
})

app.delete('/cohorts/:id', (req, res) => {
    knex('cohorts')
      .where('id', req.params.id)
      .del()
      .then(() => {
        res.redirect('/cohorts');
      });
  });


const port = 5000;
app.listen(process.env.PORT || port, ()=>{
    console.log(`Server listening on localhost:${port}`)
})