const express = require('express');
const router = express.Router();
const { createPet, getPets, getPet, updatePet, deletePet } = require('../controllers/petController');

router.post('/', createPet);
router.get('/', getPets);
router.get('/:id', getPet);
router.put('/:id', updatePet);
router.delete('/:id', deletePet);

module.exports = router;
