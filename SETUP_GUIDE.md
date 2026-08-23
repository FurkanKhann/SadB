# 📧 EmailJS Setup Guide — Birthday Date Booker

Follow these steps to enable **automatic email notifications** when a date is booked.

---

## Step 1: Create an EmailJS Account

1. Go to [https://www.emailjs.com](https://www.emailjs.com)
2. Click **"Sign Up Free"**
3. Create your account (the free plan allows 200 emails/month — plenty for this!)

---

## Step 2: Add an Email Service

1. In the EmailJS dashboard, click **"Email Services"** in the sidebar
2. Click **"Add New Service"**
3. Select **Gmail**
4. Click **"Connect Account"** and log in with `khanfurkan575@gmail.com`
5. Give it a name like `gmail_birthday`
6. Click **"Create Service"**
7. 📝 **Copy the Service ID** (e.g., `service_abc123`) — you'll need this!

---

## Step 3: Create an Email Template

1. Click **"Email Templates"** in the sidebar
2. Click **"Create New Template"**
3. Set up the template:

**Subject:**
```
🎉 Date Confirmed! — {{date}} at {{time}}
```

**Content (Body):**
```
Hey there! 💕

Great news! A date has been booked! 🎉

📅 Date: {{date}}
🕐 Time: {{time}}
📍 Place: {{place}}
💌 Note: {{note}}

Get ready for an amazing time together!

With love,
{{from_name}}
```

**To Email:** `{{to_email}}`

4. Click **"Save"**
5. 📝 **Copy the Template ID** (e.g., `template_xyz789`)

---

## Step 4: Get Your Public Key

1. Click on **"Account"** in the sidebar  
2. Under the **"General"** tab, find **"Public Key"**
3. 📝 **Copy the Public Key** (e.g., `user_ABC123xyz`)

---

## Step 5: Update script.js

Open `script.js` and find the config section at the top:

```javascript
const EMAILJS_CONFIG = {
    publicKey: 'YOUR_PUBLIC_KEY',       // Replace with your EmailJS public key
    serviceId: 'YOUR_SERVICE_ID',       // Replace with your EmailJS service ID
    templateId: 'YOUR_TEMPLATE_ID',     // Replace with your EmailJS template ID
};
```

Replace the placeholder values with your actual keys:

```javascript
const EMAILJS_CONFIG = {
    publicKey: 'user_ABC123xyz',        // Your actual public key
    serviceId: 'service_abc123',        // Your actual service ID
    templateId: 'template_xyz789',      // Your actual template ID
};
```

---

## Step 6: Test It! 🎉

1. Open `index.html` in your browser
2. Go through the experience
3. Book a date
4. Check both email inboxes for the confirmation!

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Emails not sending | Check browser console for errors |
| "Invalid service ID" | Double check the service ID in EmailJS dashboard |
| Gmail blocks the service | Go to EmailJS → Email Services → Reconnect Gmail |
| Emails in spam | Mark as "Not Spam" in the recipient's inbox |

---

## 🎂 That's it! Happy Birthday Planning! 💕
