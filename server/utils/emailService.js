export const sendEmail = async ({ to, subject, text }) => {
  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: to }]
          }
        ],
        from: { 
          email: process.env.EMAIL_USER, 
          name: "CampusBids Admin" 
        },
        subject: subject,
        content: [
          {
            type: "text/plain",
            value: text
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("🚨 SENDGRID ERROR:", JSON.stringify(errorData, null, 2));
      throw new Error('Email delivery failed via SendGrid.');
    }
    
    console.log(`✅ OTP successfully sent to ${to} via SendGrid HTTP API!`);
  } catch (error) {
    console.error("🚨 FETCH ERROR:", error);
    throw new Error('Email delivery failed. Please check the email address.');
  }
};