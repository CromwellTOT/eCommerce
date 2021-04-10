const jwt = require('jsonwebtoken');
const config = require('../../config');
const _ = require('lodash');

const Role = require('../service/role/model');

const isAuthorized = async (req, resp, next) => {
	const token = req.cookies.token || '';

	try {
		if (!token) {
			return resp.status(401).send({ error_message: 'Authentication failed - not logged in', });
		}

		const decrypt = await jwt.verify(token, config.jwt_secret); 

		if (await hasPermission(decrypt, req.baseUrl, req.method)) {
			req.user = {
				id: decrypt._id,
				email: decrypt.email,
				userType: decrypt.userType,
			};

			next();
		} else {
			resp.status(403).send({ error_message: 'Authorization failed - not allowed to make this operation', });
		}
	} catch (err) {
		return resp.status(500).send({ message: 'Internal Error - please contact customer support' });
	}
}

async function hasPermission (user, path, method) {
	const userType = { userType: user.userType };

	const permissions = await Role.find({ ...userType });

	if (!permissions) {
		// no access is found for this user type
		return false;
	}

	console.log(`{user: ${user.name}, type: ${user.userType}} requsts authorization for {path: ${path}, method: ${method}}`);
	// permission is defined by `<path>-<method>``
	const requestForPermissoin = path + '-' + method;

	for (const permission of permissions) {
		if (permission.accessPath === requestForPermissoin && permission.access) {
			console.log('access allowed!');
			return true;
		}
	}
	// no access is found for this user type
	return false;
}

module.exports = isAuthorized;



