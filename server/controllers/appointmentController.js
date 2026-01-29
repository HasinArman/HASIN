const Appointment = require('../models/Appointment');
const Pet = require('../models/Pet');
const Joi = require('joi');

const appointmentSchema = Joi.object({
  pet: Joi.string().required(),
  veterinarian: Joi.string().required(),
  date: Joi.date().required(),
  time: Joi.string().required(),
  reason: Joi.string().required().trim(),
  notes: Joi.string().optional().trim()
});

const createAppointment = async (req, res) => {
  try {
    const { error, value } = appointmentSchema.validate(req.body);
    if (error) {
      return res.fail(error.details[0].message, 400);
    }

    const appointment = await Appointment.create({
      ...value,
      owner: req.user._id
    });

    await appointment.populate('pet owner veterinarian', 'name email');
    res.success({ appointment }, 'Appointment created successfully', 201);
  } catch (error) {
    res.fail(error.message, 500);
  }
};

const getAppointments = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'client') {
      query.owner = req.user._id;
    } else if (req.user.role === 'veterinarian') {
      query.veterinarian = req.user._id;
    }
    // Admin can see all appointments

    const appointments = await Appointment.find(query)
      .populate('pet', 'name species breed')
      .populate('owner', 'name email phone')
      .populate('veterinarian', 'name email phone')
      .sort({ date: -1, time: -1 });

    res.success({ appointments }, 'Appointments retrieved successfully');
  } catch (error) {
    res.fail(error.message, 500);
  }
};

const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.fail('Appointment not found', 404);
    }

    const allowedUpdates = ['date', 'time', 'reason', 'notes', 'status'];
    const updates = Object.keys(req.body);
    const isValid = updates.every(update => allowedUpdates.includes(update));

    if (!isValid) {
      return res.fail('Invalid updates', 400);
    }

    Object.assign(appointment, req.body);
    await appointment.save();
    await appointment.populate('pet owner veterinarian', 'name email');

    res.success({ appointment }, 'Appointment updated successfully');
  } catch (error) {
    res.fail(error.message, 500);
  }
};

module.exports = { createAppointment, getAppointments, updateAppointment };
