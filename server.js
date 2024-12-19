const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 5001;

app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:3000', // Adjust this based on your frontend port
  }));
  

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'mysql', 
    port: 3306,
});

  

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

sequelize.sync({ alter: true }).then(() => {
    console.log("Database & tables created!");
}).catch((err) => {
    console.error("Error creating database or tables:", err);
});

app.post('/employees', async (req, res) => {
    try {
      const { employee_id, email } = req.body;
  
      const existingEmployee = await Employee.findOne({
        where: {
          [Sequelize.Op.or]: [{ employee_id }, { email }],
        },
      });
  
      if (existingEmployee) {
        return res.status(400).json({ error: 'Employee ID or Email already exists.' });
      }
  
      const employee = await Employee.create(req.body);
      res.status(201).json(employee);
    } catch (err) {
      console.error("Error creating employee:", err);
      res.status(400).json({ error: err.message || 'An error occurred while adding the employee.' });
    }
  });
  

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));