const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const pool = require('../db/db');

// @route   GET api/hostels
// @desc    Get all hostels
// @access  Public
router.get('/', async (req, res) => {
    try {
        const hostels = await pool.query(
            'SELECT * FROM hostels ORDER BY created_at DESC'
        );
        res.json(hostels.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/hostels
// @desc    Create a hostel
// @access  Admin
router.post('/', [auth, adminAuth], async (req, res) => {
    const { name, description, address, total_rooms } = req.body;

    try {
        const newHostel = await pool.query(
            'INSERT INTO hostels (name, description, address, total_rooms) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, description, address, total_rooms]
        );
        res.json(newHostel.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/hostels/:id/rooms
// @desc    Get all rooms in a hostel
// @access  Public
router.get('/:id/rooms', async (req, res) => {
    try {
        const rooms = await pool.query(
            'SELECT * FROM rooms WHERE hostel_id = $1 ORDER BY room_number',
            [req.params.id]
        );
        res.json(rooms.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/hostels/:id/rooms
// @desc    Add a room to a hostel
// @access  Admin
router.post('/:id/rooms', [auth, adminAuth], async (req, res) => {
    const { room_number, capacity, room_type, price } = req.body;

    try {
        const newRoom = await pool.query(
            'INSERT INTO rooms (hostel_id, room_number, capacity, room_type, price) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [req.params.id, room_number, capacity, room_type, price]
        );
        res.json(newRoom.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT api/hostels/:id
// @desc    Update a hostel
// @access  Admin
router.put('/:id', [auth, adminAuth], async (req, res) => {
    const { name, description, address, total_rooms } = req.body;

    try {
        const updatedHostel = await pool.query(
            'UPDATE hostels SET name = $1, description = $2, address = $3, total_rooms = $4 WHERE id = $5 RETURNING *',
            [name, description, address, total_rooms, req.params.id]
        );
        res.json(updatedHostel.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   DELETE api/hostels/:id
// @desc    Delete a hostel
// @access  Admin
router.delete('/:id', [auth, adminAuth], async (req, res) => {
    try {
        await pool.query('DELETE FROM hostels WHERE id = $1', [req.params.id]);
        res.json({ msg: 'Hostel removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router; 