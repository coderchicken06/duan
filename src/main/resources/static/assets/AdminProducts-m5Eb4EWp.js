import { D as createCommentVNode, Dt as toDisplayString, G as watch, K as withCtx, M as createVNode, O as createElementBlock, S as Fragment, T as createBaseVNode, Tt as normalizeClass, U as renderList, V as openBlock, W as resolveComponent, a as carImageUrl, c as formatPrice, j as createTextVNode, ot as unref, t as adminApi, tt as ref, v as useDefaultCarImage, w as computed, z as onMounted } from "./api-Cd2rmWmR.js";
import { a as useRoute, n as _plugin_vue_export_helper_default } from "./index-BX99C7pg.js";
import { t as showCartToast } from "./useCartToast-CRv33ZAZ.js";
//#region src/views/admin/AdminProducts.vue
var _hoisted_1 = { class: "container cs-container py-5" };
var _hoisted_2 = { class: "page-heading" };
var _hoisted_3 = { class: "table-responsive cs-card p-3" };
var _hoisted_4 = { class: "table cs-table align-middle mb-0" };
var _hoisted_5 = { key: 0 };
var _hoisted_6 = { class: "car-cell" };
var _hoisted_7 = ["src", "alt"];
var _hoisted_8 = { class: "text-end action-cell" };
var _hoisted_9 = ["disabled", "onClick"];
var _hoisted_10 = { key: 2 };
var AdminProducts_default = /*#__PURE__*/ _plugin_vue_export_helper_default({
	__name: "AdminProducts",
	setup(__props) {
		const cars = ref([]);
		const brands = ref([]);
		const loading = ref(false);
		const submitting = ref(false);
		const route = useRoute();
		const brandMap = computed(() => new Map(brands.value.map((brand) => [Number(brand.id), brand.name])));
		onMounted(load);
		watch(() => route.path, load);
		async function load() {
			loading.value = true;
			try {
				const [carResponse, brandResponse] = await Promise.all([adminApi.getCars(), adminApi.getBrands()]);
				cars.value = Array.isArray(carResponse.data) ? carResponse.data : carResponse.data.data || [];
				brands.value = Array.isArray(brandResponse.data) ? brandResponse.data : brandResponse.data.data || [];
			} catch (error) {
				showCartToast(error.response?.data?.message || "Không thể tải danh sách sản phẩm", "error");
			} finally {
				loading.value = false;
			}
		}
		async function remove(car) {
			if (submitting.value) return;
			if (!confirm(`Xóa xe “${car.name}”?`)) return;
			const previousCars = cars.value;
			cars.value = cars.value.filter((item) => item.id !== car.id);
			submitting.value = true;
			try {
				const { data } = await adminApi.deleteCar(car.id);
				if (data.success === false) {
					cars.value = previousCars;
					showCartToast(data.message || "Không thể xóa xe", "error");
					return;
				}
				showCartToast(data.message || "Đã xóa xe thành công");
			} catch (error) {
				cars.value = previousCars;
				showCartToast(error.response?.data?.message || "Không thể xóa xe", "error");
			} finally {
				submitting.value = false;
			}
		}
		const brandName = (brandId) => brandMap.value.get(Number(brandId)) || "Chưa xác định";
		const statusLabel = (status) => ({
			AVAILABLE: "Có sẵn",
			DEPOSITED: "Đã đặt cọc",
			SOLD: "Đã bán",
			INACTIVE: "Ngừng kinh doanh"
		})[status] || status || "Chưa xác định";
		const statusClass = (status) => String(status || "").toLowerCase();
		return (_ctx, _cache) => {
			const _component_router_link = resolveComponent("router-link");
			return openBlock(), createElementBlock("div", _hoisted_1, [createBaseVNode("div", _hoisted_2, [_cache[2] || (_cache[2] = createBaseVNode("div", null, [
				createBaseVNode("span", { class: "admin-eyebrow" }, "DANH MỤC XE"),
				createBaseVNode("h2", { class: "cs-page-title mb-0" }, "Quản lý sản phẩm"),
				createBaseVNode("p", { class: "page-description mb-0" }, "Thêm mới, cập nhật và quản lý thông tin xe đang kinh doanh.")
			], -1)), createVNode(_component_router_link, {
				class: "btn cs-btn cs-btn-primary",
				to: "/car/create"
			}, {
				default: withCtx(() => [..._cache[1] || (_cache[1] = [createTextVNode("+ Thêm xe", -1)])]),
				_: 1
			})]), createBaseVNode("div", _hoisted_3, [createBaseVNode("table", _hoisted_4, [_cache[6] || (_cache[6] = createBaseVNode("thead", null, [createBaseVNode("tr", null, [
				createBaseVNode("th", null, "Xe"),
				createBaseVNode("th", null, "Thương hiệu"),
				createBaseVNode("th", null, "Giá"),
				createBaseVNode("th", null, "Tồn kho"),
				createBaseVNode("th", null, "Trạng thái"),
				createBaseVNode("th", { class: "text-end" }, "Thao tác")
			])], -1)), createBaseVNode("tbody", null, [loading.value ? (openBlock(), createElementBlock("tr", _hoisted_5, [..._cache[3] || (_cache[3] = [createBaseVNode("td", {
				colspan: "6",
				class: "empty-cell"
			}, "Đang tải danh sách sản phẩm...", -1)])])) : (openBlock(true), createElementBlock(Fragment, { key: 1 }, renderList(cars.value, (car) => {
				return openBlock(), createElementBlock("tr", { key: car.id }, [
					createBaseVNode("td", null, [createBaseVNode("div", _hoisted_6, [createBaseVNode("img", {
						src: unref(carImageUrl)(car.image),
						alt: car.name,
						onError: _cache[0] || (_cache[0] = (...args) => unref(useDefaultCarImage) && unref(useDefaultCarImage)(...args))
					}, null, 40, _hoisted_7), createBaseVNode("div", null, [createBaseVNode("strong", null, toDisplayString(car.name), 1), createBaseVNode("small", null, "ID: " + toDisplayString(car.id), 1)])])]),
					createBaseVNode("td", null, toDisplayString(brandName(car.brandId)), 1),
					createBaseVNode("td", null, toDisplayString(unref(formatPrice)(car.price)) + " đ", 1),
					createBaseVNode("td", null, [createBaseVNode("span", { class: normalizeClass(["stock-badge", { low: car.stock <= 3 }]) }, toDisplayString(car.stock), 3)]),
					createBaseVNode("td", null, [createBaseVNode("span", { class: normalizeClass(["status-badge", statusClass(car.status)]) }, toDisplayString(statusLabel(car.status)), 3)]),
					createBaseVNode("td", _hoisted_8, [createVNode(_component_router_link, {
						to: `/car/edit/${car.id}`,
						class: "btn btn-sm cs-btn-ghost"
					}, {
						default: withCtx(() => [..._cache[4] || (_cache[4] = [createTextVNode("Sửa", -1)])]),
						_: 1
					}, 8, ["to"]), createBaseVNode("button", {
						class: "btn btn-sm cs-btn-danger",
						type: "button",
						disabled: submitting.value,
						onClick: ($event) => remove(car)
					}, toDisplayString(submitting.value ? "Đang xử lý..." : "Xóa"), 9, _hoisted_9)])
				]);
			}), 128)), !loading.value && cars.value.length === 0 ? (openBlock(), createElementBlock("tr", _hoisted_10, [..._cache[5] || (_cache[5] = [createBaseVNode("td", {
				colspan: "6",
				class: "empty-cell"
			}, "Chưa có sản phẩm.", -1)])])) : createCommentVNode("", true)])])])]);
		};
	}
}, [["__scopeId", "data-v-be19d9df"]]);
//#endregion
export { AdminProducts_default as default };
