
import axios from 'axios';

const triggerReset = async () => {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/forgotpassword', {
            email: 'santhoshgavireddy93@gmail.com'
        }, {
            validateStatus: function (status) {
                return status < 500; // Resolve only if the status code is less than 500
            }
        });

        console.log('Response Status:', response.status);
        console.log('Response Data:', response.data);
    } catch (error) {
        console.error('Error triggering reset:', error.message);
    }
};

triggerReset();
