const jwt=require("jsonwebtoken")
const jwtSecret = process.env.JWT_SECRET;
const User=require("../models/User")

const authMiddleWare = (req, res, next) =>{
  
    try{
        const token = req.cookies.token;
        
        if (!token){
            return res.redirect('/signIn');
            // return res.status(401).json({message:'unauthorized'})
        }
        const decoded = jwt.verify(token,jwtSecret);
        req.userId = decoded.userId ;
        req.username = decoded.username ;
        next()
    }catch(error){
        res.status(401).json({message:'unauthorized'})
    }
}


const adminOnly= async(req,res,next)=>{
    const userId= req.userId
    const user=await User.findById(userId)
    
  
       try {
        if(user.role=="admin"){
              next()

        }
        else{
            
            res.status(403).render('error',{errorMessage: 'Access denied: Only Admin can access this resource'})
        }
        
       } catch (error) {
        
        res.status(404).send('404: Page Not Found'); 
       }


}

const userOnly = async (req, res, next) => {
    try {
        const userId = req.userId
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send('User not found');
        }

        if (user.role === "user") {
            next();
        } else {
            res.status(403).render('error',{errorMessage: 'Access denied: Only Admin can access this resource'})

        }

    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
};




module.exports={authMiddleWare,adminOnly, userOnly} 