import { Dt as toDisplayString, K as withCtx, M as createVNode, O as createElementBlock, T as createBaseVNode, V as openBlock, W as resolveComponent, j as createTextVNode, q as withDirectives, t as adminApi, tt as ref, w as computed, z as onMounted } from "./api-Cd2rmWmR.js";
import { a as useRoute, f as withModifiers, i as useAuthStore, l as vModelSelect, n as _plugin_vue_export_helper_default, o as useRouter, u as vModelText } from "./index-DOyj8jjE.js";
import { t as showCartToast } from "./useCartToast-CRv33ZAZ.js";
//#region src/views/admin/AdminUserForm.vue
var _hoisted_1 = { class: "container cs-container py-5" };
var _hoisted_2 = { class: "cs-card user-form-card overflow-hidden" };
var _hoisted_3 = { class: "form-header p-4" };
var _hoisted_4 = { class: "cs-page-title mt-1 mb-0" };
var _hoisted_5 = { class: "p-4" };
var _hoisted_6 = ["disabled"];
var _hoisted_7 = ["required"];
var _hoisted_8 = { class: "d-flex gap-2" };
var AdminUserForm_default = /*#__PURE__*/ _plugin_vue_export_helper_default({
	__name: "AdminUserForm",
	setup(__props) {
		const route = useRoute();
		const router = useRouter();
		const auth = useAuthStore();
		const isEdit = computed(() => !!route.params.username);
		const form = ref({
			username: "",
			fullname: "",
			email: "",
			password: "",
			role: "ROLE_USER"
		});
		onMounted(async () => {
			if (isEdit.value) {
				const { data } = await adminApi.getUsers();
				const u = (Array.isArray(data) ? data : data.data || []).find((x) => x.username === route.params.username);
				if (u) form.value = {
					...u,
					password: ""
				};
			}
		});
		async function submit() {
			try {
				const res = isEdit.value ? await adminApi.updateUser(String(route.params.username), form.value) : await adminApi.createUser(form.value);
				if (res.data.success === false) {
					showCartToast(res.data.message || "Không thể lưu người dùng", "error");
					return;
				}
				auth.updateCurrentUser({
					username: isEdit.value ? String(route.params.username) : form.value.username,
					fullname: form.value.fullname,
					email: form.value.email,
					role: form.value.role
				});
				showCartToast(res.data.message || (isEdit.value ? "Đã cập nhật người dùng" : "Đã thêm người dùng"));
				await router.push("/admin/users");
			} catch (error) {
				showCartToast(error.response?.data?.message || "Không thể lưu người dùng", "error");
			}
		}
		return (_ctx, _cache) => {
			const _component_router_link = resolveComponent("router-link");
			return openBlock(), createElementBlock("div", _hoisted_1, [createBaseVNode("div", _hoisted_2, [createBaseVNode("div", _hoisted_3, [_cache[5] || (_cache[5] = createBaseVNode("span", { class: "admin-eyebrow" }, "NGƯỜI DÙNG", -1)), createBaseVNode("h2", _hoisted_4, toDisplayString(isEdit.value ? "Cập nhật người dùng" : "Thêm người dùng"), 1)]), createBaseVNode("div", _hoisted_5, [createBaseVNode("form", {
				class: "vstack gap-3",
				onSubmit: withModifiers(submit, ["prevent"])
			}, [
				createBaseVNode("div", null, [_cache[6] || (_cache[6] = createBaseVNode("label", { class: "form-label" }, "Username", -1)), withDirectives(createBaseVNode("input", {
					"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => form.value.username = $event),
					class: "form-control",
					disabled: isEdit.value,
					required: ""
				}, null, 8, _hoisted_6), [[vModelText, form.value.username]])]),
				createBaseVNode("div", null, [_cache[7] || (_cache[7] = createBaseVNode("label", { class: "form-label" }, "Họ tên", -1)), withDirectives(createBaseVNode("input", {
					"onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => form.value.fullname = $event),
					class: "form-control"
				}, null, 512), [[vModelText, form.value.fullname]])]),
				createBaseVNode("div", null, [_cache[8] || (_cache[8] = createBaseVNode("label", { class: "form-label" }, "Email", -1)), withDirectives(createBaseVNode("input", {
					"onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => form.value.email = $event),
					type: "email",
					class: "form-control"
				}, null, 512), [[vModelText, form.value.email]])]),
				createBaseVNode("div", null, [_cache[9] || (_cache[9] = createBaseVNode("label", { class: "form-label" }, "Password", -1)), withDirectives(createBaseVNode("input", {
					"onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => form.value.password = $event),
					type: "password",
					class: "form-control",
					required: !isEdit.value
				}, null, 8, _hoisted_7), [[vModelText, form.value.password]])]),
				createBaseVNode("div", null, [_cache[11] || (_cache[11] = createBaseVNode("label", { class: "form-label" }, "Role", -1)), withDirectives(createBaseVNode("select", {
					"onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => form.value.role = $event),
					class: "form-select"
				}, [..._cache[10] || (_cache[10] = [createBaseVNode("option", { value: "ROLE_USER" }, "USER", -1), createBaseVNode("option", { value: "ROLE_ADMIN" }, "ADMIN", -1)])], 512), [[vModelSelect, form.value.role]])]),
				createBaseVNode("div", _hoisted_8, [createVNode(_component_router_link, {
					class: "btn cs-btn cs-btn-ghost flex-grow-1",
					to: "/admin/users"
				}, {
					default: withCtx(() => [..._cache[12] || (_cache[12] = [createTextVNode("Hủy", -1)])]),
					_: 1
				}), _cache[13] || (_cache[13] = createBaseVNode("button", {
					class: "btn cs-btn cs-btn-primary flex-grow-1",
					type: "submit"
				}, "Lưu thông tin", -1))])
			], 32)])])]);
		};
	}
}, [["__scopeId", "data-v-7e90f385"]]);
//#endregion
export { AdminUserForm_default as default };
