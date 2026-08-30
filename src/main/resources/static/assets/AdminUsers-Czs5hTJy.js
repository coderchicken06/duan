import { D as createCommentVNode, Dt as toDisplayString, G as watch, K as withCtx, M as createVNode, O as createElementBlock, R as onBeforeUnmount, S as Fragment, T as createBaseVNode, Tt as normalizeClass, U as renderList, V as openBlock, W as resolveComponent, j as createTextVNode, t as adminApi, tt as ref, z as onMounted } from "./api-lWF_eiJ8.js";
import { a as useRoute, t as _plugin_vue_export_helper_default } from "./index-LltwIOcO.js";
import { t as showCartToast } from "./useCartToast-CRv33ZAZ.js";
import { n as useAutoRefresh, t as notifyDataUpdated } from "./useAutoRefresh-DbvPryYR.js";
//#region src/views/admin/AdminUsers.vue
var _hoisted_1 = { class: "container cs-container py-5" };
var _hoisted_2 = { class: "d-flex justify-content-between align-items-center mb-4" };
var _hoisted_3 = { class: "table-responsive cs-card p-3" };
var _hoisted_4 = { class: "table cs-table mb-0" };
var _hoisted_5 = ["onClick"];
var _hoisted_6 = { key: 0 };
var AdminUsers_default = /*#__PURE__*/ _plugin_vue_export_helper_default({
	__name: "AdminUsers",
	setup(__props) {
		const users = ref([]);
		const route = useRoute();
		onMounted(() => {
			load();
			window.addEventListener("focus", load);
		});
		onBeforeUnmount(() => window.removeEventListener("focus", load));
		useAutoRefresh(load);
		watch(() => route.fullPath, load);
		async function load() {
			const { data } = await adminApi.getUsers();
			users.value = Array.isArray(data) ? data : data.data || [];
		}
		async function remove(username) {
			if (!confirm("Xóa user?")) return;
			const previousUsers = users.value;
			users.value = users.value.filter((user) => user.username !== username);
			try {
				const { data } = await adminApi.deleteUser(username);
				if (data.success === false) {
					users.value = previousUsers;
					showCartToast(data.message || "Không thể xóa người dùng", "error");
					return;
				}
				notifyDataUpdated();
				showCartToast(data.message || "Đã xóa người dùng");
			} catch (error) {
				users.value = previousUsers;
				showCartToast(error.response?.data?.message || "Không thể xóa người dùng", "error");
			}
		}
		return (_ctx, _cache) => {
			const _component_router_link = resolveComponent("router-link");
			return openBlock(), createElementBlock("div", _hoisted_1, [createBaseVNode("div", _hoisted_2, [_cache[1] || (_cache[1] = createBaseVNode("div", null, [createBaseVNode("span", { class: "admin-eyebrow" }, "QUẢN TRỊ"), createBaseVNode("h2", { class: "cs-page-title mb-0" }, "Quản lý khách hàng")], -1)), createVNode(_component_router_link, {
				class: "btn cs-btn cs-btn-primary",
				to: "/admin/users/create"
			}, {
				default: withCtx(() => [..._cache[0] || (_cache[0] = [createTextVNode("+ Thêm người dùng", -1)])]),
				_: 1
			})]), createBaseVNode("div", _hoisted_3, [createBaseVNode("table", _hoisted_4, [_cache[4] || (_cache[4] = createBaseVNode("thead", null, [createBaseVNode("tr", null, [
				createBaseVNode("th", null, "Username"),
				createBaseVNode("th", null, "Họ tên"),
				createBaseVNode("th", null, "Email"),
				createBaseVNode("th", null, "Role"),
				createBaseVNode("th")
			])], -1)), createBaseVNode("tbody", null, [(openBlock(true), createElementBlock(Fragment, null, renderList(users.value, (u) => {
				return openBlock(), createElementBlock("tr", { key: u.username }, [
					createBaseVNode("td", null, toDisplayString(u.username), 1),
					createBaseVNode("td", null, toDisplayString(u.fullname), 1),
					createBaseVNode("td", null, toDisplayString(u.email), 1),
					createBaseVNode("td", null, [createBaseVNode("span", { class: normalizeClass(["role-badge", u.role === "ROLE_ADMIN" ? "is-admin" : ""]) }, toDisplayString(u.role), 3)]),
					createBaseVNode("td", null, [createVNode(_component_router_link, {
						to: `/admin/users/edit/${u.username}`,
						class: "btn btn-sm cs-btn-ghost me-1"
					}, {
						default: withCtx(() => [..._cache[2] || (_cache[2] = [createTextVNode("Sửa", -1)])]),
						_: 1
					}, 8, ["to"]), createBaseVNode("button", {
						class: "btn btn-sm cs-btn-danger",
						onClick: ($event) => remove(u.username)
					}, "Xóa", 8, _hoisted_5)])
				]);
			}), 128)), users.value.length === 0 ? (openBlock(), createElementBlock("tr", _hoisted_6, [..._cache[3] || (_cache[3] = [createBaseVNode("td", {
				colspan: "5",
				class: "empty-cell"
			}, "Chưa có người dùng nào.", -1)])])) : createCommentVNode("", true)])])])]);
		};
	}
}, [["__scopeId", "data-v-73afd432"]]);
//#endregion
export { AdminUsers_default as default };
