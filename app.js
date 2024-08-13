require("dotenv").config();
const axios = require("axios");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const EVA_API_KEY = process.env.EVA_API_KEY;
//const SALESFORCE_API_KEY = process.env.SALESFORCE_API_KEY;
const EVA_API_URL = "https://api.getbase.com/v2";

//Middleware para servir archivos estáticos
app.use(express.static("public"));

//Función para realizar solicitudes a la API de EVA
async function fetchEVAData(endpoint, params = {}) {
    try {
        const response = await axios.get(`${EVA_API_URL}/${endpoint}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${EVA_API_KEY}`,
                "User-Agent": "EvaToSalesforce/1.0",
            },
            params,
        });
        return response.data;
    } catch (error) {
        console.error("Error al buscar datos desde EVA:", error);
        throw error;
    }
}

//Ruta principal
app.get("/", async (req, res) => {
    try {
        const evaContacts = await fetchEVAData("contacts");
        const contacts = evaContacts.item.map((item) => item.data);
        res.send(generateHTML(contacts));
    } catch (error) {
        console.error("Error buscando datos desde EVA: ", error);
        res.status(500).send("Error buscando datos desde EVA");
    }
});

//Generando HTML con la información extraída
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
        contacts.forEach((contact) => {
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

//Iniciar el server
app.listen(PORT, () => {
    console.log(`Server ejecutándose en el puerto ${PORT} con éxito`);
});




/*
//Función para transformar los datos de EVA al formato de Salesforce
function transformData(evaData) {
    return {
        LastName: evaData.last_name,
        Company: evaData.organization_name,
        Email: evaData.email,
        Phone: evaData.phone,
    };
}

//Función para insertar datos en Salesforce (simulación)
async function insertDataToSalesforce(salesforceData) {
    console.log(
        `Simulando inserción de lead: ${JSON.stringify(salesforceData)}`
    );

    return { status: 201 };
}

//Función principal para ejecutar el flujo de trabajo
async function main() {
    try {
        const evaContacts = await fetchEVAData("contacts");
        for (const contact of evaContacts.items) {
            const salesforceLead = transformData(contact.data);
            const response = await insertDataToSalesforce(salesforceLead);
            if (response.status === 201) {
                console.log(
                    `Lead ${salesforceLead.LastName} creado con éxito.`
                );
            } else {
                console.error(`Error al crear ${salesforceLead.LastName}.`);
            }
        }
    } catch (error) {
        console.error("Ocurrió un error: ", error);
    }
}
*/

