import { D as createCommentVNode, Dt as toDisplayString, G as watch, K as withCtx, M as createVNode, O as createElementBlock, T as createBaseVNode, V as openBlock, W as resolveComponent, a as carImageUrl, c as formatPrice, i as carApi, j as createTextVNode, ot as unref, p as promotionApi, r as brandApi, tt as ref, v as useDefaultCarImage, w as computed } from "./api-lWF_eiJ8.js";
import { n as useAuthStore, r as useCompare, s as defineStore, t as _plugin_vue_export_helper_default } from "./index-LltwIOcO.js";
import { t as showCartToast } from "./useCartToast-CRv33ZAZ.js";
//#region src/components/CarCard.vue
var _hoisted_1 = { class: "ford-car-card h-100" };
var _hoisted_2 = { class: "ford-car-img" };
var _hoisted_3 = ["src", "alt"];
var _hoisted_4 = {
	key: 0,
	class: "ford-car-chip"
};
var _hoisted_5 = { class: "ford-car-body" };
var _hoisted_6 = { class: "ford-car-meta" };
var _hoisted_7 = { class: "ford-car-badge" };
var _hoisted_8 = { class: "ford-car-year" };
var _hoisted_9 = { class: "ford-car-description" };
var _hoisted_10 = {
	key: 0,
	class: "promotion-price"
};
var _hoisted_11 = { class: "original-price" };
var _hoisted_12 = {
	key: 1,
	class: "ford-price-tag"
};
var _hoisted_13 = {
	key: 2,
	class: "promotion-badge"
};
var _hoisted_14 = { class: "compare-check" };
var _hoisted_15 = ["checked"];
var _hoisted_16 = { class: "ford-car-actions" };
var _hoisted_17 = ["disabled"];
var CarCard_default = /*#__PURE__*/ _plugin_vue_export_helper_default({
	__name: "CarCard",
	props: { car: {
		type: Object,
		required: true
	} },
	emits: ["add-cart"],
	setup(__props) {
		const props = __props;
		const stock = computed(() => Number(props.car.stock || 0));
		const auth = useAuthStore();
		const loadedPromotion = ref(null);
		const hasPromotionData = computed(() => Object.prototype.hasOwnProperty.call(props.car, "promotion"));
		const promotion = computed(() => hasPromotionData.value ? props.car.promotion : loadedPromotion.value);
		const promotionTitle = computed(() => promotion.value?.name || props.car.promotionTitle || "Ưu đãi showroom");
		const discountAmount = computed(() => {
			if (Number.isFinite(Number(props.car.discountAmount))) return Number(props.car.discountAmount);
			if (!promotion.value) return 0;
			const price = Number(props.car.price || 0);
			const amount = promotion.value.type === "PERCENT" ? price * Number(promotion.value.value || 0) / 100 : Number(promotion.value.value || 0);
			return Math.max(0, Math.min(price, amount));
		});
		const discountedPrice = computed(() => Number.isFinite(Number(props.car.discountedPrice)) ? Number(props.car.discountedPrice) : Math.max(0, Number(props.car.price || 0) - discountAmount.value));
		const promotionLabel = computed(() => promotion.value?.type === "PERCENT" ? `Giảm ${promotion.value.value}%` : `Giảm ${formatPrice(discountAmount.value)} VNĐ`);
		const { has, toggle, count } = useCompare();
		function onCompare(event) {
			if (!has(props.car.id) && count.value >= 3) {
				event.target.checked = false;
				showCartToast("Chỉ được so sánh tối đa 3 xe.", "warning");
				return;
			}
			toggle(props.car.id);
		}
		watch(() => props.car, async () => {
			if (hasPromotionData.value) {
				loadedPromotion.value = null;
				return;
			}
			try {
				const { data } = await promotionApi.getForCar(props.car.id);
				loadedPromotion.value = data.data?.[0] || null;
			} catch {
				loadedPromotion.value = null;
			}
		}, { immediate: true });
		return (_ctx, _cache) => {
			const _component_router_link = resolveComponent("router-link");
			return openBlock(), createElementBlock("article", _hoisted_1, [createBaseVNode("div", _hoisted_2, [createBaseVNode("img", {
				src: unref(carImageUrl)(__props.car.image),
				alt: __props.car.name,
				loading: "lazy",
				decoding: "async",
				onError: _cache[0] || (_cache[0] = (...args) => unref(useDefaultCarImage) && unref(useDefaultCarImage)(...args))
			}, null, 40, _hoisted_3), __props.car.inspectionLevel ? (openBlock(), createElementBlock("span", _hoisted_4, toDisplayString(__props.car.inspectionLevel), 1)) : createCommentVNode("", true)]), createBaseVNode("div", _hoisted_5, [
				createBaseVNode("div", _hoisted_6, [createBaseVNode("span", _hoisted_7, toDisplayString(__props.car.bodyType || "Ô tô"), 1), createBaseVNode("span", _hoisted_8, toDisplayString(__props.car.year || "—"), 1)]),
				createBaseVNode("h3", null, toDisplayString(__props.car.name), 1),
				createBaseVNode("p", _hoisted_9, toDisplayString(__props.car.mileage != null ? Number(__props.car.mileage).toLocaleString("vi-VN") + " km" : "ODO chưa cập nhật") + " · " + toDisplayString(__props.car.transmission || "Hộp số chưa cập nhật"), 1),
				promotion.value ? (openBlock(), createElementBlock("div", _hoisted_10, [createBaseVNode("span", _hoisted_11, toDisplayString(unref(formatPrice)(__props.car.price)) + " VNĐ", 1), createBaseVNode("strong", null, [createTextVNode(toDisplayString(unref(formatPrice)(discountedPrice.value)) + " ", 1), _cache[2] || (_cache[2] = createBaseVNode("small", null, "VNĐ", -1))])])) : (openBlock(), createElementBlock("div", _hoisted_12, [createTextVNode(toDisplayString(unref(formatPrice)(__props.car.price)) + " ", 1), _cache[3] || (_cache[3] = createBaseVNode("small", null, "VNĐ", -1))])),
				promotion.value ? (openBlock(), createElementBlock("div", _hoisted_13, toDisplayString(promotionTitle.value) + " - " + toDisplayString(promotionLabel.value), 1)) : createCommentVNode("", true),
				createBaseVNode("label", _hoisted_14, [createBaseVNode("input", {
					type: "checkbox",
					checked: unref(has)(__props.car.id),
					onChange: onCompare
				}, null, 40, _hoisted_15), _cache[4] || (_cache[4] = createTextVNode(" So sánh xe", -1))]),
				createBaseVNode("div", _hoisted_16, [createVNode(_component_router_link, {
					class: "ford-btn-primary text-center",
					to: `/car/detail/${__props.car.id}`
				}, {
					default: withCtx(() => [..._cache[5] || (_cache[5] = [createTextVNode("Chi tiết", -1)])]),
					_: 1
				}, 8, ["to"]), !unref(auth).isAdmin ? (openBlock(), createElementBlock("button", {
					key: 0,
					type: "button",
					class: "ford-btn-outline",
					disabled: stock.value <= 0,
					onClick: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("add-cart", __props.car.id))
				}, toDisplayString(stock.value > 0 ? "Đặt cọc ngay" : "Hết hàng"), 9, _hoisted_17)) : createCommentVNode("", true)])
			])]);
		};
	}
}, [["__scopeId", "data-v-f0f8684c"]]);
//#endregion
//#region src/stores/catalog.js
var CACHE_TTL_MS = 6e4;
var useCatalogStore = defineStore("catalog", () => {
	const cars = ref([]);
	const brands = ref([]);
	const carsLoadedAt = ref(0);
	const brandsLoadedAt = ref(0);
	const carDetails = ref({});
	const detailLoadedAt = ref({});
	let carsRequest = null;
	let brandsRequest = null;
	const detailRequests = /* @__PURE__ */ new Map();
	async function loadCars(force = false) {
		if (!force && carsLoadedAt.value && Date.now() - carsLoadedAt.value < CACHE_TTL_MS) return cars.value;
		if (carsRequest) return carsRequest;
		carsRequest = carApi.getAll().then(({ data }) => {
			cars.value = Array.isArray(data) ? data : data.data || [];
			carsLoadedAt.value = Date.now();
			return cars.value;
		}).finally(() => {
			carsRequest = null;
		});
		return carsRequest;
	}
	async function loadBrands(force = false) {
		if (!force && brandsLoadedAt.value && Date.now() - brandsLoadedAt.value < CACHE_TTL_MS) return brands.value;
		if (brandsRequest) return brandsRequest;
		brandsRequest = brandApi.getAll().then(({ data }) => {
			brands.value = Array.isArray(data) ? data : data.data || [];
			brandsLoadedAt.value = Date.now();
			return brands.value;
		}).finally(() => {
			brandsRequest = null;
		});
		return brandsRequest;
	}
	async function loadCarDetail(id, force = false) {
		const key = String(id);
		const loadedAt = detailLoadedAt.value[key] || 0;
		if (!force && carDetails.value[key] && Date.now() - loadedAt < CACHE_TTL_MS) return carDetails.value[key];
		if (detailRequests.has(key)) return detailRequests.get(key);
		const request = carApi.getById(key).then(({ data }) => {
			if (!data?.success || !data?.data) throw new Error(data?.message || "Không tìm thấy xe");
			const detail = data.data;
			carDetails.value = {
				...carDetails.value,
				[key]: detail
			};
			detailLoadedAt.value = {
				...detailLoadedAt.value,
				[key]: Date.now()
			};
			return detail;
		}).finally(() => {
			detailRequests.delete(key);
		});
		detailRequests.set(key, request);
		return request;
	}
	function invalidate() {
		carsLoadedAt.value = 0;
		brandsLoadedAt.value = 0;
		detailLoadedAt.value = {};
	}
	return {
		cars,
		brands,
		loadCars,
		loadBrands,
		loadCarDetail,
		invalidate
	};
});
//#endregion
export { CarCard_default as n, useCatalogStore as t };
