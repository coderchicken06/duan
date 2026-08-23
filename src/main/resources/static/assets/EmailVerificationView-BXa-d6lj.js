import { B as onUnmounted, D as createCommentVNode, Dt as toDisplayString, O as createElementBlock, T as createBaseVNode, Tt as normalizeClass, V as openBlock, j as createTextVNode, n as authApi, ot as unref, q as withDirectives, tt as ref } from "./api-Cd2rmWmR.js";
import { a as useRoute, f as withModifiers, n as _plugin_vue_export_helper_default, o as useRouter, u as vModelText } from "./index-DOyj8jjE.js";
//#region src/views/EmailVerificationView.vue
var _hoisted_1 = { class: "container cs-container py-5" };
var _hoisted_2 = { class: "verification-card cs-card p-4" };
var _hoisted_3 = { class: "text-secondary" };
var _hoisted_4 = { key: 0 };
var _hoisted_5 = { key: 1 };
var _hoisted_6 = ["disabled"];
var _hoisted_7 = ["disabled"];
var EmailVerificationView_default = /*#__PURE__*/ _plugin_vue_export_helper_default({
	__name: "EmailVerificationView",
	setup(__props) {
		const route = useRoute();
		const router = useRouter();
		const username = ref(String(route.query.username || ""));
		const email = String(route.query.email || "");
		const code = ref("");
		const message = ref("");
		const success = ref(false);
		const loading = ref(false);
		const resending = ref(false);
		let redirectTimeout = null;
		async function verify() {
			loading.value = true;
			message.value = "";
			try {
				const { data } = await authApi.verifyEmail(username.value, code.value);
				success.value = data.success;
				message.value = data.message;
				if (data.success) redirectTimeout = setTimeout(() => router.push({
					path: "/login",
					query: { verified: "1" }
				}), 1200);
			} catch (error) {
				success.value = false;
				message.value = error.response?.data?.message || "Không thể xác thực email.";
			} finally {
				loading.value = false;
			}
		}
		onUnmounted(() => {
			if (redirectTimeout) clearTimeout(redirectTimeout);
		});
		async function resend() {
			resending.value = true;
			message.value = "";
			try {
				const { data } = await authApi.resendVerification(username.value);
				success.value = data.success;
				message.value = data.message;
			} catch (error) {
				success.value = false;
				message.value = error.response?.data?.message || "Không thể gửi lại mã xác thực.";
			} finally {
				resending.value = false;
			}
		}
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1, [createBaseVNode("div", _hoisted_2, [
				_cache[6] || (_cache[6] = createBaseVNode("span", { class: "eyebrow" }, "XÁC THỰC EMAIL", -1)),
				_cache[7] || (_cache[7] = createBaseVNode("h2", { class: "cs-page-title mt-2 mb-2" }, "Kích hoạt tài khoản", -1)),
				createBaseVNode("p", _hoisted_3, [
					_cache[2] || (_cache[2] = createTextVNode(" Nhập mã gồm 6 chữ số đã gửi đến ", -1)),
					unref(email) ? (openBlock(), createElementBlock("strong", _hoisted_4, toDisplayString(unref(email)), 1)) : (openBlock(), createElementBlock("span", _hoisted_5, "email đăng ký của bạn")),
					_cache[3] || (_cache[3] = createTextVNode(". ", -1))
				]),
				createBaseVNode("form", {
					class: "vstack gap-3 mt-4",
					onSubmit: withModifiers(verify, ["prevent"])
				}, [
					message.value ? (openBlock(), createElementBlock("div", {
						key: 0,
						class: normalizeClass(["alert cart-alert show", [success.value ? "alert-success" : "alert-danger", { error: !success.value }]])
					}, toDisplayString(message.value), 3)) : createCommentVNode("", true),
					createBaseVNode("div", null, [_cache[4] || (_cache[4] = createBaseVNode("label", { class: "form-label" }, "Tên đăng nhập", -1)), withDirectives(createBaseVNode("input", {
						"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => username.value = $event),
						class: "form-control",
						required: "",
						autocomplete: "username"
					}, null, 512), [[
						vModelText,
						username.value,
						void 0,
						{ trim: true }
					]])]),
					createBaseVNode("div", null, [_cache[5] || (_cache[5] = createBaseVNode("label", { class: "form-label" }, "Mã xác thực", -1)), withDirectives(createBaseVNode("input", {
						"onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => code.value = $event),
						class: "form-control code-input",
						required: "",
						inputmode: "numeric",
						autocomplete: "one-time-code",
						maxlength: "6",
						pattern: "[0-9]{6}",
						placeholder: "Nhập mã OTP"
					}, null, 512), [[
						vModelText,
						code.value,
						void 0,
						{ trim: true }
					]])]),
					createBaseVNode("button", {
						class: "btn cs-btn cs-btn-primary w-100",
						disabled: loading.value
					}, toDisplayString(loading.value ? "Đang xác thực..." : "Xác thực email"), 9, _hoisted_6),
					createBaseVNode("button", {
						type: "button",
						class: "btn cs-btn cs-btn-ghost w-100",
						disabled: resending.value,
						onClick: resend
					}, toDisplayString(resending.value ? "Đang gửi..." : "Gửi lại mã xác thực"), 9, _hoisted_7)
				], 32)
			])]);
		};
	}
}, [["__scopeId", "data-v-47f0aaa2"]]);
//#endregion
export { EmailVerificationView_default as default };
