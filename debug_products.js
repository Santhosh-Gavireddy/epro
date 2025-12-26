import axios from 'axios';

const fetchProducts = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/products');
        const products = response.data;
        if (products.length > 0) {
            // Assuming the API returns products in some order, but let's just check the last one in the array as it's likely the newest
            const latest = products[products.length - 1];
            console.log('Latest Product:');
            console.log(`ID: ${latest._id}`);
            console.log(`Title: ${latest.title}`);
            console.log(`Image (primary): '${latest.image}'`);
            console.log(`Images (array):`, latest.images);
        } else {
            console.log('No products found.');
        }
    } catch (error) {
        console.error('Error fetching products:', error.message);
    }
};

fetchProducts();
