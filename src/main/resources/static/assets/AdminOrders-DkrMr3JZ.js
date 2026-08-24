import { D as createCommentVNode, Dt as toDisplayString, G as watch, O as createElementBlock, S as Fragment, T as createBaseVNode, U as renderList, V as openBlock, a as carImageUrl, ot as unref, t as adminApi, tt as ref, v as useDefaultCarImage, z as onMounted } from "./api-Cd2rmWmR.js";
import { a as useRoute, n as _plugin_vue_export_helper_default } from "./index-BCOVk736.js";
import { t as showCartToast } from "./useCartToast-CRv33ZAZ.js";
import { n as useAutoRefresh, t as notifyDataUpdated } from "./useAutoRefresh-CiKJsJMn.js";
//#region src/views/admin/AdminOrders.vue
var _hoisted_1 = { class: "container cs-container py-5" };
var _hoisted_2 = { class: "table-responsive cs-card p-3" };
var _hoisted_3 = { class: "table cs-table mb-0" };
var _hoisted_4 = { class: "product-cell" };
var _hoisted_5 = ["src", "alt"];
var _hoisted_6 = [
	"value",
	"disabled",
	"onChange"
];
var _hoisted_7 = ["value"];
var _hoisted_8 = ["disabled", "onClick"];
var _hoisted_9 = { key: 0 };
var AdminOrders_default = /*#__PURE__*/ _plugin_vue_export_helper_default({
	__name: "AdminOrders",
	setup(__props) {
		const orders = ref([]);
		const submittingOrderId = ref(null);
		const route = useRoute();
		const statusLabels = {
			PENDING: "PENDING - Chờ duyệt",
			CONFIRMED: "CONFIRMED - Đã duyệt, chờ cọc",
			PROCESSING: "PROCESSING - Đã cọc, xử lý xe",
			DELIVERED: "DELIVERED - Hoàn thành",
			CANCELLED: "CANCELLED - Đã hủy"
		};
		function formatDepositPaidAt(order) {
			const paymentTime = order.paidAt || order.paymentTime;
			if (paymentTime) return new Intl.DateTimeFormat("vi-VN", {
				day: "2-digit",
				month: "2-digit",
				year: "numeric",
				hour: "2-digit",
				minute: "2-digit",
				hour12: false
			}).format(new Date(paymentTime));
			const status = String(order.status || "").toUpperCase();
			const depositStatus = String(order.depositStatus || "").toUpperCase();
			return ["PENDING", "CANCELLED"].includes(status) && [
				"UNPAID",
				"DEPOSIT_UNPAID",
				""
			].includes(depositStatus) ? "Chưa thanh toán cọc" : "--";
		}
		function availableStatuses(order) {
			if (order.status === "PENDING") return [
				"PENDING",
				"CONFIRMED",
				"CANCELLED"
			];
			if (order.status === "CONFIRMED") return order.depositStatus === "PAID" ? ["CONFIRMED", "PROCESSING"] : ["CONFIRMED", "CANCELLED"];
			if (order.status === "PROCESSING") return ["PROCESSING", "DELIVERED"];
			return [order.status];
		}
		onMounted(() => {
			load();
		});
		useAutoRefresh(loadSilent, 0);
		watch(() => route.path, load);
		async function load() {
			try {
				const { data } = await adminApi.getOrders();
				orders.value = Array.isArray(data) ? data : data.data || [];
			} catch {
				showCartToast("Không thể tải danh sách đơn hàng", "error");
			}
		}
		async function loadSilent() {
			try {
				const { data } = await adminApi.getOrders();
				const latestOrders = Array.isArray(data) ? data : data.data || [];
				if (JSON.stringify(orders.value) !== JSON.stringify(latestOrders)) {
					const currentOrders = new Map(orders.value.map((order) => [order.id, order]));
					orders.value = latestOrders.map((order) => isSubmitting(order.id) ? currentOrders.get(order.id) || order : order);
				}
			} catch (e) {}
		}
		async function updateStatus(o, nextStatus) {
			if (isSubmitting(o.id)) return;
			const previousStatus = o.status;
			if (previousStatus === nextStatus) return;
			o.status = nextStatus;
			submittingOrderId.value = o.id;
			try {
				const { data } = await adminApi.updateOrderStatus(o.id, nextStatus);
				if (!data.success) {
					o.status = previousStatus;
					showCartToast(data.message || "Không thể cập nhật trạng thái", "error");
				} else {
					notifyDataUpdated();
					showCartToast(data.message || "Đã cập nhật trạng thái đơn hàng");
				}
			} catch (error) {
				o.status = previousStatus;
				showCartToast(error.response?.data?.message || "Không thể cập nhật trạng thái", "error");
			} finally {
				submittingOrderId.value = null;
			}
		}
		async function cancel(order) {
			if (isSubmitting(order.id)) return;
			if (!confirm("Hủy đơn hàng này? Tồn kho sẽ được hoàn lại nếu đơn chưa thanh toán cọc.")) return;
			await updateStatus(order, "CANCELLED");
		}
		const isSubmitting = (orderId) => submittingOrderId.value === orderId;
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1, [
				_cache[3] || (_cache[3] = createBaseVNode("span", { class: "admin-eyebrow" }, "ĐƠN ĐẶT XE", -1)),
				_cache[4] || (_cache[4] = createBaseVNode("h2", { class: "cs-page-title mb-4" }, "Quản lý đơn hàng", -1)),
				createBaseVNode("div", _hoisted_2, [createBaseVNode("table", _hoisted_3, [_cache[2] || (_cache[2] = createBaseVNode("thead", null, [createBaseVNode("tr", null, [
					createBaseVNode("th", null, "Sản phẩm"),
					createBaseVNode("th", null, "Khách hàng"),
					createBaseVNode("th", null, "Địa chỉ"),
					createBaseVNode("th", null, "Thời gian thanh toán cọc"),
					createBaseVNode("th", null, "Trạng thái"),
					createBaseVNode("th")
				])], -1)), createBaseVNode("tbody", null, [(openBlock(true), createElementBlock(Fragment, null, renderList(orders.value, (o) => {
					return openBlock(), createElementBlock("tr", { key: o.id }, [
						createBaseVNode("td", null, [createBaseVNode("div", _hoisted_4, [o.carImage ? (openBlock(), createElementBlock("img", {
							key: 0,
							src: unref(carImageUrl)(o.carImage),
							alt: o.carName || o.productName,
							onError: _cache[0] || (_cache[0] = (...args) => unref(useDefaultCarImage) && unref(useDefaultCarImage)(...args))
						}, null, 40, _hoisted_5)) : createCommentVNode("", true), createBaseVNode("span", null, toDisplayString(o.carName || o.productName), 1)])]),
						createBaseVNode("td", null, toDisplayString(o.username), 1),
						createBaseVNode("td", null, toDisplayString(o.address), 1),
						createBaseVNode("td", null, toDisplayString(formatDepositPaidAt(o)), 1),
						createBaseVNode("td", null, [createBaseVNode("select", {
							value: o.status,
							class: "form-select form-select-sm",
							disabled: isSubmitting(o.id) || ["CANCELLED", "DELIVERED"].includes(o.status),
							onChange: ($event) => updateStatus(o, $event.target.value)
						}, [(openBlock(true), createElementBlock(Fragment, null, renderList(availableStatuses(o), (status) => {
							return openBlock(), createElementBlock("option", {
								key: status,
								value: status
							}, toDisplayString(statusLabels[status]), 9, _hoisted_7);
						}), 128))], 40, _hoisted_6)]),
						createBaseVNode("td", null, [!["CANCELLED", "DELIVERED"].includes(o.status) ? (openBlock(), createElementBlock("button", {
							key: 0,
							class: "btn btn-sm cs-btn-danger",
							disabled: isSubmitting(o.id),
							onClick: ($event) => cancel(o)
						}, toDisplayString(isSubmitting(o.id) ? "Đang xử lý..." : "Hủy đơn"), 9, _hoisted_8)) : createCommentVNode("", true)])
					]);
				}), 128)), orders.value.length === 0 ? (openBlock(), createElementBlock("tr", _hoisted_9, [..._cache[1] || (_cache[1] = [createBaseVNode("td", {
					colspan: "6",
					class: "empty-cell"
				}, "Chưa có đơn hàng nào.", -1)])])) : createCommentVNode("", true)])])])
			]);
		};
	}
}, [["__scopeId", "data-v-325184b0"]]);
//#endregion
export { AdminOrders_default as default };
