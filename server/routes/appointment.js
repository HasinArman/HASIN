const express = require('express');
const router = express.Router();
const { createAppointment, getAppointments, updateAppointment } = require('../controllers/appointmentController');

router.post('/', createAppointment);
router.get('/', getAppointments);
router.put('/:id', updateAppointment);

module.exports = router;
