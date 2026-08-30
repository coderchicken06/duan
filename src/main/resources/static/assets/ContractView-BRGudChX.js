import { A as createStaticVNode, D as createCommentVNode, Dt as toDisplayString, E as createBlock, K as withCtx, O as createElementBlock, S as Fragment, T as createBaseVNode, Tt as normalizeClass, U as renderList, V as openBlock, W as resolveComponent, a as carImageUrl, c as formatPrice, j as createTextVNode, ot as unref, tt as ref, v as useDefaultCarImage, w as computed, y as api, z as onMounted } from "./api-lWF_eiJ8.js";
import { a as useRoute, t as _plugin_vue_export_helper_default } from "./index-LltwIOcO.js";
import { n as useAutoRefresh } from "./useAutoRefresh-DbvPryYR.js";
//#region src/views/ContractView.vue
var _hoisted_1 = { class: "contract-page py-5" };
var _hoisted_2 = {
	key: 0,
	class: "container text-center py-5"
};
var _hoisted_3 = {
	key: 1,
	class: "container"
};
var _hoisted_4 = { class: "alert alert-danger" };
var _hoisted_5 = {
	key: 2,
	class: "contract-sheet container"
};
var _hoisted_6 = { class: "contract-header" };
var _hoisted_7 = { class: "text-center" };
var _hoisted_8 = { key: 0 };
var _hoisted_9 = { class: "text-end" };
var _hoisted_10 = { class: "contract-section" };
var _hoisted_11 = { class: "info-grid" };
var _hoisted_12 = { class: "contract-section" };
var _hoisted_13 = { class: "mb-0" };
var _hoisted_14 = { class: "contract-section" };
var _hoisted_15 = ["src", "alt"];
var _hoisted_16 = { class: "contract-section" };
var _hoisted_17 = { class: "info-grid" };
var _hoisted_18 = { class: "contract-section payment-summary" };
var _hoisted_19 = { class: "total" };
var _hoisted_20 = {
	key: 0,
	class: "alert alert-success contract-payment-confirmed",
	role: "status"
};
var _hoisted_21 = { class: "contract-actions" };
var ContractView_default = /*#__PURE__*/ _plugin_vue_export_helper_default({
	__name: "ContractView",
	setup(__props) {
		const route = useRoute(), loading = ref(true), error = ref(""), data = ref({});
		const contract = computed(() => data.value.contract || {}), order = computed(() => data.value.order || {});
		const customer = computed(() => data.value.customer || {}), details = computed(() => data.value.details || []), payments = computed(() => data.value.payments || []);
		const isDepositPaid = computed(() => {
			const depositStatuses = [contract.value.depositStatus, order.value.depositStatus];
			const contractStatus = String(contract.value.status || "").toUpperCase();
			return depositStatuses.some((status) => String(status || "").toUpperCase() === "PAID") || ["PAID", "PROCESSING"].includes(contractStatus);
		});
		const paidAmount = computed(() => {
			return payments.value.filter((p) => p.status === "SUCCESS").reduce((sum, p) => sum + Number(p.amount || 0), 0) || (contract.value.depositStatus === "PAID" ? Number(contract.value.depositAmount || 0) : 0);
		});
		const remaining = computed(() => Math.max(0, Number(contract.value.total || 0) - paidAmount.value));
		const formatDate = (value) => value ? new Date(value).toLocaleString("vi-VN") : "Chưa cập nhật";
		const printContract = () => window.print();
		async function loadContract() {
			try {
				const response = await api.get(`/api/contracts/${route.params.id}`, { params: { _ts: Date.now() } });
				data.value = response.data.data;
				error.value = "";
			} catch (e) {
				if (loading.value) error.value = e.response?.data?.message || "Không thể tải hợp đồng";
			} finally {
				loading.value = false;
			}
		}
		onMounted(loadContract);
		useAutoRefresh(loadContract);
		return (_ctx, _cache) => {
			const _component_router_link = resolveComponent("router-link");
			return openBlock(), createElementBlock("main", _hoisted_1, [loading.value ? (openBlock(), createElementBlock("div", _hoisted_2, [..._cache[2] || (_cache[2] = [createBaseVNode("span", { class: "spinner-border text-danger" }, null, -1), createBaseVNode("p", { class: "mt-3" }, "Đang tải hợp đồng...", -1)])])) : error.value ? (openBlock(), createElementBlock("div", _hoisted_3, [createBaseVNode("div", _hoisted_4, toDisplayString(error.value), 1)])) : (openBlock(), createElementBlock("article", _hoisted_5, [
				createBaseVNode("header", _hoisted_6, [
					_cache[5] || (_cache[5] = createBaseVNode("div", null, [createBaseVNode("strong", { class: "brand" }, "CARSTORE"), createBaseVNode("small", null, "Showroom ô tô")], -1)),
					createBaseVNode("div", _hoisted_7, [
						_cache[3] || (_cache[3] = createBaseVNode("h1", null, "HỢP ĐỒNG MUA BÁN XE", -1)),
						createBaseVNode("p", null, "Số: " + toDisplayString(contract.value.contractNo || `HĐ-${contract.value.id}-${order.value.id}`), 1),
						contract.value.quotationId ? (openBlock(), createElementBlock("small", _hoisted_8, "Báo giá #" + toDisplayString(contract.value.quotationId), 1)) : createCommentVNode("", true)
					]),
					createBaseVNode("div", _hoisted_9, [_cache[4] || (_cache[4] = createBaseVNode("small", null, "Ngày lập", -1)), createBaseVNode("strong", null, toDisplayString(formatDate(contract.value.contractDate)), 1)])
				]),
				createBaseVNode("section", _hoisted_10, [_cache[10] || (_cache[10] = createBaseVNode("h2", null, "Thông tin khách hàng", -1)), createBaseVNode("div", _hoisted_11, [
					createBaseVNode("p", null, [_cache[6] || (_cache[6] = createBaseVNode("span", null, "Họ và tên", -1)), createBaseVNode("strong", null, toDisplayString(customer.value.fullname || "Chưa cập nhật"), 1)]),
					createBaseVNode("p", null, [_cache[7] || (_cache[7] = createBaseVNode("span", null, "Username", -1)), createBaseVNode("strong", null, toDisplayString(customer.value.username), 1)]),
					createBaseVNode("p", null, [_cache[8] || (_cache[8] = createBaseVNode("span", null, "Email", -1)), createBaseVNode("strong", null, toDisplayString(customer.value.email || "Chưa cập nhật"), 1)]),
					createBaseVNode("p", null, [_cache[9] || (_cache[9] = createBaseVNode("span", null, "Địa chỉ", -1)), createBaseVNode("strong", null, toDisplayString(order.value.address || "Chưa cập nhật"), 1)])
				])]),
				createBaseVNode("section", _hoisted_12, [_cache[12] || (_cache[12] = createBaseVNode("h2", null, "Thông tin nhân viên", -1)), createBaseVNode("p", _hoisted_13, [_cache[11] || (_cache[11] = createBaseVNode("span", { class: "text-secondary" }, "Nhân viên phụ trách: ", -1)), createBaseVNode("strong", null, toDisplayString(contract.value.employeeUsername || "Đang chờ phân công"), 1)])]),
				createBaseVNode("section", _hoisted_14, [_cache[13] || (_cache[13] = createBaseVNode("h2", null, "Thông tin xe", -1)), (openBlock(true), createElementBlock(Fragment, null, renderList(details.value, (item) => {
					return openBlock(), createElementBlock("div", {
						key: item.id,
						class: "vehicle-row"
					}, [createBaseVNode("img", {
						src: unref(carImageUrl)(item.car?.image),
						alt: item.car?.name,
						onError: _cache[0] || (_cache[0] = (...args) => unref(useDefaultCarImage) && unref(useDefaultCarImage)(...args))
					}, null, 40, _hoisted_15), createBaseVNode("div", null, [
						createBaseVNode("h3", null, toDisplayString(item.car?.name), 1),
						createBaseVNode("p", null, "Năm sản xuất: " + toDisplayString(item.car?.year || "Chưa cập nhật") + " · Màu: " + toDisplayString(item.car?.color || "Chưa cập nhật"), 1),
						createBaseVNode("strong", null, toDisplayString(unref(formatPrice)(item.price)) + " VNĐ × " + toDisplayString(item.quantity), 1)
					])]);
				}), 128))]),
				createBaseVNode("section", _hoisted_16, [_cache[20] || (_cache[20] = createBaseVNode("h2", null, "Thông tin đơn hàng và đặt cọc", -1)), createBaseVNode("div", _hoisted_17, [
					createBaseVNode("p", null, [_cache[14] || (_cache[14] = createBaseVNode("span", null, "Order ID", -1)), createBaseVNode("strong", null, "#" + toDisplayString(order.value.id), 1)]),
					createBaseVNode("p", null, [_cache[15] || (_cache[15] = createBaseVNode("span", null, "Ngày đặt", -1)), createBaseVNode("strong", null, toDisplayString(formatDate(order.value.createDate)), 1)]),
					createBaseVNode("p", null, [_cache[16] || (_cache[16] = createBaseVNode("span", null, "Trạng thái đơn", -1)), createBaseVNode("strong", null, toDisplayString(order.value.status), 1)]),
					createBaseVNode("p", null, [_cache[17] || (_cache[17] = createBaseVNode("span", null, "Trạng thái cọc", -1)), createBaseVNode("b", { class: normalizeClass(["status-badge", { paid: contract.value.depositStatus === "PAID" }]) }, toDisplayString(contract.value.depositStatus), 3)]),
					createBaseVNode("p", null, [_cache[18] || (_cache[18] = createBaseVNode("span", null, "Phương thức", -1)), createBaseVNode("strong", null, toDisplayString(contract.value.depositMethod || "Chưa thanh toán"), 1)]),
					createBaseVNode("p", null, [_cache[19] || (_cache[19] = createBaseVNode("span", null, "Ngày thanh toán", -1)), createBaseVNode("strong", null, toDisplayString(formatDate(contract.value.depositPaidAt)), 1)])
				])]),
				createBaseVNode("section", _hoisted_18, [
					_cache[25] || (_cache[25] = createBaseVNode("h2", null, "Giá trị hợp đồng", -1)),
					createBaseVNode("p", null, [_cache[21] || (_cache[21] = createBaseVNode("span", null, "Giá trị xe", -1)), createBaseVNode("strong", null, toDisplayString(unref(formatPrice)(contract.value.total)) + " VNĐ", 1)]),
					createBaseVNode("p", null, [_cache[22] || (_cache[22] = createBaseVNode("span", null, "Tiền đặt cọc", -1)), createBaseVNode("strong", null, toDisplayString(unref(formatPrice)(contract.value.depositAmount || contract.value.deposit)) + " VNĐ", 1)]),
					createBaseVNode("p", null, [_cache[23] || (_cache[23] = createBaseVNode("span", null, "Đã thanh toán", -1)), createBaseVNode("strong", null, toDisplayString(unref(formatPrice)(paidAmount.value)) + " VNĐ", 1)]),
					createBaseVNode("p", _hoisted_19, [_cache[24] || (_cache[24] = createBaseVNode("span", null, "Còn lại", -1)), createBaseVNode("strong", null, toDisplayString(unref(formatPrice)(remaining.value)) + " VNĐ", 1)])
				]),
				isDepositPaid.value ? (openBlock(), createElementBlock("div", _hoisted_20, " Đã thanh toán tiền cọc thành công. ")) : createCommentVNode("", true),
				_cache[27] || (_cache[27] = createStaticVNode("<section class=\"contract-section terms\" data-v-d88cfa05><h2 data-v-d88cfa05>Điều khoản</h2><ol data-v-d88cfa05><li data-v-d88cfa05>Xe được bàn giao theo đúng thông tin và tình trạng hai bên đã xác nhận.</li><li data-v-d88cfa05>Chính sách bảo hành áp dụng theo thông tin công bố của showroom và nhà sản xuất.</li><li data-v-d88cfa05>Thời gian giao xe được thống nhất sau khi hoàn tất nghĩa vụ thanh toán.</li><li data-v-d88cfa05>Việc hoàn tiền cọc thực hiện theo trạng thái đơn và thỏa thuận được hai bên xác nhận.</li></ol></section><section class=\"signatures\" data-v-d88cfa05><div data-v-d88cfa05>KHÁCH HÀNG<small data-v-d88cfa05>(Ký và ghi rõ họ tên)</small></div><div data-v-d88cfa05>NHÂN VIÊN<small data-v-d88cfa05>(Ký và ghi rõ họ tên)</small></div><div data-v-d88cfa05>ĐẠI DIỆN SHOWROOM<small data-v-d88cfa05>(Ký, đóng dấu)</small></div></section>", 2)),
				createBaseVNode("footer", _hoisted_21, [
					createBaseVNode("button", {
						class: "btn btn-outline-secondary",
						onClick: _cache[1] || (_cache[1] = ($event) => _ctx.$router.back())
					}, "Quay lại"),
					!isDepositPaid.value ? (openBlock(), createBlock(_component_router_link, {
						key: 0,
						class: "btn btn-danger",
						to: `/orders/${order.value.id}/payment`
					}, {
						default: withCtx(() => [..._cache[26] || (_cache[26] = [createTextVNode("Thanh toán", -1)])]),
						_: 1
					}, 8, ["to"])) : createCommentVNode("", true),
					createBaseVNode("button", {
						class: "btn btn-dark",
						onClick: printContract
					}, "In / Xuất PDF")
				])
			]))]);
		};
	}
}, [["__scopeId", "data-v-d88cfa05"]]);
//#endregion
export { ContractView_default as default };
