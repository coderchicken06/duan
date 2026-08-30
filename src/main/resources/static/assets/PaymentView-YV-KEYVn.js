import { B as onUnmounted, D as createCommentVNode, Dt as toDisplayString, O as createElementBlock, S as Fragment, T as createBaseVNode, U as renderList, V as openBlock, c as formatPrice, d as paymentTransactionApi, j as createTextVNode, o as cartApi, ot as unref, s as contractApi, tt as ref, w as computed, z as onMounted } from "./api-lWF_eiJ8.js";
import { a as useRoute, i as useCartStore, o as useRouter, t as _plugin_vue_export_helper_default } from "./index-LltwIOcO.js";
import { t as notifyDataUpdated } from "./useAutoRefresh-DbvPryYR.js";
//#region src/views/PaymentView.vue
var _hoisted_1 = { class: "container py-5 payment-page" };
var _hoisted_2 = { class: "mb-4" };
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
	class: "payment-grid"
};
var _hoisted_6 = { class: "cs-card p-4" };
var _hoisted_7 = { class: "amount" };
var _hoisted_8 = {
	key: 0,
	class: "alert alert-success"
};
var _hoisted_9 = {
	key: 1,
	class: "alert alert-danger"
};
var _hoisted_10 = { key: 2 };
var _hoisted_11 = ["disabled"];
var _hoisted_12 = {
	key: 0,
	class: "spinner-border spinner-border-sm me-2"
};
var _hoisted_13 = {
	key: 1,
	class: "text-center mt-4"
};
var _hoisted_14 = { class: "alert alert-warning py-2 mb-3 fw-bold text-danger" };
var _hoisted_15 = { class: "qr-wrapper mx-auto mb-3" };
var _hoisted_16 = { class: "qr-scanner-frame" };
var _hoisted_17 = ["src"];
var _hoisted_18 = { class: "bank-details-box text-start p-3 rounded mb-3" };
var _hoisted_19 = { class: "d-flex justify-content-between align-items-center mb-2" };
var _hoisted_20 = { class: "text-primary bg-white px-2 py-1 rounded border" };
var _hoisted_21 = {
	key: 2,
	class: "gateway-note mt-3 mb-0"
};
var _hoisted_22 = { class: "cs-card p-4" };
var _hoisted_23 = {
	key: 0,
	class: "empty"
};
var _hoisted_24 = { class: "text-end" };
var webhookReconciliationWindow = 1800 * 1e3;
var PaymentView_default = /*#__PURE__*/ _plugin_vue_export_helper_default({
	__name: "PaymentView",
	setup(__props) {
		const route = useRoute();
		const router = useRouter();
		const cart = useCartStore();
		const loading = ref(true), submitting = ref(false), error = ref(""), contract = ref({}), payments = ref([]);
		const order = ref({});
		const qrUrl = ref("");
		const qrAmount = ref(null);
		let pollInterval = null;
		let countdownInterval = null;
		let reconciliationTimeout = null;
		let wasDepositPaid = false;
		let cartCleared = false;
		const timeLeft = ref(180);
		const isTimeout = ref(false);
		const formatDate = (value) => value ? new Date(value).toLocaleString("vi-VN") : "";
		const paymentAmount = computed(() => qrAmount.value ?? order.value?.depositAmount ?? contract.value?.depositAmount ?? contract.value?.deposit ?? 0);
		const formatCountdown = computed(() => {
			const minutes = Math.floor(timeLeft.value / 60);
			const seconds = timeLeft.value % 60;
			return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
		});
		async function load() {
			loading.value = true;
			try {
				const [contractResponse, transactionResponse] = await Promise.all([contractApi.getByOrder(route.params.id), paymentTransactionApi.getByOrder(route.params.id)]);
				contract.value = contractResponse.data.data.contract;
				order.value = contractResponse.data.data.order || {};
				syncRemainingTime();
				payments.value = transactionResponse.data.data || [];
			} catch (e) {
				error.value = e.response?.data?.message || "Không thể tải thông tin thanh toán";
			} finally {
				loading.value = false;
			}
		}
		async function checkPaymentStatus() {
			try {
				const freshRequest = {
					params: { _ts: Date.now() },
					headers: { "Cache-Control": "no-cache" }
				};
				const updatedContract = (await contractApi.getByOrder(route.params.id, freshRequest)).data.data.contract;
				contract.value = updatedContract || contract.value;
				if (updatedContract && updatedContract.depositStatus === "PAID") {
					if (!wasDepositPaid) {
						window.dispatchEvent(new CustomEvent("carstore-toast", { detail: {
							message: "Tiền cọc đã được xác nhận thành công",
							type: "success"
						} }));
						wasDepositPaid = true;
						stopAllTimers();
						await clearDepositCart();
						notifyDataUpdated();
						window.setTimeout(() => router.replace(`/orders/${route.params.id}/contract`), 400);
					}
				}
				try {
					const transactionResponse = await paymentTransactionApi.getByOrder(route.params.id, freshRequest);
					payments.value = transactionResponse.data.data || [];
				} catch (transactionError) {}
			} catch (e) {}
		}
		async function clearDepositCart() {
			if (cartCleared) return;
			cartCleared = true;
			cart.clearCart();
			try {
				await cartApi.clear();
			} catch {}
		}
		function startPolling() {
			syncRemainingTime();
			if (!pollInterval) pollInterval = setInterval(checkPaymentStatus, 3e3);
			scheduleReconciliationStop();
			if (isTimeout.value) return;
			if (!countdownInterval) countdownInterval = setInterval(() => {
				if (timeLeft.value > 0) timeLeft.value--;
				else {
					isTimeout.value = true;
					clearInterval(countdownInterval);
					countdownInterval = null;
				}
			}, 1e3);
		}
		function scheduleReconciliationStop() {
			if (reconciliationTimeout) return;
			const createdAt = new Date(order.value?.createDate).getTime();
			const remaining = Number.isFinite(createdAt) ? createdAt + webhookReconciliationWindow - Date.now() : webhookReconciliationWindow;
			if (remaining <= 0) {
				stopAllTimers();
				return;
			}
			reconciliationTimeout = setTimeout(() => {
				reconciliationTimeout = null;
				if (contract.value?.depositStatus !== "PAID") stopAllTimers();
			}, remaining);
		}
		function syncRemainingTime() {
			const createdAt = new Date(order.value?.createDate).getTime();
			if (!Number.isFinite(createdAt)) {
				timeLeft.value = 180;
				isTimeout.value = false;
				return;
			}
			timeLeft.value = Math.max(0, Math.ceil((createdAt + 180 * 1e3 - Date.now()) / 1e3));
			isTimeout.value = timeLeft.value === 0;
		}
		function stopAllTimers() {
			if (pollInterval) {
				clearInterval(pollInterval);
				pollInterval = null;
			}
			if (countdownInterval) {
				clearInterval(countdownInterval);
				countdownInterval = null;
			}
			if (reconciliationTimeout) {
				clearTimeout(reconciliationTimeout);
				reconciliationTimeout = null;
			}
		}
		async function payDeposit() {
			if (submitting.value || qrUrl.value) return;
			submitting.value = true;
			error.value = "";
			try {
				const { data } = await paymentTransactionApi.createQr(route.params.id);
				if (!data.success) throw new Error(data.message);
				qrUrl.value = data.data.qrUrl;
				qrAmount.value = data.data.amount;
				startPolling();
			} catch (e) {
				error.value = e.response?.data?.message || e.message || "Không thể tạo thanh toán mã QR";
			} finally {
				submitting.value = false;
			}
		}
		onMounted(async () => {
			await load();
			wasDepositPaid = contract.value.depositStatus === "PAID";
			if (wasDepositPaid) await clearDepositCart();
			if (route.query.method === "sepay" && contract.value.depositStatus !== "PAID" && !isTimeout.value) await payDeposit();
			else if (contract.value.depositStatus !== "PAID") startPolling();
			document.addEventListener("visibilitychange", refreshWhenVisible);
		});
		function refreshWhenVisible() {
			if (!document.hidden && contract.value.depositStatus !== "PAID") checkPaymentStatus();
		}
		onUnmounted(() => {
			document.removeEventListener("visibilitychange", refreshWhenVisible);
			stopAllTimers();
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("main", _hoisted_1, [createBaseVNode("div", _hoisted_2, [
				_cache[0] || (_cache[0] = createBaseVNode("span", { class: "eyebrow" }, "THANH TOÁN AN TOÀN", -1)),
				createBaseVNode("h1", null, "Thanh toán đơn #" + toDisplayString(unref(route).params.id), 1),
				_cache[1] || (_cache[1] = createBaseVNode("p", { class: "text-secondary" }, "Theo dõi tiền cọc và lịch sử giao dịch của hợp đồng.", -1))
			]), loading.value ? (openBlock(), createElementBlock("div", _hoisted_3, [..._cache[2] || (_cache[2] = [createBaseVNode("span", { class: "spinner-border text-danger" }, null, -1)])])) : error.value ? (openBlock(), createElementBlock("div", _hoisted_4, toDisplayString(error.value), 1)) : (openBlock(), createElementBlock("div", _hoisted_5, [createBaseVNode("section", _hoisted_6, [
				_cache[10] || (_cache[10] = createBaseVNode("h2", null, "Thanh toán tiền cọc", -1)),
				createBaseVNode("div", _hoisted_7, toDisplayString(unref(formatPrice)(paymentAmount.value)) + " VNĐ", 1),
				contract.value.depositStatus === "PAID" ? (openBlock(), createElementBlock("div", _hoisted_8, " Tiền cọc đã được xác nhận thành công. ")) : isTimeout.value ? (openBlock(), createElementBlock("div", _hoisted_9, [..._cache[3] || (_cache[3] = [createBaseVNode("i", { class: "bi bi-x-circle-fill me-1" }, null, -1), createTextVNode(" Giao dịch đã hết hạn (quá 3 phút). Đơn hàng chưa thanh toán sẽ được hủy và hoàn lại tồn kho. ", -1)])])) : (openBlock(), createElementBlock("div", _hoisted_10, [!qrUrl.value ? (openBlock(), createElementBlock("button", {
					key: 0,
					class: "btn btn-danger w-100",
					disabled: submitting.value,
					onClick: payDeposit
				}, [submitting.value ? (openBlock(), createElementBlock("span", _hoisted_12)) : createCommentVNode("", true), createTextVNode(" " + toDisplayString(submitting.value ? "Đang tạo mã QR..." : "Lấy mã QR thanh toán"), 1)], 8, _hoisted_11)) : (openBlock(), createElementBlock("div", _hoisted_13, [
					_cache[7] || (_cache[7] = createBaseVNode("h5", { class: "fw-bold mb-3" }, "Quét QR để thanh toán", -1)),
					createBaseVNode("div", _hoisted_14, " Thời gian giữ lệnh: " + toDisplayString(formatCountdown.value), 1),
					createBaseVNode("div", _hoisted_15, [createBaseVNode("div", _hoisted_16, [createBaseVNode("img", {
						src: qrUrl.value,
						alt: "Mã QR Thanh Toán",
						class: "qr-image img-fluid"
					}, null, 8, _hoisted_17)])]),
					_cache[8] || (_cache[8] = createBaseVNode("p", { class: "mt-2 text-muted mb-3" }, "Sử dụng ứng dụng ngân hàng để quét mã QR", -1)),
					createBaseVNode("div", _hoisted_18, [
						_cache[5] || (_cache[5] = createBaseVNode("div", { class: "d-flex justify-content-between mb-2" }, [createBaseVNode("span", { class: "text-muted small" }, "Ngân hàng"), createBaseVNode("strong", null, "VietinBank")], -1)),
						_cache[6] || (_cache[6] = createBaseVNode("div", { class: "d-flex justify-content-between mb-2" }, [createBaseVNode("span", { class: "text-muted small" }, "Số tài khoản"), createBaseVNode("strong", null, "102880629915")], -1)),
						createBaseVNode("div", _hoisted_19, [_cache[4] || (_cache[4] = createBaseVNode("span", { class: "text-muted small" }, "Nội dung", -1)), createBaseVNode("strong", _hoisted_20, "SEVQR VELOR" + toDisplayString(unref(route).params.id), 1)])
					]),
					_cache[9] || (_cache[9] = createBaseVNode("div", { class: "alert alert-warning small text-start mb-0" }, [createBaseVNode("i", { class: "bi bi-exclamation-triangle-fill me-1" }), createTextVNode(" Vui lòng giữ nguyên nội dung chuyển khoản để hệ thống xác nhận tự động. ")], -1))
				])), !qrUrl.value ? (openBlock(), createElementBlock("p", _hoisted_21, " Giao dịch chỉ được ghi nhận sau khi hệ thống xác nhận thanh toán thành công qua ngân hàng. ")) : createCommentVNode("", true)]))
			]), createBaseVNode("section", _hoisted_22, [
				_cache[11] || (_cache[11] = createBaseVNode("h2", null, "Lịch sử thanh toán", -1)),
				!payments.value.length ? (openBlock(), createElementBlock("div", _hoisted_23, "Chưa có giao dịch nào.")) : createCommentVNode("", true),
				(openBlock(true), createElementBlock(Fragment, null, renderList(payments.value, (item) => {
					return openBlock(), createElementBlock("div", {
						key: item.id,
						class: "history-row"
					}, [createBaseVNode("div", null, [createBaseVNode("strong", null, toDisplayString(item.transactionNo), 1), createBaseVNode("small", null, [createTextVNode(toDisplayString(formatDate(item.paidAt)) + " · " + toDisplayString(item.gateway), 1), item.bankCode ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [createTextVNode(" · " + toDisplayString(item.bankCode), 1)], 64)) : createCommentVNode("", true)])]), createBaseVNode("div", _hoisted_24, [createBaseVNode("strong", null, toDisplayString(unref(formatPrice)(item.amount)) + " VNĐ", 1), createBaseVNode("span", null, [createTextVNode(toDisplayString(item.status), 1), item.responseCode ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [createTextVNode(" (" + toDisplayString(item.responseCode) + ")", 1)], 64)) : createCommentVNode("", true)])])]);
				}), 128))
			])]))]);
		};
	}
}, [["__scopeId", "data-v-4e739f81"]]);
//#endregion
export { PaymentView_default as default };
