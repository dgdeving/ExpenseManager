const postData = async (url = '', data = {}) => {
    try {
        const response = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json',
                // Additional headers if required
            },
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        });
        console.log(`Response Status: ${response.status} ${response.statusText}`);
        //return await response.json(); // parses JSON response into native JavaScript objects
    } catch (error) {
        console.error('Error:', error);
        return { data: null, error: error };
    }
};

export default postData;