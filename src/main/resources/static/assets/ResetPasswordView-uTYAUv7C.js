import { D as createCommentVNode, Dt as toDisplayString, O as createElementBlock, T as createBaseVNode, Tt as normalizeClass, V as openBlock, n as authApi, q as withDirectives, tt as ref, w as computed } from "./api-BIOmrm3q.js";
import { l as vModelDynamic, o as useRouter, p as withModifiers, t as _plugin_vue_export_helper_default } from "./index-B5QpE601.js";
//#region src/views/ResetPasswordView.vue
var _hoisted_1 = { class: "container cs-container py-5" };
var _hoisted_2 = { class: "row justify-content-center" };
var _hoisted_3 = { class: "col-12 col-md-6" };
var _hoisted_4 = { class: "cs-card p-4" };
var _hoisted_5 = {
	key: 0,
	class: "alert alert-danger cart-alert show error"
};
var _hoisted_6 = { class: "input-group" };
var _hoisted_7 = ["type"];
var _hoisted_8 = { class: "input-group" };
var _hoisted_9 = ["type", "aria-invalid"];
var _hoisted_10 = {
	key: 0,
	class: "error-text"
};
var _hoisted_11 = ["disabled"];
var ResetPasswordView_default = /*#__PURE__*/ _plugin_vue_export_helper_default({
	__name: "ResetPasswordView",
	setup(__props) {
		const router = useRouter();
		const password = ref("");
		const confirmPassword = ref("");
		const error = ref("");
		const showPassword = ref(false);
		const showConfirmPassword = ref(false);
		const isPasswordMismatch = computed(() => confirmPassword.value.length > 0 && password.value !== confirmPassword.value);
		const isFormValid = computed(() => password.value.length >= 6 && password.value === confirmPassword.value);
		async function submit() {
			error.value = "";
			if (!isFormValid.value) {
				if (!isPasswordMismatch.value) error.value = "Mật khẩu mới phải có ít nhất 6 ký tự.";
				return;
			}
			const { data } = await authApi.resetPassword(password.value, confirmPassword.value);
			if (data.success) router.push({
				path: "/login",
				query: { resetSuccess: "1" }
			});
			else error.value = data.message;
		}
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1, [createBaseVNode("div", _hoisted_2, [createBaseVNode("div", _hoisted_3, [createBaseVNode("div", _hoisted_4, [
				_cache[6] || (_cache[6] = createBaseVNode("div", { class: "step-label mb-3" }, "BƯỚC 3/3", -1)),
				_cache[7] || (_cache[7] = createBaseVNode("h2", { class: "cs-page-title mb-2" }, "Đặt lại mật khẩu", -1)),
				_cache[8] || (_cache[8] = createBaseVNode("p", { class: "text-secondary mb-4" }, "Tạo mật khẩu mới để bảo vệ tài khoản.", -1)),
				createBaseVNode("form", {
					class: "vstack gap-3",
					onSubmit: withModifiers(submit, ["prevent"])
				}, [
					error.value ? (openBlock(), createElementBlock("div", _hoisted_5, toDisplayString(error.value), 1)) : createCommentVNode("", true),
					createBaseVNode("div", null, [_cache[4] || (_cache[4] = createBaseVNode("label", { class: "form-label" }, "Mật khẩu mới", -1)), createBaseVNode("div", _hoisted_6, [withDirectives(createBaseVNode("input", {
						"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => password.value = $event),
						type: showPassword.value ? "text" : "password",
						class: "form-control",
						required: "",
						placeholder: "Nhập mật khẩu mới",
						autocomplete: "new-password"
					}, null, 8, _hoisted_7), [[vModelDynamic, password.value]]), createBaseVNode("button", {
						class: "btn password-toggle",
						type: "button",
						onClick: _cache[1] || (_cache[1] = ($event) => showPassword.value = !showPassword.value)
					}, toDisplayString(showPassword.value ? "Ẩn" : "Hiện"), 1)])]),
					createBaseVNode("div", null, [
						_cache[5] || (_cache[5] = createBaseVNode("label", { class: "form-label" }, "Xác nhận mật khẩu", -1)),
						createBaseVNode("div", _hoisted_8, [withDirectives(createBaseVNode("input", {
							"onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => confirmPassword.value = $event),
							type: showConfirmPassword.value ? "text" : "password",
							class: normalizeClass(["form-control", { "input-error": isPasswordMismatch.value }]),
							"aria-invalid": isPasswordMismatch.value,
							required: "",
							placeholder: "Nhập lại mật khẩu",
							autocomplete: "new-password"
						}, null, 10, _hoisted_9), [[vModelDynamic, confirmPassword.value]]), createBaseVNode("button", {
							class: "btn password-toggle",
							type: "button",
							onClick: _cache[3] || (_cache[3] = ($event) => showConfirmPassword.value = !showConfirmPassword.value)
						}, toDisplayString(showConfirmPassword.value ? "Ẩn" : "Hiện"), 1)]),
						isPasswordMismatch.value ? (openBlock(), createElementBlock("p", _hoisted_10, "Mật khẩu không trùng khớp")) : createCommentVNode("", true)
					]),
					createBaseVNode("button", {
						class: "btn cs-btn cs-btn-primary w-100",
						type: "submit",
						disabled: isPasswordMismatch.value
					}, "Đổi mật khẩu", 8, _hoisted_11)
				], 32)
			])])])]);
		};
	}
}, [["__scopeId", "data-v-c745240d"]]);
//#endregion
export { ResetPasswordView_default as default };
