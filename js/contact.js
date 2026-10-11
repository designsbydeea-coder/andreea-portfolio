const contactForm = document.querySelector('.contact-form');
const submitButton = contactForm.querySelector('.send-message');
const formStatus = document.getElementById('form-status');
const requiredFields = [...contactForm.querySelectorAll('[required]')];
let submitting = false;
let invalidField = null;

const validationMessage = document.createElement('div');
validationMessage.id = 'contact-validation';
validationMessage.className = 'contact-validation';
validationMessage.setAttribute('role', 'alert');
const validationIcon = document.createElement('img');
validationIcon.src = new URL('../assets/icons/exclamation mark.svg', import.meta.url).href;
validationIcon.alt = '';
validationIcon.width = 18;
validationIcon.height = 18;
const validationText = document.createElement('span');
validationMessage.append(validationIcon, validationText);

// Retain HTML constraints and the native POST fallback if JavaScript is unavailable.
contactForm.noValidate = true;
submitButton.setAttribute('aria-live', 'polite');

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

function showStatus(message = '') {
  formStatus.textContent = message;
  formStatus.hidden = !message;
}

contactForm.addEventListener('input', () => {
  for (const field of requiredFields) {
    field.setCustomValidity(field.value.trim() ? '' : 'Please fill out this field.');
  }
  if (invalidField) {
    if (invalidField.validity.valid) clearValidationMessage();
    else validationText.textContent = validationTextFor(invalidField);
  }
  submitButton.classList.remove('is-complete');
  submitButton.textContent = 'submit';
  showStatus();
});

contactForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (submitting) return;
  showStatus();
  for (const field of requiredFields) {
    field.setCustomValidity(field.value.trim() ? '' : 'Please fill out this field.');
  }
  const firstInvalidField = requiredFields.find(field => !field.validity.valid);
  clearValidationMessage();
  if (firstInvalidField) {
    invalidField = firstInvalidField;
    invalidField.setAttribute('aria-invalid', 'true');
    invalidField.setAttribute('aria-describedby', [invalidField.getAttribute('aria-describedby'), validationMessage.id].filter(Boolean).join(' '));
    validationText.textContent = validationTextFor(invalidField);
    invalidField.focus();
    invalidField.closest('.form-field').append(validationMessage);
    return;
  }

  submitting = true;
  submitButton.disabled = true;
  submitButton.classList.remove('is-complete');
  contactForm.setAttribute('aria-busy', 'true');
  try {
    const response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(contactForm)).toString()
    });
    if (!response.ok) throw new Error('Submission rejected');
    submitButton.classList.add('is-complete');
    submitButton.textContent = 'submission received';
  } catch {
    showStatus('Your message could not be sent. Please try again.');
  } finally {
    submitting = false;
    submitButton.disabled = false;
    contactForm.removeAttribute('aria-busy');
  }
});
