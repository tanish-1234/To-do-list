import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const db = new pg.Client({
user:"postgres",
host:"localhost",
database:"items",
password:"qwertyuiop",
port:"5432"
});

const app = express();
const port = 3000;
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
 // { id: 1, title: "Buy milk" },
 // { id: 2, title: "Finish homework" },
];
async function  toDo(){
  const result= await  db.query("SELECT * FROM items");
  const items = result.rows;
  console.log(items);
    return items;
}

app.get("/", async(req, res) => {
const items = await toDo();
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add",async (req, res) => {
  const item = req.body.newItem;
    const newItem = await db.query("INSERT INTO items (title) VALUES ($1) ",[item]);
    items.push({ title: item });
  res.redirect("/");
});

app.post("/edit",async (req, res) => { 
  const editItem = req.body.updatedItemTitle;
  const itemId= req.body.updatedItemId;
  const result= await db.query("UPDATE items SET title = ($1) WHERE id = ($2)",[editItem,itemId]);
  
  res.redirect("/");
});

app.post("/delete", async(req, res) => {
  const input = req.body.deleteItemId;
  const result =  await db.query("DELETE FROM items WHERE id = ($1) ",
    [input]
  );
  const items = toDo();
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
