// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
AWS.config.loadFromPath('config/aws.json');


module.exports = async (message, phone) => {

    return Promise.resolve();

    phone = phone.replace(/[\(\)]+/g, "").replace(/[\-]/g, "");
    phone = "+55" + phone;

    var params = {
        Message: message,
        PhoneNumber: phone,
      };
      
    // Create promise and SNS service object
    return new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();
}

  