const fs = require("fs");
const chalk = require("chalk");
const validator = require("validator");
const uniqid = require("uniqid");

function writeInFile(data) {
    fs.writeFileSync("users.json", JSON.stringify(data));    
}

const readFromFile = () => {
    let data;
    try {
        data = JSON.parse(fs.readFileSync("users.json"));
        if (!Array.isArray(data)) throw new Error();
    }
    catch(e) {
        data = [];
    }

    return data;
}

// print one user
const printUser = (user,startText) => {
    let str = chalk.magentaBright(startText);
    for (u in user) {
        str += u + ": " + chalk.cyanBright(user[u])  + " , ";
    }
    console.log(chalk.yellowBright(str))
}

// validate email
const validateEmail = (email) => {
    if (!validator.isEmail(email)) throw new Error("invaild Email");
}

// check unique data
const checkUnique = (allUsers, data,attr, index = null)=>{
    const notUnique = allUsers.find((user, i) => user[attr] == data && index != i)
    if (notUnique) throw new Error(`${attr} used before`);
}

// add new user and write to file
const addNewUSer = (userData) => {
    try {
        validateEmail(userData.email)
        const allUsers = readFromFile();
        checkUnique(allUsers, userData.email, "email");
        let user = { id: uniqid(), ...userData }
        allUsers.push(user);
        writeInFile(allUsers);
        console.log(chalk.greenBright("data added successfuly"));
    }
    catch(e) {
        console.log(chalk.red(e.message))
    }
}

// get all users and print every user
const getAll = ()=>{
    try {
        let data = readFromFile();
        if (data.length == 0) console.log(chalk.red("no users found"));
        else data.forEach((user,i) => {
            printUser(user,`${i}- `)
        })
    }
    catch(e) {
        console.log(chalk.red(e.message));
    }
}

// show user by id or email and print it
const showUserBy = (type, value) => {
    try {
        const allUsers = readFromFile();
        let userInd = allUsers.findIndex(user => user[type] == value);
        if (userInd == -1) throw new Error("user not found");
        console.log(chalk.greenBright(`User Location : ${userInd}`));
        printUser(allUsers[userInd], "User Data => ");
    }
    catch(e) {
        console.log(chalk.red(e.message))
    }
}

// delet user by id
const delUser = (userId) => {
    try {
        const allUsers = readFromFile();
        const newUsers = allUsers.filter(user => user.id != userId);
        if (newUsers.length == allUsers.length) throw new Error("user not found")
        writeInFile(newUsers);
        console.log(chalk.greenBright("user deleted success"));
    }
    catch (e) {
        console.log(chalk.red(e.message))
    }
}

// edit user by id
const editUSer = (id,userData) => {
    try {
        let allUsers = readFromFile();
        let userInd = allUsers.findIndex(user => user.id == userData.id);
        if (userInd == -1) throw new Error("user not found");

        if (userData.email) validateEmail(userData.email)
        checkUnique(allUsers,userData.email, email, id)

        for (u in userData) allUsers[userInd][u] = userData[u];
       
        console.log(chalk.greenBright("user data edited successed"));
        printUser(user, "");
        writeInFile(allUsers);
    }
    catch (e) {
        console.log(chalk.red(e.message))
    }
}

module.exports = {
    addNewUSer,
    getAll,
    showUserBy,
    delUser,
    editUSer, 
}
