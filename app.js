require ('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override')
const cookieParser = require ('cookie-parser');
const mongoStore =  require ('connect-mongo');
const connectDB = require('./server/config/db.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash'); 
const Chat = require('./server/models/Chat.js')


const path = require('path');
const { Socket } = require('socket.io');

     
const app = express();     
const PORT = 3000;
       
  
//connect to database 
connectDB(); 
 
app.use(express.urlencoded({extended:true})) 
app.use(express.json());
app.use(cookieParser()) 
// app.use(methodOverride('_method'))
 
// app.use(session({
//     secret : 'keybord cat',
//     resave: false,
//     saveUninitialized: true,
//     store:MongoStore.create({
//         mongoUrl:process.env.MONGODB_URL
//     }),
      
// }));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }  // set to true if using HTTPS
}));

app.use(express.static('public'));


//template engine
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');


app.use('/', require('./server/routers/admin'));
app.use('/', require('./server/routers/users'));
app.use('/', require('./server/routers/messenger'));

app.use((req, res, next) => {
    res.status(404).send('404: Page Not Found'); 
  });

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
const io = require ('socket.io')(server)

let users = {

};

io.on('connection',(socket)=>{
  console.log('socket connected');
  
  socket.on('register', (username) => {
    
    users[username] = socket.id;
  
});
  
socket.on('private_message',async (data) => {
  const { to, message, sender } = data;
  const toSocketId = users[to]; 
  const chatMessage = new Chat ({message,sender,receiver:to})
  await chatMessage.save()

  if (toSocketId) {
      // Emit the message to the recipient
      io.to(toSocketId).emit('private_message', {
          from: socket.id,
          message,
      });
  } else { 
      // If the user doesn't exist
      console.log("not online")
      socket.emit('error', `User ${to} is not online`);
  }
});

  // socket.on('disconnect',()=>{
  //   console.log('socket disconnected');
    
  
  // })
  
})

