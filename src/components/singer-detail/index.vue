<template>
    <transition name="slide">
        <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
    </transition>
</template>
<script>
import {mapGetters} from 'vuex';
import {getSingerDetail} from 'api/singer';
import {ERR_OK} from 'api/config';
import {getMusic} from 'api/song'
import {createSong} from '@/assets/js/song.js';
import musicList from 'components/music-list';
export default {
    data() {
        return {
            songs: []
        }
    },
    computed: {
        title() {
            return this.singer.name;
        },
        bgImage() {
            return this.singer.avatar;
        },
        ...mapGetters([
            'singer'
        ])
    },
    created() {
        this._getDetail();
    },
    components: {
        musicList
    },
    methods: {
        _getDetail() {
            if(!this.singer.id) {
                this.$router.push({
                    path: '/singer'
                });
                return;
            }
            getSingerDetail(this.singer.id).then(res => {
                if(res.code === ERR_OK) {
                    this.songs = this._normalizeSongs(res.data.list);
                }
            });
        },
        _normalizeSongs(list) {
            let ret = [];
            list.forEach(element => {
                let {musicData} = element;
                if(musicData.songid && musicData.albummid){
                    getMusic(musicData.songmid).then(res => {
                        if(res.code === ERR_OK) {
                            const svkey = res.data.items;
                            const songVkey = svkey[0].vkey;
                            ret.push(createSong(musicData, songVkey));
                        }
                    });
                }
            });
            return ret;
        }
    }
}
</script>
<style lang="scss" scoped>
    .slide-enter-active, .slide-leave-active{
        transition: all 0.3s;
    }
    .slide-enter, .slide-leave-to{
        transform: translate3d(100%, 0, 0);
    }
</style>
