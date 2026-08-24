import { D as createCommentVNode, Dt as toDisplayString, K as withCtx, M as createVNode, O as createElementBlock, S as Fragment, T as createBaseVNode, U as renderList, V as openBlock, W as resolveComponent, _ as uploadApi, a as carImageUrl, i as carApi, j as createTextVNode, ot as unref, q as withDirectives, t as adminApi, tt as ref, w as computed, z as onMounted } from "./api-Cd2rmWmR.js";
import { a as useRoute, f as withModifiers, l as vModelSelect, o as useRouter, u as vModelText } from "./index-BCOVk736.js";
//#region src/views/CarFormView.vue
var _hoisted_1 = { class: "container cs-container py-5" };
var _hoisted_2 = { class: "cs-card p-4" };
var _hoisted_3 = { class: "cs-page-title mb-4" };
var _hoisted_4 = { class: "row g-3" };
var _hoisted_5 = { class: "col-md-6" };
var _hoisted_6 = { class: "col-md-6" };
var _hoisted_7 = { class: "col-md-4" };
var _hoisted_8 = ["value"];
var _hoisted_9 = { class: "col-md-4" };
var _hoisted_10 = { class: "col-md-4" };
var _hoisted_11 = { class: "col-md-4" };
var _hoisted_12 = { class: "col-md-4" };
var _hoisted_13 = { class: "col-md-4" };
var _hoisted_14 = { class: "col-md-4" };
var _hoisted_15 = { class: "col-md-4" };
var _hoisted_16 = { class: "col-md-4" };
var _hoisted_17 = { class: "col-md-4" };
var _hoisted_18 = { class: "col-md-4" };
var _hoisted_19 = { class: "col-md-4" };
var _hoisted_20 = { class: "col-md-4" };
var _hoisted_21 = { class: "col-md-4" };
var _hoisted_22 = { class: "col-md-4" };
var _hoisted_23 = { class: "col-md-4" };
var _hoisted_24 = { class: "col-md-4" };
var _hoisted_25 = { class: "col-md-4" };
var _hoisted_26 = { class: "col-md-4" };
var _hoisted_27 = { class: "col-md-6" };
var _hoisted_28 = { class: "col-md-6" };
var _hoisted_29 = { class: "col-12" };
var _hoisted_30 = { class: "col-md-6" };
var _hoisted_31 = { class: "col-md-6" };
var _hoisted_32 = { class: "col-md-8" };
var _hoisted_33 = { class: "d-flex gap-2" };
var _hoisted_34 = { class: "col-12" };
var _hoisted_35 = { class: "d-flex gap-2 mb-3" };
var _hoisted_36 = {
	key: 0,
	class: "row g-3"
};
var _hoisted_37 = { class: "border rounded p-2 h-100" };
var _hoisted_38 = ["src"];
var _hoisted_39 = { class: "d-flex align-items-center gap-2 mb-2" };
var _hoisted_40 = ["onUpdate:modelValue"];
var _hoisted_41 = { class: "small text-nowrap" };
var _hoisted_42 = ["checked", "onChange"];
var _hoisted_43 = ["onClick"];
var _hoisted_44 = { class: "col-12" };
var _hoisted_45 = {
	key: 0,
	class: "alert alert-danger cart-alert show error"
};
var _hoisted_46 = { class: "d-flex gap-2" };
var _sfc_main = {
	__name: "CarFormView",
	setup(__props) {
		const route = useRoute();
		const router = useRouter();
		const isEdit = computed(() => !!route.params.id);
		const error = ref("");
		const galleryImages = ref([]);
		const brands = ref([]);
		const brandSelection = ref("");
		const newBrandName = ref("");
		const form = ref({
			name: "",
			price: null,
			brandId: null,
			year: null,
			color: "",
			stock: 0,
			image: "",
			description: "",
			firstRegistration: "",
			mileage: null,
			engineType: "",
			engineCapacity: "",
			interiorColor: "",
			bodyType: "",
			seats: null,
			drivetrain: "",
			transmission: "",
			horsepower: null,
			torque: "",
			fuelType: "",
			fuelConsumption: "",
			warranty: "",
			dealerName: "",
			dealerAddress: "",
			inspectionLevel: "",
			inspectionNote: "",
			safetyFeatures: "",
			comfortFeatures: ""
		});
		const carFields = [
			"name",
			"price",
			"brandId",
			"year",
			"color",
			"stock",
			"image",
			"description",
			"firstRegistration",
			"mileage",
			"engineType",
			"engineCapacity",
			"interiorColor",
			"bodyType",
			"seats",
			"drivetrain",
			"transmission",
			"horsepower",
			"torque",
			"fuelType",
			"fuelConsumption",
			"warranty",
			"dealerName",
			"dealerAddress",
			"inspectionLevel",
			"inspectionNote",
			"safetyFeatures",
			"comfortFeatures"
		];
		onMounted(async () => {
			const brandResponse = await adminApi.getBrands();
			brands.value = Array.isArray(brandResponse.data) ? brandResponse.data : brandResponse.data.data || [];
			if (isEdit.value) {
				const { data } = await carApi.getById(String(route.params.id));
				form.value = { ...data.data || data };
				brandSelection.value = form.value.brandId == null ? "" : String(form.value.brandId);
				const images = await carApi.getImages(String(route.params.id));
				galleryImages.value = Array.isArray(images.data) ? images.data : images.data.data || [];
				const primaryIndex = galleryImages.value.findIndex((item) => item.primaryImage);
				if (galleryImages.value.length) selectPrimary(primaryIndex >= 0 ? primaryIndex : 0);
			}
		});
		async function resolveBrandId() {
			if (brandSelection.value !== "__new__") {
				const brandId = Number(brandSelection.value);
				if (!Number.isInteger(brandId) || brandId <= 0) throw new Error("Vui lòng chọn thương hiệu.");
				return brandId;
			}
			const name = newBrandName.value.trim();
			if (!name) throw new Error("Vui lòng nhập tên thương hiệu mới.");
			const existing = brands.value.find((brand) => brand.name?.trim().toLowerCase() === name.toLowerCase());
			if (existing) return existing.id;
			const response = await adminApi.createBrand({ name });
			if (response.data.success === false || !response.data.data?.id) throw new Error(response.data.message || "Không thể thêm thương hiệu mới.");
			brands.value.push(response.data.data);
			return response.data.data.id;
		}
		async function onFileChange(e) {
			const file = e.target.files?.[0];
			if (!file) return;
			const { data } = await uploadApi.upload(file);
			form.value.image = data;
		}
		async function onGalleryFiles(e) {
			const files = Array.from(e.target.files || []);
			for (const file of files) {
				const { data } = await uploadApi.upload(file);
				galleryImages.value.push({
					imageUrl: data,
					sortOrder: galleryImages.value.length,
					primaryImage: galleryImages.value.length === 0
				});
			}
			e.target.value = "";
		}
		async function removeGalleryImage(item, index) {
			if (item.id && isEdit.value) {
				await carApi.deleteImage(String(route.params.id), item.id);
				const images = await carApi.getImages(String(route.params.id));
				galleryImages.value = Array.isArray(images.data) ? images.data : images.data.data || [];
				return;
			}
			const wasPrimary = item.primaryImage;
			galleryImages.value.splice(index, 1);
			if (wasPrimary && galleryImages.value.length) selectPrimary(0);
		}
		function selectPrimary(index) {
			galleryImages.value.forEach((item, itemIndex) => {
				item.primaryImage = itemIndex === index;
			});
		}
		async function saveGallery(carId) {
			for (let index = 0; index < galleryImages.value.length; index++) {
				const item = galleryImages.value[index];
				const payload = {
					imageUrl: item.imageUrl,
					sortOrder: item.sortOrder ?? index,
					primaryImage: !!item.primaryImage
				};
				if (item.id) await carApi.updateImage(carId, item.id, payload);
				else await carApi.addImage(carId, payload);
			}
		}
		async function submit() {
			error.value = "";
			try {
				form.value.brandId = await resolveBrandId();
				const payload = Object.fromEntries(carFields.map((field) => [field, form.value[field]]));
				const res = isEdit.value ? await adminApi.updateCar(String(route.params.id), payload) : await adminApi.createCar(payload);
				if (res.data.success === false) {
					error.value = res.data.message;
					return;
				}
				const savedCar = res.data.data || res.data;
				const carId = route.params.id || savedCar.id;
				if (carId) await saveGallery(carId);
				router.push("/admin/products");
			} catch (e) {
				error.value = e.response?.data?.message || e.message || "Lỗi lưu xe";
			}
		}
		return (_ctx, _cache) => {
			const _component_router_link = resolveComponent("router-link");
			return openBlock(), createElementBlock("div", _hoisted_1, [createBaseVNode("div", _hoisted_2, [createBaseVNode("h2", _hoisted_3, toDisplayString(isEdit.value ? "Sửa xe" : "Thêm xe mới"), 1), createBaseVNode("form", {
				class: "vstack gap-3",
				onSubmit: withModifiers(submit, ["prevent"])
			}, [
				createBaseVNode("div", _hoisted_4, [
					createBaseVNode("div", _hoisted_5, [_cache[29] || (_cache[29] = createBaseVNode("label", { class: "form-label" }, "Tên xe", -1)), withDirectives(createBaseVNode("input", {
						"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => form.value.name = $event),
						class: "form-control",
						required: ""
					}, null, 512), [[vModelText, form.value.name]])]),
					createBaseVNode("div", _hoisted_6, [_cache[30] || (_cache[30] = createBaseVNode("label", { class: "form-label" }, "Giá (VNĐ)", -1)), withDirectives(createBaseVNode("input", {
						"onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => form.value.price = $event),
						type: "number",
						class: "form-control",
						required: ""
					}, null, 512), [[
						vModelText,
						form.value.price,
						void 0,
						{ number: true }
					]])]),
					createBaseVNode("div", _hoisted_7, [
						_cache[33] || (_cache[33] = createBaseVNode("label", { class: "form-label" }, "Thương hiệu", -1)),
						withDirectives(createBaseVNode("select", {
							"onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => brandSelection.value = $event),
							class: "form-select",
							required: ""
						}, [
							_cache[31] || (_cache[31] = createBaseVNode("option", {
								value: "",
								disabled: ""
							}, "Chọn thương hiệu", -1)),
							(openBlock(true), createElementBlock(Fragment, null, renderList(brands.value, (brand) => {
								return openBlock(), createElementBlock("option", {
									key: brand.id,
									value: String(brand.id)
								}, toDisplayString(brand.name), 9, _hoisted_8);
							}), 128)),
							_cache[32] || (_cache[32] = createBaseVNode("option", { value: "__new__" }, "+ Thêm thương hiệu mới", -1))
						], 512), [[vModelSelect, brandSelection.value]]),
						brandSelection.value === "__new__" ? withDirectives((openBlock(), createElementBlock("input", {
							key: 0,
							"onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => newBrandName.value = $event),
							class: "form-control mt-2",
							maxlength: "100",
							placeholder: "Tên thương hiệu mới, ví dụ Lamborghini",
							required: ""
						}, null, 512)), [[
							vModelText,
							newBrandName.value,
							void 0,
							{ trim: true }
						]]) : createCommentVNode("", true)
					]),
					createBaseVNode("div", _hoisted_9, [_cache[34] || (_cache[34] = createBaseVNode("label", { class: "form-label" }, "Năm", -1)), withDirectives(createBaseVNode("input", {
						"onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => form.value.year = $event),
						type: "number",
						class: "form-control"
					}, null, 512), [[
						vModelText,
						form.value.year,
						void 0,
						{ number: true }
					]])]),
					createBaseVNode("div", _hoisted_10, [_cache[35] || (_cache[35] = createBaseVNode("label", { class: "form-label" }, "Màu", -1)), withDirectives(createBaseVNode("input", {
						"onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => form.value.color = $event),
						class: "form-control"
					}, null, 512), [[vModelText, form.value.color]])]),
					createBaseVNode("div", _hoisted_11, [_cache[36] || (_cache[36] = createBaseVNode("label", { class: "form-label" }, "Tồn kho", -1)), withDirectives(createBaseVNode("input", {
						"onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => form.value.stock = $event),
						type: "number",
						class: "form-control",
						min: "0"
					}, null, 512), [[
						vModelText,
						form.value.stock,
						void 0,
						{ number: true }
					]])]),
					createBaseVNode("div", _hoisted_12, [_cache[37] || (_cache[37] = createBaseVNode("label", { class: "form-label" }, "Đăng ký lần đầu", -1)), withDirectives(createBaseVNode("input", {
						"onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => form.value.firstRegistration = $event),
						class: "form-control",
						placeholder: "Tháng 11 Năm 2023"
					}, null, 512), [[vModelText, form.value.firstRegistration]])]),
					createBaseVNode("div", _hoisted_13, [_cache[38] || (_cache[38] = createBaseVNode("label", { class: "form-label" }, "Số km đã đi", -1)), withDirectives(createBaseVNode("input", {
						"onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => form.value.mileage = $event),
						type: "number",
						min: "0",
						class: "form-control"
					}, null, 512), [[
						vModelText,
						form.value.mileage,
						void 0,
						{ number: true }
					]])]),
					createBaseVNode("div", _hoisted_14, [_cache[39] || (_cache[39] = createBaseVNode("label", { class: "form-label" }, "Loại động cơ", -1)), withDirectives(createBaseVNode("input", {
						"onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => form.value.engineType = $event),
						class: "form-control",
						placeholder: "Xăng"
					}, null, 512), [[vModelText, form.value.engineType]])]),
					createBaseVNode("div", _hoisted_15, [_cache[40] || (_cache[40] = createBaseVNode("label", { class: "form-label" }, "Dung tích động cơ", -1)), withDirectives(createBaseVNode("input", {
						"onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => form.value.engineCapacity = $event),
						class: "form-control",
						placeholder: "1.5L Turbo"
					}, null, 512), [[vModelText, form.value.engineCapacity]])]),
					createBaseVNode("div", _hoisted_16, [_cache[41] || (_cache[41] = createBaseVNode("label", { class: "form-label" }, "Màu nội thất", -1)), withDirectives(createBaseVNode("input", {
						"onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => form.value.interiorColor = $event),
						class: "form-control",
						placeholder: "Đen"
					}, null, 512), [[vModelText, form.value.interiorColor]])]),
					createBaseVNode("div", _hoisted_17, [_cache[42] || (_cache[42] = createBaseVNode("label", { class: "form-label" }, "Loại xe", -1)), withDirectives(createBaseVNode("input", {
						"onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => form.value.bodyType = $event),
						class: "form-control",
						placeholder: "SUV"
					}, null, 512), [[vModelText, form.value.bodyType]])]),
					createBaseVNode("div", _hoisted_18, [_cache[43] || (_cache[43] = createBaseVNode("label", { class: "form-label" }, "Số chỗ ngồi", -1)), withDirectives(createBaseVNode("input", {
						"onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => form.value.seats = $event),
						type: "number",
						min: "1",
						class: "form-control"
					}, null, 512), [[
						vModelText,
						form.value.seats,
						void 0,
						{ number: true }
					]])]),
					createBaseVNode("div", _hoisted_19, [_cache[44] || (_cache[44] = createBaseVNode("label", { class: "form-label" }, "Hệ dẫn động", -1)), withDirectives(createBaseVNode("input", {
						"onUpdate:modelValue": _cache[14] || (_cache[14] = ($event) => form.value.drivetrain = $event),
						class: "form-control",
						placeholder: "FWD"
					}, null, 512), [[vModelText, form.value.drivetrain]])]),
					createBaseVNode("div", _hoisted_20, [_cache[45] || (_cache[45] = createBaseVNode("label", { class: "form-label" }, "Hộp số", -1)), withDirectives(createBaseVNode("input", {
						"onUpdate:modelValue": _cache[15] || (_cache[15] = ($event) => form.value.transmission = $event),
						class: "form-control",
						placeholder: "CVT"
					}, null, 512), [[vModelText, form.value.transmission]])]),
					createBaseVNode("div", _hoisted_21, [_cache[46] || (_cache[46] = createBaseVNode("label", { class: "form-label" }, "Công suất (HP)", -1)), withDirectives(createBaseVNode("input", {
						"onUpdate:modelValue": _cache[16] || (_cache[16] = ($event) => form.value.horsepower = $event),
						type: "number",
						min: "0",
						class: "form-control"
					}, null, 512), [[
						vModelText,
						form.value.horsepower,
						void 0,
						{ number: true }
					]])]),
					createBaseVNode("div", _hoisted_22, [_cache[47] || (_cache[47] = createBaseVNode("label", { class: "form-label" }, "Mô-men xoắn", -1)), withDirectives(createBaseVNode("input", {
						"onUpdate:modelValue": _cache[17] || (_cache[17] = ($event) => form.value.torque = $event),
						class: "form-control",
						placeholder: "240 Nm"
					}, null, 512), [[vModelText, form.value.torque]])]),
					createBaseVNode("div", _hoisted_23, [_cache[48] || (_cache[48] = createBaseVNode("label", { class: "form-label" }, "Nhiên liệu", -1)), withDirectives(createBaseVNode("input", {
						"onUpdate:modelValue": _cache[18] || (_cache[18] = ($event) => form.value.fuelType = $event),
						class: "form-control",
						placeholder: "Xăng"
					}, null, 512), [[vModelText, form.value.fuelType]])]),
					createBaseVNode("div", _hoisted_24, [_cache[49] || (_cache[49] = createBaseVNode("label", { class: "form-label" }, "Tiêu hao nhiên liệu", -1)), withDirectives(createBaseVNode("input", {
						"onUpdate:modelValue": _cache[19] || (_cache[19] = ($event) => form.value.fuelConsumption = $event),
						class: "form-control",
						placeholder: "6.8 L/100km"
					}, null, 512), [[vModelText, form.value.fuelConsumption]])]),
					createBaseVNode("div", _hoisted_25, [_cache[50] || (_cache[50] = createBaseVNode("label", { class: "form-label" }, "Bảo hành", -1)), withDirectives(createBaseVNode("input", {
						"onUpdate:modelValue": _cache[20] || (_cache[20] = ($event) => form.value.warranty = $event),
						class: "form-control",
						placeholder: "12 tháng hoặc 20.000 km"
					}, null, 512), [[vModelText, form.value.warranty]])]),
					createBaseVNode("div", _hoisted_26, [_cache[51] || (_cache[51] = createBaseVNode("label", { class: "form-label" }, "Mức kiểm định", -1)), withDirectives(createBaseVNode("input", {
						"onUpdate:modelValue": _cache[21] || (_cache[21] = ($event) => form.value.inspectionLevel = $event),
						class: "form-control",
						placeholder: "CarStore Certified"
					}, null, 512), [[vModelText, form.value.inspectionLevel]])]),
					createBaseVNode("div", _hoisted_27, [_cache[52] || (_cache[52] = createBaseVNode("label", { class: "form-label" }, "Tên đại lý", -1)), withDirectives(createBaseVNode("input", {
						"onUpdate:modelValue": _cache[22] || (_cache[22] = ($event) => form.value.dealerName = $event),
						class: "form-control"
					}, null, 512), [[vModelText, form.value.dealerName]])]),
					createBaseVNode("div", _hoisted_28, [_cache[53] || (_cache[53] = createBaseVNode("label", { class: "form-label" }, "Địa chỉ đại lý", -1)), withDirectives(createBaseVNode("input", {
						"onUpdate:modelValue": _cache[23] || (_cache[23] = ($event) => form.value.dealerAddress = $event),
						class: "form-control"
					}, null, 512), [[vModelText, form.value.dealerAddress]])]),
					createBaseVNode("div", _hoisted_29, [_cache[54] || (_cache[54] = createBaseVNode("label", { class: "form-label" }, "Ghi chú kiểm định", -1)), withDirectives(createBaseVNode("textarea", {
						"onUpdate:modelValue": _cache[24] || (_cache[24] = ($event) => form.value.inspectionNote = $event),
						class: "form-control",
						rows: "2"
					}, null, 512), [[vModelText, form.value.inspectionNote]])]),
					createBaseVNode("div", _hoisted_30, [_cache[55] || (_cache[55] = createBaseVNode("label", { class: "form-label" }, "Trang bị an toàn", -1)), withDirectives(createBaseVNode("textarea", {
						"onUpdate:modelValue": _cache[25] || (_cache[25] = ($event) => form.value.safetyFeatures = $event),
						class: "form-control",
						rows: "3",
						placeholder: "ABS, cân bằng điện tử, camera lùi"
					}, null, 512), [[vModelText, form.value.safetyFeatures]])]),
					createBaseVNode("div", _hoisted_31, [_cache[56] || (_cache[56] = createBaseVNode("label", { class: "form-label" }, "Tiện nghi", -1)), withDirectives(createBaseVNode("textarea", {
						"onUpdate:modelValue": _cache[26] || (_cache[26] = ($event) => form.value.comfortFeatures = $event),
						class: "form-control",
						rows: "3",
						placeholder: "Điều hòa, màn hình, Apple CarPlay"
					}, null, 512), [[vModelText, form.value.comfortFeatures]])]),
					createBaseVNode("div", _hoisted_32, [_cache[57] || (_cache[57] = createBaseVNode("label", { class: "form-label" }, "Ảnh", -1)), createBaseVNode("div", _hoisted_33, [withDirectives(createBaseVNode("input", {
						"onUpdate:modelValue": _cache[27] || (_cache[27] = ($event) => form.value.image = $event),
						class: "form-control",
						placeholder: "tên file ảnh"
					}, null, 512), [[vModelText, form.value.image]]), createBaseVNode("input", {
						type: "file",
						accept: "image/*",
						onChange: onFileChange,
						class: "form-control"
					}, null, 32)])]),
					createBaseVNode("div", _hoisted_34, [
						_cache[59] || (_cache[59] = createBaseVNode("label", { class: "form-label fw-bold" }, "Thư viện ảnh của xe", -1)),
						createBaseVNode("div", _hoisted_35, [createBaseVNode("input", {
							type: "file",
							multiple: "",
							accept: "image/*",
							class: "form-control",
							onChange: onGalleryFiles
						}, null, 32)]),
						galleryImages.value.length ? (openBlock(), createElementBlock("div", _hoisted_36, [(openBlock(true), createElementBlock(Fragment, null, renderList(galleryImages.value, (item, index) => {
							return openBlock(), createElementBlock("div", {
								key: item.id || item.imageUrl,
								class: "col-md-3"
							}, [createBaseVNode("div", _hoisted_37, [
								createBaseVNode("img", {
									src: unref(carImageUrl)(item.imageUrl),
									class: "w-100 rounded mb-2",
									style: {
										"height": "120px",
										"object-fit": "cover"
									}
								}, null, 8, _hoisted_38),
								createBaseVNode("div", _hoisted_39, [withDirectives(createBaseVNode("input", {
									"onUpdate:modelValue": ($event) => item.sortOrder = $event,
									type: "number",
									min: "0",
									class: "form-control form-control-sm",
									title: "Thứ tự"
								}, null, 8, _hoisted_40), [[
									vModelText,
									item.sortOrder,
									void 0,
									{ number: true }
								]]), createBaseVNode("label", _hoisted_41, [createBaseVNode("input", {
									type: "radio",
									name: "primary-gallery-image",
									checked: item.primaryImage,
									onChange: ($event) => selectPrimary(index)
								}, null, 40, _hoisted_42), _cache[58] || (_cache[58] = createTextVNode(" Ảnh chính ", -1))])]),
								createBaseVNode("button", {
									type: "button",
									class: "btn btn-sm btn-outline-danger w-100",
									onClick: ($event) => removeGalleryImage(item, index)
								}, "Xóa ảnh", 8, _hoisted_43)
							])]);
						}), 128))])) : createCommentVNode("", true),
						_cache[60] || (_cache[60] = createBaseVNode("small", { class: "text-muted" }, "Lưu xe trước, sau đó có thể tải nhiều ảnh. Ảnh được lưu trong bảng CarImage.", -1))
					]),
					createBaseVNode("div", _hoisted_44, [_cache[61] || (_cache[61] = createBaseVNode("label", { class: "form-label" }, "Mô tả", -1)), withDirectives(createBaseVNode("textarea", {
						"onUpdate:modelValue": _cache[28] || (_cache[28] = ($event) => form.value.description = $event),
						class: "form-control",
						rows: "4"
					}, null, 512), [[vModelText, form.value.description]])])
				]),
				error.value ? (openBlock(), createElementBlock("div", _hoisted_45, toDisplayString(error.value), 1)) : createCommentVNode("", true),
				createBaseVNode("div", _hoisted_46, [_cache[63] || (_cache[63] = createBaseVNode("button", {
					type: "submit",
					class: "btn cs-btn cs-btn-primary"
				}, "Lưu", -1)), createVNode(_component_router_link, {
					class: "btn cs-btn cs-btn-ghost",
					to: "/admin/products"
				}, {
					default: withCtx(() => [..._cache[62] || (_cache[62] = [createTextVNode("Hủy", -1)])]),
					_: 1
				})])
			], 32)])]);
		};
	}
};
//#endregion
export { _sfc_main as default };
