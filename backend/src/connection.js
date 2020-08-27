const mongoose = require("mongoose");
const { mongo } = require("mongoose");
const uri = 'mongodb://localhost:27017/memerezco10';

mongoose.connect(uri,{
    useNewUrlParser:true,
    useUnifiedTopology: true,
    useCreateIndex:true
})
.catch(err=> console.log(err))

//cuando se inicia la coneccion
mongoose.connection.on('open',_ =>{  
 console.log('database is conected to',uri );
})

//db,once solo una sola vez
mongoose.connection.on('err',err=>{  
    console.log(err);
   })
