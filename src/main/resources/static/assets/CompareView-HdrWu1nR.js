import { Dt as toDisplayString, K as withCtx, M as createVNode, O as createElementBlock, S as Fragment, T as createBaseVNode, Tt as normalizeClass, U as renderList, V as openBlock, W as resolveComponent, a as carImageUrl, c as formatPrice, i as carApi, j as createTextVNode, ot as unref, tt as ref, w as computed, z as onMounted } from "./api-lWF_eiJ8.js";
import { a as useRoute, o as useRouter, r as useCompare, t as _plugin_vue_export_helper_default } from "./index-LltwIOcO.js";
//#region src/views/CompareView.vue
var _hoisted_1 = { class: "container cs-container py-5" };
var _hoisted_2 = {
	key: 0,
	class: "text-center py-5"
};
var _hoisted_3 = {
	key: 1,
	class: "ford-empty-state"
};
var _hoisted_4 = {
	key: 2,
	class: "compare-wrap"
};
var _hoisted_5 = { class: "compare-table" };
var _hoisted_6 = { class: "compare-car-card" };
var _hoisted_7 = { class: "compare-car-img-wrapper" };
var _hoisted_8 = ["src", "alt"];
var _hoisted_9 = { class: "compare-car-info" };
var _hoisted_10 = { class: "compare-car-name" };
var _hoisted_11 = { class: "compare-car-price" };
var _hoisted_12 = { class: "label-col" };
var CompareView_default = /*#__PURE__*/ _plugin_vue_export_helper_default({
	__name: "CompareView",
	setup(__props) {
		const route = useRoute(), router = useRouter(), cars = ref([]), loading = ref(true);
		const { selectedIds, clear } = useCompare();
		const value = (v) => v === null || v === void 0 || v === "" ? "Chưa cập nhật" : v;
		const km = (v) => v == null ? "Chưa cập nhật" : Number(v).toLocaleString("vi-VN") + " km";
		const specs = [
			["Giá bán", (c) => formatPrice(c.price) + " VNĐ"],
			["Năm sản xuất", (c) => value(c.year)],
			["Đăng ký lần đầu", (c) => value(c.firstRegistration)],
			["ODO", (c) => km(c.mileage)],
			["Kiểu dáng", (c) => value(c.bodyType)],
			["Nhiên liệu", (c) => value(c.fuelType || c.engineType)],
			["Dung tích", (c) => value(c.engineCapacity)],
			["Công suất", (c) => value(c.horsepower) + (c.horsepower ? " HP" : "")],
			["Mô-men xoắn", (c) => value(c.torque)],
			["Hộp số", (c) => value(c.transmission)],
			["Dẫn động", (c) => value(c.drivetrain)],
			["Số chỗ", (c) => value(c.seats)],
			["Tiêu hao nhiên liệu", (c) => value(c.fuelConsumption)],
			["Ngoại thất", (c) => value(c.color)],
			["Nội thất", (c) => value(c.interiorColor)],
			["Bảo hành", (c) => value(c.warranty)],
			["Kiểm định", (c) => value(c.inspectionLevel)],
			["Đại lý", (c) => value(c.dealerName)]
		];
		const rows = computed(() => specs.map(([label, fn]) => {
			const values = cars.value.map(fn);
			return {
				label,
				values,
				different: new Set(values).size > 1
			};
		}));
		onMounted(async () => {
			const ids = [...new Set(String(route.query.ids || selectedIds.value.join(",")).split(",").map(Number).filter((id) => Number.isInteger(id) && id > 0))].slice(0, 3);
			selectedIds.value = ids;
			try {
				const responses = await Promise.all(ids.map((id) => carApi.getById(id).catch(() => null)));
				cars.value = responses.filter(Boolean).map((r) => r.data?.data || r.data).filter((car) => car && car.id != null);
			} catch (error) {
				console.error("Không thể tải dữ liệu so sánh:", error);
				cars.value = [];
			} finally {
				loading.value = false;
			}
		});
		function clearAndBack() {
			clear();
			router.push("/car/list");
		}
		function useCompareFallback(event) {
			event.target.onerror = null;
			event.target.src = "/images/camry.jpg";
		}
		return (_ctx, _cache) => {
			const _component_router_link = resolveComponent("router-link");
			return openBlock(), createElementBlock("main", _hoisted_1, [createBaseVNode("div", { class: "compare-heading" }, [_cache[0] || (_cache[0] = createBaseVNode("div", null, [
				createBaseVNode("span", { class: "eyebrow" }, "CARSTORE SELECT"),
				createBaseVNode("h1", null, "So sánh xe"),
				createBaseVNode("p", null, "Chọn từ 2 đến 3 xe để đối chiếu giá, vận hành, tiện nghi và tình trạng kiểm định.")
			], -1)), createBaseVNode("button", {
				class: "ford-btn-outline",
				onClick: clearAndBack
			}, "Xóa lựa chọn")]), loading.value ? (openBlock(), createElementBlock("div", _hoisted_2, "Đang tải...")) : cars.value.length < 2 ? (openBlock(), createElementBlock("div", _hoisted_3, "Bạn cần chọn ít nhất 2 xe để so sánh.")) : (openBlock(), createElementBlock("div", _hoisted_4, [createBaseVNode("table", _hoisted_5, [createBaseVNode("thead", null, [createBaseVNode("tr", null, [_cache[2] || (_cache[2] = createBaseVNode("th", { class: "label-col" }, "Tiêu chí", -1)), (openBlock(true), createElementBlock(Fragment, null, renderList(cars.value, (car) => {
				return openBlock(), createElementBlock("th", { key: car.id }, [createBaseVNode("div", _hoisted_6, [createBaseVNode("div", _hoisted_7, [createBaseVNode("img", {
					class: "compare-car-img",
					src: unref(carImageUrl)(car.image),
					alt: car.name,
					onError: useCompareFallback
				}, null, 40, _hoisted_8)]), createBaseVNode("div", _hoisted_9, [
					createBaseVNode("h3", _hoisted_10, toDisplayString(car.name), 1),
					createBaseVNode("div", _hoisted_11, toDisplayString(unref(formatPrice)(car.price)) + " VNĐ", 1),
					createVNode(_component_router_link, {
						class: "compare-car-link",
						to: `/car/detail/${car.id}`
					}, {
						default: withCtx(() => [..._cache[1] || (_cache[1] = [createTextVNode("Xem chi tiết", -1)])]),
						_: 1
					}, 8, ["to"])
				])])]);
			}), 128))])]), createBaseVNode("tbody", null, [(openBlock(true), createElementBlock(Fragment, null, renderList(rows.value, (row) => {
				return openBlock(), createElementBlock("tr", { key: row.label }, [createBaseVNode("td", _hoisted_12, toDisplayString(row.label), 1), (openBlock(true), createElementBlock(Fragment, null, renderList(row.values, (value, index) => {
					return openBlock(), createElementBlock("td", {
						key: index,
						class: normalizeClass({ different: row.different })
					}, toDisplayString(value), 3);
				}), 128))]);
			}), 128))])])]))]);
		};
	}
}, [["__scopeId", "data-v-0fa98f10"]]);
//#endregion
export { CompareView_default as default };
