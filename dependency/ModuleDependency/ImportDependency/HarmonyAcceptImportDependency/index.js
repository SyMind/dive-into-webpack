import "./a";

if (module.hot) {
    module.hot.accept('./a', function () {
        console.log('Accepting the updated a module!');
    });
}
