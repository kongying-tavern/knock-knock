const BLANK_PAGE_URL = "about:blank";

// eslint-disable-next-line no-unused-vars,no-redeclare
const Webtie = {
  instance: null,
  adapters: ["web", "bilibili"],
  data: {
    adapter: "",
    url: "",
    urlRaw: new URL(BLANK_PAGE_URL),
    config: {},
  },

  /**
   * ---------------------------
   * 启动加载
   * ---------------------------
   */
  Init: function (eleId = "") {
    if (!eleId) return;

    let ele = document.getElementById(eleId);
    this.instance = ele;
  },

  /**
   * ---------------------------
   * 状态判断
   * ---------------------------
   */
  // 是否可加载页面，不可加载说明DOM对象未绑定成功
  IsLoadable: function () {
    return this.instance !== null && this.instance !== undefined;
  },

  /**
   * ---------------------------
   * 数据处理
   * ---------------------------
   */
  // URL解析
  ParseURL: function (href = "") {
    let urlObj;
    try {
      urlObj = new URL(href);
    } catch (e) {
      // nothing
    }
    return urlObj || new URL(BLANK_PAGE_URL);
  },
  ParseJSON: function (jsonStr = "") {
    let jsonObj = {};
    try {
      jsonObj = JSON.parse(jsonStr);
    } catch (e) {
      // nothing
    }

    if (Array.isArray(jsonObj) || typeof jsonObj !== "object") {
      jsonObj = {};
    }
    return jsonObj;
  },
  // 初始化数据
  InitData: function () {
    this.data = {
      adapter: "",
      url: "",
      urlRaw: new URL(BLANK_PAGE_URL),
      config: {},
    };
  },
  // 更新数据
  UpdateData: function (href = window.location.href) {
    let urlObj = this.ParseURL(href);
    let params = urlObj.searchParams || new URLSearchParams("");
    let adapter = params.get("adapter") || "";
    let url = params.get("url") || BLANK_PAGE_URL;
    let config = params.get("config") || "{}";

    this.data.adapter = adapter;
    this.data.url = url;
    this.data.config = this.ParseJSON(config);

    let urlRaw = this.ParseURL(url);
    this.data.urlRaw = urlRaw;
  },

  /**
   * ---------------------------
   * 适配器相关
   * ---------------------------
   */
  // 应用适配器
  ApplyAdapter: function () {
    if (!this.IsLoadable()) return;

    let url = this.GetAdapter(this.data) || BLANK_PAGE_URL;
    this.instance.src = url;
  },
  // 检测是否是有效的适配器
  ValidateAdapter: function (key = "") {
    if (!key) return false;
    return this.adapters.indexOf(key) !== -1;
  },
  GetAdapter: function (data = {}) {
    let adapter = data.adapter || "";
    if (!this.ValidateAdapter(adapter)) return;

    let urlRaw = data.urlRaw || this.ParseURL(BLANK_PAGE_URL);
    // 重做地址数据，防止后续修改直接改变原有内存中的值
    let urlRawCopy = this.ParseURL(urlRaw.toString());
    let urlAdapted = null;

    switch (adapter) {
      case "web":
        urlAdapted = this.GetAdapterWeb(urlRawCopy);
        break;
      case "bilibili":
        urlAdapted = this.GetAdapterBilibili(urlRawCopy);
        break;
    }

    let urlTransformed = urlAdapted ? urlAdapted.toString() : "";
    console.log(urlTransformed);
    return urlTransformed;
  },
  // 适配器：网页
  GetAdapterWeb: function (url) {
    console.log(url);
    return url;
  },
  // 适配器：哔哩哔哩
  GetAdapterBilibili: function (url) {
    let params = url.searchParams;
    let pathname = url.pathname || "";

    let page = params.get("p") || 1;
    let t = params.get("t");
    let aid = (pathname.match(/\bav\d+/gu) || []).shift() || "";
    let bvid = (pathname.match(/\bBV[\dA-Za-z]+/gu) || []).shift() || "";

    let playerUrl = new URL("https://player.bilibili.com/player.html");
    playerUrl.searchParams.set("aid", aid);
    playerUrl.searchParams.set("bvid", bvid);
    playerUrl.searchParams.set("page", page);
    if (t) playerUrl.searchParams.set("t", t);
    playerUrl.searchParams.set("autoplay", 1);
    playerUrl.searchParams.set("high_quality", 1);
    playerUrl.searchParams.set("danmaku", 1);

    return playerUrl;
  },
};
