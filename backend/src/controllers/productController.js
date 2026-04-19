const {nanoid} = require('nanoid');
const {getAllProducts, 
       getProductById,
       createProduct,
       patchProductById,
       deleteProductById,
       getProductsByCategory} = require('../data/productsData');
const {upload} = require('../config/multer');
const nanoid = require('nanoid');
       
async function getProducts(req, res) {
       try {
              const products = await getAllProducts();
              if(!products){ 
                     res.status(404).json({"error message": "Товары не найдены."});
              }
              res.json(products);
       }
       catch (e){
              res.status(400).send("Ошибка сервера.");
       }
}

async function getProduct(req, res) {
       try{ 
              const id = req.params.id;
              const product = await getProductById(id);

              if(!product){
                     return res.status(404).json({"error message": "Товар с таким ID не найден."});
              }
       }
       catch (e){
              res.status(400).send("Ошибка сервера.");
       }
}

async function getProductsByCat(req, res) {
       try {
              const category = req.params.type;
              const products = await getProductsByCategory(category);
              if(!products){
                     return res.status(404).json({"error message": "Товары с такой категорией не найдены."});
              }
              res.json(products);
       }
       catch (e){
              res.status(400).send("Ошибка сервера.");
       }
}

async function postProduct(req, res) {
       try {
              const {name, price, category, description, countInStock, image_url} = req.body;

              if(req.body?.name === undefined && req.body?.price === undefined && req.body?.category === undefined && req.body?.description === undefined &&  req.body?.countInStock === undefined){
                     return res.status(400).json({
                     error: "Nothing to update",
                     });
              }
              if(name !== undefined) product.name = name;
              if(price !== undefined) product.price = price;
              if(category !== undefined) product.category = category;
              if(description !== undefined) product.description = description;
              if(countInStock !== undefined) product.countInStock = countInStock;
              const product = await createProduct(nanoid(5), 
              name.trim(), price, 
              category.trim(), description.trim(), 
              countInStock, image_url);
              if(!product){
                     return res.status(400).json({"error message": "Товар не был создан."});
              }
              res.status(201).json(product);
       }
       catch (e){
              res.status(400).send("Ошибка сервера.");
       }
}

async function patchProduct(req, res) {
       try {
              const id = req.params.id;
              const {name, price, category, description, count_in_stock, image_url} = req.body;
              const product = await patchProductById(id, name, price, category, description, count_in_stock, image_url);
              if(!product){
                     return res.status(404).json({"error message": "Товар с таким ID не найден."});
              }
              res.json(product);
       }
       catch (e){
              res.status(400).send("Ошибка сервера.");
       }
}

async function deleteProduct(req, res) {
       try {
              const id = req.params.id;
              const product = await deleteProductById(id);
              if(!product){
                     return res.status(404).json({"error message": "Товар с таким ID не найден."});
              }
              res.json({"message": "Товар удалён."});
       }
       catch (e){
              res.status(400).send("Ошибка сервера.");
       }
}

module.exports = {getProducts, getProduct, postProduct, patchProduct, deleteProduct};