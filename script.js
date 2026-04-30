// Initialize EmailJS
emailjs.init("etsZVoO1lAN-ZUkj3");

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// 1. Create a variable to store the OTP
let generatedOTP = ""; 
let isEmailVerified = false;

// 2. Handle sending the OTP
document.getElementById('verifyBtn').addEventListener('click', function() {
    const emailInput = document.getElementById('email').value;
    const verifyBtn = document.getElementById('verifyBtn');
    
    if (emailInput.trim() === "") {
        alert("Please enter your e-mail first.");
        return;
    } 
    if (!validateEmail(emailInput)) {
        alert("Please enter a valid e-mail format.");
        return;
    }

    // Generate a random 6-digit number
    generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();

    verifyBtn.innerText = "Sending Code...";
    verifyBtn.disabled = true;

    // Pass the generated OTP to your EmailJS template
    const templateParams = {
        to_email: emailInput,
        otp_code: generatedOTP
    };

    emailjs.send("service_h5jhofa", "template_h56yrwh", templateParams)
        .then(function(response) {
            alert("Verification code sent to " + emailInput);
            verifyBtn.innerText = "Code Sent";
            
            // Show the OTP input section
            document.getElementById('otpSection').style.display = 'block';
        }, function(error) {
            console.error("FAILED...", error);
            alert("Failed to send code. Please try again.");
            verifyBtn.innerText = "Send Verification Code";
            verifyBtn.disabled = false;
        });
});

// 3. Handle checking the OTP
document.getElementById('confirmOtpBtn').addEventListener('click', function() {
    const userInput = document.getElementById('otpInput').value;

    if (userInput === generatedOTP) {
        alert("Email successfully verified!");
        isEmailVerified = true;
        
        // Hide the OTP section and lock the email input
        document.getElementById('otpSection').style.display = 'none';
        document.getElementById('email').readOnly = true;
        document.getElementById('verifyBtn').innerText = "Verified ✓";
        document.getElementById('verifyBtn').style.color = "green";
    } else {
        alert("Incorrect verification code. Please try again.");
    }
});

// 4. Send Data to Google Sheets
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxcql3_w3xaPoVObWwFJXJ9V1jmDx15maiSkDScudZhaiVvJp2is7oaV7czNXbj9UNU/exec";

document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault(); 
    
    // Check if email is verified
    if (!isEmailVerified) {
        alert("Please verify your email before submitting the form.");
        return;
    }
    
    const submitBtn = document.querySelector('.submit-btn');
    submitBtn.innerText = "Submitting...";
    submitBtn.disabled = true;

    const formData = new FormData(this);

    // Send the data to Google Sheets
    fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        body: formData,
        mode: 'no-cors', 
        redirect: 'follow'
    })
    .then(() => {
        alert("Form submitted successfully! Your record has been saved.");
        
        // Reset the form and states
        document.getElementById('contactForm').reset();
        isEmailVerified = false;
        document.getElementById('email').readOnly = false;
        document.getElementById('verifyBtn').innerText = "Send Verification Code";
        document.getElementById('verifyBtn').disabled = false;
        document.getElementById('verifyBtn').style.color = "#666";
    })
    .catch(error => {
        console.error("Fetch Error!", error);
        alert("There was an error saving your record. Please check the console.");
    })
    .finally(() => {
        // Restore the submit button
        submitBtn.innerText = "Submit";
        submitBtn.disabled = false;
    });
});