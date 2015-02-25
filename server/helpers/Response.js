var message = {
  access  : 'User lacks permission.',
  db      : 'Database error.',
  client  : 'Oops something went wrong.',
  invalid : 'Incorrect Information',
  login   : 'User not logged in.',
  missing : 'Missing Information',
  page    : 'Successful DB call sent to client',
  params  : 'Params are not numbers.',
  s3      : 'Failed to send to s3.',
  password: 'Password is incorrect.'
}

module.exports = {
  success : function(res, data, status){
    data = data || '';
    status = status || 200;
    res.status(status).json(data).end();

  }, data : function(res, code, msg, data, status, server_msg, client_msg){

    status = status || 400;
    server_msg = server_msg || message[type];
    client_msg = client_msg || message.client;
    console.log('ERROR ' + code + ': ' + msg);
    res.status(status).json(data).end();

  }, error : function(res, code, status, server_msg, client_msg){

    status = status || 400;
    server_msg = server_msg || message;
    client_msg = client_msg || message.client;
    console.log('ERROR ' + code + ': ' + server_msg);
    res.status(status).json(client_msg).end();

  }, error_generic : function(res, code, type, status, client_msg){

    status = status || 400;
    client_msg = client_msg || message.client;
    console.log('ERROR ' + code + ': ' + message[type]);
    res.status(status).json(client_msg).end();

  }, error_data : function(res, data, code, server_msg, client_msg){
    server_msg = server_msg || message[db];
    client_msg = client_msg || message.client;
    console.log('ERROR ' + code + ': ' + server_msg);
    res.status(400).json(data).end();
  }
}