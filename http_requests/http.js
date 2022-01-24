module.exports.create_gang = function(client, req){
        client.channels.fetch('909779420619866132').then(channel => {
            channel.send('It worked again!');
        })
      }
