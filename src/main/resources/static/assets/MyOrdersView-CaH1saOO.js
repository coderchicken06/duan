import { D as createCommentVNode, Dt as toDisplayString, K as withCtx, M as createVNode, O as createElementBlock, R as onBeforeUnmount, S as Fragment, T as createBaseVNode, Tt as normalizeClass, U as renderList, V as openBlock, W as resolveComponent, h as reviewApi, j as createTextVNode, q as withDirectives, tt as ref, u as orderApi, w as computed, y as api, z as onMounted } from "./api-Cd2rmWmR.js";
import { f as withModifiers, l as vModelSelect, n as _plugin_vue_export_helper_default, u as vModelText } from "./index-DOyj8jjE.js";
import { t as showCartToast } from "./useCartToast-CRv33ZAZ.js";
//#region src/views/MyOrdersView.vue
var _hoisted_1 = { class: "container cs-container py-5" };
var _hoisted_2 = { class: "table-responsive cs-card p-3" };
var _hoisted_3 = { class: "table cs-table mb-0" };
var _hoisted_4 = { class: "badge bg-secondary" };
var _hoisted_5 = {
	key: 0,
	class: "badge bg-secondary ms-2"
};
var _hoisted_6 = ["onClick"];
var _hoisted_7 = {
	key: 0,
	class: "text-center cs-muted py-4"
};
var _hoisted_8 = {
	class: "review-modal cs-card",
	role: "dialog",
	"aria-modal": "true",
	"aria-labelledby": "review-title"
};
var _hoisted_9 = {
	key: 0,
	class: "mb-3"
};
var _hoisted_10 = ["value"];
var _hoisted_11 = { class: "mb-3" };
var _hoisted_12 = [
	"aria-checked",
	"aria-label",
	"onMouseenter",
	"onFocus",
	"onClick"
];
var _hoisted_13 = { class: "rating-label" };
var _hoisted_14 = {
	key: 1,
	class: "alert alert-danger mt-3 mb-0"
};
var _hoisted_15 = { class: "d-flex justify-content-end gap-2 mt-3" };
var _hoisted_16 = ["disabled"];
var MyOrdersView_default = /*#__PURE__*/ _plugin_vue_export_helper_default({
	__name: "MyOrdersView",
	setup(__props) {
		const orders = ref([]);
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
		const satisfactionLabel = computed(() => ({
			0: "Vui lòng chọn mức độ hài lòng",
			1: "Rất không hài lòng",
			2: "Không hài lòng",
			3: "Bình thường",
			4: "Hài lòng",
			5: "Rất hài lòng"
		})[rating.value]);
		let pollTimer = null;
		async function loadOrders() {
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
			} catch {}
		}
		onMounted(() => {
			loadOrders();
			pollTimer = window.setInterval(loadOrders, 2e3);
		});
		onBeforeUnmount(() => window.clearInterval(pollTimer));
		function formatDate(d) {
			return d ? new Date(d).toLocaleDateString("vi-VN") : "";
		}
		function isCompleted(order) {
			return ["COMPLETED", "DELIVERED"].includes(order.status);
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
				_cache[11] || (_cache[11] = createBaseVNode("h2", { class: "cs-page-title mb-4" }, "Đơn hàng của tôi", -1)),
				createBaseVNode("div", _hoisted_2, [createBaseVNode("table", _hoisted_3, [_cache[5] || (_cache[5] = createBaseVNode("thead", null, [createBaseVNode("tr", null, [
					createBaseVNode("th", null, "Mã"),
					createBaseVNode("th", null, "Ngày"),
					createBaseVNode("th", null, "Địa chỉ"),
					createBaseVNode("th", null, "Trạng thái"),
					createBaseVNode("th", null, "Tiền cọc"),
					createBaseVNode("th")
				])], -1)), createBaseVNode("tbody", null, [(openBlock(true), createElementBlock(Fragment, null, renderList(orders.value, (o) => {
					return openBlock(), createElementBlock("tr", { key: o.id }, [
						createBaseVNode("td", null, "#" + toDisplayString(o.id), 1),
						createBaseVNode("td", null, toDisplayString(formatDate(o.createDate)), 1),
						createBaseVNode("td", null, toDisplayString(o.address), 1),
						createBaseVNode("td", null, [createBaseVNode("span", _hoisted_4, toDisplayString(o.status), 1)]),
						createBaseVNode("td", null, toDisplayString(o.depositStatus === "PAID" ? "Đã thanh toán" : o.status === "CONFIRMED" ? "Chờ thanh toán" : "Chưa mở"), 1),
						createBaseVNode("td", null, [createVNode(_component_router_link, { to: `/order/detail/${o.id}` }, {
							default: withCtx(() => [..._cache[4] || (_cache[4] = [createTextVNode("Chi tiết", -1)])]),
							_: 1
						}, 8, ["to"]), isCompleted(o) && isOrderReviewed(o) ? (openBlock(), createElementBlock("span", _hoisted_5, "Đã đánh giá")) : isCompleted(o) ? (openBlock(), createElementBlock("button", {
							key: 1,
							class: "btn btn-danger btn-sm ms-2",
							type: "button",
							onClick: ($event) => openReview(o)
						}, " Đánh giá xe ", 8, _hoisted_6)) : createCommentVNode("", true)])
					]);
				}), 128))])]), orders.value.length === 0 ? (openBlock(), createElementBlock("p", _hoisted_7, "Chưa có đơn hàng nào.")) : createCommentVNode("", true)]),
				reviewOrder.value ? (openBlock(), createElementBlock("div", {
					key: 0,
					class: "modal-backdrop",
					onClick: withModifiers(closeReview, ["self"])
				}, [createBaseVNode("section", _hoisted_8, [
					createBaseVNode("div", { class: "d-flex justify-content-between align-items-center mb-3" }, [_cache[6] || (_cache[6] = createBaseVNode("h3", {
						id: "review-title",
						class: "mb-0"
					}, "Đánh giá xe", -1)), createBaseVNode("button", {
						class: "btn-close",
						type: "button",
						"aria-label": "Đóng",
						onClick: closeReview
					})]),
					reviewCars.value.length > 1 ? (openBlock(), createElementBlock("div", _hoisted_9, [_cache[7] || (_cache[7] = createBaseVNode("label", {
						class: "form-label",
						for: "review-car"
					}, "Xe", -1)), withDirectives(createBaseVNode("select", {
						id: "review-car",
						"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => reviewCarId.value = $event),
						class: "form-select"
					}, [(openBlock(true), createElementBlock(Fragment, null, renderList(reviewCars.value, (item) => {
						return openBlock(), createElementBlock("option", {
							key: item.car?.id,
							value: item.car?.id
						}, toDisplayString(item.car?.name), 9, _hoisted_10);
					}), 128))], 512), [[vModelSelect, reviewCarId.value]])])) : createCommentVNode("", true),
					createBaseVNode("div", _hoisted_11, [
						_cache[9] || (_cache[9] = createBaseVNode("span", {
							id: "review-rating-label",
							class: "form-label d-block"
						}, "Mức độ hài lòng:", -1)),
						createBaseVNode("div", {
							class: "rating-stars",
							role: "radiogroup",
							"aria-labelledby": "review-rating-label",
							onMouseleave: _cache[2] || (_cache[2] = ($event) => hoverRating.value = 0)
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
								onBlur: _cache[1] || (_cache[1] = ($event) => hoverRating.value = 0),
								onClick: ($event) => rating.value = star
							}, [(openBlock(), createElementBlock("svg", {
								viewBox: "0 0 24 24",
								"aria-hidden": "true",
								class: normalizeClass({ active: star <= (hoverRating.value || rating.value) })
							}, [..._cache[8] || (_cache[8] = [createBaseVNode("path", { d: "M12 2.5l2.94 5.96 6.58.96-4.76 4.64 1.12 6.56L12 17.54l-5.88 3.08 1.12-6.56-4.76-4.64 6.58-.96L12 2.5z" }, null, -1)])], 2))], 40, _hoisted_12);
						}), 64))], 32),
						createBaseVNode("small", _hoisted_13, toDisplayString(satisfactionLabel.value), 1)
					]),
					_cache[10] || (_cache[10] = createBaseVNode("label", {
						class: "form-label",
						for: "review-comment"
					}, "Bình luận", -1)),
					withDirectives(createBaseVNode("textarea", {
						id: "review-comment",
						"onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => reviewForm.value.comment = $event),
						class: "form-control",
						rows: "4",
						maxlength: "1000"
					}, null, 512), [[
						vModelText,
						reviewForm.value.comment,
						void 0,
						{ trim: true }
					]]),
					reviewError.value ? (openBlock(), createElementBlock("p", _hoisted_14, toDisplayString(reviewError.value), 1)) : createCommentVNode("", true),
					createBaseVNode("div", _hoisted_15, [createBaseVNode("button", {
						class: "btn cs-btn cs-btn-ghost",
						type: "button",
						onClick: closeReview
					}, "Hủy"), createBaseVNode("button", {
						class: "btn cs-btn cs-btn-primary",
						type: "button",
						disabled: reviewSubmitting.value || rating.value === 0,
						onClick: submitReview
					}, toDisplayString(reviewSubmitting.value ? "Đang gửi..." : "Gửi đánh giá"), 9, _hoisted_16)])
				])])) : createCommentVNode("", true)
			]);
		};
	}
}, [["__scopeId", "data-v-9305493e"]]);
//#endregion
export { MyOrdersView_default as default };
