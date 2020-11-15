const jwt = require('jsonwebtoken');
const config = require('../../config');

// todo: store this in DB
const permissionsByUserType = {
	'admin': {
		// item service
		'/rest/item-POST': true,
		'/rest/item-PUT': true,
		'/rest/item-DELETE': true,
		// user service 
		'/rest/user-GET': true,
		'/rest/user-POST': true,
		'/rest/user-PUT': true,
	},
	'client': {
		// user service
		'/rest/user-POST': true,
		'/rest/user-GET': true,
		'/rest/user-POST': true,
		'/rest/user-PUT': true,
	},
}

const isAuthorized = async (req, resp, next) => {
	const token = req.cookies.token || '';

	try {
		if (!token) {
			return resp.status(401).send({ error_message: 'Authentication failed - not logged in', });
		}

		const decrypt = await jwt.verify(token, config.jwt_secret); 

		if (hasPermission(decrypt, req.baseUrl, req.method)) {
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

function hasPermission (user, path, method) {
	const permissions = permissionsByUserType[user.userType];

	console.log(`
		{user: ${user.name}, type: ${user.userType}} requsts authorization for {path: ${path}, method: ${method}}
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



