const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatarUrl:String,
    card: {
        items: [{
            count: {
                type: Number,
                required: true,
                default: 1
            },
            courseId: {
                type: Schema.Types.ObjectId,
                ref: 'Course',
                required: true
            }
        }]
    }
})

userSchema.methods.addToCard = async function (course) {
    const items = [...this.card.items];
    const idx = items.findIndex(item => {
        return item.courseId.toString() === course._id.toString()
    })
    if (idx >= 0) {
        items[idx].count = items[idx].count + 1;
    } else {
        items.push({
            courseId: course._id,
            count: 1
        })
    }

    this.card = { items }
    await this.save();
}

userSchema.methods.removeFromCard = async function (id) {
    let items = [...this.card.items];
    const idx = items.findIndex(i => i.courseId.toString() === id.toString());

    if (items[idx].count === 1) {
        items.splice(idx, 1);
    } else {
        items[idx].count--;
    }

    this.card = { items }
    await this.save();

}

userSchema.methods.clearCard = function () {
    this.card = { items: [] }
    return this.save();
}

module.exports = model('User', userSchema)