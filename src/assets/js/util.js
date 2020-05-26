function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max-min+1) + min);
}
export function shuffle(arr) {
    let _arr = arr.slice();
    for(let i=0;i<_arr.length;i++){
        let j = getRandomInt(0, i);
        let t = _arr[i];
        _arr[i] = _arr[j];
        _arr[j] = t;
    }
    return _arr;
}

//防抖函数
export function debounce (fn, delay) {
    let timer = null;
    return function () {
      let context = this;
      let arg = arguments;
      timer && clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(context, arg)
      }, delay);
    }
  }