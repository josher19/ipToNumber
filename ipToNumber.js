/**
 * Converts IPv4 addresses to/from a number
 */

var new_ip=3661254138
var ip = "218.58.77.250"
/*
var digits = ip.split(".").map(function(a) { return +a })
var t=digits[3] + (digits[2]<<8) + (digits[1]<<16) + digits[0]*Math.pow(2,24)
new_ip === t

var binary = digits.map(function(a) { return pad0(a.toString(2)) }).join('')
binary === new_ip.toString(2)
*/

/** Put zeros at the start of string str until length reaches number len */
function pad0(str,len,zero) { zero=zero||'0';if (null==len) len=8; while (str.length < len) str = zero + str; return str; }
/** Strip zeros off of the start of string str */
function trim0(str,zero) { zero=zero || '0'; while(str.length>1 && str.charAt(0) == zero) str = str.substring(1); return str; }
/** convert binary (base 2) string str to a number (base 10) */
function unBinary(str) { return parseInt(str,2); }
/** convert hex (base 16) to a number (base 10) */
function unhex(str) { return parseInt(str, 16); }

module.exports = {
	/** 16909060 --> 0x01020304 --> '1.2.3.4'. Note: Opposite of getNumber */
	fromNumber : function(n) {
		// var digits = pad0(n.toString(2),32).replace(/(\d{8})/g, "$1,").split(",");
		// digits.pop();
		// var binary_digits = pad0(n.toString(2),32).match(/(\d{8})/g);
		// return binary_digits.map(unBinary).join(".");
		return pad0((+n).toString(16)).match(/([a-f0-9]{2})/ig).map(unhex).join(".");
	},
	/** "1.2.3.4" --> [1,2,3,4] */
	getDigits : function(ip) { 
		if (typeof ip === "number") ip = this.fromNumber(ip);
		return (ip.split ? ip.split(".") : ip).map(function(a) { return +a }) 
	},
	/** '1.2.3.4' or [1,2,3,4] --> 0x01020304 --> 16909060 */
	getNumber : function(digits) { 
		if (typeof digits === "string") digits = this.getDigits(digits); 
		return (+digits[3]) + (digits[2]<<8) + (digits[1]<<16) + digits[0]*Math.pow(2,24); 
	}, 
	/** "1.2.3.4" or [1,2,3,4] or 0x01020304 or 16909060 --> "1000000100000001100000100" */
	getBinary : function(ip) {
		if (typeof ip === "number") return ip.toString(2);
		return trim0(this.getDigits(ip).map(function(a) { return pad0(a.toString(2)) }).join(''));
	}
}
