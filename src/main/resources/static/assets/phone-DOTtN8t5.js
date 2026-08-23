//#region src/utils/phone.js
var VIETNAMESE_PHONE_PATTERN = /^(?:0[0-9]{9}|[1-9][0-9]{8}|(?:\+?84)[0-9]{9})$/;
function normalizeVietnamesePhone(value) {
	const phone = String(value || "").replace(/[\s.-]/g, "");
	if (phone.startsWith("+84")) return phone;
	if (phone.startsWith("84")) return `+${phone}`;
	if (phone.startsWith("0")) return `+84${phone.slice(1)}`;
	return phone ? `+84${phone}` : "";
}
function isValidVietnamesePhone(value) {
	return VIETNAMESE_PHONE_PATTERN.test(String(value || "").replace(/[\s.-]/g, ""));
}
//#endregion
export { normalizeVietnamesePhone as n, isValidVietnamesePhone as t };
