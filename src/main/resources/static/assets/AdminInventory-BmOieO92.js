import { D as createCommentVNode, Dt as toDisplayString, O as createElementBlock, R as onBeforeUnmount, S as Fragment, T as createBaseVNode, Tt as normalizeClass, U as renderList, V as openBlock, a as carImageUrl, ot as unref, t as adminApi, tt as ref, v as useDefaultCarImage, w as computed, z as onMounted } from "./api-Cd2rmWmR.js";
import { n as _plugin_vue_export_helper_default } from "./index-DOyj8jjE.js";
import { t as showCartToast } from "./useCartToast-CRv33ZAZ.js";
//#region src/views/admin/AdminInventory.vue
var _hoisted_1 = { class: "container cs-container py-5" };
var _hoisted_2 = { class: "page-heading" };
var _hoisted_3 = ["disabled"];
var _hoisted_4 = { class: "summary-grid" };
var _hoisted_5 = { class: "table-responsive cs-card p-3" };
var _hoisted_6 = { class: "table cs-table align-middle mb-0" };
var _hoisted_7 = { key: 0 };
var _hoisted_8 = { class: "car-cell" };
var _hoisted_9 = ["src", "alt"];
var _hoisted_10 = { class: "identity-cell" };
var _hoisted_11 = { key: 2 };
var AdminInventory_default = /*#__PURE__*/ _plugin_vue_export_helper_default({
	__name: "AdminInventory",
	setup(__props) {
		const cars = ref([]);
		const brands = ref([]);
		const loading = ref(false);
		let pollTimer = null;
		const brandMap = computed(() => new Map(brands.value.map((brand) => [Number(brand.id), brand.name])));
		const totalStock = computed(() => cars.value.reduce((total, car) => total + Number(car.stock || 0), 0));
		const lowStockCount = computed(() => cars.value.filter((car) => Number(car.stock) > 0 && Number(car.stock) <= 3).length);
		const outOfStockCount = computed(() => cars.value.filter((car) => Number(car.stock || 0) === 0).length);
		onMounted(() => {
			load();
			pollTimer = window.setInterval(() => load(true), 2e3);
		});
		onBeforeUnmount(() => {
			if (pollTimer) {
				clearInterval(pollTimer);
				pollTimer = null;
			}
		});
		async function load(silent = false) {
			if (!silent) loading.value = true;
			try {
				const [carResponse, brandResponse] = await Promise.all([adminApi.getCars(), adminApi.getBrands()]);
				cars.value = Array.isArray(carResponse.data) ? carResponse.data : carResponse.data.data || [];
				brands.value = Array.isArray(brandResponse.data) ? brandResponse.data : brandResponse.data.data || [];
			} catch (error) {
				if (!silent) showCartToast(error.response?.data?.message || "Không thể tải dữ liệu tồn kho", "error");
			} finally {
				if (!silent) loading.value = false;
			}
		}
		const brandName = (brandId) => brandMap.value.get(Number(brandId)) || "Chưa xác định";
		const vehicleIdentity = (car) => car.vin || car.chassisNumber || car.licensePlate || "Chưa có dữ liệu";
		const stockClass = (stock) => ({
			low: Number(stock) > 0 && Number(stock) <= 3,
			empty: Number(stock || 0) === 0
		});
		const statusLabel = (status) => ({
			AVAILABLE: "Có sẵn",
			DEPOSITED: "Đã đặt cọc",
			SOLD: "Đã bán",
			INACTIVE: "Ngừng kinh doanh"
		})[status] || status || "Chưa xác định";
		const statusClass = (status) => String(status || "").toLowerCase();
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1, [
				createBaseVNode("div", _hoisted_2, [_cache[1] || (_cache[1] = createBaseVNode("div", null, [
					createBaseVNode("span", { class: "admin-eyebrow" }, "THEO DÕI KHO XE"),
					createBaseVNode("h2", { class: "cs-page-title mb-0" }, "Quản lý tồn kho"),
					createBaseVNode("p", { class: "page-description mb-0" }, "Theo dõi số lượng và trạng thái xe; dữ liệu kho được cập nhật từ luồng đơn hàng.")
				], -1)), createBaseVNode("button", {
					class: "btn cs-btn cs-btn-ghost",
					type: "button",
					disabled: loading.value,
					onClick: load
				}, toDisplayString(loading.value ? "Đang tải..." : "Làm mới dữ liệu"), 9, _hoisted_3)]),
				createBaseVNode("div", _hoisted_4, [
					createBaseVNode("article", null, [_cache[2] || (_cache[2] = createBaseVNode("span", null, "Mẫu xe", -1)), createBaseVNode("strong", null, toDisplayString(cars.value.length), 1)]),
					createBaseVNode("article", null, [_cache[3] || (_cache[3] = createBaseVNode("span", null, "Tổng tồn kho", -1)), createBaseVNode("strong", null, toDisplayString(totalStock.value), 1)]),
					createBaseVNode("article", null, [_cache[4] || (_cache[4] = createBaseVNode("span", null, "Sắp hết hàng", -1)), createBaseVNode("strong", null, toDisplayString(lowStockCount.value), 1)]),
					createBaseVNode("article", null, [_cache[5] || (_cache[5] = createBaseVNode("span", null, "Hết hàng", -1)), createBaseVNode("strong", null, toDisplayString(outOfStockCount.value), 1)])
				]),
				createBaseVNode("div", _hoisted_5, [createBaseVNode("table", _hoisted_6, [_cache[8] || (_cache[8] = createBaseVNode("thead", null, [createBaseVNode("tr", null, [
					createBaseVNode("th", null, "Xe"),
					createBaseVNode("th", null, "Thương hiệu"),
					createBaseVNode("th", null, "Số khung/Biển số"),
					createBaseVNode("th", null, "Tồn kho"),
					createBaseVNode("th", null, "Trạng thái kinh doanh")
				])], -1)), createBaseVNode("tbody", null, [loading.value ? (openBlock(), createElementBlock("tr", _hoisted_7, [..._cache[6] || (_cache[6] = [createBaseVNode("td", {
					colspan: "5",
					class: "empty-cell"
				}, "Đang tải dữ liệu tồn kho...", -1)])])) : (openBlock(true), createElementBlock(Fragment, { key: 1 }, renderList(cars.value, (car) => {
					return openBlock(), createElementBlock("tr", { key: car.id }, [
						createBaseVNode("td", null, [createBaseVNode("div", _hoisted_8, [createBaseVNode("img", {
							src: unref(carImageUrl)(car.image),
							alt: car.name,
							onError: _cache[0] || (_cache[0] = (...args) => unref(useDefaultCarImage) && unref(useDefaultCarImage)(...args))
						}, null, 40, _hoisted_9), createBaseVNode("div", null, [createBaseVNode("strong", null, toDisplayString(car.name), 1), createBaseVNode("small", null, "ID: " + toDisplayString(car.id), 1)])])]),
						createBaseVNode("td", null, toDisplayString(brandName(car.brandId)), 1),
						createBaseVNode("td", _hoisted_10, toDisplayString(vehicleIdentity(car)), 1),
						createBaseVNode("td", null, [createBaseVNode("span", { class: normalizeClass(["stock-badge", stockClass(car.stock)]) }, toDisplayString(car.stock), 3)]),
						createBaseVNode("td", null, [createBaseVNode("span", { class: normalizeClass(["status-badge", statusClass(car.status)]) }, toDisplayString(statusLabel(car.status)), 3)])
					]);
				}), 128)), !loading.value && cars.value.length === 0 ? (openBlock(), createElementBlock("tr", _hoisted_11, [..._cache[7] || (_cache[7] = [createBaseVNode("td", {
					colspan: "5",
					class: "empty-cell"
				}, "Chưa có xe trong kho.", -1)])])) : createCommentVNode("", true)])])])
			]);
		};
	}
}, [["__scopeId", "data-v-147024f8"]]);
//#endregion
export { AdminInventory_default as default };
