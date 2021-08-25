const fs = require("fs");
const Slide = require("../models/Slides.model");

// GET all the slides
const getSlides = (req, res) => {
  Slide.find({}).exec((err, data) => {
    if (err) {
      return res.status(500).send({
        Message: "There was an error in the request",
      });
    }

    Slide.countDocuments({}, (err, total) => {
      if (err) {
        return res.status(500).send({
          Message: "There was an error in the request",
        });
      }

      return res.status(200).send({
        total,
        data,
      });
    });
  });
};

// P O S T a slide
const createSlide = (req, res) => {
  let { title, description } = req.body;

  
  title =
    (typeof title === "string" && title.trim().length > 0) ||
    title instanceof String
      ? title.trim()
      : undefined;

  description =
    (typeof description === "string" && description.trim().length > 0) ||
    description instanceof String
      ? description.trim()
      : undefined;

  if (!req.files) res.status(500).send({ Message: "A file is mandatory" });
  let archive = req.files.archive;

  // Validating file extension
  if (archive.mimetype !== "image/jpeg" && archive.mimetype !== "image/png") {
    return res.status(400).send({
      Message: 'Image must be "jpeg" of "png" extension only',
    });
  }

  // Changing name to the file
  const name = Math.floor(Math.random() * 10000);

  const extension = archive.name.split(".").pop();

  archive.mv(`./archives/slide/${name}.${extension}`, (err) => {
    if (err) {
      return res.status(500).send({
        Message: "Could not save the image",
        err,
      });
    } else {
      const slide = new Slide({
        image: `${name}.${extension}`,
        title: title,
        description: description,
      });

      slide.save((err, data) => {
        if (err) res.status(500).send({ Message: "Could not save slide" });
        res.status(201).send({ data, Message: "Slide saved successfully" });
      });
    }
  });
};

// P U T a slide

const editSlide = (req, res) => {
  const { id } = req.params;

   let { title, description } = req.body;
  let body = req.body;
  title =
    (typeof title === "string" && title.trim().length > 0) ||
    title instanceof String
      ? title.trim()
      : undefined;

  description =
    (typeof description === "string" && description.trim().length > 0) ||
    description instanceof String
      ? description.trim()
      : undefined;

  
  Slide.findById(id, (err, data) => {
    if (err) {
      return res.status(500).send({
        message: "Server error",
      });
    }
    if (!data) {
      return res.status(404).send({
        message: "Could not find the image",
      });
    }
    let imageRoute = data.image;
    if (!req.files) {
      return res.status(400).send({
        message: "A file is mandatory",
      });
    }
    // 2.
    const validateArchiveChange = (req, imageRoute) => {
      return new Promise((resolve, reject) => {
        if (req.files) {
          const archive = req.files.archive;

          if (
            archive.mimetype !== "image/jpeg" &&
            archive.mimetype !== "image/png"
          ) {
            const response = {
              res,
              message: "The image must be eighter jpg or png extension",
            };
            reject(response);
          }
          const name = Math.floor(Math.random() * 10000);

          const extension = archive.name.split(".").pop();

          archive.mv(`./archives/slide/${name}.${extension}`, (err) => {
            if (err) {
              const response = {
                res,
                message: "Could not save the image",
              };
              reject(response);
            } else {
              if (fs.existsSync(`./archives/slide/${imageRoute}`)) {
                fs.unlinkSync(`./archives/slide/${imageRoute}`);
              }
              imageRoute = `${name}.${extension}`;
              resolve(imageRoute);
            }
          });
        } else {
          resolve(imageRoute);
        }
      });
    };

    // 3.
    const changeDBREgistry = (id, title, description, imageRoute) => {
      
      return new Promise((resolve, reject) => {
        const newData = {
          image: imageRoute,
          title,
          description,
        };

        Slide.findByIdAndUpdate(
          id,
          newData,
          { new: true, runValidators: true },
          (err, data) => {
            if (err) {
              const response = {
                res,
                err,
              };

              reject(response);
            } else {
              const response = {
                res,
                data,
              };
              return resolve(response);
            }
          }
        );
      });
    };
    // Sync
    const asyncCall = async (body, id, title, description, imageRoute) => {
      try {
        imageRoute = await validateArchiveChange(req, imageRoute);
        const responseChangeDb = await changeDBREgistry(
          id,
          title,
          description,
          imageRoute
        );

        return responseChangeDb.res.status(200).send({
          data: responseChangeDb.data,
          message: "The slide has been successfully updated",
        });
      } catch (response) {
        return response.res.status(400).send({
          message: response.message,
        });
      }
    };
    asyncCall(req, id, title, description, imageRoute);
  });
};

// D E L E T E a slide
const deleteSlide = (req, res) => {
  const { id } = req.params;

  Slide.findByIdAndDelete(id, (err, slideInfo) => {
    if (err) {
      return res.status(500).send({
        err,
      });
    }

    if (!slideInfo) {
      return res.status(404).send({
        message: "Could not found the specified id",
      });
    }
    if (fs.existsSync(`./archives/slide/${slideInfo.image}`)) {
      fs.unlinkSync(`./archives/slide/${slideInfo.image}`);
    }

    return res.status(200).send({
      message: "Slide deleted successfully",
    });
  });
};

module.exports = {
  getSlides,
  createSlide,
  editSlide,
  deleteSlide,
};
