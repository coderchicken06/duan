import { D as createCommentVNode, Dt as toDisplayString, O as createElementBlock, T as createBaseVNode, Tt as normalizeClass, V as openBlock, f as profileApi, q as withDirectives, tt as ref, z as onMounted } from "./api-BIOmrm3q.js";
import { d as vModelText, n as useAuthStore, o as useRouter, p as withModifiers, t as _plugin_vue_export_helper_default } from "./index-B5QpE601.js";
import { t as notifyDataUpdated } from "./useAutoRefresh-B7w7pWdx.js";
//#region src/views/ProfileView.vue
var _hoisted_1 = { class: "container cs-container py-5" };
var _hoisted_2 = { class: "cs-card profile-card overflow-hidden" };
var _hoisted_3 = { class: "profile-header p-4" };
var _hoisted_4 = { class: "avatar" };
var _hoisted_5 = { class: "p-4" };
var _hoisted_6 = { key: 0 };
var _hoisted_7 = ["value"];
var _hoisted_8 = {
	key: 0,
	class: "alert alert-success cart-alert show"
};
var ProfileView_default = /*#__PURE__*/ _plugin_vue_export_helper_default({
	__name: "ProfileView",
	setup(__props) {
		const router = useRouter();
		const auth = useAuthStore();
		const profile = ref(null);
		const msg = ref("");
		const pwd = ref({
			oldPassword: "",
			newPassword: "",
			confirmPassword: ""
		});
		const pwdMsg = ref("");
		const pwdOk = ref(false);
		onMounted(async () => {
			const { data } = await profileApi.get();
			if (data.success) profile.value = { ...data };
		});
		async function updateProfile() {
			const { data } = await profileApi.update(profile.value);
			msg.value = data.message || "Cập nhật thành công";
			if (data.success !== false) notifyDataUpdated();
			if (data.requiresVerification) {
				auth.user = null;
				router.push({
					path: "/verify-email",
					query: {
						username: data.username,
						email: data.email
					}
				});
			}
		}
		async function changePassword() {
			const { data } = await profileApi.changePassword(pwd.value);
			pwdOk.value = data.success !== false;
			pwdMsg.value = data.message;
			if (pwdOk.value) notifyDataUpdated();
		}
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1, [createBaseVNode("div", _hoisted_2, [createBaseVNode("div", _hoisted_3, [createBaseVNode("div", _hoisted_4, toDisplayString(profile.value?.fullname?.charAt(0) || profile.value?.username?.charAt(0) || "U"), 1), _cache[5] || (_cache[5] = createBaseVNode("div", null, [createBaseVNode("h2", { class: "cs-page-title mb-1" }, "Hồ sơ cá nhân"), createBaseVNode("p", { class: "mb-0 text-secondary" }, "Quản lý thông tin và bảo mật tài khoản")], -1))]), createBaseVNode("div", _hoisted_5, [profile.value ? (openBlock(), createElementBlock("div", _hoisted_6, [
				createBaseVNode("form", {
					class: "vstack gap-3",
					onSubmit: withModifiers(updateProfile, ["prevent"])
				}, [
					createBaseVNode("div", null, [_cache[6] || (_cache[6] = createBaseVNode("label", { class: "form-label" }, "Username", -1)), createBaseVNode("input", {
						value: profile.value.username,
						class: "form-control",
						disabled: ""
					}, null, 8, _hoisted_7)]),
					createBaseVNode("div", null, [_cache[7] || (_cache[7] = createBaseVNode("label", { class: "form-label" }, "Họ tên", -1)), withDirectives(createBaseVNode("input", {
						"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => profile.value.fullname = $event),
						class: "form-control"
					}, null, 512), [[vModelText, profile.value.fullname]])]),
					createBaseVNode("div", null, [_cache[8] || (_cache[8] = createBaseVNode("label", { class: "form-label" }, "Email", -1)), withDirectives(createBaseVNode("input", {
						"onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => profile.value.email = $event),
						class: "form-control"
					}, null, 512), [[vModelText, profile.value.email]])]),
					msg.value ? (openBlock(), createElementBlock("div", _hoisted_8, toDisplayString(msg.value), 1)) : createCommentVNode("", true),
					_cache[9] || (_cache[9] = createBaseVNode("button", { class: "btn cs-btn cs-btn-primary" }, "Cập nhật", -1))
				], 32),
				_cache[11] || (_cache[11] = createBaseVNode("hr", { class: "my-4" }, null, -1)),
				_cache[12] || (_cache[12] = createBaseVNode("h5", { class: "fw-bold" }, "Đổi mật khẩu", -1)),
				createBaseVNode("form", {
					class: "vstack gap-3 mt-3",
					onSubmit: withModifiers(changePassword, ["prevent"])
				}, [
					withDirectives(createBaseVNode("input", {
						"onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => pwd.value.oldPassword = $event),
						type: "password",
						class: "form-control",
						placeholder: "Mật khẩu cũ"
					}, null, 512), [[vModelText, pwd.value.oldPassword]]),
					withDirectives(createBaseVNode("input", {
						"onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => pwd.value.newPassword = $event),
						type: "password",
						class: "form-control",
						placeholder: "Mật khẩu mới"
					}, null, 512), [[vModelText, pwd.value.newPassword]]),
					withDirectives(createBaseVNode("input", {
						"onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => pwd.value.confirmPassword = $event),
						type: "password",
						class: "form-control",
						placeholder: "Xác nhận mật khẩu"
					}, null, 512), [[vModelText, pwd.value.confirmPassword]]),
					pwdMsg.value ? (openBlock(), createElementBlock("div", {
						key: 0,
						class: normalizeClass(["alert cart-alert show", [pwdOk.value ? "alert-success" : "alert-danger", { error: !pwdOk.value }]])
					}, toDisplayString(pwdMsg.value), 3)) : createCommentVNode("", true),
					_cache[10] || (_cache[10] = createBaseVNode("button", { class: "btn cs-btn cs-btn-warning" }, "Đổi mật khẩu", -1))
				], 32)
			])) : createCommentVNode("", true)])])]);
		};
	}
}, [["__scopeId", "data-v-3e217a38"]]);
//#endregion
export { ProfileView_default as default };
