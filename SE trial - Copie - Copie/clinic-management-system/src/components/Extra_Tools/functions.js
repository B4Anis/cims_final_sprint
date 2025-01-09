//functions.js
export function isValidAlgerianPhoneNumber(phoneNumber) {
    const algerianPhoneRegex = /^(05|06|07)\d{8}$/;
    return algerianPhoneRegex.test(phoneNumber);
}

export function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

export function isValidName(name) {
    const nameRegex = /^[a-zA-Zàâçéèêëîïôûùüÿñæœ' -]+$/;
    return nameRegex.test(name);
}

export function isValidNumber(value) {
    // Convert the input to a string and check if it matches only digits
    const numericRegex = /^\d+$/;
    return numericRegex.test(value.toString());
}