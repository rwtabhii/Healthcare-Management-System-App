export const sendSMS = async (mobile, otp) => {
    let response;
    // 'https://www.fast2sms.com/dev/bulkV2?authorization=sF7pv9an7OteS9APDCI7MmMJSu0lLybvFjR9VXN47MvcclP5FwifGjMHkIqZ&route=q&message=&flash=0&numbers=&schedule_time='
    const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${SMS_API_KEY}&route=q&message=Your OTP is ${otp}&flash=0&numbers=${mobile}`;
    try {
        response = await axios.get(url);
        console.log('SMS sent successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error sending SMS:', error);
        return { error: 'Error sending SMS', return: false };
    }
}