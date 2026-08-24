import { O as createElementBlock, T as createBaseVNode, Tt as normalizeClass, V as openBlock, tt as ref, w as computed } from "./api-Cd2rmWmR.js";
import { d as withKeys, f as withModifiers, n as _plugin_vue_export_helper_default } from "./index-BCOVk736.js";
//#region src/components/DatePickerInput.vue
var _hoisted_1 = [
	"id",
	"value",
	"disabled",
	"required",
	"aria-label",
	"aria-required",
	"title",
	"onKeydown"
];
var _hoisted_2 = [
	"value",
	"min",
	"max",
	"disabled",
	"required",
	"aria-label"
];
var DatePickerInput_default = /*#__PURE__*/ _plugin_vue_export_helper_default({
	__name: "DatePickerInput",
	props: {
		modelValue: {
			type: String,
			default: ""
		},
		id: {
			type: String,
			default: void 0
		},
		min: {
			type: String,
			default: ""
		},
		max: {
			type: String,
			default: ""
		},
		disabled: {
			type: Boolean,
			default: false
		},
		required: {
			type: Boolean,
			default: false
		},
		ariaLabel: {
			type: String,
			default: "Chọn ngày"
		},
		title: {
			type: String,
			default: ""
		}
	},
	emits: ["update:modelValue"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const nativePicker = ref(null);
		const isoValue = computed(() => {
			const value = String(props.modelValue || "").slice(0, 10);
			return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : "";
		});
		const displayValue = computed(() => {
			const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoValue.value);
			return match ? `${match[3]}/${match[2]}/${match[1]}` : "";
		});
		function openPicker() {
			if (props.disabled || !nativePicker.value) return;
			try {
				if (typeof nativePicker.value.showPicker === "function") {
					nativePicker.value.showPicker();
					return;
				}
			} catch {}
			nativePicker.value.focus({ preventScroll: true });
			nativePicker.value.click();
		}
		function selectDate(event) {
			emit("update:modelValue", event.target.value || "");
		}
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", { class: normalizeClass(["date-picker-input", { "date-picker-input--disabled": __props.disabled }]) }, [
				createBaseVNode("input", {
					id: __props.id,
					class: "form-control date-picker-input__display",
					type: "text",
					value: displayValue.value,
					placeholder: "dd/mm/yyyy",
					readonly: "",
					disabled: __props.disabled,
					required: __props.required,
					"aria-label": __props.ariaLabel,
					"aria-required": __props.required,
					"aria-haspopup": "dialog",
					title: __props.title || "Chọn ngày (dd/mm/yyyy)",
					onClick: openPicker,
					onKeydown: [
						withKeys(withModifiers(openPicker, ["prevent"]), ["enter"]),
						withKeys(withModifiers(openPicker, ["prevent"]), ["space"]),
						withKeys(withModifiers(openPicker, ["prevent"]), ["down"])
					]
				}, null, 40, _hoisted_1),
				_cache[0] || (_cache[0] = createBaseVNode("span", {
					class: "date-picker-input__icon",
					"aria-hidden": "true"
				}, [createBaseVNode("svg", {
					viewBox: "0 0 24 24",
					focusable: "false"
				}, [createBaseVNode("path", { d: "M7 2v2H5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3h-2V2h-2v2H9V2H7Zm12 18H5a1 1 0 0 1-1-1v-8h16v8a1 1 0 0 1-1 1ZM4 9V7a1 1 0 0 1 1-1h2v2h2V6h6v2h2V6h2a1 1 0 0 1 1 1v2H4Z" })])], -1)),
				createBaseVNode("input", {
					ref_key: "nativePicker",
					ref: nativePicker,
					class: "date-picker-input__native",
					type: "date",
					value: isoValue.value,
					min: __props.min || void 0,
					max: __props.max || void 0,
					disabled: __props.disabled,
					required: __props.required,
					"aria-label": __props.ariaLabel,
					tabindex: "-1",
					onChange: selectDate
				}, null, 40, _hoisted_2)
			], 2);
		};
	}
}, [["__scopeId", "data-v-852d73a3"]]);
//#endregion
export { DatePickerInput_default as t };
