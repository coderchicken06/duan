import { A as createStaticVNode, D as createCommentVNode, Dt as toDisplayString, O as createElementBlock, T as createBaseVNode, Tt as normalizeClass, V as openBlock, g as supportApi, j as createTextVNode, ot as unref, q as withDirectives, tt as ref } from "./api-lWF_eiJ8.js";
import { d as vModelText, n as useAuthStore, p as withModifiers, t as _plugin_vue_export_helper_default, u as vModelSelect } from "./index-LltwIOcO.js";
import { t as notifyDataUpdated } from "./useAutoRefresh-DbvPryYR.js";
import { n as normalizeVietnamesePhone, t as isValidVietnamesePhone } from "./phone-DOTtN8t5.js";
//#region src/views/SupportView.vue
var _hoisted_1 = { class: "support-page" };
var _hoisted_2 = { class: "container cs-container py-5" };
var _hoisted_3 = { class: "support-layout" };
var _hoisted_4 = { class: "cs-card support-form-card" };
var _hoisted_5 = { class: "field" };
var _hoisted_6 = { class: "field" };
var _hoisted_7 = { class: "field" };
var _hoisted_8 = { class: "field" };
var _hoisted_9 = { class: "field field-full" };
var _hoisted_10 = { class: "content-label" };
var _hoisted_11 = { class: "form-actions field-full" };
var _hoisted_12 = ["disabled"];
var SupportView_default = /*#__PURE__*/ _plugin_vue_export_helper_default({
	__name: "SupportView",
	setup(__props) {
		const form = ref({
			name: "",
			phone: "",
			type: "consulting",
			carInfo: "",
			content: ""
		});
		const auth = useAuthStore();
		const msg = ref("");
		const ok = ref(false);
		const submitting = ref(false);
		function validateForm() {
			if (!form.value.name || !form.value.phone || !form.value.type || !form.value.content) return "Vui lòng điền đầy đủ các trường bắt buộc.";
			if (!isValidVietnamesePhone(form.value.phone)) return "Số điện thoại phải có 9 chữ số, 10 chữ số bắt đầu bằng 0, hoặc bắt đầu bằng +84/84.";
			return "";
		}
		async function submit() {
			if (auth.isAdmin) {
				ok.value = false;
				msg.value = "Tài khoản quản trị không thể gửi yêu cầu hỗ trợ.";
				return;
			}
			msg.value = validateForm();
			ok.value = false;
			if (msg.value) return;
			submitting.value = true;
			try {
				const { data } = await supportApi.create({
					...form.value,
					phone: normalizeVietnamesePhone(form.value.phone)
				});
				ok.value = data.success;
				msg.value = data.message || (data.success ? "Gửi yêu cầu thành công" : "Không thể gửi yêu cầu");
				if (data.success) {
					form.value.carInfo = "";
					form.value.content = "";
					notifyDataUpdated();
				}
			} catch (error) {
				ok.value = false;
				msg.value = error.response?.data?.message || "Không thể kết nối máy chủ. Vui lòng thử lại.";
			} finally {
				submitting.value = false;
			}
		}
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("main", _hoisted_1, [_cache[14] || (_cache[14] = createBaseVNode("header", { class: "ford-hero-panel compact content-only support-heading" }, [createBaseVNode("div", { class: "ford-hero-panel-content" }, [
				createBaseVNode("span", { class: "support-eyebrow" }, "TRUNG TÂM HỖ TRỢ"),
				createBaseVNode("h1", null, "CarStore sẵn sàng tiếp nhận yêu cầu"),
				createBaseVNode("p", null, "Gửi thông tin ngắn gọn, nhân viên phụ trách sẽ kiểm tra và liên hệ lại với bạn.")
			])], -1)), createBaseVNode("div", _hoisted_2, [createBaseVNode("section", _hoisted_3, [_cache[13] || (_cache[13] = createStaticVNode("<aside class=\"support-info\" data-v-ca6f5593><article class=\"support-info-item\" data-v-ca6f5593><span data-v-ca6f5593>01</span><div data-v-ca6f5593><h2 data-v-ca6f5593>Tư vấn mua xe</h2><p data-v-ca6f5593>Giải đáp thông tin sản phẩm và lựa chọn xe phù hợp.</p></div></article><article class=\"support-info-item\" data-v-ca6f5593><span data-v-ca6f5593>02</span><div data-v-ca6f5593><h2 data-v-ca6f5593>Bảo hành</h2><p data-v-ca6f5593>Tiếp nhận yêu cầu kiểm tra bảo hành hoặc phản hồi dịch vụ.</p></div></article><article class=\"support-info-item\" data-v-ca6f5593><span data-v-ca6f5593>03</span><div data-v-ca6f5593><h2 data-v-ca6f5593>Yêu cầu chung</h2><p data-v-ca6f5593>Gửi câu hỏi khác liên quan đến sản phẩm và tài khoản.</p></div></article><div class=\"support-contact\" data-v-ca6f5593><strong data-v-ca6f5593>Cần hỗ trợ?</strong><span data-v-ca6f5593>Hotline: 1900 9999</span><span data-v-ca6f5593>Email: support@carstore.vn</span></div></aside>", 1)), createBaseVNode("div", _hoisted_4, [_cache[12] || (_cache[12] = createBaseVNode("div", { class: "form-heading" }, [createBaseVNode("h2", null, "Gửi yêu cầu hỗ trợ"), createBaseVNode("p", null, [
				createTextVNode("Các trường có dấu "),
				createBaseVNode("strong", null, "*"),
				createTextVNode(" là bắt buộc.")
			])], -1)), createBaseVNode("form", {
				class: "support-form",
				novalidate: "",
				onSubmit: withModifiers(submit, ["prevent"])
			}, [
				createBaseVNode("div", _hoisted_5, [_cache[5] || (_cache[5] = createBaseVNode("label", { for: "support-name" }, "Họ tên *", -1)), withDirectives(createBaseVNode("input", {
					id: "support-name",
					"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => form.value.name = $event),
					class: "form-control",
					maxlength: "255",
					autocomplete: "name"
				}, null, 512), [[
					vModelText,
					form.value.name,
					void 0,
					{ trim: true }
				]])]),
				createBaseVNode("div", _hoisted_6, [_cache[6] || (_cache[6] = createBaseVNode("label", { for: "support-phone" }, "Số điện thoại *", -1)), withDirectives(createBaseVNode("input", {
					id: "support-phone",
					"onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => form.value.phone = $event),
					class: "form-control",
					inputmode: "tel",
					maxlength: "12",
					autocomplete: "tel",
					placeholder: "+84xxxxxxxxx"
				}, null, 512), [[
					vModelText,
					form.value.phone,
					void 0,
					{ trim: true }
				]])]),
				createBaseVNode("div", _hoisted_7, [_cache[8] || (_cache[8] = createBaseVNode("label", { for: "support-type" }, "Loại yêu cầu *", -1)), withDirectives(createBaseVNode("select", {
					id: "support-type",
					"onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => form.value.type = $event),
					class: "form-select"
				}, [..._cache[7] || (_cache[7] = [
					createBaseVNode("option", { value: "consulting" }, "Tư vấn mua xe", -1),
					createBaseVNode("option", { value: "warranty" }, "Bảo hành / phản hồi", -1),
					createBaseVNode("option", { value: "chat" }, "Yêu cầu chung", -1)
				])], 512), [[vModelSelect, form.value.type]])]),
				createBaseVNode("div", _hoisted_8, [_cache[9] || (_cache[9] = createBaseVNode("label", { for: "support-car" }, "Thông tin xe", -1)), withDirectives(createBaseVNode("input", {
					id: "support-car",
					"onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => form.value.carInfo = $event),
					class: "form-control",
					maxlength: "255",
					placeholder: "Tên xe hoặc biển số nếu có"
				}, null, 512), [[
					vModelText,
					form.value.carInfo,
					void 0,
					{ trim: true }
				]])]),
				createBaseVNode("div", _hoisted_9, [createBaseVNode("div", _hoisted_10, [_cache[10] || (_cache[10] = createBaseVNode("label", { for: "support-content" }, "Nội dung *", -1)), createBaseVNode("span", null, toDisplayString(form.value.content.length) + "/1000", 1)]), withDirectives(createBaseVNode("textarea", {
					id: "support-content",
					"onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => form.value.content = $event),
					class: "form-control",
					rows: "5",
					maxlength: "1000",
					placeholder: "Mô tả yêu cầu bạn cần CarStore hỗ trợ"
				}, null, 512), [[
					vModelText,
					form.value.content,
					void 0,
					{ trim: true }
				]])]),
				msg.value ? (openBlock(), createElementBlock("div", {
					key: 0,
					class: normalizeClass(["alert cart-alert show", [ok.value ? "alert-success" : "alert-danger", { error: !ok.value }]]),
					role: "alert"
				}, toDisplayString(msg.value), 3)) : createCommentVNode("", true),
				createBaseVNode("div", _hoisted_11, [_cache[11] || (_cache[11] = createBaseVNode("p", null, "Yêu cầu sẽ được lưu trong lịch sử hỗ trợ của tài khoản.", -1)), createBaseVNode("button", {
					class: "btn cs-btn cs-btn-primary",
					type: "submit",
					disabled: submitting.value || unref(auth).isAdmin
				}, toDisplayString(submitting.value ? "Đang gửi..." : "Gửi yêu cầu"), 9, _hoisted_12)])
			], 32)])])])]);
		};
	}
}, [["__scopeId", "data-v-ca6f5593"]]);
//#endregion
export { SupportView_default as default };
