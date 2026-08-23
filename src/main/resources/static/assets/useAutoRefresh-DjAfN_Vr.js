import { R as onBeforeUnmount, z as onMounted } from "./api-Cd2rmWmR.js";
//#region src/composables/useAutoRefresh.js
function useAutoRefresh(refresh, intervalMs = 2e3) {
	let timer = null;
	let refreshing = false;
	async function run() {
		if (refreshing || document.hidden) return;
		refreshing = true;
		try {
			await refresh();
		} catch {} finally {
			refreshing = false;
		}
	}
	function refreshWhenVisible() {
		if (!document.hidden) run();
	}
	onMounted(() => {
		if (intervalMs > 0) timer = window.setInterval(run, intervalMs);
		window.addEventListener("focus", run);
		document.addEventListener("visibilitychange", refreshWhenVisible);
	});
	onBeforeUnmount(() => {
		if (timer) window.clearInterval(timer);
		window.removeEventListener("focus", run);
		document.removeEventListener("visibilitychange", refreshWhenVisible);
	});
}
//#endregion
export { useAutoRefresh as t };
