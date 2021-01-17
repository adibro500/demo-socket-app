var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
const { joinUser, removeUser, findUser, getUsers, changeArr } = require('./users');
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});


let thisRoom = "";

let cachedValues = [];
let datum = [];

io.on("connection", function (socket) {
  console.log("connected");
  socket.on("join room", (data) => {
    console.log('in room');
    let Newuser = joinUser(socket.id, data.username, data.roomName, 0, -1, true, false)
    io.to(Newuser.roomname).emit('send data', { username: Newuser.username, roomname: Newuser.roomname, id: socket.id })
    //  io.to(socket.id).emit('send data' , {id : socket.id ,username:Newuser.username, roomname : Newuser.roomname });
    //  socket.emit('send data' , {id : socket.id ,username:Newuser.username, roomname : Newuser.roomname });
   

    socket.join(Newuser.roomname);
  });
  let cachedValue = 0;
  socket.on("chat message", (data) => {
    thisRoom = getUsers().find(x => x.socketID === socket.id);
    let dat = '';
    console.log('value --- ', data);

   if (data.value == 0) {
     thisRoom.counter = 0;
   }
   if (data.value == 1) {
     thisRoom.counter++;
   }

  //  thisRoom.cachedValues.push(data);

    switch (thisRoom.counter) {
      case -1:
        dat = `
Please Select one of the demo chat Bots:
1. E Paper
2. PVT Election Bot
      `;
      thisRoom.counter = 0;
      thisRoom.isInit = true;
      thisRoom.nextMenu = false;
        break;

        case 0:
        dat = `
Please Select one of the demo chat Bots:
1. E Paper
2. PVT Election Bot
      `;
      thisRoom.counter = 0;
      thisRoom.isInit = true;
      thisRoom.nextMenu = false;
        break;

case 1:
  if(!thisRoom.nextMenu) {
  dat = `
  Welcome to Daily Nation E-Paper 
Please enter your Name:
( It is just a test version. 
Enter 1 instead of name)
  `; } else {
    dat = `
    Please enter polling station no:
    { Its a test version,
       Enter 1 instead of station no.
    }
    
    
    Press 0 to go to Main Menu.
  `;
  }
  break;

      case 2:

        if(!thisRoom.nextMenu) {
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
`; } else {
  dat = `
  Northmead Basic School polling
Please choose one of the option below:
{ Its a test version,
   only 1 number is working.
}
1) Presidential
2) MP
3) Mayor
4) councillor


Press 0 to go to Main Menu.
  `;
}
        break;
      case 3:
        if(!thisRoom.nextMenu) {
        dat = `
#Category#
We Welcome you to Daily Nation Family. 
Please tell us what are you looking for: 
1) Subscribe for Daily Newspaper 
2) Buy Archives
3) Get Credential for Website login
`; }   else {
  dat = `
          Please select political party:
{ Its a test version,
   only 1 number is working.
}
1) PF
2) UPND
3) DP
4) MMD
5) UNIP 
6) CDC


Press 0 to go to Main Menu.
          `
}
        break;
      case 4:
        if(!thisRoom.nextMenu) {
        dat = `#Subscribe for Daily Newspaper#
Please select the subscription duration:
1) 1 Day Subscription
2) 7 Days Subscription
3) 14 Days Subscription
4) 28 Days Subscription
5) 3 Months Subscription
6) 6 Months Subscription
7) 1 year Subscription`
        }  else {
          dat = `
          Please enter the Vote counts:
        { Its a test version,
           only 1 number is working.
        }
        
        
        Press 0 to go to Main Menu.
          `; 
        }
        break;
      case 5:
        if(!thisRoom.nextMenu) { 
        dat = `
#subscription pay#
You selected 1 Day Subscription.
Please go to the link below to pay K5. As soon as payment gets completed you will be redirected to your dashboard containing the Newspapers you have bought.

https://flutterwave.com/us/


Press 0 to go to Main Menu.
`; } else {
  dat = `
  #New Status#
Updated Total Vote Count in presidential election for the PF political party is : 101


Press 0 to go to the Main Menu
  `
}  
        break;

default: 
dat = `Please enter 0 to go to Main Menu`;
break;        
    }
    


     if ( (data.value == -1) && !thisRoom.isInit ) {
      dat = `
      Please type 0 or 1. This is just a test application
      `;
     }
     if ( ((data.value != 1) && (data.value != 0)) && !thisRoom.isInit) {
      dat = `
      Please type 0 or 1. This is just a test application
      `;
     }

     if ( (data.value == 2) && thisRoom.isInit && !thisRoom.nextMenu) {
      thisRoom.nextMenu = true
      dat = `
      Welcome to PVT 2021
Please choose one option below:
{ Its a test version,
   Enter 1 instead of station no.
}
1) Enter Result
2) Check Result
3) Upload image of the results
4) Send image of the QR code


Press 0 to go to Main Menu.
      `; 
      thisRoom.counter = 0;
    }


    console.log('counter ====', thisRoom.counter);
    data = Object.assign(data, { response: dat });

     
    //  if (data.value == 1) {
      
    //  }
  


      // if ( (thisRoom.cachedValues[thisRoom.cachedValues.length - 1] == -1) && (data.value == 2)) {
      //   dat = `weddqwfd`;
      // }
      console.log('lllll ====', thisRoom.nextMenu);


  
     io.sockets.in(thisRoom.roomname).emit('chat message', { data: data, id: socket.id });
         thisRoom.isInit = false;


  });
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    console.log(user);
    if (user) {
      console.log(user.username + ' has left');
    }
    console.log("disconnected");

  });
});



http.listen(process.env.PORT || 3000, function () { });

