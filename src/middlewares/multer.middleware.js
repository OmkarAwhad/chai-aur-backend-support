const multer = require('multer')

const storage = multer.diskStorage({
     destination: function (req, file, cb) {
          return cb(null,'./public/temp')
          // console.log("Destination")
     },
     
     filename: function (req, file, cb) {
          return cb(null, file.originalname)
          // console.log("Filename"); 
     }
})

const upload = multer({ storage })

module.exports = {upload};