import { D as createCommentVNode, Dt as toDisplayString, G as watch, K as withCtx, M as createVNode, O as createElementBlock, S as Fragment, T as createBaseVNode, U as renderList, V as openBlock, W as resolveComponent, j as createTextVNode, o as cartApi, tt as ref, z as onMounted } from "./api-Cd2rmWmR.js";
import { a as useRoute, n as _plugin_vue_export_helper_default, r as useCartStore } from "./index-BX99C7pg.js";
import { t as showCartToast } from "./useCartToast-CRv33ZAZ.js";
import { n as CarCard_default, t as useCatalogStore } from "./catalog-DDBuI2N_.js";
import { n as useAutoRefresh } from "./useAutoRefresh-CiKJsJMn.js";
//#region src/views/HomeView.vue
var _hoisted_1 = { class: "page-home" };
var _hoisted_2 = {
	key: 0,
	class: "home-cart-alert show error"
};
var _hoisted_3 = { class: "ford-hero-panel" };
var _hoisted_4 = { class: "ford-hero-panel-content" };
var _hoisted_5 = { class: "ford-intro-actions" };
var _hoisted_6 = { class: "ford-hero-side" };
var _hoisted_7 = { class: "ford-hero-stat" };
var _hoisted_8 = { class: "ford-section container" };
var _hoisted_9 = { class: "ford-section-head" };
var _hoisted_10 = {
	key: 0,
	class: "ford-section-meta"
};
var _hoisted_11 = { class: "text-primary fw-bold" };
var _hoisted_12 = { class: "row g-4" };
var _hoisted_13 = {
	key: 0,
	class: "ford-api-error",
	role: "alert"
};
var _hoisted_14 = {
	key: 1,
	class: "ford-empty-state"
};
var HomeView_default = /*#__PURE__*/ _plugin_vue_export_helper_default({
	__name: "HomeView",
	setup(__props) {
		const route = useRoute();
		const cart = useCartStore();
		const catalog = useCatalogStore();
		const cars = ref([]);
		const loading = ref(true);
		const loadError = ref("");
		const alert = ref("");
		const q = ref(route.query.q || "");
		onMounted(loadCars);
		useAutoRefresh(() => loadCars(true, true), 0);
		watch(() => route.fullPath, () => {
			q.value = String(route.query.q || "");
			loadCars(true);
		});
		async function loadCars(silent = false, force = false) {
			if (!silent) {
				loading.value = true;
				loadError.value = "";
			}
			try {
				const result = await catalog.loadCars(force);
				const keyword = String(q.value || "").trim().toLowerCase();
				cars.value = result.filter((car) => {
					const name = String(car.name || "").toLowerCase();
					const brandName = String(car.brandName || "").toLowerCase();
					return String(car.status || "").toUpperCase() === "AVAILABLE" && (!keyword || name.includes(keyword) || brandName.includes(keyword));
				});
			} catch (error) {
				if (!silent) {
					cars.value = [];
					loadError.value = error.response?.data?.message || "Không thể kết nối cơ sở dữ liệu sản phẩm. Vui lòng kiểm tra backend rồi thử lại.";
				}
			} finally {
				if (!silent) loading.value = false;
			}
		}
		async function addToCart(id) {
			const { data } = await cartApi.add(id);
			if (data.success) {
				await cart.refresh();
				showCartToast("Thêm vào đặt cọc xe thành công!");
				alert.value = "";
			} else alert.value = data.message || "Không thể thêm vào đặt cọc xe";
		}
		return (_ctx, _cache) => {
			const _component_router_link = resolveComponent("router-link");
			return openBlock(), createElementBlock("div", _hoisted_1, [
				alert.value ? (openBlock(), createElementBlock("div", _hoisted_2, toDisplayString(alert.value), 1)) : createCommentVNode("", true),
				createBaseVNode("section", _hoisted_3, [createBaseVNode("div", _hoisted_4, [
					_cache[2] || (_cache[2] = createBaseVNode("span", { class: "ford-badge" }, "Xe mới • Giá tốt • Bảo hành dài hạn", -1)),
					_cache[3] || (_cache[3] = createBaseVNode("h1", null, "Khám phá phương tiện hoàn hảo cho mọi hành trình", -1)),
					_cache[4] || (_cache[4] = createBaseVNode("p", null, "Khám phá các mẫu xe mới, đặt lịch xem xe trực tuyến và sở hữu chiếc xe phù hợp nhất với phong cách của bạn. ", -1)),
					createBaseVNode("div", _hoisted_5, [createVNode(_component_router_link, {
						class: "ford-btn-primary",
						to: "/car/list"
					}, {
						default: withCtx(() => [..._cache[0] || (_cache[0] = [createTextVNode("Xem tất cả xe", -1)])]),
						_: 1
					}), createVNode(_component_router_link, {
						class: "ford-btn-outline",
						to: "/cart/view"
					}, {
						default: withCtx(() => [..._cache[1] || (_cache[1] = [createTextVNode("Giỏ hàng của bạn", -1)])]),
						_: 1
					})])
				]), createBaseVNode("div", _hoisted_6, [
					createBaseVNode("div", _hoisted_7, [createBaseVNode("strong", null, toDisplayString(cars.value.length), 1), _cache[5] || (_cache[5] = createBaseVNode("span", null, "mẫu xe đang chờ bạn", -1))]),
					_cache[6] || (_cache[6] = createBaseVNode("div", { class: "ford-hero-stat" }, [createBaseVNode("strong", null, "4.9/5"), createBaseVNode("span", null, "đánh giá khách hàng")], -1)),
					_cache[7] || (_cache[7] = createBaseVNode("div", { class: "ford-hero-stat" }, [createBaseVNode("strong", null, "24/7"), createBaseVNode("span", null, "hỗ trợ đặt lịch")], -1))
				])]),
				createBaseVNode("div", _hoisted_8, [
					createBaseVNode("div", _hoisted_9, [createBaseVNode("div", null, [_cache[11] || (_cache[11] = createBaseVNode("h2", null, "Sản phẩm nổi bật", -1)), q.value ? (openBlock(), createElementBlock("div", _hoisted_10, [
						_cache[9] || (_cache[9] = createTextVNode(" Tìm kiếm: “", -1)),
						createBaseVNode("span", _hoisted_11, toDisplayString(q.value), 1),
						_cache[10] || (_cache[10] = createTextVNode("” · ", -1)),
						createVNode(_component_router_link, {
							to: "/",
							class: "text-decoration-none"
						}, {
							default: withCtx(() => [..._cache[8] || (_cache[8] = [createTextVNode("Xóa bộ lọc", -1)])]),
							_: 1
						})
					])) : createCommentVNode("", true)])]),
					createBaseVNode("div", _hoisted_12, [(openBlock(true), createElementBlock(Fragment, null, renderList(cars.value, (car) => {
						return openBlock(), createElementBlock("div", {
							key: car.id,
							class: "col-12 col-md-6 col-lg-4"
						}, [createVNode(CarCard_default, {
							car,
							onAddCart: addToCart
						}, null, 8, ["car"])]);
					}), 128))]),
					loadError.value ? (openBlock(), createElementBlock("div", _hoisted_13, [createTextVNode(toDisplayString(loadError.value) + " ", 1), createBaseVNode("button", {
						type: "button",
						onClick: loadCars
					}, "Thử lại")])) : createCommentVNode("", true),
					!loading.value && !loadError.value && cars.value.length === 0 ? (openBlock(), createElementBlock("p", _hoisted_14, "Không tìm thấy xe nào.")) : createCommentVNode("", true)
				])
			]);
		};
	}
}, [["__scopeId", "data-v-dda719c9"]]);
//#endregion
export { HomeView_default as default };
