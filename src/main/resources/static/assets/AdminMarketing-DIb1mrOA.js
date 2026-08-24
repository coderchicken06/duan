import { Dt as toDisplayString, G as watch, M as createVNode, O as createElementBlock, S as Fragment, T as createBaseVNode, U as renderList, V as openBlock, _ as uploadApi, j as createTextVNode, l as newsApi, ot as unref, p as promotionApi, q as withDirectives, t as adminApi, tt as ref, z as onMounted } from "./api-Cd2rmWmR.js";
import { a as useRoute, c as vModelCheckbox, d as vModelText, n as _plugin_vue_export_helper_default, p as withModifiers, u as vModelSelect } from "./index-BX99C7pg.js";
import { t as showCartToast } from "./useCartToast-CRv33ZAZ.js";
import { n as useAutoRefresh, t as notifyDataUpdated } from "./useAutoRefresh-CiKJsJMn.js";
import { t as DatePickerInput_default } from "./DatePickerInput-BzPhYM7P.js";
//#region src/views/admin/AdminMarketing.vue
var _hoisted_1 = { class: "container py-5" };
var _hoisted_2 = { class: "marketing-grid" };
var _hoisted_3 = { class: "cs-card p-4" };
var _hoisted_4 = ["value"];
var _hoisted_5 = ["disabled"];
var _hoisted_6 = ["disabled", "onClick"];
var _hoisted_7 = ["disabled", "onClick"];
var _hoisted_8 = ["disabled", "onClick"];
var _hoisted_9 = ["disabled", "onClick"];
var _hoisted_10 = { class: "cs-card p-4" };
var _hoisted_11 = { class: "d-flex gap-2" };
var _hoisted_12 = ["disabled"];
var _hoisted_13 = ["disabled", "onClick"];
var _hoisted_14 = ["disabled", "onClick"];
var AdminMarketing_default = /*#__PURE__*/ _plugin_vue_export_helper_default({
	__name: "AdminMarketing",
	setup(__props) {
		const promotions = ref([]), articles = ref([]), cars = ref([]);
		const assignments = ref({});
		const selectedCarId = ref(null);
		const submitting = ref(false);
		const route = useRoute();
		const emptyPromotion = () => ({
			name: "",
			type: "PERCENT",
			value: null,
			startDate: "",
			endDate: "",
			status: true
		});
		const emptyNews = () => ({
			title: "",
			thumbnail: "",
			summary: "",
			content: "",
			status: "DRAFT"
		});
		const promotion = ref(emptyPromotion()), article = ref(emptyNews());
		const dateInput = (v) => v ? String(v).slice(0, 10) : "";
		const today = (() => {
			const value = /* @__PURE__ */ new Date();
			return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
		})();
		const formatDateDisplay = (v) => {
			const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateInput(v));
			return match ? `${match[3]}/${match[2]}/${match[1]}` : "";
		};
		async function load() {
			const [p, n, c] = await Promise.all([
				promotionApi.getAll(),
				newsApi.getAll(),
				adminApi.getCars()
			]);
			promotions.value = p.data.data || [];
			articles.value = n.data.data || [];
			cars.value = Array.isArray(c.data) ? c.data : c.data.data || [];
			const pairs = await Promise.all(promotions.value.map(async (item) => {
				const { data } = await promotionApi.getAssignedCars(item.id);
				return [item.id, data.data?.[0]?.carId || null];
			}));
			assignments.value = Object.fromEntries(pairs);
		}
		function assignedCarName(promotionId) {
			const carId = assignments.value[promotionId];
			return cars.value.find((car) => car.id === carId)?.name || "Chưa chọn xe";
		}
		async function action(fn, success) {
			if (submitting.value) return false;
			submitting.value = true;
			try {
				const response = await fn();
				if (response?.data?.success === false) {
					showCartToast(response.data.message || "Không thể thực hiện", "error");
					return false;
				}
				await load();
				notifyDataUpdated();
				showCartToast(success);
				return true;
			} catch (e) {
				showCartToast(e.response?.data?.message || e.message || "Không thể thực hiện", "error");
				return false;
			} finally {
				submitting.value = false;
			}
		}
		async function savePromotion() {
			if (!selectedCarId.value) {
				showCartToast("Vui lòng chọn xe áp dụng.", "warning");
				return;
			}
			const successMessage = promotion.value.id ? "Đã cập nhật khuyến mãi" : "Đã thêm khuyến mãi";
			const payload = {
				...promotion.value,
				startDate: dateInput(promotion.value.startDate),
				endDate: dateInput(promotion.value.endDate)
			};
			if (await action(async () => {
				const response = promotion.value.id ? await promotionApi.update(promotion.value.id, payload) : await promotionApi.create(payload);
				if (response.data.success === false) return response;
				promotion.value = {
					...response.data.data,
					startDate: dateInput(response.data.data.startDate),
					endDate: dateInput(response.data.data.endDate)
				};
				return promotionApi.assignToCar(response.data.data.id, selectedCarId.value);
			}, successMessage)) {
				promotion.value = emptyPromotion();
				selectedCarId.value = null;
			}
		}
		function editPromotion(item) {
			promotion.value = {
				...item,
				startDate: dateInput(item.startDate),
				endDate: dateInput(item.endDate)
			};
			selectedCarId.value = assignments.value[item.id] || null;
		}
		async function setPromotionStatus(item, status) {
			await action(() => promotionApi.update(item.id, {
				...item,
				status
			}), status ? "Đã áp dụng khuyến mãi" : "Đã ngừng áp dụng khuyến mãi");
		}
		async function removePromotion(id) {
			if (confirm("Xóa khuyến mãi này?")) await action(() => promotionApi.delete(id), "Đã xóa khuyến mãi");
		}
		async function onNewsFileChange(e) {
			const file = e.target.files?.[0];
			if (!file) return;
			try {
				const { data } = await uploadApi.upload(file);
				article.value.thumbnail = data;
				showCartToast("Đã tải ảnh lên");
			} catch (error) {
				showCartToast(error.response?.data?.message || "Không thể tải ảnh lên", "error");
			} finally {
				e.target.value = "";
			}
		}
		async function saveNews() {
			const successMessage = article.value.id ? "Đã cập nhật tin tức" : "Đã thêm tin tức";
			const payload = {
				...article.value,
				slug: ""
			};
			if (await action(async () => {
				const response = article.value.id ? await newsApi.update(article.value.id, payload) : await newsApi.create(payload);
				if (response.data.success === false) return response;
				article.value = { ...response.data.data };
				return response;
			}, successMessage)) article.value = emptyNews();
		}
		async function removeNews(id) {
			if (confirm("Xóa tin tức này?")) await action(() => newsApi.delete(id), "Đã xóa tin tức");
		}
		onMounted(load);
		useAutoRefresh(load, 0);
		watch(() => route.path, load);
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("main", _hoisted_1, [_cache[18] || (_cache[18] = createBaseVNode("h1", null, "Khuyến mãi & Tin tức", -1)), createBaseVNode("div", _hoisted_2, [createBaseVNode("section", _hoisted_3, [
				_cache[15] || (_cache[15] = createBaseVNode("h2", null, "Khuyến mãi", -1)),
				createBaseVNode("form", {
					class: "form-grid",
					onSubmit: withModifiers(savePromotion, ["prevent"])
				}, [
					withDirectives(createBaseVNode("input", {
						"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => promotion.value.name = $event),
						class: "form-control",
						placeholder: "Tiêu đề khuyến mãi",
						required: ""
					}, null, 512), [[
						vModelText,
						promotion.value.name,
						void 0,
						{ trim: true }
					]]),
					withDirectives(createBaseVNode("select", {
						"onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => selectedCarId.value = $event),
						class: "form-select",
						required: ""
					}, [_cache[12] || (_cache[12] = createBaseVNode("option", {
						disabled: "",
						value: null
					}, "Chọn xe áp dụng", -1)), (openBlock(true), createElementBlock(Fragment, null, renderList(cars.value, (car) => {
						return openBlock(), createElementBlock("option", {
							key: car.id,
							value: car.id
						}, toDisplayString(car.name), 9, _hoisted_4);
					}), 128))], 512), [[
						vModelSelect,
						selectedCarId.value,
						void 0,
						{ number: true }
					]]),
					withDirectives(createBaseVNode("select", {
						"onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => promotion.value.type = $event),
						class: "form-select"
					}, [..._cache[13] || (_cache[13] = [createBaseVNode("option", { value: "PERCENT" }, "Phần trăm", -1), createBaseVNode("option", { value: "FIXED" }, "Số tiền", -1)])], 512), [[vModelSelect, promotion.value.type]]),
					withDirectives(createBaseVNode("input", {
						"onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => promotion.value.value = $event),
						class: "form-control",
						type: "number",
						min: "1",
						placeholder: "Giá trị",
						required: ""
					}, null, 512), [[
						vModelText,
						promotion.value.value,
						void 0,
						{ number: true }
					]]),
					createVNode(DatePickerInput_default, {
						modelValue: promotion.value.startDate,
						"onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => promotion.value.startDate = $event),
						min: unref(today),
						"aria-label": "Ngày bắt đầu",
						title: "Ngày bắt đầu (dd/mm/yyyy)"
					}, null, 8, ["modelValue", "min"]),
					createVNode(DatePickerInput_default, {
						modelValue: promotion.value.endDate,
						"onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => promotion.value.endDate = $event),
						min: unref(today),
						"aria-label": "Ngày kết thúc",
						title: "Ngày kết thúc (dd/mm/yyyy)"
					}, null, 8, ["modelValue", "min"]),
					createBaseVNode("label", null, [withDirectives(createBaseVNode("input", {
						"onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => promotion.value.status = $event),
						type: "checkbox"
					}, null, 512), [[vModelCheckbox, promotion.value.status]]), _cache[14] || (_cache[14] = createTextVNode(" Đang hoạt động", -1))]),
					createBaseVNode("button", {
						class: "btn btn-danger",
						disabled: submitting.value
					}, toDisplayString(submitting.value ? "Đang lưu..." : promotion.value.id ? "Cập nhật" : "Thêm"), 9, _hoisted_5)
				], 32),
				(openBlock(true), createElementBlock(Fragment, null, renderList(promotions.value, (item) => {
					return openBlock(), createElementBlock("div", {
						key: item.id,
						class: "admin-row"
					}, [createBaseVNode("span", null, [
						createBaseVNode("strong", null, toDisplayString(item.name), 1),
						createBaseVNode("small", null, toDisplayString(assignedCarName(item.id)) + " giảm " + toDisplayString(item.value) + toDisplayString(item.type === "PERCENT" ? "%" : " VNĐ"), 1),
						createBaseVNode("small", null, "Thời gian: " + toDisplayString(formatDateDisplay(item.startDate) || "—") + " - " + toDisplayString(formatDateDisplay(item.endDate) || "—"), 1)
					]), createBaseVNode("span", null, [
						!item.status ? (openBlock(), createElementBlock("button", {
							key: 0,
							class: "btn btn-sm btn-outline-success",
							disabled: submitting.value,
							onClick: ($event) => setPromotionStatus(item, true)
						}, "Áp dụng", 8, _hoisted_6)) : (openBlock(), createElementBlock("button", {
							key: 1,
							class: "btn btn-sm btn-outline-warning",
							disabled: submitting.value,
							onClick: ($event) => setPromotionStatus(item, false)
						}, "Ngừng áp dụng", 8, _hoisted_7)),
						createBaseVNode("button", {
							class: "btn btn-sm btn-outline-primary",
							disabled: submitting.value,
							onClick: ($event) => editPromotion(item)
						}, "Sửa", 8, _hoisted_8),
						createBaseVNode("button", {
							class: "btn btn-sm btn-outline-danger",
							disabled: submitting.value,
							onClick: ($event) => removePromotion(item.id)
						}, "Xóa", 8, _hoisted_9)
					])]);
				}), 128))
			]), createBaseVNode("section", _hoisted_10, [
				_cache[17] || (_cache[17] = createBaseVNode("h2", null, "Tin tức", -1)),
				createBaseVNode("form", {
					class: "form-grid",
					onSubmit: withModifiers(saveNews, ["prevent"])
				}, [
					withDirectives(createBaseVNode("input", {
						"onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => article.value.title = $event),
						class: "form-control",
						placeholder: "Tiêu đề",
						required: ""
					}, null, 512), [[
						vModelText,
						article.value.title,
						void 0,
						{ trim: true }
					]]),
					createBaseVNode("div", _hoisted_11, [withDirectives(createBaseVNode("input", {
						"onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => article.value.thumbnail = $event),
						class: "form-control",
						placeholder: "tên file ảnh"
					}, null, 512), [[
						vModelText,
						article.value.thumbnail,
						void 0,
						{ trim: true }
					]]), createBaseVNode("input", {
						type: "file",
						accept: "image/*",
						class: "form-control",
						onChange: onNewsFileChange
					}, null, 32)]),
					withDirectives(createBaseVNode("textarea", {
						"onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => article.value.summary = $event),
						class: "form-control",
						maxlength: "500",
						placeholder: "Tóm tắt"
					}, null, 512), [[
						vModelText,
						article.value.summary,
						void 0,
						{ trim: true }
					]]),
					withDirectives(createBaseVNode("textarea", {
						"onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => article.value.content = $event),
						class: "form-control",
						rows: "5",
						placeholder: "Nội dung"
					}, null, 512), [[
						vModelText,
						article.value.content,
						void 0,
						{ trim: true }
					]]),
					withDirectives(createBaseVNode("select", {
						"onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => article.value.status = $event),
						class: "form-select"
					}, [..._cache[16] || (_cache[16] = [createBaseVNode("option", { value: "DRAFT" }, "Bản nháp", -1), createBaseVNode("option", { value: "PUBLISHED" }, "Xuất bản", -1)])], 512), [[vModelSelect, article.value.status]]),
					createBaseVNode("button", {
						class: "btn btn-danger",
						disabled: submitting.value
					}, toDisplayString(submitting.value ? "Đang lưu..." : article.value.id ? "Cập nhật" : "Thêm"), 9, _hoisted_12)
				], 32),
				(openBlock(true), createElementBlock(Fragment, null, renderList(articles.value, (item) => {
					return openBlock(), createElementBlock("div", {
						key: item.id,
						class: "admin-row"
					}, [createBaseVNode("span", null, [createBaseVNode("strong", null, toDisplayString(item.title), 1), createBaseVNode("small", null, toDisplayString(item.status), 1)]), createBaseVNode("span", null, [createBaseVNode("button", {
						class: "btn btn-sm btn-outline-primary",
						disabled: submitting.value,
						onClick: ($event) => article.value = { ...item }
					}, "Sửa", 8, _hoisted_13), createBaseVNode("button", {
						class: "btn btn-sm btn-outline-danger",
						disabled: submitting.value,
						onClick: ($event) => removeNews(item.id)
					}, "Xóa", 8, _hoisted_14)])]);
				}), 128))
			])])]);
		};
	}
}, [["__scopeId", "data-v-df4bed71"]]);
//#endregion
export { AdminMarketing_default as default };
