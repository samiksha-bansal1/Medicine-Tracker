const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables

const sendSMS = async (phone, message) => {
    try {
        const response = await axios.post("https://www.fast2sms.com/dev/bulkV2", {
            route: "q",
            message: message,
            language: "english",
            flash: 0,
            numbers: phone
        }, {
            headers: {
                "authorization": process.env.FAST2SMS_KEY,
                "Content-Type": "application/json"
            }
        });

        console.log("SMS sent:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error sending SMS:", error.response ? error.response.data : error.message);
        return null;
    }
};

module.exports = { sendSMS };
