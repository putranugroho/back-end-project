const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport(
    {
        service: 'gmail',
        auth:{
            type: 'OAuth2',
            user: 'putraa.nugroho@gmail.com',
            clientId: '195763229286-jct2j0ckajr24b2ktomde1q8e24ik4ok.apps.googleusercontent.com',
            clientSecret: 'ue94MbC3kQMHS7XSrywtQpSZ',
            refreshToken: '1/xIdtWW6-8bmX4TcO1lpR4RGm8x5ZIqHgNQprJBQdK88'
        }
    }
)

const mailVerify = (user) => {
    var {name,username,email} = user    
    
    const mail = {
        from : `Danylo "Dendi" Ishutin <dondo.isthebest@gmail.com>`,
        to: email,
        subject: 'Dendi is here',
        html: `<h1>halo ${name}, Segame dulu sabi kali nih</h1>
                <a href='http://localhost:2019/verify?username=${username}> Klik disini untuk mendapatkan uang 10Juta rupiah</a>`
    }

    transporter.sendMail(mail, (err,result) => {
        if(err) return console.log(err.message);

        console.log('Alhamdulillah berhasil');
        
    })
}

module.exports = mailVerify