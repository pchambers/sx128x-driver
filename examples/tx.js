var SX128x = require('../lib/sx128x');

//Create new radio instance with default options
var radio = new SX128x({});
async function send(){
        let count =0;

        try{
            await radio.open();
        }
        catch(err){
            console.log(err);
        }
        while(true) {
            //send a message every second
            try {
                await radio.write(new Buffer('hello ' + count++));
                console.log('successfully sent');;
            } catch(err){
                console.log(err);
            }
            await util.promisify(setTimeout)(1000);
        }
}

send();

process.on('SIGINT', async function(){
    //close the _device
    try{
        await radio.close();
    }catch(err){
        console.log('close failure: ' + err);
        process.exit();
    }

    console.log('success');
    process.exit();
})
