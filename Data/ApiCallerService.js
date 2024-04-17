export default async function postUrlToApi(url) {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;
    const requestBody = { url };
    console.log(url)
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: url
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
}