require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3001;

const EVA_API_KEY = process.env.EVA_API_KEY;
const EVA_API_URL = 'https://api.getbase.com/v2';

app.use(express.static('public'));

// Función para simular solicitudes a la API de EVA
async function fetchEVAData(endpoint, params = {}) {
  // Datos de prueba simulados
    const simulatedData = {
        items: [
        {
            data: {
            first_name: 'John',
            last_name: 'Doe',
            email: 'john.doe@example.com',
            phone: '123-456-7890'
            }
        },
        {
            data: {
            first_name: 'Jane',
            last_name: 'Smith',
            email: 'jane.smith@example.com',
            phone: '098-765-4321'
            }
        }
        ]
    };
    return simulatedData;
}

// Ruta principal
app.get('/', async (req, res) => {
    try {
        const evaContacts = await fetchEVAData('contacts');
        const contacts = evaContacts.items.map(item => item.data);
        res.send(generateHTML(contacts));
    } catch (error) {
        console.error('Error fetching data from EVA:', error);
        res.status(500).send('Error fetching data from EVA');
    }
});

// Función para generar HTML con los datos
function generateHTML(contacts) {
    let html = `
        <html>
        <head>
        <title>Contacts from EVA</title>
        <style>
            table {
            width: 100%;
            border-collapse: collapse;
            }
            table, th, td {
            border: 1px solid black;
            }
            th, td {
            padding: 10px;
            text-align: left;
            }
        </style>
        </head>
        <body>
        <h1>Contacts from EVA</h1>
        <table>
            <thead>
            <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Phone</th>
            </tr>
            </thead>
            <tbody>`;
    contacts.forEach(contact => {
        html += `
        <tr>
            <td>${contact.first_name}</td>
            <td>${contact.last_name}</td>
            <td>${contact.email}</td>
            <td>${contact.phone}</td>
        </tr>`;
    });
    html += `
            </tbody>
        </table>
        </body>
        </html>`;
    return html;
}

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
