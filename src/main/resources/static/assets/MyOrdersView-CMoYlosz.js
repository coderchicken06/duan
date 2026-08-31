import { D as createCommentVNode, Dt as toDisplayString, G as watch, K as withCtx, M as createVNode, O as createElementBlock, S as Fragment, T as createBaseVNode, Tt as normalizeClass, U as renderList, V as openBlock, W as resolveComponent, a as carImageUrl, c as formatPrice, h as reviewApi, j as createTextVNode, ot as unref, q as withDirectives, tt as ref, u as orderApi, v as useDefaultCarImage, w as computed, y as api, z as onMounted } from "./api-BIOmrm3q.js";
import { a as useRoute, d as vModelText, p as withModifiers, t as _plugin_vue_export_helper_default, u as vModelSelect } from "./index-B5QpE601.js";
import { t as showCartToast } from "./useCartToast-CRv33ZAZ.js";
import { n as useAutoRefresh, t as notifyDataUpdated } from "./useAutoRefresh-B7w7pWdx.js";
//#region src/views/MyOrdersView.vue
var _hoisted_1 = { class: "container cs-container py-5" };
var _hoisted_2 = { class: "table-responsive cs-card p-3" };
var _hoisted_3 = { class: "table cs-table mb-0" };
var _hoisted_4 = { class: "product-cell" };
var _hoisted_5 = ["src", "alt"];
var _hoisted_6 = { class: "badge bg-secondary" };
var _hoisted_7 = ["disabled", "onClick"];
var _hoisted_8 = {
	key: 0,
	class: "spinner-border spinner-border-sm me-1"
};
var _hoisted_9 = {
	key: 1,
	class: "badge bg-secondary ms-2"
};
var _hoisted_10 = ["onClick"];
var _hoisted_11 = {
	key: 0,
	class: "text-center cs-muted py-4"
};
var _hoisted_12 = {
	class: "review-modal cs-card",
	role: "dialog",
	"aria-modal": "true",
	"aria-labelledby": "review-title"
};
var _hoisted_13 = {
	key: 0,
	class: "mb-3"
};
var _hoisted_14 = ["value"];
var _hoisted_15 = { class: "mb-3" };
var _hoisted_16 = [
	"aria-checked",
	"aria-label",
	"onMouseenter",
	"onFocus",
	"onClick"
];
var _hoisted_17 = { class: "rating-label" };
var _hoisted_18 = {
	key: 1,
	class: "alert alert-danger mt-3 mb-0"
};
var _hoisted_19 = { class: "d-flex justify-content-end gap-2 mt-3" };
var _hoisted_20 = ["disabled"];
var MyOrdersView_default = /*#__PURE__*/ _plugin_vue_export_helper_default({
	__name: "MyOrdersView",
	setup(__props) {
		const orders = ref([]);
		const route = useRoute();
		const reviewedCarIds = ref([]);
		const pendingReviewCarIds = ref([]);
		const orderCarIds = ref({});
		const reviewOrder = ref(null);
		const reviewCars = ref([]);
		const reviewCarId = ref(null);
		const reviewForm = ref({ comment: "" });
		const rating = ref(0);
		const hoverRating = ref(0);
		const reviewError = ref("");
		const reviewSubmitting = ref(false);
		const cancellingOrderId = ref(null);
		const satisfactionLabel = computed(() => ({
			0: "Vui lòng chọn mức độ hài lòng",
			1: "Rất không hài lòng",
			2: "Không hài lòng",
			3: "Bình thường",
			4: "Hài lòng",
			5: "Rất hài lòng"
		})[rating.value]);
		let loadingOrders = false;
		async function loadOrders() {
			if (loadingOrders) return;
			loadingOrders = true;
			try {
				const [ordersResponse, reviewedResponse] = await Promise.all([orderApi.getMyOrders(), api.get("/api/reviews/my-reviewed-cars")]);
				const latestOrders = ordersResponse.data.data || [];
				orders.value = latestOrders;
				reviewedCarIds.value = [.../* @__PURE__ */ new Set([...reviewedResponse.data || [], ...pendingReviewCarIds.value])];
				const completedOrders = latestOrders.filter(isCompleted);
				const details = await Promise.all(completedOrders.map(async (order) => {
					const { data } = await orderApi.getDetails(order.id);
					return [order.id, (data.details || []).map((detail) => detail.car?.id).filter(Boolean)];
				}));
				orderCarIds.value = Object.fromEntries(details);
			} catch {} finally {
				loadingOrders = false;
			}
		}
		onMounted(loadOrders);
		useAutoRefresh(loadOrders);
		watch(() => route.fullPath, () => loadOrders());
		function formatDate(d) {
			return d ? new Date(d).toLocaleDateString("vi-VN") : "";
		}
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
		function isCompleted(order) {
			return ["COMPLETED", "DELIVERED"].includes(order.status);
		}
		function canCancel(order) {
			return String(order.status || "").toUpperCase() === "PENDING" && String(order.depositStatus || "").toUpperCase() !== "PAID";
		}
		async function cancelOrder(order) {
			if (!canCancel(order) || cancellingOrderId.value || !window.confirm("Bạn có chắc chắn muốn hủy yêu cầu đặt cọc này không?")) return;
			cancellingOrderId.value = order.id;
			try {
				const { data } = await orderApi.updateStatus(order.id, "CANCELLED");
				if (!data?.success) throw new Error(data?.message || "Không thể hủy đơn hàng.");
				order.status = "CANCELLED";
				notifyDataUpdated();
				showCartToast("Đã hủy đơn hàng và hoàn trả xe về kho thành công!");
			} catch (error) {
				showCartToast(error.response?.data?.message || error.message || "Không thể hủy đơn hàng. Vui lòng thử lại.", "error");
			} finally {
				cancellingOrderId.value = null;
			}
		}
		function isOrderReviewed(order) {
			const carIds = orderCarIds.value[order.id] || [];
			return carIds.length > 0 && carIds.every((carId) => reviewedCarIds.value.includes(carId));
		}
		async function openReview(order) {
			reviewOrder.value = order;
			reviewError.value = "";
			reviewForm.value = { comment: "" };
			rating.value = 0;
			hoverRating.value = 0;
			try {
				const { data } = await orderApi.getDetails(order.id);
				reviewCars.value = (data.details || []).filter((detail) => detail.car?.id && !reviewedCarIds.value.includes(detail.car.id));
				reviewCarId.value = reviewCars.value[0]?.car?.id || null;
				if (!reviewCarId.value) reviewError.value = "Không tìm thấy xe trong đơn hàng này.";
			} catch (error) {
				reviewError.value = error.response?.data?.message || "Không thể tải thông tin đơn hàng.";
			}
		}
		function closeReview() {
			reviewOrder.value = null;
			reviewCars.value = [];
			reviewCarId.value = null;
			rating.value = 0;
			hoverRating.value = 0;
		}
		async function submitReview() {
			if (!reviewCarId.value || !reviewForm.value.comment || rating.value === 0) {
				reviewError.value = rating.value === 0 ? "Vui lòng chọn mức độ hài lòng." : "Vui lòng chọn xe và nhập nội dung đánh giá.";
				return;
			}
			reviewSubmitting.value = true;
			reviewError.value = "";
			const carId = reviewCarId.value;
			const payload = {
				...reviewForm.value,
				rating: rating.value
			};
			pendingReviewCarIds.value = [.../* @__PURE__ */ new Set([...pendingReviewCarIds.value, carId])];
			if (!reviewedCarIds.value.includes(carId)) reviewedCarIds.value = [...reviewedCarIds.value, carId];
			closeReview();
			showCartToast("Cảm ơn bạn đã gửi đánh giá!");
			try {
				await reviewApi.create(carId, payload);
				notifyDataUpdated();
			} catch (error) {
				pendingReviewCarIds.value = pendingReviewCarIds.value.filter((id) => id !== carId);
				reviewedCarIds.value = reviewedCarIds.value.filter((id) => id !== carId);
				reviewError.value = error.response?.data?.message || "Không thể gửi đánh giá.";
				showCartToast(reviewError.value, "error");
			} finally {
				pendingReviewCarIds.value = pendingReviewCarIds.value.filter((id) => id !== carId);
				reviewSubmitting.value = false;
			}
		}
		return (_ctx, _cache) => {
			const _component_router_link = resolveComponent("router-link");
			return openBlock(), createElementBlock("div", _hoisted_1, [
				_cache[12] || (_cache[12] = createBaseVNode("h2", { class: "cs-page-title mb-4" }, "Đơn hàng của tôi", -1)),
				createBaseVNode("div", _hoisted_2, [createBaseVNode("table", _hoisted_3, [_cache[6] || (_cache[6] = createBaseVNode("thead", null, [createBaseVNode("tr", null, [
					createBaseVNode("th", null, "Sản phẩm"),
					createBaseVNode("th", null, "Ngày đặt"),
					createBaseVNode("th", null, "Thời gian thanh toán cọc"),
					createBaseVNode("th", null, "Địa chỉ"),
					createBaseVNode("th", null, "Trạng thái"),
					createBaseVNode("th", null, "Tiền cọc"),
					createBaseVNode("th")
				])], -1)), createBaseVNode("tbody", null, [(openBlock(true), createElementBlock(Fragment, null, renderList(orders.value, (o) => {
					return openBlock(), createElementBlock("tr", { key: o.id }, [
						createBaseVNode("td", null, [createBaseVNode("div", _hoisted_4, [o.carImage ? (openBlock(), createElementBlock("img", {
							key: 0,
							src: unref(carImageUrl)(o.carImage),
							alt: o.carName || o.productName,
							onError: _cache[0] || (_cache[0] = (...args) => unref(useDefaultCarImage) && unref(useDefaultCarImage)(...args))
						}, null, 40, _hoisted_5)) : createCommentVNode("", true), createBaseVNode("span", null, toDisplayString(o.carName || o.productName), 1)])]),
						createBaseVNode("td", null, toDisplayString(formatDate(o.createDate)), 1),
						createBaseVNode("td", null, toDisplayString(formatDepositPaidAt(o)), 1),
						createBaseVNode("td", null, toDisplayString(o.address), 1),
						createBaseVNode("td", null, [createBaseVNode("span", _hoisted_6, toDisplayString(o.status), 1)]),
						createBaseVNode("td", null, toDisplayString(o.depositAmount != null ? `${unref(formatPrice)(o.depositAmount)} VNĐ` : "Chưa xác định"), 1),
						createBaseVNode("td", null, [
							createVNode(_component_router_link, { to: `/order/detail/${o.id}` }, {
								default: withCtx(() => [..._cache[5] || (_cache[5] = [createTextVNode("Chi tiết", -1)])]),
								_: 1
							}, 8, ["to"]),
							canCancel(o) ? (openBlock(), createElementBlock("button", {
								key: 0,
								class: "btn btn-outline-danger btn-sm ms-2",
								type: "button",
								disabled: cancellingOrderId.value === o.id,
								onClick: ($event) => cancelOrder(o)
							}, [cancellingOrderId.value === o.id ? (openBlock(), createElementBlock("span", _hoisted_8)) : createCommentVNode("", true), createTextVNode(" " + toDisplayString(cancellingOrderId.value === o.id ? "Đang hủy..." : "Hủy đơn hàng"), 1)], 8, _hoisted_7)) : createCommentVNode("", true),
							isCompleted(o) && isOrderReviewed(o) ? (openBlock(), createElementBlock("span", _hoisted_9, "Đã đánh giá")) : isCompleted(o) ? (openBlock(), createElementBlock("button", {
								key: 2,
								class: "btn btn-danger btn-sm ms-2",
								type: "button",
								onClick: ($event) => openReview(o)
							}, " Đánh giá xe ", 8, _hoisted_10)) : createCommentVNode("", true)
						])
					]);
				}), 128))])]), orders.value.length === 0 ? (openBlock(), createElementBlock("p", _hoisted_11, "Chưa có đơn hàng nào.")) : createCommentVNode("", true)]),
				reviewOrder.value ? (openBlock(), createElementBlock("div", {
					key: 0,
					class: "modal-backdrop",
					onClick: withModifiers(closeReview, ["self"])
				}, [createBaseVNode("section", _hoisted_12, [
					createBaseVNode("div", { class: "d-flex justify-content-between align-items-center mb-3" }, [_cache[7] || (_cache[7] = createBaseVNode("h3", {
						id: "review-title",
						class: "mb-0"
					}, "Đánh giá xe", -1)), createBaseVNode("button", {
						class: "btn-close",
						type: "button",
						"aria-label": "Đóng",
						onClick: closeReview
					})]),
					reviewCars.value.length > 1 ? (openBlock(), createElementBlock("div", _hoisted_13, [_cache[8] || (_cache[8] = createBaseVNode("label", {
						class: "form-label",
						for: "review-car"
					}, "Xe", -1)), withDirectives(createBaseVNode("select", {
						id: "review-car",
						"onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => reviewCarId.value = $event),
						class: "form-select"
					}, [(openBlock(true), createElementBlock(Fragment, null, renderList(reviewCars.value, (item) => {
						return openBlock(), createElementBlock("option", {
							key: item.car?.id,
							value: item.car?.id
						}, toDisplayString(item.car?.name), 9, _hoisted_14);
					}), 128))], 512), [[vModelSelect, reviewCarId.value]])])) : createCommentVNode("", true),
					createBaseVNode("div", _hoisted_15, [
						_cache[10] || (_cache[10] = createBaseVNode("span", {
							id: "review-rating-label",
							class: "form-label d-block"
						}, "Mức độ hài lòng:", -1)),
						createBaseVNode("div", {
							class: "rating-stars",
							role: "radiogroup",
							"aria-labelledby": "review-rating-label",
							onMouseleave: _cache[3] || (_cache[3] = ($event) => hoverRating.value = 0)
						}, [(openBlock(), createElementBlock(Fragment, null, renderList(5, (star) => {
							return createBaseVNode("button", {
								key: star,
								type: "button",
								class: "rating-star",
								role: "radio",
								"aria-checked": rating.value === star,
								"aria-label": `${star} sao`,
								onMouseenter: ($event) => hoverRating.value = star,
								onFocus: ($event) => hoverRating.value = star,
								onBlur: _cache[2] || (_cache[2] = ($event) => hoverRating.value = 0),
								onClick: ($event) => rating.value = star
							}, [(openBlock(), createElementBlock("svg", {
								viewBox: "0 0 24 24",
								"aria-hidden": "true",
								class: normalizeClass({ active: star <= (hoverRating.value || rating.value) })
							}, [..._cache[9] || (_cache[9] = [createBaseVNode("path", { d: "M12 2.5l2.94 5.96 6.58.96-4.76 4.64 1.12 6.56L12 17.54l-5.88 3.08 1.12-6.56-4.76-4.64 6.58-.96L12 2.5z" }, null, -1)])], 2))], 40, _hoisted_16);
						}), 64))], 32),
						createBaseVNode("small", _hoisted_17, toDisplayString(satisfactionLabel.value), 1)
					]),
					_cache[11] || (_cache[11] = createBaseVNode("label", {
						class: "form-label",
						for: "review-comment"
					}, "Bình luận", -1)),
					withDirectives(createBaseVNode("textarea", {
						id: "review-comment",
						"onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => reviewForm.value.comment = $event),
						class: "form-control",
						rows: "4",
						maxlength: "1000"
					}, null, 512), [[
						vModelText,
						reviewForm.value.comment,
						void 0,
						{ trim: true }
					]]),
					reviewError.value ? (openBlock(), createElementBlock("p", _hoisted_18, toDisplayString(reviewError.value), 1)) : createCommentVNode("", true),
					createBaseVNode("div", _hoisted_19, [createBaseVNode("button", {
						class: "btn cs-btn cs-btn-ghost",
						type: "button",
						onClick: closeReview
					}, "Hủy"), createBaseVNode("button", {
						class: "btn cs-btn cs-btn-primary",
						type: "button",
						disabled: reviewSubmitting.value || rating.value === 0,
						onClick: submitReview
					}, toDisplayString(reviewSubmitting.value ? "Đang gửi..." : "Gửi đánh giá"), 9, _hoisted_20)])
				])])) : createCommentVNode("", true)
			]);
		};
	}
}, [["__scopeId", "data-v-250474a9"]]);
//#endregion
export { MyOrdersView_default as default };
