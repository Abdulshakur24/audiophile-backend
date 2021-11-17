const auth = require("../authentication/auth");
const pool = require("../database/db");
const jwt = require("jsonwebtoken");

const historyRoute = require("express").Router();

historyRoute.get("/all", auth, async (req, res) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    const userId = jwt.verify(token, process.env.SECRET_TOKEN_KEY).id;

    await pool
      .query(
        "SELECT stripe_id, date_purchase, status FROM history_purchase WHERE user_id=$1",
        [userId]
      )
      .then((response) => {
        res.send(response.rows);
      });
  } catch (error) {
    throw new Error(error);
  }
});

historyRoute.get("/by-id/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    await pool
      .query(
        "SELECT product_name, product_quantity, product_price, product_image FROM history_product WHERE product_id=$1",
        [id]
      )
      .then((response) => {
        if (response.command === "SELECT") return res.send(response.rows);
        res.sendStatus(404);
      });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = historyRoute;