
const EMAILJS_SERVICE_ID  = 'service_uyrswh9';
const EMAILJS_TEMPLATE_ID = 'template_zfosm96';
const EMAILJS_PUBLIC_KEY  = '9UUbU0XP7W-ef9J93';

// Check if EmailJS is really configured
function isEmailJSConfigured() {
    return (
        EMAILJS_SERVICE_ID &&
        EMAILJS_TEMPLATE_ID &&
        EMAILJS_PUBLIC_KEY
    );
}

// Convert internal type to readable label
function getTypeLabel(type) {
    const map = {
        student: 'Student',
        phd: 'PhD Candidate',
        faculty: 'Faculty',
        staff: 'Staff',
        temporary: 'Temporary / External'
    };
    return map[type] || type;
}

/**
 * Send confirmation email after identity creation
 */
async function sendConfirmationEmail({ fullName, type, uid, status, email }) {
    const userType = getTypeLabel(type);

    /* Simulation Mode */
    if (!isEmailJSConfigured() || !window.emailjs) {
        console.log('%c[Email Simulation]', 'color:#2196F3;font-weight:bold;');
        console.log({
            to_email: email,
            full_name: fullName,
            user_type: userType,
            uid,
            status
        });

        return {
            success: true,
            simulated: true
        };
    }

    /*  Real EmailJS Mode */
    try {
        emailjs.init(EMAILJS_PUBLIC_KEY);

        const templateParams = {
            to_email: email,
            full_name: fullName,
            user_type: userType,
            uid: uid,
            status: status
        };

        await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            templateParams,
            { publicKey: EMAILJS_PUBLIC_KEY }
        );

        console.log(
            '%c[EmailJS] Confirmation email sent to ' + email,
            'color:#4CAF50;font-weight:bold;'
        );

        return {
            success: true,
            simulated: false
        };

    } catch (error) {
        console.error('[EmailJS] Error sending email:', error);
        return {
            success: false,
            simulated: false,
            error: error.text || error.message
        };
    }
}