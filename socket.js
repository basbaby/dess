module.exports = (io) => {
    io.on('connection', function (socket) {
        console.log('socket connected');
        socket.emit('news', { hello: 'world' });
        socket.on('my other event', function (data) {
            console.log(data);
        });
    });
}
