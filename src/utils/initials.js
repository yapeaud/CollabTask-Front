export function getInitials(firstname = "", lastname = "") {
    return `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase();
}
