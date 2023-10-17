import userModel from '../db/models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';


const signup = async (req, res) => {
  let { token } = req.headers;
  if (token) {
    let decoded = jwt.verify(token, 'bl7 5ales');
    if (decoded) {
      res
        .status(401)
        .json({ message: "You're already signed in, please logout first" });
    }
  } else {
    const email = req.body.email;
    const isFound = await userModel.findOne({ email: email });
    if (isFound) {
      console.log('User is already registered');
      res.status(409).json({ message: 'User is already registered' });
    } else {
      let hashedPassword = bcrypt.hashSync(req.body.password, 4);
      let addedUser = await userModel.insertMany({
        ...req.body,
        password: hashedPassword,
      });
      console.log('added successfully', addedUser);
      res.status(201).json({ message: 'added successfully', addedUser });
    }
  }
};

const login = async (req, res) => {
  try {
    if(req.headers.token){
      let userID = await jwt.verify(req.headers.token, 'bl7 5ales').id;
    console.log('user identified', userID);

    if (userID) {
      //check if token has user id
      let targetedUserID = await userModel.findById(userID);
      if (targetedUserID && targetedUserID.isLogout==false) {
        // check if the user id matches database
        targetedUserID.isLogout=false
        await userModel.findOneAndUpdate({ _id: userID },targetedUserID,{ new: true });
        console.log('found userid is: ', targetedUserID);
        console.log('user already logged in');
        res.status(200).json({ message: 'user already logged in' });
      }
    }
    else{

      console.log('no token')

      let foundedUser = await userModel.findOne({ email: req.body.email });
      if (foundedUser) {
        console.log(foundedUser.password, req.body.password);
        let matched = bcrypt.compareSync(
          req.body.password,
          foundedUser.password
        );
        if (matched) {
          let token = jwt.sign({ id: foundedUser.id }, 'bl7 5ales');
          await userModel.findOneAndUpdate({ _id: foundedUser.id },{isLogout:false},{ new: true });
          console.log('logged in successfully', token);
          res.status(200).json({ message: 'logged in successfully', token });
        } else {
          console.log('password not correct');
          res.status(200).json({ message: 'password not correct' });
        }
      } else {
        console.log('User not found, You have to register first');
        res
          .status(404)
          .json({ message: 'User not found, You have to register first' });
      }
    }
  }else {
        let foundedUser = await userModel.findOne({ email: req.body.email });
        if (foundedUser) {
          console.log(foundedUser.password, req.body.password);
          let matched = bcrypt.compareSync(
            req.body.password,
            foundedUser.password
          );
          if (matched) {
            let token = jwt.sign({ id: foundedUser.id }, 'bl7 5ales');
            await userModel.findOneAndUpdate({ _id: foundedUser.id },{isLogout:false},{ new: true });
            console.log('logged in successfully', token);
            res.status(200).json({ message: 'logged in successfully', token });
          } else {
            console.log('password not correct');
            res.status(200).json({ message: 'password not correct' });
          }
        } else {
          console.log('User not found, You have to register first');
          res
            .status(404)
            .json({ message: 'User not found, You have to register first' });
        }
      }
    } catch (err) {
    console.log('error logging in', err);
    res.status(401).json({ message: 'error logging in', err });
  }
};

const updateuser = async (req, res) => {
  try {
    if (req.headers.token) {
    let userID = await jwt.verify(req.headers.token, 'bl7 5ales').id;
    console.log('user identified', userID);
   
      let targetedUserID = await userModel.findById(userID);

      let {
        userName = targetedUserID.userName,
        fName = targetedUserID.fName,
        lName = targetedUserID.lName,
        email = targetedUserID.email,
        gender = targetedUserID.gender,
        phone = targetedUserID.phone,
      } = req.body;

      targetedUserID.userName = userName;
      targetedUserID.fName = fName;
      targetedUserID.lName = lName;
      targetedUserID.email = email;
      targetedUserID.gender = gender;
      targetedUserID.phone = phone;
      await userModel.findOneAndUpdate({ _id: userID },targetedUserID,{ new: true });
      console.log('user updated', targetedUserID);
      res.status(200).json({ message: 'user updated', targetedUserID });
    }else {
      console.log('user is not logged in');

      res.status(401).json({ message: 'user is not logged in' });
    }
  } catch (err) {
    console.log('error while updating', err);
    res.status(401).json({ message: 'error while updating', err });
  }
};

