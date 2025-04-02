require('dotenv').config();
const { sendVerifyCode } = require('./helper/mailverifymail');

// Test values:
const testEmail = "bzubs011@gmail.com"; // Replace with your email
const testName = "Tester";
const testCode = "123456";

sendVerifyCode(testEmail, testName, testCode);
