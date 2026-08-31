import { D as createCommentVNode, Dt as toDisplayString, K as withCtx, M as createVNode, O as createElementBlock, S as Fragment, T as createBaseVNode, U as renderList, V as openBlock, W as resolveComponent, a as carImageUrl, c as formatPrice, j as createTextVNode, o as cartApi, ot as unref, tt as ref, v as useDefaultCarImage, w as computed, z as onMounted } from "./api-BIOmrm3q.js";
import { i as useCartStore, t as _plugin_vue_export_helper_default } from "./index-B5QpE601.js";
import { n as useAutoRefresh, t as notifyDataUpdated } from "./useAutoRefresh-B7w7pWdx.js";
//#region src/views/CartView.vue
var _hoisted_1 = { class: "cart-page" };
var _hoisted_2 = { class: "container cs-container cart-content" };
var _hoisted_3 = {
	key: 0,
	class: "cs-card cart-state"
};
var _hoisted_4 = {
	key: 1,
	class: "alert alert-danger",
	role: "alert"
};
var _hoisted_5 = {
	key: 2,
	class: "cs-card cart-empty"
};
var _hoisted_6 = {
	key: 3,
	class: "cart-layout"
};
var _hoisted_7 = {
	class: "cart-items",
	"aria-label": "Xe trong phiếu đặt cọc"
};
var _hoisted_8 = ["src", "alt"];
var _hoisted_9 = { class: "cart-info" };
var _hoisted_10 = { class: "cart-title-row" };
var _hoisted_11 = {
	key: 0,
	class: "cart-meta"
};
var _hoisted_12 = { key: 0 };
var _hoisted_13 = { key: 1 };
var _hoisted_14 = { key: 2 };
var _hoisted_15 = [
	"disabled",
	"aria-label",
	"onClick"
];
var _hoisted_16 = { class: "cart-price-row" };
var _hoisted_17 = { class: "cart-discount" };
var _hoisted_18 = { class: "discount-value" };
var _hoisted_19 = { class: "cart-line-total" };
var _hoisted_20 = { class: "cs-card cart-summary" };
var _hoisted_21 = { class: "summary-row" };
var _hoisted_22 = { class: "summary-row summary-discount" };
var _hoisted_23 = { class: "summary-row" };
var _hoisted_24 = { class: "summary-total" };
var _hoisted_25 = { class: "summary-row" };
var _hoisted_26 = ["disabled"];
var _hoisted_27 = {
	key: 4,
	class: "alert alert-danger cart-alert show error",
	role: "alert"
};
var CartView_default = /*#__PURE__*/ _plugin_vue_export_helper_default({
	__name: "CartView",
	setup(__props) {
		const cart = useCartStore();
		const items = ref([]);
		const total = ref(0);
		const loading = ref(true);
		const clearing = ref(false);
		const busyId = ref(null);
		const message = ref("");
		const loadError = ref("");
		const itemListPrice = (item) => Number(item.listPrice ?? item.originalPrice ?? item.price ?? 0);
		const itemFinalPrice = (item) => Number(item.finalPrice ?? item.price ?? 0);
		const itemDiscount = (item) => Number(item.discountAmount ?? Math.max(0, itemListPrice(item) - itemFinalPrice(item)));
		const itemDiscountPercent = (item) => {
			const explicitPercent = Number(item.discountPercent);
			if (Number.isFinite(explicitPercent) && explicitPercent > 0) return explicitPercent;
			const list = itemListPrice(item);
			return list > 0 ? itemDiscount(item) * 100 / list : 0;
		};
		const listPrice = computed(() => items.value.reduce((sum, item) => sum + itemListPrice(item), 0));
		const discountAmount = computed(() => items.value.reduce((sum, item) => sum + itemDiscount(item), 0));
		const depositAmount = computed(() => items.value.reduce((sum, item) => sum + Number(item.depositAmount ?? itemFinalPrice(item) * .1), 0));
		const remainingAmount = computed(() => Math.max(0, total.value - depositAmount.value));
		function formatDiscount(item) {
			const amount = itemDiscount(item);
			const percent = itemDiscountPercent(item);
			if (amount <= 0 || percent <= 0) return "-0 VNĐ";
			return `-${percent % 1 === 0 ? percent : percent.toFixed(2)}% (-${formatPrice(amount)} VNĐ)`;
		}
		onMounted(loadCart);
		useAutoRefresh(() => loadCart(true));
		async function loadCart(silent = false) {
			if (!silent) {
				loading.value = true;
				loadError.value = "";
			}
			try {
				if (cart.depositItem) {
					items.value = [cart.depositItem];
					total.value = itemFinalPrice(cart.depositItem);
					cart.setItems(items.value);
					return;
				}
				const { data } = await cartApi.get();
				items.value = data.items || [];
				cart.setItems(items.value);
				total.value = Number(data.total || 0);
			} catch {
				if (!silent) loadError.value = "Không thể tải phiếu đặt cọc. Vui lòng kiểm tra kết nối máy chủ.";
			} finally {
				if (!silent) loading.value = false;
			}
		}
		async function updateQuantity(id, action) {
			busyId.value = id;
			message.value = "";
			try {
				const response = await action();
				if (response.data?.success === false) {
					message.value = response.data.message || "Không thể cập nhật số lượng";
					return;
				}
				await loadCart();
				notifyDataUpdated();
			} catch {
				message.value = "Không thể cập nhật phiếu đặt cọc. Vui lòng thử lại.";
			} finally {
				busyId.value = null;
			}
		}
		async function remove(id) {
			if (cart.depositItem?.id === id) {
				cart.clearDepositItem();
				items.value = [];
				total.value = 0;
				notifyDataUpdated();
				return;
			}
			return updateQuantity(id, () => cartApi.remove(id));
		}
		async function clearCart() {
			clearing.value = true;
			message.value = "";
			try {
				if (cart.depositItem) {
					cart.clearDepositItem();
					items.value = [];
					total.value = 0;
					notifyDataUpdated();
					return;
				}
				await cartApi.clear();
				await loadCart();
				notifyDataUpdated();
			} catch {
				message.value = "Không thể xóa phiếu đặt cọc. Vui lòng thử lại.";
			} finally {
				clearing.value = false;
			}
		}
		return (_ctx, _cache) => {
			const _component_router_link = resolveComponent("router-link");
			return openBlock(), createElementBlock("main", _hoisted_1, [_cache[17] || (_cache[17] = createBaseVNode("header", { class: "ford-hero-panel compact content-only cart-heading" }, [createBaseVNode("div", { class: "ford-hero-panel-content" }, [
				createBaseVNode("span", { class: "cart-eyebrow" }, "THÔNG TIN ĐẶT CỌC"),
				createBaseVNode("h1", { class: "cs-page-title" }, "Phiếu đặt cọc xe"),
				createBaseVNode("p", null, "Thông tin xe giữ chỗ: Mỗi giao dịch áp dụng đặt cọc cho một xe duy nhất.")
			])], -1)), createBaseVNode("div", _hoisted_2, [loading.value ? (openBlock(), createElementBlock("div", _hoisted_3, "Đang tải phiếu đặt cọc...")) : loadError.value ? (openBlock(), createElementBlock("div", _hoisted_4, [createTextVNode(toDisplayString(loadError.value) + " ", 1), createBaseVNode("button", {
				class: "btn btn-sm cs-btn-ghost ms-2",
				type: "button",
				onClick: loadCart
			}, "Thử lại")])) : items.value.length === 0 ? (openBlock(), createElementBlock("section", _hoisted_5, [
				_cache[2] || (_cache[2] = createBaseVNode("div", { class: "cart-empty-icon" }, "🚗", -1)),
				_cache[3] || (_cache[3] = createBaseVNode("h2", null, "Chưa có xe nào trong phiếu đặt cọc", -1)),
				_cache[4] || (_cache[4] = createBaseVNode("p", { class: "cs-muted" }, "Hãy chọn mẫu xe phù hợp từ danh sách xe để tiến hành đặt cọc giữ chỗ.", -1)),
				createVNode(_component_router_link, {
					class: "btn cs-btn cs-btn-primary",
					to: "/car/list"
				}, {
					default: withCtx(() => [..._cache[1] || (_cache[1] = [createTextVNode("Xem danh sách xe", -1)])]),
					_: 1
				})
			])) : (openBlock(), createElementBlock("div", _hoisted_6, [createBaseVNode("section", _hoisted_7, [(openBlock(true), createElementBlock(Fragment, null, renderList(items.value, (item) => {
				return openBlock(), createElementBlock("article", {
					key: item.id,
					class: "cs-card cart-item"
				}, [createBaseVNode("img", {
					class: "cart-image",
					src: unref(carImageUrl)(item.image),
					alt: item.name,
					onError: _cache[0] || (_cache[0] = (...args) => unref(useDefaultCarImage) && unref(useDefaultCarImage)(...args))
				}, null, 40, _hoisted_8), createBaseVNode("div", _hoisted_9, [createBaseVNode("div", _hoisted_10, [createBaseVNode("div", null, [createBaseVNode("h2", null, toDisplayString(item.name), 1), item.year || item.bodyType || item.color ? (openBlock(), createElementBlock("p", _hoisted_11, [
					item.year ? (openBlock(), createElementBlock("span", _hoisted_12, "Năm " + toDisplayString(item.year), 1)) : createCommentVNode("", true),
					item.bodyType ? (openBlock(), createElementBlock("span", _hoisted_13, toDisplayString(item.bodyType), 1)) : createCommentVNode("", true),
					item.color ? (openBlock(), createElementBlock("span", _hoisted_14, "Màu " + toDisplayString(item.color), 1)) : createCommentVNode("", true)
				])) : createCommentVNode("", true)]), createBaseVNode("button", {
					class: "cart-remove",
					type: "button",
					disabled: busyId.value === item.id,
					"aria-label": `Xóa ${item.name}`,
					onClick: ($event) => remove(item.id)
				}, " Xóa ", 8, _hoisted_15)]), createBaseVNode("div", _hoisted_16, [
					createBaseVNode("div", null, [_cache[5] || (_cache[5] = createBaseVNode("span", { class: "cart-label" }, "Giá niêm yết", -1)), createBaseVNode("strong", null, toDisplayString(unref(formatPrice)(itemListPrice(item))) + " VNĐ", 1)]),
					createBaseVNode("div", _hoisted_17, [_cache[6] || (_cache[6] = createBaseVNode("span", { class: "cart-label" }, "Ưu đãi áp dụng", -1)), createBaseVNode("strong", _hoisted_18, toDisplayString(formatDiscount(item)), 1)]),
					createBaseVNode("div", _hoisted_19, [_cache[7] || (_cache[7] = createBaseVNode("span", { class: "cart-label" }, "Giá bán sau ưu đãi", -1)), createBaseVNode("strong", null, toDisplayString(unref(formatPrice)(itemFinalPrice(item))) + " VNĐ", 1)])
				])])]);
			}), 128))]), createBaseVNode("aside", _hoisted_20, [
				_cache[15] || (_cache[15] = createBaseVNode("h2", null, "Tóm tắt phiếu đặt cọc", -1)),
				createBaseVNode("div", _hoisted_21, [_cache[8] || (_cache[8] = createBaseVNode("span", null, "Giá niêm yết xe", -1)), createBaseVNode("strong", null, toDisplayString(unref(formatPrice)(listPrice.value)) + " VNĐ", 1)]),
				createBaseVNode("div", _hoisted_22, [_cache[9] || (_cache[9] = createBaseVNode("span", null, "Ưu đãi / khuyến mãi", -1)), createBaseVNode("strong", null, "-" + toDisplayString(unref(formatPrice)(discountAmount.value)) + " VNĐ", 1)]),
				createBaseVNode("div", _hoisted_23, [_cache[10] || (_cache[10] = createBaseVNode("span", null, "Tổng giá trị xe sau ưu đãi", -1)), createBaseVNode("strong", null, toDisplayString(unref(formatPrice)(total.value)) + " VNĐ", 1)]),
				createBaseVNode("div", _hoisted_24, [_cache[11] || (_cache[11] = createBaseVNode("span", null, "Tiền cọc giữ chỗ (10%)", -1)), createBaseVNode("strong", null, toDisplayString(unref(formatPrice)(depositAmount.value)) + " VNĐ", 1)]),
				createBaseVNode("div", _hoisted_25, [_cache[12] || (_cache[12] = createBaseVNode("span", null, "Thanh toán khi nhận xe", -1)), createBaseVNode("strong", null, toDisplayString(unref(formatPrice)(remainingAmount.value)) + " VNĐ", 1)]),
				createVNode(_component_router_link, {
					class: "btn cs-btn cs-btn-primary w-100",
					to: "/checkout"
				}, {
					default: withCtx(() => [..._cache[13] || (_cache[13] = [createTextVNode("Tiến hành đặt cọc", -1)])]),
					_: 1
				}),
				createBaseVNode("button", {
					class: "btn cs-btn cs-btn-ghost w-100",
					type: "button",
					disabled: clearing.value,
					onClick: clearCart
				}, toDisplayString(clearing.value ? "Đang xóa..." : "Xóa toàn bộ xe đã chọn"), 9, _hoisted_26),
				_cache[16] || (_cache[16] = createBaseVNode("p", { class: "cart-hold-note" }, "Thời gian giữ chỗ thanh toán cọc: 03 phút (Quá hạn hệ thống tự động hoàn xe về kho)", -1)),
				createVNode(_component_router_link, {
					class: "cart-continue",
					to: "/car/list"
				}, {
					default: withCtx(() => [..._cache[14] || (_cache[14] = [createTextVNode("← Tiếp tục xem xe", -1)])]),
					_: 1
				})
			])])), message.value ? (openBlock(), createElementBlock("div", _hoisted_27, toDisplayString(message.value), 1)) : createCommentVNode("", true)])]);
		};
	}
}, [["__scopeId", "data-v-21bd0fb7"]]);
//#endregion
export { CartView_default as default };
