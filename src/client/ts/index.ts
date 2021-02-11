window.onload = () => {
    document.body.classList.remove('preload');
};

const form: HTMLFormElement = document.getElementById('contact-form') as HTMLFormElement; 
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    disableSubmitButton();
    hideContactFormError();
    hideContactFormSuccess();

    const contactData = new FormData(form);
    if (ENV === 'development') {
        contactData.forEach((value, key) => console.log(`${key}:`, value));
    }

    await sendContactData(contactData);
    enableSubmitButton();
});

async function sendContactData (contactData: FormData) {
    const contactFormEndpoint = ENV === 'development'
        ? config.buildSettings.development.contactFormEndpoint
        : config.buildSettings.production.contactFormEndpoint;

    const response = await fetch(`${contactFormEndpoint}/api/contact/submit-form`, {
        method: 'post',
        body: contactData
    });
    const data = await response.json();
    if (data.status === 'error') {
        showContactFormError(data.reason);
    }
    else {
        showContactFormSuccess();
    }
}

function enableSubmitButton () {
    document.getElementById('submit-contact-form').removeAttribute('disabled');
    changeSubmitButtonIcon(false);
};

function disableSubmitButton () {
    document.getElementById('submit-contact-form').setAttribute('disabled', '');
    changeSubmitButtonIcon(true);
}

function showContactFormError (message: string) {
    document.getElementById('error-message').innerText = message;
    document.getElementById('error-block').style.display = 'block';
}

function hideContactFormError () {
    document.getElementById('error-block').style.display = 'none';
}

function showContactFormSuccess () {
    document.getElementById('success-block').style.display = 'block';
}

function hideContactFormSuccess () {
    document.getElementById('success-block').style.display = 'none';
}

function changeSubmitButtonIcon (inProgress: boolean) {
    document.getElementById('submit-button-icon-before').style.display = inProgress ? 'none' : 'inline-block';
    document.getElementById('submit-button-icon-inprogress').style.display = inProgress ? 'inline-block' : 'none';
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