 document.getElementById('contactForm').addEventListener('submit', function(event) {
            event.preventDefault(); // منع الإرسال الافتراضي
            
            const emailInput = document.getElementById('email').value;
            const messageInput = document.getElementById('message').value;
            const Submit=document.querySelector('.submit')
            const sendingMessage = document.getElementById('sendingMessage');

            sendingMessage.style.display = 'block';

            // إرسال البيانات إلى خادم Express  
            fetch('/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: emailInput, message: messageInput })
            })
            .then(response => response.json())
            .then(data => {
                sendingMessage.style.display = 'none';
                Submit.innerHTML=data.message.includes('نجاح') ? "تم الإرسال": "فشل الإرسال"
                Submit.style.backgroundColor = data.message.includes('نجاح') ? 'green' : 'red';
                document.getElementById('contactForm').reset();
            })
            .catch(error => {
                Submit.innerHTML="فشل الإرسال"
                Submit.style.backgroundColor='red'
            });
        });