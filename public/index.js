const express = require('express');
const mongoose = require('mongoose');
const Game = require('../models/game'); 

const app = express();
app.use(express.json()); 

const uri = 'mongodb+srv://User:1234@cluster0.rfetsed.mongodb.net/games-api?retryWrites=true&w=majority&appName=Cluster0';
 mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((error) => console.error('Error connecting to MongoDB Atlas:', error));


const games = [
    {id: 1, name: "Witcher 3", price: 29.99},
    {id: 2, name: "Cyberpunk 2077", price: 59.99},
    {id: 3, name: "Minecraft", price: 26.99},
    {id: 4, name: "Counter-Strike: Global Offensive", price: 0},
    {id: 5, name: "Roblox", price: 0},
    {id: 6, name: "Grand Theft Auto V", price: 29.99},
    {id: 7, name: "Valorant", price: 0},
    {id: 8, name: "Forza Horizon 5", price: 59.99},
]

app.get('/games', async (req, res) => {
    try {
        const games = await Game.find();
        res.json(games);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
 
app.post('/games', async (req, res) => {
    try {
        const lastGame = await Game.findOne().sort({ id: -1 });
        const newId = lastGame ? lastGame.id + 1 : 1;
  
        const game = new Game({
            id: newId,
            name: req.body.name,
            price: req.body.price
        });
  
        const newGame = await game.save();
        res.status(201).json(newGame);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
 
app.put('/games/:id', async (req, res) => {
    try {
        const game = await Game.findOne({ id: req.params.id });
        if (!game) return res.status(404).json({ message: 'Game not found' });
  
        game.name = req.body.name || game.name;
        game.price = req.body.price || game.price;
  
        const updatedGame = await game.save();
        res.json(updatedGame);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
 
app.delete('/games/:id', async (req, res) => {
    try {
        const result = await Game.deleteOne({ id: parseInt(req.params.id) });
         
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Game not found' });
        }
         
        res.json({ message: 'Game deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    
});