import { D as createCommentVNode, Dt as toDisplayString, E as createBlock, K as withCtx, O as createElementBlock, S as Fragment, T as createBaseVNode, Tt as normalizeClass, V as openBlock, W as resolveComponent, a as carImageUrl, c as formatPrice, i as carApi, j as createTextVNode, m as quotationApi, o as cartApi, ot as unref, q as withDirectives, tt as ref, v as useDefaultCarImage, w as computed, z as onMounted } from "./api-Cd2rmWmR.js";
import { a as useRoute, d as vModelText, i as useAuthStore, n as _plugin_vue_export_helper_default, o as useRouter, r as useCartStore } from "./index-BX99C7pg.js";
import { n as useAutoRefresh } from "./useAutoRefresh-CiKJsJMn.js";
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
var _hoisted_11 = { class: "quote-validity" };
var _hoisted_12 = { class: "price-lock-term" };
var _hoisted_13 = {
	key: 0,
	class: "quote-expired-message"
};
var _hoisted_14 = { class: "mt-3 mb-0" };
var _hoisted_15 = {
	key: 0,
	class: "order-form"
};
var _hoisted_16 = ["disabled"];
var _hoisted_17 = ["disabled"];
var _hoisted_18 = ["disabled"];
var _hoisted_19 = ["disabled"];
var QuotationView_default = /*#__PURE__*/ _plugin_vue_export_helper_default({
	__name: "QuotationView",
	setup(__props) {
		const route = useRoute(), router = useRouter(), quote = ref({}), car = ref(null), loading = ref(true), submitting = ref(false), error = ref("");
		const cart = useCartStore();
		const auth = useAuthStore();
		const orderForm = ref({
			address: "",
			registrationAddress: "",
			paymentMethod: "SePay"
		});
		const normalizedStatus = computed(() => String(quote.value.status || "").trim().toUpperCase());
		const isAdmin = computed(() => auth.isAdmin);
		const isPending = computed(() => ["PENDING", "CHỜ XÁC NHẬN"].includes(normalizedStatus.value));
		const isApproved = computed(() => ["APPROVED", "ĐÃ DUYỆT"].includes(normalizedStatus.value));
		const isConfirmed = computed(() => ["CONFIRMED", "KHÁCH ĐÃ XÁC NHẬN"].includes(normalizedStatus.value));
		const issuedAt = computed(() => quote.value.quotationDate);
		const expiryDate = computed(() => {
			if (!issuedAt.value) return null;
			const date = new Date(issuedAt.value);
			if (Number.isNaN(date.getTime())) return null;
			date.setDate(date.getDate() + 7);
			date.setHours(23, 59, 59, 999);
			return date;
		});
		const isExpired = computed(() => (isApproved.value || isConfirmed.value) && expiryDate.value && Date.now() > expiryDate.value.getTime());
		const dealerNote = computed(() => {
			return String(quote.value.promotionName || quote.value.note || "").trim() || "Áp dụng theo chính sách ưu đãi hiện hành của đại lý.";
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
		async function handleDepositFromQuotation() {
			if (!quote.value?.id || !car.value) return;
			if (isExpired.value) {
				error.value = "Báo giá đã hết hạn hiệu lực (quá 07 ngày). Vui lòng yêu cầu báo giá mới.";
				return;
			}
			submitting.value = true;
			error.value = "";
			try {
				const { data } = await quotationApi.confirm(quote.value.id);
				if (!data?.success || !data.data) throw new Error(data?.message || "Không thể xác nhận báo giá");
				quote.value = data.data;
				const price = Number(quote.value.carPrice ?? car.value.price ?? 0);
				const discountAmount = Math.max(0, Number(quote.value.discount ?? 0));
				const finalPrice = Math.max(0, Number(quote.value.totalPrice ?? price - discountAmount));
				const discountPercent = price > 0 ? discountAmount * 100 / price : 0;
				await cartApi.clear();
				cart.setDepositItem({
					id: quote.value.carId ?? car.value.id,
					name: car.value.name,
					year: car.value.year,
					color: car.value.color,
					bodyType: car.value.bodyType,
					image: car.value.image,
					price,
					listPrice: price,
					discountAmount,
					discountPercent,
					finalPrice,
					depositAmount: finalPrice * .1,
					quotationId: quote.value.id
				});
				router.push("/cart/view");
			} catch (e) {
				error.value = e.response?.data?.message || e.message || "Không thể chuẩn bị phiếu đặt cọc theo báo giá";
			} finally {
				submitting.value = false;
			}
		}
		async function updateQuoteStatus(status) {
			submitting.value = true;
			error.value = "";
			try {
				const { data } = await quotationApi.update(quote.value.id, {
					discount: quote.value.discount || 0,
					note: quote.value.note,
					status
				});
				if (!data?.success || !data.data) throw new Error(data?.message || "Không thể cập nhật trạng thái báo giá");
				quote.value = data.data;
			} catch (e) {
				error.value = e.response?.data?.message || e.message || "Không thể cập nhật trạng thái báo giá";
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
			return openBlock(), createElementBlock("main", _hoisted_1, [createBaseVNode("div", _hoisted_2, [loading.value ? (openBlock(), createElementBlock("div", _hoisted_3, [..._cache[6] || (_cache[6] = [createBaseVNode("span", { class: "spinner-border text-danger" }, null, -1)])])) : error.value ? (openBlock(), createElementBlock("div", _hoisted_4, toDisplayString(error.value), 1)) : (openBlock(), createElementBlock("article", _hoisted_5, [
				createBaseVNode("header", null, [_cache[7] || (_cache[7] = createBaseVNode("div", null, [createBaseVNode("span", { class: "eyebrow" }, "CARSTORE"), createBaseVNode("h1", null, "BÁO GIÁ XE")], -1)), createBaseVNode("div", _hoisted_6, [createBaseVNode("strong", null, toDisplayString(quote.value.quotationNo || `BG-${quote.value.id}`), 1), createBaseVNode("small", null, toDisplayString(formatDate(quote.value.quotationDate)), 1)])]),
				createBaseVNode("section", null, [_cache[9] || (_cache[9] = createBaseVNode("h2", null, "Khách hàng", -1)), createBaseVNode("p", null, [_cache[8] || (_cache[8] = createBaseVNode("span", null, "Tài khoản", -1)), createBaseVNode("strong", null, toDisplayString(quote.value.customerUsername), 1)])]),
				createBaseVNode("section", null, [_cache[10] || (_cache[10] = createBaseVNode("h2", null, "Thông tin xe", -1)), car.value ? (openBlock(), createElementBlock("div", _hoisted_7, [createBaseVNode("img", {
					src: unref(carImageUrl)(car.value.image),
					alt: car.value.name,
					onError: _cache[0] || (_cache[0] = (...args) => unref(useDefaultCarImage) && unref(useDefaultCarImage)(...args))
				}, null, 40, _hoisted_8), createBaseVNode("div", null, [createBaseVNode("h3", null, toDisplayString(car.value.name), 1), createBaseVNode("p", null, toDisplayString(car.value.year) + " · " + toDisplayString(car.value.color) + " · " + toDisplayString(car.value.transmission), 1)])])) : createCommentVNode("", true)]),
				createBaseVNode("section", _hoisted_9, [
					createBaseVNode("p", null, [_cache[11] || (_cache[11] = createBaseVNode("span", null, "Đơn giá niêm yết", -1)), createBaseVNode("strong", null, toDisplayString(unref(formatPrice)(quote.value.carPrice)) + " VNĐ", 1)]),
					createBaseVNode("p", { class: normalizeClass({ "approved-discount": Number(quote.value.discount) > 0 }) }, [_cache[12] || (_cache[12] = createBaseVNode("span", null, "Giảm giá được duyệt", -1)), createBaseVNode("strong", null, "-" + toDisplayString(unref(formatPrice)(quote.value.discount)) + " VNĐ", 1)], 2),
					createBaseVNode("p", _hoisted_10, [_cache[13] || (_cache[13] = createBaseVNode("span", null, "Tổng giá trị xe sau ưu đãi", -1)), createBaseVNode("strong", null, toDisplayString(unref(formatPrice)(quote.value.totalPrice)) + " VNĐ", 1)])
				]),
				createBaseVNode("section", _hoisted_11, [
					_cache[16] || (_cache[16] = createBaseVNode("h2", null, "Thời hạn hiệu lực", -1)),
					createBaseVNode("p", null, [_cache[14] || (_cache[14] = createBaseVNode("span", null, "Ngày phát hành / duyệt", -1)), createBaseVNode("strong", null, toDisplayString(formatDate(issuedAt.value)), 1)]),
					createBaseVNode("p", null, [_cache[15] || (_cache[15] = createBaseVNode("span", null, "Hiệu lực đến hết ngày", -1)), createBaseVNode("strong", null, toDisplayString(formatDate(expiryDate.value)), 1)]),
					createBaseVNode("p", _hoisted_12, "Ưu đãi và mức giá được đại lý bảo lưu đến hết ngày " + toDisplayString(formatDate(expiryDate.value)) + ". Sau thời gian này, báo giá sẽ tự động hết hiệu lực.", 1)
				]),
				createBaseVNode("section", null, [
					_cache[18] || (_cache[18] = createBaseVNode("h2", null, "Trạng thái", -1)),
					createBaseVNode("span", { class: normalizeClass(["status", { expired: isExpired.value }]) }, toDisplayString(isExpired.value ? "Đã hết hạn" : quote.value.status), 3),
					isExpired.value ? (openBlock(), createElementBlock("p", _hoisted_13, "Báo giá đã hết hạn hiệu lực (quá 07 ngày). Vui lòng yêu cầu báo giá mới.")) : createCommentVNode("", true),
					createBaseVNode("p", _hoisted_14, [_cache[17] || (_cache[17] = createBaseVNode("strong", null, "Ghi chú từ đại lý:", -1)), createTextVNode(" " + toDisplayString(dealerNote.value), 1)])
				]),
				!isAdmin.value && isConfirmed.value && !isExpired.value ? (openBlock(), createElementBlock("section", _hoisted_15, [
					_cache[19] || (_cache[19] = createBaseVNode("h2", null, "Thông tin tạo đơn hàng", -1)),
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
					_cache[20] || (_cache[20] = createBaseVNode("div", { class: "form-control" }, "Thanh toán QR SePay", -1))
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
					!isAdmin.value && isApproved.value && !isExpired.value ? (openBlock(), createElementBlock("button", {
						key: 0,
						class: "btn btn-danger",
						disabled: submitting.value,
						onClick: handleDepositFromQuotation
					}, "Đặt cọc theo báo giá này", 8, _hoisted_16)) : createCommentVNode("", true),
					isAdmin.value && isPending.value ? (openBlock(), createElementBlock(Fragment, { key: 1 }, [createBaseVNode("button", {
						class: "btn btn-success",
						disabled: submitting.value,
						onClick: _cache[4] || (_cache[4] = ($event) => updateQuoteStatus("Đã duyệt"))
					}, "Duyệt báo giá", 8, _hoisted_17), createBaseVNode("button", {
						class: "btn btn-outline-danger",
						disabled: submitting.value,
						onClick: _cache[5] || (_cache[5] = ($event) => updateQuoteStatus("Từ chối"))
					}, "Từ chối", 8, _hoisted_18)], 64)) : createCommentVNode("", true),
					!isAdmin.value && isConfirmed.value && !isExpired.value ? (openBlock(), createElementBlock("button", {
						key: 2,
						class: "btn btn-danger",
						disabled: submitting.value || !orderForm.value.address,
						onClick: convertToOrder
					}, "Tạo đơn hàng", 8, _hoisted_19)) : createCommentVNode("", true),
					!isAdmin.value && quote.value.orderId ? (openBlock(), createBlock(_component_router_link, {
						key: 3,
						class: "btn btn-danger",
						to: `/order/detail/${quote.value.orderId}`
					}, {
						default: withCtx(() => [..._cache[21] || (_cache[21] = [createTextVNode("Xem đơn hàng", -1)])]),
						_: 1
					}, 8, ["to"])) : createCommentVNode("", true)
				])
			]))])]);
		};
	}
}, [["__scopeId", "data-v-897f6019"]]);
//#endregion
export { QuotationView_default as default };
