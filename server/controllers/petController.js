const Pet = require('../models/Pet');
const Joi = require('joi');

const petSchema = Joi.object({
  name: Joi.string().required().trim(),
  species: Joi.string().valid('Dog', 'Cat', 'Bird', 'Rabbit', 'Other').required(),
  breed: Joi.string().optional().trim(),
  age: Joi.number().min(0).optional(),
  weight: Joi.number().min(0).optional()
});

const createPet = async (req, res) => {
  try {
    const { error, value } = petSchema.validate(req.body);
    if (error) {
      return res.fail(error.details[0].message, 400);
    }

    const pet = await Pet.create({
      ...value,
      owner: req.user._id
    });

    await pet.populate('owner', 'name email');
    res.success({ pet }, 'Pet created successfully', 201);
  } catch (error) {
    res.fail(error.message, 500);
  }
};

const getPets = async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { owner: req.user._id };
    const pets = await Pet.find(query).populate('owner', 'name email');
    res.success({ pets }, 'Pets retrieved successfully');
  } catch (error) {
    res.fail(error.message, 500);
  }
};

const getPet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id).populate('owner', 'name email');
    if (!pet) {
      return res.fail('Pet not found', 404);
    }

    if (req.user.role !== 'admin' && pet.owner._id.toString() !== req.user._id.toString()) {
      return res.fail('Access denied', 403);
    }

    res.success({ pet }, 'Pet retrieved successfully');
  } catch (error) {
    res.fail(error.message, 500);
  }
};

const updatePet = async (req, res) => {
  try {
    const { error, value } = petSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.fail(error.details.map(d => d.message).join(', '), 400);
    }

    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.fail('Pet not found', 404);
    }

    if (req.user.role !== 'admin' && pet.owner.toString() !== req.user._id.toString()) {
      return res.fail('Access denied', 403);
    }

    Object.assign(pet, value);
    await pet.save();
    await pet.populate('owner', 'name email');

    res.success({ pet }, 'Pet updated successfully');
  } catch (error) {
    res.fail(error.message, 500);
  }
};

const deletePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.fail('Pet not found', 404);
    }

    if (req.user.role !== 'admin' && pet.owner.toString() !== req.user._id.toString()) {
      return res.fail('Access denied', 403);
    }

    await Pet.findByIdAndDelete(req.params.id);
    res.success(null, 'Pet deleted successfully');
  } catch (error) {
    res.fail(error.message, 500);
  }
};

module.exports = { createPet, getPets, getPet, updatePet, deletePet };
