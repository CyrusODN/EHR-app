export const validateInput = (value, name) => {
    let errors = [];

    // Check for empty value first
    if (!value || value.trim() === "") {
        errors.push("validation.field_required");
        return errors;
    }

    if (name === "pesel") {
        const digits = value.replace(/\D/g, "");
        if (digits.length !== 11) {
            errors.push("PESEL must be exactly 11 digits");
        }
    }

    if (name === "email") {
        // Email regex pattern
        const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        
        // Test the email pattern
        if (!emailPattern.test(value)) {
            errors.push("validation.invalid_email");
        }
    }

    if (name === "postalCode") {
        const postalPattern = /^\d{2}-\d{3}$/;
        if (!postalPattern.test(value)) {
            errors.push("Postal code must be in 00-000 format");
        }
    }

    if (name === "phone" || name === "alternativePhone") {
        const digits = value.replace(/\D/g, "");
        if (digits.length !== 9) {
            errors.push("Phone number must be exactly 9 digits");
        }
    }

    if (name === "password" || name === "confirmPassword") {
        if (value.length < 6) {
            errors.push("validation.password_min_length");
        }
    }

    return errors;
};