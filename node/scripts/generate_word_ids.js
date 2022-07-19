// Generatte word id
function randomWordId() {
    var length = 10;
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

// Check parameters
if (process.argv.length != 3) {
    console.log('usage : generate_word_ids <file_path>');
    console.log('Script will replace all INSERT_WORD_ID with a new random ID');
    return;
}

var fs = require('fs')
fs.readFile(process.argv[2], 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }

  // Keep track of generated ids to not use the same twice
  var newRandomIds = [];

  var result = data.replaceAll(/INSERT_WORD_ID/g, () => {
    let remaining_tries = 10;
    while (remaining_tries > 0) {
      remaining_tries--;
      let rand = randomWordId();

      // Retry if ID is already present in file
      if (data.includes(rand))
      {
        console.log(`Id ${rand} is already used in the dictionary.`)
        continue;
      }

      // Retry if ID was generated previously
      if (newRandomIds.includes(rand)){
        console.log(`Id ${rand} was already generated in this run.`)
        continue;
      }

      console.log(`New Id ${rand} was correctly applied.`)
      newRandomIds.push(rand);
      return rand;
    }   
    
    console.log(`Failed to replace marker.`)
    return "INSERT_WORD_ID";
  });

  fs.writeFile(process.argv[2], result, 'utf8', function (err) {
     if (err) return console.log(err);
  });
});




// for (i = 0; i < 30; i++) {
//     console.log(randomWordId())
// }