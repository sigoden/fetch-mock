const allMocks = (ctx => {
    let keys = ctx.keys();
    let values = keys.map(ctx);
    return keys.reduce((o, _, i) => Object.assign(o, values[i]), {});
})(require.context('./mock/', true, /\.js$/));

export default allMocks;