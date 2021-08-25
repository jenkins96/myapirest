const { PromiseProvider } = require("mongoose");
const Galeries = require("../models/galeries.model");
const fs = require("fs");

// GET all the galeries
let getGaleries = (req, res) => {
  Galeries.find({}).exec((err, data) => {
    if (err) {
      return res.status(500).send({
        Message: "There was an error in the request",
      });
    }
    Galeries.countDocuments({}, (err, total) => {
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

// P O S T a galery
const createGalery = (req, res) => {
  // Does it has a file attached ?
  if (!req.files) res.status(500).send({ message: "A file is mandatory" });
  let archive = req.files.archive;

  // Now that it has a file attached to it, let's validate the extension
  if (archive.mimetype !== "image/jpeg" && archive.mimetype !== "image/png") {
    return res
      .status(400)
      .send({ message: 'Image must be "jpeg" or "png" extension only' });
  }

  // We verified the extension, now it is time to rename it
  const name = Math.floor(Math.random() * 10000);
  const extension = archive.name.split(".").pop();

  // Moving file to our directory
  archive.mv(`./archives/galery/${name}.${extension}`, (err) => {
    if (err) res.status(500).send({ message: "Could not save the image", err });
    const galery = new Galeries({
      photo: `${name}.${extension}`,
    });
    galery.save((err, data) => {
      if (err) res.status(500).send({ message: "Could not save the galery" });
      return res
        .status(201)
        .send({ message: "Galery saved successfully", data });
    });
  });
};

// P U T a Galery
let editGalery = (req, res) => {
  const { id } = req.params;

  // Does it has a file attached ?
  if (!req.files) res.status(500).send({ message: "A file is mandatory" });

  Galeries.findById(id, (err, data) => {
    if (err) res.status(500).send({ message: "Server error" });
    if (!data)
      res.status(404).send({ message: "Could not find the specified id" });

    // Saving result from DB
    let photo = data.photo;

    // Validate the archive change
    const validateArchiveChange = (req, photo) => {
      return new Promise((resolve, reject) => {
        if (req.files) {
          let archive = req.files.archive;

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
          // We verified the extension, now it is time to rename it

          const name = Math.floor(Math.random() * 10000);
          const extension = archive.name.split(".").pop();

          archive.mv(`./archives/galery/${name}.${extension}`, (err) => {
            if (err) {
              const response = {
                res,
                message: "Could not save the image",
              };
              reject(response);
            } else {
              // ELIMINAR FILE ANTERIOR
              if (fs.existsSync(`./archives/galery/${photo}`)) {
                fs.unlinkSync(`./archives/galery/${photo}`);
              }
              photo = `${name}.${extension}`;
              resolve(photo);
            }
          });
        } else {
          resolve(photo);
        }
      });
    };
    // 3. Change the registry in the DB
    let changeDBREgistry = (id, photo) => {
      return new Promise((resolve, reject) => {
        let newData = {
          photo,
        };

        Galeries.findByIdAndUpdate(
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
              resolve(response);
            }
          }
        );
      });
    };
    // Sync
    const asyncCall = async (req, photo, id) => {
      try {
        photo = await validateArchiveChange(req, photo);
        let responseChangeDb = await changeDBREgistry(id, photo);

        return responseChangeDb.res.status(200).send({
          data: responseChangeDb.data,
          message: "The galery has been successfully updated",
        });
      } catch (response) {
        return response.res.status(400).send({
          message: response.message,
        });
      }
    };
    asyncCall(req, photo, id);
  });
};

// D E L E T E a galery
let deleteGalery = (req, res) => {
  const { id } = req.params;

  Galeries.findByIdAndDelete(id, (err, galeryInfo) => {
    if (err) res.status(500).send({ err });

    if (!galeryInfo) res.status(404).send({ message: "Could not find id" });

    if (fs.existsSync(`./archives/galery/${galeryInfo.photo}`)) {
      fs.unlinkSync(`./archives/galery/${galeryInfo.photo}`);
    }

    return res.status(200).send({
      message: "Galery deleted successfully",
    });
  });
};

module.exports = {
  getGaleries,
  createGalery,
  editGalery,
  deleteGalery,
};
