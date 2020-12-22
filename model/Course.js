const { Schema, model } = require('mongoose');
const courseSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

})
courseSchema.method('toClient', function () {
    const course = this.toObject();
    course.id = course_id;
    delete course_id;
    return course;
})

module.exports = model('Course', courseSchema);