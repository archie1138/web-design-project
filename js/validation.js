/**
 * K-Explore Events - Form Validation Module
 * Robust client-side validation with real-time feedback and accessibility attributes.
 */

export const FormValidator = {
  rules: {
    name: {
      validate: (val) => {
        const trimmed = (val || '').trim();
        if (trimmed.length < 3) return 'Full name must be at least 3 characters long.';
        if (!/^[a-zA-Z\s.'-]+$/.test(trimmed)) return 'Name should only contain letters and spaces.';
        return null;
      }
    },
    email: {
      validate: (val) => {
        const trimmed = (val || '').trim();
        if (!trimmed) return 'Email address is required.';
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(trimmed)) return 'Please enter a valid email address (e.g., name@example.com).';
        return null;
      }
    },
    phone: {
      validate: (val) => {
        const clean = (val || '').replace(/[\s\-()]/g, '');
        if (!clean) return 'Phone number is required.';
        // Allows 10 digits or 10 digits prefixed with country code (+91, 91, etc.)
        const phoneRegex = /^(\+?\d{1,3})?[6-9]\d{9}$/;
        if (!phoneRegex.test(clean)) {
          return 'Enter a valid 10-digit mobile number (e.g., 9876543210).';
        }
        return null;
      }
    },
    eventSelect: {
      validate: (val) => {
        if (!val || val === '') return 'Please select an event to register for.';
        return null;
      }
    },
    ticketType: {
      validate: (val) => {
        if (!val || val === '') return 'Please select your ticket category.';
        return null;
      }
    },
    terms: {
      validate: (checked) => {
        if (!checked) return 'You must agree to the event guidelines & terms.';
        return null;
      }
    }
  },

  /**
   * Validate a single input field and update its UI feedback state
   */
  validateField(inputElement) {
    if (!inputElement) return true;

    const fieldName = inputElement.name || inputElement.id;
    const rule = this.rules[fieldName];
    if (!rule) return true;

    const value = inputElement.type === 'checkbox' ? inputElement.checked : inputElement.value;
    const errorMessage = rule.validate(value);

    const group = inputElement.closest('.form-group') || inputElement.parentElement;
    const errorDisplay = group ? group.querySelector('.form-error-msg') : null;

    if (errorMessage) {
      inputElement.classList.add('invalid');
      inputElement.classList.remove('valid');
      inputElement.setAttribute('aria-invalid', 'true');
      if (errorDisplay) {
        errorDisplay.textContent = errorMessage;
        errorDisplay.style.display = 'block';
      }
      return false;
    } else {
      inputElement.classList.remove('invalid');
      // Only mark valid if non-empty
      if (value) {
        inputElement.classList.add('valid');
      } else {
        inputElement.classList.remove('valid');
      }
      inputElement.setAttribute('aria-invalid', 'false');
      if (errorDisplay) {
        errorDisplay.textContent = '';
        errorDisplay.style.display = 'none';
      }
      return true;
    }
  },

  /**
   * Validate all inputs within a form
   */
  validateForm(formElement) {
    let isValid = true;
    const inputs = formElement.querySelectorAll('input, select, textarea');

    inputs.forEach(input => {
      const fieldValid = this.validateField(input);
      if (!fieldValid && isValid) {
        isValid = false;
        input.focus(); // Focus the first invalid field
      }
    });

    return isValid;
  },

  /**
   * Attach live validation listeners to a form
   */
  attachLiveValidation(formElement) {
    const inputs = formElement.querySelectorAll('input, select, textarea');

    inputs.forEach(input => {
      // Validate on blur
      input.addEventListener('blur', () => this.validateField(input));

      // Clear errors on input for smoother UX
      input.addEventListener('input', () => {
        if (input.classList.contains('invalid')) {
          this.validateField(input);
        }
      });

      if (input.tagName === 'SELECT' || input.type === 'checkbox') {
        input.addEventListener('change', () => this.validateField(input));
      }
    });
  },

  /**
   * Reset form validation state
   */
  resetValidation(formElement) {
    const inputs = formElement.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.classList.remove('valid', 'invalid');
      input.removeAttribute('aria-invalid');
    });

    const errorDisplays = formElement.querySelectorAll('.form-error-msg');
    errorDisplays.forEach(el => {
      el.textContent = '';
      el.style.display = 'none';
    });
  }
};

