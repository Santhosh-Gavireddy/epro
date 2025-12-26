import axios from 'axios';

const login = async () => {
    try {
        console.log('Attempting login...');
        const res = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@example.com',
            password: 'password123'
        });
        console.log('Login Success:', res.data);
    } catch (err) {
        console.error('Login Failed:', err.response ? err.response.data : err.message);
        if (err.response && err.response.status === 500) {
            console.log('--- 500 ERROR DETECTED ---');
        }
    }
};

login();
