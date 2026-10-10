// UI-only feedback. Connect delivery before presenting a message as sent.
const contactForm = document.querySelector('.contact-form');
const submitButton = contactForm.querySelector('.send-message');
const formStatus = document.getElementById('form-status');
const requiredFields = [...contactForm.querySelectorAll('[required]')];
const pendingMessage = 'Message delivery is not connected yet.';
let invalidField = null;
const validationMessage = document.createElement('div');
validationMessage.id = 'contact-validation';
validationMessage.className = 'contact-validation';
validationMessage.setAttribute('role', 'alert');
const validationIcon = document.createElement('img');
validationIcon.src = 'assets/icons/exclamation%20mark.svg';
validationIcon.alt = '';
validationIcon.width = 18;
validationIcon.height = 18;
const validationText = document.createElement('span');
validationMessage.append(validationIcon, validationText);

// Keep native constraints, but present their errors through the custom UI.
contactForm.noValidate = true;

submitButton.disabled = false;
submitButton.title = pendingMessage;

function validateFields() {
  for (const field of requiredFields) {
    field.setCustomValidity(field.value.trim() ? '' : 'Please fill out this field.');
  }
}

function clearValidationMessage() {
  if (invalidField) {
    invalidField.removeAttribute('aria-invalid');
    const descriptions = (invalidField.getAttribute('aria-describedby') || '')
      .split(/\s+/).filter(id => id && id !== validationMessage.id);
    if (descriptions.length) invalidField.setAttribute('aria-describedby', descriptions.join(' '));
    else invalidField.removeAttribute('aria-describedby');
  }
  invalidField = null;
  validationMessage.remove();
}

function validationTextFor(field) {
  return field.validity.valueMissing || field.validity.customError
    ? 'please fill out this field'
    : field.validity.typeMismatch ? 'please enter a valid email address' : field.validationMessage;
}

function showValidationMessage(field) {
  clearValidationMessage();
  invalidField = field;
  field.setAttribute('aria-invalid', 'true');
  field.setAttribute('aria-describedby', [field.getAttribute('aria-describedby'), validationMessage.id]
    .filter(Boolean).join(' '));
  validationText.textContent = validationTextFor(field);
  field.focus();
  field.closest('.form-field').append(validationMessage);
}

contactForm.addEventListener('input', () => {
  validateFields();
  if (invalidField) {
    if (invalidField.validity.valid) clearValidationMessage();
    else validationText.textContent = validationTextFor(invalidField);
  }
  submitButton.classList.remove('is-complete');
  submitButton.title = pendingMessage;
  formStatus.textContent = pendingMessage;
});

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  validateFields();
  const firstInvalidField = requiredFields.find(field => !field.validity.valid);
  if (firstInvalidField) {
    showValidationMessage(firstInvalidField);
    return;
  }
  clearValidationMessage();

  submitButton.classList.add('is-complete');
  formStatus.textContent = `Form complete. ${pendingMessage}`;
  submitButton.title = formStatus.textContent;
});
