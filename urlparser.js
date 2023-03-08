/**
 * 
 * @param {String} url 
 * @param {Boolean} decode 
 * @returns 
 */
function parse(url, decodeParm) {
    if (decodeParm == undefined) decodeParm = true;

    const structure = {};
    var part = url;

    [structure.method, part] = part.split("://");
    [structure.domain, ...part] = part.split("/");
    part = part.join('/');
    [structure.path, part] = part.split("?");

    structure.parm = {};
    structure.parms = {};
    if (part != undefined) part.split('&').forEach(e => {
        var [k, v] = e.split('=');

        if (decodeParm) {
            v = decodeURIComponent(v);
        }

        if (structure.parm[k] == undefined) {
            structure.parm[k] = v;
        }
        if (structure.parms[k] == undefined) {
            structure.parms[k] = [];
        }
        structure.parms[k].push(v);
    });


    return structure
}

export function getLocationParm(decodeParm) {
    if (decodeParm == undefined) decodeParm = true;
    return parse(location.href, decodeParm).parm;
}

export function getLocationParms(decodeParm) {
    if (decodeParm == undefined) decodeParm = true;
    return parse(location.href, decodeParm).parms;
}