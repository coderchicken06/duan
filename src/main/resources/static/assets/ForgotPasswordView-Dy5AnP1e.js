import { D as createCommentVNode, Dt as toDisplayString, K as withCtx, M as createVNode, O as createElementBlock, T as createBaseVNode, V as openBlock, W as resolveComponent, j as createTextVNode, n as authApi, q as withDirectives, tt as ref } from "./api-Cd2rmWmR.js";
import { f as withModifiers, n as _plugin_vue_export_helper_default, o as useRouter, u as vModelText } from "./index-BCOVk736.js";
//#region src/views/ForgotPasswordView.vue
var _hoisted_1 = { class: "container cs-container py-5" };
var _hoisted_2 = { class: "row justify-content-center" };
var _hoisted_3 = { class: "col-12 col-md-6" };
var _hoisted_4 = { class: "cs-card p-4 auth-card" };
var _hoisted_5 = {
	key: 0,
	class: "alert alert-danger cart-alert show error"
};
var ForgotPasswordView_default = /*#__PURE__*/ _plugin_vue_export_helper_default({
	__name: "ForgotPasswordView",
	setup(__props) {
		const router = useRouter();
		const email = ref("");
		const error = ref("");
		async function submit() {
			error.value = "";
			const { data } = await authApi.forgotPassword(email.value);
			if (data.success) router.push("/verify-otp");
			else error.value = data.message;
		}
		return (_ctx, _cache) => {
			const _component_router_link = resolveComponent("router-link");
			return openBlock(), createElementBlock("div", _hoisted_1, [createBaseVNode("div", _hoisted_2, [createBaseVNode("div", _hoisted_3, [createBaseVNode("div", _hoisted_4, [
				_cache[4] || (_cache[4] = createBaseVNode("div", { class: "step-icon mb-3" }, "?", -1)),
				_cache[5] || (_cache[5] = createBaseVNode("h2", { class: "cs-page-title mb-2" }, "Quên mật khẩu", -1)),
				_cache[6] || (_cache[6] = createBaseVNode("p", { class: "text-secondary mb-4" }, "Nhập email đã đăng ký, chúng tôi sẽ gửi mã OTP xác thực.", -1)),
				createBaseVNode("form", {
					class: "vstack gap-3",
					onSubmit: withModifiers(submit, ["prevent"])
				}, [
					error.value ? (openBlock(), createElementBlock("div", _hoisted_5, toDisplayString(error.value), 1)) : createCommentVNode("", true),
					createBaseVNode("div", null, [_cache[1] || (_cache[1] = createBaseVNode("label", { class: "form-label" }, "Email đăng ký", -1)), withDirectives(createBaseVNode("input", {
						"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => email.value = $event),
						type: "email",
						class: "form-control",
						required: "",
						placeholder: "vidu@email.com",
						autocomplete: "email"
					}, null, 512), [[vModelText, email.value]])]),
					_cache[3] || (_cache[3] = createBaseVNode("button", {
						class: "btn cs-btn cs-btn-primary w-100",
						type: "submit"
					}, "Gửi mã OTP", -1)),
					createVNode(_component_router_link, {
						class: "text-center fw-semibold",
						to: "/login"
					}, {
						default: withCtx(() => [..._cache[2] || (_cache[2] = [createTextVNode("← Quay lại đăng nhập", -1)])]),
						_: 1
					})
				], 32)
			])])])]);
		};
	}
}, [["__scopeId", "data-v-a2398c62"]]);
//#endregion
export { ForgotPasswordView_default as default };
