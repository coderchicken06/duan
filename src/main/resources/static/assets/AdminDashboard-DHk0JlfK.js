import { D as createCommentVNode, Dt as toDisplayString, Et as normalizeStyle, K as withCtx, M as createVNode, O as createElementBlock, S as Fragment, T as createBaseVNode, Tt as normalizeClass, U as renderList, V as openBlock, W as resolveComponent, c as formatPrice, j as createTextVNode, m as quotationApi, ot as unref, t as adminApi, tt as ref, w as computed, z as onMounted } from "./api-lWF_eiJ8.js";
import { t as _plugin_vue_export_helper_default } from "./index-LltwIOcO.js";
import { t as showCartToast } from "./useCartToast-CRv33ZAZ.js";
import { n as useAutoRefresh, t as notifyDataUpdated } from "./useAutoRefresh-DbvPryYR.js";
//#region src/views/admin/AdminDashboard.vue
var _hoisted_1 = { class: "admin-dashboard" };
var _hoisted_2 = { class: "container cs-container dashboard-inner" };
var _hoisted_3 = {
	key: 0,
	class: "dashboard-message"
};
var _hoisted_4 = {
	key: 1,
	class: "dashboard-message dashboard-message--error"
};
var _hoisted_5 = { class: "stat-grid" };
var _hoisted_6 = { class: "stat-label" };
var _hoisted_7 = { class: "dashboard-grid" };
var _hoisted_8 = { class: "dashboard-card revenue-card" };
var _hoisted_9 = { class: "revenue-value" };
var _hoisted_10 = { class: "dashboard-card" };
var _hoisted_11 = { class: "card-heading" };
var _hoisted_12 = { class: "top-total" };
var _hoisted_13 = {
	key: 0,
	class: "top-list"
};
var _hoisted_14 = { class: "top-rank" };
var _hoisted_15 = { class: "top-info" };
var _hoisted_16 = { class: "top-track" };
var _hoisted_17 = {
	key: 1,
	class: "empty-top"
};
var _hoisted_18 = { class: "dashboard-card quotation-card" };
var _hoisted_19 = { class: "card-heading" };
var _hoisted_20 = { class: "top-total" };
var _hoisted_21 = { class: "table-responsive mt-4" };
var _hoisted_22 = { class: "table" };
var _hoisted_23 = { class: "quote-actions" };
var _hoisted_24 = ["onClick"];
var _hoisted_25 = ["onClick"];
var AdminDashboard_default = /*#__PURE__*/ _plugin_vue_export_helper_default({
	__name: "AdminDashboard",
	setup(__props) {
		const stats = ref({
			totalCars: 0,
			totalUsers: 0,
			totalOrders: 0,
			totalBrands: 0
		});
		const revenue = ref(0);
		const topCars = ref([]);
		const loading = ref(true);
		const errorMessage = ref("");
		const quotations = ref([]);
		const statCards = computed(() => [
			{
				label: "Mẫu xe",
				value: stats.value.totalCars,
				description: "Sản phẩm đang quản lý",
				symbol: "01",
				tone: "blue"
			},
			{
				label: "Khách hàng",
				value: stats.value.totalUsers,
				description: "Tài khoản trong hệ thống",
				symbol: "02",
				tone: "green"
			},
			{
				label: "Đơn hàng",
				value: stats.value.totalOrders,
				description: "Tổng đơn đã tạo",
				symbol: "03",
				tone: "orange"
			},
			{
				label: "Thương hiệu",
				value: stats.value.totalBrands,
				description: "Hãng xe đang phân phối",
				symbol: "04",
				tone: "red"
			}
		]);
		const totalTopSales = computed(() => topCars.value.reduce((sum, car) => sum + car.qty, 0));
		const highestSales = computed(() => Math.max(...topCars.value.map((car) => car.qty), 1));
		function salePercentage(quantity) {
			return Math.max(8, Math.round(quantity / highestSales.value * 100));
		}
		async function loadDashboard(silent = false) {
			if (!silent) {
				loading.value = true;
				errorMessage.value = "";
			}
			try {
				const [{ data }, quotationResponse] = await Promise.all([adminApi.getDashboardInfo(), quotationApi.getAll()]);
				if (!data?.success) throw new Error(data?.message || "Không thể tải số liệu tổng quan");
				stats.value = {
					totalCars: Number(data.stats?.totalCars || 0),
					totalUsers: Number(data.stats?.totalUsers || 0),
					totalOrders: Number(data.stats?.totalOrders || 0),
					totalBrands: Number(data.stats?.totalBrands || 0)
				};
				revenue.value = Number(data.stats?.revenue || 0);
				const raw = Array.isArray(data.topCars) ? data.topCars : [];
				topCars.value = raw.map((row) => ({
					name: String(row[0] || "Chưa cập nhật"),
					qty: Number(row[1] || 0)
				}));
				quotations.value = quotationResponse.data.data || [];
			} catch (error) {
				console.error("Không thể tải dashboard:", error);
				if (!silent) errorMessage.value = "Không thể tải dữ liệu thống kê. Vui lòng thử lại.";
			} finally {
				if (!silent) loading.value = false;
			}
		}
		onMounted(() => {
			loadDashboard();
		});
		useAutoRefresh(() => loadDashboard(true));
		async function setQuotationStatus(quote, status) {
			try {
				await quotationApi.update(quote.id, {
					discount: quote.discount || 0,
					status
				});
				notifyDataUpdated();
				await loadDashboard();
				showCartToast(status === "Đã duyệt" ? "Đã duyệt báo giá" : "Đã từ chối báo giá");
			} catch (error) {
				showCartToast(error.response?.data?.message || "Không thể cập nhật báo giá.", "error");
			}
		}
		return (_ctx, _cache) => {
			const _component_router_link = resolveComponent("router-link");
			return openBlock(), createElementBlock("section", _hoisted_1, [createBaseVNode("div", _hoisted_2, [_cache[6] || (_cache[6] = createBaseVNode("header", { class: "dashboard-heading" }, [createBaseVNode("div", null, [
				createBaseVNode("span", { class: "dashboard-eyebrow" }, "TỔNG QUAN HỆ THỐNG"),
				createBaseVNode("h1", null, "Bảng thống kê"),
				createBaseVNode("p", null, "Theo dõi nhanh dữ liệu kinh doanh hiện tại của CarStore.")
			]), createBaseVNode("span", { class: "dashboard-status" }, [createBaseVNode("i"), createTextVNode("Dữ liệu trực tiếp")])], -1)), loading.value ? (openBlock(), createElementBlock("div", _hoisted_3, "Đang tải dữ liệu thống kê...")) : errorMessage.value ? (openBlock(), createElementBlock("div", _hoisted_4, toDisplayString(errorMessage.value), 1)) : (openBlock(), createElementBlock(Fragment, { key: 2 }, [
				createBaseVNode("div", _hoisted_5, [(openBlock(true), createElementBlock(Fragment, null, renderList(statCards.value, (item) => {
					return openBlock(), createElementBlock("article", {
						key: item.label,
						class: "stat-card"
					}, [createBaseVNode("span", { class: normalizeClass(["stat-icon", `stat-icon--${item.tone}`]) }, toDisplayString(item.symbol), 3), createBaseVNode("div", null, [
						createBaseVNode("span", _hoisted_6, toDisplayString(item.label), 1),
						createBaseVNode("strong", null, toDisplayString(item.value), 1),
						createBaseVNode("small", null, toDisplayString(item.description), 1)
					])]);
				}), 128))]),
				createBaseVNode("div", _hoisted_7, [createBaseVNode("article", _hoisted_8, [
					_cache[0] || (_cache[0] = createBaseVNode("div", { class: "card-heading" }, [createBaseVNode("div", null, [createBaseVNode("span", { class: "card-kicker" }, "TÀI CHÍNH"), createBaseVNode("h2", null, "Tổng tiền cọc đã thu")]), createBaseVNode("span", { class: "revenue-mark" }, "VNĐ")], -1)),
					createBaseVNode("strong", _hoisted_9, toDisplayString(unref(formatPrice)(revenue.value)), 1),
					_cache[1] || (_cache[1] = createBaseVNode("p", null, "Tổng tiền cọc từ các đơn hàng đã xác nhận thanh toán.", -1))
				]), createBaseVNode("article", _hoisted_10, [createBaseVNode("div", _hoisted_11, [_cache[2] || (_cache[2] = createBaseVNode("div", null, [createBaseVNode("span", { class: "card-kicker" }, "SẢN PHẨM"), createBaseVNode("h2", null, "Top xe bán chạy")], -1)), createBaseVNode("span", _hoisted_12, toDisplayString(totalTopSales.value) + " xe", 1)]), topCars.value.length ? (openBlock(), createElementBlock("div", _hoisted_13, [(openBlock(true), createElementBlock(Fragment, null, renderList(topCars.value, (car, index) => {
					return openBlock(), createElementBlock("div", {
						key: `${car.name}-${index}`,
						class: "top-row"
					}, [createBaseVNode("span", _hoisted_14, toDisplayString(index + 1), 1), createBaseVNode("div", _hoisted_15, [createBaseVNode("div", null, [createBaseVNode("strong", null, toDisplayString(car.name), 1), createBaseVNode("span", null, toDisplayString(car.qty) + " xe đã bán", 1)]), createBaseVNode("div", _hoisted_16, [createBaseVNode("span", { style: normalizeStyle({ width: `${salePercentage(car.qty)}%` }) }, null, 4)])])]);
				}), 128))])) : (openBlock(), createElementBlock("p", _hoisted_17, "Chưa có dữ liệu bán hàng."))])]),
				createBaseVNode("article", _hoisted_18, [createBaseVNode("div", _hoisted_19, [_cache[3] || (_cache[3] = createBaseVNode("div", null, [createBaseVNode("span", { class: "card-kicker" }, "BÁO GIÁ"), createBaseVNode("h2", null, "Yêu cầu báo giá")], -1)), createBaseVNode("span", _hoisted_20, toDisplayString(quotations.value.length) + " yêu cầu", 1)]), createBaseVNode("div", _hoisted_21, [createBaseVNode("table", _hoisted_22, [_cache[5] || (_cache[5] = createBaseVNode("thead", null, [createBaseVNode("tr", null, [
					createBaseVNode("th", null, "Mã"),
					createBaseVNode("th", null, "Khách hàng"),
					createBaseVNode("th", null, "Tổng tiền"),
					createBaseVNode("th", null, "Trạng thái"),
					createBaseVNode("th")
				])], -1)), createBaseVNode("tbody", null, [(openBlock(true), createElementBlock(Fragment, null, renderList(quotations.value, (quote) => {
					return openBlock(), createElementBlock("tr", { key: quote.id }, [
						createBaseVNode("td", null, toDisplayString(quote.quotationNo || `BG-${quote.id}`), 1),
						createBaseVNode("td", null, toDisplayString(quote.customerUsername), 1),
						createBaseVNode("td", null, toDisplayString(unref(formatPrice)(quote.totalPrice)), 1),
						createBaseVNode("td", null, toDisplayString(quote.status), 1),
						createBaseVNode("td", _hoisted_23, [
							quote.status === "Chờ xác nhận" ? (openBlock(), createElementBlock("button", {
								key: 0,
								class: "btn btn-sm btn-success",
								onClick: ($event) => setQuotationStatus(quote, "Đã duyệt")
							}, "Duyệt", 8, _hoisted_24)) : createCommentVNode("", true),
							quote.status === "Chờ xác nhận" ? (openBlock(), createElementBlock("button", {
								key: 1,
								class: "btn btn-sm btn-outline-danger",
								onClick: ($event) => setQuotationStatus(quote, "Từ chối")
							}, "Từ chối", 8, _hoisted_25)) : createCommentVNode("", true),
							createVNode(_component_router_link, {
								class: "btn btn-sm btn-outline-secondary",
								to: `/quotations/${quote.id}`
							}, {
								default: withCtx(() => [..._cache[4] || (_cache[4] = [createTextVNode("Xem", -1)])]),
								_: 1
							}, 8, ["to"])
						])
					]);
				}), 128))])])])])
			], 64))])]);
		};
	}
}, [["__scopeId", "data-v-02cf4a6b"]]);
//#endregion
export { AdminDashboard_default as default };
