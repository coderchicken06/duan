import { D as createCommentVNode, Dt as toDisplayString, E as createBlock, K as withCtx, O as createElementBlock, T as createBaseVNode, V as openBlock, W as resolveComponent, a as carImageUrl, c as formatPrice, i as carApi, j as createTextVNode, m as quotationApi, ot as unref, q as withDirectives, tt as ref, v as useDefaultCarImage, z as onMounted } from "./api-Cd2rmWmR.js";
import { a as useRoute, n as _plugin_vue_export_helper_default, o as useRouter, u as vModelText } from "./index-DOyj8jjE.js";
import { t as useAutoRefresh } from "./useAutoRefresh-DjAfN_Vr.js";
//#region src/views/QuotationView.vue
var _hoisted_1 = { class: "quotation-page py-5" };
var _hoisted_2 = { class: "container" };
var _hoisted_3 = {
	key: 0,
	class: "text-center py-5"
};
var _hoisted_4 = {
	key: 1,
	class: "alert alert-danger"
};
var _hoisted_5 = {
	key: 2,
	class: "quote-card"
};
var _hoisted_6 = { class: "text-end" };
var _hoisted_7 = {
	key: 0,
	class: "car-row"
};
var _hoisted_8 = ["src", "alt"];
var _hoisted_9 = { class: "amounts" };
var _hoisted_10 = { class: "total" };
var _hoisted_11 = { class: "status" };
var _hoisted_12 = {
	key: 0,
	class: "mt-3 mb-0"
};
var _hoisted_13 = {
	key: 0,
	class: "order-form"
};
var _hoisted_14 = ["disabled"];
var _hoisted_15 = ["disabled"];
var QuotationView_default = /*#__PURE__*/ _plugin_vue_export_helper_default({
	__name: "QuotationView",
	setup(__props) {
		const route = useRoute(), router = useRouter(), quote = ref({}), car = ref(null), loading = ref(true), submitting = ref(false), error = ref("");
		const orderForm = ref({
			address: "",
			registrationAddress: "",
			paymentMethod: "SePay"
		});
		const formatDate = (v) => v ? new Date(v).toLocaleDateString("vi-VN") : "";
		const printQuote = () => window.print();
		async function load() {
			try {
				const { data } = await quotationApi.getById(route.params.id);
				quote.value = data.data;
				const response = await carApi.getById(quote.value.carId);
				car.value = response.data.data || response.data;
			} catch (e) {
				error.value = e.response?.data?.message || "Không thể tải báo giá";
			} finally {
				loading.value = false;
			}
		}
		async function confirmQuote() {
			submitting.value = true;
			try {
				const { data } = await quotationApi.confirm(quote.value.id);
				quote.value = data.data;
			} catch (e) {
				error.value = e.response?.data?.message || "Không thể xác nhận báo giá";
			} finally {
				submitting.value = false;
			}
		}
		async function convertToOrder() {
			submitting.value = true;
			error.value = "";
			try {
				const { data } = await quotationApi.convertToOrder(quote.value.id, orderForm.value);
				router.push(`/order/detail/${data.data.id}`);
			} catch (e) {
				error.value = e.response?.data?.message || "Không thể tạo đơn hàng";
			} finally {
				submitting.value = false;
			}
		}
		onMounted(load);
		useAutoRefresh(load);
		return (_ctx, _cache) => {
			const _component_router_link = resolveComponent("router-link");
			return openBlock(), createElementBlock("main", _hoisted_1, [createBaseVNode("div", _hoisted_2, [loading.value ? (openBlock(), createElementBlock("div", _hoisted_3, [..._cache[4] || (_cache[4] = [createBaseVNode("span", { class: "spinner-border text-danger" }, null, -1)])])) : error.value ? (openBlock(), createElementBlock("div", _hoisted_4, toDisplayString(error.value), 1)) : (openBlock(), createElementBlock("article", _hoisted_5, [
				createBaseVNode("header", null, [_cache[5] || (_cache[5] = createBaseVNode("div", null, [createBaseVNode("span", { class: "eyebrow" }, "CARSTORE"), createBaseVNode("h1", null, "BÁO GIÁ XE")], -1)), createBaseVNode("div", _hoisted_6, [createBaseVNode("strong", null, toDisplayString(quote.value.quotationNo || `BG-${quote.value.id}`), 1), createBaseVNode("small", null, toDisplayString(formatDate(quote.value.quotationDate)), 1)])]),
				createBaseVNode("section", null, [_cache[7] || (_cache[7] = createBaseVNode("h2", null, "Khách hàng", -1)), createBaseVNode("p", null, [_cache[6] || (_cache[6] = createBaseVNode("span", null, "Tài khoản", -1)), createBaseVNode("strong", null, toDisplayString(quote.value.customerUsername), 1)])]),
				createBaseVNode("section", null, [_cache[8] || (_cache[8] = createBaseVNode("h2", null, "Thông tin xe", -1)), car.value ? (openBlock(), createElementBlock("div", _hoisted_7, [createBaseVNode("img", {
					src: unref(carImageUrl)(car.value.image),
					alt: car.value.name,
					onError: _cache[0] || (_cache[0] = (...args) => unref(useDefaultCarImage) && unref(useDefaultCarImage)(...args))
				}, null, 40, _hoisted_8), createBaseVNode("div", null, [createBaseVNode("h3", null, toDisplayString(car.value.name), 1), createBaseVNode("p", null, toDisplayString(car.value.year) + " · " + toDisplayString(car.value.color) + " · " + toDisplayString(car.value.transmission), 1)])])) : createCommentVNode("", true)]),
				createBaseVNode("section", _hoisted_9, [
					createBaseVNode("p", null, [_cache[9] || (_cache[9] = createBaseVNode("span", null, "Số lượng", -1)), createBaseVNode("strong", null, toDisplayString(quote.value.items?.[0]?.quantity || 1), 1)]),
					createBaseVNode("p", null, [_cache[10] || (_cache[10] = createBaseVNode("span", null, "Đơn giá", -1)), createBaseVNode("strong", null, toDisplayString(unref(formatPrice)(quote.value.carPrice)) + " VNĐ", 1)]),
					createBaseVNode("p", null, [_cache[11] || (_cache[11] = createBaseVNode("span", null, "Giảm giá được duyệt", -1)), createBaseVNode("strong", null, "-" + toDisplayString(unref(formatPrice)(quote.value.discount)) + " VNĐ", 1)]),
					createBaseVNode("p", _hoisted_10, [_cache[12] || (_cache[12] = createBaseVNode("span", null, "Tổng báo giá", -1)), createBaseVNode("strong", null, toDisplayString(unref(formatPrice)(quote.value.totalPrice)) + " VNĐ", 1)])
				]),
				createBaseVNode("section", null, [
					_cache[13] || (_cache[13] = createBaseVNode("h2", null, "Trạng thái", -1)),
					createBaseVNode("span", _hoisted_11, toDisplayString(quote.value.status), 1),
					quote.value.note ? (openBlock(), createElementBlock("p", _hoisted_12, toDisplayString(quote.value.note), 1)) : createCommentVNode("", true)
				]),
				quote.value.status === "Khách đã xác nhận" ? (openBlock(), createElementBlock("section", _hoisted_13, [
					_cache[14] || (_cache[14] = createBaseVNode("h2", null, "Thông tin tạo đơn hàng", -1)),
					withDirectives(createBaseVNode("input", {
						"onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => orderForm.value.address = $event),
						class: "form-control",
						maxlength: "500",
						placeholder: "Địa chỉ nhận xe",
						required: ""
					}, null, 512), [[
						vModelText,
						orderForm.value.address,
						void 0,
						{ trim: true }
					]]),
					withDirectives(createBaseVNode("input", {
						"onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => orderForm.value.registrationAddress = $event),
						class: "form-control",
						maxlength: "500",
						placeholder: "Địa chỉ đăng ký xe (nếu khác)"
					}, null, 512), [[
						vModelText,
						orderForm.value.registrationAddress,
						void 0,
						{ trim: true }
					]]),
					_cache[15] || (_cache[15] = createBaseVNode("div", { class: "form-control" }, "Thanh toán QR SePay", -1))
				])) : createCommentVNode("", true),
				createBaseVNode("footer", null, [
					createBaseVNode("button", {
						class: "btn btn-outline-secondary",
						onClick: _cache[3] || (_cache[3] = ($event) => _ctx.$router.back())
					}, "Quay lại"),
					createBaseVNode("button", {
						class: "btn btn-dark",
						onClick: printQuote
					}, "In / Lưu PDF"),
					quote.value.status === "Đã duyệt" ? (openBlock(), createElementBlock("button", {
						key: 0,
						class: "btn btn-danger",
						disabled: submitting.value,
						onClick: confirmQuote
					}, "Xác nhận báo giá", 8, _hoisted_14)) : createCommentVNode("", true),
					quote.value.status === "Khách đã xác nhận" ? (openBlock(), createElementBlock("button", {
						key: 1,
						class: "btn btn-danger",
						disabled: submitting.value || !orderForm.value.address,
						onClick: convertToOrder
					}, "Tạo đơn hàng", 8, _hoisted_15)) : createCommentVNode("", true),
					quote.value.orderId ? (openBlock(), createBlock(_component_router_link, {
						key: 2,
						class: "btn btn-danger",
						to: `/order/detail/${quote.value.orderId}`
					}, {
						default: withCtx(() => [..._cache[16] || (_cache[16] = [createTextVNode("Xem đơn hàng", -1)])]),
						_: 1
					}, 8, ["to"])) : createCommentVNode("", true)
				])
			]))])]);
		};
	}
}, [["__scopeId", "data-v-339b0c2d"]]);
//#endregion
export { QuotationView_default as default };
