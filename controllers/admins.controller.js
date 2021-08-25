const Admins = require("../models/Admin.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// GET all the administrators
const getAdmins = (req, res) => {
  Admins.find({}).exec((err, data) => {
    if (err) {
      return res.status(500).send({
        Message: "There was an error in the request",
      });
    }
    Admins.countDocuments({}, (err, total) => {
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

// POST, create an admin
const createAdmin = (req, res) => {
  const { user, password } = req.body;

  const admin = new Admins({
    user,
    password: bcrypt.hashSync(password, 10),
  });

  admin.save((err, data) => {
    if (err) res.status(500).send({ message: "Could not save the admin" });
    return res.status(201).send({ message: "Admin saved successfully", data });
  });
};

/*=============================================
PUT - edit an admin
=============================================*/

let editAdmin = (req, res) => {
  let { id } = req.params;

  let { user, password } = req.body;

  Admins.findById(id, (err, data) => {
    if (err) res.status(500).send({ message: "Server error" });

    if (!data) res.status(404).send({ message: "Could not find the id" });

    let pass = password;

    let validatePasswordChange = (password, pass) => {
      return new Promise((resolve, reject) => {
        if (password === undefined) {
          resolve(pass);
        } else {
          pass = bcrypt.hashSync(password, 10);

          resolve(pass);
        }
      });
    };

    let changeDBREgistry = (id, user, pass) => {
      return new Promise((resolve, reject) => {
        let adminInfo = {
          user,
          password: pass,
        };

        Admins.findByIdAndUpdate(
          id,
          adminInfo,
          { new: true, runValidators: true },
          (err, data) => {
            if (err) {
              let response = {
                res,
                err,
              };

              reject(response);
            }

            let response = {
              res,
              data,
            };

            resolve(response);
          }
        );
      });
    };

    const asyncCall = async (id, password, pass, user) => {
      try {
        pass = await validatePasswordChange(password, pass);

        let responseChangeDb = await changeDBREgistry(id, user, pass);

        return responseChangeDb.res.status(200).send({
          data: responseChangeDb.data,
          message: "The admin has been successfully updated",
        });
      } catch (response) {
        return response.res.status(400).send({
          message: response.message,
        });
      }
    };
    asyncCall(id, password, pass, user);
  });
};

// DELETE. delete a admin
const deleteAdmin = (req, res) => {
  const { id } = req.params;

  Admins.findByIdAndDelete(id, (err, adminInfo) => {
    if (err) res.status(500).send({ err });

    if (!adminInfo) res.status(404).send({ message: "Could not find id" });

    return res.status(200).send({
      message: "Admin deleted successfully",
    });
  });
};

// Login Function
const login = (req, res) => {
  const { user, password } = req.body;

  Admins.findOne({ user: user }, (err, data) => {
    if (err) res.status(500).send({ message: "Server Error", err });
    if (!data) {
      return res.status(404).send({
        message: "Could not find the provided id",
      });
    }
    if (!bcrypt.compareSync(password, data.password)) {
      return res.status(400).send({
        message: "Password does not match the one stored in the DB",
      });
    }
    const token = jwt.sign(
      {
        data,
      },
      process.env.SECRET,
      { expiresIn: process.env.EXPIRES }
    );

    return res.status(200).send({ token });
  });
};

module.exports = {
  getAdmins,
  createAdmin,
  editAdmin,
  deleteAdmin,
  login,
};
