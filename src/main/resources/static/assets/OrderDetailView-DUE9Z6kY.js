import { D as createCommentVNode, Dt as toDisplayString, K as withCtx, M as createVNode, O as createElementBlock, S as Fragment, T as createBaseVNode, U as renderList, V as openBlock, W as resolveComponent, c as formatPrice, j as createTextVNode, ot as unref, tt as ref, u as orderApi, z as onMounted } from "./api-lWF_eiJ8.js";
import { a as useRoute } from "./index-LltwIOcO.js";
import { n as useAutoRefresh } from "./useAutoRefresh-DbvPryYR.js";
//#region src/views/OrderDetailView.vue
var _hoisted_1 = {
	key: 0,
	class: "container cs-container py-5"
};
var _hoisted_2 = { class: "cs-page-title mb-4" };
var _hoisted_3 = { class: "cs-card p-4 mb-4" };
var _hoisted_4 = { key: 0 };
var _hoisted_5 = { class: "d-flex flex-wrap gap-2 mb-3" };
var _hoisted_6 = { class: "table-responsive cs-card p-3" };
var _hoisted_7 = { class: "table cs-table mb-0" };
var _sfc_main = {
	__name: "OrderDetailView",
	setup(__props) {
		const route = useRoute();
		const order = ref(null);
		const details = ref([]);
		async function loadOrder() {
			const { data } = await orderApi.getDetails(String(route.params.id));
			if (data.success) {
				order.value = data.order;
				details.value = data.details || [];
			}
		}
		onMounted(loadOrder);
		useAutoRefresh(loadOrder);
		function formatDate(d) {
			return d ? new Date(d).toLocaleDateString("vi-VN") : "";
		}
		return (_ctx, _cache) => {
			const _component_router_link = resolveComponent("router-link");
			return order.value ? (openBlock(), createElementBlock("div", _hoisted_1, [
				createBaseVNode("h2", _hoisted_2, "Chi tiết đơn hàng #" + toDisplayString(order.value.id), 1),
				createBaseVNode("div", _hoisted_3, [
					createBaseVNode("p", null, [_cache[0] || (_cache[0] = createBaseVNode("strong", null, "Khách hàng:", -1)), createTextVNode(" " + toDisplayString(order.value.username), 1)]),
					createBaseVNode("p", null, [_cache[1] || (_cache[1] = createBaseVNode("strong", null, "Địa chỉ:", -1)), createTextVNode(" " + toDisplayString(order.value.address), 1)]),
					createBaseVNode("p", null, [_cache[2] || (_cache[2] = createBaseVNode("strong", null, "Trạng thái:", -1)), createTextVNode(" " + toDisplayString(order.value.status), 1)]),
					createBaseVNode("p", null, [_cache[3] || (_cache[3] = createBaseVNode("strong", null, "Ngày đặt:", -1)), createTextVNode(" " + toDisplayString(formatDate(order.value.createDate)), 1)]),
					createBaseVNode("p", null, [_cache[4] || (_cache[4] = createBaseVNode("strong", null, "Trạng thái tiền cọc:", -1)), createTextVNode(" " + toDisplayString(order.value.depositStatus || "UNPAID"), 1)]),
					order.value.depositAmount ? (openBlock(), createElementBlock("p", _hoisted_4, [_cache[5] || (_cache[5] = createBaseVNode("strong", null, "Tiền cọc:", -1)), createTextVNode(" " + toDisplayString(unref(formatPrice)(order.value.depositAmount)) + " VNĐ", 1)])) : createCommentVNode("", true),
					createBaseVNode("div", _hoisted_5, [createVNode(_component_router_link, {
						class: "btn cs-btn cs-btn-ghost",
						to: `/orders/${order.value.id}/contract`
					}, {
						default: withCtx(() => [..._cache[6] || (_cache[6] = [createTextVNode("Xem hợp đồng", -1)])]),
						_: 1
					}, 8, ["to"]), createVNode(_component_router_link, {
						class: "btn cs-btn cs-btn-primary",
						to: `/orders/${order.value.id}/payment`
					}, {
						default: withCtx(() => [..._cache[7] || (_cache[7] = [createTextVNode("Thanh toán & lịch sử", -1)])]),
						_: 1
					}, 8, ["to"])])
				]),
				createBaseVNode("div", _hoisted_6, [createBaseVNode("table", _hoisted_7, [_cache[8] || (_cache[8] = createBaseVNode("thead", null, [createBaseVNode("tr", null, [
					createBaseVNode("th", null, "Xe"),
					createBaseVNode("th", null, "Giá"),
					createBaseVNode("th", null, "SL"),
					createBaseVNode("th", null, "Thành tiền")
				])], -1)), createBaseVNode("tbody", null, [(openBlock(true), createElementBlock(Fragment, null, renderList(details.value, (d) => {
					return openBlock(), createElementBlock("tr", { key: d.id }, [
						createBaseVNode("td", null, toDisplayString(d.car?.name || "Xe không còn tồn tại"), 1),
						createBaseVNode("td", null, toDisplayString(unref(formatPrice)(d.price)), 1),
						createBaseVNode("td", null, toDisplayString(d.quantity), 1),
						createBaseVNode("td", null, toDisplayString(unref(formatPrice)(d.price * d.quantity)), 1)
					]);
				}), 128))])])]),
				createVNode(_component_router_link, {
					class: "btn cs-btn cs-btn-ghost mt-3",
					to: "/order/my-orders"
				}, {
					default: withCtx(() => [..._cache[9] || (_cache[9] = [createTextVNode("Quay lại", -1)])]),
					_: 1
				})
			])) : createCommentVNode("", true);
		};
	}
};
//#endregion
export { _sfc_main as default };
