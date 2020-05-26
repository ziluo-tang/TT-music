<template>
    <transition name="slide">
        <music-list :songs="songs" :title="title" :bg-image="bgImage" :rank="true"></music-list>
    </transition>
</template>
<script>
import {mapGetters} from 'vuex';
import {ERR_OK} from 'api/config';
import {getMusic} from 'api/song'
import {createSong} from '@/assets/js/song.js';
import musicList from 'components/music-list';
import {getSongList} from 'api/rank';

export default {
    data() {
        return {
            songs: []
        }
    },
    computed: {
        title() {
            return this.topList.topTitle;
        },
        bgImage() {
            if(this.songs.length){
                return this.songs[0].image;
            }else{
                return this.topList.picUrl;
            }
        },
        ...mapGetters([
            'topList'
        ])
    },
    created() {
        this._getSongList();
    },
    components: {
        musicList
    },
    methods: {
        _getSongList() {
            if(!this.topList.id) {
                this.$router.push({
                    path: '/rank'
                });
                return;
            }
            getSongList(this.topList.id).then(res => {
                if(res.code === ERR_OK) {
                    this.songs = this._normalizeSongs(res.songlist);
                }
            });
            
        },
        _normalizeSongs(list) {
            let ret = [];
            list.forEach(item => {
                const musicData = item.data;
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