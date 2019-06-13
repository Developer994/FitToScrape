var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var NoteSchema = new Schema({
    name: {
        type: String,
    },
    body: {
        type: String,
        required: true
    }
})

var Notes = mongoose.model("Note", NotesSchema);
module.exports = Note;