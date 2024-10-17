const express = require('express');
const nodemailer = require('nodemailer');
const Joi = require('joi');
const bodyParser = require('body-parser');
const path=require('path')
 require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// إعدادات البريد الإلكتروني باستخدام nodemailer  
const transporter = nodemailer.createTransport({
    service: 'gmail', // يمكنك تغيير الخدمة إذا كنت تستخدم خدمة بريد أخرى  
    auth: {
        user: process.env.USER_EMAIL, // اكتب بريدك الإلكتروني  
        pass: process.env.USER_PASS // اكتب كلمة المرور الخاصة بك  
    }
});

app.use(express.static(path.join(__dirname, 'public')));

// تقديم مجلد assists كمجلد ثابت  
app.use('/assistes', express.static(path.join(__dirname, 'assistes')));

// توجيه الجذر إلى index.html  
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const schema = Joi.object({
    email: Joi.string().email().required(),
    message: Joi.string().min(1).required()
});


app.post('/send-email', (req, res) => {
    const { email, message } = req.body;

    
    const { error } = schema.validate({ email, message });
    
    if (error) {
        return res.status(400).json({ message: 'البريد الإلكتروني غير صحيح أو الرسالة فارغة.' });
    }

    
    const mailOptions = {
        from: email,
        to: process.env.DESTENATION, 
        subject: 'رسالة من الموقع',
        text: message  
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error('Error sending email:', err);  
            return res.status(500).json({ message: 'فشل في إرسال البريد الإلكتروني.' });
        }
        res.status(200).json({ message: 'تم إرسال البريد الإلكتروني بنجاح!',info });
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});