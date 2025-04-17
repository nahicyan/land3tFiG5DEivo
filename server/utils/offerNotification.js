import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

// 1. Configure SMTP Transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// 2. Verify SMTP Connection
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Connection Failed:", error);
  } else {
    console.log("SMTP Server is ready to send emails.");
  }
});

/**
 * 3. Generic Email Sending Function
 *
 * @param {String} subject - Email subject
 * @param {String} body - Email body (HTML formatted)
 */
export const sendOfferNotification = async (subject, body) => {
  try {
    const mailOptions = {
      from: `"Landivo Alerts" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_TO,
      subject: subject,
      html: body,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Offer notification sent: ${subject}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

/**
 * 4. Pretty Email Templates with Themed HTML Table
 *
 * Note: Most email clients do not support Tailwind CSS classes.
 *       Inline CSS is used here to ensure consistent rendering.
 */

const tableStyle =
  "border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;";
const thStyle =
  "background-color: #324c48; color: #fff; padding: 8px; border: 1px solid #ccc;";
const tdStyle = "padding: 8px; border: 1px solid #ccc;";

/**
 * Template for New Offer
 *
 * @param {Object} property - Contains title, streetAddress, city, state, zip, ownerId, id, askingPrice.
 * @param {Object} buyer - Contains firstName, lastName, email, phone, buyerType.
 * @param {Number} offeredPrice
 */
export const newOfferTemplate = (property, buyer, offeredPrice) => `
  <h2 style="font-family: Arial, sans-serif;">New Offer Submitted for ${
    property.streetAddress
  }, ${property.city}, ${property.state} ${property.zip}!</h2>
  
  <h3 style="font-family: Arial, sans-serif;">Property Details:</h3>
  <table style="${tableStyle}">
    <tr>
      <th style="${thStyle}">Property Address</th>
      <td style="${tdStyle}">${property.streetAddress}, ${property.city}, ${
  property.state
} ${property.zip}</td>
    </tr>
    <tr>
      <th style="${thStyle}">Owner ID</th>
      <td style="${tdStyle}">${property.ownerId}</td>
    </tr>
    <tr>
      <th style="${thStyle}">Asking Price</th>
      <td style="${tdStyle}">$${property.askingPrice.toLocaleString()}</td>
    </tr>
    <tr>
      <th style="${thStyle}">Offered Price</th>
      <td style="${tdStyle}">$${offeredPrice.toLocaleString()}</td>
    </tr>
  </table>

  <h3 style="font-family: Arial, sans-serif;">Buyer Details:</h3>
  <table style="${tableStyle}">
    <tr>
      <th style="${thStyle}">Name</th>
      <td style="${tdStyle}">${buyer.firstName} ${buyer.lastName}</td>
    </tr>
    <tr>
      <th style="${thStyle}">Email</th>
      <td style="${tdStyle}">${buyer.email}</td>
    </tr>
    <tr>
      <th style="${thStyle}">Phone</th>
      <td style="${tdStyle}">${buyer.phone}</td>
    </tr>
    <tr>
      <th style="${thStyle}">Buyer Type</th>
      <td style="${tdStyle}">${buyer.buyerType}</td>
    </tr>
  </table>

  <p style="margin-top: 20px; font-family: Arial, sans-serif;">Submitted On: <strong>${new Date().toLocaleString()}</strong></p>
`;

/**
 * Template for Updated Offer
 *
 * @param {Object} property
 * @param {Object} buyer
 * @param {Number} offeredPrice
 */
export const updatedOfferTemplate = (property, buyer, offeredPrice) => `
  <h2 style="font-family: Arial, sans-serif;">Offer Updated for ${
    property.streetAddress
  }, ${property.city}, ${property.state} ${property.zip}!</h2>
  
  <h3 style="font-family: Arial, sans-serif;">Property Details:</h3>
  <table style="${tableStyle}">
    <tr>
      <th style="${thStyle}">Property Address</th>
      <td style="${tdStyle}">${property.streetAddress}, ${property.city}, ${
  property.state
} ${property.zip}</td>
    </tr>
    <tr>
      <th style="${thStyle}">Owner ID</th>
      <td style="${tdStyle}">${property.ownerId}</td>
    </tr>
    <tr>
      <th style="${thStyle}">Property ID</th>
      <td style="${tdStyle}">${property.id}</td>
    </tr>
    <tr>
      <th style="${thStyle}">Asking Price</th>
      <td style="${tdStyle}">$${Number(
  property.askingPrice
).toLocaleString()}</td>
    </tr>
    <tr>
      <th style="${thStyle}">New Offered Price</th>
      <td style="${tdStyle}"$${Number(offeredPrice).toLocaleString()}</td>
    </tr>
  </table>

  <h3 style="font-family: Arial, sans-serif;">Buyer Details:</h3>
  <table style="${tableStyle}">
    <tr>
      <th style="${thStyle}">Name</th>
      <td style="${tdStyle}">${buyer.firstName} ${buyer.lastName}</td>
    </tr>
    <tr>
      <th style="${thStyle}">Email</th>
      <td style="${tdStyle}">${buyer.email}</td>
    </tr>
    <tr>
      <th style="${thStyle}">Phone</th>
      <td style="${tdStyle}">${buyer.phone}</td>
    </tr>
    <tr>
      <th style="${thStyle}">Buyer Type</th>
      <td style="${tdStyle}">${buyer.buyerType}</td>
    </tr>
  </table>

  <p style="margin-top: 20px; font-family: Arial, sans-serif;">Updated On: <strong>${new Date().toLocaleString()}</strong></p>
`;

/**
 * Template for Low Offer Warning
 *
 * @param {Object} property
 * @param {Object} buyer
 * @param {Number} offeredPrice
 */
export const lowOfferTemplate = (property, buyer, offeredPrice) => `
  <h2 style="font-family: Arial, sans-serif;">Low Offer Alert for ${
    property.streetAddress
  }, ${property.city}, ${property.state} ${property.zip}!</h2>
  
  <h3 style="font-family: Arial, sans-serif;">Property Details:</h3>
  <table style="${tableStyle}">
    <tr>
      <th style="${thStyle}">Property Address</th>
      <td style="${tdStyle}">${property.streetAddress}, ${property.city}, ${
  property.state
} ${property.zip}</td>
    </tr>
    <tr>
      <th style="${thStyle}">Owner ID</th>
      <td style="${tdStyle}">${property.ownerId}</td>
    </tr>
    <tr>
      <th style="${thStyle}">Property ID</th>
      <td style="${tdStyle}">${property.id}</td>
    </tr>
    <tr>
      <th style="${thStyle}">Asking Price</th>
      <td style="${tdStyle}">$${property.askingPrice}</td>
    </tr>
    <tr>
      <th style="${thStyle}">Offered Price</th>
      <td style="${tdStyle}">$${offeredPrice}</td>
    </tr>
    <tr>
      <th style="${thStyle}">Minimum Price</th>
      <td style="${tdStyle}">$${property.minPrice}</td>
    </tr>
  </table>

  <h3 style="font-family: Arial, sans-serif;">Buyer Details:</h3>
  <table style="${tableStyle}">
    <tr>
      <th style="${thStyle}">Name</th>
      <td style="${tdStyle}">${buyer.firstName} ${buyer.lastName}</td>
    </tr>
    <tr>
      <th style="${thStyle}">Email</th>
      <td style="${tdStyle}">${buyer.email}</td>
    </tr>
    <tr>
      <th style="${thStyle}">Phone</th>
      <td style="${tdStyle}">${buyer.phone}</td>
    </tr>
    <tr>
      <th style="${thStyle}">Buyer Type</th>
      <td style="${tdStyle}">${buyer.buyerType}</td>
    </tr>
  </table>

  <p style="margin-top: 20px; font-family: Arial, sans-serif;">Submitted On: <strong>${new Date().toLocaleString()}</strong></p>
`;
