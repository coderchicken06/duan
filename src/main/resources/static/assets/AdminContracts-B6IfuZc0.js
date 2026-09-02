import { Dt as toDisplayString, K as withCtx, M as createVNode, O as createElementBlock, S as Fragment, T as createBaseVNode, U as renderList, V as openBlock, W as resolveComponent, c as formatPrice, j as createTextVNode, ot as unref, q as withDirectives, s as contractApi, tt as ref, z as onMounted } from "./api-BIOmrm3q.js";
import { u as vModelSelect } from "./index-B5QpE601.js";
import { t as showCartToast } from "./useCartToast-CRv33ZAZ.js";
import { n as useAutoRefresh, t as notifyDataUpdated } from "./useAutoRefresh-B7w7pWdx.js";
//#region src/views/admin/AdminContracts.vue
var _hoisted_1 = { class: "container py-5" };
var _hoisted_2 = { class: "table-responsive cs-card p-3" };
var _hoisted_3 = { class: "table" };
var _hoisted_4 = ["onUpdate:modelValue", "disabled"];
var _hoisted_5 = ["disabled", "onClick"];
var _sfc_main = {
	__name: "AdminContracts",
	setup(__props) {
		const contracts = ref([]);
		const savingId = ref(null);
		async function load() {
			try {
				const { data } = await contractApi.getAll();
				contracts.value = data.data || [];
			} catch (e) {
				showCartToast(e.response?.data?.message || "Không thể tải hợp đồng", "error");
			}
		}
		async function save(item) {
			if (isSaving(item.id)) return;
			savingId.value = item.id;
			try {
				const { data } = await contractApi.update(item.id, {
					status: item.status,
					employeeUsername: item.employeeUsername,
					pdfPath: item.pdfPath
				});
				Object.assign(item, data.data);
				notifyDataUpdated();
				showCartToast("Đã cập nhật hợp đồng");
			} catch (e) {
				showCartToast(e.response?.data?.message || "Không thể cập nhật hợp đồng", "error");
			} finally {
				savingId.value = null;
			}
		}
		const isSaving = (contractId) => savingId.value === contractId;
		onMounted(load);
		useAutoRefresh(load);
		return (_ctx, _cache) => {
			const _component_router_link = resolveComponent("router-link");
			return openBlock(), createElementBlock("main", _hoisted_1, [_cache[4] || (_cache[4] = createBaseVNode("h1", null, "Quản lý hợp đồng", -1)), createBaseVNode("div", _hoisted_2, [createBaseVNode("table", _hoisted_3, [_cache[3] || (_cache[3] = createBaseVNode("thead", null, [createBaseVNode("tr", null, [
				createBaseVNode("th", null, "Mã"),
				createBaseVNode("th", null, "Khách hàng"),
				createBaseVNode("th", null, "Sản phẩm"),
				createBaseVNode("th", null, "Giá trị"),
				createBaseVNode("th", null, "Trạng thái"),
				createBaseVNode("th", null, "Thao tác")
			])], -1)), createBaseVNode("tbody", null, [(openBlock(true), createElementBlock(Fragment, null, renderList(contracts.value, (item) => {
				return openBlock(), createElementBlock("tr", { key: item.id }, [
					createBaseVNode("td", null, toDisplayString(item.contractNo || `HD-${String(item.id).padStart(3, "0")}`), 1),
					createBaseVNode("td", null, toDisplayString(item.customerUsername), 1),
					createBaseVNode("td", null, toDisplayString(item.carName || item.productName || "Xe chưa xác định"), 1),
					createBaseVNode("td", null, toDisplayString(unref(formatPrice)(item.total)), 1),
					createBaseVNode("td", null, [withDirectives(createBaseVNode("select", {
						"onUpdate:modelValue": ($event) => item.status = $event,
						class: "form-select form-select-sm",
						disabled: isSaving(item.id)
					}, [..._cache[0] || (_cache[0] = [
						createBaseVNode("option", null, "Chờ ký", -1),
						createBaseVNode("option", null, "Đã ký", -1),
						createBaseVNode("option", null, "Hủy", -1)
					])], 8, _hoisted_4), [[vModelSelect, item.status]])]),
					createBaseVNode("td", null, [
						createBaseVNode("button", {
							class: "btn btn-sm btn-danger",
							disabled: isSaving(item.id),
							onClick: ($event) => save(item)
						}, toDisplayString(isSaving(item.id) ? "Đang lưu..." : "Lưu"), 9, _hoisted_5),
						_cache[2] || (_cache[2] = createTextVNode()),
						createVNode(_component_router_link, {
							class: "btn btn-sm btn-outline-secondary",
							to: `/orders/${item.orderId}/contract`
						}, {
							default: withCtx(() => [..._cache[1] || (_cache[1] = [createTextVNode("Xem", -1)])]),
							_: 1
						}, 8, ["to"])
					])
				]);
			}), 128))])])])]);
		};
	}
};
//#endregion
export { _sfc_main as default };
