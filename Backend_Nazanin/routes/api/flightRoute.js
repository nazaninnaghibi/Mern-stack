const express = require('express');
const Flights = require('../../models/Flights');
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const router = express.Router();

router.get('/', async(req,res) => {
    try{
      const books = await Flights.find();
      res.send(books);
    } catch(err){
        res.status(500).send('Server error');
    }
})

router.get('/:id', async (req,res)=>{
    try {
       const book = await Flights.findById(req.params.id);
       if(!book){
        return res.status(404).send('flight not found');
       }
       res.send(book);
    } catch(err){
        res.status(500).send('Server error');
    }
});

router.post('/', auth,[
    check('from', 'declare from which city!').not().isEmpty(),   
],
async (req,res) => {
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(422).json({errors: errors.array()});
        }
        const newBook = new Flights({
        user: req.user.id,
        from: req.body.from,
        to: req.body.to,
        no: req.body.no,
        });
        const result = await newBook.save();
        res.send(result);

    } catch(err){
       res.status(500).send('Server error');
    }
});

router.delete('/:id',auth, async (req, res) => {
    try {
      const book = await Flights.findById(req.params.id);
      if(!book){
        return res.status(404).json({ msg: 'Flight not found' });
      }
      const result = await Flights.findByIdAndDelete(req.params.id);
      result.user = req.user.id,
      res.send(result);
    } catch(err) {
      res.status(500).send('Server error');
    }
});

router.put('/',auth,
[
    check('from','declare from which city').not()
    .isEmpty(),
],
async (req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(422).json({errors: errors.array()});
        }
        const book = await Flights.findById(req.body.id);
        if(!book){
        return res.status(404).json({ msg: 'Flight not found' }); 
        }
        book.user= req.user.id;
        book.from = req.body.from;
        book.to = req.body.to;
        book.no = req.body.no;
        await book.save();
        res.send(book);
    } catch (err) {
        res.status(500).send('Server error'); 
    }
});

module.exports = router;