const TodoModel = require('../models/todos.model');
const faker = require('faker');
const crypto = require('crypto');

exports.insert = (req, res) => {
    TodoModel.createTodo(req.body)
        .then((result) => {
            res.status(201).send({id: result._id});
        });
};

exports.list = (req, res) => {
    let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
    let page = 0;
    let count = 0;  
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
    }
    
    TodoModel.count().then((result) => {
        count = result;
    })

    // Hack for countDocuments function as it occasionally return 0
    count = count == 0 ? 21 : count;

    TodoModel.list(limit, page)
        .then((result) => {
            res.status(200).send({result, count} );
        })
};

exports.todayslist = (req, res) => {
    let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
    let page = 0;
    let count = 0;  
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
    }
    let todaysdate = req.query.todaysdate;    
    TodoModel.todayscount(todaysdate).then((result) => {
        count = result
    })
    TodoModel.todayslist(limit, page, todaysdate)
        .then((result) => {
            res.status(200).send({result, count} );
        })
};

exports.faketodolist = (req, res) => {    
    let count = 0;
    let data = {}    
    let action = ''
    let completed = false;
    let strDate = formatDate(faker.date.recent())
    let totalPages = 8;
    let totalElements = 780;
    let numberOfElements = 100;
    let size = 100;
    let number = 0;
    let first = true;

    //Init data object to be returned on each page request
    data.content = []
    if (req.query.page) {
        req.query.page = parseInt(req.query.page);
        page = Number.isInteger(req.query.page) ? req.query.page : 0;
    }
    data.last = (req.query.page + 1 === totalPages) ? true : false;
    data.totalPages = totalPages;
    data.totalElements = totalElements;
    data.first = (req.query.page === 0) ? true : false;
    data.numberOfElements = numberOfElements;
    data.size = size;


    for (let id=1; id <= size; id++) {

        let firstName = faker.name.firstName();
        let lastName = faker.name.lastName();
        
        if(id % 10 === 0 ){
            action = 'Purchase movie tickets for '
            completed = true;
            strDate = formatDate(faker.date.future())
        }
        else if (id % 2 === 1 ) 
            action = 'Book table at Coffee shop for '
        else if (id % 2 === 2 ) {
            action = 'Hire cab for '
            completed = true;
            strDate = formatDate(faker.date.future())
        }
        else
            action = 'Buy plane ticket for '

        let text = `${action} ${firstName} ${lastName}`;
        let recid = id + (page * 100)       
        
        data.content.push({
            "id": recid,
            "text": text,
            "completed": completed,
            "dueDate": strDate,
            "permissionLevel": 5
        });
    }

    res.status(200).send(data);
}


exports.getById = (req, res) => {
    TodoModel.findById(req.params.todoId)
        .then((result) => {
            res.status(200).send(result);
        });
};
exports.patchById = (req, res) => {
    TodoModel.patchTodo(req.params.todoId, req.body)
        .then((result) => {
            res.status(204).send({});
        });

};

exports.removeById = (req, res) => {
    TodoModel.removeById(req.params.todoId)
        .then((result)=>{
            res.status(204).send({});
        });
};

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('/');
}