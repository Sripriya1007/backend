const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Use body-parser middleware
app.use(bodyParser.json());

// Use CORS with dynamic origin from .env
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Default to localhost during development
}));

// Initialize Sequelize with .env variables
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT || 'mysql',
        port: process.env.DB_PORT || 3306, // Default to MySQL port
    }
);

// Define Employee model
const Employee = sequelize.define('employees', { 
    employee_id: { type: DataTypes.STRING(10), unique: true, allowNull: false },
    name: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(100), unique: true, allowNull: false },
    phone_number: { type: DataTypes.STRING(10), allowNull: false },
    department: { type: DataTypes.STRING(50), allowNull: false },
    date_of_joining: { type: DataTypes.DATE, allowNull: false },
    role: { type: DataTypes.STRING(50), allowNull: false },
}, {
    timestamps: false,
});

// Sync database
sequelize.sync({ alter: true }).then(() => {
    console.log("Database & tables created!");
}).catch((err) => {
    console.error("Error creating database or tables:", err);
});

// POST endpoint to create an employee
app.post('/employees', async (req, res) => {
    try {
        const { employee_id, email } = req.body;

        // Check if employee already exists
        const existingEmployee = await Employee.findOne({
            where: {
                [Sequelize.Op.or]: [{ employee_id }, { email }],
            },
        });

        if (existingEmployee) {
            return res.status(400).json({ error: 'Employee ID or Email already exists.' });
        }

        // Create new employee
        const employee = await Employee.create(req.body);
        res.status(201).json(employee);
    } catch (err) {
        console.error("Error creating employee:", err);
        res.status(400).json({ error: err.message || 'An error occurred while adding the employee.' });
    }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
