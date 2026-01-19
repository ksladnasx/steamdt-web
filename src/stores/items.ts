import { defineStore } from "pinia";
import { ref } from "vue";

// 组合式API：通过ref定义state，普通函数定义actions
export const useitemsStore = defineStore("counter", () => {
  // state就是ref响应式变量
  const selectedSkin = ref(null);
  const apiKey = ref(localStorage.getItem("apiKey") || "04a77f47d70a47809ce4006c553494f2");

  const setApiKey = (key: string) => {
    apiKey.value = key;
    localStorage.setItem("apiKey", key);
  }

  const clearApiKey = () => {
    apiKey.value = "";
    localStorage.removeItem("apiKey");
  }

  const setSelectedSkin = (skin: any) => {
    selectedSkin.value = skin;
    localStorage.setItem("selectedSkin", JSON.stringify(skin));
  };

  const lodSelectedSkin = () => {
    if (localStorage.getItem("selectedSkin")) {
      selectedSkin.value = JSON.parse(localStorage.getItem("selectedSkin")!);
    }
    console.log("selectedSkin:", selectedSkin.value);
  };

  const clearSelectedSkin = () => {
    selectedSkin.value = null;
    localStorage.removeItem("selectedSkin");
  }
  // 导出需要暴露的变量和方法
  return { selectedSkin, setSelectedSkin, lodSelectedSkin ,clearSelectedSkin, apiKey, setApiKey, clearApiKey };
});
