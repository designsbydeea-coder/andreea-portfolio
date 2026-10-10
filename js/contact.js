// UI-only feedback. Connect delivery before presenting a message as sent.
const contactForm = document.querySelector('.contact-form');
const submitButton = contactForm.querySelector('.send-message');
const formStatus = document.getElementById('form-status');
const requiredFields = [...contactForm.querySelectorAll('[required]')];
const pendingMessage = 'Message delivery is not connected yet.';

submitButton.disabled = false;
submitButton.title = pendingMessage;

function validateFields() {
  for (const field of requiredFields) {
    field.setCustomValidity(field.value.trim() ? '' : 'Please fill out this field.');
  }
}

contactForm.addEventListener('input', () => {
  validateFields();
  submitButton.classList.remove('is-complete');
  submitButton.title = pendingMessage;
  formStatus.textContent = pendingMessage;
});

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  validateFields();
  if (!contactForm.reportValidity()) return;

  submitButton.classList.add('is-complete');
  formStatus.textContent = `Form complete. ${pendingMessage}`;
  submitButton.title = formStatus.textContent;
});
