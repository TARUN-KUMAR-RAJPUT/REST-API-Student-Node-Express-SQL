const mongoose = require("mongoose")
//mongoose.pluralize(null);
const Schema = mongoose.Schema

const studentSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Student Name is required']
        },
    email: {
        type: String,
        required: [true, 'Student Email is required']
    },
    city: {
        type: String,
        required: [true, 'Student City is required']
    }
},{versionKey: false})

studentSchema.index({'$**': 'text'});

// const Student  = mongoose.model("student", studentSchema, "student")
// module.exports = mongoose.model("student", studentSchema, "student")

// const Student  = mongoose.model("student", studentSchema, "student")
// module.exports = Student

const Student = module.exports = mongoose.model("student", studentSchema, "student")


module.exports.getStudents = function(callback){
    Student.find(callback)
}

// module.exports.getStudentById = function(studentId, callback){
//     console.log(`called find`)
//     Student.find({_id: studentId}, callback)
// }
// module.exports.getStudentById = function(studentId, callback){
//     Student.findById(studentId, callback)
// }

module.exports.getStudentByText = function(text, callback){
    const filter = mongoose.isObjectIdOrHexString(text) ? {_id: text}
                                                        : {$text: {$search: text}}
    Student.find(filter, callback)
}

module.exports.createStudent = function(student, callback){
    Student.create(student, callback)
}

module.exports.updateStudent = function(studentId, student, callback){
    Student.updateOne({_id: studentId}, student, callback)
}

module.exports.deleteStudent = function(studentId, callback){
    Student.deleteOne({_id: studentId}, callback)
}