const User = require('../models/User');
const otpLayout = '../views/layouts/otp';
const messLayout = '../views/layouts/messenger';
const Chat = require('../models/Chat');
 
 
 

const getmessenger=  async (req, res) => {
    try {
        const userId = req.userId
        const data = await User.find({ _id: { $ne: userId } }).sort({username:1});
        const mydata = await User.find({ _id: { $eq: userId } });
        const admin = await User.find({ role:{$eq: 'admin'} });
        
      
        
        res.render('users/messenger',{mydata: mydata,user:data,layout: messLayout,admin});
        

    } catch (error) {
        return res.status(400).render('error',{errorMessage:"Server Error"})
    }
}



const chat = async (req, res) => {

    try{
        let id = req.params.id;
        const user=await User.findById(id)
        
        const logedinUser = await User.findById(req.userId)
        res.render('chat',{user:user,logedinUser:logedinUser.username,layout: otpLayout});

       
    }catch(error){
        return res.status(400).render('error',{errorMessage:"Server Error"})
    }
    
}
const messages = async (req,res)=>{
    const { receiver ,logedinUser} = req.params;
    
    try {
        const message = await Chat.find({$or:[
            {sender:logedinUser,receiver:receiver},
            {sender:receiver,receiver:logedinUser}
        ]}).sort({createdAt:1});
        res.json(message)
    } catch (error) {
        return res.status(400).render('error',{errorMessage:"Server Error"})

    }
}




module.exports = {
    getmessenger,
    chat,
    messages,
}