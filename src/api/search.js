import jsonp from '@/assets/js/jsonp'
import axios from 'axios'
import {commonParams, options} from './config';

export function getHotKey() {
    const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg';
    const data = Object.assign({}, commonParams, {
        platform: 'h5',
        needNewCode: 1,
        g_tk: 5381,
        format: 'json'
    });
    return jsonp(url, data, options);
}

export function search(query, page, zhida, perpage) {
    const url = '/api/search';
    const data = Object.assign({}, commonParams, {
        w: query,
        p: page,
        catZhida: zhida ? 1 : 0,
        zhidaqu: 1,
        platform: 'h5',
        needNewCode: 1,
        g_tk: 5381,
        t: 0,
        flag: 1,
        ie: 'utf-8',
        sem: 1,
        aggr: 0,
        perpage,
        n: perpage,
        remoteplace: 'txt.mqq.all',
        uin: 0,
        format: 'json'
    });
    return axios.get(url, {
        params: data
    }).then(res => res.data);
}