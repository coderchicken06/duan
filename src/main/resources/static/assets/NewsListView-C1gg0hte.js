import { D as createCommentVNode, Dt as toDisplayString, K as withCtx, M as createVNode, O as createElementBlock, S as Fragment, T as createBaseVNode, U as renderList, V as openBlock, W as resolveComponent, a as carImageUrl, j as createTextVNode, l as newsApi, tt as ref, z as onMounted } from "./api-lWF_eiJ8.js";
import { t as _plugin_vue_export_helper_default } from "./index-LltwIOcO.js";
import { n as useAutoRefresh } from "./useAutoRefresh-DbvPryYR.js";
//#region src/views/NewsListView.vue
var _hoisted_1 = { class: "container py-5" };
var _hoisted_2 = {
	key: 0,
	class: "text-center py-5"
};
var _hoisted_3 = {
	key: 1,
	class: "news-grid"
};
var _hoisted_4 = { class: "news-image-wrapper" };
var _hoisted_5 = ["src", "alt"];
var _hoisted_6 = { class: "news-card-body" };
var _hoisted_7 = {
	key: 2,
	class: "text-center py-5"
};
var NewsListView_default = /*#__PURE__*/ _plugin_vue_export_helper_default({
	__name: "NewsListView",
	setup(__props) {
		const articles = ref([]);
		const loading = ref(true);
		const formatDate = (value) => value ? new Date(value).toLocaleDateString("vi-VN") : "";
		const newsImageUrl = (item) => carImageUrl(item?.image || item?.thumbnail || "Wildtrak2025.png");
		function useNewsFallback(event) {
			event.target.onerror = null;
			event.target.src = "/images/Wildtrak2025.png";
		}
		async function loadNews() {
			try {
				const { data } = await newsApi.getPublished();
				articles.value = data.data || [];
			} finally {
				loading.value = false;
			}
		}
		onMounted(loadNews);
		useAutoRefresh(loadNews);
		return (_ctx, _cache) => {
			const _component_router_link = resolveComponent("router-link");
			return openBlock(), createElementBlock("main", _hoisted_1, [
				_cache[1] || (_cache[1] = createBaseVNode("header", { class: "mb-4" }, [createBaseVNode("span", { class: "eyebrow" }, "CARSTORE"), createBaseVNode("h1", null, "Tin tức ô tô")], -1)),
				loading.value ? (openBlock(), createElementBlock("div", _hoisted_2, "Đang tải...")) : (openBlock(), createElementBlock("div", _hoisted_3, [(openBlock(true), createElementBlock(Fragment, null, renderList(articles.value, (item) => {
					return openBlock(), createElementBlock("article", {
						key: item.id,
						class: "news-card"
					}, [createBaseVNode("div", _hoisted_4, [createBaseVNode("img", {
						class: "news-thumb",
						src: newsImageUrl(item),
						alt: item.title,
						onError: useNewsFallback
					}, null, 40, _hoisted_5)]), createBaseVNode("div", _hoisted_6, [
						createBaseVNode("small", null, toDisplayString(formatDate(item.createdAt)), 1),
						createBaseVNode("h2", null, toDisplayString(item.title), 1),
						createBaseVNode("p", null, toDisplayString(item.summary), 1),
						createVNode(_component_router_link, { to: `/news/${item.slug}` }, {
							default: withCtx(() => [..._cache[0] || (_cache[0] = [createTextVNode("Đọc chi tiết", -1)])]),
							_: 1
						}, 8, ["to"])
					])]);
				}), 128))])),
				!loading.value && !articles.value.length ? (openBlock(), createElementBlock("p", _hoisted_7, "Chưa có tin tức.")) : createCommentVNode("", true)
			]);
		};
	}
}, [["__scopeId", "data-v-794c8fde"]]);
//#endregion
export { NewsListView_default as default };
