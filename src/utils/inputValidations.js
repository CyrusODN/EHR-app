export const validateInput = (value, name) => {
    let errors = [];

    // Check for empty value first
    if (!value || value.trim() === "") {
        errors.push("validation.field_required");
        return errors;
    }

    if (name === "email") {
        // Email regex pattern
        const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        
        // Test the email pattern
        if (!emailPattern.test(value)) {
            errors.push("validation.invalid_email");
        }
    }

    if (name === "password" || name === "confirmPassword") {
        if (value.length < 6) {
            errors.push("validation.password_min_length");
        }
    }

    return errors;
};