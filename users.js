let users = [];
function joinUser(socketId , userName, roomName, value, counter, isInit) {
const user = {
  socketID :  socketId,
  username : userName,
  roomname : roomName,
  value: value,
  counter: counter,
  isInit: isInit
}
  users.push(user)
return user;
}
function findUser(id) {
  return users.find((user)=>{
    user.socketID == id;
  })
}
function removeUser(id) {
  const getID = users => users.socketID === id;
 const index =  users.findIndex(getID);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

function getUsers() {
  return users; 
}

module.exports ={ joinUser, removeUser,findUser,getUsers}