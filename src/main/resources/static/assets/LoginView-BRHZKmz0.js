import { D as createCommentVNode, Dt as toDisplayString, K as withCtx, M as createVNode, O as createElementBlock, T as createBaseVNode, V as openBlock, W as resolveComponent, j as createTextVNode, q as withDirectives, tt as ref } from "./api-Cd2rmWmR.js";
import { a as useRoute, d as vModelText, i as useAuthStore, l as vModelDynamic, n as _plugin_vue_export_helper_default, o as useRouter, p as withModifiers } from "./index-BX99C7pg.js";
//#region src/views/LoginView.vue
var _hoisted_1 = { class: "auth-page py-5" };
var _hoisted_2 = { class: "container cs-container" };
var _hoisted_3 = { class: "row justify-content-center" };
var _hoisted_4 = { class: "col-12 col-md-7 col-lg-5" };
var _hoisted_5 = { class: "cs-card" };
var _hoisted_6 = { class: "p-4" };
var _hoisted_7 = {
	key: 0,
	class: "alert alert-danger cart-alert show error"
};
var _hoisted_8 = {
	key: 1,
	class: "alert alert-success cart-alert show"
};
var _hoisted_9 = {
	key: 2,
	class: "alert alert-success cart-alert show"
};
var _hoisted_10 = {
	key: 3,
	class: "alert alert-success cart-alert show"
};
var _hoisted_11 = { class: "input-group" };
var _hoisted_12 = ["type"];
var _hoisted_13 = ["disabled"];
var _hoisted_14 = {
	key: 0,
	class: "spinner-border spinner-border-sm me-2"
};
var _hoisted_15 = { class: "text-center mt-4" };
var LoginView_default = /*#__PURE__*/ _plugin_vue_export_helper_default({
	__name: "LoginView",
	setup(__props) {
		const route = useRoute();
		const router = useRouter();
		const auth = useAuthStore();
		const username = ref("");
		const password = ref("");
		const error = ref("");
		const loading = ref(false);
		const showPassword = ref(false);
		const registered = ref(route.query.registered === "1");
		const verified = ref(route.query.verified === "1");
		const resetSuccess = ref(route.query.resetSuccess === "1");
		async function submit() {
			if (loading.value) return;
			loading.value = true;
			error.value = "";
			try {
				const data = await auth.login(username.value, password.value);
				if (data.success) {
					const redirect = String(route.query.redirect || "");
					router.push(auth.isAdmin && (!redirect || redirect === "/") ? "/admin/dashboard" : redirect || "/");
				} else if (data.requiresVerification) router.push({
					path: "/verify-email",
					query: { username: data.username || username.value }
				});
				else error.value = data.message || "Đăng nhập không thành công";
			} finally {
				loading.value = false;
			}
		}
		return (_ctx, _cache) => {
			const _component_router_link = resolveComponent("router-link");
			return openBlock(), createElementBlock("div", _hoisted_1, [createBaseVNode("div", _hoisted_2, [createBaseVNode("div", _hoisted_3, [createBaseVNode("div", _hoisted_4, [createBaseVNode("div", _hoisted_5, [_cache[10] || (_cache[10] = createBaseVNode("div", { class: "cs-card-header p-4" }, [
				createBaseVNode("div", { class: "auth-icon mb-3" }, "ĐN"),
				createBaseVNode("h2", { class: "cs-page-title mb-1" }, "Đăng nhập"),
				createBaseVNode("div", { class: "cs-muted" }, "Đăng nhập để truy cập chức năng theo quyền.")
			], -1)), createBaseVNode("div", _hoisted_6, [createBaseVNode("form", {
				class: "vstack gap-3",
				onSubmit: withModifiers(submit, ["prevent"])
			}, [
				error.value ? (openBlock(), createElementBlock("div", _hoisted_7, toDisplayString(error.value), 1)) : createCommentVNode("", true),
				registered.value ? (openBlock(), createElementBlock("div", _hoisted_8, "Đăng ký thành công. Vui lòng đăng nhập.")) : createCommentVNode("", true),
				verified.value ? (openBlock(), createElementBlock("div", _hoisted_9, "Xác thực email thành công. Bạn có thể đăng nhập.")) : createCommentVNode("", true),
				resetSuccess.value ? (openBlock(), createElementBlock("div", _hoisted_10, "Đổi mật khẩu thành công. Vui lòng đăng nhập.")) : createCommentVNode("", true),
				createBaseVNode("div", null, [_cache[3] || (_cache[3] = createBaseVNode("label", { class: "form-label cs-muted" }, "Username", -1)), withDirectives(createBaseVNode("input", {
					"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => username.value = $event),
					class: "form-control",
					required: "",
					placeholder: "Nhập tên đăng nhập",
					autocomplete: "username"
				}, null, 512), [[vModelText, username.value]])]),
				createBaseVNode("div", null, [_cache[4] || (_cache[4] = createBaseVNode("label", { class: "form-label cs-muted" }, "Password", -1)), createBaseVNode("div", _hoisted_11, [withDirectives(createBaseVNode("input", {
					"onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => password.value = $event),
					type: showPassword.value ? "text" : "password",
					class: "form-control",
					required: "",
					placeholder: "Nhập mật khẩu",
					autocomplete: "current-password"
				}, null, 8, _hoisted_12), [[vModelDynamic, password.value]]), createBaseVNode("button", {
					class: "btn password-toggle",
					type: "button",
					onClick: _cache[2] || (_cache[2] = ($event) => showPassword.value = !showPassword.value)
				}, toDisplayString(showPassword.value ? "Ẩn" : "Hiện"), 1)])]),
				createVNode(_component_router_link, { to: "/forgot-password" }, {
					default: withCtx(() => [..._cache[5] || (_cache[5] = [createTextVNode("Quên mật khẩu?", -1)])]),
					_: 1
				}),
				createBaseVNode("button", {
					class: "btn cs-btn cs-btn-primary w-100",
					type: "submit",
					disabled: loading.value
				}, [loading.value ? (openBlock(), createElementBlock("span", _hoisted_14)) : createCommentVNode("", true), createTextVNode(toDisplayString(loading.value ? "Đang đăng nhập..." : "Đăng nhập"), 1)], 8, _hoisted_13),
				createVNode(_component_router_link, {
					class: "btn cs-btn cs-btn-ghost w-100",
					to: "/"
				}, {
					default: withCtx(() => [..._cache[6] || (_cache[6] = [createTextVNode("Về trang chủ", -1)])]),
					_: 1
				}),
				_cache[9] || (_cache[9] = createBaseVNode("div", { class: "text-center mt-3" }, [createBaseVNode("p", { class: "mb-2" }, "Hoặc đăng nhập nhanh bằng"), createBaseVNode("a", {
					class: "btn btn-outline-danger w-100",
					href: "/oauth2/authorization/google"
				}, "Đăng nhập bằng Google")], -1)),
				createBaseVNode("div", _hoisted_15, [_cache[8] || (_cache[8] = createBaseVNode("span", null, "Chưa có tài khoản? ", -1)), createVNode(_component_router_link, {
					to: "/signup",
					class: "fw-bold"
				}, {
					default: withCtx(() => [..._cache[7] || (_cache[7] = [createTextVNode("Tạo tài khoản", -1)])]),
					_: 1
				})])
			], 32)])]), _cache[11] || (_cache[11] = createBaseVNode("p", { class: "auth-footer text-center mt-3 mb-0" }, "CarStore · Đồng hành cùng mọi hành trình", -1))])])])]);
		};
	}
}, [["__scopeId", "data-v-8446c9c2"]]);
//#endregion
export { LoginView_default as default };
