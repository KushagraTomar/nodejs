const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
const PORT = 3001

app.use(bodyParser.json())
app.use(cors())

const dbName = 'ItemsDatabase';
mongoose.connect(`mongodb+srv://Kushagra_Tomar:iqOJX0PpXzpHaQLn@devcluster.ai7kh.mongodb.net/${dbName}`)
const db = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log(`Connected to MongoDB, database is ${dbName}`);
});

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: Number,
})

const Item = mongoose.model('Item', itemSchema)

app.get('/', async(req, res) => {
  res.status(200).send('Hello World, from Nodejs.')
})

app.post('/items', async(req, res) => {
  try {
    const item = new Item(req.body)
    await item.save()
    res.status(201).json(item)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.get('/items', async(req, res) => {
  try {
    const items = await Item.find()
    res.status(200).json(items)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/item/:id', async(req, res) => {
  try {
    const item = await Item.findById(req.params.id)
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json(item)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

app.put('/item/:id', async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json(item)
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
})

app.delete('/item/:id', async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id)
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json({ message: 'Item deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port: ${PORT}`)
})