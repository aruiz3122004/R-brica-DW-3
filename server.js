const express = require('express');
const fs = require('fs');
const path = require('path');


const app = express();
const PORT = 3000;

// Middlewares
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Ruta que redirecciona al formulario
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta que recoge los datos del formulario
app.post('/prestamo', (req, res) => {
    const { id, nombre, apellido, titulo, autor, editorial, año } = req.body;

    // Validar que todos los campos estén presentes
    if (!id || !nombre || !apellido || !titulo || !autor || !editorial || !año) {
        return res.redirect('/error.html');
    }

    // Crear directorio data si no existe
    if (!fs.existsSync('data')) {
        fs.mkdirSync('data');
    }

    // Nombre del archivo
    const fileName = `id_${id}.txt`;
    
    // Contenido del archivo
    const fileContent = `${id}, ${nombre}, ${apellido}, ${titulo}, ${autor}, ${editorial}, ${año}`;

    // Escribir archivo
    fs.writeFile(path.join(__dirname, 'data', fileName), fileContent, (err) => {
        if (err) {
            console.error(err);
            return res.redirect('/error.html');
        }
        
        // Enviar archivo para descarga
        res.download(path.join(__dirname, 'data', fileName), fileName, (err) => {
            if (err) {
                console.error(err);
                return res.redirect('/error.html');
            }
        });
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});