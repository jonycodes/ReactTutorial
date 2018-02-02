// importing depencies
const express = require('express')
const mongoose = require('mongoose')

var app = express();

// connecting our mongoDB database
mongoose.connect('mongodb://db/todos');

// mongoDB schema
let todoModel = mongoose.model('todo', {
    todo: String,
    date: {
        type: Date,
        default: Date.now
    },
    completed: {
        type: Boolean,
        default: false
    }
})

// utility function to print errors
var logError = (error) => {
    if (error)
        throw error;
}

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// empty is return if nothing is found
app.get('/get/all', (request, response) => {
    todoModel.find((error, todos) => {
        logError(error);
        response.send(todos);
    })
})

// saves a todo
// :todo is a paramater passed in the url
app.get('/save/:todo', (request, response) => {
    let { todo } = request.params

    new todoModel({ todo }).save((error, savedTodo) => {
        logError(error);
        response.send(savedTodo);
    })

})

// removes a specific todo
// :date is a parameter passsed in the url
// using date to find a todo since it's a unique timestamp
app.get('/remove/:date', (request, response) => {
    let { date } = request.params

    todoModel.remove({ date }, (error, deletedTodo) => {
        logError(error);
        response.send(deletedTodo);
    })
})

// finds a specific todo 
// updates it a new todo text and completed value  
app.get('/update/:date/:completed/:todo', (request, response) => {
    let { date, completed, todo } = request.params
    todoModel.findOneAndUpdate({ date }, { completed, todo }, { new: true }, (error, updatedTodo) => {
        logError(error);
        response.send(updatedTodo);
    })
})

// Server is listening to requests at port 3000
// port number can change to anything
app.listen(5000, '0.0.0.0')

console.log('service started at port 5000')