const { end } = require("./../../db/db");
const connection = require("./../../db/db");

const createNewGym = (req, res) => {
  const {
    name,
    phoneNumber,
    location,
    image,
    priceMonthly,
    description
  } = req.body;
  const gymQuery = `INSERT INTO gym  ( name, phoneNumber, location ,image , priceMonthly,description) VALUES (?,?,?,?,?,?)`;
  const data = [
    name,
    phoneNumber,
    location,
    image,
    priceMonthly,
    description
    ];
  connection.query(gymQuery, data, (err, result) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: `Server Error`,
        error: err,
      });
    }
   return res.status(201).json({
      success: true,
      message: "Success new gym Added ",
      result: result,
    });
  });
};

const updateGymById = (req, res) => {
  const id = req.params.id;

  const { name, phoneNumber, location, image, priceMonthly, description } =
    req.body;
  const gymQuery = `UPDATE gym SET name="${name}", phoneNumber="${phoneNumber}" , location="${location}" ,image="${image}" ,priceMonthly="${priceMonthly}" ,description="${description}"  WHERE id = ${id}`;

  connection.query(gymQuery, (error, result, fields) => {
    if (error) {
      console.log(error.response);
      return;
    }
    res.status(200).json({
      success: true,
      message: "Success updated Gym by the id ",
      result: result,
    });
  });
};

const deleteGymById = (req, res) => {
  id = req.params.id;

  const gymQuery = `UPDATE gym SET is_delete="1"  WHERE id = ${id}`;
  connection.query(gymQuery, (error, result, fields) => {
    if (error) {
      console.log(error.response);
      return;
    }
   return res.status(200).json({
      success: true,
      message: "Success deleted Gym by the id ",
      result: result,
    });
  });
};

const getAllGyms = (req, res) => {
  const query = `SELECT * FROM gym WHERE is_delete=0 `;
  connection.query(query, (error, result) => {
    if (error) {
     return res.status(500).json({
        success: false,
        message: `Server Error`,
        error: error,
      }).end();
    }
    return res.status(200).json({
      success: true,
      message: "all  gyms in your website ",
      result: result,
    }).end();
    
  });
};
module.exports = { createNewGym, updateGymById, deleteGymById, getAllGyms };

