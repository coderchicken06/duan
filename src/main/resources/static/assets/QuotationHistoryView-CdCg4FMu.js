import { D as createCommentVNode, Dt as toDisplayString, K as withCtx, M as createVNode, O as createElementBlock, S as Fragment, T as createBaseVNode, U as renderList, V as openBlock, W as resolveComponent, c as formatPrice, j as createTextVNode, m as quotationApi, ot as unref, tt as ref, z as onMounted } from "./api-Cd2rmWmR.js";
import { t as useAutoRefresh } from "./useAutoRefresh-DjAfN_Vr.js";
//#region src/views/QuotationHistoryView.vue
var _hoisted_1 = { class: "container cs-container py-5" };
var _hoisted_2 = {
	key: 0,
	class: "text-center py-5"
};
var _hoisted_3 = {
	key: 1,
	class: "alert alert-danger"
};
var _hoisted_4 = {
	key: 2,
	class: "table-responsive cs-card p-3"
};
var _hoisted_5 = { class: "table cs-table mb-0" };
var _hoisted_6 = {
	key: 0,
	class: "text-center cs-muted py-4"
};
var _sfc_main = {
	__name: "QuotationHistoryView",
	setup(__props) {
		const quotationList = ref([]);
		const loading = ref(true);
		const error = ref("");
		const formatDate = (value) => value ? new Date(value).toLocaleDateString("vi-VN") : "-";
		async function loadQuotations() {
			try {
				const { data } = await quotationApi.getMine();
				quotationList.value = data.data || [];
			} catch (e) {
				error.value = e.response?.data?.message || "Không thể tải lịch sử yêu cầu báo giá.";
			} finally {
				loading.value = false;
			}
		}
		onMounted(loadQuotations);
		useAutoRefresh(loadQuotations);
		return (_ctx, _cache) => {
			const _component_router_link = resolveComponent("router-link");
			return openBlock(), createElementBlock("div", _hoisted_1, [_cache[3] || (_cache[3] = createBaseVNode("h2", { class: "cs-page-title mb-4" }, "Lịch sử yêu cầu báo giá", -1)), loading.value ? (openBlock(), createElementBlock("div", _hoisted_2, [..._cache[0] || (_cache[0] = [createBaseVNode("span", { class: "spinner-border text-danger" }, null, -1)])])) : error.value ? (openBlock(), createElementBlock("div", _hoisted_3, toDisplayString(error.value), 1)) : (openBlock(), createElementBlock("div", _hoisted_4, [createBaseVNode("table", _hoisted_5, [_cache[2] || (_cache[2] = createBaseVNode("thead", null, [createBaseVNode("tr", null, [
				createBaseVNode("th", null, "Mã"),
				createBaseVNode("th", null, "Ngày tạo"),
				createBaseVNode("th", null, "Tổng tiền"),
				createBaseVNode("th", null, "Trạng thái"),
				createBaseVNode("th")
			])], -1)), createBaseVNode("tbody", null, [(openBlock(true), createElementBlock(Fragment, null, renderList(quotationList.value, (quote) => {
				return openBlock(), createElementBlock("tr", { key: quote.id }, [
					createBaseVNode("td", null, toDisplayString(quote.quotationNo || `BG-${quote.id}`), 1),
					createBaseVNode("td", null, toDisplayString(formatDate(quote.quotationDate)), 1),
					createBaseVNode("td", null, toDisplayString(unref(formatPrice)(quote.totalPrice)) + " VNĐ", 1),
					createBaseVNode("td", null, toDisplayString(quote.status), 1),
					createBaseVNode("td", null, [createVNode(_component_router_link, { to: `/quotations/${quote.id}` }, {
						default: withCtx(() => [..._cache[1] || (_cache[1] = [createTextVNode("Xem", -1)])]),
						_: 1
					}, 8, ["to"])])
				]);
			}), 128))])]), quotationList.value.length === 0 ? (openBlock(), createElementBlock("p", _hoisted_6, "Chưa có báo giá nào.")) : createCommentVNode("", true)]))]);
		};
	}
};
//#endregion
export { _sfc_main as default };
