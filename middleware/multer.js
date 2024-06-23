const multer = require('multer')

const storage = multer.diskStorage({
   destination: function(req,file,cb){
    	cd(null,'/tmp/my-uploads')
},
  filename: function(req,file,cb){
	(null,file.originalname)
}
}) 

// export const upload = multer({storage:storage}) in commmonjs
const upload = multer({ storage: storage });

module.exports = { upload };