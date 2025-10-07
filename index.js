import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL = "https://www.thecocktaildb.com/api/json/v1/1/";

const navList = [
  {
    name: "Category",
    url: API_URL + "list.php?c=list",
    list: [],
  },
  {
    name: "ALcoholic",
    url: API_URL + "list.php?a=list",
    list: [],
  },
  {
    name: "Glass",
    url: API_URL + "list.php?g=list",
    list: [],
  },
  {
    name: "Ingredients",
    url: API_URL + "list.php?i=list",
    list: [],
  },
];

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

await fetchNavList();

// Get a random drink
app.get("/", async (req, res) => {
  const url = API_URL + "random.php";
  await getDrink(req, res, url);
});

// Get a list of drinks based on category
app.get("/filter/:category/:value", async (req, res) => {
  const { category, value } = req.params;

  let url = API_URL + "filter.php?";

  switch (category) {
    case "Category":
      url += "c=" + value;
      break;
    case "ALcoholic":
      url += "a=" + value;
      break;
    case "Glass":
      url += "g=" + value;
      break;
    case "Ingredients":
      url += "i=" + value;
      break;
    default:
      throw new Error("Invalid category type");
  }

  await getDrinks(req, res, url);
});

// Get a drink by ID
app.get("/:drinkId", async (req, res) => {
  const { drinkId } = req.params;
  const url = API_URL + "lookup.php?i=" + drinkId;
  await getDrink(req, res, url); 
});

// Get a drink by name
app.post("/search", async(req, res) => {
  const searchName = req.body.name;
  const url = API_URL + "search.php?s=" + searchName;
  await getDrinks(req, res, url);
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

/********************/
// Helper Functions */
/********************/

async function fetchNavList() {
  try {
    for (const nav of navList) {
      const response = await axios.get(nav.url);
      const data = response.data.drinks;
      nav.list = data.map((item) => Object.values(item)[0]);
    }
  } catch (error) {
    console.error("Error: ", error.message);
  }
}

async function getDrink(req, res, url) {
  try {
    const response = await axios.get(url);
    const result = response.data.drinks;

    let ingredients = [];
    for (var index = 1; index <= 15; index++) {
      const ingredient = "strIngredient" + index;
      const measure = "strMeasure" + index;
      if (result[0][ingredient] != "" && result[0][ingredient] != null) {
        ingredients.push({
          i: result[0][ingredient],
          m: (result[0][measure] || "").trim(),
        });
      }
    }

    res.render("index.ejs", {
      drink: {
        thumb: result[0].strDrinkThumb,
        name: result[0].strDrink,
        category: result[0].strCategory,
        Alcoholic: result[0].strAlcoholic,
        glass: result[0].strGlass,
        instruction: result[0].strInstructions,
        ingredients,
      },
      navList,
    });
  } catch (error) {
    console.log(error.message);
    res.status(404);
  }
}

async function getDrinks(req, res, url) {
  try {
    const response = await axios.get(url);
    const result = response.data.drinks;
    if (result.length != 0 ) {
      res.render("index.ejs", { drinks: result, navList });
    } else {
      res.render("index.ejs", { navList });
    }
  } catch (error) {
    console.log(error.message);
    res.status(404);
  }
}