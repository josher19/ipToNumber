ipToNumber
==========

Converts IPv4 addresses to/from a number

Example usage:
	
	ip2n = require('ipToNumber');
	
    var num = ip2n.getBinary("1.2.3.4"); // 0x1020304
	var ipStr = ip2n.getNumber(0x1020304); // "1.2.3.4"

See also: 

* http://getip.js.sohu.com/
