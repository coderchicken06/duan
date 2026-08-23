import { A as createStaticVNode, D as createCommentVNode, Dt as toDisplayString, G as watch, K as withCtx, M as createVNode, O as createElementBlock, S as Fragment, T as createBaseVNode, U as renderList, V as openBlock, W as resolveComponent, i as carApi, j as createTextVNode, o as cartApi, q as withDirectives, r as brandApi, tt as ref, w as computed, z as onMounted } from "./api-Cd2rmWmR.js";
import { a as useRoute, l as vModelSelect, n as _plugin_vue_export_helper_default, r as useCartStore, u as vModelText } from "./index-DOyj8jjE.js";
import { t as showCartToast } from "./useCartToast-CRv33ZAZ.js";
import { t as CarCard_default } from "./CarCard-BMs2B_57.js";
import { t as useAutoRefresh } from "./useAutoRefresh-DjAfN_Vr.js";
//#region src/views/CarListView.vue
var _hoisted_1 = { class: "car-list-shell" };
var _hoisted_2 = { class: "ford-section container py-4" };
var _hoisted_3 = { class: "ford-section-head" };
var _hoisted_4 = {
	key: 0,
	class: "ford-section-meta"
};
var _hoisted_5 = {
	key: 0,
	class: "alert alert-danger",
	role: "alert"
};
var _hoisted_6 = { class: "ford-filter-card" };
var _hoisted_7 = { class: "ford-filter-grid" };
var _hoisted_8 = ["value"];
var _hoisted_9 = ["value"];
var _hoisted_10 = ["value"];
var _hoisted_11 = ["value"];
var _hoisted_12 = { class: "ford-filter-actions" };
var _hoisted_13 = { class: "ford-filter-result" };
var _hoisted_14 = {
	key: 1,
	class: "row g-4",
	"aria-label": "Đang tải danh sách xe"
};
var _hoisted_15 = {
	key: 2,
	class: "row g-4"
};
var _hoisted_16 = {
	key: 3,
	class: "ford-empty-state"
};
var _hoisted_17 = {
	key: 4,
	class: "alert alert-danger cart-alert show error"
};
var CarListView_default = /*#__PURE__*/ _plugin_vue_export_helper_default({
	__name: "CarListView",
	setup(__props) {
		const route = useRoute();
		const cart = useCartStore();
		const allCars = ref([]);
		const brands = ref([]);
		const loading = ref(true);
		const message = ref("");
		const loadError = ref("");
		const q = ref(route.query.q || "");
		const filters = ref({
			brandId: "",
			priceRange: "",
			year: "",
			color: "",
			fuelType: "",
			seats: ""
		});
		const availableYears = computed(() => {
			const years = allCars.value.map((car) => car.year).filter((year) => year != null);
			return Array.from(new Set(years)).sort((a, b) => b - a);
		});
		const availableFuelTypes = computed(() => [...new Set(allCars.value.map((car) => car.fuelType).filter(Boolean))]);
		const availableSeats = computed(() => [...new Set(allCars.value.map((car) => car.seats).filter((seat) => seat != null))].sort((a, b) => a - b));
		const filteredCars = computed(() => {
			const query = String(q.value || "").trim().toLowerCase();
			return allCars.value.filter((car) => {
				const name = (car.name || "").toLowerCase();
				const description = (car.description || "").toLowerCase();
				const color = (car.color || "").toLowerCase();
				const price = Number(car.price || 0);
				const matchesQuery = !query || name.includes(query) || description.includes(query);
				const matchesBrand = !filters.value.brandId || String(car.brandId) === filters.value.brandId;
				const matchesPrice = (() => {
					if (!filters.value.priceRange) return true;
					if (filters.value.priceRange === "demo") return price <= 5e6;
					if (filters.value.priceRange === "5m-500m") return price > 5e6 && price < 5e8;
					if (filters.value.priceRange === "500m-1b") return price >= 5e8 && price < 1e9;
					if (filters.value.priceRange === "1b-2b") return price >= 1e9 && price <= 2e9;
					if (filters.value.priceRange === "2b-plus") return price > 2e9;
					return true;
				})();
				const matchesStatus = String(car.status || "").toUpperCase() === "AVAILABLE";
				const matchesYear = !filters.value.year || String(car.year) === filters.value.year;
				const matchesColor = !filters.value.color || color.includes(filters.value.color.trim().toLowerCase());
				const matchesFuel = !filters.value.fuelType || car.fuelType === filters.value.fuelType;
				const matchesSeats = !filters.value.seats || String(car.seats) === filters.value.seats;
				return matchesQuery && matchesBrand && matchesPrice && matchesStatus && matchesYear && matchesColor && matchesFuel && matchesSeats;
			});
		});
		watch(() => route.fullPath, () => {
			q.value = String(route.query.q || "");
			loadCars(true);
		});
		onMounted(loadCars);
		useAutoRefresh(() => loadCars(true));
		async function loadCars(silent = false) {
			if (!silent) {
				loading.value = true;
				loadError.value = "";
			}
			try {
				const [carsResponse, brandsResponse] = await Promise.all([carApi.getAll(String(q.value || "") || void 0), brandApi.getAll()]);
				const carData = carsResponse.data;
				const brandData = brandsResponse.data;
				allCars.value = Array.isArray(carData) ? carData : carData.data || [];
				brands.value = Array.isArray(brandData) ? brandData : brandData.data || [];
			} catch {
				if (!silent) {
					allCars.value = [];
					brands.value = [];
					loadError.value = "Không thể kết nối máy chủ. Vui lòng kiểm tra backend và thử lại.";
				}
			} finally {
				if (!silent) loading.value = false;
			}
		}
		function resetFilters() {
			filters.value = {
				brandId: "",
				priceRange: "",
				year: "",
				color: "",
				fuelType: "",
				seats: ""
			};
		}
		async function addToCart(id) {
			const car = allCars.value.find((item) => item.id === id);
			if (!car || Number(car.stock || 0) <= 0) {
				message.value = "Xe đã hết hàng, không thể thêm vào giỏ";
				return;
			}
			try {
				const { data } = await cartApi.add(id);
				if (data.success) {
					await cart.refresh();
					showCartToast("Thêm vào giỏ hàng thành công!");
					message.value = "";
				} else message.value = data.message || "Lỗi";
			} catch {
				message.value = "Không thể kết nối máy chủ để thêm xe vào giỏ";
			}
		}
		return (_ctx, _cache) => {
			const _component_router_link = resolveComponent("router-link");
			return openBlock(), createElementBlock("div", _hoisted_1, [_cache[23] || (_cache[23] = createBaseVNode("section", { class: "ford-hero-panel compact car-list-hero" }, [createBaseVNode("div", { class: "ford-hero-panel-content" }, [
				createBaseVNode("span", { class: "ford-badge" }, "Bộ sưu tập xe"),
				createBaseVNode("h1", null, "Danh sách xe chất lượng cao"),
				createBaseVNode("p", null, "Khám phá các mẫu xe mới, so sánh thông số và chọn chiếc xe phù hợp nhất cho nhu cầu của bạn.")
			])], -1)), createBaseVNode("div", _hoisted_2, [
				createBaseVNode("div", _hoisted_3, [createBaseVNode("div", null, [_cache[9] || (_cache[9] = createBaseVNode("h2", null, "Danh sách xe", -1)), q.value ? (openBlock(), createElementBlock("div", _hoisted_4, [
					_cache[7] || (_cache[7] = createTextVNode(" Kết quả tìm kiếm: “", -1)),
					createBaseVNode("strong", null, toDisplayString(q.value), 1),
					_cache[8] || (_cache[8] = createTextVNode("” ", -1)),
					createVNode(_component_router_link, {
						to: "/car/list",
						class: "ms-2"
					}, {
						default: withCtx(() => [..._cache[6] || (_cache[6] = [createTextVNode("Xóa bộ lọc", -1)])]),
						_: 1
					})
				])) : createCommentVNode("", true)])]),
				loadError.value ? (openBlock(), createElementBlock("div", _hoisted_5, toDisplayString(loadError.value), 1)) : createCommentVNode("", true),
				createBaseVNode("div", _hoisted_6, [
					_cache[21] || (_cache[21] = createBaseVNode("div", { class: "ford-filter-card-header" }, "Bộ lọc sản phẩm", -1)),
					createBaseVNode("div", _hoisted_7, [
						createBaseVNode("label", null, [_cache[11] || (_cache[11] = createBaseVNode("span", null, "Thương hiệu", -1)), withDirectives(createBaseVNode("select", { "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => filters.value.brandId = $event) }, [_cache[10] || (_cache[10] = createBaseVNode("option", { value: "" }, "Tất cả", -1)), (openBlock(true), createElementBlock(Fragment, null, renderList(brands.value, (brand) => {
							return openBlock(), createElementBlock("option", {
								key: brand.id,
								value: String(brand.id)
							}, toDisplayString(brand.name), 9, _hoisted_8);
						}), 128))], 512), [[vModelSelect, filters.value.brandId]])]),
						createBaseVNode("label", null, [_cache[13] || (_cache[13] = createBaseVNode("span", null, "Mức giá", -1)), withDirectives(createBaseVNode("select", { "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => filters.value.priceRange = $event) }, [..._cache[12] || (_cache[12] = [createStaticVNode("<option value=\"\" data-v-c2fd31f2>Tất cả</option><option value=\"demo\" data-v-c2fd31f2>Đến 5 triệu</option><option value=\"5m-500m\" data-v-c2fd31f2>Trên 5 triệu đến dưới 500 triệu</option><option value=\"500m-1b\" data-v-c2fd31f2>Từ 500 triệu đến dưới 1 tỷ</option><option value=\"1b-2b\" data-v-c2fd31f2>Từ 1 đến 2 tỷ</option><option value=\"2b-plus\" data-v-c2fd31f2>Trên 2 tỷ</option>", 6)])], 512), [[vModelSelect, filters.value.priceRange]])]),
						createBaseVNode("label", null, [_cache[15] || (_cache[15] = createBaseVNode("span", null, "Năm", -1)), withDirectives(createBaseVNode("select", { "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => filters.value.year = $event) }, [_cache[14] || (_cache[14] = createBaseVNode("option", { value: "" }, "Tất cả", -1)), (openBlock(true), createElementBlock(Fragment, null, renderList(availableYears.value, (year) => {
							return openBlock(), createElementBlock("option", {
								key: year,
								value: String(year)
							}, toDisplayString(year), 9, _hoisted_9);
						}), 128))], 512), [[vModelSelect, filters.value.year]])]),
						createBaseVNode("label", null, [_cache[16] || (_cache[16] = createBaseVNode("span", null, "Màu sắc", -1)), withDirectives(createBaseVNode("input", {
							"onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => filters.value.color = $event),
							type: "text",
							placeholder: "Ví dụ: Đen, Trắng"
						}, null, 512), [[vModelText, filters.value.color]])]),
						createBaseVNode("label", null, [_cache[18] || (_cache[18] = createBaseVNode("span", null, "Nhiên liệu", -1)), withDirectives(createBaseVNode("select", { "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => filters.value.fuelType = $event) }, [_cache[17] || (_cache[17] = createBaseVNode("option", { value: "" }, "Tất cả", -1)), (openBlock(true), createElementBlock(Fragment, null, renderList(availableFuelTypes.value, (fuel) => {
							return openBlock(), createElementBlock("option", {
								key: fuel,
								value: fuel
							}, toDisplayString(fuel), 9, _hoisted_10);
						}), 128))], 512), [[vModelSelect, filters.value.fuelType]])]),
						createBaseVNode("label", null, [_cache[20] || (_cache[20] = createBaseVNode("span", null, "Số chỗ", -1)), withDirectives(createBaseVNode("select", { "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => filters.value.seats = $event) }, [_cache[19] || (_cache[19] = createBaseVNode("option", { value: "" }, "Tất cả", -1)), (openBlock(true), createElementBlock(Fragment, null, renderList(availableSeats.value, (seat) => {
							return openBlock(), createElementBlock("option", {
								key: seat,
								value: String(seat)
							}, toDisplayString(seat) + " chỗ", 9, _hoisted_11);
						}), 128))], 512), [[vModelSelect, filters.value.seats]])])
					]),
					createBaseVNode("div", _hoisted_12, [createBaseVNode("button", {
						type: "button",
						class: "ford-btn-outline",
						onClick: resetFilters
					}, "Xóa bộ lọc"), createBaseVNode("span", _hoisted_13, "Hiển thị " + toDisplayString(filteredCars.value.length) + " xe", 1)])
				]),
				loading.value ? (openBlock(), createElementBlock("div", _hoisted_14, [(openBlock(), createElementBlock(Fragment, null, renderList(6, (item) => {
					return createBaseVNode("div", {
						key: item,
						class: "col-12 col-md-6 col-lg-4"
					}, [..._cache[22] || (_cache[22] = [createBaseVNode("div", { class: "car-skeleton" }, null, -1)])]);
				}), 64))])) : (openBlock(), createElementBlock("div", _hoisted_15, [(openBlock(true), createElementBlock(Fragment, null, renderList(filteredCars.value, (car) => {
					return openBlock(), createElementBlock("div", {
						key: car.id,
						class: "col-12 col-md-6 col-lg-4"
					}, [createVNode(CarCard_default, {
						car,
						onAddCart: addToCart
					}, null, 8, ["car"])]);
				}), 128))])),
				!loading.value && filteredCars.value.length === 0 ? (openBlock(), createElementBlock("p", _hoisted_16, "Không có xe nào phù hợp với bộ lọc.")) : createCommentVNode("", true),
				message.value ? (openBlock(), createElementBlock("div", _hoisted_17, toDisplayString(message.value), 1)) : createCommentVNode("", true)
			])]);
		};
	}
}, [["__scopeId", "data-v-c2fd31f2"]]);
//#endregion
export { CarListView_default as default };
