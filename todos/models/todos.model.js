const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

const todoSchema = new Schema({
    text: String,
    completed: Boolean,
    dueDate: String,
    permissionLevel: Number
});

todoSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
todoSchema.set('toJSON', {
    virtuals: true
});

todoSchema.findById = function (cb) {
    return this.model('Todos').find({id: this.id}, cb);
};

const Todo = mongoose.model('Todos', todoSchema);


exports.findByEmail = (email) => {
    return Todo.find({email: email});
};
exports.findById = (id) => {
    return Todo.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.createTodo = (TodoData) => {
    const todo = new Todo(TodoData);
    return todo.save();
};

exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        Todo.find()
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, Todos) {
                if (err) {
                    reject(err);
                } else {
                    resolve(Todos);
                }
            })
    });
};


exports.todayslist = (perPage, page, todaysDate) => {
    return new Promise((resolve, reject) => {
        Todo.find({ dueDate: todaysDate })
        .limit(perPage)
        .skip(perPage * page)
        .exec(function (err, Todos) {
            if (err) {
                reject(err);
            } else {
                resolve(Todos);
            }
        })
    });
};

//
exports.count = () => {    
    return new Promise((resolve, reject) => {
        Todo.countDocuments({})        
        .exec(function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        })       
    })
};

exports.todayscount = (todaysDate) => {       
    return new Promise((resolve, reject) => {
        Todo.countDocuments({dueDate : todaysDate})        
        .exec(function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        })          
    }) 
}

exports.patchTodo = (id, TodoData) => {
    return Todo.findOneAndUpdate({
        _id: id
    }, TodoData);
};

exports.removeById = (TodoId) => {
    return new Promise((resolve, reject) => {
        Todo.deleteMany({_id: TodoId}, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};
