window.onload = () => {
    document.body.classList.remove('preload');
};

const form: HTMLFormElement = document.getElementById('contact-form') as HTMLFormElement; 
form.addEventListener('submit', (event) => {
    event.preventDefault();

    const contactData = new FormData(form);
    if (ENV === 'development') {
        contactData.forEach((value, key) => console.log(`${key}:`, value));
    }

    sendContactData(contactData);
});

async function sendContactData (contactData: FormData) {
    const response = await fetch('http://localhost:3000/api/contact/submit-form', {
        method: 'post',
        body: contactData
    });
    const data = await response.json();
    console.log(data);
    if (data.status === 'error') {
        showContactFormError(data.reason);
    }
}

function showContactFormError (message: string) {
    document.getElementById('error-message').innerText = message;
    document.getElementById('error-block').style.display = 'block';
}

function hideContactFormError () {
    document.getElementById('error-block').style.display = 'none';
}

let isMobileNavbarVisible = false;
function toggleMobileNavbar () {
    const mobileNavbar = document.getElementById('mobile-navbar');
    const body = document.body;

    isMobileNavbarVisible = !isMobileNavbarVisible;
    if (isMobileNavbarVisible) {
        body.classList.add('mobile-menu-opened');
        mobileNavbar.classList.add('opened', 'is-visible');
    }
    else {
        body.classList.remove('mobile-menu-opened');
        mobileNavbar.classList.remove('opened');
        setTimeout(() => mobileNavbar.classList.remove('is-visible'), 500);
    }
}

globalThis.toggleMobileNavbar = toggleMobileNavbar;