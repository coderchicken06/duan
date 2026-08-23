import { D as createCommentVNode, Dt as toDisplayString, K as withCtx, M as createVNode, O as createElementBlock, S as Fragment, T as createBaseVNode, U as renderList, V as openBlock, W as resolveComponent, a as carImageUrl, c as formatPrice, j as createTextVNode, o as cartApi, ot as unref, tt as ref, v as useDefaultCarImage, w as computed, z as onMounted } from "./api-Cd2rmWmR.js";
import { n as _plugin_vue_export_helper_default, r as useCartStore } from "./index-DOyj8jjE.js";
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
	"aria-label": "Sản phẩm trong giỏ"
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
var _hoisted_17 = { class: "cart-quantity" };
var _hoisted_18 = { class: "quantity-control" };
var _hoisted_19 = ["disabled", "onClick"];
var _hoisted_20 = ["disabled", "onClick"];
var _hoisted_21 = { class: "cart-line-total" };
var _hoisted_22 = { class: "cs-card cart-summary" };
var _hoisted_23 = { class: "summary-row" };
var _hoisted_24 = { class: "summary-total" };
var _hoisted_25 = ["disabled"];
var _hoisted_26 = {
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
		const totalQuantity = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0));
		onMounted(loadCart);
		async function loadCart() {
			loading.value = true;
			loadError.value = "";
			try {
				const { data } = await cartApi.get();
				items.value = data.items || [];
				cart.setItems(items.value);
				total.value = Number(data.total || 0);
			} catch {
				loadError.value = "Không thể tải giỏ hàng. Vui lòng kiểm tra kết nối máy chủ.";
			} finally {
				loading.value = false;
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
			} catch {
				message.value = "Không thể cập nhật giỏ hàng. Vui lòng thử lại.";
			} finally {
				busyId.value = null;
			}
		}
		function increment(id) {
			return updateQuantity(id, () => cartApi.increment(id));
		}
		function decrement(id) {
			return updateQuantity(id, () => cartApi.decrement(id));
		}
		function remove(id) {
			return updateQuantity(id, () => cartApi.remove(id));
		}
		async function clearCart() {
			clearing.value = true;
			message.value = "";
			try {
				await cartApi.clear();
				await loadCart();
			} catch {
				message.value = "Không thể xóa giỏ hàng. Vui lòng thử lại.";
			} finally {
				clearing.value = false;
			}
		}
		return (_ctx, _cache) => {
			const _component_router_link = resolveComponent("router-link");
			return openBlock(), createElementBlock("main", _hoisted_1, [_cache[13] || (_cache[13] = createBaseVNode("header", { class: "ford-hero-panel compact content-only cart-heading" }, [createBaseVNode("div", { class: "ford-hero-panel-content" }, [
				createBaseVNode("span", { class: "cart-eyebrow" }, "GIỎ HÀNG CỦA BẠN"),
				createBaseVNode("h1", { class: "cs-page-title" }, "Xe đang quan tâm"),
				createBaseVNode("p", null, "Kiểm tra số lượng và thông tin xe trước khi gửi yêu cầu đặt xe.")
			])], -1)), createBaseVNode("div", _hoisted_2, [loading.value ? (openBlock(), createElementBlock("div", _hoisted_3, "Đang tải giỏ hàng...")) : loadError.value ? (openBlock(), createElementBlock("div", _hoisted_4, [createTextVNode(toDisplayString(loadError.value) + " ", 1), createBaseVNode("button", {
				class: "btn btn-sm cs-btn-ghost ms-2",
				type: "button",
				onClick: loadCart
			}, "Thử lại")])) : items.value.length === 0 ? (openBlock(), createElementBlock("section", _hoisted_5, [
				_cache[2] || (_cache[2] = createBaseVNode("div", { class: "cart-empty-icon" }, "🚗", -1)),
				_cache[3] || (_cache[3] = createBaseVNode("h2", null, "Giỏ hàng đang trống", -1)),
				_cache[4] || (_cache[4] = createBaseVNode("p", { class: "cs-muted" }, "Hãy chọn mẫu xe phù hợp để tiếp tục gửi yêu cầu đặt xe.", -1)),
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
					createBaseVNode("div", null, [_cache[5] || (_cache[5] = createBaseVNode("span", { class: "cart-label" }, "Đơn giá", -1)), createBaseVNode("strong", null, toDisplayString(unref(formatPrice)(item.price)) + " VNĐ", 1)]),
					createBaseVNode("div", _hoisted_17, [_cache[6] || (_cache[6] = createBaseVNode("span", { class: "cart-label" }, "Số lượng", -1)), createBaseVNode("div", _hoisted_18, [
						createBaseVNode("button", {
							type: "button",
							disabled: busyId.value === item.id,
							onClick: ($event) => decrement(item.id)
						}, "−", 8, _hoisted_19),
						createBaseVNode("span", null, toDisplayString(item.quantity), 1),
						createBaseVNode("button", {
							type: "button",
							disabled: busyId.value === item.id || item.stock != null && item.quantity >= item.stock,
							onClick: ($event) => increment(item.id)
						}, " + ", 8, _hoisted_20)
					])]),
					createBaseVNode("div", _hoisted_21, [_cache[7] || (_cache[7] = createBaseVNode("span", { class: "cart-label" }, "Thành tiền", -1)), createBaseVNode("strong", null, toDisplayString(unref(formatPrice)(item.price * item.quantity)) + " VNĐ", 1)])
				])])]);
			}), 128))]), createBaseVNode("aside", _hoisted_22, [
				_cache[12] || (_cache[12] = createBaseVNode("h2", null, "Tóm tắt giỏ hàng", -1)),
				createBaseVNode("div", _hoisted_23, [_cache[8] || (_cache[8] = createBaseVNode("span", null, "Số lượng", -1)), createBaseVNode("strong", null, toDisplayString(totalQuantity.value) + " xe", 1)]),
				createBaseVNode("div", _hoisted_24, [_cache[9] || (_cache[9] = createBaseVNode("span", null, "Tổng tiền", -1)), createBaseVNode("strong", null, toDisplayString(unref(formatPrice)(total.value)) + " VNĐ", 1)]),
				createVNode(_component_router_link, {
					class: "btn cs-btn cs-btn-primary w-100",
					to: "/checkout"
				}, {
					default: withCtx(() => [..._cache[10] || (_cache[10] = [createTextVNode("Gửi yêu cầu đặt xe", -1)])]),
					_: 1
				}),
				createBaseVNode("button", {
					class: "btn cs-btn cs-btn-ghost w-100",
					type: "button",
					disabled: clearing.value,
					onClick: clearCart
				}, toDisplayString(clearing.value ? "Đang xóa..." : "Xóa toàn bộ giỏ"), 9, _hoisted_25),
				createVNode(_component_router_link, {
					class: "cart-continue",
					to: "/car/list"
				}, {
					default: withCtx(() => [..._cache[11] || (_cache[11] = [createTextVNode("← Tiếp tục xem xe", -1)])]),
					_: 1
				})
			])])), message.value ? (openBlock(), createElementBlock("div", _hoisted_26, toDisplayString(message.value), 1)) : createCommentVNode("", true)])]);
		};
	}
}, [["__scopeId", "data-v-594381de"]]);
//#endregion
export { CartView_default as default };
