import fetch from "node-fetch";
import "dotenv/config";

export async function getMain(req, res, next) {
  res.end("Hello!");
}

export async function getNotFound(req, res, next) {
  res.status(404);
  res.end("The provided URL does not exist!");
}

export async function getFruits(req, res, next) {
  try {
    let fruitName = JSON.stringify(req.query.fruit);
    fruitName = fruitName.substring(1, fruitName.length - 1);
    const response = await fetch(
      `${process.env.FRUIT_URL}${fruitName || "all"}`
    );
    const data = await response.json();
    if (data.error) {
      res.end("Selected fruit does not exist");
      return;
    }
    res.json(data);
  } catch {
    res.status(400);
    res.end("A required parameter is missing!");
  }
}

export async function getGames(req, res, next) {
  let category = JSON.stringify(req.query.category);
  req.query.category == null
    ? (category = "")
    : (category = "?category=" + category.substring(1, category.length - 1));
  const response = await fetch(`${process.env.GAME_URL}${category}`);
  const data = await response.json();
  res.json(data);
}

export async function getRecipes(req, res, next) {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "Edamam-Account-User": process.env.FOOD_USER,
      "Accept-Language": "en",
    },
  };
  const key = "&app_key=" + process.env.FOOD_KEY;
  const id = "&app_id=" + process.env.FOOD_ID;
  const response = await fetch(`${process.env.FOOD_URL}${id}${key}`, options);
  const data = await response.json();
  if (data.status == "error") {
    res.status(401);
    res.end(
      "Unauthorized! Make sure you have the correct userID, appID, and appKey"
    );
  }
  res.json(data);
}

export async function getMix(req, res, next) {
  let result = [];
  const responseFood = await fetch(`${process.env.FRUIT_URL}banana`);
  const dataFood = await responseFood.json();
  result.push(dataFood);
  let category = "?category=shooter";
  const responseGames = await fetch(`${process.env.GAME_URL}${category}`);
  const dataGames = await responseGames.json();
  result.push(dataGames);
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "Edamam-Account-User": process.env.FOOD_USER,
      "Accept-Language": "en",
    },
  };
  const key = "&app_key=" + process.env.FOOD_KEY;
  const id = "&app_id=" + process.env.FOOD_ID;
  const response = await fetch(`${process.env.FOOD_URL}${id}${key}`, options);
  const data = await response.json();
  result.push(data);
  console.log(result);
  res.json(result);
}
