//#region src/utils/phone.js
var VIETNAMESE_PHONE_PATTERN = /^0[35789]\d{8}$/;
function cleanPhone(value) {
	return String(value || "").replace(/[\s.()\-]/g, "");
}
function normalizePhone(value) {
	const phone = cleanPhone(value);
	if (phone.startsWith("+84")) return `0${phone.slice(3)}`;
	if (phone.startsWith("84")) return `0${phone.slice(2)}`;
	return phone;
}
function isValidPhone(value) {
	return VIETNAMESE_PHONE_PATTERN.test(normalizePhone(value));
}
var normalizeVietnamesePhone = normalizePhone;
var isValidVietnamesePhone = isValidPhone;
//#endregion
export { normalizeVietnamesePhone as n, isValidVietnamesePhone as t };
