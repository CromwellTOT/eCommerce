const express = require("express");
const router = express.Router();

const Role = require('./model');
const isAuthorized = require('../../access-control/authorize');

// get all roles
router.get('/', isAuthorized, async (req, resp) => {
    const roles = await Role.find();

    resp.send(roles);
});

// get one by id
router.get('/:id', isAuthorized, async (req, resp) => {
    const role = await Role.findOne({ _id: req.params.id });

    if (!role) {
        return resp.status(404).send({ error_message: 'Role Not Found.' });
    }

    resp.send(role);
});

// create a new role
router.post('/', isAuthorized, async (req, resp) => {
    const role = new Role({
        userType: req.body.userType,
        accessPath: req.body.accessPath,
        access: req.body.access,
    });

    let newRole;
    try {
        newRole = await role.save();
    } catch (e) {
        return resp.status(400).send({
            error_message: 'Error in Creating Role.',
            debug_info: e.errors,
        });
    }

    if (!newRole) {
        return resp.status(500).send({ error_message: 'Error in Creating Role.' });
    }

    resp.status(201).send({ data: newRole });
});

router.put('/:id', isAuthorized, async (req, resp) => {
    const role = await Role.findById(req.params.id);

    if (!role) {
        return resp.status(404).send({ error_message: 'Role not found' });
    }

    role.userType = req.body.userType;
    role.accessPath = req.body.accessPath;
    role.access = req.body.access;

    let updatedRole;

    try {
        updatedRole = await role.save();
    } catch (e) {
        return resp.status(400).send({
            error_message: 'Error in Updating Role.',
            debug_info: e.errors,
        });
    }

    if (!updatedRole) {
        return resp.status(500).send({ error_message: 'Error in Updating Role.' });
    }

    resp.send({ data: updatedRole });
});

router.delete('/:id', isAuthorized, async (req, resp) => {
    const role = await Role.findById(req.params.id);

    if (!role) {
        return resp.status(404).send({ error_message: 'Role not found' });
    }

    try {
        await role.remove();
    } catch (e) {
        resp.status(400).send({ error_message: 'Error in Deleting Role.' });
    }

    resp.send({ message: 'Role Deleted' });
});

module.exports = router;







