const chalk = require("chalk");
const { string } = require("yargs");
const yargs = require("yargs");
const utils = require("./utils/myFunctions");


// add user
yargs.command({
    command: "adduser",
    describe: "Command getUsers",
    builder: {
        name: { type: 'string', demandOption: true },
        email : {type:'string',demandOption:true}
    },
    handler: function (argv) {
        let user = {
            name: argv.name,
            email:argv.email
        }
        utils.addNewUSer(user);
    }
})

// show all users
yargs.command({
    command: "getUsers",
    describe: "Command adduser",
    builder: {
    },
    handler: function (argv) {
        utils.getAll();
    }
})

// show  user by
yargs.command({
    command: "gitUserBy",
    describe: "Command showSingle",
    builder: {
        type: { type: string, demandOption: true },
        value: { type: string, demandOption: true }
    },
    handler: function (argv) {
        utils.showUserBy(argv.type, argv.value); 
    }  
})

// del user
yargs.command({
    command: "delUser",
    describe: "Command Edituser",
    builder: {
        id: { demandOption: true }
    },
    handler: function (argv) {
        utils.delUser(argv.id);
    }
})

// edit user
yargs.command({
    command: "editUser",
    describe: "Command editUser",
    builder: {
        id: { demandOption: true },
        name:{type:"string"},
        email:{type:"string"}
    },
    handler: function (argv) {
        mainData = ["name", "email"]
        newUserData={}
        mainData.forEach(element => {
            if(argv[element]) newUserData[element]= argv[element]
        });
        utils.editUSer(argv.id, newUserData)
    }
})


yargs.argv


// node app gitUserBy --type=email --value=mohamed@gmail.com
// node app gitUserBy --type=id --value=2sc97qk7kkvtzda0v

//node app editUser --id=2sc97qk7kkvtzda0v

// node app delUser --id=2sc97qk7kkvtzda0v