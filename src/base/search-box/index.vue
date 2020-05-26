<template>
    <div class="search-box">
        <i class="icon-search"></i>
        <input type="text" class="box" ref="query"
            v-model="query"
            :placeholder="placeholder">
        <i v-show="query" @click="clear" class="icon-dismiss"></i>
    </div>
</template>

<script>
import {debounce} from '@/assets/js/util';

export default {
    props: {
        placeholder: {
            type: String,
            default: '搜索歌曲 / 歌手'
        }
    },
    data() {
        return {
            query: ''
        }
    },
    created() {
        //节流函数debounce
        this.$watch('query', debounce((newQuery) => {
            this.$emit('query', newQuery);
        }, 200));
    },
    methods: {
        setQuery(query) {
            this.query = query;
        },
        clear() {
            this.query = '';
        },
        blur() {
            this.$refs.query.blur();
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/_variable.scss';
.search-box {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 6px;
  height: 40px;
  background: $color-highlight-background;
  border-radius: 6px;
  .icon-search {
    font-size: 24px;
    color: $color-background;
  }
  .box {
    flex: 1;
    margin: 0 5px;
    line-height: 25px;
    padding: 0 5px;
    background: $color-highlight-background;
    color: $color-text;
    font-size: $font-size-medium;
    &::placeholder {
      color: $color-text-d;
    }
  }
  .icon-dismiss {
    font-size: 16px;
    color: $color-background;
  }
}
</style>
