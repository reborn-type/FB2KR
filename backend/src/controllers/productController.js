const {nanoid} = require('nanoid');
const {getAllProducts, 
       getProductById,
       createProduct,
       patchProductById,
       deleteProductById,
       getProductsByCategory} = require('../data/productsData');
       
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
              const {name, price, category, description, count_in_stock, image_url} = req.body;

              const imagePath = image_url ? image_url : null;
              const product = await createProduct(nanoid(5), 
              name.trim(), price, 
              category.trim(), description.trim(), 
              count_in_stock, imagePath);
              if(!product){
                     return res.status(400).json({"error message": "Товар не был создан."});
              }
              res.status(201).json(product);
       }
       catch (e){
              res.status(400).send("Ошибка сервера.");
              throw e;
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
              console.error(e);
              res.status(400).send("Ошибка сервера.");
       }
}

module.exports = {getProducts, getProduct, postProduct, patchProduct, deleteProduct, getProductsByCat};