import { Dt as toDisplayString, O as createElementBlock, T as createBaseVNode, V as openBlock, a as carImageUrl, l as newsApi, tt as ref, z as onMounted } from "./api-lWF_eiJ8.js";
import { a as useRoute, t as _plugin_vue_export_helper_default } from "./index-LltwIOcO.js";
import { n as useAutoRefresh } from "./useAutoRefresh-DbvPryYR.js";
//#region src/views/NewsDetailView.vue
var _hoisted_1 = { class: "container py-5 news-detail" };
var _hoisted_2 = {
	key: 0,
	class: "alert alert-danger"
};
var _hoisted_3 = { key: 1 };
var _hoisted_4 = { class: "meta" };
var _hoisted_5 = ["src", "alt"];
var _hoisted_6 = { class: "summary" };
var _hoisted_7 = { class: "content" };
var _hoisted_8 = {
	key: 2,
	class: "text-center"
};
var NewsDetailView_default = /*#__PURE__*/ _plugin_vue_export_helper_default({
	__name: "NewsDetailView",
	setup(__props) {
		const route = useRoute();
		const news = ref(null);
		const error = ref("");
		const formatDate = (value) => value ? new Date(value).toLocaleDateString("vi-VN") : "";
		const newsImageUrl = (item) => carImageUrl(item?.image || item?.thumbnail || "Wildtrak2025.png");
		function useNewsFallback(event) {
			event.target.onerror = null;
			event.target.src = "/images/Wildtrak2025.png";
		}
		async function loadNews() {
			try {
				const { data } = await newsApi.getBySlug(route.params.slug);
				news.value = data.data;
				error.value = "";
			} catch (e) {
				error.value = e.response?.data?.message || "Không thể tải tin tức";
			}
		}
		onMounted(loadNews);
		useAutoRefresh(loadNews);
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("main", _hoisted_1, [error.value ? (openBlock(), createElementBlock("div", _hoisted_2, toDisplayString(error.value), 1)) : news.value ? (openBlock(), createElementBlock("article", _hoisted_3, [
				_cache[0] || (_cache[0] = createBaseVNode("span", { class: "eyebrow" }, "TIN TỨC CARSTORE", -1)),
				createBaseVNode("h1", null, toDisplayString(news.value.title), 1),
				createBaseVNode("p", _hoisted_4, toDisplayString(formatDate(news.value.createdAt)) + " · " + toDisplayString(news.value.author), 1),
				createBaseVNode("img", {
					class: "news-image",
					src: newsImageUrl(news.value),
					alt: news.value.title,
					onError: useNewsFallback
				}, null, 40, _hoisted_5),
				createBaseVNode("p", _hoisted_6, toDisplayString(news.value.summary), 1),
				createBaseVNode("div", _hoisted_7, toDisplayString(news.value.content), 1)
			])) : (openBlock(), createElementBlock("div", _hoisted_8, "Đang tải..."))]);
		};
	}
}, [["__scopeId", "data-v-a04aff83"]]);
//#endregion
export { NewsDetailView_default as default };
