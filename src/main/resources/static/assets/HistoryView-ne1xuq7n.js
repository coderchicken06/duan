import { D as createCommentVNode, Dt as toDisplayString, O as createElementBlock, S as Fragment, T as createBaseVNode, U as renderList, V as openBlock, g as supportApi, tt as ref, z as onMounted } from "./api-lWF_eiJ8.js";
import { t as _plugin_vue_export_helper_default } from "./index-LltwIOcO.js";
import { n as useAutoRefresh } from "./useAutoRefresh-DbvPryYR.js";
//#region src/views/HistoryView.vue
var _hoisted_1 = { class: "container cs-container py-5" };
var _hoisted_2 = {
	key: 0,
	class: "text-center py-5"
};
var _hoisted_3 = {
	key: 1,
	class: "alert alert-danger",
	role: "alert"
};
var _hoisted_4 = {
	key: 2,
	class: "table-responsive cs-card p-3"
};
var _hoisted_5 = { class: "table cs-table mb-0" };
var _hoisted_6 = {
	key: 0,
	class: "detail-line"
};
var _hoisted_7 = {
	key: 1,
	class: "detail-line"
};
var _hoisted_8 = {
	key: 0,
	class: "text-center cs-muted py-4"
};
var HistoryView_default = /*#__PURE__*/ _plugin_vue_export_helper_default({
	__name: "HistoryView",
	setup(__props) {
		const requests = ref([]);
		const loading = ref(true);
		const error = ref("");
		const typeLabel = (type) => ({
			service: "Đặt lịch dịch vụ",
			consulting: "Tư vấn mua xe",
			chat: "Tư vấn trực tuyến",
			warranty: "Bảo hành / phản hồi"
		})[String(type || "").toLowerCase()] || "Yêu cầu khác";
		const formatAppointment = (request) => {
			if (!request.appointmentDate) return "-";
			return `${(/* @__PURE__ */ new Date(`${request.appointmentDate}T00:00:00`)).toLocaleDateString("vi-VN")}${request.appointmentTime ? ` ${String(request.appointmentTime).slice(0, 5)}` : ""}`;
		};
		async function loadRequests() {
			try {
				const supportResult = await supportApi.getMy();
				requests.value = supportResult.data.data || [];
			} catch (e) {
				error.value = "Không thể tải lịch sử yêu cầu hỗ trợ. Vui lòng thử lại sau.";
			} finally {
				loading.value = false;
			}
		}
		onMounted(loadRequests);
		useAutoRefresh(loadRequests);
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1, [_cache[2] || (_cache[2] = createBaseVNode("h2", { class: "cs-page-title mb-4" }, "Lịch sử yêu cầu hỗ trợ", -1)), loading.value ? (openBlock(), createElementBlock("div", _hoisted_2, [..._cache[0] || (_cache[0] = [createBaseVNode("span", {
				class: "spinner-border text-danger",
				role: "status",
				"aria-hidden": "true"
			}, null, -1)])])) : error.value ? (openBlock(), createElementBlock("div", _hoisted_3, toDisplayString(error.value), 1)) : (openBlock(), createElementBlock("div", _hoisted_4, [createBaseVNode("table", _hoisted_5, [_cache[1] || (_cache[1] = createBaseVNode("thead", null, [createBaseVNode("tr", null, [
				createBaseVNode("th", null, "ID"),
				createBaseVNode("th", null, "Loại"),
				createBaseVNode("th", null, "Chi tiết"),
				createBaseVNode("th", null, "Trạng thái"),
				createBaseVNode("th", null, "Lịch hẹn")
			])], -1)), createBaseVNode("tbody", null, [(openBlock(true), createElementBlock(Fragment, null, renderList(requests.value, (r) => {
				return openBlock(), createElementBlock("tr", { key: r.id }, [
					createBaseVNode("td", null, toDisplayString(r.id), 1),
					createBaseVNode("td", null, toDisplayString(typeLabel(r.type)), 1),
					createBaseVNode("td", null, [
						createBaseVNode("div", null, toDisplayString(r.content), 1),
						r.carInfo ? (openBlock(), createElementBlock("small", _hoisted_6, "Xe: " + toDisplayString(r.carInfo), 1)) : createCommentVNode("", true),
						r.serviceType ? (openBlock(), createElementBlock("small", _hoisted_7, "Dịch vụ: " + toDisplayString(r.serviceType), 1)) : createCommentVNode("", true)
					]),
					createBaseVNode("td", null, toDisplayString(r.status), 1),
					createBaseVNode("td", null, toDisplayString(formatAppointment(r)), 1)
				]);
			}), 128))])]), requests.value.length === 0 ? (openBlock(), createElementBlock("p", _hoisted_8, "Chưa có yêu cầu nào.")) : createCommentVNode("", true)]))]);
		};
	}
}, [["__scopeId", "data-v-fe23b569"]]);
//#endregion
export { HistoryView_default as default };
