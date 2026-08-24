const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/HomeView-CEF5y8hi.js","assets/api-Cd2rmWmR.js","assets/useCartToast-CRv33ZAZ.js","assets/CarCard-BFj0sMDD.js","assets/CarCard-OekVRxZL.css","assets/useAutoRefresh-CiKJsJMn.js","assets/HomeView-DJal-5Qa.css","assets/CarListView-B_hr9HZu.js","assets/CarListView-D5eV2jLB.css","assets/CarDetailView-C9t-2kWp.js","assets/CarDetailView-C0wO6c4m.css","assets/CompareView-BSuDCV8V.js","assets/CompareView-BFpHXp3t.css","assets/CarFormView-mX8nOsq4.js","assets/CartView-Bi8XGoYh.js","assets/CartView-CZ28wHcq.css","assets/CheckoutView-5BfppBTs.js","assets/CheckoutView-NN6KBOWc.css","assets/LoginView-DcJ-zMbH.js","assets/LoginView-fY6dr84c.css","assets/SignupView-BV-i0F2A.js","assets/SignupView-CgCHwFNE.css","assets/EmailVerificationView-Bs5YfbCG.js","assets/EmailVerificationView-BUhV7b68.css","assets/ForgotPasswordView-Dy5AnP1e.js","assets/ForgotPasswordView-CyuHJ_jr.css","assets/VerifyOtpView-DmZAmgrP.js","assets/VerifyOtpView-B0eMKj3f.css","assets/ResetPasswordView-LDYthn0_.js","assets/ResetPasswordView-tehGFrGc.css","assets/ProfileView-CkzfIc_p.js","assets/ProfileView-Ck-oHHfp.css","assets/MyOrdersView-BtV3En-u.js","assets/MyOrdersView-PIHFdljq.css","assets/OrderDetailView-BdPNvkUu.js","assets/ContractView-BemXtC4G.js","assets/ContractView-DbQ2IADA.css","assets/PaymentView-D5-09fjZ.js","assets/PaymentView-4hLDoI6r.css","assets/QuotationView-D7LljbLp.js","assets/QuotationView-zwq_BL5k.css","assets/QuotationHistoryView-D0OsOCrQ.js","assets/HistoryView-DYXjqM4u.js","assets/ServiceView-C3Hz0fDu.js","assets/DatePickerInput-CdBS-OUl.js","assets/DatePickerInput-wFzBU9xS.css","assets/phone-DOTtN8t5.js","assets/ServiceView-CR3BrJAU.css","assets/SupportView-DpqJt9Op.js","assets/SupportView-BtuflCxN.css","assets/NewsDetailView-cDzvSHUj.js","assets/NewsDetailView-B5XKzG7W.css","assets/NewsListView-BWP95gwp.js","assets/NewsListView--K3QQ_9E.css","assets/AdminDashboard-B7Q81zju.js","assets/AdminDashboard-u0eGiIgN.css","assets/AdminProducts-CiEufJDN.js","assets/AdminProducts-SFvgH13I.css","assets/AdminInventory-BNLPC7il.js","assets/AdminInventory-CFu49Am3.css","assets/AdminOrders-DkrMr3JZ.js","assets/AdminOrders-D0axS7vm.css","assets/AdminSupport-DSsuassy.js","assets/AdminSupport-CEdzeOnZ.css","assets/AdminUsers-DHeDBor8.js","assets/AdminUsers-tR4xTg0C.css","assets/AdminUserForm-Ad8DKWc-.js","assets/AdminUserForm-CfhvuREZ.css","assets/AdminMarketing-DvCveHIA.js","assets/AdminMarketing-xu__VN9J.css","assets/AdminContracts-YGtMOK4Z.js"])))=>i.map(i=>d[i]);
import { $ as onScopeDispose, A as createStaticVNode, B as onUnmounted, C as callWithAsyncErrorHandling, Ct as looseIndexOf, D as createCommentVNode, Dt as toDisplayString, E as createBlock, F as hasInjectionContext, G as watch, H as provide, I as inject, J as effectScope, K as withCtx, L as nextTick, M as createVNode, N as defineComponent, O as createElementBlock, Ot as toNumber, P as h, Q as markRaw, R as onBeforeUnmount, S as Fragment, St as looseEqual, T as createBaseVNode, Tt as normalizeClass, U as renderList, V as openBlock, W as resolveComponent, X as isReactive, Y as getCurrentScope, Z as isRef, _t as isOn, a as carImageUrl, at as toRefs, b as BaseTransition, bt as isString, c as formatPrice, ct as capitalize, dt as includeBooleanAttr, et as reactive, ft as invokeArrayFns, gt as isObject, ht as isModelListener, i as carApi, it as toRaw, j as createTextVNode, k as createRenderer, lt as extend, mt as isFunction, n as authApi, nt as shallowReactive, o as cartApi, ot as unref, pt as isArray$1, q as withDirectives, r as brandApi, rt as shallowRef, st as camelize, tt as ref, ut as hyphenate, v as useDefaultCarImage, vt as isSet, w as computed, wt as looseToNumber, x as BaseTransitionPropsValidators, xt as isSymbol, y as api, yt as isSpecialBooleanAttr, z as onMounted } from "./api-Cd2rmWmR.js";
//#region \0vite/modulepreload-polyfill.js
(function polyfill() {
	const relList = document.createElement("link").relList;
	if (relList && relList.supports && relList.supports("modulepreload")) return;
	for (const link of document.querySelectorAll("link[rel=\"modulepreload\"]")) processPreload(link);
	new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type !== "childList") continue;
			for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
		}
	}).observe(document, {
		childList: true,
		subtree: true
	});
	function getFetchOpts(link) {
		const fetchOpts = {};
		if (link.integrity) fetchOpts.integrity = link.integrity;
		if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
		if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
		else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
		else fetchOpts.credentials = "same-origin";
		return fetchOpts;
	}
	function processPreload(link) {
		if (link.ep) return;
		link.ep = true;
		const fetchOpts = getFetchOpts(link);
		fetch(link.href, fetchOpts);
	}
})();
//#endregion
//#region node_modules/@vue/runtime-dom/dist/runtime-dom.esm-bundler.js
/**
* @vue/runtime-dom v3.5.39
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
var policy = void 0;
var tt = typeof window !== "undefined" && window.trustedTypes;
if (tt) try {
	policy = /* @__PURE__ */ tt.createPolicy("vue", { createHTML: (val) => val });
} catch (e) {}
var unsafeToTrustedHTML = policy ? (val) => policy.createHTML(val) : (val) => val;
var svgNS = "http://www.w3.org/2000/svg";
var mathmlNS = "http://www.w3.org/1998/Math/MathML";
var doc = typeof document !== "undefined" ? document : null;
var templateContainer = doc && /* @__PURE__ */ doc.createElement("template");
var nodeOps = {
	insert: (child, parent, anchor) => {
		parent.insertBefore(child, anchor || null);
	},
	remove: (child) => {
		const parent = child.parentNode;
		if (parent) parent.removeChild(child);
	},
	createElement: (tag, namespace, is, props) => {
		const el = namespace === "svg" ? doc.createElementNS(svgNS, tag) : namespace === "mathml" ? doc.createElementNS(mathmlNS, tag) : is ? doc.createElement(tag, { is }) : doc.createElement(tag);
		if (tag === "select" && props && props.multiple != null) el.setAttribute("multiple", props.multiple);
		return el;
	},
	createText: (text) => doc.createTextNode(text),
	createComment: (text) => doc.createComment(text),
	setText: (node, text) => {
		node.nodeValue = text;
	},
	setElementText: (el, text) => {
		el.textContent = text;
	},
	parentNode: (node) => node.parentNode,
	nextSibling: (node) => node.nextSibling,
	querySelector: (selector) => doc.querySelector(selector),
	setScopeId(el, id) {
		el.setAttribute(id, "");
	},
	insertStaticContent(content, parent, anchor, namespace, start, end) {
		const before = anchor ? anchor.previousSibling : parent.lastChild;
		if (start && (start === end || start.nextSibling)) while (true) {
			parent.insertBefore(start.cloneNode(true), anchor);
			if (start === end || !(start = start.nextSibling)) break;
		}
		else {
			templateContainer.innerHTML = unsafeToTrustedHTML(namespace === "svg" ? `<svg>${content}</svg>` : namespace === "mathml" ? `<math>${content}</math>` : content);
			const template = templateContainer.content;
			if (namespace === "svg" || namespace === "mathml") {
				const wrapper = template.firstChild;
				while (wrapper.firstChild) template.appendChild(wrapper.firstChild);
				template.removeChild(wrapper);
			}
			parent.insertBefore(template, anchor);
		}
		return [before ? before.nextSibling : parent.firstChild, anchor ? anchor.previousSibling : parent.lastChild];
	}
};
var TRANSITION = "transition";
var ANIMATION = "animation";
var vtcKey = /* @__PURE__ */ Symbol("_vtc");
var DOMTransitionPropsValidators = {
	name: String,
	type: String,
	css: {
		type: Boolean,
		default: true
	},
	duration: [
		String,
		Number,
		Object
	],
	enterFromClass: String,
	enterActiveClass: String,
	enterToClass: String,
	appearFromClass: String,
	appearActiveClass: String,
	appearToClass: String,
	leaveFromClass: String,
	leaveActiveClass: String,
	leaveToClass: String
};
var TransitionPropsValidators = /* @__PURE__ */ extend({}, BaseTransitionPropsValidators, DOMTransitionPropsValidators);
var decorate$1 = (t) => {
	t.displayName = "Transition";
	t.props = TransitionPropsValidators;
	return t;
};
var Transition = /* @__PURE__ */ decorate$1((props, { slots }) => h(BaseTransition, resolveTransitionProps(props), slots));
var callHook = (hook, args = []) => {
	if (isArray$1(hook)) hook.forEach((h2) => h2(...args));
	else if (hook) hook(...args);
};
var hasExplicitCallback = (hook) => {
	return hook ? isArray$1(hook) ? hook.some((h2) => h2.length > 1) : hook.length > 1 : false;
};
function resolveTransitionProps(rawProps) {
	const baseProps = {};
	for (const key in rawProps) if (!(key in DOMTransitionPropsValidators)) baseProps[key] = rawProps[key];
	if (rawProps.css === false) return baseProps;
	const { name = "v", type, duration, enterFromClass = `${name}-enter-from`, enterActiveClass = `${name}-enter-active`, enterToClass = `${name}-enter-to`, appearFromClass = enterFromClass, appearActiveClass = enterActiveClass, appearToClass = enterToClass, leaveFromClass = `${name}-leave-from`, leaveActiveClass = `${name}-leave-active`, leaveToClass = `${name}-leave-to` } = rawProps;
	const durations = normalizeDuration(duration);
	const enterDuration = durations && durations[0];
	const leaveDuration = durations && durations[1];
	const { onBeforeEnter, onEnter, onEnterCancelled, onLeave, onLeaveCancelled, onBeforeAppear = onBeforeEnter, onAppear = onEnter, onAppearCancelled = onEnterCancelled } = baseProps;
	const finishEnter = (el, isAppear, done, isCancelled) => {
		el._enterCancelled = isCancelled;
		removeTransitionClass(el, isAppear ? appearToClass : enterToClass);
		removeTransitionClass(el, isAppear ? appearActiveClass : enterActiveClass);
		done && done();
	};
	const finishLeave = (el, done) => {
		el._isLeaving = false;
		removeTransitionClass(el, leaveFromClass);
		removeTransitionClass(el, leaveToClass);
		removeTransitionClass(el, leaveActiveClass);
		done && done();
	};
	const makeEnterHook = (isAppear) => {
		return (el, done) => {
			const hook = isAppear ? onAppear : onEnter;
			const resolve = () => finishEnter(el, isAppear, done);
			callHook(hook, [el, resolve]);
			nextFrame(() => {
				removeTransitionClass(el, isAppear ? appearFromClass : enterFromClass);
				addTransitionClass(el, isAppear ? appearToClass : enterToClass);
				if (!hasExplicitCallback(hook)) whenTransitionEnds(el, type, enterDuration, resolve);
			});
		};
	};
	return extend(baseProps, {
		onBeforeEnter(el) {
			callHook(onBeforeEnter, [el]);
			addTransitionClass(el, enterFromClass);
			addTransitionClass(el, enterActiveClass);
		},
		onBeforeAppear(el) {
			callHook(onBeforeAppear, [el]);
			addTransitionClass(el, appearFromClass);
			addTransitionClass(el, appearActiveClass);
		},
		onEnter: makeEnterHook(false),
		onAppear: makeEnterHook(true),
		onLeave(el, done) {
			el._isLeaving = true;
			const resolve = () => finishLeave(el, done);
			addTransitionClass(el, leaveFromClass);
			if (!el._enterCancelled) {
				forceReflow(el);
				addTransitionClass(el, leaveActiveClass);
			} else {
				addTransitionClass(el, leaveActiveClass);
				forceReflow(el);
			}
			nextFrame(() => {
				if (!el._isLeaving) return;
				removeTransitionClass(el, leaveFromClass);
				addTransitionClass(el, leaveToClass);
				if (!hasExplicitCallback(onLeave)) whenTransitionEnds(el, type, leaveDuration, resolve);
			});
			callHook(onLeave, [el, resolve]);
		},
		onEnterCancelled(el) {
			finishEnter(el, false, void 0, true);
			callHook(onEnterCancelled, [el]);
		},
		onAppearCancelled(el) {
			finishEnter(el, true, void 0, true);
			callHook(onAppearCancelled, [el]);
		},
		onLeaveCancelled(el) {
			finishLeave(el);
			callHook(onLeaveCancelled, [el]);
		}
	});
}
function normalizeDuration(duration) {
	if (duration == null) return null;
	else if (isObject(duration)) return [NumberOf(duration.enter), NumberOf(duration.leave)];
	else {
		const n = NumberOf(duration);
		return [n, n];
	}
}
function NumberOf(val) {
	return toNumber(val);
}
function addTransitionClass(el, cls) {
	cls.split(/\s+/).forEach((c) => c && el.classList.add(c));
	(el[vtcKey] || (el[vtcKey] = /* @__PURE__ */ new Set())).add(cls);
}
function removeTransitionClass(el, cls) {
	cls.split(/\s+/).forEach((c) => c && el.classList.remove(c));
	const _vtc = el[vtcKey];
	if (_vtc) {
		_vtc.delete(cls);
		if (!_vtc.size) el[vtcKey] = void 0;
	}
}
function nextFrame(cb) {
	requestAnimationFrame(() => {
		requestAnimationFrame(cb);
	});
}
var endId = 0;
function whenTransitionEnds(el, expectedType, explicitTimeout, resolve) {
	const id = el._endId = ++endId;
	const resolveIfNotStale = () => {
		if (id === el._endId) resolve();
	};
	if (explicitTimeout != null) return setTimeout(resolveIfNotStale, explicitTimeout);
	const { type, timeout, propCount } = getTransitionInfo(el, expectedType);
	if (!type) return resolve();
	const endEvent = type + "end";
	let ended = 0;
	const end = () => {
		el.removeEventListener(endEvent, onEnd);
		resolveIfNotStale();
	};
	const onEnd = (e) => {
		if (e.target === el && ++ended >= propCount) end();
	};
	setTimeout(() => {
		if (ended < propCount) end();
	}, timeout + 1);
	el.addEventListener(endEvent, onEnd);
}
function getTransitionInfo(el, expectedType) {
	const styles = window.getComputedStyle(el);
	const getStyleProperties = (key) => (styles[key] || "").split(", ");
	const transitionDelays = getStyleProperties(`${TRANSITION}Delay`);
	const transitionDurations = getStyleProperties(`${TRANSITION}Duration`);
	const transitionTimeout = getTimeout(transitionDelays, transitionDurations);
	const animationDelays = getStyleProperties(`${ANIMATION}Delay`);
	const animationDurations = getStyleProperties(`${ANIMATION}Duration`);
	const animationTimeout = getTimeout(animationDelays, animationDurations);
	let type = null;
	let timeout = 0;
	let propCount = 0;
	if (expectedType === TRANSITION) {
		if (transitionTimeout > 0) {
			type = TRANSITION;
			timeout = transitionTimeout;
			propCount = transitionDurations.length;
		}
	} else if (expectedType === ANIMATION) {
		if (animationTimeout > 0) {
			type = ANIMATION;
			timeout = animationTimeout;
			propCount = animationDurations.length;
		}
	} else {
		timeout = Math.max(transitionTimeout, animationTimeout);
		type = timeout > 0 ? transitionTimeout > animationTimeout ? TRANSITION : ANIMATION : null;
		propCount = type ? type === TRANSITION ? transitionDurations.length : animationDurations.length : 0;
	}
	const hasTransform = type === TRANSITION && /\b(?:transform|all)(?:,|$)/.test(getStyleProperties(`${TRANSITION}Property`).toString());
	return {
		type,
		timeout,
		propCount,
		hasTransform
	};
}
function getTimeout(delays, durations) {
	while (delays.length < durations.length) delays = delays.concat(delays);
	return Math.max(...durations.map((d, i) => toMs(d) + toMs(delays[i])));
}
function toMs(s) {
	if (s === "auto") return 0;
	return Number(s.slice(0, -1).replace(",", ".")) * 1e3;
}
function forceReflow(el) {
	return (el ? el.ownerDocument : document).body.offsetHeight;
}
function patchClass(el, value, isSVG) {
	const transitionClasses = el[vtcKey];
	if (transitionClasses) value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
	if (value == null) el.removeAttribute("class");
	else if (isSVG) el.setAttribute("class", value);
	else el.className = value;
}
var vShowOriginalDisplay = /* @__PURE__ */ Symbol("_vod");
var vShowHidden = /* @__PURE__ */ Symbol("_vsh");
var CSS_VAR_TEXT = /* @__PURE__ */ Symbol("");
var displayRE = /(?:^|;)\s*display\s*:/;
function patchStyle(el, prev, next) {
	const style = el.style;
	const isCssString = isString(next);
	let hasControlledDisplay = false;
	if (next && !isCssString) {
		if (prev) if (!isString(prev)) {
			for (const key in prev) if (next[key] == null) setStyle(style, key, "");
		} else for (const prevStyle of prev.split(";")) {
			const key = prevStyle.slice(0, prevStyle.indexOf(":")).trim();
			if (next[key] == null) setStyle(style, key, "");
		}
		for (const key in next) {
			if (key === "display") hasControlledDisplay = true;
			const value = next[key];
			if (value != null) {
				if (!shouldPreserveTextareaResizeStyle(el, key, !isString(prev) && prev ? prev[key] : void 0, value)) setStyle(style, key, value);
			} else setStyle(style, key, "");
		}
	} else if (isCssString) {
		if (prev !== next) {
			const cssVarText = style[CSS_VAR_TEXT];
			if (cssVarText) next += ";" + cssVarText;
			style.cssText = next;
			hasControlledDisplay = displayRE.test(next);
		}
	} else if (prev) el.removeAttribute("style");
	if (vShowOriginalDisplay in el) {
		el[vShowOriginalDisplay] = hasControlledDisplay ? style.display : "";
		if (el[vShowHidden]) style.display = "none";
	}
}
var importantRE = /\s*!important$/;
function setStyle(style, name, val) {
	if (isArray$1(val)) val.forEach((v) => setStyle(style, name, v));
	else {
		if (val == null) val = "";
		if (name.startsWith("--")) style.setProperty(name, val);
		else {
			const prefixed = autoPrefix(style, name);
			if (importantRE.test(val)) style.setProperty(hyphenate(prefixed), val.replace(importantRE, ""), "important");
			else style[prefixed] = val;
		}
	}
}
var prefixes = [
	"Webkit",
	"Moz",
	"ms"
];
var prefixCache = {};
function autoPrefix(style, rawName) {
	const cached = prefixCache[rawName];
	if (cached) return cached;
	let name = camelize(rawName);
	if (name !== "filter" && name in style) return prefixCache[rawName] = name;
	name = capitalize(name);
	for (let i = 0; i < prefixes.length; i++) {
		const prefixed = prefixes[i] + name;
		if (prefixed in style) return prefixCache[rawName] = prefixed;
	}
	return rawName;
}
function shouldPreserveTextareaResizeStyle(el, key, prev, next) {
	return el.tagName === "TEXTAREA" && (key === "width" || key === "height") && isString(next) && prev === next;
}
var xlinkNS = "http://www.w3.org/1999/xlink";
function patchAttr(el, key, value, isSVG, instance, isBoolean = isSpecialBooleanAttr(key)) {
	if (isSVG && key.startsWith("xlink:")) if (value == null) el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
	else el.setAttributeNS(xlinkNS, key, value);
	else if (value == null || isBoolean && !includeBooleanAttr(value)) el.removeAttribute(key);
	else el.setAttribute(key, isBoolean ? "" : isSymbol(value) ? String(value) : value);
}
function patchDOMProp(el, key, value, parentComponent, attrName) {
	if (key === "innerHTML" || key === "textContent") {
		if (value != null) el[key] = key === "innerHTML" ? unsafeToTrustedHTML(value) : value;
		return;
	}
	const tag = el.tagName;
	if (key === "value" && tag !== "PROGRESS" && !tag.includes("-")) {
		const oldValue = tag === "OPTION" ? el.getAttribute("value") || "" : el.value;
		const newValue = value == null ? el.type === "checkbox" ? "on" : "" : String(value);
		if (oldValue !== newValue || !("_value" in el)) el.value = newValue;
		if (value == null) el.removeAttribute(key);
		el._value = value;
		return;
	}
	let needRemove = false;
	if (value === "" || value == null) {
		const type = typeof el[key];
		if (type === "boolean") value = includeBooleanAttr(value);
		else if (value == null && type === "string") {
			value = "";
			needRemove = true;
		} else if (type === "number") {
			value = 0;
			needRemove = true;
		}
	}
	try {
		el[key] = value;
	} catch (e) {}
	needRemove && el.removeAttribute(attrName || key);
}
function addEventListener(el, event, handler, options) {
	el.addEventListener(event, handler, options);
}
function removeEventListener(el, event, handler, options) {
	el.removeEventListener(event, handler, options);
}
var veiKey = /* @__PURE__ */ Symbol("_vei");
function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
	const invokers = el[veiKey] || (el[veiKey] = {});
	const existingInvoker = invokers[rawName];
	if (nextValue && existingInvoker) existingInvoker.value = nextValue;
	else {
		const [name, options] = parseName(rawName);
		if (nextValue) addEventListener(el, name, invokers[rawName] = createInvoker(nextValue, instance), options);
		else if (existingInvoker) {
			removeEventListener(el, name, existingInvoker, options);
			invokers[rawName] = void 0;
		}
	}
}
var optionsModifierRE = /(Once|Passive|Capture)$/;
var optionsModifierEventRE = /^on:?(?:Once|Passive|Capture)$/;
function parseName(name) {
	let options;
	let m;
	while ((m = name.match(optionsModifierRE)) && !optionsModifierEventRE.test(name)) {
		if (!options) options = {};
		name = name.slice(0, name.length - m[1].length);
		options[m[1].toLowerCase()] = true;
	}
	return [name[2] === ":" ? name.slice(3) : hyphenate(name.slice(2)), options];
}
var cachedNow = 0;
var p = /* @__PURE__ */ Promise.resolve();
var getNow = () => cachedNow || (p.then(() => cachedNow = 0), cachedNow = Date.now());
function createInvoker(initialValue, instance) {
	const invoker = (e) => {
		if (!e._vts) e._vts = Date.now();
		else if (e._vts <= invoker.attached) return;
		const value = invoker.value;
		if (isArray$1(value)) {
			const originalStop = e.stopImmediatePropagation;
			e.stopImmediatePropagation = () => {
				originalStop.call(e);
				e._stopped = true;
			};
			const handlers = value.slice();
			const args = [e];
			for (let i = 0; i < handlers.length; i++) {
				if (e._stopped) break;
				const handler = handlers[i];
				if (handler) callWithAsyncErrorHandling(handler, instance, 5, args);
			}
		} else callWithAsyncErrorHandling(value, instance, 5, [e]);
	};
	invoker.value = initialValue;
	invoker.attached = getNow();
	return invoker;
}
var isNativeOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && key.charCodeAt(2) > 96 && key.charCodeAt(2) < 123;
var patchProp = (el, key, prevValue, nextValue, namespace, parentComponent) => {
	const isSVG = namespace === "svg";
	if (key === "class") patchClass(el, nextValue, isSVG);
	else if (key === "style") patchStyle(el, prevValue, nextValue);
	else if (isOn(key)) {
		if (!isModelListener(key)) patchEvent(el, key, prevValue, nextValue, parentComponent);
	} else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el, key, nextValue, isSVG)) {
		patchDOMProp(el, key, nextValue);
		if (!el.tagName.includes("-") && (key === "value" || key === "checked" || key === "selected")) patchAttr(el, key, nextValue, isSVG, parentComponent, key !== "value");
	} else if (el._isVueCE && (shouldSetAsPropForVueCE(el, key) || el._def.__asyncLoader && (/[A-Z]/.test(key) || !isString(nextValue)))) patchDOMProp(el, camelize(key), nextValue, parentComponent, key);
	else {
		if (key === "true-value") el._trueValue = nextValue;
		else if (key === "false-value") el._falseValue = nextValue;
		patchAttr(el, key, nextValue, isSVG);
	}
};
function shouldSetAsProp(el, key, value, isSVG) {
	if (isSVG) {
		if (key === "innerHTML" || key === "textContent") return true;
		if (key in el && isNativeOn(key) && isFunction(value)) return true;
		return false;
	}
	if (key === "spellcheck" || key === "draggable" || key === "translate" || key === "autocorrect") return false;
	if (key === "sandbox" && el.tagName === "IFRAME") return false;
	if (key === "form") return false;
	if (key === "list" && el.tagName === "INPUT") return false;
	if (key === "type" && el.tagName === "TEXTAREA") return false;
	if (key === "width" || key === "height") {
		const tag = el.tagName;
		if (tag === "IMG" || tag === "VIDEO" || tag === "CANVAS" || tag === "SOURCE") return false;
	}
	if (isNativeOn(key) && isString(value)) return false;
	return key in el;
}
function shouldSetAsPropForVueCE(el, key) {
	const props = el._def.props;
	if (!props) return false;
	const camelKey = camelize(key);
	return Array.isArray(props) ? props.some((prop) => camelize(prop) === camelKey) : Object.keys(props).some((prop) => camelize(prop) === camelKey);
}
var getModelAssigner = (vnode) => {
	const fn = vnode.props["onUpdate:modelValue"] || false;
	return isArray$1(fn) ? (value) => invokeArrayFns(fn, value) : fn;
};
function onCompositionStart(e) {
	e.target.composing = true;
}
function onCompositionEnd(e) {
	const target = e.target;
	if (target.composing) {
		target.composing = false;
		target.dispatchEvent(new Event("input"));
	}
}
var assignKey = /* @__PURE__ */ Symbol("_assign");
function castValue(value, trim, number) {
	if (trim) value = value.trim();
	if (number) value = looseToNumber(value);
	return value;
}
var vModelText = {
	created(el, { modifiers: { lazy, trim, number } }, vnode) {
		el[assignKey] = getModelAssigner(vnode);
		const castToNumber = number || vnode.props && vnode.props.type === "number";
		addEventListener(el, lazy ? "change" : "input", (e) => {
			if (e.target.composing) return;
			el[assignKey](castValue(el.value, trim, castToNumber));
		});
		if (trim || castToNumber) addEventListener(el, "change", () => {
			el.value = castValue(el.value, trim, castToNumber);
		});
		if (!lazy) {
			addEventListener(el, "compositionstart", onCompositionStart);
			addEventListener(el, "compositionend", onCompositionEnd);
			addEventListener(el, "change", onCompositionEnd);
		}
	},
	mounted(el, { value }) {
		el.value = value == null ? "" : value;
	},
	beforeUpdate(el, { value, oldValue, modifiers: { lazy, trim, number } }, vnode) {
		el[assignKey] = getModelAssigner(vnode);
		if (el.composing) return;
		const elValue = (number || el.type === "number") && !/^0\d/.test(el.value) ? looseToNumber(el.value) : el.value;
		const newValue = value == null ? "" : value;
		if (elValue === newValue) return;
		const rootNode = el.getRootNode();
		if ((rootNode instanceof Document || rootNode instanceof ShadowRoot) && rootNode.activeElement === el && el.type !== "range") {
			if (lazy && value === oldValue) return;
			if (trim && el.value.trim() === newValue) return;
		}
		el.value = newValue;
	}
};
var vModelCheckbox = {
	deep: true,
	created(el, _, vnode) {
		el[assignKey] = getModelAssigner(vnode);
		addEventListener(el, "change", () => {
			const modelValue = el._modelValue;
			const elementValue = getValue(el);
			const checked = el.checked;
			const assign = el[assignKey];
			if (isArray$1(modelValue)) {
				const index = looseIndexOf(modelValue, elementValue);
				const found = index !== -1;
				if (checked && !found) assign(modelValue.concat(elementValue));
				else if (!checked && found) {
					const filtered = [...modelValue];
					filtered.splice(index, 1);
					assign(filtered);
				}
			} else if (isSet(modelValue)) {
				const cloned = new Set(modelValue);
				if (checked) cloned.add(elementValue);
				else cloned.delete(elementValue);
				assign(cloned);
			} else assign(getCheckboxValue(el, checked));
		});
	},
	mounted: setChecked,
	beforeUpdate(el, binding, vnode) {
		el[assignKey] = getModelAssigner(vnode);
		setChecked(el, binding, vnode);
	}
};
function setChecked(el, { value, oldValue }, vnode) {
	el._modelValue = value;
	let checked;
	if (isArray$1(value)) checked = looseIndexOf(value, vnode.props.value) > -1;
	else if (isSet(value)) checked = value.has(vnode.props.value);
	else {
		if (value === oldValue) return;
		checked = looseEqual(value, getCheckboxValue(el, true));
	}
	if (el.checked !== checked) el.checked = checked;
}
var vModelRadio = {
	created(el, { value }, vnode) {
		el.checked = looseEqual(value, vnode.props.value);
		el[assignKey] = getModelAssigner(vnode);
		addEventListener(el, "change", () => {
			el[assignKey](getValue(el));
		});
	},
	beforeUpdate(el, { value, oldValue }, vnode) {
		el[assignKey] = getModelAssigner(vnode);
		if (value !== oldValue) el.checked = looseEqual(value, vnode.props.value);
	}
};
var vModelSelect = {
	deep: true,
	created(el, { value, modifiers: { number } }, vnode) {
		const isSetModel = isSet(value);
		addEventListener(el, "change", () => {
			const selectedVal = Array.prototype.filter.call(el.options, (o) => o.selected).map((o) => number ? looseToNumber(getValue(o)) : getValue(o));
			el[assignKey](el.multiple ? isSetModel ? new Set(selectedVal) : selectedVal : selectedVal[0]);
			el._assigning = true;
			nextTick(() => {
				el._assigning = false;
			});
		});
		el[assignKey] = getModelAssigner(vnode);
	},
	mounted(el, { value }) {
		setSelected(el, value);
	},
	beforeUpdate(el, _binding, vnode) {
		el[assignKey] = getModelAssigner(vnode);
	},
	updated(el, { value }) {
		if (!el._assigning) setSelected(el, value);
	}
};
function setSelected(el, value) {
	const isMultiple = el.multiple;
	const isArrayValue = isArray$1(value);
	if (isMultiple && !isArrayValue && !isSet(value)) return;
	for (let i = 0, l = el.options.length; i < l; i++) {
		const option = el.options[i];
		const optionValue = getValue(option);
		if (isMultiple) if (isArrayValue) {
			const optionType = typeof optionValue;
			if (optionType === "string" || optionType === "number") option.selected = value.some((v) => String(v) === String(optionValue));
			else option.selected = looseIndexOf(value, optionValue) > -1;
		} else option.selected = value.has(optionValue);
		else if (looseEqual(getValue(option), value)) {
			if (el.selectedIndex !== i) el.selectedIndex = i;
			return;
		}
	}
	if (!isMultiple && el.selectedIndex !== -1) el.selectedIndex = -1;
}
function getValue(el) {
	return "_value" in el ? el._value : el.value;
}
function getCheckboxValue(el, checked) {
	const key = checked ? "_trueValue" : "_falseValue";
	return key in el ? el[key] : checked;
}
var vModelDynamic = {
	created(el, binding, vnode) {
		callModelHook(el, binding, vnode, null, "created");
	},
	mounted(el, binding, vnode) {
		callModelHook(el, binding, vnode, null, "mounted");
	},
	beforeUpdate(el, binding, vnode, prevVNode) {
		callModelHook(el, binding, vnode, prevVNode, "beforeUpdate");
	},
	updated(el, binding, vnode, prevVNode) {
		callModelHook(el, binding, vnode, prevVNode, "updated");
	}
};
function resolveDynamicModel(tagName, type) {
	switch (tagName) {
		case "SELECT": return vModelSelect;
		case "TEXTAREA": return vModelText;
		default: switch (type) {
			case "checkbox": return vModelCheckbox;
			case "radio": return vModelRadio;
			default: return vModelText;
		}
	}
}
function callModelHook(el, binding, vnode, prevVNode, hook) {
	const fn = resolveDynamicModel(el.tagName, vnode.props && vnode.props.type)[hook];
	fn && fn(el, binding, vnode, prevVNode);
}
var systemModifiers = [
	"ctrl",
	"shift",
	"alt",
	"meta"
];
var modifierGuards = {
	stop: (e) => e.stopPropagation(),
	prevent: (e) => e.preventDefault(),
	self: (e) => e.target !== e.currentTarget,
	ctrl: (e) => !e.ctrlKey,
	shift: (e) => !e.shiftKey,
	alt: (e) => !e.altKey,
	meta: (e) => !e.metaKey,
	left: (e) => "button" in e && e.button !== 0,
	middle: (e) => "button" in e && e.button !== 1,
	right: (e) => "button" in e && e.button !== 2,
	exact: (e, modifiers) => systemModifiers.some((m) => e[`${m}Key`] && !modifiers.includes(m))
};
var withModifiers = (fn, modifiers) => {
	if (!fn) return fn;
	const cache = fn._withMods || (fn._withMods = {});
	const cacheKey = modifiers.join(".");
	return cache[cacheKey] || (cache[cacheKey] = ((event, ...args) => {
		for (let i = 0; i < modifiers.length; i++) {
			const guard = modifierGuards[modifiers[i]];
			if (guard && guard(event, modifiers)) return;
		}
		return fn(event, ...args);
	}));
};
var keyNames = {
	esc: "escape",
	space: " ",
	up: "arrow-up",
	left: "arrow-left",
	right: "arrow-right",
	down: "arrow-down",
	delete: "backspace"
};
var withKeys = (fn, modifiers) => {
	const cache = fn._withKeys || (fn._withKeys = {});
	const cacheKey = modifiers.join(".");
	return cache[cacheKey] || (cache[cacheKey] = ((event) => {
		if (!("key" in event)) return;
		const eventKey = hyphenate(event.key);
		if (modifiers.some((k) => k === eventKey || keyNames[k] === eventKey)) return fn(event);
	}));
};
var rendererOptions = /* @__PURE__ */ extend({ patchProp }, nodeOps);
var renderer;
function ensureRenderer() {
	return renderer || (renderer = createRenderer(rendererOptions));
}
var createApp = ((...args) => {
	const app = ensureRenderer().createApp(...args);
	const { mount } = app;
	app.mount = (containerOrSelector) => {
		const container = normalizeContainer(containerOrSelector);
		if (!container) return;
		const component = app._component;
		if (!isFunction(component) && !component.render && !component.template) component.template = container.innerHTML;
		if (container.nodeType === 1) container.textContent = "";
		const proxy = mount(container, false, resolveRootNamespace(container));
		if (container instanceof Element) {
			container.removeAttribute("v-cloak");
			container.setAttribute("data-v-app", "");
		}
		return proxy;
	};
	return app;
});
function resolveRootNamespace(container) {
	if (container instanceof SVGElement) return "svg";
	if (typeof MathMLElement === "function" && container instanceof MathMLElement) return "mathml";
}
function normalizeContainer(container) {
	if (isString(container)) return document.querySelector(container);
	return container;
}
//#endregion
//#region node_modules/pinia/dist/pinia.mjs
/*!
* pinia v3.0.4
* (c) 2025 Eduardo San Martin Morote
* @license MIT
*/
var IS_CLIENT = typeof window !== "undefined";
/**
* setActivePinia must be called to handle SSR at the top of functions like
* `fetch`, `setup`, `serverPrefetch` and others
*/
var activePinia;
/**
* Sets or unsets the active pinia. Used in SSR and internally when calling
* actions and getters
*
* @param pinia - Pinia instance
*/
var setActivePinia = (pinia) => activePinia = pinia;
var piniaSymbol = Symbol();
function isPlainObject(o) {
	return o && typeof o === "object" && Object.prototype.toString.call(o) === "[object Object]" && typeof o.toJSON !== "function";
}
/**
* Possible types for SubscriptionCallback
*/
var MutationType;
(function(MutationType) {
	/**
	* Direct mutation of the state:
	*
	* - `store.name = 'new name'`
	* - `store.$state.name = 'new name'`
	* - `store.list.push('new item')`
	*/
	MutationType["direct"] = "direct";
	/**
	* Mutated the state with `$patch` and an object
	*
	* - `store.$patch({ name: 'newName' })`
	*/
	MutationType["patchObject"] = "patch object";
	/**
	* Mutated the state with `$patch` and a function
	*
	* - `store.$patch(state => state.name = 'newName')`
	*/
	MutationType["patchFunction"] = "patch function";
})(MutationType || (MutationType = {}));
var _global = /*#__PURE__*/ (() => typeof window === "object" && window.window === window ? window : typeof self === "object" && self.self === self ? self : typeof global === "object" && global.global === global ? global : typeof globalThis === "object" ? globalThis : { HTMLElement: null })();
function bom(blob, { autoBom = false } = {}) {
	if (autoBom && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) return new Blob([String.fromCharCode(65279), blob], { type: blob.type });
	return blob;
}
function download(url, name, opts) {
	const xhr = new XMLHttpRequest();
	xhr.open("GET", url);
	xhr.responseType = "blob";
	xhr.onload = function() {
		saveAs(xhr.response, name, opts);
	};
	xhr.onerror = function() {
		console.error("could not download file");
	};
	xhr.send();
}
function corsEnabled(url) {
	const xhr = new XMLHttpRequest();
	xhr.open("HEAD", url, false);
	try {
		xhr.send();
	} catch (e) {}
	return xhr.status >= 200 && xhr.status <= 299;
}
function click(node) {
	try {
		node.dispatchEvent(new MouseEvent("click"));
	} catch (e) {
		const evt = new MouseEvent("click", {
			bubbles: true,
			cancelable: true,
			view: window,
			detail: 0,
			screenX: 80,
			screenY: 20,
			clientX: 80,
			clientY: 20,
			ctrlKey: false,
			altKey: false,
			shiftKey: false,
			metaKey: false,
			button: 0,
			relatedTarget: null
		});
		node.dispatchEvent(evt);
	}
}
var _navigator = typeof navigator === "object" ? navigator : { userAgent: "" };
var isMacOSWebView = /*#__PURE__*/ (() => /Macintosh/.test(_navigator.userAgent) && /AppleWebKit/.test(_navigator.userAgent) && !/Safari/.test(_navigator.userAgent))();
var saveAs = !IS_CLIENT ? () => {} : typeof HTMLAnchorElement !== "undefined" && "download" in HTMLAnchorElement.prototype && !isMacOSWebView ? downloadSaveAs : "msSaveOrOpenBlob" in _navigator ? msSaveAs : fileSaverSaveAs;
function downloadSaveAs(blob, name = "download", opts) {
	const a = document.createElement("a");
	a.download = name;
	a.rel = "noopener";
	if (typeof blob === "string") {
		a.href = blob;
		if (a.origin !== location.origin) if (corsEnabled(a.href)) download(blob, name, opts);
		else {
			a.target = "_blank";
			click(a);
		}
		else click(a);
	} else {
		a.href = URL.createObjectURL(blob);
		setTimeout(function() {
			URL.revokeObjectURL(a.href);
		}, 4e4);
		setTimeout(function() {
			click(a);
		}, 0);
	}
}
function msSaveAs(blob, name = "download", opts) {
	if (typeof blob === "string") if (corsEnabled(blob)) download(blob, name, opts);
	else {
		const a = document.createElement("a");
		a.href = blob;
		a.target = "_blank";
		setTimeout(function() {
			click(a);
		});
	}
	else navigator.msSaveOrOpenBlob(bom(blob, opts), name);
}
function fileSaverSaveAs(blob, name, opts, popup) {
	popup = popup || open("", "_blank");
	if (popup) popup.document.title = popup.document.body.innerText = "downloading...";
	if (typeof blob === "string") return download(blob, name, opts);
	const force = blob.type === "application/octet-stream";
	const isSafari = /constructor/i.test(String(_global.HTMLElement)) || "safari" in _global;
	const isChromeIOS = /CriOS\/[\d]+/.test(navigator.userAgent);
	if ((isChromeIOS || force && isSafari || isMacOSWebView) && typeof FileReader !== "undefined") {
		const reader = new FileReader();
		reader.onloadend = function() {
			let url = reader.result;
			if (typeof url !== "string") {
				popup = null;
				throw new Error("Wrong reader.result type");
			}
			url = isChromeIOS ? url : url.replace(/^data:[^;]*;/, "data:attachment/file;");
			if (popup) popup.location.href = url;
			else location.assign(url);
			popup = null;
		};
		reader.readAsDataURL(blob);
	} else {
		const url = URL.createObjectURL(blob);
		if (popup) popup.location.assign(url);
		else location.href = url;
		popup = null;
		setTimeout(function() {
			URL.revokeObjectURL(url);
		}, 4e4);
	}
}
var { assign: assign$1 } = Object;
/**
* Creates a Pinia instance to be used by the application
*/
function createPinia() {
	const scope = effectScope(true);
	const state = scope.run(() => ref({}));
	let _p = [];
	let toBeInstalled = [];
	const pinia = markRaw({
		install(app) {
			setActivePinia(pinia);
			pinia._a = app;
			app.provide(piniaSymbol, pinia);
			app.config.globalProperties.$pinia = pinia;
			toBeInstalled.forEach((plugin) => _p.push(plugin));
			toBeInstalled = [];
		},
		use(plugin) {
			if (!this._a) toBeInstalled.push(plugin);
			else _p.push(plugin);
			return this;
		},
		_p,
		_a: null,
		_e: scope,
		_s: /* @__PURE__ */ new Map(),
		state
	});
	return pinia;
}
var noop$1 = () => {};
function addSubscription(subscriptions, callback, detached, onCleanup = noop$1) {
	subscriptions.add(callback);
	const removeSubscription = () => {
		subscriptions.delete(callback) && onCleanup();
	};
	if (!detached && getCurrentScope()) onScopeDispose(removeSubscription);
	return removeSubscription;
}
function triggerSubscriptions(subscriptions, ...args) {
	subscriptions.forEach((callback) => {
		callback(...args);
	});
}
var fallbackRunWithContext = (fn) => fn();
/**
* Marks a function as an action for `$onAction`
* @internal
*/
var ACTION_MARKER = Symbol();
/**
* Action name symbol. Allows to add a name to an action after defining it
* @internal
*/
var ACTION_NAME = Symbol();
function mergeReactiveObjects(target, patchToApply) {
	if (target instanceof Map && patchToApply instanceof Map) patchToApply.forEach((value, key) => target.set(key, value));
	else if (target instanceof Set && patchToApply instanceof Set) patchToApply.forEach(target.add, target);
	for (const key in patchToApply) {
		if (!patchToApply.hasOwnProperty(key)) continue;
		const subPatch = patchToApply[key];
		const targetValue = target[key];
		if (isPlainObject(targetValue) && isPlainObject(subPatch) && target.hasOwnProperty(key) && !isRef(subPatch) && !isReactive(subPatch)) target[key] = mergeReactiveObjects(targetValue, subPatch);
		else target[key] = subPatch;
	}
	return target;
}
var skipHydrateSymbol = Symbol();
/**
* Returns whether a value should be hydrated
*
* @param obj - target variable
* @returns true if `obj` should be hydrated
*/
function shouldHydrate(obj) {
	return !isPlainObject(obj) || !Object.prototype.hasOwnProperty.call(obj, skipHydrateSymbol);
}
var { assign: assign$2 } = Object;
function isComputed(o) {
	return !!(isRef(o) && o.effect);
}
function createOptionsStore(id, options, pinia, hot) {
	const { state, actions, getters } = options;
	const initialState = pinia.state.value[id];
	let store;
	function setup() {
		if (!initialState && true)
 /* istanbul ignore if */
		pinia.state.value[id] = state ? state() : {};
		return assign$2(toRefs(pinia.state.value[id]), actions, Object.keys(getters || {}).reduce((computedGetters, name) => {
			computedGetters[name] = markRaw(computed(() => {
				setActivePinia(pinia);
				const store = pinia._s.get(id);
				return getters[name].call(store, store);
			}));
			return computedGetters;
		}, {}));
	}
	store = createSetupStore(id, setup, options, pinia, hot, true);
	return store;
}
function createSetupStore($id, setup, options = {}, pinia, hot, isOptionsStore) {
	let scope;
	const optionsForPlugin = assign$2({ actions: {} }, options);
	const $subscribeOptions = { deep: true };
	let isListening;
	let isSyncListening;
	let subscriptions = /* @__PURE__ */ new Set();
	let actionSubscriptions = /* @__PURE__ */ new Set();
	let debuggerEvents;
	const initialState = pinia.state.value[$id];
	if (!isOptionsStore && !initialState && true)
 /* istanbul ignore if */
	pinia.state.value[$id] = {};
	ref({});
	let activeListener;
	function $patch(partialStateOrMutator) {
		let subscriptionMutation;
		isListening = isSyncListening = false;
		if (typeof partialStateOrMutator === "function") {
			partialStateOrMutator(pinia.state.value[$id]);
			subscriptionMutation = {
				type: MutationType.patchFunction,
				storeId: $id,
				events: debuggerEvents
			};
		} else {
			mergeReactiveObjects(pinia.state.value[$id], partialStateOrMutator);
			subscriptionMutation = {
				type: MutationType.patchObject,
				payload: partialStateOrMutator,
				storeId: $id,
				events: debuggerEvents
			};
		}
		const myListenerId = activeListener = Symbol();
		nextTick().then(() => {
			if (activeListener === myListenerId) isListening = true;
		});
		isSyncListening = true;
		triggerSubscriptions(subscriptions, subscriptionMutation, pinia.state.value[$id]);
	}
	const $reset = isOptionsStore ? function $reset() {
		const { state } = options;
		const newState = state ? state() : {};
		this.$patch(($state) => {
			assign$2($state, newState);
		});
	} : noop$1;
	function $dispose() {
		scope.stop();
		subscriptions.clear();
		actionSubscriptions.clear();
		pinia._s.delete($id);
	}
	/**
	* Helper that wraps function so it can be tracked with $onAction
	* @param fn - action to wrap
	* @param name - name of the action
	*/
	const action = (fn, name = "") => {
		if (ACTION_MARKER in fn) {
			fn[ACTION_NAME] = name;
			return fn;
		}
		const wrappedAction = function() {
			setActivePinia(pinia);
			const args = Array.from(arguments);
			const afterCallbackSet = /* @__PURE__ */ new Set();
			const onErrorCallbackSet = /* @__PURE__ */ new Set();
			function after(callback) {
				afterCallbackSet.add(callback);
			}
			function onError(callback) {
				onErrorCallbackSet.add(callback);
			}
			triggerSubscriptions(actionSubscriptions, {
				args,
				name: wrappedAction[ACTION_NAME],
				store,
				after,
				onError
			});
			let ret;
			try {
				ret = fn.apply(this && this.$id === $id ? this : store, args);
			} catch (error) {
				triggerSubscriptions(onErrorCallbackSet, error);
				throw error;
			}
			if (ret instanceof Promise) return ret.then((value) => {
				triggerSubscriptions(afterCallbackSet, value);
				return value;
			}).catch((error) => {
				triggerSubscriptions(onErrorCallbackSet, error);
				return Promise.reject(error);
			});
			triggerSubscriptions(afterCallbackSet, ret);
			return ret;
		};
		wrappedAction[ACTION_MARKER] = true;
		wrappedAction[ACTION_NAME] = name;
		return wrappedAction;
	};
	const store = reactive({
		_p: pinia,
		$id,
		$onAction: addSubscription.bind(null, actionSubscriptions),
		$patch,
		$reset,
		$subscribe(callback, options = {}) {
			const removeSubscription = addSubscription(subscriptions, callback, options.detached, () => stopWatcher());
			const stopWatcher = scope.run(() => watch(() => pinia.state.value[$id], (state) => {
				if (options.flush === "sync" ? isSyncListening : isListening) callback({
					storeId: $id,
					type: MutationType.direct,
					events: debuggerEvents
				}, state);
			}, assign$2({}, $subscribeOptions, options)));
			return removeSubscription;
		},
		$dispose
	});
	pinia._s.set($id, store);
	const setupStore = (pinia._a && pinia._a.runWithContext || fallbackRunWithContext)(() => pinia._e.run(() => (scope = effectScope()).run(() => setup({ action }))));
	for (const key in setupStore) {
		const prop = setupStore[key];
		if (isRef(prop) && !isComputed(prop) || isReactive(prop)) {
			if (!isOptionsStore) {
				if (initialState && shouldHydrate(prop)) if (isRef(prop)) prop.value = initialState[key];
				else mergeReactiveObjects(prop, initialState[key]);
				pinia.state.value[$id][key] = prop;
			}
		} else if (typeof prop === "function") {
			setupStore[key] = action(prop, key);
			optionsForPlugin.actions[key] = prop;
		}
	}
	/* istanbul ignore if */
	assign$2(store, setupStore);
	assign$2(toRaw(store), setupStore);
	Object.defineProperty(store, "$state", {
		get: () => pinia.state.value[$id],
		set: (state) => {
			$patch(($state) => {
				assign$2($state, state);
			});
		}
	});
	pinia._p.forEach((extender) => {
		assign$2(store, scope.run(() => extender({
			store,
			app: pinia._a,
			pinia,
			options: optionsForPlugin
		})));
	});
	if (initialState && isOptionsStore && options.hydrate) options.hydrate(store.$state, initialState);
	isListening = true;
	isSyncListening = true;
	return store;
}
/*! #__NO_SIDE_EFFECTS__ */
function defineStore(id, setup, setupOptions) {
	let options;
	const isSetupStore = typeof setup === "function";
	options = isSetupStore ? setupOptions : setup;
	function useStore(pinia, hot) {
		const hasContext = hasInjectionContext();
		pinia = pinia || (hasContext ? inject(piniaSymbol, null) : null);
		if (pinia) setActivePinia(pinia);
		pinia = activePinia;
		if (!pinia._s.has(id)) if (isSetupStore) createSetupStore(id, setup, options, pinia);
		else createOptionsStore(id, options, pinia);
		return pinia._s.get(id);
	}
	useStore.$id = id;
	return useStore;
}
//#endregion
//#region node_modules/vue-router/dist/devtools-EWN81iOl.mjs
/*!
* vue-router v4.6.4
* (c) 2025 Eduardo San Martin Morote
* @license MIT
*/
var isBrowser = typeof document !== "undefined";
/**
* Allows differentiating lazy components from functional components and vue-class-component
* @internal
*
* @param component
*/
function isRouteComponent(component) {
	return typeof component === "object" || "displayName" in component || "props" in component || "__vccOpts" in component;
}
function isESModule(obj) {
	return obj.__esModule || obj[Symbol.toStringTag] === "Module" || obj.default && isRouteComponent(obj.default);
}
var assign = Object.assign;
function applyToParams(fn, params) {
	const newParams = {};
	for (const key in params) {
		const value = params[key];
		newParams[key] = isArray(value) ? value.map(fn) : fn(value);
	}
	return newParams;
}
var noop = () => {};
/**
* Typesafe alternative to Array.isArray
* https://github.com/microsoft/TypeScript/pull/48228
*
* @internal
*/
var isArray = Array.isArray;
function mergeOptions(defaults, partialOptions) {
	const options = {};
	for (const key in defaults) options[key] = key in partialOptions ? partialOptions[key] : defaults[key];
	return options;
}
/**
* Encoding Rules (␣ = Space)
* - Path: ␣ " < > # ? { }
* - Query: ␣ " < > # & =
* - Hash: ␣ " < > `
*
* On top of that, the RFC3986 (https://tools.ietf.org/html/rfc3986#section-2.2)
* defines some extra characters to be encoded. Most browsers do not encode them
* in encodeURI https://github.com/whatwg/url/issues/369, so it may be safer to
* also encode `!'()*`. Leaving un-encoded only ASCII alphanumeric(`a-zA-Z0-9`)
* plus `-._~`. This extra safety should be applied to query by patching the
* string returned by encodeURIComponent encodeURI also encodes `[\]^`. `\`
* should be encoded to avoid ambiguity. Browsers (IE, FF, C) transform a `\`
* into a `/` if directly typed in. The _backtick_ (`````) should also be
* encoded everywhere because some browsers like FF encode it when directly
* written while others don't. Safari and IE don't encode ``"<>{}``` in hash.
*/
var HASH_RE = /#/g;
var AMPERSAND_RE = /&/g;
var SLASH_RE = /\//g;
var EQUAL_RE = /=/g;
var IM_RE = /\?/g;
var PLUS_RE = /\+/g;
/**
* NOTE: It's not clear to me if we should encode the + symbol in queries, it
* seems to be less flexible than not doing so and I can't find out the legacy
* systems requiring this for regular requests like text/html. In the standard,
* the encoding of the plus character is only mentioned for
* application/x-www-form-urlencoded
* (https://url.spec.whatwg.org/#urlencoded-parsing) and most browsers seems lo
* leave the plus character as is in queries. To be more flexible, we allow the
* plus character on the query, but it can also be manually encoded by the user.
*
* Resources:
* - https://url.spec.whatwg.org/#urlencoded-parsing
* - https://stackoverflow.com/questions/1634271/url-encoding-the-space-character-or-20
*/
var ENC_BRACKET_OPEN_RE = /%5B/g;
var ENC_BRACKET_CLOSE_RE = /%5D/g;
var ENC_CARET_RE = /%5E/g;
var ENC_BACKTICK_RE = /%60/g;
var ENC_CURLY_OPEN_RE = /%7B/g;
var ENC_PIPE_RE = /%7C/g;
var ENC_CURLY_CLOSE_RE = /%7D/g;
var ENC_SPACE_RE = /%20/g;
/**
* Encode characters that need to be encoded on the path, search and hash
* sections of the URL.
*
* @internal
* @param text - string to encode
* @returns encoded string
*/
function commonEncode(text) {
	return text == null ? "" : encodeURI("" + text).replace(ENC_PIPE_RE, "|").replace(ENC_BRACKET_OPEN_RE, "[").replace(ENC_BRACKET_CLOSE_RE, "]");
}
/**
* Encode characters that need to be encoded on the hash section of the URL.
*
* @param text - string to encode
* @returns encoded string
*/
function encodeHash(text) {
	return commonEncode(text).replace(ENC_CURLY_OPEN_RE, "{").replace(ENC_CURLY_CLOSE_RE, "}").replace(ENC_CARET_RE, "^");
}
/**
* Encode characters that need to be encoded query values on the query
* section of the URL.
*
* @param text - string to encode
* @returns encoded string
*/
function encodeQueryValue(text) {
	return commonEncode(text).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CURLY_OPEN_RE, "{").replace(ENC_CURLY_CLOSE_RE, "}").replace(ENC_CARET_RE, "^");
}
/**
* Like `encodeQueryValue` but also encodes the `=` character.
*
* @param text - string to encode
*/
function encodeQueryKey(text) {
	return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
/**
* Encode characters that need to be encoded on the path section of the URL.
*
* @param text - string to encode
* @returns encoded string
*/
function encodePath(text) {
	return commonEncode(text).replace(HASH_RE, "%23").replace(IM_RE, "%3F");
}
/**
* Encode characters that need to be encoded on the path section of the URL as a
* param. This function encodes everything {@link encodePath} does plus the
* slash (`/`) character. If `text` is `null` or `undefined`, returns an empty
* string instead.
*
* @param text - string to encode
* @returns encoded string
*/
function encodeParam(text) {
	return encodePath(text).replace(SLASH_RE, "%2F");
}
function decode(text) {
	if (text == null) return null;
	try {
		return decodeURIComponent("" + text);
	} catch (err) {}
	return "" + text;
}
var TRAILING_SLASH_RE = /\/$/;
var removeTrailingSlash = (path) => path.replace(TRAILING_SLASH_RE, "");
/**
* Transforms a URI into a normalized history location
*
* @param parseQuery
* @param location - URI to normalize
* @param currentLocation - current absolute location. Allows resolving relative
* paths. Must start with `/`. Defaults to `/`
* @returns a normalized history location
*/
function parseURL(parseQuery$1, location, currentLocation = "/") {
	let path, query = {}, searchString = "", hash = "";
	const hashPos = location.indexOf("#");
	let searchPos = location.indexOf("?");
	searchPos = hashPos >= 0 && searchPos > hashPos ? -1 : searchPos;
	if (searchPos >= 0) {
		path = location.slice(0, searchPos);
		searchString = location.slice(searchPos, hashPos > 0 ? hashPos : location.length);
		query = parseQuery$1(searchString.slice(1));
	}
	if (hashPos >= 0) {
		path = path || location.slice(0, hashPos);
		hash = location.slice(hashPos, location.length);
	}
	path = resolveRelativePath(path != null ? path : location, currentLocation);
	return {
		fullPath: path + searchString + hash,
		path,
		query,
		hash: decode(hash)
	};
}
/**
* Stringifies a URL object
*
* @param stringifyQuery
* @param location
*/
function stringifyURL(stringifyQuery$1, location) {
	const query = location.query ? stringifyQuery$1(location.query) : "";
	return location.path + (query && "?") + query + (location.hash || "");
}
/**
* Strips off the base from the beginning of a location.pathname in a non-case-sensitive way.
*
* @param pathname - location.pathname
* @param base - base to strip off
*/
function stripBase(pathname, base) {
	if (!base || !pathname.toLowerCase().startsWith(base.toLowerCase())) return pathname;
	return pathname.slice(base.length) || "/";
}
/**
* Checks if two RouteLocation are equal. This means that both locations are
* pointing towards the same {@link RouteRecord} and that all `params`, `query`
* parameters and `hash` are the same
*
* @param stringifyQuery - A function that takes a query object of type LocationQueryRaw and returns a string representation of it.
* @param a - first {@link RouteLocation}
* @param b - second {@link RouteLocation}
*/
function isSameRouteLocation(stringifyQuery$1, a, b) {
	const aLastIndex = a.matched.length - 1;
	const bLastIndex = b.matched.length - 1;
	return aLastIndex > -1 && aLastIndex === bLastIndex && isSameRouteRecord(a.matched[aLastIndex], b.matched[bLastIndex]) && isSameRouteLocationParams(a.params, b.params) && stringifyQuery$1(a.query) === stringifyQuery$1(b.query) && a.hash === b.hash;
}
/**
* Check if two `RouteRecords` are equal. Takes into account aliases: they are
* considered equal to the `RouteRecord` they are aliasing.
*
* @param a - first {@link RouteRecord}
* @param b - second {@link RouteRecord}
*/
function isSameRouteRecord(a, b) {
	return (a.aliasOf || a) === (b.aliasOf || b);
}
function isSameRouteLocationParams(a, b) {
	if (Object.keys(a).length !== Object.keys(b).length) return false;
	for (var key in a) if (!isSameRouteLocationParamsValue(a[key], b[key])) return false;
	return true;
}
function isSameRouteLocationParamsValue(a, b) {
	return isArray(a) ? isEquivalentArray(a, b) : isArray(b) ? isEquivalentArray(b, a) : a?.valueOf() === b?.valueOf();
}
/**
* Check if two arrays are the same or if an array with one single entry is the
* same as another primitive value. Used to check query and parameters
*
* @param a - array of values
* @param b - array of values or a single value
*/
function isEquivalentArray(a, b) {
	return isArray(b) ? a.length === b.length && a.every((value, i) => value === b[i]) : a.length === 1 && a[0] === b;
}
/**
* Resolves a relative path that starts with `.`.
*
* @param to - path location we are resolving
* @param from - currentLocation.path, should start with `/`
*/
function resolveRelativePath(to, from) {
	if (to.startsWith("/")) return to;
	if (!to) return from;
	const fromSegments = from.split("/");
	const toSegments = to.split("/");
	const lastToSegment = toSegments[toSegments.length - 1];
	if (lastToSegment === ".." || lastToSegment === ".") toSegments.push("");
	let position = fromSegments.length - 1;
	let toPosition;
	let segment;
	for (toPosition = 0; toPosition < toSegments.length; toPosition++) {
		segment = toSegments[toPosition];
		if (segment === ".") continue;
		if (segment === "..") {
			if (position > 1) position--;
		} else break;
	}
	return fromSegments.slice(0, position).join("/") + "/" + toSegments.slice(toPosition).join("/");
}
/**
* Initial route location where the router is. Can be used in navigation guards
* to differentiate the initial navigation.
*
* @example
* ```js
* import { START_LOCATION } from 'vue-router'
*
* router.beforeEach((to, from) => {
*   if (from === START_LOCATION) {
*     // initial navigation
*   }
* })
* ```
*/
var START_LOCATION_NORMALIZED = {
	path: "/",
	name: void 0,
	params: {},
	query: {},
	hash: "",
	fullPath: "/",
	matched: [],
	meta: {},
	redirectedFrom: void 0
};
var NavigationType = /* @__PURE__ */ function(NavigationType$1) {
	NavigationType$1["pop"] = "pop";
	NavigationType$1["push"] = "push";
	return NavigationType$1;
}({});
var NavigationDirection = /* @__PURE__ */ function(NavigationDirection$1) {
	NavigationDirection$1["back"] = "back";
	NavigationDirection$1["forward"] = "forward";
	NavigationDirection$1["unknown"] = "";
	return NavigationDirection$1;
}({});
/**
* Normalizes a base by removing any trailing slash and reading the base tag if
* present.
*
* @param base - base to normalize
*/
function normalizeBase(base) {
	if (!base) if (isBrowser) {
		const baseEl = document.querySelector("base");
		base = baseEl && baseEl.getAttribute("href") || "/";
		base = base.replace(/^\w+:\/\/[^\/]+/, "");
	} else base = "/";
	if (base[0] !== "/" && base[0] !== "#") base = "/" + base;
	return removeTrailingSlash(base);
}
var BEFORE_HASH_RE = /^[^#]+#/;
function createHref(base, location) {
	return base.replace(BEFORE_HASH_RE, "#") + location;
}
function getElementPosition(el, offset) {
	const docRect = document.documentElement.getBoundingClientRect();
	const elRect = el.getBoundingClientRect();
	return {
		behavior: offset.behavior,
		left: elRect.left - docRect.left - (offset.left || 0),
		top: elRect.top - docRect.top - (offset.top || 0)
	};
}
var computeScrollPosition = () => ({
	left: window.scrollX,
	top: window.scrollY
});
function scrollToPosition(position) {
	let scrollToOptions;
	if ("el" in position) {
		const positionEl = position.el;
		const isIdSelector = typeof positionEl === "string" && positionEl.startsWith("#");
		const el = typeof positionEl === "string" ? isIdSelector ? document.getElementById(positionEl.slice(1)) : document.querySelector(positionEl) : positionEl;
		if (!el) return;
		scrollToOptions = getElementPosition(el, position);
	} else scrollToOptions = position;
	if ("scrollBehavior" in document.documentElement.style) window.scrollTo(scrollToOptions);
	else window.scrollTo(scrollToOptions.left != null ? scrollToOptions.left : window.scrollX, scrollToOptions.top != null ? scrollToOptions.top : window.scrollY);
}
function getScrollKey(path, delta) {
	return (history.state ? history.state.position - delta : -1) + path;
}
var scrollPositions = /* @__PURE__ */ new Map();
function saveScrollPosition(key, scrollPosition) {
	scrollPositions.set(key, scrollPosition);
}
function getSavedScrollPosition(key) {
	const scroll = scrollPositions.get(key);
	scrollPositions.delete(key);
	return scroll;
}
/**
* ScrollBehavior instance used by the router to compute and restore the scroll
* position when navigating.
*/
function isRouteLocation(route) {
	return typeof route === "string" || route && typeof route === "object";
}
function isRouteName(name) {
	return typeof name === "string" || typeof name === "symbol";
}
/**
* Flags so we can combine them when checking for multiple errors. This is the internal version of
* {@link NavigationFailureType}.
*
* @internal
*/
var ErrorTypes = /* @__PURE__ */ function(ErrorTypes$1) {
	ErrorTypes$1[ErrorTypes$1["MATCHER_NOT_FOUND"] = 1] = "MATCHER_NOT_FOUND";
	ErrorTypes$1[ErrorTypes$1["NAVIGATION_GUARD_REDIRECT"] = 2] = "NAVIGATION_GUARD_REDIRECT";
	ErrorTypes$1[ErrorTypes$1["NAVIGATION_ABORTED"] = 4] = "NAVIGATION_ABORTED";
	ErrorTypes$1[ErrorTypes$1["NAVIGATION_CANCELLED"] = 8] = "NAVIGATION_CANCELLED";
	ErrorTypes$1[ErrorTypes$1["NAVIGATION_DUPLICATED"] = 16] = "NAVIGATION_DUPLICATED";
	return ErrorTypes$1;
}({});
var NavigationFailureSymbol = Symbol("");
ErrorTypes.MATCHER_NOT_FOUND, ErrorTypes.NAVIGATION_GUARD_REDIRECT, ErrorTypes.NAVIGATION_ABORTED, ErrorTypes.NAVIGATION_CANCELLED, ErrorTypes.NAVIGATION_DUPLICATED;
/**
* Creates a typed NavigationFailure object.
* @internal
* @param type - NavigationFailureType
* @param params - { from, to }
*/
function createRouterError(type, params) {
	return assign(/* @__PURE__ */ new Error(), {
		type,
		[NavigationFailureSymbol]: true
	}, params);
}
function isNavigationFailure(error, type) {
	return error instanceof Error && NavigationFailureSymbol in error && (type == null || !!(error.type & type));
}
/**
* Transforms a queryString into a {@link LocationQuery} object. Accept both, a
* version with the leading `?` and without Should work as URLSearchParams

* @internal
*
* @param search - search string to parse
* @returns a query object
*/
function parseQuery(search) {
	const query = {};
	if (search === "" || search === "?") return query;
	const searchParams = (search[0] === "?" ? search.slice(1) : search).split("&");
	for (let i = 0; i < searchParams.length; ++i) {
		const searchParam = searchParams[i].replace(PLUS_RE, " ");
		const eqPos = searchParam.indexOf("=");
		const key = decode(eqPos < 0 ? searchParam : searchParam.slice(0, eqPos));
		const value = eqPos < 0 ? null : decode(searchParam.slice(eqPos + 1));
		if (key in query) {
			let currentValue = query[key];
			if (!isArray(currentValue)) currentValue = query[key] = [currentValue];
			currentValue.push(value);
		} else query[key] = value;
	}
	return query;
}
/**
* Stringifies a {@link LocationQueryRaw} object. Like `URLSearchParams`, it
* doesn't prepend a `?`
*
* @internal
*
* @param query - query object to stringify
* @returns string version of the query without the leading `?`
*/
function stringifyQuery(query) {
	let search = "";
	for (let key in query) {
		const value = query[key];
		key = encodeQueryKey(key);
		if (value == null) {
			if (value !== void 0) search += (search.length ? "&" : "") + key;
			continue;
		}
		(isArray(value) ? value.map((v) => v && encodeQueryValue(v)) : [value && encodeQueryValue(value)]).forEach((value$1) => {
			if (value$1 !== void 0) {
				search += (search.length ? "&" : "") + key;
				if (value$1 != null) search += "=" + value$1;
			}
		});
	}
	return search;
}
/**
* Transforms a {@link LocationQueryRaw} into a {@link LocationQuery} by casting
* numbers into strings, removing keys with an undefined value and replacing
* undefined with null in arrays
*
* @param query - query object to normalize
* @returns a normalized query object
*/
function normalizeQuery(query) {
	const normalizedQuery = {};
	for (const key in query) {
		const value = query[key];
		if (value !== void 0) normalizedQuery[key] = isArray(value) ? value.map((v) => v == null ? null : "" + v) : value == null ? value : "" + value;
	}
	return normalizedQuery;
}
/**
* RouteRecord being rendered by the closest ancestor Router View. Used for
* `onBeforeRouteUpdate` and `onBeforeRouteLeave`. rvlm stands for Router View
* Location Matched
*
* @internal
*/
var matchedRouteKey = Symbol("");
/**
* Allows overriding the router view depth to control which component in
* `matched` is rendered. rvd stands for Router View Depth
*
* @internal
*/
var viewDepthKey = Symbol("");
/**
* Allows overriding the router instance returned by `useRouter` in tests. r
* stands for router
*
* @internal
*/
var routerKey = Symbol("");
/**
* Allows overriding the current route returned by `useRoute` in tests. rl
* stands for route location
*
* @internal
*/
var routeLocationKey = Symbol("");
/**
* Allows overriding the current route used by router-view. Internally this is
* used when the `route` prop is passed.
*
* @internal
*/
var routerViewLocationKey = Symbol("");
/**
* Create a list of callbacks that can be reset. Used to create before and after navigation guards list
*/
function useCallbacks() {
	let handlers = [];
	function add(handler) {
		handlers.push(handler);
		return () => {
			const i = handlers.indexOf(handler);
			if (i > -1) handlers.splice(i, 1);
		};
	}
	function reset() {
		handlers = [];
	}
	return {
		add,
		list: () => handlers.slice(),
		reset
	};
}
function guardToPromiseFn(guard, to, from, record, name, runWithContext = (fn) => fn()) {
	const enterCallbackArray = record && (record.enterCallbacks[name] = record.enterCallbacks[name] || []);
	return () => new Promise((resolve, reject) => {
		const next = (valid) => {
			if (valid === false) reject(createRouterError(ErrorTypes.NAVIGATION_ABORTED, {
				from,
				to
			}));
			else if (valid instanceof Error) reject(valid);
			else if (isRouteLocation(valid)) reject(createRouterError(ErrorTypes.NAVIGATION_GUARD_REDIRECT, {
				from: to,
				to: valid
			}));
			else {
				if (enterCallbackArray && record.enterCallbacks[name] === enterCallbackArray && typeof valid === "function") enterCallbackArray.push(valid);
				resolve();
			}
		};
		const guardReturn = runWithContext(() => guard.call(record && record.instances[name], to, from, next));
		let guardCall = Promise.resolve(guardReturn);
		if (guard.length < 3) guardCall = guardCall.then(next);
		guardCall.catch((err) => reject(err));
	});
}
function extractComponentsGuards(matched, guardType, to, from, runWithContext = (fn) => fn()) {
	const guards = [];
	for (const record of matched) for (const name in record.components) {
		let rawComponent = record.components[name];
		if (guardType !== "beforeRouteEnter" && !record.instances[name]) continue;
		if (isRouteComponent(rawComponent)) {
			const guard = (rawComponent.__vccOpts || rawComponent)[guardType];
			guard && guards.push(guardToPromiseFn(guard, to, from, record, name, runWithContext));
		} else {
			let componentPromise = rawComponent();
			guards.push(() => componentPromise.then((resolved) => {
				if (!resolved) throw new Error(`Couldn't resolve component "${name}" at "${record.path}"`);
				const resolvedComponent = isESModule(resolved) ? resolved.default : resolved;
				record.mods[name] = resolved;
				record.components[name] = resolvedComponent;
				const guard = (resolvedComponent.__vccOpts || resolvedComponent)[guardType];
				return guard && guardToPromiseFn(guard, to, from, record, name, runWithContext)();
			}));
		}
	}
	return guards;
}
/**
* Split the leaving, updating, and entering records.
* @internal
*
* @param  to - Location we are navigating to
* @param from - Location we are navigating from
*/
function extractChangingRecords(to, from) {
	const leavingRecords = [];
	const updatingRecords = [];
	const enteringRecords = [];
	const len = Math.max(from.matched.length, to.matched.length);
	for (let i = 0; i < len; i++) {
		const recordFrom = from.matched[i];
		if (recordFrom) if (to.matched.find((record) => isSameRouteRecord(record, recordFrom))) updatingRecords.push(recordFrom);
		else leavingRecords.push(recordFrom);
		const recordTo = to.matched[i];
		if (recordTo) {
			if (!from.matched.find((record) => isSameRouteRecord(record, recordTo))) enteringRecords.push(recordTo);
		}
	}
	return [
		leavingRecords,
		updatingRecords,
		enteringRecords
	];
}
//#endregion
//#region node_modules/vue-router/dist/vue-router.mjs
/*!
* vue-router v4.6.4
* (c) 2025 Eduardo San Martin Morote
* @license MIT
*/
var createBaseLocation = () => location.protocol + "//" + location.host;
/**
* Creates a normalized history location from a window.location object
* @param base - The base path
* @param location - The window.location object
*/
function createCurrentLocation(base, location$1) {
	const { pathname, search, hash } = location$1;
	const hashPos = base.indexOf("#");
	if (hashPos > -1) {
		let slicePos = hash.includes(base.slice(hashPos)) ? base.slice(hashPos).length : 1;
		let pathFromHash = hash.slice(slicePos);
		if (pathFromHash[0] !== "/") pathFromHash = "/" + pathFromHash;
		return stripBase(pathFromHash, "");
	}
	return stripBase(pathname, base) + search + hash;
}
function useHistoryListeners(base, historyState, currentLocation, replace) {
	let listeners = [];
	let teardowns = [];
	let pauseState = null;
	const popStateHandler = ({ state }) => {
		const to = createCurrentLocation(base, location);
		const from = currentLocation.value;
		const fromState = historyState.value;
		let delta = 0;
		if (state) {
			currentLocation.value = to;
			historyState.value = state;
			if (pauseState && pauseState === from) {
				pauseState = null;
				return;
			}
			delta = fromState ? state.position - fromState.position : 0;
		} else replace(to);
		listeners.forEach((listener) => {
			listener(currentLocation.value, from, {
				delta,
				type: NavigationType.pop,
				direction: delta ? delta > 0 ? NavigationDirection.forward : NavigationDirection.back : NavigationDirection.unknown
			});
		});
	};
	function pauseListeners() {
		pauseState = currentLocation.value;
	}
	function listen(callback) {
		listeners.push(callback);
		const teardown = () => {
			const index = listeners.indexOf(callback);
			if (index > -1) listeners.splice(index, 1);
		};
		teardowns.push(teardown);
		return teardown;
	}
	function beforeUnloadListener() {
		if (document.visibilityState === "hidden") {
			const { history: history$1 } = window;
			if (!history$1.state) return;
			history$1.replaceState(assign({}, history$1.state, { scroll: computeScrollPosition() }), "");
		}
	}
	function destroy() {
		for (const teardown of teardowns) teardown();
		teardowns = [];
		window.removeEventListener("popstate", popStateHandler);
		window.removeEventListener("pagehide", beforeUnloadListener);
		document.removeEventListener("visibilitychange", beforeUnloadListener);
	}
	window.addEventListener("popstate", popStateHandler);
	window.addEventListener("pagehide", beforeUnloadListener);
	document.addEventListener("visibilitychange", beforeUnloadListener);
	return {
		pauseListeners,
		listen,
		destroy
	};
}
/**
* Creates a state object
*/
function buildState(back, current, forward, replaced = false, computeScroll = false) {
	return {
		back,
		current,
		forward,
		replaced,
		position: window.history.length,
		scroll: computeScroll ? computeScrollPosition() : null
	};
}
function useHistoryStateNavigation(base) {
	const { history: history$1, location: location$1 } = window;
	const currentLocation = { value: createCurrentLocation(base, location$1) };
	const historyState = { value: history$1.state };
	if (!historyState.value) changeLocation(currentLocation.value, {
		back: null,
		current: currentLocation.value,
		forward: null,
		position: history$1.length - 1,
		replaced: true,
		scroll: null
	}, true);
	function changeLocation(to, state, replace$1) {
		/**
		* if a base tag is provided, and we are on a normal domain, we have to
		* respect the provided `base` attribute because pushState() will use it and
		* potentially erase anything before the `#` like at
		* https://github.com/vuejs/router/issues/685 where a base of
		* `/folder/#` but a base of `/` would erase the `/folder/` section. If
		* there is no host, the `<base>` tag makes no sense and if there isn't a
		* base tag we can just use everything after the `#`.
		*/
		const hashIndex = base.indexOf("#");
		const url = hashIndex > -1 ? (location$1.host && document.querySelector("base") ? base : base.slice(hashIndex)) + to : createBaseLocation() + base + to;
		try {
			history$1[replace$1 ? "replaceState" : "pushState"](state, "", url);
			historyState.value = state;
		} catch (err) {
			console.error(err);
			location$1[replace$1 ? "replace" : "assign"](url);
		}
	}
	function replace(to, data) {
		changeLocation(to, assign({}, history$1.state, buildState(historyState.value.back, to, historyState.value.forward, true), data, { position: historyState.value.position }), true);
		currentLocation.value = to;
	}
	function push(to, data) {
		const currentState = assign({}, historyState.value, history$1.state, {
			forward: to,
			scroll: computeScrollPosition()
		});
		changeLocation(currentState.current, currentState, true);
		changeLocation(to, assign({}, buildState(currentLocation.value, to, null), { position: currentState.position + 1 }, data), false);
		currentLocation.value = to;
	}
	return {
		location: currentLocation,
		state: historyState,
		push,
		replace
	};
}
/**
* Creates an HTML5 history. Most common history for single page applications.
*
* @param base -
*/
function createWebHistory(base) {
	base = normalizeBase(base);
	const historyNavigation = useHistoryStateNavigation(base);
	const historyListeners = useHistoryListeners(base, historyNavigation.state, historyNavigation.location, historyNavigation.replace);
	function go(delta, triggerListeners = true) {
		if (!triggerListeners) historyListeners.pauseListeners();
		history.go(delta);
	}
	const routerHistory = assign({
		location: "",
		base,
		go,
		createHref: createHref.bind(null, base)
	}, historyNavigation, historyListeners);
	Object.defineProperty(routerHistory, "location", {
		enumerable: true,
		get: () => historyNavigation.location.value
	});
	Object.defineProperty(routerHistory, "state", {
		enumerable: true,
		get: () => historyNavigation.state.value
	});
	return routerHistory;
}
var TokenType = /* @__PURE__ */ function(TokenType$1) {
	TokenType$1[TokenType$1["Static"] = 0] = "Static";
	TokenType$1[TokenType$1["Param"] = 1] = "Param";
	TokenType$1[TokenType$1["Group"] = 2] = "Group";
	return TokenType$1;
}({});
var TokenizerState = /* @__PURE__ */ function(TokenizerState$1) {
	TokenizerState$1[TokenizerState$1["Static"] = 0] = "Static";
	TokenizerState$1[TokenizerState$1["Param"] = 1] = "Param";
	TokenizerState$1[TokenizerState$1["ParamRegExp"] = 2] = "ParamRegExp";
	TokenizerState$1[TokenizerState$1["ParamRegExpEnd"] = 3] = "ParamRegExpEnd";
	TokenizerState$1[TokenizerState$1["EscapeNext"] = 4] = "EscapeNext";
	return TokenizerState$1;
}(TokenizerState || {});
var ROOT_TOKEN = {
	type: TokenType.Static,
	value: ""
};
var VALID_PARAM_RE = /[a-zA-Z0-9_]/;
function tokenizePath(path) {
	if (!path) return [[]];
	if (path === "/") return [[ROOT_TOKEN]];
	if (!path.startsWith("/")) throw new Error(`Invalid path "${path}"`);
	function crash(message) {
		throw new Error(`ERR (${state})/"${buffer}": ${message}`);
	}
	let state = TokenizerState.Static;
	let previousState = state;
	const tokens = [];
	let segment;
	function finalizeSegment() {
		if (segment) tokens.push(segment);
		segment = [];
	}
	let i = 0;
	let char;
	let buffer = "";
	let customRe = "";
	function consumeBuffer() {
		if (!buffer) return;
		if (state === TokenizerState.Static) segment.push({
			type: TokenType.Static,
			value: buffer
		});
		else if (state === TokenizerState.Param || state === TokenizerState.ParamRegExp || state === TokenizerState.ParamRegExpEnd) {
			if (segment.length > 1 && (char === "*" || char === "+")) crash(`A repeatable param (${buffer}) must be alone in its segment. eg: '/:ids+.`);
			segment.push({
				type: TokenType.Param,
				value: buffer,
				regexp: customRe,
				repeatable: char === "*" || char === "+",
				optional: char === "*" || char === "?"
			});
		} else crash("Invalid state to consume buffer");
		buffer = "";
	}
	function addCharToBuffer() {
		buffer += char;
	}
	while (i < path.length) {
		char = path[i++];
		if (char === "\\" && state !== TokenizerState.ParamRegExp) {
			previousState = state;
			state = TokenizerState.EscapeNext;
			continue;
		}
		switch (state) {
			case TokenizerState.Static:
				if (char === "/") {
					if (buffer) consumeBuffer();
					finalizeSegment();
				} else if (char === ":") {
					consumeBuffer();
					state = TokenizerState.Param;
				} else addCharToBuffer();
				break;
			case TokenizerState.EscapeNext:
				addCharToBuffer();
				state = previousState;
				break;
			case TokenizerState.Param:
				if (char === "(") state = TokenizerState.ParamRegExp;
				else if (VALID_PARAM_RE.test(char)) addCharToBuffer();
				else {
					consumeBuffer();
					state = TokenizerState.Static;
					if (char !== "*" && char !== "?" && char !== "+") i--;
				}
				break;
			case TokenizerState.ParamRegExp:
				if (char === ")") if (customRe[customRe.length - 1] == "\\") customRe = customRe.slice(0, -1) + char;
				else state = TokenizerState.ParamRegExpEnd;
				else customRe += char;
				break;
			case TokenizerState.ParamRegExpEnd:
				consumeBuffer();
				state = TokenizerState.Static;
				if (char !== "*" && char !== "?" && char !== "+") i--;
				customRe = "";
				break;
			default:
				crash("Unknown state");
				break;
		}
	}
	if (state === TokenizerState.ParamRegExp) crash(`Unfinished custom RegExp for param "${buffer}"`);
	consumeBuffer();
	finalizeSegment();
	return tokens;
}
var BASE_PARAM_PATTERN = "[^/]+?";
var BASE_PATH_PARSER_OPTIONS = {
	sensitive: false,
	strict: false,
	start: true,
	end: true
};
var PathScore = /* @__PURE__ */ function(PathScore$1) {
	PathScore$1[PathScore$1["_multiplier"] = 10] = "_multiplier";
	PathScore$1[PathScore$1["Root"] = 90] = "Root";
	PathScore$1[PathScore$1["Segment"] = 40] = "Segment";
	PathScore$1[PathScore$1["SubSegment"] = 30] = "SubSegment";
	PathScore$1[PathScore$1["Static"] = 40] = "Static";
	PathScore$1[PathScore$1["Dynamic"] = 20] = "Dynamic";
	PathScore$1[PathScore$1["BonusCustomRegExp"] = 10] = "BonusCustomRegExp";
	PathScore$1[PathScore$1["BonusWildcard"] = -50] = "BonusWildcard";
	PathScore$1[PathScore$1["BonusRepeatable"] = -20] = "BonusRepeatable";
	PathScore$1[PathScore$1["BonusOptional"] = -8] = "BonusOptional";
	PathScore$1[PathScore$1["BonusStrict"] = .7000000000000001] = "BonusStrict";
	PathScore$1[PathScore$1["BonusCaseSensitive"] = .25] = "BonusCaseSensitive";
	return PathScore$1;
}(PathScore || {});
var REGEX_CHARS_RE = /[.+*?^${}()[\]/\\]/g;
/**
* Creates a path parser from an array of Segments (a segment is an array of Tokens)
*
* @param segments - array of segments returned by tokenizePath
* @param extraOptions - optional options for the regexp
* @returns a PathParser
*/
function tokensToParser(segments, extraOptions) {
	const options = assign({}, BASE_PATH_PARSER_OPTIONS, extraOptions);
	const score = [];
	let pattern = options.start ? "^" : "";
	const keys = [];
	for (const segment of segments) {
		const segmentScores = segment.length ? [] : [PathScore.Root];
		if (options.strict && !segment.length) pattern += "/";
		for (let tokenIndex = 0; tokenIndex < segment.length; tokenIndex++) {
			const token = segment[tokenIndex];
			let subSegmentScore = PathScore.Segment + (options.sensitive ? PathScore.BonusCaseSensitive : 0);
			if (token.type === TokenType.Static) {
				if (!tokenIndex) pattern += "/";
				pattern += token.value.replace(REGEX_CHARS_RE, "\\$&");
				subSegmentScore += PathScore.Static;
			} else if (token.type === TokenType.Param) {
				const { value, repeatable, optional, regexp } = token;
				keys.push({
					name: value,
					repeatable,
					optional
				});
				const re$1 = regexp ? regexp : BASE_PARAM_PATTERN;
				if (re$1 !== BASE_PARAM_PATTERN) {
					subSegmentScore += PathScore.BonusCustomRegExp;
					try {
						`${re$1}`;
					} catch (err) {
						throw new Error(`Invalid custom RegExp for param "${value}" (${re$1}): ` + err.message);
					}
				}
				let subPattern = repeatable ? `((?:${re$1})(?:/(?:${re$1}))*)` : `(${re$1})`;
				if (!tokenIndex) subPattern = optional && segment.length < 2 ? `(?:/${subPattern})` : "/" + subPattern;
				if (optional) subPattern += "?";
				pattern += subPattern;
				subSegmentScore += PathScore.Dynamic;
				if (optional) subSegmentScore += PathScore.BonusOptional;
				if (repeatable) subSegmentScore += PathScore.BonusRepeatable;
				if (re$1 === ".*") subSegmentScore += PathScore.BonusWildcard;
			}
			segmentScores.push(subSegmentScore);
		}
		score.push(segmentScores);
	}
	if (options.strict && options.end) {
		const i = score.length - 1;
		score[i][score[i].length - 1] += PathScore.BonusStrict;
	}
	if (!options.strict) pattern += "/?";
	if (options.end) pattern += "$";
	else if (options.strict && !pattern.endsWith("/")) pattern += "(?:/|$)";
	const re = new RegExp(pattern, options.sensitive ? "" : "i");
	function parse(path) {
		const match = path.match(re);
		const params = {};
		if (!match) return null;
		for (let i = 1; i < match.length; i++) {
			const value = match[i] || "";
			const key = keys[i - 1];
			params[key.name] = value && key.repeatable ? value.split("/") : value;
		}
		return params;
	}
	function stringify(params) {
		let path = "";
		let avoidDuplicatedSlash = false;
		for (const segment of segments) {
			if (!avoidDuplicatedSlash || !path.endsWith("/")) path += "/";
			avoidDuplicatedSlash = false;
			for (const token of segment) if (token.type === TokenType.Static) path += token.value;
			else if (token.type === TokenType.Param) {
				const { value, repeatable, optional } = token;
				const param = value in params ? params[value] : "";
				if (isArray(param) && !repeatable) throw new Error(`Provided param "${value}" is an array but it is not repeatable (* or + modifiers)`);
				const text = isArray(param) ? param.join("/") : param;
				if (!text) if (optional) {
					if (segment.length < 2) if (path.endsWith("/")) path = path.slice(0, -1);
					else avoidDuplicatedSlash = true;
				} else throw new Error(`Missing required param "${value}"`);
				path += text;
			}
		}
		return path || "/";
	}
	return {
		re,
		score,
		keys,
		parse,
		stringify
	};
}
/**
* Compares an array of numbers as used in PathParser.score and returns a
* number. This function can be used to `sort` an array
*
* @param a - first array of numbers
* @param b - second array of numbers
* @returns 0 if both are equal, < 0 if a should be sorted first, > 0 if b
* should be sorted first
*/
function compareScoreArray(a, b) {
	let i = 0;
	while (i < a.length && i < b.length) {
		const diff = b[i] - a[i];
		if (diff) return diff;
		i++;
	}
	if (a.length < b.length) return a.length === 1 && a[0] === PathScore.Static + PathScore.Segment ? -1 : 1;
	else if (a.length > b.length) return b.length === 1 && b[0] === PathScore.Static + PathScore.Segment ? 1 : -1;
	return 0;
}
/**
* Compare function that can be used with `sort` to sort an array of PathParser
*
* @param a - first PathParser
* @param b - second PathParser
* @returns 0 if both are equal, < 0 if a should be sorted first, > 0 if b
*/
function comparePathParserScore(a, b) {
	let i = 0;
	const aScore = a.score;
	const bScore = b.score;
	while (i < aScore.length && i < bScore.length) {
		const comp = compareScoreArray(aScore[i], bScore[i]);
		if (comp) return comp;
		i++;
	}
	if (Math.abs(bScore.length - aScore.length) === 1) {
		if (isLastScoreNegative(aScore)) return 1;
		if (isLastScoreNegative(bScore)) return -1;
	}
	return bScore.length - aScore.length;
}
/**
* This allows detecting splats at the end of a path: /home/:id(.*)*
*
* @param score - score to check
* @returns true if the last entry is negative
*/
function isLastScoreNegative(score) {
	const last = score[score.length - 1];
	return score.length > 0 && last[last.length - 1] < 0;
}
var PATH_PARSER_OPTIONS_DEFAULTS = {
	strict: false,
	end: true,
	sensitive: false
};
function createRouteRecordMatcher(record, parent, options) {
	const matcher = assign(tokensToParser(tokenizePath(record.path), options), {
		record,
		parent,
		children: [],
		alias: []
	});
	if (parent) {
		if (!matcher.record.aliasOf === !parent.record.aliasOf) parent.children.push(matcher);
	}
	return matcher;
}
/**
* Creates a Router Matcher.
*
* @internal
* @param routes - array of initial routes
* @param globalOptions - global route options
*/
function createRouterMatcher(routes, globalOptions) {
	const matchers = [];
	const matcherMap = /* @__PURE__ */ new Map();
	globalOptions = mergeOptions(PATH_PARSER_OPTIONS_DEFAULTS, globalOptions);
	function getRecordMatcher(name) {
		return matcherMap.get(name);
	}
	function addRoute(record, parent, originalRecord) {
		const isRootAdd = !originalRecord;
		const mainNormalizedRecord = normalizeRouteRecord(record);
		mainNormalizedRecord.aliasOf = originalRecord && originalRecord.record;
		const options = mergeOptions(globalOptions, record);
		const normalizedRecords = [mainNormalizedRecord];
		if ("alias" in record) {
			const aliases = typeof record.alias === "string" ? [record.alias] : record.alias;
			for (const alias of aliases) normalizedRecords.push(normalizeRouteRecord(assign({}, mainNormalizedRecord, {
				components: originalRecord ? originalRecord.record.components : mainNormalizedRecord.components,
				path: alias,
				aliasOf: originalRecord ? originalRecord.record : mainNormalizedRecord
			})));
		}
		let matcher;
		let originalMatcher;
		for (const normalizedRecord of normalizedRecords) {
			const { path } = normalizedRecord;
			if (parent && path[0] !== "/") {
				const parentPath = parent.record.path;
				const connectingSlash = parentPath[parentPath.length - 1] === "/" ? "" : "/";
				normalizedRecord.path = parent.record.path + (path && connectingSlash + path);
			}
			matcher = createRouteRecordMatcher(normalizedRecord, parent, options);
			if (originalRecord) originalRecord.alias.push(matcher);
			else {
				originalMatcher = originalMatcher || matcher;
				if (originalMatcher !== matcher) originalMatcher.alias.push(matcher);
				if (isRootAdd && record.name && !isAliasRecord(matcher)) removeRoute(record.name);
			}
			if (isMatchable(matcher)) insertMatcher(matcher);
			if (mainNormalizedRecord.children) {
				const children = mainNormalizedRecord.children;
				for (let i = 0; i < children.length; i++) addRoute(children[i], matcher, originalRecord && originalRecord.children[i]);
			}
			originalRecord = originalRecord || matcher;
		}
		return originalMatcher ? () => {
			removeRoute(originalMatcher);
		} : noop;
	}
	function removeRoute(matcherRef) {
		if (isRouteName(matcherRef)) {
			const matcher = matcherMap.get(matcherRef);
			if (matcher) {
				matcherMap.delete(matcherRef);
				matchers.splice(matchers.indexOf(matcher), 1);
				matcher.children.forEach(removeRoute);
				matcher.alias.forEach(removeRoute);
			}
		} else {
			const index = matchers.indexOf(matcherRef);
			if (index > -1) {
				matchers.splice(index, 1);
				if (matcherRef.record.name) matcherMap.delete(matcherRef.record.name);
				matcherRef.children.forEach(removeRoute);
				matcherRef.alias.forEach(removeRoute);
			}
		}
	}
	function getRoutes() {
		return matchers;
	}
	function insertMatcher(matcher) {
		const index = findInsertionIndex(matcher, matchers);
		matchers.splice(index, 0, matcher);
		if (matcher.record.name && !isAliasRecord(matcher)) matcherMap.set(matcher.record.name, matcher);
	}
	function resolve(location$1, currentLocation) {
		let matcher;
		let params = {};
		let path;
		let name;
		if ("name" in location$1 && location$1.name) {
			matcher = matcherMap.get(location$1.name);
			if (!matcher) throw createRouterError(ErrorTypes.MATCHER_NOT_FOUND, { location: location$1 });
			name = matcher.record.name;
			params = assign(pickParams(currentLocation.params, matcher.keys.filter((k) => !k.optional).concat(matcher.parent ? matcher.parent.keys.filter((k) => k.optional) : []).map((k) => k.name)), location$1.params && pickParams(location$1.params, matcher.keys.map((k) => k.name)));
			path = matcher.stringify(params);
		} else if (location$1.path != null) {
			path = location$1.path;
			matcher = matchers.find((m) => m.re.test(path));
			if (matcher) {
				params = matcher.parse(path);
				name = matcher.record.name;
			}
		} else {
			matcher = currentLocation.name ? matcherMap.get(currentLocation.name) : matchers.find((m) => m.re.test(currentLocation.path));
			if (!matcher) throw createRouterError(ErrorTypes.MATCHER_NOT_FOUND, {
				location: location$1,
				currentLocation
			});
			name = matcher.record.name;
			params = assign({}, currentLocation.params, location$1.params);
			path = matcher.stringify(params);
		}
		const matched = [];
		let parentMatcher = matcher;
		while (parentMatcher) {
			matched.unshift(parentMatcher.record);
			parentMatcher = parentMatcher.parent;
		}
		return {
			name,
			path,
			params,
			matched,
			meta: mergeMetaFields(matched)
		};
	}
	routes.forEach((route) => addRoute(route));
	function clearRoutes() {
		matchers.length = 0;
		matcherMap.clear();
	}
	return {
		addRoute,
		resolve,
		removeRoute,
		clearRoutes,
		getRoutes,
		getRecordMatcher
	};
}
/**
* Picks an object param to contain only specified keys.
*
* @param params - params object to pick from
* @param keys - keys to pick
*/
function pickParams(params, keys) {
	const newParams = {};
	for (const key of keys) if (key in params) newParams[key] = params[key];
	return newParams;
}
/**
* Normalizes a RouteRecordRaw. Creates a copy
*
* @param record
* @returns the normalized version
*/
function normalizeRouteRecord(record) {
	const normalized = {
		path: record.path,
		redirect: record.redirect,
		name: record.name,
		meta: record.meta || {},
		aliasOf: record.aliasOf,
		beforeEnter: record.beforeEnter,
		props: normalizeRecordProps(record),
		children: record.children || [],
		instances: {},
		leaveGuards: /* @__PURE__ */ new Set(),
		updateGuards: /* @__PURE__ */ new Set(),
		enterCallbacks: {},
		components: "components" in record ? record.components || null : record.component && { default: record.component }
	};
	Object.defineProperty(normalized, "mods", { value: {} });
	return normalized;
}
/**
* Normalize the optional `props` in a record to always be an object similar to
* components. Also accept a boolean for components.
* @param record
*/
function normalizeRecordProps(record) {
	const propsObject = {};
	const props = record.props || false;
	if ("component" in record) propsObject.default = props;
	else for (const name in record.components) propsObject[name] = typeof props === "object" ? props[name] : props;
	return propsObject;
}
/**
* Checks if a record or any of its parent is an alias
* @param record
*/
function isAliasRecord(record) {
	while (record) {
		if (record.record.aliasOf) return true;
		record = record.parent;
	}
	return false;
}
/**
* Merge meta fields of an array of records
*
* @param matched - array of matched records
*/
function mergeMetaFields(matched) {
	return matched.reduce((meta, record) => assign(meta, record.meta), {});
}
/**
* Performs a binary search to find the correct insertion index for a new matcher.
*
* Matchers are primarily sorted by their score. If scores are tied then we also consider parent/child relationships,
* with descendants coming before ancestors. If there's still a tie, new routes are inserted after existing routes.
*
* @param matcher - new matcher to be inserted
* @param matchers - existing matchers
*/
function findInsertionIndex(matcher, matchers) {
	let lower = 0;
	let upper = matchers.length;
	while (lower !== upper) {
		const mid = lower + upper >> 1;
		if (comparePathParserScore(matcher, matchers[mid]) < 0) upper = mid;
		else lower = mid + 1;
	}
	const insertionAncestor = getInsertionAncestor(matcher);
	if (insertionAncestor) upper = matchers.lastIndexOf(insertionAncestor, upper - 1);
	return upper;
}
function getInsertionAncestor(matcher) {
	let ancestor = matcher;
	while (ancestor = ancestor.parent) if (isMatchable(ancestor) && comparePathParserScore(matcher, ancestor) === 0) return ancestor;
}
/**
* Checks if a matcher can be reachable. This means if it's possible to reach it as a route. For example, routes without
* a component, or name, or redirect, are just used to group other routes.
* @param matcher
* @param matcher.record record of the matcher
* @returns
*/
function isMatchable({ record }) {
	return !!(record.name || record.components && Object.keys(record.components).length || record.redirect);
}
/**
* Returns the internal behavior of a {@link RouterLink} without the rendering part.
*
* @param props - a `to` location and an optional `replace` flag
*/
function useLink(props) {
	const router = inject(routerKey);
	const currentRoute = inject(routeLocationKey);
	const route = computed(() => {
		const to = unref(props.to);
		return router.resolve(to);
	});
	const activeRecordIndex = computed(() => {
		const { matched } = route.value;
		const { length } = matched;
		const routeMatched = matched[length - 1];
		const currentMatched = currentRoute.matched;
		if (!routeMatched || !currentMatched.length) return -1;
		const index = currentMatched.findIndex(isSameRouteRecord.bind(null, routeMatched));
		if (index > -1) return index;
		const parentRecordPath = getOriginalPath(matched[length - 2]);
		return length > 1 && getOriginalPath(routeMatched) === parentRecordPath && currentMatched[currentMatched.length - 1].path !== parentRecordPath ? currentMatched.findIndex(isSameRouteRecord.bind(null, matched[length - 2])) : index;
	});
	const isActive = computed(() => activeRecordIndex.value > -1 && includesParams(currentRoute.params, route.value.params));
	const isExactActive = computed(() => activeRecordIndex.value > -1 && activeRecordIndex.value === currentRoute.matched.length - 1 && isSameRouteLocationParams(currentRoute.params, route.value.params));
	function navigate(e = {}) {
		if (guardEvent(e)) {
			const p = router[unref(props.replace) ? "replace" : "push"](unref(props.to)).catch(noop);
			if (props.viewTransition && typeof document !== "undefined" && "startViewTransition" in document) document.startViewTransition(() => p);
			return p;
		}
		return Promise.resolve();
	}
	/**
	* NOTE: update {@link _RouterLinkI}'s `$slots` type when updating this
	*/
	return {
		route,
		href: computed(() => route.value.href),
		isActive,
		isExactActive,
		navigate
	};
}
function preferSingleVNode(vnodes) {
	return vnodes.length === 1 ? vnodes[0] : vnodes;
}
/**
* Component to render a link that triggers a navigation on click.
*/
var RouterLink = /* @__PURE__ */ defineComponent({
	name: "RouterLink",
	compatConfig: { MODE: 3 },
	props: {
		to: {
			type: [String, Object],
			required: true
		},
		replace: Boolean,
		activeClass: String,
		exactActiveClass: String,
		custom: Boolean,
		ariaCurrentValue: {
			type: String,
			default: "page"
		},
		viewTransition: Boolean
	},
	useLink,
	setup(props, { slots }) {
		const link = reactive(useLink(props));
		const { options } = inject(routerKey);
		const elClass = computed(() => ({
			[getLinkClass(props.activeClass, options.linkActiveClass, "router-link-active")]: link.isActive,
			[getLinkClass(props.exactActiveClass, options.linkExactActiveClass, "router-link-exact-active")]: link.isExactActive
		}));
		return () => {
			const children = slots.default && preferSingleVNode(slots.default(link));
			return props.custom ? children : h("a", {
				"aria-current": link.isExactActive ? props.ariaCurrentValue : null,
				href: link.href,
				onClick: link.navigate,
				class: elClass.value
			}, children);
		};
	}
});
function guardEvent(e) {
	if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) return;
	if (e.defaultPrevented) return;
	if (e.button !== void 0 && e.button !== 0) return;
	if (e.currentTarget && e.currentTarget.getAttribute) {
		const target = e.currentTarget.getAttribute("target");
		if (/\b_blank\b/i.test(target)) return;
	}
	if (e.preventDefault) e.preventDefault();
	return true;
}
function includesParams(outer, inner) {
	for (const key in inner) {
		const innerValue = inner[key];
		const outerValue = outer[key];
		if (typeof innerValue === "string") {
			if (innerValue !== outerValue) return false;
		} else if (!isArray(outerValue) || outerValue.length !== innerValue.length || innerValue.some((value, i) => value.valueOf() !== outerValue[i].valueOf())) return false;
	}
	return true;
}
/**
* Get the original path value of a record by following its aliasOf
* @param record
*/
function getOriginalPath(record) {
	return record ? record.aliasOf ? record.aliasOf.path : record.path : "";
}
/**
* Utility class to get the active class based on defaults.
* @param propClass
* @param globalClass
* @param defaultClass
*/
var getLinkClass = (propClass, globalClass, defaultClass) => propClass != null ? propClass : globalClass != null ? globalClass : defaultClass;
var RouterViewImpl = /* @__PURE__ */ defineComponent({
	name: "RouterView",
	inheritAttrs: false,
	props: {
		name: {
			type: String,
			default: "default"
		},
		route: Object
	},
	compatConfig: { MODE: 3 },
	setup(props, { attrs, slots }) {
		const injectedRoute = inject(routerViewLocationKey);
		const routeToDisplay = computed(() => props.route || injectedRoute.value);
		const injectedDepth = inject(viewDepthKey, 0);
		const depth = computed(() => {
			let initialDepth = unref(injectedDepth);
			const { matched } = routeToDisplay.value;
			let matchedRoute;
			while ((matchedRoute = matched[initialDepth]) && !matchedRoute.components) initialDepth++;
			return initialDepth;
		});
		const matchedRouteRef = computed(() => routeToDisplay.value.matched[depth.value]);
		provide(viewDepthKey, computed(() => depth.value + 1));
		provide(matchedRouteKey, matchedRouteRef);
		provide(routerViewLocationKey, routeToDisplay);
		const viewRef = ref();
		watch(() => [
			viewRef.value,
			matchedRouteRef.value,
			props.name
		], ([instance, to, name], [oldInstance, from, oldName]) => {
			if (to) {
				to.instances[name] = instance;
				if (from && from !== to && instance && instance === oldInstance) {
					if (!to.leaveGuards.size) to.leaveGuards = from.leaveGuards;
					if (!to.updateGuards.size) to.updateGuards = from.updateGuards;
				}
			}
			if (instance && to && (!from || !isSameRouteRecord(to, from) || !oldInstance)) (to.enterCallbacks[name] || []).forEach((callback) => callback(instance));
		}, { flush: "post" });
		return () => {
			const route = routeToDisplay.value;
			const currentName = props.name;
			const matchedRoute = matchedRouteRef.value;
			const ViewComponent = matchedRoute && matchedRoute.components[currentName];
			if (!ViewComponent) return normalizeSlot(slots.default, {
				Component: ViewComponent,
				route
			});
			const routePropsOption = matchedRoute.props[currentName];
			const routeProps = routePropsOption ? routePropsOption === true ? route.params : typeof routePropsOption === "function" ? routePropsOption(route) : routePropsOption : null;
			const onVnodeUnmounted = (vnode) => {
				if (vnode.component.isUnmounted) matchedRoute.instances[currentName] = null;
			};
			const component = h(ViewComponent, assign({}, routeProps, attrs, {
				onVnodeUnmounted,
				ref: viewRef
			}));
			return normalizeSlot(slots.default, {
				Component: component,
				route
			}) || component;
		};
	}
});
function normalizeSlot(slot, data) {
	if (!slot) return null;
	const slotContent = slot(data);
	return slotContent.length === 1 ? slotContent[0] : slotContent;
}
/**
* Component to display the current route the user is at.
*/
var RouterView = RouterViewImpl;
/**
* Creates a Router instance that can be used by a Vue app.
*
* @param options - {@link RouterOptions}
*/
function createRouter(options) {
	const matcher = createRouterMatcher(options.routes, options);
	const parseQuery$1 = options.parseQuery || parseQuery;
	const stringifyQuery$1 = options.stringifyQuery || stringifyQuery;
	const routerHistory = options.history;
	const beforeGuards = useCallbacks();
	const beforeResolveGuards = useCallbacks();
	const afterGuards = useCallbacks();
	const currentRoute = shallowRef(START_LOCATION_NORMALIZED);
	let pendingLocation = START_LOCATION_NORMALIZED;
	if (isBrowser && options.scrollBehavior && "scrollRestoration" in history) history.scrollRestoration = "manual";
	const normalizeParams = applyToParams.bind(null, (paramValue) => "" + paramValue);
	const encodeParams = applyToParams.bind(null, encodeParam);
	const decodeParams = applyToParams.bind(null, decode);
	function addRoute(parentOrRoute, route) {
		let parent;
		let record;
		if (isRouteName(parentOrRoute)) {
			parent = matcher.getRecordMatcher(parentOrRoute);
			record = route;
		} else record = parentOrRoute;
		return matcher.addRoute(record, parent);
	}
	function removeRoute(name) {
		const recordMatcher = matcher.getRecordMatcher(name);
		if (recordMatcher) matcher.removeRoute(recordMatcher);
	}
	function getRoutes() {
		return matcher.getRoutes().map((routeMatcher) => routeMatcher.record);
	}
	function hasRoute(name) {
		return !!matcher.getRecordMatcher(name);
	}
	function resolve(rawLocation, currentLocation) {
		currentLocation = assign({}, currentLocation || currentRoute.value);
		if (typeof rawLocation === "string") {
			const locationNormalized = parseURL(parseQuery$1, rawLocation, currentLocation.path);
			const matchedRoute$1 = matcher.resolve({ path: locationNormalized.path }, currentLocation);
			const href$1 = routerHistory.createHref(locationNormalized.fullPath);
			return assign(locationNormalized, matchedRoute$1, {
				params: decodeParams(matchedRoute$1.params),
				hash: decode(locationNormalized.hash),
				redirectedFrom: void 0,
				href: href$1
			});
		}
		let matcherLocation;
		if (rawLocation.path != null) matcherLocation = assign({}, rawLocation, { path: parseURL(parseQuery$1, rawLocation.path, currentLocation.path).path });
		else {
			const targetParams = assign({}, rawLocation.params);
			for (const key in targetParams) if (targetParams[key] == null) delete targetParams[key];
			matcherLocation = assign({}, rawLocation, { params: encodeParams(targetParams) });
			currentLocation.params = encodeParams(currentLocation.params);
		}
		const matchedRoute = matcher.resolve(matcherLocation, currentLocation);
		const hash = rawLocation.hash || "";
		matchedRoute.params = normalizeParams(decodeParams(matchedRoute.params));
		const fullPath = stringifyURL(stringifyQuery$1, assign({}, rawLocation, {
			hash: encodeHash(hash),
			path: matchedRoute.path
		}));
		const href = routerHistory.createHref(fullPath);
		return assign({
			fullPath,
			hash,
			query: stringifyQuery$1 === stringifyQuery ? normalizeQuery(rawLocation.query) : rawLocation.query || {}
		}, matchedRoute, {
			redirectedFrom: void 0,
			href
		});
	}
	function locationAsObject(to) {
		return typeof to === "string" ? parseURL(parseQuery$1, to, currentRoute.value.path) : assign({}, to);
	}
	function checkCanceledNavigation(to, from) {
		if (pendingLocation !== to) return createRouterError(ErrorTypes.NAVIGATION_CANCELLED, {
			from,
			to
		});
	}
	function push(to) {
		return pushWithRedirect(to);
	}
	function replace(to) {
		return push(assign(locationAsObject(to), { replace: true }));
	}
	function handleRedirectRecord(to, from) {
		const lastMatched = to.matched[to.matched.length - 1];
		if (lastMatched && lastMatched.redirect) {
			const { redirect } = lastMatched;
			let newTargetLocation = typeof redirect === "function" ? redirect(to, from) : redirect;
			if (typeof newTargetLocation === "string") {
				newTargetLocation = newTargetLocation.includes("?") || newTargetLocation.includes("#") ? newTargetLocation = locationAsObject(newTargetLocation) : { path: newTargetLocation };
				newTargetLocation.params = {};
			}
			return assign({
				query: to.query,
				hash: to.hash,
				params: newTargetLocation.path != null ? {} : to.params
			}, newTargetLocation);
		}
	}
	function pushWithRedirect(to, redirectedFrom) {
		const targetLocation = pendingLocation = resolve(to);
		const from = currentRoute.value;
		const data = to.state;
		const force = to.force;
		const replace$1 = to.replace === true;
		const shouldRedirect = handleRedirectRecord(targetLocation, from);
		if (shouldRedirect) return pushWithRedirect(assign(locationAsObject(shouldRedirect), {
			state: typeof shouldRedirect === "object" ? assign({}, data, shouldRedirect.state) : data,
			force,
			replace: replace$1
		}), redirectedFrom || targetLocation);
		const toLocation = targetLocation;
		toLocation.redirectedFrom = redirectedFrom;
		let failure;
		if (!force && isSameRouteLocation(stringifyQuery$1, from, targetLocation)) {
			failure = createRouterError(ErrorTypes.NAVIGATION_DUPLICATED, {
				to: toLocation,
				from
			});
			handleScroll(from, from, true, false);
		}
		return (failure ? Promise.resolve(failure) : navigate(toLocation, from)).catch((error) => isNavigationFailure(error) ? isNavigationFailure(error, ErrorTypes.NAVIGATION_GUARD_REDIRECT) ? error : markAsReady(error) : triggerError(error, toLocation, from)).then((failure$1) => {
			if (failure$1) {
				if (isNavigationFailure(failure$1, ErrorTypes.NAVIGATION_GUARD_REDIRECT)) return pushWithRedirect(assign({ replace: replace$1 }, locationAsObject(failure$1.to), {
					state: typeof failure$1.to === "object" ? assign({}, data, failure$1.to.state) : data,
					force
				}), redirectedFrom || toLocation);
			} else failure$1 = finalizeNavigation(toLocation, from, true, replace$1, data);
			triggerAfterEach(toLocation, from, failure$1);
			return failure$1;
		});
	}
	/**
	* Helper to reject and skip all navigation guards if a new navigation happened
	* @param to
	* @param from
	*/
	function checkCanceledNavigationAndReject(to, from) {
		const error = checkCanceledNavigation(to, from);
		return error ? Promise.reject(error) : Promise.resolve();
	}
	function runWithContext(fn) {
		const app = installedApps.values().next().value;
		return app && typeof app.runWithContext === "function" ? app.runWithContext(fn) : fn();
	}
	function navigate(to, from) {
		let guards;
		const [leavingRecords, updatingRecords, enteringRecords] = extractChangingRecords(to, from);
		guards = extractComponentsGuards(leavingRecords.reverse(), "beforeRouteLeave", to, from);
		for (const record of leavingRecords) record.leaveGuards.forEach((guard) => {
			guards.push(guardToPromiseFn(guard, to, from));
		});
		const canceledNavigationCheck = checkCanceledNavigationAndReject.bind(null, to, from);
		guards.push(canceledNavigationCheck);
		return runGuardQueue(guards).then(() => {
			guards = [];
			for (const guard of beforeGuards.list()) guards.push(guardToPromiseFn(guard, to, from));
			guards.push(canceledNavigationCheck);
			return runGuardQueue(guards);
		}).then(() => {
			guards = extractComponentsGuards(updatingRecords, "beforeRouteUpdate", to, from);
			for (const record of updatingRecords) record.updateGuards.forEach((guard) => {
				guards.push(guardToPromiseFn(guard, to, from));
			});
			guards.push(canceledNavigationCheck);
			return runGuardQueue(guards);
		}).then(() => {
			guards = [];
			for (const record of enteringRecords) if (record.beforeEnter) if (isArray(record.beforeEnter)) for (const beforeEnter of record.beforeEnter) guards.push(guardToPromiseFn(beforeEnter, to, from));
			else guards.push(guardToPromiseFn(record.beforeEnter, to, from));
			guards.push(canceledNavigationCheck);
			return runGuardQueue(guards);
		}).then(() => {
			to.matched.forEach((record) => record.enterCallbacks = {});
			guards = extractComponentsGuards(enteringRecords, "beforeRouteEnter", to, from, runWithContext);
			guards.push(canceledNavigationCheck);
			return runGuardQueue(guards);
		}).then(() => {
			guards = [];
			for (const guard of beforeResolveGuards.list()) guards.push(guardToPromiseFn(guard, to, from));
			guards.push(canceledNavigationCheck);
			return runGuardQueue(guards);
		}).catch((err) => isNavigationFailure(err, ErrorTypes.NAVIGATION_CANCELLED) ? err : Promise.reject(err));
	}
	function triggerAfterEach(to, from, failure) {
		afterGuards.list().forEach((guard) => runWithContext(() => guard(to, from, failure)));
	}
	/**
	* - Cleans up any navigation guards
	* - Changes the url if necessary
	* - Calls the scrollBehavior
	*/
	function finalizeNavigation(toLocation, from, isPush, replace$1, data) {
		const error = checkCanceledNavigation(toLocation, from);
		if (error) return error;
		const isFirstNavigation = from === START_LOCATION_NORMALIZED;
		const state = !isBrowser ? {} : history.state;
		if (isPush) if (replace$1 || isFirstNavigation) routerHistory.replace(toLocation.fullPath, assign({ scroll: isFirstNavigation && state && state.scroll }, data));
		else routerHistory.push(toLocation.fullPath, data);
		currentRoute.value = toLocation;
		handleScroll(toLocation, from, isPush, isFirstNavigation);
		markAsReady();
	}
	let removeHistoryListener;
	function setupListeners() {
		if (removeHistoryListener) return;
		removeHistoryListener = routerHistory.listen((to, _from, info) => {
			if (!router.listening) return;
			const toLocation = resolve(to);
			const shouldRedirect = handleRedirectRecord(toLocation, router.currentRoute.value);
			if (shouldRedirect) {
				pushWithRedirect(assign(shouldRedirect, {
					replace: true,
					force: true
				}), toLocation).catch(noop);
				return;
			}
			pendingLocation = toLocation;
			const from = currentRoute.value;
			if (isBrowser) saveScrollPosition(getScrollKey(from.fullPath, info.delta), computeScrollPosition());
			navigate(toLocation, from).catch((error) => {
				if (isNavigationFailure(error, ErrorTypes.NAVIGATION_ABORTED | ErrorTypes.NAVIGATION_CANCELLED)) return error;
				if (isNavigationFailure(error, ErrorTypes.NAVIGATION_GUARD_REDIRECT)) {
					pushWithRedirect(assign(locationAsObject(error.to), { force: true }), toLocation).then((failure) => {
						if (isNavigationFailure(failure, ErrorTypes.NAVIGATION_ABORTED | ErrorTypes.NAVIGATION_DUPLICATED) && !info.delta && info.type === NavigationType.pop) routerHistory.go(-1, false);
					}).catch(noop);
					return Promise.reject();
				}
				if (info.delta) routerHistory.go(-info.delta, false);
				return triggerError(error, toLocation, from);
			}).then((failure) => {
				failure = failure || finalizeNavigation(toLocation, from, false);
				if (failure) {
					if (info.delta && !isNavigationFailure(failure, ErrorTypes.NAVIGATION_CANCELLED)) routerHistory.go(-info.delta, false);
					else if (info.type === NavigationType.pop && isNavigationFailure(failure, ErrorTypes.NAVIGATION_ABORTED | ErrorTypes.NAVIGATION_DUPLICATED)) routerHistory.go(-1, false);
				}
				triggerAfterEach(toLocation, from, failure);
			}).catch(noop);
		});
	}
	let readyHandlers = useCallbacks();
	let errorListeners = useCallbacks();
	let ready;
	/**
	* Trigger errorListeners added via onError and throws the error as well
	*
	* @param error - error to throw
	* @param to - location we were navigating to when the error happened
	* @param from - location we were navigating from when the error happened
	* @returns the error as a rejected promise
	*/
	function triggerError(error, to, from) {
		markAsReady(error);
		const list = errorListeners.list();
		if (list.length) list.forEach((handler) => handler(error, to, from));
		else console.error(error);
		return Promise.reject(error);
	}
	function isReady() {
		if (ready && currentRoute.value !== START_LOCATION_NORMALIZED) return Promise.resolve();
		return new Promise((resolve$1, reject) => {
			readyHandlers.add([resolve$1, reject]);
		});
	}
	function markAsReady(err) {
		if (!ready) {
			ready = !err;
			setupListeners();
			readyHandlers.list().forEach(([resolve$1, reject]) => err ? reject(err) : resolve$1());
			readyHandlers.reset();
		}
		return err;
	}
	function handleScroll(to, from, isPush, isFirstNavigation) {
		const { scrollBehavior } = options;
		if (!isBrowser || !scrollBehavior) return Promise.resolve();
		const scrollPosition = !isPush && getSavedScrollPosition(getScrollKey(to.fullPath, 0)) || (isFirstNavigation || !isPush) && history.state && history.state.scroll || null;
		return nextTick().then(() => scrollBehavior(to, from, scrollPosition)).then((position) => position && scrollToPosition(position)).catch((err) => triggerError(err, to, from));
	}
	const go = (delta) => routerHistory.go(delta);
	let started;
	const installedApps = /* @__PURE__ */ new Set();
	const router = {
		currentRoute,
		listening: true,
		addRoute,
		removeRoute,
		clearRoutes: matcher.clearRoutes,
		hasRoute,
		getRoutes,
		resolve,
		options,
		push,
		replace,
		go,
		back: () => go(-1),
		forward: () => go(1),
		beforeEach: beforeGuards.add,
		beforeResolve: beforeResolveGuards.add,
		afterEach: afterGuards.add,
		onError: errorListeners.add,
		isReady,
		install(app) {
			app.component("RouterLink", RouterLink);
			app.component("RouterView", RouterView);
			app.config.globalProperties.$router = router;
			Object.defineProperty(app.config.globalProperties, "$route", {
				enumerable: true,
				get: () => unref(currentRoute)
			});
			if (isBrowser && !started && currentRoute.value === START_LOCATION_NORMALIZED) {
				started = true;
				push(routerHistory.location).catch((err) => {});
			}
			const reactiveRoute = {};
			for (const key in START_LOCATION_NORMALIZED) Object.defineProperty(reactiveRoute, key, {
				get: () => currentRoute.value[key],
				enumerable: true
			});
			app.provide(routerKey, router);
			app.provide(routeLocationKey, shallowReactive(reactiveRoute));
			app.provide(routerViewLocationKey, currentRoute);
			const unmountApp = app.unmount;
			installedApps.add(app);
			app.unmount = function() {
				installedApps.delete(app);
				if (installedApps.size < 1) {
					pendingLocation = START_LOCATION_NORMALIZED;
					removeHistoryListener && removeHistoryListener();
					removeHistoryListener = null;
					currentRoute.value = START_LOCATION_NORMALIZED;
					started = false;
					ready = false;
				}
				unmountApp();
			};
		}
	};
	function runGuardQueue(guards) {
		return guards.reduce((promise, guard) => promise.then(() => runWithContext(guard)), Promise.resolve());
	}
	return router;
}
/**
* Returns the router instance. Equivalent to using `$router` inside
* templates.
*/
function useRouter() {
	return inject(routerKey);
}
/**
* Returns the current route location. Equivalent to using `$route` inside
* templates.
*/
function useRoute(_name) {
	return inject(routeLocationKey);
}
//#endregion
//#region src/stores/auth.js
var useAuthStore = defineStore("auth", () => {
	const user = ref(null);
	const loading = ref(false);
	const isLoggedIn = computed(() => !!user.value);
	const normalizedRole = computed(() => String(user.value?.role || "").toUpperCase());
	const isAdmin = computed(() => ["ADMIN", "ROLE_ADMIN"].includes(normalizedRole.value));
	const isUser = computed(() => ["USER", "ROLE_USER"].includes(normalizedRole.value));
	async function fetchUser() {
		loading.value = true;
		try {
			const { data } = await authApi.me();
			if (data.success) {
				user.value = data;
				return true;
			}
			user.value = null;
			return false;
		} catch {
			user.value = null;
			return false;
		} finally {
			loading.value = false;
		}
	}
	async function login(username, password) {
		const { data } = await authApi.login(username, password);
		if (data.success) user.value = {
			username: data.username,
			fullname: data.fullname,
			email: data.email,
			role: data.role,
			success: true
		};
		return data;
	}
	async function logout() {
		try {
			await authApi.logout();
		} finally {
			user.value = null;
		}
	}
	function updateCurrentUser(updatedUser) {
		if (!user.value || user.value.username !== updatedUser?.username) return;
		user.value = {
			...user.value,
			...updatedUser
		};
	}
	return {
		user,
		loading,
		isLoggedIn,
		isAdmin,
		isUser,
		fetchUser,
		login,
		logout,
		updateCurrentUser
	};
});
//#endregion
//#region src/stores/cart.js
var useCartStore = defineStore("cart", () => {
	const itemCount = ref(0);
	function setItems(items) {
		itemCount.value = (Array.isArray(items) ? items : []).reduce((sum, item) => sum + Number(item.quantity || 0), 0);
	}
	async function refresh() {
		try {
			const { data } = await cartApi.get();
			setItems(data.items);
			return data;
		} catch {
			return null;
		}
	}
	function reset() {
		itemCount.value = 0;
	}
	return {
		itemCount,
		refresh,
		reset,
		setItems
	};
});
//#endregion
//#region \0plugin-vue:export-helper
var _plugin_vue_export_helper_default = (sfc, props) => {
	const target = sfc.__vccOpts || sfc;
	for (const [key, val] of props) target[key] = val;
	return target;
};
//#endregion
//#region src/components/AppHeader.vue
var _hoisted_1$4 = { class: "ford-header-inner" };
var _hoisted_2$4 = {
	key: 0,
	class: "ford-nav-left",
	"aria-label": "Điều hướng khách hàng"
};
var _hoisted_3$4 = {
	key: 0,
	class: "cart-nav-count",
	"aria-label": "Số lượng xe chờ đặt cọc"
};
var _hoisted_4$4 = {
	key: 1,
	class: "admin-header-spacer",
	"aria-hidden": "true"
};
var _hoisted_5$4 = { class: "ford-nav-right" };
var _hoisted_6$3 = ["aria-expanded"];
var _hoisted_7$2 = { class: "role-menu-panel" };
var _hoisted_8$1 = { class: "search-input-wrapper" };
var _hoisted_9$1 = {
	key: 0,
	class: "search-suggestions",
	role: "listbox"
};
var _hoisted_10$1 = ["onClick"];
var _hoisted_11$1 = ["src"];
var _hoisted_12$1 = { class: "search-suggestion-info" };
var _hoisted_13$1 = {
	key: 0,
	class: "search-suggestion-tags"
};
var _hoisted_14 = { class: "search-suggestion-price" };
var AppHeader_default = /*#__PURE__*/ _plugin_vue_export_helper_default({
	__name: "AppHeader",
	setup(__props) {
		const auth = useAuthStore();
		const cart = useCartStore();
		const route = useRoute();
		const router = useRouter();
		const searchOpen = ref(false);
		const searchQuery = ref(String(route.query.q || ""));
		const carCache = ref([]);
		const showDropdown = ref(false);
		const header = ref(null);
		const showSearch = computed(() => ["home", "car-list"].includes(String(route.name || "")));
		let cacheRequest;
		const userMenuDetails = ref(null);
		function closeUserMenu() {
			if (userMenuDetails.value) userMenuDetails.value.removeAttribute("open");
		}
		function handleClickOutside(event) {
			if (userMenuDetails.value && !userMenuDetails.value.contains(event.target)) userMenuDetails.value.removeAttribute("open");
			if (header.value && !header.value.contains(event.target)) showDropdown.value = false;
		}
		onMounted(() => {
			document.addEventListener("click", handleClickOutside);
			cart.refresh();
			loadCarCache();
		});
		onUnmounted(() => {
			document.removeEventListener("click", handleClickOutside);
		});
		watch(() => route.query.q, (query) => {
			searchQuery.value = String(query || "");
		});
		const normaliseSearch = (value) => String(value || "").toLowerCase().trim();
		const vndFormatter = new Intl.NumberFormat("vi-VN");
		const formatSuggestionPrice = (value) => `${vndFormatter.format(Number(value || 0))} VNĐ`;
		function toCachedCar(car, brandNames) {
			return {
				carName: car.carName || car.name || "",
				brandName: car.brandName || brandNames.get(Number(car.brandId)) || "",
				mainImageUrl: car.mainImageUrl || car.imageUrl || car.image || "",
				seatCapacity: car.seatCapacity ?? car.seats ?? "",
				id: car.id,
				price: car.price,
				fuelType: car.fuelType || ""
			};
		}
		const suggestions = computed(() => {
			const kw = normaliseSearch(searchQuery.value);
			return !kw ? [] : carCache.value.filter((car) => [
				car.carName,
				car.brandName,
				car.fuelType,
				car.seatCapacity && `${car.seatCapacity} chỗ`
			].some((value) => normaliseSearch(value).includes(kw))).slice(0, 5);
		});
		function loadCarCache() {
			if (carCache.value.length || cacheRequest) return cacheRequest;
			cacheRequest = Promise.all([api.get("/api/cars"), brandApi.getAll()]).then(([carsResponse, brandsResponse]) => {
				const cars = Array.isArray(carsResponse.data) ? carsResponse.data : carsResponse.data.data || [];
				const brands = Array.isArray(brandsResponse.data) ? brandsResponse.data : brandsResponse.data.data || [];
				const brandNames = new Map(brands.map((brand) => [Number(brand.id), brand.name]));
				carCache.value = cars.filter((car) => String(car.status || "").toUpperCase() === "AVAILABLE").map((car) => toCachedCar(car, brandNames));
			}).catch(() => {
				carCache.value = [];
			});
			return cacheRequest;
		}
		async function showCachedSuggestions() {
			if (!carCache.value.length) await loadCarCache();
			showDropdown.value = Boolean(searchQuery.value.trim());
		}
		function handleSearchInput() {
			const keyword = searchQuery.value.trim();
			showDropdown.value = Boolean(keyword);
			if (route.name === "car-list" && String(route.query.q || "") !== keyword) router.replace({
				path: route.path,
				query: {
					...route.query,
					q: keyword || void 0
				}
			});
		}
		async function handleLogout() {
			await auth.logout();
			cart.reset();
			router.push("/");
		}
		function doSearch() {
			const keyword = searchQuery.value.trim();
			router.push({
				name: "car-list",
				query: keyword ? { q: keyword } : {}
			});
			searchOpen.value = false;
			showDropdown.value = false;
		}
		function selectSuggestion(item) {
			showDropdown.value = false;
			searchQuery.value = "";
			searchOpen.value = false;
			router.push(`/car/detail/${item.id}`);
		}
		return (_ctx, _cache) => {
			const _component_router_link = resolveComponent("router-link");
			return openBlock(), createElementBlock("header", {
				ref_key: "header",
				ref: header,
				class: normalizeClass(["ford-header", { "is-admin-header": unref(auth).isAdmin }])
			}, [createBaseVNode("div", _hoisted_1$4, [
				!unref(auth).isAdmin ? (openBlock(), createElementBlock("nav", _hoisted_2$4, [
					createVNode(_component_router_link, { to: "/news" }, {
						default: withCtx(() => [..._cache[3] || (_cache[3] = [createTextVNode("Tin tức", -1)])]),
						_: 1
					}),
					createVNode(_component_router_link, { to: "/cars" }, {
						default: withCtx(() => [..._cache[4] || (_cache[4] = [createTextVNode("Sản phẩm", -1)])]),
						_: 1
					}),
					createVNode(_component_router_link, {
						class: "cart-nav-link",
						to: "/cart/view"
					}, {
						default: withCtx(() => [_cache[5] || (_cache[5] = createTextVNode(" Đặt cọc xe ", -1)), unref(cart).itemCount > 0 ? (openBlock(), createElementBlock("span", _hoisted_3$4, toDisplayString(unref(cart).itemCount), 1)) : createCommentVNode("", true)]),
						_: 1
					}),
					createVNode(_component_router_link, { to: "/service" }, {
						default: withCtx(() => [..._cache[6] || (_cache[6] = [createTextVNode("Dịch vụ", -1)])]),
						_: 1
					}),
					createVNode(_component_router_link, { to: "/support" }, {
						default: withCtx(() => [..._cache[7] || (_cache[7] = [createTextVNode("Hỗ trợ", -1)])]),
						_: 1
					})
				])) : createCommentVNode("", true),
				unref(auth).isAdmin ? (openBlock(), createElementBlock("div", _hoisted_4$4)) : createCommentVNode("", true),
				createVNode(_component_router_link, {
					class: "ford-logo",
					to: unref(auth).isAdmin ? "/admin/dashboard" : "/",
					"aria-label": unref(auth).isAdmin ? "CarStore - Trang quản trị" : "CarStore - Trang chủ"
				}, {
					default: withCtx(() => [..._cache[8] || (_cache[8] = [createTextVNode("CarStore", -1)])]),
					_: 1
				}, 8, ["to", "aria-label"]),
				createBaseVNode("div", _hoisted_5$4, [
					showSearch.value && !unref(auth).isAdmin ? (openBlock(), createElementBlock("button", {
						key: 0,
						type: "button",
						class: "ford-icon-btn",
						title: "Tìm kiếm",
						"aria-label": "Mở ô tìm kiếm",
						"aria-expanded": searchOpen.value,
						onClick: _cache[0] || (_cache[0] = ($event) => searchOpen.value = !searchOpen.value)
					}, [..._cache[9] || (_cache[9] = [createBaseVNode("svg", { viewBox: "0 0 24 24" }, [createBaseVNode("circle", {
						cx: "11",
						cy: "11",
						r: "8"
					}), createBaseVNode("line", {
						x1: "21",
						y1: "21",
						x2: "16.65",
						y2: "16.65"
					})], -1)])], 8, _hoisted_6$3)) : createCommentVNode("", true),
					!unref(auth).isLoggedIn ? (openBlock(), createBlock(_component_router_link, {
						key: 1,
						to: "/login",
						class: "ford-icon-btn",
						title: "Đăng nhập",
						"aria-label": "Đăng nhập"
					}, {
						default: withCtx(() => [..._cache[10] || (_cache[10] = [createBaseVNode("svg", { viewBox: "0 0 24 24" }, [createBaseVNode("path", {
							"stroke-linecap": "round",
							"stroke-linejoin": "round",
							d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
						}), createBaseVNode("circle", {
							cx: "12",
							cy: "7",
							r: "4"
						})], -1)])]),
						_: 1
					})) : createCommentVNode("", true),
					unref(auth).isUser ? (openBlock(), createElementBlock("details", {
						key: 2,
						class: "role-dropdown",
						ref_key: "userMenuDetails",
						ref: userMenuDetails
					}, [_cache[14] || (_cache[14] = createStaticVNode("<summary class=\"ford-icon-btn\" title=\"Lịch sử\" aria-label=\"Mở menu lịch sử\" data-v-2ca0ad98><svg viewBox=\"0 0 24 24\" data-v-2ca0ad98><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M3 12a9 9 0 1 0 3-6.7\" data-v-2ca0ad98></path><polyline points=\"3 3 3 9 9 9\" data-v-2ca0ad98></polyline><polyline points=\"12 7 12 12 16 14\" data-v-2ca0ad98></polyline></svg></summary>", 1)), createBaseVNode("div", _hoisted_7$2, [
						createVNode(_component_router_link, {
							to: "/my-orders",
							onClick: closeUserMenu
						}, {
							default: withCtx(() => [..._cache[11] || (_cache[11] = [createTextVNode("📦 Lịch sử đơn hàng", -1)])]),
							_: 1
						}),
						createVNode(_component_router_link, {
							to: "/quotation-history",
							onClick: closeUserMenu
						}, {
							default: withCtx(() => [..._cache[12] || (_cache[12] = [createTextVNode("📋 Xem Lịch sử yêu cầu báo giá", -1)])]),
							_: 1
						}),
						createVNode(_component_router_link, {
							to: "/history",
							onClick: closeUserMenu
						}, {
							default: withCtx(() => [..._cache[13] || (_cache[13] = [createTextVNode("📋 Lịch sử yêu cầu", -1)])]),
							_: 1
						})
					])], 512)) : createCommentVNode("", true),
					unref(auth).isLoggedIn ? (openBlock(), createBlock(_component_router_link, {
						key: 3,
						to: "/profile",
						class: "ford-icon-btn",
						title: "Hồ sơ",
						"aria-label": "Hồ sơ cá nhân"
					}, {
						default: withCtx(() => [..._cache[15] || (_cache[15] = [createBaseVNode("svg", { viewBox: "0 0 24 24" }, [createBaseVNode("path", {
							"stroke-linecap": "round",
							"stroke-linejoin": "round",
							d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
						}), createBaseVNode("circle", {
							cx: "12",
							cy: "7",
							r: "4"
						})], -1)])]),
						_: 1
					})) : createCommentVNode("", true),
					unref(auth).isLoggedIn ? (openBlock(), createElementBlock("button", {
						key: 4,
						type: "button",
						class: "ford-icon-btn",
						title: "Đăng xuất",
						"aria-label": "Đăng xuất",
						onClick: handleLogout
					}, [..._cache[16] || (_cache[16] = [createBaseVNode("svg", { viewBox: "0 0 24 24" }, [
						createBaseVNode("path", {
							"stroke-linecap": "round",
							"stroke-linejoin": "round",
							d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
						}),
						createBaseVNode("polyline", { points: "16 17 21 12 16 7" }),
						createBaseVNode("line", {
							x1: "21",
							y1: "12",
							x2: "9",
							y2: "12"
						})
					], -1)])])) : createCommentVNode("", true)
				])
			]), showSearch.value && !unref(auth).isAdmin ? (openBlock(), createElementBlock("div", {
				key: 0,
				class: normalizeClass(["ford-search-row", { "is-open": searchOpen.value }])
			}, [createBaseVNode("form", {
				class: "ford-search-form",
				onSubmit: withModifiers(doSearch, ["prevent"])
			}, [createBaseVNode("div", _hoisted_8$1, [withDirectives(createBaseVNode("input", {
				"onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => searchQuery.value = $event),
				type: "search",
				"aria-label": "Tên xe cần tìm",
				placeholder: "Tìm kiếm tên xe...",
				autocomplete: "off",
				onFocus: showCachedSuggestions,
				onInput: handleSearchInput
			}, null, 544), [[vModelText, searchQuery.value]]), showDropdown.value && suggestions.value.length ? (openBlock(), createElementBlock("div", _hoisted_9$1, [(openBlock(true), createElementBlock(Fragment, null, renderList(suggestions.value, (item) => {
				return openBlock(), createElementBlock("button", {
					key: item.id,
					class: "search-suggestion",
					type: "button",
					role: "option",
					onClick: ($event) => selectSuggestion(item)
				}, [
					createBaseVNode("img", {
						src: item.mainImageUrl || "/images/default-car.jpg",
						alt: "",
						onError: _cache[2] || (_cache[2] = (...args) => unref(useDefaultCarImage) && unref(useDefaultCarImage)(...args))
					}, null, 40, _hoisted_11$1),
					createBaseVNode("span", _hoisted_12$1, [
						createBaseVNode("strong", null, toDisplayString(item.carName), 1),
						createBaseVNode("small", null, toDisplayString(item.brandName), 1),
						item.fuelType || item.seatCapacity ? (openBlock(), createElementBlock("small", _hoisted_13$1, [createTextVNode(toDisplayString(item.fuelType || "N/A"), 1), item.seatCapacity ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [createTextVNode(" · " + toDisplayString(item.seatCapacity) + " chỗ", 1)], 64)) : createCommentVNode("", true)])) : createCommentVNode("", true)
					]),
					createBaseVNode("span", _hoisted_14, toDisplayString(formatSuggestionPrice(item.price)), 1)
				], 8, _hoisted_10$1);
			}), 128))])) : createCommentVNode("", true)]), _cache[17] || (_cache[17] = createBaseVNode("button", { type: "submit" }, "Tìm", -1))], 32)], 2)) : createCommentVNode("", true)], 2);
		};
	}
}, [["__scopeId", "data-v-2ca0ad98"]]);
//#endregion
//#region src/components/AppFooter.vue
var _hoisted_1$3 = { class: "ford-footer" };
var _hoisted_2$3 = { class: "ford-footer-inner" };
var _hoisted_3$3 = { class: "ford-footer-grid" };
var _hoisted_4$3 = { class: "footer-brand" };
var _hoisted_5$3 = { "aria-label": "Khám phá" };
var _hoisted_6$2 = { "aria-label": "Dịch vụ khách hàng" };
var _hoisted_7$1 = { class: "ford-footer-bottom" };
var AppFooter_default = /*#__PURE__*/ _plugin_vue_export_helper_default({
	__name: "AppFooter",
	setup(__props) {
		const year = (/* @__PURE__ */ new Date()).getFullYear();
		const auth = useAuthStore();
		return (_ctx, _cache) => {
			const _component_router_link = resolveComponent("router-link");
			return openBlock(), createElementBlock("footer", _hoisted_1$3, [createBaseVNode("div", _hoisted_2$3, [createBaseVNode("div", _hoisted_3$3, [
				createBaseVNode("section", _hoisted_4$3, [createVNode(_component_router_link, {
					to: "/",
					class: "footer-logo"
				}, {
					default: withCtx(() => [..._cache[0] || (_cache[0] = [createTextVNode("CarStore", -1)])]),
					_: 1
				}), _cache[1] || (_cache[1] = createBaseVNode("p", null, "Đại lý xe hiện đại với nhiều mẫu xe mới, dịch vụ bảo hành và trải nghiệm đặt cọc trực tuyến.", -1))]),
				createBaseVNode("nav", _hoisted_5$3, [
					_cache[5] || (_cache[5] = createBaseVNode("h4", null, "Khám phá", -1)),
					createVNode(_component_router_link, { to: "/cars" }, {
						default: withCtx(() => [..._cache[2] || (_cache[2] = [createTextVNode("Sản phẩm", -1)])]),
						_: 1
					}),
					createVNode(_component_router_link, { to: "/news" }, {
						default: withCtx(() => [..._cache[3] || (_cache[3] = [createTextVNode("Tin tức", -1)])]),
						_: 1
					}),
					!unref(auth).isAdmin ? (openBlock(), createBlock(_component_router_link, {
						key: 0,
						to: "/cart/view"
					}, {
						default: withCtx(() => [..._cache[4] || (_cache[4] = [createTextVNode("Đặt cọc xe", -1)])]),
						_: 1
					})) : createCommentVNode("", true)
				]),
				createBaseVNode("nav", _hoisted_6$2, [
					_cache[10] || (_cache[10] = createBaseVNode("h4", null, "Dịch vụ khách hàng", -1)),
					!unref(auth).isAdmin ? (openBlock(), createBlock(_component_router_link, {
						key: 0,
						to: "/service"
					}, {
						default: withCtx(() => [..._cache[6] || (_cache[6] = [createTextVNode("Đặt lịch dịch vụ", -1)])]),
						_: 1
					})) : createCommentVNode("", true),
					!unref(auth).isAdmin ? (openBlock(), createBlock(_component_router_link, {
						key: 1,
						to: "/support"
					}, {
						default: withCtx(() => [..._cache[7] || (_cache[7] = [createTextVNode("Hỗ trợ", -1)])]),
						_: 1
					})) : createCommentVNode("", true),
					unref(auth).isUser ? (openBlock(), createBlock(_component_router_link, {
						key: 2,
						to: "/my-orders"
					}, {
						default: withCtx(() => [..._cache[8] || (_cache[8] = [createTextVNode("Đơn của tôi", -1)])]),
						_: 1
					})) : createCommentVNode("", true),
					unref(auth).isUser ? (openBlock(), createBlock(_component_router_link, {
						key: 3,
						to: "/quotation-history"
					}, {
						default: withCtx(() => [..._cache[9] || (_cache[9] = [createTextVNode("Báo giá", -1)])]),
						_: 1
					})) : createCommentVNode("", true)
				]),
				_cache[11] || (_cache[11] = createBaseVNode("section", null, [
					createBaseVNode("h4", null, "Liên hệ"),
					createBaseVNode("a", { href: "tel:19009999" }, "Hotline: 1900 9999"),
					createBaseVNode("a", { href: "mailto:support@carstore.vn" }, "support@carstore.vn")
				], -1))
			]), createBaseVNode("div", _hoisted_7$1, "© " + toDisplayString(unref(year)) + " CarStore. Đã đăng ký bản quyền.", 1)])]);
		};
	}
}, [["__scopeId", "data-v-9d27f939"]]);
//#endregion
//#region src/composables/useCompare.js
var STORAGE_KEY = "carstore_compare_ids";
var selectedIds = ref(load());
function load() {
	try {
		const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
		return Array.isArray(value) ? [...new Set(value.map(Number).filter((id) => Number.isInteger(id) && id > 0))].slice(0, 3) : [];
	} catch {
		return [];
	}
}
function save() {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedIds.value));
}
function useCompare() {
	const count = computed(() => selectedIds.value.length);
	const has = (id) => selectedIds.value.includes(Number(id));
	const toggle = (id) => {
		const numericId = Number(id);
		if (!Number.isInteger(numericId) || numericId <= 0) return false;
		if (has(numericId)) selectedIds.value = selectedIds.value.filter((item) => item !== numericId);
		else if (selectedIds.value.length < 3) selectedIds.value = [...selectedIds.value, numericId];
		save();
		return has(numericId);
	};
	const remove = (id) => {
		selectedIds.value = selectedIds.value.filter((item) => item !== Number(id));
		save();
	};
	const clear = () => {
		selectedIds.value = [];
		save();
	};
	return {
		selectedIds,
		count,
		has,
		toggle,
		remove,
		clear
	};
}
//#endregion
//#region src/components/CompareBar.vue
var _hoisted_1$2 = {
	key: 0,
	class: "compare-bar"
};
var _hoisted_2$2 = { class: "compare-bar__title" };
var _hoisted_3$2 = { class: "compare-bar__cars" };
var _hoisted_4$2 = ["src", "alt"];
var _hoisted_5$2 = ["onClick"];
var _hoisted_6$1 = {
	key: 1,
	class: "compare-hint"
};
var CompareBar_default = /*#__PURE__*/ _plugin_vue_export_helper_default({
	__name: "CompareBar",
	setup(__props) {
		const { selectedIds, remove } = useCompare();
		const route = useRoute();
		const selectedCars = ref([]);
		const isComparePage = computed(() => route.path.startsWith("/compare"));
		let requestVersion = 0;
		function useCompareFallback(event) {
			event.target.onerror = null;
			event.target.src = "/images/camry.jpg";
		}
		watch(selectedIds, async (ids) => {
			const currentVersion = ++requestVersion;
			const normalizedIds = [...new Set(ids.map(Number).filter((id) => Number.isInteger(id) && id > 0))].slice(0, 3);
			if (!normalizedIds.length) {
				selectedCars.value = [];
				return;
			}
			try {
				const responses = await Promise.all(normalizedIds.map((id) => carApi.getById(id).catch(() => null)));
				if (currentVersion !== requestVersion) return;
				selectedCars.value = responses.filter(Boolean).map((response) => response.data?.data || response.data).filter((car) => car && car.id != null);
			} catch {
				if (currentVersion === requestVersion) selectedCars.value = [];
			}
		}, {
			immediate: true,
			deep: true
		});
		return (_ctx, _cache) => {
			const _component_router_link = resolveComponent("router-link");
			return selectedCars.value.length && !isComparePage.value ? (openBlock(), createElementBlock("aside", _hoisted_1$2, [
				createBaseVNode("div", _hoisted_2$2, [_cache[0] || (_cache[0] = createBaseVNode("strong", null, "So sánh xe", -1)), createBaseVNode("span", null, toDisplayString(selectedCars.value.length) + " xe đã chọn · tối đa 3", 1)]),
				createBaseVNode("div", _hoisted_3$2, [(openBlock(true), createElementBlock(Fragment, null, renderList(selectedCars.value, (car) => {
					return openBlock(), createElementBlock("div", {
						key: car.id,
						class: "compare-chip"
					}, [
						createBaseVNode("img", {
							class: "compare-bar-thumb",
							src: unref(carImageUrl)(car.image),
							alt: car.name,
							onError: useCompareFallback
						}, null, 40, _hoisted_4$2),
						createBaseVNode("span", null, toDisplayString(car.name), 1),
						createBaseVNode("button", {
							type: "button",
							"aria-label": "Bỏ xe khỏi so sánh",
							onClick: ($event) => unref(remove)(car.id)
						}, "×", 8, _hoisted_5$2)
					]);
				}), 128)), (openBlock(true), createElementBlock(Fragment, null, renderList(Math.max(0, 3 - selectedCars.value.length), (slot) => {
					return openBlock(), createElementBlock("div", {
						key: `empty-${slot}`,
						class: "compare-chip compare-chip--empty"
					}, " + Thêm xe ");
				}), 128))]),
				selectedCars.value.length >= 2 ? (openBlock(), createBlock(_component_router_link, {
					key: 0,
					class: "ford-btn-primary compare-go",
					to: `/compare?ids=${selectedCars.value.map((car) => car.id).join(",")}`
				}, {
					default: withCtx(() => [..._cache[1] || (_cache[1] = [createTextVNode(" SO SÁNH ", -1)])]),
					_: 1
				}, 8, ["to"])) : (openBlock(), createElementBlock("span", _hoisted_6$1, "Chọn thêm 1 xe để so sánh"))
			])) : createCommentVNode("", true);
		};
	}
}, [["__scopeId", "data-v-95df9173"]]);
//#endregion
//#region src/components/Chatbot.vue
var _hoisted_1$1 = { class: "chatbot-wrapper" };
var _hoisted_2$1 = { key: 0 };
var _hoisted_3$1 = { key: 1 };
var _hoisted_4$1 = {
	key: 0,
	class: "chat-window"
};
var _hoisted_5$1 = { class: "message-bubble" };
var _hoisted_6 = {
	key: 0,
	class: "typing-indicator",
	"aria-label": "Bot đang soạn câu trả lời"
};
var _hoisted_7 = { key: 1 };
var _hoisted_8 = {
	key: 2,
	class: "car-cards"
};
var _hoisted_9 = ["onClick"];
var _hoisted_10 = ["src", "alt"];
var _hoisted_11 = {
	key: 3,
	class: "quick-replies",
	"aria-label": "Gợi ý tư vấn"
};
var _hoisted_12 = ["onClick"];
var _hoisted_13 = { class: "chat-footer" };
var Chatbot_default = /*#__PURE__*/ _plugin_vue_export_helper_default({
	__name: "Chatbot",
	setup(__props) {
		const INITIAL_SUGGESTIONS = [
			"Tư vấn theo tầm giá",
			"Tư vấn theo nhu cầu sử dụng",
			"Xe 5 chỗ gia đình",
			"Xe 7 chỗ rộng rãi",
			"Xem xe mới nhất"
		];
		const router = useRouter();
		const isOpen = ref(false);
		const userMessage = ref("");
		const chatBody = ref(null);
		const messages = ref([{
			sender: "bot",
			text: "Xin chào! Em là bot tư vấn CarStore. Anh/chị cần tìm xe gì ạ?",
			suggestions: INITIAL_SUGGESTIONS
		}]);
		function toggleChat() {
			isOpen.value = !isOpen.value;
			scrollToBottom();
		}
		async function sendMessage(quickReply = "") {
			const text = String(quickReply || userMessage.value).trim();
			if (!text) return;
			messages.value.push({
				sender: "user",
				text
			});
			userMessage.value = "";
			const typingMessage = {
				sender: "bot",
				typing: true
			};
			messages.value.push(typingMessage);
			await scrollToBottom();
			try {
				const { data } = await api.post("/api/chat", { message: text });
				replaceTypingMessage(typingMessage, {
					sender: "bot",
					text: data.reply || "Em chưa hiểu rõ yêu cầu. Anh/chị có thể chọn một gợi ý bên dưới.",
					suggestions: data.suggestions || [],
					recommendedCars: data.recommendedCars || []
				});
			} catch {
				replaceTypingMessage(typingMessage, {
					sender: "bot",
					text: "Rất tiếc, hệ thống tư vấn đang gặp sự cố. Vui lòng thử lại sau!",
					suggestions: INITIAL_SUGGESTIONS
				});
			}
			await scrollToBottom();
		}
		function replaceTypingMessage(typingMessage, message) {
			const index = messages.value.indexOf(typingMessage);
			if (index >= 0) messages.value.splice(index, 1, message);
		}
		function openCar(id) {
			router.push(`/car/detail/${id}`);
			isOpen.value = false;
		}
		async function scrollToBottom() {
			await nextTick();
			if (chatBody.value) chatBody.value.scrollTop = chatBody.value.scrollHeight;
		}
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1$1, [createBaseVNode("button", {
				class: "chat-toggle-btn",
				onClick: toggleChat
			}, [!isOpen.value ? (openBlock(), createElementBlock("span", _hoisted_2$1, "💬 Chat")) : (openBlock(), createElementBlock("span", _hoisted_3$1, "✖ Đóng"))]), isOpen.value ? (openBlock(), createElementBlock("div", _hoisted_4$1, [
				_cache[5] || (_cache[5] = createBaseVNode("div", { class: "chat-header" }, [createBaseVNode("h3", null, "Tư Vấn CarStore")], -1)),
				createBaseVNode("div", {
					class: "chat-body",
					ref_key: "chatBody",
					ref: chatBody
				}, [(openBlock(true), createElementBlock(Fragment, null, renderList(messages.value, (msg, index) => {
					return openBlock(), createElementBlock("div", {
						key: index,
						class: normalizeClass(["chat-message", msg.sender])
					}, [createBaseVNode("div", _hoisted_5$1, [
						msg.typing ? (openBlock(), createElementBlock("p", _hoisted_6, [..._cache[4] || (_cache[4] = [
							createBaseVNode("span", null, null, -1),
							createBaseVNode("span", null, null, -1),
							createBaseVNode("span", null, null, -1)
						])])) : (openBlock(), createElementBlock("p", _hoisted_7, toDisplayString(msg.text), 1)),
						!msg.typing && msg.recommendedCars?.length ? (openBlock(), createElementBlock("div", _hoisted_8, [(openBlock(true), createElementBlock(Fragment, null, renderList(msg.recommendedCars, (car) => {
							return openBlock(), createElementBlock("button", {
								key: car.id,
								type: "button",
								class: "car-card-item",
								onClick: ($event) => openCar(car.id)
							}, [createBaseVNode("img", {
								src: car.mainImageUrl || "/images/default-car.jpg",
								alt: car.carName,
								onError: _cache[0] || (_cache[0] = (...args) => unref(useDefaultCarImage) && unref(useDefaultCarImage)(...args))
							}, null, 40, _hoisted_10), createBaseVNode("span", null, [
								createBaseVNode("strong", null, toDisplayString(car.carName), 1),
								createBaseVNode("small", null, toDisplayString(car.brandName), 1),
								createBaseVNode("b", null, toDisplayString(unref(formatPrice)(car.price)) + " VNĐ", 1)
							])], 8, _hoisted_9);
						}), 128))])) : createCommentVNode("", true),
						!msg.typing && msg.suggestions?.length ? (openBlock(), createElementBlock("div", _hoisted_11, [(openBlock(true), createElementBlock(Fragment, null, renderList(msg.suggestions, (suggestion) => {
							return openBlock(), createElementBlock("button", {
								key: suggestion,
								type: "button",
								onClick: ($event) => sendMessage(suggestion)
							}, toDisplayString(suggestion), 9, _hoisted_12);
						}), 128))])) : createCommentVNode("", true)
					])], 2);
				}), 128))], 512),
				createBaseVNode("div", _hoisted_13, [withDirectives(createBaseVNode("input", {
					"onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => userMessage.value = $event),
					onKeyup: _cache[2] || (_cache[2] = withKeys(($event) => sendMessage(), ["enter"])),
					placeholder: "Nhập câu hỏi (VD: tìm xe vios)..."
				}, null, 544), [[vModelText, userMessage.value]]), createBaseVNode("button", { onClick: _cache[3] || (_cache[3] = ($event) => sendMessage()) }, "Gửi")])
			])) : createCommentVNode("", true)]);
		};
	}
}, [["__scopeId", "data-v-7e63c372"]]);
//#endregion
//#region src/App.vue
var _hoisted_1 = { class: "app-shell" };
var _hoisted_2 = {
	key: 0,
	class: "admin-layout"
};
var _hoisted_3 = {
	class: "admin-sidebar",
	"aria-label": "Điều hướng quản trị"
};
var _hoisted_4 = { class: "admin-sidebar-nav" };
var _hoisted_5 = { class: "admin-main-content" };
var App_default = /*#__PURE__*/ _plugin_vue_export_helper_default({
	__name: "App",
	setup(__props) {
		const route = useRoute();
		const auth = useAuthStore();
		const isAdminArea = computed(() => auth.isAdmin && route.path.startsWith("/admin/"));
		const toastVisible = ref(false);
		const toastMessage = ref("");
		const toastType = ref("success");
		let timer = null;
		function showToast(message, type = "success") {
			toastMessage.value = message;
			toastType.value = [
				"success",
				"error",
				"warning"
			].includes(type) ? type : "success";
			toastVisible.value = true;
			clearTimeout(timer);
			timer = setTimeout(() => {
				toastVisible.value = false;
			}, 3e3);
		}
		function onToastEvent(event) {
			const detail = event.detail;
			if (typeof detail === "string") {
				showToast(detail);
				return;
			}
			showToast(detail?.message || "Thêm vào giỏ hàng thành công!", detail?.type);
		}
		onMounted(() => {
			window.addEventListener("carstore-toast", onToastEvent);
		});
		onBeforeUnmount(() => {
			window.removeEventListener("carstore-toast", onToastEvent);
			clearTimeout(timer);
		});
		return (_ctx, _cache) => {
			const _component_router_link = resolveComponent("router-link");
			const _component_router_view = resolveComponent("router-view");
			return openBlock(), createElementBlock("div", _hoisted_1, [
				createVNode(AppHeader_default),
				createBaseVNode("main", { class: normalizeClass(["page-content", { "admin-page-content": isAdminArea.value }]) }, [isAdminArea.value ? (openBlock(), createElementBlock("div", _hoisted_2, [createBaseVNode("aside", _hoisted_3, [_cache[8] || (_cache[8] = createBaseVNode("div", { class: "admin-sidebar-title" }, "Quản trị CarStore", -1)), createBaseVNode("nav", _hoisted_4, [
					createVNode(_component_router_link, {
						to: "/admin/dashboard",
						"exact-active-class": "is-active"
					}, {
						default: withCtx(() => [..._cache[0] || (_cache[0] = [createTextVNode("📊 ", -1), createBaseVNode("span", null, "Thống kê", -1)])]),
						_: 1
					}),
					createVNode(_component_router_link, {
						to: "/admin/inventory",
						"exact-active-class": "is-active"
					}, {
						default: withCtx(() => [..._cache[1] || (_cache[1] = [createTextVNode("📦 ", -1), createBaseVNode("span", null, "Quản lý tồn kho", -1)])]),
						_: 1
					}),
					createVNode(_component_router_link, {
						to: "/admin/products",
						"exact-active-class": "is-active"
					}, {
						default: withCtx(() => [..._cache[2] || (_cache[2] = [createTextVNode("🚗 ", -1), createBaseVNode("span", null, "Quản lý sản phẩm", -1)])]),
						_: 1
					}),
					createVNode(_component_router_link, {
						to: "/admin/orders",
						"exact-active-class": "is-active"
					}, {
						default: withCtx(() => [..._cache[3] || (_cache[3] = [createTextVNode("📦 ", -1), createBaseVNode("span", null, "Quản lý đơn hàng", -1)])]),
						_: 1
					}),
					createVNode(_component_router_link, {
						to: "/admin/support",
						"exact-active-class": "is-active"
					}, {
						default: withCtx(() => [..._cache[4] || (_cache[4] = [createTextVNode("📋 ", -1), createBaseVNode("span", null, "Quản lý yêu cầu hỗ trợ", -1)])]),
						_: 1
					}),
					createVNode(_component_router_link, {
						to: "/admin/users",
						"exact-active-class": "is-active"
					}, {
						default: withCtx(() => [..._cache[5] || (_cache[5] = [createTextVNode("👥 ", -1), createBaseVNode("span", null, "Quản lý khách hàng", -1)])]),
						_: 1
					}),
					createVNode(_component_router_link, {
						to: "/admin/marketing",
						"exact-active-class": "is-active"
					}, {
						default: withCtx(() => [..._cache[6] || (_cache[6] = [createTextVNode("📣 ", -1), createBaseVNode("span", null, "Khuyến mãi & tin tức", -1)])]),
						_: 1
					}),
					createVNode(_component_router_link, {
						to: "/admin/contracts",
						"exact-active-class": "is-active"
					}, {
						default: withCtx(() => [..._cache[7] || (_cache[7] = [createTextVNode("📄 ", -1), createBaseVNode("span", null, "Quản lý hợp đồng", -1)])]),
						_: 1
					})
				])]), createBaseVNode("section", _hoisted_5, [createVNode(_component_router_view)])])) : (openBlock(), createBlock(_component_router_view, { key: 1 }))], 2),
				!isAdminArea.value ? (openBlock(), createBlock(AppFooter_default, { key: 0 })) : createCommentVNode("", true),
				createVNode(CompareBar_default),
				createVNode(Transition, { name: "toast" }, {
					default: withCtx(() => [toastVisible.value ? (openBlock(), createElementBlock("div", {
						key: 0,
						class: normalizeClass(["cart-toast-popup", `is-${toastType.value}`]),
						role: "status",
						"aria-live": "polite"
					}, toDisplayString(toastMessage.value), 3)) : createCommentVNode("", true)]),
					_: 1
				}),
				createVNode(Chatbot_default)
			]);
		};
	}
}, [["__scopeId", "data-v-46878a8d"]]);
//#endregion
//#region \0vite/preload-helper.js
var scriptRel = "modulepreload";
var assetsURL = function(dep) {
	return "/" + dep;
};
var seen = {};
var __vitePreload = function preload(baseModule, deps, importerUrl) {
	let promise = Promise.resolve();
	if (deps && deps.length > 0) {
		const links = document.getElementsByTagName("link");
		const cspNonceMeta = document.querySelector("meta[property=csp-nonce]");
		const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
		function allSettled(promises) {
			return Promise.all(promises.map((p) => Promise.resolve(p).then((value) => ({
				status: "fulfilled",
				value
			}), (reason) => ({
				status: "rejected",
				reason
			}))));
		}
		function importMetaResolve(specifier) {
			if (import.meta.resolve) return import.meta.resolve(specifier);
			return new URL(
				specifier,
				/** #__KEEP__ */
				import.meta.url
			).href;
		}
		promise = allSettled(deps.map((dep) => {
			dep = assetsURL(dep, importerUrl);
			dep = importMetaResolve(dep);
			if (dep in seen) return;
			seen[dep] = true;
			const isCss = dep.endsWith(".css");
			for (let i = links.length - 1; i >= 0; i--) {
				const link = links[i];
				if (link.href === dep && (!isCss || link.rel === "stylesheet")) return;
			}
			const link = document.createElement("link");
			link.rel = isCss ? "stylesheet" : scriptRel;
			if (!isCss) link.as = "script";
			link.crossOrigin = "";
			link.href = dep;
			if (cspNonce) link.setAttribute("nonce", cspNonce);
			document.head.appendChild(link);
			if (isCss) return new Promise((res, rej) => {
				link.addEventListener("load", res);
				link.addEventListener("error", () => rej(/* @__PURE__ */ new Error(`Unable to preload CSS for ${dep}`)));
			});
		}));
	}
	function handlePreloadError(err) {
		const e = new Event("vite:preloadError", { cancelable: true });
		e.payload = err;
		window.dispatchEvent(e);
		if (!e.defaultPrevented) throw err;
	}
	return promise.then((res) => {
		for (const item of res || []) {
			if (item.status !== "rejected") continue;
			handlePreloadError(item.reason);
		}
		return baseModule().catch(handlePreloadError);
	});
};
//#endregion
//#region src/router/index.js
var authMeta = {
	auth: true,
	requiresAuth: true
};
var adminMeta = {
	...authMeta,
	admin: true
};
var router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: "/",
			name: "home",
			component: () => __vitePreload(() => import("./HomeView-CEF5y8hi.js"), __vite__mapDeps([0,1,2,3,4,5,6]))
		},
		{
			path: "/car/list",
			alias: "/cars",
			name: "car-list",
			component: () => __vitePreload(() => import("./CarListView-B_hr9HZu.js"), __vite__mapDeps([7,1,2,3,4,5,8]))
		},
		{
			path: "/car/detail/:id",
			alias: "/cars/:id",
			name: "car-detail",
			component: () => __vitePreload(() => import("./CarDetailView-C9t-2kWp.js"), __vite__mapDeps([9,1,2,3,4,5,10]))
		},
		{
			path: "/compare",
			name: "compare",
			component: () => __vitePreload(() => import("./CompareView-BSuDCV8V.js"), __vite__mapDeps([11,1,12]))
		},
		{
			path: "/car/create",
			name: "car-create",
			meta: adminMeta,
			component: () => __vitePreload(() => import("./CarFormView-mX8nOsq4.js"), __vite__mapDeps([13,1]))
		},
		{
			path: "/car/edit/:id",
			name: "car-edit",
			meta: adminMeta,
			component: () => __vitePreload(() => import("./CarFormView-mX8nOsq4.js"), __vite__mapDeps([13,1]))
		},
		{
			path: "/cart/view",
			name: "cart",
			meta: authMeta,
			component: () => __vitePreload(() => import("./CartView-Bi8XGoYh.js"), __vite__mapDeps([14,1,15]))
		},
		{
			path: "/checkout",
			name: "checkout",
			meta: authMeta,
			component: () => __vitePreload(() => import("./CheckoutView-5BfppBTs.js"), __vite__mapDeps([16,1,17]))
		},
		{
			path: "/login",
			name: "login",
			component: () => __vitePreload(() => import("./LoginView-DcJ-zMbH.js"), __vite__mapDeps([18,1,19]))
		},
		{
			path: "/login/form",
			redirect: "/login"
		},
		{
			path: "/signup",
			name: "signup",
			component: () => __vitePreload(() => import("./SignupView-BV-i0F2A.js"), __vite__mapDeps([20,1,21]))
		},
		{
			path: "/verify-email",
			name: "verify-email",
			component: () => __vitePreload(() => import("./EmailVerificationView-Bs5YfbCG.js"), __vite__mapDeps([22,1,23]))
		},
		{
			path: "/forgot-password",
			name: "forgot-password",
			component: () => __vitePreload(() => import("./ForgotPasswordView-Dy5AnP1e.js"), __vite__mapDeps([24,1,25]))
		},
		{
			path: "/verify-otp",
			name: "verify-otp",
			component: () => __vitePreload(() => import("./VerifyOtpView-DmZAmgrP.js"), __vite__mapDeps([26,1,27]))
		},
		{
			path: "/reset-password",
			name: "reset-password",
			component: () => __vitePreload(() => import("./ResetPasswordView-LDYthn0_.js"), __vite__mapDeps([28,1,29]))
		},
		{
			path: "/profile",
			name: "profile",
			meta: authMeta,
			component: () => __vitePreload(() => import("./ProfileView-CkzfIc_p.js"), __vite__mapDeps([30,1,31]))
		},
		{
			path: "/order/my-orders",
			alias: "/my-orders",
			name: "my-orders",
			meta: authMeta,
			component: () => __vitePreload(() => import("./MyOrdersView-BtV3En-u.js"), __vite__mapDeps([32,1,2,33]))
		},
		{
			path: "/order/detail/:id",
			name: "order-detail",
			meta: authMeta,
			component: () => __vitePreload(() => import("./OrderDetailView-BdPNvkUu.js"), __vite__mapDeps([34,1,5]))
		},
		{
			path: "/orders/:id/contract",
			alias: "/contract/:id",
			name: "order-contract",
			component: () => __vitePreload(() => import("./ContractView-BemXtC4G.js"), __vite__mapDeps([35,1,5,36]))
		},
		{
			path: "/orders/:id/payment",
			name: "order-payment",
			meta: authMeta,
			component: () => __vitePreload(() => import("./PaymentView-D5-09fjZ.js"), __vite__mapDeps([37,1,38]))
		},
		{
			path: "/quotations/:id",
			name: "quotation-detail",
			meta: authMeta,
			component: () => __vitePreload(() => import("./QuotationView-D7LljbLp.js"), __vite__mapDeps([39,1,5,40]))
		},
		{
			path: "/quotation-history",
			alias: "/quotation/history",
			name: "quotation-history",
			meta: authMeta,
			component: () => __vitePreload(() => import("./QuotationHistoryView-D0OsOCrQ.js"), __vite__mapDeps([41,1,5]))
		},
		{
			path: "/history",
			name: "history",
			meta: authMeta,
			component: () => __vitePreload(() => import("./HistoryView-DYXjqM4u.js"), __vite__mapDeps([42,1,5]))
		},
		{
			path: "/service",
			name: "service",
			meta: authMeta,
			component: () => __vitePreload(() => import("./ServiceView-C3Hz0fDu.js"), __vite__mapDeps([43,1,44,45,46,47]))
		},
		{
			path: "/support",
			name: "support",
			meta: authMeta,
			component: () => __vitePreload(() => import("./SupportView-DpqJt9Op.js"), __vite__mapDeps([48,1,46,49]))
		},
		{
			path: "/news/:slug",
			name: "news-detail",
			component: () => __vitePreload(() => import("./NewsDetailView-cDzvSHUj.js"), __vite__mapDeps([50,1,5,51]))
		},
		{
			path: "/news",
			name: "news-list",
			component: () => __vitePreload(() => import("./NewsListView-BWP95gwp.js"), __vite__mapDeps([52,1,5,53]))
		},
		{
			path: "/admin/dashboard",
			name: "admin-dashboard",
			meta: adminMeta,
			component: () => __vitePreload(() => import("./AdminDashboard-B7Q81zju.js"), __vite__mapDeps([54,1,2,5,55]))
		},
		{
			path: "/admin/products",
			name: "admin-products",
			meta: adminMeta,
			component: () => __vitePreload(() => import("./AdminProducts-CiEufJDN.js"), __vite__mapDeps([56,1,2,57]))
		},
		{
			path: "/admin/inventory",
			name: "admin-inventory",
			meta: adminMeta,
			component: () => __vitePreload(() => import("./AdminInventory-BNLPC7il.js"), __vite__mapDeps([58,1,2,59]))
		},
		{
			path: "/admin/orders",
			name: "admin-orders",
			meta: adminMeta,
			component: () => __vitePreload(() => import("./AdminOrders-DkrMr3JZ.js"), __vite__mapDeps([60,1,2,5,61]))
		},
		{
			path: "/admin/support",
			name: "admin-support",
			meta: adminMeta,
			component: () => __vitePreload(() => import("./AdminSupport-DSsuassy.js"), __vite__mapDeps([62,1,2,63]))
		},
		{
			path: "/admin/users",
			name: "admin-users",
			meta: adminMeta,
			component: () => __vitePreload(() => import("./AdminUsers-DHeDBor8.js"), __vite__mapDeps([64,1,2,65]))
		},
		{
			path: "/admin/users/create",
			name: "admin-user-create",
			meta: adminMeta,
			component: () => __vitePreload(() => import("./AdminUserForm-Ad8DKWc-.js"), __vite__mapDeps([66,1,2,67]))
		},
		{
			path: "/admin/users/edit/:username",
			name: "admin-user-edit",
			meta: adminMeta,
			component: () => __vitePreload(() => import("./AdminUserForm-Ad8DKWc-.js"), __vite__mapDeps([66,1,2,67]))
		},
		{
			path: "/admin/marketing",
			name: "admin-marketing",
			meta: adminMeta,
			component: () => __vitePreload(() => import("./AdminMarketing-DvCveHIA.js"), __vite__mapDeps([68,1,2,5,44,45,69]))
		},
		{
			path: "/admin/contracts",
			name: "admin-contracts",
			meta: adminMeta,
			component: () => __vitePreload(() => import("./AdminContracts-YGtMOK4Z.js"), __vite__mapDeps([70,1,2,5]))
		},
		{
			path: "/:pathMatch(.*)*",
			redirect: "/"
		}
	]
});
router.beforeEach(async (to) => {
	const auth = useAuthStore();
	if (!auth.user && !auth.loading) await auth.fetchUser();
	if ((to.meta.auth || to.meta.requiresAuth) && !auth.isLoggedIn) return {
		name: "login",
		query: { redirect: to.fullPath }
	};
	if (to.name === "cart" && auth.isAdmin) return { name: "admin-dashboard" };
	if (to.meta.admin && !auth.isAdmin) return auth.isLoggedIn ? { name: "home" } : {
		name: "login",
		query: { redirect: to.fullPath }
	};
});
//#endregion
//#region src/main.js
var app = createApp(App_default);
app.use(createPinia());
app.use(router);
app.mount("#app");
//#endregion
export { useRoute as a, vModelDynamic as c, withKeys as d, withModifiers as f, useAuthStore as i, vModelSelect as l, _plugin_vue_export_helper_default as n, useRouter as o, useCartStore as r, vModelCheckbox as s, useCompare as t, vModelText as u };
