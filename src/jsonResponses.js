const users = {};

const respondJSON = (request, response, status, object) => {
    response.writeHead(status, { 'Content-Type': 'application/json' });
    response.write(JSON.stringify(object));
    response.end();
};

const respondJSONMeta = (request, response, status) => {
    response.writeHead(status, {'Content-Type': 'application/json'});
    response.end();
  };

const getUsers = (request, response) => {
    const responseJSON = {
        users,
    }

    respondJSON(request, response, 200, responseJSON);
};

const getUsersMeta = (request, response) => respondJSONMeta(request, response, 200);

const addUser = (request, response, body) => {
    const responseJSON = {
        message: 'You Need both a Name as well as an Age',
    };

    console.dir("Body");
    console.dir(body);
    if(!body.name || !body.age) {
        respondJSON.id = 'missingParams';
        return respondJSON(request, response, 400, responseJSON);
    }

    let responseCode = 201;

    if(users[body.name]) {
        responseCode = 204;
    } else {
        users[body.name] = {};
    }

    users[body.name].name = body.name;
    users[body.name].age = body.age;

    if(responseCode === 201) {
        responseJSON.message = 'It has been done';
        return respondJSON(request, response, responseCode, responseJSON);
    }

    return respondJSONMeta(request, response, responseCode);
};

const success = (request, response) => {
    const responseJSON = {
        message: 'This is a successful response',
        id: 'success',
    };

    respondJSON(request, response, 200, responseJSON);
};

const badRequest = (request, response, params) => {
    const responseJSON = {
        message: 'This request has the required parameters',
        id: 'notBadRequest',
    };

    if (!params.valid || params.valid !== 'true') {
        responseJSON.message = 'Missing valid query parameter set to true';
        responseJSON.id = 'badRequest';
        return respondJSON(request, response, 400, responseJSON);
    }

    return respondJSON(request, response, 200, responseJSON);
};


const notReal = (request, response) => {
    const responseJSON = {
        message: 'This is not real, but it works.',
        id: 'fake'
    }

    respondJSON(request, response, 404, responseJSON);
};

const notRealMeta = (request, response) => respondJSONMeta(request, response, 404);


const notFound = (request, response) => {
    const responseJSON = {
        message: 'Couldn\'t find it.',
        id: 'notFound',
    };

    respondJSON(request, response, 404, responseJSON);
};

const notFoundMeta = (request, response) => respondJSONMeta(request, response, 404);

module.exports = {
    success,
    badRequest,
    addUser,
    notFound,
    notFoundMeta,
    getUsers,
    getUsersMeta,
    notReal,
    notRealMeta,
};