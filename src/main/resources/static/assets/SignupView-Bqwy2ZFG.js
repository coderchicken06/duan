import { D as createCommentVNode, Dt as toDisplayString, K as withCtx, M as createVNode, O as createElementBlock, T as createBaseVNode, V as openBlock, W as resolveComponent, j as createTextVNode, n as authApi, q as withDirectives, tt as ref } from "./api-lWF_eiJ8.js";
import { d as vModelText, l as vModelDynamic, o as useRouter, p as withModifiers, t as _plugin_vue_export_helper_default } from "./index-LltwIOcO.js";
import { t as notifyDataUpdated } from "./useAutoRefresh-DbvPryYR.js";
//#region src/views/SignupView.vue
var _hoisted_1 = { class: "container cs-container py-5" };
var _hoisted_2 = { class: "row justify-content-center" };
var _hoisted_3 = { class: "col-12 col-md-7 col-lg-5" };
var _hoisted_4 = { class: "cs-card overflow-hidden" };
var _hoisted_5 = { class: "p-4 pt-3" };
var _hoisted_6 = {
	key: 0,
	class: "alert alert-danger cart-alert show error"
};
var _hoisted_7 = { class: "input-group" };
var _hoisted_8 = ["type"];
var _hoisted_9 = ["disabled"];
var _hoisted_10 = {
	key: 0,
	class: "spinner-border spinner-border-sm me-2"
};
var _hoisted_11 = { class: "text-center text-secondary" };
var SignupView_default = /*#__PURE__*/ _plugin_vue_export_helper_default({
	__name: "SignupView",
	setup(__props) {
		const router = useRouter();
		const loading = ref(false);
		const showPassword = ref(false);
		const error = ref("");
		const form = ref({
			username: "",
			fullname: "",
			email: "",
			password: ""
		});
		async function submit() {
			if (loading.value) return;
			loading.value = true;
			error.value = "";
			try {
				const { data } = await authApi.signup(form.value);
				if (data.success) {
					notifyDataUpdated();
					router.push({
						path: "/verify-email",
						query: {
							username: data.username,
							email: data.email
						}
					});
				} else error.value = data.message;
			} catch (e) {
				error.value = e.response?.data?.message || "Không thể tạo tài khoản. Vui lòng thử lại.";
			} finally {
				loading.value = false;
			}
		}
		return (_ctx, _cache) => {
			const _component_router_link = resolveComponent("router-link");
			return openBlock(), createElementBlock("div", _hoisted_1, [createBaseVNode("div", _hoisted_2, [createBaseVNode("div", _hoisted_3, [createBaseVNode("div", _hoisted_4, [_cache[11] || (_cache[11] = createBaseVNode("div", { class: "form-header p-4 pb-3" }, [
				createBaseVNode("span", { class: "eyebrow" }, "THÀNH VIÊN MỚI"),
				createBaseVNode("h2", { class: "cs-page-title mt-2 mb-1" }, "Đăng ký tài khoản"),
				createBaseVNode("p", { class: "text-secondary mb-0" }, "Tạo tài khoản để đặt xe và theo dõi đơn hàng.")
			], -1)), createBaseVNode("div", _hoisted_5, [createBaseVNode("form", {
				class: "vstack gap-3",
				onSubmit: withModifiers(submit, ["prevent"])
			}, [
				error.value ? (openBlock(), createElementBlock("div", _hoisted_6, toDisplayString(error.value), 1)) : createCommentVNode("", true),
				createBaseVNode("div", null, [_cache[5] || (_cache[5] = createBaseVNode("label", { class: "form-label" }, "Tên đăng nhập", -1)), withDirectives(createBaseVNode("input", {
					"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => form.value.username = $event),
					class: "form-control",
					required: "",
					placeholder: "Nhập tên đăng nhập",
					autocomplete: "username"
				}, null, 512), [[vModelText, form.value.username]])]),
				createBaseVNode("div", null, [_cache[6] || (_cache[6] = createBaseVNode("label", { class: "form-label" }, "Họ tên", -1)), withDirectives(createBaseVNode("input", {
					"onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => form.value.fullname = $event),
					class: "form-control",
					placeholder: "Nhập họ và tên",
					autocomplete: "name"
				}, null, 512), [[vModelText, form.value.fullname]])]),
				createBaseVNode("div", null, [_cache[7] || (_cache[7] = createBaseVNode("label", { class: "form-label" }, "Email", -1)), withDirectives(createBaseVNode("input", {
					"onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => form.value.email = $event),
					type: "email",
					class: "form-control",
					required: "",
					placeholder: "vidu@email.com",
					autocomplete: "email"
				}, null, 512), [[vModelText, form.value.email]])]),
				createBaseVNode("div", null, [_cache[8] || (_cache[8] = createBaseVNode("label", { class: "form-label" }, "Mật khẩu", -1)), createBaseVNode("div", _hoisted_7, [withDirectives(createBaseVNode("input", {
					"onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => form.value.password = $event),
					type: showPassword.value ? "text" : "password",
					class: "form-control",
					required: "",
					minlength: "6",
					placeholder: "Tối thiểu 6 ký tự",
					autocomplete: "new-password"
				}, null, 8, _hoisted_8), [[vModelDynamic, form.value.password]]), createBaseVNode("button", {
					class: "btn password-toggle",
					type: "button",
					onClick: _cache[4] || (_cache[4] = ($event) => showPassword.value = !showPassword.value)
				}, toDisplayString(showPassword.value ? "Ẩn" : "Hiện"), 1)])]),
				createBaseVNode("button", {
					class: "btn cs-btn cs-btn-primary w-100",
					type: "submit",
					disabled: loading.value
				}, [loading.value ? (openBlock(), createElementBlock("span", _hoisted_10)) : createCommentVNode("", true), createTextVNode(toDisplayString(loading.value ? "Đang tạo tài khoản..." : "Đăng ký"), 1)], 8, _hoisted_9),
				createBaseVNode("div", _hoisted_11, [_cache[10] || (_cache[10] = createTextVNode("Đã có tài khoản? ", -1)), createVNode(_component_router_link, {
					to: "/login",
					class: "fw-semibold"
				}, {
					default: withCtx(() => [..._cache[9] || (_cache[9] = [createTextVNode("Đăng nhập", -1)])]),
					_: 1
				})])
			], 32)])])])])]);
		};
	}
}, [["__scopeId", "data-v-f658de1f"]]);
//#endregion
export { SignupView_default as default };
