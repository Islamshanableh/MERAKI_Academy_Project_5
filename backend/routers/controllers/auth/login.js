const connection = require("../../../db/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { OAuth2Client } = require("google-auth-library");

const clientId = new OAuth2Client(
  "707788443358-u05p46nssla3l8tmn58tpo9r5sommgks.apps.googleusercontent.com"
);
const login = (req, res) => {
  const password = req.body.password;
  const email = req.body.email.toLowerCase();
  const query = `SELECT * FROM users WHERE email ='${email}'`;
  connection.query(query, async (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: `Server Error`,
        error: err,
      });
    }
    if (!result.length) {
      return res.status(404).json({
        success: false,
        message: `The email doesn't exist`,
      });
    }
    try {
      const valid = await bcrypt.compare(password, result[0].password);
      if (!valid) {
        return res.status(403).json({
          success: false,
          message: `The password you’ve entered is incorrect`,
        });
      }
      const payload = {
        userId: result[0].id,
        role: result[0].role,
      };

      const options = {
        expiresIn: "600h",
      };

      const token = await jwt.sign(payload, process.env.SECRET, options);
      res.status(200).json({
        success: true,
        message: `Email and Password are correct`,
        token: token,
      });
    } catch (error) {
      throw new Error(error.message);
    }
  });
};

const loginGoogle = async (req, res) => {
  const tokenId = req.body.tokenId;
  clientId
    .verifyIdToken({
      idToken: tokenId,
      audience:
        "707788443358-u05p46nssla3l8tmn58tpo9r5sommgks.apps.googleusercontent.com",
    })
    .then((response) => {
      const { email_verified, given_name, family_name, email } =
        response.payload;
      if (email_verified) {
        const query = `SELECT * FROM users WHERE users.email=?`;
        data = [email];
        connection.query(query, data, async (err, result) => {
          if (result.length) {
            try {
              const valid = await bcrypt.compare(
                email + "123",
                result[0].password
              );

              if (!valid) {
                return res.status(403).json({
                  success: false,
                  message: "The password you’ve entered is incorrect",
                });
              }
              const payload = {
                userId: result[0].id,
                role: result[0].role,
              };

              const options = {
                expiresIn: "7d",
              };
              const token = jwt.sign(payload, process.env.SECRET, options);
              return res.status(200).json({
                success: true,
                message: "Email and Password are correct",
                token: token,
              });
            } catch (error) {
              throw new Error(error.message);
            }
          } else {
            let password = email + "123";
            const bcryptPassword = await bcrypt.hash(password, 10);
            const query = `INSERT INTO users (firstName,lastName,email,password) VALUES(?,?,?,?)`;
            data = [given_name, family_name, email, bcryptPassword];
            connection.query(query, data, (err, result) => {
              if (result) {
                res.status(201).json({
                  success: true,
                  message: `Create user successful`,
                  result: result,
                });
              } else {
                res.status(500).json({
                  success: false,
                  message: `Server Error`,
                  err: err,
                });
              }
            });
          }
        });
      }
    });
};

module.exports = {
  login,
  loginGoogle,
};
