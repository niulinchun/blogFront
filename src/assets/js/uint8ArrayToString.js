const UTF8EncodeDecode = {
  _utf8_encode: function (e) {
    // 把全局的rn替换成n
    e = e.replace(/rn/g, "n");
    var t = "";
    for (var n = 0; n < e.length; n++) {
      // charCodeAt() 方法可返回指定位置的字符的 Unicode 编码，返回值是 0 - 65535 之间的整数，表示给定索引处的 UTF-16 代码单元。
      var r = e.charCodeAt(n);
      if (r < 128) {
        t += String.fromCharCode(r)
      } else if (r > 127 && r < 2048) {
        t += String.fromCharCode(r >> 6 | 192);
        t += String.fromCharCode(r & 63 | 128)
      } else {
        t += String.fromCharCode(r >> 12 | 224);
        t += String.fromCharCode(r >> 6 & 63 | 128);
        t += String.fromCharCode(r & 63 | 128)
      }
    }
    return t;
  },
  _utf8_decode: function (e) {
    var t = "";
    var n = 0;
    // var r = c1 = c2 = 0;
    let r = 0, c1 = 0, c2 = 0, c3 = 0;
    while (n < e.length) {
      r = e.charCodeAt(n);
      if (r < 128) {
        t += String.fromCharCode(r);
        n++
      } else if (r > 191 && r < 224) {
        c2 = e.charCodeAt(n + 1);
        t += String.fromCharCode((r & 31) << 6 | c2 & 63);
        n += 2
      } else {
        c2 = e.charCodeAt(n + 1);
        c3 = e.charCodeAt(n + 2);
        t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
        n += 3
      }
    }
    return t;
  }
}

const Base32 = {
  _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",
  encode: function (str) {
    var ans = "";
    let char=[0,0,0,0,0], code=[0,0,0,0,0,0,0,0];
    let index = 0;
    // 先将字符转成UTF8编码的字符
    str = UTF8EncodeDecode._utf8_encode(str);
    // Base32 是每5个bit编码成一个字符，一个char8个bit，那么每次需要拿5个char共40(5*8=40)个bit，然后拆分成8个5bit
    // |xxxxxxxx|xxxxxxxx|xxxxxxxx|xxxxxxxx|xxxxxxxx|
    // |xxxxx|xxxxx|xxxxx|xxxxx|xxxxx|xxxxx|xxxxx|xxxxx|
    while (index < str.length)
    {
      for(let i=0;i<5;i++)char[i]=str.charCodeAt(index++);
      code[0]=char[0]>>3;
      code[1]=(char[0]&7)<<2|(char[1]>>6);
      code[2]=(char[1]>>1)&31;
      code[3]=((char[1]&1)<<4)|(char[2]>>4);
      code[4]=((char[2]&15)<<1)|(char[3]>>7);
      code[5]=(char[3]>>2)&31;
      code[6]=((char[3]&3)<<3)|(char[4]>>5);
      code[7]=char[4]&31;

      for(let i=1;i<5;i++)
        if(isNaN(char[i]))
          for(let j=parseInt(i*8/5)+1;j<8;j++)code[j]=32;
      for(let i=0;i<8;i++)ans = ans+this._keyStr.charAt(code[i]);
    }
    return ans;
  },
  decode: function (str) {
    // console.log(str);
    let ans = "";
    let char=[0,0,0,0,0], code=[0,0,0,0,0,0,0,0];
    let index = 0;
    // 去除掉不符合要求的字符
    str = str.replace(/[^A-Z2-7=]/g, "");
    while (index < str.length) {
      for(let i=0;i<8;i++)code[i]=this._keyStr.indexOf(str.charAt(index++));

      char[0] = (code[0]<<3)|(code[1]>>2);
      char[1] = ((code[1]&3)<<6)|(code[2]<<1)|(code[3]>>4);
      char[2] = ((code[3]&15)<<4)|(code[4]>>1);
      char[3] = ((code[4]&1)<<7)|(code[5]<<2)|(code[6]>>3);
      char[4] = ((code[6]&7)<<5)|code[7];

      ans = ans + String.fromCharCode(char[0]);
      if (code[2] !== 32)ans = ans + String.fromCharCode(char[1]);
      if (code[4] !== 32)ans = ans + String.fromCharCode(char[2]);
      if (code[5] !== 32)ans = ans + String.fromCharCode(char[3]);
      if (code[7] !== 32)ans = ans + String.fromCharCode(char[4]);
    }
    ans = UTF8EncodeDecode._utf8_decode(ans);
    return ans;
  }
}

module.exports = {
  Base32
}
