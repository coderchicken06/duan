import { D as createCommentVNode, Dt as toDisplayString, O as createElementBlock, S as Fragment, T as createBaseVNode, U as renderList, V as openBlock, g as supportApi, q as withDirectives, tt as ref, z as onMounted } from "./api-Cd2rmWmR.js";
import { l as vModelSelect, n as _plugin_vue_export_helper_default } from "./index-BCOVk736.js";
import { t as showCartToast } from "./useCartToast-CRv33ZAZ.js";
//#region src/views/admin/AdminSupport.vue
var _hoisted_1 = { class: "container cs-container py-5" };
var _hoisted_2 = { class: "table-responsive cs-card p-3" };
var _hoisted_3 = { class: "table cs-table mb-0" };
var _hoisted_4 = { key: 0 };
var _hoisted_5 = { key: 1 };
var _hoisted_6 = { key: 2 };
var _hoisted_7 = ["onUpdate:modelValue", "onChange"];
var _hoisted_8 = ["onClick"];
var _hoisted_9 = { key: 0 };
var AdminSupport_default = /*#__PURE__*/ _plugin_vue_export_helper_default({
	__name: "AdminSupport",
	setup(__props) {
		const requests = ref([]);
		const formatAppointment = (request) => {
			return `${(/* @__PURE__ */ new Date(`${request.appointmentDate}T00:00:00`)).toLocaleDateString("vi-VN")}${request.appointmentTime ? ` ${String(request.appointmentTime).slice(0, 5)}` : ""}`;
		};
		onMounted(load);
		async function load() {
			const { data } = await supportApi.getAll();
			requests.value = data.data || [];
		}
		async function updateStatus(r) {
			try {
				await supportApi.updateStatus(r.id, r.status);
				await load();
				showCartToast("Đã cập nhật trạng thái yêu cầu");
			} catch (error) {
				await load();
				showCartToast(error.response?.data?.message || "Không thể cập nhật trạng thái yêu cầu", "error");
			}
		}
		async function remove(id) {
			if (!confirm("Xóa yêu cầu?")) return;
			try {
				await supportApi.delete(id);
				await load();
				showCartToast("Đã xóa yêu cầu hỗ trợ");
			} catch (error) {
				showCartToast(error.response?.data?.message || "Không thể xóa yêu cầu hỗ trợ", "error");
			}
		}
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1, [
				_cache[3] || (_cache[3] = createBaseVNode("span", { class: "admin-eyebrow" }, "CHĂM SÓC KHÁCH HÀNG", -1)),
				_cache[4] || (_cache[4] = createBaseVNode("h2", { class: "cs-page-title mb-4" }, "Quản lý yêu cầu hỗ trợ", -1)),
				createBaseVNode("div", _hoisted_2, [createBaseVNode("table", _hoisted_3, [_cache[2] || (_cache[2] = createBaseVNode("thead", null, [createBaseVNode("tr", null, [
					createBaseVNode("th", null, "ID"),
					createBaseVNode("th", null, "KH"),
					createBaseVNode("th", null, "Loại"),
					createBaseVNode("th", null, "Chi tiết"),
					createBaseVNode("th", null, "Trạng thái"),
					createBaseVNode("th")
				])], -1)), createBaseVNode("tbody", null, [(openBlock(true), createElementBlock(Fragment, null, renderList(requests.value, (r) => {
					return openBlock(), createElementBlock("tr", { key: r.id }, [
						createBaseVNode("td", null, toDisplayString(r.id), 1),
						createBaseVNode("td", null, toDisplayString(r.name) + " (" + toDisplayString(r.phone) + ")", 1),
						createBaseVNode("td", null, toDisplayString(r.type), 1),
						createBaseVNode("td", null, [
							createBaseVNode("div", null, toDisplayString(r.content), 1),
							r.carInfo ? (openBlock(), createElementBlock("small", _hoisted_4, "Xe: " + toDisplayString(r.carInfo), 1)) : createCommentVNode("", true),
							r.serviceType ? (openBlock(), createElementBlock("small", _hoisted_5, "Dịch vụ: " + toDisplayString(r.serviceType), 1)) : createCommentVNode("", true),
							r.appointmentDate ? (openBlock(), createElementBlock("small", _hoisted_6, " Lịch hẹn: " + toDisplayString(formatAppointment(r)), 1)) : createCommentVNode("", true)
						]),
						createBaseVNode("td", null, [withDirectives(createBaseVNode("select", {
							"onUpdate:modelValue": ($event) => r.status = $event,
							class: "form-select form-select-sm",
							onChange: ($event) => updateStatus(r)
						}, [..._cache[0] || (_cache[0] = [
							createBaseVNode("option", null, "Chờ xử lý", -1),
							createBaseVNode("option", null, "Đang xử lý", -1),
							createBaseVNode("option", null, "Đã xử lý", -1),
							createBaseVNode("option", null, "Đã hủy", -1)
						])], 40, _hoisted_7), [[vModelSelect, r.status]])]),
						createBaseVNode("td", null, [createBaseVNode("button", {
							class: "btn btn-sm cs-btn-danger",
							onClick: ($event) => remove(r.id)
						}, "Xóa", 8, _hoisted_8)])
					]);
				}), 128)), requests.value.length === 0 ? (openBlock(), createElementBlock("tr", _hoisted_9, [..._cache[1] || (_cache[1] = [createBaseVNode("td", {
					colspan: "6",
					class: "empty-cell"
				}, "Chưa có yêu cầu hỗ trợ nào.", -1)])])) : createCommentVNode("", true)])])])
			]);
		};
	}
}, [["__scopeId", "data-v-8d5501fa"]]);
//#endregion
export { AdminSupport_default as default };
