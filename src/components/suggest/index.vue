<template>
    <scroll class="suggest" ref="suggest"
        :data="result" 
        :pullup="true"
        :beforeScroll="true"
        @scrollToEnd="_searchMore"
        @beforeScroll="listScroll">
        <ul class="suggest-list">
            <li @click="selectItem(item)" v-for="(item, index) in result" :key="index" class="suggest-item">
                <div class="icon">
                    <i :class="getIconCls(item)"></i>
                </div>
                <div class="name">
                    <p class="text" v-html="getDisplayName(item)"></p>
                </div>
            </li>
            <loading v-show="hasMore" title=""></loading>
        </ul>
    </scroll>
</template>

<script>
import Scroll from 'base/scroll';
import Loading from 'base/loading';
import Singer from '@/assets/js/singer';

import {mapMutations, mapActions} from 'vuex';
import {search} from 'api/search';
import {ERR_OK} from 'api/config';
import {createSong} from '@/assets/js/song';
import {getMusic} from 'api/song';

const TYPE_SINGER = 'singer', PERPAGE = 20;
export default {
    props: {
        query: {
            type: String,
            default: ''
        },
        showSinger: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            page: 1,
            result: [],
            hasMore: true
        }
    },
    methods: {
        _search() {
            this.hasMore = true;
            this.page = 1;
            this.$refs.suggest.scrollTo(0, 0);
            search(this.$props.query, this.page, this.$props.showSinger, PERPAGE).then(res => {
                if(res.code === ERR_OK) {
                    this.result = this._genResult(res.data);
                    this._checkMore(res.data);
                }
            });
        },
        _searchMore() {
            if(!this.hasMore) return;
            this.page++;
            search(this.$props.query, this.page, false, PERPAGE).then(res => {
                if(res.code === ERR_OK) {
                    this.result = this.result.concat(this._genResult(res.data));
                    this._checkMore(res.data);
                }
            });
        },
        _checkMore(data) {
            const song = data.song;
            if(!song.list.length || (song.curnum + song.curpage * PERPAGE) >= song.totalnum){
                this.hasMore = false;
            }
        },
        listScroll() {
            this.$emit('listScroll');
        },
        _genResult(data) {
            let ret = [];
            if(data.zhida && data.zhida.singerid) {
                ret.push({...data.zhida, ...{type: TYPE_SINGER}});
            }
            if(data.song) {
                ret = ret.concat(this._normalizeSongs(data.song.list));
            }
            return ret;
        },
        _normalizeSongs(list) {
            let ret = [];
            list.forEach(musicData => {
                if(musicData.songid && musicData.albummid){
                    ret.push(createSong(musicData));
                }
            });
            return ret;
        },
        getIconCls(item) {
            if(item.type===TYPE_SINGER) {
                return 'icon-mine';
            } else {
                return 'icon-music';
            }
        },
        getDisplayName(item) {
            if(item.type===TYPE_SINGER) {
                return item.singername;
            } else {
                return `${item.name} - ${item.singer}`;
            }
        },
        refresh() {
            this.$refs.suggest.refresh();
        },
        selectItem(item) {
            if(item.type===TYPE_SINGER){
                const singer = new Singer({
                    id: item.singermid,
                    name: item.singername
                });
                this.$router.push({
                    path: `/search/${singer.id}`
                });
                this.setSinger(singer);
            }else{
                getMusic(item.mid).then(res => {
                    if(res.code === ERR_OK) {
                        const svkey = res.data.items;
                        const songVkey = svkey[0].vkey;
                        let vkeyIndex = item.url.indexOf('vkey=');
                        let url = item.url.slice(0, vkeyIndex+5) + songVkey + item.url.slice(vkeyIndex+5);
                        item.url = url;
                        this.insertSong(item);
                    }    
                });
            }
        },
        ...mapMutations({
            setSinger: 'SET_SINGER'
        }),
        ...mapActions([
            'insertSong'
        ])
    },
    watch: {
        query() {
            this._search();
        }
    },
    components: {
        Scroll,
        Loading
    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/_variable.scss';
@import "@/assets/css/_mixin.scss";
.suggest {
  height: 100%;
  overflow: hidden;
  .suggest-list {
    padding: 0 30px;
    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
    }
    .icon {
      flex: 0 0 30px;
      width: 30px;
      [class^="icon-"] {
        font-size: 14px;
        color: $color-text-d;
      }
    }
    .name {
      flex: 1;
      font-size: $font-size-medium;
      color: $color-text-d;
      overflow: hidden;
      .text {
        @include no-wrap();
      }
    }
  }
  .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
