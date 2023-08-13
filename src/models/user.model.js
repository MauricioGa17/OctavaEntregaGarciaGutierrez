import mongoose from 'mongoose';

const userCollection = 'user';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
});

mongoose.set('strictQuery', false);

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;