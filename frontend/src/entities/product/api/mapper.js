export const mapFormToProductDto = (data) => ({
    name: data.name.trim(),
    price: data.price,
    category: data.category,
    description: data.description.trim(),
    countInStock: data.count, 
});