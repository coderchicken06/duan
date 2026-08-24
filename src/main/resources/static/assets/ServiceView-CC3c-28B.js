import { D as createCommentVNode, Dt as toDisplayString, G as watch, M as createVNode, O as createElementBlock, R as onBeforeUnmount, S as Fragment, T as createBaseVNode, Tt as normalizeClass, U as renderList, V as openBlock, g as supportApi, i as carApi, j as createTextVNode, ot as unref, q as withDirectives, tt as ref, w as computed, z as onMounted } from "./api-Cd2rmWmR.js";
import { a as useRoute, d as vModelText, i as useAuthStore, n as _plugin_vue_export_helper_default, p as withModifiers, u as vModelSelect } from "./index-BX99C7pg.js";
import { t as DatePickerInput_default } from "./DatePickerInput-BzPhYM7P.js";
import { n as normalizeVietnamesePhone, t as isValidVietnamesePhone } from "./phone-DOTtN8t5.js";
//#region src/views/ServiceView.vue
var _hoisted_1 = { class: "service-page" };
var _hoisted_2 = { class: "container cs-container py-5" };
var _hoisted_3 = {
	class: "service-grid",
	"aria-label": "Các dịch vụ"
};
var _hoisted_4 = { class: "service-icon" };
var _hoisted_5 = { class: "cs-card booking-card" };
var _hoisted_6 = { class: "field" };
var _hoisted_7 = { class: "field" };
var _hoisted_8 = { class: "field" };
var _hoisted_9 = { key: 0 };
var _hoisted_10 = { class: "field" };
var _hoisted_11 = { class: "field" };
var _hoisted_12 = { class: "field" };
var _hoisted_13 = ["min", "disabled"];
var _hoisted_14 = { class: "booking-actions" };
var _hoisted_15 = ["disabled"];
var showroomOpenTime = "07:30";
var showroomCloseTime = "18:30";
var ServiceView_default = /*#__PURE__*/ _plugin_vue_export_helper_default({
	__name: "ServiceView",
	setup(__props) {
		const route = useRoute();
		const auth = useAuthStore();
		const toLocalDate = (value) => {
			return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
		};
		const toApiDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(String(value || "")) ? String(value) : "";
		const services = [
			{
				icon: "🔧",
				title: "Bảo dưỡng định kỳ",
				desc: "Kiểm tra và bảo dưỡng xe theo tiêu chuẩn hãng."
			},
			{
				icon: "🛞",
				title: "Lốp và phụ tùng",
				desc: "Kiểm tra lốp, dầu nhớt và phụ tùng cần thay thế."
			},
			{
				icon: "📋",
				title: "Kiểm tra tổng thể",
				desc: "Kiểm tra tình trạng xe trước những hành trình dài."
			}
		];
		const form = ref({
			name: "",
			phone: "",
			type: "service",
			content: "Yêu cầu đặt lịch dịch vụ",
			carInfo: "",
			serviceType: "",
			appointmentDate: "",
			appointmentTime: ""
		});
		const msg = ref("");
		const ok = ref(false);
		const submitting = ref(false);
		const selectedFromCatalog = ref(false);
		const currentTime = ref(/* @__PURE__ */ new Date());
		let clockTimer;
		const today = computed(() => toLocalDate(currentTime.value));
		const tomorrow = computed(() => {
			const date = new Date(currentTime.value);
			date.setDate(date.getDate() + 1);
			return toLocalDate(date);
		});
		function getTodayMinimumTime() {
			const minimum = new Date(currentTime.value.getTime() + 1800 * 1e3);
			if (minimum.getSeconds() || minimum.getMilliseconds()) minimum.setMinutes(minimum.getMinutes() + 1);
			minimum.setSeconds(0, 0);
			const candidate = `${String(minimum.getHours()).padStart(2, "0")}:${String(minimum.getMinutes()).padStart(2, "0")}`;
			return candidate > showroomOpenTime ? candidate : showroomOpenTime;
		}
		const canBookToday = computed(() => getTodayMinimumTime() <= showroomCloseTime);
		const minimumAppointmentDate = computed(() => canBookToday.value ? today.value : tomorrow.value);
		const minimumAppointmentTime = computed(() => {
			if (form.value.appointmentDate !== today.value) return showroomOpenTime;
			return getTodayMinimumTime();
		});
		const appointmentTimeError = computed(() => {
			const { appointmentDate, appointmentTime } = form.value;
			if (!appointmentDate || !appointmentTime) return "";
			if (appointmentTime < showroomOpenTime || appointmentTime > showroomCloseTime) return "Showroom chỉ nhận lịch hẹn từ 07:30 đến 18:30 hàng ngày.";
			if (appointmentDate === today.value && !canBookToday.value) return "Hôm nay đã hết khung giờ nhận lịch, vui lòng chọn từ ngày mai.";
			if (appointmentDate === today.value && appointmentTime < minimumAppointmentTime.value) return "Không thể đặt lịch vào khung giờ đã qua trong ngày.";
			return "";
		});
		onMounted(async () => {
			clockTimer = window.setInterval(() => {
				currentTime.value = /* @__PURE__ */ new Date();
			}, 6e4);
			if (!route.query.carId) return;
			try {
				const { data } = await carApi.getById(String(route.query.carId));
				if (!data.success || !data.data) throw new Error(data.message || "Không tìm thấy xe");
				form.value.carInfo = data.data.name;
				form.value.serviceType = "Kiểm tra tổng thể";
				selectedFromCatalog.value = true;
			} catch (error) {
				ok.value = false;
				msg.value = error.response?.data?.message || error.message || "Không tìm thấy xe cần đặt lịch";
			}
		});
		onBeforeUnmount(() => {
			window.clearInterval(clockTimer);
		});
		watch(() => form.value.appointmentDate, (appointmentDate) => {
			form.value.appointmentTime = "";
			if (!appointmentDate) return;
			if (appointmentDate < minimumAppointmentDate.value) {
				form.value.appointmentDate = tomorrow.value;
				form.value.appointmentTime = "";
				ok.value = false;
				msg.value = "Hôm nay đã hết khung giờ nhận lịch, vui lòng chọn từ ngày mai.";
				return;
			}
		});
		function validateForm() {
			if (!form.value.name || !form.value.phone || !form.value.carInfo || !form.value.serviceType) return "Vui lòng điền đầy đủ các trường bắt buộc.";
			if (!form.value.appointmentDate) return "Vui lòng chọn ngày hẹn.";
			if (!form.value.appointmentTime) return "Vui lòng chọn giờ hẹn từ 07:30 đến 18:30.";
			if (!isValidVietnamesePhone(form.value.phone)) return "Số điện thoại phải có 9 chữ số, 10 chữ số bắt đầu bằng 0, hoặc bắt đầu bằng +84/84.";
			if (form.value.appointmentDate < minimumAppointmentDate.value) return "Hôm nay đã hết khung giờ nhận lịch, vui lòng chọn từ ngày mai.";
			if (appointmentTimeError.value) return appointmentTimeError.value;
			const appointment = /* @__PURE__ */ new Date(`${form.value.appointmentDate}T${form.value.appointmentTime}`);
			if (Number.isNaN(appointment.getTime()) || appointment.getTime() <= currentTime.value.getTime()) return "Thời gian hẹn không thể ở trong quá khứ!";
			return "";
		}
		async function submit() {
			if (auth.isAdmin) {
				ok.value = false;
				msg.value = "Tài khoản quản trị không thể gửi yêu cầu dịch vụ.";
				return;
			}
			msg.value = validateForm();
			ok.value = false;
			if (msg.value) return;
			submitting.value = true;
			try {
				const payload = {
					...form.value,
					phone: normalizeVietnamesePhone(form.value.phone),
					appointmentDate: toApiDate(form.value.appointmentDate)
				};
				const { data } = await supportApi.create(payload);
				ok.value = data.success;
				msg.value = data.message || "Không thể đặt lịch";
				if (data.success) {
					form.value.appointmentDate = "";
					form.value.appointmentTime = "";
					form.value.carInfo = "";
					form.value.serviceType = "";
					selectedFromCatalog.value = false;
				}
			} catch (error) {
				ok.value = false;
				msg.value = error.response?.data?.message || "Không thể đặt lịch dịch vụ";
			} finally {
				submitting.value = false;
			}
		}
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("main", _hoisted_1, [_cache[14] || (_cache[14] = createBaseVNode("section", { class: "ford-hero-panel compact content-only service-hero" }, [createBaseVNode("div", { class: "ford-hero-panel-content" }, [
				createBaseVNode("span", { class: "service-eyebrow" }, "DỊCH VỤ CARSTORE"),
				createBaseVNode("h1", null, "Chăm sóc xe thuận tiện, rõ ràng"),
				createBaseVNode("p", null, "Đặt lịch nhanh với thông tin cần thiết. Nhân viên CarStore sẽ liên hệ xác nhận lịch hẹn.")
			])], -1)), createBaseVNode("div", _hoisted_2, [createBaseVNode("section", _hoisted_3, [(openBlock(), createElementBlock(Fragment, null, renderList(services, (service) => {
				return createBaseVNode("article", {
					key: service.title,
					class: "cs-card service-card"
				}, [createBaseVNode("span", _hoisted_4, toDisplayString(service.icon), 1), createBaseVNode("div", null, [createBaseVNode("h2", null, toDisplayString(service.title), 1), createBaseVNode("p", null, toDisplayString(service.desc), 1)])]);
			}), 64))]), createBaseVNode("section", _hoisted_5, [_cache[13] || (_cache[13] = createBaseVNode("div", { class: "booking-intro" }, [
				createBaseVNode("span", { class: "service-eyebrow" }, "ĐẶT LỊCH"),
				createBaseVNode("h2", null, "Thông tin lịch hẹn"),
				createBaseVNode("p", null, [
					createTextVNode("Điền thông tin bên cạnh. Các trường có dấu "),
					createBaseVNode("strong", null, "*"),
					createTextVNode(" là bắt buộc.")
				]),
				createBaseVNode("div", { class: "booking-note" }, [
					createBaseVNode("strong", null, "Quy trình đơn giản"),
					createBaseVNode("span", null, "1. Gửi yêu cầu"),
					createBaseVNode("span", null, "2. Nhân viên xác nhận"),
					createBaseVNode("span", null, "3. Mang xe đến đúng lịch")
				])
			], -1)), createBaseVNode("form", {
				class: "booking-form",
				novalidate: "",
				onSubmit: withModifiers(submit, ["prevent"])
			}, [
				createBaseVNode("div", _hoisted_6, [_cache[6] || (_cache[6] = createBaseVNode("label", { for: "service-name" }, "Họ tên *", -1)), withDirectives(createBaseVNode("input", {
					id: "service-name",
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
				createBaseVNode("div", _hoisted_7, [_cache[7] || (_cache[7] = createBaseVNode("label", { for: "service-phone" }, "Số điện thoại *", -1)), withDirectives(createBaseVNode("input", {
					id: "service-phone",
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
				createBaseVNode("div", _hoisted_8, [
					_cache[8] || (_cache[8] = createBaseVNode("label", { for: "service-car" }, "Thông tin xe / biển số *", -1)),
					withDirectives(createBaseVNode("input", {
						id: "service-car",
						"onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => form.value.carInfo = $event),
						class: "form-control",
						maxlength: "255",
						placeholder: "Tên xe hoặc biển số"
					}, null, 512), [[
						vModelText,
						form.value.carInfo,
						void 0,
						{ trim: true }
					]]),
					selectedFromCatalog.value ? (openBlock(), createElementBlock("small", _hoisted_9, "Thông tin được điền sẵn từ trang chi tiết và có thể chỉnh sửa.")) : createCommentVNode("", true)
				]),
				createBaseVNode("div", _hoisted_10, [_cache[10] || (_cache[10] = createBaseVNode("label", { for: "service-type" }, "Loại dịch vụ *", -1)), withDirectives(createBaseVNode("select", {
					id: "service-type",
					"onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => form.value.serviceType = $event),
					class: "form-select"
				}, [..._cache[9] || (_cache[9] = [
					createBaseVNode("option", { value: "" }, "-- Chọn dịch vụ --", -1),
					createBaseVNode("option", null, "Bảo dưỡng định kỳ", -1),
					createBaseVNode("option", null, "Sửa chữa", -1),
					createBaseVNode("option", null, "Bảo hành", -1),
					createBaseVNode("option", null, "Kiểm tra tổng thể", -1)
				])], 512), [[vModelSelect, form.value.serviceType]])]),
				createBaseVNode("div", _hoisted_11, [_cache[11] || (_cache[11] = createBaseVNode("label", { for: "service-date" }, "Ngày hẹn *", -1)), createVNode(DatePickerInput_default, {
					id: "service-date",
					modelValue: form.value.appointmentDate,
					"onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => form.value.appointmentDate = $event),
					min: minimumAppointmentDate.value,
					"aria-label": "Ngày hẹn",
					title: "Ngày hẹn (dd/mm/yyyy)"
				}, null, 8, ["modelValue", "min"])]),
				createBaseVNode("div", _hoisted_12, [
					_cache[12] || (_cache[12] = createBaseVNode("label", { for: "service-time" }, "Giờ hẹn *", -1)),
					withDirectives(createBaseVNode("input", {
						id: "service-time",
						"onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => form.value.appointmentTime = $event),
						min: minimumAppointmentTime.value,
						max: showroomCloseTime,
						type: "time",
						class: normalizeClass(["form-control", { "is-invalid": appointmentTimeError.value }]),
						disabled: !form.value.appointmentDate
					}, null, 10, _hoisted_13), [[vModelText, form.value.appointmentTime]]),
					createBaseVNode("small", { class: normalizeClass({ "text-danger": appointmentTimeError.value }) }, toDisplayString(!form.value.appointmentDate ? "Vui lòng chọn ngày hẹn trước khi chọn giờ hẹn." : appointmentTimeError.value || "Showroom nhận lịch từ 07:30 đến 18:30."), 3)
				]),
				createBaseVNode("div", _hoisted_14, [msg.value ? (openBlock(), createElementBlock("div", {
					key: 0,
					class: normalizeClass(["alert cart-alert show", [ok.value ? "alert-success" : "alert-danger", { error: !ok.value }]]),
					role: "alert"
				}, toDisplayString(msg.value), 3)) : createCommentVNode("", true), createBaseVNode("button", {
					class: "btn cs-btn cs-btn-primary",
					type: "submit",
					disabled: submitting.value || unref(auth).isAdmin
				}, toDisplayString(submitting.value ? "Đang gửi yêu cầu..." : "Xác nhận đặt lịch"), 9, _hoisted_15)])
			], 32)])])]);
		};
	}
}, [["__scopeId", "data-v-ca490be6"]]);
//#endregion
export { ServiceView_default as default };
