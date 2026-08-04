
BACKEND_URL = 'http://localhost:3000';


for(let i = 0; i < 5; i++) {
    fetch(`${BACKEND_URL}/data/${i}`)
        .then(response => response.json())
        .then(data => console.log(`Response for ID ${i}:`, data))
        .catch(error => console.error(`Error fetching data for ID ${i}:`, error));
}   
