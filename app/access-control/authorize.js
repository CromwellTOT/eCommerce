const jwt = require('jsonwebtoken');
const config = require('../../config');

// todo: store this in DB
const permissionsByUserType = {
	'admin': {
		'/rest/item-POST': true,
	},
	'client': {
		
	},
}

const isAuthorized = async (req, resp, next) => {
	const token = req.cookies.token || '';

	console.log(`
		Review authorization for token ${token} 
	`);

	try {
		if (!token) {
			resp.status(401).send({ error_message: 'Authentication failed - not logged in', });
		}

		const decrypt = await jwt.verify(token, config.jwt_secret);

		if (hasPermission(decrypt, req.baseUrl, req.method)) {
			req.user = {
				_id: decrypt.id,
			};

			next();
		} else {
			resp.status(401).send({ error_message: 'Authorization failed - not allowed to make this operation', });
		}
	} catch (err) {
		return resp.status(500).send({ error_message: 'Internal server error, please contact support', });
	}
}

function hasPermission (user, path, method) {
	const permissions = permissionsByUserType[user.userType];

	console.log(`
		user: ${user.name}, type: ${user.userType} requsts authorization for path: ${path}, method: ${method}
	`);
	// permission is defined by `<path>-<method>``
	const requestForPermissoin = path + '-' + method;

	if (permissions[requestForPermissoin]) {
		return true;
	} else {
		return false;
	}
}

module.exports = isAuthorized;