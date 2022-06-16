const mongoose = require('mongoose');
const user = require('../models/user');
const User = require('../models/user');
const userdetail = require('./userdetail');
const facultydetails = require('./facultydetails');
const Faculty = require('../models/faculty');

mongoose.connect('mongodb://localhost:27017/user-portal');
const db = mongoose.connection;
db.on("error", console.log.bind(console, "Connection Error"));
db.once("open", () => {
    console.log("Database Connected");
});

const seedDB = async() => {
    await User.deleteMany({});

    for (let i = 0; i < 20; i++) {
        const cg = (Math.random() * 10);
        const u = new User({
            author: '62a78735579aa332c7f63caa',
            name: `${userdetail[i].name}`,
            rollno: `${userdetail[i].rollno}`,
            state: `${userdetail[i].state}`,
            cgpa: cg.toFixed(2),
            branch: `${userdetail[i].branch}`,
            description: `${userdetail[i].description}`,
            club: `${userdetail[i].club}`,
            semester: `${userdetail[i].semester}`.toUpperCase(),
            image: [{
                filename: 'stuHub/qsdczggwc6os37pzfrre',
      url: 'https://res.cloudinary.com/dskux81xq/image/upload/v1655393653/stuHub/qsdczggwc6os37pzfrre.jpg'
            }],
        });
        await u.save();
    }

    

    await Faculty.deleteMany();
    for (let i = 0; i < 1; i++) {
        const f = new Faculty({
            author: '62a78735579aa332c7f63caa',
            name: `${facultydetails[i].name}`,
            department: `${facultydetails[i].department}`,
            qualifications: `${facultydetails[i].qualifications}`,
            experience: `${facultydetails[i].experince}`,
            designation: `${facultydetails[i].designation}`,
            image: [{
                filename: 'stuHub/qsdczggwc6os37pzfrre',
      url: 'https://res.cloudinary.com/dskux81xq/image/upload/v1655393653/stuHub/qsdczggwc6os37pzfrre.jpg'
            }],
        })
        await f.save()
    }

}

seedDB().then(() => {
    mongoose.connection.close();
})