<template>
  <tlbs-map
      ref="map"
      :api-key="apiKey"
      :center="center"
      :zoom="zoom"
      :control="control"
      @click="onClick"
  >
    <tlbs-multi-marker
        v-if="center.lat && center.lng"
        :geometries="geometries"
        :styles="styles"
        :options="options"
    />
  </tlbs-map>
</template>

<script>
export default {
  name: 'TencentMap',
  props: {
    location: {
      type: Object,
      default: () => ({ lat: undefined, lng: undefined }),
    },
  },
  data() {
    return {
      apiKey: 'K64BZ-G3GKA-5JFKV-CTL5T-S43JF-53FGU',
      zoom: 15,
      mapInstance: null,
      isInitialized: false, // 标记地图是否已经初始化
    };
  },
  computed: {
    center() {
      return {
        lat: this.location.y ?? 39.91799,
        lng: this.location.x ?? 116.397027,
      };
    },
    geometries() {
      if (this.center.lat && this.center.lng) {
        return [{ styleId: 'marker', position: this.center }];
      }
      return [];
    },
    styles() {
      return {
        marker: {
          width: 20,
          height: 30,
          anchor: { x: 10, y: 30 },
        },
      };
    },
    options() {
      return {
        minZoom: 5,
        maxZoom: 15,
      };
    },
  },
  methods: {
    onClick(e) {
      console.log(e);
    },
    initMap() {
      this.$nextTick(() => {
        if (this.$refs.map && typeof this.$refs.map.init === 'function') {
          this.mapInstance = this.$refs.map.init();
          this.isInitialized = true;
        }
      });
    },
    // eslint-disable-next-line no-unused-vars
    updateMap(newValue) {
      if (!this.isInitialized) {
        // 如果地图尚未初始化，则尝试初始化
        this.initMap();
      } else if (this.mapInstance && typeof this.$refs.map.update === 'function') {
        // 否则更新地图
        this.$refs.map.update(this.center);
      }
    },
  },
  watch: {
    location: {
      handler(newValue) {
        if (newValue.lat !== undefined && newValue.lng !== undefined) {
          this.updateMap(newValue);
        }
      },
      deep: true,
      immediate: true, // 立即执行一次监听器以处理初始值
    },
  },
};
</script>
<!--<script>-->
<!--export default {-->
<!--  name: 'TencentMap',-->
<!--  props: {-->
<!--    location: {-->
<!--      type: Object,-->
<!--      default: () => ({ lat: undefined, lng: undefined }),-->
<!--    },-->
<!--  },-->
<!--  data() {-->
<!--    return {-->
<!--      apiKey: 'K64BZ-G3GKA-5JFKV-CTL5T-S43JF-53FGU',-->
<!--      zoom: 15,-->
<!--      mapInstance: null,-->
<!--    };-->
<!--  },-->
<!--  computed: {-->
<!--    center() {-->
<!--      return {-->
<!--        lat: this.location.lat ?? 39.91799,-->
<!--        lng: this.location.lng ?? 116.397027,-->
<!--      };-->
<!--    },-->
<!--    geometries() {-->
<!--      if (this.center.lat && this.center.lng) {-->
<!--        return [{ styleId: 'marker', position: this.center }];-->
<!--      }-->
<!--      return [];-->
<!--    },-->
<!--    styles() {-->
<!--      return {-->
<!--        marker: {-->
<!--          width: 20,-->
<!--          height: 30,-->
<!--          anchor: { x: 10, y: 30 },-->
<!--          src: 'https://mapapi.qq.com/web/lbs/visualizationApi/demo/img/small.png',-->
<!--        },-->
<!--      };-->
<!--    },-->
<!--    options() {-->
<!--      return {-->
<!--        minZoom: 5,-->
<!--        maxZoom: 15,-->
<!--      };-->
<!--    },-->
<!--  },-->
<!--  methods: {-->
<!--    onClick(e) {-->
<!--      console.log(e);-->
<!--    },-->
<!--    initMap() {-->
<!--      this.$nextTick(() => {-->
<!--        if (this.$refs.map && typeof this.$refs.map.init === 'function') {-->
<!--          this.mapInstance = this.$refs.map.init();-->
<!--        }-->
<!--      });-->
<!--    },-->
<!--    updateMap(newValue) {-->
<!--      console.log('Location updated to:', newValue); // 实际使用 newValue-->
<!--      this.$nextTick(() => {-->
<!--        if (this.mapInstance && typeof this.$refs.map.update === 'function') {-->
<!--          this.$refs.map.update(this.center);-->
<!--        }-->
<!--      });-->
<!--    },-->
<!--  },-->
<!--  watch: {-->
<!--    location: {-->
<!--      handler(newValue) {-->
<!--        this.updateMap(newValue);-->
<!--      },-->
<!--      deep: true,-->
<!--    },-->
<!--  },-->
<!--  mounted() {-->
<!--    this.initMap();-->
<!--  },-->
<!--};-->
<!--</script>-->