const hdeleteuser = async (req, res) => {
  try {
    if (req.headers.token) {
    let userID = await jwt.verify(req.headers.token, 'bl7 5ales').id;
    console.log('user identified', userID);

    
      let targetedUserID = await userModel.findById(userID);
      if (targetedUserID) {
        console.log('found userid is: ', targetedUserID);
        await userModel.deleteOne(targetedUserID);
        console.log('user hard deleted');
        res.status(200).json({ message: 'user hard deleted' });
      } else {
        console.log('user was already deleted');
        res.status(200).json({ message: 'user was already deleted' });
      }
    } else {
      console.log('user is not logged in');

      res.status(401).json({ message: 'user is not logged in' });
    }
  } catch (err) {
    console.log('error hard deleting user', err);
    res.status(401).json({ message: 'error hard deleting user', err });
  }
};

const sdeleteuser = async (req, res) => {
  try {
    let userID = await jwt.verify(req.headers.token, 'bl7 5ales').id;
    console.log('user identified', userID);

    if (userID) {
      console.log('found userid is: ', targetedUserID);
      let targetedUserID = await userModel.findById(userID);
      if (targetedUserID) {
        console.log('user soft deleted');
        res.status(200).json({ message: 'user soft deleted' });
        if (targetedUserID.isDeleted == true) {
          console.log('user was already soft deleted');
          res.status(200).json({ message: 'user was already soft deleted' });
        } else {
          targetedUserID.isDeleted = true;
        }
      } else {
      }
    } else {
      console.log('user is not logged in');

      res.status(401).json({ message: 'user is not logged in' });
    }
  } catch (err) {
    console.log('error soft deleting user');
    res.status(401).json({ message: 'error soft deleting user', err });
  }
};

const logout = async (req, res) => {

  try {
    if (req.headers.token) {
    let userID = await jwt.verify(req.headers.token, 'bl7 5ales').id;
    console.log('user identified', userID);
   
      let targetedUserID = await userModel.findById(userID);
      targetedUserID.isLogout=true

      await userModel.findOneAndUpdate({ _id: userID },targetedUserID,{ new: true });
      console.log('user updated', targetedUserID);
      res.status(200).json({ message: 'logged out', targetedUserID });
    }else {
        console.log('user is not logged in');
  
        res.status(401).json({ message: 'user is not logged in' });
      }
    
  } catch (err) {
    console.log('error while updating', err);
    res.status(401).json({ message: 'error while updating', err });
  }


};

const loginGoogle = async (req, res) => {
  try {
      if(req.body.sub){

        let userSub= req.body.sub
        let targetedUserSub = await userModel.findById(userSub);
        if (targetedUserSub && targetedUserSub.isLogout==false) {
          // check if the user id matches database
          targetedUserSub.isLogout=false
          await userModel.findOneAndUpdate({ _id: userSub },targetedUserSub,{ new: true });
          console.log('found userSub is: ', targetedUserSub);
          console.log('user already logged in');
          res.status(200).json({ message: 'user already logged in' });
        }else{
          console.log('no token from loginGoogle ')
          let token = jwt.sign({ id: targetedUserSub.sub }, 'bl7 5ales');
          await userModel.findOneAndUpdate({ _id: targetedUserSub.sub },{isLogout:false},{ new: true });
          console.log('logged in successfully', token);
          res.status(200).json({ message: 'logged in successfully', token })

        }
      }else{
        //signup with google

        const email = req.body.email;
    
        const userSub = req.body.sub
        const fName = req.body.fName
        const lName = req.body.lName
        const userName = email
        const password="dummy password"
        const isVerified=true
        const isDeleted=false
        const userID=userSub
        const ObjectId = mongoose.Types.ObjectId;
        const userIDObjectId = new ObjectId(userID);

      let addedUser = await userModel.insertMany({
        _id:userIDObjectId,email,sub:userSub,fName,lName,userName,password,isVerified,isDeleted
        });
      console.log('added successfully', addedUser);

      let token = jwt.sign({ id: foundedUser.sub }, 'bl7 5ales');
      await userModel.findOneAndUpdate({ sub: foundedUser.sub },{isLogout:false},{ new: true });
      console.log('logged in successfully', token);
      res.status(200).json({ message: 'logged in successfully', token })


      
    }
      
      
    } catch (err) {
    console.log('error logging in with Google', err);
    res.status(401).json({ message: 'error logging in with Google', err });
  }
};







export { signup, login,loginGoogle, updateuser, hdeleteuser, sdeleteuser, logout };
