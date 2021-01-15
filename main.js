var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
const {joinUser, removeUser, findUser, getUsers, changeArr} = require('./users');
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});
let thisRoom = "";
let menuNumber = 1;
io.on("connection", function (socket) {
  console.log("connected");
  socket.on("join room", (data) => {
    console.log('in room');
    let Newuser = joinUser(socket.id, data.username,data.roomName)
    io.to(Newuser.roomname).emit('send data' , {username : Newuser.username,roomname : Newuser.roomname, id : socket.id})
  //  io.to(socket.id).emit('send data' , {id : socket.id ,username:Newuser.username, roomname : Newuser.roomname });
  //  socket.emit('send data' , {id : socket.id ,username:Newuser.username, roomname : Newuser.roomname });
   
    
    socket.join(Newuser.roomname);
  });
  let cachedValue = 0;
  socket.on("chat message", (data) => {
    thisRoom = getUsers().find(x => x.socketID === socket.id);
    let dat = '';
    console.log('value --- ', data);
 
    switch(data.value) {
      case 0: 
      dat = `
      Welcome to Daily Nation E-Paper 
Please enter your Name:
( It is just a test version. 
Enter 1 instead of name)
      `;
      break;
      
case 1: 
dat = `
#enter province# 
Please enter your Province:
( It is just a test version. 
Enter 1 instead of name)
1. Lusaka Province
2. Central Province
3. Muchinga Province
4. Copperbelt Province
5. Eastern Province
6. Western Provinces
7. Southern Province
8. North-Western Province
9. Luapula Province
10. Northern Province
`;
break; 
case 2: 
dat = `
#Category#
We Welcome you to Daily Nation Family. 
Please tell us what are you looking for: 
1) Subscribe for Daily Newspaper 
2) Buy Archives
3) Get Credential for Website login
`;
break;
case 3: 
dat = `#Subscribe for Daily Newspaper#
Please select the subscription duration:
1) 1 Day Subscription
2) 7 Days Subscription
3) 14 Days Subscription
4) 28 Days Subscription
5) 3 Months Subscription
6) 6 Months Subscription
7) 1 year Subscription`
break;
case 4:
dat = `
#subscription pay#
You selected 1 Day Subscription.
Please go to the link below to pay K5. As soon as payment gets completed you will be redirected to your dashboard containing the Newspapers you have bought.

https://flutterwave.com/us/


Press 0 to go to Main Menu.
`;
break;
    }
    if (data.value >= 5) {
      dat = `Not available`;
    }

    data = Object.assign(data, {stepdata : dat });

    console.log(data);

    io.sockets.in(thisRoom.roomname).emit('chat message', {data:data, id : socket.id});
  });
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    console.log(user);
    if(user) {
      console.log(user.username + ' has left');
    }
    console.log("disconnected");

  });
});

http.listen(3000, function () {});


