import { R as onBeforeUnmount, z as onMounted } from "./api-Cd2rmWmR.js";
//#region src/composables/useAutoRefresh.js
var SYNC_CHANNEL = "carstore_sync";
function notifyDataUpdated() {
	if (typeof window === "undefined" || !("BroadcastChannel" in window)) return;
	const channel = new BroadcastChannel(SYNC_CHANNEL);
	channel.postMessage({ type: "DATA_UPDATED" });
	channel.close();
}
function useAutoRefresh(refresh, intervalMs = 2e3) {
	let timer = null;
	let refreshing = false;
	let channel = null;
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
		if ("BroadcastChannel" in window) {
			channel = new BroadcastChannel(SYNC_CHANNEL);
			channel.addEventListener("message", (event) => {
				if (event.data?.type === "DATA_UPDATED") run();
			});
		}
	});
	onBeforeUnmount(() => {
		if (timer) window.clearInterval(timer);
		window.removeEventListener("focus", run);
		document.removeEventListener("visibilitychange", refreshWhenVisible);
		channel?.close();
	});
}
//#endregion
export { useAutoRefresh as n, notifyDataUpdated as t };
