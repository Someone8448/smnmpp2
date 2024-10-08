module.exports.run = ip6 => {
    var parseIp6 =(ip6str) => {
        var str = ip6str.toString();

        // Initialize
        var ar = new Array();
        for (var i = 0; i < 8; i++) ar[i] = 0;

        // Check for trivial IPs
        if (str == '::') return ar;
        
        // Parse
        var sar = str.split(':');
        var slen = sar.length;
        if (slen > 8) slen = 8;
        var j = 0;
        var i = 0
        for (i = 0; i < slen; i++) {
            // This is a "::", switch to end-run mode
            if (i && sar[i] == '') {
                var j = 9 - slen + i;
                continue;
            }
            ar[j] = parseInt(`0x0${sar[i]}`);
            j++;
        }

        return ar;
    }

    var ip6parsed = parseIp6(ip6);
    var ip4 = `${ip6parsed[6] >> 8}.${ip6parsed[6] & 0xff}.${ip6parsed[7] >> 8}.${ip6parsed[7] & 0xff}`;
    return ip4;
}
module.exports.name = "ip"
