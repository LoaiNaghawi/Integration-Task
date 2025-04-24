import fetch from "node-fetch";
import "dotenv/config";
import NodeCache from "node-cache";
const myCache = new NodeCache();

export async function getMain(req, res, next) {
  res.end("Hello!");
}

export async function getNotFound(req, res, next) {
  res.status(404);
  res.end("The provided URL does not exist!");
}

export async function getFruits(req, res, next) {
  try {
    let data;
    let fruitName = JSON.stringify(req.query.fruit);
    fruitName = fruitName.substring(1, fruitName.length - 1);
    let inCache = myCache.has(fruitName || "all");
    if (!inCache) {
      const response = await fetch(
        `${process.env.FRUIT_URL}${fruitName || "all"}`
      );
      data = await response.json();
      myCache.set(fruitName || "all", data, 300);
      if (data.error) {
        res.end("Selected fruit does not exist");
        return;
      }
    } else {
      data = myCache.get(fruitName || "all");
    }
    console.log(inCache);
    res.json(data);
  } catch {
    res.status(400);
    res.end("A required parameter is missing!");
  }
}

export async function getGames(req, res, next) {
  let category = JSON.stringify(req.query.category);
  let data;
  let cachedCategory = category;
  let inCache = myCache.has(cachedCategory || "all");
  if (!inCache) {
    req.query.category == null
      ? (category = "")
      : (category = "?category=" + category.substring(1, category.length - 1));
    const response = await fetch(`${process.env.GAME_URL}${category}`);
    data = await response.json();
    console.log(cachedCategory);
    myCache.set(cachedCategory || "all", data);
  } else {
    data = myCache.get(cachedCategory || "all");
  }
  console.log(inCache);
  res.json(data);
}

export async function getRecipes(req, res, next) {
  let data;
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
  let inCache = myCache.has("Recipe");
  if (!inCache) {
    const response = await fetch(`${process.env.FOOD_URL}${id}${key}`, options);
    data = await response.json();

    if (data.status == "error") {
      res.status(401);
      res.end(
        "Unauthorized! Make sure you have the correct userID, appID, and appKey"
      );
    }
    myCache.set("Recipe", data);
  } else {
    data = myCache.get("Recipe");
  }
  console.log(inCache);
  res.json(data);
}

export async function getMix(req, res, next) {
  let result = [];
  let dataFood;
  let dataGames;
  let dataRecipe;
  let foodCache = myCache.has("banana");
  let gameCache = myCache.has(`"shooter"`);
  let recipeCache = myCache.has("Recipe");
  if (!foodCache) {
    const responseFood = await fetch(`${process.env.FRUIT_URL}banana`);
    dataFood = await responseFood.json();
    myCache.set("banana", dataFood);
  } else dataFood = myCache.get("banana");
  result.push(dataFood);
  if (!gameCache) {
    let category = "?category=shooter";
    const responseGames = await fetch(`${process.env.GAME_URL}${category}`);
    dataGames = await responseGames.json();
    myCache.set("shooter", dataGames);
  } else {
    dataGames = myCache.get("shooter");
  }
  result.push(dataGames);
  if (!recipeCache) {
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
    dataRecipe = await response.json();
    myCache.set("Recipe", dataRecipe);
  } else {
    dataRecipe = myCache.get("Recipe");
  }
  result.push(dataRecipe);
  console.log(
    `Food Cache: ${foodCache},   Games Cache: ${gameCache},   Recipe Cache: ${recipeCache}`
  );
  res.json(result);
}
