import { D as createCommentVNode, Dt as toDisplayString, O as createElementBlock, T as createBaseVNode, V as openBlock, c as formatPrice, j as createTextVNode, m as quotationApi, o as cartApi, ot as unref, q as withDirectives, tt as ref, u as orderApi, z as onMounted } from "./api-Cd2rmWmR.js";
import { d as vModelText, n as _plugin_vue_export_helper_default, o as useRouter, p as withModifiers, r as useCartStore } from "./index-BX99C7pg.js";
//#region src/views/CheckoutView.vue
var _hoisted_1 = { class: "container cs-container py-5" };
var _hoisted_2 = { class: "cs-card checkout-card overflow-hidden" };
var _hoisted_3 = { class: "p-4" };
var _hoisted_4 = { class: "order-total" };
var _hoisted_5 = {
	key: 0,
	class: "alert alert-danger cart-alert show error"
};
var _hoisted_6 = {
	key: 1,
	class: "alert alert-success cart-alert show"
};
var _hoisted_7 = ["disabled"];
var _hoisted_8 = {
	key: 0,
	class: "spinner-border spinner-border-sm me-2"
};
var paymentMethod = "SePay";
var CheckoutView_default = /*#__PURE__*/ _plugin_vue_export_helper_default({
	__name: "CheckoutView",
	setup(__props) {
		const router = useRouter();
		const cart = useCartStore();
		const address = ref("");
		const total = ref(0);
		const error = ref("");
		const success = ref(false);
		const orderId = ref(null);
		const submitting = ref(false);
		onMounted(async () => {
			if (cart.depositItem?.quotationId) {
				total.value = Number(cart.depositItem.finalPrice || 0);
				return;
			}
			const { data } = await cartApi.get();
			total.value = data.total || 0;
			if (!data.items?.length) router.push("/cart/view");
		});
		async function submit() {
			if (submitting.value) return;
			submitting.value = true;
			error.value = "";
			try {
				const isQuotationDeposit = Boolean(cart.depositItem?.quotationId);
				const { data } = isQuotationDeposit ? await quotationApi.convertToOrder(cart.depositItem.quotationId, {
					address: address.value,
					paymentMethod
				}) : await orderApi.checkout(address.value, paymentMethod);
				if (data.success) {
					await clearDepositCart();
					success.value = true;
					orderId.value = isQuotationDeposit ? data.data.id : data.orderId;
					router.push({
						path: `/orders/${orderId.value}/payment`,
						query: { method: "sepay" }
					});
				} else error.value = data.message;
			} catch (e) {
				error.value = e.response?.data?.message || "Lỗi đặt hàng";
			} finally {
				submitting.value = false;
			}
		}
		async function clearDepositCart() {
			cart.clearCart();
			try {
				await cartApi.clear();
			} catch {}
		}
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1, [createBaseVNode("div", _hoisted_2, [_cache[4] || (_cache[4] = createBaseVNode("div", { class: "checkout-header p-4" }, [
				createBaseVNode("span", { class: "checkout-step" }, "XÁC NHẬN ĐƠN"),
				createBaseVNode("h2", { class: "cs-page-title mt-2 mb-1" }, "Gửi yêu cầu đặt xe"),
				createBaseVNode("p", { class: "text-secondary mb-0" }, "Kiểm tra thông tin trước khi gửi yêu cầu đến CarStore.")
			], -1)), createBaseVNode("div", _hoisted_3, [createBaseVNode("form", {
				class: "vstack gap-3",
				onSubmit: withModifiers(submit, ["prevent"])
			}, [
				createBaseVNode("div", null, [_cache[1] || (_cache[1] = createBaseVNode("label", { class: "form-label cs-muted" }, "Địa chỉ giao hàng", -1)), withDirectives(createBaseVNode("textarea", {
					"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => address.value = $event),
					class: "form-control",
					rows: "3",
					required: "",
					placeholder: "Nhập địa chỉ nhận xe"
				}, null, 512), [[vModelText, address.value]])]),
				_cache[3] || (_cache[3] = createBaseVNode("div", null, [createBaseVNode("label", { class: "form-label cs-muted" }, "Phương thức thanh toán"), createBaseVNode("div", null, [createBaseVNode("strong", null, "Thanh toán QR SePay")])], -1)),
				createBaseVNode("div", _hoisted_4, [_cache[2] || (_cache[2] = createBaseVNode("span", null, "Tổng giá trị xe", -1)), createBaseVNode("strong", null, toDisplayString(unref(formatPrice)(total.value)) + " VNĐ", 1)]),
				error.value ? (openBlock(), createElementBlock("div", _hoisted_5, toDisplayString(error.value), 1)) : createCommentVNode("", true),
				success.value ? (openBlock(), createElementBlock("div", _hoisted_6, "Gửi yêu cầu đặt xe thành công! Mã đơn: #" + toDisplayString(orderId.value), 1)) : createCommentVNode("", true),
				createBaseVNode("button", {
					type: "submit",
					class: "btn cs-btn cs-btn-primary w-100",
					disabled: submitting.value
				}, [submitting.value ? (openBlock(), createElementBlock("span", _hoisted_8)) : createCommentVNode("", true), createTextVNode(toDisplayString(submitting.value ? "Đang gửi yêu cầu..." : "Xác nhận gửi yêu cầu"), 1)], 8, _hoisted_7)
			], 32)])])]);
		};
	}
}, [["__scopeId", "data-v-6db222c2"]]);
//#endregion
export { CheckoutView_default as default };
