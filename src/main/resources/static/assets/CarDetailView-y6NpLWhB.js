import { D as createCommentVNode, Dt as toDisplayString, E as createBlock, G as watch, K as withCtx, M as createVNode, O as createElementBlock, S as Fragment, T as createBaseVNode, Tt as normalizeClass, U as renderList, V as openBlock, W as resolveComponent, a as carImageUrl, c as formatPrice, h as reviewApi, i as carApi, j as createTextVNode, m as quotationApi, o as cartApi, ot as unref, p as promotionApi, tt as ref, v as useDefaultCarImage, w as computed, z as onMounted } from "./api-Cd2rmWmR.js";
import { a as useRoute, n as _plugin_vue_export_helper_default, o as useRouter, r as useCartStore, t as useCompare } from "./index-DOyj8jjE.js";
import { t as showCartToast } from "./useCartToast-CRv33ZAZ.js";
import { t as CarCard_default } from "./CarCard-BMs2B_57.js";
import { t as useAutoRefresh } from "./useAutoRefresh-DjAfN_Vr.js";
//#region src/views/CarDetailView.vue
var _hoisted_1 = {
	key: 0,
	class: "detail-page"
};
var _hoisted_2 = { class: "container detail-container py-4" };
var _hoisted_3 = { class: "detail-hero" };
var _hoisted_4 = { class: "gallery-card" };
var _hoisted_5 = { class: "main-image-wrap" };
var _hoisted_6 = ["src", "alt"];
var _hoisted_7 = {
	key: 0,
	class: "thumbnail-row"
};
var _hoisted_8 = ["aria-label", "onClick"];
var _hoisted_9 = ["src", "alt"];
var _hoisted_10 = { class: "summary-card" };
var _hoisted_11 = { class: "summary-meta" };
var _hoisted_12 = { key: 0 };
var _hoisted_13 = { key: 1 };
var _hoisted_14 = { key: 2 };
var _hoisted_15 = { class: "price" };
var _hoisted_16 = {
	key: 0,
	class: "quick-specs"
};
var _hoisted_17 = { class: "action-grid" };
var _hoisted_18 = ["disabled"];
var _hoisted_19 = {
	key: 2,
	class: "dealer-box"
};
var _hoisted_20 = { key: 0 };
var _hoisted_21 = { key: 1 };
var _hoisted_22 = { key: 2 };
var _hoisted_23 = {
	key: 0,
	class: "detail-section"
};
var _hoisted_24 = {
	key: 0,
	class: "description"
};
var _hoisted_25 = {
	key: 1,
	class: "spec-grid"
};
var _hoisted_26 = {
	key: 1,
	class: "detail-section two-columns"
};
var _hoisted_27 = {
	key: 0,
	class: "feature-card"
};
var _hoisted_28 = {
	key: 1,
	class: "feature-card"
};
var _hoisted_29 = {
	key: 2,
	class: "detail-section inspection"
};
var _hoisted_30 = { key: 0 };
var _hoisted_31 = { key: 1 };
var _hoisted_32 = {
	key: 3,
	class: "detail-section"
};
var _hoisted_33 = { class: "similar-cars-row" };
var _hoisted_34 = { class: "detail-section review-section" };
var _hoisted_35 = { class: "review-summary" };
var _hoisted_36 = {
	key: 0,
	class: "review-list"
};
var _hoisted_37 = { class: "review-avatar" };
var _hoisted_38 = { class: "review-content" };
var _hoisted_39 = { class: "review-stars" };
var _hoisted_40 = {
	key: 1,
	class: "ford-empty-state"
};
var _hoisted_41 = {
	key: 1,
	class: "container py-5 text-center"
};
var _hoisted_42 = {
	key: 0,
	class: "alert alert-danger"
};
var _hoisted_43 = { key: 1 };
var CarDetailView_default = /*#__PURE__*/ _plugin_vue_export_helper_default({
	__name: "CarDetailView",
	setup(__props) {
		const route = useRoute();
		const router = useRouter();
		const cart = useCartStore();
		const car = ref(null);
		const reviews = ref([]);
		const reviewAverage = ref(0);
		const similarCars = ref([]);
		const message = ref("");
		const success = ref(false);
		const selectedImage = ref("");
		const serverImages = ref([]);
		const loadError = ref("");
		const promotion = ref(null);
		const addingToCart = ref(false);
		let loadVersion = 0;
		const { has, toggle, count } = useCompare();
		const displayPrice = computed(() => {
			const price = Number(car.value?.price || 0);
			if (!promotion.value) return price;
			const discount = promotion.value.type === "PERCENT" ? price * Number(promotion.value.value || 0) / 100 : Number(promotion.value.value || 0);
			return Math.max(0, price - discount);
		});
		const hasData = (value) => value !== null && value !== void 0 && (typeof value !== "string" || value.trim() !== "");
		const km = (value) => `${Number(value).toLocaleString("vi-VN")} km`;
		const splitFeatures = (text) => hasData(text) ? text.split(/[,;\n]/).map((value) => value.trim()).filter(Boolean) : [];
		const quickSpecs = computed(() => [
			{
				label: "Động cơ",
				value: car.value?.engineCapacity
			},
			{
				label: "Hộp số",
				value: car.value?.transmission
			},
			{
				label: "Dẫn động",
				value: car.value?.drivetrain
			},
			{
				label: "Nhiên liệu",
				value: car.value?.fuelType || car.value?.engineType
			}
		].filter((item) => hasData(item.value)));
		const safetyFeatures = computed(() => splitFeatures(car.value?.safetyFeatures));
		const comfortFeatures = computed(() => splitFeatures(car.value?.comfortFeatures));
		const hasInspectionInfo = computed(() => hasData(car.value?.inspectionLevel) || hasData(car.value?.inspectionNote));
		const hasDealerInfo = computed(() => hasData(car.value?.dealerName) || hasData(car.value?.dealerAddress) || hasData(car.value?.warranty));
		const galleryImages = computed(() => {
			if (!car.value) return [];
			const apiImages = serverImages.value.map((item) => item.imageUrl);
			const candidates = [car.value.image, ...apiImages];
			return [...new Set(candidates.filter(Boolean).map((image) => carImageUrl(image)))];
		});
		const currentImageIndex = computed(() => Math.max(0, galleryImages.value.indexOf(selectedImage.value)));
		function previousImage() {
			if (!galleryImages.value.length) return;
			const index = (currentImageIndex.value - 1 + galleryImages.value.length) % galleryImages.value.length;
			selectedImage.value = galleryImages.value[index];
		}
		function nextImage() {
			if (!galleryImages.value.length) return;
			const index = (currentImageIndex.value + 1) % galleryImages.value.length;
			selectedImage.value = galleryImages.value[index];
		}
		const detailRows = computed(() => [
			{
				label: "Đăng ký lần đầu",
				raw: car.value?.firstRegistration
			},
			{
				label: "Số km đã đi",
				raw: car.value?.mileage,
				format: km
			},
			{
				label: "Loại nhiên liệu",
				raw: car.value?.fuelType || car.value?.engineType
			},
			{
				label: "Dung tích động cơ",
				raw: car.value?.engineCapacity
			},
			{
				label: "Công suất",
				raw: car.value?.horsepower,
				format: (value) => `${value} HP`
			},
			{
				label: "Mô-men xoắn",
				raw: car.value?.torque
			},
			{
				label: "Tiêu hao nhiên liệu",
				raw: car.value?.fuelConsumption
			},
			{
				label: "Hộp số",
				raw: car.value?.transmission
			},
			{
				label: "Hệ dẫn động",
				raw: car.value?.drivetrain
			},
			{
				label: "Loại xe",
				raw: car.value?.bodyType
			},
			{
				label: "Số chỗ ngồi",
				raw: car.value?.seats
			},
			{
				label: "Màu ngoại thất",
				raw: car.value?.color
			},
			{
				label: "Màu nội thất",
				raw: car.value?.interiorColor
			},
			{
				label: "Năm sản xuất",
				raw: car.value?.year
			},
			{
				label: "Tồn kho",
				raw: car.value?.stock
			},
			{
				label: "Bảo hành",
				raw: car.value?.warranty
			}
		].filter((item) => hasData(item.raw)).map((item) => ({
			label: item.label,
			value: item.format ? item.format(item.raw) : item.raw
		})));
		async function loadData(silent = false) {
			const currentVersion = ++loadVersion;
			const carId = String(route.params.id);
			if (!silent) {
				car.value = null;
				reviews.value = [];
				reviewAverage.value = 0;
				serverImages.value = [];
				selectedImage.value = "";
				message.value = "";
				loadError.value = "";
				promotion.value = null;
			}
			try {
				const detailResponse = await carApi.getById(carId);
				if (currentVersion !== loadVersion) return;
				if (!detailResponse.data?.success || !detailResponse.data?.data) throw new Error(detailResponse.data?.message || "Không tìm thấy xe");
				car.value = detailResponse.data.data;
				const [similarResult, imagesResult, reviewsResult, promotionResult] = await Promise.allSettled([
					carApi.getSimilar(carId),
					carApi.getImages(carId),
					reviewApi.getByCar(carId),
					promotionApi.getForCar(carId)
				]);
				if (currentVersion !== loadVersion) return;
				if (similarResult.status === "fulfilled") {
					const data = similarResult.value.data;
					similarCars.value = Array.isArray(data) ? data : data.data || [];
				} else {
					similarCars.value = [];
					console.error("Không thể tải xe tương tự:", similarResult.reason);
				}
				if (imagesResult.status === "fulfilled") {
					const data = imagesResult.value.data;
					serverImages.value = Array.isArray(data) ? data : data.data || [];
				} else {
					serverImages.value = [];
					console.error("Không thể tải thư viện ảnh, dùng ảnh chính của xe:", imagesResult.reason);
				}
				if (reviewsResult.status === "fulfilled") {
					const data = reviewsResult.value.data;
					reviews.value = data.data || [];
					reviewAverage.value = Number(data.average || 0);
				} else {
					reviews.value = [];
					reviewAverage.value = 0;
				}
				if (promotionResult.status === "fulfilled") {
					const data = promotionResult.value.data;
					promotion.value = data.data?.[0] || null;
				} else {
					promotion.value = null;
					console.error("Không thể tải khuyến mãi cho xe:", promotionResult.reason);
				}
				if (!silent || !selectedImage.value) selectedImage.value = galleryImages.value[0] || carImageUrl(car.value?.image);
			} catch (error) {
				if (currentVersion !== loadVersion) return;
				if (!silent) {
					car.value = null;
					loadError.value = error.response?.data?.message || error.message || "Không thể tải thông tin xe";
					success.value = false;
				}
				console.error("Không thể tải thông tin xe:", error);
			}
		}
		onMounted(loadData);
		watch(() => route.params.id, () => loadData());
		useAutoRefresh(() => loadData(true));
		function toggleCurrent() {
			if (!has(car.value.id) && count.value >= 3) {
				showCartToast("Chỉ được so sánh tối đa 3 xe.", "warning");
				return;
			}
			toggle(car.value.id);
		}
		async function addById(id) {
			const target = id === car.value?.id ? car.value : similarCars.value.find((item) => item.id === id);
			if (!target || Number(target.stock || 0) <= 0) {
				message.value = "Xe đã hết hàng, không thể thêm vào giỏ";
				success.value = false;
				return;
			}
			const isCurrentCar = id === car.value?.id;
			if (isCurrentCar) addingToCart.value = true;
			const previousItemCount = cart.itemCount;
			cart.itemCount = previousItemCount + 1;
			success.value = true;
			message.value = "";
			showCartToast("Thêm vào giỏ hàng thành công!");
			try {
				const { data } = await cartApi.add(id);
				if (data.success) cart.refresh();
				else {
					cart.itemCount = previousItemCount;
					success.value = false;
					message.value = data.message || "Không thể thêm vào giỏ hàng";
				}
			} catch (error) {
				cart.itemCount = previousItemCount;
				message.value = error.response?.data?.message || "Không thể thêm vào giỏ hàng";
				success.value = false;
			} finally {
				if (isCurrentCar) addingToCart.value = false;
			}
		}
		const addToCart = () => addById(car.value.id);
		async function requestQuotation() {
			try {
				const { data } = await quotationApi.create({ carId: car.value.id });
				if (data.success) router.push(`/quotations/${data.data.id}`);
			} catch (error) {
				success.value = false;
				message.value = error.response?.data?.message || "Không thể tạo yêu cầu báo giá";
			}
		}
		return (_ctx, _cache) => {
			const _component_router_link = resolveComponent("router-link");
			return car.value ? (openBlock(), createElementBlock("main", _hoisted_1, [createBaseVNode("div", _hoisted_2, [
				createBaseVNode("div", _hoisted_3, [createBaseVNode("section", _hoisted_4, [createBaseVNode("div", _hoisted_5, [
					createBaseVNode("img", {
						class: "main-image",
						src: selectedImage.value,
						alt: car.value.name,
						onError: _cache[0] || (_cache[0] = (...args) => unref(useDefaultCarImage) && unref(useDefaultCarImage)(...args))
					}, null, 40, _hoisted_6),
					galleryImages.value.length > 1 ? (openBlock(), createElementBlock("button", {
						key: 0,
						class: "gallery-arrow gallery-arrow-left",
						type: "button",
						"aria-label": "Ảnh trước",
						onClick: previousImage
					}, "‹")) : createCommentVNode("", true),
					galleryImages.value.length > 1 ? (openBlock(), createElementBlock("button", {
						key: 1,
						class: "gallery-arrow gallery-arrow-right",
						type: "button",
						"aria-label": "Ảnh tiếp theo",
						onClick: nextImage
					}, "›")) : createCommentVNode("", true)
				]), galleryImages.value.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_7, [(openBlock(true), createElementBlock(Fragment, null, renderList(galleryImages.value, (image, index) => {
					return openBlock(), createElementBlock("button", {
						key: `${image}-${index}`,
						type: "button",
						class: normalizeClass(["thumbnail-button", { active: image === selectedImage.value }]),
						"aria-label": `Xem ảnh ${index + 1} của ${car.value.name}`,
						onClick: ($event) => selectedImage.value = image
					}, [createBaseVNode("img", {
						src: image,
						alt: `${car.value.name} - ảnh ${index + 1}`,
						onError: _cache[1] || (_cache[1] = (...args) => unref(useDefaultCarImage) && unref(useDefaultCarImage)(...args))
					}, null, 40, _hoisted_9)], 10, _hoisted_8);
				}), 128))])) : createCommentVNode("", true)]), createBaseVNode("section", _hoisted_10, [
					_cache[8] || (_cache[8] = createBaseVNode("span", { class: "eyebrow" }, "CARSTORE SELECT", -1)),
					createBaseVNode("h1", null, toDisplayString(car.value.name), 1),
					createBaseVNode("div", _hoisted_11, [
						hasData(car.value.year) ? (openBlock(), createElementBlock("span", _hoisted_12, toDisplayString(car.value.year), 1)) : createCommentVNode("", true),
						hasData(car.value.mileage) ? (openBlock(), createElementBlock("span", _hoisted_13, toDisplayString(km(car.value.mileage)), 1)) : createCommentVNode("", true),
						hasData(car.value.bodyType) ? (openBlock(), createElementBlock("span", _hoisted_14, toDisplayString(car.value.bodyType), 1)) : createCommentVNode("", true)
					]),
					createBaseVNode("div", _hoisted_15, [createTextVNode(toDisplayString(unref(formatPrice)(displayPrice.value)) + " ", 1), _cache[2] || (_cache[2] = createBaseVNode("small", null, "VNĐ", -1))]),
					quickSpecs.value.length ? (openBlock(), createElementBlock("div", _hoisted_16, [(openBlock(true), createElementBlock(Fragment, null, renderList(quickSpecs.value, (item) => {
						return openBlock(), createElementBlock("div", { key: item.label }, [createBaseVNode("small", null, toDisplayString(item.label), 1), createBaseVNode("strong", null, toDisplayString(item.value), 1)]);
					}), 128))])) : createCommentVNode("", true),
					message.value ? (openBlock(), createElementBlock("div", {
						key: 1,
						class: normalizeClass([
							"alert",
							"cart-alert",
							"show",
							success.value ? "alert-success" : "alert-danger",
							{ error: !success.value }
						])
					}, toDisplayString(message.value), 3)) : createCommentVNode("", true),
					createBaseVNode("div", _hoisted_17, [
						createBaseVNode("button", {
							class: "ford-btn-primary hero-action",
							type: "button",
							disabled: addingToCart.value || Number(car.value.stock || 0) <= 0,
							onClick: addToCart
						}, [_cache[3] || (_cache[3] = createBaseVNode("span", {
							class: "action-icon",
							"aria-hidden": "true"
						}, "🛒", -1)), createBaseVNode("span", null, toDisplayString(addingToCart.value ? "Đang thêm..." : Number(car.value.stock || 0) > 0 ? "Thêm vào giỏ hàng" : "Xe đã hết hàng"), 1)], 8, _hoisted_18),
						createBaseVNode("button", {
							class: "ford-btn-outline hero-action",
							type: "button",
							onClick: toggleCurrent
						}, [_cache[4] || (_cache[4] = createBaseVNode("span", {
							class: "action-icon",
							"aria-hidden": "true"
						}, "⚖", -1)), createBaseVNode("span", null, toDisplayString(unref(has)(car.value.id) ? "Bỏ khỏi so sánh" : "Thêm vào so sánh"), 1)]),
						createVNode(_component_router_link, {
							class: "ford-btn-outline hero-action text-center",
							to: {
								path: "/service",
								query: { carId: car.value.id }
							}
						}, {
							default: withCtx(() => [..._cache[5] || (_cache[5] = [createBaseVNode("span", {
								class: "action-icon",
								"aria-hidden": "true"
							}, "▣", -1), createBaseVNode("span", null, "Đặt lịch xem xe", -1)])]),
							_: 1
						}, 8, ["to"]),
						createBaseVNode("button", {
							class: "ford-btn-outline hero-action",
							type: "button",
							onClick: requestQuotation
						}, [..._cache[6] || (_cache[6] = [createBaseVNode("span", {
							class: "action-icon",
							"aria-hidden": "true"
						}, "₫", -1), createBaseVNode("span", null, "Yêu cầu báo giá", -1)])])
					]),
					hasDealerInfo.value ? (openBlock(), createElementBlock("div", _hoisted_19, [_cache[7] || (_cache[7] = createBaseVNode("span", {
						class: "dealer-icon",
						"aria-hidden": "true"
					}, "⌖", -1)), createBaseVNode("div", null, [
						hasData(car.value.dealerName) ? (openBlock(), createElementBlock("strong", _hoisted_20, toDisplayString(car.value.dealerName), 1)) : createCommentVNode("", true),
						hasData(car.value.dealerAddress) ? (openBlock(), createElementBlock("span", _hoisted_21, toDisplayString(car.value.dealerAddress), 1)) : createCommentVNode("", true),
						hasData(car.value.warranty) ? (openBlock(), createElementBlock("span", _hoisted_22, "Bảo hành: " + toDisplayString(car.value.warranty), 1)) : createCommentVNode("", true)
					])])) : createCommentVNode("", true)
				])]),
				hasData(car.value.description) || detailRows.value.length ? (openBlock(), createElementBlock("section", _hoisted_23, [
					_cache[9] || (_cache[9] = createBaseVNode("div", { class: "section-heading" }, [createBaseVNode("span", null, "THÔNG TIN XE"), createBaseVNode("h2", null, "Thông tin chi tiết")], -1)),
					hasData(car.value.description) ? (openBlock(), createElementBlock("p", _hoisted_24, toDisplayString(car.value.description), 1)) : createCommentVNode("", true),
					detailRows.value.length ? (openBlock(), createElementBlock("div", _hoisted_25, [(openBlock(true), createElementBlock(Fragment, null, renderList(detailRows.value, (item) => {
						return openBlock(), createElementBlock("div", {
							key: item.label,
							class: "spec-item"
						}, [createBaseVNode("span", null, toDisplayString(item.label), 1), createBaseVNode("strong", null, toDisplayString(item.value), 1)]);
					}), 128))])) : createCommentVNode("", true)
				])) : createCommentVNode("", true),
				safetyFeatures.value.length || comfortFeatures.value.length ? (openBlock(), createElementBlock("section", _hoisted_26, [safetyFeatures.value.length ? (openBlock(), createElementBlock("article", _hoisted_27, [_cache[10] || (_cache[10] = createBaseVNode("h3", null, "Trang bị an toàn", -1)), createBaseVNode("ul", null, [(openBlock(true), createElementBlock(Fragment, null, renderList(safetyFeatures.value, (item) => {
					return openBlock(), createElementBlock("li", { key: item }, "✓ " + toDisplayString(item), 1);
				}), 128))])])) : createCommentVNode("", true), comfortFeatures.value.length ? (openBlock(), createElementBlock("article", _hoisted_28, [_cache[11] || (_cache[11] = createBaseVNode("h3", null, "Tiện nghi nổi bật", -1)), createBaseVNode("ul", null, [(openBlock(true), createElementBlock(Fragment, null, renderList(comfortFeatures.value, (item) => {
					return openBlock(), createElementBlock("li", { key: item }, "✓ " + toDisplayString(item), 1);
				}), 128))])])) : createCommentVNode("", true)])) : createCommentVNode("", true),
				hasInspectionInfo.value ? (openBlock(), createElementBlock("section", _hoisted_29, [createBaseVNode("div", null, [
					_cache[12] || (_cache[12] = createBaseVNode("span", { class: "eyebrow" }, "KIỂM ĐỊNH CARSTORE", -1)),
					hasData(car.value.inspectionLevel) ? (openBlock(), createElementBlock("h2", _hoisted_30, toDisplayString(car.value.inspectionLevel), 1)) : createCommentVNode("", true),
					hasData(car.value.inspectionNote) ? (openBlock(), createElementBlock("p", _hoisted_31, toDisplayString(car.value.inspectionNote), 1)) : createCommentVNode("", true)
				])])) : createCommentVNode("", true),
				similarCars.value.length ? (openBlock(), createElementBlock("section", _hoisted_32, [_cache[13] || (_cache[13] = createBaseVNode("div", { class: "section-heading" }, [createBaseVNode("span", null, "ĐỀ XUẤT"), createBaseVNode("h2", null, "Xe tương tự")], -1)), createBaseVNode("div", _hoisted_33, [(openBlock(true), createElementBlock(Fragment, null, renderList(similarCars.value, (item) => {
					return openBlock(), createElementBlock("div", {
						key: item.id,
						class: "similar-car-item"
					}, [createVNode(CarCard_default, {
						car: item,
						onAddCart: addById
					}, null, 8, ["car"])]);
				}), 128))])])) : createCommentVNode("", true),
				createBaseVNode("section", _hoisted_34, [
					_cache[14] || (_cache[14] = createBaseVNode("div", { class: "section-heading" }, [createBaseVNode("span", null, "KHÁCH HÀNG"), createBaseVNode("h2", null, "Đánh giá xe")], -1)),
					createBaseVNode("div", _hoisted_35, [createBaseVNode("strong", null, toDisplayString(reviewAverage.value.toFixed(1)) + "/5", 1), createBaseVNode("span", null, toDisplayString(reviews.value.length) + " đánh giá từ khách đã mua", 1)]),
					_cache[15] || (_cache[15] = createBaseVNode("div", {
						class: "alert alert-info mt-3",
						role: "status"
					}, " Đánh giá chỉ dành cho khách hàng đã hoàn tất mua xe. Vui lòng gửi đánh giá tại mục Lịch sử đơn hàng của bạn. ", -1)),
					reviews.value.length ? (openBlock(), createElementBlock("div", _hoisted_36, [(openBlock(true), createElementBlock(Fragment, null, renderList(reviews.value, (review) => {
						return openBlock(), createElementBlock("article", {
							key: review.id,
							class: "review-item"
						}, [createBaseVNode("div", _hoisted_37, toDisplayString(review.username?.charAt(0)?.toUpperCase()), 1), createBaseVNode("div", _hoisted_38, [
							createBaseVNode("strong", null, toDisplayString(review.username), 1),
							createBaseVNode("div", _hoisted_39, toDisplayString("★".repeat(review.rating)) + toDisplayString("☆".repeat(5 - review.rating)), 1),
							createBaseVNode("p", null, toDisplayString(review.comment), 1),
							createBaseVNode("small", null, toDisplayString(new Date(review.reviewDate).toLocaleDateString("vi-VN")), 1)
						])]);
					}), 128))])) : (openBlock(), createElementBlock("p", _hoisted_40, "Xe này chưa có đánh giá."))
				])
			])])) : (openBlock(), createElementBlock("div", _hoisted_41, [loadError.value ? (openBlock(), createElementBlock("div", _hoisted_42, toDisplayString(loadError.value), 1)) : (openBlock(), createElementBlock("p", _hoisted_43, "Đang tải...")), loadError.value ? (openBlock(), createBlock(_component_router_link, {
				key: 2,
				class: "ford-btn-outline text-center",
				to: "/car/list"
			}, {
				default: withCtx(() => [..._cache[16] || (_cache[16] = [createTextVNode("Quay lại danh sách xe", -1)])]),
				_: 1
			})) : createCommentVNode("", true)]));
		};
	}
}, [["__scopeId", "data-v-7838d059"]]);
//#endregion
export { CarDetailView_default as default };
