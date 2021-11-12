
let newAccForm = document.getElementById("newAcc");
let tbody = document.querySelector("tbody");
let closeIcon = document.getElementById("closeShow");
let coverLayer = document.querySelector(".cover-layer");
let dataShow = document.querySelector(".data-show .data");

// open & close layer of show data
function openLayer() {
    coverLayer.style.top = 0;
}

function closeLayer() {
    coverLayer.style.top = "-100%";
    dataShow.textContent = "";
}

if (closeIcon) {
    closeIcon.addEventListener("click", closeLayer)
}

// __________________________________________________________________

// read & write local storage
const readLocalStaorageData = () =>{
    let data
    try{
        data = JSON.parse(localStorage.getItem('UsersAcc'))
        if(!data || !Array.isArray(data) ) throw new Error()
    }
    catch(e){
        data = []
    }
    return data
}

const writeDataToLocalStorage = (data) =>{
    localStorage.setItem("UsersAcc", JSON.stringify(data))
}

// __________________________________________________________________

// add new account page
if (newAccForm) {
    newAccForm.addEventListener("submit", function (e) {
        e.preventDefault();
        let balValue = this.elements.balance.value;
        if (balanceValidtion(balValue)) {
            user = {
                accId: Date.now(),
                name: this.elements.name.value,
                balance: balValue,
                address: {
                    city: this.elements.city.value
                    , street: this.elements.st.value,
                    bNum: this.elements.bNum.value,
                },
                transictions: [{ type: "add", amount: balValue }],
            }
            addUser(user);
            window.location.replace("index.html");
        }
    })
}

// check balance validation
function balanceValidtion(bal, type = "add", TBal = "6000") {
    const alertDiv = document.querySelector(".alert");
    if (bal >= 100 && ((type == "pull" &&  bal <= TBal) || (type == "add" &&  bal <= 6000))) {
        alertDiv.classList.add("d-none");
        return true;
    } else {
        alertDiv.classList.remove("d-none");
        type === "pull" ? alertDiv.textContent = `your balance must be in range 100:${TBal}` : "";
        return false;
  }
}

// adduser and write to localstorage
function addUser(user) {
    let users = readLocalStaorageData();
    users.push(user);
    writeDataToLocalStorage(users);
}

// __________________________________________________________________

// create element
function createMyOwnElement (parent, ele, txt=null, classes=null) {
    myElement = document.createElement(ele)
    parent.appendChild(myElement)
    if(txt) myElement.textContent = txt
    if(classes) myElement.classList=classes
    return myElement
}

// show all users page
if (tbody) {
    let users = readLocalStaorageData();
    users.forEach(user => {
        let tr = createMyOwnElement(tbody, "tr");
        createMyOwnElement(tr, "td", user.accId);
        createMyOwnElement(tr, "td", user.name);
        let tBtns = createMyOwnElement(tr, "td");
        const showBtn = createMyOwnElement(tBtns, "button", "show", "btn btn-info mx-2");
        showBtn.addEventListener("click", () => { showUser(user) });
        const add = createMyOwnElement(tBtns, "button", "add", "btn btn-success mx-2");
        add.addEventListener("click", () => performProcess(user,"add"));
        const pull = createMyOwnElement(tBtns, "button", "pull", "btn btn-warning mx-2");
        pull.addEventListener("click", () => performProcess(user,"pull"));
    })
}

// show single user
function showUser(user) {
    openLayer();
    dataShow.textContent = "";
    createMyOwnElement(dataShow, "h4", `Account Number : ${user.accId}`,"text-center mb-4");
    createMyOwnElement(dataShow, "h5", `User Name : ${user.name}`,"mb-3 text-center");
    createMyOwnElement(dataShow, "h5", `Adress : ${user.address.city} , ${user.address.street} , ${user.address.bNum} `);
    createMyOwnElement(dataShow, "h5", `Total Balance : ${user.balance}`);
    createMyOwnElement(dataShow, "h5", `Transictions : `, "mt-3");
    user.transictions.forEach(tran => {
        createMyOwnElement(dataShow, "p", `${tran.type} : ${tran.amount}` , "mx-5");
    })
}

// perform add or pull process
function performProcess(user,procType) {
    openLayer();
    let dataShow = document.querySelector(".data-show .data");
    dataShow.textContent = "";
    createMyOwnElement(dataShow, "h4", `Account Number : ${user.accId}`,"text-center mb-4");
    createMyOwnElement(dataShow, "h5", `User Name : ${user.name}`, "text-center mb-3");
    createMyOwnElement(dataShow, "p", `Your Total Balance : ${user.balance}`, "text-center");
    const inputBal = createMyOwnElement(dataShow, "input", "", "my-4 form-control");
    inputBal.setAttribute("type", "number");
    inputBal.setAttribute("placeholder", "enter your balance");
    createMyOwnElement(dataShow,"div","your balance must be in range 100:6000","alert alert-danger d-none align-items-center mt-1")
    const submitProcess = createMyOwnElement(dataShow, "button", "submit", "btn btn-primary");
    submitProcess.addEventListener("click", () => editBalance(user,inputBal.value,procType));
}

// edit balance after process
function editBalance(user, value, procType) {  
    if (balanceValidtion(value,procType,user.balance)) {
        let users = readLocalStaorageData();
        let ind = users.findIndex(u => u.accId == user.accId);
        let oldBalance = parseInt(user.balance);
        procType == "add" ? user.balance = oldBalance + parseInt(value) : user.balance = oldBalance - parseInt(value);
        user.transictions.push({ type: procType, amount: value });
        users[ind] = user;
        console.log(users)
        writeDataToLocalStorage(users);
        showUser(user);
    }
}