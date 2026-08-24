import { D as createCommentVNode, Dt as toDisplayString, O as createElementBlock, T as createBaseVNode, V as openBlock, n as authApi, q as withDirectives, tt as ref } from "./api-Cd2rmWmR.js";
import { f as withModifiers, n as _plugin_vue_export_helper_default, o as useRouter, u as vModelText } from "./index-BCOVk736.js";
//#region src/views/VerifyOtpView.vue
var _hoisted_1 = { class: "container cs-container py-5" };
var _hoisted_2 = { class: "row justify-content-center" };
var _hoisted_3 = { class: "col-12 col-md-6" };
var _hoisted_4 = { class: "cs-card p-4" };
var _hoisted_5 = {
	key: 0,
	class: "alert alert-danger cart-alert show error"
};
var VerifyOtpView_default = /*#__PURE__*/ _plugin_vue_export_helper_default({
	__name: "VerifyOtpView",
	setup(__props) {
		const router = useRouter();
		const otp = ref("");
		const error = ref("");
		async function submit() {
			error.value = "";
			const { data } = await authApi.verifyOtp(otp.value);
			if (data.success) router.push("/reset-password");
			else error.value = data.message;
		}
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1, [createBaseVNode("div", _hoisted_2, [createBaseVNode("div", _hoisted_3, [createBaseVNode("div", _hoisted_4, [
				_cache[3] || (_cache[3] = createBaseVNode("div", { class: "step-label mb-3" }, "BƯỚC 2/3", -1)),
				_cache[4] || (_cache[4] = createBaseVNode("h2", { class: "cs-page-title mb-2" }, "Xác nhận OTP", -1)),
				_cache[5] || (_cache[5] = createBaseVNode("p", { class: "text-secondary mb-4" }, "Nhập mã xác thực đã được gửi đến email của bạn.", -1)),
				createBaseVNode("form", {
					class: "vstack gap-3",
					onSubmit: withModifiers(submit, ["prevent"])
				}, [
					error.value ? (openBlock(), createElementBlock("div", _hoisted_5, toDisplayString(error.value), 1)) : createCommentVNode("", true),
					createBaseVNode("div", null, [_cache[1] || (_cache[1] = createBaseVNode("label", { class: "form-label" }, "Mã OTP", -1)), withDirectives(createBaseVNode("input", {
						"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => otp.value = $event),
						class: "form-control otp-input",
						required: "",
						placeholder: "Nhập mã OTP",
						inputmode: "numeric",
						autocomplete: "one-time-code"
					}, null, 512), [[vModelText, otp.value]])]),
					_cache[2] || (_cache[2] = createBaseVNode("button", {
						class: "btn cs-btn cs-btn-primary w-100",
						type: "submit"
					}, "Xác nhận mã", -1))
				], 32)
			])])])]);
		};
	}
}, [["__scopeId", "data-v-6d94ce98"]]);
//#endregion
export { VerifyOtpView_default as default };
