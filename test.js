data = 'this is a string';

msg = Buffer(data);
console.log(msg);
console.log(Buffer.concat([
    Buffer([0x00,0x01]),
    msg
]));
console.log(Buffer([0x00,0x01,data.toString('hex')]));
console.log(Buffer.concat([
    Buffer([0x00,0x01]),
    Buffer.from(data)
]));
console.log(Buffer.concat([
    Buffer([0x00,0x01]),
    Buffer.from(msg)
]));
console.log('----------- New Test ----------- ');
let _txt = [0xA1, 0x80, 0x00];
for (let i=0;i<8;i++){
    _txt.push(0x00);
}
console.log('text length: ' + _txt.length);
console.log(Buffer(_txt));
console.log('buff len: ' + Buffer(_txt).length);
