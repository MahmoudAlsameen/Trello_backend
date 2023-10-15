import mongoose from 'mongoose';
import 'dotenv/config'



const connection = () => {
    mongoose.connect(`mongodb+srv://${process.env.DB_UserName}:${process.env.DB_Password}@cluster95596.pbabicr.mongodb.net/`)
        .then(() => console.log("DB connected"))
        .catch((err) => console.log(`DB error ${err}`))
}


export default connection
