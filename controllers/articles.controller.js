const Articles = require('../models/Articles.model');
const fs = require('fs');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');


// GET all the articles
let getArticles = (req, res) => {

  Articles.find({}).exec( (err, data) => {
    if( err ){
      return res.status(500).send({
        Message: "There was an error in the request"
      })
    }
    Articles.countDocuments({}, (err, total) => {

      if( err ){
        return res.status(500).send({
          Message: "There was an error in the request"
        })
      }
      return res.status(200).send({
        total,
        data
      })
    })
      
    
  })
};

// Post - create an article
const createArticle = (req,res) => {

  if(!req.files) res.status(400).send({message:'A file is mandatory'});
  let archive = req.files.archive;
  let {title, intro, url, content} = req.body;

  // Sanity check
  //cover = typeof(cover) === "string" && cover.trim().length > 0 ? cover.trim() : undefined;
  title = typeof(title) === "string" && title.trim().length > 0 ? title.trim() : undefined;
  intro = typeof(intro) === "string" && intro.trim().length > 0 ? intro.trim() : undefined;
  url = typeof(url) === "string" && url.trim().length > 0 ? url.trim() : undefined;
  content = typeof(content) === "string" && content.trim().length > 0 ? content.trim() : undefined;
 
   // All are required to proceed
   if( !title || !intro || !url || !content){
    
    return res.status(400).send({
      message: "All fields are required"
    });
   } else{
    // Now that it has a file attached to it, let's validate the extension
  if (archive.mimetype !== "image/jpeg" && archive.mimetype !== "image/png") {
    return res
      .status(400)
      .send({ message: 'Image must be "jpeg" or "png" extension only' });
  }

  // We verified the extension, now it is time to rename it
  // Should I do sanity check here?
  const name = Math.floor(Math.random() * 10000);
  const extension = archive.name.split(".").pop();

  const directoryCreation = mkdirp.sync(`./archives/articles/${url}`);
  archive.mv(`./archives/articles/${url}/${name}.${extension}`, err => {

    if (err) res.status(500).send({ message: "Could not save the image", err });

    const article = new Articles({
      cover:`${name}.${extension}`,
      title,
      intro,
      url,
      content
    });

    article.save((err, data) => {
      if (err) res.status(500).send({ message: "Could not save the article" });

      return(res.status(201).send({ message: "Article saved successfully", data }));
    });
  })
   }
 
};

// Edit an article

const editArticle = (req, res) => {

  const { id } = req.params;

  // Does it has a file attached ?
  if(!req.files) res.status(500).send({message:'A file is mandatory'});
  //let archive = req.files.archive;
  let {title, intro, url, content} = req.body;
  // Sanity check
  title = typeof(title) === "string" && title.trim().length > 0 ? title.trim() : undefined;
  intro = typeof(intro) === "string" && intro.trim().length > 0 ? intro.trim() : undefined;
  url = typeof(url) === "string" && url.trim().length > 0 ? url.trim() : undefined;
  content = typeof(content) === "string" && content.trim().length > 0 ? content.trim() : undefined;

  Articles.findById(id, (err, data) => {

    if (err) res.status(500).send({ message: "Server error" });
    if (!data)res.status(404).send({message:"Could not find the specified id"});

    // Result from DB
    cover = data.cover;
    //title = data.title;
    //intro = data.intro;
    //url = data.url;
    //content = data.content;

    const validateArchiveChange = (req, cover) => {

      return new Promise((resolve, reject) => {

        if (req.files) {
          
          let archive = req.files.archive;

          if (archive.mimetype !== "image/jpeg" && archive.mimetype !== "image/png") {
            const response = {
              res,
              message: "The image must be eighter jpg or png extension",
            };
            reject(response);
          }
          // We verified the extension, now it is time to rename it
          // Should I do sanity check here?
          const name = Math.floor(Math.random() * 10000);
          const extension = archive.name.split(".").pop();
          const directoryCreation = mkdirp.sync(`./archives/articles/${url}`)
          archive.mv(`./archives/articles/${url}/${name}.${extension}`, err => {

            if(err){
              const response = {
                res,
                message: 'Could not save the image'
              };
              reject(response);
            } else{
              // ELIMINAR FILE ANTERIOR
              if(fs.existsSync(`./archives/articles/${url}/${cover}`)){

                fs.unlinkSync(`./archives/articles/${url}/${cover}`);
              }
              //cover = `${name}.${extension}`;
              //let myData = {
                //cover: `${name}.${extension}`,
                //title: req.body.title,
                //intro: req.body.intro,
                //url:req.body.url,
                //content: req.body.content
              //}
              cover = `${name}.${extension}`
              resolve(cover);

            }
          });
        } else{
          resolve(cover);
        }
      });
    };
    // DB change
    let changeDBREgistry = (id, cover, title, intro, url, content) => {

      return new Promise((resolve,reject) => {

        let newData = {
          cover,
          title,
          intro,
          url,
          content
        }
       
      
        Articles.findByIdAndUpdate(id, newData, {new:true, runValidators:true}, (err, data) => {
          
          if(err){
            const response = {
              res,
              err
            };
            reject(response);
          } else{
            const response = {
              res,
              data
            };
            resolve(response);
          }
        })
      });
    };
    // Sincronizar
    const asyncCall = async (req,id, cover, title, intro, url, content ) => {
      
      try{

      cover = await validateArchiveChange(req, cover);
     
      
    
      let responseChangeDb = await changeDBREgistry(id, cover, title, intro, url, content);
     
    
      return responseChangeDb.res.status(200).send({
        data:responseChangeDb.data,
        message: 'The article has been successfully updated'
      });
      } catch (response){
        
        return response.res.status(400).send({
          message: response.message
        });
        
      }
      
       
    };
    asyncCall(req,id, cover,title,intro,url,content);
  })


};
  
  
// D E L E T E - an article
const deleteArticle = (req, res) => {
  const {id} = req.params;
 

  Articles.findByIdAndDelete(id, (err, articleInfo) => {

    if(err) res.status(500).send({err});
    

    if(!articleInfo)res.status(404).send({message:'Could not find id'});

    const directoryRoute = `./archives/articles/${articleInfo.url}`
    rimraf.sync(directoryRoute);

    return res.status(200).send({
      message: 'Article deleted successfully'
    });
  })
};




module.exports = {
  getArticles,
  createArticle,
  editArticle,
  deleteArticle
};

